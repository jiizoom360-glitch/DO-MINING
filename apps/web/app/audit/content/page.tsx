"use client";

import React from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Card, Badge, Button, StatCard } from "@do-mining/ui";
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Award,
  Layers,
  Shield,
} from "lucide-react";

interface ComplianceCheck {
  title: string;
  referenceStandard: string;
  moduleAudited: string;
  status: "CONFORME" | "OBSERVATION" | "NON_CONFORME";
  finding: string;
}

const COMPLIANCE_ITEMS: ComplianceCheck[] = [
  {
    title: "Découverte des terrains et merlons de sécurité en crête",
    referenceStandard: "RGIE Titre Carrières Art. 12 & INRS ED 6044",
    moduleAudited: "Module 1 : Chaîne opératoire en fosse",
    status: "CONFORME",
    finding:
      "Hauteur minimale de merlon égale au rayon de roue du dumper (norme respectée). Banquette de 10 mètres correctement spécifiée.",
  },
  {
    title: "Procédure d’essai Los Angeles (Résistance fragmentation)",
    referenceStandard: "NF EN 1097-2 : Essais de caractéristiques mécaniques",
    moduleAudited: "Module 3 : Contrôle qualité laboratoire",
    status: "CONFORME",
    finding:
      "Charge de boulets d’acier normalisée et formule de calcul du coefficient LA exactement transcrites.",
  },
  {
    title: "Règles de dégagement des concasseurs primaires à mâchoires",
    referenceStandard: "Recommandations CNAMTS R367 & RGIE",
    moduleAudited: "Module 2 : Concassage primaire",
    status: "CONFORME",
    finding:
      "Interdiction formelle de déblocage au pied ou à la barre à mine moteur en marche bien mentionnée.",
  },
  {
    title: "Mesure de la teneur en fines (< 63 µm) par lavage",
    referenceStandard: "NF EN 933-1 : Analyse granulométrique par tamisage",
    moduleAudited: "Module 3 : Lavage et classification",
    status: "CONFORME",
    finding: "Protocole conforme avec pesée après étuvage à 110 °C.",
  },
];

export default function AuditContentPage() {
  return (
    <SpaceShell space="auditor" activeRoute="/audit/content">
      <PageHeader
        title="Audit de Conformité Réglementaire des Contenus"
        description="Inspection des supports pédagogiques au regard des normes européennes (EN 933, EN 1097) et du Règlement Général des Industries Extractives (RGIE)."
        badge={
          <Badge variant="outline" dot>
            Norme EN 933
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Auditeur", href: "/audit" },
          { label: "Audit des contenus", isCurrent: true },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Contrôles réglementaires"
          value={COMPLIANCE_ITEMS.length}
          helperText="4 fiches de référence vérifiées"
          icon={<FileCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Taux de conformité légale"
          value="100%"
          helperText="RGIE & Normes EN"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
        <StatCard
          label="Avis d'audit"
          value="Favorable"
          helperText="Valide pour diffusion formation"
          icon={<Award className="w-4 h-4" />}
        />
      </div>

      {/* Compliance cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-dm-ink">
            Rapport d’inspection des contenus
          </h2>
          <span className="text-xs text-dm-muted">
            Référentiel Carrières 2026
          </span>
        </div>

        <div className="space-y-4">
          {COMPLIANCE_ITEMS.map((item, idx) => (
            <Card
              key={idx}
              title={item.title}
              subtitle={`Norme : ${item.referenceStandard} • Module : ${item.moduleAudited}`}
              badge={
                <Badge
                  variant={item.status === "CONFORME" ? "success" : "warning"}
                >
                  {item.status === "CONFORME"
                    ? "Conforme Réglementation"
                    : "Observation"}
                </Badge>
              }
            >
              <div className="p-3 rounded-lg bg-dm-surface border border-dm-border text-xs space-y-1">
                <div className="font-semibold text-dm-ink">
                  Observation de l&apos;auditeur :
                </div>
                <div className="text-dm-muted leading-relaxed">
                  {item.finding}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SpaceShell>
  );
}
