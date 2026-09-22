# DO-MINING — MODÈLE DE DOMAINE & MÉTADONNÉES RÉCURSIVES

**Statut :** FIGÉ (FROZEN)  
**Date :** 2026-09-15  
**Version :** 1.0.0-phase0  

---

## 1. L'UNIVERSAL CONTENT TREE (UCT)

L'Universal Content Tree est le cœur géométrique de DO-Mining. Il évite le piège des schémas rigides (`domains -> courses -> chapters -> lessons`) qui empêchent de modéliser la diversité des formations techniques de terrain.

### Structure Conceptuelle de l'Entité `ContentNode`

```typescript
export type NodeType =
  | 'DOMAIN'        // Ex: Mines & Carrières
  | 'PROGRAM'       // Ex: Exploitation des carrières à ciel ouvert
  | 'COURSE'        // Ex: Production et caractérisation des granulats
  | 'MODULE'        // Ex: Concassage et Criblage primaire
  | 'SECTION'       // Ex: Réglage des concasseurs à mâchoires
  | 'LESSON'        // Ex: Analyse granulométrique et ratios de réduction
  | 'ACTIVITY'      // Ex: Exercice pratique de calcul de débit
  | 'ASSESSMENT'    // Ex: Évaluation certifiante sécurité concassage
  | 'RESOURCE'      // Ex: Fiche technique constructeur (PDF / R2)
  | 'LIVE_SESSION'; // Ex: Masterclass synchrone avec un ingénieur minier

export type NodeStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type NodeVisibility = 'PUBLIC' | 'AUTHENTICATED' | 'RESTRICTED' | 'INTERNAL';

export interface ContentNode {
  id: string;                       // UUIDv7 immuable
  parentId: string | null;          // Référence récursive vers le parent
  nodeType: NodeType;               // Type sémantique
  title: string;                    // Titre technique
  slug: string;                     // URL segment unique dans le scope du parent
  description: string | null;       // Résumé pédagogique
  status: NodeStatus;               // Cycle de publication
  sortOrder: number;                // Ordre d'affichage au sein du parent
  visibility: NodeVisibility;       // Règles de découverte
  metadata: Record<string, unknown>;// Données extensibles (normes NF/ISO, tags métiers)
  settings: ContentNodeSettings;    // Comportements spécifiques (déblocage séquentiel, etc.)
  createdAt: string;                // ISO8601 UTC
  updatedAt: string;                // ISO8601 UTC
  archivedAt: string | null;        // Horodatage de soft-archive (jamais de hard-delete sur publié)
}

export interface ContentNodeSettings {
  isPacingRequired?: boolean;       // Obligation de valider l'étape précédente
  passingGradePercent?: number;     // Seuil de réussite minimal si nœud évaluatif
  estimatedDurationMinutes?: number;// Durée théorique estimée
  certificateEligible?: boolean;    // Contribue au certificat officiel
}
```

---

## 2. MODÈLE DU CORPS DE CONTENU DÉCOUPLÉ (`ContentRevision`)

Pour préserver la légèreté de l'arbre et garantir la traçabilité des modifications pédagogiques, le contenu textuel et multimédia est séparé du nœud :

```typescript
export interface ContentRevision {
  id: string;                   // UUIDv7
  nodeId: string;               // Lien vers ContentNode.id
  versionNumber: number;        // Incrémental (1, 2, 3...)
  contentFormat: 'MARKDOWN' | 'INTERACTIVE_HTML' | 'STRUCTURED_JSON';
  bodyText: string | null;      // Corps textuel (aucun blob binaire ici)
  mediaAssetRef: string | null; // Clé d'objet R2 (ex: "granulats/m03/criblage-hd.mp4")
  changelogSummary: string;     // Motif de révision
  authorId: string;             // UUID de l'expert rédacteur
  publishedAt: string | null;   // Null si brouillon de révision
}
```

---

## 3. MODÈLE DE PROGRESSION & ÉTATS D'APPRENTISSAGE (`LearningState`)

L'état d'un apprenant sur un nœud quelconque de l'arbre est autonome et découplé :

```typescript
export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED';

export interface UserNodeProgress {
  id: string;                   // UUIDv7
  userId: string;               // UUID de l'apprenant
  nodeId: string;               // UUID du ContentNode
  status: ProgressStatus;       // Statut de complétion
  progressPercent: number;      // 0 à 100
  timeSpentSeconds: number;     // Temps effectif d'étude engagé
  lastAccessedAt: string;       // ISO8601
  completedAt: string | null;   // Horodatage de fin
}
```

---

## 4. MODÈLE DES DROITS COMMERCIAUX & OFFRES DÉCOUPLÉES

