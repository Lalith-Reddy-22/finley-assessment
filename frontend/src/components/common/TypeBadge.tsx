import React from 'react';
import type { TransactionType } from '../../types/transaction';

interface TypeBadgeProps {
  type: TransactionType | string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const styles: Record<string, string> = {
    Spend: 'bg-slate-100 text-slate-700 border-slate-200',
    Income: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Transfer: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Refund: 'bg-amber-50 text-amber-700 border-amber-200',
    Fee: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const style = styles[type] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${style}`}
    >
      {type}
    </span>
  );
};
