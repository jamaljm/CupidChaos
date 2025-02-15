import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
      {
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
