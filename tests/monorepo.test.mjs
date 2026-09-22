import { test } from 'node:test';
import assert from 'node:assert';
import { getServerEnv, getPublicEnv } from '../packages/config/dist/index.js';
import { ok, fail } from '../packages/core/dist/index.js';
import { MockContentRepositoryAdapter } from '../packages/mocks/dist/index.js';
import { TOKENS } from '../packages/ui/dist/index.js';

test('Core Result primitives work as expected', () => {
  const successRes = ok({ name: 'Carrières' });
  assert.strictEqual(successRes.success, true);
  assert.deepStrictEqual(successRes.data, { name: 'Carrières' });

  const failRes = fail({ code: 'NOT_FOUND', message: 'Node not found' });
  assert.strictEqual(failRes.success, false);
  assert.strictEqual(failRes.error.code, 'NOT_FOUND');
});

test('Config loader defaults to mock modes', () => {
  // Save process.env
  const oldEnv = process.env;
  
  process.env = {};
  
  const serverEnv = getServerEnv();
  const publicEnv = getPublicEnv();

  assert.strictEqual(serverEnv.STORAGE_MODE, 'mock');
  assert.strictEqual(serverEnv.INTEGRATION_MODE, 'mock');
  assert.strictEqual(serverEnv.LIVE_SESSION_MODE, 'manual'); // Note: manual is default for this according to index.ts

  process.env = oldEnv;
});

test('Mock Content Repository initializes Carrières & Granulats tree', async () => {
  const repo = new MockContentRepositoryAdapter();
  const treeRes = await repo.getTree();
  assert.strictEqual(treeRes.success, true);
  assert.ok(treeRes.data.length >= 10, 'Should contain domain, branch, formation, module, and lessons');
});

test('UI Design Tokens have all official brand colors', () => {
  assert.strictEqual(TOKENS.colors.primary, '#08AFC1');
  assert.strictEqual(TOKENS.colors.primaryDeep, '#075A70');
  assert.strictEqual(TOKENS.colors.primarySoft, '#DDF8FA');
  assert.strictEqual(TOKENS.colors.accent, '#F4C542');
  assert.strictEqual(TOKENS.colors.white, '#FFFFFF');
  assert.strictEqual(TOKENS.colors.ink, '#12242B');
  assert.strictEqual(TOKENS.colors.muted, '#667A82');
  assert.strictEqual(TOKENS.colors.surface, '#F5FAFB');
  assert.strictEqual(TOKENS.colors.border, '#DCE7EA');
});
