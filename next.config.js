/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.binance.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["antd", "@ant-design/icons", "recharts"],
  },
};

module.exports = nextConfig;
