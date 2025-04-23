import type { NextPage } from 'next';
import { DiscordLoginButton } from '../components/DiscordLoginButton';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 text-white">
      <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        {/* Cabeçalho */}
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

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="/add-to-server" 
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Adicionar ao Servidor
          </a>
          <DiscordLoginButton />
        </div>
      </main>
    </div>
  );
};

export default Home;