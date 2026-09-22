import React from 'react';
import { Badge } from './Badge.js';

export type StatusValue =
  | 'DRAFT'
  | 'REVIEW'
  | 'PUBLISHED'
  | 'ARCHIVED'
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'LOCKED';

export interface ContentStatusProps {
  status: StatusValue;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const STATUS_CONFIG: Record<
  StatusValue,
  { label: string; variant: 'primary' | 'neutral' | 'accent' | 'success' | 'warning' | 'outline' }
> = {
  DRAFT: { label: 'Brouillon', variant: 'warning' },
  REVIEW: { label: 'En relecture', variant: 'accent' },
  PUBLISHED: { label: 'Publié', variant: 'primary' },
  ARCHIVED: { label: 'Archivé', variant: 'neutral' },
  NOT_STARTED: { label: 'Non commencé', variant: 'neutral' },
  IN_PROGRESS: { label: 'En cours', variant: 'primary' },
  COMPLETED: { label: 'Terminé', variant: 'success' },
  LOCKED: { label: 'Verrouillé', variant: 'outline' },
};

export const ContentStatus: React.FC<ContentStatusProps> = ({
  status,
  label,
  size = 'sm',
  className = '',
}) => {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'neutral' };

  return (
    <Badge
      variant={config.variant}
      size={size}
      dot
      className={className}
      aria-label={`Statut : ${label || config.label}`}
    >
      {label || config.label}
    </Badge>
  );
};
