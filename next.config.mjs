/** @type {import('next').NextConfig} */
const nextConfig = {
  // instrumentationHook is now enabled by default in Next.js 15
  // Removed deprecated experimental.instrumentationHook
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
