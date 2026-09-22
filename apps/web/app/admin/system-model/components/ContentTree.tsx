"use client";

import React, { useState } from "react";
import type { ContentNode, NodeType } from "@do-mining/core";
import { Badge, Button } from "@do-mining/ui";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Copy,
  Move,
  Archive,
  Send,
  MoreHorizontal,
  FolderTree,
  GitBranch,
  Layers,
  GraduationCap,
  FileText,
  HelpCircle,
  Clock,
  Sparkles,
  Package,
} from "lucide-react";
import type { SystemModelActionType } from "./ActionSimulationModal";

export interface ContentTreeProps {
  nodes: ContentNode[];
  selectedNodeId: string | null;
  expandedNodeIds: Set<string>;
  searchQuery?: string;
  filterMode?: "ALL" | "ACTIVE_ONLY" | "FUTURE_ONLY";
  onSelectNode: (node: ContentNode) => void;
  onToggleExpand: (nodeId: string) => void;
  onTriggerAction: (
    actionType: SystemModelActionType,
    targetNode: ContentNode,
  ) => void;
}

/**
 * Visual styling and iconography per NodeType
 */
export const getNodeTypeConfig = (nodeType: NodeType) => {
  switch (nodeType) {
    case "DOMAIN":
      return {
        label: "DOMAINE",
        badgeVariant: "primary" as const,
        icon: FolderTree,
        colorClass:
          "text-dm-primary-deep bg-dm-primary-soft/80 border-dm-primary/40",
        dotColor: "bg-dm-primary",
      };
    case "BRANCH":
      return {
        label: "BRANCHE",
        badgeVariant: "accent" as const,
        icon: GitBranch,
        colorClass: "text-dm-primary bg-dm-surface border-dm-border",
        dotColor: "bg-dm-primary",
      };
    case "FORMATION":
      return {
        label: "FORMATION",
        badgeVariant: "primary" as const,
        icon: GraduationCap,
        colorClass: "text-dm-primary bg-dm-primary-soft/40 border-dm-border",
        dotColor: "bg-dm-primary",
      };
    case "MODULE":
      return {
        label: "MODULE",
        badgeVariant: "neutral" as const,
        icon: Layers,
        colorClass: "text-dm-ink bg-dm-white border-dm-border",
        dotColor: "bg-slate-400",
      };
    case "SECTION":
      return {
        label: "SECTION",
        badgeVariant: "outline" as const,
        icon: Package,
        colorClass: "text-dm-ink bg-dm-surface/50 border-dm-border",
        dotColor: "bg-amber-400",
      };
    case "LESSON":
      return {
        label: "LEÇON",
        badgeVariant: "outline" as const,
        icon: FileText,
        colorClass: "text-dm-ink bg-dm-white border-dm-border",
        dotColor: "bg-dm-primary",
      };
    case "ACTIVITY":
      return {
        label: "ACTIVITÉ",
        badgeVariant: "warning" as const,
        icon: HelpCircle,
        colorClass: "text-amber-800 bg-amber-50/70 border-amber-200",
        dotColor: "bg-amber-500",
      };
    case "RESOURCE":
      return {
        label: "RESSOURCE",
        badgeVariant: "neutral" as const,
        icon: FileText,
        colorClass: "text-dm-muted bg-dm-white border-dm-border",
        dotColor: "bg-slate-300",
      };
    default:
      return {
        label: nodeType,
        badgeVariant: "neutral" as const,
        icon: Layers,
        colorClass: "text-dm-ink bg-dm-white border-dm-border",
        dotColor: "bg-slate-400",
      };
  }
};

/**
 * RECURSIVE TREE NODE
 * Adheres strictly to the Stop Condition:
 * Purely recursive. Absolutely no fixed maximum depth is coded.
 */
interface TreeNodeItemProps {
  node: ContentNode;
  level: number;
  selectedNodeId: string | null;
  expandedNodeIds: Set<string>;
  searchQuery?: string;
  filterMode?: "ALL" | "ACTIVE_ONLY" | "FUTURE_ONLY";
  onSelectNode: (node: ContentNode) => void;
  onToggleExpand: (nodeId: string) => void;
  onTriggerAction: (
    actionType: SystemModelActionType,
    targetNode: ContentNode,
  ) => void;
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  level,
  selectedNodeId,
  expandedNodeIds,
  searchQuery = "",
  filterMode = "ALL",
  onSelectNode,
  onToggleExpand,
  onTriggerAction,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isExpanded = expandedNodeIds.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const childrenCount = node.children ? node.children.length : 0;

