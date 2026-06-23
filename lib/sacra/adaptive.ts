/**
 * SACRA Adaptive Learning Layer
 * ==============================
 * Implements:
 *   - Bayesian posterior updating from assessment history
 *   - Exponential Moving Average (EMA) for performance trajectory
 *   - Historical weight decay (older data matters less)
 *   - Score adjustment based on accumulated evidence
 */

import { db } from "@/lib/prisma";
import type { DomainScore, SACRAResult } from "./engine";
import { DOMAINS } from "./domains";

// ============================================================
// Configuration
// ============================================================
const LEARNING_RATE = 0.3; // α — smoothing factor for EMA
const DECAY_CONSTANT = 0.01; // λ — decay constant for historical weights
const PRIOR_STRENGTH = 0.6; // How much the original SACRA score anchors the posterior
const EVIDENCE_STRENGTH = 0.4; // How much assessment evidence shifts the score

// ============================================================
// Types
// ============================================================
interface AssessmentRecord {
  quizScore: number; // 0-100
  category: string; // "Technical", "Interest", etc.
  improvementTip: string | null;
  createdAt: Date;
}

interface PerformanceTrajectory {
  domainId: string;
  ema: number; // Exponential Moving Average of recent scores
  trend: "improving" | "stable" | "declining";
  dataPoints: number;
}

interface AdaptiveResult {
  adjustedScores: DomainScore[];
  trajectories: PerformanceTrajectory[];
  adaptationApplied: boolean;
  priorVersion: number;
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Calculate time-decayed weight for a historical data point.
 * More recent data has higher weight.
 */
function timeDecayWeight(createdAt: Date): number {
  const daysAgo =
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  return Math.exp(-DECAY_CONSTANT * daysAgo);
}

/**
 * Map assessment category/skill to domain IDs.
 * An assessment about "JavaScript" maps to web_development, mobile_development, etc.
 */
function mapAssessmentToDomains(
  category: string,
  improvementTip: string | null
): string[] {
  const text = `${category} ${improvementTip || ""}`.toLowerCase();

  const domainMappings: Record<string, string[]> = {
    web_development: [
      "web",
      "frontend",
      "react",
      "html",
      "css",
      "javascript",
      "node",
      "next",
      "full-stack",
      "fullstack",
    ],
    data_science: [
      "data science",
      "pandas",
      "numpy",
      "statistics",
      "analytics",
      "visualization",
    ],
    ai_ml: [
      "machine learning",
      "ml",
      "ai",
      "artificial intelligence",
      "deep learning",
      "neural",
      "tensorflow",
      "pytorch",
    ],
    cybersecurity: [
      "security",
      "cyber",
      "penetration",
      "hacking",
      "encryption",
      "vulnerability",
    ],
    cloud_devops: [
      "cloud",
      "devops",
      "aws",
      "azure",
      "docker",
      "kubernetes",
      "deployment",
      "ci/cd",
    ],
    mobile_development: [
      "mobile",
      "android",
      "ios",
      "flutter",
      "react native",
      "swift",
      "kotlin",
    ],
    backend_engineering: [
      "backend",
      "api",
      "server",
      "database",
      "sql",
      "microservice",
      "rest",
    ],
    blockchain: [
      "blockchain",
      "web3",
      "smart contract",
      "solidity",
      "decentralized",
      "crypto",
    ],
    game_development: [
      "game",
      "unity",
      "unreal",
      "3d",
      "graphics",
      "physics engine",
    ],
    data_engineering: [
      "data engineering",
      "pipeline",
      "etl",
      "warehouse",
      "spark",
      "kafka",
    ],
    ui_ux_design: ["design", "ui", "ux", "user interface", "figma", "sketch"],
    embedded_iot: [
      "embedded",
      "iot",
      "hardware",
      "microcontroller",
      "sensor",
      "arduino",
      "raspberry",
    ],
  };

  const matchedDomains: string[] = [];
  for (const [domainId, keywords] of Object.entries(domainMappings)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        matchedDomains.push(domainId);
        break;
      }
    }
  }

  // If no specific match, apply to all as "general technical"
  if (matchedDomains.length === 0) {
    return DOMAINS.map((d) => d.id);
  }

  return matchedDomains;
}

// ============================================================
// BAYESIAN POSTERIOR UPDATING
// ============================================================

/**
 * Update domain scores using Bayesian posterior estimation.
 *
 * The prior is the SACRA composite score.
 * The likelihood is derived from assessment performance in related domains.
 *
 * posterior = (PRIOR_STRENGTH × prior + EVIDENCE_STRENGTH × evidence) / 1.0
 *
 * Where evidence = time-weighted average of assessment scores mapped to this domain.
 */
function bayesianUpdate(
  priorScores: DomainScore[],
  assessments: AssessmentRecord[]
): DomainScore[] {
  if (assessments.length === 0) return priorScores;

  // Build evidence per domain
  const evidenceMap: Record<string, { weightedSum: number; totalWeight: number }> = {};

  for (const domain of DOMAINS) {
    evidenceMap[domain.id] = { weightedSum: 0, totalWeight: 0 };
  }

  for (const assessment of assessments) {
    const relatedDomains = mapAssessmentToDomains(
      assessment.category,
      assessment.improvementTip
    );
    const decay = timeDecayWeight(assessment.createdAt);

    for (const domainId of relatedDomains) {
      if (evidenceMap[domainId]) {
        evidenceMap[domainId].weightedSum += assessment.quizScore * decay;
        evidenceMap[domainId].totalWeight += decay;
      }
    }
  }

  // Apply Bayesian update to each domain score
  return priorScores.map((score) => {
    const evidence = evidenceMap[score.domainId];
    if (!evidence || evidence.totalWeight === 0) return score;

    const evidenceScore = evidence.weightedSum / evidence.totalWeight;

    // Posterior = weighted combination of prior and evidence
    const posteriorScore =
      PRIOR_STRENGTH * score.compositeScore +
      EVIDENCE_STRENGTH * evidenceScore;

    return {
      ...score,
      compositeScore: Math.round(posteriorScore * 100) / 100,
    };
  });
}

