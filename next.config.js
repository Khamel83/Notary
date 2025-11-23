/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Allow external access
  async rewrites() {
    return [];
  },
  // Enable standalone output for Docker
  output: 'standalone',
}

module.exports = nextConfig
