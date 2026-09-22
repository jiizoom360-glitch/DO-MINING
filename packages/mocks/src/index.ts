import { learnerDashboard, trainerDashboard, adminDashboard, auditorDashboard } from './dashboards.js';
/**
 * DO-Mining Mock & Manual Adapters
 * Strictly depends on @do-mining/core and @do-mining/contracts. Zero external APIs.
 */

import type {
  ContentNode,
  ContentRevision,
  UserNodeProgress,
  LiveSession,
  LiveSessionStatus,
  AuditEvent,
  QuizSpec,
  QuizEvaluationResult,
  Result,
  DashboardProfile,
  DashboardRole,
  DashboardDefinition,
} from '@do-mining/core';
import { ok, fail } from '@do-mining/core';
import type {
  ProviderMode,
  StoragePort,
  StoragePutOptions,
  StorageObjectMetadata,
  StorageAccessUrlOptions,
  StorageGetObjectResult,
  SignedUrlRequest,
  PresignedUploadRequest,
  PresignedUploadResponse,
  LiveSessionPort,
  ScheduleLiveSessionRequest,
  JoinInfoRequest,
  LiveSessionJoinInfo,
  LiveSessionStatusInfo,
  CreateRoomRequest,
  RoomTokenRequest,
  DeploymentPort,
  DeploymentStatus,
  DeploymentEnvironment,
  DeploymentState,
  RepositoryPort,
  RepositoryStatus,
  RepositorySyncStatus,
  DnsPort,
  DnsStatus,
  DnsConfig,
  NotificationPort,
  NotificationPayload,
  NotificationResult,
  EmailNotificationPort,
  TransactionalEmailRequest,
  VersionControlPort,
  AuditCommitRequest,
  AuditLoggerPort,
  ContentRepositoryPort,
  ContentTreeQuery,
  ProgressTrackerPort,
  ProgressUpdateCommand,
  DashboardProfilePort,
  SimulationScenario,
  GeneralSimulationScenario,
  LiveSimulationScenario,
  StorageSimulationScenario,
  DeploymentSimulationScenario,
  RepositorySimulationScenario,
  DnsSimulationScenario,
  SimulationScenarioOptions,
  SimulationConfigRecord,
  SimulationScenarioRepository,
  SimulatedServiceType,
} from '@do-mining/contracts';
import {
  ProviderUnavailableError,
  ProviderConfigurationError,
  ResourceNotFoundError,
  UnsupportedOperationError,
  PermissionDeniedError,
} from '@do-mining/contracts';

// Helper for deterministic latency simulation
async function applySimulationDelay(options?: SimulationScenarioOptions): Promise<void> {
  const ms = options?.latencyMs ?? 300;
  if (ms > 0) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ---------------------------------------------------------------------------
// 1. Storage Adapters (Object Storage Abstraction)
// ---------------------------------------------------------------------------

export class MockStorageAdapter implements StoragePort {
  readonly mode: ProviderMode = 'mock';
  private scenario: StorageSimulationScenario = 'AVAILABLE';
  private scenarioOptions?: SimulationScenarioOptions;
  private memoryStore: Map<string, { data: Uint8Array | string; metadata: StorageObjectMetadata }> = new Map();

  constructor(initialScenario: StorageSimulationScenario = 'AVAILABLE', options?: SimulationScenarioOptions) {
    this.scenario = initialScenario;
    this.scenarioOptions = options;
  }

  setScenario(scenario: StorageSimulationScenario, options?: SimulationScenarioOptions): void {
    this.scenario = scenario;
    this.scenarioOptions = options;
  }

  getScenario(): StorageSimulationScenario {
    return this.scenario;
  }

  getScenarioOptions(): SimulationScenarioOptions | undefined {
    return this.scenarioOptions;
  }

  private async checkPreconditions(): Promise<Result<void> | null> {
    if (this.scenario === 'LATENCY' || (this.scenarioOptions?.latencyMs && this.scenarioOptions.latencyMs > 0)) {
      await applySimulationDelay(this.scenarioOptions);
    }
    if (this.scenario === 'UNAVAILABLE') {
      return fail(new ProviderUnavailableError(this.scenarioOptions?.customErrorMessage || 'Object storage service is currently unavailable'));
    }
    if (this.scenario === 'NOT_CONFIGURED') {
      return fail(new ProviderConfigurationError(this.scenarioOptions?.customErrorMessage || 'Storage bucket credentials and region endpoint are not configured'));
    }
    if (this.scenario === 'PERMISSION_DENIED') {
      return fail(new PermissionDeniedError(this.scenarioOptions?.customErrorMessage || 'Storage access denied: insufficient IAM bucket permissions'));
    }
    return null;
  }

  async put(key: string, data: Uint8Array | string, options?: StoragePutOptions): Promise<Result<StorageObjectMetadata>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    if (this.scenario === 'UPLOAD_FAILURE') {
      return fail({
        code: 'UPLOAD_FAILURE',
        message: this.scenarioOptions?.customErrorMessage || 'Storage upload chunk stream broken unexpectedly',
      });
    }

    const sizeBytes = typeof data === 'string' ? new TextEncoder().encode(data).length : data.byteLength;
    const metadata: StorageObjectMetadata = {
      key,
      sizeBytes,
      contentType: options?.contentType || 'application/octet-stream',
      lastModified: new Date().toISOString(),
      etag: `mock_etag_${Date.now()}`,
      metadata: options?.metadata,
    };
    this.memoryStore.set(key, { data, metadata });
    return ok(metadata);
  }

  async get(key: string): Promise<Result<StorageGetObjectResult>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    if (this.scenario === 'READ_FAILURE') {
      return fail({
        code: 'READ_FAILURE',
        message: this.scenarioOptions?.customErrorMessage || 'Failed to read object stream from storage bucket',
      });
    }

    if (this.scenario === 'MISSING_OBJECT' || this.scenario === 'NOT_FOUND') {
      return fail(new ResourceNotFoundError(this.scenarioOptions?.customErrorMessage || `Object with key "${key}" not found in storage`));
    }

    const item = this.memoryStore.get(key);
    if (!item) {
      return fail(new ResourceNotFoundError(`Object with key "${key}" not found in storage`));
    }
    return ok(item);
  }

  async delete(key: string): Promise<Result<void>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    this.memoryStore.delete(key);
    return ok(undefined);
  }

  async getAccessUrl(key: string, options?: StorageAccessUrlOptions): Promise<Result<string>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    if (this.scenario === 'MISSING_OBJECT' || this.scenario === 'NOT_FOUND') {
      return fail(new ResourceNotFoundError(`Object with key "${key}" does not exist in storage bucket`));
    }

    if (this.scenario === 'READ_FAILURE') {
      return fail({
        code: 'READ_FAILURE',
        message: 'Unable to issue access URL due to read failure state',
      });
    }

    return ok(`https://mock-storage.do-mining.local/download/${encodeURIComponent(key)}?token=mock_signed_${Date.now()}`);
  }

  async head(key: string): Promise<Result<StorageObjectMetadata | null>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    if (this.scenario === 'MISSING_OBJECT' || this.scenario === 'NOT_FOUND') {
      return ok(null);
    }

    const item = this.memoryStore.get(key);
    return ok(item ? item.metadata : null);
  }

  // Legacy convenience methods
  async getSignedDownloadUrl(request: SignedUrlRequest): Promise<Result<string>> {
    return this.getAccessUrl(request.storageKey, { expiresInSeconds: request.expiresInSeconds });
  }

  async getUploadPresignedUrl(request: PresignedUploadRequest): Promise<Result<PresignedUploadResponse>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    if (this.scenario === 'UPLOAD_FAILURE') {
      return fail({ code: 'UPLOAD_FAILURE', message: 'Cannot generate presigned upload URL during upload failure scenario' });
    }

    return ok({
      uploadUrl: `https://mock-storage.do-mining.local/upload/${encodeURIComponent(request.storageKey)}`,
      storageKey: request.storageKey,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    });
  }

  async verifyAssetExistence(storageKey: string): Promise<Result<boolean>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    if (this.scenario === 'MISSING_OBJECT' || this.scenario === 'NOT_FOUND') {
      return ok(false);
    }

    const item = this.memoryStore.get(storageKey);
    return ok(Boolean(item));
  }

  async deleteAsset(storageKey: string): Promise<Result<void>> {
    return this.delete(storageKey);
  }
}

export class ManualStorageAdapter implements StoragePort {
  readonly mode: ProviderMode = 'manual';
  private manualUrls: Map<string, string> = new Map();
  private manualMeta: Map<string, StorageObjectMetadata> = new Map();

  setManualUrl(storageKey: string, url: string): void {
    this.manualUrls.set(storageKey, url);
    this.manualMeta.set(storageKey, {
      key: storageKey,
      lastModified: new Date().toISOString(),
      contentType: 'application/octet-stream',
    });
  }

  async put(key: string, data: Uint8Array | string, options?: StoragePutOptions): Promise<Result<StorageObjectMetadata>> {
    const metadata: StorageObjectMetadata = {
      key,
      contentType: options?.contentType || 'application/octet-stream',
      lastModified: new Date().toISOString(),
      metadata: options?.metadata,
    };
    this.manualMeta.set(key, metadata);
    this.manualUrls.set(key, `manual://storage/${key}`);
    return ok(metadata);
  }

  async get(key: string): Promise<Result<StorageGetObjectResult>> {
    const meta = this.manualMeta.get(key);
    if (!meta) {
      return fail({ code: 'RESOURCE_NOT_FOUND', message: `Manual storage object "${key}" not registered` });
    }
    return ok({
      data: `[Manual Storage Content for ${key}]`,
      metadata: meta,
    });
  }

