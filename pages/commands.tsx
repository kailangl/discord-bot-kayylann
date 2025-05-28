import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
const DEFAULT_CATEGORY_KEY = 'miscellaneous';

const FRONTEND_CATEGORIAS: Record<string, { name_pt: string; name_en: string; emoji?: string; isDefault?: boolean }> = {
  moderation: { name_pt: '🛡️ Moderação', name_en: '🛡️ Moderation', emoji: '🛡️' },
  economy: { name_pt: '💰 Economia', name_en: '💰 Economy', emoji: '💰' },
  utility: { name_pt: '🔧 Utilitários', name_en: '🔧 Utilities', emoji: '🔧' },
  [DEFAULT_CATEGORY_KEY]: { name_pt: '⚙️ Diversos', name_en: '⚙️ Miscellaneous', emoji: '⚙️', isDefault: true }
};

interface FormattedCommandOption {
  name: string;
  description: string;
  type: string;
  required: boolean;
  choices?: { name: string; value: string | number }[];
  options?: FormattedCommandOption[];
}

interface FormattedCommand {
  name: string;
  description: string;
  usage: string;
  category?: string; 
  options?: FormattedCommandOption[];
}

interface CommandCategoryData {
    categoryName: string; 
    commands: FormattedCommand[];
}

const CommandsPage: NextPage = () => {
    const [commandCategories, setCommandCategories] = useState<CommandCategoryData[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
   

    useEffect(() => {
        const fetchCommands = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/bot-commands');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const rawCommands: FormattedCommand[] = await response.json();
                const currentLocale = 'pt-BR'; 

                const getCategoryDisplayName = (key: string | undefined): string => {
                 
                    const catKeyOrDefault = (key && FRONTEND_CATEGORIAS[key]) ? key : DEFAULT_CATEGORY_KEY;
                    const catInfo = FRONTEND_CATEGORIAS[catKeyOrDefault];
                    return currentLocale === 'pt-BR' ? catInfo.name_pt : catInfo.name_en;
                };
                
                const getCategoryKeyForCommand = (cmd: FormattedCommand): string => {
                 
                    if (cmd.category && FRONTEND_CATEGORIAS[cmd.category]) {
                        return cmd.category;
                    }

             
                    return Object.keys(FRONTEND_CATEGORIAS).find(key => FRONTEND_CATEGORIAS[key].isDefault) || DEFAULT_CATEGORY_KEY;
                };


                const groupedCommands: Record<string, FormattedCommand[]> = {};

                rawCommands.forEach(cmd => {
                    const assignedCategoryKey = getCategoryKeyForCommand(cmd);
                    
                    if (!groupedCommands[assignedCategoryKey]) {
                        groupedCommands[assignedCategoryKey] = [];
                    }
                    groupedCommands[assignedCategoryKey].push(cmd);
                });

                const categoriesArray: CommandCategoryData[] = Object.keys(groupedCommands)
                    .map(catKey => ({
                        categoryName: getCategoryDisplayName(catKey),
                        commands: groupedCommands[catKey]
                    }))
                    .sort((a, b) => {
                        const defaultDisplayName = getCategoryDisplayName(DEFAULT_CATEGORY_KEY);
                        if (a.categoryName === defaultDisplayName && b.categoryName !== defaultDisplayName) return 1;
                        if (a.categoryName !== defaultDisplayName && b.categoryName === defaultDisplayName) return -1;
                        return a.categoryName.localeCompare(b.categoryName);
                    });

                setCommandCategories(categoriesArray);
                if (categoriesArray.length > 0) {
                    setSelectedCategory(categoriesArray[0].categoryName);
                }

            } catch (err: any) {
                console.error("Failed to fetch commands:", err);
                setError(err.message || "Could not load commands.");
            } finally {
                setLoading(false);
            }
        };

        fetchCommands();
    }, [/* locale */]); 

    const currentCommands = commandCategories.find(
        (cat) => cat.categoryName === selectedCategory
    )?.commands || [];

   

    return (
        <>
            <Header />
            <Head>
                <title>Bot Commands</title>
                <meta name="description" content="List of available bot commands" />
            </Head>

            <div className="bg-mainbg min-h-screen text-white p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 md:mb-10">
                        <h1 className="text-4xl font-bold text-gray-100">Commands</h1>
                        <p className="text-gray-400 text-md mt-1">Bot Commands</p>
                    </div>

                    {loading ? (
                        <div className="text-center text-gray-300">Carregando comandos...</div>
                    ) : error ? (
                        <div className="text-center text-red-400">Erro: {error}. Por favor, tente novamente mais tarde.</div>
                    ) : (
                        <div className="md:flex md:space-x-8">
                            <aside className="md:w-1/4 lg:w-1/5 mb-8 md:mb-0">
                                <div className="bg-secbg rounded-lg p-4 shadow-lg">
                                    <ul className="space-y-1">
                                        {commandCategories.map((category) => (
                                            <li key={category.categoryName}>
                                                <button
                                                    onClick={() => setSelectedCategory(category.categoryName)}
                                                    className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150
                                                      ${selectedCategory === category.categoryName
                                                            ? 'bg-purple-600 text-white shadow-md'
                                                            : 'text-gray-300 hover:bg-neutral-700 hover:text-gray-100'
                                                        }`}
                                                >
                                                    {/* Você pode querer adicionar o emoji aqui também */}
                                                    {/* Ex: {FRONTEND_CATEGORIAS[Object.keys(FRONTEND_CATEGORIAS).find(k => getCategoryDisplayName(k, currentLocale) === category.categoryName) || DEFAULT_CATEGORY_KEY]?.emoji} */}
                                                    {category.categoryName}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </aside>

                            <main className="md:w-3/4 lg:w-4/5">
                                {selectedCategory && (
                                    <div className="bg-secbg rounded-lg shadow-xl overflow-hidden">
                                        <div className="px-6 py-5">
                                            <h2 className="text-2xl font-semibold text-gray-100 mb-1">
                                                {/* {FRONTEND_CATEGORIAS[Object.keys(FRONTEND_CATEGORIAS).find(k => getCategoryDisplayName(k, currentLocale) === selectedCategory) || DEFAULT_CATEGORY_KEY]?.emoji} */}
                                                {selectedCategory} Commands
                                            </h2>
                                            <p className="text-sm text-gray-400">
                                                List of commands available for the {selectedCategory.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').trim()} category.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-10 gap-x-4 px-6 py-3  border-b border-t border-gray-700/70">
                                            <div className="col-span-10 sm:col-span-2 text-xs font-bold uppercase text-purple-400 tracking-wider">Commands:</div>
                                            <div className="col-span-10 sm:col-span-4 mt-2 sm:mt-0 text-xs font-bold uppercase text-purple-400 tracking-wider">Description:</div>
                                            <div className="col-span-10 sm:col-span-4 mt-2 sm:mt-0 text-xs font-bold uppercase text-purple-400 tracking-wider">Usage:</div>
                                        </div>

                                        <div className="divide-y divide-neutral-700/70">
                                            {currentCommands.length > 0 ? (
                                                currentCommands.map((command, index) => (
                                                    <div key={command.name || index} className="grid grid-cols-10 gap-x-4 px-6 py-4 hover:bg-neutral-700/30 transition-colors duration-150">
                                                        <div className="col-span-10 sm:col-span-2 mb-2 sm:mb-0">
                                                            <p className="text-sm font-medium text-gray-100">/{command.name}</p>
                                                        </div>
                                                        <div className="col-span-10 sm:col-span-4 mb-2 sm:mb-0">
                                                            <p className="text-sm text-gray-400">{command.description}</p>
                                                        </div>
                                                        <div className="col-span-10 sm:col-span-4">
                                                            <p className="text-sm text-purple-300 font-mono bg-neutral-900/60 px-2 py-1 rounded-md inline-block">
                                                                {command.usage} {command.category}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-6 py-8 text-center">
                                                    <p className="text-gray-400">No commands found in this category.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </main>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CommandsPage;