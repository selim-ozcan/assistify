/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    authServiceUrl: "http://localhost:3001/auth",
  },
  reactStrictMode: false,
  images: {
    domains: [
      "tailwindui.com",
      "images.unsplash.com",
      "as1.ftcdn.net",
      "plus.unsplash.com",
      "cdn.dsmcdn.com",
    ],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
