"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Card, Badge, Button, StatCard } from "@do-mining/ui";
import {
  FolderTree,
  GitBranch,
  Layers,
  Shield,
  Plus,
  Search,
  RotateCcw,
  Sparkles,
  Info,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import type { ContentNode } from "@do-mining/core";
import { SYSTEM_MODEL_FIXTURES } from "@do-mining/mocks";
import { ContentTree } from "./components/ContentTree";
import { NodeInspector } from "./components/NodeInspector";
import {
  ActionSimulationModal,
  type SystemModelActionType,
} from "./components/ActionSimulationModal";

// ---------------------------------------------------------------------------
// Pure recursive helper functions for tree traversal & metrics
// ---------------------------------------------------------------------------

const countTotalNodes = (nodes: ContentNode[]): number => {
  let count = 0;
  nodes.forEach((n) => {
    count += 1;
    if (n.children && n.children.length > 0) {
      count += countTotalNodes(n.children);
    }
  });
  return count;
};

const calculateMaxDepth = (nodes: ContentNode[], currentDepth = 1): number => {
  let max = currentDepth;
  nodes.forEach((n) => {
    if (n.children && n.children.length > 0) {
      const d = calculateMaxDepth(n.children, currentDepth + 1);
      if (d > max) max = d;
    }
  });
  return max;
};

const findNodeById = (nodes: ContentNode[], id: string): ContentNode | null => {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNodeById(n.children, id);
      if (found) return found;
    }
  }
  return null;
};

const findParentOfNode = (
  nodes: ContentNode[],
  childId: string,
  currentParent: ContentNode | null = null,
): ContentNode | null => {
  for (const n of nodes) {
    if (n.id === childId) return currentParent;
    if (n.children) {
      const found = findParentOfNode(n.children, childId, n);
      if (found) return found;
    }
  }
  return null;
};

const getAncestors = (
  nodes: ContentNode[],
  targetId: string,
): ContentNode[] => {
  const path: ContentNode[] = [];
  const findPath = (currentNodes: ContentNode[]): boolean => {
    for (const n of currentNodes) {
      if (n.id === targetId) return true;
      if (n.children) {
        path.push(n);
        if (findPath(n.children)) return true;
        path.pop();
      }
    }
    return false;
  };
  findPath(nodes);
  return path;
};

