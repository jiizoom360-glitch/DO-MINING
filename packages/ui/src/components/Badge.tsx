import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'neutral' | 'accent' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center font-medium rounded-full tracking-wide select-none whitespace-nowrap';

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantClasses = {
    primary: 'bg-dm-primary-soft text-dm-primary-deep border border-dm-primary/20',
    neutral: 'bg-dm-surface text-dm-muted border border-dm-border',
    accent: 'bg-dm-accent/20 text-dm-ink border border-dm-accent/30',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    outline: 'bg-transparent text-dm-ink border border-dm-border',
  };

  const dotClasses = {
    primary: 'bg-dm-primary',
    neutral: 'bg-dm-muted',
    accent: 'bg-dm-accent',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    outline: 'bg-dm-ink',
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
