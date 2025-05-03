/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './app',
    }
    return config
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig 