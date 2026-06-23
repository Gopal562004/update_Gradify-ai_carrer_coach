/**
 * SACRA Scoring Engine
 * =====================
 * Multi-factor scoring with:
 *   - TF-IDF-inspired weighted skill matching with fuzzy similarity
 *   - Cosine similarity for interest pattern analysis
 *   - Per-domain academic relevance weighting
 *   - Industry growth potential scoring
 *   - Cold-start adaptive weight adjustment
 *   - Confidence scoring
 */

import {
  DOMAINS,
  SKILL_SYNONYMS,
  INTEREST_CATEGORIES,
  QUIZ_ANSWER_INTEREST_MAP,
  type DomainDefinition,
  type InterestCategory,
  type AcademicSubject,
} from "./domains";

// ============================================================
// Types
// ============================================================
export interface UserProfile {
  skills: string[];
  experience: number | null;
  industry: string | null;
  dsaGrade: number | null;
  oopGrade: number | null;
  dbmsGrade: number | null;
  osGrade: number | null;
}

export interface QuizAnswers {
  partA?: Record<string, string>;
  partB?: Record<string, string>;
}

export interface DomainScore {
  domainId: string;
  domainName: string;
  compositeScore: number; // 0-100 final score
  factors: {
    academic: number; // Factor A: 0-100
    interest: number; // Factor I: 0-100
    skill: number; // Factor S: 0-100
    growth: number; // Factor G: 0-100
  };
  confidence: number; // 0-1 how reliable this score is
  skillGaps: string[]; // skills the user is missing
  matchedSkills: string[]; // skills the user already has
  weights: {
    w1: number;
    w2: number;
    w3: number;
    w4: number;
  };
}

export interface SACRAResult {
  scores: DomainScore[];
  topFields: string[];
  algorithmVersion: string;
  dataCompleteness: number; // 0-1
  timestamp: string;
}

// ============================================================
// FACTOR A: Academic Performance Score
// ============================================================
function calculateAcademicScore(
  user: UserProfile,
  domain: DomainDefinition
): { score: number; available: boolean } {
  const grades: Record<AcademicSubject, number | null> = {
    dsa: user.dsaGrade,
    oop: user.oopGrade,
    dbms: user.dbmsGrade,
    os: user.osGrade,
  };

  let weightedSum = 0;
  let totalWeight = 0;
  let hasAnyGrade = false;

  for (const subject of ["dsa", "oop", "dbms", "os"] as AcademicSubject[]) {
    const grade = grades[subject];
    const relevance = domain.academicRelevance[subject];

    if (grade !== null && grade !== undefined) {
      hasAnyGrade = true;
      // Normalize grade to 0-100 and apply relevance weight
      const normalizedGrade = Math.min(100, Math.max(0, grade));
      weightedSum += normalizedGrade * relevance;
      totalWeight += relevance;
    }
  }

  if (!hasAnyGrade || totalWeight === 0) {
    return { score: 50, available: false }; // neutral fallback
  }

  return {
    score: Math.round((weightedSum / totalWeight) * 100) / 100,
    available: true,
  };
}

// ============================================================
// FACTOR I: Interest Score via Cosine Similarity
// ============================================================

/**
 * Build an interest vector from quiz answers.
 * Each quiz answer is mapped to interest categories using the
 * QUIZ_ANSWER_INTEREST_MAP. The vector accumulates hits per category.
 */
