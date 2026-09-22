"use client";

import React from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Card, Badge, Button, StatCard } from "@do-mining/ui";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Key,
  Layers,
  FileCheck,
  Building,
} from "lucide-react";

interface PermissionRule {
  resource: string;
  learner: boolean;
  trainer: boolean;
  admin: boolean;
  auditor: boolean;
  description: string;
}

const PERMISSION_MATRIX: PermissionRule[] = [
  {
    resource: "Lecture des leçons & fiches techniques UCT",
    learner: true,
    trainer: true,
    admin: true,
    auditor: true,
    description: "Accès au contenu pédagogique et aux supports PDF.",
  },
  {
    resource: "Passation des quiz et soumission des évaluations",
    learner: true,
    trainer: false,
    admin: false,
    auditor: false,
    description: "Enregistrement des tentatives d’évaluation avec horodatage.",
  },
  {
    resource: "Notation et certification formateur",
    learner: false,
    trainer: true,
    admin: true,
    auditor: false,
    description:
      "Attribution des mentions et délivrance des attestations de niveau.",
  },
  {
    resource: "Création et modification des nœuds UCT & révisions",
    learner: false,
    trainer: false,
    admin: true,
    auditor: false,
    description: "Publication de nouveaux modules et mise à jour des versions.",
  },
  {
    resource: "Consultation du journal d’audit immuable & hashes SHA-256",
    learner: false,
    trainer: false,
    admin: true,
    auditor: true,
    description:
      "Contrôle réglementaire des preuves de passage et conformité légale.",
  },
  {
    resource: "Gestion des simulateurs d’infrastructure (Ports)",
    learner: false,
    trainer: false,
    admin: true,
    auditor: false,
    description:
      "Bascule entre modes MOCK, MANUAL et REAL pour chaque adaptateur.",
  },
];

export default function AdminRulesPage() {
  return (
    <SpaceShell space="admin" activeRoute="/admin/rules">
      <PageHeader
        title="Matrice des Règles d’Accès &amp; Droits RBAC"
        description="Spécification formelle des permissions par rôle. Cette matrice servira de référentiel strict lors du raccordement ultérieur du moteur RBAC et des politiques RLS PostgreSQL."
        badge={
          <Badge variant="warning" dot>
            Spécification Déclarative
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Administration", href: "/admin" },
          { label: "Règles & RBAC", isCurrent: true },
        ]}
      />

      {/* Architecture Disclaimer */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-950 text-xs flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Avertissement Architecture Freeze :</strong> Ces règles
          représentent la définition cible des autorisations. Conformément aux
          directives de la Phase 1, aucun middleware ne prétend sécuriser les
          routes à cette étape : toutes les vérifications seront déléguées au
          moteur centralisé lors de la Phase Auth/RBAC.
        </div>
      </div>

      {/* Permission Matrix Table */}
      <Card
        title="Matrice Déclarative des Permissions par Rôle"
        subtitle="Contrôles d’accès aux ressources de la plateforme"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-dm-border text-dm-muted">
                <th className="py-2.5 px-3 font-semibold">
                  Opération / Ressource
                </th>
                <th className="py-2.5 px-3 font-semibold text-center w-24">
                  Apprenant
                </th>
                <th className="py-2.5 px-3 font-semibold text-center w-24">
                  Formateur
                </th>
                <th className="py-2.5 px-3 font-semibold text-center w-24">
                  Admin
                </th>
                <th className="py-2.5 px-3 font-semibold text-center w-24">
                  Auditeur
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dm-border">
              {PERMISSION_MATRIX.map((rule, idx) => (
                <tr key={idx} className="hover:bg-dm-surface/50">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-dm-ink">
                      {rule.resource}
                    </div>
                    <div className="text-[11px] text-dm-muted mt-0.5">
                      {rule.description}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {rule.learner ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-dm-border mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {rule.trainer ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-dm-border mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {rule.admin ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-dm-border mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {rule.auditor ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-dm-border mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </SpaceShell>
  );
}
