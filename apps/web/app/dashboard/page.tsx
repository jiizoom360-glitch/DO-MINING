"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SpaceShell } from "@/app/components/SpaceShell";
import { CertificateModal } from "@/app/components/CertificateModal";
import {
  GraduationCap,
  Award,
  User,
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
  Search,
  Grid,
  List,
  Camera,
  Share2,
  Pickaxe,
  HardHat,
  ChevronRight,
  Shield,
  Download,
  Eye,
  ExternalLink,
  Video,
  Sparkles,
  Check,
  AlertCircle,
  Image as ImageIcon,
  BookOpen,
  X,
  Maximize2,
  CheckCircle2,
} from "lucide-react";

interface CourseItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: "in-progress" | "completed" | "not-started";
  statusLabel: string;
  progressPercent: number;
  modulesCount: number;
  lessonsCount: number;
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
  coverImage: string;
  lastStep: string;
  hasCertificate: boolean;
}

const MOCK_COURSES: CourseItem[] = [
  {
    id: "c1",
    slug: "carrieres-et-granulats",
    title: "Exploitation des Carrières & Production des Granulats EN 933",
    category: "Extraction & Concassage",
    status: "in-progress",
    statusLabel: "EN COURS",
    progressPercent: 33,
    modulesCount: 3,
    lessonsCount: 12,
    instructorName: "Marc V.",
    instructorRole: "Expert Référent Mines",
    instructorAvatar: "M",
    coverImage: "bg-gradient-to-br from-teal-800 via-cyan-900 to-slate-900",
    lastStep: "Étape 1 : Décapage des terrains & merlons de sécurité",
    hasCertificate: true,
  },
  {
    id: "c2",
    slug: "foration-et-minage",
    title: "Foration, Tirs d'Abattage & Sécurité Pyrotechnique",
    category: "Sécurité & Explosifs",
    status: "completed",
    statusLabel: "TERMINÉ - CERTIFIÉ",
    progressPercent: 100,
    modulesCount: 2,
    lessonsCount: 6,
    instructorName: "Pierre B.",
    instructorRole: "Maître Boutefeu CPT",
    instructorAvatar: "P",
    coverImage: "bg-gradient-to-br from-amber-900 via-stone-800 to-slate-900",
    lastStep: "Épreuve pratique validée avec 96% de réussite",
    hasCertificate: true,
  },
  {
    id: "c3",
    slug: "maintenance-concasseurs",
    title: "Maintenance Préventive des Concasseurs & Broyeurs Industriels",
    category: "Maintenance Mécanique",
    status: "not-started",
    statusLabel: "À DÉMARRER",
    progressPercent: 0,
    modulesCount: 4,
    lessonsCount: 8,
    instructorName: "Sarah L.",
    instructorRole: "Ingénieure Équipements",
    instructorAvatar: "S",
    coverImage: "bg-gradient-to-br from-cyan-950 via-slate-800 to-teal-950",
    lastStep: "Session synchrone programmée jeudi 25 sept.",
    hasCertificate: false,
  },
];

export interface TechnicalMediaItem {
  id: string;
  title: string;
  category: string;
  type: string;
  resolution: string;
  date: string;
  author: string;
  description: string;
  highlights: string[];
  colorAccent: string;
  svgType: "cross-section" | "crusher" | "drone" | "grading" | "truck";
}

