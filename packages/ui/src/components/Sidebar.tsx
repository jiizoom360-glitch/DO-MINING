import React from 'react';
import { X, Pickaxe } from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  brandName?: string;
  brandTagline?: string;
  brand?: React.ReactNode;
  sections: SidebarSection[];
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  footer?: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  brandName = 'DO-Mining',
  brandTagline = 'LMS Mines & Carrières',
  brand,
  sections,
  isOpenMobile = false,
  onCloseMobile,
  footer,
  className = '',
}) => {
  const content = (
    <div className="flex flex-col h-full bg-dm-white border-r border-dm-border w-64 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-dm-border flex items-center justify-between">
        {brand ? (
          <div className="min-w-0">{brand}</div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-dm-primary text-dm-white flex items-center justify-center shadow-subtle font-bold shrink-0">
              <Pickaxe className="w-5 h-5 text-dm-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm tracking-tight text-dm-ink truncate">
                {brandName}
              </div>
              <div className="text-[11px] text-dm-muted truncate">
                {brandTagline}
              </div>
            </div>
          </div>
        )}

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-dm-muted hover:text-dm-ink hover:bg-dm-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dm-primary"
            aria-label="Fermer le menu latéral"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav aria-label="Menu principal" className="flex-1 overflow-y-auto p-3 space-y-6">
        {sections.map((section, sIdx) => (
          <div key={section.title || `sec-${sIdx}`} className="space-y-1">
            {section.title && (
              <div className="px-3 py-1 text-[11px] font-semibold text-dm-muted uppercase tracking-wider">
                {section.title}
              </div>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const activeClasses = item.isActive
                  ? 'bg-dm-primary-soft text-dm-primary-deep font-semibold'
                  : 'text-dm-muted hover:text-dm-ink hover:bg-dm-surface';

                const itemContent = (
                  <>
                    {item.icon && (
                      <span
                        className={`w-4 h-4 shrink-0 ${
                          item.isActive ? 'text-dm-primary-deep' : 'text-dm-muted'
                        }`}
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="truncate flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.isActive
                            ? 'bg-dm-white text-dm-primary-deep'
                            : 'bg-dm-surface text-dm-muted border border-dm-border'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                );

                return (
                  <li key={item.id}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dm-primary ${activeClasses}`}
                      >
                        {itemContent}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={item.onClick}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dm-primary cursor-pointer ${activeClasses}`}
                      >
                        {itemContent}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="p-3 border-t border-dm-border bg-dm-surface/60">
          {footer}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className={`hidden lg:block h-screen sticky top-0 shrink-0 z-30 ${className}`}>
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-dm-ink/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          {/* Slide-over panel */}
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <aside className="w-64 max-w-[80vw] h-full shadow-elevated animate-in slide-in-from-left duration-200">
              {content}
            </aside>
          </div>
        </div>
      )}
    </>
  );
};
