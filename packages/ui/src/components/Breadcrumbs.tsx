import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Fil d'Ariane" className={`flex items-center text-xs ${className}`}>
      <ol className="flex items-center space-x-1.5 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.isCurrent;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-dm-muted/60 mx-1 shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  className="font-medium text-dm-ink select-none truncate max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="text-dm-muted hover:text-dm-primary-deep transition-colors focus-visible:outline-none focus-visible:underline select-none cursor-pointer"
                >
                  {item.label}
                </button>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="text-dm-muted hover:text-dm-primary-deep transition-colors focus-visible:outline-none focus-visible:underline select-none"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-dm-muted select-none">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
