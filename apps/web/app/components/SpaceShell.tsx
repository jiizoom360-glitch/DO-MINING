"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AppShell,
  Badge,
  DemoModeBanner,
  getNavigationSections,
  SPACES,
  ALL_SPACES,
  type NavigationSpace,
} from "@do-mining/ui";
import {
  Pickaxe,
  ChevronDown,
  User,
  GraduationCap,
  Sparkles,
  Search,
  Bell,
  Folder,
  Image as ImageIcon,
  CheckCircle,
  Video,
  Award,
  BookOpen,
  Settings,
  X,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export interface SpaceShellProps {
  space: NavigationSpace;
  activeRoute: string;
  children: React.ReactNode;
}

const USER_MOCK_PROFILES: Record<
  NavigationSpace,
  { name: string; roleDesc: string }
> = {
  public: { name: "Visiteur public", roleDesc: "Non authentifié" },
  learner: { name: "Thomas D.", roleDesc: "Apprenant — Granulats" },
  trainer: { name: "Marc V.", roleDesc: "Expert référent Mines" },
  admin: { name: "Admin DO-Mining", roleDesc: "Gouvernance & Sécurité" },
  auditor: { name: "Auditeur DREAL", roleDesc: "Contrôle & Conformité" },
};

export function SpaceShell({ space, activeRoute, children }: SpaceShellProps) {
  const [spaceMenuOpen, setSpaceMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentSpaceMeta = SPACES[space];
  const userProfile = USER_MOCK_PROFILES[space];

  // Simplified MVP LMS Navigation: Laser-focused on training, certifications & resources
  const learnerNavSections = [
    {
      title: "Mon Parcours Formation",
      items: [
        {
          id: "lrn-courses",
          label: "Mes Formations",
          icon: <GraduationCap className="w-4 h-4" />,
          href: "/dashboard?tab=courses",
          badge: "3",
          isActive: activeRoute.startsWith("/learn") || (activeRoute === "/dashboard" && !activeRoute.includes("tab=")),
        },
        {
          id: "lrn-progress",
          label: "Matrice de Progression",
          icon: <Award className="w-4 h-4" />,
          href: "/progress",
          isActive: activeRoute === "/progress",
        },
        {
          id: "lrn-profile",
          label: "Mon Dossier Apprenant",
          icon: <User className="w-4 h-4" />,
          href: "/dashboard?tab=profile",
          isActive: activeRoute === "/dashboard",
        },
      ],
    },
    {
      title: "Ressources & Guides Métier",
      items: [
        {
          id: "lrn-documents",
          label: "Documents & Fiches Mémo",
          icon: <Folder className="w-4 h-4" />,
          href: "/dashboard?tab=documents",
          badge: "4",
        },
        {
          id: "lrn-photos",
          label: "Schémas Techniques & Plans",
          icon: <ImageIcon className="w-4 h-4" />,
          href: "/dashboard?tab=photos",
          badge: "5",
        },
        {
          id: "lrn-certificates",
          label: "Certificats & Badges",
          icon: <CheckCircle className="w-4 h-4" />,
          href: "/dashboard?tab=certificates",
          badge: "2",
        },
      ],
    },
    {
      title: "Évaluations & Sessions",
      items: [
        {
          id: "lrn-quiz",
          label: "Quiz Certifiant EN 933",
          icon: <CheckCircle className="w-4 h-4" />,
          href: "/quiz/quiz-granulats-01",
          badge: "80% requis",
          isActive: activeRoute.startsWith("/quiz"),
        },
        {
          id: "lrn-live",
          label: "Atelier Direct Jitsi",
          icon: <Video className="w-4 h-4" />,
          href: "/live/session-concasseur-01",
          badge: "Direct",
          isActive: activeRoute.startsWith("/live"),
        },
      ],
    },
  ];

  const resolvedSections = space === "learner" ? learnerNavSections : getNavigationSections(space, activeRoute);

  return (
    <div className="min-h-screen bg-dm-surface flex flex-col font-sans text-dm-ink">
      {/* 1. Global Alert Banner */}
      <DemoModeBanner currentSpace={space} />

      {/* 2. Main App Shell */}
      <AppShell
        brand={
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-dm-primary flex items-center justify-center text-dm-white shadow-xs">
              <Pickaxe className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-dm-ink group-hover:text-dm-primary transition-colors">
                DO-Mining
              </div>
              <div className="text-[10px] text-dm-muted font-mono uppercase tracking-wider">
                Mines &amp; Carrières
              </div>
            </div>
          </Link>
        }
        topbarTitle={
          <div className="hidden lg:flex items-center gap-1 xl:gap-3 text-xs font-semibold">
            <Link
              href="/dashboard?tab=courses"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeRoute === "/dashboard" || activeRoute.startsWith("/learn")
                  ? "text-dm-primary-deep bg-dm-primary-soft font-bold"
                  : "text-dm-muted hover:text-dm-ink hover:bg-dm-surface"
              }`}
            >
              Mes Formations
            </Link>
            <Link
              href="/formations"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeRoute.startsWith("/formations")
                  ? "text-dm-primary-deep bg-dm-primary-soft font-bold"
                  : "text-dm-muted hover:text-dm-ink hover:bg-dm-surface"
              }`}
            >
              Catalogue
            </Link>
            <Link
              href="/quiz/quiz-granulats-01"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeRoute.startsWith("/quiz")
                  ? "text-dm-primary-deep bg-dm-primary-soft font-bold"
                  : "text-dm-muted hover:text-dm-ink hover:bg-dm-surface"
              }`}
            >
              Quiz Certifiant
            </Link>
            <Link
              href="/live/session-concasseur-01"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeRoute.startsWith("/live")
                  ? "text-dm-primary-deep bg-dm-primary-soft font-bold"
                  : "text-dm-muted hover:text-dm-ink hover:bg-dm-surface"
              }`}
            >
              Atelier Direct
            </Link>
            <Link
              href="/progress"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeRoute === "/progress"
                  ? "text-dm-primary-deep bg-dm-primary-soft font-bold"
                  : "text-dm-muted hover:text-dm-ink hover:bg-dm-surface"
              }`}
            >
              Progression
            </Link>
          </div>
        }
        topbarActions={
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-dm-muted hover:text-dm-ink hover:bg-dm-surface transition-colors cursor-pointer"
              title="Rechercher (cours, documents, fiches)"
              aria-label="Recherche"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications Bell with unread badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-dm-muted hover:text-dm-ink hover:bg-dm-surface transition-colors relative cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-dm-accent text-dm-ink text-[9px] font-bold flex items-center justify-center shadow-xs">
                  8
                </span>
              </button>

              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-dm-border shadow-xl z-50 p-2 text-xs divide-y divide-dm-border/60">
                    <div className="p-2 flex items-center justify-between font-bold text-dm-ink">
                      <span>Notifications (8)</span>
                      <span className="text-[10px] text-dm-primary cursor-pointer hover:underline">
                        Tout marquer comme lu
                      </span>
                    </div>
                    <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                      <div className="p-2 rounded-lg bg-dm-surface hover:bg-dm-primary-soft/40 transition-colors">
                        <div className="font-semibold text-dm-ink">
                          Quiz Granulats EN 933 validé
                        </div>
                        <div className="text-[11px] text-dm-muted">
                          Votre score de 100% a été scellé et votre certificat est disponible.
                        </div>
                        <div className="text-[10px] text-dm-primary font-medium mt-1">
                          Il y a 1 heure
                        </div>
                      </div>
                      <div className="p-2 rounded-lg hover:bg-dm-surface transition-colors">
                        <div className="font-semibold text-dm-ink">
                          Nouvelle fiche disponible
                        </div>
                        <div className="text-[11px] text-dm-muted">
                          Fiche technique : &quot;Réglage concasseur à mâchoires&quot;.
                        </div>
                        <div className="text-[10px] text-dm-muted mt-1">Hier à 16:30</div>
                      </div>
                      <div className="p-2 rounded-lg hover:bg-dm-surface transition-colors">
                        <div className="font-semibold text-dm-ink">
                          Rappel : Session direct
                        </div>
                        <div className="text-[11px] text-dm-muted">
                          Atelier Jitsi synchrone le jeudi à 14h00.
                        </div>
                        <div className="text-[10px] text-dm-muted mt-1">Il y a 2 jours</div>
                      </div>
                    </div>
                    <div className="p-2 text-center">
                      <Link
                        href="/dashboard?tab=courses"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-[11px] font-semibold text-dm-primary hover:underline"
                      >
                        Accéder à mes formations →
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Current Space Switcher Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSpaceMenuOpen(!spaceMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-dm-border bg-white hover:bg-dm-surface transition-colors cursor-pointer shadow-2xs"
                aria-expanded={spaceMenuOpen}
                aria-haspopup="true"
              >
                <Badge variant={currentSpaceMeta.badgeVariant} size="sm">
                  {currentSpaceMeta.badgeLabel}
                </Badge>
                <ChevronDown className="w-3.5 h-3.5 text-dm-muted" />
              </button>

              {/* Space Switcher Dropdown */}
              {spaceMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSpaceMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-dm-border shadow-xl z-50 p-2 text-xs">
                    <div className="px-2.5 py-1 text-[11px] font-semibold text-dm-muted uppercase tracking-wider border-b border-dm-border/60 mb-1">
                      Basculer d&apos;espace UI
                    </div>
                    {ALL_SPACES.map((s) => (
                      <Link
                        key={s.id}
                        href={s.rootPath}
                        onClick={() => setSpaceMenuOpen(false)}
                        className={`flex items-start gap-2.5 p-2 rounded-lg transition-colors ${
                          s.id === space
                            ? "bg-dm-primary-soft text-dm-primary-deep font-semibold"
                            : "hover:bg-dm-surface text-dm-ink"
                        }`}
                      >
                        <Badge
                          variant={s.badgeVariant}
                          size="sm"
                          className="mt-0.5 shrink-0"
                        >
                          {s.badgeLabel}
                        </Badge>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs leading-none">
                            {s.label}
                          </div>
                          <div className="text-[11px] text-dm-muted truncate mt-0.5">
                            {s.tagline}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Simulated User Profile Tag with photo */}
            <Link
              href="/dashboard?tab=profile"
              className="flex items-center gap-2 pl-2 border-l border-dm-border hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-dm-primary to-dm-primary-deep text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {userProfile.name.charAt(0)}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <div className="font-bold text-dm-ink">
                  {userProfile.name}
                </div>
                <div className="text-[10px] text-dm-muted truncate max-w-[110px]">
                  {userProfile.roleDesc}
                </div>
              </div>
            </Link>

            {/* Direct Link to Design System */}
            <Link
              href="/design-system"
              className="hidden xl:inline-flex items-center gap-1 text-[11px] text-dm-muted hover:text-dm-primary px-2 py-1 rounded-md border border-transparent hover:border-dm-border"
              title="Inspecter le Design System DO-Mining"
            >
              <Sparkles className="w-3 h-3 text-dm-primary" />
              <span>Tokens UI</span>
            </Link>
          </div>
        }
        navigationSections={resolvedSections}
        sidebarFooter={
          <div className="p-3 bg-dm-surface rounded-xl border border-dm-border/70 space-y-1 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-dm-ink">
                DO-Mining LMS
              </span>
              <span className="text-dm-primary font-bold text-[10px] uppercase tracking-wider">
                Édition 2026
              </span>
            </div>
            <div className="text-[11px] text-dm-muted leading-relaxed">
              Parcours certifiants, fiches opérationnelles &amp; simulations.
            </div>
          </div>
        }
      >
        <div className="w-full max-w-7xl mx-auto space-y-6">{children}</div>
      </AppShell>

      {/* Quick Search Dialog */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-dm-ink/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-dm-border overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-dm-border">
              <Search className="w-5 h-5 text-dm-muted" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une formation, une fiche technique, un collègue..."
                className="w-full text-sm bg-transparent border-none focus:outline-none text-dm-ink placeholder:text-dm-muted"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-md text-dm-muted hover:text-dm-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto space-y-2 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold text-dm-muted uppercase tracking-wider">
                Formations populaires
              </div>
              <Link
                href="/learn/carrieres-et-granulats"
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-dm-surface text-dm-ink group"
              >
                <div>
                  <div className="font-semibold group-hover:text-dm-primary">
                    Exploitation des Carrières &amp; Production des Granulats EN 933
                  </div>
                  <div className="text-dm-muted text-[11px]">3 Modules • 12 Leçons • Actif</div>
                </div>
                <ArrowRight className="w-4 h-4 text-dm-muted group-hover:text-dm-primary" />
              </Link>
              <Link
                href="/dashboard?tab=courses"
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-dm-surface text-dm-ink group"
              >
                <div>
                  <div className="font-semibold group-hover:text-dm-primary">
                    Foration, Tirs d&apos;Abattage &amp; Sécurité Pyrotechnique
                  </div>
                  <div className="text-dm-muted text-[11px]">Certifié 100% • 6 Leçons</div>
                </div>
                <ArrowRight className="w-4 h-4 text-dm-muted group-hover:text-dm-primary" />
              </Link>
              <div className="px-2 pt-2 py-1 text-[10px] font-bold text-dm-muted uppercase tracking-wider">
                Fiches Mémo
              </div>
              <Link
                href="/dashboard?tab=documents"
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-dm-surface text-dm-ink group"
              >
                <div className="font-semibold">
                  Fiche Technique : Profils des Merlons &amp; Banquettes de sécurité
                </div>
                <span className="text-[10px] text-dm-primary font-medium">PDF 2.4 Mo</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