function buildInterestVector(quizAnswers: QuizAnswers): number[] {
  const vector = new Array(INTEREST_CATEGORIES.length).fill(0);

  const allAnswers = [
    ...Object.values(quizAnswers.partA || {}),
    ...Object.values(quizAnswers.partB || {}),
  ];

  for (const answer of allAnswers) {
    const normalizedAnswer = answer.toLowerCase().trim();

    // Try exact match first
    for (const [pattern, categories] of Object.entries(
      QUIZ_ANSWER_INTEREST_MAP
    )) {
      if (normalizedAnswer.includes(pattern.toLowerCase())) {
        for (const cat of categories) {
          const idx = INTEREST_CATEGORIES.indexOf(cat);
          if (idx !== -1) vector[idx] += 1;
        }
      }
    }

    // Keyword-based fallback: scan for interest keywords in the answer
    const keywordMap: Record<string, InterestCategory[]> = {
      problem: ["problem_solving"],
      logic: ["problem_solving", "mathematics"],
      code: ["problem_solving"],
      debug: ["problem_solving"],
      algorithm: ["problem_solving", "mathematics"],
      creat: ["creativity"],
      design: ["creativity", "visual_design"],
      art: ["creativity", "visual_design"],
      innovat: ["creativity"],
      data: ["data_analysis"],
      analy: ["data_analysis"],
      stat: ["data_analysis", "mathematics"],
      pattern: ["data_analysis"],
      secur: ["security"],
      hack: ["security"],
      protect: ["security"],
      encrypt: ["security"],
      architect: ["system_design"],
      scale: ["system_design"],
      system: ["system_design"],
      cloud: ["system_design"],
      automat: ["automation"],
      script: ["automation"],
      devops: ["automation"],
      deploy: ["automation"],
      research: ["research"],
      paper: ["research"],
      study: ["research"],
      explor: ["research"],
      team: ["communication"],
      present: ["communication"],
      collaborat: ["communication"],
      write: ["communication"],
      visual: ["visual_design"],
      ui: ["visual_design"],
      ux: ["visual_design"],
      interface: ["visual_design"],
      hardware: ["hardware"],
      robot: ["hardware"],
      embed: ["hardware"],
      circuit: ["hardware"],
      math: ["mathematics"],
      calcul: ["mathematics"],
      number: ["mathematics"],
      probability: ["mathematics"],
      business: ["business"],
      product: ["business"],
      market: ["business"],
      startup: ["business"],
    };

    for (const [keyword, categories] of Object.entries(keywordMap)) {
      if (normalizedAnswer.includes(keyword)) {
        for (const cat of categories) {
          const idx = INTEREST_CATEGORIES.indexOf(cat);
          if (idx !== -1) vector[idx] += 0.5; // lower weight for keyword matches
        }
      }
    }
  }

  // Normalize vector to unit length
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  if (magnitude === 0) return vector;
  return vector.map((v) => v / magnitude);
}

/**
 * Cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
}

function calculateInterestScore(
  quizAnswers: QuizAnswers | null,
  domain: DomainDefinition
): { score: number; available: boolean } {
  if (
    !quizAnswers ||
    (Object.keys(quizAnswers.partA || {}).length === 0 &&
      Object.keys(quizAnswers.partB || {}).length === 0)
  ) {
    return { score: 50, available: false };
  }

  const userVector = buildInterestVector(quizAnswers);

  // Build domain's ideal interest vector
  const domainVector = INTEREST_CATEGORIES.map(
    (cat) => domain.interestPatterns[cat] || 0
  );

  const similarity = cosineSimilarity(userVector, domainVector);
  // Map from [-1, 1] cosine similarity to [0, 100] score
  const score = Math.round(((similarity + 1) / 2) * 100 * 100) / 100;

  return { score: Math.min(100, Math.max(0, score)), available: true };
}

// ============================================================
// FACTOR S: Skill Match Score with Fuzzy Matching
// ============================================================

/**
 * Normalize a skill string for comparison.
 */
function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim().replace(/[.\-_]/g, " ").replace(/\s+/g, " ");
}

/**
 * Find the canonical name for a skill using the synonym map.
 */
function findCanonicalSkill(skill: string): string {
  const normalized = normalizeSkill(skill);

  for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    for (const syn of synonyms) {
      if (
        normalizeSkill(syn) === normalized ||
        normalized.includes(normalizeSkill(syn)) ||
        normalizeSkill(syn).includes(normalized)
      ) {
        return canonical;
      }
    }
  }

  return normalized;
}

/**
 * Calculate Jaccard similarity between two strings (character n-grams).
 */
