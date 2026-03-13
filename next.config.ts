import path from "path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://prepsight-e90d7.firebaseapp.com/__/auth/:path*",
      },
      {
        source: "/__/firebase/init.json",
        destination: "https://prepsight-e90d7.firebaseapp.com/__/firebase/init.json",
      },
    ]
  },
  async headers() {
    return [
      {
        // Allow Firebase Auth popups to communicate back
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
      {
        source: "/procedures/:path*",
        headers: [
          { key: "X-Frame-Options",  value: "DENY" },
          { key: "X-Robots-Tag",     value: "noindex, nofollow" },
          { key: "Cache-Control",    value: "no-store" },
        ],
      },
    ]
  },
}

export default nextConfig
