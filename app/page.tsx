'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { calculatePricing, type PricingInput, type PricingBreakdown } from '@/lib/pricing';
import PriceBreakdown from '@/components/PriceBreakdown';
import TrustBadges from '@/components/TrustBadges';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    numberOfSignatures: 1,
    address: '',
    city: 'Los Angeles',
    zip: '',
    appointmentDate: '',
    appointmentTime: '',
    urgency: 'standard' as const,
    fullName: '',
    email: '',
    phone: '',
    specialInstructions: '',
  });

  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate price whenever form changes
  useEffect(() => {
    if (formData.appointmentDate && formData.appointmentTime) {
      calculatePrice();
    }
  }, [formData.numberOfSignatures, formData.appointmentDate, formData.appointmentTime, formData.urgency, formData.zip]);

  const calculatePrice = async () => {
    setIsCalculating(true);

    try {
      // Estimate distance based on ZIP (in production, use Google Maps API)
      const estimatedDistance = formData.zip ? Math.random() * 15 + 5 : 10;

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
    if (!/^\d{5}$/.test(formData.zip)) newErrors.zip = 'ZIP code must be 5 digits';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Date is required';
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!pricing) {
      alert('Please wait for price calculation');
      return;
    }

    // Redirect to confirmation page with all data
    const params = new URLSearchParams({
      signatures: formData.numberOfSignatures.toString(),
      address: formData.address,
      city: formData.city,
      zip: formData.zip,
      date: formData.appointmentDate,
      time: formData.appointmentTime,
      urgency: formData.urgency,
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      total: pricing.total.toString(),
    });

    router.push(`/book/confirm?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Professional Mobile Notary Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Serving Los Angeles County • Same-Day Appointments Available
            </p>
            <TrustBadges />
            <div className="mt-8">
              <a href="#booking" className="btn-gold btn-lg">
                Book Now - Get Instant Pricing
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
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-navy-900">We Come to You</h3>
              <p className="text-gray-600">Mobile service throughout LA County</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-navy-900">Fast Service</h3>
              <p className="text-gray-600">Same-day and emergency appointments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-navy-900">Flexible Payment</h3>
              <p className="text-gray-600">Pay now or use Afterpay</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-navy-900">Licensed & Bonded</h3>
              <p className="text-gray-600">California certified notary public</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div id="booking" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-navy-900">
            Book Your Appointment
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Get instant pricing • No hidden fees • Same-day available
          </p>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-bold text-navy-900 mb-4">Service Details</h3>

                {/* Number of Signatures */}
                <div className="mb-4">
                  <label className="label">Number of Signatures *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className={`input ${errors.numberOfSignatures ? 'input-error' : ''}`}
                    value={formData.numberOfSignatures}
                    onChange={(e) => setFormData({ ...formData, numberOfSignatures: parseInt(e.target.value) || 1 })}
                    required
                  />
                  <p className="helper-text">$15 per signature (CA maximum)</p>
                </div>

                {/* Service Speed */}
                <div>
                  <label className="label">Service Speed *</label>
                  <select
                    className="input"
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                  >
                    <option value="standard">Standard (Next Available)</option>
                    <option value="same-day">Same Day (+$50)</option>
                    <option value="two-hour">Within 2 Hours (+$100)</option>
                    <option value="emergency">Emergency/ASAP (+$150)</option>
                  </select>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-navy-900 mb-4">Location</h3>

                <div className="space-y-4">
                  <div>
                    <label className="label">Service Address *</label>
                    <input
                      type="text"
                      className={`input ${errors.address ? 'input-error' : ''}`}
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                    {errors.address && <p className="error-message">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">City *</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="label">ZIP Code *</label>
                      <input
                        type="text"
                        className={`input ${errors.zip ? 'input-error' : ''}`}
                        placeholder="90027"
                        maxLength={5}
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value.replace(/\D/g, '') })}
                        required
                      />
                      {errors.zip && <p className="error-message">{errors.zip}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-navy-900 mb-4">Date & Time</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="label">Date *</label>
                    <input
                      type="date"
                      className={`input ${errors.appointmentDate ? 'input-error' : ''}`}
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                      min={today}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Time *</label>
                    <input
                      type="time"
                      className={`input ${errors.appointmentTime ? 'input-error' : ''}`}
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <p className="helper-text">After hours (6PM-9AM): +$50 surcharge</p>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-navy-900 mb-4">Your Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      className={`input ${errors.fullName ? 'input-error' : ''}`}
                      placeholder="John Smith"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                    {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      className={`input ${errors.email ? 'input-error' : ''}`}
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                    <p className="helper-text">We'll send your confirmation here</p>
                  </div>

                  <div>
                    <label className="label">Phone *</label>
                    <input
                      type="tel"
                      className={`input ${errors.phone ? 'input-error' : ''}`}
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                    {errors.phone && <p className="error-message">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="label">Special Instructions (Optional)</label>
                    <textarea
                      className="input"
                      rows={3}
                      placeholder="Any special requirements or instructions..."
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Price Breakdown */}
            <div>
              <div className="lg:sticky lg:top-24">
                <PriceBreakdown pricing={pricing} isCalculating={isCalculating} />

                <button
                  type="submit"
                  className="btn-gold btn-lg btn-block mt-6"
                  disabled={!pricing || isCalculating}
                >
                  {pricing ? `Book Appointment - $${pricing.total.toFixed(2)}` : 'Enter Details to See Price'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  🔒 Secure payment via Stripe • No hidden fees
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-navy-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-navy-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-xl mb-3 text-navy-900">Book Online</h3>
              <p className="text-gray-600">
                Select your service, choose a time, and see your price instantly. No hidden fees.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-navy-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-xl mb-3 text-navy-900">We Come to You</h3>
              <p className="text-gray-600">
                Our licensed notary arrives at your location with all necessary equipment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-navy-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-xl mb-3 text-navy-900">Get Notarized</h3>
              <p className="text-gray-600">
                Quick, professional service with all California compliance requirements met.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
