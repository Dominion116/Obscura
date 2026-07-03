import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@obscura/shared"],
  // The Zama Relayer SDK ships WASM; keep it out of server bundles.
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  async headers() {
    return [
      {
        // Required for the Relayer SDK's threaded WASM (SharedArrayBuffer).
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;
