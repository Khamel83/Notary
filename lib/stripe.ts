import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export const STRIPE_CONFIG = {
  currency: 'usd',
  paymentMethods: {
    card: {
      enabled: true,
      name: 'Credit/Debit Card',
    },
    afterpay: {
      enabled: true,
      name: 'Afterpay',
      minAmount: 1, // $1 minimum
      maxAmount: 4000, // $4000 maximum for Afterpay
    },
  },
};

export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}
