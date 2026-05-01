import type { ReactNode } from 'react';

export const AppLayout = ({ children }: { children: ReactNode }) => (
  <main className="bg-dotbackground min-h-screen">
    <div className="mx-auto flex w-full max-w-[90rem] flex-col px-3 sm:px-5 lg:px-6">
      {children}
    </div>
  </main>
);
