'use client';

import { PricingBreakdown } from '@/lib/pricing';

interface PriceBreakdownProps {
  pricing: PricingBreakdown | null;
  isCalculating?: boolean;
  className?: string;
}

export default function PriceBreakdown({ pricing, isCalculating, className = '' }: PriceBreakdownProps) {
  if (isCalculating) {
    return (
      <div className={`card animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!pricing) {
    return (
      <div className={`card bg-gray-50 border-2 border-dashed border-gray-300 ${className}`}>
        <p className="text-center text-gray-500">
          Enter your details to see pricing
        </p>
      </div>
    );
  }

  return (
    <div className={`card bg-gradient-to-br from-navy-900 to-navy-700 text-white ${className}`}>
      <h3 className="text-2xl font-bold mb-6">Your Price</h3>

      <div className="price-breakdown space-y-3 mb-6">
        {/* Base Fee */}
        <div className="price-item border-white/20">
          <span className="text-gray-200">Base Fee</span>
          <span className="font-semibold text-lg">${pricing.baseFee.toFixed(2)}</span>
        </div>

        {/* Travel Fee */}
        <div className="price-item border-white/20">
          <span className="text-gray-200">Travel Fee</span>
          <span className="font-semibold text-lg">${pricing.travelFee.toFixed(2)}</span>
        </div>

        {/* Distance Surcharge */}
        {pricing.distanceSurcharge > 0 && (
          <div className="price-item border-white/20 animate-slide-down">
            <span className="text-gold-300">+ Distance</span>
            <span className="font-semibold text-lg text-gold-300">
              +${pricing.distanceSurcharge.toFixed(2)}
            </span>
          </div>
        )}

        {/* After Hours */}
        {pricing.afterHoursSurcharge > 0 && (
          <div className="price-item border-white/20 animate-slide-down">
            <span className="text-warning-300">+ After Hours</span>
            <span className="font-semibold text-lg text-warning-300">
              +${pricing.afterHoursSurcharge.toFixed(2)}
            </span>
          </div>
        )}

        {/* Weekend */}
        {pricing.weekendSurcharge > 0 && (
          <div className="price-item border-white/20 animate-slide-down">
            <span className="text-warning-300">+ Weekend</span>
            <span className="font-semibold text-lg text-warning-300">
              +${pricing.weekendSurcharge.toFixed(2)}
            </span>
          </div>
        )}

        {/* Holiday */}
        {pricing.holidaySurcharge > 0 && (
          <div className="price-item border-white/20 animate-slide-down">
            <span className="text-danger-300">+ Holiday</span>
            <span className="font-semibold text-lg text-danger-300">
              +${pricing.holidaySurcharge.toFixed(2)}
            </span>
          </div>
        )}

        {/* Urgency */}
        {pricing.urgencySurcharge > 0 && (
          <div className="price-item border-white/20 animate-slide-down">
            <span className="text-warning-300">+ Rush Service</span>
            <span className="font-semibold text-lg text-warning-300">
              +${pricing.urgencySurcharge.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="pt-6 border-t-2 border-white/40">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-sm text-gray-200 mb-1">Total Price</p>
            <p className="price-lg text-gold-400">
              ${pricing.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Afterpay Option */}
        {pricing.total >= 1 && pricing.total <= 4000 && (
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm mb-2">Or pay in 4 installments with Afterpay</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gold-400">
                ${(pricing.total / 4).toFixed(2)}
              </p>
              <span className="text-sm text-gray-300">/ payment</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">Interest-free</p>
          </div>
        )}
      </div>

      {/* Trust Badge */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secure payment via Stripe</span>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          No hidden fees • Cancel anytime
        </p>
      </div>
    </div>
  );
}
