import React from 'react';
import type { SafeToSpendData } from '../../types/dashboard';
import { formatCurrency } from '../../utils/currency';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';

interface SafeToSpendCardProps {
  data: SafeToSpendData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  monthName?: string;
}

export const SafeToSpendCard: React.FC<SafeToSpendCardProps> = ({
  data,
  loading,
  error,
  onRetry,
  monthName = 'this month',
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs min-h-[440px] flex items-center justify-center">
        <Loading message="Calculating safe-to-spend..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs min-h-[440px] flex items-center justify-center">
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
        {/* Card Header matching spec */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Safe to Spend</h2>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Left for the rest of {monthName}
          </p>
        </div>

        {/* Hero Value Section */}
        <div className="my-5">
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0f766e]">
            {is_negative ? '$0' : formatCurrency(safe_to_spend)}
          </div>
        </div>

        {/* Two Mini Cards: Per day & Days left */}
        <div className="grid grid-cols-2 gap-3 my-5">
          {/* Per day */}
          <div className="bg-[#f0fdf9] rounded-xl p-3.5 sm:p-4 border border-teal-100/40">
            <span className="text-xs font-semibold text-[#0f766e] block">Per day</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 block mt-1">
              {formatCurrency(daily_allowance)}
            </span>
          </div>

          {/* Days left */}
          <div className="bg-[#f0fdf9] rounded-xl p-3.5 sm:p-4 border border-teal-100/40">
            <span className="text-xs font-semibold text-[#0f766e] block">Days left</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 block mt-1">
              {days_remaining} {days_remaining === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="border-t border-slate-100 my-5" />

        {/* Breakdown Rows */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Monthly income</span>
            <span className="font-medium text-slate-900">{formatCurrency(monthly_income)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Bills still due</span>
            <span className="font-medium text-slate-900">− {formatCurrency(bills_remaining)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Spent this month</span>
            <span className="font-medium text-slate-900">− {formatCurrency(spent_this_month)}</span>
          </div>
        </div>

        {/* If negative box */}
        <div
          className={`mt-6 p-4 rounded-xl border border-dashed transition-all ${
            is_negative
              ? 'border-rose-300 bg-rose-50/60'
              : 'border-slate-300 bg-slate-50/40'
          }`}
        >
          <span
            className={`text-xs font-medium block mb-1.5 ${
              is_negative ? 'text-rose-600 font-semibold' : 'text-slate-400'
            }`}
          >
            If negative
          </span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-900">$0</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200/50">
              {is_negative
                ? `Over by ${formatCurrency(over_by)}`
                : 'Over by $120.50'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
