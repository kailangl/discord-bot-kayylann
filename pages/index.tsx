import type { NextPage } from 'next';
import { useSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signIn('discord');
    } catch (err) {
      setError('Failed to login with Discord');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Lógica para redirecionar se já estiver autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      checkUserServers();
    }
  }, [status]);

  const checkUserServers = async () => {
    try {
      setLoading(true);
      
      // 1. Buscar servidores do usuário
      const userGuilds = await fetch('/api/discord/guilds', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      }).then(res => res.json());

      // 2. Buscar servidores com o bot
      const { data: botGuilds } = await supabase
        .from('bot_config')
        .select('guild_id');

      // 3. Filtrar servidores disponíveis
      const availableServers = userGuilds.filter((guild: any) => {
        const isBotInServer = botGuilds?.some(b => b.guild_id === guild.id);
        const hasAdminPermissions = (guild.permissions & 0x8) === 0x8 || guild.owner;
        return isBotInServer && hasAdminPermissions;
      });

      if (availableServers.length > 0) {
        router.push('/dashboard/servers');
      }
    } catch (err) {
      console.error('Error checking servers:', err);
      setError('Error loading server data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Kayylann Discord Bot Dashboard</title>
        <meta name="description" content="Dashboard de gerenciamento do bot Kayylann para Discord" />
      </Head>

      <Header />

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Kayylann Discord Bot Dashboard</h1>

          <div className={styles.description}>
            <p>
              A fully customizable server moderation Discord bot for your Discord server that features a simple and intuitive web dashboard.
            </p>
            <p className={styles.highlight}>
              Dyno is used on over 10.5 million servers, we invite you to try it out and hope you enjoy!
            </p>
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerText}>CONTINUE</span>
          </div>

          <div className={styles.buttons}>
            <a href="/add-to-server" className={styles.primaryButton}>
              ADD TO SERVER
            </a>

            {status !== "authenticated" ? (
              <button 
                onClick={handleLogin}
                disabled={loading}
                className={styles.secondaryButton}
              >
                {loading ? 'LOADING...' : 'LOG IN'}
              </button>
            ) : (
              <button 
                onClick={() => router.push('/dashboard/servers')}
                className={styles.primaryButton}
              >
                GO TO DASHBOARD
              </button>
            )}
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;