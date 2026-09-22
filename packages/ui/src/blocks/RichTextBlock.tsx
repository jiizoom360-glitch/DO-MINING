import React from 'react';
import type { BlockRendererProps } from './registry.js';

export const RichTextBlock: React.FC<BlockRendererProps> = ({ block, isPreview }) => {
  const content = String(block.data?.content || '');
  
  if (!isPreview) {
    return (
      <div className="p-3 bg-white border border-dm-border rounded-lg text-sm text-dm-ink font-mono whitespace-pre-wrap">
        {content || '...empty rich text...'}
      </div>
    );
  }

  return (
    <div 
      className="text-dm-ink text-sm leading-relaxed space-y-3"
      dangerouslySetInnerHTML={{ __html: content.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>') }} 
    />
  );
};
