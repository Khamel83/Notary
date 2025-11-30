import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { withApiHandler, ValidationError, ApiError } from '@/lib/api-wrapper';

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new ApiError('Payment system is not configured. Please add STRIPE_SECRET_KEY to environment variables.', 503);
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
  });
}

interface AppointmentDetails {
  email: string;
  date: string;
  time: string;
  address: string;
  city: string;
  zip?: string;
  numberOfSignatures: number;
  urgency?: string;
  fullName?: string;
  phone?: string;
  specialInstructions?: string;
}

interface CheckoutRequest {
  amount: number;
  appointmentDetails: AppointmentDetails;
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const body = await request.json();
    const { amount, appointmentDetails }: CheckoutRequest = body;

    // Validate amount
    if (!amount || amount < 1) {
      throw new ValidationError('Invalid amount. Amount must be at least $1.', 'amount');
    }

    // Validate required fields
    if (!appointmentDetails.email) {
      throw new ValidationError('Email is required', 'appointmentDetails.email');
    }
    if (!appointmentDetails.date) {
      throw new ValidationError('Appointment date is required', 'appointmentDetails.date');
    }
    if (!appointmentDetails.address) {
      throw new ValidationError('Service address is required', 'appointmentDetails.address');
    }
    if (!appointmentDetails.city) {
      throw new ValidationError('City is required', 'appointmentDetails.city');
    }
    if (!appointmentDetails.numberOfSignatures || appointmentDetails.numberOfSignatures < 1) {
      throw new ValidationError('Number of signatures must be at least 1', 'appointmentDetails.numberOfSignatures');
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
      success_url: `${process.env.NEXTAUTH_URL || 'https://notary.vercel.app'}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'https://notary.vercel.app'}/book/confirm`,
      customer_email: appointmentDetails.email,
      metadata: {
        // Appointment details
        appointment_date: appointmentDateTime,
        address: `${appointmentDetails.address}, ${appointmentDetails.city}, ${appointmentDetails.zip || ''}`,
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
        vercel_region: process.env.VERCEL_REGION || 'unknown',
      },
      // Afterpay requires shipping address (even for services)
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      billing_address_collection: 'required',
    });

    return {
      sessionId: session.id,
      url: session.url,
      paymentStatus: session.payment_status,
    };
  }, request);
}