function jaccardSimilarity(a: string, b: string): number {
  const ngramSize = 2;
  const getNgrams = (s: string): Set<string> => {
    const ngrams = new Set<string>();
    const normalized = normalizeSkill(s);
    for (let i = 0; i <= normalized.length - ngramSize; i++) {
      ngrams.add(normalized.substring(i, i + ngramSize));
    }
    return ngrams;
  };

  const ngramsA = getNgrams(a);
  const ngramsB = getNgrams(b);

  if (ngramsA.size === 0 || ngramsB.size === 0) return 0;

  let intersection = 0;
  for (const ngram of ngramsA) {
    if (ngramsB.has(ngram)) intersection++;
  }

  const union = ngramsA.size + ngramsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Match a user skill against a domain skill with fuzzy matching.
 * Returns a match score between 0 and 1.
 */
function fuzzySkillMatch(userSkill: string, domainSkill: string): number {
  const userCanonical = findCanonicalSkill(userSkill);
  const domainCanonical = findCanonicalSkill(domainSkill);

  // Exact canonical match
  if (userCanonical === domainCanonical) return 1.0;

  // Substring match
  if (
    userCanonical.includes(domainCanonical) ||
    domainCanonical.includes(userCanonical)
  ) {
    return 0.85;
  }

  // Jaccard bigram similarity
  const jaccard = jaccardSimilarity(userCanonical, domainCanonical);
  if (jaccard > 0.6) return jaccard * 0.8;

  return 0;
}

function calculateSkillScore(
  user: UserProfile,
  domain: DomainDefinition
): { score: number; available: boolean; gaps: string[]; matched: string[] } {
  if (!user.skills || user.skills.length === 0) {
    return {
      score: 20,
      available: false,
      gaps: domain.requiredSkills.map((s) => s.name),
      matched: [],
    };
  }

  let matchedWeight = 0;
  let totalWeight = 0;
  const gaps: string[] = [];
  const matched: string[] = [];

  for (const domainSkill of domain.requiredSkills) {
    totalWeight += domainSkill.weight;

    let bestMatch = 0;
    let bestUserSkill = "";

    for (const userSkill of user.skills) {
      const matchScore = fuzzySkillMatch(userSkill, domainSkill.name);
      if (matchScore > bestMatch) {
        bestMatch = matchScore;
        bestUserSkill = userSkill;
      }
    }

    if (bestMatch > 0.3) {
      matchedWeight += domainSkill.weight * bestMatch;
      matched.push(bestUserSkill || domainSkill.name);
    } else {
      gaps.push(domainSkill.name);
    }
  }

  const score =
    totalWeight > 0
      ? Math.round((matchedWeight / totalWeight) * 100 * 100) / 100
      : 20;

  return {
    score: Math.min(100, Math.max(0, score)),
    available: true,
    gaps,
    matched: [...new Set(matched)],
  };
}

// ============================================================
// FACTOR G: Growth Potential Score
// ============================================================
function calculateGrowthScore(domain: DomainDefinition): number {
  const { baseGrowthRate, baseDemand } = domain.industryMetrics;

  // Normalize growth rate (0-50% range → 0-100)
  const normalizedGrowth = Math.min(100, (baseGrowthRate / 40) * 100);

  // Demand is already 0-100
  const demandScore = baseDemand;

  // Combine: 50% growth, 50% demand
  const score = 0.5 * normalizedGrowth + 0.5 * demandScore;
  return Math.round(score * 100) / 100;
}

// ============================================================
// COLD-START WEIGHT ADJUSTMENT
// Shifts weights based on data availability
// ============================================================
function computeAdaptiveWeights(
  hasAcademics: boolean,
  hasQuiz: boolean,
  hasSkills: boolean
): { w1: number; w2: number; w3: number; w4: number } {
  // Base weights: Academic=0.20, Interest=0.30, Skill=0.30, Growth=0.20
  let w1 = 0.2; // Academic
  let w2 = 0.3; // Interest
  let w3 = 0.3; // Skill
  let w4 = 0.2; // Growth

  if (!hasAcademics && !hasQuiz && !hasSkills) {
    // Only growth is reliable → heavily weight it
    w1 = 0.05;
    w2 = 0.05;
    w3 = 0.05;
    w4 = 0.85;
  } else if (!hasAcademics && !hasQuiz) {
    // Only skills + growth
    w1 = 0.05;
    w2 = 0.05;
    w3 = 0.55;
    w4 = 0.35;
  } else if (!hasAcademics) {
    // No academics → redistribute to interest & skills
    w1 = 0.05;
    w2 = 0.35;
    w3 = 0.35;
    w4 = 0.25;
  } else if (!hasQuiz) {
    // No quiz → redistribute interest weight
    w1 = 0.25;
    w2 = 0.05;
    w3 = 0.4;
    w4 = 0.3;
  } else if (!hasSkills) {
    // No skills → redistribute
    w1 = 0.3;
    w2 = 0.4;
    w3 = 0.05;
    w4 = 0.25;
  }

  // Normalize to sum to 1
  const total = w1 + w2 + w3 + w4;
  return {
    w1: Math.round((w1 / total) * 1000) / 1000,
    w2: Math.round((w2 / total) * 1000) / 1000,
    w3: Math.round((w3 / total) * 1000) / 1000,
    w4: Math.round((w4 / total) * 1000) / 1000,
  };
}

// ============================================================
// CONFIDENCE SCORING
// ============================================================
function calculateConfidence(
  hasAcademics: boolean,
  hasQuiz: boolean,
  hasSkills: boolean,
  experience: number | null
): number {
  let completeness = 0;
  let factors = 0;

  // Each data source adds to confidence
  if (hasAcademics) {
    completeness += 0.25;
    factors++;
  }
  if (hasQuiz) {
    completeness += 0.3;
    factors++;
  }
  if (hasSkills) {
    completeness += 0.25;
    factors++;
  }
  if (experience !== null && experience > 0) {
    completeness += 0.2;
    factors++;
  }

  // Consistency bonus: more factors = higher confidence
  const consistencyBonus = Math.min(0.2, factors * 0.05);

  return Math.min(1, completeness + consistencyBonus);
}

// ============================================================
// MAIN SCORING FUNCTION
// ============================================================
export function calculateSACRAScores(
  user: UserProfile,
  quizAnswers: QuizAnswers | null = null
): SACRAResult {
  const scores: DomainScore[] = [];

  for (const domain of DOMAINS) {
    const academic = calculateAcademicScore(user, domain);
    const interest = calculateInterestScore(quizAnswers, domain);
    const skill = calculateSkillScore(user, domain);
    const growth = calculateGrowthScore(domain);

    const weights = computeAdaptiveWeights(
      academic.available,
      interest.available,
      skill.available
    );

    // Composite score: weighted sum of all factors
    const compositeScore =
      Math.round(
        (weights.w1 * academic.score +
          weights.w2 * interest.score +
          weights.w3 * skill.score +
          weights.w4 * growth) *
          100
      ) / 100;

    const confidence = calculateConfidence(
      academic.available,
      interest.available,
      skill.available,
      user.experience
    );

    scores.push({
      domainId: domain.id,
      domainName: domain.name,
      compositeScore,
      factors: {
        academic: academic.score,
        interest: interest.score,
        skill: skill.score,
        growth,
      },
      confidence,
      skillGaps: skill.gaps,
      matchedSkills: skill.matched,
      weights,
    });
  }

  // Sort by composite score descending
  scores.sort((a, b) => b.compositeScore - a.compositeScore);

  // Data completeness metric
  const dataCompleteness = calculateConfidence(
    user.dsaGrade !== null,
    quizAnswers !== null,
    (user.skills?.length || 0) > 0,
    user.experience
  );

  return {
    scores,
    topFields: scores.slice(0, 5).map((s) => s.domainName),
    algorithmVersion: "SACRA-v2.0",
    dataCompleteness,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get all available domains.
 */
export function getDomains(): DomainDefinition[] {
  return DOMAINS;
}

/**
 * Get a specific domain by ID.
 */
export function getDomainById(id: string): DomainDefinition | undefined {
  return DOMAINS.find((d) => d.id === id);
}