export default function AdminSystemModelPage() {
  // Tree state initialized with fixtures
  const [treeData, setTreeData] = useState<ContentNode[]>(
    SYSTEM_MODEL_FIXTURES,
  );

  // Selected node for the Node Inspector
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    "for_production_granulats",
  );

  // Expanded nodes set
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(() => {
    const initialExpanded = new Set<string>([
      "dom_mines_carrieres",
      "bra_exploitation_carrieres",
      "for_production_granulats",
      "mod_01_chaine_production",
      "sec_01_synoptique",
    ]);
    return initialExpanded;
  });

  // Search and filter modes
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<
    "ALL" | "ACTIVE_ONLY" | "FUTURE_ONLY"
  >("ALL");

  // Simulation modal state
  const [simulationModal, setSimulationModal] = useState<{
    isOpen: boolean;
    actionType: SystemModelActionType | null;
    targetNode: ContentNode | null;
  }>({
    isOpen: false,
    actionType: null,
    targetNode: null,
  });

  // Feedback notification banner
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Computed metrics
  const totalNodesCount = useMemo(() => countTotalNodes(treeData), [treeData]);
  const maxDepthCount = useMemo(() => calculateMaxDepth(treeData), [treeData]);

  // Currently inspected node and relations
  const selectedNode = useMemo(
    () => (selectedNodeId ? findNodeById(treeData, selectedNodeId) : null),
    [treeData, selectedNodeId],
  );

  const parentNode = useMemo(
    () => (selectedNodeId ? findParentOfNode(treeData, selectedNodeId) : null),
    [treeData, selectedNodeId],
  );

  const ancestorsTrail = useMemo(
    () => (selectedNodeId ? getAncestors(treeData, selectedNodeId) : []),
    [treeData, selectedNodeId],
  );

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (nodes: ContentNode[]) => {
      nodes.forEach((n) => {
        allIds.add(n.id);
        if (n.children) collectIds(n.children);
      });
    };
    collectIds(treeData);
    setExpandedNodeIds(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedNodeIds(new Set(["dom_mines_carrieres"]));
  };

  const handleResetFixtures = () => {
    setTreeData(SYSTEM_MODEL_FIXTURES);
    setSelectedNodeId("for_production_granulats");
    setExpandedNodeIds(
      new Set([
        "dom_mines_carrieres",
        "bra_exploitation_carrieres",
        "for_production_granulats",
        "mod_01_chaine_production",
      ]),
    );
    setFeedbackMessage(
      "Arborescence réinitialisée aux fixtures de doctrine d’origine.",
    );
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleTriggerAction = (
    actionType: SystemModelActionType,
    targetNode: ContentNode,
  ) => {
    setSimulationModal({
      isOpen: true,
      actionType,
      targetNode,
    });
  };

  const handleSimulateSuccess = (
    updatedTree: ContentNode[],
    message: string,
  ) => {
    setTreeData(updatedTree);
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), 6000);
  };

  return (
    <SpaceShell space="admin" activeRoute="/admin/system-model">
      {/* 1. Page Header with Breadcrumbs & Badges */}
      <PageHeader
        title="Arbre Universel de Contenu (UCT) & Modèle Système"
        description="Doctrine DO-Mining : Hiérarchie récursive illimitée sans profondeur fixe. Exploration de la filière active Carrières & Granulats et des branches futures non actives."
        badge={
          <Badge variant="primary" dot>
            Architecture Récursive Illimitée
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Administration", href: "/admin" },
          { label: "Modèle Système UCT", isCurrent: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFixtures}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              title="Restaurer l'arbre initial de démonstration"
            >
              Réinitialiser
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const root = treeData[0];
                if (root) handleTriggerAction("ADD_CHILD", root);
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Ajouter une branche
            </Button>
          </div>
        }
      />

      {/* 2. Simulation Feedback Banner if active */}
      {feedbackMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-900 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-0.5"
          >
            ×
          </button>
        </div>
      )}

      {/* 3. Overview Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Nœuds UCT indexés"
          value={String(totalNodesCount)}
          unit="nœuds"
          helperText="Arbre dynamique sans limite"
          icon={<Layers className="w-4 h-4" />}
        />
        <StatCard
          label="Profondeur maximale"
          value={String(maxDepthCount)}
          unit="niveaux"
          helperText="Récursivité stricte vérifiée"
          icon={<FolderTree className="w-4 h-4" />}
        />
        <StatCard
          label="Branche active"
          value="1"
          unit="Carrières"
          helperText="Production des granulats (8 modules)"
          icon={<GitBranch className="w-4 h-4" />}
        />
        <StatCard
          label="Branches futures"
          value="5"
          unit="Non actives"
          helperText="Forage, Minage, QHSE, Maintenance, Topo"
          icon={<Shield className="w-4 h-4" />}
        />
      </div>

      {/* 4. Filter Toolbar & Search */}
      <div className="bg-dm-white rounded-xl border border-dm-border p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-subtle">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-dm-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrer par titre, code (ex: MOD-01) ou type..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-dm-border bg-dm-surface/50 focus:outline-hidden focus:ring-2 focus:ring-dm-primary/20 focus:border-dm-primary"
          />
        </div>

        {/* Filter Pills & Expand controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-dm-surface p-0.5 rounded-lg border border-dm-border/60 text-[11px]">
            <button
              type="button"
              onClick={() => setFilterMode("ALL")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                filterMode === "ALL"
                  ? "bg-dm-white text-dm-ink shadow-2xs font-semibold"
                  : "text-dm-muted hover:text-dm-ink"
              }`}
            >
              Tous
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("ACTIVE_ONLY")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                filterMode === "ACTIVE_ONLY"
                  ? "bg-dm-white text-dm-ink shadow-2xs font-semibold"
                  : "text-dm-muted hover:text-dm-ink"
              }`}
            >
              Actifs
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("FUTURE_ONLY")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                filterMode === "FUTURE_ONLY"
                  ? "bg-dm-white text-dm-ink shadow-2xs font-semibold"
                  : "text-dm-muted hover:text-dm-ink"
              }`}
            >
              Branches futures (5)
            </button>
          </div>

          <div className="h-4 w-px bg-dm-border/80 hidden sm:block" />

          <button
            type="button"
            onClick={handleExpandAll}
            className="px-2 py-1 text-xs text-dm-muted hover:text-dm-ink hover:bg-dm-surface rounded-md border border-dm-border/60 transition-colors"
          >
            Tout déplier
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="px-2 py-1 text-xs text-dm-muted hover:text-dm-ink hover:bg-dm-surface rounded-md border border-dm-border/60 transition-colors"
          >
            Tout replier
          </button>
        </div>
      </div>

      {/* 5. Main Split Screen: Tree Explorer (Left) & Node Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recursive Content Tree */}
        <div className="lg:col-span-7 space-y-4">
          <Card
            title="Arborescence UCT (Universal Content Tree)"
            subtitle="Structure récursive libre : chaque nœud peut accueillir des sous-branches à n'importe quel niveau."
            headerActions={
              <Badge variant="outline" size="sm">
                Sélection : {selectedNode?.title || "Aucune"}
              </Badge>
            }
          >
            {/* Tree Legend */}
            <div className="pb-3 mb-3 border-b border-dm-border/60 flex items-center gap-2 text-[11px] text-dm-muted flex-wrap">
              <span className="font-semibold text-dm-ink">Légende :</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-dm-primary" /> Domaine
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-dm-primary-deep" />{" "}
                Branche
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-600" /> Formation
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-500" /> Module
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Section /
                Activité
              </span>
            </div>

            {/* Tree View */}
            <div className="overflow-x-auto pb-4">
              <ContentTree
                nodes={treeData}
                selectedNodeId={selectedNodeId}
                expandedNodeIds={expandedNodeIds}
                searchQuery={searchQuery}
                filterMode={filterMode}
                onSelectNode={(node) => setSelectedNodeId(node.id)}
                onToggleExpand={handleToggleExpand}
                onTriggerAction={handleTriggerAction}
              />
            </div>

            {/* Bottom UX Directive Hint */}
            <div className="mt-4 pt-3 border-t border-dm-border/60 flex items-start gap-2.5 text-xs text-dm-muted bg-dm-surface/50 p-3 rounded-xl">
              <Info className="w-4 h-4 text-dm-primary shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-dm-ink">
                  Principe fondamental UX :
                </strong>{" "}
                Vous pouvez cliquer sur{" "}
                <span className="font-semibold text-dm-primary">+ Enfant</span>{" "}
                sur <em>n&apos;importe quelle ligne</em> pour insérer une
                nouvelle branche, un nouveau module ou une section
                personnalisée. La profondeur de l&apos;arbre n&apos;est jamais
                bridée.
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Node Inspector Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-dm-muted uppercase tracking-wider">
              Inspecteur de Nœud UCT
            </h3>
            <span className="text-[11px] text-dm-muted font-mono">
              {selectedNode ? selectedNode.id : "N/A"}
            </span>
          </div>

          <NodeInspector
            node={selectedNode}
            parentNode={parentNode}
            ancestors={ancestorsTrail}
            onSelectNode={(node) => setSelectedNodeId(node.id)}
            onTriggerAction={handleTriggerAction}
          />
        </div>
      </div>

      {/* 6. Simulation Modal for Actions */}
      <ActionSimulationModal
        isOpen={simulationModal.isOpen}
        actionType={simulationModal.actionType}
        targetNode={simulationModal.targetNode}
        allNodes={treeData}
        onClose={() =>
          setSimulationModal({
            isOpen: false,
            actionType: null,
            targetNode: null,
          })
        }
        onSimulateSuccess={handleSimulateSuccess}
      />
    </SpaceShell>
  );
}
