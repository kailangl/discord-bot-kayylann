import type { NextPage } from 'next';
import { useSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  Rocket,
  Users,
  MessageSquare,
  Settings,
  TerminalSquare,
  BotMessageSquare,
} from 'lucide-react';
import styles from '../styles/Home.module.css';

const carouselImages = [
  '/images/feature1.png',
  '/images/feature2.png',
  '/images/feature3.png',
];
  
const features = [
  {
    icon: <BotMessageSquare size={40} className="text-purple-400" />,
    title: 'AI-Powered Responses',
    description: 'Engage your users with smart, contextual, and dynamic interactions.',
  },
  {
    icon: <ShieldCheck size={40} className="text-blue-400" />,
    title: 'Advanced Moderation',
    description: 'Keep your server safe and organized with powerful moderation tools.',
  },
  {
    icon: <TerminalSquare size={40} className="text-green-400" />,
    title: 'Customizable Commands',
    description: 'Tailor the bot to your server\'s needs with flexible and personalized commands.',
  },
  {
    icon: <Settings size={40} className="text-yellow-400" />,
    title: 'Intuitive Dashboard',
    description: 'Easily manage all bot configurations from a centralized and user-friendly interface.',
  },
];

const Home: NextPage = () => {

  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signIn('discord');
    } catch (err) {
      setError('Failed to log in with Discord');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      checkUserServers();
    }
  }, [status, session?.accessToken]);

  const checkUserServers = async () => {
    if (!session?.accessToken) {
      setError('Access token not available.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const userGuildsResponse = await fetch('/api/discord/guilds', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      if (!userGuildsResponse.ok) {
        const errorData = await userGuildsResponse.json();
        throw new Error(errorData.error || `Failed to fetch user guilds: ${userGuildsResponse.statusText}`);
      }
      const userGuilds = await userGuildsResponse.json();

      if (!Array.isArray(userGuilds)) {
        console.error('User guilds is not an array:', userGuilds);
        throw new Error('Unexpected format for user guilds.');
      }

      const { data: botGuilds, error: supabaseError } = await supabase
        .from('bot_config')
        .select('guild_id');

      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }

      if (!botGuilds) {
        throw new Error('Failed to fetch bot guilds from Supabase.');
      }

      const availableServers = userGuilds.filter((guild: any) => {
        const isBotInServer = botGuilds.some(b => b.guild_id === guild.id);
        const administratorPermissionFlag = BigInt(8);
        const hasAdminPermissions = (BigInt(guild.permissions) & administratorPermissionFlag) === administratorPermissionFlag || guild.owner;
        return isBotInServer && hasAdminPermissions;
      });

      if (availableServers.length > 0) {
        router.push('/dashboard/servers');
      }
    } catch (err: any) {
      console.error('Error checking servers:', err);
      setError(err.message || 'Error loading server data');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen bg-mainbg text-gray-100">
      <Head>
        <title>Lunny Discord Bot Dashboard</title>
        <meta name="description" content="Dashboard for managing the Lunny Discord bot" />
        <link rel="icon" href="/favicon.ico" />
      
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
   
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
  
            <h1 className={styles.title}>
              <span className={styles.firstWord}>
                Lunny
              </span>{' '}
              Discord Bot Dashboard
            </h1>
            <div className="text-lg md:text-xl text-gray-300 mb-8 space-y-4">
            
              <p>
                Lunny is a multi-purpose Discord bot that uses artificial intelligence to automate responses and make interaction more dynamic and personalized.
              </p>
              <p className="text-blue-300 font-medium">
                Developed by Blayy and constantly improved. Enjoy!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://discord.com/api/oauth2/authorize?client_id=1015720769998835863&permissions=8&scope=bot%20applications.commands"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryButton}
              >
                ADD TO SERVER
              </a>
              {status !== "authenticated" ? (
                <button
                  onClick={handleLogin}
                  disabled={loading || status === 'loading'}
                  className={styles.secondaryButton}
                >
                  {loading || status === 'loading' ? 'LOADING...' : 'LOG IN WITH DISCORD'}
                </button>
              ) : (
                <button
                  onClick={() => router.push('/dashboard/servers')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                  disabled={loading}
                >
                  {loading ? 'LOADING...' : 'GO TO DASHBOARD'}
                </button>
              )}
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section className="pb-4">
          
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Explore Lunny's Powers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className=" p-6 rounded-xl hover:transform hover:-translate-y-2 transition-transform duration-300 shadow-lg"
                >
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

     
        <section className="py-5 my-5">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              See Lunny in Action
            </h2>
            <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden aspect-video">
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600/50 to-blue-500/50 p-3 rounded-full hover:border-2 border-white/50 transition-colors z-10"
                aria-label="Previous Image"
              >
                <ChevronLeft size={32} className="text-white" />
              </button>
              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <img
                  src={carouselImages && carouselImages.length > 0 ? carouselImages[currentImageIndex] : 'https://via.placeholder.com/640x360'}
                  alt={carouselImages && carouselImages.length > 0 ? `Bot feature ${currentImageIndex + 1}` : 'Placeholder image'}
                  className="object-cover h-full w-full transition-opacity duration-500"
                  style={{ opacity: carouselImages && carouselImages.length > 0 ? 1 : 0.5 }}
                />
              </div>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600/50 to-blue-500/50 p-3 rounded-full hover:border-2 border-white/50 hover:bg-black/70 transition-colors z-10"
                aria-label="Next Image"
              >
                <ChevronRight size={32} className="text-white" />
              </button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {carouselImages && carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-purple-500' : 'bg-gray-500'}`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
              Ready? Let's Get Started!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className=" p-6 rounded-xl text-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Add to Your Server</h3>
                <p className="text-gray-300">
                  Invite Lunny to your Discord server with just a click.
                </p>
              </div>
              <div className=" p-6 rounded-xl text-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Log In</h3>
                <p className="text-gray-300">
                  Access the dashboard to configure and personalize your bot.
                </p>
              </div>
              <div className=" p-6 rounded-xl text-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Explore & Configure</h3>
                <p className="text-gray-300">
                  Discover all features and fine-tune Lunny to your liking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;