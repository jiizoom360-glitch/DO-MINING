import type { SidebarSection } from './components/Sidebar.js';

export type NavigationSpace = 'public' | 'learner' | 'trainer' | 'admin' | 'auditor';

export interface SpaceDefinition {
  id: NavigationSpace;
  label: string;
  badgeLabel: string;
  badgeVariant: 'primary' | 'neutral' | 'accent' | 'success' | 'warning' | 'outline';
  rootPath: string;
  tagline: string;
  noticeText: string;
}

export const SPACES: Record<NavigationSpace, SpaceDefinition> = {
  public: {
    id: 'public',
    label: 'Portail Public',
    badgeLabel: 'PUBLIC',
    badgeVariant: 'neutral',
    rootPath: '/',
    tagline: 'Formations professionnelles Mines & Carrières',
    noticeText: 'Portail public ouvert — Consultation du catalogue et des fiches de formation.',
  },
  learner: {
    id: 'learner',
    label: 'Espace Apprenant',
    badgeLabel: 'APPRENANT',
    badgeVariant: 'primary',
    rootPath: '/dashboard',
    tagline: 'Parcours certifiants & Fiches opérationnelles',
    noticeText: 'Mode Démonstration : Shell apprenant sans vérification de session (Auth/RBAC non actif à cette étape).',
  },
  trainer: {
    id: 'trainer',
    label: 'Espace Formateur',
    badgeLabel: 'FORMATEUR',
    badgeVariant: 'accent',
    rootPath: '/trainer',
    tagline: 'Supervision pédagogique & Validation des quiz',
    noticeText: 'Mode Démonstration : Shell formateur simulé — Les évaluations et présences sont fictives.',
  },
  admin: {
    id: 'admin',
    label: 'Console Administrateur',
    badgeLabel: 'ADMIN',
    badgeVariant: 'warning',
    rootPath: '/admin',
    tagline: 'Arbre UCT récursif & Gouvernance de la plateforme',
    noticeText: 'Mode Démonstration : Shell admin ouvert à des fins de prototypage. Ne constitue pas un contrôle de sécurité réel.',
  },
  auditor: {
    id: 'auditor',
    label: 'Espace Auditeur',
    badgeLabel: 'AUDITEUR',
    badgeVariant: 'outline',
    rootPath: '/audit',
    tagline: 'Contrôle réglementaire, SHA-256 & Preuves QHSE',
    noticeText: 'Mode Démonstration : Console d’audit en lecture seule simulant les vérifications de conformité et scellés cryptographiques.',
  },
};

export const ALL_SPACES: SpaceDefinition[] = Object.values(SPACES);

