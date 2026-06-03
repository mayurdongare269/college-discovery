'use client';

import { SessionProvider } from 'next-auth/react';
import { CompareProvider } from '@/lib/compare-context';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CompareProvider>
        <Toaster position="top-right" />
        {children}
      </CompareProvider>
    </SessionProvider>
  );
}
