/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for development stability
  experimental: {
    // Reduce memory usage
    optimizeCss: false,
  },
  
  // Better error handling
  onDemandEntries: {
    // Keep pages in memory for 25 seconds
    maxInactiveAge: 25 * 1000,
    // Only keep 5 pages in memory at once
    pagesBufferLength: 2,
  },
  
  // Suppress the url.parse deprecation warnings for RSS parser
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
    }
    return config;
  },
  
  // Better development experience
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: [
      'images.unsplash.com',
      'unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'source.unsplash.com'
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  }
}

module.exports = nextConfig
