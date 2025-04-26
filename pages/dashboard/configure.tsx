
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";


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

export default function ConfigureBot() {
  const router = useRouter();
  const { guildId } = router.query;
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        if (supabaseError) throw supabaseError;

        
        const defaultConfig: BotConfig = {
          guild_id: guildId as string,
          ai_channel_id: null,
          welcome_channel_id: null,
          resposta_estatica: null,
          resposta_ia: false,
          admin_role_id: null,
          p_log_id: null,
          warn_limit: 3,
          warns: {}
        };

        setConfig(data || defaultConfig);
      } catch (err) {
        console.error("Erro ao carregar configuração:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [guildId]);

  const saveConfig = async (updates: Partial<BotConfig>) => {
    if (!config) return;

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  if (!guildId) {
    return (
      <div className="alert alert-warning max-w-md mx-auto mt-8">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Nenhum servidor selecionado</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
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
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configurações do Servidor</h1>
        <Link href="/dashboard/servers" className="btn btn-ghost">
          ← Voltar
        </Link>
      </div>

      {config && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Configurações Gerais</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Canal de IA</span>
                </label>
                <input
                  type="text"
                  value={config.ai_channel_id || ''}
                  onChange={(e) => saveConfig({ ai_channel_id: e.target.value || null })}
                  className="input input-bordered"
                  placeholder="ID do Canal"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Canal de Boas-vindas</span>
                </label>
                <input
                  type="text"
                  value={config.welcome_channel_id || ''}
                  onChange={(e) => saveConfig({ welcome_channel_id: e.target.value || null })}
                  className="input input-bordered"
                  placeholder="ID do Canal"
                />
              </div>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Moderação</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Limite de Warns</span>
                </label>
                <input
                  type="number"
                  value={config.warn_limit}
                  onChange={(e) => saveConfig({ warn_limit: Number(e.target.value) })}
                  className="input input-bordered"
                  min="1"
                  max="10"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Canal de Logs</span>
                </label>
                <input
                  type="text"
                  value={config.p_log_id || ''}
                  onChange={(e) => saveConfig({ p_log_id: e.target.value || null })}
                  className="input input-bordered"
                  placeholder="ID do Canal"
                />
              </div>
            </div>
          </div>

        
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Respostas Automáticas</h2>
              
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Usar IA para respostas</span>
                  <input
                    type="checkbox"
                    checked={config.resposta_ia}
                    onChange={(e) => saveConfig({ resposta_ia: e.target.checked })}
                    className="toggle toggle-primary"
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Resposta Estática</span>
                </label>
                <textarea
                  value={config.resposta_estatica || ''}
                  onChange={(e) => saveConfig({ resposta_estatica: e.target.value || null })}
                  className="textarea textarea-bordered h-24"
                  placeholder="Mensagem fixa para respostas"
                ></textarea>
              </div>
            </div>
          </div>

        
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Administração</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Cargo de Administrador</span>
                </label>
                <input
                  type="text"
                  value={config.admin_role_id || ''}
                  onChange={(e) => saveConfig({ admin_role_id: e.target.value || null })}
                  className="input input-bordered"
                  placeholder="ID do Cargo"
                />
              </div>
            </div>
          </div>
        </div>
      )}

     
      <div className="mt-8">
        <details className="collapse bg-base-200">
          <summary className="collapse-title text-sm font-medium">Dados de Configuração (Debug)</summary>
          <div className="collapse-content">
            <pre className="text-xs overflow-x-auto p-2 bg-neutral rounded">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}