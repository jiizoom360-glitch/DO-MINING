"use client";

import React, { useState, useEffect } from "react";
import { SpaceShell } from "@/app/components/SpaceShell";
import { PageHeader, Card, Button, Badge, BlockRenderer } from "@do-mining/ui";
import type { ContentBlock } from "@do-mining/core";
import {
  Folder,
  FileText,
  Settings,
  Eye,
  Save,
  UploadCloud,
  Plus,
  GripVertical,
  Layers,
} from "lucide-react";

const mockTree = [
  { id: "bra_carriere", title: "Exploitation des carrières", type: "BRANCH" },
  {
    id: "for_granulats",
    title: "Production des granulats",
    type: "FORMATION",
    indent: 1,
  },
  {
    id: "mod_03_abattage",
    title: "Module 03 — Abattage",
    type: "MODULE",
    indent: 2,
  },
  {
    id: "les_01_forage",
    title: "Leçon: Techniques de forage",
    type: "LESSON",
    indent: 3,
  },
  {
    id: "les_02_explosifs",
    title: "Leçon: Plans de tir",
    type: "LESSON",
    indent: 3,
  },
];

const initialBlocks: ContentBlock[] = [
  {
    id: "b1",
    type: "rich_text",
    data: {
      content:
        "# Introduction à l'abattage\n\nL'abattage à l'explosif est la méthode la plus courante pour fragmenter la roche massive.",
    },
  },
  {
    id: "b2",
    type: "callout",
    data: {
      intent: "warning",
      title: "Sécurité Avant Tout",
      content:
        "Le périmètre de sécurité lors du tir doit être strictement respecté.",
    },
  },
  {
    id: "b3",
    type: "video",
    data: {
      title: "Tir en gradin - Vue drone",
      url: "s3://videos/tir_gradin.mp4",
      durationMinutes: 4,
    },
  },
];

export default function ContentAuthoringPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("les_01_forage");
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    "DRAFT",
  );

  const selectedNode = mockTree.find((n) => n.id === selectedNodeId);

  const addBlock = (type: string) => {
    const newBlock: ContentBlock = {
      id: `b${Date.now()}`,
      type,
      data: type === "rich_text" ? { content: "Nouveau bloc de texte..." } : {},
    };
    if (type === "callout") {
      newBlock.data = {
        intent: "info",
        title: "Nouvelle info",
        content: "...",
      };
    } else if (type === "video") {
      newBlock.data = {
        title: "Nouvelle vidéo",
        url: "...",
        durationMinutes: 0,
      };
    }
    setBlocks([...blocks, newBlock]);
  };

  const handleSimulateSave = () => {
    alert("DEMO/PHASE 1: L'enregistrement est simulé et non persistant.");
  };

  const handleSimulatePublish = () => {
    setStatus("PUBLISHED");
    alert("DEMO/PHASE 1: La publication est simulée.");
  };

  return (
    <SpaceShell space="admin" activeRoute="/admin/content">
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-dm-border shrink-0">
          <div>
            <h1 className="text-lg font-bold text-dm-ink flex items-center gap-2">
              <Layers className="w-5 h-5 text-dm-primary" />
              Content Authoring (Prototype)
            </h1>
            <p className="text-xs text-dm-muted mt-0.5">
              Édition non persistante - Phase 1
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={status === "PUBLISHED" ? "primary" : "outline"}>
              {status}
            </Badge>
            <div className="h-6 w-px bg-dm-border mx-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
              leftIcon={
                mode === "edit" ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <Settings className="w-4 h-4" />
                )
              }
            >
              {mode === "edit" ? "Preview" : "Éditeur"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSimulateSave}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UploadCloud className="w-4 h-4" />}
              onClick={handleSimulatePublish}
            >
              Publish
            </Button>
          </div>
        </div>

        {/* Split pane */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Tree */}
          <div className="w-72 bg-dm-surface border-r border-dm-border overflow-y-auto shrink-0 p-4">
            <h3 className="text-xs font-semibold text-dm-muted uppercase tracking-wider mb-4">
              Content Tree
            </h3>
            <div className="space-y-1">
              {mockTree.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                    selectedNodeId === node.id
                      ? "bg-dm-primary text-white font-medium"
                      : "text-dm-ink hover:bg-dm-border/50"
                  }`}
                  style={{ paddingLeft: `${(node.indent || 0) * 16 + 8}px` }}
                >
                  {node.type === "LESSON" ? (
                    <FileText className="w-4 h-4 shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate">{node.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Editor/Preview */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50">
            {selectedNode?.type !== "LESSON" ? (
              <div className="h-full flex items-center justify-center text-dm-muted">
                Sélectionnez une Leçon pour éditer son contenu.
              </div>
            ) : (
              <div className="max-w-4xl mx-auto p-8 space-y-8">
                {/* Metadata Editor (Simulated) */}
                {mode === "edit" && (
                  <Card>
                    <div className="text-sm font-semibold text-dm-ink mb-4">
                      Métadonnées de la leçon
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-dm-muted mb-1">
                          Titre
                        </label>
                        <input
                          type="text"
                          className="w-full text-sm p-2 border border-dm-border rounded bg-dm-surface"
                          value={selectedNode.title}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-dm-muted mb-1">
                          Slug
                        </label>
                        <input
                          type="text"
                          className="w-full text-sm p-2 border border-dm-border rounded bg-dm-surface"
                          value={selectedNode.id}
                          readOnly
                        />
                      </div>
                    </div>
                  </Card>
                )}

                {/* Blocks Area */}
                <div className="space-y-4">
                  {mode === "edit" && (
                    <h3 className="text-sm font-semibold text-dm-ink">
                      Contenu (Blocs)
                    </h3>
                  )}

                  {blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className={`group relative ${mode === "edit" ? "pl-10" : ""}`}
                    >
                      {mode === "edit" && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-dm-muted opacity-0 group-hover:opacity-100 cursor-grab">
                          <GripVertical className="w-5 h-5" />
                        </div>
                      )}

                      {mode === "edit" ? (
                        <div className="border border-dm-border rounded-lg bg-white overflow-hidden">
                          <div className="bg-dm-surface border-b border-dm-border px-3 py-1.5 flex items-center justify-between">
                            <span className="text-xs font-mono font-medium text-dm-ink">
                              {block.type}
                            </span>
                            <button
                              className="text-xs text-red-500 hover:underline"
                              onClick={() =>
                                setBlocks((b) =>
                                  b.filter((x) => x.id !== block.id),
                                )
                              }
                            >
                              Retirer
                            </button>
                          </div>
                          <div className="p-3">
                            <BlockRenderer block={block} isPreview={false} />
                          </div>
                        </div>
                      ) : (
                        <BlockRenderer block={block} isPreview={true} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Block Menu */}
                {mode === "edit" && (
                  <div className="pt-4 flex flex-wrap gap-2">
                    <span className="text-xs text-dm-muted w-full mb-1">
                      Ajouter un bloc :
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={() => addBlock("rich_text")}
                    >
                      Rich Text
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={() => addBlock("video")}
                    >
                      Vidéo (Asset)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={() => addBlock("callout")}
                    >
                      Callout
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={() => addBlock("quiz_embed")}
                    >
                      Quiz Embed
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SpaceShell>
  );
}
