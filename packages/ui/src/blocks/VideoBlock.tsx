import React from 'react';
import type { BlockRendererProps } from './registry.js';
import { PlayCircle, Video as VideoIcon } from 'lucide-react';

export const VideoBlock: React.FC<BlockRendererProps> = ({ block, isPreview }) => {
  const url = block.data.url as string | undefined;
  const title = block.data.title as string | undefined;
  const durationMinutes = block.data.durationMinutes as string | number | undefined;
  const provider = block.data.provider as string | undefined || 'R2';

  if (!isPreview) {
    return (
      <div className="p-3 bg-dm-surface border border-dm-border rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-dm-ink text-white rounded flex items-center justify-center shrink-0">
            <VideoIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-sm text-dm-ink">{title || 'Video Asset'}</div>
            <div className="text-xs text-dm-muted font-mono mt-0.5">{url}</div>
          </div>
        </div>
        <div className="text-xs font-semibold bg-dm-white px-2 py-1 rounded border border-dm-border">
          {provider} | {durationMinutes || '?'} min
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black aspect-video rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-dm-ink/20" />
      <PlayCircle className="w-16 h-16 opacity-80 z-10" />
      <div className="z-10 mt-4 font-medium text-sm">{title}</div>
      <div className="absolute bottom-4 left-4 bg-black/60 px-2 py-1 rounded text-xs font-mono z-10">
        {durationMinutes ? `${durationMinutes}:00` : '00:00'}
      </div>
    </div>
  );
};
