import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import {
  ProviderUnavailableError,
  ProviderConfigurationError,
  ResourceNotFoundError,
  UnsupportedOperationError,
  normalizeProviderMode,
} from '../packages/contracts/dist/index.js';

import {
  MockStorageAdapter,
  ManualStorageAdapter,
  RealStorageAdapter,
  MockLiveSessionAdapter,
  ManualLiveSessionAdapter,
  RealLiveSessionAdapter,
  MockDeploymentAdapter,
  ManualDeploymentAdapter,
  RealDeploymentAdapter,
  MockRepositoryAdapter,
  ManualRepositoryAdapter,
  RealRepositoryAdapter,
  MockDnsAdapter,
  ManualDnsAdapter,
  RealDnsAdapter,
  MockNotificationAdapter,
  ManualNotificationAdapter,
  RealNotificationAdapter,
  createStoragePort,
  createLiveSessionPort,
  createDeploymentPort,
  createRepositoryPort,
  createDnsPort,
  createNotificationPort,
} from '../packages/mocks/dist/index.js';

// ---------------------------------------------------------------------------
// 1. STOP CONDITION: packages/core & packages/contracts Isolation Verification
// ---------------------------------------------------------------------------

test('STOP CONDITION: packages/core contains zero provider brand names', () => {
  const coreFile = path.resolve('packages/core/src/index.ts');
  const content = fs.readFileSync(coreFile, 'utf8');
  const bannedKeywords = ['cloudflare', 'jitsi', 'github', 'vercel', 'hostinger'];

  for (const keyword of bannedKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    assert.strictEqual(
      regex.test(content),
      false,
      `packages/core must not contain provider brand "${keyword}"`
    );
  }
});

test('STOP CONDITION: packages/contracts contains zero provider brand names', () => {
  const contractsFile = path.resolve('packages/contracts/src/index.ts');
  const content = fs.readFileSync(contractsFile, 'utf8');
  const bannedKeywords = ['cloudflare', 'jitsi', 'github', 'vercel', 'hostinger'];

  for (const keyword of bannedKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    assert.strictEqual(
      regex.test(content),
      false,
      `packages/contracts must not contain provider brand "${keyword}"`
    );
  }
});

// ---------------------------------------------------------------------------
// 2. Common Typed Error Classes
// ---------------------------------------------------------------------------

test('Typed errors instantiate properly with expected codes and details', () => {
  const errUnavail = new ProviderUnavailableError('Network down', { retryAfterSeconds: 30 });
  assert.strictEqual(errUnavail.name, 'ProviderUnavailableError');
  assert.strictEqual(errUnavail.code, 'PROVIDER_UNAVAILABLE');
  assert.strictEqual(errUnavail.message, 'Network down');
  assert.deepStrictEqual(errUnavail.details, { retryAfterSeconds: 30 });
  assert.ok(errUnavail instanceof Error);

  const errConfig = new ProviderConfigurationError('Missing credentials');
  assert.strictEqual(errConfig.name, 'ProviderConfigurationError');
  assert.strictEqual(errConfig.code, 'PROVIDER_CONFIGURATION_ERROR');

  const errNotFound = new ResourceNotFoundError('Object "video.mp4" not found');
  assert.strictEqual(errNotFound.name, 'ResourceNotFoundError');
  assert.strictEqual(errNotFound.code, 'RESOURCE_NOT_FOUND');

  const errUnsupported = new UnsupportedOperationError('Real provider not implemented');
  assert.strictEqual(errUnsupported.name, 'UnsupportedOperationError');
  assert.strictEqual(errUnsupported.code, 'UNSUPPORTED_OPERATION');
});

test('Provider mode normalizer handles lowercase, uppercase, and default', () => {
  assert.strictEqual(normalizeProviderMode('MOCK'), 'mock');
  assert.strictEqual(normalizeProviderMode('manual'), 'manual');
  assert.strictEqual(normalizeProviderMode('REAL'), 'real');
  assert.strictEqual(normalizeProviderMode(undefined), 'mock');
  assert.strictEqual(normalizeProviderMode('invalid'), 'mock');
});

// ---------------------------------------------------------------------------
// 3. StoragePort Contract: put, get, delete, getAccessUrl, head
// ---------------------------------------------------------------------------

