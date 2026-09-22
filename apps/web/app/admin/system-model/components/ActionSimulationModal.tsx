"use client";

import React, { useState } from "react";
import type { ContentNode, NodeType, PublicationStatus } from "@do-mining/core";
import { Button, Badge } from "@do-mining/ui";
import {
  Plus,
  Copy,
  Move,
  Archive,
  Send,
  AlertCircle,
  CheckCircle2,
  X,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

export type SystemModelActionType =
  | "ADD_CHILD"
  | "DUPLICATE_BRANCH"
  | "MOVE_NODE"
  | "ARCHIVE_NODE"
  | "PUBLISH_NODE";

interface ActionSimulationModalProps {
  isOpen: boolean;
  actionType: SystemModelActionType | null;
  targetNode: ContentNode | null;
  allNodes: ContentNode[];
  onClose: () => void;
  onSimulateSuccess: (updatedTree: ContentNode[], message: string) => void;
}

export const ActionSimulationModal: React.FC<ActionSimulationModalProps> = ({
  isOpen,
  actionType,
  targetNode,
  allNodes,
  onClose,
  onSimulateSuccess,
}) => {
  // Form states for Add Child
  const [childTitle, setChildTitle] = useState("");
  const [childNodeType, setChildNodeType] = useState<NodeType>("MODULE");
  const [childCode, setChildCode] = useState("");
  const [childStatus, setChildStatus] =
    useState<PublicationStatus>("PUBLISHED");
  const [childVisibility, setChildVisibility] = useState("PUBLIC");

  // Form states for Duplicate
  const [duplicatePrefix, setDuplicatePrefix] = useState("Copie de ");

  // Form states for Move
  const [newParentId, setNewParentId] = useState<string>("");

  if (!isOpen || !actionType || !targetNode) {
    return null;
  }

  // Flatten all nodes for parent selection in Move
  const flattenNodes = (
    nodes: ContentNode[],
    depth = 0,
  ): Array<{ node: ContentNode; depth: number }> => {
    const list: Array<{ node: ContentNode; depth: number }> = [];
    nodes.forEach((n) => {
      list.push({ node: n, depth });
      if (n.children && n.children.length > 0) {
        list.push(...flattenNodes(n.children, depth + 1));
      }
    });
    return list;
  };

  const flattenedCandidates = flattenNodes(allNodes).filter(
    (item) => item.node.id !== targetNode.id,
  );

  const getActionTitle = () => {
    switch (actionType) {
      case "ADD_CHILD":
        return "Ajouter un sous-nœud enfant";
      case "DUPLICATE_BRANCH":
        return "Dupliquer la branche";
      case "MOVE_NODE":
        return "Déplacer le nœud dans l’arborescence";
      case "ARCHIVE_NODE":
        return "Archiver le nœud";
      case "PUBLISH_NODE":
        return "Publier le nœud";
      default:
        return "Action sur le modèle système";
    }
  };

  const getActionIcon = () => {
    switch (actionType) {
      case "ADD_CHILD":
        return <Plus className="w-5 h-5 text-dm-primary" />;
      case "DUPLICATE_BRANCH":
        return <Copy className="w-5 h-5 text-dm-primary" />;
      case "MOVE_NODE":
        return <Move className="w-5 h-5 text-dm-accent" />;
      case "ARCHIVE_NODE":
        return <Archive className="w-5 h-5 text-amber-500" />;
      case "PUBLISH_NODE":
        return <Send className="w-5 h-5 text-emerald-600" />;
      default:
        return <Layers className="w-5 h-5 text-dm-primary" />;
    }
  };

  const handleExecute = () => {
    // Clone tree deeply and apply simulated modification in memory
    const cloneTree = (nodes: ContentNode[]): ContentNode[] => {
      return nodes.map((n) => {
        const copy: ContentNode = {
          ...n,
          metadata: { ...n.metadata },
          children: n.children ? cloneTree(n.children) : undefined,
        };

        if (actionType === "ADD_CHILD" && n.id === targetNode.id) {
          const newChild: ContentNode = {
            id: `sim_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            parentId: n.id,
            slug: (childTitle || "nouveau-noeud")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-"),
            title: childTitle || "Nouveau sous-nœud simulé",
            code: childCode || `SIM-${Math.floor(Math.random() * 900 + 100)}`,
            nodeType: childNodeType,
            sortOrder: (n.children?.length || 0) + 1,
            status: childStatus,
            version: 1,
            metadata: {
              simulated: true,
              visibility: childVisibility,
              createdAtUtc: new Date().toISOString(),
              note: "Nœud créé lors de la simulation Phase 1",
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          copy.children = [...(copy.children || []), newChild];
        }

        if (actionType === "ARCHIVE_NODE" && n.id === targetNode.id) {
          copy.status = "ARCHIVED";
          copy.metadata = {
            ...copy.metadata,
            archivedAt: new Date().toISOString(),
          };
        }

        if (actionType === "PUBLISH_NODE" && n.id === targetNode.id) {
          copy.status = "PUBLISHED";
          copy.metadata = {
            ...copy.metadata,
            publishedAt: new Date().toISOString(),
          };
        }

        return copy;
      });
    };

    if (actionType === "DUPLICATE_BRANCH") {
      const duplicateSubtree = (
        source: ContentNode,
        newParentId: string | null,
      ): ContentNode => {
        const newId = `dup_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        return {
          ...source,
          id: newId,
          parentId: newParentId,
          title: `${duplicatePrefix}${source.title}`,
          slug: `${source.slug}-copie`,
          status: "DRAFT",
          version: 1,
          metadata: { ...source.metadata, isDuplicated: true },
          children: source.children?.map((c) => duplicateSubtree(c, newId)),
        };
      };

      const injectDuplicate = (nodes: ContentNode[]): ContentNode[] => {
        const result: ContentNode[] = [];
        for (const n of nodes) {
          result.push({
            ...n,
            children: n.children ? injectDuplicate(n.children) : undefined,
          });
          if (n.id === targetNode.id) {
            result.push(duplicateSubtree(targetNode, targetNode.parentId));
          }
        }
        return result;
      };

      const newTree = injectDuplicate(allNodes);
      onSimulateSuccess(
        newTree,
        `Branche "${targetNode.title}" dupliquée en mémoire avec succès (simulation prototype).`,
      );
      onClose();
      return;
    }

    if (actionType === "MOVE_NODE") {
      if (!newParentId) {
        alert("Veuillez sélectionner un nœud parent cible.");
        return;
      }
      // Remove target node from current location and attach to new parent
      let extractedNode: ContentNode | null = null;
      const removeNode = (nodes: ContentNode[]): ContentNode[] => {
        return nodes
          .filter((n) => {
            if (n.id === targetNode.id) {
              extractedNode = { ...n, parentId: newParentId };
              return false;
            }
            return true;
          })
          .map((n) => ({
            ...n,
            children: n.children ? removeNode(n.children) : undefined,
          }));
      };

      const treeWithoutTarget = removeNode(allNodes);
      const attachToParent = (nodes: ContentNode[]): ContentNode[] => {
        return nodes.map((n) => {
          if (n.id === newParentId && extractedNode) {
            return {
              ...n,
              children: [...(n.children || []), extractedNode],
            };
          }
          return {
            ...n,
            children: n.children ? attachToParent(n.children) : undefined,
          };
        });
      };

      const newTree = attachToParent(treeWithoutTarget);
      onSimulateSuccess(
        newTree,
        `Nœud "${targetNode.title}" déplacé sous le nouveau parent avec succès (simulation prototype).`,
      );
      onClose();
      return;
    }

    const updatedTree = cloneTree(allNodes);
    const msg =
      actionType === "ADD_CHILD"
        ? `Nouveau sous-nœud de type ${childNodeType} inséré sous "${targetNode.title}" (simulation prototype).`
        : actionType === "ARCHIVE_NODE"
          ? `Nœud "${targetNode.title}" archivé en mémoire (simulation prototype).`
          : `Nœud "${targetNode.title}" publié en mémoire (simulation prototype).`;

    onSimulateSuccess(updatedTree, msg);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dm-ink/40 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-dm-white rounded-2xl border border-dm-border shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-dm-border flex items-start justify-between gap-4 bg-dm-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-dm-primary-soft flex items-center justify-center shrink-0">
              {getActionIcon()}
            </div>
            <div>
              <h3 id="modal-title" className="text-base font-bold text-dm-ink">
                {getActionTitle()}
              </h3>
              <p className="text-xs text-dm-muted mt-0.5">
                Cible :{" "}
                <span className="font-semibold text-dm-ink">
                  {targetNode.title}
                </span>{" "}
                (
                <span className="font-mono text-[11px]">
                  {targetNode.nodeType}
                </span>
                )
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-dm-muted hover:text-dm-ink p-1.5 rounded-lg hover:bg-dm-border/40 transition-colors"
            aria-label="Fermer la boîte de dialogue"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Strict Doctrine Notice */}
          <div className="p-3.5 bg-dm-primary-soft/40 border border-dm-primary/30 rounded-xl flex items-start gap-3">
            <Info className="w-4 h-4 text-dm-primary shrink-0 mt-0.5" />
            <div className="text-xs text-dm-primary-deep space-y-1">
              <div className="font-semibold">
                Doctrine Zéro-Persistance (Phase 1)
              </div>
              <p className="leading-relaxed text-dm-muted">
                Cette interface simule l&apos;ergonomie de manipulation de
                l&apos;Arbre Universel de Contenu (UCT). Les modifications
                s&apos;exécutent localement en mémoire pour valider
                l&apos;absence de profondeur fixe, sans écriture en base de
                données.
              </p>
            </div>
          </div>

          {/* ADD CHILD FORM */}
          {actionType === "ADD_CHILD" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-dm-ink mb-1.5">
                  Type sémantique du sous-nœud{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      "DOMAIN",
                      "BRANCH",
                      "FORMATION",
                      "MODULE",
                      "SECTION",
                      "LESSON",
                      "ACTIVITY",
                      "RESOURCE",
                    ] as NodeType[]
                  ).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setChildNodeType(type)}
                      className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                        childNodeType === type
                          ? "border-dm-primary bg-dm-primary-soft text-dm-primary-deep font-bold ring-1 ring-dm-primary"
                          : "border-dm-border hover:bg-dm-surface text-dm-muted hover:text-dm-ink"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-dm-muted mt-1.5">
                  Note : L&apos;architecture UCT autorise l&apos;imbrication de
                  n&apos;importe quel type sous n&apos;importe quel nœud.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dm-ink mb-1">
                  Titre du nœud enfant <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={childTitle}
                  onChange={(e) => setChildTitle(e.target.value)}
                  placeholder="ex: Module 09 — Récupération des fines & boues"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-dm-border bg-dm-white focus:outline-hidden focus:ring-2 focus:ring-dm-primary/20 focus:border-dm-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-dm-ink mb-1">
                    Code métier suggéré
                  </label>
                  <input
                    type="text"
                    value={childCode}
                    onChange={(e) => setChildCode(e.target.value)}
                    placeholder="ex: MOD-09"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-dm-border bg-dm-white focus:outline-hidden focus:ring-2 focus:ring-dm-primary/20 focus:border-dm-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dm-ink mb-1">
                    Statut initial
                  </label>
                  <select
                    value={childStatus}
                    onChange={(e) =>
                      setChildStatus(e.target.value as PublicationStatus)
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-dm-border bg-dm-white focus:outline-hidden focus:ring-2 focus:ring-dm-primary/20 focus:border-dm-primary"
                  >
                    <option value="PUBLISHED">PUBLISHED (Publié)</option>
                    <option value="DRAFT">DRAFT (Brouillon)</option>
                    <option value="REVIEW">REVIEW (En révision)</option>
                    <option value="ARCHIVED">ARCHIVED (Archivé)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dm-ink mb-1">
                  Visibilité d’accès
                </label>
                <select
                  value={childVisibility}
                  onChange={(e) => setChildVisibility(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-dm-border bg-dm-white focus:outline-hidden focus:ring-2 focus:ring-dm-primary/20 focus:border-dm-primary"
                >
                  <option value="PUBLIC">Publique (Catalogue ouvert)</option>
                  <option value="ENROLLED_ONLY">
                    Réservé aux apprenants inscrits
                  </option>
                  <option value="RESTRICTED">Restreinte / R&D interne</option>
                </select>
              </div>
            </div>
          )}

          {/* DUPLICATE BRANCH FORM */}
          {actionType === "DUPLICATE_BRANCH" && (
            <div className="space-y-4">
              <p className="text-xs text-dm-muted leading-relaxed">
                La duplication récursive va cloner l&apos;intégralité de la
                sous-arborescence descendante (enfants directs et indirects) en
                créant de nouveaux identifiants uniques récursifs.
              </p>
              <div>
                <label className="block text-xs font-semibold text-dm-ink mb-1">
                  Préfixe du titre dupliqué
                </label>
                <input
                  type="text"
                  value={duplicatePrefix}
                  onChange={(e) => setDuplicatePrefix(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-dm-border bg-dm-white focus:outline-hidden focus:ring-2 focus:ring-dm-primary/20 focus:border-dm-primary"
                />
              </div>
              <div className="p-3 bg-dm-surface rounded-lg text-xs space-y-1 text-dm-ink font-mono">
                <div className="text-dm-muted font-sans font-medium">
                  Résultat prévu :
                </div>
                <div>
                  {duplicatePrefix}
                  {targetNode.title}
                </div>
                <div className="text-[11px] text-dm-muted font-sans">
                  Statut de la copie :{" "}
                  <span className="font-semibold text-amber-600">
                    DRAFT (Brouillon)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MOVE NODE FORM */}
          {actionType === "MOVE_NODE" && (
            <div className="space-y-4">
              <p className="text-xs text-dm-muted leading-relaxed">
                Choisissez le nouveau parent cible sous lequel rattacher ce
                nœud. La doctrine DO-Mining permet de rattacher une branche ou
                un module sous n&apos;importe quelle entité.
              </p>
              <div>
                <label className="block text-xs font-semibold text-dm-ink mb-1">
                  Nouveau nœud parent cible{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={newParentId}
                  onChange={(e) => setNewParentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-dm-border bg-dm-white focus:outline-hidden focus:ring-2 focus:ring-dm-primary/20 focus:border-dm-primary font-mono"
                >
                  <option value="">-- Sélectionner un nœud cible --</option>
                  {flattenedCandidates.map(({ node, depth }) => (
                    <option key={node.id} value={node.id}>
                      {"\u00A0".repeat(depth * 3)}↳ [{node.nodeType}]{" "}
                      {node.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ARCHIVE / PUBLISH FORMS */}
          {actionType === "ARCHIVE_NODE" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>Modification du cycle de vie UCT</span>
              </div>
              <p className="text-xs text-dm-muted leading-relaxed">
                Ce nœud passera à l&apos;état{" "}
                <strong className="text-dm-ink">ARCHIVED</strong>. Il sera
                masqué des parcours apprenants tout en conservant son historique
                et ses révisions cryptographiques.
              </p>
            </div>
          )}

          {actionType === "PUBLISH_NODE" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Publication de contenu UCT</span>
              </div>
              <p className="text-xs text-dm-muted leading-relaxed">
                Ce nœud passera à l&apos;état{" "}
                <strong className="text-dm-ink">PUBLISHED</strong>. Il deviendra
                immédiatement accessible aux stagiaires selon les règles
                d&apos;inscription et de prérequis.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-dm-border bg-dm-surface/50 flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExecute}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Simuler l’opération (Phase 1)
          </Button>
        </div>
      </div>
    </div>
  );
};
