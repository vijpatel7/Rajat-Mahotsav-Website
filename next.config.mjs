/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  webpack: (config, { webpack }) => {
    config.resolve = config.resolve || {}
    config.resolve.fallback = config.resolve.fallback || {}
    config.resolve.alias = config.resolve.alias || {}
    config.resolve.fallback.canvas = false
    config.resolve.alias.canvas = false
    config.plugins = config.plugins || []
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^canvas$/ }))
    return config
  },
  async redirects() {
    return [
      {
        source: '/share-memories',
        destination: '/memories',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
