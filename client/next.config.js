/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Disable source maps in production
    if (!isServer) {
      config.devtool = "eval";
    }
    return config;
  },
  // Add custom configurations
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
