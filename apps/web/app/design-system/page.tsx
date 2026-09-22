"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AppShell,
  PageHeader,
  Card,
  Button,
  Badge,
  Progress,
  StatCard,
  EmptyState,
  ContentStatus,
  Breadcrumbs,
  TOKENS,
} from "@do-mining/ui";
import {
  Pickaxe,
  Layers,
  Palette,
  Layout,
  CheckCircle2,
  Clock,
  Video,
  FileCheck2,
  TrendingUp,
  AlertCircle,
  Inbox,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function DesignSystemPage() {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [progressVal, setProgressVal] = useState(65);

  const sidebarSections = [
    {
      title: "Navigation DO-Mining",
      items: [
        {
          id: "home",
          label: "Espace Parcours Métier",
          icon: <Layers className="w-4 h-4" />,
          href: "/",
        },
        {
          id: "ds",
          label: "Design System Shell",
          icon: <Palette className="w-4 h-4" />,
          isActive: true,
          href: "/design-system",
          badge: "v1.0",
        },
      ],
    },
    {
      title: "Composants Primitifs",
      items: [
        {
          id: "tokens",
          label: "Palette & Tokens",
          icon: <Palette className="w-4 h-4" />,
        },
        {
          id: "buttons",
          label: "Boutons & Actions",
          icon: <CheckCircle2 className="w-4 h-4" />,
        },
        {
          id: "cards",
          label: "Cartes & Métriques",
          icon: <Layout className="w-4 h-4" />,
        },
        {
          id: "status",
          label: "Statuts & Badges",
          icon: <Clock className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <AppShell
      brandName="DO-Mining"
      brandTagline="Design System & UI Primitives"
      sections={sidebarSections}
      topbarTitle={
        <div className="flex items-center gap-2">
          <span className="text-dm-muted">Design System</span>
          <span className="text-dm-border">/</span>
          <span>Spécifications UI</span>
        </div>
      }
      topbarRight={
        <div className="flex items-center gap-3">
          <Badge variant="primary" dot>
            Tokens Définis
          </Badge>
          <Link href="/">
            <Button size="sm" variant="outline">
              Retour au Parcours
            </Button>
          </Link>
        </div>
      }
      sidebarFooter={
        <div className="space-y-1 text-[11px] text-dm-muted">
          <div className="font-semibold text-dm-ink">DO-Mining UI Core</div>
          <div>Style Apple / Linear sobre</div>
          <div className="text-dm-primary-deep font-mono">
            Contraste WCAG AA vérifié
          </div>
        </div>
      }
    >
      <div className="space-y-10">
        {/* Page Header Component */}
        <PageHeader
          title="Système de Design DO-Mining"
          description="Bibliothèque de composants UI techniques pour l'industrie extractive (Mines & Carrières). Palette officielle, typographie sobre, contraste élevé et accessibilité native."
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "Design System", isCurrent: true },
          ]}
          badge={<Badge variant="accent">Phase 1 — Task 2</Badge>}
          actions={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FileCheck2 className="w-4 h-4" />}
              onClick={() => alert("Spécifications validées conformes")}
            >
              Rapport de Conformité
            </Button>
          }
        />

        {/* 1. Official Palette Swatches */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-dm-ink tracking-tight flex items-center gap-2">
              <Palette className="w-4 h-4 text-dm-primary" />
              1. Palette Officielle (Design Tokens)
            </h2>
            <span className="text-xs text-dm-muted">9 Tokens Immuables</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(TOKENS.colors).map(([key, hex]) => (
              <div
                key={key}
                className="bg-dm-white rounded-xl border border-dm-border p-3 shadow-subtle flex flex-col justify-between space-y-2"
              >
                <div
                  className="w-full h-12 rounded-lg border border-dm-border/60 shadow-xs"
                  style={{ backgroundColor: hex }}
                />
                <div>
                  <div className="text-xs font-semibold text-dm-ink capitalize">
                    {key}
                  </div>
                  <div className="text-[11px] font-mono text-dm-muted">
                    {hex}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Button Primitives */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-dm-ink tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-dm-primary" />
            2. Boutons & Variantes d&apos;Interaction
          </h2>

          <Card
            title="Variantes de Style & Accessibilité Clavier"
            subtitle="Focus visible garanti et cibles tactiles >= 40px"
          >
            <div className="space-y-6">
              {/* Variants */}
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary (#08AFC1)</Button>
                <Button variant="secondary">Secondary (#075A70)</Button>
                <Button variant="accent">Accent (#F4C542)</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button
                  variant="primary"
                  isLoading={buttonLoading}
                  onClick={() => {
                    setButtonLoading(true);
                    setTimeout(() => setButtonLoading(false), 1500);
                  }}
                >
                  Tester Loading
                </Button>
                <Button variant="primary" disabled>
                  Désactivé
                </Button>
              </div>

              {/* Sizes */}
              <div className="pt-4 border-t border-dm-border flex flex-wrap items-center gap-3">
                <Button size="sm" variant="outline">
                  Small (36px)
                </Button>
                <Button size="md" variant="outline">
                  Medium (40px)
                </Button>
                <Button size="lg" variant="outline">
                  Large (44px)
                </Button>
                <Button
                  size="md"
                  variant="primary"
                  leftIcon={<Pickaxe className="w-4 h-4" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Bouton avec Icônes
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 3. StatCards & Metrics */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-dm-ink tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-dm-primary" />
            3. Cartes de Métriques Techniques (StatCard)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Production journalière"
              value="1 450"
              unit="t/jour"
              helperText="Concasseur primaire en service"
              icon={<Pickaxe className="w-4 h-4" />}
              trend={{ value: "+8.4%", isPositive: true }}
            />
            <StatCard
              label="Granulométrie D90"
              value="20.4"
              unit="mm"
              helperText="Coupure criblage 0/20"
              icon={<Layers className="w-4 h-4" />}
              trend={{ value: "Normé EN 933", isPositive: true }}
            />
            <StatCard
              label="Temps de cycle dumper"
              value="14.2"
              unit="min"
              helperText="Fosse vers trémie primaire"
              icon={<Clock className="w-4 h-4" />}
              trend={{ value: "-1.1 min", isPositive: true }}
            />
            <StatCard
              label="Conformité Sécurité (QHSE)"
              value="100"
              unit="%"
              helperText="Zéro incident déclaré"
              icon={<ShieldAlert className="w-4 h-4" />}
              trend={{ value: "Audit validé", isPositive: true }}
            />
          </div>
        </section>

        {/* 4. Badges & ContentStatus */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-dm-ink tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-dm-primary" />
            4. Statuts de Contenu & Badges Sémantiques
          </h2>

          <Card title="Badges de Cycle de Vie du Contenu & Progression">
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-dm-muted mb-2 uppercase tracking-wide">
                  ContentStatus (Mappé sur le domaine UCT)
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <ContentStatus status="DRAFT" />
                  <ContentStatus status="REVIEW" />
                  <ContentStatus status="PUBLISHED" />
                  <ContentStatus status="ARCHIVED" />
                  <ContentStatus status="NOT_STARTED" />
                  <ContentStatus status="IN_PROGRESS" />
                  <ContentStatus status="COMPLETED" />
                  <ContentStatus status="LOCKED" />
                </div>
              </div>

              <div className="pt-4 border-t border-dm-border">
                <div className="text-xs font-semibold text-dm-muted mb-2 uppercase tracking-wide">
                  Badges Libres
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <Badge variant="primary" dot>
                    Primary Soft
                  </Badge>
                  <Badge variant="accent">Accent Gold</Badge>
                  <Badge variant="neutral">Neutre</Badge>
                  <Badge variant="success" dot>
                    Conforme
                  </Badge>
                  <Badge variant="warning">Attention</Badge>
                  <Badge variant="outline">Contour fin</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* 5. Progress Bars */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-dm-ink tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-dm-primary" />
            5. Indicateurs de Progression (Progress)
          </h2>

          <Card title="Barres d'Avancement Linéaires">
            <div className="space-y-5 max-w-xl">
              <Progress
                value={progressVal}
                label="Module 1 : Chaîne opératoire de production"
                size="md"
                variant="primary"
              />
              <Progress
                value={35}
                label="Certification globale Mines & Carrières"
                size="sm"
                variant="deep"
              />
              <Progress
                value={90}
                label="Évaluation technique granulats"
                size="lg"
                variant="accent"
              />

              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProgressVal((p) => Math.max(0, p - 15))}
                >
                  -15%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProgressVal((p) => Math.min(100, p + 15))}
                >
                  +15%
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 6. EmptyState */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-dm-ink tracking-tight flex items-center gap-2">
            <Inbox className="w-4 h-4 text-dm-primary" />
            6. État Vide (EmptyState)
          </h2>

          <EmptyState
            icon={<Inbox className="w-6 h-6" />}
            title="Aucune évaluation en attente"
            description="Toutes les soumissions de quiz et d'attestations pour la promotion en cours ont été validées par le formateur référent."
            action={
              <Button size="sm" variant="primary">
                Consulter les archives
              </Button>
            }
            secondaryAction={
              <Button size="sm" variant="outline">
                Actualiser la liste
              </Button>
            }
          />
        </section>
      </div>
    </AppShell>
  );
}
