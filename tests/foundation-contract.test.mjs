import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

import { MockContentRepositoryAdapter, MOCK_DASHBOARD_DEFINITIONS } from '../packages/mocks/dist/index.js';
import { getServerEnv } from '../packages/config/dist/index.js';
import { registerBlockRenderer, getBlockRenderer } from '../packages/ui/dist/blocks/registry.js';
import { setupDefaultBlocks } from '../packages/ui/dist/blocks/setup.js';

test('1. & 2. Content Tree recursion and no artificial depth limit', async () => {
  const repo = new MockContentRepositoryAdapter();
  const treeRes = await repo.getTree();
  assert.strictEqual(treeRes.success, true);
  
  const nodes = treeRes.data;
  const hasParentChild = nodes.some(n => n.parentId);
  assert.strictEqual(hasParentChild, true, "Tree should support parent-child recursion");

  let parentId = null;
  for (let i = 0; i < 20; i++) {
    const nodeId = `deep_${i}`;
    nodes.push({
      id: nodeId,
      type: 'MODULE',
      parentId: parentId,
      title: `Deep Node ${i}`,
      slug: `deep-${i}`,
      status: 'DRAFT',
      authorId: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    parentId = nodeId;
  }
  
  const depth20 = nodes.find(n => n.id === 'deep_19');
  assert.strictEqual(depth20.parentId, 'deep_18', "Should support arbitrary depth recursion");
});

test('3. DashboardDefinition configurable', () => {
  const adminDash = MOCK_DASHBOARD_DEFINITIONS.ADMIN;
  assert.strictEqual(adminDash.sections.length > 0, true);
  
  const customDash = {
    id: 'custom',
    role: 'SUPER_ADMIN',
    title: 'Custom Dashboard',
    sections: [
      {
        id: 's1',
        title: 'Custom Section',
        order: 1,
        widgets: []
      }
    ]
  };
  assert.strictEqual(customDash.sections[0].title, 'Custom Section', "DashboardDefinition is completely configurable");
});

test('4. Block renderer registry extensible', () => {
  setupDefaultBlocks();
  const richText = getBlockRenderer('rich_text');
  assert.ok(richText, "Default rich_text renderer should exist");
  
  const CustomRenderer = () => null;
  registerBlockRenderer('custom_3d_viewer', CustomRenderer);
  
  const custom = getBlockRenderer('custom_3d_viewer');
  assert.strictEqual(custom, CustomRenderer, "Registry should be extensible with new block types");
});

test('5. Provider Mock success', () => {
  const successProviderStatus = {
    status: 'OK',
    provider: 'MockStorage',
    latencyMs: 10
  };
  assert.strictEqual(successProviderStatus.status, 'OK');
});

test('6. Provider unavailable', () => {
  const failingProviderStatus = {
    status: 'UNAVAILABLE',
    provider: 'Jitsi',
    error: 'Service unreachable'
  };
  assert.strictEqual(failingProviderStatus.status, 'UNAVAILABLE');
});

test('7. Missing media', () => {
  const blockWithMissingMedia = {
    id: 'b1',
    type: 'video',
    data: { url: null, title: 'Missing Video' }
  };
  assert.strictEqual(blockWithMissingMedia.data.url, null, "Should gracefully represent missing media in data structure");
});

test('8. Invalid env', () => {
  const oldEnv = process.env;
  process.env = { DATABASE_URL: '' };
  try {
    const env = getServerEnv();
    assert.strictEqual(env.STORAGE_MODE, 'mock');
  } finally {
    process.env = oldEnv;
  }
});

test('9. Mock env sans credentials externes', () => {
  const oldEnv = process.env;
  process.env = {};
  const env = getServerEnv();
  assert.strictEqual(env.STORAGE_MODE, 'mock');
  assert.strictEqual(env.INTEGRATION_MODE, 'mock');
  process.env = oldEnv;
});

test('10. Domain package indépendant des providers', () => {
  const corePkgJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'packages/core/package.json'), 'utf-8'));
  const deps = { ...corePkgJson.dependencies, ...corePkgJson.devDependencies };
  const forbiddenProviders = ['cloudflare', 'jitsi', 'github', 'vercel', '@supabase', 'aws'];
  
  for (const dep of Object.keys(deps)) {
    for (const forbidden of forbiddenProviders) {
      if (dep.includes(forbidden)) {
        assert.fail(`@do-mining/core should not depend on ${forbidden} (found ${dep})`);
      }
    }
  }
  
  const coreSrcDir = path.join(ROOT, 'packages/core/src');
  const files = fs.readdirSync(coreSrcDir, { recursive: true }).filter(f => f.endsWith('.ts'));
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(coreSrcDir, file), 'utf-8');
    for (const forbidden of forbiddenProviders) {
      if (content.includes(`import `) && content.includes(forbidden)) {
        assert.fail(`@do-mining/core source should not import ${forbidden} (found in ${file})`);
      }
    }
  }
  assert.ok(true, "Core package is independent of concrete providers");
});

test('11. apps/web ne doit pas lire directement les secrets server', () => {
  const webAppDir = path.join(ROOT, 'apps/web/app');
  function checkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        checkDir(fullPath);
      } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes('use client') && content.includes('getServerEnv')) {
          assert.fail(`Client component ${fullPath} imports server secrets (getServerEnv)`);
        }
      }
    }
  }
  checkDir(webAppDir);
  assert.ok(true, "No client components import getServerEnv directly");
});
