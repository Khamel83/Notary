'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

function ConfirmContent() {
  const searchParams = useSearchParams();

  // Get booking details from URL parameters
  const bookingDetails = {
    numberOfSignatures: Number(searchParams.get('signatures')) || 1,
    address: searchParams.get('address') || '',
    city: searchParams.get('city') || '',
    zip: searchParams.get('zip') || '',
    date: searchParams.get('date') || '',
    time: searchParams.get('time') || '',
    urgency: searchParams.get('urgency') || 'standard',
    fullName: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    phone: searchParams.get('phone') || '',
    total: Number(searchParams.get('total')) || 0,
  };

  const handleEditDetails = () => {
    window.history.back();
  };

  const handleProceedToPayment = async () => {
    // Create Stripe checkout session
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: bookingDetails.total,
          paymentMethod: 'card',
          appointmentDetails: {
            date: `${bookingDetails.date} ${bookingDetails.time}`,
            address: `${bookingDetails.address}, ${bookingDetails.city}, CA ${bookingDetails.zip}`,
            numberOfSignatures: bookingDetails.numberOfSignatures,
            fullName: bookingDetails.fullName,
            email: bookingDetails.email,
            phone: bookingDetails.phone,
          },
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Error processing payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy-900 mb-2">
            Confirm Your Booking
          </h1>
          <p className="text-lg text-gray-600">
            Review your details before proceeding to payment
          </p>
        </div>

        {/* Booking Summary Card */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">
            Appointment Details
          </h2>

          <div className="space-y-4">
            {/* Date & Time */}
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <svg className="w-6 h-6 text-gold-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-gray-700">Date & Time</p>
                <p className="text-lg text-navy-900">
                  {new Date(bookingDetails.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-gray-600">{bookingDetails.time}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <svg className="w-6 h-6 text-gold-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-gray-700">Service Location</p>
                <p className="text-navy-900">{bookingDetails.address}</p>
                <p className="text-gray-600">
                  {bookingDetails.city}, CA {bookingDetails.zip}
                </p>
              </div>
            </div>

            {/* Service Details */}
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <svg className="w-6 h-6 text-gold-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-gray-700">Service Type</p>
                <p className="text-navy-900">
                  {bookingDetails.numberOfSignatures} signature
                  {bookingDetails.numberOfSignatures > 1 ? 's' : ''}
                </p>
                <p className="text-gray-600">
                  {bookingDetails.urgency === 'standard' && 'Standard Service'}
                  {bookingDetails.urgency === 'same-day' && 'Same-Day Service'}
                  {bookingDetails.urgency === 'two-hour' && 'Rush Service (2 hours)'}
                  {bookingDetails.urgency === 'emergency' && 'Emergency Service'}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-gold-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-gray-700">Contact Information</p>
                <p className="text-navy-900">{bookingDetails.fullName}</p>
                <p className="text-gray-600">{bookingDetails.email}</p>
                <p className="text-gray-600">{bookingDetails.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="card bg-gradient-to-br from-navy-900 to-navy-700 text-white mb-6">
          <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-lg">
              <span className="text-gray-200">Total Amount</span>
              <span className="font-bold text-3xl text-gold-400">
                ${bookingDetails.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm mb-2">Pay in 4 interest-free installments</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gold-400">
                ${(bookingDetails.total / 4).toFixed(2)}
              </p>
              <span className="text-sm text-gray-300">/ payment with Afterpay</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleEditDetails}
            className="btn-secondary btn-lg flex-1"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Edit Details
          </button>
          <button
            onClick={handleProceedToPayment}
            className="btn-gold btn-lg flex-1"
          >
            Proceed to Payment
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure Payment</span>
          </div>
          <span className="text-gray-400">•</span>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>SSL Encrypted</span>
          </div>
          <span className="text-gray-400">•</span>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>No Hidden Fees</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmBooking() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
      <ConfirmContent />
    </Suspense>
  );
}
