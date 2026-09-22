import React from 'react';
import { getBlockRenderer } from './registry.js';
import type { BlockRendererProps } from './registry.js';
import { AlertCircle } from 'lucide-react';

export const BlockRenderer: React.FC<BlockRendererProps> = (props) => {
  const Renderer = getBlockRenderer(props.block.type);
  
  if (!Renderer) {
    return (
      <div className="p-4 bg-dm-surface/50 border border-dm-border border-dashed rounded-lg flex items-start gap-3 text-dm-muted">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <div className="text-sm">
          <p className="font-semibold text-dm-ink">Block type not supported</p>
          <p className="font-mono text-xs mt-1">type: {props.block.type}</p>
        </div>
      </div>
    );
  }

  return <Renderer {...props} />;
};
