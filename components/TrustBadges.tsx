export default function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-8">
      {/* California Notary Public */}
      <div className="flex items-center gap-2 text-center">
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <svg className="w-7 h-7 text-gold-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2 2v-2l2 2v2zm4 0L14 14H5l2-2v-2l-2 2z"/>
            </svg>
          </div>
          <span className="font-bold text-navy-900">CA Notary Public</span>
          <span className="text-xs text-gray-600">License: 273689</span>
        </div>
      </div>

      {/* E&O Insurance */}
      <div className="hidden md:block w-px h-6 bg-gray-300"></div>

      <div className="flex items-center gap-2 text-center">
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <svg className="w-7 h-7 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 00112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-navy-900">E&O Insured</span>
          <span className="text-xs text-gray-600">$100,000 Coverage</span>
        </div>
      </div>

      {/* LA County Services */}
      <div className="hidden md:block w-px h-6 bg-gray-300"></div>

      <div className="flex items-center gap-2 text-center">
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <svg className="w-7 h-7 text-success-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 2.28 2.13L3.09 6.26L2 3.09 5.7-5.63-5.07A10 10 0 002.93 19.07c-.69.12-1.4-.3-2.12-.56l1.38-3.53c.69-.03 1.38.03 2.07.03.69 0 1.38-.03 2.07-.03l1.38 3.53c.72.26 1.43.44 2.12.56l5.07 5.63c.69-.12 1.4-.3 2.12-.56L12 2z"/>
            </svg>
          </div>
          <span className="font-bold text-navy-900">LA County Wide</span>
          <span className="text-xs text-gray-600">Since 2023</span>
        </div>
      </div>

      {/* Verified Reviews */}
      <div className="hidden md:block w-px h-6 bg-gray-300"></div>

      <div className="flex items-center gap-2 text-center">
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <svg className="w-7 h-7 text-gold-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l12 7.24l3.91 7.24l5.84 3.97L6 17.27z"/>
              <path d="M5.84 3.97L3.91 7.24 2 9.24l12 7.24L7.64 3.97z"/>
              <path d="M12 1.97l7.53 3.52 1.5 1.5 1.5-7.54-1.52L12 1.97z"/>
            </svg>
          </div>
          <span className="font-bold text-navy-900">Verified Reviews</span>
          <span className="text-xs text-gray-600">5★+ Rated</span>
        </div>
      </div>

      {/* Mobile Service */}
      <div className="hidden md:block w-px h-6 bg-gray-300"></div>

      <div className="flex items-center gap-2 text-center">
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <svg className="w-7 h-7 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h1M3 8h13a2 2 0 012-2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2H13m0 0A2 2 0 012 2v2a2 2 0 01-2-2H7a2 2 0 01-2-2V6z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12h10"/>
            </svg>
          </div>
          <span className="font-bold text-navy-900">Mobile Service</span>
          <span className="text-xs text-gray-600">We Come to You</span>
        </div>
      </div>
    </div>
  );
}