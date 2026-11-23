import React, { useState } from 'react';
import { RefreshCw, Info, ArrowLeftRight, Calendar } from 'lucide-react';

export type DateMode = 'current' | 'pdf';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  dateMode: DateMode;
  onToggleDateMode: () => void;
}

function formatDisplayDate(mode: DateMode, pdfDate: string = '2026-11-18'): string {
  try {
    const d = mode === 'pdf' ? new Date(pdfDate + 'T00:00:00') : new Date();
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const day = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `Today · ${weekday}, ${day} ${month} ${year}`;
  } catch {
    return mode === 'pdf' ? 'Today · Wed, 18 Nov 2026' : 'Today';
  }
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isRefreshing = false,
  dateMode,
  onToggleDateMode,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const formattedDate = formatDisplayDate(dateMode);

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

        {/* Right: Compact Date Pill with Small Reverse Switch & Info Logo */}
        <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200/90 rounded-full shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-800 select-none">{formattedDate}</span>

          {/* Small Reverse Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={dateMode === 'pdf'}
            onClick={onToggleDateMode}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition-all cursor-pointer group text-slate-600 hover:text-slate-900"
            title={`Reverse switch: click to switch to ${dateMode === 'current' ? 'date mentioned in PDF (18 Nov 2026)' : 'current date'}`}
            aria-label="Reverse date switch"
          >
            <ArrowLeftRight className="w-3 h-3 text-slate-400 group-hover:text-teal-700 group-hover:rotate-180 transition-transform duration-200" />
            <span className="text-[10px] font-semibold text-slate-600">
              {dateMode === 'pdf' ? 'PDF' : 'Live'}
            </span>
            {/* Small switch toggle track & moving dot */}
            <span
              className={`w-5 h-3 flex items-center rounded-full p-0.5 transition-colors ${
                dateMode === 'pdf' ? 'bg-[#0f766e]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`bg-white w-2 h-2 rounded-full shadow-xs transform transition-transform ${
                  dateMode === 'pdf' ? 'translate-x-2' : 'translate-x-0'
                }`}
              />
            </span>
          </button>

          {/* Info "i" Logo with Rich Hover Tooltip */}
          <div
            className="relative flex items-center cursor-help"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip((prev) => !prev)}
            aria-label="Date reference information"
          >
            <div className="w-4 h-4 rounded-full bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 flex items-center justify-center transition-colors">
              <Info className="w-2.5 h-2.5 text-slate-500 hover:text-teal-700" />
            </div>

            {/* Hover Tooltip Popover */}
            {showTooltip && (
              <div
                className="absolute right-0 top-full mt-2 w-76 p-3.5 bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl z-50 border border-slate-700 text-left cursor-default animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 border-b border-slate-700/80 pb-2 mb-2.5">
                  <Info className="w-4 h-4 text-teal-400 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-xs text-slate-100">
                      {dateMode === 'current' ? 'Current Date (Live)' : 'Date Mentioned in PDF'}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {dateMode === 'current'
                        ? "Active: Today's calendar date"
                        : 'Active: Benchmark from PDF spec (18 Nov 2026)'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {dateMode === 'current' ? (
                    <div className="p-2 rounded-lg bg-teal-950/70 border border-teal-500/50 text-teal-100">
                      <p className="text-[11px] leading-snug">
                        Currently showing <strong>Current Date</strong>. Discretionary spending, remaining days, and upcoming bills are dynamically calculated for today.
                      </p>
                      <p className="text-[10px] text-teal-300/80 mt-1.5 flex items-center gap-1">
                        <span>Click the reverse switch</span>
                        <ArrowLeftRight className="w-2.5 h-2.5 inline" />
                        <span>to switch to date mentioned in PDF.</span>
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-amber-950/70 border border-amber-500/50 text-amber-100">
                      <p className="text-[11px] leading-snug">
                        Currently showing <strong>Date Mentioned in PDF (18 Nov 2026)</strong>. Matches sample calculation and figures ($454.33 Safe to Spend, 13 days left).
                      </p>
                      <p className="text-[10px] text-amber-300/80 mt-1.5 flex items-center gap-1">
                        <span>Click the reverse switch</span>
                        <ArrowLeftRight className="w-2.5 h-2.5 inline" />
                        <span>to switch to current date.</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-60 rounded-full hover:bg-slate-100"
            title="Refresh dashboard data"
            aria-label="Refresh dashboard data"
          >
            <RefreshCw
              className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
