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
        <nav className="bg-notary-navy text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">
                  <span className="text-notary-gold">LA</span> Mobile Notary
                </h1>
              </div>
              <div className="hidden md:flex space-x-8">
                <a href="/" className="hover:text-notary-gold transition-colors">Home</a>
                <a href="/services" className="hover:text-notary-gold transition-colors">Services</a>
                <a href="/pricing" className="hover:text-notary-gold transition-colors">Pricing</a>
                <a href="/dashboard" className="hover:text-notary-gold transition-colors">Dashboard</a>
              </div>
              <div>
                <a href="tel:+15550100" className="text-notary-gold font-semibold">
                  📞 (555) 010-0100
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main className="min-h-screen bg-gray-50">
          {children}
        </main>

        <footer className="bg-notary-navy text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-notary-gold">LA Mobile Notary</h3>
                <p className="text-gray-300">
                  Professional mobile notary services serving Los Angeles County since 2025.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/services" className="hover:text-notary-gold">Services</a></li>
                  <li><a href="/pricing" className="hover:text-notary-gold">Pricing Calculator</a></li>
                  <li><a href="/about" className="hover:text-notary-gold">About Us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <p className="text-gray-300">
                  Thai Town, Los Angeles, CA 90027<br />
                  Phone: (555) 010-0100<br />
                  Email: hello@lamobilenotary.com
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 LA Mobile Notary. All rights reserved. Commission #{process.env.NOTARY_COMMISSION_NUMBER}</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