// ============================================================
// EXPONENTIAL MOVING AVERAGE TRAJECTORY
// ============================================================

/**
 * Calculate EMA trajectory for each domain based on assessment history.
 * Tracks whether the user is improving, stable, or declining in each area.
 */
function calculateTrajectories(
  assessments: AssessmentRecord[]
): PerformanceTrajectory[] {
  // Sort assessments by date (oldest first)
  const sorted = [...assessments].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );

  const trajectories: Record<
    string,
    { ema: number; prevEma: number; dataPoints: number }
  > = {};

  // Initialize all domains
  for (const domain of DOMAINS) {
    trajectories[domain.id] = { ema: 50, prevEma: 50, dataPoints: 0 };
  }

  // Process each assessment chronologically
  for (const assessment of sorted) {
    const relatedDomains = mapAssessmentToDomains(
      assessment.category,
      assessment.improvementTip
    );

    for (const domainId of relatedDomains) {
      if (trajectories[domainId]) {
        const traj = trajectories[domainId];
        traj.prevEma = traj.ema;
        // EMA formula: EMA_t = α × P_t + (1-α) × EMA_{t-1}
        traj.ema =
          LEARNING_RATE * assessment.quizScore +
          (1 - LEARNING_RATE) * traj.ema;
        traj.dataPoints++;
      }
    }
  }

  // Convert to output format with trend detection
  return Object.entries(trajectories)
    .filter(([_, t]) => t.dataPoints > 0)
    .map(([domainId, t]) => {
      const emaDiff = t.ema - t.prevEma;
      let trend: "improving" | "stable" | "declining";

      if (emaDiff > 3) trend = "improving";
      else if (emaDiff < -3) trend = "declining";
      else trend = "stable";

      return {
        domainId,
        ema: Math.round(t.ema * 100) / 100,
        trend,
        dataPoints: t.dataPoints,
      };
    });
}

/**
 * Apply trajectory adjustments to domain scores.
 * Improving domains get a small boost, declining ones get a slight penalty.
 */
function applyTrajectoryAdjustments(
  scores: DomainScore[],
  trajectories: PerformanceTrajectory[]
): DomainScore[] {
  const trajectoryMap = new Map(trajectories.map((t) => [t.domainId, t]));

  return scores.map((score) => {
    const trajectory = trajectoryMap.get(score.domainId);
    if (!trajectory || trajectory.dataPoints < 2) return score;

    let adjustment = 0;
    const trajectoryWeight = Math.min(0.1, trajectory.dataPoints * 0.02);

    if (trajectory.trend === "improving") {
      adjustment = trajectoryWeight * (trajectory.ema - 50);
    } else if (trajectory.trend === "declining") {
      adjustment = -trajectoryWeight * (50 - trajectory.ema);
    }

    return {
      ...score,
      compositeScore: Math.round(
        Math.min(100, Math.max(0, score.compositeScore + adjustment)) * 100
      ) / 100,
    };
  });
}

// ============================================================
// MAIN ADAPTIVE FUNCTION
// ============================================================

/**
 * Apply adaptive learning to SACRA scores using the user's assessment history.
 *
 * 1. Fetches all assessments for the user
 * 2. Applies Bayesian posterior updating
 * 3. Calculates EMA performance trajectories
 * 4. Applies trajectory adjustments
 * 5. Re-sorts by adjusted score
 *
 * @param userId - The internal DB user ID (not Clerk ID)
 * @param sacraResult - The initial SACRA scores from the scoring engine
 */
export async function applyAdaptiveLearning(
  userId: string,
  sacraResult: SACRAResult
): Promise<AdaptiveResult> {
  // Fetch assessment history
  const assessments = await db.assessment.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: {
      quizScore: true,
      category: true,
      improvementTip: true,
      createdAt: true,
    },
  });

  if (assessments.length === 0) {
    return {
      adjustedScores: sacraResult.scores,
      trajectories: [],
      adaptationApplied: false,
      priorVersion: 0,
    };
  }

  // Step 1: Bayesian posterior update
  let adjustedScores = bayesianUpdate(sacraResult.scores, assessments);

  // Step 2: Calculate trajectories
  const trajectories = calculateTrajectories(assessments);

  // Step 3: Apply trajectory adjustments
  adjustedScores = applyTrajectoryAdjustments(adjustedScores, trajectories);

  // Step 4: Re-sort
  adjustedScores.sort((a, b) => b.compositeScore - a.compositeScore);

  // Get current SACRA version from user
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { sacraVersion: true },
  });

  return {
    adjustedScores,
    trajectories,
    adaptationApplied: true,
    priorVersion: user?.sacraVersion || 0,
  };
}

/**
 * Persist SACRA scores to the user's profile for caching.
 */
export async function persistSACRAScores(
  userId: string,
  result: SACRAResult
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: {
      sacraScores: result as any,
      sacraVersion: { increment: 1 },
    },
  });
}

/**
 * Load cached SACRA scores from the user's profile.
 */
export async function loadCachedSACRAScores(
  userId: string
): Promise<SACRAResult | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { sacraScores: true },
  });

  if (!user?.sacraScores) return null;
  return user.sacraScores as unknown as SACRAResult;
}