export function getNavigationSections(
  space: NavigationSpace,
  activeRoute: string = ''
): SidebarSection[] {
  switch (space) {
    case 'public':
      return [
        {
          title: 'Navigation Publique',
          items: [
            {
              id: 'pub-home',
              label: 'Accueil & Présentation',
              href: '/',
              isActive: activeRoute === '/',
            },
            {
              id: 'pub-catalog',
              label: 'Catalogue des Formations',
              href: '/formations',
              isActive: activeRoute.startsWith('/formations'),
              badge: '3 Parcours',
            },
            {
              id: 'pub-sample',
              label: 'Détail : Granulats EN 933',
              href: '/formations/production-des-granulats',
              isActive: activeRoute === '/formations/production-des-granulats',
            },
          ],
        },
        {
          title: 'Espaces Métiers (Prototypage)',
          items: [
            {
              id: 'switch-learner',
              label: 'Accès Apprenant',
              href: '/dashboard',
            },
            {
              id: 'switch-trainer',
              label: 'Accès Formateur',
              href: '/trainer',
            },
            {
              id: 'switch-admin',
              label: 'Accès Admin',
              href: '/admin',
            },
            {
              id: 'switch-auditor',
              label: 'Accès Auditeur',
              href: '/audit',
            },
          ],
        },
      ];

    case 'learner':
      return [
        {
          title: 'Mon Espace d’Étude',
          items: [
            {
              id: 'lrn-dash',
              label: 'Tableau de bord',
              href: '/dashboard',
              isActive: activeRoute === '/dashboard',
            },
            {
              id: 'lrn-course',
              label: 'Parcours Granulats',
              href: '/learn/carrieres-et-granulats',
              isActive: activeRoute === '/learn/carrieres-et-granulats',
              badge: 'Actif',
            },
            {
              id: 'lrn-module',
              label: 'Module 1 : Chaîne opératoire',
              href: '/learn/carrieres-et-granulats/chaine-operatoire',
              isActive: activeRoute === '/learn/carrieres-et-granulats/chaine-operatoire',
            },
            {
              id: 'lrn-lesson',
              label: 'Étape 1 : Décapage des terrains',
              href: '/learn/carrieres-et-granulats/chaine-operatoire/decapage',
              isActive: activeRoute.startsWith('/learn/carrieres-et-granulats/chaine-operatoire/decapage'),
            },
          ],
        },
        {
          title: 'Évaluations & Sessions',
          items: [
            {
              id: 'lrn-quiz',
              label: 'Quiz Certifiant EN 933',
              href: '/quiz/quiz-granulats-01',
              isActive: activeRoute.startsWith('/quiz'),
              badge: '80% requis',
            },
            {
              id: 'lrn-live',
              label: 'Session Expert Direct (Jitsi)',
              href: '/live/session-concasseur-01',
              isActive: activeRoute.startsWith('/live'),
              badge: 'Synchrone',
            },
            {
              id: 'lrn-progress',
              label: 'Matrice de Progression',
              href: '/progress',
              isActive: activeRoute === '/progress',
            },
          ],
        },
      ];

    case 'trainer':
      return [
        {
          title: 'Supervision Pédagogique',
          items: [
            {
              id: 'trn-home',
              label: 'Tableau de Bord Formateur',
              href: '/trainer',
              isActive: activeRoute === '/trainer',
            },
            {
              id: 'trn-learners',
              label: 'Suivi des Apprenants',
              href: '/trainer/learners',
              isActive: activeRoute === '/trainer/learners',
              badge: '24 inscrits',
            },
            {
              id: 'trn-reviews',
              label: 'Revues des Évaluations',
              href: '/trainer/reviews',
              isActive: activeRoute === '/trainer/reviews',
              badge: '5 en attente',
            },
            {
              id: 'trn-live',
              label: 'Animation des Sessions Live',
              href: '/trainer/live',
              isActive: activeRoute === '/trainer/live',
            },
          ],
        },
      ];

    case 'admin':
      return [
        {
          title: 'Gouvernance Plateforme',
          items: [
            {
              id: 'adm-home',
              label: 'Tableau de Bord Admin',
              href: '/admin',
              isActive: activeRoute === '/admin',
            },
            {
              id: 'adm-system-model',
              label: 'Modèle Système UCT',
              href: '/admin/system-model',
              isActive: activeRoute === '/admin/system-model',
              badge: 'Récursif',
            },
            {
              id: 'adm-content',
              label: 'Gestion des Contenus',
              href: '/admin/content',
              isActive: activeRoute === '/admin/content',
            },
            {
              id: 'adm-users',
              label: 'Utilisateurs & Profils',
              href: '/admin/users',
              isActive: activeRoute === '/admin/users',
              badge: '42 comptes',
            },
            {
              id: 'adm-rules',
              label: 'Règles d’Accès & RBAC',
              href: '/admin/rules',
              isActive: activeRoute === '/admin/rules',
            },
            {
              id: 'adm-simulations',
              label: 'Simulateurs d’Infrastructure',
              href: '/admin/simulations',
              isActive: activeRoute === '/admin/simulations',
              badge: 'MOCK/MANUAL',
            },
            {
              id: 'adm-audit',
              label: 'Journaux d’Audit Admin',
              href: '/admin/audit',
              isActive: activeRoute === '/admin/audit',
            },
          ],
        },
      ];

    case 'auditor':
      return [
        {
          title: 'Conformité & Intégrité',
          items: [
            {
              id: 'aud-home',
              label: 'Vue d’Ensemble Audit',
              href: '/audit',
              isActive: activeRoute === '/audit',
            },
            {
              id: 'aud-system',
              label: 'Intégrité Système & Hashes',
              href: '/audit/system',
              isActive: activeRoute === '/audit/system',
              badge: 'SHA-256',
            },
            {
              id: 'aud-content',
              label: 'Audit des Contenus',
              href: '/audit/content',
              isActive: activeRoute === '/audit/content',
            },
            {
              id: 'aud-integrations',
              label: 'Audit des Intégrations Ports',
              href: '/audit/integrations',
              isActive: activeRoute === '/audit/integrations',
            },
          ],
        },
      ];
  }
}
