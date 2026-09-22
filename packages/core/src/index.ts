/**
 * DO-Mining Core Domain Primitives & Types
 * Strictly provider-independent. Zero external SDK dependencies.
 */

// ---------------------------------------------------------------------------
// 1. Result & Error Primitives
// ---------------------------------------------------------------------------

export type Result<T, E = DomainError> =
  | { success: true; data: T }
  | { success: false; error: E };

export interface DomainError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function fail<E extends DomainError>(error: E): Result<never, E> {
  return { success: false, error };
}

// ---------------------------------------------------------------------------
// 2. Universal Content Tree (UCT)
// ---------------------------------------------------------------------------

export type NodeType =
  | 'DOMAIN'
  | 'BRANCH'
  | 'FORMATION'
  | 'MODULE'
  | 'SECTION'
  | 'LESSON'
  | 'ACTIVITY'
  | 'RESOURCE';

export type PublicationStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface ContentNode {
  id: string;                                // UUIDv7
  parentId: string | null;                  // Nullable pour récursivité infinie
  slug: string;                             // URL-friendly identifier
  title: string;                            // Titre affiché
  code?: string;                            // Code métier (ex: "CAR-GRA-001")
  nodeType: NodeType;                       // Sémantique du nœud
  sortOrder: number;                        // Positionnement dans la fratrie
  status: PublicationStatus;                // État de cycle de vie
  version: number;                          // Version incrémentale
  metadata: Record<string, unknown>;        // Données d'extension ouvertes
  createdAt: string;                        // ISO 8601 UTC
  updatedAt: string;                        // ISO 8601 UTC
  children?: ContentNode[];                 // Hiérarchie récursive illimitée
}

// ---------------------------------------------------------------------------
// 3. Content Revision (Decoupled Payload)
// ---------------------------------------------------------------------------

export type ContentType =
  | 'MARKDOWN'
  | 'VIDEO_STREAM'
  | 'AUDIO_GUIDE'
  | 'QUIZ_SPEC'
  | 'MANUAL_REF';


export type ContentBlockType =
  | 'rich_text'
  | 'image'
  | 'video'
  | 'audio'
  | 'file'
  | 'callout'
  | 'diagram'
  | 'quiz_embed'
  | 'live_embed'
  | 'download';

export interface ContentBlock {
  id: string;
  type: ContentBlockType | string;
  data: Record<string, unknown>;
}

export interface ContentRevision {

  id: string;                               // UUIDv7
  nodeId: string;                           // Clé étrangère vers ContentNode
  revisionNumber: number;                   // 1, 2, 3...
  contentType: ContentType;                 // Type de payload
  body?: string;                            // Markdown ou JSON sérialisé (< 500 Ko)
  storageKey?: string;                      // Clé relative R2 (ex: "videos/concasseur.mp4")
  durationMinutes?: number;                 // Estimation temporelle
  checksumSha256: string;                   // Scellement d'intégrité
  isLatest: boolean;                        // Drapeau de révision active
  createdAt: string;                        // ISO 8601 UTC
}

// ---------------------------------------------------------------------------
// 4. Learning Progression & Tracking
// ---------------------------------------------------------------------------

export type NodeProgressStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'LOCKED';

export interface UserNodeProgress {
  id: string;                               // UUIDv7
  userId: string;                           // Identifiant universel de l'apprenant
  nodeId: string;                           // Référence au nœud UCT
  status: NodeProgressStatus;               // État d'avancement
  scorePercent?: number;                    // 0 à 100 pour évaluations
  timeSpentSeconds: number;                 // Temps effectif d'apprentissage
  completedAt?: string;                     // Horodatage de complétion
  lastInteractedAt: string;                 // Dernier accès
}

// ---------------------------------------------------------------------------
// 5. Quiz & Assessment Primitives
// ---------------------------------------------------------------------------

export type QuizQuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options: QuizOption[];
  explanation?: string;
}

export interface QuizQuestionSecret extends QuizQuestion {
  correctOptionIds: string[];
}

export interface QuizSpec {
  id: string;
  title: string;
  passingScorePercent: number;              // Seuil minimal (ex: 80%)
  questions: QuizQuestion[];
}

