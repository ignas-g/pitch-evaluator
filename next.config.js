/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN,
  },
}

module.exports = nextConfig
