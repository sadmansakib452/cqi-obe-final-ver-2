// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "standalone",
// };

// export default nextConfig;

const nextConfig = {
  output: "standalone",
  images: {
    domains: ["lh3.googleusercontent.com"], // Allow images from Google
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip linting during builds
  },
};

export default nextConfig;
