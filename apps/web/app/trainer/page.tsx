"use client";

import React from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { DashboardView, Button } from "@do-mining/ui";
import { MOCK_DASHBOARD_DEFINITIONS } from "@do-mining/mocks";
import { Users, FileCheck, Video, ArrowRight } from "lucide-react";

export default function TrainerDashboardPage() {
  const trainerDefinition = MOCK_DASHBOARD_DEFINITIONS.TRAINER;

  return (
    <SpaceShell space="trainer" activeRoute="/trainer">
      <DashboardView
        definition={trainerDefinition}
        headerBreadcrumbs={[
          { label: "Espace Formateur", href: "/trainer" },
          { label: "Tableau de bord", isCurrent: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/trainer/reviews">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<FileCheck className="w-3.5 h-3.5" />}
              >
                Évaluations à valider (5)
              </Button>
            </Link>
            <Link href="/trainer/live">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<Video className="w-3.5 h-3.5" />}
              >
                Démarrer atelier Live
              </Button>
            </Link>
          </div>
        }
      />
    </SpaceShell>
  );
}
