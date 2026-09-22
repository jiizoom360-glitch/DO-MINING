"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import {
  PageHeader,
  Badge,
  Button,
  Progress,
} from "@do-mining/ui";
import {
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Play,
  Layers,
  Download,
  Info,
  Sparkles,
  HelpCircle,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { SimulationManager } from "@do-mining/mocks";
import type { ContentNode } from "@do-mining/core";

interface LearnLessonPageProps {
  params: Promise<{ course: string; module: string; lesson: string }>;
}

export default function LearnLessonPage({ params }: LearnLessonPageProps) {
  const { course, module: moduleSlug, lesson } = use(params);
  const [completed, setCompleted] = useState(false);
  const [lessonNode, setLessonNode] = useState<ContentNode | null>(null);
  const [viewMode, setViewMode] = useState<"decouverte" | "technique">("decouverte");
  const [selectedZone, setSelectedZone] = useState<string>("merlon");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const sim = SimulationManager.getInstance();

    async function loadData() {
      const res = await sim.contentAdapter.getNodeBySlug(lesson);
      if (res.success && isMounted) {
        setLessonNode(res.data);
      }
    }
    loadData();

    return () => {
      isMounted = false;
    };
  }, [lesson]);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const zones: Record<string, { title: string; desc: string; rule: string }> = {
    merlon: {
      title: "1. Le Merlon de protection",
      desc: "Une butte de terre surélevée construite le long de la crête et des pistes.",
      rule: "Hauteur minimale = au moins la moitié du diamètre de la roue d'un dumper (ex: 1,50 m pour un dumper 50t). Il empêche physiquement un engin en détresse de basculer dans le vide.",
    },
    banquette: {
      title: "2. La Banquette de recul",
      desc: "L'espace horizontal plat séparant la terre végétale du front de roche dure.",
      rule: "Largeur obligatoire de 5 à 10 mètres. Elle sert de zone tampon pour retenir d'éventuels éboulements et permet la circulation des engins de secours.",
    },
    front: {
      title: "3. Le Front d'abattage",
      desc: "La paroi rocheuse verticale ou inclinée d'où est extraite la pierre massive.",
      rule: "La hauteur est limitée selon la stabilité géologique (souvent 15 m max par gradin). Une purge régulière des blocs instables est indispensable avant tout chargement.",
    },
    piste: {
      title: "4. La Piste de roulage",
      desc: "L'autoroute de la carrière où transitent les tombereaux chargés de 60 tonnes de roche.",
      rule: "Largeur minimale = 3 à 4 fois la largeur du plus grand véhicule. Pente limitée à 10-12% maximum pour préserver les freins des engins.",
    },
  };

  return (
    <SpaceShell
      space="learner"
      activeRoute={`/learn/${course}/${moduleSlug}/${lesson}`}
    >
      <PageHeader
        title={
          lessonNode?.title ||
          "Décapage des sols et mise en sécurité du front de carrière"
        }
        description="Comprendre la première étape de l'exploitation : comment retirer la terre végétale avec respect de l'écosystème et aménager les banquettes de sécurité."
        badge={
          completed ? (
            <Badge variant="success" size="sm" dot>
              Atelier validé
            </Badge>
          ) : (
            <Badge variant="primary" size="sm" dot>
              En cours d&apos;apprentissage
            </Badge>
          )
        }
        breadcrumbs={[
          { label: "Tableau de bord", href: "/dashboard" },
          { label: "Formation Granulats", href: `/learn/${course}` },
          { label: "Module 01", href: `/learn/${course}/${moduleSlug}` },
          { label: "Leçon active", isCurrent: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={completed ? "secondary" : "primary"}
              size="sm"
              leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
              onClick={() => setCompleted(!completed)}
            >
              {completed ? "Marqué comme terminé ✓" : "Valider cette étape"}
            </Button>
            <Link href="/quiz/quiz-granulats-01">
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Passer au Quiz
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main lesson content */}
        <div className="lg:col-span-2 space-y-6">
          {/* View Mode Toggle */}
          <div className="bg-dm-white p-4 rounded-2xl border border-dm-border/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dm-border/70 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-dm-primary" />
                <span className="text-xs font-bold text-dm-ink uppercase tracking-wider">
                  Mode d&apos;apprentissage
                </span>
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-dm-surface rounded-lg border border-dm-border/80">
                <button
                  type="button"
                  onClick={() => setViewMode("decouverte")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    viewMode === "decouverte"
                      ? "bg-dm-white text-dm-primary-deep font-semibold shadow-xs"
                      : "text-dm-muted hover:text-dm-ink"
                  }`}
                >
                  Vue Découverte &amp; Schéma
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("technique")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    viewMode === "technique"
                      ? "bg-dm-white text-dm-primary-deep font-semibold shadow-xs"
                      : "text-dm-muted hover:text-dm-ink"
                  }`}
                >
                  Vue Fiche Opérationnelle
                </button>
              </div>
            </div>

            {viewMode === "decouverte" ? (
              /* DÉCOUVERTE : Interactive SVG cross-section */
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-dm-muted leading-relaxed">
                  Avant d&apos;atteindre la roche pure, il faut retirer la couche de terre arable (la terre fertile de surface) et créer les accès sécurisés. Cliquez sur un élément du schéma ci-dessous pour en découvrir le rôle vital :
                </p>

                {/* SVG Visual Cross-section */}
                <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Coupe géologique simplifiée d&apos;un front de carrière</span>
                    <span className="text-dm-primary font-mono text-[10px]">Cliquez sur les numéros</span>
                  </div>

                  {/* Interactive Diagram */}
                  <div className="relative aspect-[21/9] w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center p-2">
                    <svg viewBox="0 0 800 300" className="w-full h-full select-none">
                      {/* Sky */}
                      <rect x="0" y="0" width="800" height="120" fill="#0f172a" />
                      {/* Topsoil layer */}
                      <path d="M 0,120 L 280,120 L 280,160 L 0,160 Z" fill="#78350f" opacity="0.8" />
                      {/* Merlon mound */}
                      <path d="M 240,120 Q 260,85 280,120 Z" fill="#92400e" stroke="#f59e0b" strokeWidth="2" />
                      {/* Banquette bench */}
                      <rect x="280" y="150" width="160" height="20" fill="#334155" />
                      {/* Rock Face vertical */}
                      <path d="M 440,150 L 480,280 L 800,280 L 800,300 L 0,300 L 0,160 Z" fill="#475569" />
                      {/* Quarry Floor / Piste */}
                      <rect x="480" y="270" width="320" height="30" fill="#1e293b" />

                      {/* Interactive Target Buttons */}
                      {/* 1. Merlon */}
                      <g
                        className="cursor-pointer"
                        onClick={() => setSelectedZone("merlon")}
                      >
                        <circle cx="260" cy="100" r="16" fill={selectedZone === "merlon" ? "#08AFC1" : "#1e293b"} stroke="#fff" strokeWidth="2" />
                        <text x="260" y="105" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>
                        <text x="260" y="70" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">Merlon de sécurité</text>
                      </g>

                      {/* 2. Banquette */}
                      <g
                        className="cursor-pointer"
                        onClick={() => setSelectedZone("banquette")}
                      >
                        <circle cx="360" cy="140" r="16" fill={selectedZone === "banquette" ? "#08AFC1" : "#1e293b"} stroke="#fff" strokeWidth="2" />
                        <text x="360" y="145" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">2</text>
                        <text x="360" y="180" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">Banquette de recul (5-10m)</text>
                      </g>

                      {/* 3. Front */}
                      <g
                        className="cursor-pointer"
                        onClick={() => setSelectedZone("front")}
                      >
                        <circle cx="480" cy="210" r="16" fill={selectedZone === "front" ? "#08AFC1" : "#1e293b"} stroke="#fff" strokeWidth="2" />
                        <text x="480" y="215" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">3</text>
                        <text x="550" y="215" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="start">Front d&apos;abattage</text>
                      </g>

                      {/* 4. Piste */}
                      <g
                        className="cursor-pointer"
                        onClick={() => setSelectedZone("piste")}
                      >
                        <circle cx="680" cy="265" r="16" fill={selectedZone === "piste" ? "#08AFC1" : "#1e293b"} stroke="#fff" strokeWidth="2" />
                        <text x="680" y="270" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">4</text>
                        <text x="680" y="245" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">Piste de circulation</text>
                      </g>
                    </svg>
                  </div>

                  {/* Selected zone card */}
                  <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-dm-primary">
                        {zones[selectedZone].title}
                      </span>
                      <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                        Règle clé
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {zones[selectedZone].desc}
                    </p>
                    <div className="text-[11px] text-amber-300 font-medium pt-1">
                      💡 {zones[selectedZone].rule}
                    </div>
                  </div>
                </div>

                {/* Did you know card */}
                <div className="p-4 rounded-xl bg-dm-surface border border-dm-border/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-dm-primary-deep">
                    <Sparkles className="w-4 h-4 text-dm-primary" />
                    <span>Le saviez-vous ? Pourquoi la terre arable est sacrée</span>
                  </div>
                  <p className="text-xs text-dm-muted leading-relaxed">
                    Dans une carrière bien gérée, pas un gramme de bonne terre n&apos;est jeté. Les 30 premiers centimètres de terre végétale contiennent les graines, les champignons et les micro-organismes indispensables à la vie. Ils sont mis en réserve et ré-ensemencés à la fin du chantier pour rendre à la nature un espace boisé ou un lac écologique.
                  </p>
                </div>
              </div>
            ) : (
              /* TECHNIQUE : Operational technical reference */
              <div className="space-y-4 text-xs leading-relaxed text-dm-ink">
                <div className="p-3.5 rounded-xl bg-dm-surface border border-dm-border/80 space-y-2">
                  <div className="font-bold text-xs text-dm-ink flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-dm-primary" />
                    <span>Prescriptions réglementaires de chantier</span>
                  </div>
                  <ul className="space-y-1.5 text-dm-muted pl-1">
                    <li className="flex items-start gap-2">
                      <span className="text-dm-primary font-bold">•</span>
                      <span><strong>Hauteur du merlon :</strong> Au moins 50% du diamètre du pneumatique le plus imposant en circulation sur le site.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-dm-primary font-bold">•</span>
                      <span><strong>Banquette de recul :</strong> Largeur de 5 à 10 m exempte de stockage lourd pour éviter les surcharges de crête.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-dm-primary font-bold">•</span>
                      <span><strong>Fossé de garde :</strong> Pente d&apos;écoulement dirigée vers un bassin de décantation pour prévenir les ravinements.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong>Avertissement Sécurité Terrain :</strong> Ne jamais travailler ou stationner au pied d&apos;un talus de découverte sans purge préalable. Tout signe de fissure en crête impose l&apos;arrêt immédiat de la zone et le repli des engins.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Between Lessons */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-dm-white border border-dm-border/80 shadow-2xs">
            <Link href={`/learn/${course}/${moduleSlug}`}>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Retour au module
              </Button>
            </Link>
            <Link href="/quiz/quiz-granulats-01">
              <Button
                size="sm"
                variant="primary"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Évaluation : Quiz 01
              </Button>
            </Link>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-dm-white border border-dm-border/80 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-dm-ink">Votre avancement</span>
              <span className="font-bold text-dm-primary">
                {completed ? "100% validé" : "En cours"}
              </span>
            </div>
            <Progress value={completed ? 100 : 50} size="sm" />
            <div className="flex items-center gap-1.5 text-[11px] text-dm-muted pt-2 border-t border-dm-border/60">
              <Clock className="w-3.5 h-3.5 text-dm-primary" />
              <span>Durée estimée : 30 minutes</span>
            </div>
          </div>

          {/* Downloadable resource card */}
          <div className="p-5 rounded-xl bg-dm-white border border-dm-border/80 space-y-3 shadow-2xs">
            <div className="text-xs font-bold text-dm-ink uppercase tracking-wider">
              Document de révision
            </div>
            <p className="text-[11px] text-dm-muted leading-relaxed">
              Téléchargez le mémo technique synthétisant les distances réglementaires des banquettes de carrière.
            </p>

            {downloadSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Téléchargement simulé réussi !</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
              leftIcon={<Download className="w-3.5 h-3.5 text-dm-primary" />}
              onClick={handleDownload}
            >
              Fiche Mémo Décapage &amp; Merlons (PDF)
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-dm-surface border border-dm-border/80 space-y-2 text-xs">
            <div className="font-bold text-dm-ink flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-dm-primary" />
              <span>Besoin d&apos;approfondir ?</span>
            </div>
            <p className="text-[11px] text-dm-muted leading-relaxed">
              Passez le Quiz 01 pour tester vos connaissances sur les merlons et les dimensions de banquettes, ou échangez avec un tuteur.
            </p>
          </div>
        </div>
      </div>
    </SpaceShell>
  );
}
