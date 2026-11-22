import React from 'react';
import {
  CalendarClock,
  AlertTriangle,
  Receipt,
  Clock,
  CheckCircle,
} from 'lucide-react';
import type { UpcomingBillsData } from '../../types/bill';
import { formatCurrency } from '../../utils/currency';
import { formatDateShort } from '../../utils/date';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';

interface UpcomingBillsCardProps {
  data: UpcomingBillsData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const UpcomingBillsCard: React.FC<UpcomingBillsCardProps> = ({
  data,
  loading,
  error,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs min-h-[340px] flex items-center justify-center">
        <Loading message="Fetching upcoming bills..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs min-h-[340px] flex items-center justify-center">
        <div className="w-full">
          <ErrorMessage
            title="Failed to load Upcoming Bills"
            message={error || 'No bills data available'}
            onRetry={onRetry}
          />
        </div>
      </div>
    );
  }

  const { upcoming_bills, potentially_late_bills, total_upcoming, date_range } = data;

  const frequencyLabels: Record<string, string> = {
    weekly: 'Weekly',
    biweekly: 'Biweekly',
    monthly: 'Monthly',
    annually: 'Annual',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Upcoming Bills</h2>
              <p className="text-xs text-slate-500">
                14-day window ({formatDateShort(date_range?.start)} &ndash; {formatDateShort(date_range?.end)})
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              14-Day Total
            </span>
            <span className="text-base font-bold text-slate-900">
              {formatCurrency(total_upcoming)}
            </span>
          </div>
        </div>

        {/* Separate Warning Section for Potentially Late Bills */}
        {potentially_late_bills && potentially_late_bills.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Attention Required: Potentially Late Bills ({potentially_late_bills.length})
              </h3>
            </div>
            <p className="text-[11px] text-amber-700 mb-3">
              Payment was expected before today and no newer recorded charge was found.
            </p>
            <div className="space-y-2">
              {potentially_late_bills.map((bill, index) => (
                <div
                  key={`${bill.id}-late-${index}`}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/80 border border-amber-200 text-xs shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                      Overdue
                    </span>
                    <span className="font-semibold text-slate-900">{bill.name}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-500">Due {formatDateShort(bill.expected_date)}</span>
                  </div>
                  <span className="font-bold text-rose-700">{formatCurrency(bill.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Bills List */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
            <span>Bill & Frequency</span>
            <span>Date & Amount</span>
          </div>

          {upcoming_bills.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
              No bills due in the next 14 days. You're all clear!
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[280px] pr-1">
              {upcoming_bills.map((bill, index) => (
                <div
                  key={`${bill.id}-upcoming-${index}`}
                  className="py-2.5 px-2 flex items-center justify-between hover:bg-slate-50/80 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                      <Receipt className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{bill.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {frequencyLabels[bill.frequency] || bill.frequency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(bill.amount)}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatDateShort(bill.expected_date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 mt-4 text-[11px] text-slate-500 flex items-center justify-between">
        <span>{upcoming_bills.length} upcoming scheduled charges</span>
        <span className="font-medium text-slate-600">Inclusive window</span>
      </div>
    </div>
  );
};
