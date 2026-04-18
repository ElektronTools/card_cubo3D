import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    turbopack: {
      // Configura el WebSocket HMR explícitamente
      resolveAlias: {},
    },
  },
};

// Para development, especifica el puerto HMR
if (process.env.NODE_ENV === 'development') {
  (nextConfig as any).devIndicators = {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  };
}

export default nextConfig;
