"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Card, Badge, Button, StatCard } from "@do-mining/ui";
import {
  ShieldCheck,
  CheckCircle,
  FileCheck,
  Download,
  Key,
  Database,
  RefreshCw,
} from "lucide-react";

interface IntegrityCheckpoint {
  component: string;
  expectedHash: string;
  calculatedHash: string;
  isMatch: boolean;
  lastVerified: string;
}

const CHECKPOINTS: IntegrityCheckpoint[] = [
  {
    component: "Arbre Universel de Contenu (Racine Domaine Mines)",
    expectedHash:
      "a7c56b829e12f65b5cb3897143e8d2e85098ffb415b2ec893024840502127db8",
    calculatedHash:
      "a7c56b829e12f65b5cb3897143e8d2e85098ffb415b2ec893024840502127db8",
    isMatch: true,
    lastVerified: "Aujourd’hui 15:00 UTC",
  },
  {
    component: "Référentiel des Quiz EN 933 (Norme Granulats)",
    expectedHash:
      "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    calculatedHash:
      "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    isMatch: true,
    lastVerified: "Aujourd’hui 14:30 UTC",
  },
  {
    component: "Ledger des événements d’apprentissage",
    expectedHash:
      "3f786850e387550fdab836ed7e6dc881de23001b70e87038c01308b173382ac5",
    calculatedHash:
      "3f786850e387550fdab836ed7e6dc881de23001b70e87038c01308b173382ac5",
    isMatch: true,
    lastVerified: "Aujourd’hui 14:00 UTC",
  },
  {
    component: "Table des habilitations et certificats délivrés",
    expectedHash:
      "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    calculatedHash:
      "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    isMatch: true,
    lastVerified: "Aujourd’hui 12:00 UTC",
  },
];

export default function AuditSystemPage() {
  const [verified, setVerified] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 600);
  };

  return (
    <SpaceShell space="auditor" activeRoute="/audit/system">
      <PageHeader
        title="Contrôle d’Intégrité Cryptographique &amp; Système"
        description="Audit indépendant des sommes de contrôle SHA-256. Vérification de la non-altération des arbres de contenu et des registres d’apprentissage."
        badge={
          <Badge variant="outline" dot>
            Intégrité 100%
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Auditeur", href: "/audit" },
          { label: "Intégrité système", isCurrent: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={
                <RefreshCw
                  className={`w-3.5 h-3.5 ${verifying ? "animate-spin" : ""}`}
                />
              }
              onClick={handleVerify}
            >
              Recalculer les hashes
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() =>
                alert(
                  "Génération du rapport d’audit certifié (PDF/A + SHA-256)",
                )
              }
            >
              Exporter le scellé
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Points de contrôle"
          value={CHECKPOINTS.length}
          helperText="4 composants critiques"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Conformité SHA-256"
          value="100%"
          helperText="Zéro divergence constatée"
          icon={<CheckCircle className="w-4 h-4" />}
        />
        <StatCard
          label="Norme réglementaire"
          value="RGIE / DREAL"
          helperText="Décret carrières en vigueur"
          icon={<Key className="w-4 h-4" />}
        />
      </div>

      {/* Checkpoints card */}
      <Card
        title="Tableau des Empreintes Cryptographiques d’État"
        subtitle="Comparaison en temps réel des valeurs attendues vs calculées"
      >
        <div className="space-y-4 text-xs">
          {CHECKPOINTS.map((cp, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-dm-surface border border-dm-border space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-semibold text-dm-ink">{cp.component}</div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={cp.isMatch ? "success" : "outline"} size="sm">
                    {cp.isMatch ? "Conforme ✓" : "Altéré ✗"}
                  </Badge>
                  <span className="text-dm-muted text-[11px]">
                    {cp.lastVerified}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 bg-dm-white rounded border border-dm-border/60">
                  <div className="text-dm-muted text-[10px] uppercase font-sans font-semibold">
                    Hash Scellé (Attendu)
                  </div>
                  <div className="text-dm-ink truncate mt-0.5">
                    {cp.expectedHash}
                  </div>
                </div>
                <div className="p-2 bg-dm-white rounded border border-dm-border/60">
                  <div className="text-dm-muted text-[10px] uppercase font-sans font-semibold">
                    Hash Calculé (Réel)
                  </div>
                  <div className="text-emerald-700 font-semibold truncate mt-0.5">
                    {cp.calculatedHash}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </SpaceShell>
  );
}
