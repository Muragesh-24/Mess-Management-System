/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Add your Railway backend URL for API rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://mess-management-system-production.up.railway.app/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;