  async delete(key: string): Promise<Result<void>> {
    this.manualUrls.delete(key);
    this.manualMeta.delete(key);
    return ok(undefined);
  }

  async getAccessUrl(key: string, options?: StorageAccessUrlOptions): Promise<Result<string>> {
    const url = this.manualUrls.get(key) || `https://assets.do-mining.com/manual/${encodeURIComponent(key)}`;
    return ok(url);
  }

  async head(key: string): Promise<Result<StorageObjectMetadata | null>> {
    return ok(this.manualMeta.get(key) || null);
  }

  async getSignedDownloadUrl(request: SignedUrlRequest): Promise<Result<string>> {
    return this.getAccessUrl(request.storageKey);
  }

  async getUploadPresignedUrl(request: PresignedUploadRequest): Promise<Result<PresignedUploadResponse>> {
    return ok({
      uploadUrl: `manual://instructions-upload/${request.storageKey}`,
      storageKey: request.storageKey,
      expiresAt: new Date(Date.now() + 86400 * 1000).toISOString(),
    });
  }

  async verifyAssetExistence(storageKey: string): Promise<Result<boolean>> {
    return ok(this.manualUrls.has(storageKey) || this.manualMeta.has(storageKey));
  }

  async deleteAsset(storageKey: string): Promise<Result<void>> {
    return this.delete(storageKey);
  }
}

export class RealStorageAdapter implements StoragePort {
  readonly mode: ProviderMode = 'real';

  async put(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real storage provider is explicitly not implemented in Phase 1' });
  }
  async get(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real storage provider is explicitly not implemented in Phase 1' });
  }
  async delete(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real storage provider is explicitly not implemented in Phase 1' });
  }
  async getAccessUrl(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real storage provider is explicitly not implemented in Phase 1' });
  }
  async head(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real storage provider is explicitly not implemented in Phase 1' });
  }
}

// ---------------------------------------------------------------------------
// 2. Live Session Adapters (Synchronous Collaboration)
// ---------------------------------------------------------------------------

export class MockLiveSessionAdapter implements LiveSessionPort {
  readonly mode: ProviderMode = 'mock';
  private scenario: LiveSimulationScenario = 'LIVE';
  private scenarioOptions?: SimulationScenarioOptions;
  private sessions: Map<string, LiveSession> = new Map();

  constructor(initialScenario: LiveSimulationScenario = 'LIVE', options?: SimulationScenarioOptions) {
    this.scenario = initialScenario;
    this.scenarioOptions = options;
  }

  setScenario(scenario: LiveSimulationScenario, options?: SimulationScenarioOptions): void {
    this.scenario = scenario;
    this.scenarioOptions = options;
  }

  getScenario(): LiveSimulationScenario {
    return this.scenario;
  }

  getScenarioOptions(): SimulationScenarioOptions | undefined {
    return this.scenarioOptions;
  }

  private async checkPreconditions(): Promise<Result<void> | null> {
    if (this.scenario === 'LATENCY' || (this.scenarioOptions?.latencyMs && this.scenarioOptions.latencyMs > 0)) {
      await applySimulationDelay(this.scenarioOptions);
    }
    if (this.scenario === 'UNAVAILABLE') {
      return fail(new ProviderUnavailableError(this.scenarioOptions?.customErrorMessage || 'Live video signaling & conferencing service is unavailable'));
    }
    if (this.scenario === 'NOT_CONFIGURED') {
      return fail(new ProviderConfigurationError(this.scenarioOptions?.customErrorMessage || 'Live conference domain and API tokens are not configured'));
    }
    if (this.scenario === 'PERMISSION_DENIED') {
      return fail(new PermissionDeniedError(this.scenarioOptions?.customErrorMessage || 'Access denied: insufficient permissions to access or manage this live session'));
    }
    return null;
  }

  async schedule(request: ScheduleLiveSessionRequest): Promise<Result<LiveSession>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    const roomIdentifier = `domining_${request.nodeId.slice(0, 8)}_${Date.now().toString(36)}`;
    const sessionStatus: LiveSessionStatus =
      this.scenario === 'LIVE' ? 'IN_PROGRESS' :
      this.scenario === 'ENDED' ? 'ENDED' :
      this.scenario === 'CANCELLED' ? 'CANCELLED' : 'SCHEDULED';

    const session: LiveSession = {
      id: `live_${Date.now().toString(36)}`,
      nodeId: request.nodeId,
      hostUserId: request.hostUserId,
      title: request.title,
      description: request.description,
      scheduledStartTime: request.scheduledStartTime,
      durationMinutes: request.durationMinutes,
      status: sessionStatus,
      roomIdentifier,
      roomUrl: `https://session.do-mining.local/room/${roomIdentifier}`,
    };
    this.sessions.set(session.id, session);
    this.sessions.set(roomIdentifier, session);
    return ok(session);
  }

  async getJoinInfo(request: JoinInfoRequest): Promise<Result<LiveSessionJoinInfo>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    if (this.scenario === 'NOT_FOUND') {
      return fail(new ResourceNotFoundError(this.scenarioOptions?.customErrorMessage || `Live session "${request.sessionId}" not found`));
    }

    if (this.scenario === 'ENDED') {
      return fail({
        code: 'SESSION_ENDED',
        message: this.scenarioOptions?.customErrorMessage || 'Cette session de formation en direct est déjà terminée',
      });
    }

    if (this.scenario === 'CANCELLED') {
      return fail({
        code: 'SESSION_CANCELLED',
        message: this.scenarioOptions?.customErrorMessage || 'Cette session de formation a été annulée par le formateur',
      });
    }

    const session = this.sessions.get(request.sessionId);
    const roomIdentifier = session ? session.roomIdentifier : request.sessionId;
    return ok({
      sessionId: session ? session.id : request.sessionId,
      roomIdentifier,
      roomUrl: session?.roomUrl || `https://session.do-mining.local/room/${roomIdentifier}`,
      token: `mock_token_${request.role}_${request.userId}_${roomIdentifier}`,
      role: request.role,
      expiresAt: new Date(Date.now() + 7200 * 1000).toISOString(),
    });
  }

  async getStatus(sessionId: string): Promise<Result<LiveSessionStatusInfo>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    if (this.scenario === 'NOT_FOUND') {
      return fail(new ResourceNotFoundError(`Live session "${sessionId}" not found`));
    }

    if (this.scenario === 'SCHEDULED') {
      return ok({
        sessionId,
        status: 'SCHEDULED',
        participantCount: 0,
        scheduledStartTime: '2026-09-15T16:30:00.000Z',
      });
    }

    if (this.scenario === 'ENDED') {
      return ok({
        sessionId,
        status: 'ENDED',
        participantCount: 0,
      });
    }

    if (this.scenario === 'CANCELLED') {
      return ok({
        sessionId,
        status: 'CANCELLED',
        participantCount: 0,
      });
    }

    const session = this.sessions.get(sessionId);
    return ok({
      sessionId,
      status: session ? session.status : 'IN_PROGRESS',
      participantCount: session ? 18 : 18,
      scheduledStartTime: session?.scheduledStartTime || '2026-09-15T16:30:00.000Z',
    });
  }

  // Legacy signatures
  async createRoom(request: CreateRoomRequest): Promise<Result<LiveSession>> {
    return this.schedule(request);
  }

  async generateHostToken(request: RoomTokenRequest): Promise<Result<string>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;
    return ok(`mock_jwt_host_${request.userId}_${request.roomIdentifier}`);
  }

  async generateLearnerToken(request: RoomTokenRequest): Promise<Result<string>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;
    return ok(`mock_jwt_learner_${request.userId}_${request.roomIdentifier}`);
  }

  async closeRoom(roomIdentifier: string): Promise<Result<void>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;
    const session = this.sessions.get(roomIdentifier);
    if (session) {
      session.status = 'ENDED';
    }
    return ok(undefined);
  }
}

export class ManualLiveSessionAdapter implements LiveSessionPort {
  readonly mode: ProviderMode = 'manual';
  private manualRoomUrls: Map<string, string> = new Map();

  registerManualRoom(roomIdentifier: string, url: string): void {
    this.manualRoomUrls.set(roomIdentifier, url);
  }

  async schedule(request: ScheduleLiveSessionRequest): Promise<Result<LiveSession>> {
    const roomIdentifier = `manual_${request.nodeId}`;
    return ok({
      id: `manual_live_${Date.now()}`,
      nodeId: request.nodeId,
      hostUserId: request.hostUserId,
      title: request.title,
      scheduledStartTime: request.scheduledStartTime,
      durationMinutes: request.durationMinutes,
      status: 'SCHEDULED',
      roomIdentifier,
      roomUrl: this.manualRoomUrls.get(roomIdentifier) || `https://session.do-mining.com/manual/${roomIdentifier}`,
    });
  }

  async getJoinInfo(request: JoinInfoRequest): Promise<Result<LiveSessionJoinInfo>> {
    return ok({
      sessionId: request.sessionId,
      roomIdentifier: `manual_${request.sessionId}`,
      roomUrl: this.manualRoomUrls.get(request.sessionId) || `https://session.do-mining.com/manual/${request.sessionId}`,
      token: `manual_token_${request.role}`,
      role: request.role,
    });
  }

  async getStatus(sessionId: string): Promise<Result<LiveSessionStatusInfo>> {
    return ok({
      sessionId,
      status: 'SCHEDULED',
      participantCount: 0,
    });
  }

