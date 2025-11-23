import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

const PaymentIntentSchema = z.object({
  amount: z.number().min(100), // Minimum $1.00
  paymentMethod: z.enum(['card', 'afterpay_clearpay']),
  appointmentDetails: z.object({
    date: z.string(),
    address: z.string(),
    numberOfSignatures: z.number(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = PaymentIntentSchema.parse(body);

    // Convert dollars to cents
    const amountInCents = Math.round(validated.amount * 100);

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: amountInCents,
      currency: 'usd',
      payment_method_types: validated.paymentMethod === 'afterpay_clearpay'
        ? ['afterpay_clearpay']
        : ['card'],
      metadata: {
        service: 'mobile_notary',
        appointment_date: validated.appointmentDetails.date,
        signatures: validated.appointmentDetails.numberOfSignatures.toString(),
      },
    };

    // Afterpay requires shipping address (even for services)
    if (validated.paymentMethod === 'afterpay_clearpay') {
      paymentIntentParams.shipping = {
        name: 'Mobile Notary Service',
        address: {
          line1: validated.appointmentDetails.address,
          city: 'Los Angeles',
          state: 'CA',
          country: 'US',
          postal_code: '90027',
        },
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
