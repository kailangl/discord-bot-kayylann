import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from '../components/Header'; // Assuming Header component exists
// import { ChevronDown } from 'lucide-react'; // Example if you want to add icons for expandable commands

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
    categoryKey: string; 
    categoryName: string; 
    commands: FormattedCommand[];
}

const CommandsPage: NextPage = () => {
    const [commandCategories, setCommandCategories] = useState<CommandCategoryData[]>([]);
    const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>(DEFAULT_CATEGORY_KEY); // Select by key
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentLocale, setCurrentLocale] = useState('pt-BR'); // Can be dynamic later

    useEffect(() => {
        const fetchCommands = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/bot-commands');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const rawCommands: FormattedCommand[] = await response.json();

                const getCategoryInfo = (key: string | undefined) => {
                    const catKeyOrDefault = (key && FRONTEND_CATEGORIAS[key]) ? key : DEFAULT_CATEGORY_KEY;
                    return {
                        key: catKeyOrDefault,
                        display_name: currentLocale === 'pt-BR' ? FRONTEND_CATEGORIAS[catKeyOrDefault].name_pt : FRONTEND_CATEGORIAS[catKeyOrDefault].name_en,
                        emoji: FRONTEND_CATEGORIAS[catKeyOrDefault].emoji || ''
                    };
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

                const categoriesArray: CommandCategoryData[] = Object.keys(FRONTEND_CATEGORIAS) // Iterate over defined categories to maintain order
                    .filter(catKey => groupedCommands[catKey] && groupedCommands[catKey].length > 0) // Only include categories with commands
                    .map(catKey => ({
                        categoryKey: catKey,
                        categoryName: getCategoryInfo(catKey).display_name,
                        commands: groupedCommands[catKey].sort((a,b) => a.name.localeCompare(b.name)) // Sort commands alphabetically
                    }))
                    .sort((a, b) => {
                        const defaultCatInfo = getCategoryInfo(DEFAULT_CATEGORY_KEY);
                        if (a.categoryKey === DEFAULT_CATEGORY_KEY && b.categoryKey !== DEFAULT_CATEGORY_KEY) return 1;
                        if (a.categoryKey !== DEFAULT_CATEGORY_KEY && b.categoryKey === DEFAULT_CATEGORY_KEY) return -1;
                        // Fallback to localeCompare on the display name if not dealing with default
                        return a.categoryName.localeCompare(b.categoryName);
                    });
                
                // Handle case where miscellaneous might not be directly in FRONTEND_CATEGORIAS keys if it's the only one
                // or if commands fall into default category not explicitly listed initially.
                if (groupedCommands[DEFAULT_CATEGORY_KEY] && !categoriesArray.some(c => c.categoryKey === DEFAULT_CATEGORY_KEY)) {
                     const defaultCatData = {
                        categoryKey: DEFAULT_CATEGORY_KEY,
                        categoryName: getCategoryInfo(DEFAULT_CATEGORY_KEY).display_name,
                        commands: groupedCommands[DEFAULT_CATEGORY_KEY].sort((a,b) => a.name.localeCompare(b.name))
                     }
                     const defaultIsAlreadyPushed = categoriesArray.find(cat => cat.categoryKey === DEFAULT_CATEGORY_KEY);
                     if(!defaultIsAlreadyPushed) {
                        categoriesArray.push(defaultCatData);
                     }
                }


                setCommandCategories(categoriesArray);
                if (categoriesArray.length > 0) {
                    // Set selected category to the first non-default, or default if it's the only one or first.
                    const firstNonDefault = categoriesArray.find(cat => cat.categoryKey !== DEFAULT_CATEGORY_KEY);
                    setSelectedCategoryKey(firstNonDefault ? firstNonDefault.categoryKey : categoriesArray[0].categoryKey);
                }

            } catch (err: any) {
                console.error("Failed to fetch commands:", err);
                setError(err.message || "Could not load commands.");
            } finally {
                setLoading(false);
            }
        };

        fetchCommands();
    }, [currentLocale]);

    const selectedCategoryData = commandCategories.find(cat => cat.categoryKey === selectedCategoryKey);
    const currentCommands = selectedCategoryData?.commands || [];
    const selectedCategoryDisplayName = selectedCategoryData?.categoryName || "";

    return (
        <>
            <Header />
            <Head>
                <title>Bot Commands - Kayylann</title>
                <meta name="description" content="Explore the full list of Kayylann Discord Bot commands." />
            </Head>

            <div className="bg-mainbg min-h-screen text-white py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    
                    <header className="mb-10 md:mb-16 text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-100">
                            Bot <span className="text-purple-400">Commands</span>
                        </h1>
                        <p className="mt-3 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                            Discover all the powerful commands Kayylann offers to enhance your server experience.
                        </p>
                    </header>

                    {loading ? (
                        <div className="text-center text-xl text-gray-300 py-10">Loading commands... ✨</div>
                    ) : error ? (
                        <div className="text-center text-xl text-red-400 bg-red-900/20 p-6 rounded-lg shadow-xl">
                            <strong>Error:</strong> {error}. Please try refreshing the page.
                        </div>
                    ) : commandCategories.length === 0 ? (
                         <div className="text-center text-xl text-gray-400 bg-secbg p-6 rounded-lg shadow-xl">
                            No commands available at the moment. Please check back later.
                        </div>
                    ) : (
                        <div className="lg:flex lg:space-x-8">
                            <aside className="lg:w-1/4 xl:w-1/5 mb-8 lg:mb-0">
                                <div className=" rounded-xl shadow-2xl p-5 sticky top-24">
                                    <h2 className="text-xl font-semibold text-purple-300 mb-4 border-b border-gray-700 pb-3">Categories</h2>
                                    <ul className="space-y-2">
                                        {commandCategories.map((category) => (
                                            <li key={category.categoryKey}>
                                                <button
                                                    onClick={() => setSelectedCategoryKey(category.categoryKey)}
                                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105
                                                        ${selectedCategoryKey === category.categoryKey
                                                            ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg'
                                                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-gray-100'
                                                        }`}
                                                >
                                                    {category.categoryName}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </aside>

                            <main className="lg:w-3/4 xl:w-4/5">
                                {selectedCategoryData && (
                                    <div className=" rounded-xl shadow-2xl overflow-hidden">
                                        <div className="px-6 py-5 border-b border-gray-700/70">
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-100">
                                                {selectedCategoryDisplayName}
                                            </h2>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {currentCommands.length} command(s) in this category.
                                            </p>
                                        </div>

                                        {currentCommands.length > 0 ? (
                                        <>
                                            {/* Table Header for larger screens */}
                                            <div className="hidden md:grid grid-cols-12 gap-x-6 px-6 py-3 border-b border-gray-700/70 bg-gray-800/30">
                                                <div className="col-span-12 md:col-span-3 text-xs font-bold uppercase text-purple-400 tracking-wider">Command</div>
                                                <div className="col-span-12 md:col-span-6 text-xs font-bold uppercase text-purple-400 tracking-wider">Description</div>
                                                <div className="col-span-12 md:col-span-3 text-xs font-bold uppercase text-purple-400 tracking-wider">Usage</div>
                                            </div>

                                            <div className="divide-y divide-gray-700/50">
                                                {currentCommands.map((command) => (
                                                    <div key={command.name} className="grid grid-cols-12 gap-x-6 gap-y-3 px-6 py-5 hover:bg-gray-700/20 transition-colors duration-150 items-start md:items-center">
                                                        <div className="col-span-12 md:col-span-3">
                                                            <p className="text-md font-semibold text-purple-300 break-all">/{command.name}</p>
                                                        </div>
                                                        <div className="col-span-12 md:col-span-6">
                                                            <p className="text-sm text-gray-300">{command.description}</p>
                                                        </div>
                                                        <div className="col-span-12 md:col-span-3">
                                                            <p className="text-sm text-blue-300 font-mono bg-gray-800/70 px-2 py-1 rounded-md inline-block break-all">
                                                                {command.usage}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                        ) : (
                                            <div className="px-6 py-10 text-center">
                                                <p className="text-gray-400 text-lg">🍃 No commands found in this category.</p>
                                            </div>
                                        )}
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