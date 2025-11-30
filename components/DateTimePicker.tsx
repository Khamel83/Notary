'use client';

import { useState, useEffect } from 'react';
import { format, addDays, isBefore, isAfter, isToday, setHours, setMinutes } from 'date-fns';

interface DateTimePickerProps {
  value: { date: string; time: string };
  onChange: (date: string, time: string) => void;
  minDate?: Date;
  urgency?: 'standard' | 'same-day' | 'two-hour' | 'emergency';
}

const TIME_SLOTS = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'
];

export default function DateTimePicker({ value, onChange, minDate = new Date(), urgency }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState(value.date || '');
  const [selectedTime, setSelectedTime] = useState(value.time || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  useEffect(() => {
    onChange(selectedDate, selectedTime);
  }, [selectedDate, selectedTime, onChange]);

  const getDateRange = () => {
    const dates = [];
    const maxDays = urgency === 'same-day' ? 1 : urgency === 'two-hour' ? 0 : urgency === 'emergency' ? 0 : 30;

    for (let i = 0; i <= maxDays; i++) {
      dates.push(addDays(minDate, i));
    }
    return dates;
  };

  const timeToMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    return period === 'PM' && hours !== 12 ? (hours + 12) * 60 + minutes : hours * 60 + minutes;
  };

  const getAvailableTimeSlots = () => {
    const now = new Date();
    const isAfterHours = now.getHours() >= 18 || now.getHours() < 6;
    const isTodaySelected = selectedDate && isToday(new Date(selectedDate));

    return TIME_SLOTS.map(slot => {
      const slotMinutes = timeToMinutes(slot);
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const isPastToday = isTodaySelected && slotMinutes <= nowMinutes + 60; // 1-hour buffer

      // Determine availability based on urgency
      let isAvailable = true;
      let badge = '';

      if (urgency === 'same-day' && isTodaySelected) {
        // Same-day service: available times after 2 hours from now
        const twoHoursFromNow = nowMinutes + 120;
        isAvailable = slotMinutes > twoHoursFromNow;
        if (isAvailable) badge = 'Same-Day';
      } else if (urgency === 'two-hour') {
        // Within 2 hours: next available slot
        const twoHoursFromNow = nowMinutes + 120;
        isAvailable = slotMinutes > twoHoursFromNow;
        badge = 'Express';
      } else if (urgency === 'emergency') {
        // Emergency: ASAP - next 30 minutes
        const thirtyMinutesFromNow = nowMinutes + 30;
        isAvailable = slotMinutes > thirtyMinutesFromNow;
        badge = 'Emergency';
      } else {
        // Standard: 1 hour buffer for same day
        if (isPastToday) {
          isAvailable = false;
        }
      }

      // After hours surcharge
      const isAfterHoursSlot = slotMinutes >= 18 * 60 || slotMinutes < 6 * 60;
      const hasSurcharge = isAfterHoursSlot && isAvailable;

      return {
        time: slot,
        available: isAvailable && !isPastToday,
        badge,
        hasSurcharge,
        isAfterHours: isAfterHoursSlot
      };
    });
  };

  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setShowDatePicker(false);
    setShowTimeSlots(true);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowTimeSlots(false);
  };

  const formatDisplayDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isAfter(date, new Date()) && isBefore(date, addDays(new Date(), 2))) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
  };

  const formatDisplayTime = (time: string) => {
    if (!time) return 'Select time';
    return time;
  };

  const selectedDateTime = selectedDate && selectedTime ?
    `${format(new Date(selectedDate), 'MMM d, yyyy')} at ${selectedTime}` :
    'Select date and time';

  return (
    <div className="space-y-4">
      {/* Date Selection */}
      <div>
        <label className="label">Appointment Date *</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`input text-left flex items-center justify-between ${
              selectedDate ? 'border-success-500 bg-success-50' : ''
            }`}
          >
            <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
              {selectedDate ? formatDisplayDate(new Date(selectedDate)) : 'Choose date'}
            </span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          {showDatePicker && (
            <div className="absolute z-10 mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              <div className="p-2">
                {getDateRange().map((date, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
                      selectedDate === date.toISOString().split('T')[0]
                        ? 'bg-sky-100 text-sky-900 border-2 border-sky-300'
                        : 'hover:bg-gray-100 border-2 border-transparent'
                    } ${
                      isBefore(date, new Date().setHours(0,0,0,0))
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-900 cursor-pointer'
                    }`}
                    disabled={isBefore(date, new Date().setHours(0,0,0,0))}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{formatDisplayDate(date)}</div>
                        <div className="text-sm text-gray-500">{format(date, 'MMMM d, yyyy')}</div>
                      </div>
                      {urgency === 'same-day' && isToday(date) && (
                        <span className="badge badge-warning">Same Day</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time Selection */}
      <div>
        <label className="label">Appointment Time *</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTimeSlots(!showTimeSlots)}
            className={`input text-left flex items-center justify-between ${
              selectedTime ? 'border-success-500 bg-success-50' : ''
            }`}
            disabled={!selectedDate}
          >
            <span className={selectedTime ? 'text-gray-900' : 'text-gray-500'}>
              {formatDisplayTime(selectedTime)}
            </span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {showTimeSlots && (
            <div className="absolute z-10 mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs text-gray-500 mb-2 px-2">
                  {urgency === 'emergency' && '🚨 Emergency: Next available slot'}
                  {urgency === 'two-hour' && '⚡ Express: Within 2 hours'}
                  {urgency === 'same-day' && '🏃 Same-Day: Available today'}
                  {urgency === 'standard' && '📅 Standard: Regular availability'}
                </div>
                {getAvailableTimeSlots().map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
                      selectedTime === slot.time
                        ? 'bg-sky-100 text-sky-900 border-2 border-sky-300'
                        : slot.available
                        ? 'hover:bg-gray-100 border-2 border-transparent cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed bg-gray-50 border-2 border-transparent'
                    }`}
                    disabled={!slot.available}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{slot.time}</span>
                        {slot.badge && (
                          <span className={`badge badge-${slot.badge.toLowerCase() === 'emergency' ? 'danger' : slot.badge.toLowerCase() === 'express' ? 'warning' : 'success'} text-xs`}>
                            {slot.badge}
                          </span>
                        )}
                        {slot.hasSurcharge && (
                          <span className="badge badge-warning text-xs">+$50</span>
                        )}
                      </div>
                      {slot.isAfterHours && (
                        <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {selectedDate && selectedTime && (
        <div className="success-message bg-success-50 border-2 border-success-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-semibold text-success-900">Appointment scheduled!</div>
              <div className="text-success-700">{selectedDateTime}</div>
            </div>
          </div>
        </div>
      )}

      {/* After hours notice */}
      {selectedTime && TIME_SLOTS.find(slot => slot === selectedTime) &&
       timeToMinutes(selectedTime) >= 18 * 60 && (
        <p className="helper-text text-amber-600 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
          After hours service (6PM-9AM): $50 surcharge will be added to your total
        </p>
      )}
    </div>
  );
}