test('StoragePort (Mock mode): executes put, head, get, getAccessUrl, and delete in-memory', async () => {
  const storage = new MockStorageAdapter();
  assert.strictEqual(storage.mode, 'mock');

  // 1. put
  const putRes = await storage.put('courses/decapage.md', '# Décapage\nContenu technique', {
    contentType: 'text/markdown',
    metadata: { author: 'Expert Mines' },
  });
  assert.strictEqual(putRes.success, true);
  assert.strictEqual(putRes.data.key, 'courses/decapage.md');
  assert.strictEqual(putRes.data.contentType, 'text/markdown');
  assert.ok(putRes.data.sizeBytes > 0);

  // 2. head
  const headRes = await storage.head('courses/decapage.md');
  assert.strictEqual(headRes.success, true);
  assert.ok(headRes.data !== null);
  assert.strictEqual(headRes.data.key, 'courses/decapage.md');

  // 3. get
  const getRes = await storage.get('courses/decapage.md');
  assert.strictEqual(getRes.success, true);
  assert.strictEqual(getRes.data.data, '# Décapage\nContenu technique');
  assert.strictEqual(getRes.data.metadata.key, 'courses/decapage.md');

  // 4. getAccessUrl
  const urlRes = await storage.getAccessUrl('courses/decapage.md', { expiresInSeconds: 3600 });
  assert.strictEqual(urlRes.success, true);
  assert.ok(urlRes.data.startsWith('https://mock-storage.do-mining.local/download/'));

  // 5. delete
  const delRes = await storage.delete('courses/decapage.md');
  assert.strictEqual(delRes.success, true);

  // 6. get after delete returns failure
  const getAfterDel = await storage.get('courses/decapage.md');
  assert.strictEqual(getAfterDel.success, false);
  assert.strictEqual(getAfterDel.error.code, 'RESOURCE_NOT_FOUND');
});

test('StoragePort (Manual mode): supports manual overrides and asset verification', async () => {
  const storage = new ManualStorageAdapter();
  assert.strictEqual(storage.mode, 'manual');

  storage.setManualUrl('manual/plan.pdf', 'https://manual.assets/plan.pdf');
  const urlRes = await storage.getAccessUrl('manual/plan.pdf');
  assert.strictEqual(urlRes.success, true);
  assert.strictEqual(urlRes.data, 'https://manual.assets/plan.pdf');

  const existRes = await storage.verifyAssetExistence('manual/plan.pdf');
  assert.strictEqual(existRes.success, true);
  assert.strictEqual(existRes.data, true);
});

test('StoragePort (Real mode): explicitly returns unsupported operation', async () => {
  const storage = createStoragePort('real');
  assert.strictEqual(storage.mode, 'real');

  const putRes = await storage.put('file.txt', 'data');
  assert.strictEqual(putRes.success, false);
  assert.strictEqual(putRes.error.code, 'UNSUPPORTED_OPERATION');

  const getRes = await storage.get('file.txt');
  assert.strictEqual(getRes.success, false);
  assert.strictEqual(getRes.error.code, 'UNSUPPORTED_OPERATION');
});

// ---------------------------------------------------------------------------
// 4. LiveSessionPort Contract: schedule, getJoinInfo, getStatus
// ---------------------------------------------------------------------------

test('LiveSessionPort (Mock mode): schedules session and retrieves join info', async () => {
  const live = new MockLiveSessionAdapter('SCHEDULED');
  assert.strictEqual(live.mode, 'mock');

  // 1. schedule
  const scheduleRes = await live.schedule({
    nodeId: 'mod_concassage_01',
    hostUserId: 'user_expert_01',
    title: 'Atelier de concassage primaire',
    scheduledStartTime: '2026-09-20T14:00:00Z',
    durationMinutes: 60,
  });
  assert.strictEqual(scheduleRes.success, true);
  assert.strictEqual(scheduleRes.data.status, 'SCHEDULED');
  assert.ok(scheduleRes.data.roomIdentifier.length > 0);

  // 2. getJoinInfo
  const joinRes = await live.getJoinInfo({
    sessionId: scheduleRes.data.id,
    userId: 'user_learner_10',
    userName: 'Jean Dupont',
    role: 'learner',
  });
  assert.strictEqual(joinRes.success, true);
  assert.strictEqual(joinRes.data.role, 'learner');
  assert.ok(joinRes.data.roomUrl.includes(scheduleRes.data.roomIdentifier));
  assert.ok(joinRes.data.token?.startsWith('mock_token_'));

  // 3. getStatus
  const statusRes = await live.getStatus(scheduleRes.data.id);
  assert.strictEqual(statusRes.success, true);
  assert.strictEqual(statusRes.data.status, 'SCHEDULED');
});

