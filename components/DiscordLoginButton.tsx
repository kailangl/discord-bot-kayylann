import { useRouter } from 'next/router';

export const DiscordLoginButton = () => {
  const router = useRouter();

  const handleLogin = () => {
    // Verifica se está rodando no navegador (window existe)
    if (typeof window === 'undefined') return;

    const isLocalhost = window.location.hostname === 'localhost';
    const isFirebaseEmulator = window.location.hostname.includes('cloudworkstations.dev');

    const redirectUri = isLocalhost
      ? 'http://localhost:3000/api/auth/callback'
      : isFirebaseEmulator
      ? 'https://9000-idx-discord-bot-kayylann-1745448333240.cluster-kc2r6y3mtba5mswcmol45orivs.cloudworkstations.dev/api/auth/callback'
      : 'https://seusite.com/api/auth/callback';

    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const scope = encodeURIComponent('identify guilds');

    // Redireciona para a URL de autenticação do Discord
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
  };

  return (
    <button 
      onClick={handleLogin}
      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded"
    >
      Login com Discord
    </button>
  );
};