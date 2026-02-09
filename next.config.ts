import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ...(process.env.API_URL && { API_URL: process.env.API_URL }),
    ...(process.env.API_KEY && { API_KEY: process.env.API_KEY }),
    // Turbopack solo inlinea NEXT_PUBLIC_* en el cliente.
    // Estos alias garantizan que API_URL/API_KEY lleguen al browser.
    ...(process.env.API_URL && { NEXT_PUBLIC_API_URL: process.env.API_URL }),
    ...(process.env.API_KEY && { NEXT_PUBLIC_API_KEY: process.env.API_KEY }),
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000', '*.windsurf.ai'],
    },
  },
};

export default nextConfig;
