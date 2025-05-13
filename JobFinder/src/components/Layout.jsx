// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '76px' }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;