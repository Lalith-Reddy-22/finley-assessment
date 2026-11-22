import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: 'completed' | 'pending' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isPending = status.toLowerCase() === 'pending';

  if (isPending) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
        <Clock className="w-3 h-3 text-amber-500" />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
      Completed
    </span>
  );
};
