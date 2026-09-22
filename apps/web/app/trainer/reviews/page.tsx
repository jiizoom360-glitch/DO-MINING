"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Card, Badge, Button, StatCard } from "@do-mining/ui";
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  User,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

interface ReviewItem {
  id: string;
  learnerName: string;
  quizTitle: string;
  submittedAt: string;
  score: number;
  status: "PENDING" | "VALIDATED" | "REJECTED";
  answersSummary: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-01",
    learnerName: "Thomas Dubois",
    quizTitle: "Quiz EN 933 : Décapage & Règle des Merlons",
    submittedAt: "Aujourd’hui 14:22",
    score: 85,
    status: "PENDING",
    answersSummary:
      "3/3 exactes sur la géométrie des merlons et recul de banquette.",
  },
  {
    id: "rev-02",
    learnerName: "Amina Khadiri",
    quizTitle: "Contrôle granulométrique : Essai Los Angeles",
    submittedAt: "Aujourd’hui 11:05",
    score: 92,
    status: "PENDING",
    answersSummary:
      "Excellente maîtrise de la rotation des boulets d’acier et du tamisage à 1,6 mm.",
  },
  {
    id: "rev-03",
    learnerName: "Lucas Martin",
    quizTitle: "Concassage primaire : Réglage écartement",
    submittedAt: "Hier 16:40",
    score: 68,
    status: "PENDING",
    answersSummary:
      "Erreur sur le réglage CSS (Closed Side Setting) et le ratio de réduction.",
  },
];

export default function TrainerReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);

  const handleAction = (id: string, newStatus: "VALIDATED" | "REJECTED") => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
  };

  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;

  return (
    <SpaceShell space="trainer" activeRoute="/trainer/reviews">
      <PageHeader
        title="Revues &amp; Certification des Évaluations"
        description="Validation formateur des évaluations soumises par les apprenants. Attribuez les certificats de compétences ou demandez un approfondissement."
        badge={
          <Badge variant="accent" dot>
            {pendingCount} En attente
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Formateur", href: "/trainer" },
          { label: "Revues des évaluations", isCurrent: true },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Évaluations en attente"
          value={pendingCount}
          helperText="Délai moyen de réponse : 4h"
          icon={<FileCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Taux de réussite direct"
          value={82}
          unit="%"
          helperText="Seuil minimal 80%"
          icon={<CheckCircle className="w-4 h-4" />}
        />
        <StatCard
          label="Attestations certifiées"
          value={18}
          helperText="Scellées dans la blockchain d’audit"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-dm-ink">
            Copies soumises à certifier
          </h2>
          <span className="text-xs text-dm-muted">
            {reviews.length} évaluations listées
          </span>
        </div>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <Card
              key={rev.id}
              title={rev.quizTitle}
              subtitle={`Apprenant : ${rev.learnerName} • Soumis : ${rev.submittedAt}`}
              badge={
                <Badge
                  variant={
                    rev.status === "VALIDATED"
                      ? "success"
                      : rev.status === "REJECTED"
                        ? "outline"
                        : "accent"
                  }
                >
                  {rev.status === "VALIDATED"
                    ? "Validé & Certifié ✓"
                    : rev.status === "REJECTED"
                      ? "À réviser"
                      : "Attente Formateur"}
                </Badge>
              }
              footer={
                <div className="w-full flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-dm-muted">Score obtenu :</span>
                    <span
                      className={`font-bold ${
                        rev.score >= 80 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {rev.score}%
                    </span>
                    <span className="text-dm-muted text-[11px]">
                      ({rev.score >= 80 ? "Admissible" : "Sous le seuil 80%"})
                    </span>
                  </div>

                  {rev.status === "PENDING" ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                        onClick={() => handleAction(rev.id, "REJECTED")}
                      >
                        Demander révision
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                        onClick={() => handleAction(rev.id, "VALIDATED")}
                      >
                        Valider &amp; Certifier
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-dm-muted italic">
                      Dossier traité par le formateur référent
                    </span>
                  )}
                </div>
              }
            >
              <div className="p-3 bg-dm-surface rounded-lg border border-dm-border text-xs space-y-1">
                <div className="font-semibold text-dm-ink">
                  Analyse technique des réponses :
                </div>
                <div className="text-dm-muted">{rev.answersSummary}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SpaceShell>
  );
}
