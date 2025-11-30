'use client';

import { createPersonalityProfile } from '@/lib/validation';

interface PersonalityProfileProps {
  email?: string;
  zip?: string;
  phone?: string;
}

export default function PersonalityProfile({ email, zip, phone }: PersonalityProfileProps) {
  if (!email && !zip && !phone) {
    return null;
  }

  const profile = createPersonalityProfile(email, zip, phone);

  const getLevelColor = () => {
    switch (profile.level) {
      case 'premium': return 'text-gold-600 bg-gold-50 border-gold-200';
      case 'enhanced': return 'text-sky-600 bg-sky-50 border-sky-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLevelIcon = () => {
    switch (profile.level) {
      case 'premium': return '🌟';
      case 'enhanced': return '⭐';
      default: return '📍';
    }
  };

  return (
    <div className="mt-6 p-4 rounded-lg border-2 bg-gradient-to-br from-white to-sky-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="la-heading text-2xl">Your LA Profile</h3>
        <div className={`px-3 py-1 rounded-full border-2 text-sm font-bold ${getLevelColor()}`}>
          <span className="mr-1">{getLevelIcon()}</span>
          {profile.level.toUpperCase()}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 font-medium">{profile.description}</p>
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">LA Credibility Score:</span>
            <span className="font-bold text-navy-900">{profile.score}/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-gradient-to-r from-sky-500 to-gold-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(profile.score / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {profile.jokes.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-navy-900 mb-2">Your 2007 LA Credentials:</h4>
          <div className="grid gap-3">
            {profile.jokes.slice(0, 3).map((joke, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-white border border-gray-200 hover:border-sky-300 transition-colors duration-200"
              >
                <div className="flex items-start gap-2">
                  <span className="text-gold-500 mt-0.5">✨</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{joke}</p>
                </div>
              </div>
            ))}
          </div>

          {profile.jokes.length > 3 && (
            <button className="text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors duration-200">
              Show more LA insights ({profile.jokes.length - 3} remaining)
            </button>
          )}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Based on your email domain, ZIP code, and phone area code - pure LA!
        </div>
      </div>
    </div>
  );
}