import React from 'react';

export interface EmptyStateProps {
  id?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  id,
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
}) => {
  return (
    <div
      id={id}
      className={`rounded-xl border border-dashed border-dm-border bg-dm-surface/50 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-dm-white border border-dm-border text-dm-primary-deep flex items-center justify-center shadow-subtle mb-4">
          {icon}
        </div>
      )}

      <h3 className="text-base font-semibold text-dm-ink tracking-tight mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-dm-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};
