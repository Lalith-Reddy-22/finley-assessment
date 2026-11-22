import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { formatFullDate } from '../../utils/date';

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
  const displayDate = currentDate
    ? new Date(currentDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : formatFullDate();

  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 flex items-center justify-center text-white shadow-md shadow-slate-900/10">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-950 font-sans">
                  Finley
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                  Fintech
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Personal Finance Operating System</p>
            </div>
          </div>

          {/* Title & Date */}
          <div className="sm:text-center">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center sm:justify-center gap-2">
              Financial Overview
              <span className="hidden sm:inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h1>
            <p className="text-xs text-slate-500">
              Monthly overview &bull; <span className="font-medium text-slate-700">{displayDate}</span>
            </p>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 rounded-xl shadow-xs transition-all hover:border-slate-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              title="Reload dashboard data"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
              />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
