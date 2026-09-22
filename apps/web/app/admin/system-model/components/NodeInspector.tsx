"use client";

import React, { useState } from "react";
import type { ContentNode } from "@do-mining/core";
import { Badge, Button, Card } from "@do-mining/ui";
import {
  Layers,
  GitBranch,
  FolderTree,
  FileText,
  Clock,
  Eye,
  Settings,
  Code2,
  Shield,
  Plus,
  Copy,
  Move,
  Archive,
  Send,
  CornerDownRight,
  ExternalLink,
  Check,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { getNodeTypeConfig } from "./ContentTree";
import type { SystemModelActionType } from "./ActionSimulationModal";

export interface NodeInspectorProps {
  node: ContentNode | null;
  parentNode: ContentNode | null;
  ancestors: ContentNode[];
  onSelectNode: (node: ContentNode) => void;
  onTriggerAction: (
    actionType: SystemModelActionType,
    targetNode: ContentNode,
  ) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  parentNode,
  ancestors,
  onSelectNode,
  onTriggerAction,
}) => {
  const [metadataView, setMetadataView] = useState<"STRUCTURED" | "RAW_JSON">(
    "STRUCTURED",
  );
  const [hasCopiedJson, setHasCopiedJson] = useState(false);

  if (!node) {
    return (
      <div className="bg-dm-white rounded-2xl border border-dm-border p-8 text-center text-dm-muted space-y-3">
        <div className="w-12 h-12 rounded-xl bg-dm-surface mx-auto flex items-center justify-center text-dm-muted">
          <FolderTree className="w-6 h-6" />
        </div>
        <div className="font-semibold text-sm text-dm-ink">
          Aucun nœud sélectionné
        </div>
        <p className="text-xs text-dm-muted max-w-xs mx-auto">
          Sélectionnez n’importe quel nœud dans l’arbre hiérarchique pour
          inspecter ses propriétés, métadonnées et actions.
        </p>
      </div>
    );
  }

  const typeConfig = getNodeTypeConfig(node.nodeType);
  const IconComponent = typeConfig.icon;

  const isFutureBranch =
    node.nodeType === "BRANCH" &&
    (node.metadata?.futureBranch === true ||
      node.metadata?.active === false ||
      node.status === "DRAFT");

  const handleCopyJson = () => {
    const payload = JSON.stringify(node, null, 2);
    navigator.clipboard.writeText(payload);
    setHasCopiedJson(true);
    setTimeout(() => setHasCopiedJson(false), 2000);
  };

  const getVisibilityLabel = () => {
    const v = node.metadata?.visibility as string | undefined;
    if (v === "PUBLIC")
      return { label: "Catalogue Public", badgeVariant: "success" as const };
    if (v === "ENROLLED_ONLY")
      return {
        label: "Réservé aux inscrits",
        badgeVariant: "primary" as const,
      };
    if (v === "RESTRICTED" || isFutureBranch)
      return { label: "Restreint / Roadmap", badgeVariant: "warning" as const };
    return { label: "Public par défaut", badgeVariant: "neutral" as const };
  };

  const visibilityInfo = getVisibilityLabel();

  return (
    <div className="space-y-4" id="node-inspector-panel">
      {/* 1. Header Card with Title & Breadcrumbs */}
      <div className="bg-dm-white rounded-2xl border border-dm-border p-5 shadow-subtle space-y-3.5">
        {/* Hierarchical Breadcrumb Path */}
        <div className="flex items-center gap-1.5 text-[11px] text-dm-muted flex-wrap pb-2 border-b border-dm-border/50">
          {ancestors.map((anc, idx) => (
            <React.Fragment key={anc.id}>
              <button
                type="button"
                onClick={() => onSelectNode(anc)}
                className="hover:text-dm-primary hover:underline transition-colors font-medium truncate max-w-[120px]"
                title={anc.title}
              >
                {anc.title}
              </button>
              <span className="text-dm-muted/50">/</span>
            </React.Fragment>
          ))}
          <span
            className="font-semibold text-dm-ink truncate max-w-[160px]"
            title={node.title}
          >
            {node.title}
          </span>
        </div>

        {/* Node Main Banner */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${typeConfig.colorClass}`}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={typeConfig.badgeVariant} size="sm">
                  {typeConfig.label}
                </Badge>
                {node.code && (
                  <span className="font-mono text-[11px] text-dm-muted bg-dm-surface border border-dm-border/70 px-2 py-0.5 rounded-md font-semibold">
                    {node.code}
                  </span>
                )}
                {isFutureBranch && (
                  <Badge variant="warning" size="sm" dot>
                    Branche future (Roadmap)
                  </Badge>
                )}
              </div>
              <h2 className="text-base font-bold text-dm-ink tracking-tight mt-1">
                {node.title}
              </h2>
            </div>
          </div>

          <Badge
            variant={
              node.status === "PUBLISHED"
                ? "success"
                : node.status === "ARCHIVED"
                  ? "neutral"
                  : "outline"
            }
            size="md"
          >
            {node.status}
          </Badge>
        </div>

        {/* Quick actions button row */}
        <div className="pt-2 border-t border-dm-border/60 flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onTriggerAction("ADD_CHILD", node)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add child
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTriggerAction("DUPLICATE_BRANCH", node)}
            leftIcon={<Copy className="w-3.5 h-3.5" />}
          >
            Duplicate branch
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTriggerAction("MOVE_NODE", node)}
            leftIcon={<Move className="w-3.5 h-3.5" />}
          >
            Move
          </Button>
          {node.status !== "ARCHIVED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTriggerAction("ARCHIVE_NODE", node)}
              leftIcon={<Archive className="w-3.5 h-3.5" />}
            >
              Archive
            </Button>
          )}
          {node.status !== "PUBLISHED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTriggerAction("PUBLISH_NODE", node)}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* 2. Structured Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Section: Type */}
        <div className="bg-dm-white rounded-xl border border-dm-border p-4 shadow-subtle space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-dm-ink uppercase tracking-wider text-[10px] text-dm-muted">
            <Layers className="w-3.5 h-3.5 text-dm-primary" />
            <span>Type Sémantique UCT</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs font-bold text-dm-ink">
              {node.nodeType}
            </span>
            <span className="text-[11px] text-dm-muted">
              {node.nodeType === "DOMAIN"
                ? "Racine souveraine multi-métiers"
                : node.nodeType === "BRANCH"
                  ? "Filière d’expertise industrielle"
                  : node.nodeType === "FORMATION"
                    ? "Parcours de qualification certifiant"
                    : node.nodeType === "MODULE"
                      ? "Unité d’enseignement autonome"
                      : node.nodeType === "SECTION"
                        ? "Regroupement opérationnel"
                        : node.nodeType === "LESSON"
                          ? "Fiche technique pédagogique"
                          : "Activité pratique & ressource"}
            </span>
          </div>
          <div className="text-[11px] text-dm-muted bg-dm-surface/60 p-2 rounded-lg leading-relaxed">
            Position UCT : rang{" "}
            <span className="font-mono font-semibold text-dm-ink">
              #{node.sortOrder}
            </span>{" "}
            dans la fratrie directe.
          </div>
        </div>

        {/* Section: Parent */}
        <div className="bg-dm-white rounded-xl border border-dm-border p-4 shadow-subtle space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-dm-ink uppercase tracking-wider text-[10px] text-dm-muted">
            <CornerDownRight className="w-3.5 h-3.5 text-dm-primary" />
            <span>Nœud Parent</span>
          </div>
          {parentNode ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-xs font-semibold text-dm-ink truncate"
                  title={parentNode.title}
                >
                  {parentNode.title}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectNode(parentNode)}
                  className="text-[11px] text-dm-primary hover:underline font-medium shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspecter</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="font-mono text-[10px] text-dm-muted truncate bg-dm-surface/60 p-1.5 rounded">
                ID: {parentNode.id}
              </div>
            </div>
          ) : (
            <div className="text-xs text-dm-muted bg-dm-surface/60 p-2.5 rounded-lg flex items-center gap-2">
              <Shield className="w-4 h-4 text-dm-primary shrink-0" />
              <span>Nœud racine souverain (aucun parent supérieur)</span>
            </div>
          )}
        </div>

        {/* Section: Status & Version */}
        <div className="bg-dm-white rounded-xl border border-dm-border p-4 shadow-subtle space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-dm-ink uppercase tracking-wider text-[10px] text-dm-muted">
            <Clock className="w-3.5 h-3.5 text-dm-primary" />
            <span>Cycle de Vie & Version</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  node.status === "PUBLISHED"
                    ? "success"
                    : node.status === "ARCHIVED"
                      ? "neutral"
                      : "outline"
                }
                size="sm"
              >
                {node.status}
              </Badge>
              <span className="font-mono text-xs text-dm-muted">
                v{node.version}.0
              </span>
            </div>
            <span className="text-[10px] text-dm-muted">Immuable SHA-256</span>
          </div>
          <div className="text-[11px] text-dm-muted space-y-0.5">
            <div>
              Créé :{" "}
              <span className="font-mono text-dm-ink">
                {new Date(node.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div>
              Mis à jour :{" "}
              <span className="font-mono text-dm-ink">
                {new Date(node.updatedAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        </div>

        {/* Section: Visibility */}
        <div className="bg-dm-white rounded-xl border border-dm-border p-4 shadow-subtle space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-dm-ink uppercase tracking-wider text-[10px] text-dm-muted">
            <Eye className="w-3.5 h-3.5 text-dm-primary" />
            <span>Visibilité & Accès</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={visibilityInfo.badgeVariant} size="sm">
              {visibilityInfo.label}
            </Badge>
          </div>
          <div className="text-[11px] text-dm-muted leading-relaxed">
            {isFutureBranch ? (
              <span className="text-amber-800">
                Branche non active — En cours d&apos;ingénierie pédagogique.
                Accessible aux administrateurs uniquement.
              </span>
            ) : (
              <span>
                Actif en production. Intégré aux calculs de progression et
                matrices d&apos;assiduité.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Metadata Inspector Card */}
      <div className="bg-dm-white rounded-xl border border-dm-border p-4 shadow-subtle space-y-3">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-dm-border/60">
          <div className="flex items-center gap-2 text-xs font-bold text-dm-ink uppercase tracking-wider text-[10px] text-dm-muted">
            <FileText className="w-3.5 h-3.5 text-dm-primary" />
            <span>Métadonnées Métier (Metadata)</span>
          </div>
          <div className="flex items-center gap-1 bg-dm-surface p-0.5 rounded-lg border border-dm-border/60 text-[11px]">
            <button
              type="button"
              onClick={() => setMetadataView("STRUCTURED")}
              className={`px-2 py-1 rounded-md transition-all ${
                metadataView === "STRUCTURED"
                  ? "bg-dm-white text-dm-ink font-semibold shadow-2xs"
                  : "text-dm-muted hover:text-dm-ink"
              }`}
            >
              Propriétés
            </button>
            <button
              type="button"
              onClick={() => setMetadataView("RAW_JSON")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                metadataView === "RAW_JSON"
                  ? "bg-dm-white text-dm-ink font-semibold shadow-2xs"
                  : "text-dm-muted hover:text-dm-ink"
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {metadataView === "STRUCTURED" ? (
          <div className="space-y-2 text-xs">
            {Object.keys(node.metadata || {}).length === 0 ? (
              <div className="text-dm-muted text-center py-3 italic text-[11px]">
                Aucune métadonnée spécifique attachée à ce nœud.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(node.metadata || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-2 bg-dm-surface/60 rounded-lg border border-dm-border/40 flex flex-col justify-between"
                  >
                    <span className="font-mono text-[10px] text-dm-muted uppercase tracking-wider">
                      {key}
                    </span>
                    <span className="font-medium text-dm-ink mt-0.5 text-xs break-words">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto max-h-60">
              {JSON.stringify(node, null, 2)}
            </pre>
            <button
              type="button"
              onClick={handleCopyJson}
              className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition-colors"
            >
              {hasCopiedJson ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 4. Settings & Governance Card */}
      <div className="bg-dm-white rounded-xl border border-dm-border p-4 shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-dm-ink uppercase tracking-wider text-[10px] text-dm-muted pb-2 border-b border-dm-border/60">
          <Settings className="w-3.5 h-3.5 text-dm-primary" />
          <span>Paramètres Système & Contrats (Settings)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] text-dm-muted font-medium">
              Identifiant unique (UUID / Key)
            </span>
            <div className="font-mono text-[11px] text-dm-ink bg-dm-surface p-1.5 rounded border border-dm-border/50 truncate">
              {node.id}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-dm-muted font-medium">
              Slug canonique
            </span>
            <div className="font-mono text-[11px] text-dm-ink bg-dm-surface p-1.5 rounded border border-dm-border/50 truncate">
              /{node.slug}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-dm-muted font-medium">
              Autoriser l’ajout de sous-nœuds
            </span>
            <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 p-1.5 rounded">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Récursivité libre activée</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-dm-muted font-medium">
              Politique d’héritage
            </span>
            <div className="font-mono text-[11px] text-dm-ink bg-dm-surface p-1.5 rounded border border-dm-border/50">
              CASCADE_COMPLIANCE (RGIE)
            </div>
          </div>
        </div>

        {/* Doctrine Guarantee Callout */}
        <div className="p-3 bg-dm-primary-soft/40 border border-dm-primary/30 rounded-xl flex items-start gap-2 text-xs text-dm-primary-deep">
          <Info className="w-4 h-4 shrink-0 text-dm-primary mt-0.5" />
          <p className="leading-relaxed text-[11px] text-dm-primary-deep">
            <strong>Doctrine DO-Mining :</strong> L’UCT ne présume jamais
            d&apos;une profondeur fixe <em>Course → Module → Lesson</em>.
            N&apos;importe quelle branche peut accueillir des enfants à
            l&apos;infini.
          </p>
        </div>
      </div>
    </div>
  );
};
