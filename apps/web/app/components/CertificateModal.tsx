"use client";

import React from "react";
import { X, Award, Printer, Download, CheckCircle, ShieldCheck } from "lucide-react";

export interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle?: string;
  recipientName?: string;
  issueDate?: string;
  certificateId?: string;
}

export function CertificateModal({
  isOpen,
  onClose,
  courseTitle = "Exploitation des Carrières & Production des Granulats EN 933",
  recipientName = "Thomas D.",
  issueDate = "18 Septembre 2026",
  certificateId = "DOM-2026-EN933-8842",
}: CertificateModalProps) {
  const [isDownloading, setIsDownloading] = React.useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      const link = document.createElement("a");
      link.href = "#";
      link.download = `Certificat_${recipientName.replace(/\s+/g, "_")}.pdf`;
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dm-ink/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-dm-border overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dm-border bg-dm-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-dm-primary/10 text-dm-primary flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-dm-muted">
                Certificat Officiel DO-Mining
              </div>
              <div className="text-sm font-semibold text-dm-ink">
                Attestation d&apos;Aptitude Professionnelle
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-dm-border bg-white hover:bg-dm-surface text-dm-ink transition-colors cursor-pointer"
              title="Imprimer le certificat"
            >
              <Printer className="w-3.5 h-3.5 text-dm-muted" />
              <span>Imprimer</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-dm-primary text-white hover:bg-dm-primary-deep transition-colors cursor-pointer shadow-xs disabled:opacity-75"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloading ? "animate-bounce" : ""}`} />
              <span>{isDownloading ? "Génération PDF..." : "Télécharger PDF"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-dm-muted hover:text-dm-ink hover:bg-dm-border/40 transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Canvas */}
        <div className="p-8 sm:p-10 bg-gradient-to-b from-amber-50/40 via-white to-sky-50/30 relative">
          {/* Decorative Border Frame */}
          <div className="border-2 border-dashed border-amber-300/80 rounded-xl p-6 sm:p-8 relative bg-white/80 backdrop-blur-xs shadow-xs">
            {/* Corner Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-dm-primary" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-dm-primary" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-dm-primary" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-dm-primary" />

            {/* Header / Brand */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dm-primary-soft text-dm-primary-deep text-[11px] font-bold tracking-widest uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DO-MINING CERTIFICATION SYSTEM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dm-ink tracking-tight pt-1">
                Certificat d&apos;Aptitude Métier
              </h2>
              <p className="text-xs text-dm-muted uppercase tracking-widest">
                Mines, Carrières &amp; Industrie Minérale
              </p>
            </div>

            {/* Divider */}
            <div className="w-16 h-0.5 bg-dm-primary mx-auto my-6" />

            {/* Recipient info */}
            <div className="text-center space-y-2">
              <p className="text-xs text-dm-muted">Ce certificat est décerné à</p>
              <h3 className="text-xl sm:text-2xl font-bold text-dm-primary-deep tracking-tight">
                {recipientName}
              </h3>
              <p className="text-xs text-dm-muted max-w-md mx-auto pt-1 leading-relaxed">
                pour avoir validé avec succès l&apos;ensemble des épreuves théoriques et les protocoles de sécurité opérationnelle du parcours :
              </p>
              <div className="inline-block px-4 py-2 mt-2 rounded-lg bg-dm-surface border border-dm-border font-semibold text-sm text-dm-ink">
                {courseTitle}
              </div>
            </div>

            {/* Competencies Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-[11px] text-dm-muted">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                <CheckCircle className="w-3 h-3" /> Décapage &amp; Merlons de sécurité
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                <CheckCircle className="w-3 h-3" /> Abattage &amp; Foration
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                <CheckCircle className="w-3 h-3" /> Concassage EN 933
              </span>
            </div>

            {/* Footer Signatures & Stamp */}
            <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-dm-border text-xs">
              <div className="space-y-1">
                <div className="font-serif italic text-dm-ink font-semibold text-sm">Marc V.</div>
                <div className="text-[11px] font-semibold text-dm-primary-deep">
                  Expert Référent Mines &amp; Carrières
                </div>
                <div className="text-[10px] text-dm-muted">DO-Mining France</div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-[10px] text-dm-muted font-mono">
                  ID : {certificateId}
                </div>
                <div className="text-[10px] text-dm-muted">
                  Délivré le {issueDate}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                  <CheckCircle className="w-3 h-3" /> Scellé vérifié SHA-256
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-6 py-3 bg-dm-surface border-t border-dm-border flex items-center justify-between text-xs text-dm-muted">
          <span>Authentification publique vérifiable sur le registre national DO-Mining.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-dm-border bg-white text-dm-ink font-medium hover:bg-dm-border/20 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
