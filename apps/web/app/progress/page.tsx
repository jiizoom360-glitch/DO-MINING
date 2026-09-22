"use client";

import React from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import {
  PageHeader,
  Card,
  Badge,
  Button,
  StatCard,
  Progress,
} from "@do-mining/ui";
import {
  Award,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Download,
} from "lucide-react";

export default function ProgressPage() {
  const competencies = [
    {
      code: "COMP-01",
      title: "Sécurité en fosse & Découverte géologique",
      progress: 100,
      status: "VALIDÉ",
      score: "90%",
      hours: "6h",
    },
    {
      code: "COMP-02",
      title: "Chaîne d’extraction & Roulage tombereaux",
      progress: 75,
      status: "EN_COURS",
      score: "85%",
      hours: "4h 30",
    },
    {
      code: "COMP-03",
      title: "Concassage primaire & Réglage granulométrique",
      progress: 50,
      status: "EN_COURS",
      score: "Attente quiz",
      hours: "3h",
    },
    {
      code: "COMP-04",
      title: "Criblage, lavage & Classification EN 933",
      progress: 20,
      status: "EN_COURS",
      score: "Attente quiz",
      hours: "1h 15",
    },
    {
      code: "COMP-05",
      title: "Contrôle qualité & Conformité DREAL",
      progress: 0,
      status: "A_VENIR",
      score: "-",
      hours: "0h",
    },
  ];

  return (
    <SpaceShell space="learner" activeRoute="/progress">
      <PageHeader
        title="Matrice de Progression & Compétences Métier"
        description="Traçabilité détaillée de vos apprentissages en carrières et granulats. Validations conformes aux exigences du référentiel professionnel."
        badge={
          <Badge variant="primary" dot>
            Profil Actif
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Apprenant", href: "/dashboard" },
          { label: "Matrice de progression", isCurrent: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/quiz/quiz-granulats-01">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Passer le quiz suivant
              </Button>
            </Link>
          </div>
        }
      />

      {/* Global summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Progression globale"
          value={49}
          unit="%"
          helperText="Parcours Carrières & Granulats"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="Temps cumulé"
          value="14h 45"
          helperText="Sur 25h prévues"
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          label="Score moyen aux quiz"
          value="87.5"
          unit="%"
          helperText="Seuil de réussite : 80%"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
        <StatCard
          label="Attestation EN 933"
          value="En cours"
          helperText="2 modules restants"
          icon={<Award className="w-4 h-4" />}
        />
      </div>

      {/* Competencies Table / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-dm-ink">
            Détail par domaine de compétence
          </h2>
          <span className="text-xs text-dm-muted">
            5 compétences certifiantes
          </span>
        </div>

        <div className="space-y-3">
          {competencies.map((comp) => (
            <Card
              key={comp.code}
              title={comp.title}
              subtitle={`Code référentiel : ${comp.code} • Temps passé : ${comp.hours}`}
              badge={
                <Badge
                  variant={
                    comp.status === "VALIDÉ"
                      ? "success"
                      : comp.status === "EN_COURS"
                        ? "primary"
                        : "neutral"
                  }
                >
                  {comp.status === "VALIDÉ"
                    ? "Compétence validée ✓"
                    : comp.status === "EN_COURS"
                      ? "En apprentissage"
                      : "Non entamée"}
                </Badge>
              }
            >
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-dm-muted">Taux d&apos;avancement</span>
                  <span className="font-semibold text-dm-ink">
                    {comp.progress}% • Score d&apos;évaluation : {comp.score}
                  </span>
                </div>
                <Progress value={comp.progress} size="sm" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SpaceShell>
  );
}
