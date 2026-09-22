"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error in monitoring console if necessary
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mb-6 border border-amber-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
          Incident Détecté
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">
          Une erreur temporaire est survenue
        </h1>
        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          Le chargement de cette vue a rencontré un problème inattendu. Vous pouvez relancer le rendu ou revenir à l&apos;accueil.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#08AFC1] text-white text-sm font-semibold hover:bg-[#0799a8] transition cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réessayer</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
          >
            <Home className="w-4 h-4" />
            <span>Accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
