import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
//  swcMinify: true,
  eslint: {
    // Con esto, Next.js ignorará todos los errores de ESLint en la fase de "build"
    ignoreDuringBuilds: true,
  },
  images: {
    // Si en tu proyecto usas <Image src="https://...">, añade aquí los dominios correctos.
    domains: ["localhost", "tu-api-o-cdn.com"],
  },
  // (Puedes añadir aquí cualquier otra configuración que necesites)
};

export default nextConfig;
