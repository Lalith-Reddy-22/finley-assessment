import React from 'react';
import {
  ArrowUpDown,
  TrendingDown,
  RotateCcw,
  Scale,
  Inbox,
} from 'lucide-react';
import type { TransactionsData, TransactionFilterType, TransactionType } from '../../types/transaction';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { StatusBadge } from '../common/StatusBadge';
import { TypeBadge } from '../common/TypeBadge';
import { SummaryMetric } from './SummaryMetric';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';

interface TransactionsCardProps {
  data: TransactionsData | null;
  loading: boolean;
  error: string | null;
  filter: TransactionFilterType;
  onFilterChange: (filter: TransactionFilterType) => void;
  onRetry: () => void;
}

export const TransactionsCard: React.FC<TransactionsCardProps> = ({
  data,
  loading,
  error,
  filter,
  onFilterChange,
  onRetry,
}) => {
  const filterOptions: TransactionFilterType[] = [
    'All',
    'Spend',
    'Income',
    'Transfer',
    'Refund',
    'Fee',
  ];

  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs min-h-[400px] flex items-center justify-center">
        <Loading message="Loading transactions..." />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs min-h-[400px] flex items-center justify-center">
        <div className="w-full">
          <ErrorMessage
            title="Failed to load transactions"
            message={error}
            onRetry={onRetry}
          />
        </div>
      </div>
    );
  }

  const { transactions = [], total_spend = 0, total_refunds = 0, net_spend = 0 } = data || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-900 text-white">
            <ArrowUpDown className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Transactions</h2>
            <p className="text-xs text-slate-500">
              Categorized ledger with automated classification rules
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80">
          {filterOptions.map((type) => {
            const isActive = filter === type;
            return (
              <button
                key={type}
                onClick={() => onFilterChange(type)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
        <SummaryMetric
          label="Total Spend"
          value={formatCurrency(total_spend)}
          subtitle="Sum of Spend transactions"
          icon={TrendingDown}
          variant="default"
        />
        <SummaryMetric
          label="Total Refunds"
          value={formatCurrency(total_refunds)}
          subtitle="Sum of absolute refunds"
          icon={RotateCcw}
          variant="success"
        />
        <SummaryMetric
          label="Net Spend"
          value={formatCurrency(net_spend)}
          subtitle="Total Spend - Total Refunds"
          icon={Scale}
          variant="info"
        />
      </div>

      {/* Table Section */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10 rounded-xl">
            <Loading message="Filtering transactions..." size="sm" />
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Inbox className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-600">No transactions found</p>
            <p className="text-xs text-slate-400 mt-0.5">
              No transactions match the selected filter &ldquo;{filter}&rdquo;.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/70">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/70">
                  <tr>
                    <th scope="col" className="px-4 py-3">Date</th>
                    <th scope="col" className="px-4 py-3">Description</th>
                    <th scope="col" className="px-4 py-3">Category</th>
                    <th scope="col" className="px-4 py-3">Type</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {transactions.map((txn) => {
                    const isIncomeOrRefund = txn.type === 'Income' || txn.type === 'Refund';
                    const isNegative = txn.amount < 0;

                    return (
                      <tr
                        key={txn.id}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        <td className="px-4 py-3.5 font-medium text-slate-600 whitespace-nowrap">
                          {formatDate(txn.date)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                            {txn.description}
                          </div>
                          {txn.to_account && (
                            <div className="text-[11px] text-indigo-600 mt-0.5">
                              &rarr; {txn.to_account}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                          {txn.category}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <TypeBadge type={txn.type as TransactionType} />
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <StatusBadge status={txn.status} />
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap font-bold">
                          <span
                            className={
                              isIncomeOrRefund
                                ? 'text-emerald-600'
                                : isNegative
                                ? 'text-emerald-600'
                                : 'text-slate-900'
                            }
                          >
                            {isNegative ? '-' : ''}
                            {formatCurrency(Math.abs(txn.amount))}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3">
              {transactions.map((txn) => {
                const isIncomeOrRefund = txn.type === 'Income' || txn.type === 'Refund';
                const isNegative = txn.amount < 0;

                return (
                  <div
                    key={txn.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-white space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{txn.description}</p>
                        <p className="text-[11px] text-slate-500">{formatDate(txn.date)} &bull; {txn.category}</p>
                        {txn.to_account && (
                          <p className="text-[11px] text-indigo-600">&rarr; {txn.to_account}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-sm font-bold block ${
                            isIncomeOrRefund
                              ? 'text-emerald-600'
                              : isNegative
                              ? 'text-emerald-600'
                              : 'text-slate-900'
                          }`}
                        >
                          {isNegative ? '-' : ''}
                          {formatCurrency(Math.abs(txn.amount))}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <TypeBadge type={txn.type as TransactionType} />
                      <StatusBadge status={txn.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Table Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
        </span>
        <span className="text-[11px]">Pending transactions included in calculation totals</span>
      </div>
    </div>
  );
};
