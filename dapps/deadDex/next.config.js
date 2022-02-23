/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  compiler: {
    styledComponents: true,
  }
}

module.exports = nextConfig
