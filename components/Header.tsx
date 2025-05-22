import React from 'react';
import styles from '../styles/Home.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo}>Kayylann</h1>
      </div>
      
    </header>
   
  );
};

export default Header;