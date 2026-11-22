import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SummaryMetricProps {
  label: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
}

export const SummaryMetric: React.FC<SummaryMetricProps> = ({
  label,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  className = '',
}) => {
  const variantStyles = {
    default: {
      bg: 'bg-white',
      border: 'border-slate-200/80',
      text: 'text-slate-900',
      iconBg: 'bg-slate-100 text-slate-700',
    },
    success: {
      bg: 'bg-emerald-50/40',
      border: 'border-emerald-200/80',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    danger: {
      bg: 'bg-rose-50/40',
      border: 'border-rose-200/80',
      text: 'text-rose-700',
      iconBg: 'bg-rose-100 text-rose-800',
    },
    warning: {
      bg: 'bg-amber-50/40',
      border: 'border-amber-200/80',
      text: 'text-amber-700',
      iconBg: 'bg-amber-100 text-amber-800',
    },
    info: {
      bg: 'bg-blue-50/40',
      border: 'border-blue-200/80',
      text: 'text-blue-700',
      iconBg: 'bg-blue-100 text-blue-800',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`p-4 rounded-xl border ${style.border} ${style.bg} transition-all hover:shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          {label}
        </span>
        {Icon && (
          <div className={`p-1.5 rounded-lg ${style.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <span className={`text-xl font-bold tracking-tight ${style.text}`}>{value}</span>
        {subtitle && <p className="text-[11px] text-slate-600 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
};
