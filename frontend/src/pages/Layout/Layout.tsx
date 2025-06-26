import React from 'react';
import { Layout } from 'antd';
import styles from './Layout.module.css'
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import SideBar from '../../components/Menu/Sidebar';

type LayoutProps = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const LayoutComponent = ({ isDarkMode, toggleTheme }: LayoutProps) => {
  return (
  <Layout style={{ height: "100vh" }}>
  <div className={styles[`main-container`]}>
    <header>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </header>
    <div className={styles[`main-content`]}>
      <aside>
        <SideBar />
      </aside>
      <main>
        <Content /> 
      </main>
    </div>
  </div>
  </Layout>
)}

export default LayoutComponent;