import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';
import { ShieldCheck, Database, Share2, UserCheck, FileText, Mail } from 'lucide-react';

const PrivacyPolicy: NextPage = () => {
  return (
    <div className="min-h-screen bg-mainbg text-gray-100">
      <Head>
        <title>Privacy Policy - Kayylann Discord Bot</title>
        <meta name="description" content="Privacy Policy for the Kayylann Discord Bot and Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <section className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={styles.title}>
              <span className={styles.firstWord}>
                Privacy
              </span>{' '}
              Policy
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mt-4 mb-8">
              Your privacy is important to us. This policy explains what information we collect and how we use it.
            </p>
            <p className="text-sm text-gray-400">Last updated: May 29, 2024</p>
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-5xl mx-auto px-4 space-y-12">
            
            {/* Introduction */}
            <div className="p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400 flex items-center">
                <FileText size={28} className="mr-3" /> Introduction
              </h2>
              <p className="text-gray-300">
                This Privacy Policy applies to the Kayylann Discord bot ("Bot") and its associated dashboard website ("Site"). It describes how we collect, use, and protect your personal information when you add our Bot to your Discord server or use our Site. By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>

            {/* Information We Collect */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                <Database size={28} className="mr-3" /> Information We Collect
              </h2>
              <ul className="list-disc list-inside space-y-3 text-gray-300">
                <li>
                  <strong>Discord User Information:</strong> When you log in to our Site, we collect your basic Discord user information provided by the Discord API, such as your Discord user ID, username, and avatar. This is used to identify you and personalize your experience on the dashboard.
                </li>
                <li>
                  <strong>Server Information:</strong> The Bot has access to information about the servers (guilds) it is in, including server ID, server name, and channel IDs and names. This is necessary for the Bot to function correctly within your server and for you to configure it through the dashboard.
                </li>
                <li>
                  <strong>Configuration Data:</strong> We store the settings and configurations you create for the Bot on your server, such as moderation settings, custom commands, and economy system preferences.
                </li>
                 <li>
                  <strong>Usage Data:</strong> We may collect data on how the Bot and Site are used, such as commands executed or pages visited on the dashboard, to help us improve our services.
                </li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-green-400 flex items-center">
                <UserCheck size={28} className="mr-3" /> How We Use Your Information
              </h2>
               <p className="text-gray-300">
                The information we collect is used solely for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-3 mt-4 text-gray-300">
                <li>To provide and maintain the core functionalities of the Kayylann bot.</li>
                <li>To allow you to log in and manage the Bot's settings through our dashboard.</li>
                <li>To provide customer support and respond to your inquiries.</li>
                <li>To monitor and analyze usage to improve the user experience and the Bot's features.</li>
                <li>To ensure the security and integrity of our services.</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center">
                <Share2 size={28} className="mr-3" /> Information Sharing
              </h2>
              <p className="text-gray-300">
                We do not sell, trade, or rent your personal information to others. We may share your information only in the following limited circumstances:
              </p>
               <ul className="list-disc list-inside space-y-3 mt-4 text-gray-300">
                <li>
                  <strong>With your Consent:</strong> We may share information if you have given us explicit consent to do so.
                </li>
                <li>
                  <strong>For External Processing:</strong> Your data is stored and processed using <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Supabase</a>. We rely on their security measures to keep your data safe.
                </li>
                 <li>
                  <strong>For Legal Reasons:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.
                </li>
              </ul>
            </div>

            {/* Data Security */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400 flex items-center">
                <ShieldCheck size={28} className="mr-3" /> Data Security
              </h2>
              <p className="text-gray-300">
                We are committed to protecting your information. We implement a variety of security measures, including the use of secure services like Supabase, to maintain the safety of your personal data. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security.
              </p>
            </div>
            
            {/* Contact Us */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                <Mail size={28} className="mr-3" /> Contact Us
              </h2>
              <p className="text-gray-300">
                If you have any questions about this Privacy Policy, or if you wish to exercise your rights regarding your data, please contact us at: <a href="mailto:blayydeveloper@gmail.com" className="text-purple-400 hover:underline">blayydeveloper@gmail.com</a> or by joining our support server on Discord.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;