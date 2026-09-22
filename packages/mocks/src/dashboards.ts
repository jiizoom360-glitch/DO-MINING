import type { DashboardDefinition, VerticalSummary, OfferingSummary, EntitlementSummary } from '@do-mining/core';

export const mockVerticalCarrieres: VerticalSummary = {
  id: 'vert_carrieres',
  name: 'Carrières',
  status: 'ACTIVE DEMO',
  description: 'Exploitation des carrières et production de granulats',
  futureBranches: ['Forage', 'Minage', 'QHSE', 'Maintenance', 'Topographie']
};

export const mockVerticalForage: VerticalSummary = {
  id: 'vert_forage',
  name: 'Forage',
  status: 'FUTURE DEMO',
  description: 'Techniques de foration en carrières et mines',
  futureBranches: ['Minage', 'QHSE', 'Maintenance', 'Topographie']
};

export const mockOfferingGranulats: OfferingSummary = {
  id: 'off_granulats',
  title: 'Exploitation des carrières — Production des granulats',
  verticalId: 'vert_carrieres',
  status: 'ACTIVE'
};

export const mockEntitlementLearner: EntitlementSummary = {
  id: 'ent_learner_1',
  userId: 'user_1',
  offeringId: 'off_granulats',
  status: 'ACTIVE'
};

export const learnerDashboard: DashboardDefinition = {
  id: 'dash_learner_1',
  role: 'LEARNER',
  title: 'Mon Espace Apprenant',
  description: 'Tableau de bord personnel',
  vertical: mockVerticalCarrieres,
  offering: mockOfferingGranulats,
  entitlement: mockEntitlementLearner,
  sections: [
    {
      id: 'sec_current',
      title: 'Ma formation',
      layout: 'grid-3',
      widgets: [
        {
          id: 'w_progression',
          widgetType: 'PROGRESS_OVERVIEW',
          title: 'Progression Globale',
          category: 'metric',
          data: {
            value: 65,
            label: 'Exploitation des carrières',
            status: 'En cours',
            score: '14/20'
          }
        },
        {
          id: 'w_current_module',
          widgetType: 'RESUME_LEARNING',
          title: 'Module Actuel',
          category: 'action',
          data: {
            lessonTitle: 'Module 04 — Transfert',
            lessonSlug: 'module-04-transfert'
          }
        },
        {
          id: 'w_next_class',
          widgetType: 'UPCOMING_LIVES',
          title: 'Prochaine session Live',
          category: 'preview',
          data: {
            title: 'Q&A Transfert et Convoyage',
            scheduledTime: 'Demain, 14:00',
            expertName: 'Dr. Martin',
            status: 'SCHEDULED',
            sessionId: 'session_123'
          }
        }
      ]
    }
  ]
};

export const trainerDashboard: DashboardDefinition = {
  id: 'dash_trainer_1',
  role: 'TRAINER',
  title: 'Espace Formateur',
  description: 'Suivi de la cohorte et sessions',
  vertical: mockVerticalCarrieres,
  offering: mockOfferingGranulats,
  sections: [
    {
      id: 'sec_cohort',
      title: 'Aperçu Cohorte',
      layout: 'grid-3',
      widgets: [
        {
          id: 'w_learners_count',
          widgetType: 'METRIC',
          title: 'Apprenants actifs',
          category: 'metric',
          data: {
            value: 24,
            label: 'Sur 25 inscrits',
            status: 'En ligne: 4'
          }
        },
        {
          id: 'w_avg_progression',
          widgetType: 'PROGRESS_OVERVIEW',
          title: 'Progression moyenne',
          category: 'metric',
          data: {
            value: 48,
            label: 'Cohorte Alpha',
            status: 'Dans les temps'
          }
        },
        {
          id: 'w_blocking_points',
          widgetType: 'METRIC',
          title: 'Points de blocage',
          category: 'metric',
          data: {
            value: 3,
            label: 'Apprenants en difficulté',
            status: 'Nécessite intervention'
          }
        }
      ]
    },
    {
      id: 'sec_evals',
      title: 'Validations et Lives',
      layout: 'grid-2',
      widgets: [
        {
          id: 'w_pending_evals',
          widgetType: 'PENDING_ASSESSMENTS',
          title: 'Dernières évaluations',
          category: 'list',
          data: {
            items: [
              { id: '1', learner: 'Sophie M.', module: 'Module 03 — Abattage', score: '18/20', status: 'Validé' },
              { id: '2', learner: 'Thomas R.', module: 'Module 03 — Abattage', score: '11/20', status: 'Rattrapage' }
            ]
          }
        },
        {
          id: 'w_trainer_lives',
          widgetType: 'UPCOMING_LIVES',
          title: 'Mes sessions live',
          category: 'preview',
          data: {
            title: 'Q&A Transfert et Convoyage',
            scheduledTime: 'Demain, 14:00',
            expertName: 'Vous-même',
            status: 'SCHEDULED',
            sessionId: 'session_123'
          }
        }
      ]
    }
  ]
};

