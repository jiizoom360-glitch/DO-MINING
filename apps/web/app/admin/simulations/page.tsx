"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Card, Badge, Button, StatCard } from "@do-mining/ui";
import {
  Server,
  Sliders,
  CheckCircle2,
  HardDrive,
  Video,
  GitCommit,
  Globe,
  Rocket,
  Play,
  RefreshCw,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Database,
  ExternalLink,
  Info,
} from "lucide-react";
import { SimulationManager, SimulationScenarioLoader } from "@do-mining/mocks";
import type {
  SimulationScenario,
  StorageSimulationScenario,
  LiveSimulationScenario,
  DeploymentSimulationScenario,
  RepositorySimulationScenario,
  DnsSimulationScenario,
} from "@do-mining/contracts";

interface TestResultState {
  serviceId: string;
  durationMs: number;
  timestamp: string;
  success: boolean;
  data?: unknown;
  error?: {
    code?: string;
    message?: string;
    name?: string;
  };
}

export default function AdminSimulationsPage() {
  const [manager] = useState(() => SimulationManager.getInstance());

  // Local state mirrored from SimulationManager
  const [storageScenario, setStorageScenario] =
    useState<StorageSimulationScenario>("AVAILABLE");
  const [liveScenario, setLiveScenario] =
    useState<LiveSimulationScenario>("LIVE");
  const [deploymentScenario, setDeploymentScenario] =
    useState<DeploymentSimulationScenario>("DEPLOYED");
  const [repositoryScenario, setRepositoryScenario] =
    useState<RepositorySimulationScenario>("SYNCED");
  const [dnsScenario, setDnsScenario] =
    useState<DnsSimulationScenario>("PROPAGATED");

  // Test execution output
  const [testResults, setTestResults] = useState<
    Record<string, TestResultState>
  >({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [globalNotice, setGlobalNotice] = useState<string | null>(null);

  // Sync from SimulationManager
  const syncFromManager = React.useCallback(() => {
    setStorageScenario(manager.storageAdapter.getScenario());
    setLiveScenario(manager.liveSessionAdapter.getScenario());
    setDeploymentScenario(manager.deploymentAdapter.getScenario());
    setRepositoryScenario(manager.repositoryAdapter.getScenario());
    setDnsScenario(manager.dnsAdapter.getScenario());
  }, [manager]);

  useEffect(() => {
    syncFromManager();
    const unsub = manager.subscribe(() => {
      syncFromManager();
    });
    return () => unsub();
  }, [manager, syncFromManager]);

  // Handler: Change scenario for a service
  const handleStorageChange = (scenario: StorageSimulationScenario) => {
    manager.setStorageScenario(scenario, {
      latencyMs: scenario === "LATENCY" ? 400 : 0,
    });
    setGlobalNotice(`StoragePort mis à jour vers le scénario : ${scenario}`);
  };

  const handleLiveChange = (scenario: LiveSimulationScenario) => {
    manager.setLiveScenario(scenario, {
      latencyMs: scenario === "LATENCY" ? 350 : 0,
    });
    setGlobalNotice(
      `LiveSessionPort mis à jour vers le scénario : ${scenario}`,
    );
  };

  const handleDeploymentChange = (scenario: DeploymentSimulationScenario) => {
    manager.setDeploymentScenario(scenario, {
      latencyMs: scenario === "LATENCY" ? 500 : 0,
    });
    setGlobalNotice(`DeploymentPort mis à jour vers le scénario : ${scenario}`);
  };

  const handleRepositoryChange = (scenario: RepositorySimulationScenario) => {
    manager.setRepositoryScenario(scenario, {
      latencyMs: scenario === "LATENCY" ? 300 : 0,
    });
    setGlobalNotice(`RepositoryPort mis à jour vers le scénario : ${scenario}`);
  };

  const handleDnsChange = (scenario: DnsSimulationScenario) => {
    manager.setDnsScenario(scenario, {
      latencyMs: scenario === "LATENCY" ? 300 : 0,
    });
    setGlobalNotice(`DnsPort mis à jour vers le scénario : ${scenario}`);
  };

  // Global Presets
  const applyPresetNominal = () => {
    manager.resetAllToNominal();
    setGlobalNotice(
      "Tous les ports d’infrastructure ont été réinitialisés au mode NOMINAL (100% opérationnel).",
    );
  };

  const applyPresetGlobalOutage = () => {
    manager.setAllUnavailable("Panne d’infrastructure majeure simulée");
    setGlobalNotice(
      "Tous les adaptateurs sont désormais configurés en mode UNAVAILABLE (Panne globale).",
    );
  };

  const applyPresetNotConfigured = () => {
    manager.setAllNotConfigured();
    setGlobalNotice(
      "Tous les adaptateurs sont configurés en mode NOT_CONFIGURED (Clés/variables d’environnement manquantes).",
    );
  };

  // Live Test Execution
  const runTest = async (serviceId: string) => {
    setTestingId(serviceId);
    const start = performance.now();

    try {
      if (serviceId === "storage") {
        const res = await manager.storageAdapter.getAccessUrl(
          "ressources/guide-rgie-decapage.pdf",
        );
        const duration = Math.round(performance.now() - start);
        setTestResults((prev) => ({
          ...prev,
          storage: {
            serviceId: "storage",
            durationMs: duration,
            timestamp: new Date().toLocaleTimeString("fr-FR"),
            success: res.success,
            data: res.success ? res.data : undefined,
            error: (res.success === false ? res.error : undefined)
              ? {
                  code:
                    ((res.success === false ? res.error : undefined) as { code?: string; name?: string })?.code ||
                    ((res.success === false ? res.error : undefined) as { code?: string; name?: string })?.name,
                  message: (res.success === false ? res.error : undefined)?.message,
                }
              : undefined,
          },
        }));
      } else if (serviceId === "live") {
        const res = await manager.liveSessionAdapter.getStatus(
          "session-concasseur-01",
        );
        const duration = Math.round(performance.now() - start);
        setTestResults((prev) => ({
          ...prev,
          live: {
            serviceId: "live",
            durationMs: duration,
            timestamp: new Date().toLocaleTimeString("fr-FR"),
            success: res.success,
            data: res.success ? res.data : undefined,
            error: (res.success === false ? res.error : undefined)
              ? {
                  code:
                    ((res.success === false ? res.error : undefined) as { code?: string; name?: string })?.code ||
                    ((res.success === false ? res.error : undefined) as { code?: string; name?: string })?.name,
                  message: (res.success === false ? res.error : undefined)?.message,
                }
              : undefined,
          },
        }));
      } else if (serviceId === "deployment") {
        const res =
          await manager.deploymentAdapter.getStatus("dep_sim_mock_01");
        const duration = Math.round(performance.now() - start);
        setTestResults((prev) => ({
          ...prev,
          deployment: {
            serviceId: "deployment",
            durationMs: duration,
            timestamp: new Date().toLocaleTimeString("fr-FR"),
            success: res.success,
            data: res.success ? res.data : undefined,
            error: (res.success === false ? res.error : undefined)
              ? {
                  code:
                    ((res.success === false ? res.error : undefined) as { code?: string; name?: string })?.code ||
                    ((res.success === false ? res.error : undefined) as { code?: string; name?: string })?.name,
                  message: (res.success === false ? res.error : undefined)?.message,
                }
              : undefined,
          },
        }));
      } else if (serviceId === "repository") {
        const res = await manager.repositoryAdapter.getStatus();
        const duration = Math.round(performance.now() - start);
        setTestResults((prev) => ({
          ...prev,
          repository: {
            serviceId: "repository",
            durationMs: duration,
            timestamp: new Date().toLocaleTimeString("fr-FR"),
            success: res.success,
            data: res.success ? res.data : undefined,
            error: (res.success === false ? res.error : undefined)
              ? {
                  code:
                    ((res.success === false ? res.error : undefined) as { code?: string; name?: string })?.code ||
                    ((res.success === false ? res.error : undefined) as { code?: string; name?: string })?.name,
                  message: (res.success === false ? res.error : undefined)?.message,
                }
              : undefined,
          },
        }));
      } else if (serviceId === "dns") {
        const res = await manager.dnsAdapter.getStatus("do-mining.com");
        const duration = Math.round(performance.now() - start);
        setTestResults((prev) => ({
          ...prev,
          dns: {
            serviceId: "dns",
            durationMs: duration,
            timestamp: new Date().toLocaleTimeString("fr-FR"),
            success: res.success,
            data: res.success ? res.data : undefined,
            error: (res.success === false ? res.error : undefined)
              ? {
                  code:
                    ((res.success === false ? res.error : undefined) as { code?: string; name?: string })?.code ||
                    ((res.success === false ? res.error : undefined) as { code?: string; name?: string })?.name,
                  message: (res.success === false ? res.error : undefined)?.message,
                }
              : undefined,
          },
        }));
      }
    } finally {
      setTestingId(null);
    }
  };

  const getScenarioBadgeVariant = (
    scenario: string,
  ): "success" | "warning" | "neutral" => {
    if (
      [
        "AVAILABLE",
        "LIVE",
        "DEPLOYED",
        "SYNCED",
        "PROPAGATED",
        "SUCCESS",
      ].includes(scenario)
    )
      return "success";
    if (
      [
        "SCHEDULED",
        "BUILDING",
        "BEHIND",
        "PENDING_PROPAGATION",
        "LATENCY",
      ].includes(scenario)
    )
      return "warning";
    return "neutral";
  };

  return (
    <SpaceShell space="admin" activeRoute="/admin/simulations">
      <PageHeader
        title="Couche de Simulation Déterministe"
        description="Contrôle en temps réel des adaptateurs découplés (Task 6). Testez les branches d’erreur, les pannes d’infrastructure et vérifiez l'impact direct dans l’UI de formation."
        badge={
          <Badge variant="primary" dot>
            Simulation Freeze v0.1
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Administration", href: "/admin" },
          { label: "Simulations d’Infrastructure", isCurrent: true },
        ]}
      />

      {/* Global Presets & Stats */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Adaptateurs simulés"
            value="5 Ports"
            helperText="Storage, Live, Deploy, Repo, Dns"
            icon={<Server className="w-4 h-4" />}
          />
          <StatCard
            label="Branchement UI actif"
            value="Réactif (Local)"
            helperText="Persisté en localStorage & in-memory"
            icon={<CheckCircle2 className="w-4 h-4" />}
          />
          <StatCard
            label="Dépendances externes réelles"
            value="0 (Zéro API)"
            helperText="Architecture Freeze garantie"
            icon={<Sliders className="w-4 h-4" />}
          />
        </div>

        {/* Global Preset Bar */}
        <div className="p-4 bg-dm-surface rounded-xl border border-dm-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-dm-ink flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-dm-primary" />
              <span>Préréglages d&apos;environnement globaux</span>
            </div>
            <div className="text-[11px] text-dm-muted">
              Basculez instantanément l&apos;ensemble de la plateforme dans un
              état cible pour vos démonstrations.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={applyPresetNominal}
              leftIcon={
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              }
            >
              Nominal (Vert)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={applyPresetGlobalOutage}
              leftIcon={<ShieldAlert className="w-3.5 h-3.5 text-rose-500" />}
            >
              Panne globale (UNAVAILABLE)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={applyPresetNotConfigured}
              leftIcon={
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              }
            >
              Non configuré
            </Button>
          </div>
        </div>

        {globalNotice && (
          <div className="p-3 bg-dm-primary/10 border border-dm-primary/30 rounded-xl text-dm-ink text-xs flex items-center justify-between">
            <span>{globalNotice}</span>
            <button
              type="button"
              onClick={() => setGlobalNotice(null)}
              className="text-dm-primary font-bold ml-4 cursor-pointer hover:opacity-75"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* 5 Deterministic Adapters Control Grid */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-dm-ink">
            Configuration granulaire des ports d&apos;infrastructure
          </h2>
          <span className="text-xs text-dm-muted">
            Choix déterministe par composant
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 1. StoragePort (Cloudflare R2) */}
          <Card
            title="StoragePort"
            subtitle="Cible future : Cloudflare R2 / S3 Storage"
            badge={
              <Badge
                variant={getScenarioBadgeVariant(storageScenario)}
                size="sm"
              >
                {storageScenario}
              </Badge>
            }
            footer={
              <div className="w-full flex items-center justify-between text-xs pt-1">
                <Link
                  href="/learn/carrieres-et-granulats/chaine-production-granulats/decapage"
                  className="text-dm-primary hover:underline flex items-center gap-1 text-[11px]"
                >
                  Tester dans la leçon (Téléchargement PDF)
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Play className="w-3 h-3" />}
                  isLoading={testingId === "storage"}
                  onClick={() => runTest("storage")}
                >
                  Tester getAccessUrl()
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="text-xs text-dm-muted leading-relaxed">
                Distribution des ressources volumineuses : vidéos techniques 4K,
                fiches de poste PDF et schémas d&apos;extraction.
              </div>

              <div>
                <label className="text-[11px] font-semibold text-dm-ink block mb-2">
                  Scénario actif simulé :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(
                    [
                      "AVAILABLE",
                      "MISSING_OBJECT",
                      "UPLOAD_FAILURE",
                      "READ_FAILURE",
                      "UNAVAILABLE",
                      "NOT_CONFIGURED",
                      "PERMISSION_DENIED",
                      "LATENCY",
                    ] as StorageSimulationScenario[]
                  ).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => handleStorageChange(sc)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-colors cursor-pointer ${
                        storageScenario === sc
                          ? "bg-dm-primary text-white border-dm-primary shadow-xs"
                          : "bg-dm-surface hover:bg-dm-border/60 text-dm-ink border-dm-border"
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              {testResults.storage && (
                <div className="p-3 bg-dm-surface rounded-lg border border-dm-border font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-dm-muted text-[10px]">
                    <span>
                      Résultat du test ({testResults.storage.durationMs}ms)
                    </span>
                    <span>{testResults.storage.timestamp}</span>
                  </div>
                  {testResults.storage.success ? (
                    <div className="text-emerald-700">
                      ✓ OK : {JSON.stringify(testResults.storage.data)}
                    </div>
                  ) : (
                    <div className="text-rose-700">
                      ✕ ÉCHEC : [{testResults.storage.error?.code}]{" "}
                      {testResults.storage.error?.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* 2. LiveSessionPort (Jitsi Meet) */}
          <Card
            title="LiveSessionPort"
            subtitle="Cible future : Jitsi Meet / 8x8 Synchronous Video"
            badge={
              <Badge variant={getScenarioBadgeVariant(liveScenario)} size="sm">
                {liveScenario}
              </Badge>
            }
            footer={
              <div className="w-full flex items-center justify-between text-xs pt-1">
                <Link
                  href="/live/session-concasseur-01"
                  className="text-dm-primary hover:underline flex items-center gap-1 text-[11px]"
                >
                  Voir l&apos;impact dans /live/session-concasseur-01
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Play className="w-3 h-3" />}
                  isLoading={testingId === "live"}
                  onClick={() => runTest("live")}
                >
                  Tester getStatus()
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="text-xs text-dm-muted leading-relaxed">
                Salons de visioconférence et ateliers synchrones avec les
                ingénieurs experts sur le réglage des concasseurs.
              </div>

              <div>
                <label className="text-[11px] font-semibold text-dm-ink block mb-2">
                  Scénario actif simulé :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {(
                    [
                      "LIVE",
                      "SCHEDULED",
                      "ENDED",
                      "CANCELLED",
                      "UNAVAILABLE",
                      "NOT_CONFIGURED",
                      "NOT_FOUND",
                      "PERMISSION_DENIED",
                      "LATENCY",
                    ] as LiveSimulationScenario[]
                  ).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => handleLiveChange(sc)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-colors cursor-pointer ${
                        liveScenario === sc
                          ? "bg-dm-primary text-white border-dm-primary shadow-xs"
                          : "bg-dm-surface hover:bg-dm-border/60 text-dm-ink border-dm-border"
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              {testResults.live && (
                <div className="p-3 bg-dm-surface rounded-lg border border-dm-border font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-dm-muted text-[10px]">
                    <span>
                      Résultat du test ({testResults.live.durationMs}ms)
                    </span>
                    <span>{testResults.live.timestamp}</span>
                  </div>
                  {testResults.live.success ? (
                    <div className="text-emerald-700">
                      ✓ OK : {JSON.stringify(testResults.live.data)}
                    </div>
                  ) : (
                    <div className="text-rose-700">
                      ✕ ÉCHEC : [{testResults.live.error?.code}]{" "}
                      {testResults.live.error?.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* 3. DeploymentPort (Pipeline Vercel / Cloud Run) */}
          <Card
            title="DeploymentPort"
            subtitle="Cible future : Vercel / Cloud Run Deployment API"
            badge={
              <Badge
                variant={getScenarioBadgeVariant(deploymentScenario)}
                size="sm"
              >
                {deploymentScenario}
              </Badge>
            }
            footer={
              <div className="w-full flex items-center justify-between text-xs pt-1">
                <span className="text-dm-muted text-[11px]">
                  Contrat : DeploymentStatus (state, commitSha, url)
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Play className="w-3 h-3" />}
                  isLoading={testingId === "deployment"}
                  onClick={() => runTest("deployment")}
                >
                  Tester getStatus()
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="text-xs text-dm-muted leading-relaxed">
                Supervision du cycle de vie du déploiement des applications,
                builds conteneurisés et prévisualisations de release.
              </div>

              <div>
                <label className="text-[11px] font-semibold text-dm-ink block mb-2">
                  Scénario actif simulé :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(
                    [
                      "DEPLOYED",
                      "BUILDING",
                      "FAILED",
                      "UNAVAILABLE",
                      "NOT_CONFIGURED",
                      "PERMISSION_DENIED",
                      "NOT_FOUND",
                      "LATENCY",
                    ] as DeploymentSimulationScenario[]
                  ).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => handleDeploymentChange(sc)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-colors cursor-pointer ${
                        deploymentScenario === sc
                          ? "bg-dm-primary text-white border-dm-primary shadow-xs"
                          : "bg-dm-surface hover:bg-dm-border/60 text-dm-ink border-dm-border"
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              {testResults.deployment && (
                <div className="p-3 bg-dm-surface rounded-lg border border-dm-border font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-dm-muted text-[10px]">
                    <span>
                      Résultat du test ({testResults.deployment.durationMs}ms)
                    </span>
                    <span>{testResults.deployment.timestamp}</span>
                  </div>
                  {testResults.deployment.success ? (
                    <div className="text-emerald-700">
                      ✓ OK : {JSON.stringify(testResults.deployment.data)}
                    </div>
                  ) : (
                    <div className="text-rose-700">
                      ✕ ÉCHEC : [{testResults.deployment.error?.code}]{" "}
                      {testResults.deployment.error?.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* 4. RepositoryPort (GitHub VCS) */}
          <Card
            title="RepositoryPort"
            subtitle="Cible future : GitHub / Version Control API"
            badge={
              <Badge
                variant={getScenarioBadgeVariant(repositoryScenario)}
                size="sm"
              >
                {repositoryScenario}
              </Badge>
            }
            footer={
              <div className="w-full flex items-center justify-between text-xs pt-1">
                <span className="text-dm-muted text-[11px]">
                  Contrat : RepositoryStatus (branch, commit, cleanTree)
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Play className="w-3 h-3" />}
                  isLoading={testingId === "repository"}
                  onClick={() => runTest("repository")}
                >
                  Tester getStatus()
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="text-xs text-dm-muted leading-relaxed">
                Traçabilité des commits, intégrité de l&apos;arbre de travail et
                détection des désynchronisations de code en production.
              </div>

              <div>
                <label className="text-[11px] font-semibold text-dm-ink block mb-2">
                  Scénario actif simulé :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(
                    [
                      "SYNCED",
                      "BEHIND",
                      "DIVERGED",
                      "UNAVAILABLE",
                      "NOT_CONFIGURED",
                      "PERMISSION_DENIED",
                      "NOT_FOUND",
                      "LATENCY",
                    ] as RepositorySimulationScenario[]
                  ).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => handleRepositoryChange(sc)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-colors cursor-pointer ${
                        repositoryScenario === sc
                          ? "bg-dm-primary text-white border-dm-primary shadow-xs"
                          : "bg-dm-surface hover:bg-dm-border/60 text-dm-ink border-dm-border"
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              {testResults.repository && (
                <div className="p-3 bg-dm-surface rounded-lg border border-dm-border font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-dm-muted text-[10px]">
                    <span>
                      Résultat du test ({testResults.repository.durationMs}ms)
                    </span>
                    <span>{testResults.repository.timestamp}</span>
                  </div>
                  {testResults.repository.success ? (
                    <div className="text-emerald-700">
                      ✓ OK : {JSON.stringify(testResults.repository.data)}
                    </div>
                  ) : (
                    <div className="text-rose-700">
                      ✕ ÉCHEC : [{testResults.repository.error?.code}]{" "}
                      {testResults.repository.error?.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* 5. DnsPort (Hostinger / Cloudflare DNS) */}
          <Card
            title="DnsPort"
            subtitle="Cible future : Hostinger / Cloudflare DNS Management"
            badge={
              <Badge variant={getScenarioBadgeVariant(dnsScenario)} size="sm">
                {dnsScenario}
              </Badge>
            }
            className="lg:col-span-2"
            footer={
              <div className="w-full flex items-center justify-between text-xs pt-1">
                <span className="text-dm-muted text-[11px]">
                  Contrat : DnsStatus (propagated, nameservers, sslActive)
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Play className="w-3 h-3" />}
                  isLoading={testingId === "dns"}
                  onClick={() => runTest("dns")}
                >
                  Tester getStatus(&apos;do-mining.com&apos;)
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="text-xs text-dm-muted leading-relaxed">
                Résolution DNS du domaine institutionnel do-mining.com et
                sous-domaines (assets, live, api).
              </div>

              <div>
                <label className="text-[11px] font-semibold text-dm-ink block mb-2">
                  Scénario actif simulé :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(
                    [
                      "PROPAGATED",
                      "PENDING_PROPAGATION",
                      "DNS_ERROR",
                      "UNAVAILABLE",
                      "NOT_CONFIGURED",
                      "PERMISSION_DENIED",
                      "NOT_FOUND",
                      "LATENCY",
                    ] as DnsSimulationScenario[]
                  ).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => handleDnsChange(sc)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-colors cursor-pointer ${
                        dnsScenario === sc
                          ? "bg-dm-primary text-white border-dm-primary shadow-xs"
                          : "bg-dm-surface hover:bg-dm-border/60 text-dm-ink border-dm-border"
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              {testResults.dns && (
                <div className="p-3 bg-dm-surface rounded-lg border border-dm-border font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-dm-muted text-[10px]">
                    <span>
                      Résultat du test ({testResults.dns.durationMs}ms)
                    </span>
                    <span>{testResults.dns.timestamp}</span>
                  </div>
                  {testResults.dns.success ? (
                    <div className="text-emerald-700">
                      ✓ OK : {JSON.stringify(testResults.dns.data)}
                    </div>
                  ) : (
                    <div className="text-rose-700">
                      ✕ ÉCHEC : [{testResults.dns.error?.code}]{" "}
                      {testResults.dns.error?.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Future PostgreSQL Preparation (Drizzle Seam Notice) */}
        <div className="p-4 bg-dm-surface rounded-xl border border-dm-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-dm-ink">
            <Database className="w-4 h-4 text-dm-primary" />
            <span>
              Seam architectural : Préparation du chargement PostgreSQL (Phase
              2+)
            </span>
          </div>
          <p className="text-xs text-dm-muted leading-relaxed">
            Conformément aux directives de l&apos;Architecture Freeze, les
            interfaces{" "}
            <code className="px-1 py-0.5 bg-dm-white border border-dm-border rounded font-mono text-[11px]">
              SimulationScenarioRepository
            </code>{" "}
            et le loader{" "}
            <code className="px-1 py-0.5 bg-dm-white border border-dm-border rounded font-mono text-[11px]">
              SimulationScenarioLoader
            </code>{" "}
            sont déjà codés dans{" "}
            <code className="font-mono">@do-mining/contracts</code> et{" "}
            <code className="font-mono">@do-mining/mocks</code>. Lors de la
            phase de persistance cloud, ils seront directement liés à une table
            PostgreSQL sans modifier la moindre ligne du domaine métier ou des
            interfaces de ports.
          </p>
        </div>
      </div>
    </SpaceShell>
  );
}
