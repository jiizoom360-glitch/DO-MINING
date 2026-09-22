"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Card, Badge, Button, StatCard } from "@do-mining/ui";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Play,
  Plus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface LiveSessionPlan {
  id: string;
  title: string;
  roomIdentifier: string;
  scheduledTime: string;
  duration: string;
  attendeesExpected: number;
  status: "SCHEDULED" | "IN_PROGRESS" | "ENDED";
}

const INITIAL_SESSIONS: LiveSessionPlan[] = [
  {
    id: "session-concasseur-01",
    title: "Atelier technique : Réglage granulométrique du concasseur primaire",
    roomIdentifier: "room-concasseur-live",
    scheduledTime: "Aujourd’hui 16:30 UTC",
    duration: "60 min",
    attendeesExpected: 18,
    status: "SCHEDULED",
  },
  {
    id: "session-criblage-02",
    title: "Démonstration : Changement des toiles de crible & coupure à sec",
    roomIdentifier: "room-crible-mesh",
    scheduledTime: "Demain 10:00 UTC",
    duration: "45 min",
    attendeesExpected: 24,
    status: "SCHEDULED",
  },
  {
    id: "session-decapage-prev",
    title: "Retour d’expérience : Stabilité des fronts et merlons",
    roomIdentifier: "room-decapage-ret",
    scheduledTime: "Il y a 3 jours",
    duration: "50 min",
    attendeesExpected: 21,
    status: "ENDED",
  },
];

export default function TrainerLiveManagementPage() {
  const [sessions, setSessions] = useState<LiveSessionPlan[]>(INITIAL_SESSIONS);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newSess: LiveSessionPlan = {
      id: `session-${Date.now()}`,
      title: newTitle.trim(),
      roomIdentifier: `room-${Date.now()}`,
      scheduledTime: "Vendredi prochain 14:00 UTC",
      duration: "45 min",
      attendeesExpected: 20,
      status: "SCHEDULED",
    };
    setSessions([newSess, ...sessions]);
    setNewTitle("");
    setShowScheduleModal(false);
  };

  return (
    <SpaceShell space="trainer" activeRoute="/trainer/live">
      <PageHeader
        title="Gestion des Classes Virtuelles &amp; Ateliers Direct"
        description="Planification et animation des ateliers en direct pour les promotions. Échangez avec vos stagiaires, partagez des études de cas terrain et animez les séances de questions/réponses."
        badge={
          <Badge variant="accent" dot>
            Visioconférence HD
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Formateur", href: "/trainer" },
          { label: "Sessions direct", isCurrent: true },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setShowScheduleModal(true)}
          >
            Programmer un atelier
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Sessions planifiées"
          value={sessions.filter((s) => s.status === "SCHEDULED").length}
          helperText="Promotion Carrières 2026"
          icon={<Calendar className="w-4 h-4" />}
        />
        <StatCard
          label="Taux moyen de présence"
          value={94}
          unit="%"
          helperText="Stagiaires connectés"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Connexion synchrone"
          value="HD Audio/Vidéo"
          helperText="Salon interactif sécurisé"
          icon={<Video className="w-4 h-4" />}
        />
      </div>

      {/* Modal for new session */}
      {showScheduleModal && (
        <div className="p-4 rounded-xl bg-dm-white border border-dm-border shadow-md space-y-3">
          <div className="font-semibold text-xs text-dm-ink">
            Nouvelle session synchrone
          </div>
          <form onSubmit={handleAddSession} className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Analyse d'incident sur bande transporteuse..."
              className="flex-1 px-3 py-2 text-xs bg-dm-surface border border-dm-border rounded-md focus:outline-none focus:border-dm-primary"
            />
            <Button type="submit" size="sm" variant="primary">
              Enregistrer
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowScheduleModal(false)}
            >
              Annuler
            </Button>
          </form>
        </div>
      )}

      {/* Sessions list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-dm-ink">
            Calendrier des ateliers techniques
          </h2>
          <span className="text-xs text-dm-muted">
            {sessions.length} sessions répertoriées
          </span>
        </div>

        <div className="space-y-4">
          {sessions.map((sess) => (
            <Card
              key={sess.id}
              title={sess.title}
              subtitle={`Identifiant salle : ${sess.roomIdentifier} • Durée : ${sess.duration}`}
              badge={
                <Badge
                  variant={
                    sess.status === "SCHEDULED"
                      ? "accent"
                      : sess.status === "IN_PROGRESS"
                        ? "success"
                        : "neutral"
                  }
                  dot={sess.status === "SCHEDULED"}
                >
                  {sess.status === "SCHEDULED"
                    ? "Programmée"
                    : sess.status === "IN_PROGRESS"
                      ? "En direct"
                      : "Terminée & Enregistrée"}
                </Badge>
              }
              footer={
                <div className="w-full flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4 text-dm-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-dm-primary" />
                      {sess.scheduledTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-dm-primary" />
                      {sess.attendeesExpected} inscrits
                    </span>
                  </div>

                  <Link href={`/live/${sess.id}`}>
                    <Button
                      size="sm"
                      variant="primary"
                      rightIcon={<Play className="w-3.5 h-3.5" />}
                    >
                      Lancer la salle virtuelle
                    </Button>
                  </Link>
                </div>
              }
            >
              <div className="text-xs text-dm-muted">
                Salle hébergée sur l’instance simulée Jitsi Meet. Enregistrement
                automatique et journalisation des présences pour audit
                réglementaire.
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SpaceShell>
  );
}
