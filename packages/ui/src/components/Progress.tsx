import React from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 à 100
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'deep' | 'accent';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  label,
  showValue = true,
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const fillVariantClasses = {
    primary: 'bg-dm-primary',
    deep: 'bg-dm-primary-deep',
    accent: 'bg-dm-accent',
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-medium text-dm-muted mb-1.5">
          {label && <span className="truncate">{label}</span>}
          {showValue && (
            <span className="font-semibold text-dm-ink tabular-nums ml-2">
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${sizeClasses[size]} bg-dm-border/70 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progression'}
      >
        <div
          className={`${sizeClasses[size]} ${fillVariantClasses[variant]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
