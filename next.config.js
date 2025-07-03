/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/auth/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval'
                www.highperformanceformat.com
                pl27067393.profitableratecpm.com
                *.highperformanceformat.com
                *.profitableratecpm.com;
              img-src 'self' data: blob:
                www.highperformanceformat.com
                pl27067393.profitableratecpm.com
                *.highperformanceformat.com
                *.profitableratecpm.com;
              frame-src 'self'
                www.highperformanceformat.com
                pl27067393.profitableratecpm.com;
              style-src 'self' 'unsafe-inline';
              connect-src 'self'
                www.highperformanceformat.com
                pl27067393.profitableratecpm.com;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ];
  },
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ["@discordjs/rest"],
    turbo: {
      resolveAlias: {},
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.highperformanceformat.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pl27067393.profitableratecpm.com',
        pathname: '/**',
      },
    ],
    domains: [
      "www.highperformanceformat.com",
      "pl27067393.profitableratecpm.com",
    ],
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;