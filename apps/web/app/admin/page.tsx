"use client";

import React from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { DashboardView, Button } from "@do-mining/ui";
import { MOCK_DASHBOARD_DEFINITIONS } from "@do-mining/mocks";
import { Layers, Users, Sliders, ShieldAlert, ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {
  const adminDefinition = MOCK_DASHBOARD_DEFINITIONS.ADMIN;

  return (
    <SpaceShell space="admin" activeRoute="/admin">
      <DashboardView
        definition={adminDefinition}
        headerBreadcrumbs={[
          { label: "Espace Administration", href: "/admin" },
          { label: "Tableau de bord", isCurrent: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/content">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<Layers className="w-3.5 h-3.5" />}
              >
                Content Authoring
              </Button>
            </Link>
            <Link href="/admin/system-model">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<Layers className="w-3.5 h-3.5" />}
              >
                Modèle Système UCT
              </Button>
            </Link>
          </div>
        }
      />
    </SpaceShell>
  );
}
