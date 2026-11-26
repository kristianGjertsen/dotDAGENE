import type { ReactNode } from 'react';
import { SnowOverlay } from '../Elements/SnowOverlay';

export const AppLayout = ({
  children,
  snow = true,
}: {
  children: ReactNode;
  snow?: boolean;
}) => (
  <main className="bg-dotbackground relative isolate min-h-screen">
    {snow && <SnowOverlay />}
    <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-col px-3 sm:px-5 lg:px-6">
      {children}
    </div>
  </main>
);
