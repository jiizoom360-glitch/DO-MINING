import React from 'react';
import { Menu } from 'lucide-react';

export interface TopbarProps {
  onOpenMobileMenu?: () => void;
  title?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  title,
  rightContent,
  className = '',
}) => {
  return (
    <header
      className={`sticky top-0 z-20 h-16 bg-dm-white/95 backdrop-blur-xs border-b border-dm-border px-4 sm:px-6 flex items-center justify-between gap-4 select-none ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-dm-muted hover:text-dm-ink hover:bg-dm-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dm-primary cursor-pointer"
            aria-label="Ouvrir le menu de navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {title && (
          <div className="min-w-0 truncate text-sm font-semibold text-dm-ink">
            {title}
          </div>
        )}
      </div>

      {rightContent && (
        <div className="flex items-center gap-3 shrink-0">
          {rightContent}
        </div>
      )}
    </header>
  );
};
