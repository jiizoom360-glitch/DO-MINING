"use client";

import React, { useState } from "react";
import { X, Send, User, MessageSquare, Check } from "lucide-react";

export interface QuickMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
  recipientRole?: string;
}

export function QuickMessageModal({
  isOpen,
  onClose,
  recipientName = "Marc V.",
  recipientRole = "Expert Référent Mines & Carrières",
}: QuickMessageModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage("");
      setSubject("");
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dm-ink/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-dm-border overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dm-border bg-dm-surface">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-dm-primary-soft text-dm-primary-deep flex items-center justify-center font-bold text-sm">
              {recipientName.charAt(0)}
            </div>
            <div>
              <div className="text-xs text-dm-muted">Envoyer un message direct à</div>
              <div className="text-sm font-bold text-dm-ink">{recipientName}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-dm-muted hover:text-dm-ink hover:bg-dm-border/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {sent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-dm-ink">Message envoyé avec succès</h4>
            <p className="text-xs text-dm-muted">
              {recipientName} recevra votre message avec une notification instantanée.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-dm-ink mb-1">
                Destinataire
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-dm-surface border border-dm-border text-xs text-dm-ink">
                <span className="font-semibold">{recipientName}</span>
                <span className="text-dm-muted">• {recipientRole}</span>
              </div>
            </div>

            <div>
              <label htmlFor="msg-subject" className="block text-xs font-semibold text-dm-ink mb-1">
                Sujet
              </label>
              <input
                id="msg-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex : Question sur l'étape de concassage primaire..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-dm-border bg-white text-dm-ink placeholder:text-dm-muted focus:outline-none focus:ring-2 focus:ring-dm-primary"
              />
            </div>

            <div>
              <label htmlFor="msg-content" className="block text-xs font-semibold text-dm-ink mb-1">
                Votre message
              </label>
              <textarea
                id="msg-content"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bonjour Marc, j'aimerais avoir un éclaircissement sur le réglage de l'écartement des mâchoires..."
                className="w-full p-3 text-xs rounded-lg border border-dm-border bg-white text-dm-ink placeholder:text-dm-muted focus:outline-none focus:ring-2 focus:ring-dm-primary resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-dm-border">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-dm-border bg-white text-dm-ink hover:bg-dm-surface cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-dm-primary text-white hover:bg-dm-primary-deep transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