Une branche d'enseignement (ou un sous-nœud) est monétisable de manière totalement unitaire :

```typescript
export interface CatalogOffering {
  id: string;                   // UUIDv7
  title: string;                // Nom commercial (ex: "Pack Opérateur Granulats")
  rootNodeId: string;           // Pointeur vers le sous-arbre accordé
  sku: string;                  // Identifiant commercial (ex: "DO-GRANULATS-PRO-2026")
  isActive: boolean;
  metadata: Record<string, unknown>;
}

export interface UserEntitlement {
  id: string;                   // UUIDv7
  userId: string;               // Bénéficiaire
  offeringId: string;           // Référence de l'offre
  grantedRootNodeId: string;    // Nœud à partir duquel l'accès en cascade est ouvert
  startsAt: string;
  expiresAt: string | null;     // Accès perpétuel ou licence temporaire
  isActive: boolean;
}
```

---

## 5. MODÈLE DES DASHBOARDS CONFIGURABLES (`DashboardProfile`)

Les espaces Apprenant, Formateur, Administrateur et Auditeur partagent le même backend et sont rendus dynamiques via des profils configurables composés de widgets pilotés par permissions :

```typescript
export type DashboardRole = 'LEARNER' | 'TRAINER' | 'ADMIN' | 'AUDITOR';

export type WidgetType =
  | 'RESUME_LEARNING'       // Carte de reprise immédiate du dernier module
  | 'PROGRESS_OVERVIEW'     // Statistiques de complétion et temps passé
  | 'UPCOMING_LIVES'        // Prochaines sessions synchrones avec le technicien expert
  | 'PENDING_ASSESSMENTS'   // Évaluations à passer ou à corriger
  | 'COHORT_TRACKER'        // Suivi global de la promotion pour formateur
  | 'CONTENT_TREE_EXPLORER' // Navigateur de gestion UCT pour administrateur
  | 'AUDIT_LOG_STREAM'      // Journal immuable des complétions pour auditeur
  | 'CERTIFICATE_VAULT';    // Attestations officielles délivrées

export interface DashboardWidgetConfig {
  id: string;                       // Identifiant du widget
  widgetType: WidgetType;           // Type de composant
  title: string;                    // Titre affiché
  sortOrder: number;                // Position dans la grille
  colSpan: 1 | 2 | 3 | 4;           // Largeur responsive
  requiredPermissions: string[];    // Permissions RBAC requises
  settings?: Record<string, unknown>; // Options d'affichage
}

export interface DashboardProfile {
  id: string;                       // UUIDv7
  role: DashboardRole;              // Rôle cible
  title: string;                    // Titre du profil (ex: "Tableau de bord Opérateur")
  widgets: DashboardWidgetConfig[]; // Liste ordonnée des widgets
  isDefault: boolean;               // Profil par défaut du rôle
}
```

---

## 6. DÉMONSTRATION D'INSTANCIATION MÉTIER (CARRIÈRES & GRANULATS)

Le premier vertical réel s'instancie naturellement dans cette structure :

- **Nœud 1 :** `nodeType: 'DOMAIN'`, `title: "Mines & Carrières"`, `parentId: null`
  - **Nœud 2 :** `nodeType: 'PROGRAM'`, `title: "Exploitation des carrières"`, `parentId: 1`
    - **Nœud 3 :** `nodeType: 'COURSE'`, `title: "Production des granulats"`, `parentId: 2`
      - **Nœud 4 :** `nodeType: 'MODULE'`, `title: "Décapage et Découverte"`, `parentId: 3`
      - **Nœud 5 :** `nodeType: 'MODULE'`, `title: "Extraction & Abattage"`, `parentId: 3`
      - **Nœud 6 :** `nodeType: 'MODULE'`, `title: "Transfert et Roulage des matériaux"`, `parentId: 3`
      - **Nœud 7 :** `nodeType: 'MODULE'`, `title: "Traitement primaire : Concassage"`, `parentId: 3`
      - **Nœud 8 :** `nodeType: 'MODULE'`, `title: "Classification & Criblage"`, `parentId: 3`
      - **Nœud 9 :** `nodeType: 'MODULE'`, `title: "Lavage et Traitement des boues"`, `parentId: 3`
      - **Nœud 10 :** `nodeType: 'MODULE'`, `title: "Stockage, Reprise et Expédition"`, `parentId: 3`
      - **Nœud 11 :** `nodeType: 'ASSESSMENT'`, `title: "Examen de Maîtrise Granulats & Qualité NF P 18-545"`, `parentId: 3`
      - **Nœud 12 :** `nodeType: 'LIVE_SESSION'`, `title: "Session Débriefing avec l'Ingénieur Carrière"`, `parentId: 3`
