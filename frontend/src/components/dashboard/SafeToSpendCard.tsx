import React from 'react';
import {
  Wallet,
  TrendingUp,
  Receipt,
  CreditCard,
  Calendar,
  AlertTriangle,
  Info,
} from 'lucide-react';
import type { SafeToSpendData } from '../../types/dashboard';
import { formatCurrency } from '../../utils/currency';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';

interface SafeToSpendCardProps {
  data: SafeToSpendData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const SafeToSpendCard: React.FC<SafeToSpendCardProps> = ({
  data,
  loading,
  error,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs min-h-[340px] flex items-center justify-center">
        <Loading message="Calculating safe-to-spend..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs min-h-[340px] flex items-center justify-center">
        <div className="w-full">
          <ErrorMessage
            title="Failed to load Safe to Spend"
            message={error || 'No spending data available'}
            onRetry={onRetry}
          />
        </div>
      </div>
    );
  }

  const {
    monthly_income,
    bills_remaining,
    spent_this_month,
    safe_to_spend,
    daily_allowance,
    days_remaining,
    is_negative,
    over_by,
  } = data;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Safe to Spend</h2>
              <p className="text-xs text-slate-500">Available discretionary funds for this month</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{days_remaining} {days_remaining === 1 ? 'day' : 'days'} left</span>
          </div>
        </div>

        {/* Hero Value Section */}
        <div className="py-6 sm:py-7">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            <span
              className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${
                is_negative ? 'text-slate-400' : 'text-emerald-600'
              }`}
            >
              {formatCurrency(safe_to_spend)}
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              available right now
            </span>
          </div>

          {/* Emphasized Warning if negative */}
          {is_negative && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 animate-in fade-in duration-200">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-rose-900 uppercase tracking-wide">Budget Alert</p>
                <p className="text-sm font-semibold text-rose-700">
                  Over by <span className="font-extrabold">{formatCurrency(over_by)}</span>
                </p>
              </div>
            </div>
          )}

          {/* Daily Allowance Highlight */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50/70 border border-emerald-100/80 text-emerald-800 text-xs font-medium">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Daily allowance: <strong className="font-bold">{formatCurrency(daily_allowance)}</strong> / day
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
        {/* Monthly Income */}
        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Monthly Income</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900">
            {formatCurrency(monthly_income)}
          </div>
        </div>

        {/* Bills Still Due */}
        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium mb-1">
            <Receipt className="w-3.5 h-3.5 text-blue-600" />
            <span>Bills Due This Month</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900">
            {formatCurrency(bills_remaining)}
          </div>
        </div>

        {/* Spent This Month */}
        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium mb-1">
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            <span>Spent This Month</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900">
            {formatCurrency(spent_this_month)}
          </div>
        </div>

        {/* Days Left */}
        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium mb-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Days Remaining</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900">
            {days_remaining} {days_remaining === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>
    </div>
  );
};
