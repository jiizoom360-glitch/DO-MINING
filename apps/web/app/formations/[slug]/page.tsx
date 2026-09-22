"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import { Button, Badge, Card, StatCard } from "@do-mining/ui";
import {
  ArrowLeft,
  ArrowRight,
  Pickaxe,
  Layers,
  PlayCircle,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  FileText,
  Activity,
  Play,
  X,
  Award,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { SimulationManager } from "@do-mining/mocks";
import type { ContentNode } from "@do-mining/core";

export default function CourseDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [courseNode, setCourseNode] = useState<ContentNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkAvailability() {
      const contentAdapter = SimulationManager.getInstance().contentAdapter;
      let searchSlug = slug;
      if (slug === "production-des-granulats") {
        searchSlug = "exploitation-carrieres-granulats";
      } else if (slug === "forage-minage") {
        searchSlug = "forage-minage-demo";
      }

      const res = await contentAdapter.getNodeBySlug(searchSlug);

      if (res.success && res.data && isMounted) {
        setCourseNode(res.data);
      }
      if (isMounted) setIsLoading(false);
    }
    checkAvailability();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <SpaceShell space="public" activeRoute="/formations">
        <div className="flex flex-col items-center justify-center py-20 text-center text-sm text-dm-muted">
          Chargement du programme...
        </div>
      </SpaceShell>
    );
  }

  if (!courseNode) {
    return (
      <SpaceShell space="public" activeRoute="/formations">
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <Badge variant="neutral">En cours de conception</Badge>
          <h1 className="text-xl sm:text-2xl font-bold text-dm-ink">
            Ce parcours n&apos;est pas encore ouvert
          </h1>
          <p className="text-xs sm:text-sm text-dm-muted max-w-md">
            Nos experts de terrain finalisent les modules et les fiches opérationnelles de cette branche.
          </p>
          <Link href="/formations">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Retour au catalogue
            </Button>
          </Link>
        </div>
      </SpaceShell>
    );
  }

  return (
    <SpaceShell space="public" activeRoute="/formations">
      {/* Navigation retour */}
      <div className="mb-4">
        <Link
          href="/formations"
          className="inline-flex items-center gap-1.5 text-xs text-dm-muted hover:text-dm-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à l&apos;ensemble des formations</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="bg-dm-white border border-dm-border rounded-2xl overflow-hidden mb-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success" size="sm" dot>
                Formation Active
              </Badge>
              <span className="text-[11px] font-semibold text-dm-primary-deep bg-dm-primary-soft px-2 py-0.5 rounded">
                Accessible Débutants &amp; Pros
              </span>
              <span className="text-xs font-mono text-dm-muted ml-auto">
                {courseNode.code || "PARCOURS-01"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-dm-ink tracking-tight leading-snug break-words">
              {courseNode.title}
            </h1>

            <p className="text-xs sm:text-sm text-dm-muted leading-relaxed">
              {(courseNode.metadata?.description as string) ||
                "Comprenez comment transformer la roche brute en sables et gravillons de haute précision. Un apprentissage clair, structuré, mêlant sécurité des fronts de taille, mécanique des concasseurs et respect de l'environnement."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href={`/learn/${courseNode.slug}`}>
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Démarrer le premier atelier
                </Button>
              </Link>
              <Button
                variant="outline"
                size="md"
                leftIcon={<Play className="w-4 h-4 text-dm-primary fill-dm-primary" />}
                onClick={() => setVideoModalOpen(true)}
                className="w-full sm:w-auto"
              >
                Extrait vidéo du front (2 min)
              </Button>
            </div>
          </div>

          {/* Interactive Preview Poster */}
          <div className="bg-dm-surface border-t lg:border-t-0 lg:border-l border-dm-border p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div
              onClick={() => setVideoModalOpen(true)}
              className="w-full max-w-sm aspect-video bg-slate-950 rounded-xl shadow-md relative overflow-hidden group cursor-pointer border border-slate-800 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
              <div className="w-14 h-14 rounded-full bg-dm-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 z-20">
                <Play className="w-6 h-6 ml-0.5 fill-white" />
              </div>
              <div className="absolute bottom-3 left-3 text-left z-20">
                <div className="text-[10px] font-bold text-dm-primary uppercase tracking-wider">
                  Vue immersive par drone
                </div>
                <div className="text-xs font-semibold text-white">
                  Front de taille &amp; Merlons de sécurité
                </div>
              </div>
            </div>
            <p className="text-[11px] text-dm-muted">
              Cliquez pour lancer l&apos;aperçu commenté par un chef de carrière
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Niveau requis"
          value="Initiation"
          helperText="Aucun prérequis technique"
          icon={<Pickaxe className="w-4 h-4" />}
        />
        <StatCard
          label="Durée estimée"
          value="25"
          unit="heures"
          helperText="À votre rythme"
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          label="Parcours"
          value="5"
          unit="modules"
          helperText="18 fiches de synthèse"
          icon={<Layers className="w-4 h-4" />}
        />
        <StatCard
          label="Atelier direct"
          value="Inclus"
          helperText="Échanges avec expert"
          icon={<Users className="w-4 h-4" />}
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Pedagogical Purpose */}
          <section className="bg-dm-white p-6 rounded-xl border border-dm-border/80 space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-dm-ink flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-dm-primary shrink-0" />
              <span>Pourquoi ce parcours est unique</span>
            </h2>
            <div className="text-xs sm:text-sm text-dm-muted leading-relaxed space-y-2">
              <p>
                La production de granulats est le point de départ de tout aménagement humain : chaque kilomètre d&apos;autoroute nécessite 30 000 tonnes de granulats, chaque maison neuve entre 100 et 300 tonnes.
              </p>
              <p>
                Ce parcours a été bâti pour que le <strong>débutant curieux</strong> comprenne enfin la logique d&apos;un gisement et la puissance des engins mécaniques, tout en apportant au <strong>technicien</strong> la maîtrise des tolérances strictes de la norme européenne EN 933 (coupures à sec, essais au bleu de méthylène, recyclage de l&apos;eau à 95%).
              </p>
            </div>
          </section>

          {/* Module Breakdown */}
          <section className="bg-dm-white p-6 rounded-xl border border-dm-border/80 space-y-4">
            <div className="flex items-center justify-between border-b border-dm-border/70 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-dm-ink flex items-center gap-2">
                <Layers className="w-5 h-5 text-dm-primary shrink-0" />
                <span>Programme détaillé des 5 modules</span>
              </h2>
              <span className="text-xs text-dm-muted">100% accessible en ligne</span>
            </div>

            <div className="space-y-3">
              {[
                {
                  number: "01",
                  title: "Découverte du gisement et protection des sols",
                  desc: "Comment décaper la terre végétale sans l'abîmer, la stocker en merlons et créer les pistes d'accès sécurisées.",
                  skills: ["Topographie et géologie", "Protection de la terre arable", "Banquette de sécurité"],
                },
                {
                  number: "02",
                  title: "Abattage de la roche & Sécurité des fronts",
                  desc: "Comprendre le tir de mine sans danger, la fragmentation primaire et la circulation des pelles 50 tonnes.",
                  skills: ["Plan de tir géométrique", "Angles de talus naturels", "Contrôle des chutes de pierres"],
                },
                {
                  number: "03",
                  title: "Traitement primaire : Concassage géant",
                  desc: "Le rôle des concasseurs à mâchoires et giratoires. Réglage de l'ouverture (CSS) et prévention des bourrages.",
                  skills: ["Mécanique des mâchoires", "Écartement et débit horaire", "Sécurité des trémies"],
                },
                {
                  number: "04",
                  title: "Traitement secondaire : Criblage et Lavage",
                  desc: "Séparer les cailloux par taille exacte. Tension des toiles de crible, cyclonage des sables et traitement des boues.",
                  skills: ["Sélection des toiles de crible", "Lavage à l'eau recyclée", "Classement 0/4, 4/10, 10/20"],
                },
                {
                  number: "05",
                  title: "Contrôle qualité & Normes européennes EN 933",
                  desc: "Les tests en laboratoire de chantier. Courbe granulométrique, essai Los Angeles et certification.",
                  skills: ["Tamisage normalisé", "Résistance mécanique", "Attestation de validation"],
                },
              ].map((mod) => (
                <div
                  key={mod.number}
                  className="p-4 rounded-xl bg-dm-surface/60 border border-dm-border/70 space-y-2 hover:border-dm-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-dm-primary-soft text-dm-primary-deep font-bold text-xs flex items-center justify-center shrink-0">
                      {mod.number}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-dm-ink">
                      {mod.title}
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-dm-muted leading-relaxed pl-8">
                    {mod.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pl-8 pt-1">
                    {mod.skills.map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-dm-white border border-dm-border text-dm-ink/80 font-medium"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar Checklist */}
        <aside className="space-y-4">
          <div className="bg-dm-white p-5 rounded-xl border border-dm-border/80 space-y-4 shadow-2xs">
            <div className="text-xs font-bold text-dm-ink uppercase tracking-wider">
              Ce que comprend votre inscription
            </div>

            <ul className="space-y-2.5 text-xs text-dm-ink/90">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-dm-primary shrink-0 mt-0.5" />
                <span>Accès complet aux 5 modules et leurs fiches de révision</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-dm-primary shrink-0 mt-0.5" />
                <span>Simulateur d&apos;usure des toiles et de concassage</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-dm-primary shrink-0 mt-0.5" />
                <span>Quiz d&apos;évaluation interactif avec corrections détaillées</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-dm-primary shrink-0 mt-0.5" />
                <span>Classe virtuelle synchrone avec notre formateur expert</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-dm-primary shrink-0 mt-0.5" />
                <span>Attestation de compétences DO-Mining téléchargeable</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-dm-border/70 space-y-2">
              <Link href={`/learn/${courseNode.slug}`} className="block">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Rejoindre la formation
                </Button>
              </Link>
              <p className="text-[10px] text-center text-dm-muted">
                Prototype fonctionnel sans carte bancaire
              </p>
            </div>
          </div>

          <div className="bg-dm-surface p-4 rounded-xl border border-dm-border/70 space-y-2 text-xs">
            <div className="font-semibold text-dm-ink flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-dm-primary" />
              <span>Une question sur ce programme ?</span>
            </div>
            <p className="text-[11px] text-dm-muted leading-relaxed">
              Consultez les fiches dans l&apos;espace apprenant ou rejoignez la salle d&apos;échange formateur pour poser vos questions en direct.
            </p>
          </div>
        </aside>
      </div>

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dm-ink/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-dm-white rounded-2xl border border-dm-border shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-dm-border flex items-center justify-between bg-dm-surface/50">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-dm-primary animate-pulse" />
                <span className="font-semibold text-xs sm:text-sm text-dm-ink">
                  Aperçu Terrain : Décapage, Merlons &amp; Front de taille
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
              <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between p-4 text-white relative">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">Drone 4K • Carrière de Normandie</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-white">Vidéo commentée</span>
                </div>

                <div className="text-center my-auto space-y-2">
                  <div className="w-12 h-12 rounded-full bg-dm-primary text-white flex items-center justify-center mx-auto shadow-lg">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold">
                    La circulation en fosse et les distances de sécurité
                  </div>
                  <p className="text-[11px] text-slate-300 max-w-md mx-auto">
                    Visualisez pourquoi le merlon doit mesurer au moins la moitié du rayon de roue d&apos;un tombereau pour arrêter un véhicule qui glisserait.
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>Chapitre 1 / Module 1</span>
                  <span className="text-dm-primary">Marc V., formateur référent</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVideoModalOpen(false)}
                >
                  Fermer
                </Button>
                <Link href={`/learn/${courseNode.slug}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => setVideoModalOpen(false)}
                  >
                    Démarrer le module 01
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
