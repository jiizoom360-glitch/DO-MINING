"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { SpaceShell } from "@/app/components/SpaceShell";
import {
  PageHeader,
  Card,
  Badge,
  Button,
  Progress,
  StatCard,
} from "@do-mining/ui";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Clock,
  ShieldCheck,
  Loader2,
  FileCheck2,
} from "lucide-react";

import { submitQuizAction } from "./actions";
import type { QuizEvaluationResult } from "@do-mining/core";

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

interface QuestionClient {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  explanation: string;
}

const QUIZ_DATA_CLIENT: QuestionClient[] = [
  {
    id: "q1",
    prompt:
      "Quelle est la règle géotechnique et réglementaire pour la hauteur minimale d’un merlon de protection en bord de piste de carrière ?",
    options: [
      {
        id: "opt_1a",
        text: "Une hauteur fixe arbitraire de 60 centimètres quel que soit le matériel",
      },
      {
        id: "opt_1b",
        text: "Au minimum égale au rayon de la plus grande roue des engins de transport (dumper)",
      },
      {
        id: "opt_1c",
        text: "Au moins 3 mètres au-dessus du sommet de la cabine",
      },
    ],
    explanation:
      "Selon les préconisations du RGIE et de l’INRS, le merlon d’arrêt doit avoir une hauteur au moins égale au rayon du pneu du plus grand dumper en circulation pour bloquer la roue sans effet de tremplin.",
  },
  {
    id: "q2",
    prompt:
      "Selon les normes européennes EN 933 et EN 1097, quel essai mesure la résistance globale à la fragmentation mécanique des granulats sous chocs rotatifs ?",
    options: [
      { id: "opt_2a", text: "L’essai Los Angeles (LA) avec boulets d’acier" },
      { id: "opt_2b", text: "L’équivalent de sable (ES) à 10% de fines" },
      { id: "opt_2c", text: "L’essai au bleu de méthylène (VBS)" },
    ],
    explanation:
      "L’essai Los Angeles (norme EN 1097-2) mesure la résistance des granulats à l’impact et à la fragmentation dans un tambour cylindrique rotatif contenant des boulets normalisés.",
  },
  {
    id: "q3",
    prompt:
      "Quel est l’objectif principal du débourbage et du lavage lors du traitement des granulats alluvionnaires ou de roche massive polluée ?",
    options: [
      { id: "opt_3a", text: "Réduire le diamètre maximal des blocs" },
      {
        id: "opt_3b",
        text: "Éliminer les argiles et particules fines (< 63 µm) collées aux gravillons pour garantir la propreté",
      },
      {
        id: "opt_3c",
        text: "Augmenter la teneur en eau avant le pesage commercial",
      },
    ],
    explanation:
      "Le lavage permet d’extraire les fractions argileuses qui nuiraient à l’adhérence des liants hydrauliques ou bitumineux, garantissant la conformité du fuseau granulométrique EN 933.",
  },
];

