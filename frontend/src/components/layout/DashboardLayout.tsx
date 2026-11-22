import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {children}
      </main>
      <footer className="border-t border-slate-200/60 py-6 text-center text-xs text-slate-500 bg-white/40">
        <p className="max-w-7xl mx-auto px-4">
          Finley Dashboard &bull; Dynamic financial tracking &bull; Production Ready
        </p>
      </footer>
    </div>
  );
};
