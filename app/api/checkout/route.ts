import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, appointmentDetails } = body;

    // Validate amount
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Convert to cents
    const amountInCents = Math.round(amount * 100);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'afterpay_clearpay'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Mobile Notary Service',
              description: `${appointmentDetails.numberOfSignatures} signature(s) - ${appointmentDetails.date}`,
              images: [], // Add your logo URL here
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/book/confirm`,
      customer_email: appointmentDetails.email,
      metadata: {
        appointment_date: appointmentDetails.date,
        address: appointmentDetails.address,
        signatures: appointmentDetails.numberOfSignatures.toString(),
        full_name: appointmentDetails.fullName || '',
        phone: appointmentDetails.phone || '',
      },
      // Afterpay requires shipping address (even for services)
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      billing_address_collection: 'required',
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Checkout session error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create checkout session',
      },
      { status: 500 }
    );
  }
}
