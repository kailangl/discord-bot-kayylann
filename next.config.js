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
    ];
  },
  reactStrictMode: true,
 

  experimental: {
    
    serverComponentsExternalPackages: ['@discordjs/rest'],
    turbo: {
      resolveAlias: {
        
      }
    }
  }
}

module.exports = nextConfig;