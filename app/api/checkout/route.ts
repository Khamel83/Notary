import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, appointmentDetails } = body;

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payment system is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
        { status: 503 }
      );
    }

    // Validate amount
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!appointmentDetails.email || !appointmentDetails.date || !appointmentDetails.address) {
      return NextResponse.json(
        { error: 'Missing required appointment details' },
        { status: 400 }
      );
    }

    // Convert to cents
    const amountInCents = Math.round(amount * 100);

    // Format appointment date for Stripe metadata
    const appointmentDateTime = `${appointmentDetails.date} ${appointmentDetails.time}`;

    // Get Stripe instance
    const stripe = getStripe();

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
              description: `${appointmentDetails.numberOfSignatures} signature(s) - ${appointmentDetails.date} at ${appointmentDetails.time}`,
              images: [], // Add your logo URL here when you have one
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
        // Appointment details
        appointment_date: appointmentDateTime,
        address: `${appointmentDetails.address}, ${appointmentDetails.city}, ${appointmentDetails.zip}`,
        zip: appointmentDetails.zip || '',
        signatures: appointmentDetails.numberOfSignatures.toString(),
        urgency: appointmentDetails.urgency || 'standard',

        // Customer details
        full_name: appointmentDetails.fullName || '',
        phone: appointmentDetails.phone || '',

        // Special instructions
        special_instructions: appointmentDetails.specialInstructions || '',

        // For accounting and tracking
        booking_source: 'web',
        created_at: new Date().toISOString(),
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
