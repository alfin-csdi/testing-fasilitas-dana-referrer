import React, { ReactNode } from 'react';
import { Layout as AntLayout } from 'antd';
import { Header } from './Header';


const { Content } = AntLayout;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout className="min-h-screen">
      <Header />
      <Content className="p-6">
        <div className="bg-white p-6 rounded shadow">
          {children}
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout;