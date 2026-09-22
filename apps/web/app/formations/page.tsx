"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Badge, Button } from "@do-mining/ui";
import {
  Pickaxe,
  Clock,
  CheckCircle2,
  ArrowRight,
  Shield,
  Activity,
  Search,
  Settings,
  Layers,
  Bell,
  X,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface CourseOffering {
  slug: string;
  code: string;
  title: string;
  branch: string;
  level: "Débutant & Curieux" | "Technicien & Opérateur" | "Spécialiste & Boutefeu" | "Tous niveaux";
  category: "exploitation" | "securite" | "technique";
  duration?: string;
  status: "DISPONIBLE" | "COMING_SOON";
  summary: string;
  prerequisites: string;
  highlights?: string[];
  icon: React.ReactNode;
}

const COURSES_CATALOG: CourseOffering[] = [
  {
    slug: "production-des-granulats",
    code: "PARCOURS-01",
    title: "Exploitation des carrières : De la roche brute aux granulats normalisés",
    branch: "Carrières & Matériaux",
    level: "Débutant & Curieux",
    category: "exploitation",
    duration: "25 heures de cours interactif",
    status: "DISPONIBLE",
    icon: <Pickaxe className="w-5 h-5 text-dm-primary" />,
    summary:
      "Le parcours de référence pour comprendre le cycle complet d'une carrière : découverte des sols fertiles, tirs de mine sécurisés, concassage géant, tamisage au millimètre et respect de l'environnement.",
    prerequisites: "Aucun prérequis technique nécessaire. Adapté aux néophytes comme aux professionnels en reconversion.",
    highlights: [
      "Comprendre la physique des concasseurs à mâchoires et giratoires",
      "Sécurité des fronts : calcul des banquettes et merlons d'arrêt",
      "Contrôle qualité en laboratoire selon la norme européenne EN 933",
      "Évaluation finale avec attestation de réussite DO-Mining",
    ],
  },
  {
    slug: "forage-et-foration",
    code: "PARCOURS-02",
    title: "Techniques de Foration en Front de Taille & Implantation",
    branch: "Forage & Sondage",
    level: "Technicien & Opérateur",
    category: "technique",
    status: "COMING_SOON",
    icon: <Search className="w-5 h-5 text-dm-muted" />,
    summary:
      "Apprenez à concevoir la maille de foration géométrique, implanter les trous au laser et piloter les sondeuses fond de trou sans déviation.",
    prerequisites: "Notions de base en géométrie ou topographie de chantier.",
  },
  {
    slug: "minage-et-explosifs",
    code: "PARCOURS-03",
    title: "Plan de Tir, Fragmentation & Sécurité Pyrotechnique",
    branch: "Minage Civil",
    level: "Spécialiste & Boutefeu",
    category: "technique",
    status: "COMING_SOON",
    icon: <Activity className="w-5 h-5 text-dm-muted" />,
    summary:
      "Maîtrisez le chargement des explosifs civils (émulsions, nitrate-fioul), les lignes de tir électroniques et la gestion des vibrations pour le voisinage.",
    prerequisites: "Réservé aux professionnels de la filière extractive.",
  },
  {
    slug: "qhse-securite-fosse",
    code: "PARCOURS-04",
    title: "Sécurité en Fosse, Circulation des Engins & Réglementation",
    branch: "Sécurité & QHSE",
    level: "Tous niveaux",
    category: "securite",
    status: "COMING_SOON",
    icon: <Shield className="w-5 h-5 text-dm-muted" />,
    summary:
      "Les règles vitales pour protéger les personnes et le matériel : angles morts des dumpers 60t, entretien des pistes, prévention des chutes de blocs et protocole d'urgence.",
    prerequisites: "Accessible à tous les intervenants sur site d'extraction.",
  },
  {
    slug: "maintenance-installations",
    code: "PARCOURS-05",
    title: "Maintenance Préventive des Installations de Concassage",
    branch: "Maintenance Industrielle",
    level: "Technicien & Opérateur",
    category: "technique",
    status: "COMING_SOON",
    icon: <Settings className="w-5 h-5 text-dm-muted" />,
    summary:
      "Diagnostic d'usure des toiles de crible, remplacement des blindages de concasseurs, alignement des convoyeurs à bande et lubrification automatique.",
    prerequisites: "Notions de base en mécanique industrielle.",
  },
  {
    slug: "topographie-mines",
    code: "PARCOURS-06",
    title: "Topographie Numérique & Modélisation 3D par Drone",
    branch: "Topographie & Géologie",
    level: "Technicien & Opérateur",
    category: "exploitation",
    status: "COMING_SOON",
    icon: <Layers className="w-5 h-5 text-dm-muted" />,
    summary:
      "Survol par drone photogrammétrique, calcul automatique des volumes de stériles et de matériaux extraits, et suivi de la stabilité des fronts.",
    prerequisites: "Aisance avec l'outil informatique et la cartographie.",
  },
];

export default function FormationsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "debutant" | "technique" | "securite">("all");
  const [alertModalCourse, setAlertModalCourse] = useState<CourseOffering | null>(null);
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSubmitted, setAlertSubmitted] = useState(false);

  const filteredCourses = COURSES_CATALOG.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFilter === "all") return true;
    if (selectedFilter === "debutant") return c.level === "Débutant & Curieux" || c.level === "Tous niveaux";
    if (selectedFilter === "technique") return c.category === "technique";
    if (selectedFilter === "securite") return c.category === "securite";
    return true;
  });

  const handleSubscribeAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail.trim()) return;
    setAlertSubmitted(true);
    setTimeout(() => {
      setAlertSubmitted(false);
      setAlertModalCourse(null);
      setAlertEmail("");
    }, 2500);
  };

  return (
    <SpaceShell space="public" activeRoute="/formations">
      <PageHeader
        title="Catalogue des Formations Spécialisées"
        description="Explorez des modules conçus par des ingénieurs de carrière et pédagogues : du premier pas pour les curieux aux compétences avancées de terrain."
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Formations", isCurrent: true },
        ]}
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-dm-white p-3 rounded-xl border border-dm-border/80 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilter === "all"
                ? "bg-dm-primary-soft text-dm-primary-deep font-semibold"
                : "text-dm-muted hover:text-dm-ink hover:bg-dm-surface"
            }`}
          >
            Toutes les filières ({COURSES_CATALOG.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("debutant")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilter === "debutant"
                ? "bg-dm-primary-soft text-dm-primary-deep font-semibold"
                : "text-dm-muted hover:text-dm-ink hover:bg-dm-surface"
            }`}
          >
            Accessibles Débutants
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("technique")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilter === "technique"
                ? "bg-dm-primary-soft text-dm-primary-deep font-semibold"
                : "text-dm-muted hover:text-dm-ink hover:bg-dm-surface"
            }`}
          >
            Technique &amp; Machines
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("securite")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilter === "securite"
                ? "bg-dm-primary-soft text-dm-primary-deep font-semibold"
                : "text-dm-muted hover:text-dm-ink hover:bg-dm-surface"
            }`}
          >
            Sécurité &amp; QHSE
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-dm-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une notion, un engin..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-dm-surface border border-dm-border rounded-lg text-dm-ink placeholder:text-dm-muted focus:outline-none focus:border-dm-primary transition-colors"
          />
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {filteredCourses.map((course) => {
          const isAvailable = course.status === "DISPONIBLE";

          return (
            <article
              key={course.slug}
              className={`rounded-2xl border transition-all p-5 sm:p-6 bg-dm-white ${
                isAvailable
                  ? "border-dm-primary/40 shadow-xs ring-1 ring-dm-primary/10"
                  : "border-dm-border/80 opacity-95"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-dm-surface border border-dm-border/80 text-dm-primary shrink-0">
                      {course.icon}
                    </div>
                    <Badge variant={isAvailable ? "success" : "neutral"} size="sm" dot={isAvailable}>
                      {isAvailable ? "Formation Active & Certifiante" : "En cours de production"}
                    </Badge>
                    <span className="text-[11px] font-semibold text-dm-primary-deep bg-dm-primary-soft px-2 py-0.5 rounded">
                      {course.level}
                    </span>
                    <span className="text-[11px] text-dm-muted font-mono ml-auto lg:ml-0">
                      {course.code}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-dm-ink tracking-tight break-words">
                      {course.title}
                    </h3>
                    <p className="text-xs text-dm-muted mt-0.5">
                      Filière : <span className="font-semibold text-dm-ink/80">{course.branch}</span>
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-dm-muted leading-relaxed max-w-3xl">
                    {course.summary}
                  </p>

                  <div className="p-2.5 rounded-lg bg-dm-surface border border-dm-border/70 text-[11px] text-dm-ink/80 flex items-start gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-dm-primary shrink-0 mt-0.5" />
                    <span><strong className="text-dm-ink">Prérequis :</strong> {course.prerequisites}</span>
                  </div>

                  {isAvailable && course.highlights && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {course.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-dm-ink/90">
                          <CheckCircle2 className="w-3.5 h-3.5 text-dm-primary shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action Column */}
                <div className="lg:w-60 shrink-0 flex flex-col justify-between gap-3 pt-4 lg:pt-0 lg:border-l lg:border-dm-border/70 lg:pl-6">
                  {isAvailable ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-dm-surface rounded-xl border border-dm-border/80 space-y-1 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-dm-ink">
                          <Clock className="w-3.5 h-3.5 text-dm-primary" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="text-[10px] text-dm-muted">
                          Accès immédiat • Rythme libre
                        </div>
                      </div>

                      <Link href={`/formations/${course.slug}`} className="block">
                        <Button
                          variant="primary"
                          size="md"
                          className="w-full justify-center"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Voir le programme
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="p-3 bg-dm-surface/60 rounded-xl border border-dm-border/70 text-center space-y-1">
                        <span className="text-xs font-semibold text-dm-muted">
                          Ouverture prochaine
                        </span>
                        <p className="text-[11px] text-dm-muted/80">
                          Tournages sur site et rédaction des fiches par nos formateurs.
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center"
                        leftIcon={<Bell className="w-3.5 h-3.5 text-dm-primary" />}
                        onClick={() => {
                          setAlertModalCourse(course);
                          setAlertSubmitted(false);
                        }}
                      >
                        M&apos;avertir à l&apos;ouverture
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 bg-dm-white rounded-xl border border-dm-border p-6 space-y-3">
            <p className="text-sm font-semibold text-dm-ink">
              Aucun parcours ne correspond à votre recherche &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-dm-muted">
              Essayez un autre mot-clé (ex: granulats, sécurité, crible) ou réinitialisez les filtres.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Alert Notification Modal */}
      {alertModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dm-ink/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-dm-white rounded-2xl border border-dm-border shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-dm-border pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-dm-primary tracking-wider">
                  Alerte Disponibilité
                </span>
                <h3 className="text-sm font-bold text-dm-ink mt-0.5">
                  {alertModalCourse.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAlertModalCourse(null)}
                className="p-1 rounded text-dm-muted hover:text-dm-ink hover:bg-dm-surface cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {alertSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-dm-ink">
                  Alerte confirmée !
                </div>
                <p className="text-xs text-dm-muted">
                  Vous recevrez un email dès l&apos;ouverture des inscriptions pour la filière {alertModalCourse.branch}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribeAlert} className="space-y-3">
                <p className="text-xs text-dm-muted leading-relaxed">
                  Laissez votre adresse pour être prévenu en avant-première et recevoir un guide de découverte gratuit sur cette filière.
                </p>
                <div>
                  <label className="block text-[11px] font-semibold text-dm-ink mb-1">
                    Votre adresse email professionnelle ou personnelle
                  </label>
                  <input
                    type="email"
                    required
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    placeholder="exemple@carriere.fr"
                    className="w-full px-3 py-2 text-xs bg-dm-surface border border-dm-border rounded-lg text-dm-ink focus:outline-none focus:border-dm-primary"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAlertModalCourse(null)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Enregistrer mon alerte
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </SpaceShell>
  );
}
