import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface LayoutProps {
  children?: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'This is the default title' }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        <Link href="/">Home</Link>{' '}|{' '}
        <Link href="/about">About</Link>{' '}|{' '}
        <Link href="/users">Users List</Link>{' '}
      </nav>
    </header>
    {children}
  </div>
);

export default Layout;
