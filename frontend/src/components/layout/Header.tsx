import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  currentDate?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isRefreshing = false,
  currentDate = '2026-11-18',
}) => {
  const formattedDate = (() => {
    try {
      const d = new Date(currentDate + 'T00:00:00');
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const day = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      const year = d.getFullYear();
      return `Today · ${weekday}, ${day} ${month} ${year}`;
    } catch {
      return 'Today · Wed, 18 Nov 2026';
    }
  })();

  return (
    <header className="bg-white border-b border-slate-200/70 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Brand Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0f766e] flex items-center justify-center text-white font-bold text-base shadow-xs select-none">
            F
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-900 leading-tight tracking-tight">
              Finley
            </span>
            <span className="text-xs text-slate-500 font-normal leading-normal">
              Your money, at a glance
            </span>
          </div>
        </div>

        {/* Right: Date Pill (interactive with subtle refresh) */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs text-slate-600 bg-white border border-slate-200/90 rounded-full hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer shadow-xs disabled:opacity-60 select-none group"
          title="Click to refresh dashboard data"
        >
          <span>{formattedDate}</span>
          <RefreshCw
            className={`w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors ${
              isRefreshing ? 'animate-spin text-teal-600' : ''
            }`}
          />
        </button>
      </div>
    </header>
  );
};
