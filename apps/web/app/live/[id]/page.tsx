"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Card, Badge, Button } from "@do-mining/ui";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Users,
  MessageSquare,
  PhoneOff,
  Send,
  AlertTriangle,
  RefreshCw,
  Clock,
  ShieldAlert,
  Calendar,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { createLiveSessionPort, SimulationManager } from "@do-mining/mocks";
import type { LiveSimulationScenario } from "@do-mining/contracts";

interface LivePageProps {
  params: Promise<{ id: string }>;
}

export default function LiveSessionPage({ params }: LivePageProps) {
  const { id } = use(params);
  const [micActive, setMicActive] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      author: "Marc V. (Expert)",
      text: "Bienvenue à tous sur cet atelier pratique réglage concasseur.",
      time: "16:31",
    },
    {
      author: "Thomas D.",
      text: "Bonjour Monsieur, comment compense-t-on l’usure des mâchoires en cours de poste ?",
      time: "16:33",
    },
  ]);

  // Reactive simulation state
  const [activeScenario, setActiveScenario] =
    useState<LiveSimulationScenario>("LIVE");
  const [sessionState, setSessionState] = useState<{
    isLoading: boolean;
    isError: boolean;
    errorCode?: string;
    errorMessage?: string;
    status?: string;
    participantCount?: number;
  }>({
    isLoading: true,
    isError: false,
    status: "IN_PROGRESS",
    participantCount: 18,
  });

  const checkLivePortStatus = React.useCallback(async () => {
    const simManager = SimulationManager.getInstance();
    const livePort = simManager.liveSessionAdapter;
    const currentScenario = livePort.getScenario();
    setActiveScenario(currentScenario);

    setSessionState((prev) => ({ ...prev, isLoading: true }));

    // Test port status
    const statusRes = await livePort.getStatus(id);
    const joinRes = await livePort.getJoinInfo({
      sessionId: id,
      userId: "learner_01",
      userName: "Apprenant Carrière",
      role: "learner",
    });

    if (!joinRes.success) {
      const err = joinRes.error;
      const code =
        (err as { code?: string; name?: string })?.code ||
        (err as { code?: string; name?: string })?.name ||
        "LIVE_ERROR";
      const msg =
        err?.message || "Erreur lors de la connexion à la session live";
      setSessionState({
        isLoading: false,
        isError: true,
        errorCode: code,
        errorMessage: msg,
        status: code,
        participantCount: 0,
      });
      return;
    }

    if (!statusRes.success) {
      const err = statusRes.error;
      const code =
        (err as { code?: string; name?: string })?.code ||
        (err as { code?: string; name?: string })?.name ||
        "LIVE_ERROR";
      const msg =
        err?.message || "Impossible de récupérer le statut de la session";
      setSessionState({
        isLoading: false,
        isError: true,
        errorCode: code,
        errorMessage: msg,
        status: code,
        participantCount: 0,
      });
      return;
    }

    setSessionState({
      isLoading: false,
      isError: false,
      status: statusRes.data.status,
      participantCount: statusRes.data.participantCount || 18,
    });
  }, [id]);

  useEffect(() => {
    checkLivePortStatus();
    const simManager = SimulationManager.getInstance();
    const unsubscribe = simManager.subscribe(() => {
      checkLivePortStatus();
    });
    return () => unsubscribe();
  }, [checkLivePortStatus]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatLog((prev) => [
      ...prev,
      { author: "Vous (Apprenant)", text: chatMessage.trim(), time: "16:35" },
    ]);
    setChatMessage("");
  };

  const resetToLiveScenario = () => {
    SimulationManager.getInstance().setLiveScenario("LIVE");
    checkLivePortStatus();
  };

  return (
    <SpaceShell space="learner" activeRoute={`/live/${id}`}>
      <PageHeader
        title="Session Synchrone avec le Technicien Expert"
        description="Atelier direct d’exploitation en carrière. Échanges interactifs, étude de cas sur concasseur à mâchoires et questions-réponses en direct."
        badge={
          sessionState.isError ? (
            <Badge variant="warning" dot>
              Simulation : {sessionState.errorCode || "Erreur"}
            </Badge>
          ) : sessionState.status === "SCHEDULED" ? (
            <Badge variant="warning" dot>
              Salle d&apos;Attente Active
            </Badge>
          ) : (
            <Badge variant="accent" dot>
              Simulateur Jitsi Actif ({activeScenario})
            </Badge>
          )
        }
        breadcrumbs={[
          { label: "Espace Apprenant", href: "/dashboard" },
          { label: "Sessions Live", href: "/dashboard" },
          { label: id, isCurrent: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/simulations">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Sliders className="w-3.5 h-3.5" />}
              >
                Contrôle simulation
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Quitter la session
              </Button>
            </Link>
          </div>
        }
      />

      {/* Simulation Active Banner Notice */}
      <div className="p-3 bg-dm-surface rounded-xl border border-dm-border flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-dm-primary" />
          <span className="text-dm-ink">
            Scénario actif du port <strong>LiveSessionPort</strong> :{" "}
            <span className="font-mono font-semibold text-dm-primary">
              {activeScenario}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {sessionState.isError && (
            <Button
              size="sm"
              variant="secondary"
              onClick={resetToLiveScenario}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Rétablir en mode LIVE
            </Button>
          )}
          <Link href="/admin/simulations">
            <span className="text-dm-primary hover:underline font-medium text-[11px]">
              Changer de scénario →
            </span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Stage */}
        <div className="lg:col-span-2 space-y-4">
          {sessionState.isError ? (
            /* Error Fallback View reflecting Simulated Scenario */
            <div className="aspect-video rounded-xl bg-slate-900 border border-red-500/30 overflow-hidden flex flex-col justify-between p-6 shadow-sm text-white">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                  ÉCHEC SIMULÉ DU PORT
                </span>
                <span className="text-xs text-rose-300 font-mono">
                  {sessionState.errorCode}
                </span>
              </div>

              <div className="text-center my-auto space-y-3 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {sessionState.errorCode === "PROVIDER_UNAVAILABLE" &&
                      "Service vidéo temporairement indisponible"}
                    {sessionState.errorCode ===
                      "PROVIDER_CONFIGURATION_ERROR" &&
                      "Erreur de configuration du fournisseur vidéo"}
                    {sessionState.errorCode === "PERMISSION_DENIED" &&
                      "Accès refusé à ce salon d’expertise"}
                    {sessionState.errorCode === "SESSION_ENDED" &&
                      "Cette session en direct est terminée"}
                    {sessionState.errorCode === "SESSION_CANCELLED" &&
                      "Cette session d’atelier a été annulée"}
                    {sessionState.errorCode === "RESOURCE_NOT_FOUND" &&
                      "Salle de session introuvable"}
                    {![
                      "PROVIDER_UNAVAILABLE",
                      "PROVIDER_CONFIGURATION_ERROR",
                      "PERMISSION_DENIED",
                      "SESSION_ENDED",
                      "SESSION_CANCELLED",
                      "RESOURCE_NOT_FOUND",
                    ].includes(sessionState.errorCode || "") &&
                      "Échec du port LiveSession"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {sessionState.errorMessage}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={resetToLiveScenario}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  >
                    Réessayer la connexion
                  </Button>
                </div>
              </div>

              <div className="text-center text-[11px] text-slate-500 border-t border-slate-800 pt-2">
                Salle d&apos;atelier virtuel sécurisée DO-Mining
              </div>
            </div>
          ) : sessionState.status === "SCHEDULED" ? (
            /* Scheduled Waiting Room View */
            <div className="aspect-video rounded-xl bg-slate-900 border border-amber-500/30 overflow-hidden flex flex-col justify-between p-6 shadow-sm text-white">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                  SALLE D&apos;ATTENTE
                </span>
                <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Début à 16:30 UTC
                </span>
              </div>

              <div className="text-center my-auto space-y-3 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                  <Calendar className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Atelier programmé : Réglage d’écartement et blindages
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    L&apos;expert Marc V. ouvrira la salle dans quelques
                    instants. Vous pouvez tester votre matériel audio
                    ci-dessous.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setMicActive(!micActive)}
                  className={`p-2.5 rounded-full text-xs font-medium transition-colors ${
                    micActive
                      ? "bg-white/20 text-white"
                      : "bg-amber-600 text-white"
                  }`}
                  title={micActive ? "Couper le micro" : "Activer le micro"}
                >
                  {micActive ? (
                    <Mic className="w-4 h-4" />
                  ) : (
                    <MicOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCamActive(!camActive)}
                  className={`p-2.5 rounded-full text-xs font-medium transition-colors ${
                    camActive
                      ? "bg-white/20 text-white"
                      : "bg-amber-600 text-white"
                  }`}
                  title={camActive ? "Couper la caméra" : "Activer la caméra"}
                >
                  {camActive ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <VideoOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Nominal Live Stream View */
            <div className="relative aspect-video rounded-xl bg-dm-ink border border-dm-border overflow-hidden flex flex-col justify-between p-4 shadow-sm">
              {/* Top overlay */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                    EN DIRECT
                  </span>
                  <span className="text-xs text-white/90 font-medium">
                    Atelier : Réglage d’écartement et blindages concasseur
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/80 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                  <Users className="w-3.5 h-3.5" />
                  <span>{sessionState.participantCount} participants</span>
                </div>
              </div>

              {/* Center screen illustration */}
              <div className="text-center my-auto space-y-3">
                <div className="w-16 h-16 rounded-full bg-dm-primary/20 border border-dm-primary/40 text-dm-primary flex items-center justify-center mx-auto">
                  <Video className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    Marc V. — Ingénieur Mines &amp; Carrières
                  </div>
                  <div className="text-xs text-white/60">
                    Partage d&apos;écran : Schéma cinématique du concasseur à
                    mâchoire simple effet
                  </div>
                </div>
              </div>

              {/* Bottom control bar */}
              <div className="flex items-center justify-center gap-3 z-10 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setMicActive(!micActive)}
                  className={`p-2.5 rounded-full text-xs font-medium transition-colors ${
                    micActive
                      ? "bg-white/20 text-white"
                      : "bg-rose-600 text-white"
                  }`}
                  title={micActive ? "Couper le micro" : "Activer le micro"}
                >
                  {micActive ? (
                    <Mic className="w-4 h-4" />
                  ) : (
                    <MicOff className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCamActive(!camActive)}
                  className={`p-2.5 rounded-full text-xs font-medium transition-colors ${
                    camActive
                      ? "bg-white/20 text-white"
                      : "bg-rose-600 text-white"
                  }`}
                  title={camActive ? "Couper la caméra" : "Activer la caméra"}
                >
                  {camActive ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <VideoOff className="w-4 h-4" />
                  )}
                </button>

                <Link href="/dashboard">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    <span>Quitter l&apos;atelier</span>
                  </button>
                </Link>
              </div>
            </div>
          )}

          <div className="p-3 bg-dm-surface rounded-xl border border-dm-border/80 text-xs flex flex-wrap items-center justify-between gap-2 text-dm-muted">
            <span className="flex items-center gap-1.5 font-medium text-dm-ink">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Connexion directe audio &amp; vidéo sécurisée
            </span>
            <span className="text-[11px]">
              Salle : Session pratique concasseurs • Qualité HD
            </span>
          </div>
        </div>

        {/* Live Chat & Questions */}
        <div className="space-y-4">
          <Card
            title="Questions en direct"
            subtitle="Interactions avec le formateur"
            className="h-full flex flex-col justify-between"
          >
            <div className="space-y-3 text-xs flex-1 overflow-y-auto max-h-80 pr-1">
              {chatLog.map((msg, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-dm-surface border border-dm-border/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-dm-ink">
                      {msg.author}
                    </span>
                    <span className="text-dm-muted">{msg.time}</span>
                  </div>
                  <div className="text-dm-muted leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="pt-3 border-t border-dm-border mt-3 flex items-center gap-2"
            >
              <input
                type="text"
                disabled={sessionState.isError}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={
                  sessionState.isError
                    ? "Salon de discussion verrouillé (Session indisponible)"
                    : "Poser une question technique..."
                }
                className="flex-1 px-3 py-1.5 text-xs bg-dm-white border border-dm-border rounded-md focus:outline-none focus:border-dm-primary disabled:opacity-50"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={sessionState.isError || !chatMessage.trim()}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </SpaceShell>
  );
}
