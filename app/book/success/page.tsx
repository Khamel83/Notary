'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  useEffect(() => {
    // In production, fetch appointment details using session_id
    // For now, simulate a delay
    setTimeout(() => {
      setAppointmentData({
        confirmationNumber: 'APT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: new Date(Date.now() + 86400000).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: '3:00 PM',
        address: '123 Main St, Los Angeles, CA 90027',
        amount: 155.00,
      });
      setLoading(false);
    }, 1500);
  }, [sessionId]);

  const handleAddToCalendar = () => {
    // Create .ics file for calendar
    const event = {
      title: 'Mobile Notary Appointment',
      description: 'LA Mobile Notary Service',
      location: appointmentData?.address || '',
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 86400000 + 1800000), // 30 min
    };

    // Simple calendar URL (Google Calendar)
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    window.open(calendarUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-lg text-gray-600">Processing your booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="w-24 h-24 bg-success-100 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse-slow">
            <svg className="w-16 h-16 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your appointment is confirmed and paid
          </p>
          <p className="text-sm text-gray-500">
            Confirmation #{appointmentData?.confirmationNumber}
          </p>
        </div>

        {/* Appointment Details Card */}
        <div className="card mb-6 animate-slide-up">
          <div className="border-l-4 border-success-500 pl-4 mb-6">
            <h2 className="text-2xl font-bold text-navy-900 mb-1">
              Appointment Details
            </h2>
            <p className="text-gray-600">We'll see you soon!</p>
          </div>

          <div className="space-y-6">
            {/* Date & Time */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">When</p>
                <p className="text-lg font-bold text-navy-900">{appointmentData?.date}</p>
                <p className="text-gray-600">{appointmentData?.time}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Where</p>
                <p className="text-navy-900">{appointmentData?.address}</p>
              </div>
            </div>

            {/* Amount Paid */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Amount Paid</p>
                <p className="text-2xl font-bold text-success-600">
                  ${appointmentData?.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Payment successful</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleAddToCalendar}
            className="btn-primary btn-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add to Calendar
          </button>
          <button
            onClick={() => window.print()}
            className="btn-secondary btn-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Receipt
          </button>
        </div>

        {/* What Happens Next */}
        <div className="card bg-sky-50 border-sky-200">
          <h3 className="text-xl font-bold text-navy-900 mb-4">What Happens Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-navy-900">Confirmation Email</p>
                <p className="text-gray-600 text-sm">
                  You'll receive a confirmation email with all appointment details
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-navy-900">Reminder</p>
                <p className="text-gray-600 text-sm">
                  We'll send you a reminder 1 hour before your appointment
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-navy-900">We Arrive</p>
                <p className="text-gray-600 text-sm">
                  Our licensed notary will arrive at your location on time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <p className="font-semibold text-navy-900">Complete Service</p>
                <p className="text-gray-600 text-sm">
                  Quick, professional notarization with all California compliance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Reminders */}
        <div className="mt-6 card border-warning-200 bg-warning-50">
          <h3 className="text-lg font-bold text-warning-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Please Remember
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-warning-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Bring a valid photo ID (California Driver License, Passport, or State ID)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-warning-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Have your documents ready and filled out (but NOT signed)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-warning-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>All signers must be present and willing to sign</span>
            </li>
          </ul>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a href="/" className="btn-secondary btn-md">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccess() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}
