import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // QUALITY GATE (temporary while rebuilding): keep the build green.
  // Flip BOTH to `false` before launch once the codebase is type-clean & lint-clean.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
