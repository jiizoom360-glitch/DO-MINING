"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { CertificateModal } from "@/app/components/CertificateModal";
import {
  Award,
  CheckCircle,
  PlayCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  ShieldCheck,
  Download,
  Share2,
  ArrowRight,
  BookOpen,
  Check,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";
import { SimulationManager } from "@do-mining/mocks";
import type { ContentNode } from "@do-mining/core";

interface LearnCoursePageProps {
  params: Promise<{ course: string }>;
}

export default function LearnCoursePage({ params }: LearnCoursePageProps) {
  const { course } = use(params);

  const [courseNode, setCourseNode] = useState<ContentNode | null>(null);
  const [modules, setModules] = useState<ContentNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Accordion state: open all by default for immediate pedagogical transparency
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    m1: true,
    m2: true,
    m3: true,
    m4: true,
  });
  const [allExpanded, setAllExpanded] = useState(true);

  // Modals
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const contentAdapter = SimulationManager.getInstance().contentAdapter;
      let searchSlug = course;
      if (course === "carrieres-et-granulats") {
        searchSlug = "exploitation-carrieres-granulats";
      }

      const res = await contentAdapter.getNodeBySlug(searchSlug);
      if (res.success && res.data && isMounted) {
        setCourseNode(res.data);
        const childrenRes = await contentAdapter.getChildren(res.data.id);
        if (childrenRes.success && isMounted) {
          setModules(childrenRes.data);
        }
      }
      if (isMounted) setIsLoading(false);
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [course]);

  const toggleAll = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    setExpandedModules({
      m1: nextState,
      m2: nextState,
      m3: nextState,
      m4: nextState,
    });
  };

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const courseTitle = courseNode
    ? courseNode.title
    : "Exploitation des Carrières & Production des Granulats EN 933";

  return (
    <SpaceShell space="learner" activeRoute={`/learn/${course}`}>
      <div className="space-y-6">
        {/* 1. Hero Course Banner (Screenshots 4, 5) */}
        <div className="bg-white rounded-2xl border border-dm-border overflow-hidden shadow-xs">
          {/* Top visual cover with industrial quarry styling */}
          <div className="relative h-44 sm:h-56 w-full bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 sm:p-8 flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
            
            <div className="relative z-10 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-dm-primary text-white text-[10px] font-bold uppercase tracking-widest">
                  GÉNIE MINIER &amp; CARRIÈRES
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-cyan-200 text-[10px] font-semibold tracking-wider uppercase">
                  NORME EUROPÉENNE EN 933
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                {courseTitle}
              </h1>
            </div>
          </div>

          {/* Instructor and Metadata Bar */}
          <div className="px-6 py-4 bg-dm-surface border-t border-dm-border flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-dm-primary-soft text-dm-primary-deep flex items-center justify-center font-bold text-sm shadow-xs">
                M
              </div>
              <div>
                <div className="font-bold text-dm-ink flex items-center gap-1.5">
                  <span>Marc V.</span>
                  <span className="text-[10px] text-dm-primary font-semibold px-1.5 py-0.2 rounded bg-dm-primary-soft">
                    Formateur Référent
                  </span>
                </div>
                <div className="text-[11px] text-dm-muted">
                  Dernière mise à jour réglementaire : Septembre 2026
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard?tab=documents"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-dm-border bg-white text-dm-ink hover:bg-dm-surface transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-dm-muted" />
                <span>Fiches Mémo &amp; Documents</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  }
                }}
                className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                  copied
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-dm-border bg-white text-dm-muted hover:text-dm-ink hover:bg-dm-surface"
                }`}
                title="Partager cette formation"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-[11px]">Lien copié !</span>
                  </>
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Main Two-Column Structure (Content on Left + Sticky Card on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Main Content (8/12 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card: Certificate Earned Callout (Screenshot 4) */}
            <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
                      ÉPREUVE VALIDÉE
                    </span>
                    <span className="text-xs text-emerald-800 font-semibold">
                      Score : 100%
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-emerald-950">
                    Attestation d&apos;Aptitude Professionnelle disponible !
                  </h3>
                  <p className="text-xs text-emerald-800/90 leading-relaxed max-w-xl">
                    Félicitations ! Vous avez validé l&apos;ensemble des protocoles de sécurité, des leçons opératoires et le quiz certifiant EN 933. Votre certificat officiel scellé est prêt.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCertModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger le Certificat (PDF)</span>
              </button>
            </div>

            {/* Card: Course Progress Status (Screenshot 4) */}
            <div className="bg-white rounded-2xl border border-dm-border p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-dm-ink">
                  Progression dans le parcours certifiant
                </span>
                <span className="font-bold text-dm-primary text-sm">
                  100% Complété
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-dm-surface border border-dm-border/60 overflow-hidden">
                <div className="h-full bg-emerald-500 w-full transition-all duration-500" />
              </div>

              <div className="flex items-center justify-between text-xs text-dm-muted pt-1">
                <span>3 modules validés • 12 étapes terminées</span>
                <Link
                  href="/learn/carrieres-et-granulats/chaine-operatoire/decapage"
                  className="font-semibold text-dm-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Revoir la première étape</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Course Description & Overview */}
            <div className="bg-white rounded-2xl border border-dm-border p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-dm-ink">
                Objectifs &amp; Compétences Métier
              </h3>
              <div className="text-xs text-dm-ink/85 space-y-3 leading-relaxed">
                <p>
                  Ce parcours professionnel prépare les opérateurs et chefs d&apos;équipe à la maîtrise complète de la chaîne d&apos;exploitation d&apos;une carrière de roches massives et alluvionnaires : du décapage initial jusqu&apos;à l&apos;obtention de granulats normalisés selon la norme européenne EN 933.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-dm-surface border border-dm-border/70 space-y-1">
                    <div className="font-bold text-dm-ink flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-dm-primary" />
                      <span>Sécurité &amp; RGPTM</span>
                    </div>
                    <p className="text-[11px] text-dm-muted">
                      Règles de recul des engins, profils géotechniques des merlons et distances de tir pyrotechnique.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-dm-surface border border-dm-border/70 space-y-1">
                    <div className="font-bold text-dm-ink flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-dm-primary" />
                      <span>Procédés Industriels</span>
                    </div>
                    <p className="text-[11px] text-dm-muted">
                      Optimisation du concassage primaire (mâchoires / giratoire) et courbes de tamisage en laboratoire.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Course Curriculum Accordion (Screenshot 5) */}
            <div className="bg-white rounded-2xl border border-dm-border p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-dm-ink">
                    Programme de la formation
                  </h3>
                  <p className="text-xs text-dm-muted">
                    Ordre pédagogique séquentiel validé par l&apos;Académie DO-Mining.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-dm-primary hover:text-dm-primary-deep cursor-pointer"
                >
                  <span>{allExpanded ? "Tout replier" : "Tout déplier"}</span>
                  {allExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Accordion Modules */}
              <div className="space-y-3 pt-2">
                {/* Module 1 */}
                <div className="rounded-xl border border-dm-border overflow-hidden">
                  <div
                    onClick={() => toggleModule("m1")}
                    className="p-4 bg-dm-surface hover:bg-dm-border/20 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-dm-ink">
                          Module 1 : Décapage des sols &amp; Merlons de sécurité
                        </div>
                        <div className="text-[11px] text-dm-muted">
                          1 Leçon • 45 min • Validé ✓
                        </div>
                      </div>
                    </div>
                    {expandedModules.m1 ? <ChevronUp className="w-4 h-4 text-dm-muted" /> : <ChevronDown className="w-4 h-4 text-dm-muted" />}
                  </div>

                  {expandedModules.m1 && (
                    <div className="p-4 border-t border-dm-border/60 bg-white space-y-2">
                      <Link
                        href="/learn/carrieres-et-granulats/chaine-operatoire/decapage"
                        className="p-3 rounded-lg hover:bg-dm-surface border border-dm-border/50 flex items-center justify-between text-xs group"
                      >
                        <div className="flex items-center gap-2.5">
                          <PlayCircle className="w-4 h-4 text-dm-primary" />
                          <span className="font-medium text-dm-ink group-hover:text-dm-primary transition-colors">
                            Étape 1 : Décapage des terrains &amp; préservation de la terre végétale
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Validé
                        </span>
                      </Link>
                      <div className="p-3 rounded-lg bg-dm-surface/50 border border-dm-border/40 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 text-dm-muted">
                          <FileText className="w-4 h-4" />
                          <span>Schéma géotechnique : Banquette de recul et profil du merlon</span>
                        </div>
                        <span className="text-[10px] text-dm-muted">Document technique</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module 2 */}
                <div className="rounded-xl border border-dm-border overflow-hidden">
                  <div
                    onClick={() => toggleModule("m2")}
                    className="p-4 bg-dm-surface hover:bg-dm-border/20 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-dm-ink">
                          Module 2 : Abattage à l&apos;explosif &amp; Foration géométrique
                        </div>
                        <div className="text-[11px] text-dm-muted">
                          2 Leçons • 1h 30 min • Validé ✓
                        </div>
                      </div>
                    </div>
                    {expandedModules.m2 ? <ChevronUp className="w-4 h-4 text-dm-muted" /> : <ChevronDown className="w-4 h-4 text-dm-muted" />}
                  </div>

                  {expandedModules.m2 && (
                    <div className="p-4 border-t border-dm-border/60 bg-white space-y-2">
                      <div className="p-3 rounded-lg hover:bg-dm-surface border border-dm-border/50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <PlayCircle className="w-4 h-4 text-dm-primary" />
                          <span className="font-medium text-dm-ink">
                            Étape 2.1 : Maille de foration, inclinaison des trous et calcul de surforage
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Validé
                        </span>
                      </div>
                      <div className="p-3 rounded-lg hover:bg-dm-surface border border-dm-border/50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <PlayCircle className="w-4 h-4 text-dm-primary" />
                          <span className="font-medium text-dm-ink">
                            Étape 2.2 : Chargement des charges explosives &amp; distances d&apos;évacuation
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Validé
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module 3 */}
                <div className="rounded-xl border border-dm-border overflow-hidden">
                  <div
                    onClick={() => toggleModule("m3")}
                    className="p-4 bg-dm-surface hover:bg-dm-border/20 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-dm-ink">
                          Module 3 : Concassage primaire &amp; Séparation granulométrique
                        </div>
                        <div className="text-[11px] text-dm-muted">
                          1 Leçon • 1h 00 min • Validé ✓
                        </div>
                      </div>
                    </div>
                    {expandedModules.m3 ? <ChevronUp className="w-4 h-4 text-dm-muted" /> : <ChevronDown className="w-4 h-4 text-dm-muted" />}
                  </div>

                  {expandedModules.m3 && (
                    <div className="p-4 border-t border-dm-border/60 bg-white space-y-2">
                      <div className="p-3 rounded-lg hover:bg-dm-surface border border-dm-border/50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <PlayCircle className="w-4 h-4 text-dm-primary" />
                          <span className="font-medium text-dm-ink">
                            Étape 3.1 : Concasseur à mâchoires vs concasseur giratoire (Metso C120)
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Validé
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module 4 : Quiz Certifiant */}
                <div className="rounded-xl border border-dm-border overflow-hidden">
                  <div
                    onClick={() => toggleModule("m4")}
                    className="p-4 bg-dm-surface hover:bg-dm-border/20 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-dm-accent text-dm-ink flex items-center justify-center font-bold text-xs shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-dm-ink">
                          Évaluation Certifiante : Quiz EN 933
                        </div>
                        <div className="text-[11px] text-dm-muted">
                          1 Quiz • Seuil 80% requis • Validé 100% ✓
                        </div>
                      </div>
                    </div>
                    {expandedModules.m4 ? <ChevronUp className="w-4 h-4 text-dm-muted" /> : <ChevronDown className="w-4 h-4 text-dm-muted" />}
                  </div>

                  {expandedModules.m4 && (
                    <div className="p-4 border-t border-dm-border/60 bg-white space-y-2">
                      <Link
                        href="/quiz/quiz-granulats-01"
                        className="p-3 rounded-lg hover:bg-dm-surface border border-dm-border/50 flex items-center justify-between text-xs group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Award className="w-4 h-4 text-dm-primary" />
                          <span className="font-medium text-dm-ink group-hover:text-dm-primary transition-colors">
                            Quiz officiel d&apos;évaluation de conformité EN 933
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Score 100%
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* "À propos du Formateur" Card (Screenshot 5) */}
            <div className="bg-white rounded-2xl border border-dm-border p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-dm-ink">
                À propos du Formateur
              </h3>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-800 to-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
                  M
                </div>

                <div className="space-y-2 flex-1 text-xs">
                  <div>
                    <div className="font-bold text-sm text-dm-ink flex items-center gap-2">
                      <span>Marc V.</span>
                      <span className="px-2 py-0.5 rounded bg-dm-primary-soft text-dm-primary-deep text-[10px] font-bold">
                        Expert Référent Mines
                      </span>
                    </div>
                    <div className="text-dm-muted text-[11px]">
                      25 ans d&apos;expérience en conduite de carrière et exploitation de granulats
                    </div>
                  </div>

                  <p className="text-dm-ink/80 leading-relaxed">
                    Ancien directeur d&apos;exploitation de sites de roches massives et alluvionnaires en région Hauts-de-France. Formateur agréé pour la conduite des installations de concassage-criblage, la sécurité pyrotechnique et la certification ISO 14001 des sites miniers.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-dm-muted font-medium">
                    <span>• 4 Formations animées</span>
                    <span>• 482 Apprenants certifiés</span>
                    <span>• Note moyenne 4.9/5</span>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/dashboard?tab=documents"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-dm-primary text-white font-bold text-xs hover:bg-dm-primary-deep transition-colors shadow-xs cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Consulter les fiches mémo &amp; documents associés</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sticky Sidebar Widget: "Cette formation comprend" (Screenshots 4 & 5) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-dm-border p-5 shadow-xs space-y-5 sticky top-20">
              {/* Mini Course Thumbnail */}
              <div className="relative h-36 rounded-xl bg-gradient-to-br from-teal-900 via-slate-800 to-cyan-950 p-4 flex flex-col justify-between overflow-hidden">
                <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase self-start">
                  PARCOURS CERTIFIANT
                </span>
                <div className="text-white text-xs font-bold leading-snug">
                  Exploitation &amp; Granulats EN 933
                </div>
              </div>

              {/* Colleague Avatars Pile */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-dm-surface border border-dm-border/60">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white">
                    A
                  </div>
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white">
                    L
                  </div>
                  <div className="w-6 h-6 rounded-full bg-cyan-700 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white">
                    C
                  </div>
                </div>
                <div className="text-[11px] text-dm-muted font-medium">
                  <span className="font-bold text-dm-ink">+24 collègues</span> inscrits
                </div>
              </div>

              {/* Main CTA */}
              <Link
                href="/learn/carrieres-et-granulats/chaine-operatoire/decapage"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-dm-primary text-white font-bold text-sm hover:bg-dm-primary-deep transition-colors shadow-xs"
              >
                <span>Accéder au cours</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Inclusions Checklist (Screenshots 4 & 5) */}
              <div className="space-y-3 pt-2 border-t border-dm-border/60 text-xs">
                <div className="font-bold text-dm-ink">
                  Cette formation comprend :
                </div>
                <ul className="space-y-2.5 text-dm-muted">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>3 Leçons interactives pas-à-pas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>4 Fiches mémo téléchargeables (PDF)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1 Quiz d&apos;évaluation avec seuil 80%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1 Certificat d&apos;aptitude nominatif scellé</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Accès illimité 24/7 (mobile &amp; cabine)</span>
                  </li>
                </ul>
              </div>

              {/* Legal Note */}
              <div className="p-3 rounded-xl bg-dm-surface text-[10px] text-dm-muted border border-dm-border/60 leading-relaxed">
                Formation certifiée conforme aux exigences de sécurité du Règlement Général des Industries Extractives (RGPTM).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        courseTitle={courseTitle}
        recipientName="Thomas D."
      />
    </SpaceShell>
  );
}
