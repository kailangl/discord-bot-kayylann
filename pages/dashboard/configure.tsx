import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import styles from "../../styles/Home.module.css";


import {
  Settings,
  Shield,
  MessageSquareText,
  BellRing,
  UserCheck,
  Zap,
  BookText,
  X,
  ChevronDown,
  Hash,
  Ban,
  ThumbsUp,
  OctagonAlert,
  AlertCircle,
  Rocket,
  Send,
  Users,
  ZapOff,
  Gavel,
  Crown,
  Scale,
} from "lucide-react";

interface BotConfig {
  guild_id: string;
  ai_channel_id: string | null;
  welcome_channel_id: string | null;
  resposta_estatica: string | null;
  resposta_ia: boolean;
  admin_role_id: string | null;
  p_log_id: string | null;
  warn_limit: number | null;
  warns: any;
  improved_reasons?: boolean;
  offense_detect: number | null;
  server_name?: string;
  server_icon_url?: string;
}

interface DiscordChannel {
  id: string;
  name: string;
  type: number;
}

interface DiscordRole {
  id: string;
  name: string;
  color: number;
}

type ChannelFields = 'ai_channel_id' | 'welcome_channel_id' | 'p_log_id';

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

  const [showOffenseDetectorSelect, setShowOffenseDetectorSelect] = useState(false);

  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [roles, setRoles] = useState<DiscordRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  const offenseLevels = [
    { value: 0, label: "Disabled", description: "Offense detection is inactive. No messages will be checked.", icon: <Ban size={18} className="mr-2 text-gray-400" /> },
    { value: 1, label: "Moderate", description: "only direct insults and hate speech. Allows casual swearing.", icon: <ThumbsUp size={18} className="mr-2 text-green-400" /> },
    { value: 2, label: "Strict", description: "any inappropriate language, insults, slurs, and profanity.", icon: <OctagonAlert size={18} className="mr-2 text-yellow-400" /> },
  ];

  const fetchChannels = useCallback(async () => {
    if (!guildId) return;
    if (channels.length > 0 && !showChannelSelect.visible) {
      return;
    }
    try {
      setChannelsLoading(true);
      const response = await fetch(`/api/channel_list/${guildId}/channels`);
      if (!response.ok) throw new Error("Failed to fetch channels");
      const data = await response.json();
      const textChannels = data.filter((channel: DiscordChannel) => channel.type === 0);
      setChannels(textChannels);
    } catch (err) {
      console.error("Error fetching channels:", err);
      setError("Failed to load channel list");
      setChannels([]);
    } finally {
      setChannelsLoading(false);
    }
  }, [guildId, channels.length, showChannelSelect.visible]);

  const fetchRoles = useCallback(async () => {
    if (!guildId) return;
    if (roles.length > 0) return; 

    try {
        setRolesLoading(true);
        const response = await fetch(`/api/role_list/${guildId}/roles`);
        if (!response.ok) throw new Error("Failed to fetch roles");
        const data = await response.json();
        setRoles(data);
    } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to load role list");
        setRoles([]);
    } finally {
        setRolesLoading(false);
    }
  }, [guildId, roles.length]);

  useEffect(() => {
    if (!guildId) return;

    const fetchConfigAndData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from("bot_config")
          .select("*")
          .eq("guild_id", guildId)
          .single();
        if (supabaseError && supabaseError.code !== 'PGRST116') throw supabaseError;

        const defaultConfig: BotConfig = {
            guild_id: guildId as string,
            ai_channel_id: null,
            welcome_channel_id: null,
            resposta_estatica: null,
            resposta_ia: false,
            admin_role_id: null,
            p_log_id: null,
            warn_limit: null,
            warns: {},
            improved_reasons: false,
            offense_detect: null,
        };

        setConfig(data || defaultConfig);
        await Promise.all([fetchChannels(), fetchRoles()]);

      } catch (err) {
        console.error("Error loading configuration:", err);
        setError(err instanceof Error ? err.message : "Unknown error loading config");
      } finally {
        setLoading(false);
      }
    };

    fetchConfigAndData();
  }, [guildId, fetchChannels, fetchRoles]); 

  const handleOpenChannelSelect = (type: ChannelFields) => {
    fetchChannels();
    setShowChannelSelect({ type, visible: true });
  };

  const handleOpenRoleSelect = () => {
      fetchRoles(); 
      setShowRoleSelect(true);
  }

  const saveConfig = async (updates: Partial<BotConfig>) => {
    if (!config) return;
    try {
      setError(null);
      const newConfig = { ...config, ...updates };
      const { error: supabaseError } = await supabase
        .from("bot_config")
        .upsert(newConfig, { onConflict: "guild_id" });
      if (supabaseError) throw supabaseError;
      setConfig(newConfig);
    } catch (err) {
      console.error("Error saving configuration:", err);
      setError(err instanceof Error ? err.message : "Error to save");
    }
  };

  const clearField = (field: keyof BotConfig) => {
    const nullAssignableFields: (keyof BotConfig)[] = [
      'ai_channel_id', 'welcome_channel_id', 'resposta_estatica',
      'admin_role_id', 'p_log_id', 'warn_limit', 'offense_detect'
    ];
    if (nullAssignableFields.includes(field)) {
      saveConfig({ [field]: null } as any);
    } else if (field === 'improved_reasons' || field === 'resposta_ia') {
      saveConfig({ [field]: false });
    }
  };

  const handleChannelSelect = (channelId: string) => {
    saveConfig({ [showChannelSelect.type]: channelId });
    setShowChannelSelect({ type: "ai_channel_id", visible: false });
  };

  const handleRoleSelect = (roleId: string) => {
    saveConfig({ admin_role_id: roleId });
    setShowRoleSelect(false);
  };

  const handleOffenseDetectorSelect = (level: number) => {
    saveConfig({ offense_detect: level });
    setShowOffenseDetectorSelect(false);
  };

  const getChannelName = (channelId: string | null) => {
    if (!channelId) return "";
    const channel = channels.find(c => c.id === channelId);
    return channel ? channel.name : channelId;
  };
  
  const getRoleName = (roleId: string | null) => {
      if (!roleId) return "";
      const role = roles.find(r => r.id === roleId);
      return role ? role.name : roleId;
  };

  const getOffenseDetectorLabel = (level: number | null) => {
    if (level === null) return "Disabled";
    const found = offenseLevels.find(o => o.value === level);
    return found ? found.label : "Unknown";
  };

  if (!guildId) {
    return <div className="text-center mt-10 text-white">No server selected</div>;
  }
 
  if (loading && !config) {
    return (
      <div className="flex justify-center items-center h-screen bg-mainbg">
        <Rocket size={48} className="animate-bounce text-purple-500" /> 
      </div>
    );
  }
 
  if (error && !config) {
    return (
      <div className="flex justify-center items-center h-screen bg-mainbg">
        <div className="alert alert-error max-w-md mx-auto flex items-center">
          <AlertCircle size={24} className="mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-mainbg min-h-screen text-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 sm:mb-10">
            <div>
              <h1 className={styles.title}>Server <span className={styles.firstWord}>Configuration</span></h1>
              <p className="text-gray-400 text-sm">Configure the bot for your server</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error max-w-full mx-auto my-4 flex items-center justify-between p-4 rounded-lg">
                <span className="flex items-center"><AlertCircle size={20} className="mr-2" />{error}</span>
                <button className="btn btn-ghost btn-sm text-white" onClick={() => setError(null)}><X size={20} /></button>
            </div>
          )}

          {config && (
            <div className="md:flex md:space-x-6 lg:space-x-8 space-y-8 md:space-y-0">
              {/* General Settings Card */}
              <div className="bg-black/20 border-2 border-b-purple-500/70 border-t-blue-500/50 border-l-purple-500/50 border-r-blue-500/80 rounded-xl p-4 sm:p-6 md:w-1/2 flex flex-col space-y-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-0 text-gray-100 flex items-center pb-4">
                    <Settings size={22} className="mr-2" />
                    <span className="bg-gradient-to-r from-[#B123F3] to-[#2684FF] bg-clip-text text-transparent">General Settings</span>
                </h2>

                <div>
                    <label className="font-medium mb-1 text-gray-300 flex items-center">
                      <MessageSquareText size={16} className="mr-1 text-purple-400" /> AI CHANNEL:
                    </label>
                    <div className="relative flex items-center gap-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Hash size={18} />
                      </div>
                      <input
                        type="text"
                        readOnly 
                        value={getChannelName(config.ai_channel_id) || ""}
                        onClick={() => handleOpenChannelSelect('ai_channel_id')}
                        className="input input-bordered bg-black/30 pl-10 rounded-lg flex-1 h-10 text-white placeholder-gray-500 cursor-pointer focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                        placeholder="Not Selected"
                      />
                      {config.ai_channel_id && (
                        <button 
                          onClick={() => clearField('ai_channel_id')} 
                          className="btn btn-ghost btn-sm text-gray-400 hover:text-red-400 p-1 sm:p-2 h-10 flex items-center"
                        >
                          <X size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleOpenChannelSelect('ai_channel_id')} 
                        className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-1 sm:p-2 h-10 flex items-center" 
                        disabled={channelsLoading && showChannelSelect.type === 'ai_channel_id'}
                      >
                        {(channelsLoading && showChannelSelect.type === 'ai_channel_id') ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>
                </div>

                <div>
                    <label className="font-medium mb-1 text-gray-300 flex items-center">
                      <Users size={16} className="mr-1 text-blue-400" /> WELCOME CHANNEL:
                    </label>
                    <div className="relative flex items-center gap-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Hash size={18} />
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={getChannelName(config.welcome_channel_id) || ""}
                        onClick={() => handleOpenChannelSelect('welcome_channel_id')}
                        className="input input-bordered bg-black/30 pl-10 rounded-lg flex-1 h-10 text-white placeholder-gray-500 cursor-pointer focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                        placeholder="Not Selected"
                      />
                      {config.welcome_channel_id && (
                        <button 
                          onClick={() => clearField('welcome_channel_id')} 
                          className="btn btn-ghost btn-sm text-gray-400 hover:text-red-400 p-1 sm:p-2 h-10 flex items-center"
                        >
                          <X size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleOpenChannelSelect('welcome_channel_id')} 
                        className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-1 sm:p-2 h-10 flex items-center" 
                        disabled={channelsLoading && showChannelSelect.type === 'welcome_channel_id'}
                      >
                        {(channelsLoading && showChannelSelect.type === 'welcome_channel_id') ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex-grow">
                      <span className="text-sm font-medium text-gray-300 flex items-center">
                        <Zap size={16} className="mr-1 text-emerald-400" /> WELCOME MESSAGE WITH AI:
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">Use AI to generate creative welcome messages</p>
                    </div>
                    <label className="inline-flex items-center cursor-pointer ml-4">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={config.resposta_ia || false}
                          onChange={(e) => saveConfig({ resposta_ia: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-mfield rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </div>
                    </label>
                </div>

                <div>
                    <label className="font-medium mb-1 text-gray-300 flex items-center">
                      <Send size={16} className="mr-1 text-teal-400" /> STATIC MESSAGE:
                    </label>
                    <textarea
                      value={config.resposta_estatica || ''}
                      onChange={(e) => saveConfig({ resposta_estatica: e.target.value || null })}
                      className="textarea textarea-bordered bg-black/30 w-full h-24 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 custom-scrollbar text-sm sm:text-base"
                      placeholder="Write the static welcome response..."
                    ></textarea>
                </div>
              </div>

              {/* Moderation Settings Card */}
              <div className="bg-black/20 border-2 border-b-purple-500/70 border-t-blue-500/50 border-l-purple-500/50 border-r-blue-500/80 rounded-xl p-4 sm:p-6 md:w-1/2 flex flex-col space-y-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-0 text-gray-100 flex items-center pb-4">
                    <Shield size={22} className="mr-2" />
                    <span className="bg-gradient-to-r from-[#B123F3] to-[#2684FF] bg-clip-text text-transparent">Moderation Settings</span>
                </h2>

                <div>
                  <label className="font-medium mb-1 text-gray-300 flex items-center">
                    <Scale size={16} className="mr-1 text-yellow-400" /> WARNS LIMIT:
                  </label>
                  <div className="relative flex items-center gap-1">
                    <input
                      type="number"
                      value={config.warn_limit === null ? '' : config.warn_limit}
                      onChange={(e) => saveConfig({ warn_limit: e.target.value === '' ? null : Number(e.target.value) })}
                      className="input input-bordered bg-black/30 rounded-lg flex-1 h-10 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                      placeholder="NULL"
                      min="1"
                      max="100"
                    />
                    {config.warn_limit !== null && (
                      <button 
                        onClick={() => clearField('warn_limit')} 
                        className="btn btn-ghost btn-sm text-gray-400 hover:text-red-400 p-1 sm:p-2 h-10 flex items-center"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-medium mb-1 text-gray-300 flex items-center">
                    <Gavel size={16} className="mr-1 text-red-400" /> PUNISHMENTS LOGS CHANNEL:
                  </label>
                  <div className="relative flex items-center gap-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <Hash size={18} />
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={getChannelName(config.p_log_id) || ""}
                      onClick={() => handleOpenChannelSelect('p_log_id')}
                      className="input input-bordered bg-black/30 pl-10 rounded-lg flex-1 h-10 text-white placeholder-gray-500 cursor-pointer focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                      placeholder="Not Selected"
                    />
                    {config.p_log_id && (
                      <button 
                        onClick={() => clearField('p_log_id')} 
                        className="btn btn-ghost btn-sm text-gray-400 hover:text-red-400 p-1 sm:p-2 h-10 flex items-center"
                      >
                        <X size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleOpenChannelSelect('p_log_id')} 
                      className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-1 sm:p-2 h-10 flex items-center" 
                      disabled={channelsLoading && showChannelSelect.type === 'p_log_id'}
                    >
                      {(channelsLoading && showChannelSelect.type === 'p_log_id') ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-medium mb-1 text-gray-300 flex items-center">
                    <Crown size={16} className="mr-1 text-purple-400" /> ADMIN ROLE:
                  </label>
                  <div className="relative flex items-center gap-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {config.admin_role_id && roles.find(r => r.id === config.admin_role_id)?.color ? 
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: `#${roles.find(r => r.id === config.admin_role_id)?.color.toString(16).padStart(6, '0')}`}}></div>
                        : <Crown size={18} />
                      }
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={getRoleName(config.admin_role_id) || ""}
                      onClick={handleOpenRoleSelect}
                      className="input input-bordered bg-black/30 pl-10 rounded-lg flex-1 h-10 text-white placeholder-gray-500 cursor-pointer focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                      placeholder="Not Selected"
                    />
                    {config.admin_role_id && (
                      <button 
                        onClick={() => clearField('admin_role_id')} 
                        className="btn btn-ghost btn-sm text-gray-400 hover:text-red-400 p-1 sm:p-2 h-10 flex items-center"
                      >
                        <X size={18} />
                      </button>
                    )}
                    <button 
                      onClick={handleOpenRoleSelect} 
                      className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-1 sm:p-2 h-10 flex items-center" 
                      disabled={rolesLoading}
                    >
                      {rolesLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex-grow">
                    <span className="text-sm font-medium text-gray-300 flex items-center">
                      <ZapOff size={16} className="mr-1 text-pink-400" /> REASONS IMPROVED BY AI:
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">Use AI to automatically improve ban/warn/timeout reasons.</p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer ml-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={config.improved_reasons || false}
                        onChange={(e) => saveConfig({ improved_reasons: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-neutral-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="font-medium mb-1 text-gray-300 flex items-center">
                    <BellRing size={16} className="mr-1 text-orange-400" /> OFFENSE DETECTOR WITH AI</label>
                  <div className="relative flex items-center gap-1">
                    <input
                      type="text"
                      readOnly
                      value={getOffenseDetectorLabel(config.offense_detect)}
                      onClick={() => setShowOffenseDetectorSelect(true)}
                      className="input input-bordered bg-black/30 rounded-lg flex-1 h-10 text-white placeholder-gray-500 cursor-pointer focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                      placeholder="Not Selected"
                    />
                    {config.offense_detect !== null && (
                      <button 
                        onClick={() => clearField('offense_detect')} 
                        className="btn btn-ghost btn-sm text-gray-400 hover:text-red-400 p-1 sm:p-2 h-10 flex items-center"
                      >
                        <X size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => setShowOffenseDetectorSelect(true)} 
                      className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-1 sm:p-2 h-10 flex items-center"
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Channel Select Modal */}
          {showChannelSelect.visible && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-black/80 border-2 border-b-purple-500/70 border-t-blue-500/50 border-l-purple-500/50 border-r-blue-500/80 p-4 sm:p-6 rounded-lg max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl">
                <h3 className="text-lg font-semibold mb-4 text-gray-100 flex items-center">
                  <Hash size={20} className="mr-2 text-gray-400" /> Channel Selector
                </h3>
                {channelsLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="loading loading-spinner loading-lg text-purple-500"></div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar pr-2">
                      {channels.length > 0 ? (
                        channels.map(channel => (
                          <div
                            key={channel.id}
                            className="p-2 sm:p-2.5 hover:bg-white/10 rounded-lg cursor-pointer flex items-center text-gray-300 hover:text-white transition-colors duration-150 text-sm sm:text-base"
                            onClick={() => handleChannelSelect(channel.id)}
                          >
                            <Hash size={16} className="mr-2 text-gray-500" />
                            <span className="truncate">{channel.name}</span>
                            <span className="ml-auto text-xs text-gray-500 font-mono hidden sm:inline">{channel.id}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-400 flex flex-col items-center justify-center">
                          <AlertCircle size={24} className="mb-2 text-red-400" />
                          No text channels found or accessible in this server.
                        </div>
                      )}
                    </div>
                    <button
                      className="mt-6 self-end px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-md flex items-center justify-center text-sm sm:text-base"
                      onClick={() => setShowChannelSelect({ type: 'ai_channel_id', visible: false })}
                    >
                      <X size={18} className="mr-1 sm:mr-2" /> Close
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Role Select Modal */}
          {showRoleSelect && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-black/80 border-2 border-b-purple-500/70 border-t-blue-500/50 border-l-purple-500/50 border-r-blue-500/80 p-4 sm:p-6 rounded-lg max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl">
                <h3 className="text-lg font-semibold mb-4 text-gray-100 flex items-center">
                  <Crown size={20} className="mr-2 text-gray-400" /> Role Selector
                </h3>
                {rolesLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="loading loading-spinner loading-lg text-purple-500"></div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar pr-2">
                      {roles.length > 0 ? (
                        roles.map(role => (
                          <div
                            key={role.id}
                            className="p-2 sm:p-2.5 hover:bg-white/10 rounded-lg cursor-pointer flex items-center text-gray-300 hover:text-white transition-colors duration-150 text-sm sm:text-base"
                            onClick={() => handleRoleSelect(role.id)}
                          >
                            <div
                                className="w-3 h-3 rounded-full mr-2 sm:mr-3"
                                style={{ backgroundColor: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : '#99aab5' }} 
                            ></div>
                            <span className="truncate">{role.name}</span>
                            <span className="ml-auto text-xs text-gray-500 font-mono hidden sm:inline">{role.id}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-400 flex flex-col items-center justify-center">
                          <AlertCircle size={24} className="mb-2 text-red-400" />
                          No roles found or accessible in this server.
                        </div>
                      )}
                    </div>
                    <button
                      className="mt-6 self-end px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-md flex items-center justify-center text-sm sm:text-base"
                      onClick={() => setShowRoleSelect(false)}
                    >
                      <X size={18} className="mr-1 sm:mr-2" /> Close
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Offense Detector Modal */}
          {showOffenseDetectorSelect && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-black/80 border-2 border-b-purple-500/70 border-t-blue-500/50 border-l-purple-500/50 border-r-blue-500/80 p-4 sm:p-6 rounded-lg max-w-md w-full flex flex-col shadow-2xl">
                <h3 className="text-lg font-semibold mb-4 text-gray-100 flex items-center">
                  <BellRing size={20} className="mr-2 text-orange-400" /> Offense Detector Level
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {offenseLevels.map((level) => (
                    <div
                      key={level.value}
                      className={`p-2 sm:p-3 rounded-lg cursor-pointer flex items-center transition-colors duration-150 text-sm sm:text-base
                      ${
                        config?.offense_detect === level.value
                          ? level.value === 0
                            ? 'bg-gray-700 text-white ring-2 ring-gray-500'
                            : level.value === 1
                              ? 'bg-green-700 text-white ring-2 ring-green-500'
                              : 'bg-yellow-700 text-white ring-2 ring-yellow-500'
                          : 'bg-black/30 hover:bg-white/10 text-gray-200'
                      }`}
                      onClick={() => handleOffenseDetectorSelect(level.value)}
                    >
                      {level.icon}
                      <div className="flex-1 ml-2">
                        <h4 className="font-semibold text-sm sm:text-lg">{level.label}</h4>
                        <p className="text-xs text-gray-300 mt-1">{level.description}</p>
                      </div>
                      {config?.offense_detect === level.value && <UserCheck size={20} className="ml-2 sm:ml-4 text-white" />}
                    </div>
                  ))}
                </div>
                <button
                  className="mt-6 self-end px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-md flex items-center justify-center text-sm sm:text-base"
                  onClick={() => setShowOffenseDetectorSelect(false)}
                >
                  <X size={18} className="mr-1 sm:mr-2" /> Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}