export const adminDashboard: DashboardDefinition = {
  id: 'dash_admin_1',
  role: 'ADMIN',
  title: 'Administration',
  description: 'Gestion du contenu et de l\'infrastructure',
  vertical: mockVerticalCarrieres,
  sections: [
    {
      id: 'sec_content',
      title: 'Content Tree',
      layout: 'grid-4',
      widgets: [
        {
          id: 'w_branches',
          widgetType: 'METRIC',
          title: 'Branches actives',
          category: 'metric',
          data: { value: 1, label: 'Carrières' }
        },
        {
          id: 'w_draft_branches',
          widgetType: 'METRIC',
          title: 'Branches en brouillon',
          category: 'metric',
          data: { value: 5, label: 'Forage, Minage...' }
        },
        {
          id: 'w_total_content',
          widgetType: 'METRIC',
          title: 'Contenus publiés',
          category: 'metric',
          data: { value: 42, label: 'Leçons et ressources' }
        },
        {
          id: 'w_simulations',
          widgetType: 'METRIC',
          title: 'Simulations',
          category: 'metric',
          data: { value: 3, label: 'Cas intégrés' }
        }
      ]
    },
    {
      id: 'sec_infra',
      title: 'Infrastructure State',
      layout: 'grid-2',
      widgets: [
        {
          id: 'w_infra_status',
          widgetType: 'SYSTEM_STATUS',
          title: 'État des services',
          category: 'system',
          data: {
            'Base de données': 'Opérationnel',
            'Stockage R2': 'Opérationnel',
            'Serveur Vidéo': 'Opérationnel',
            'API Cache': 'Opérationnel'
          }
        }
      ]
    }
  ]
};

export const auditorDashboard: DashboardDefinition = {
  id: 'dash_auditor_1',
  role: 'AUDITOR',
  title: 'Centre d\'Audit',
  description: 'Conformité et architecture',
  sections: [
    {
      id: 'sec_compliance',
      title: 'Architecture Status',
      layout: 'grid-3',
      widgets: [
        {
          id: 'w_provider_modes',
          widgetType: 'SYSTEM_STATUS',
          title: 'Provider Modes',
          category: 'system',
          data: {
            'STORAGE_MODE': 'mock',
            'INTEGRATION_MODE': 'mock',
            'LIVE_SESSION_MODE': 'manual',
            'DEPLOYMENT_MODE': 'mock'
          }
        },
        {
          id: 'w_config_gaps',
          widgetType: 'METRIC',
          title: 'Configuration Gaps',
          category: 'metric',
          data: {
            value: 0,
            label: 'Variables d\'environnement',
            status: 'Conforme'
          }
        },
        {
          id: 'w_findings',
          widgetType: 'METRIC',
          title: 'Unresolved Findings',
          category: 'metric',
          data: {
            value: 2,
            label: 'Alertes non critiques',
            status: 'Alerte mineure'
          }
        }
      ]
    },
    {
      id: 'sec_logs',
      title: 'Flux d\'événements d\'audit',
      layout: 'grid-2',
      widgets: [
        {
          id: 'w_audit_stream',
          widgetType: 'AUDIT_LOG_STREAM',
          title: 'Dernières actions système',
          category: 'list',
          colSpan: 2,
          data: {
            events: [
              { id: 'e1', type: 'CONTENT_PUBLISHED', actor: 'admin_1', entity: 'mod_03_abattage', time: 'Il y a 2h', hash: '8f43b2...' },
              { id: 'e2', type: 'USER_ENROLLED', actor: 'system', entity: 'user_42', time: 'Il y a 5h', hash: '4a19c8...' },
              { id: 'e3', type: 'CONFIG_UPDATED', actor: 'admin_2', entity: 'LIVE_SESSION_MODE', time: 'Hier', hash: '9b22e1...' }
            ]
          }
        }
      ]
    }
  ]
};
