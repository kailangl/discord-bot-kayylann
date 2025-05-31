import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';
import { FileText, CheckSquare, User, AlertTriangle, Brain, ShieldAlert, Edit3, Mail } from 'lucide-react';

const TermsAndConditions: NextPage = () => {
  return (
    <div className="min-h-screen bg-mainbg text-gray-100">
      <Head>
        <title>Terms and Conditions - Kayylann Discord Bot</title>
        <meta name="description" content="Terms and Conditions for using the Kayylann Discord Bot and Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <section className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={styles.title}>
              <span className={styles.firstWord}>
                Terms
              </span>{' '}
              and Conditions
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mt-4 mb-8">
              Please read these terms and conditions carefully before using our Bot and Site.
            </p>
            <p className="text-sm text-gray-400">Last updated: May 30, 2024</p>
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-5xl mx-auto px-4 space-y-12">

            {/* Introduction */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400 flex items-center">
                <CheckSquare size={28} className="mr-3" /> 1. Acceptance of Terms
              </h2>
              <p className="text-gray-300">
                By adding the Kayylann Discord bot ("Bot") to your Discord server, or by accessing or using our dashboard website ("Site"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of the terms, you may not access or use our services. These Terms apply to all server administrators, moderators, and users who interact with the Bot or Site.
              </p>
            </div>

            {/* Use of the Bot and Dashboard */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                <User size={28} className="mr-3" /> 2. Use of the Bot and Dashboard
              </h2>
              <p className="text-gray-300 mb-3">
                Kayylann provides a range of features including moderation, economy, and utility commands. The dashboard allows for configuration of these features.
              </p>
              <h3 className="text-xl font-semibold mb-2 text-gray-200">Permitted Use:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                <li>You may use the Bot on your Discord server(s) as intended by its features.</li>
                <li>You may use the Site to configure the Bot for servers where you have administrative privileges.</li>
                <li>You must comply with Discord's Terms of Service at all times.</li>
              </ul>
              <h3 className="text-xl font-semibold mb-2 text-gray-200">Prohibited Activities:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Attempting to disrupt, overload, or impair the Bot or Site.</li>
                <li>Using the Bot or Site for any illegal or unauthorized purpose.</li>
                <li>Exploiting any bugs or vulnerabilities in the Bot or Site.</li>
                <li>Distributing spam or engaging in malicious activities through the Bot.</li>
                <li>Reverse engineering or decompiling any part of the Bot or Site.</li>
              </ul>
            </div>

            {/* User Accounts and Responsibilities */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-green-400 flex items-center">
                <User size={28} className="mr-3" /> 3. User Accounts and Responsibilities
              </h2>
              <p className="text-gray-300 mb-3">
                To access certain features of the Site (e.g., the dashboard), you must log in using your Discord account.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>You are responsible for maintaining the confidentiality of your Discord account and for all activities that occur under your account.</li>
                <li>You are responsible for the configurations you apply to the Bot on your server.</li>
                <li>You agree to ensure that your server members' use of the Bot complies with these Terms and Discord's Terms of Service.</li>
                <li>You acknowledge that the Bot stores data related to your Discord user ID, server ID, and channel IDs as described in our Privacy Policy.</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center">
                <Brain size={28} className="mr-3" /> 4. Intellectual Property
              </h2>
              <p className="text-gray-300">
                The Kayylann Bot, the Site, and all their original content (excluding data provided by users or Discord), features, and functionality are and will remain the exclusive property of the Kayylann development team (Blayy) and its licensors. The Bot and Site are protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
            </div>
            
            {/* Disclaimers */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-red-400 flex items-center">
                <AlertTriangle size={28} className="mr-3" /> 5. Disclaimers
              </h2>
              <p className="text-gray-300">
                The Bot and Site are provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the operation or availability of the Bot or Site, or the information, content, or materials included therein. You expressly agree that your use of these services is at your sole risk.
              </p>
              <p className="text-gray-300 mt-2">
                We do not warrant that the Bot or Site will be uninterrupted, secure, or error-free, that defects will be corrected, or that the services or the servers that make them available are free of viruses or other harmful components.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-red-400 flex items-center">
                <ShieldAlert size={28} className="mr-3" /> 6. Limitation of Liability
              </h2>
              <p className="text-gray-300">
                To the fullest extent permitted by applicable law, in no event shall the Kayylann development team, its affiliates, directors, employees, agents, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Bot or Site; (ii) any conduct or content of any third party on the service; (iii) any content obtained from the service; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.
              </p>
            </div>

            {/* Termination */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400 flex items-center">
                <AlertTriangle size={28} className="mr-3" /> 7. Termination
              </h2>
              <p className="text-gray-300">
                We may terminate or suspend your access to our Bot and Site immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the services will immediately cease. If you wish to terminate your account, you can simply remove the Bot from your server and cease using the Site.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                <Edit3 size={28} className="mr-3" /> 8. Changes to Terms
              </h2>
              <p className="text-gray-300">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Bot or Site after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </div>

            {/* Contact Us */}
            <div className=" p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-green-400 flex items-center">
                <Mail size={28} className="mr-3" /> 9. Contact Us
              </h2>
              <p className="text-gray-300">
                If you have any questions about these Terms, please contact us at: <a href="mailto:blayydeveloper@gmail.com" className="text-purple-400 hover:underline">blayydeveloper@gmail.com</a> or through our official support channels (e.g., <a href="https://discord.gg/HXKwPj4FY6" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">our Discord support server</a>).
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;