import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LA Mobile Notary - Professional Notary Services in Los Angeles",
  description: "24/7 mobile notary services in Los Angeles. Same-day appointments available. Serving all of LA County with secure, professional notarization.",
  keywords: "notary, mobile notary, Los Angeles notary, LA notary, notary public, loan signing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Header Navigation */}
        <nav className="gradient-navy text-white shadow-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold leading-tight">
                      <span className="text-gold-400">LA</span> Mobile Notary
                    </h1>
                    <p className="text-xs text-gray-300 leading-none">Licensed & Bonded</p>
                  </div>
                </a>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <a href="/" className="hover:text-gold-400 transition-colors font-medium">Home</a>
                <a href="/services" className="hover:text-gold-400 transition-colors font-medium">Services</a>
                <a href="/pricing" className="hover:text-gold-400 transition-colors font-medium">Pricing</a>
                <a href="/dashboard" className="hover:text-gold-400 transition-colors font-medium">Dashboard</a>
              </div>

              {/* Phone Number */}
              <div>
                <a href="tel:+15550100" className="btn-gold btn-sm hidden sm:inline-flex">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (555) 010-0100
                </a>
                <a href="tel:+15550100" className="text-gold-400 font-semibold sm:hidden">
                  📞
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main className="min-h-screen bg-gray-50">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-navy-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              {/* About */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gold-400">LA Mobile Notary</h3>
                </div>
                <p className="text-gray-300 mb-4 max-w-md">
                  Professional mobile notary services serving Los Angeles County.
                  Licensed, bonded, and ready to serve you with same-day appointments available.
                </p>
                <div className="flex gap-3">
                  <span className="badge-gold">★★★★★ 4.9 Rating</span>
                  <span className="badge-success">Same-Day Available</span>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold mb-4 text-gold-400">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="/services" className="text-gray-300 hover:text-gold-400 transition-colors">Services</a></li>
                  <li><a href="/pricing" className="text-gray-300 hover:text-gold-400 transition-colors">Pricing Calculator</a></li>
                  <li><a href="/dashboard" className="text-gray-300 hover:text-gold-400 transition-colors">Dashboard</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-gold-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-gold-400 transition-colors">Terms of Service</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-bold mb-4 text-gold-400">Contact Us</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gold-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Thai Town<br/>Los Angeles, CA 90027</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:+15550100" className="hover:text-gold-400 transition-colors">(555) 010-0100</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:hello@lamobilenotary.com" className="hover:text-gold-400 transition-colors">hello@lamobilenotary.com</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-navy-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                &copy; 2025 LA Mobile Notary. All rights reserved. CA Commission #12345678
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  4.9/5 Rating
                </span>
                <span>•</span>
                <span>Licensed & Bonded</span>
                <span>•</span>
                <span>Serving LA County</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
