import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingIncludes: {
    '/*': ['./dev.db'],
    '/api/**/*': ['./dev.db'],
    '/**/*': ['./dev.db'],
  },
};

export default nextConfig;