test('LiveSessionPort (Real mode): explicitly returns unsupported operation', async () => {
  const live = createLiveSessionPort('real');
  assert.strictEqual(live.mode, 'real');

  const scheduleRes = await live.schedule({
    nodeId: 'test',
    hostUserId: 'host',
    title: 'Test',
    scheduledStartTime: '2026-09-20T14:00:00Z',
    durationMinutes: 30,
  });
  assert.strictEqual(scheduleRes.success, false);
  assert.strictEqual(scheduleRes.error.code, 'UNSUPPORTED_OPERATION');
});

// ---------------------------------------------------------------------------
// 5. DeploymentPort Contract: getStatus simulation
// ---------------------------------------------------------------------------

test('DeploymentPort: provides status simulation without external calls', async () => {
  const mockDeploy = createDeploymentPort('mock');
  assert.strictEqual(mockDeploy.mode, 'mock');
  const statusRes = await mockDeploy.getStatus('dep-sim-01');
  assert.strictEqual(statusRes.success, true);
  assert.strictEqual(statusRes.data.environment, 'production');
  assert.strictEqual(statusRes.data.state, 'DEPLOYED');

  const manualDeploy = createDeploymentPort('manual');
  assert.strictEqual(manualDeploy.mode, 'manual');
  const manualRes = await manualDeploy.getStatus();
  assert.strictEqual(manualRes.success, true);
  assert.strictEqual(manualRes.data.state, 'BUILDING');

  const realDeploy = createDeploymentPort('real');
  const realRes = await realDeploy.getStatus();
  assert.strictEqual(realRes.success, false);
  assert.strictEqual(realRes.error.code, 'UNSUPPORTED_OPERATION');
});

// ---------------------------------------------------------------------------
// 6. RepositoryPort Contract: getStatus abstraction
// ---------------------------------------------------------------------------

test('RepositoryPort: provides repository status abstraction', async () => {
  const mockRepo = createRepositoryPort('mock');
  assert.strictEqual(mockRepo.mode, 'mock');
  const statusRes = await mockRepo.getStatus();
  assert.strictEqual(statusRes.success, true);
  assert.strictEqual(statusRes.data.branch, 'main');
  assert.strictEqual(statusRes.data.status, 'SYNCED');
  assert.strictEqual(statusRes.data.cleanWorkingTree, true);

  const realRepo = createRepositoryPort('real');
  const realRes = await realRepo.getStatus();
  assert.strictEqual(realRes.success, false);
  assert.strictEqual(realRes.error.code, 'UNSUPPORTED_OPERATION');
});

// ---------------------------------------------------------------------------
// 7. DnsPort Contract: getStatus and getConfig abstraction
// ---------------------------------------------------------------------------

test('DnsPort: provides DNS status and configuration abstraction', async () => {
  const mockDns = createDnsPort('mock');
  assert.strictEqual(mockDns.mode, 'mock');

  const statusRes = await mockDns.getStatus('do-mining.com');
  assert.strictEqual(statusRes.success, true);
  assert.strictEqual(statusRes.data.status, 'ACTIVE');
  assert.strictEqual(statusRes.data.propagated, true);

  const configRes = await mockDns.getConfig('do-mining.com');
  assert.strictEqual(configRes.success, true);
  assert.ok(configRes.data.records.length > 0);
  assert.strictEqual(configRes.data.records[0].type, 'A');

  const realDns = createDnsPort('real');
  const realRes = await realDns.getStatus();
  assert.strictEqual(realRes.success, false);
  assert.strictEqual(realRes.error.code, 'UNSUPPORTED_OPERATION');
});

// ---------------------------------------------------------------------------
// 8. NotificationPort Contract: send abstraction
// ---------------------------------------------------------------------------

test('NotificationPort: handles dispatch in mock mode and fails in real mode', async () => {
  const mockNotif = createNotificationPort('mock');
  assert.strictEqual(mockNotif.mode, 'mock');

  const sendRes = await mockNotif.send({
    recipient: 'apprenant@carrieres.fr',
    subject: 'Confirmation atelier concassage',
    body: 'Votre atelier est confirmé pour demain à 14h.',
    channel: 'EMAIL',
  });
  assert.strictEqual(sendRes.success, true);
  assert.strictEqual(sendRes.data.status, 'SENT');
  assert.ok(sendRes.data.messageId.startsWith('mock_notif_'));

  const realNotif = createNotificationPort('real');
  const realRes = await realNotif.send({
    recipient: 'test@carrieres.fr',
    subject: 'Test',
    body: 'Test',
  });
  assert.strictEqual(realRes.success, false);
  assert.strictEqual(realRes.error.code, 'UNSUPPORTED_OPERATION');
});
