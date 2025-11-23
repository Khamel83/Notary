'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Receipt {
  id: string;
  appointmentDate: string;
  customerName: string;
  customerEmail: string;
  address: string;
  numberOfSignatures: number;
  baseFee: number;
  travelFee: number;
  surcharges: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export default function ReceiptPage() {
  const params = useParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReceipt() {
      try {
        const response = await fetch(`/api/receipts/${params.id}`);
        if (!response.ok) {
          throw new Error('Receipt not found');
        }
        const data = await response.json();
        setReceipt(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load receipt');
      } finally {
        setLoading(false);
      }
    }

    fetchReceipt();
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Receipt Not Found</h1>
          <p className="text-gray-600">{error || 'This receipt could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Print Button */}
        <div className="mb-4 print:hidden">
          <button onClick={handlePrint} className="btn-gold">
            🖨️ Print Receipt
          </button>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="border-b-2 border-navy-900 pb-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-navy-900">LA Mobile Notary</h1>
                <p className="text-gold-500 font-semibold">Licensed & Bonded</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">RECEIPT</p>
                <p className="text-lg font-bold text-navy-900">#{receipt.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">BILLED TO:</h2>
            <p className="text-lg font-semibold text-gray-900">{receipt.customerName}</p>
            <p className="text-gray-600">{receipt.customerEmail}</p>
            <p className="text-gray-600">{receipt.address}</p>
          </div>

          {/* Appointment Details */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">SERVICE DETAILS:</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Appointment Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(receipt.appointmentDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-semibold text-gray-900">Mobile Notary Service</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Signatures</p>
                  <p className="font-semibold text-gray-900">{receipt.numberOfSignatures}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900 capitalize">{receipt.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-600 mb-4">PAYMENT BREAKDOWN:</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Notary Service ({receipt.numberOfSignatures} signature{receipt.numberOfSignatures > 1 ? 's' : ''})</span>
                <span className="font-semibold text-gray-900">${receipt.baseFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Travel Fee</span>
                <span className="font-semibold text-gray-900">${receipt.travelFee.toFixed(2)}</span>
              </div>
              {receipt.surcharges > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Additional Surcharges</span>
                  <span className="font-semibold text-gray-900">${receipt.surcharges.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t-2 border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-navy-900">Total Paid</span>
                  <span className="text-2xl font-bold text-gold-500">${receipt.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-success-50 rounded-lg p-3 flex items-center">
                <svg className="w-5 h-5 text-success-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-success-800 font-semibold">Payment Status: {receipt.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-600 text-center">
              Issued on {new Date(receipt.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-600 text-center mt-2">
              Thank you for choosing LA Mobile Notary!
            </p>
            <p className="text-xs text-gray-500 text-center mt-4">
              This is an official receipt for services rendered. Keep for your records.
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
}
