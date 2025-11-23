import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { sendBookingConfirmation } from '@/lib/email';
import { sendBookingConfirmationSMS } from '@/lib/sms';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('Payment successful:', {
          sessionId: session.id,
          customerEmail: session.customer_email,
          amountTotal: session.amount_total,
          metadata: session.metadata,
        });

        try {
          // Get or create user
          let user = await prisma.user.findUnique({
            where: { email: session.customer_email || '' },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: session.customer_email || '',
                name: session.metadata?.full_name || 'Guest',
                phone: session.metadata?.phone || null,
                role: 'CLIENT',
              },
            });
          }

          // Parse appointment data from metadata
          const metadata = session.metadata || {};
          const appointmentDate = new Date(metadata.appointment_date || '');
          const numberOfSignatures = parseInt(metadata.signatures || '1');
          const totalAmount = (session.amount_total || 0) / 100; // Convert cents to dollars

          // Calculate pricing breakdown (simplified for storage)
          const baseFee = 15 * numberOfSignatures; // CA max $15/signature
          const travelFee = 75; // Base travel fee
          const surcharges = totalAmount - baseFee - travelFee;

          // Create appointment
          const appointment = await prisma.appointment.create({
            data: {
              userId: user.id,
              appointmentDate,
              duration: 30,
              status: 'CONFIRMED',
              serviceAddress: metadata.address || '',
              serviceCity: 'Los Angeles',
              serviceZip: metadata.zip || '',
              serviceType: 'MOBILE_SERVICE',
              numberOfSignatures,
              documentTypes: [],
              specialInstructions: metadata.special_instructions || null,
              baseFee,
              travelFee,
              surcharges: {
                total: surcharges,
              },
              totalAmount,
              paymentStatus: 'COMPLETED',
              paymentIntentId: session.payment_intent as string,
              paymentMethod: session.payment_method_types?.[0] || 'card',
            },
          });

          console.log('Appointment created:', appointment.id);

          // Format date and time for notifications
          const formattedDate = appointmentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          // Send confirmation email
          await sendBookingConfirmation({
            to: session.customer_email || '',
            name: metadata.full_name || 'Customer',
            appointmentId: appointment.id,
            appointmentDate: formattedDate,
            appointmentTime: formattedTime,
            address: metadata.address || '',
            numberOfSignatures,
            totalAmount,
            receiptUrl: `${process.env.NEXTAUTH_URL}/receipts/${appointment.id}`,
          });

          // Send SMS notification
          if (metadata.phone) {
            await sendBookingConfirmationSMS({
              to: metadata.phone,
              name: metadata.full_name || 'Customer',
              appointmentDate: formattedDate,
              appointmentTime: formattedTime,
              confirmationCode: appointment.id.slice(0, 8).toUpperCase(),
            });
          }
        } catch (dbError: any) {
          console.error('Database error:', dbError);
          // Don't fail the webhook if DB fails - we still got paid
          // Log to error tracking service in production
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);

        // Update appointment payment status if needed
        try {
          await prisma.appointment.updateMany({
            where: { paymentIntentId: paymentIntent.id },
            data: { paymentStatus: 'COMPLETED' },
          });
        } catch (dbError: any) {
          console.error('Failed to update payment status:', dbError);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('PaymentIntent failed:', paymentIntent.id);

        // Update appointment to failed status
        try {
          await prisma.appointment.updateMany({
            where: { paymentIntentId: paymentIntent.id },
            data: {
              paymentStatus: 'FAILED',
              status: 'CANCELLED',
            },
          });
        } catch (dbError: any) {
          console.error('Failed to update failed payment:', dbError);
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('Charge refunded:', charge.id);

        // Update appointment to refunded status
        try {
          await prisma.appointment.updateMany({
            where: { paymentIntentId: charge.payment_intent as string },
            data: {
              paymentStatus: 'REFUNDED',
              status: 'CANCELLED',
            },
          });
        } catch (dbError: any) {
          console.error('Failed to update refund:', dbError);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
