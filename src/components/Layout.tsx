
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { VoiceTrainer } from './VoiceTrainer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <VoiceTrainer />
    </div>
  );
};
