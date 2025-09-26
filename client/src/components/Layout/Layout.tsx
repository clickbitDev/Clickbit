import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from '../Sidebar';
import CookieConsent from '../CookieConsent';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Layout;