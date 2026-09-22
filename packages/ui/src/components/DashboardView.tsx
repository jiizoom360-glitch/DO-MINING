import React from 'react';
import { Card } from './Card.js';
import { Badge } from './Badge.js';
import { Button } from './Button.js';
import { StatCard } from './StatCard.js';
import { Progress } from './Progress.js';
import { PageHeader } from './PageHeader.js';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  Pickaxe,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileText,
  Users,
  Server,
  Activity,
} from 'lucide-react';
import type { DashboardDefinition, DashboardWidgetDefinition, DashboardSection } from '@do-mining/core';




export interface DashboardViewProps {
  definition: DashboardDefinition;
  actions?: React.ReactNode;
  headerBreadcrumbs?: { label: string; href?: string; isCurrent?: boolean }[];
  className?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  definition,
  actions,
  headerBreadcrumbs,
  className = '',
}) => {
  const renderWidget = (widget: DashboardWidgetDefinition) => {
    // 1. Metric widgets
    if (widget.category === 'metric' && widget.data) {
      const data = widget.data;
      let displayValue: string | number = '';
      let unit: string | undefined = undefined;
      let trend: { value: string; isPositive: boolean } | undefined = undefined;
      let icon = <Activity className="w-4 h-4" />;

      if ('percent' in data) {
        displayValue = Number(data.percent);
        unit = '%';
        trend = { value: 'Progression active', isPositive: true };
        icon = <TrendingUp className="w-4 h-4" />;
      } else if ('timeMinutes' in data) {
        displayValue = Number(data.timeMinutes);
        unit = 'min';
        trend = { value: 'Sur 120 min cible', isPositive: true };
        icon = <Clock className="w-4 h-4" />;
      } else if ('averageScore' in data) {
        displayValue = Number(data.averageScore);
        unit = '%';
        trend = { value: 'Seuil 80% atteint', isPositive: true };
        icon = <CheckCircle2 className="w-4 h-4" />;
      } else if ('totalLearners' in data) {
        displayValue = Number(data.totalLearners);
        unit = 'apprenants';
        trend = { value: `${data.activeToday} actifs ajd`, isPositive: true };
        icon = <Users className="w-4 h-4" />;
      } else if ('pendingReviews' in data) {
        displayValue = Number(data.pendingReviews);
        unit = 'copies';
        trend = { value: 'Priorité normale', isPositive: false };
        icon = <FileText className="w-4 h-4" />;
      } else if ('upcomingSessions' in data) {
        displayValue = Number(data.upcomingSessions);
        unit = 'ateliers';
        trend = { value: 'Cette semaine', isPositive: true };
        icon = <Video className="w-4 h-4" />;
      } else if ('domains' in data) {
        displayValue = Number(data.lessons || 9);
        unit = 'leçons UCT';
        trend = { value: '1 branche active', isPositive: true };
        icon = <Layers className="w-4 h-4" />;
      } else if ('total' in data) {
        displayValue = Number(data.total);
        unit = 'comptes';
        trend = { value: '4 rôles définis', isPositive: true };
        icon = <Users className="w-4 h-4" />;
      } else if ('totalRevisions' in data) {
        displayValue = Number(data.totalRevisions);
        unit = 'révisions';
        trend = { value: 'SHA-256 scellées', isPositive: true };
        icon = <FileText className="w-4 h-4" />;
      } else if ('totalEvents' in data) {
        displayValue = Number(data.totalEvents);
        unit = 'événements';
        trend = { value: 'Traçabilité 100%', isPositive: true };
        icon = <ShieldCheck className="w-4 h-4" />;
      } else if ('integrityPercent' in data) {
        displayValue = Number(data.integrityPercent);
        unit = '%';
        trend = { value: 'Zéro altération', isPositive: true };
        icon = <CheckCircle2 className="w-4 h-4" />;
      } else if ('totalIssued' in data) {
        displayValue = Number(data.totalIssued);
        unit = 'attestations';
        trend = { value: 'Norme EN 933', isPositive: true };
        icon = <ShieldCheck className="w-4 h-4" />;
      }

      return (
        <StatCard
          key={widget.id}
          label={widget.title}
          value={displayValue}
          unit={unit}
          helperText={widget.description}
          icon={icon}
          trend={trend}
        />
      );
    }

    // 2. Action / Resume widget
    if (widget.category === 'action' && widget.data) {
      const data = widget.data;
      if ('courseSlug' in data) {
        return (
          <Card
            key={widget.id}
            title={widget.title}
            subtitle={widget.description}
            badge={<Badge variant="primary" dot>Reprise directe</Badge>}
            footer={
              <div className="w-full flex items-center justify-between">
                <span className="text-dm-muted text-xs">Étape en attente : {String(data.nextStep)}</span>
                <a href={`/learn/${data.courseSlug}/${data.moduleSlug}/${data.lessonSlug}`}>
                  <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Ouvrir la leçon
                  </Button>
                </a>
              </div>
            }
          >
            <div className="p-3 bg-dm-surface rounded-lg border border-dm-border/80 space-y-2">
              <div className="font-semibold text-xs text-dm-ink">{String(data.lessonTitle)}</div>
              <Progress value={25} label="Progression du module" size="sm" />
            </div>
          </Card>
        );
      }

      if ('links' in data && Array.isArray(data.links)) {
        return (
          <Card
            key={widget.id}
            title={widget.title}
            subtitle={widget.description}
          >
            <div className="space-y-2">
              {data.links.map((lnk: { label: string; href: string }, idx: number) => (
                <a
                  key={idx}
                  href={lnk.href}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-dm-border text-xs text-dm-ink hover:bg-dm-surface hover:border-dm-primary/40 transition-colors"
                >
                  <span className="font-medium">{lnk.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-dm-muted" />
                </a>
              ))}
            </div>
          </Card>
        );
      }

      if ('items' in data && Array.isArray(data.items)) {
        return (
          <Card
            key={widget.id}
            title={widget.title}
            subtitle={widget.description}
          >
            <div className="space-y-2">
              {data.items.map((item: Record<string, string>, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-dm-surface/60 border border-dm-border text-xs flex items-center justify-between"
                >
                  <div className="font-medium text-dm-ink">{item.title || item.name}</div>
                  <div className="text-dm-muted text-[11px]">{item.date || item.format}</div>
                </div>
              ))}
            </div>
          </Card>
        );
      }
    }

    // 3. Preview / Live session widget
    if (widget.category === 'preview' && widget.data) {
      const data = widget.data;
      return (
        <Card
          key={widget.id}
          title={widget.title}
          subtitle={widget.description}
          badge={<Badge variant="accent" size="sm">Jitsi Simulé</Badge>}
          footer={
            <div className="w-full flex items-center justify-between">
              <span className="text-xs text-dm-muted font-mono">{String(data.status)}</span>
              <a href={`/live/${data.sessionId}`}>
                <Button size="sm" variant="secondary" rightIcon={<Video className="w-3.5 h-3.5" />}>
                  Rejoindre la salle
                </Button>
              </a>
            </div>
          }
        >
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-dm-ink">{String(data.title)}</div>
            <div className="text-dm-muted flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-dm-primary" />
              <span>{String(data.scheduledTime)}</span>
            </div>
            <div className="text-dm-muted">Intervenant : {String(data.expertName)}</div>
          </div>
        </Card>
      );
    }

    // 4. List widget (evaluations, logs, audit stream)
    if (widget.category === 'list' && widget.data) {
      const data = widget.data;
      if ('items' in data && Array.isArray(data.items)) {
        return (
          <Card
            key={widget.id}
            title={widget.title}
            subtitle={widget.description}
            className="md:col-span-2"
          >
            <div className="divide-y divide-dm-border text-xs">
              {data.items.map((sub: Record<string, string>, idx: number) => (
                <div key={sub.id || idx} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold text-dm-ink truncate">{sub.learner}</div>
                    <div className="text-dm-muted text-[11px] truncate">{sub.module}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="primary">{sub.score}</Badge>
                    <Badge variant="outline">{sub.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      }

      if ('events' in data && Array.isArray(data.events)) {
        return (
          <Card
            key={widget.id}
            title={widget.title}
            subtitle={widget.description}
            className="md:col-span-2"
          >
            <div className="space-y-2.5 text-xs">
              {data.events.map((evt: Record<string, string>, idx: number) => (
                <div key={evt.id || idx} className="p-2.5 rounded-lg bg-dm-surface/60 border border-dm-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-dm-ink">{evt.type}</span>
                    <span className="text-[11px] text-dm-muted">{evt.time}</span>
                  </div>
                  <div className="text-dm-muted text-[11px] truncate">
                    Acteur : <span className="font-mono text-dm-ink">{evt.actor}</span> | Cible : <span className="font-mono">{evt.entity}</span>
                  </div>
                  <div className="font-mono text-[10px] text-dm-muted/80 truncate">
                    Hash SHA-256 : {evt.hash}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      }
    }

    // 5. System status widget
    if (widget.category === 'system' && widget.data) {
      const data = widget.data;
      return (
        <Card
          key={widget.id}
          title={widget.title}
          subtitle={widget.description}
          className="md:col-span-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.entries(data).map(([key, val]) => (
              <div key={key} className="p-3 bg-dm-surface rounded-lg border border-dm-border">
                <div className="text-dm-muted uppercase tracking-wider text-[10px] font-semibold">{key}</div>
                <div className="font-mono font-medium text-dm-ink mt-1 truncate">{String(val)}</div>
              </div>
            ))}
          </div>
        </Card>
      );
    }

    // Fallback standard Card
    return (
      <Card key={widget.id} title={widget.title} subtitle={widget.description}>
        <div className="text-xs text-dm-muted">Widget {widget.widgetType} en attente de données.</div>
      </Card>
    );
  };

  const roleBadges: Record<string, { label: string; variant: 'primary' | 'accent' | 'warning' | 'outline' }> = {
    LEARNER: { label: 'Rôle : Apprenant', variant: 'primary' },
    TRAINER: { label: 'Rôle : Formateur', variant: 'accent' },
    ADMIN: { label: 'Rôle : Administrateur', variant: 'warning' },
    AUDITOR: { label: 'Rôle : Auditeur', variant: 'outline' },
  };

  const badgeInfo = roleBadges[definition.role] || { label: definition.role, variant: 'outline' };

  return (
    <div className={`space-y-6 ${className}`}>
      <PageHeader
        title={definition.title}
        description={definition.description}
        breadcrumbs={headerBreadcrumbs}
        badge={<Badge variant={badgeInfo.variant} dot>{badgeInfo.label}</Badge>}
        actions={actions}
      />

      {/* Niche / Commercialization Summaries */}
      {/* Contextual indicators: only shown if explicitly admin and useful */}
      {definition.role === 'ADMIN' && definition.vertical && (
        <div className="p-3 bg-dm-surface rounded-xl border border-dm-border/80 text-xs flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-dm-primary uppercase text-[10px]">Filière active :</span>
            <span className="font-semibold text-dm-ink">{definition.vertical.name}</span>
            <Badge variant="accent" size="sm">Prototype en mémoire</Badge>
          </div>
          {definition.vertical.futureBranches && (
            <div className="text-[11px] text-dm-muted">
              Extensions : {definition.vertical.futureBranches.join(' • ')}
            </div>
          )}
        </div>
      )}

      {/* Render sections */}
      <div className="space-y-8">
        {definition.sections.map((section) => (
          <div key={section.id} className="space-y-4">
            {section.title && (
              <div>
                <h3 className="text-lg font-semibold text-dm-ink">{section.title}</h3>
                {section.description && <p className="text-sm text-dm-muted">{section.description}</p>}
              </div>
            )}
            <div
              className={
                section.layout === 'grid-2'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-5'
                  : section.layout === 'grid-3'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                  : section.layout === 'grid-4'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
              }
            >
              {section.widgets.map((widget) => renderWidget(widget))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