  async createRoom(request: CreateRoomRequest): Promise<Result<LiveSession>> {
    return this.schedule(request);
  }

  async generateHostToken(request: RoomTokenRequest): Promise<Result<string>> {
    return ok('manual_token_host');
  }

  async generateLearnerToken(request: RoomTokenRequest): Promise<Result<string>> {
    return ok('manual_token_learner');
  }

  async closeRoom(roomIdentifier: string): Promise<Result<void>> {
    return ok(undefined);
  }
}

export class RealLiveSessionAdapter implements LiveSessionPort {
  readonly mode: ProviderMode = 'real';

  async schedule(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real live session provider is explicitly not implemented in Phase 1' });
  }
  async getJoinInfo(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real live session provider is explicitly not implemented in Phase 1' });
  }
  async getStatus(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real live session provider is explicitly not implemented in Phase 1' });
  }
}

// ---------------------------------------------------------------------------
// 3. Deployment Adapters (Pipeline Status Simulation)
// ---------------------------------------------------------------------------

export class MockDeploymentAdapter implements DeploymentPort {
  readonly mode: ProviderMode = 'mock';
  private scenario: DeploymentSimulationScenario = 'DEPLOYED';
  private scenarioOptions?: SimulationScenarioOptions;

  constructor(initialScenario: DeploymentSimulationScenario = 'DEPLOYED', options?: SimulationScenarioOptions) {
    this.scenario = initialScenario;
    this.scenarioOptions = options;
  }

  setScenario(scenario: DeploymentSimulationScenario, options?: SimulationScenarioOptions): void {
    this.scenario = scenario;
    this.scenarioOptions = options;
  }

  getScenario(): DeploymentSimulationScenario {
    return this.scenario;
  }

  getScenarioOptions(): SimulationScenarioOptions | undefined {
    return this.scenarioOptions;
  }

  private async checkPreconditions(): Promise<Result<void> | null> {
    if (this.scenario === 'LATENCY' || (this.scenarioOptions?.latencyMs && this.scenarioOptions.latencyMs > 0)) {
      await applySimulationDelay(this.scenarioOptions);
    }
    if (this.scenario === 'UNAVAILABLE') {
      return fail(new ProviderUnavailableError(this.scenarioOptions?.customErrorMessage || 'Deployment pipeline service is temporarily unavailable'));
    }
    if (this.scenario === 'NOT_CONFIGURED') {
      return fail(new ProviderConfigurationError(this.scenarioOptions?.customErrorMessage || 'Deployment provider webhook token or project ID is missing'));
    }
    if (this.scenario === 'PERMISSION_DENIED') {
      return fail(new PermissionDeniedError(this.scenarioOptions?.customErrorMessage || 'Access denied: insufficient deployment pipeline privileges'));
    }
    return null;
  }

  async getStatus(deploymentId = 'dep_sim_mock_01'): Promise<Result<DeploymentStatus>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    if (this.scenario === 'NOT_FOUND') {
      return fail(new ResourceNotFoundError(`Deployment "${deploymentId}" not found in pipeline`));
    }

    if (this.scenario === 'BUILDING') {
      return ok({
        id: deploymentId,
        environment: 'production',
        state: 'BUILDING',
        url: 'https://preview.do-mining.local',
        commitSha: 'a1b2c3d4e5f67890123456789abcdef012345678',
        deployedAt: new Date().toISOString(),
        metadata: {
          target: 'Simulation Container',
          statusDetails: 'Building container image & compiling assets (Step 4/6)',
          progressPercentage: 65,
        },
      });
    }

    if (this.scenario === 'FAILED') {
      return ok({
        id: deploymentId,
        environment: 'production',
        state: 'FAILED',
        url: 'https://preview.do-mining.local',
        commitSha: 'a1b2c3d4e5f67890123456789abcdef012345678',
        deployedAt: new Date().toISOString(),
        metadata: {
          target: 'Simulation Container',
          errorDetails: this.scenarioOptions?.customErrorMessage || 'Simulated build failure: compilation check exited with status 1',
        },
      });
    }

    return ok({
      id: deploymentId,
      environment: 'production',
      state: 'DEPLOYED',
      url: 'https://preview.do-mining.local',
      commitSha: 'a1b2c3d4e5f67890123456789abcdef012345678',
      deployedAt: '2026-09-15T00:00:00.000Z',
      metadata: {
        target: 'Simulation Container',
        healthy: true,
        uptimeSeconds: 86400,
      },
    });
  }
}

export class ManualDeploymentAdapter implements DeploymentPort {
  readonly mode: ProviderMode = 'manual';

  async getStatus(deploymentId = 'dep_manual_01'): Promise<Result<DeploymentStatus>> {
    return ok({
      id: deploymentId,
      environment: 'staging',
      state: 'BUILDING',
      url: 'https://staging.do-mining.internal',
      commitSha: 'manual_verification_sha',
      deployedAt: new Date().toISOString(),
      metadata: {
        mode: 'Manual Verification',
        operator: 'Lead DevOps',
      },
    });
  }
}

export class RealDeploymentAdapter implements DeploymentPort {
  readonly mode: ProviderMode = 'real';

  async getStatus(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real deployment provider is explicitly not implemented in Phase 1' });
  }
}

// ---------------------------------------------------------------------------
// 4. Repository Adapters (Version Control & Status Abstraction)
// ---------------------------------------------------------------------------

export class MockRepositoryAdapter implements RepositoryPort {
  readonly mode: ProviderMode = 'mock';
  private scenario: RepositorySimulationScenario = 'SYNCED';
  private scenarioOptions?: SimulationScenarioOptions;

  constructor(initialScenario: RepositorySimulationScenario = 'SYNCED', options?: SimulationScenarioOptions) {
    this.scenario = initialScenario;
    this.scenarioOptions = options;
  }

  setScenario(scenario: RepositorySimulationScenario, options?: SimulationScenarioOptions): void {
    this.scenario = scenario;
    this.scenarioOptions = options;
  }

  getScenario(): RepositorySimulationScenario {
    return this.scenario;
  }

  getScenarioOptions(): SimulationScenarioOptions | undefined {
    return this.scenarioOptions;
  }

  private async checkPreconditions(): Promise<Result<void> | null> {
    if (this.scenario === 'LATENCY' || (this.scenarioOptions?.latencyMs && this.scenarioOptions.latencyMs > 0)) {
      await applySimulationDelay(this.scenarioOptions);
    }
    if (this.scenario === 'UNAVAILABLE') {
      return fail(new ProviderUnavailableError(this.scenarioOptions?.customErrorMessage || 'Version control VCS service is unreachable'));
    }
    if (this.scenario === 'NOT_CONFIGURED') {
      return fail(new ProviderConfigurationError(this.scenarioOptions?.customErrorMessage || 'Repository SSH keys or access tokens not configured'));
    }
    if (this.scenario === 'PERMISSION_DENIED') {
      return fail(new PermissionDeniedError(this.scenarioOptions?.customErrorMessage || 'Access denied: repository read permission required'));
    }
    return null;
  }

  async getStatus(): Promise<Result<RepositoryStatus>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    if (this.scenario === 'NOT_FOUND') {
      return fail(new ResourceNotFoundError('Repository remote upstream not found'));
    }

    if (this.scenario === 'BEHIND') {
      return ok({
        name: 'do-mining-platform',
        branch: 'main',
        latestCommitSha: '7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
        lastSyncTime: new Date().toISOString(),
        status: 'BEHIND',
        cleanWorkingTree: true,
        metadata: {
          behindByCommits: 3,
          upstreamBranch: 'origin/main',
        },
      });
    }

    if (this.scenario === 'DIVERGED') {
      return ok({
        name: 'do-mining-platform',
        branch: 'main',
        latestCommitSha: '7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
        lastSyncTime: new Date().toISOString(),
        status: 'DIVERGED',
        cleanWorkingTree: false,
        metadata: {
          aheadCommits: 2,
          behindCommits: 1,
          conflictRisk: 'Moderate',
        },
      });
    }

    return ok({
      name: 'do-mining-platform',
      branch: 'main',
      latestCommitSha: '7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
      lastSyncTime: '2026-09-15T02:00:00.000Z',
      status: 'SYNCED',
      cleanWorkingTree: true,
      metadata: {
        monorepoPackages: 6,
        trackedFiles: 142,
      },
    });
  }
}

export class ManualRepositoryAdapter implements RepositoryPort {
  readonly mode: ProviderMode = 'manual';

  async getStatus(): Promise<Result<RepositoryStatus>> {
    return ok({
      name: 'do-mining-manual-repo',
      branch: 'release/phase-1',
      latestCommitSha: 'manual_sync_sha_rev1',
      lastSyncTime: new Date().toISOString(),
      status: 'SYNCED',
      cleanWorkingTree: true,
      metadata: {
        manualApproval: true,
      },
    });
  }
}

export class RealRepositoryAdapter implements RepositoryPort {
  readonly mode: ProviderMode = 'real';

  async getStatus(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real repository provider is explicitly not implemented in Phase 1' });
  }
}

// ---------------------------------------------------------------------------
// 5. DNS Adapters (DNS Status & Config Abstraction)
// ---------------------------------------------------------------------------

export class MockDnsAdapter implements DnsPort {
  readonly mode: ProviderMode = 'mock';
  private scenario: DnsSimulationScenario = 'PROPAGATED';
  private scenarioOptions?: SimulationScenarioOptions;

  constructor(initialScenario: DnsSimulationScenario = 'PROPAGATED', options?: SimulationScenarioOptions) {
    this.scenario = initialScenario;
    this.scenarioOptions = options;
  }