  // Future non-active branch detection
  const isFutureBranch =
    node.nodeType === "BRANCH" &&
    (node.metadata?.futureBranch === true ||
      node.metadata?.active === false ||
      node.status === "DRAFT");

  // Filter mode evaluation
  if (filterMode === "ACTIVE_ONLY" && isFutureBranch) {
    return null;
  }
  if (
    filterMode === "FUTURE_ONLY" &&
    node.nodeType === "BRANCH" &&
    !isFutureBranch
  ) {
    return null;
  }

  // Search query filter (matches self or any descendant)
  const matchesSearch = (item: ContentNode, query: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (
      item.title.toLowerCase().includes(q) ||
      (item.code && item.code.toLowerCase().includes(q)) ||
      item.nodeType.toLowerCase().includes(q)
    ) {
      return true;
    }
    if (item.children) {
      return item.children.some((c) => matchesSearch(c, query));
    }
    return false;
  };

  if (searchQuery && !matchesSearch(node, searchQuery)) {
    return null;
  }

  const typeConfig = getNodeTypeConfig(node.nodeType);
  const IconComponent = typeConfig.icon;

  return (
    <div className="relative group/node select-none" id={`node-${node.id}`}>
      {/* Node Row */}
      <div
        onClick={() => onSelectNode(node)}
        className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-150 ${
          isSelected
            ? "bg-dm-primary-soft/70 border-dm-primary text-dm-primary-deep shadow-xs ring-1 ring-dm-primary/40 font-medium"
            : isFutureBranch
              ? "bg-dm-surface/60 hover:bg-dm-surface border-dashed border-dm-border/90 text-dm-muted"
              : "bg-dm-white hover:bg-dm-surface/80 border-dm-border/80 text-dm-ink shadow-subtle"
        }`}
        style={{
          marginLeft: `${level * 24}px`,
        }}
      >
        {/* Left identity & Title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Expand/Collapse Chevron */}
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(node.id);
              }}
              className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-dm-border/50 text-dm-muted hover:text-dm-ink transition-colors cursor-pointer shrink-0"
              aria-label={isExpanded ? "Replier le nœud" : "Déplier le nœud"}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-dm-ink" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-dm-muted" />
              )}
            </button>
          ) : (
            <span className="w-5 h-5 flex items-center justify-center text-dm-muted/40 shrink-0 text-sm">
              •
            </span>
          )}

          {/* Node Icon */}
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${
              isSelected
                ? "bg-dm-primary text-dm-white border-dm-primary"
                : typeConfig.colorClass
            }`}
          >
            <IconComponent className="w-3.5 h-3.5" />
          </div>

          {/* NodeType Badge */}
          <Badge
            variant={typeConfig.badgeVariant}
            size="sm"
            className="shrink-0"
          >
            {typeConfig.label}
          </Badge>

          {/* Node Title */}
          <span
            className={`truncate text-xs ${
              level === 0 ? "font-bold text-sm tracking-tight" : "font-medium"
            } ${isSelected ? "text-dm-primary-deep font-semibold" : ""}`}
            title={node.title}
          >
            {node.title}
          </span>

          {/* Code métier badge if defined */}
          {node.code && (
            <span className="font-mono text-[10px] text-dm-muted bg-dm-surface border border-dm-border/60 px-1.5 py-0.5 rounded shrink-0">
              {node.code}
            </span>
          )}

