import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BotMessageSquare, User } from 'lucide-react';

const About: NextPage = () => {
  return (
    <div className="min-h-screen bg-mainbg text-gray-100">
      <Head>
        <title>About Kayy Discord Bot</title>
        <meta name="description" content="Learn more about Kayy Discord bot and its creator, Blayy." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <section className="py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Kayy
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the story behind Kayy, the AI-powered Discord bot, and meet its dedicated creator.
          </p>
        </section>

        <hr className="border-t border-gray-700 my-8" />

        <section className="py-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-4">
                <User size={60} className="text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Meet the Creator: Blayy
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Kayy was brought to life by <strong>Blayy</strong>, a passionate developer with a vision to enhance Discord communities through intelligent automation. With a keen eye for detail and a commitment to innovation, Blayy continuously works to refine Kayy, adding new features and ensuring a seamless experience for all users.
              </p>
              <p className="text-gray-300 text-lg mt-4 leading-relaxed">
                Blayy is dedicated to creating tools that are not only powerful but also intuitive and fun to use. Your feedback is always welcome and plays a crucial role in Kayy's ongoing development!
              </p>
            </div>
            <div className="flex justify-center items-center">
              {/* You can add an image of Blayy or a placeholder here */}
              <img
                src="/images/blayy.png" // Replace with an actual image path
                alt="Blayy's Avatar"
                className="rounded-full w-48 h-48 object-cover shadow-lg border-4 border-purple-500"
              />
            </div>
          </div>
        </section>

        <hr className="border-t border-gray-700 my-8" />

        <section className="py-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center items-center order-last md:order-first">
              <BotMessageSquare size={180} className="text-purple-400 opacity-80" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-4">
                About Kayy Discord Bot
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                <strong>Kayy</strong> is more than just a Discord bot; it's a comprehensive solution designed to bring smart, dynamic, and personalized interactions to your server. Leveraging cutting-edge artificial intelligence, Kayy automates responses, provides advanced moderation, and offers a suite of customizable commands.
              </p>
              <p className="text-gray-300 text-lg mt-4 leading-relaxed">
                From engaging conversations to maintaining a safe and organized environment, Kayy is built to enhance the overall Discord experience. Its intuitive dashboard allows server administrators to easily manage all configurations, making powerful features accessible to everyone. Join the future of Discord interaction with Kayy!
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;