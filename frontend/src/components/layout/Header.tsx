import React, { useState } from 'react';
import { RefreshCw, Info, ArrowLeftRight, Calendar } from 'lucide-react';

export type DateMode = 'current' | 'pdf';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  dateMode: DateMode;
  onToggleDateMode: () => void;
  onSelectDateMode: (mode: DateMode) => void;
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
  onSelectDateMode,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const formattedDate = formatDisplayDate(dateMode);

  return (
    <header className="bg-white border-b border-slate-200/70 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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

        {/* Right: Date Switcher, Pill & Refresh */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Reverse Switch Segmented Control */}
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 text-xs shadow-inner">
            <button
              onClick={() => onSelectDateMode('current')}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                dateMode === 'current'
                  ? 'bg-white text-teal-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to live current date"
            >
              Current Date
            </button>

            {/* Reverse Switch Button */}
            <button
              onClick={onToggleDateMode}
              className="p-1 mx-0.5 text-slate-400 hover:text-teal-700 hover:bg-white rounded-full transition-all cursor-pointer group"
              title="Reverse Date Switch (flip between Current Date and PDF Date)"
              aria-label="Reverse date switch"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-200" />
            </button>

            <button
              onClick={() => onSelectDateMode('pdf')}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                dateMode === 'pdf'
                  ? 'bg-white text-teal-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to PDF benchmark date (Nov 18, 2026)"
            >
              PDF Date (Nov 18)
            </button>
          </div>

          {/* Active Date Pill with Info Logo & Refresh */}
          <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200/90 rounded-full shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-800">{formattedDate}</span>

            {/* Mode Badge */}
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase ${
                dateMode === 'pdf'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {dateMode === 'pdf' ? 'PDF Spec' : 'Live'}
            </span>

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
                  className="absolute right-0 top-full mt-2 w-80 p-3.5 bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl z-50 border border-slate-700 text-left cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2 border-b border-slate-700/80 pb-2 mb-2.5">
                    <Info className="w-4 h-4 text-teal-400 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-xs text-slate-100">Date Reference Mode</h4>
                      <p className="text-[10px] text-slate-400">Switchable calculation benchmarks</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Current Date Details */}
                    <div
                      className={`p-2 rounded-lg transition-colors border ${
                        dateMode === 'current'
                          ? 'bg-teal-950/70 border-teal-500/50 text-teal-100'
                          : 'bg-slate-800/60 border-slate-700/50 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-[11px] mb-0.5">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${dateMode === 'current' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                          Current Date (Live)
                        </span>
                        {dateMode === 'current' && (
                          <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Computes discretionary spend, days left, and upcoming bills dynamically using today&apos;s live calendar date.
                      </p>
                    </div>

                    {/* PDF Spec Date Details */}
                    <div
                      className={`p-2 rounded-lg transition-colors border ${
                        dateMode === 'pdf'
                          ? 'bg-teal-950/70 border-teal-500/50 text-teal-100'
                          : 'bg-slate-800/60 border-slate-700/50 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-[11px] mb-0.5">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${dateMode === 'pdf' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                          Date Mentioned in PDF (18 Nov 2026)
                        </span>
                        {dateMode === 'pdf' && (
                          <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Matches the assignment specification benchmark ($454.33 Safe to Spend, 13 days remaining) for verification against the PDF.
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-700/80 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Click ⇄ to reverse date</span>
                    <span className="text-teal-400 font-medium">Finley Engine</span>
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
      </div>
    </header>
  );
};
