import { useRouter } from 'next/router';

export const DiscordLoginButton = () => {
  const router = useRouter();

  const handleLogin = () => {
   
    if (typeof window === 'undefined') return;

    const isLocalhost = window.location.hostname === 'localhost';
    const isFirebaseEmulator = window.location.hostname.includes('cloudworkstations.dev');

    const redirectUri = isLocalhost
    ? 'http://localhost:3000/api/auth/callback/discord'
    : isFirebaseEmulator
    ? 'https://9000-idx...cloudworkstations.dev/api/auth/callback/discord'
    : 'https://seusite.com/api/auth/callback/discord';

    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const scope = encodeURIComponent('identify guilds');


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