
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.LOCAL_TEST ? undefined : 'standalone',
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

export default nextConfig
