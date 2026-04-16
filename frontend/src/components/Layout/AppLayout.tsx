import type { ReactNode } from 'react';

export const AppLayout = ({ children }: { children: ReactNode }) => (
  <main className="bg-dotbackground min-h-screen flex flex-col">
    {children}
  </main>
);
