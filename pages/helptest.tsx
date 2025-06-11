import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  ChevronLeft,
  HelpCircle,
  Command,
  Settings,
  Shield,
  MessageSquare,
  Bot,
  User,
  Server,
  Code,
  BookOpen,
  Disc,
  Mail,
  Github
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Help: NextPage = () => {
  const categories = [
    {
      title: 'Getting Started',
      icon: <Disc size={24} className="text-purple-400" />,
      items: [
        {
          question: 'How do I add Kayylann to my server?',
          answer: 'Click the "Add to Server" button on our homepage or use the invite link provided in your dashboard after logging in.'
        },
        {
          question: 'What permissions does Kayylann need?',
          answer: 'Kayylann requires Administrator permissions to function properly. The invite link will request these permissions automatically.'
        },
        {
          question: 'How do I access the dashboard?',
          answer: 'Log in with Discord on our website, then select your server from the list of available servers where Kayylann is present.'
        }
      ]
    },
    {
      title: 'Basic Commands',
      icon: <Command size={24} className="text-blue-400" />,
      items: [
        {
          question: 'What are the basic commands?',
          answer: 'Try /help in your server to see all available commands. Common ones include /ping, /stats, and /config.'
        },
        {
          question: 'How do I set up auto-responses?',
          answer: 'Use the /response add command or configure them in the dashboard under the "Auto-Responses" section.'
        },
        {
          question: 'Can I create custom commands?',
          answer: 'Yes! Use the /command create command or set them up in the dashboard under "Custom Commands".'
        }
      ]
    },
    {
      title: 'Moderation',
      icon: <Shield size={24} className="text-green-400" />,
      items: [
        {
          question: 'How do I enable auto-moderation?',
          answer: 'Navigate to the "Moderation" tab in your dashboard and configure the settings according to your needs.'
        },
        {
          question: 'What moderation features are available?',
          answer: 'Kayylann includes spam protection, link filtering, word filters, and automatic warning systems.'
        },
        {
          question: 'How do I view moderation logs?',
          answer: 'Use the /modlogs command or check the "Moderation Logs" section in your dashboard.'
        }
      ]
    },
    {
      title: 'AI Features',
      icon: <Bot size={24} className="text-yellow-400" />,
      items: [
        {
          question: 'How do I enable AI chat?',
          answer: 'Set up an AI channel using /ai set-channel or configure it in the "AI Settings" section of your dashboard.'
        },
        {
          question: 'Can I customize the AI personality?',
          answer: 'Yes! You can adjust the AI behavior, response style, and knowledge base in the dashboard settings.'
        },
        {
          question: 'What AI model does Kayylann use?',
          answer: 'Kayylann uses advanced language models from OpenAI, fine-tuned specifically for Discord interactions.'
        }
      ]
    },
    {
      title: 'Troubleshooting',
      icon: <HelpCircle size={24} className="text-red-400" />,
      items: [
        {
          question: 'Kayylann isn\'t responding to commands',
          answer: '1. Check if the bot is online in your server\n2. Verify it has the correct permissions\n3. Ensure you\'re using slash commands (/)'
        },
        {
          question: 'I\'m getting "Missing Permissions" errors',
          answer: 'Reinvite the bot with the correct permissions or ask a server admin to adjust the bot\'s role permissions.'
        },
        {
          question: 'How do I report a bug?',
          answer: 'Join our support server (link below) or open an issue on our GitHub repository.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-mainbg text-gray-100">
      <Head>
        <title>Kayylann Help Center</title>
        <meta name="description" content="Help center for the Kayylann Discord bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Kayylann
              </span>{' '}
              Help Center
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Find answers to common questions, learn about features, and get help with any issues you encounter.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search help articles..."
                className="w-full px-6 py-3 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-500 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Link href={`#${category.title.toLowerCase().replace(' ', '-')}`} key={index}>
                  <div className="bg-gray-800 hover:bg-gray-700 p-6 rounded-xl transition-colors cursor-pointer h-full">
                    <div className="flex items-center mb-4">
                      <div className="mr-3">
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-semibold">{category.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {category.items.slice(0, 2).map((item, i) => (
                        <li key={i} className="text-gray-300 hover:text-white transition-colors">
                          {item.question}
                        </li>
                      ))}
                      {category.items.length > 2 && (
                        <li className="text-purple-400">+ {category.items.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            
            {categories.map((category, index) => (
              <div key={index} id={category.title.toLowerCase().replace(' ', '-')} className="mb-16">
                <div className="flex items-center mb-6">
                  <div className="mr-3">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.items.map((item, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-2 text-white">{item.question}</h4>
                      <p className="text-gray-300 whitespace-pre-line">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-8 rounded-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-gray-300 mb-6">
                Join our Discord support server or contact us directly for assistance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://discord.gg/YOUR_INVITE_CODE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  
                  Join Support Server
                </a>
                <a
                  href="mailto:support@kayylann.xyz"
                  className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Mail size={20} className="mr-2" />
                  Email Support
                </a>
                <a
                  href="https://github.com/your-repo/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Github size={20} className="mr-2" />
                  Report a Bug
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Help;