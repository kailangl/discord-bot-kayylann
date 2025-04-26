import type { NextPage } from 'next';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link'; 
import { DiscordLoginButton } from '../components/DiscordLoginButton';

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 text-white">
      <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="max-w-3xl mb-12">
          <h1 className="text-5xl font-bold mb-4">O Bot do Discord que faz tudo.</h1>
          <h2 className="text-3xl font-semibold text-blue-300 mb-6">Automaticamente</h2>
          
          <p className="text-xl text-gray-300 mb-8">
            Um bot de moderação totalmente personalizável para seu servidor Discord.
          </p>
          
          <div className="bg-indigo-800/50 p-4 rounded-lg border border-indigo-700 inline-block">
            <p className="text-lg">
              Usado em <span className="font-bold text-yellow-300">10.4 milhões</span> de servidores.
            </p>
          </div>
        </div>

   
        {status === "authenticated" && (
          <div className="mb-8 p-4 bg-gray-800 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Você está logado como:</h3>
            <div className="flex items-center justify-center gap-3 mb-4">
              {session.user?.image && (
                <img 
                  src={session.user.image} 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-full"
                />
              )}
              <span className="font-medium">{session.user?.name}</span>
            </div>
            
            
            <Link href="/dashboard/servers" passHref>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded mb-2 w-full">
                Gerenciar Servidores
              </button>
            </Link>
            
            <button
              onClick={() => signOut()}
              className="text-sm bg-red-600 hover:bg-red-500 px-3 py-1 rounded w-full"
            >
              Sair
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="/add-to-server" 
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Adicionar ao Servidor
          </a>
          
          
          {status !== "authenticated" ? (
            <button
              onClick={() => signIn('discord')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Login com Discord
            </button>
          ) : (
            <DiscordLoginButton />
          )}
        </div>

     
        {process.env.NODE_ENV === 'development' && status === "authenticated" && (
          <div className="mt-8 p-4 bg-gray-900 rounded-lg max-w-xl w-full text-left">
            <h4 className="font-bold mb-2">Dados da Sessão (Debug):</h4>
            <pre className="text-xs bg-black p-3 rounded overflow-x-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;