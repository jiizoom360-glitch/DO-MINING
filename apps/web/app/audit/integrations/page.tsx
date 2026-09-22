"use client";

import React from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Card, Badge, Button, StatCard } from "@do-mining/ui";
import {
  Server,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";

interface IntegrationPortAudit {
  port: string;
  contract: string;
  isolationStatus: "HERMETIQUE" | "SOUS_SURVEILLANCE";
  externalCallDetected: boolean;
  notes: string;
}

const INTEGRATION_AUDITS: IntegrationPortAudit[] = [
  {
    port: "StoragePort",
    contract: "@do-mining/contracts/StoragePort",
    isolationStatus: "HERMETIQUE",
    externalCallDetected: false,
    notes:
      "Aucun appel direct à AWS S3 / Cloudflare R2. Utilisation exclusive de MockStorageAdapter.",
  },
  {
    port: "LiveSessionPort",
    contract: "@do-mining/contracts/LiveSessionPort",
    isolationStatus: "HERMETIQUE",
    externalCallDetected: false,
    notes: "Salles générées via MockLiveSessionAdapter sans token externe.",
  },
  {
    port: "EmailNotificationPort",
    contract: "@do-mining/contracts/EmailNotificationPort",
    isolationStatus: "HERMETIQUE",
    externalCallDetected: false,
    notes: "Journalisation locale des emails sans envoi SMTP effectif.",
  },
  {
    port: "ContentRepositoryPort",
    contract: "@do-mining/contracts/ContentRepositoryPort",
    isolationStatus: "HERMETIQUE",
    externalCallDetected: false,
    notes:
      "Aucune connexion base de données externe. Dépôt en mémoire respectant les interfaces de domaine.",
  },
  {
    port: "AuditLoggerPort",
    contract: "@do-mining/contracts/AuditLoggerPort",
    isolationStatus: "HERMETIQUE",
    externalCallDetected: false,
    notes:
      "Signature SHA-256 générée de manière déterministe en pur TypeScript sans dépendance cloud.",
  },
];

export default function AuditIntegrationsPage() {
  return (
    <SpaceShell space="auditor" activeRoute="/audit/integrations">
      <PageHeader
        title="Audit des Intégrations &amp; Herméticité des Ports"
        description="Vérification technique de l’étanchéité architecturale. Garantie d’absence de fuite de données, d’appel API externe non autorisé ou de couplage propriétaire."
        badge={
          <Badge variant="outline" dot>
            Architecture Hermétique
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Auditeur", href: "/audit" },
          { label: "Audit des intégrations", isCurrent: true },
        ]}
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Appels API externes détectés"
          value={0}
          helperText="Isolation hermétique totale"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
        <StatCard
          label="Ports audités conformes"
          value={INTEGRATION_AUDITS.length}
          helperText="100% découplés des SDKs"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Architecture Freeze"
          value="Conforme"
          helperText="Prêt pour certification"
          icon={<Lock className="w-4 h-4" />}
        />
      </div>

      {/* Audits table */}
      <Card
        title="Matrice de vérification d’herméticité des adaptateurs"
        subtitle="Contrôle de conformité avec les règles de souveraineté et d'architecture hexagonale"
      >
        <div className="space-y-4 text-xs">
          {INTEGRATION_AUDITS.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-dm-surface border border-dm-border space-y-1.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="font-semibold text-dm-ink text-sm">
                  {item.port}
                </div>
                <Badge variant="success" size="sm">
                  {item.isolationStatus} ✓
                </Badge>
              </div>

              <div className="text-[11px] font-mono text-dm-muted">
                Contrat formel : {item.contract}
              </div>

              <div className="text-dm-muted leading-relaxed text-xs pt-1">
                {item.notes}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </SpaceShell>
  );
}
