import React from 'react';
import type { BlockRendererProps } from './registry.js';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const CalloutBlock: React.FC<BlockRendererProps> = ({ block, isPreview }) => {
  const title = block.data.title as string | undefined;
  const content = block.data.content as string | undefined;
  const intent = block.data.intent as string | undefined || 'info';

  const config = {
    info: { icon: <Info className="w-5 h-5 text-dm-primary" />, bg: 'bg-dm-primarySoft/30', border: 'border-dm-primarySoft' },
    warning: { icon: <AlertTriangle className="w-5 h-5 text-dm-accent" />, bg: 'bg-yellow-50', border: 'border-yellow-200' },
    success: { icon: <CheckCircle2 className="w-5 h-5 text-green-600" />, bg: 'bg-green-50', border: 'border-green-200' }
  };

  const style = config[intent as keyof typeof config] || config.info;

  return (
    <div className={`p-4 rounded-lg border ${style.bg} ${style.border} flex gap-3`}>
      <div className="shrink-0 mt-0.5">{style.icon}</div>
      <div>
        {title && <h4 className="font-semibold text-dm-ink text-sm mb-1">{title}</h4>}
        <p className="text-sm text-dm-ink/80 leading-relaxed">{content}</p>
      </div>
    </div>
  );
};
