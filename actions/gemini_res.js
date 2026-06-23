"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkFeatureAccess, consumeToken } from "./subscription";
import { scrapeUserLinks } from "@/lib/scraper";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

/**
 * Generate quiz questions (Part A + Part B)
 */
export async function generateQuiz() {
  const prompt = `
You are a career guidance system. 
Generate 2 sets of MCQ questions in JSON:

Part A – Interest Mapping (20 Qs).
Ask about preferences like problem-solving, creativity, coding, research, etc.

Part B – Aptitude & Awareness (15 Qs).
Ask simple logic, math, reasoning, and basic tech awareness. 
NO coding.

Return format:
{
  "partA": [
    {"id": 1, "question": "text", "options": ["a","b","c","d"]},
    ...
  ],
  "partB": [
    {"id": 1, "question": "text", "options": ["a","b","c","d"]},
    ...
  ]
}
ONLY return JSON.
  `;

  const result = await model.generateContent(prompt);
  const raw = result.response
    .text()
    .replace(/```json|```/g, "")
    .trim();

  return JSON.parse(raw);
}

export async function generateProfileRoadmap() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId },
      include: {
        resumes: true,
        assessments: true,
        careerEvaluation: true,
      },
    });
    if (!user) throw new Error("User not found");

    const resumeInfo = user.resumes
      ? `User Resume ATS target: ${user.resumes.atsScore || "N/A"}. Feedback: ${user.resumes.feedback || "N/A"}`
      : "No resume created yet.";

    const assessmentsInfo = user.assessments?.length
      ? user.assessments
          .map(
            (a) =>
              `Category: ${a.category}, Score: ${a.quizScore}, Improvement: ${
                a.improvementTip || "N/A"
              }`,
          )
          .join("; ")
      : "No coding or skill assessments taken yet.";

    const interestInfo = user.careerEvaluation?.result
      ? `Prior Career Eval (Interest Map): ${user.careerEvaluation.result}`
      : "No prior interest mapping available.";

    const scrapedData = await scrapeUserLinks(
      user.githubUrl,
      user.linkedinUrl,
      user.portfolioUrl,
    );

    // ─── SACRA ALGORITHM ───
    const { runSACRA, getSACRAScoresForPrompt } = await import("@/lib/sacra");
    const sacraResult = await runSACRA(user.id, {
      skills: user.skills || [],
      experience: user.experience,
      industry: user.industry,
      dsaGrade: user.dsaGrade,
      oopGrade: user.oopGrade,
      dbmsGrade: user.dbmsGrade,
      osGrade: user.osGrade,
    });
    const sacraPromptSection = getSACRAScoresForPrompt(sacraResult);

    const prompt = `
You are a career counselor. Use the user's saved profile, resume, assessment history, scraped web profile data, AND the SACRA algorithm scores to recommend the best IT career fields and create a detailed roadmap for each one.

=== USER PROFILE ===
Industry: ${user.industry || "Not specified"}
Experience: ${user.experience ? `${user.experience} years` : "Not specified"}
Skills: ${user.skills?.join(", ") || "None listed"}
Academic Grades: DSA=${user.dsaGrade ?? "N/A"}, OOP=${user.oopGrade ?? "N/A"}, DBMS=${user.dbmsGrade ?? "N/A"}, OS=${user.osGrade ?? "N/A"}

=== PLATFORM DATA ===
Resume Info: ${resumeInfo}
External Resume Paste: ${user.externalResumeText ? "User provided extended resume text" : "Not provided"}
Assessment/Test Data: ${assessmentsInfo}
Interest Mapping: ${interestInfo}

=== SCRAPED WEB DATA ===
GitHub Profile Analysis:
${scrapedData.githubData || "No Github data extracted"}

LinkedIn Profile Analysis:
${scrapedData.linkedinData || "No LinkedIn data extracted"}

Portfolio/Website Analysis:
${scrapedData.portfolioData || "No Portfolio data extracted"}

${sacraPromptSection}

1. Identify the top 3–5 IT fields that best match the user's profile, current skills, AND SACRA algorithm scores. Prioritize fields with higher SACRA scores.
2. Generate a roadmap for each field in phases: Fundamentals → Core → Projects → Internships/Hackathons → Job Prep.
3. Keep the recommendations grounded in the user's actual resume, skills, assessment history, scraped profile data, AND SACRA scores.

Return JSON format:
{
  "topFields": ["field1","field2","field3"],
  "roadmaps": {
    "field1": ["Phase 1: ...","Phase 2: ..."],
    "field2": ["Phase 1: ...","Phase 2: ..."]
  },
  "summary": "short explanation for student mentioning their SACRA algorithm strengths"
}
ONLY return JSON.
`;

    // 🔒 Check subscription token access
    const access = await checkFeatureAccess("careerEval");
    if (!access.allowed) {
      throw new Error(
        `UPGRADE_REQUIRED:You've used all ${access.limit} career evaluations on your ${access.planName} plan. Upgrade to continue.|careerEval|${access.plan}`,
      );
    }

    const result = await model.generateContent(prompt);
    const raw = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    const parsed = JSON.parse(raw);

    // Save both AI result and SACRA scores
    const fullResult = {
      ...parsed,
      sacraScores: sacraResult.scores.slice(0, 5).map((s) => ({
        domain: s.domainName,
        score: s.compositeScore,
        confidence: s.confidence,
        factors: s.factors,
        skillGaps: s.skillGaps,
      })),
      sacraVersion: sacraResult.algorithmVersion,
      dataCompleteness: sacraResult.dataCompleteness,
    };

    await db.careerEvaluation.upsert({
      where: { userId: user.id },
      update: { result: JSON.stringify(fullResult, null, 2) },
      create: { userId: user.id, result: JSON.stringify(fullResult, null, 2) },
    });

    // Generate notification for roadmap update
    try {
      await db.notification.create({
        data: {
          userId: user.id,
          type: "roadmap_update",
          title: "Career Roadmap Updated",
          message: `Your career roadmap has been regenerated using the SACRA algorithm (v${sacraResult.algorithmVersion}). Top recommendation: ${fullResult.topFields?.[0] || "N/A"}`,
          link: "/gemini_res",
        },
      });
    } catch (notifErr) {
      console.warn("Failed to create notification:", notifErr);
    }

    await consumeToken("careerEval");
    return fullResult;
  } catch (err) {
    console.error("❌ Error in generateProfileRoadmap:", err);
    throw err;
  }
}

