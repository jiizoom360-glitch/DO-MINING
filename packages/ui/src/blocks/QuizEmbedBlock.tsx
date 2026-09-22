import React from 'react';
import type { BlockRendererProps } from './registry.js';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button.js';

export const QuizEmbedBlock: React.FC<BlockRendererProps> = ({ block, isPreview }) => {
  const quizId = block.data.quizId as string | undefined;
  const title = block.data.title as string | undefined;

  if (!isPreview) {
    return (
      <div className="p-3 bg-dm-surface border border-dm-border rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-dm-primarySoft text-dm-primary rounded flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-sm text-dm-ink">{title || 'Évaluation Intégrée'}</div>
            <div className="text-xs text-dm-muted font-mono mt-0.5">ID: {quizId || 'non-défini'}</div>
          </div>
        </div>
        <div className="text-xs font-semibold bg-white px-2 py-1 rounded border border-dm-border text-dm-primary">
          QUIZ
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-dm-surface border border-dm-border rounded-xl p-6 text-center">
      <div className="w-12 h-12 bg-dm-primarySoft text-dm-primary rounded-full flex items-center justify-center mx-auto mb-4">
        <HelpCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-dm-ink mb-2">{title || 'Test de connaissances'}</h3>
      <p className="text-sm text-dm-muted mb-6">Testez vos connaissances sur ce module avant de passer à la suite.</p>
      <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
        Démarrer l'évaluation
      </Button>
    </div>
  );
};
