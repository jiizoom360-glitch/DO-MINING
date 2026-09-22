import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  isHoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  id,
  title,
  subtitle,
  badge,
  action,
  headerActions,
  footer,
  isHoverable = false,
  padding = 'md',
  className = '',
  children,
  ...props
}) => {
  const resolvedAction = action || headerActions;
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const hoverClasses = isHoverable
    ? 'hover:border-dm-primary/40 hover:shadow-card transition-all duration-200 cursor-pointer'
    : '';

  return (
    <article
      id={id}
      className={`bg-dm-white rounded-xl border border-dm-border shadow-subtle ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      {...props}
    >
      {(title || subtitle || badge || resolvedAction) && (
        <header className="flex items-start justify-between gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              {title && (
                <h3 className="text-base font-semibold text-dm-ink tracking-tight">
                  {title}
                </h3>
              )}
              {badge && <div className="shrink-0">{badge}</div>}
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-dm-muted leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {resolvedAction && <div className="shrink-0">{resolvedAction}</div>}
        </header>
      )}

      <div>{children}</div>

      {footer && (
        <footer className="mt-5 pt-3.5 border-t border-dm-border/80 flex items-center justify-between text-xs text-dm-muted">
          {footer}
        </footer>
      )}
    </article>
  );
};
