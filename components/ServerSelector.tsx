import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase, testConnection } from "../lib/supabase"; 
import Header from "./Header";

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  permissions: number;
  owner: boolean;
}

interface BotConfig {
  guild_id: string;
  ai_channel_id: string | null;
  welcome_channel_id: string | null;
  resposta_estatica: string | null;
  resposta_ia: boolean;
  admin_role_id: string | null;
  p_log_id: string | null;
  warn_limit: number;
  warns: any;
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  retries = 3,
  backoff = 300
): Promise<T> {
  try {
    const res = await fetch(url, options);

    console.log("Rate limit headers:", {
      limit: res.headers.get('X-RateLimit-Limit'),
      remaining: res.headers.get('X-RateLimit-Remaining'),
      reset: res.headers.get('X-RateLimit-Reset')
    });

    if (res.status === 429) {
      const retryAfter = Number(res.headers.get('Retry-After')) || backoff;
      if (retries <= 0) throw new Error('Rate limit exceeded'); 
      
      console.log(`Rate limit reached. Retrying in ${retryAfter}ms...`); 
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return await res.json();
  } catch (error) {
    if (retries <= 0) throw error;

    console.log(`Error in request. Retrying in ${backoff}ms...`); 
    await new Promise(resolve => setTimeout(resolve, backoff * 1000));
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
}


export default function ServerSelector() {
  const { data: session, status } = useSession();
  const [servers, setServers] = useState<DiscordGuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cachedGuilds, setCachedGuilds] = useState<DiscordGuild[] | null>(null);
  const [botGuildsCache, setBotGuildsCache] = useState<Pick<BotConfig, 'guild_id'>[]>([]);
  const [lastSupabaseFetch, setLastSupabaseFetch] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const loadCachedData = () => {
      const cachedTime = localStorage.getItem('guildsCacheTime');
      const cachedData = localStorage.getItem('cachedGuilds');

      if (cachedTime && cachedData && Date.now() - Number(cachedTime) < 300000) {
        setCachedGuilds(JSON.parse(cachedData));
        console.log("Data loaded from local cache"); 
      }
    };

    loadCachedData();
    
    testConnection().then((result) => {
      if (!result.success) {
        setError(result.error?.message || "Failed to connect to the database"); 
      }
    });
  }, []);

  const filterAndSetServers = async (userGuilds: DiscordGuild[]) => {
    try {
      const shouldFetchSupabase = Date.now() - lastSupabaseFetch > 60000 || botGuildsCache.length === 0;

      let botConfigs = botGuildsCache;

      if (shouldFetchSupabase) {
        console.log("Updating Supabase cache"); 
        const { data, error } = await supabase
          .from("bot_config")
          .select("guild_id")
          .returns<Pick<BotConfig, 'guild_id'>[]>();

        if (error) throw error;

        botConfigs = data || [];
        setBotGuildsCache(botConfigs);
        setLastSupabaseFetch(Date.now());
      }

      const availableServers = userGuilds.filter(guild => {
        const isBotInServer = botConfigs.some(config => config.guild_id === guild.id);
        const hasAdminPermissions = (BigInt(guild.permissions) & BigInt(0x8)) === BigInt(0x8) || guild.owner;
        return isBotInServer && hasAdminPermissions;
      });

      setServers(availableServers);
    } catch (err) {
      console.error("Error filtering servers:", err); 
      throw err;
    }
  };

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;

    const fetchServers = async () => {
      try {
        setLoading(true);
        setError(null);

        if (cachedGuilds && Date.now() - Number(localStorage.getItem('guildsCacheTime')) < 300000) {
          console.log("Using server cache"); 
          await filterAndSetServers(cachedGuilds);
          return;
        }

        console.log("Fetching servers from Discord API"); 
        const userGuilds = await fetchWithRetry<DiscordGuild[]>(
          "https://discord.com/api/v10/users/@me/guilds",
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json"
            }
          }
        );

        setCachedGuilds(userGuilds);
        localStorage.setItem('guildsCacheTime', Date.now().toString());
        localStorage.setItem('cachedGuilds', JSON.stringify(userGuilds));

        await filterAndSetServers(userGuilds);
      } catch (err) {
        console.error("Error loading servers:", err); 
        setError(err instanceof Error ? err.message : "Unknown error"); 

        if (cachedGuilds) {
          await filterAndSetServers(cachedGuilds);
          setError("Data might be outdated. " + (err instanceof Error ? err.message : "Error updating")); 
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [status, session?.accessToken, cachedGuilds]); 

  const handleSelectServer = (guildId: string) => {
    router.push(`/dashboard/configure?guildId=${guildId}`);
  };

  const handleRefresh = () => {
    localStorage.removeItem('guildsCacheTime');
    setCachedGuilds(null);
    setLoading(true);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-mainbg text-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        <p className="mt-4 text-xl font-semibold">Loading servers...</p> 
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-mainbg text-gray-100 p-4">
        <div className="bg-red-900 bg-opacity-40 border border-red-700 text-red-100 p-6 rounded-lg shadow-xl text-center max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current mx-auto mb-4 h-12 w-12 text-red-300" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-3">Error Loading!</h2> 
          <p className="mb-6 text-lg">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105"
          >
            Try Again 
          </button>
        </div>
      </div>
    );
  }

  if (servers.length === 0 && status === "authenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-mainbg text-gray-100 p-4">
        <div className="bg-gray-800 bg-opacity-70 border border-gray-700 p-8 rounded-xl shadow-xl text-center max-w-lg w-full">
          <h2 className="text-3xl font-bold mb-4 text-white">No Configurable Servers Found</h2> 
          <p className="text-gray-300 mb-6 text-lg">It seems there are no servers where you can configure Lunny.</p> 
          <ul className="list-disc list-inside mb-8 text-left text-gray-300 max-w-sm mx-auto space-y-2">
            <li>Has the bot been **added** to the server?</li> 
            <li>Do you have **administrator permissions** on the server?</li> 
            <li>Is the server registered in the `bot_config` table in Supabase?</li> 
          </ul>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105"
            >
              Reload Servers 
            </button>
            <a
              href="https://discord.com/api/oauth2/authorize?client_id=1015720769998835863&permissions=8&scope=bot%20applications.commands" // Your bot invite link
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-600 text-gray-200 font-medium rounded-lg hover:bg-gray-700 transition-colors transform hover:scale-105 inline-flex items-center justify-center"
            >
              Add Lunny to Server 
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header />
    <div className="min-h-screen bg-mainbg text-gray-100 p-4 sm:p-8 flex flex-col items-center">
      
      <div className="w-full max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-0">Select a Server</h1> 
          <div className="flex items-center gap-4">
            {cachedGuilds && (
              <span className="text-sm text-gray-400">
                Updated at: {new Date(Number(localStorage.getItem('guildsCacheTime'))).toLocaleTimeString()} 
              </span>
            )}
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0114 0v.099a1 1 0 01-2 0 5.002 5.002 0 00-10 0V3a1 1 0 011-1zm1 8a1 1 0 100 2h3a1 1 0 100-2H5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM4 9a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Refresh 
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servers.map(server => (
            <div
              key={server.id}
              className="relative p-6 bg-gray-800/20 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer border-2 border-blue-500"
              onClick={() => handleSelectServer(server.id)}
            >
              <div className="flex items-center gap-4 mb-4">
                {server.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp?size=128`}
                    alt={server.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-500 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                    {server.name.charAt(0)}
                  </div>
                )}
                <h2 className="text-xl font-semibold text-white truncate flex-grow">{server.name}</h2>
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full shadow-md">
                  {server.owner ? 'Owner' : 'Administrator'} 
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-2">Click to configure</p> 
            </div>
          ))}
        </div>
      </div>

   
      <div className="fixed bottom-4 right-4 z-50">
     
      </div>
    </div>
    </>
  );
}