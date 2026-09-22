"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Card, Badge, Button, StatCard } from "@do-mining/ui";
import { Users, Search, Shield, UserCheck, UserPlus, Mail } from "lucide-react";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "LEARNER" | "TRAINER" | "ADMIN" | "AUDITOR";
  organization: string;
  joinedAt: string;
  status: "ACTIF" | "INVITE" | "SUSPENDU";
}

const USERS_DATA: UserAccount[] = [
  {
    id: "usr-01",
    name: "Thomas Dubois",
    email: "thomas.dubois@carrieres-rhenan.fr",
    role: "LEARNER",
    organization: "Carrières du Bassin Rhénan",
    joinedAt: "12 Janv. 2026",
    status: "ACTIF",
  },
  {
    id: "usr-02",
    name: "Marc Valette",
    email: "m.valette@do-mining.com",
    role: "TRAINER",
    organization: "DO-Mining Référent Mines",
    joinedAt: "01 Déc. 2025",
    status: "ACTIF",
  },
  {
    id: "usr-03",
    name: "Claire Dupont",
    email: "admin.tech@do-mining.com",
    role: "ADMIN",
    organization: "DO-Mining Engineering",
    joinedAt: "15 Nov. 2025",
    status: "ACTIF",
  },
  {
    id: "usr-04",
    name: "Henri Marchand",
    email: "h.marchand@dreal-bourgogne.gouv.fr",
    role: "AUDITOR",
    organization: "Inspection DREAL & Police des Carrières",
    joinedAt: "04 Févr. 2026",
    status: "ACTIF",
  },
  {
    id: "usr-05",
    name: "Amina Khadiri",
    email: "amina.k@eurogranulats.fr",
    role: "LEARNER",
    organization: "EuroGranulats Normandie",
    joinedAt: "18 Janv. 2026",
    status: "ACTIF",
  },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = USERS_DATA.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.organization.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <SpaceShell space="admin" activeRoute="/admin/users">
      <PageHeader
        title="Gestion des Utilisateurs &amp; Profils Métiers"
        description="Administration des comptes et rôles : Apprenant, Formateur Référent, Administrateur et Auditeur Externe. Préparation du futur système d’authentification."
        badge={
          <Badge variant="warning" dot>
            42 Utilisateurs
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Administration", href: "/admin" },
          { label: "Utilisateurs & profils", isCurrent: true },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          label="Apprenants"
          value={34}
          helperText="Stagiaires de carrières"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Formateurs"
          value={4}
          helperText="Ingénieurs référents"
          icon={<UserCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Administrateurs"
          value={2}
          helperText="Gouvernance système"
          icon={<Shield className="w-4 h-4" />}
        />
        <StatCard
          label="Auditeurs légaux"
          value={2}
          helperText="DREAL & QHSE"
          icon={<Shield className="w-4 h-4" />}
        />
      </div>

      {/* Users list */}
      <Card
        title="Répertoire des comptes enregistrés"
        subtitle="Rôles et affiliations professionnelles"
        headerActions={
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-dm-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher nom, email, société..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-dm-surface border border-dm-border rounded-md focus:outline-none focus:border-dm-primary text-dm-ink"
            />
          </div>
        }
      >
        <div className="divide-y divide-dm-border text-xs">
          {filtered.map((user) => {
            const roleVariant =
              user.role === "LEARNER"
                ? "primary"
                : user.role === "TRAINER"
                  ? "accent"
                  : user.role === "ADMIN"
                    ? "warning"
                    : "outline";

            return (
              <div
                key={user.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-dm-ink text-sm">
                      {user.name}
                    </span>
                    <Badge variant={roleVariant} size="sm">
                      {user.role}
                    </Badge>
                  </div>
                  <div className="text-dm-muted text-xs">
                    {user.email} • {user.organization}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-dm-muted text-[11px]">
                    Inscrit le {user.joinedAt}
                  </span>
                  <Badge
                    variant={user.status === "ACTIF" ? "success" : "neutral"}
                    size="sm"
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </SpaceShell>
  );
}
