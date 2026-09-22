import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  as?: React.ElementType;
}

export const Button = React.forwardRef<any, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isLoading = false,
      disabled,
      className = '',
      children,
      as: Component = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dm-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

    const sizeClasses = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
      md: 'text-sm px-4 py-2 gap-2 min-h-[40px]',
      lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[44px]',
    };

    const variantClasses = {
      primary:
        'bg-dm-primary text-dm-white hover:bg-dm-primary-deep shadow-xs focus-visible:ring-dm-primary',
      secondary:
        'bg-dm-primary-deep text-dm-white hover:bg-dm-ink shadow-xs focus-visible:ring-dm-primary-deep',
      outline:
        'border border-dm-border bg-dm-white text-dm-ink hover:bg-dm-surface hover:border-dm-primary/40 focus-visible:ring-dm-primary',
      ghost:
        'bg-transparent text-dm-muted hover:bg-dm-primary-soft/50 hover:text-dm-primary-deep focus-visible:ring-dm-primary',
      accent:
        'bg-dm-accent text-dm-ink hover:brightness-95 shadow-xs font-semibold focus-visible:ring-dm-accent',
    };

    return (
      <Component
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
            role="status"
            aria-label="Chargement en cours"
          />
        ) : (
          leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0 flex items-center">{rightIcon}</span>
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';
