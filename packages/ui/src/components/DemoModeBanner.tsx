import React, { useState } from 'react';
import { Info, X, ChevronRight } from 'lucide-react';
import type { NavigationSpace } from '../navigation.js';
import { SPACES } from '../navigation.js';

export interface DemoModeBannerProps {
  currentSpace: NavigationSpace;
  className?: string;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({
  currentSpace,
  className = '',
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const spaceInfo = SPACES[currentSpace];

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Mode démonstration interactif"
      className={`bg-dm-white/95 backdrop-blur-xs border-b border-dm-border/80 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs flex items-center justify-between gap-3 text-dm-muted transition-all select-none ${className}`}
    >
      <div className="flex items-center gap-2 min-w-0 overflow-hidden">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-dm-primary-soft text-dm-primary-deep shrink-0">
          PROTOTYPE
        </span>
        <p className="truncate text-dm-ink/80 text-[11px] sm:text-xs">
          <span className="font-semibold text-dm-ink">{spaceInfo.label} : </span>
          <span className="hidden sm:inline">{spaceInfo.tagline} • </span>
          <span>Données et simulateurs interactifs en mémoire.</span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="p-1 rounded text-dm-muted hover:text-dm-ink hover:bg-dm-surface shrink-0 transition-colors"
        title="Masquer cet avertissement"
        aria-label="Fermer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
