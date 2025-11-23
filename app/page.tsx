'use client';

import { useState, useEffect } from 'react';
import { calculatePricing, type PricingInput, type PricingBreakdown } from '@/lib/pricing';

export default function Home() {
  const [formData, setFormData] = useState({
    numberOfSignatures: 1,
    address: '',
    city: 'Los Angeles',
    zip: '',
    appointmentDate: '',
    appointmentTime: '',
    urgency: 'standard' as const,
    distanceInMiles: 5,
  });

  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (formData.appointmentDate && formData.appointmentTime && formData.zip) {
      calculatePrice();
    }
  }, [formData]);

  const calculatePrice = async () => {
    setIsCalculating(true);

    try {
      // Simulate distance calculation
      // In production, this would call Google Maps API
      const estimatedDistance = Math.random() * 20 + 5; // 5-25 miles

      const dateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);

      const input: PricingInput = {
        numberOfSignatures: formData.numberOfSignatures,
        distanceInMiles: estimatedDistance,
        appointmentDate: dateTime,
        urgency: formData.urgency,
      };

      const result = calculatePricing(input);
      setPricing(result);
    } catch (error) {
      console.error('Error calculating price:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would redirect to checkout
    alert('Proceeding to checkout... (Stripe integration will be added)');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-notary-navy to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Professional Mobile Notary Services
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Serving Los Angeles County • Same-Day Appointments Available
            </p>
            <div className="flex justify-center gap-4">
              <a href="#booking" className="btn-primary bg-notary-gold hover:bg-notary-gold/90">
                Book Now
              </a>
              <a href="#how-it-works" className="btn-secondary bg-white/10 hover:bg-white/20 border-white">
                How It Works
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="font-bold text-lg mb-2">We Come to You</h3>
              <p className="text-gray-600">Mobile service throughout LA County</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-bold text-lg mb-2">Fast Service</h3>
              <p className="text-gray-600">Same-day and emergency appointments</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="font-bold text-lg mb-2">Flexible Payment</h3>
              <p className="text-gray-600">Pay now or use Afterpay</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-bold text-lg mb-2">Licensed & Bonded</h3>
              <p className="text-gray-600">California certified notary public</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div id="booking" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Book Your Appointment</h2>

          <form onSubmit={handleSubmit} className="card">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Number of Signatures */}
              <div>
                <label className="label">Number of Signatures</label>
                <input
                  type="number"
                  min="1"
                  className="input-field"
                  value={formData.numberOfSignatures}
                  onChange={(e) => setFormData({ ...formData, numberOfSignatures: parseInt(e.target.value) })}
                  required
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="label">Service Speed</label>
                <select
                  className="input-field"
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                >
                  <option value="standard">Standard (Next available)</option>
                  <option value="same-day">Same Day (+$50)</option>
                  <option value="two-hour">Within 2 Hours (+$100)</option>
                  <option value="emergency">Emergency/ASAP (+$150)</option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="label">Service Address</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="label">City</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              {/* ZIP */}
              <div>
                <label className="label">ZIP Code</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="90027"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="label">Appointment Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="label">Appointment Time</label>
                <input
                  type="time"
                  className="input-field"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Price Breakdown */}
            {pricing && (
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold mb-4 text-notary-navy">Price Breakdown</h3>
                <div className="space-y-2 text-sm mb-4">
                  {pricing.breakdown.map((line, i) => (
                    <div key={i} className="text-gray-700">{line}</div>
                  ))}
                </div>
                <div className="border-t-2 border-blue-300 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-3xl font-bold text-notary-navy">
                      ${pricing.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Split into 4 interest-free payments with Afterpay
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full mt-8 text-lg"
              disabled={!pricing || isCalculating}
            >
              {pricing ? `Book Appointment - $${pricing.total.toFixed(2)}` : 'Enter Details to See Price'}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Secure payment via Stripe • Pay in full or use Afterpay
            </p>
          </form>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-notary-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-xl mb-3">Book Online</h3>
              <p className="text-gray-600">
                Select your service, choose a time, and see your price instantly. No hidden fees.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-notary-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-xl mb-3">We Come to You</h3>
              <p className="text-gray-600">
                Our licensed notary arrives at your location with all necessary equipment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-notary-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-xl mb-3">Get Notarized</h3>
              <p className="text-gray-600">
                Quick, professional service with all California compliance requirements met.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Acknowledgments',
              'Jurats',
              'Oaths & Affirmations',
              'Copy Certifications',
              'Signature Witnessing',
              'Loan Signings',
              'Power of Attorney',
              'Real Estate Documents',
              'Business Documents',
            ].map((service) => (
              <div key={service} className="card hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📄</div>
                  <h3 className="font-semibold">{service}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
