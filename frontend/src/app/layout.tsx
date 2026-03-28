import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { LoadingBar } from '@/components/ui/LoadingBar';
import LoadingTrigger from '@/components/navigation/LoadingTrigger';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'ServeConnect - Professional Services Marketplace',
  description: 'Connect with top-rated service providers in your city.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900 min-h-screen`}>
        <LoadingBar />
        <Suspense fallback={null}>
          <LoadingTrigger />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