  setScenario(scenario: DnsSimulationScenario, options?: SimulationScenarioOptions): void {
    this.scenario = scenario;
    this.scenarioOptions = options;
  }

  getScenario(): DnsSimulationScenario {
    return this.scenario;
  }

  getScenarioOptions(): SimulationScenarioOptions | undefined {
    return this.scenarioOptions;
  }

  private async checkPreconditions(): Promise<Result<void> | null> {
    if (this.scenario === 'LATENCY' || (this.scenarioOptions?.latencyMs && this.scenarioOptions.latencyMs > 0)) {
      await applySimulationDelay(this.scenarioOptions);
    }
    if (this.scenario === 'UNAVAILABLE') {
      return fail(new ProviderUnavailableError(this.scenarioOptions?.customErrorMessage || 'DNS management API is currently unreachable'));
    }
    if (this.scenario === 'NOT_CONFIGURED') {
      return fail(new ProviderConfigurationError(this.scenarioOptions?.customErrorMessage || 'DNS zone identifier or registrar API keys missing'));
    }
    if (this.scenario === 'PERMISSION_DENIED') {
      return fail(new PermissionDeniedError(this.scenarioOptions?.customErrorMessage || 'DNS access denied: missing zone editing permission'));
    }
    return null;
  }

  async getStatus(domain = 'do-mining.com'): Promise<Result<DnsStatus>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    if (this.scenario === 'NOT_FOUND') {
      return fail(new ResourceNotFoundError(`DNS zone for domain "${domain}" not found`));
    }

    if (this.scenario === 'PENDING_PROPAGATION') {
      return ok({
        domain,
        status: 'PENDING',
        propagated: false,
        lastCheckedAt: new Date().toISOString(),
        details: {
          reason: 'DNS records updating across regional nameservers (TTL 3600)',
          propagationProgress: '40%',
        },
      });
    }

    if (this.scenario === 'DNS_ERROR') {
      return ok({
        domain,
        status: 'ERROR',
        propagated: false,
        lastCheckedAt: new Date().toISOString(),
        details: {
          error: this.scenarioOptions?.customErrorMessage || 'Nameserver resolution mismatch (NXDOMAIN / SERVFAIL)',
        },
      });
    }

    return ok({
      domain,
      status: 'ACTIVE',
      propagated: true,
      lastCheckedAt: new Date().toISOString(),
      details: {
        nameserversHealthy: true,
        sslActive: true,
      },
    });
  }

  async getConfig(domain = 'do-mining.com'): Promise<Result<DnsConfig>> {
    const check = await this.checkPreconditions();
    if (check) return check as Result<never>;

    if (this.scenario === 'NOT_FOUND') {
      return fail(new ResourceNotFoundError(`DNS zone for domain "${domain}" not found`));
    }

    return ok({
      domain,
      nameservers: ['ns1.do-mining.local', 'ns2.do-mining.local'],
      records: [
        { name: '@', type: 'A', value: '192.0.2.1', ttl: 3600 },
        { name: 'www', type: 'CNAME', value: 'do-mining.com', ttl: 3600 },
        { name: 'assets', type: 'CNAME', value: 'storage.do-mining.com', ttl: 3600 },
      ],
    });
  }
}

export class ManualDnsAdapter implements DnsPort {
  readonly mode: ProviderMode = 'manual';

  async getStatus(domain = 'do-mining.com'): Promise<Result<DnsStatus>> {
    return ok({
      domain,
      status: 'PENDING',
      propagated: false,
      lastCheckedAt: new Date().toISOString(),
      details: {
        actionRequired: 'Manual DNS validation pending registrar propagation',
      },
    });
  }

  async getConfig(domain = 'do-mining.com'): Promise<Result<DnsConfig>> {
    return ok({
      domain,
      nameservers: ['ns-manual.host-nameserver.net'],
      records: [
        { name: '@', type: 'A', value: '198.51.100.1', ttl: 14400 },
        { name: 'staging', type: 'A', value: '198.51.100.2', ttl: 14400 },
      ],
    });
  }
}

export class RealDnsAdapter implements DnsPort {
  readonly mode: ProviderMode = 'real';

  async getStatus(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real DNS provider is explicitly not implemented in Phase 1' });
  }

  async getConfig(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real DNS provider is explicitly not implemented in Phase 1' });
  }
}

// ---------------------------------------------------------------------------
// 6. Notification Adapters (Transactional Dispatch)
// ---------------------------------------------------------------------------

export class MockNotificationAdapter implements NotificationPort {
  readonly mode: ProviderMode = 'mock';
  public sentNotifications: NotificationPayload[] = [];

