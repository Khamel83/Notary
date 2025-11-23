export default function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-8">
      {/* Star Rating */}
      <div className="flex items-center gap-2">
        <div className="flex text-gold-500">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <span className="font-semibold text-gray-700">4.9/5</span>
        <span className="text-sm text-gray-500">(127 reviews)</span>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-6 bg-gray-300"></div>

      {/* Licensed */}
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="font-semibold text-gray-700">Licensed & Bonded</span>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-6 bg-gray-300"></div>

      {/* Same Day */}
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="font-semibold text-gray-700">Same-Day Available</span>
      </div>
    </div>
  );
}
