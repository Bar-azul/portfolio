import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/he", permanent: false }];
  },
};

export default nextConfig;
