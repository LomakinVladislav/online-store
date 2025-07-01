import React, { ReactNode } from 'react';
import { Layout } from 'antd';
import styles from './Layout.module.css'
import Header from '../Header/Header';
import SideBar from '../Sidebar/Sidebar';

interface LayoutComponentProps {
  children?: ReactNode;
  isDarkMode: boolean;
  toggleTheme: () => void;
}


const LayoutComponent: React.FC<LayoutComponentProps> = ({ children, isDarkMode, toggleTheme }) => {
  return (
    <div className={styles[`app-window`]}>
      <Layout style={{ height: "100vh" }}>
        <div className={styles[`main-container`]}>
          <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <div className={styles[`main-content`]}>
            <SideBar />
            {children}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default LayoutComponent;