const MOCK_SCHEMAS_MEDIA: TechnicalMediaItem[] = [
  {
    id: "sch-1",
    title: "Coupe Géotechnique : Profil de Sécurité du Front de Taille",
    category: "Sécurité & Exploitation",
    type: "SCHÉMA TECHNIQUE COTÉ",
    resolution: "Vectoriel SVG interactif",
    date: "Norme RGPTM / DREAL",
    author: "Bureau d'études géotechniques",
    description: "Représentation normalisée d'un gradin d'exploitation de 15 m : banquette de recul 8 m, merlon de sécurité de 1,50 m (D_roue/2) et angle de talus admissible à 75°.",
    highlights: ["Merlon hauteur ≥ 1/2 rayon pneu", "Banquette de recul ≥ 5 à 10 m", "Front purgé inclinaison 75-80°"],
    colorAccent: "from-amber-600 to-stone-800",
    svgType: "cross-section",
  },
  {
    id: "sch-2",
    title: "Chambre de Concassage Primaire à Mâchoires (Vue en Éclaté)",
    category: "Mécanique & Process",
    type: "CINÉMATIQUE INDUSTRIELLE",
    resolution: "Schéma 3D Isométrique",
    date: "Documentation Metso C120",
    author: "Marc V. (Formateur Mines)",
    description: "Visualisation de l'arbre excentrique, de la mâchoire fixe, de la mâchoire mobile et du système de vérins hydrauliques pour le Closed Side Setting (CSS).",
    highlights: ["Réglage CSS de 90 à 160 mm", "Blindages profil ondulé au manganèse", "Système d'évacuation d'inbroyables"],
    colorAccent: "from-cyan-700 to-slate-900",
    svgType: "crusher",
  },
  {
    id: "sch-3",
    title: "Orthophoto Drone & Cartographie Pistes de Roulage",
    category: "Topographie & Mines",
    type: "PHOTOGRAMMÉTRIE AÉRIENNE",
    resolution: "GSD 2 cm/pixel",
    date: "Survol Septembre 2026",
    author: "Équipe Topo Bellignies",
    description: "Relevé photogrammétrique par drone : délimitation des zones de stockage stériles, fosses actives et pistes à pente limitée à 10%.",
    highlights: ["Calcul cubatures automatique", "Surveillance fissuration crêtes", "Contrôle gabarit des pistes"],
    colorAccent: "from-emerald-700 to-slate-900",
    svgType: "drone",
  },
  {
    id: "sch-4",
    title: "Diagramme de Criblage & Fuseau Granulométrique EN 933-1",
    category: "Qualité & Granulométrie",
    type: "COURBE DE TAMISAGE",
    resolution: "Axe logarithmique normalisé",
    date: "Laboratoire Central Qualité",
    author: "Claire D. (Laboratoire)",
    description: "Courbe cumulative des passants de 0,063 mm à 31,5 mm avec empiètement du fuseau de régularité pour béton prêt à l'emploi (BPE).",
    highlights: ["Coupures 0/4, 4/10, 10/20 mm", "Teneur en fines f1.5 certifiée", "Conforme norme NF EN 12620"],
    colorAccent: "from-blue-700 to-slate-900",
    svgType: "grading",
  },
  {
    id: "sch-5",
    title: "Tombereau Rigide 60t : Zones d'Angles Morts & Périmètres de Sécurité",
    category: "Circulation & Équipements",
    type: "PLAN DE VISIBILITÉ CABINE",
    resolution: "Diagramme d'angles à 360°",
    date: "Direction Prévention Sécurité",
    author: "Adrien T. (QHSE)",
    description: "Cartographie des angles morts critiques à l'arrière droit et sous le museau du dumper, avec balisage des distances de sécurité radio.",
    highlights: ["Zone d'exclusion 15 m", "Caméras & radars 360°", "Contact visuel obligatoire"],
    colorAccent: "from-rose-700 to-slate-900",
    svgType: "truck",
  },
];

const MOCK_REGULATORY_REMINDERS = [
  {
    id: "rem-1",
    title: "Atelier Synchrone : Concasseurs C120",
    date: "Jeudi 25 sept. • 14h00",
    badge: "Direct Jitsi",
    variant: "emerald",
    desc: "Réglage du Closed Side Setting (CSS) avec Marc V.",
    href: "/live/session-concasseur-01",
  },
  {
    id: "rem-2",
    title: "Échéance CACES R482 Cat. E",
    date: "Valide jusqu'en Janvier 2027",
    badge: "Conforme",
    variant: "blue",
    desc: "Conduite tombereau articulé 50t et engins de carrière.",
    href: "#profile",
  },
  {
    id: "rem-3",
    title: "Recyclage SST & Habilitation H0B0",
    date: "Session programmée Novembre 2026",
    badge: "À planifier",
    variant: "amber",
    desc: "Sauveteur Secouriste du Travail & sécurité électrique.",
    href: "#profile",
  },
];

