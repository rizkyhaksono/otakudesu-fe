/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "otakudesu.best",
      },
      {
        protocol: "https",
        hostname: "kiryuu01.com",
      },
      {
        protocol: "https",
        hostname: "r2.uqni.net",
      },
      {
        protocol: "https",
        hostname: "d40b35e2.delivery.rocketcdn.me",
      },
      {
        protocol: "https",
        hostname: "cdn.uqni.net",
      },
      {
        protocol: "https",
        hostname: "tv1.idlix.my",
      },
      {
        protocol: "https",
        hostname: "c4.wallpaperflare.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/anime/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
