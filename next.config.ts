import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "blog.piccreativespace.id", pathname: "/static/thumbs/:path*" },
      { protocol: "https", hostname: "photos.piccreativespace.id", pathname: "/:path*" },
      { protocol: "https", hostname: "piccreativespace.id", pathname: "/**" },
    ],
  },
};

export default nextConfig;
