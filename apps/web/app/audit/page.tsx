"use client";

import React from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { DashboardView, Button } from "@do-mining/ui";
import { MOCK_DASHBOARD_DEFINITIONS } from "@do-mining/mocks";
import { ShieldCheck, FileCheck, Layers, ArrowRight } from "lucide-react";

export default function AuditorDashboardPage() {
  const auditorDefinition = MOCK_DASHBOARD_DEFINITIONS.AUDITOR;

  return (
    <SpaceShell space="auditor" activeRoute="/audit">
      <DashboardView
        definition={auditorDefinition}
        headerBreadcrumbs={[
          { label: "Espace Auditeur", href: "/audit" },
          { label: "Vue d’ensemble", isCurrent: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/audit/system">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ShieldCheck className="w-3.5 h-3.5" />}
              >
                Intégrité Système
              </Button>
            </Link>
            <Link href="/audit/content">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<FileCheck className="w-3.5 h-3.5" />}
              >
                Audit Contenus
              </Button>
            </Link>
          </div>
        }
      />
    </SpaceShell>
  );
}