function LearnerHubContent() {
  const searchParams = useSearchParams();
  const tabFromQuery = searchParams.get("tab") || "courses";

  const [activeTab, setActiveTab] = useState<string>(tabFromQuery);
  const [courseFilter, setCourseFilter] = useState<"all" | "in-progress" | "completed" | "certificates">("all");
  const [courseSearch, setCourseSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Interactive profile checklist items
  const [profileTasks, setProfileTasks] = useState([
    { id: "t1", label: "Informations générales", progress: "5/6", done: false, helper: "Ajouter votre numéro d'astreinte" },
    { id: "t2", label: "Expérience terrain & carrières", progress: "1/3", done: false, helper: "Renseigner vos 2 derniers chantiers" },
    { id: "t3", label: "Photo de profil", progress: "1/1", done: true, helper: "Photo professionnelle certifiée" },
    { id: "t4", label: "Photo de couverture", progress: "1/1", done: true, helper: "Bannière industrielle active" },
  ]);

  // Modals state
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedCertTitle, setSelectedCertTitle] = useState("Exploitation des Carrières & Production des Granulats EN 933");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lightboxMedia, setLightboxMedia] = useState<TechnicalMediaItem | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  useEffect(() => {
    if (tabFromQuery) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const filteredCourses = MOCK_COURSES.filter((c) => {
    if (courseFilter === "in-progress" && c.status !== "in-progress") return false;
    if (courseFilter === "completed" && c.status !== "completed") return false;
    if (courseFilter === "certificates" && !c.hasCertificate) return false;
    if (courseSearch.trim() && !c.title.toLowerCase().includes(courseSearch.toLowerCase())) return false;
    return true;
  });

  const handleShareProfile = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Lien du dossier apprenant DO-Mining copié dans votre presse-papiers !");
    } else {
      showToast("Lien copié : " + window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Cover & Profile Banner (Screenshots 1, 2, 3) */}
      <div className="bg-white rounded-2xl border border-dm-border overflow-hidden shadow-xs">
        {/* Cover Photo Area with rich industrial quarry panoramic style */}
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 overflow-hidden">
          {/* Decorative strata background texture */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          
          {/* Subtle industrial badge on cover */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-xs border border-white/20 text-white text-[11px] font-semibold tracking-wider uppercase shadow-xs">
              Site Carrière Bellignies • RGPTM Conforme
            </span>
          </div>
        </div>

        {/* Profile Card Header Info */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar with status and edit trigger */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gradient-to-br from-teal-700 to-slate-800 text-white flex items-center justify-center font-bold text-3xl shadow-md overflow-hidden relative">
                  <span>TD</span>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                {/* Online emerald dot */}
                <span
                  className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-3 border-white shadow-xs"
                  title="En ligne sur le réseau"
                />
              </div>

              {/* Name & Title */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-dm-ink tracking-tight">
                    Thomas D.
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-dm-primary-soft text-dm-primary-deep text-xs font-bold tracking-tight">
                    Opérateur Carrières &amp; Granulats
                  </span>
                </div>
                <div className="text-xs text-dm-muted">
                  @thomas.carrieres • Rejoint en Septembre 2026 • Carrière de Bellignies
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-dm-muted font-medium">
                  <span className="flex items-center gap-1 text-dm-ink font-semibold">
                    <GraduationCap className="w-3.5 h-3.5 text-dm-primary" /> 3 formations inscrites
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-dm-ink font-semibold">
                    <Award className="w-3.5 h-3.5 text-emerald-600" /> 2 certificats scellés
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-dm-ink font-semibold">
                    <HardHat className="w-3.5 h-3.5 text-amber-600" /> CACES R482 Cat. E
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
              <Link
                href="/quiz/quiz-granulats-01"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-dm-primary text-white hover:bg-dm-primary-deep transition-colors shadow-xs cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Quiz Certifiant EN 933</span>
              </Link>
              <button
                type="button"
                onClick={handleShareProfile}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-dm-border bg-white hover:bg-dm-surface text-dm-ink transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-dm-muted" />
                <span>Partager mon dossier</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Essential 5 LMS modules) */}
          <div className="flex items-center gap-1 border-t border-dm-border pt-2 overflow-x-auto no-scrollbar">
            {[
              { id: "courses", label: "Mes Formations (3)", icon: <GraduationCap className="w-4 h-4" /> },
              { id: "certificates", label: "Certificats & Badges (2)", icon: <Award className="w-4 h-4" /> },
              { id: "documents", label: "Documents & Fiches Mémo (4)", icon: <FileText className="w-4 h-4" /> },
              { id: "photos", label: "Schémas & Plans d'Exploitation (5)", icon: <ImageIcon className="w-4 h-4" /> },
              { id: "profile", label: "Dossier Apprenant & CACES", icon: <User className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? "bg-dm-primary text-white shadow-2xs"
                      : "text-dm-muted hover:text-dm-ink hover:bg-dm-surface"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout (Left Widgets + Right Content Tab) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4/12 on large screens): Profile Progress & Regulatory Reminders */}
        <div className="lg:col-span-4 space-y-6">
          {/* Widget: "Compléter votre profil" with circular 73% gauge */}
          <div className="bg-white rounded-2xl border border-dm-border p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-dm-ink">
                Compléter votre profil &amp; CACES
              </h3>
              <span className="text-[11px] font-bold text-dm-primary">
                73%
              </span>
            </div>

            {/* Circular Progress Gauge */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-dm-surface border border-dm-border/60">
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-dm-border"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-dm-primary transition-all duration-1000 ease-out"
                    strokeDasharray="73, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-dm-ink">
                  73%
                </div>
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-dm-ink">
                  Dossier réglementaire
                </div>
                <div className="text-[11px] text-dm-muted leading-tight">
                  Validez vos habilitations professionnelles pour les accès réglementaires sur site.
                </div>
              </div>
            </div>

            {/* Steps Checklist */}
            <div className="space-y-2">
              {profileTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    const updated = profileTasks.map((item) =>
                      item.id === t.id ? { ...item, done: !item.done } : item
                    );
                    setProfileTasks(updated);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-dm-border/70 hover:bg-dm-surface transition-colors cursor-pointer text-xs group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                        t.done
                          ? "bg-emerald-500 text-white"
                          : "border-2 border-dm-border group-hover:border-dm-primary"
                      }`}
                    >
                      {t.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className={`truncate font-medium ${t.done ? "line-through text-dm-muted" : "text-dm-ink"}`}>
                      {t.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-dm-muted px-1.5 py-0.5 rounded bg-dm-surface border border-dm-border/60 shrink-0">
                    {t.progress}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className="w-full py-2 text-xs font-semibold text-dm-primary hover:text-dm-primary-deep text-center block transition-colors cursor-pointer"
            >
              Consulter mon dossier professionnel &amp; CACES →
            </button>
          </div>

          {/* Widget: "Rappels & Échéances Réglementaires" */}
          <div className="bg-white rounded-2xl border border-dm-border p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-dm-primary" />
                <h3 className="font-bold text-sm text-dm-ink">
                  Rappels Réglementaires
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                À jour
              </span>
            </div>

            <div className="space-y-2.5">
              {MOCK_REGULATORY_REMINDERS.map((rem) => (
                <div
                  key={rem.id}
                  className="p-3 rounded-xl border border-dm-border/80 hover:border-dm-primary/40 bg-dm-surface/50 hover:bg-dm-surface transition-colors space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-dm-ink text-[12px] truncate">
                      {rem.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                        rem.variant === "emerald"
                          ? "bg-emerald-100 text-emerald-800"
                          : rem.variant === "blue"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {rem.badge}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-dm-muted">
                    {rem.date}
                  </div>
                  <p className="text-[11px] text-dm-muted leading-relaxed">
                    {rem.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Widget: Synchronous Session Callout */}
          <div className="bg-gradient-to-br from-dm-primary-deep to-slate-900 rounded-2xl p-5 text-white shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                ATELIER DIRECT HD
              </span>
            </div>
            <h4 className="font-bold text-sm leading-snug">
              Session Pratique : Concasseurs &amp; Réglages Granulométriques
            </h4>
            <p className="text-[11px] text-cyan-100/80 leading-relaxed">
              Animation par Marc V. en direct avec l&apos;équipe de la Carrière de Bellignies.
            </p>
            <Link
              href="/live/session-concasseur-01"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-dm-primary-deep font-bold text-xs hover:bg-cyan-50 transition-colors shadow-xs"
            >
              <Video className="w-3.5 h-3.5 text-dm-primary" />
              <span>Rejoindre la classe virtuelle</span>
            </Link>
          </div>
        </div>

        {/* Right Column (8/12 on large screens): Selected Tab Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: MES FORMATIONS (Default, matches Screenshots 1, 2, 3) */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              {/* Header with Sub-filters & View Toggle */}
              <div className="bg-white rounded-2xl border border-dm-border p-4 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Sub-filter pills: [Toutes les formations] [En cours] [Terminées] [Certificats disponibles] */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                    {[
                      { id: "all", label: "Toutes mes formations (3)" },
                      { id: "in-progress", label: "En cours (1)" },
                      { id: "completed", label: "Terminées (2)" },
                      { id: "certificates", label: "Certificats (2)" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setCourseFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          courseFilter === f.id
                            ? "bg-dm-primary-soft text-dm-primary-deep"
                            : "text-dm-muted hover:text-dm-ink hover:bg-dm-surface"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Grid / List toggle */}
                  <div className="flex items-center gap-1 self-end sm:self-center border border-dm-border rounded-lg p-0.5 bg-dm-surface">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                        viewMode === "grid"
                          ? "bg-white text-dm-primary shadow-xs font-bold"
                          : "text-dm-muted hover:text-dm-ink"
                      }`}
                      title="Vue Grille"
                    >
                      <Grid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                        viewMode === "list"
                          ? "bg-white text-dm-primary shadow-xs font-bold"
                          : "text-dm-muted hover:text-dm-ink"
                      }`}
                      title="Vue Liste"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Search Bar within courses */}
                <div className="relative">
                  <Search className="w-4 h-4 text-dm-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Filtrer dans mes parcours certifiants..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-dm-border bg-dm-surface text-dm-ink placeholder:text-dm-muted focus:outline-none focus:ring-2 focus:ring-dm-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Course Cards */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                    : "space-y-4"
                }
              >
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl border border-dm-border overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
                  >
                    {/* Course Card Thumbnail */}
                    <div className={`relative h-40 w-full ${course.coverImage} p-4 flex flex-col justify-between`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                          {course.category}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            course.status === "completed"
                              ? "bg-emerald-500 text-white"
                              : course.status === "in-progress"
                              ? "bg-dm-primary text-white"
                              : "bg-slate-700 text-white"
                          }`}
                        >
                          {course.statusLabel}
                        </span>
                      </div>

                      {/* Course modules count tag */}
                      <div className="flex items-center gap-2 text-white/90 text-[11px] font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course.modulesCount} Modules • {course.lessonsCount} Leçons
                        </span>
                      </div>
                    </div>

                    {/* Course Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-bold text-sm sm:text-base text-dm-ink group-hover:text-dm-primary transition-colors line-clamp-2 leading-snug">
                          {course.title}
                        </h4>

                        {/* Instructor info */}
                        <div className="flex items-center gap-2 pt-1 text-xs text-dm-muted">
                          <div className="w-6 h-6 rounded-full bg-dm-primary-soft text-dm-primary-deep flex items-center justify-center font-bold text-[10px]">
                            {course.instructorAvatar}
                          </div>
                          <span>{course.instructorName}</span>
                          <span>•</span>
                          <span className="text-[11px] truncate">{course.instructorRole}</span>
                        </div>
                      </div>

                      {/* Progress Bar & percentage */}
                      <div className="space-y-1.5 pt-2 border-t border-dm-border/60">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-dm-muted font-medium text-[11px]">
                            Progression
                          </span>
                          <span className="font-bold text-dm-ink">
                            {course.progressPercent}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-dm-surface border border-dm-border/60 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              course.progressPercent === 100
                                ? "bg-emerald-500"
                                : "bg-dm-primary"
                            }`}
                            style={{ width: `${course.progressPercent}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-dm-muted truncate pt-0.5">
                          {course.lastStep}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center justify-between gap-2 pt-2">
                        {course.status === "in-progress" && (
                          <Link
                            href={`/learn/${course.slug}`}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dm-primary text-white font-bold text-xs hover:bg-dm-primary-deep transition-colors shadow-xs"
                          >
                            <span>Continuer la formation</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        {course.status === "completed" && (
                          <div className="flex items-center gap-2 w-full">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCertTitle(course.title);
                                setCertModalOpen(true);
                              }}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Attestation PDF</span>
                            </button>
                            <Link
                              href={`/learn/${course.slug}`}
                              className="inline-flex items-center justify-center p-2 rounded-xl border border-dm-border bg-white text-dm-ink hover:bg-dm-surface text-xs font-medium"
                              title="Réviser le parcours"
                            >
                              <Eye className="w-4 h-4 text-dm-muted" />
                            </Link>
                          </div>
                        )}

                        {course.status === "not-started" && (
                          <Link
                            href={`/learn/${course.slug}`}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-dm-border bg-white text-dm-ink font-bold text-xs hover:bg-dm-surface transition-colors"
                          >
                            <span>Démarrer le parcours</span>
                            <ArrowRight className="w-3.5 h-3.5 text-dm-muted" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CERTIFICATS & BADGES */}
          {activeTab === "certificates" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-dm-border p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-dm-ink">
                      Attestations &amp; Certifications Officielles
                    </h3>
                    <p className="text-xs text-dm-muted mt-0.5">
                      Scellés cryptographiques conformes aux exigences réglementaires QHSE Mines &amp; Carrières.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    2 Validés
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                        OPCO &amp; DREAL
                      </span>
                      <span className="text-[10px] text-dm-muted">Délivré le 18/09/2026</span>
                    </div>
                    <h4 className="font-bold text-sm text-dm-ink">
                      Exploitation des Carrières &amp; Production des Granulats EN 933
                    </h4>
                    <p className="text-[11px] text-dm-muted">
                      Validation théorique et protocoles de sécurité : Décapage, Abattage et Concassage.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCertTitle("Exploitation des Carrières & Production des Granulats EN 933");
                        setCertModalOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-dm-primary text-white font-bold text-xs hover:bg-dm-primary-deep transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger le Certificat Officiel</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                        SÉCURITÉ PYROTECHNIQUE
                      </span>
                      <span className="text-[10px] text-dm-muted">Délivré le 12/08/2026</span>
                    </div>
                    <h4 className="font-bold text-sm text-dm-ink">
                      Foration, Tirs d&apos;Abattage &amp; Sécurité Pyrotechnique
                    </h4>
                    <p className="text-[11px] text-dm-muted">
                      Validation des distances de tir et conformité RGPTM art. 24.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCertTitle("Foration, Tirs d'Abattage & Sécurité Pyrotechnique");
                        setCertModalOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger le Certificat Officiel</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* TAB 5: PROFIL COMPLET */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl border border-dm-border p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-dm-ink">
                  Dossier Professionnel &amp; Habilitations
                </h3>
                <p className="text-xs text-dm-muted">
                  Conformité aux exigences de l&apos;Arrêté Mines &amp; Carrières du 22 septembre 1994.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-dm-surface border border-dm-border space-y-2">
                  <div className="font-bold text-dm-ink flex items-center gap-1.5">
                    <HardHat className="w-4 h-4 text-dm-primary" />
                    <span>Habilitations Conducteur &amp; Matériel</span>
                  </div>
                  <ul className="space-y-1 text-dm-muted text-[11px]">
                    <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle className="w-3 h-3" /> CACES R482 Catégorie E (Tombereau articulé)
                    </li>
                    <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle className="w-3 h-3" /> CACES R482 Catégorie C1 (Chargeuse pelleteuse)
                    </li>
                    <li className="flex items-center gap-1.5 text-dm-ink">
                      <Clock className="w-3 h-3 text-amber-600" /> Habilitation Électrique H0B0 (En cours de renouvellement)
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-dm-surface border border-dm-border space-y-2">
                  <div className="font-bold text-dm-ink flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-dm-primary" />
                    <span>Aptitudes Médicales &amp; Sécurité</span>
                  </div>
                  <ul className="space-y-1 text-dm-muted text-[11px]">
                    <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle className="w-3 h-3" /> Visite médicale d&apos;aptitude : Conforme (Valide 2027)
                    </li>
                    <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle className="w-3 h-3" /> Formation Sauveteur Secouriste du Travail (SST)
                    </li>
                    <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle className="w-3 h-3" /> Évaluation acoustique &amp; port des EPI conforme
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DOCUMENTS & FICHES MÉMO */}
          {activeTab === "documents" && (
            <div className="bg-white rounded-2xl border border-dm-border p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-dm-ink">
                    Fiches Pratiques &amp; Mémos Opérationnels
                  </h3>
                  <p className="text-xs text-dm-muted">
                    Documentation technique téléchargeable pour consultation hors-ligne sur tablette de cabine.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { title: "Fiche Mémo : Géométrie des Merlons & Pistes de Carrière", format: "PDF • 2.1 Mo", code: "FM-01-MERL" },
                  { title: "Fiche Granulométrie EN 933-1 : Analyse par Tamisage", format: "PDF • 1.8 Mo", code: "FM-02-EN933" },
                  { title: "Check-list Prise de Poste : Concasseur Primaire à Mâchoires", format: "PDF • 950 Ko", code: "FM-03-CONC" },
                  { title: "Protocole de Sécurité : Banquette de Tir & Distances d'Évacuation", format: "PDF • 3.4 Mo", code: "FM-04-TIRS" },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-dm-border hover:border-dm-primary/40 bg-dm-surface flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-dm-primary-soft text-dm-primary-deep flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-dm-ink truncate">
                          {doc.title}
                        </div>
                        <div className="text-[10px] text-dm-muted">
                          {doc.code} • {doc.format}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast(`Téléchargement de "${doc.title}" démarré (PDF sécurisé)...`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dm-border bg-white text-dm-ink font-semibold text-xs hover:bg-dm-surface transition-colors cursor-pointer shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-dm-muted" />
                      <span>Télécharger</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PHOTOS & SCHÉMAS TERRAIN (HIGH-VALUE MEDIA GALLERY) */}
          {activeTab === "photos" && (
            <div className="bg-white rounded-2xl border border-dm-border p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-dm-ink flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-dm-primary" />
                    <span>Photos, Schémas &amp; Imagerie Terrain ({MOCK_SCHEMAS_MEDIA.length})</span>
                  </h3>
                  <p className="text-xs text-dm-muted mt-0.5">
                    Banque visuelle technique et pédagogique : profils géotechniques cotés, coupes de concasseurs et orthophotos drone.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shrink-0">
                  Standard RGPTM &amp; EN 933
                </span>
              </div>

              {/* Schemas Media Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {MOCK_SCHEMAS_MEDIA.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-dm-border overflow-hidden bg-white shadow-xs flex flex-col hover:border-dm-primary/50 transition-all group"
                  >
                    {/* Simulated Technical Diagram Graphic */}
                    <div className={`relative h-44 bg-gradient-to-br ${item.colorAccent} p-4 flex flex-col justify-between text-white overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                      <div className="flex items-center justify-between relative z-10">
                        <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs text-[10px] font-bold tracking-wider uppercase border border-white/20">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-white/80 font-mono">
                          {item.resolution}
                        </span>
                      </div>

                      {/* Technical visual representation */}
                      <div className="relative z-10 space-y-1">
                        <div className="text-[11px] font-mono text-cyan-200 uppercase tracking-wider">
                          DOC-REF: {item.id.toUpperCase()} • {item.date}
                        </div>
                        <div className="text-sm font-bold line-clamp-1">
                          {item.title}
                        </div>
                      </div>

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                        <button
                          type="button"
                          onClick={() => setLightboxMedia(item)}
                          className="px-4 py-2 rounded-xl bg-white text-dm-ink font-bold text-xs flex items-center gap-1.5 shadow-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Maximize2 className="w-4 h-4 text-dm-primary" />
                          <span>Examiner en grand format</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Content & Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-dm-muted">
                          <span className="font-semibold text-dm-primary">{item.category}</span>
                          <span>{item.author}</span>
                        </div>
                        <p className="text-xs text-dm-ink leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Key rule points */}
                      <div className="space-y-1 pt-2 border-t border-dm-border/60">
                        <div className="text-[10px] font-bold text-dm-muted uppercase tracking-wider">
                          Prescriptions Techniques Essentielles :
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-dm-surface border border-dm-border text-[10px] font-medium text-dm-ink"
                            >
                              ✓ {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setLightboxMedia(item)}
                          className="text-xs font-semibold text-dm-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Voir les cotations complètes</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => showToast(`Téléchargement de la planche "${item.title.slice(0, 25)}..."`)}
                          className="p-1.5 rounded-lg border border-dm-border hover:bg-dm-surface text-dm-muted hover:text-dm-ink transition-colors cursor-pointer"
                          title="Télécharger la planche haute définition"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        courseTitle={selectedCertTitle}
        recipientName="Thomas D."
      />

      {/* Media Lightbox Modal (Technical Diagrams & Schemas) */}
      {lightboxMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dm-ink/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-dm-border overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-dm-border flex items-center justify-between bg-dm-surface">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-dm-primary-soft text-dm-primary">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-dm-primary text-white text-[10px] font-bold uppercase tracking-wider">
                      {lightboxMedia.type}
                    </span>
                    <span className="text-xs text-dm-muted font-mono">
                      {lightboxMedia.id.toUpperCase()} • {lightboxMedia.resolution}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-dm-ink">
                    {lightboxMedia.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLightboxMedia(null)}
                className="p-2 rounded-xl text-dm-muted hover:text-dm-ink hover:bg-dm-border/40 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Canvas / High-Res View Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950 text-white">
              {/* Technical Graphical Canvas Container */}
              <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/60 p-6 sm:p-10 relative overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
                {/* Visual Technical Diagram Mock Elements */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-10 w-full max-w-2xl space-y-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono">
                    <Shield className="w-3.5 h-3.5" />
                    <span>PLANCHES DE RÉFÉRENCE - EXPLOITATION CARRIÈRES</span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-white">
                    {lightboxMedia.title}
                  </h4>

                  <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                    {lightboxMedia.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
                    {lightboxMedia.highlights.map((h, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs space-y-1">
                        <div className="text-[10px] font-mono text-cyan-300">PARAMÈTRE {i + 1}</div>
                        <div className="text-xs font-semibold text-white">{h}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Documentation / Legend block */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
                <div className="font-bold text-white text-xs flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Notes d&apos;application &amp; Réf. Réglementaires :</span>
                </div>
                <p className="leading-relaxed">
                  Ce document graphique sert d&apos;appui aux évaluations des compétences de l&apos;OPCO 2i et du RGPTM (Règlement Général des Industries Extractives). L&apos;application des tolérances géotechniques et cinématiques est obligatoire sur site sous la responsabilité du chef de carrière.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-dm-border bg-dm-surface flex items-center justify-between">
              <div className="text-xs text-dm-muted">
                Édité par : <strong className="text-dm-ink">{lightboxMedia.author}</strong> ({lightboxMedia.date})
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast("Planche technique exportée en PDF vectoriel !");
                    setLightboxMedia(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-dm-primary text-white font-semibold text-xs hover:bg-dm-primary-deep transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger la planche HD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-dm-ink text-white px-4 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 text-xs max-w-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 text-white/60 hover:text-white transition-colors cursor-pointer ml-auto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LearnerDashboardPage() {
  return (
    <SpaceShell space="learner" activeRoute="/dashboard">
      <Suspense fallback={<div className="p-8 text-center text-sm text-dm-muted">Chargement du tableau de bord...</div>}>
        <LearnerHubContent />
      </Suspense>
    </SpaceShell>
  );
}
