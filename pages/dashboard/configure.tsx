import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import styles from "../../styles/Home.module.css";
interface BotConfig {
  guild_id: string;
  ai_channel_id: string | null;
  welcome_channel_id: string | null;
  resposta_estatica: string | null;
  resposta_ia: boolean; // Used for "AI Improved Reasons" toggle
  admin_role_id: string | null;
  p_log_id: string | null;
  warn_limit: number | null; // Changed to allow null
  warns: any;
  use_ai_welcome?: boolean;
  // Placeholder for server info, you might fetch this differently
  server_name?: string;
  server_icon_url?: string;
}

interface DiscordChannel {
  id: string;
  name: string;
  type: number; // 0 for text, 2 for voice, etc.
}

type ChannelFields = 'ai_channel_id' | 'welcome_channel_id' | 'p_log_id';

// Placeholder server data (replace with actual data fetching if needed)
const DUMMY_SERVER_INFO = {
  server_name: "Dono Server", // Example name
  server_icon_url: "https://cdn.discordapp.com/embed/avatars/0.png", // Example icon
  user_role: "Dono" // Example role
};


export default function ConfigureBot() {
  const router = useRouter();
  const { guildId } = router.query;
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChannelSelect, setShowChannelSelect] = useState<{
    type: ChannelFields;
    visible: boolean;
  }>({ type: "ai_channel_id", visible: false });
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(false);

  useEffect(() => {
    if (!guildId) return;

    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from("bot_config")
          .select("*")
          .eq("guild_id", guildId)
          .single();

        if (supabaseError && supabaseError.code !== 'PGRST116') { // PGRST116: single row not found
            throw supabaseError;
        }

        const defaultConfig: BotConfig = {
          guild_id: guildId as string,
          ai_channel_id: null,
          welcome_channel_id: null,
          resposta_estatica: null,
          resposta_ia: false, // Default for AI Improved Reasons
          admin_role_id: null,
          p_log_id: null,
          warn_limit: null, // Default Warn Limit to null
          warns: {},
          use_ai_welcome: false,
          // Add server info from dummy data or fetch it
          server_name: DUMMY_SERVER_INFO.server_name,
          server_icon_url: DUMMY_SERVER_INFO.server_icon_url,
        };

        setConfig(data || defaultConfig);
      } catch (err) {
        console.error("Erro ao carregar configuração:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido ao carregar config");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [guildId]);

  const fetchChannels = async () => {
    if (!guildId) return;
    
    // Avoid refetching if channels are already loaded for this session
    // You might want a more sophisticated caching or check if guildId changed
    if (channels.length > 0 && !channelsLoading) {
        // If we already have channels, maybe don't refetch unless forced
        // For now, always refetch when opening selector, as per original logic
    }

    try {
      setChannelsLoading(true);
      const response = await fetch(`/api/channel_list/${guildId}/channels`); // Ensure this API endpoint is correct
      if (!response.ok) throw new Error("Failed to fetch channels");
      
      const data = await response.json();
      const textChannels = data.filter((channel: DiscordChannel) => channel.type === 0);
      setChannels(textChannels);
    } catch (err) {
      console.error("Error fetching channels:", err);
      setError("Failed to load channel list"); // Show error to user
      setChannels([]); // Clear channels on error
    } finally {
      setChannelsLoading(false);
    }
  };

  const handleOpenChannelSelect = (type: ChannelFields) => {
    // Fetch channels each time select is opened, or cache them
    fetchChannels(); 
    setShowChannelSelect({ type, visible: true });
  };

  const saveConfig = async (updates: Partial<BotConfig>) => {
    if (!config) return;

    try {
      // setLoading(true); // Optional: show loading spinner on each save
      setError(null);

      const newConfig = { ...config, ...updates };
      const { error: supabaseError } = await supabase
        .from("bot_config")
        .upsert(newConfig, { onConflict: "guild_id" });

      if (supabaseError) throw supabaseError;

      setConfig(newConfig);
    } catch (err) {
      console.error("Erro ao salvar configuração:", err);
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      // setLoading(false);
    }
  };

  const clearField = (field: keyof BotConfig) => {
    // Ensure type compatibility for null assignment
    const nullAssignableFields: (keyof BotConfig)[] = [
        'ai_channel_id', 'welcome_channel_id', 'resposta_estatica', 
        'admin_role_id', 'p_log_id', 'warn_limit'
    ];
    if (nullAssignableFields.includes(field)) {
        saveConfig({ [field]: null } as any); // Use 'as any' for simplicity here or type check properly
    } else if (field === 'use_ai_welcome' || field === 'resposta_ia') {
        saveConfig({ [field]: false }); // Booleans might reset to false
    }
    // Handle other types if necessary
  };


  const handleChannelSelect = (channelId: string) => {
    saveConfig({ [showChannelSelect.type]: channelId });
    setShowChannelSelect({ type: "ai_channel_id", visible: false }); // Reset type for safety
  };

  const getChannelName = (channelId: string | null) => {
    if (!channelId) return "";
    const channel = channels.find(c => c.id === channelId);
    return channel ? channel.name : channelId; // Fallback to ID if name not found
  };


  if (!guildId) {
    return <div className="text-center mt-10 text-white">Nenhum servidor selecionado</div>;
  }

  if (loading && !config) { // Show initial loading spinner
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error && !config) { // Show error if initial loading failed
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <div className="alert alert-error max-w-md mx-auto mt-8">
          <span>{error}</span>
        </div>
      </div>
    );
  }
  
  return (
    <>
     <Header />
    <div className="bg-mainbg min-h-screen text-white p-4 md:p-8">

  
     
      <div className="max-w-6xl mx-auto"> {/* Increased max-width for two columns */}
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 sm:mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Bot Config</h1>
            <p className="text-gray-400 text-sm">configure the bot to your preference</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <img 
                src={config?.server_icon_url || DUMMY_SERVER_INFO.server_icon_url} 
                alt="Server Icon" 
                className="w-12 h-12 rounded-full bg-neutral-700 object-cover"
            />
            <div>
              <p className="font-semibold text-lg">{config?.server_name || DUMMY_SERVER_INFO.server_name}</p>
              <p className="text-sm text-gray-400">{DUMMY_SERVER_INFO.user_role}</p>
            </div>
            {/* Ban button from image - not implemented as it's out of form scope */}
            {/* <button className="btn btn-sm bg-red-600 hover:bg-red-700 text-white ml-4">Ban</button> */}
          </div>
        </div>

        {error && ( // Display non-critical errors here
             <div className="alert alert-error max-w-full mx-auto my-4">
               <span>{error}</span>
               <button className="btn btn-ghost btn-sm" onClick={() => setError(null)}>✕</button>
             </div>
        )}

        {config && (
          <div className="md:flex md:space-x-6 lg:space-x-8 space-y-8 md:space-y-0">
            {/* GENERAL CONFIG */}
            <div className="bg-secbg rounded-xl p-6 md:w-1/2 flex flex-col space-y-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-0 text-gray-100">GENERAL CONFIG</h2>

              {/* AI CHANNEL */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">AI CHANNEL:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getChannelName(config.ai_channel_id) || ""}
                    onClick={() => handleOpenChannelSelect('ai_channel_id')}
                    className="input input-bordered bg-mfield flex-1 h-10 text-white placeholder-gray-500 cursor-pointer focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Not Selected"
                  />
                  <button onClick={() => clearField('ai_channel_id')} className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-2 h-10 flex items-center" disabled={!config.ai_channel_id}>✕</button>
                  <button onClick={() => handleOpenChannelSelect('ai_channel_id')} className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-2 h-10 flex items-center" disabled={channelsLoading && showChannelSelect.type === 'ai_channel_id'}>
                    {(channelsLoading && showChannelSelect.type === 'ai_channel_id') ? <span className="loading loading-spinner loading-xs"></span> : '▼'}
                  </button>
                </div>
              </div>

              {/* WELCOME CHANNEL */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">WELCOME CHANNEL:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getChannelName(config.welcome_channel_id) || ""}
                    onClick={() => handleOpenChannelSelect('welcome_channel_id')}
                    className="input input-bordered bg-mfield flex-1 h-10 text-white placeholder-gray-500 cursor-pointer focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Not Selected"
                  />
                  <button onClick={() => clearField('welcome_channel_id')} className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-2 h-10 flex items-center" disabled={!config.welcome_channel_id}>✕</button>
                  <button onClick={() => handleOpenChannelSelect('welcome_channel_id')} className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-2 h-10 flex items-center" disabled={channelsLoading && showChannelSelect.type === 'welcome_channel_id'}>
                    {(channelsLoading && showChannelSelect.type === 'welcome_channel_id') ? <span className="loading loading-spinner loading-xs"></span> : '▼'}
                  </button>
                </div>
              </div>
              
              {/* WELCOME MESSAGE TOGGLE */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex-grow">
                    <span className="text-sm font-medium text-gray-300">WELCOME MESSAGE:</span>
                    <p className="text-xs text-gray-500 mt-0.5">Use AI to generate creative welcome message</p>
                </div>
                <label className="inline-flex items-center cursor-pointer ml-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={config.use_ai_welcome || false}
                      onChange={(e) => saveConfig({ use_ai_welcome: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-mfield rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                </label>
              </div>

              {/* STATIC MESSAGE */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">STATIC MESSAGE:</label>
                <textarea
                  value={config.resposta_estatica || ''}
                  onChange={(e) => saveConfig({ resposta_estatica: e.target.value || null })}
                  className="textarea textarea-bordered bg-mfield w-full h-24 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="write the static response"
                ></textarea>
              </div>
            </div>

            {/* MODERATION */}
            <div className="bg-secbg rounded-xl p-6 md:w-1/2 flex flex-col space-y-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-0 text-gray-100">MODERATION</h2>

              {/* WARNS LIMIT */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">WARNS LIMIT:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={config.warn_limit === null ? '' : config.warn_limit}
                    onChange={(e) => saveConfig({ warn_limit: e.target.value === '' ? null : Number(e.target.value) })}
                    className="input input-bordered bg-mfield flex-1 h-10 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="NULL"
                    min="1"
                    max="100" // Max from image is not clear, setting a reasonable one
                  />
                   <button onClick={() => saveConfig({ warn_limit: null })} className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-2 h-10 flex items-center" disabled={config.warn_limit === null}>✕</button>
                </div>
              </div>

              {/* PUNISHMENTS LOGS CHANNEL */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">PUNISHMENTS LOGS CHANNEL:</label>
                 <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getChannelName(config.p_log_id) || ""}
                    onClick={() => handleOpenChannelSelect('p_log_id')}
                    className="input input-bordered bg-mfield flex-1 h-10 text-white placeholder-gray-500 cursor-pointer focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Not Selected"
                  />
                  <button onClick={() => clearField('p_log_id')} className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-2 h-10 flex items-center" disabled={!config.p_log_id}>✕</button>
                  <button onClick={() => handleOpenChannelSelect('p_log_id')} className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-2 h-10 flex items-center" disabled={channelsLoading && showChannelSelect.type === 'p_log_id'}>
                     {(channelsLoading && showChannelSelect.type === 'p_log_id') ? <span className="loading loading-spinner loading-xs"></span> : '▼'}
                  </button>
                </div>
              </div>

              {/* ADMIN ROLE */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">ADMIN ROLE:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text" // In a real scenario, this might be a role selector similar to channel selector
                    value={config.admin_role_id || ''}
                    onChange={(e) => saveConfig({ admin_role_id: e.target.value || null })}
                    className="input input-bordered bg-mfield flex-1 h-10 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter Role ID"
                  />
                  <button onClick={() => clearField('admin_role_id')} className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-2 h-10 flex items-center" disabled={!config.admin_role_id}>✕</button>
                </div>
              </div>

              {/* AI IMPROVED REASONS TOGGLE */}
              <div className="flex items-center justify-between pt-1">
                 <div className="flex-grow">
                    <span className="text-sm font-medium text-gray-300">AI IMPROVED REASONS:</span>
                    <p className="text-xs text-gray-500 mt-0.5">Use AI to improve ban/warn/timeout reasons automatically</p>
                </div>
                <label className="inline-flex items-center cursor-pointer ml-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={config.resposta_ia || false} // Assuming 'resposta_ia' is for this feature
                      onChange={(e) => saveConfig({ resposta_ia: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-neutral-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Channel selection modal */}
        {showChannelSelect.visible && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-800 p-6 rounded-lg max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Select Channel</h3>
              {channelsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="loading loading-spinner loading-lg text-purple-500"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar pr-2"> {/* Added pr for scrollbar */}
                    {channels.length > 0 ? (
                      channels.map(channel => (
                        <div
                          key={channel.id}
                          className="p-2.5 hover:bg-neutral-700 rounded cursor-pointer flex items-center text-gray-300 hover:text-white transition-colors duration-150"
                          onClick={() => handleChannelSelect(channel.id)}
                        >
                          <span className="text-gray-500 mr-2">#</span>
                          <span>{channel.name}</span>
                          <span className="ml-auto text-xs text-gray-500 font-mono">{channel.id}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        No text channels found or accessible in this server.
                      </div>
                    )}
                  </div>
                  <button
                    className="btn btn-ghost mt-4 self-end text-gray-400 hover:text-white"
                    onClick={() => setShowChannelSelect({ type: 'ai_channel_id', visible: false })}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}