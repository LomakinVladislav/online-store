import React from 'react';
import { Layout } from 'antd';
import styles from './Layout.module.css';
import Header from '../Header/Header';
import SideBar from '../Sidebar/Sidebar';
import { MenuProvider } from '../../contexts/MenuContext';
import { LayoutComponentProps } from '@/types';

const LayoutComponent: React.FC<LayoutComponentProps> = ({ children, isDarkMode, toggleTheme }) => {
  return (
    <MenuProvider>
      <div className={styles.appWindow}>
        <Layout style={{ height: "100vh" }}>
          <div className={styles.mainContainer}>
            <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <div className={styles.mainContent}>
              <SideBar />
              {children}
            </div>
          </div>
        </Layout>
      </div>
    </MenuProvider>
  );
};

export default LayoutComponent;