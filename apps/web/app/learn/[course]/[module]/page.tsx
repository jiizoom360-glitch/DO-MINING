"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import {
  PageHeader,
  Card,
  Badge,
  Button,
  StatCard,
  Progress,
  ContentStatus,
} from "@do-mining/ui";
import {
  Layers,
  FileText,
  Video,
  CheckCircle,
  PlayCircle,
  Clock,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { SimulationManager } from "@do-mining/mocks";
import type { ContentNode } from "@do-mining/core";

interface LearnModulePageProps {
  params: Promise<{ course: string; module: string }>;
}

export default function LearnModulePage({ params }: LearnModulePageProps) {
  const { course, module: moduleSlug } = use(params);

  const [moduleNode, setModuleNode] = useState<ContentNode | null>(null);
  const [lessons, setLessons] = useState<ContentNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const contentAdapter = SimulationManager.getInstance().contentAdapter;

      let searchSlug = moduleSlug;
      // Compatibilité pour notre mock : chaine-operatoire => chaine-production-granulats
      if (moduleSlug === "chaine-operatoire") {
        searchSlug = "chaine-production-granulats";
      }

      const res = await contentAdapter.getNodeBySlug(searchSlug);
      if (res.success && res.data && isMounted) {
        setModuleNode(res.data);
        const childrenRes = await contentAdapter.getChildren(res.data.id);
        if (childrenRes.success && isMounted) {
          setLessons(childrenRes.data);
        }
      }
      if (isMounted) setIsLoading(false);
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [moduleSlug]);

  if (isLoading) {
    return (
      <SpaceShell
        space="learner"
        activeRoute={`/learn/${course}/${moduleSlug}`}
      >
        <div className="p-8 text-center text-sm text-dm-muted">
          Chargement du module...
        </div>
      </SpaceShell>
    );
  }

  if (!moduleNode) {
    return (
      <SpaceShell
        space="learner"
        activeRoute={`/learn/${course}/${moduleSlug}`}
      >
        <div className="p-8 text-center text-sm text-dm-muted">
          Module introuvable.
        </div>
      </SpaceShell>
    );
  }

  const moduleTitle = moduleNode.title;
  const firstLessonHref =
    lessons.length > 0
      ? `/learn/${course}/${moduleSlug}/${lessons[0].slug}`
      : "#";

  return (
    <SpaceShell space="learner" activeRoute={`/learn/${course}/${moduleSlug}`}>
      <PageHeader
        title={moduleTitle}
        description={
          (moduleNode.metadata?.objective as string) ||
          "Parcours opérationnel technique. Maîtrisez les opérations d’extraction et de sécurité avant l’acheminement au concassage."
        }
        badge={
          <Badge variant="primary" dot>
            Module Actif
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Apprenant", href: "/dashboard" },
          { label: "Parcours Granulats", href: `/learn/${course}` },
          { label: moduleSlug, isCurrent: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/learn/${course}`}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Retour au parcours
              </Button>
            </Link>
            <Link href={firstLessonHref}>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<PlayCircle className="w-3.5 h-3.5" />}
              >
                Démarrer / Poursuivre
              </Button>
            </Link>
          </div>
        }
      />

      {/* Progress & Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Progression du module"
          value={33}
          unit="%"
          helperText={`1 leçon sur ${lessons.length}`}
          icon={<Layers className="w-4 h-4" />}
        />
        <StatCard
          label="Durée estimée"
          value="2h 30"
          helperText={`${lessons.length} fiches d’atelier`}
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          label="Évaluation du module"
          value="Quiz 01"
          helperText="Disponible après les leçons"
          icon={<CheckCircle className="w-4 h-4" />}
        />
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-dm-ink">
            Leçons &amp; activités du module
          </h2>
          <span className="text-xs text-dm-muted">
            {lessons.length} étapes séquentielles
          </span>
        </div>

        <div className="space-y-4">
          {lessons.map((lesson, index) => {
            const status = index === 0 ? "IN_PROGRESS" : "NOT_STARTED";

            return (
              <Card
                key={lesson.id}
                title={lesson.title}
                subtitle={`${lesson.code} • Leçon interactive`}
                badge={<ContentStatus status={status} />}
                footer={
                  <div className="w-full flex items-center justify-between text-xs">
                    <span className="text-dm-muted">
                      Support : Fiche de poste &amp; schéma technique
                    </span>
                    <Link
                      href={`/learn/${course}/${moduleSlug}/${lesson.slug}`}
                    >
                      <Button
                        size="sm"
                        variant={
                          status === "IN_PROGRESS" ? "primary" : "secondary"
                        }
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        {status === "IN_PROGRESS"
                          ? "Poursuivre"
                          : "Ouvrir la leçon"}
                      </Button>
                    </Link>
                  </div>
                }
              >
                <div className="text-xs text-dm-muted leading-relaxed">
                  {lesson.metadata?.description as string ||
                    "Contenu de la leçon en cours de préparation..."}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </SpaceShell>
  );
}