/**
 * Evaluate answers & store Gemini result in DB
 */ export async function evaluateAnswers(answers) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId },
      include: {
        resumes: true,
        assessments: true,
        careerEvaluation: true,
      },
    });
    if (!user) throw new Error("User not found");

    // 🔒 Check subscription token access
    const access = await checkFeatureAccess("careerEval");
    if (!access.allowed) {
      throw new Error(
        `UPGRADE_REQUIRED:You've used all ${access.limit} career evaluations on your ${access.planName} plan. Upgrade to continue.|careerEval|${access.plan}`,
      );
    }

    const resumeInfo = user.resumes
      ? `User Resume ATS target: ${user.resumes.atsScore || "N/A"}. Feedback: ${user.resumes.feedback || "N/A"}`
      : "No resume created yet.";

    const assessmentsInfo = user.assessments?.length
      ? user.assessments
          .map(
            (a) =>
              `Category: ${a.category}, Score: ${a.quizScore}, Improvement: ${
                a.improvementTip || "N/A"
              }`,
          )
          .join("; ")
      : "No coding or skill assessments taken yet.";

    const interestInfo = user.careerEvaluation?.result
      ? `Prior Career Eval (Interest Map): ${user.careerEvaluation.result}`
      : "No prior career evaluation available.";

    const scrapedData = await scrapeUserLinks(
      user.githubUrl,
      user.linkedinUrl,
      user.portfolioUrl,
    );

    // ─── SACRA ALGORITHM (with quiz answers for interest pattern analysis) ───
    const { runSACRA, getSACRAScoresForPrompt } = await import("@/lib/sacra");
    const sacraResult = await runSACRA(
      user.id,
      {
        skills: user.skills || [],
        experience: user.experience,
        industry: user.industry,
        dsaGrade: user.dsaGrade,
        oopGrade: user.oopGrade,
        dbmsGrade: user.dbmsGrade,
        osGrade: user.osGrade,
      },
      answers // Pass quiz answers for interest pattern scoring
    );
    const sacraPromptSection = getSACRAScoresForPrompt(sacraResult);

    const prompt = `
You are a career counselor. Use the student's quiz answers plus their saved profile information, assessment results, scraped web profile data, AND SACRA algorithm scores to recommend the best IT career fields and generate roadmaps.

Student Answers:
${JSON.stringify(answers)}

=== USER PROFILE ===
Industry: ${user.industry || "Not specified"}
Experience: ${user.experience ? `${user.experience} years` : "Not specified"}
Skills: ${user.skills?.join(", ") || "None listed"}
Academic Grades: DSA=${user.dsaGrade ?? "N/A"}, OOP=${user.oopGrade ?? "N/A"}, DBMS=${user.dbmsGrade ?? "N/A"}, OS=${user.osGrade ?? "N/A"}

=== PLATFORM DATA ===
Resume Info: ${resumeInfo}
External Resume Paste: ${user.externalResumeText ? "User provided extended resume text" : "Not provided"}
Assessment/Test Data: ${assessmentsInfo}
Interest Mapping: ${interestInfo}

=== SCRAPED WEB DATA ===
GitHub Profile Analysis:
${scrapedData.githubData || "No Github data extracted"}

LinkedIn Profile Analysis:
${scrapedData.linkedinData || "No LinkedIn data extracted"}

Portfolio/Website Analysis:
${scrapedData.portfolioData || "No Portfolio data extracted"}

${sacraPromptSection}

1. Identify interest & aptitude patterns from quiz answers AND SACRA scores.
2. Suggest Top 3–5 IT fields. Prioritize fields with higher SACRA scores.
3. Generate a roadmap for each field in phases: Fundamentals → Core → Projects → Internships/Hackathons → Job Prep.

Return JSON format:
{
  "topFields": ["field1","field2","field3"],
  "roadmaps": {
    "field1": ["Phase 1: ...","Phase 2: ..."],
    "field2": ["Phase 1: ...","Phase 2: ..."]
  },
  "summary": "short explanation for student mentioning SACRA algorithm insights"
}
ONLY return JSON.
`;

    const result = await model.generateContent(prompt);
    const raw = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();

    const parsed = JSON.parse(raw);

    // Save AI result enriched with SACRA scores
    const fullResult = {
      ...parsed,
      sacraScores: sacraResult.scores.slice(0, 5).map((s) => ({
        domain: s.domainName,
        score: s.compositeScore,
        confidence: s.confidence,
        factors: s.factors,
        skillGaps: s.skillGaps,
      })),
      sacraVersion: sacraResult.algorithmVersion,
      dataCompleteness: sacraResult.dataCompleteness,
    };

    await db.careerEvaluation.upsert({
      where: { userId: user.id },
      update: { result: JSON.stringify(fullResult, null, 2) },
      create: { userId: user.id, result: JSON.stringify(fullResult, null, 2) },
    });

    // Generate notification
    try {
      await db.notification.create({
        data: {
          userId: user.id,
          type: "roadmap_update",
          title: "Career Evaluation Complete",
          message: `Quiz-based career evaluation completed with SACRA analysis. Top recommendation: ${fullResult.topFields?.[0] || "N/A"} (Score: ${sacraResult.scores[0]?.compositeScore?.toFixed(1) || "N/A"})`,
          link: "/gemini_res",
        },
      });
    } catch (notifErr) {
      console.warn("Failed to create notification:", notifErr);
    }

    // ✅ Consume token after successful evaluation
    await consumeToken("careerEval");

    return fullResult;
  } catch (err) {
    console.error("❌ Error in evaluateAnswers:", err);
    throw err;
  }
}

