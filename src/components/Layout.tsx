import '../styles/globals.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/invoices" style={{ marginRight: '1rem' }}>Invoices</Link>
          <Link to="/users" style={{ marginRight: '1rem' }}>Users</Link>
          <Link to="/blockchains">Blockchains</Link>
        </div>
        <ConnectButton />
      </nav>
      <main style={{ padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
