'use client';

import Menu from '@/components/Menu/Menu';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-quinary overflow-hidden">
      <Menu />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
