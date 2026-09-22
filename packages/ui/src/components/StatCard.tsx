import React from 'react';

export interface StatCardProps {
  id?: string;
  label: string;
  value: string | number;
  unit?: string;
  helperText?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  label,
  value,
  unit,
  helperText,
  icon,
  trend,
  className = '',
}) => {
  return (
    <div
      id={id}
      className={`bg-dm-white rounded-xl border border-dm-border p-5 shadow-subtle flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium text-dm-muted leading-snug">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-dm-primary-soft/60 text-dm-primary-deep flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-dm-ink tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-dm-muted">{unit}</span>
        )}
      </div>

      {(trend || helperText) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-semibold tabular-nums ${
                trend.isPositive ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {trend.value}
            </span>
          )}
          {helperText && (
            <span className="text-dm-muted truncate">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
};