export interface QuizAnswerSubmission {
  questionId: string;
  selectedOptionIds: string[];
}

export interface QuizAttempt {
  id: string;
  userId: string;
  nodeId: string;
  quizId: string;
  submissions: QuizAnswerSubmission[];
  scorePercent: number;
  passed: boolean;
  attemptedAt: string;
}

export interface QuizEvaluationResult {
  attemptId: string;
  scorePercent: number;
  passed: boolean;
  details: {
    questionId: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

// ---------------------------------------------------------------------------
// 6. Synchronous Live Sessions (Technical Expert)
// ---------------------------------------------------------------------------

export type LiveSessionStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'ENDED'
  | 'CANCELLED';

export interface LiveSession {
  id: string;
  nodeId: string;
  hostUserId: string;
  title: string;
  description?: string;
  scheduledStartTime: string;
  durationMinutes: number;
  status: LiveSessionStatus;
  roomIdentifier: string;
  roomUrl?: string;
}

// ---------------------------------------------------------------------------
// 7. Commercialization Seams & Entitlements
// ---------------------------------------------------------------------------

export type OfferingType =
  | 'SUBSCRIPTION_PASS'
  | 'PER_SEAT_LICENSE'
  | 'ENTERPRISE_CUSTOM';

export interface CatalogOffering {
  id: string;
  sku: string;
  title: string;
  targetNodeId: string;
  offeringType: OfferingType;
  isActive: boolean;
}

export interface UserEntitlement {
  id: string;
  userId: string;
  offeringId: string;
  grantedNodeId: string;
  validFrom: string;
  validUntil?: string;
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// 8. Configurable Dashboard Profiles & Roles
// ---------------------------------------------------------------------------

export type DashboardRole = 'LEARNER' | 'TRAINER' | 'ADMIN' | 'AUDITOR';

export type WidgetType =
  | 'RESUME_LEARNING'
  | 'PROGRESS_OVERVIEW'
  | 'UPCOMING_LIVES'
  | 'PENDING_ASSESSMENTS'
  | 'COHORT_TRACKER'
  | 'CONTENT_TREE_EXPLORER'
  | 'AUDIT_LOG_STREAM'
  | 'CERTIFICATE_VAULT';

export interface DashboardWidgetConfig {
  id: string;
  widgetType: WidgetType;
  title: string;
  sortOrder: number;
  colSpan: 1 | 2 | 3 | 4;
  requiredPermissions: string[];
  settings?: Record<string, unknown>;
}

export interface DashboardProfile {
  id: string;
  role: DashboardRole;
  title: string;
  widgets: DashboardWidgetConfig[];
  isDefault: boolean;
}

export interface VerticalSummary {
  id: string;
  name: string;
  status: string;
  description?: string;
  futureBranches?: string[];
}

export interface OfferingSummary {
  id: string;
  title: string;
  verticalId: string;
  status: string;
}

export interface EntitlementSummary {
  id: string;
  userId: string;
  offeringId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
}

export interface DashboardWidgetDefinition {
  id: string;
  widgetType: WidgetType | string;
  title: string;
  description?: string;
  colSpan?: 1 | 2 | 3 | 4;
  category?: 'metric' | 'list' | 'action' | 'preview' | 'system' | 'summary';
  data?: Record<string, unknown>;
}

export interface DashboardSection {
  id: string;
  title: string;
  description?: string;
  layout: 'grid-2' | 'grid-3' | 'grid-4' | 'bento';
  widgets: DashboardWidgetDefinition[];
}

export interface DashboardDefinition {
  id: string;
  role: DashboardRole;
  title: string;
  description?: string;
  vertical?: VerticalSummary;
  offering?: OfferingSummary;
  entitlement?: EntitlementSummary;
  sections: DashboardSection[];
}

// ---------------------------------------------------------------------------
// 9. Immutable Audit Event
// ---------------------------------------------------------------------------

export interface AuditEvent {
  id: string;
  eventType: string;
  actorUserId: string;
  targetEntityId: string;
  targetEntityType: string;
  payloadHashSha256: string;
  payload: Record<string, unknown>;
  timestamp: string;
}
