/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["lh3.googleusercontent.com"], // Allow images from Google
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip linting during builds
  },
  // Remove basePath as it's no longer needed
  basePath: '',  // Ensure base path is empty for root access

  // Ensure that all static files and API routes are served from the root
  async rewrites() {
    return [
      {
        source: '/api/:path*',  // Match /api/* paths
        destination: '/api/:path*',  // Rewrites to /api/* with no base path
      },
    ];
  },
};

export default nextConfig;

