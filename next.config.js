/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  swcMinify: true,
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ["app", "components", "lib", "config", "hooks"],
  },

  async redirects() {
    return [
      {
        source:
          "/:path((?!login|_next/static|_next/image|api|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)", // URL asal
        destination: "/login", // diarahkan ke sini
        permanent: true, // 308 redirect (search engine-friendly)
        missing: [
          {
            type: "cookie",
            key: "accessToken",
          },
          {
            type: "cookie",
            key: "refreshToken",
          },
        ],
      },
      {
        source:
          "/:path((?!dashboard|_next/static|_next/image|api|favicon\\.ico).*)", // URL asal
        destination: "/dashboard", // diarahkan ke sini
        permanent: false,
        has: [
          {
            type: "cookie",
            key: "accessToken",
          },
          {
            type: "cookie",
            key: "refreshToken",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
