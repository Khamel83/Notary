'use client';

import { useState } from 'react';
import { calculatePricing, type PricingInput } from '@/lib/pricing';

export default function PricingPage() {
  const [formData, setFormData] = useState({
    numberOfSignatures: 1,
    distanceInMiles: 10,
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '14:00',
    urgency: 'standard' as const,
  });

  const dateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);

  const pricing = calculatePricing({
    numberOfSignatures: formData.numberOfSignatures,
    distanceInMiles: formData.distanceInMiles,
    appointmentDate: dateTime,
    urgency: formData.urgency,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-notary-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Pricing Calculator</h1>
          <p className="text-xl text-gray-200">
            Transparent pricing with no hidden fees
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator */}
          <div className="card">
            <h2 className="text-2xl font-bold text-notary-navy mb-6">
              Calculate Your Price
            </h2>

            <div className="space-y-6">
              <div>
                <label className="label">Number of Signatures</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="input-field"
                  value={formData.numberOfSignatures}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfSignatures: parseInt(e.target.value) || 1,
                    })
                  }
                />
                <p className="text-sm text-gray-500 mt-1">
                  $15 per signature (California maximum)
                </p>
              </div>

              <div>
                <label className="label">
                  Distance from Silver Lake (miles)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  className="input-field"
                  value={formData.distanceInMiles}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      distanceInMiles: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-sm text-gray-500 mt-1">
                  First 10 miles free, then $0.50/mile
                </p>
              </div>

              <div>
                <label className="label">Appointment Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.appointmentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentDate: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="label">Appointment Time</label>
                <input
                  type="time"
                  className="input-field"
                  value={formData.appointmentTime}
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentTime: e.target.value })
                  }
                />
                <p className="text-sm text-gray-500 mt-1">
                  After hours (6PM-9AM): +$50
                </p>
              </div>

              <div>
                <label className="label">Service Speed</label>
                <select
                  className="input-field"
                  value={formData.urgency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      urgency: e.target.value as any,
                    })
                  }
                >
                  <option value="standard">Standard (Next Available)</option>
                  <option value="same-day">Same Day (+$50)</option>
                  <option value="two-hour">Within 2 Hours (+$100)</option>
                  <option value="emergency">Emergency/ASAP (+$150)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div>
            <div className="card bg-gradient-to-br from-notary-navy to-primary-700 text-white sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Price Breakdown</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between pb-2 border-b border-white/20">
                  <span>Base Fee ({formData.numberOfSignatures}x signatures)</span>
                  <span className="font-semibold">${pricing.baseFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between pb-2 border-b border-white/20">
                  <span>Travel Fee</span>
                  <span className="font-semibold">${pricing.travelFee.toFixed(2)}</span>
                </div>

                {pricing.distanceSurcharge > 0 && (
                  <div className="flex justify-between pb-2 border-b border-white/20">
                    <span>Distance Surcharge</span>
                    <span className="font-semibold">
                      ${pricing.distanceSurcharge.toFixed(2)}
                    </span>
                  </div>
                )}

                {pricing.afterHoursSurcharge > 0 && (
                  <div className="flex justify-between pb-2 border-b border-white/20">
                    <span>After Hours</span>
                    <span className="font-semibold">
                      ${pricing.afterHoursSurcharge.toFixed(2)}
                    </span>
                  </div>
                )}

                {pricing.weekendSurcharge > 0 && (
                  <div className="flex justify-between pb-2 border-b border-white/20">
                    <span>Weekend</span>
                    <span className="font-semibold">
                      ${pricing.weekendSurcharge.toFixed(2)}
                    </span>
                  </div>
                )}

                {pricing.holidaySurcharge > 0 && (
                  <div className="flex justify-between pb-2 border-b border-white/20">
                    <span>Holiday</span>
                    <span className="font-semibold">
                      ${pricing.holidaySurcharge.toFixed(2)}
                    </span>
                  </div>
                )}

                {pricing.urgencySurcharge > 0 && (
                  <div className="flex justify-between pb-2 border-b border-white/20">
                    <span>
                      {formData.urgency === 'same-day'
                        ? 'Same Day'
                        : formData.urgency === 'two-hour'
                        ? 'Rush (2 Hours)'
                        : 'Emergency'}
                    </span>
                    <span className="font-semibold">
                      ${pricing.urgencySurcharge.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t-2 border-white/40">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-sm text-gray-200 mb-1">Total Price</p>
                    <p className="text-5xl font-bold text-notary-gold">
                      ${pricing.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 mb-6">
                  <p className="text-sm mb-2">Pay in 4 installments with Afterpay</p>
                  <p className="text-2xl font-bold">
                    ${(pricing.total / 4).toFixed(2)}
                    <span className="text-sm font-normal text-gray-200"> / payment</span>
                  </p>
                </div>

                <a
                  href="/#booking"
                  className="block w-full text-center btn-primary bg-notary-gold hover:bg-notary-gold/90"
                >
                  Book This Appointment
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="font-bold text-lg mb-2">No Hidden Fees</h3>
            <p className="text-gray-600">
              The price you see is the price you pay. No surprises.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="font-bold text-lg mb-2">Flexible Payment</h3>
            <p className="text-gray-600">
              Pay in full or split into 4 interest-free payments.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="font-bold text-lg mb-2">California Compliant</h3>
            <p className="text-gray-600">
              All fees comply with California notary regulations.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 card">
          <h2 className="text-2xl font-bold text-notary-navy mb-8">
            Pricing FAQs
          </h2>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-2">
                Why is there a travel fee?
              </h4>
              <p className="text-gray-600">
                The travel fee covers the cost of coming to your location,
                including gas, time, and vehicle maintenance. This is standard for
                mobile notary services.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-2">
                Can I negotiate the price?
              </h4>
              <p className="text-gray-600">
                Our base notary fee of $15 per signature is the maximum allowed by
                California law and cannot be changed. Other fees are competitive
                and reasonable for LA County mobile services.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-2">
                Do you charge extra for multiple documents?
              </h4>
              <p className="text-gray-600">
                We charge per signature, not per document. If you have 5 documents
                with 2 signatures each, that's 10 signatures total.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-gray-600">
                We accept all major credit/debit cards and Afterpay for
                buy-now-pay-later convenience. Payment is secure through Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
