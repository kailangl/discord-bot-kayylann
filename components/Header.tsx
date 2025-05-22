import React from 'react';
import { useSession } from 'next-auth/react';
import styles from '../styles/Home.module.css';

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo}>Kayylann</h1>
        
        {session?.user && (
          <div className={styles.userInfo}>
            <img 
              src={session.user.image || '/default-avatar.png'} 
              alt="User Avatar" 
              className={styles.avatar}
            />
            <span className={styles.username}>{session.user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;