import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase, testConnection } from "../lib/supabase";

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
    
    // Log dos headers de rate limit para debug
    console.log("Rate limit headers:", {
      limit: res.headers.get('X-RateLimit-Limit'),
      remaining: res.headers.get('X-RateLimit-Remaining'),
      reset: res.headers.get('X-RateLimit-Reset')
    });

    if (res.status === 429) {
      const retryAfter = Number(res.headers.get('Retry-After')) || backoff;
      if (retries <= 0) throw new Error('Rate limit excedido');
      
      console.log(`Rate limit atingido. Tentando novamente em ${retryAfter}ms...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    return await res.json();
  } catch (error) {
    if (retries <= 0) throw error;
    
    console.log(`Erro na requisição. Tentando novamente em ${backoff}ms...`);
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
        console.log("Dados carregados do cache local");
      }
    };

    loadCachedData();
    testConnection().then((result) => {
      if (!result.success) {
        setError(result.error?.message || "Falha na conexão com o banco de dados");
      }
    });
  }, []);

  const filterAndSetServers = async (userGuilds: DiscordGuild[]) => {
    try {
      // Verifica se podemos usar o cache do Supabase (válido por 1 minuto)
      const shouldFetchSupabase = Date.now() - lastSupabaseFetch > 60000 || botGuildsCache.length === 0;

      let botConfigs = botGuildsCache;

      if (shouldFetchSupabase) {
        console.log("Atualizando cache do Supabase");
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
        const hasAdminPermissions = (guild.permissions & 0x8) === 0x8 || guild.owner;
        return isBotInServer && hasAdminPermissions;
      });

      setServers(availableServers);
    } catch (err) {
      console.error("Erro ao filtrar servidores:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;

    const fetchServers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usar cache se disponível (válido por 5 minutos)
        if (cachedGuilds && Date.now() - Number(localStorage.getItem('guildsCacheTime')) < 300000) {
          console.log("Usando cache de servidores");
          await filterAndSetServers(cachedGuilds);
          return;
        }

        console.log("Buscando servidores da API do Discord");
        const userGuilds = await fetchWithRetry<DiscordGuild[]>(
          "https://discord.com/api/v10/users/@me/guilds",
          {
            headers: { 
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json"
            }
          }
        );

        // Atualizar cache
        setCachedGuilds(userGuilds);
        localStorage.setItem('guildsCacheTime', Date.now().toString());
        localStorage.setItem('cachedGuilds', JSON.stringify(userGuilds));

        await filterAndSetServers(userGuilds);
      } catch (err) {
        console.error("Erro ao carregar servidores:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        
        // Se houver erro mas tivermos cache, usar o cache
        if (cachedGuilds) {
          await filterAndSetServers(cachedGuilds);
          setError("Dados podem estar desatualizados. " + (err instanceof Error ? err.message : "Erro ao atualizar"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [status, session?.accessToken]);

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
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="ml-4">Carregando servidores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-md mx-auto mt-8">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
        <button onClick={handleRefresh} className="btn btn-sm btn-outline mt-2">
          Tentar novamente
        </button>
      </div>
    );
  }

  if (servers.length === 0 && status === "authenticated") {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-4">Nenhum servidor configurável encontrado</h2>
        <p className="mb-4">Verifique se:</p>
        <ul className="list-disc list-inside mb-6 text-left max-w-md mx-auto">
          <li>O bot foi adicionado ao servidor</li>
          <li>Você tem permissões de administrador no servidor</li>
          <li>O servidor aparece na tabela bot_config do Supabase</li>
        </ul>
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleRefresh}
            className="btn btn-primary"
          >
            Recarregar Servidores
          </button>
          <button
            onClick={() => testConnection().then(console.log)}
            className="btn btn-outline"
          >
            Testar Conexão com o Banco
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Selecione um servidor para configurar</h1>
        <div className="flex gap-2">
          {cachedGuilds && (
            <span className="text-sm text-gray-500 self-center">
              Atualizado em: {new Date(Number(localStorage.getItem('guildsCacheTime'))).toLocaleTimeString()}
            </span>
          )}
          <button onClick={handleRefresh} className="btn btn-sm btn-outline">
            Atualizar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map(server => (
          <div
            key={server.id}
            className="card bg-base-200 hover:bg-base-300 transition cursor-pointer"
            onClick={() => handleSelectServer(server.id)}
          >
            <div className="card-body">
              <div className="flex items-center gap-4">
                {server.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp?size=128`}
                    alt={server.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-neutral flex items-center justify-center text-xl font-bold">
                    {server.name.charAt(0)}
                  </div>
                )}
                <h2 className="card-title">{server.name}</h2>
              </div>
              <div className="badge badge-info mt-2">
                {server.owner ? 'Dono' : 'Administrador'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botão de debug - pode remover em produção */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <button
          onClick={() => {
            console.log("Servidores carregados:", servers);
            console.log("Cache local:", cachedGuilds);
            console.log("Cache Supabase:", botGuildsCache);
            testConnection().then(console.log);
          }}
          className="btn btn-sm btn-warning"
        >
          Debug
        </button>
      </div>
    </div>
  );
}