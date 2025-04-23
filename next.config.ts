import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configurações básicas
  reactStrictMode: true,
  
  // Configurações para o Cloud Workstations
  allowedDevOrigins: [
    '9000-idx-discord-bot-kayylann-1745448333240.cluster-kc2r6y3mtba5mswcmol45orivs.cloudworkstations.dev'
  ],
  
  // Configurações de pacotes externos
  serverExternalPackages: ['@discordjs/rest'],
  
  // Configurações para Turbopack
  experimental: {
    turbo: {
      resolveAlias: {
        // Adicione aliases se necessário
      }
    }
  }
}

export default nextConfig