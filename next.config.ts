/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://express-production-3cab.up.railway.app/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
