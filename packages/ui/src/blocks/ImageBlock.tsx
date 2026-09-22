import React from 'react';
import type { BlockRendererProps } from './registry.js';
import { Image as ImageIcon } from 'lucide-react';

export const ImageBlock: React.FC<BlockRendererProps> = ({ block, isPreview }) => {
  const url = block.data.url as string | undefined;
  const alt = block.data.alt as string | undefined;
  const caption = block.data.caption as string | undefined;

  if (!isPreview) {
    return (
      <div className="p-3 bg-dm-surface border border-dm-border rounded-lg flex items-center gap-3">
        <div className="w-10 h-10 bg-dm-border text-dm-muted rounded flex items-center justify-center shrink-0">
          <ImageIcon className="w-5 h-5" />
        </div>
        <div>
          <div className="font-medium text-sm text-dm-ink">{alt || 'Image Asset'}</div>
          <div className="text-xs text-dm-muted font-mono mt-0.5">{url || 'no-url'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full aspect-[16/9] bg-dm-border/50 rounded-lg flex items-center justify-center text-dm-muted overflow-hidden relative">
        <ImageIcon className="w-10 h-10 opacity-50" />
        <div className="absolute inset-0 border border-dm-border rounded-lg" />
      </div>
      {caption && <div className="text-xs text-dm-muted mt-2 text-center">{caption}</div>}
    </div>
  );
};
