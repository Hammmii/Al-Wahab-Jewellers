import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Quality gate: type-check during build (fail the build on type errors).
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Remote image hosts used by product imagery and uploads.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      // Supabase Storage CDN: <project-ref>.supabase.co
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
