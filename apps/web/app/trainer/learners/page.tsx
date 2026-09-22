"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import {
  PageHeader,
  Card,
  Badge,
  Button,
  Progress,
  StatCard,
} from "@do-mining/ui";
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileText,
} from "lucide-react";

interface LearnerItem {
  id: string;
  name: string;
  company: string;
  progress: number;
  currentLesson: string;
  avgScore: string;
  lastActive: string;
  status: "A_JOUR" | "RETARD" | "BLOQUE";
}

const LEARNERS_DATA: LearnerItem[] = [
  {
    id: "lrn-01",
    name: "Thomas Dubois",
    company: "Carrières du Bassin Rhénan",
    progress: 45,
    currentLesson: "Décapage & banquettes de sécurité",
    avgScore: "85%",
    lastActive: "Aujourd’hui 14:15",
    status: "A_JOUR",
  },
  {
    id: "lrn-02",
    name: "Amina Khadiri",
    company: "EuroGranulats Normandie",
    progress: 78,
    currentLesson: "Classification EN 933 et fuseau",
    avgScore: "92%",
    lastActive: "Hier 18:30",
    status: "A_JOUR",
  },
  {
    id: "lrn-03",
    name: "Lucas Martin",
    company: "Carrière des Roches Bleues",
    progress: 25,
    currentLesson: "Concassage primaire à mâchoires",
    avgScore: "70%",
    lastActive: "Il y a 3 jours",
    status: "BLOQUE",
  },
  {
    id: "lrn-04",
    name: "Bastien Lefevre",
    company: "Granulats Méditerranée",
    progress: 15,
    currentLesson: "Découverte géologique et morts-terrains",
    avgScore: "80%",
    lastActive: "Il y a 6 jours",
    status: "RETARD",
  },
  {
    id: "lrn-05",
    name: "Sarah Benali",
    company: "Extraction Minérale Ouest",
    progress: 90,
    currentLesson: "Préparation examen final EN 933",
    avgScore: "95%",
    lastActive: "Aujourd’hui 11:20",
    status: "A_JOUR",
  },
];

export default function TrainerLearnersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = LEARNERS_DATA.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <SpaceShell space="trainer" activeRoute="/trainer/learners">
      <PageHeader
        title="Suivi Pédagogique des Apprenants"
        description="Promotion Carrières & Granulats 2026-Q1. Visualisez l’assiduité, la progression modulaire et les scores d’évaluation de chaque stagiaire."
        badge={
          <Badge variant="accent" dot>
            24 Inscrits
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Formateur", href: "/trainer" },
          { label: "Suivi des apprenants", isCurrent: true },
        ]}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Apprenants actifs"
          value={24}
          helperText="19 actifs cette semaine"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Progression moyenne"
          value={52}
          unit="%"
          helperText="+8% cette semaine"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="Apprenants à relancer"
          value={2}
          helperText="Inactivité > 3 jours"
          icon={<AlertCircle className="w-4 h-4" />}
        />
      </div>

      {/* Learners list card */}
      <Card
        title="Liste des stagiaires en formation"
        subtitle="Promotion : Opérateurs & Chefs de Carrière"
        headerActions={
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-dm-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un apprenant..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-dm-surface border border-dm-border rounded-md focus:outline-none focus:border-dm-primary text-dm-ink"
            />
          </div>
        }
      >
        <div className="divide-y divide-dm-border text-xs">
          {filtered.map((learner) => (
            <div
              key={learner.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-dm-ink text-sm">
                    {learner.name}
                  </span>
                  <Badge
                    variant={
                      learner.status === "A_JOUR"
                        ? "success"
                        : learner.status === "RETARD"
                          ? "warning"
                          : "outline"
                    }
                    size="sm"
                  >
                    {learner.status === "A_JOUR"
                      ? "Régulier"
                      : learner.status === "RETARD"
                        ? "En retard"
                        : "Besoin d’aide"}
                  </Badge>
                </div>
                <div className="text-dm-muted text-xs">
                  {learner.company} • Étape active :{" "}
                  <span className="text-dm-ink font-medium">
                    {learner.currentLesson}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 sm:text-right">
                <div className="w-28 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-dm-muted">Avancement</span>
                    <span className="font-semibold text-dm-ink">
                      {learner.progress}%
                    </span>
                  </div>
                  <Progress value={learner.progress} size="sm" />
                </div>

                <div className="text-right">
                  <div className="font-bold text-dm-ink">
                    {learner.avgScore}
                  </div>
                  <div className="text-[10px] text-dm-muted">
                    {learner.lastActive}
                  </div>
                </div>

                <Link href="/trainer/reviews">
                  <Button size="sm" variant="secondary">
                    Voir dossier
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </SpaceShell>
  );
}
