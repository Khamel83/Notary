import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find appointment
    const appointment = await prisma.appointment.findUnique({
      where: { cancellationToken: token },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 404 }
      );
    }

    // Check if already cancelled
    if (appointment.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'This appointment has already been cancelled' },
        { status: 400 }
      );
    }

    // Check if appointment is in the past
    const appointmentDate = new Date(appointment.appointmentDate);
    if (appointmentDate < new Date()) {
      return NextResponse.json(
        { error: 'Cannot cancel past appointments' },
        { status: 400 }
      );
    }

    // Calculate refund amount based on cancellation policy
    const hoursUntil = (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);
    let refundAmount = 0;
    let refundReason = '';

    if (hoursUntil >= 24) {
      // Full refund for 24+ hours notice
      refundAmount = appointment.totalAmount;
      refundReason = 'Full refund - cancelled 24+ hours in advance';
    } else if (hoursUntil >= 12) {
      // 50% refund for 12-24 hours notice
      refundAmount = appointment.totalAmount * 0.5;
      refundReason = '50% refund - cancelled 12-24 hours in advance';
    } else {
      // No refund for less than 12 hours notice
      refundAmount = 0;
      refundReason = 'No refund - cancelled less than 12 hours in advance';
    }

    // Process refund if applicable
    if (refundAmount > 0 && appointment.paymentIntentId) {
      try {
        const refund = await stripe.refunds.create({
          payment_intent: appointment.paymentIntentId,
          amount: Math.round(refundAmount * 100), // Convert to cents
          reason: 'requested_by_customer',
          metadata: {
            appointment_id: appointment.id,
            refund_reason: refundReason,
          },
        });

        console.log('Refund created:', refund.id);

        // Update appointment with refund info
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: {
            status: 'CANCELLED',
            paymentStatus: 'REFUNDED',
            specialInstructions: `${appointment.specialInstructions || ''}\n\nCancellation: ${refundReason}\nRefund: $${refundAmount.toFixed(2)}\nRefund ID: ${refund.id}`,
          },
        });
      } catch (stripeError: any) {
        console.error('Stripe refund error:', stripeError);

        // Still cancel the appointment even if refund fails
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: {
            status: 'CANCELLED',
            specialInstructions: `${appointment.specialInstructions || ''}\n\nCancellation: ${refundReason}\nRefund pending - contact support`,
          },
        });

        return NextResponse.json(
          { error: 'Appointment cancelled but refund failed. Please contact support.' },
          { status: 500 }
        );
      }
    } else {
      // No refund, just cancel
      await prisma.appointment.update({
        where: { id: appointment.id },
        data: {
          status: 'CANCELLED',
          specialInstructions: `${appointment.specialInstructions || ''}\n\nCancellation: ${refundReason}`,
        },
      });
    }

    // TODO: Send cancellation confirmation email
    console.log('Appointment cancelled:', {
      id: appointment.id,
      refundAmount,
      refundReason,
    });

    return NextResponse.json({
      success: true,
      refundAmount,
      refundReason,
    });
  } catch (error: any) {
    console.error('Cancel appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
}
