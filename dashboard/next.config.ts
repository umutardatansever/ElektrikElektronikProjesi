import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages projesi alt klasörde barındırdığı için basePath ekliyoruz
  basePath: isProd ? '/ElektrikElektronikProjesi' : '',
  // Görseller ve css/js dosyaları için assetPrefix
  assetPrefix: isProd ? '/ElektrikElektronikProjesi/' : '',
  images: {
    unoptimized: true, // Statik export için görsel optimizasyonu kapatılmalıdır
  },
};

export default nextConfig;
