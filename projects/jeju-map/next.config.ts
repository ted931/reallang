import type { NextConfig } from "next";

const basePath = process.env.NODE_ENV === "production" ? "/map" : "";

const nextConfig: NextConfig = {
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_KAKAO_JS_KEY: process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "",
    NEXT_PUBLIC_VWORLD_KEY: process.env.VWORLD_API_KEY || "",
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
