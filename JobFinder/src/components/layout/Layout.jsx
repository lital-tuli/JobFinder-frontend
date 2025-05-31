import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {/* Main content with skip navigation target */}
      <main id="main-content" style={{ paddingTop: '76px' }} role="main">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;