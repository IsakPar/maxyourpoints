/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'maxyourpoints.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      }
    ],
    unoptimized: false,
  },
  // Environment variables are now handled dynamically
  // Disable static generation for admin routes during build to prevent API calls
  async generateBuildId() {
    return 'max-your-points-' + Date.now().toString()
  }
}

export default nextConfig