/**
 * Get stored Gemini evaluation
 */
export async function getCareerEvaluation() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });
  if (!user) throw new Error("User not found");

  const evaluation = await db.careerEvaluation.findUnique({
    where: { userId: user.id },
  });

  return evaluation ? JSON.parse(evaluation.result) : null;
}

export async function updateIndustryInsight(selectedField) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { IndustryInsight: true }
  });

  if (!user) throw new Error("User not found");

  // Update user's primary industry. We use connectOrCreate to satisfy the foreign key constraint.
  // We set nextUpdate to an expired date so the dashboard generates real AI data.
  await db.user.update({
    where: { clerkUserId: userId },
    data: {
      IndustryInsight: {
        connectOrCreate: {
          where: { industry: selectedField },
          create: {
            industry: selectedField,
            salaryRanges: [],
            growthRate: 0,
            demandLevel: "MEDIUM",
            topSkills: [],
            marketOutlook: "STABLE",
            keyTrends: [],
            recommendedSkills: [],
            lastUpdated: new Date(),
            nextUpdate: new Date(0), // Expire immediately
          },
        },
      },
    },
  });

  return { success: true };
}

/**
 * Generate a custom roadmap for a specific field requested by the user.
 */
export async function generateCustomRoadmap(customField) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
    include: { careerEvaluation: true },
  });
  if (!user) throw new Error("User not found");

  if (!user.careerEvaluation || !user.careerEvaluation.result) {
    throw new Error("No existing career evaluation found to append to.");
  }

  const existingEval = JSON.parse(user.careerEvaluation.result);

  const prompt = `
The user specifically requested a custom IT career roadmap for the field: "${customField}".
If the field name is misspelled, poorly formatted, or informal, please correct it to the proper, professional IT job title (e.g. "cyber crim" -> "Cybersecurity", "machin lurning" -> "Machine Learning").
Generate a structured roadmap for this field in 5 phases: Fundamentals → Core → Projects → Internships/Hackathons → Job Prep.
Tailor the advice based on their existing profile if possible: ${user.skills?.join(", ")} and ${user.experience} years experience.

Return ONLY JSON format:
{
  "correctedField": "Proper Professional Title",
  "roadmap": ["Phase 1: ...", "Phase 2: ...", "Phase 3: ...", "Phase 4: ...", "Phase 5: ..."]
}
ONLY return JSON. No markdown ticks.
`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(raw);
  
  const finalField = parsed.correctedField || customField;

  // Merge the new custom field into the existing evaluation
  if (!existingEval.topFields) {
    existingEval.topFields = [];
  }
  if (!existingEval.roadmaps) {
    existingEval.roadmaps = {};
  }

  // Add the custom field to topFields if not already present
  if (!existingEval.topFields.includes(finalField)) {
    existingEval.topFields.push(finalField);
  }

  // Add the roadmap phases
  existingEval.roadmaps[finalField] = parsed.roadmap;

  // Save back to DB
  await db.careerEvaluation.update({
    where: { userId: user.id },
    data: { result: JSON.stringify(existingEval, null, 2) },
  });

  return { updatedEval: existingEval, generatedField: finalField };
}
