"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Card, Badge, Button, StatCard } from "@do-mining/ui";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  FileText,
  Clock,
  Key,
} from "lucide-react";

interface AuditLogEntry {
  id: string;
  eventType: string;
  actorUserId: string;
  targetEntityId: string;
  targetEntityType: string;
  payloadHashSha256: string;
  timestamp: string;
}

const AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "evt-001",
    eventType: "QUIZ_ATTEMPT_SUBMITTED",
    actorUserId: "usr-01 (Thomas Dubois)",
    targetEntityId: "quiz-granulats-01",
    targetEntityType: "QUIZ_ATTEMPT",
    payloadHashSha256:
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    timestamp: "Il y a 18 min",
  },
  {
    id: "evt-002",
    eventType: "CONTENT_REVISION_COMMITTED",
    actorUserId: "usr-03 (Admin DO-Mining)",
    targetEntityId: "node_decapage_v2",
    targetEntityType: "CONTENT_REVISION",
    payloadHashSha256:
      "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    timestamp: "Il y a 45 min",
  },
  {
    id: "evt-003",
    eventType: "LIVE_ROOM_TOKEN_ISSUED",
    actorUserId: "usr-02 (Marc Valette)",
    targetEntityId: "session-concasseur-01",
    targetEntityType: "LIVE_SESSION",
    payloadHashSha256:
      "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    timestamp: "Il y a 2h",
  },
  {
    id: "evt-004",
    eventType: "USER_ENTITLEMENT_GRANTED",
    actorUserId: "usr-03 (Admin DO-Mining)",
    targetEntityId: "entitle_car_001",
    targetEntityType: "ENTITLEMENT",
    payloadHashSha256:
      "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    timestamp: "Il y a 4h",
  },
];

export default function AdminAuditPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = AUDIT_LOGS.filter(
    (l) =>
      l.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actorUserId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.payloadHashSha256.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <SpaceShell space="admin" activeRoute="/admin/audit">
      <PageHeader
        title="Journaux d’Audit Immuables (Administration)"
        description="Flux en continu des événements système horodatés et scellés cryptographiquement par empreinte SHA-256."
        badge={
          <Badge variant="warning" dot>
            Audit Actif
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Administration", href: "/admin" },
          { label: "Journaux d’audit", isCurrent: true },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Événements enregistrés"
          value={156}
          helperText="Chaîne horodatée continue"
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          label="Intégrité des hashes"
          value="100%"
          helperText="Zéro altération constatée"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Algorithme de scellement"
          value="SHA-256"
          helperText="Standard cryptographique"
          icon={<Key className="w-4 h-4" />}
        />
      </div>

      {/* Log list */}
      <Card
        title="Flux des événements d'audit"
        subtitle="Historique des opérations administratives et d'évaluation"
        headerActions={
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-dm-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrer type, acteur, hash..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-dm-surface border border-dm-border rounded-md focus:outline-none focus:border-dm-primary text-dm-ink"
            />
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg bg-dm-surface border border-dm-border space-y-1.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-mono font-bold text-dm-ink text-xs">
                  {log.eventType}
                </span>
                <span className="text-[11px] text-dm-muted font-mono">
                  {log.timestamp}
                </span>
              </div>
              <div className="text-dm-muted text-[11px]">
                Acteur :{" "}
                <strong className="text-dm-ink">{log.actorUserId}</strong> •
                Entité :{" "}
                <span className="font-mono text-dm-ink">
                  {log.targetEntityId}
                </span>{" "}
                ({log.targetEntityType})
              </div>
              <div className="font-mono text-[10px] text-dm-muted/80 bg-dm-white p-1.5 rounded border border-dm-border/60 truncate">
                Hash SHA-256 : {log.payloadHashSha256}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </SpaceShell>
  );
}
