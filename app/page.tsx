'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { calculatePricing, type PricingInput, type PricingBreakdown } from '@/lib/pricing';
import PriceBreakdown from '@/components/PriceBreakdown';
import TrustBadges from '@/components/TrustBadges';
import LoadingSpinner from '@/components/LoadingSpinner';
import DateTimePicker from '@/components/DateTimePicker';
import PersonalityProfile from '@/components/PersonalityProfile';
import { validateEmail, validatePhone, validateZip, type ValidationResult } from '@/lib/validation';

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

  const [dateTimeValue, setDateTimeValue] = useState({
    date: '',
    time: ''
  });

  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});

  // Calculate price whenever form changes
  useEffect(() => {
    if (dateTimeValue.date && dateTimeValue.time) {
      setFormData({
        ...formData,
        appointmentDate: dateTimeValue.date,
        appointmentTime: dateTimeValue.time
      });
    }
  }, [dateTimeValue]);

  useEffect(() => {
    if (formData.appointmentDate && formData.appointmentTime) {
      calculatePrice();
    }
  }, [formData.numberOfSignatures, formData.appointmentDate, formData.appointmentTime, formData.urgency, formData.zip]);

  // Real-time validation with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      // Validate email
      if (formData.email) {
        const emailValidation = validateEmail(formData.email);
        setValidationResults(prev => ({ ...prev, email: emailValidation }));
      }

      // Validate phone
      if (formData.phone) {
        const phoneValidation = validatePhone(formData.phone);
        setValidationResults(prev => ({ ...prev, phone: phoneValidation }));
      }

      // Validate ZIP
      if (formData.zip) {
        const zipValidation = validateZip(formData.zip);
        setValidationResults(prev => ({ ...prev, zip: zipValidation }));
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [formData.email, formData.phone, formData.zip]);

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
      <div className="gradient-la text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center animate-fade-in">
            <h1 className="la-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              LA MOBILE NOTARY
            </h1>
            <div className="la-subheading text-xl md:text-2xl mb-4 text-sky-100">
              Your Los Angeles Notary Public
            </div>
            <p className="text-lg md:text-xl mb-8 text-sky-50 max-w-2xl mx-auto">
              From Hollywood to Santa Monica • We come to you • Licensed & insured
            </p>
            <TrustBadges />
            <div className="mt-8 space-y-4">
              <a href="#booking" className="btn-gold btn-lg shadow-2xl hover:shadow-gold/25 transform hover:scale-105 transition-all duration-300">
                Book Your LA Notary - Instant Pricing
              </a>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-sky-100">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Same Day Service
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  LA County Wide
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Licensed & Bonded
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-gradient-to-b from-white to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="la-heading text-3xl md:text-4xl text-center mb-4 text-la-ocean">
            SERVING THE ENTIRE LA AREA
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg la-subheading">
            From Downtown to the Valley • Hollywood to the Beaches
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 gradient-la rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2 text-la-ocean">LA County Mobile</h3>
              <p className="text-gray-600">From Pasadena to Long Beach • We come to you</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 gradient-sunset rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2 text-la-sunset">LA Fast Service</h3>
              <p className="text-gray-600">Beat the traffic • Same-day & emergency appointments</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 gradient-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2 text-navy-900">Easy Payment</h3>
              <p className="text-gray-600">Card • Apple Pay • Google Pay • All major cards</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 gradient-palm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2 text-navy-900">California Licensed</h3>
              <p className="text-gray-600">Fully insured • Professional • Experienced</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div id="booking" className="py-20 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="la-heading text-4xl md:text-5xl mb-4 text-la-ocean">
              BOOK YOUR LA NOTARY
            </h2>
            <p className="la-subheading text-lg text-gray-600 max-w-2xl mx-auto">
              Instant LA pricing • No hidden fees • Same-day service available
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="badge bg-gold-100 text-gold-800">LA County Wide</span>
              <span className="badge bg-success-100 text-success-800">California Licensed</span>
              <span className="badge bg-sky-100 text-sky-800">Fast Service</span>
            </div>
          </div>

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
                        className={`input ${errors.zip ? 'input-error' : ''} ${
                          validationResults.zip && !validationResults.zip.isValid && formData.zip ? 'input-error' : ''
                        } ${
                          validationResults.zip && validationResults.zip.isValid && formData.zip ? 'input-success' : ''
                        }`}
                        placeholder="90027"
                        maxLength={5}
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value.replace(/\D/g, '') })}
                        required
                      />
                      {errors.zip && (
                        <p className="error-message">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          {errors.zip}
                        </p>
                      )}
                      {validationResults.zip && formData.zip && (
                        <p className={`${
                          validationResults.zip.isValid ? 'success-message' : 'error-message'
                        }`}>
                          {validationResults.zip.isValid ? (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Great! This ZIP code is in our service area
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              {validationResults.zip.message}
                              {validationResults.zip.suggestion && (
                                <span className="block text-xs mt-1">{validationResults.zip.suggestion}</span>
                              )}
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-navy-900 mb-4">Date & Time</h3>

                <div>
                  <DateTimePicker
                    value={dateTimeValue}
                    onChange={(date, time) => setDateTimeValue({ date, time })}
                    minDate={new Date(today)}
                    urgency={formData.urgency}
                  />
                </div>
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
                      className={`input ${errors.email ? 'input-error' : ''} ${
                        validationResults.email && !validationResults.email.isValid && formData.email ? 'input-error' : ''
                      } ${
                        validationResults.email && validationResults.email.isValid && formData.email ? 'input-success' : ''
                      }`}
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    {errors.email && (
                      <p className="error-message">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                    {validationResults.email && formData.email && (
                      <p className={`${
                        validationResults.email.isValid ? 'success-message' : 'error-message'
                      }`}>
                        {validationResults.email.isValid ? (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Email looks good!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {validationResults.email.message}
                            {validationResults.email.suggestion && (
                              <span className="block text-xs mt-1">{validationResults.email.suggestion}</span>
                            )}
                          </>
                        )}
                      </p>
                    )}
                    <p className="helper-text">We'll send your confirmation here</p>
                  </div>

                  <div>
                    <label className="label">Phone *</label>
                    <input
                      type="tel"
                      className={`input ${errors.phone ? 'input-error' : ''} ${
                        validationResults.phone && !validationResults.phone.isValid && formData.phone ? 'input-error' : ''
                      } ${
                        validationResults.phone && validationResults.phone.isValid && formData.phone ? 'input-success' : ''
                      }`}
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                    {errors.phone && (
                      <p className="error-message">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {errors.phone}
                      </p>
                    )}
                    {validationResults.phone && formData.phone && (
                      <p className={`${
                        validationResults.phone.isValid ? 'success-message' : 'error-message'
                      }`}>
                        {validationResults.phone.isValid ? (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Phone number looks good!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {validationResults.phone.message}
                            {validationResults.phone.suggestion && (
                              <span className="block text-xs mt-1">{validationResults.phone.suggestion}</span>
                            )}
                          </>
                        )}
                      </p>
                    )}
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

                {/* Personality Profile */}
                <PersonalityProfile
                  email={formData.email}
                  zip={formData.zip}
                  phone={formData.phone}
                />

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
      <div id="how-it-works" className="py-20 gradient-ocean text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="la-heading text-3xl md:text-4xl text-center mb-12">
            HOW LA NOTARY WORKS
          </h2>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                1
              </div>
              <h3 className="font-bold text-2xl mb-4 la-subheading">Book Online</h3>
              <p className="text-sky-100 text-lg">
                Choose your LA location, pick a time, and see your price instantly. No surprise fees.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                2
              </div>
              <h3 className="font-bold text-2xl mb-4 la-subheading">We Drive to You</h3>
              <p className="text-sky-100 text-lg">
                Your LA notary arrives with all equipment. From Downtown to the Valley.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                3
              </div>
              <h3 className="font-bold text-2xl mb-4 la-subheading">Get Notarized</h3>
              <p className="text-sky-100 text-lg">
                Professional service meeting all California requirements. Fast & efficient.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
