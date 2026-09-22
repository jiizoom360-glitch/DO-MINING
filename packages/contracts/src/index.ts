/**
 * DO-Mining Integration Ports & Contracts
 * Pure TypeScript interfaces & typed domain error primitives.
 * Strictly provider-independent. Zero external SDK imports.
 */

import type {
  ContentNode,
  ContentRevision,
  UserNodeProgress,
  LiveSession,
  LiveSessionStatus,
  AuditEvent,
  QuizSpec,
  QuizAttempt,
  QuizEvaluationResult,
  Result,
  DashboardProfile,
  DashboardRole,
} from '@do-mining/core';

// ---------------------------------------------------------------------------
// 0. Common Provider Errors & Execution Modes
// ---------------------------------------------------------------------------

export type ProviderMode = 'mock' | 'manual' | 'real';

export class ProviderUnavailableError extends Error {
  readonly code = 'PROVIDER_UNAVAILABLE';
  constructor(
    message = 'Provider service is currently unavailable',
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ProviderUnavailableError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ProviderConfigurationError extends Error {
  readonly code = 'PROVIDER_CONFIGURATION_ERROR';
  constructor(
    message = 'Invalid or missing provider configuration',
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ProviderConfigurationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ResourceNotFoundError extends Error {
  readonly code = 'RESOURCE_NOT_FOUND';
  constructor(
    message = 'Requested resource was not found in provider',
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ResourceNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnsupportedOperationError extends Error {
  readonly code = 'UNSUPPORTED_OPERATION';
  constructor(
    message = 'Operation is unsupported or provider integration is in un-implemented real mode',
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'UnsupportedOperationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class PermissionDeniedError extends Error {
  readonly code = 'PERMISSION_DENIED';
  constructor(
    message = 'Access denied: insufficient permissions',
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'PermissionDeniedError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export type ProviderError =
  | ProviderUnavailableError
  | ProviderConfigurationError
  | ResourceNotFoundError
  | UnsupportedOperationError
  | PermissionDeniedError;

export function normalizeProviderMode(input?: string): ProviderMode {
  if (!input) return 'mock';
  const lower = input.toLowerCase().trim();
  if (lower === 'real') return 'real';
  if (lower === 'manual') return 'manual';
  return 'mock';
}

// ---------------------------------------------------------------------------
// 1. Storage Port (Object Storage Abstraction)
// ---------------------------------------------------------------------------

export interface StoragePutOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  maxSizeBytes?: number;
}

export interface StorageObjectMetadata {
  key: string;
  sizeBytes?: number;
  contentType?: string;
  lastModified?: string;
  etag?: string;
  metadata?: Record<string, string>;
}

export interface StorageAccessUrlOptions {
  expiresInSeconds?: number;
  download?: boolean;
}

export interface StorageGetObjectResult {
  data: Uint8Array | string;
  metadata: StorageObjectMetadata;
}

// Backwards-compatible legacy types
export interface SignedUrlRequest {
  storageKey: string;
  expiresInSeconds?: number;
}

export interface PresignedUploadRequest {
  storageKey: string;
  contentType: string;
  maxSizeBytes?: number;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  storageKey: string;
  expiresAt: string;
}

export interface StoragePort {
  readonly mode?: ProviderMode;

  /**
   * Conceptually uploads or stores an object by key
   */
  put(
    key: string,
    data: Uint8Array | string,
    options?: StoragePutOptions
  ): Promise<Result<StorageObjectMetadata>>;

  /**
   * Conceptually retrieves an object and its metadata by key
   */
  get(key: string): Promise<Result<StorageGetObjectResult>>;

  /**
   * Conceptually deletes an object by key
   */
  delete(key: string): Promise<Result<void>>;

  /**
   * Generates or returns an access URL for reading or downloading an object
   */
  getAccessUrl(
    key: string,
    options?: StorageAccessUrlOptions
  ): Promise<Result<string>>;

  /**
   * Verifies existence and retrieves object metadata without downloading body
   */
  head(key: string): Promise<Result<StorageObjectMetadata | null>>;

  // Legacy convenience signatures
  getSignedDownloadUrl?(request: SignedUrlRequest): Promise<Result<string>>;
  getUploadPresignedUrl?(request: PresignedUploadRequest): Promise<Result<PresignedUploadResponse>>;
  verifyAssetExistence?(storageKey: string): Promise<Result<boolean>>;
  deleteAsset?(storageKey: string): Promise<Result<void>>;
}

// ---------------------------------------------------------------------------
// 2. Live Session Port (Synchronous Video & Audio Collaboration)
// ---------------------------------------------------------------------------

export interface ScheduleLiveSessionRequest {
  nodeId: string;
  hostUserId: string;
  title: string;
  scheduledStartTime: string;
  durationMinutes: number;
  description?: string;
}

export interface JoinInfoRequest {
  sessionId: string;
  userId: string;
  userName: string;
  role: 'host' | 'learner';
}

export interface LiveSessionJoinInfo {
  sessionId: string;
  roomIdentifier: string;
  roomUrl: string;
  token?: string;
  role: 'host' | 'learner';
  expiresAt?: string;
}

export interface LiveSessionStatusInfo {
  sessionId: string;
  status: LiveSessionStatus;
  participantCount?: number;
  scheduledStartTime?: string;
  startedAt?: string;
  endedAt?: string;
}

// Backwards-compatible legacy types
export interface CreateRoomRequest {
  nodeId: string;
  hostUserId: string;
  title: string;
  scheduledStartTime: string;
  durationMinutes: number;
}

export interface RoomTokenRequest {
  roomIdentifier: string;
  userId: string;
  userName: string;
  isHost: boolean;
}

export interface LiveSessionPort {
  readonly mode?: ProviderMode;

  /**
   * Schedules a synchronous expert session
   */
  schedule(request: ScheduleLiveSessionRequest): Promise<Result<LiveSession>>;

  /**
   * Retrieves participant join credentials, room URL, and optional token
   */
  getJoinInfo(request: JoinInfoRequest): Promise<Result<LiveSessionJoinInfo>>;

  /**
   * Queries real-time status and telemetry for an active or scheduled session
   */
  getStatus(sessionId: string): Promise<Result<LiveSessionStatusInfo>>;

  // Legacy convenience signatures
  createRoom?(request: CreateRoomRequest): Promise<Result<LiveSession>>;
  generateHostToken?(request: RoomTokenRequest): Promise<Result<string>>;
  generateLearnerToken?(request: RoomTokenRequest): Promise<Result<string>>;
  closeRoom?(roomIdentifier: string): Promise<Result<void>>;
}

// ---------------------------------------------------------------------------
// 3. Deployment Port (Deployment Pipeline Simulation)
// ---------------------------------------------------------------------------

export type DeploymentEnvironment = 'development' | 'staging' | 'production';

export type DeploymentState = 'IDLE' | 'QUEUED' | 'BUILDING' | 'DEPLOYED' | 'FAILED';

export interface DeploymentStatus {
  id: string;
  environment: DeploymentEnvironment;
  state: DeploymentState;
  url?: string;
  commitSha?: string;
  deployedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface DeploymentPort {
  readonly mode?: ProviderMode;

  /**
   * Retrieves current deployment pipeline status for simulation and monitoring
   */
  getStatus(deploymentId?: string): Promise<Result<DeploymentStatus>>;
}

// ---------------------------------------------------------------------------
// 4. Repository Port (Version Control & Content Repository Status)
// ---------------------------------------------------------------------------

export type RepositorySyncStatus = 'SYNCED' | 'BEHIND' | 'AHEAD' | 'DIVERGED' | 'UNKNOWN';

export interface RepositoryStatus {
  name: string;
  branch: string;
  latestCommitSha: string;
  lastSyncTime: string;
  status: RepositorySyncStatus;
  cleanWorkingTree: boolean;
  metadata?: Record<string, unknown>;
}

export interface RepositoryPort {
  readonly mode?: ProviderMode;

  /**
   * Retrieves current branch, commit hash, and sync state abstraction
   */
  getStatus(): Promise<Result<RepositoryStatus>>;
}

// ---------------------------------------------------------------------------
// 5. DNS Port (Domain Name System Configuration & Status)
// ---------------------------------------------------------------------------

export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX';

export interface DnsRecordConfig {
  name: string;
  type: DnsRecordType;
  value: string;
  ttl?: number;
}

export interface DnsConfig {
  domain: string;
  records: DnsRecordConfig[];
  nameservers?: string[];
}

export type DnsPropagationStatus = 'ACTIVE' | 'PENDING' | 'ERROR';

export interface DnsStatus {
  domain: string;
  status: DnsPropagationStatus;
  propagated: boolean;
  lastCheckedAt: string;
  details?: Record<string, unknown>;
}

export interface DnsPort {
  readonly mode?: ProviderMode;

  /**
   * Retrieves domain propagation and resolution status
   */
  getStatus(domain?: string): Promise<Result<DnsStatus>>;

  /**
   * Retrieves active DNS configuration records and zone setup
   */
  getConfig(domain?: string): Promise<Result<DnsConfig>>;
}

// ---------------------------------------------------------------------------
// 6. Notification Port (Transactional Messaging)
// ---------------------------------------------------------------------------

export type NotificationChannel = 'EMAIL' | 'SMS' | 'PUSH';

export interface NotificationPayload {
  recipient: string;
  subject: string;
  body: string;
  channel?: NotificationChannel;
  templateId?: string;
  variables?: Record<string, unknown>;
}

export interface NotificationResult {
  messageId: string;
  sentAt: string;
  status: 'QUEUED' | 'SENT' | 'FAILED';
}

export interface NotificationPort {
  readonly mode?: ProviderMode;

  /**
   * Dispatches a notification across the configured channel
   */
  send(payload: NotificationPayload): Promise<Result<NotificationResult>>;
}

// Legacy Email Notification Alias
export interface TransactionalEmailRequest {
  to: string;
  subject: string;
  templateId: string;
  variables: Record<string, unknown>;
}

export interface EmailNotificationPort {
  sendTransactionalEmail(request: TransactionalEmailRequest): Promise<Result<{ messageId: string }>>;
}

// ---------------------------------------------------------------------------
// 7. Version Control Audit Port (Audit Trail Commits)
// ---------------------------------------------------------------------------

export interface AuditCommitRequest {
  revisionId: string;
  nodeCode: string;
  payloadJson: string;
  authorEmail: string;
  commitMessage: string;
}

export interface VersionControlPort {
  publishContentAuditCommit(request: AuditCommitRequest): Promise<Result<{ commitSha: string }>>;
  fetchAuditHistory(nodeCode: string): Promise<Result<Array<{ commitSha: string; timestamp: string; message: string }>>>;
}

// ---------------------------------------------------------------------------
// 8. Immutable Audit Logger Port
// ---------------------------------------------------------------------------

export interface AuditLoggerPort {
  recordEvent(event: Omit<AuditEvent, 'id' | 'payloadHashSha256' | 'timestamp'>): Promise<Result<AuditEvent>>;
  queryAuditTrail(filters: {
    actorUserId?: string;
    targetEntityId?: string;
    fromTimestamp?: string;
    limit?: number;
  }): Promise<Result<AuditEvent[]>>;
}

// ---------------------------------------------------------------------------
// 9. Content Repository Port (Universal Content Tree)
// ---------------------------------------------------------------------------

export interface ContentTreeQuery {
  rootNodeId?: string;
  depth?: number;
  includeRevisions?: boolean;
}

export interface ContentRepositoryPort {
  getNodeById(id: string): Promise<Result<ContentNode | null>>;
  getNodeBySlug(slug: string): Promise<Result<ContentNode | null>>;
  getChildren(parentId: string | null): Promise<Result<ContentNode[]>>;
  getTree(query?: ContentTreeQuery): Promise<Result<ContentNode[]>>;
  getLatestRevision(nodeId: string): Promise<Result<ContentRevision | null>>;
  getQuizSpec(nodeId: string): Promise<Result<QuizSpec | null>>;
}

// ---------------------------------------------------------------------------
// 10. Progress Tracker Port
// ---------------------------------------------------------------------------

export interface ProgressUpdateCommand {
  userId: string;
  nodeId: string;
  timeSpentSecondsDelta: number;
  markCompleted?: boolean;
}

export interface ProgressTrackerPort {
  getProgress(userId: string, nodeId: string): Promise<Result<UserNodeProgress | null>>;
  getAllProgressForUser(userId: string): Promise<Result<UserNodeProgress[]>>;
  updateProgress(command: ProgressUpdateCommand): Promise<Result<UserNodeProgress>>;
  evaluateQuiz(
    userId: string,
    nodeId: string,
    answers: { questionId: string; selectedOptionIds: string[] }[]
  ): Promise<Result<QuizEvaluationResult>>;
}

// ---------------------------------------------------------------------------
// 11. Dashboard Profile Port
// ---------------------------------------------------------------------------

export interface DashboardProfilePort {
  getProfileForRole(role: DashboardRole): Promise<Result<DashboardProfile>>;
}

// ---------------------------------------------------------------------------
// 12. Simulation Scenarios & Dynamic Infrastructure Simulation
// ---------------------------------------------------------------------------

export type GeneralSimulationScenario =
  | 'SUCCESS'
  | 'NOT_CONFIGURED'
  | 'UNAVAILABLE'
  | 'NOT_FOUND'
  | 'LATENCY'
  | 'PERMISSION_DENIED';

export type LiveSimulationScenario =
  | GeneralSimulationScenario
  | 'SCHEDULED'
  | 'LIVE'
  | 'ENDED'
  | 'CANCELLED';

export type StorageSimulationScenario =
  | GeneralSimulationScenario
  | 'AVAILABLE'
  | 'MISSING_OBJECT'
  | 'UPLOAD_FAILURE'
  | 'READ_FAILURE';

export type DeploymentSimulationScenario =
  | GeneralSimulationScenario
  | 'BUILDING'
  | 'DEPLOYED'
  | 'FAILED';

export type RepositorySimulationScenario =
  | GeneralSimulationScenario
  | 'SYNCED'
  | 'BEHIND'
  | 'DIVERGED';

export type DnsSimulationScenario =
  | GeneralSimulationScenario
  | 'PROPAGATED'
  | 'PENDING_PROPAGATION'
  | 'DNS_ERROR';

export type SimulationScenario =
  | GeneralSimulationScenario
  | LiveSimulationScenario
  | StorageSimulationScenario
  | DeploymentSimulationScenario
  | RepositorySimulationScenario
  | DnsSimulationScenario;

export interface SimulationScenarioOptions {
  latencyMs?: number;
  customErrorMessage?: string;
  metadata?: Record<string, unknown>;
}

export type SimulatedServiceType =
  | 'storage'
  | 'live'
  | 'deployment'
  | 'repository'
  | 'dns'
  | 'notification';

export interface SimulationConfigRecord {
  serviceId: SimulatedServiceType;
  activeScenario: SimulationScenario;
  options?: SimulationScenarioOptions;
  updatedAt: string;
}

/**
 * Interface preparing future persistence from PostgreSQL (e.g. Drizzle ORM in Phase 2+)
 */
export interface SimulationScenarioRepository {
  getScenario(serviceId: SimulatedServiceType): Promise<Result<SimulationConfigRecord | null>>;
  saveScenario(record: SimulationConfigRecord): Promise<Result<void>>;
  listScenarios(): Promise<Result<SimulationConfigRecord[]>>;
}

