import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Prisma client from being bundled — required for Vercel/serverless
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