export default function QuizPage({ params }: QuizPageProps) {
  const { id } = use(params);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizEvaluationResult | null>(null);

  const totalQuestions = QUIZ_DATA_CLIENT.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted || isSubmitting) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (isSubmitting || submitted || answeredCount < totalQuestions) return;
    setIsSubmitting(true);
    try {
      // Simulate network verification & calculation delay so the spinner and state are distinct
      const [res] = await Promise.all([
        submitQuizAction({
          quizId: id,
          answers: selectedAnswers,
        }),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      if (res.success) {
        setResult(res.data);
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Erreur lors de la validation du quiz :", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SpaceShell space="learner" activeRoute={`/quiz/${id}`}>
      <PageHeader
        title="Évaluation Technique & Validation EN 933"
        description="Contrôle des connaissances sur les paramètres d’exploitation en carrière, concassage et normes granulométriques."
        badge={
          <Badge variant="primary" dot>
            Évaluation Métier
          </Badge>
        }
        breadcrumbs={[
          { label: "Espace Apprenant", href: "/dashboard" },
          { label: "Évaluations", href: "/dashboard" },
          { label: id, isCurrent: true },
        ]}
        actions={
          submitted && result ? (
            <div className="flex items-center gap-2">
              <Button
                id="retry-quiz-btn"
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={() => {
                  setSubmitted(false);
                  setResult(null);
                  setSelectedAnswers({});
                }}
              >
                Recommencer le test
              </Button>
              <Link href="/dashboard">
                <Button
                  id="dashboard-return-btn"
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Retour au tableau de bord
                </Button>
              </Link>
            </div>
          ) : (
            <Button
              id="submit-quiz-header-btn"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              disabled={answeredCount < totalQuestions || isSubmitting}
              onClick={handleSubmit}
              aria-busy={isSubmitting}
            >
              {isSubmitting
                ? "Validation en cours..."
                : `Soumettre mes réponses (${answeredCount}/${totalQuestions})`}
            </Button>
          )
        }
      />

      {/* DYNAMIC PROGRESS BAR AT TOP OF QUIZ */}
      <div
        id="quiz-progress-tracker"
        className="bg-white rounded-2xl border border-dm-border p-4 sm:p-5 shadow-xs space-y-3.5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-dm-ink uppercase tracking-wider">
                Progression du questionnaire
              </span>
              <span
                className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-colors ${
                  answeredCount === totalQuestions
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-dm-primary-soft text-dm-primary-deep border border-dm-primary/20"
                }`}
              >
                {answeredCount === totalQuestions
                  ? "Toutes les questions répondues ✓"
                  : `${answeredCount} sur ${totalQuestions} question${answeredCount > 1 ? "s" : ""} renseignée${answeredCount > 1 ? "s" : ""}`}
              </span>
            </div>
            <p className="text-xs text-dm-muted">
              {submitted
                ? "Évaluation terminée et analysée selon les référentiels de compétences."
                : answeredCount === totalQuestions
                ? "Toutes les réponses obligatoires sont cochées. Vous pouvez soumettre l'évaluation pour validation."
                : `Veuillez renseigner encore ${totalQuestions - answeredCount} question${totalQuestions - answeredCount > 1 ? "s" : ""} pour débloquer la validation officielle.`}
            </p>
          </div>

          {/* Progress Percent & Fractional Counter */}
          <div className="flex items-baseline gap-2 shrink-0 self-start sm:self-auto">
            <span className="text-2xl font-extrabold text-dm-ink tabular-nums">
              {progressPercent}%
            </span>
            <span className="text-xs font-semibold text-dm-muted">
              ({answeredCount}/{totalQuestions})
            </span>
          </div>
        </div>

        {/* Visual Progress Bar Track */}
        <div
          className="w-full h-2.5 bg-dm-surface rounded-full overflow-hidden border border-dm-border/60 relative"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progression des réponses au questionnaire"
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${
              answeredCount === totalQuestions
                ? "bg-emerald-500"
                : "bg-dm-primary"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question by question navigation chips */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          {QUIZ_DATA_CLIENT.map((q, idx) => {
            const isAnswered = !!selectedAnswers[q.id];
            return (
              <a
                key={q.id}
                href={`#question-${q.id}`}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border ${
                  isAnswered
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs"
                    : "bg-dm-surface/60 border-dm-border text-dm-muted hover:border-dm-primary/40 hover:text-dm-ink"
                }`}
              >
                {isAnswered ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-dm-muted/40 shrink-0" />
                )}
                <span>Question {idx + 1}</span>
                <span className="hidden md:inline text-[10px] font-normal opacity-75">
                  {isAnswered ? "(Répondue)" : "(En attente)"}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Result banner if submitted */}
      {submitted && result && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            result.passed
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950"
              : "bg-rose-500/10 border-rose-500/30 text-rose-950"
          }`}
        >
          <div className="flex items-center gap-3">
            {result.passed ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
            )}
            <div>
              <div className="font-bold text-sm">
                {result.passed
                  ? "Évaluation validée avec succès ! Attestation éligible."
                  : "Score insuffisant pour la certification (minimum 80% requis)."}
              </div>
              <div className="text-xs text-dm-muted">
                Résultat obtenu : <strong>{result.scorePercent}%</strong> (
                {result.details.filter((r) => r.isCorrect).length} /{" "}
                {QUIZ_DATA_CLIENT.length} réponses exactes)
              </div>
            </div>
          </div>
          <Badge variant={result.passed ? "success" : "outline"} size="sm">
            {result.passed ? "Norme EN 933 Certifiée" : "À perfectionner"}
          </Badge>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6">
        {QUIZ_DATA_CLIENT.map((q, idx) => {
          const selected = selectedAnswers[q.id];
          const questionResult = result?.details.find(
            (r) => r.questionId === q.id,
          );
          const isCorrect = questionResult?.isCorrect;

          return (
            <div key={q.id} id={`question-${q.id}`} className="scroll-mt-6">
              <Card
                title={`Question ${idx + 1} sur ${QUIZ_DATA_CLIENT.length}`}
                subtitle="Choix unique obligatoire"
                badge={
                  submitted && questionResult ? (
                    isCorrect ? (
                      <Badge variant="success" size="sm">
                        Exact +1
                      </Badge>
                    ) : (
                      <Badge variant="outline" size="sm">
                        Incorrect
                      </Badge>
                    )
                  ) : (
                    <Badge variant="neutral" size="sm">
                      1 point
                    </Badge>
                  )
                }
              >
                <div className="space-y-3.5 text-xs">
                  <p className="font-semibold text-dm-ink text-sm leading-snug">
                    {q.prompt}
                  </p>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt) => {
                      const isOptionSelected = selected === opt.id;
                      const isOptionCorrect = submitted
                        ? opt.id === questionResult?.explanation
                        : false;

                      let optionStyle =
                        "border-dm-border bg-dm-white hover:bg-dm-surface text-dm-ink";

                      if (submitted) {
                        if (isOptionCorrect) {
                          optionStyle =
                            "border-emerald-500 bg-emerald-50 text-emerald-950 font-medium";
                        } else if (isOptionSelected && !isOptionCorrect) {
                          optionStyle =
                            "border-rose-400 bg-rose-50 text-rose-900";
                        } else {
                          optionStyle =
                            "border-dm-border/60 bg-dm-surface/40 text-dm-muted";
                        }
                      } else if (isOptionSelected) {
                        optionStyle =
                          "border-dm-primary bg-dm-primary-soft text-dm-primary-deep font-semibold";
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelect(q.id, opt.id)}
                          disabled={submitted || isSubmitting}
                          className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer disabled:cursor-default ${optionStyle}`}
                        >
                          <span>{opt.text}</span>
                          {submitted && isOptionCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {submitted && isOptionSelected && !isOptionCorrect && (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="p-3 bg-dm-surface rounded-lg border border-dm-border text-[11px] space-y-1">
                      <span className="font-semibold text-dm-primary-deep">
                        Justification technique :{" "}
                      </span>
                      <span className="text-dm-muted">{q.explanation}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          );
        })}

        {/* BOTTOM SUBMISSION CARD */}
        {!submitted && (
          <div
            id="quiz-bottom-submit-card"
            className="bg-white rounded-2xl border border-dm-border p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="font-bold text-sm text-dm-ink flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-dm-primary" />
                <span>
                  {answeredCount === totalQuestions
                    ? "Toutes les questions sont complétées"
                    : `Questions restantes : ${totalQuestions - answeredCount} sur ${totalQuestions}`}
                </span>
              </div>
              <p className="text-xs text-dm-muted">
                {answeredCount === totalQuestions
                  ? "Vos réponses sont enregistrées localement et prêtes pour l'évaluation certifiante."
                  : "Vous devez sélectionner une option pour chaque question avant de valider votre copie."}
              </p>
            </div>

            <Button
              id="submit-quiz-bottom-btn"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              disabled={answeredCount < totalQuestions || isSubmitting}
              onClick={handleSubmit}
              aria-busy={isSubmitting}
              className="shrink-0"
            >
              {isSubmitting
                ? "Validation en cours..."
                : `Soumettre le quiz (${answeredCount}/${totalQuestions})`}
            </Button>
          </div>
        )}
      </div>
    </SpaceShell>
  );
}
