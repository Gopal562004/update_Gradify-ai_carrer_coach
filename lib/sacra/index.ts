/**
 * SACRA — Simplified Adaptive Career Recommendation Algorithm
 * =============================================================
 * Public API for the SACRA engine.
 *
 * Usage:
 *   import { runSACRA, getSACRAScoresForPrompt } from "@/lib/sacra";
 *
 *   // Calculate scores
 *   const result = await runSACRA(userId, userProfile, quizAnswers);
 *
 *   // Get formatted string for Gemini prompt injection
 *   const promptSection = getSACRAScoresForPrompt(result);
 */

export { calculateSACRAScores, getDomains, getDomainById } from "./engine";
export type {
  UserProfile,
  QuizAnswers,
  DomainScore,
  SACRAResult,
} from "./engine";

export {
  applyAdaptiveLearning,
  persistSACRAScores,
  loadCachedSACRAScores,
} from "./adaptive";

export {
  DOMAINS,
  INTEREST_CATEGORIES,
  ACADEMIC_SUBJECTS,
  SKILL_SYNONYMS,
} from "./domains";
export type { DomainDefinition, InterestCategory, AcademicSubject } from "./domains";

import { calculateSACRAScores, type UserProfile, type QuizAnswers, type SACRAResult } from "./engine";
import { applyAdaptiveLearning, persistSACRAScores } from "./adaptive";

/**
 * Run the full SACRA pipeline:
 * 1. Calculate base scores from user profile + quiz
 * 2. Apply adaptive learning from assessment history
 * 3. Persist updated scores
 *
 * @param userId - Internal DB user ID
 * @param userProfile - User's profile data
 * @param quizAnswers - Optional quiz answers (null if profile-only mode)
 * @returns Full SACRA result with adapted scores
 */
export async function runSACRA(
  userId: string,
  userProfile: UserProfile,
  quizAnswers: QuizAnswers | null = null
): Promise<SACRAResult> {
  // Step 1: Calculate base SACRA scores
  const baseResult = calculateSACRAScores(userProfile, quizAnswers);

  // Step 2: Apply adaptive learning from assessment history
  const adaptiveResult = await applyAdaptiveLearning(userId, baseResult);

  // Build final result
  const finalResult: SACRAResult = {
    ...baseResult,
    scores: adaptiveResult.adjustedScores,
    topFields: adaptiveResult.adjustedScores.slice(0, 5).map((s) => s.domainName),
  };

  // Step 3: Persist scores for caching and future adaptive learning
  await persistSACRAScores(userId, finalResult);

  return finalResult;
}

/**
 * Format SACRA scores as a text block for injection into Gemini AI prompts.
 * This ensures the AI recommendations are grounded in the algorithmic scores.
 */
export function getSACRAScoresForPrompt(result: SACRAResult): string {
  const lines = [
    "=== SACRA ALGORITHM SCORES (Simplified Adaptive Career Recommendation Algorithm) ===",
    `Algorithm Version: ${result.algorithmVersion}`,
    `Data Completeness: ${Math.round(result.dataCompleteness * 100)}%`,
    `Confidence: ${result.scores[0]?.confidence ? Math.round(result.scores[0].confidence * 100) + "%" : "N/A"}`,
    "",
    "Domain Rankings (sorted by composite score):",
  ];

  for (const score of result.scores) {
    lines.push(
      `  ${score.domainName}: ${score.compositeScore.toFixed(1)}/100 ` +
        `(Academic=${score.factors.academic.toFixed(0)}, Interest=${score.factors.interest.toFixed(0)}, ` +
        `Skill=${score.factors.skill.toFixed(0)}, Growth=${score.factors.growth.toFixed(0)}) ` +
        `[Confidence: ${Math.round(score.confidence * 100)}%]`
    );
  }

  const topDomain = result.scores[0];
  if (topDomain) {
    lines.push("");
    lines.push(`Top Recommendation: ${topDomain.domainName}`);
    lines.push(`Skill Gaps: ${topDomain.skillGaps.join(", ") || "None"}`);
    lines.push(`Matched Skills: ${topDomain.matchedSkills.join(", ") || "None"}`);
  }

  lines.push("");
  lines.push(
    "IMPORTANT: Use the above SACRA scores to weight and prioritize your career field recommendations. " +
    "The top-scoring domains should be given preference. Include the SACRA scores in your response summary."
  );

  return lines.join("\n");
}
