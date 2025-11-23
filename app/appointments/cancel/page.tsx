'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function CancelAppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid cancellation link');
      return;
    }

    // Fetch appointment details
    async function fetchAppointment() {
      try {
        const res = await fetch(`/api/appointments/verify?token=${token}`);
        if (!res.ok) throw new Error('Invalid or expired link');
        const data = await res.json();
        setAppointment(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load appointment');
      }
    }

    fetchAppointment();
  }, [token]);

  const handleCancel = async () => {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/appointments/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to cancel appointment');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-600">This cancellation link is invalid.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-success-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Appointment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully cancelled. You will receive a refund within 5-7 business days.
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-gold"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="btn-gold"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const appointmentDate = new Date(appointment.appointmentDate);
  const hoursUntil = (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cancel Appointment</h1>
            <p className="text-gray-600">Are you sure you want to cancel this appointment?</p>
          </div>

          {/* Appointment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Appointment Details:</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Date:</strong> {appointmentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
              <p><strong>Time:</strong> {appointmentDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}</p>
              <p><strong>Location:</strong> {appointment.serviceAddress}</p>
              <p><strong>Total Paid:</strong> ${appointment.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Cancellation Policy:</h3>
            {hoursUntil >= 24 ? (
              <p className="text-yellow-700 text-sm">
                ✅ <strong>Full refund:</strong> Cancelling more than 24 hours before your appointment.
                You will receive a full refund within 5-7 business days.
              </p>
            ) : hoursUntil >= 12 ? (
              <p className="text-yellow-700 text-sm">
                ⚠️ <strong>50% refund:</strong> Cancelling 12-24 hours before your appointment.
                You will receive a 50% refund (${(appointment.totalAmount * 0.5).toFixed(2)}).
              </p>
            ) : (
              <p className="text-yellow-700 text-sm">
                ❌ <strong>No refund:</strong> Cancelling less than 12 hours before your appointment.
                Unfortunately, no refund can be issued.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="flex-1 btn bg-gray-200 hover:bg-gray-300 text-gray-800"
              disabled={loading}
            >
              Keep Appointment
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 btn bg-red-600 hover:bg-red-700 text-white"
              disabled={loading}
            >
              {loading ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CancelAppointment() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CancelAppointmentContent />
    </Suspense>
  );
}
