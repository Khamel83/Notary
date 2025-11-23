'use client';

import { useState } from 'react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  clientName: string;
  date: string;
  time: string;
  address: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  signatures: number;
}

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState<'calendar' | 'list'>('list');

  // Mock data - in production this would come from the database
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      clientName: 'John Smith',
      date: '2025-11-24',
      time: '10:00 AM',
      address: '123 Main St, Los Angeles, CA 90027',
      status: 'confirmed',
      amount: 140.00,
      signatures: 2,
    },
    {
      id: '2',
      clientName: 'Sarah Johnson',
      date: '2025-11-24',
      time: '2:30 PM',
      address: '456 Oak Ave, Hollywood, CA 90028',
      status: 'pending',
      amount: 215.00,
      signatures: 3,
    },
    {
      id: '3',
      clientName: 'Michael Chen',
      date: '2025-11-25',
      time: '11:00 AM',
      address: '789 Pine Rd, Beverly Hills, CA 90210',
      status: 'confirmed',
      amount: 290.00,
      signatures: 5,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const todayAppointments = appointments.filter(
    (apt) => apt.date === selectedDate
  );

  const stats = {
    today: appointments.filter((a) => a.date === selectedDate).length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    revenue: appointments.reduce((sum, a) => sum + a.amount, 0),
    thisWeek: appointments.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-notary-navy">Operator Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your appointments and schedule</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-sm font-semibold text-gray-600 mb-2">Today's Appointments</div>
            <div className="text-3xl font-bold text-notary-navy">{stats.today}</div>
          </div>
          <div className="card">
            <div className="text-sm font-semibold text-gray-600 mb-2">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="card">
            <div className="text-sm font-semibold text-gray-600 mb-2">This Week</div>
            <div className="text-3xl font-bold text-notary-navy">{stats.thisWeek}</div>
          </div>
          <div className="card">
            <div className="text-sm font-semibold text-gray-600 mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-green-600">
              ${stats.revenue.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  view === 'list'
                    ? 'bg-notary-navy text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  view === 'calendar'
                    ? 'bg-notary-navy text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Calendar View
              </button>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-notary-navy">
            Appointments for {format(new Date(selectedDate), 'MMMM dd, yyyy')}
          </h2>

          {todayAppointments.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No appointments scheduled
              </h3>
              <p className="text-gray-500">You have no appointments for this date.</p>
            </div>
          ) : (
            todayAppointments.map((appointment) => (
              <div key={appointment.id} className="card hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-notary-navy">
                        {appointment.clientName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{appointment.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📄</span>
                        <span>{appointment.signatures} signature(s)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-2xl font-bold text-notary-navy">
                      ${appointment.amount.toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                      {appointment.status === 'pending' && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                          Confirm
                        </button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                            Start
                          </button>
                          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                            Reschedule
                          </button>
                        </>
                      )}
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="card mt-8">
          <h3 className="text-lg font-bold text-notary-navy mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="btn-primary">
              Block Time
            </button>
            <button className="btn-secondary">
              View All Appointments
            </button>
            <button className="btn-secondary">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
