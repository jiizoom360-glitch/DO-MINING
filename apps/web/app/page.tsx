"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { Button, Badge } from "@do-mining/ui";
import {
  ArrowRight,
  Pickaxe,
  Layers,
  Sparkles,
  ShieldCheck,
  Truck,
  Compass,
  CheckCircle2,
  Play,
  X,
  Clock,
  BookOpen,
  ChevronRight,
  Eye,
  Award,
} from "lucide-react";

export default function HomePage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"curieux" | "operateurs" | "ingenieurs">("curieux");

  const personas = {
    curieux: {
      tag: "Initiation & Grand Public",
      title: "Comprenez comment la roche devient le matériau de nos villes",
      desc: "Découvrez l'univers fascinant des carrières modernes : des engins monumentaux, une physique appliquée captivante et une gestion environnementale de pointe.",
      highlights: [
        "Vulgarisation claire sans jargon rébarbatif",
        "Schémas 3D et vidéos immersives de tirs de mine par drone",
        "Comment les carrières préparent le béton bas carbone de demain",
      ],
      ctaText: "Découvrir la chaîne opératoire",
      ctaHref: "/formations/production-des-granulats",
    },
    operateurs: {
      tag: "Pratique Terrain",
      title: "Sécurité des fronts, réglages machines et productivité",
      desc: "Maîtrisez les procédures réelles du métier : banquettes de protection, surveillance d'usure des concasseurs, réglage des cribles et circulation des dumpers.",
      highlights: [
        "Fiches opérationnelles concrètes prêtes pour le poste de travail",
        "Règles vitales de sécurité (merlons, talus, purges)",
        "Ateliers interactifs avec des formateurs experts du terrain",
      ],
      ctaText: "Explorer le parcours Carrières & Granulats",
      ctaHref: "/formations/production-des-granulats",
    },
    ingenieurs: {
      tag: "Expertise & Encadrement",
      title: "Normes européennes EN 933, géotechnique et conformité",
      desc: "Approfondissez la granulométrie de précision, le traitement des boues, les essais Los Angeles et le management environnemental DREAL.",
      highlights: [
        "Traçabilité rigoureuse des fuseaux granulométriques",
        "Contrôle qualité laboratoire certifié",
        "Préparation aux audits et certifications professionnelles",
      ],
      ctaText: "Consulter le référentiel normatif",
      ctaHref: "/formations/production-des-granulats",
    },
  };

  const currentPersona = personas[activeTab];

  return (
    <SpaceShell space="public" activeRoute="/">
      {/* 1. HERO SECTION : Apple/Linear style, airy, high contrast, responsive */}
      <section className="relative overflow-hidden bg-dm-white border border-dm-border/80 rounded-2xl p-6 sm:p-10 lg:p-14 shadow-xs">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-dm-primary-soft/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dm-primary-soft border border-dm-primary/20 text-dm-primary-deep text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-dm-primary" />
            <span>Plateforme d&apos;apprentissage Mines &amp; Carrières</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-dm-ink tracking-tight leading-tight sm:leading-snug break-words">
            Comprendre la terre. <br />
            <span className="text-dm-primary font-black">
              Maîtriser les matériaux qui bâtissent l&apos;avenir.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-dm-muted leading-relaxed max-w-2xl">
            Du novice curieux de comprendre d&apos;où viennent les sables et granulats de nos ponts et voies ferrées, jusqu&apos;au technicien d&apos;exploitation exigeant : accédez à des parcours pédagogiques clairs, vivants et rigoureusement fidèles aux réalités du terrain.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/formations">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Explorer le catalogue
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              leftIcon={<Play className="w-4 h-4 text-dm-primary fill-dm-primary" />}
              onClick={() => setVideoModalOpen(true)}
              className="w-full sm:w-auto"
            >
              Voir la vidéo immersive (2 min)
            </Button>
          </div>
        </div>
      </section>

      {/* 2. CYCLE DU MATÉRIAU : 5 étapes clés vulgarisées sans débordement */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-dm-border/70 pb-3">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-dm-primary">
              Pédagogie pas-à-pas
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-dm-ink tracking-tight mt-0.5">
              Le voyage du granulat : De la montagne à l&apos;ouvrage d&apos;art
            </h2>
          </div>
          <p className="text-xs text-dm-muted max-w-sm">
            Une carrière moderne est une usine de très haute précision mécanique et environnementale.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              step: "01",
              title: "Découverte des sols",
              desc: "Retrait délicat de la terre arable et stockage en merlons pour le réaménagement futur.",
              icon: <Compass className="w-4 h-4 text-dm-primary" />,
            },
            {
              step: "02",
              title: "Abattage & Foration",
              desc: "Tirs millimétrés en gradins et fragmentation contrôlée pour limiter les vibrations.",
              icon: <Pickaxe className="w-4 h-4 text-dm-primary" />,
            },
            {
              step: "03",
              title: "Concassage primaire",
              desc: "Les blocs massifs sont réduits par des mâchoires géantes capables d&apos;encaisser 500 tonnes/heure.",
              icon: <Layers className="w-4 h-4 text-dm-primary" />,
            },
            {
              step: "04",
              title: "Criblage & Lavage",
              desc: "Tamisage vibrant au millimètre près pour créer sables et gravillons normalisés (EN 933).",
              icon: <CheckCircle2 className="w-4 h-4 text-dm-primary" />,
            },
            {
              step: "05",
              title: "Éco-réhabilitation",
              desc: "Reboisement, création de zones humides et sanctuaires de biodiversité en fin d&apos;exploitation.",
              icon: <ShieldCheck className="w-4 h-4 text-dm-primary" />,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-xl bg-dm-white border border-dm-border/80 flex flex-col justify-between space-y-2 hover:border-dm-primary/40 transition-colors shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-dm-primary">
                  {item.step}
                </span>
                <div className="p-1.5 rounded-md bg-dm-surface text-dm-primary">
                  {item.icon}
                </div>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-dm-ink mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-dm-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PARCOURS ADAPTÉ : Sélecteur par profil (Curieux, Opérateur, Ingénieur) */}
      <section className="bg-dm-white border border-dm-border/80 rounded-2xl p-5 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dm-border/70 pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-dm-primary">
              Orientation personnalisée
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-dm-ink tracking-tight mt-0.5">
              Une pédagogie conçue pour votre niveau d&apos;intérêt
            </h2>
          </div>

          {/* Persona Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-dm-surface rounded-lg border border-dm-border/70 self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab("curieux")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "curieux"
                  ? "bg-dm-white text-dm-primary-deep font-semibold shadow-xs"
                  : "text-dm-muted hover:text-dm-ink"
              }`}
            >
              Curieux &amp; Débutant
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("operateurs")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "operateurs"
                  ? "bg-dm-white text-dm-primary-deep font-semibold shadow-xs"
                  : "text-dm-muted hover:text-dm-ink"
              }`}
            >
              Opérateur Terrain
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ingenieurs")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "ingenieurs"
                  ? "bg-dm-white text-dm-primary-deep font-semibold shadow-xs"
                  : "text-dm-muted hover:text-dm-ink"
              }`}
            >
              Ingénieur &amp; QHSE
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-4">
            <Badge variant="primary" size="sm">
              {currentPersona.tag}
            </Badge>
            <h3 className="text-base sm:text-lg font-bold text-dm-ink leading-snug">
              {currentPersona.title}
            </h3>
            <p className="text-xs sm:text-sm text-dm-muted leading-relaxed">
              {currentPersona.desc}
            </p>

            <ul className="space-y-2 pt-1">
              {currentPersona.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-dm-ink/90">
                  <CheckCircle2 className="w-4 h-4 text-dm-primary shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3">
              <Link href={currentPersona.ctaHref}>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {currentPersona.ctaText}
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-dm-surface border border-dm-border/80 space-y-3">
            <div className="text-xs font-bold text-dm-ink uppercase tracking-wider">
              En vedette aujourd&apos;hui
            </div>
            <div className="p-3 bg-dm-white rounded-lg border border-dm-border/60 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-dm-primary-deep">Parcours Immersion</span>
                <span className="text-dm-muted">25 heures</span>
              </div>
              <div className="text-xs font-bold text-dm-ink">
                Exploitation des carrières : Production des granulats
              </div>
              <p className="text-[11px] text-dm-muted leading-relaxed">
                Le parcours complet incluant les simulations d&apos;usure, les fiches techniques et le quiz certifiant EN 933.
              </p>
              <Link
                href="/formations/production-des-granulats"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-dm-primary hover:underline pt-1"
              >
                <span>Accéder au programme complet</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODALE VIDÉO IMMERSIVE : interactif et pédagogique */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dm-ink/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-dm-white rounded-2xl border border-dm-border shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-dm-border flex items-center justify-between bg-dm-surface/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-semibold text-xs sm:text-sm text-dm-ink">
                  Aperçu Terrain : Le front de taille d&apos;une carrière de calcaire dur
                </span>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded-md text-dm-muted hover:text-dm-ink hover:bg-dm-surface cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Video stage placeholder with interactive controls */}
              <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between p-4 text-white relative overflow-hidden group">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">Drone 4K • Carrière de Normandie</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded">Extrait démo</span>
                </div>

                <div className="text-center my-auto space-y-2">
                  <div className="w-14 h-14 rounded-full bg-dm-primary/90 text-white flex items-center justify-center mx-auto shadow-lg">
                    <Play className="w-6 h-6 ml-0.5 fill-white" />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white">
                    Tir en gradin &amp; Poussage des stériles au D9
                  </div>
                  <p className="text-[11px] text-slate-300 max-w-sm mx-auto">
                    Observez la banquette de recul de 8 mètres garantissant la sécurité avant le chargement en tombereau 50 tonnes.
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>Durée de l&apos;extrait : 02:14</span>
                  <span className="text-dm-primary font-medium">Commenté par Marc V., ingénieur de carrière</span>
                </div>
              </div>

              <div className="p-3 bg-dm-surface rounded-xl border border-dm-border text-xs space-y-1">
                <div className="font-semibold text-dm-ink">
                  Ce que vous apprendrez dans le parcours :
                </div>
                <p className="text-[11px] text-dm-muted leading-relaxed">
                  Comment positionner le merlon d&apos;arrêt obligatoire, calculer l&apos;angle de talus naturel et prévenir les risques de glissement sans jamais mettre les équipes en danger.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVideoModalOpen(false)}
                >
                  Fermer l&apos;aperçu
                </Button>
                <Link href="/formations/production-des-granulats">
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => setVideoModalOpen(false)}
                  >
                    Suivre le cours complet
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </SpaceShell>
  );
}
