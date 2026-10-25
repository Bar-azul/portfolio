import type { NextConfig } from "next";

// English is served at the root, Hebrew under /he.
// Pages are generated as /en/... and /he/...; the root URLs map onto /en internally.
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/en" },
        { source: "/projects/:slug", destination: "/en/projects/:slug" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
