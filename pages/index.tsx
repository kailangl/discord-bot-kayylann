import type { NextPage } from 'next';
import { useSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { status } = useSession();

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

            {status !== "authenticated" && (
              <button onClick={() => signIn('discord')} className={styles.secondaryButton}>
                LOG IN
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;