"use server";

import { SimulationManager } from "@do-mining/mocks";
import { ok, fail } from "@do-mining/core";
import type { Result, QuizEvaluationResult } from "@do-mining/core";

interface SubmitQuizPayload {
  quizId: string;
  answers: Record<string, string>;
}

export async function submitQuizAction(
  payload: SubmitQuizPayload,
): Promise<Result<QuizEvaluationResult>> {
  // En situation réelle, on utiliserait le contentAdapter pour vérifier les réponses
  // via une fonction dédiée d'évaluation.
  // Pour le prototype, on simule un backend "aveugle" pour le client.

  const QUIZ_DATA_SECURE = [
    { id: "q1", correctId: "opt_1b" },
    { id: "q2", correctId: "opt_2a" },
    { id: "q3", correctId: "opt_3b" },
  ];

  let correctCount = 0;
  const total = QUIZ_DATA_SECURE.length;

  const results = QUIZ_DATA_SECURE.map((q) => {
    const isCorrect = payload.answers[q.id] === q.correctId;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      isCorrect,
      explanation: q.correctId,
    };
  });

  const scorePercentage = Math.round((correctCount / total) * 100);
  const passed = scorePercentage >= 80;

  return ok({
    attemptId: "sim_" + Date.now(),
    scorePercent: scorePercentage,
    passed,
    details: results,
  });
}
