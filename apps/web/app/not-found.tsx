"use client";

import React from "react";
import Link from "next/link";
import { Pickaxe, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#08AFC1]/10 text-[#08AFC1] mb-6 border border-[#08AFC1]/20">
          <Pickaxe className="w-8 h-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#08AFC1] mb-2">
          Erreur 404
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">
          Page introuvable
        </h1>
        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          Le module, la ressource ou l&apos;élément demandé n&apos;est pas disponible dans l&apos;arbre de contenu DO-Mining ou a été déplacé.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#08AFC1] text-white text-sm font-semibold hover:bg-[#0799a8] transition shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Retour à l&apos;accueil</span>
          </Link>
          <Link
            href="/formations"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Catalogue formations</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
