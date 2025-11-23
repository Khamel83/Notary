export default function Services() {
  const services = [
    {
      name: 'Acknowledgments',
      description: 'Verify the identity of signers who acknowledge they signed a document willingly.',
      price: '$15 per signature',
      icon: '✍️',
    },
    {
      name: 'Jurats',
      description: 'Administer an oath or affirmation that the content of a document is true.',
      price: '$15 per signature',
      icon: '⚖️',
    },
    {
      name: 'Oaths & Affirmations',
      description: 'Administer verbal oaths or affirmations for various legal purposes.',
      price: '$15 per oath',
      icon: '🤝',
    },
    {
      name: 'Copy Certifications',
      description: 'Certify that a copy of a document is a true and accurate reproduction.',
      price: '$15 per certification',
      icon: '📋',
    },
    {
      name: 'Signature Witnessing',
      description: 'Witness the signing of documents requiring notarial presence.',
      price: '$15 per signature',
      icon: '👁️',
    },
    {
      name: 'Loan Signings',
      description: 'Complete notarization for real estate loans, refinances, and HELOCs.',
      price: 'Custom pricing',
      icon: '🏠',
    },
    {
      name: 'Power of Attorney',
      description: 'Notarize power of attorney documents for legal and financial matters.',
      price: '$15 per signature',
      icon: '📜',
    },
    {
      name: 'Real Estate Documents',
      description: 'Notarize deeds, title transfers, and other real estate documents.',
      price: '$15 per signature',
      icon: '🔑',
    },
    {
      name: 'Business Documents',
      description: 'Corporate documents, contracts, and business agreements.',
      price: '$15 per signature',
      icon: '💼',
    },
    {
      name: 'Apostille Preparation',
      description: 'Prepare documents for apostille certification for international use.',
      price: 'Custom pricing',
      icon: '🌍',
    },
    {
      name: 'Medical Documents',
      description: 'Healthcare directives, medical POAs, and HIPAA authorizations.',
      price: '$15 per signature',
      icon: '🏥',
    },
    {
      name: 'Immigration Documents',
      description: 'I-9 verification, affidavits of support, and immigration forms.',
      price: '$15 per signature',
      icon: '✈️',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-notary-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-200">
            Professional notary services for all your legal document needs
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.name}
              className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-notary-navy mb-3">
                {service.name}
              </h3>
              <p className="text-gray-600 mb-4 min-h-[60px]">
                {service.description}
              </p>
              <div className="pt-4 border-t border-gray-200">
                <span className="text-sm font-semibold text-notary-gold">
                  {service.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-2xl font-bold text-notary-navy mb-4">
              Mobile Service
            </h3>
            <p className="text-gray-700 mb-4">
              All services available at your location throughout Los Angeles County.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>✅ Base travel fee: $75</li>
              <li>✅ We come to your home, office, or hospital</li>
              <li>✅ Same-day appointments available</li>
              <li>✅ Evening and weekend service</li>
            </ul>
          </div>

          <div className="card bg-green-50 border-green-200">
            <h3 className="text-2xl font-bold text-notary-navy mb-4">
              California Compliant
            </h3>
            <p className="text-gray-700 mb-4">
              All services follow California Secretary of State regulations.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>✅ Licensed California Notary Public</li>
              <li>✅ $15 per signature (CA maximum)</li>
              <li>✅ Proper identification verification</li>
              <li>✅ Complete journal entries maintained</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center card bg-gradient-to-r from-notary-navy to-primary-700 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-gray-200">
            Book your appointment now and get instant pricing
          </p>
          <a href="/#booking" className="btn-primary bg-notary-gold hover:bg-notary-gold/90">
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}
