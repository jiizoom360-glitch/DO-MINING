/**
 * DO-Mining Database Primitives & Schema Contracts
 * Aligned with PostgreSQL / Supabase as defined in ADR-002.
 * Strictly no active external network connection required for Phase 1.
 */

import type { ContentNode, ContentRevision, UserNodeProgress, AuditEvent, Result } from '@do-mining/core';

export const TABLES = {
  CONTENT_NODES: 'content_nodes',
  CONTENT_REVISIONS: 'content_revisions',
  USER_NODE_PROGRESS: 'user_node_progress',
  QUIZ_ATTEMPTS: 'quiz_attempts',
  LIVE_SESSIONS: 'live_sessions',
  AUDIT_LOGS: 'audit_logs',
  CATALOG_OFFERINGS: 'catalog_offerings',
  USER_ENTITLEMENTS: 'user_entitlements',
  DASHBOARD_PROFILES: 'dashboard_profiles',
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];

/**
 * Interface pour le futur client de base de données relationnelle (PostgreSQL / Supabase)
 */
export interface DatabaseClientPort {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<Result<T[]>>;
  transaction<T>(work: (client: DatabaseClientPort) => Promise<Result<T>>): Promise<Result<T>>;
}

/**
 * Requête CTE récursive pour extraire un sous-arbre de l'arbre universel (UCT)
 */
export const RECURSIVE_TREE_SQL = `
WITH RECURSIVE content_subtree AS (
  SELECT id, parent_id, slug, title, code, node_type, sort_order, status, version, metadata, created_at, updated_at, 1 as depth
  FROM content_nodes
  WHERE id = $1
  UNION ALL
  SELECT c.id, c.parent_id, c.slug, c.title, c.code, c.node_type, c.sort_order, c.status, c.version, c.metadata, c.created_at, c.updated_at, s.depth + 1
  FROM content_nodes c
  INNER JOIN content_subtree s ON c.parent_id = s.id
  WHERE s.depth < 50
)
SELECT * FROM content_subtree ORDER BY depth ASC, sort_order ASC;
`;

/**
 * Utilitaires de conversion entre snake_case DB et camelCase TypeScript
 */
export function mapDbNodeToDomain(row: Record<string, unknown>): ContentNode {
  return {
    id: String(row.id),
    parentId: row.parent_id ? String(row.parent_id) : null,
    slug: String(row.slug),
    title: String(row.title),
    code: row.code ? String(row.code) : undefined,
    nodeType: row.node_type as ContentNode['nodeType'],
    sortOrder: Number(row.sort_order || 0),
    status: row.status as ContentNode['status'],
    version: Number(row.version || 1),
    metadata: (row.metadata as Record<string, unknown>) || {},
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: String(row.updated_at || new Date().toISOString()),
  };
}

export function mapDbRevisionToDomain(row: Record<string, unknown>): ContentRevision {
  return {
    id: String(row.id),
    nodeId: String(row.node_id),
    revisionNumber: Number(row.revision_number),
    contentType: row.content_type as ContentRevision['contentType'],
    body: row.body ? String(row.body) : undefined,
    storageKey: row.storage_key ? String(row.storage_key) : undefined,
    durationMinutes: row.duration_minutes ? Number(row.duration_minutes) : undefined,
    checksumSha256: String(row.checksum_sha256),
    isLatest: Boolean(row.is_latest),
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

export function mapDbProgressToDomain(row: Record<string, unknown>): UserNodeProgress {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    nodeId: String(row.node_id),
    status: row.status as UserNodeProgress['status'],
    scorePercent: row.score_percent !== undefined && row.score_percent !== null ? Number(row.score_percent) : undefined,
    timeSpentSeconds: Number(row.time_spent_seconds || 0),
    completedAt: row.completed_at ? String(row.completed_at) : undefined,
    lastInteractedAt: String(row.last_interacted_at || new Date().toISOString()),
  };
}
