/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_JWT_SECRET: process.env.JWT_SECRET,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: [
              'http://localhost:8080',
              'https://bnb-frontend-delta.vercel.app',
            ],
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Authorization,Content-Type,X-Api-Key',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
