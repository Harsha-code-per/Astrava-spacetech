import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/nasa-cad',
        destination: 'https://ssd-api.jpl.nasa.gov/cad.api',
      },
    ];
  },
};

export default nextConfig;