          {/* Future Non-Active Branch Pill */}
          {isFutureBranch && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
              <Clock className="w-3 h-3 text-amber-600" />
              Branche future (Non active)
            </span>
          )}

          {/* Direct children counter badge */}
          {hasChildren && (
            <span className="text-[10px] text-dm-muted font-mono bg-dm-surface/80 px-1.5 py-0.2 rounded-md border border-dm-border/40 shrink-0">
              {childrenCount} {childrenCount > 1 ? "enfants" : "enfant"}
            </span>
          )}
        </div>

        {/* Right side status & action buttons */}
        <div
          className="flex items-center gap-1.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Status Badge */}
          <Badge
            variant={
              node.status === "PUBLISHED"
                ? "success"
                : node.status === "ARCHIVED"
                  ? "neutral"
                  : "outline"
            }
            size="sm"
            className="hidden sm:inline-flex"
          >
            {node.status}
          </Badge>

          {/* Action: Add Child Quick Button */}
          <button
            type="button"
            title="Ajouter un sous-nœud enfant sous ce niveau"
            onClick={() => onTriggerAction("ADD_CHILD", node)}
            className="p-1 rounded-md text-dm-muted hover:text-dm-primary hover:bg-dm-primary-soft transition-colors flex items-center gap-1 text-[11px] font-medium border border-transparent hover:border-dm-primary/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[10px]">+ Enfant</span>
          </button>

          {/* Actions Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-md text-dm-muted hover:text-dm-ink hover:bg-dm-border/40 transition-colors"
              aria-label="Options du nœud"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-dm-white rounded-xl border border-dm-border shadow-lg p-1 z-30 space-y-0.5 animate-in fade-in-50 zoom-in-95 duration-100">
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-dm-muted uppercase tracking-wider border-b border-dm-border/40 mb-1">
                    Actions UCT (Phase 1)
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onTriggerAction("ADD_CHILD", node);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-dm-ink hover:bg-dm-surface rounded-lg transition-colors text-left"
                  >
                    <Plus className="w-3.5 h-3.5 text-dm-primary" />
                    <span>Ajouter un sous-nœud</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onTriggerAction("DUPLICATE_BRANCH", node);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-dm-ink hover:bg-dm-surface rounded-lg transition-colors text-left"
                  >
                    <Copy className="w-3.5 h-3.5 text-dm-primary" />
                    <span>Dupliquer la branche</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onTriggerAction("MOVE_NODE", node);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-dm-ink hover:bg-dm-surface rounded-lg transition-colors text-left"
                  >
                    <Move className="w-3.5 h-3.5 text-dm-accent" />
                    <span>Déplacer le nœud</span>
                  </button>

                  <div className="border-t border-dm-border/40 my-1" />

                  {node.status !== "PUBLISHED" && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onTriggerAction("PUBLISH_NODE", node);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors text-left"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Publier le nœud</span>
                    </button>
                  )}

                  {node.status !== "ARCHIVED" && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onTriggerAction("ARCHIVE_NODE", node);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-amber-700 hover:bg-amber-50 rounded-lg transition-colors text-left"
                    >
                      <Archive className="w-3.5 h-3.5 text-amber-600" />
                      <span>Archiver le nœud</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* RECURSIVE CHILDREN RENDERING */}
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1 relative">
          {/* Visual guide line showing unlimited recursive depth */}
          <div
            className="absolute left-0 top-0 bottom-2 w-px bg-dm-border/70"
            style={{
              marginLeft: `${level * 24 + 10}px`,
            }}
          />
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedNodeId={selectedNodeId}
              expandedNodeIds={expandedNodeIds}
              searchQuery={searchQuery}
              filterMode={filterMode}
              onSelectNode={onSelectNode}
              onToggleExpand={onToggleExpand}
              onTriggerAction={onTriggerAction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * ROOT CONTENT TREE COMPONENT
 * Consumes: ContentNode[] (id, parentId, nodeType, title, status, sortOrder, children?)
 */
export const ContentTree: React.FC<ContentTreeProps> = ({
  nodes,
  selectedNodeId,
  expandedNodeIds,
  searchQuery = "",
  filterMode = "ALL",
  onSelectNode,
  onToggleExpand,
  onTriggerAction,
}) => {
  return (
    <div className="space-y-2">
      {nodes.map((rootNode) => (
        <TreeNodeItem
          key={rootNode.id}
          node={rootNode}
          level={0}
          selectedNodeId={selectedNodeId}
          expandedNodeIds={expandedNodeIds}
          searchQuery={searchQuery}
          filterMode={filterMode}
          onSelectNode={onSelectNode}
          onToggleExpand={onToggleExpand}
          onTriggerAction={onTriggerAction}
        />
      ))}
    </div>
  );
};