  async send(payload: NotificationPayload): Promise<Result<NotificationResult>> {
    this.sentNotifications.push(payload);
    return ok({
      messageId: `mock_notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      sentAt: new Date().toISOString(),
      status: 'SENT',
    });
  }
}

export class ManualNotificationAdapter implements NotificationPort {
  readonly mode: ProviderMode = 'manual';
  public loggedNotifications: NotificationPayload[] = [];

  async send(payload: NotificationPayload): Promise<Result<NotificationResult>> {
    this.loggedNotifications.push(payload);
    return ok({
      messageId: `manual_notif_${Date.now()}`,
      sentAt: new Date().toISOString(),
      status: 'QUEUED',
    });
  }
}

export class RealNotificationAdapter implements NotificationPort {
  readonly mode: ProviderMode = 'real';

  async send(): Promise<Result<never>> {
    return fail({ code: 'UNSUPPORTED_OPERATION', message: 'Real notification provider is explicitly not implemented in Phase 1' });
  }
}

// ---------------------------------------------------------------------------
// 7. Adapter Factory Functions & Simulation Manager
// ---------------------------------------------------------------------------

interface LocalStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function getSafeLocalStorage(): LocalStorageLike | null {
  try {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
      return (globalThis as unknown as { localStorage: LocalStorageLike }).localStorage;
    }
  } catch {
    // Ignore in non-browser runtime
  }
  return null;
}

export class SimulationManager {
  public readonly storageAdapter: MockStorageAdapter;
  public readonly liveSessionAdapter: MockLiveSessionAdapter;
  public readonly deploymentAdapter: MockDeploymentAdapter;
  public readonly repositoryAdapter: MockRepositoryAdapter;
  public readonly dnsAdapter: MockDnsAdapter;
  public readonly contentAdapter: MockContentRepositoryAdapter;

  private listeners: Set<() => void> = new Set();
  private readonly STORAGE_KEY = 'do_mining_simulation_scenarios_v1';

  constructor() {
    this.storageAdapter = new MockStorageAdapter('AVAILABLE');
    this.liveSessionAdapter = new MockLiveSessionAdapter('LIVE');
    this.deploymentAdapter = new MockDeploymentAdapter('DEPLOYED');
    this.repositoryAdapter = new MockRepositoryAdapter('SYNCED');
    this.dnsAdapter = new MockDnsAdapter('PROPAGATED');
    this.contentAdapter = new MockContentRepositoryAdapter();

    this.restoreFromStorage();
  }

  public static getInstance(): SimulationManager {
    const globalObj = typeof globalThis !== 'undefined' ? globalThis as any : {};
    if (!globalObj.__doMiningSimulationManager) {
      globalObj.__doMiningSimulationManager = new SimulationManager();
    }
    return globalObj.__doMiningSimulationManager;
  }

  private restoreFromStorage(): void {
    const storage = getSafeLocalStorage();
    if (!storage) return;
    try {
      const raw = storage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, { scenario: SimulationScenario; options?: SimulationScenarioOptions }>;
        if (parsed.storage?.scenario) this.storageAdapter.setScenario(parsed.storage.scenario as StorageSimulationScenario, parsed.storage.options);
        if (parsed.live?.scenario) this.liveSessionAdapter.setScenario(parsed.live.scenario as LiveSimulationScenario, parsed.live.options);
        if (parsed.deployment?.scenario) this.deploymentAdapter.setScenario(parsed.deployment.scenario as DeploymentSimulationScenario, parsed.deployment.options);
        if (parsed.repository?.scenario) this.repositoryAdapter.setScenario(parsed.repository.scenario as RepositorySimulationScenario, parsed.repository.options);
        if (parsed.dns?.scenario) this.dnsAdapter.setScenario(parsed.dns.scenario as DnsSimulationScenario, parsed.dns.options);
      }
    } catch {
      // Graceful fallback to default in-memory fixtures
    }
  }

  private persistToStorage(): void {
    const storage = getSafeLocalStorage();
    if (!storage) return;
    try {
      const data: Record<string, { scenario: SimulationScenario; options?: SimulationScenarioOptions }> = {
        storage: { scenario: this.storageAdapter.getScenario(), options: this.storageAdapter.getScenarioOptions() },
        live: { scenario: this.liveSessionAdapter.getScenario(), options: this.liveSessionAdapter.getScenarioOptions() },
        deployment: { scenario: this.deploymentAdapter.getScenario(), options: this.deploymentAdapter.getScenarioOptions() },
        repository: { scenario: this.repositoryAdapter.getScenario(), options: this.repositoryAdapter.getScenarioOptions() },
        dns: { scenario: this.dnsAdapter.getScenario(), options: this.dnsAdapter.getScenarioOptions() },
      };
      storage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore in restricted environments
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.persistToStorage();
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('Simulation listener exception', err);
      }
    });
  }

  public setStorageScenario(scenario: StorageSimulationScenario, options?: SimulationScenarioOptions): void {
    this.storageAdapter.setScenario(scenario, options);
    this.notify();
  }

  public setLiveScenario(scenario: LiveSimulationScenario, options?: SimulationScenarioOptions): void {
    this.liveSessionAdapter.setScenario(scenario, options);
    this.notify();
  }

  public setDeploymentScenario(scenario: DeploymentSimulationScenario, options?: SimulationScenarioOptions): void {
    this.deploymentAdapter.setScenario(scenario, options);
    this.notify();
  }

  public setRepositoryScenario(scenario: RepositorySimulationScenario, options?: SimulationScenarioOptions): void {
    this.repositoryAdapter.setScenario(scenario, options);
    this.notify();
  }

  public setDnsScenario(scenario: DnsSimulationScenario, options?: SimulationScenarioOptions): void {
    this.dnsAdapter.setScenario(scenario, options);
    this.notify();
  }

  public resetAllToNominal(): void {
    this.storageAdapter.setScenario('AVAILABLE');
    this.liveSessionAdapter.setScenario('LIVE');
    this.deploymentAdapter.setScenario('DEPLOYED');
    this.repositoryAdapter.setScenario('SYNCED');
    this.dnsAdapter.setScenario('PROPAGATED');
    this.notify();
  }

  public setAllUnavailable(message = 'Service simulation: globale panne d’infrastructure'): void {
    const opts: SimulationScenarioOptions = { customErrorMessage: message };
    this.storageAdapter.setScenario('UNAVAILABLE', opts);
    this.liveSessionAdapter.setScenario('UNAVAILABLE', opts);
    this.deploymentAdapter.setScenario('UNAVAILABLE', opts);
    this.repositoryAdapter.setScenario('UNAVAILABLE', opts);
    this.dnsAdapter.setScenario('UNAVAILABLE', opts);
    this.notify();
  }

  public setAllNotConfigured(): void {
    this.storageAdapter.setScenario('NOT_CONFIGURED');
    this.liveSessionAdapter.setScenario('NOT_CONFIGURED');
    this.deploymentAdapter.setScenario('NOT_CONFIGURED');
    this.repositoryAdapter.setScenario('NOT_CONFIGURED');
    this.dnsAdapter.setScenario('NOT_CONFIGURED');
    this.notify();
  }

  public getAllScenarios(): Record<SimulatedServiceType, SimulationScenario> {
    return {
      storage: this.storageAdapter.getScenario(),
      live: this.liveSessionAdapter.getScenario(),
      deployment: this.deploymentAdapter.getScenario(),
      repository: this.repositoryAdapter.getScenario(),
      dns: this.dnsAdapter.getScenario(),
      notification: 'SUCCESS',
    };
  }

  public getAllConfigRecords(): SimulationConfigRecord[] {
    const now = new Date().toISOString();
    return [
      { serviceId: 'storage', activeScenario: this.storageAdapter.getScenario(), options: this.storageAdapter.getScenarioOptions(), updatedAt: now },
      { serviceId: 'live', activeScenario: this.liveSessionAdapter.getScenario(), options: this.liveSessionAdapter.getScenarioOptions(), updatedAt: now },
      { serviceId: 'deployment', activeScenario: this.deploymentAdapter.getScenario(), options: this.deploymentAdapter.getScenarioOptions(), updatedAt: now },
      { serviceId: 'repository', activeScenario: this.repositoryAdapter.getScenario(), options: this.repositoryAdapter.getScenarioOptions(), updatedAt: now },
      { serviceId: 'dns', activeScenario: this.dnsAdapter.getScenario(), options: this.dnsAdapter.getScenarioOptions(), updatedAt: now },
    ];
  }
}

/**
 * Seam preparing future persistence from PostgreSQL (Phase 2+)
 */
export class SimulationScenarioLoader {
  constructor(private repo?: SimulationScenarioRepository) {}

  async loadScenarios(): Promise<Result<SimulationConfigRecord[]>> {
    if (!this.repo) {
      return ok(SimulationManager.getInstance().getAllConfigRecords());
    }
    return this.repo.listScenarios();
  }

  async persistScenario(record: SimulationConfigRecord): Promise<Result<void>> {
    if (!this.repo) {
      const mgr = SimulationManager.getInstance();
      if (record.serviceId === 'storage') mgr.setStorageScenario(record.activeScenario as StorageSimulationScenario, record.options);
      if (record.serviceId === 'live') mgr.setLiveScenario(record.activeScenario as LiveSimulationScenario, record.options);
      if (record.serviceId === 'deployment') mgr.setDeploymentScenario(record.activeScenario as DeploymentSimulationScenario, record.options);
      if (record.serviceId === 'repository') mgr.setRepositoryScenario(record.activeScenario as RepositorySimulationScenario, record.options);
      if (record.serviceId === 'dns') mgr.setDnsScenario(record.activeScenario as DnsSimulationScenario, record.options);
      return ok(undefined);
    }
    return this.repo.saveScenario(record);
  }
}

export function createStoragePort(mode: ProviderMode = 'mock', scenario?: StorageSimulationScenario): StoragePort {
  if (mode === 'real') return new RealStorageAdapter();
  if (mode === 'manual') return new ManualStorageAdapter();
  if (scenario) return new MockStorageAdapter(scenario);
  return SimulationManager.getInstance().storageAdapter;
}

export function createLiveSessionPort(mode: ProviderMode = 'mock', scenario?: LiveSimulationScenario): LiveSessionPort {
  if (mode === 'real') return new RealLiveSessionAdapter();
  if (mode === 'manual') return new ManualLiveSessionAdapter();
  if (scenario) return new MockLiveSessionAdapter(scenario);
  return SimulationManager.getInstance().liveSessionAdapter;
}

export function createDeploymentPort(mode: ProviderMode = 'mock', scenario?: DeploymentSimulationScenario): DeploymentPort {
  if (mode === 'real') return new RealDeploymentAdapter();
  if (mode === 'manual') return new ManualDeploymentAdapter();
  if (scenario) return new MockDeploymentAdapter(scenario);
  return SimulationManager.getInstance().deploymentAdapter;
}

export function createRepositoryPort(mode: ProviderMode = 'mock', scenario?: RepositorySimulationScenario): RepositoryPort {
  if (mode === 'real') return new RealRepositoryAdapter();
  if (mode === 'manual') return new ManualRepositoryAdapter();
  if (scenario) return new MockRepositoryAdapter(scenario);
  return SimulationManager.getInstance().repositoryAdapter;
}

export function createDnsPort(mode: ProviderMode = 'mock', scenario?: DnsSimulationScenario): DnsPort {
  if (mode === 'real') return new RealDnsAdapter();
  if (mode === 'manual') return new ManualDnsAdapter();
  if (scenario) return new MockDnsAdapter(scenario);
  return SimulationManager.getInstance().dnsAdapter;
}

export function createNotificationPort(mode: ProviderMode = 'mock'): NotificationPort {
  if (mode === 'real') return new RealNotificationAdapter();
  if (mode === 'manual') return new ManualNotificationAdapter();
  return new MockNotificationAdapter();
}

// ---------------------------------------------------------------------------
// 3. Email Notification Adapters
// ---------------------------------------------------------------------------

export class MockEmailNotificationAdapter implements EmailNotificationPort {
  public sentEmails: TransactionalEmailRequest[] = [];

  async sendTransactionalEmail(request: TransactionalEmailRequest): Promise<Result<{ messageId: string }>> {
    this.sentEmails.push(request);
    return ok({ messageId: `mock_msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` });
  }
}

// ---------------------------------------------------------------------------
// 4. Version Control Audit Adapters
// ---------------------------------------------------------------------------

export class MockVersionControlAdapter implements VersionControlPort {
  private commits: Map<string, Array<{ commitSha: string; timestamp: string; message: string }>> = new Map();

  async publishContentAuditCommit(request: AuditCommitRequest): Promise<Result<{ commitSha: string }>> {
    const commitSha = `sha_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const history = this.commits.get(request.nodeCode) || [];
    history.push({
      commitSha,
      timestamp: new Date().toISOString(),
      message: request.commitMessage,
    });
    this.commits.set(request.nodeCode, history);
    return ok({ commitSha });
  }

  async fetchAuditHistory(nodeCode: string): Promise<Result<Array<{ commitSha: string; timestamp: string; message: string }>>> {
    return ok(this.commits.get(nodeCode) || []);
  }
}

// ---------------------------------------------------------------------------
// 5. Immutable Audit Logger Adapter
// ---------------------------------------------------------------------------

export class MockAuditLoggerAdapter implements AuditLoggerPort {
  private logs: AuditEvent[] = [];

  async recordEvent(event: Omit<AuditEvent, 'id' | 'payloadHashSha256' | 'timestamp'>): Promise<Result<AuditEvent>> {
    const payloadStr = JSON.stringify(event.payload);
    // Simple deterministic hash simulation without external crypto dependency
    let hash = 0;
    for (let i = 0; i < payloadStr.length; i++) {
      hash = (hash << 5) - hash + payloadStr.charCodeAt(i);
      hash |= 0;
    }
    const payloadHashSha256 = `sha256_${Math.abs(hash).toString(16).padStart(16, '0')}`;

    const record: AuditEvent = {
      ...event,
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      payloadHashSha256,
      timestamp: new Date().toISOString(),
    };
    this.logs.push(record);
    return ok(record);
  }

  async queryAuditTrail(filters: {
    actorUserId?: string;
    targetEntityId?: string;
    fromTimestamp?: string;
    limit?: number;
  }): Promise<Result<AuditEvent[]>> {
    let result = [...this.logs];
    if (filters.actorUserId) {
      result = result.filter((e) => e.actorUserId === filters.actorUserId);
    }
    if (filters.targetEntityId) {
      result = result.filter((e) => e.targetEntityId === filters.targetEntityId);
    }
    if (filters.limit) {
      result = result.slice(0, filters.limit);
    }
    return ok(result);
  }
}

// ---------------------------------------------------------------------------
// 6. Content Repository Adapter (Seeded with "Carrières & Granulats")
// ---------------------------------------------------------------------------

export class MockContentRepositoryAdapter implements ContentRepositoryPort {
  private nodes: ContentNode[] = [];
  private revisions: Map<string, ContentRevision> = new Map();
  private quizzes: Map<string, QuizSpec> = new Map();

  constructor() {
    this.seedCarriereGranulatsTree();
  }

  private seedCarriereGranulatsTree() {
    const now = new Date().toISOString();

    // Racine Domain
    const domainNode: ContentNode = {
      id: 'dom_mines_carrieres',
      parentId: null,
      slug: 'mines-et-carrieres',
      title: 'Mines & Carrières',
      code: 'DOM-MIN',
      nodeType: 'DOMAIN',
      sortOrder: 1,
      status: 'PUBLISHED',
      version: 1,
      metadata: { description: 'Domaine de formation aux métiers extractifs et miniers' },
      createdAt: now,
      updatedAt: now,
    };

    // Branche
    const branchCarriere: ContentNode = {
      id: 'bra_carrieres_granulats',
      parentId: domainNode.id,
      slug: 'carrieres-et-granulats',
      title: 'Carrières & Granulats',
      code: 'BRA-CAR',
      nodeType: 'BRANCH',
      sortOrder: 1,
      status: 'PUBLISHED',
      version: 1,
      metadata: { icon: 'mountain', color: '#08AFC1' },
      createdAt: now,
      updatedAt: now,
    };

    // Formation
    const formationExploitation: ContentNode = {
      id: 'for_exploitation_carrieres',
      parentId: branchCarriere.id,
      slug: 'exploitation-carrieres-granulats',
      title: 'Exploitation des Carrières & Production des Granulats',
      code: 'FOR-CAR-01',
      nodeType: 'FORMATION',
      sortOrder: 1,
      status: 'PUBLISHED',
      version: 1,
      metadata: { durationHours: 35, certified: true },
      createdAt: now,
      updatedAt: now,
    };

    // Module 1 : Chaîne opératoire de production
    const moduleProduction: ContentNode = {
      id: 'mod_production_granulats',
      parentId: formationExploitation.id,
      slug: 'chaine-production-granulats',
      title: 'Chaîne opératoire de production des granulats',
      code: 'MOD-PROD-01',
      nodeType: 'MODULE',
      sortOrder: 1,
      status: 'PUBLISHED',
      version: 1,
      metadata: { objective: 'Maîtriser les étapes du gisement au stockage normé' },
      createdAt: now,
      updatedAt: now,
    };

    // Sections du module
    const steps = [
      { slug: 'decapage', title: '1. Décapage et découverte des terrains', code: 'LEC-DEC-01' },
      { slug: 'extraction', title: '2. Extraction mécanique et foration/tir', code: 'LEC-EXT-02' },
      { slug: 'transfert', title: '3. Transfert des matériaux bruts (dumper, convoyeur)', code: 'LEC-TRA-03' },
      { slug: 'concassage', title: '4. Concassage primaire et secondaire', code: 'LEC-CON-04' },
      { slug: 'criblage', title: '5. Criblage et coupures granulométriques', code: 'LEC-CRI-05' },
      { slug: 'lavage', title: '6. Lavage des sables et décantation', code: 'LEC-LAV-06' },
      { slug: 'stockage', title: '7. Stockage et prévention de la ségrégation', code: 'LEC-STO-07' },
      { slug: 'classification', title: '8. Classification normalisée des granulats (EN 933)', code: 'LEC-CLA-08' },
    ];

    this.nodes.push(domainNode, branchCarriere, formationExploitation, moduleProduction);

    steps.forEach((step, idx) => {
      const lessonNode: ContentNode = {
        id: `node_${step.slug}`,
        parentId: moduleProduction.id,
        slug: step.slug,
        title: step.title,
        code: step.code,
        nodeType: 'LESSON',
        sortOrder: idx + 1,
        status: 'PUBLISHED',
        version: 1,
        metadata: { durationMinutes: 45 },
        createdAt: now,
        updatedAt: now,
      };
      this.nodes.push(lessonNode);

      const revision: ContentRevision = {
        id: `rev_${step.slug}_v1`,
        nodeId: lessonNode.id,
        revisionNumber: 1,
        contentType: 'MARKDOWN',
        body: `# ${step.title}\n\nDocumentation technique et opérationnelle pour le métier des carrières et granulats.\n\n### Objectifs d'apprentissage\n- Comprendre les principes physiques et mécaniques de l'étape **${step.title}**.\n- Respecter les normes de sécurité minières et les rendements industriels.`,
        storageKey: `courses/carrieres/${step.slug}.md`,
        durationMinutes: 45,
        checksumSha256: `sha256_${step.slug}_v1`,
        isLatest: true,
        createdAt: now,
      };
      this.revisions.set(lessonNode.id, revision);
    });

    // Quiz d'évaluation de fin de module
    const quizNode: ContentNode = {
      id: 'node_quiz_production',
      parentId: moduleProduction.id,
      slug: 'evaluation-chaine-granulats',
      title: 'Évaluation certifiante : Chaîne de production des granulats',
      code: 'QUIZ-PROD-01',
      nodeType: 'ACTIVITY',
      sortOrder: steps.length + 1,
      status: 'PUBLISHED',
      version: 1,
      metadata: { passingScore: 80, timeLimitMinutes: 20 },
      createdAt: now,
      updatedAt: now,
    };
    this.nodes.push(quizNode);

    const quizSpec: QuizSpec = {
      id: 'quiz_spec_chaine_granulats',
      title: 'Évaluation technique : Production des Granulats',
      passingScorePercent: 80,
      questions: [
        {
          id: 'q1',
          type: 'SINGLE_CHOICE',
          prompt: 'Quel est l’objectif principal du concassage primaire en carrière de roche massive ?',
          options: [
            { id: 'opt1_a', text: 'Réduire le tout-venant à une granulométrie compatible avec le transport par bande' },
            { id: 'opt1_b', text: 'Laver les fines argileuses avant criblage' },
            { id: 'opt1_c', text: 'Fabriquer directement des sables 0/4' },
          ],
          explanation: 'Le concasseur primaire (généralement à mâchoires ou giratoire) reçoit les blocs de tir pour obtenir un calibre transportable.',
        },
        {
          id: 'q2',
          type: 'SINGLE_CHOICE',
          prompt: 'Comment s’appelle le phénomène d’hétérogénéité spatiale des calibres lors du déversement en tas ?',
          options: [
            { id: 'opt2_a', text: 'La sédimentation hydrodynamique' },
            { id: 'opt2_b', text: 'La ségrégation granulométrique' },
            { id: 'opt2_c', text: 'Le frettage mécanique' },
          ],
          explanation: 'La ségrégation fait rouler les éléments les plus gros vers la périphérie basse du tas de stockage.',
        },
      ],
    };
    this.quizzes.set(quizNode.id, quizSpec);
  }

  async getNodeById(id: string): Promise<Result<ContentNode | null>> {
    const node = this.nodes.find((n) => n.id === id) || null;
    return ok(node);
  }

  async getNodeBySlug(slug: string): Promise<Result<ContentNode | null>> {
    const node = this.nodes.find((n) => n.slug === slug) || null;
    return ok(node);
  }

  async getChildren(parentId: string | null): Promise<Result<ContentNode[]>> {
    const children = this.nodes
      .filter((n) => n.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return ok(children);
  }

  async getTree(query?: ContentTreeQuery): Promise<Result<ContentNode[]>> {
    return ok([...this.nodes]);
  }

  async getLatestRevision(nodeId: string): Promise<Result<ContentRevision | null>> {
    return ok(this.revisions.get(nodeId) || null);
  }

  async getQuizSpec(nodeId: string): Promise<Result<QuizSpec | null>> {
    return ok(this.quizzes.get(nodeId) || null);
  }
}

// ---------------------------------------------------------------------------
// 7. Progress Tracker Adapter
// ---------------------------------------------------------------------------

export class MockProgressTrackerAdapter implements ProgressTrackerPort {
  private progressMap: Map<string, UserNodeProgress> = new Map();

  private key(userId: string, nodeId: string): string {
    return `${userId}__${nodeId}`;
  }

  async getProgress(userId: string, nodeId: string): Promise<Result<UserNodeProgress | null>> {
    return ok(this.progressMap.get(this.key(userId, nodeId)) || null);
  }

  async getAllProgressForUser(userId: string): Promise<Result<UserNodeProgress[]>> {
    const list = Array.from(this.progressMap.values()).filter((p) => p.userId === userId);
    return ok(list);
  }

  async updateProgress(command: ProgressUpdateCommand): Promise<Result<UserNodeProgress>> {
    const k = this.key(command.userId, command.nodeId);
    const existing = this.progressMap.get(k);

    const updated: UserNodeProgress = {
      id: existing?.id || `prog_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: command.userId,
      nodeId: command.nodeId,
      status: command.markCompleted ? 'COMPLETED' : 'IN_PROGRESS',
      timeSpentSeconds: (existing?.timeSpentSeconds || 0) + command.timeSpentSecondsDelta,
      completedAt: command.markCompleted ? existing?.completedAt || new Date().toISOString() : undefined,
      lastInteractedAt: new Date().toISOString(),
    };

    this.progressMap.set(k, updated);
    return ok(updated);
  }

  async evaluateQuiz(
    userId: string,
    nodeId: string,
    answers: { questionId: string; selectedOptionIds: string[] }[]
  ): Promise<Result<QuizEvaluationResult>> {
    // Server-side evaluation logic
    // Question 1 correct is opt1_a, Question 2 correct is opt2_b
    const correctMap: Record<string, string> = {
      q1: 'opt1_a',
      q2: 'opt2_b',
    };

    let correctCount = 0;
    const details = answers.map((ans) => {
      const isCorrect = ans.selectedOptionIds.length === 1 && ans.selectedOptionIds[0] === correctMap[ans.questionId];
      if (isCorrect) correctCount++;
      return {
        questionId: ans.questionId,
        isCorrect,
      };
    });

    const scorePercent = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;
    const passed = scorePercent >= 80;

    await this.updateProgress({
      userId,
      nodeId,
      timeSpentSecondsDelta: 300,
      markCompleted: passed,
    });

    return ok({
      attemptId: `att_${Date.now()}`,
      scorePercent,
      passed,
      details,
    });
  }
}

// ---------------------------------------------------------------------------
// 8. Dashboard Profile Adapter
// ---------------------------------------------------------------------------

export class MockDashboardProfileAdapter implements DashboardProfilePort {
  async getProfileForRole(role: DashboardRole): Promise<Result<DashboardProfile>> {
    switch (role) {
      case 'LEARNER':
        return ok({
          id: 'dash_learner_default',
          role: 'LEARNER',
          title: 'Espace Apprenant',
          isDefault: true,
          widgets: [
            { id: 'w1', widgetType: 'RESUME_LEARNING', title: 'Reprendre la formation', sortOrder: 1, colSpan: 2, requiredPermissions: ['learn'] },
            { id: 'w2', widgetType: 'PROGRESS_OVERVIEW', title: 'Progression globale', sortOrder: 2, colSpan: 2, requiredPermissions: ['learn'] },
            { id: 'w3', widgetType: 'UPCOMING_LIVES', title: 'Sessions synchrones avec technicien expert', sortOrder: 3, colSpan: 4, requiredPermissions: ['learn'] },
          ],
        });
      case 'TRAINER':
        return ok({
          id: 'dash_trainer_default',
          role: 'TRAINER',
          title: 'Espace Formateur',
          isDefault: true,
          widgets: [
            { id: 'w4', widgetType: 'COHORT_TRACKER', title: 'Suivi de la promotion Carrières', sortOrder: 1, colSpan: 3, requiredPermissions: ['train'] },
            { id: 'w5', widgetType: 'PENDING_ASSESSMENTS', title: 'Évaluations à certifier', sortOrder: 2, colSpan: 1, requiredPermissions: ['train'] },
          ],
        });
      case 'ADMIN':
        return ok({
          id: 'dash_admin_default',
          role: 'ADMIN',
          title: 'Espace Administration',
          isDefault: true,
          widgets: [
            { id: 'w6', widgetType: 'CONTENT_TREE_EXPLORER', title: 'Explorateur UCT (Arbre Universel)', sortOrder: 1, colSpan: 4, requiredPermissions: ['admin'] },
          ],
        });
      case 'AUDITOR':
        return ok({
          id: 'dash_auditor_default',
          role: 'AUDITOR',
          title: 'Espace Auditeur & Conformité',
          isDefault: true,
          widgets: [
            { id: 'w7', widgetType: 'AUDIT_LOG_STREAM', title: 'Journal d’Audit Immuable', sortOrder: 1, colSpan: 3, requiredPermissions: ['audit'] },
            { id: 'w8', widgetType: 'CERTIFICATE_VAULT', title: 'Attestations délivrées', sortOrder: 2, colSpan: 1, requiredPermissions: ['audit'] },
          ],
        });
    }
  }
}

// ---------------------------------------------------------------------------
// 9. Demonstration Dashboard Definitions (TASK 3)
// ---------------------------------------------------------------------------

export const MOCK_DASHBOARD_DEFINITIONS: Record<DashboardRole, DashboardDefinition> = {
  LEARNER: learnerDashboard,
  TRAINER: trainerDashboard,
  ADMIN: adminDashboard,
  AUDITOR: auditorDashboard,
};
// ---------------------------------------------------------------------------
// 9. Universal Content Tree (UCT) System Model Fixtures
// Strictly recursive ContentNode tree with unlimited depth.
// ---------------------------------------------------------------------------

export const SYSTEM_MODEL_FIXTURES: ContentNode[] = [
  {
    id: 'dom_mines_carrieres',
    parentId: null,
    slug: 'mines-et-carrieres',
    title: 'Mines & Carrières',
    code: 'DOM-MIN',
    nodeType: 'DOMAIN',
    sortOrder: 1,
    status: 'PUBLISHED',
    version: 1,
    metadata: {
      sector: 'Industrie Extractive & Minérale',
      description: 'Socle unifié de formation continue pour l’exploitation des gisements, carrières et usines de transformation.',
      icon: 'pickaxe',
      standards: ['RGIE', 'Norme EN 933', 'Norme EN 1097'],
      responsible: 'Direction Pédagogique DO-Mining',
      allowSubNodes: true,
      visibility: 'PUBLIC',
    },
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z',
    children: [
      {
        id: 'bra_exploitation_carrieres',
        parentId: 'dom_mines_carrieres',
        slug: 'exploitation-des-carrieres',
        title: 'Exploitation des carrières',
        code: 'BRA-CAR',
        nodeType: 'BRANCH',
        sortOrder: 1,
        status: 'PUBLISHED',
        version: 1,
        metadata: {
          active: true,
          description: 'Filière opérationnelle dédiée à l’extraction, au concassage et au traitement des roches massives et alluvionnaires.',
          color: '#08AFC1',
          certified: true,
          estimatedHours: 40,
          allowSubNodes: true,
          visibility: 'PUBLIC',
        },
        createdAt: '2026-01-20T08:00:00Z',
        updatedAt: '2026-09-01T12:00:00Z',
        children: [
          {
            id: 'for_production_granulats',
            parentId: 'bra_exploitation_carrieres',
            slug: 'production-des-granulats',
            title: 'Production des granulats',
            code: 'FOR-GRA-01',
            nodeType: 'FORMATION',
            sortOrder: 1,
            status: 'PUBLISHED',
            version: 2,
            metadata: {
              active: true,
              level: 'Technicien d’exploitation / Chef de carrière',
              targetAudience: 'Opérateurs de concassage, conducteurs d’engins, chefs d’équipe',
              regulatoryCompliance: 'Arrêté carrières du 22 septembre 1994 / RGIE',
              durationHours: 35,
              allowSubNodes: true,
              visibility: 'PUBLIC',
            },
            createdAt: '2026-02-01T08:00:00Z',
            updatedAt: '2026-09-05T14:30:00Z',
            children: [
              {
                id: 'mod_01_chaine_production',
                parentId: 'for_production_granulats',
                slug: 'module-01-chaine-de-production',
                title: 'Module 01 — Chaîne de production',
                code: 'MOD-01',
                nodeType: 'MODULE',
                sortOrder: 1,
                status: 'PUBLISHED',
                version: 1,
                metadata: {
                  objective: 'Vision globale du gisement aux stocks marchands, bilans massiques et débits horaires.',
                  durationMinutes: 180,
                  standards: ['EN 933-1'],
                  equipment: ['Installation fixe de concassage-criblage', 'Bascules de pesage'],
                  allowSubNodes: true,
                  visibility: 'ENROLLED_ONLY',
                },
                createdAt: '2026-02-10T08:00:00Z',
                updatedAt: '2026-09-05T14:30:00Z',
                children: [
                  {
                    id: 'sec_01_synoptique',
                    parentId: 'mod_01_chaine_production',
                    slug: 'section-1-synoptique-des-flux',
                    title: 'Section 1.1 — Synoptique des flux minéraux',
                    code: 'SEC-01-01',
                    nodeType: 'SECTION',
                    sortOrder: 1,
                    status: 'PUBLISHED',
                    version: 1,
                    metadata: {
                      format: 'Schéma P&ID + Vidéo drone 4K',
                      allowSubNodes: true,
                      visibility: 'ENROLLED_ONLY',
                    },
                    createdAt: '2026-02-12T08:00:00Z',
                    updatedAt: '2026-09-05T14:30:00Z',
                    children: [
                      {
                        id: 'les_01_rendement',
                        parentId: 'sec_01_synoptique',
                        slug: 'lecon-1-bilan-matiere',
                        title: 'Leçon 1.1.1 — Bilan matière et coupures',
                        code: 'LES-01-01',
                        nodeType: 'LESSON',
                        sortOrder: 1,
                        status: 'PUBLISHED',
                        version: 1,
                        metadata: {
                          durationMinutes: 45,
                          allowSubNodes: true,
                          visibility: 'ENROLLED_ONLY',
                        },
                        createdAt: '2026-02-15T08:00:00Z',
                        updatedAt: '2026-09-05T14:30:00Z',
                        children: [
                          {
                            id: 'act_01_auto_eval',
                            parentId: 'les_01_rendement',
                            slug: 'activite-auto-evaluation',
                            title: 'Activité — Auto-évaluation des rendements',
                            code: 'ACT-01-01',
                            nodeType: 'ACTIVITY',
                            sortOrder: 1,
                            status: 'PUBLISHED',
                            version: 1,
                            metadata: {
                              passingScore: 80,
                              allowSubNodes: false,
                              visibility: 'ENROLLED_ONLY',
                            },
                            createdAt: '2026-02-15T08:00:00Z',
                            updatedAt: '2026-09-05T14:30:00Z',
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: 'mod_02_decapage',
                parentId: 'for_production_granulats',
                slug: 'module-02-decapage',
                title: 'Module 02 — Décapage',
                code: 'MOD-02',
                nodeType: 'MODULE',
                sortOrder: 2,
                status: 'PUBLISHED',
                version: 1,
                metadata: {
                  objective: 'Découverte des terrains de surface, gestion de la terre végétale et modelage des merlons.',
                  durationMinutes: 210,
                  safetyRule: 'RGIE Titre Véhicules & Pistes, talutage à 45°',
                  equipment: ['Pelle hydraulique 40t', 'Tombereau articulé'],
                  allowSubNodes: true,
                  visibility: 'ENROLLED_ONLY',
                },
                createdAt: '2026-02-12T08:00:00Z',
                updatedAt: '2026-09-05T14:30:00Z',
              },
              {
                id: 'mod_03_extraction',
                parentId: 'for_production_granulats',
                slug: 'module-03-extraction',
                title: 'Module 03 — Extraction',
                code: 'MOD-03',
                nodeType: 'MODULE',
                sortOrder: 3,
                status: 'PUBLISHED',
                version: 1,
                metadata: {
                  objective: 'Abattage mécanique, foration de mines et tirs primaires d’ébranlement.',
                  durationMinutes: 240,
                  safetyRule: 'Périmètre de sécurité 300m, contrôle des fronts de taille',
                  allowSubNodes: true,
                  visibility: 'ENROLLED_ONLY',
                },
                createdAt: '2026-02-14T08:00:00Z',
                updatedAt: '2026-09-05T14:30:00Z',
              },
              {
                id: 'mod_04_transfert',
                parentId: 'for_production_granulats',
                slug: 'module-04-transfert',
                title: 'Module 04 — Transfert',
                code: 'MOD-04',
                nodeType: 'MODULE',
                sortOrder: 4,
                status: 'PUBLISHED',
                version: 1,
                metadata: {
                  objective: 'Roulage en fosse, conception des pistes de circulation et convoyage à bande.',
                  durationMinutes: 180,
                  safetyRule: 'Largeur piste = 3x largeur du plus grand dumper, merlons 1/2 roue',
                  allowSubNodes: true,
                  visibility: 'ENROLLED_ONLY',
                },
                createdAt: '2026-02-16T08:00:00Z',
                updatedAt: '2026-09-05T14:30:00Z',
              },
              {
                id: 'mod_05_concassage',
                parentId: 'for_production_granulats',
                slug: 'module-05-concassage',
                title: 'Module 05 — Concassage',
                code: 'MOD-05',
                nodeType: 'MODULE',
                sortOrder: 5,
                status: 'PUBLISHED',
                version: 1,
                metadata: {
                  objective: 'Concasseurs à mâchoires, giratoires, à percussion et broyeurs à cône.',
                  durationMinutes: 270,
                  standards: ['Rapport de réduction k', 'Indice de concassage'],
                  allowSubNodes: true,
                  visibility: 'ENROLLED_ONLY',
                },
                createdAt: '2026-02-18T08:00:00Z',
                updatedAt: '2026-09-05T14:30:00Z',
              },
              {
                id: 'mod_06_criblage_lavage',
                parentId: 'for_production_granulats',
                slug: 'module-06-criblage-et-lavage',
                title: 'Module 06 — Criblage & lavage',
                code: 'MOD-06',
                nodeType: 'MODULE',
                sortOrder: 6,
                status: 'PUBLISHED',
                version: 1,
                metadata: {
                  objective: 'Séparation granulométrique par toiles vibrantes, hydrocyclones et décantation des boues.',
                  durationMinutes: 240,
                  standards: ['NF EN 933-1', 'Equivalent de sable SE'],
                  allowSubNodes: true,
                  visibility: 'ENROLLED_ONLY',
                },
                createdAt: '2026-02-20T08:00:00Z',
                updatedAt: '2026-09-05T14:30:00Z',
              },
              {
                id: 'mod_07_classification',
                parentId: 'for_production_granulats',
                slug: 'module-07-classification',
                title: 'Module 07 — Classification',
                code: 'MOD-07',
                nodeType: 'MODULE',
                sortOrder: 7,
                status: 'PUBLISHED',
                version: 1,
                metadata: {
                  objective: 'Classification d/D normalisée (sables 0/4, gravillons 4/10, 10/20, graves 0/31.5).',
                  durationMinutes: 200,
                  standards: ['NF P 18-545', 'NF EN 13043', 'NF EN 12620'],
                  allowSubNodes: true,
                  visibility: 'ENROLLED_ONLY',
                },
                createdAt: '2026-02-22T08:00:00Z',
                updatedAt: '2026-09-05T14:30:00Z',
              },
              {
                id: 'mod_08_cas_integre',
                parentId: 'for_production_granulats',
                slug: 'module-08-cas-integre',
                title: 'Module 08 — Cas intégré',
                code: 'MOD-08',
                nodeType: 'MODULE',
                sortOrder: 8,
                status: 'PUBLISHED',
                version: 1,
                metadata: {
                  objective: 'Simulation de pilotage d’une carrière de roche massive : incidents, calibrage et expédition.',
                  durationMinutes: 300,
                  evaluationType: 'Étude de cas certifiante',
                  allowSubNodes: true,
                  visibility: 'ENROLLED_ONLY',
                },
                createdAt: '2026-02-24T08:00:00Z',
                updatedAt: '2026-09-05T14:30:00Z',
              },
            ],
          },
        ],
      },
      // BRANCHES FUTURES NON ACTIVES
      {
        id: 'bra_forage',
        parentId: 'dom_mines_carrieres',
        slug: 'forage',
        title: 'Forage',
        code: 'BRA-FOR',
        nodeType: 'BRANCH',
        sortOrder: 2,
        status: 'DRAFT',
        version: 1,
        metadata: {
          active: false,
          futureBranch: true,
          roadmapQuarter: 'T1 2027',
          description: 'Techniques de foration en carrières et mines (fond de trou, marteau hors du trou, carottage).',
          verticalType: 'Exploitation amont',
          allowSubNodes: true,
          visibility: 'RESTRICTED',
        },
        createdAt: '2026-03-01T08:00:00Z',
        updatedAt: '2026-03-01T08:00:00Z',
      },
      {
        id: 'bra_minage',
        parentId: 'dom_mines_carrieres',
        slug: 'minage',
        title: 'Minage',
        code: 'BRA-MIN',
        nodeType: 'BRANCH',
        sortOrder: 3,
        status: 'DRAFT',
        version: 1,
        metadata: {
          active: false,
          futureBranch: true,
          roadmapQuarter: 'T2 2027',
          description: 'Plans de tir, détonique, explosifs civils (ANFO, émulsions, détonateurs électroniques) et vibrations.',
          verticalType: 'Spécialisation haute criticité',
          allowSubNodes: true,
          visibility: 'RESTRICTED',
        },
        createdAt: '2026-03-01T08:00:00Z',
        updatedAt: '2026-03-01T08:00:00Z',
      },
      {
        id: 'bra_qhse',
        parentId: 'dom_mines_carrieres',
        slug: 'qhse',
        title: 'QHSE',
        code: 'BRA-QHS',
        nodeType: 'BRANCH',
        sortOrder: 4,
        status: 'DRAFT',
        version: 1,
        metadata: {
          active: false,
          futureBranch: true,
          roadmapQuarter: 'T3 2027',
          description: 'Règlement Général des Industries Extractives (RGIE), poussières de silice alvéolaire, plans de prévention.',
          verticalType: 'Transversal réglementaire',
          allowSubNodes: true,
          visibility: 'RESTRICTED',
        },
        createdAt: '2026-03-01T08:00:00Z',
        updatedAt: '2026-03-01T08:00:00Z',
      },
      {
        id: 'bra_maintenance',
        parentId: 'dom_mines_carrieres',
        slug: 'maintenance',
        title: 'Maintenance',
        code: 'BRA-MAI',
        nodeType: 'BRANCH',
        sortOrder: 5,
        status: 'DRAFT',
        version: 1,
        metadata: {
          active: false,
          futureBranch: true,
          roadmapQuarter: 'T4 2027',
          description: 'Maintenance prédictive et curative des engins de terrassement et des installations de concassage-criblage.',
          verticalType: 'Support mécanique',
          allowSubNodes: true,
          visibility: 'RESTRICTED',
        },
        createdAt: '2026-03-01T08:00:00Z',
        updatedAt: '2026-03-01T08:00:00Z',
      },
      {
        id: 'bra_topographie',
        parentId: 'dom_mines_carrieres',
        slug: 'topographie',
        title: 'Topographie',
        code: 'BRA-TOP',
        nodeType: 'BRANCH',
        sortOrder: 6,
        status: 'DRAFT',
        version: 1,
        metadata: {
          active: false,
          futureBranch: true,
          roadmapQuarter: 'T1 2028',
          description: 'Photogrammétrie par drone, LiDAR aéroporté, calcul des cubatures de fronts et suivi de réaménagement.',
          verticalType: 'Géoréférencement et métrologie',
          allowSubNodes: true,
          visibility: 'RESTRICTED',
        },
        createdAt: '2026-03-01T08:00:00Z',
        updatedAt: '2026-03-01T08:00:00Z',
      },
    ],
  },
];


export * from './dashboards.js';
