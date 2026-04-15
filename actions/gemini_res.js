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

    const prompt = `
You are a career counselor. Use the user's saved profile, resume, assessment history, and scraped web profile data to recommend the best IT career fields and create a detailed roadmap for each one.

=== USER PROFILE ===
Industry: ${user.industry || "Not specified"}
Experience: ${user.experience ? `${user.experience} years` : "Not specified"}
Skills: ${user.skills?.join(", ") || "None listed"}

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

1. Identify the top 3–5 IT fields that best match the user's profile and current skills.
2. Generate a roadmap for each field in phases: Fundamentals → Core → Projects → Internships/Hackathons → Job Prep.
3. Keep the recommendations grounded in the user's actual resume, skills, assessment history, and scraped profile data.

Return JSON format:
{
  "topFields": ["field1","field2","field3"],
  "roadmaps": {
    "field1": ["Phase 1: ...","Phase 2: ..."],
    "field2": ["Phase 1: ...","Phase 2: ..."]
  },
  "summary": "short explanation for student"
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

    await db.careerEvaluation.upsert({
      where: { userId: user.id },
      update: { result: JSON.stringify(parsed, null, 2) },
      create: { userId: user.id, result: JSON.stringify(parsed, null, 2) },
    });

    await consumeToken("careerEval");
    return parsed;
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

    const prompt = `
You are a career counselor. Use the student's quiz answers plus their saved profile information, assessment results, and scraped web profile data to recommend the best IT career fields and generate roadmaps.

Student Answers:
${JSON.stringify(answers)}

=== USER PROFILE ===
Industry: ${user.industry || "Not specified"}
Experience: ${user.experience ? `${user.experience} years` : "Not specified"}
Skills: ${user.skills?.join(", ") || "None listed"}

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

1. Identify interest & aptitude patterns.
2. Suggest Top 3–5 IT fields (e.g., Web Dev, Data Science, AI/ML, Cybersecurity, Cloud).
3. Generate a roadmap for each field in phases: Fundamentals → Core → Projects → Internships/Hackathons → Job Prep.

Return JSON format:
{
  "topFields": ["field1","field2","field3"],
  "roadmaps": {
    "field1": ["Phase 1: ...","Phase 2: ..."],
    "field2": ["Phase 1: ...","Phase 2: ..."]
  },
  "summary": "short explanation for student"
}
ONLY return JSON.
`;

    const result = await model.generateContent(prompt);
    const raw = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();

    const parsed = JSON.parse(raw);

    // Store only evaluation result JSON
    const evaluation = await db.careerEvaluation.upsert({
      where: { userId: user.id },
      update: { result: JSON.stringify(parsed, null, 2) },
      create: { userId: user.id, result: JSON.stringify(parsed, null, 2) },
    });

    // ✅ Consume token after successful evaluation
    await consumeToken("careerEval");

    return parsed; // return parsed JSON so UI can display
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

  // Update user.industry and link to IndustryInsight
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
            nextUpdate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          },
        },
      },
    },
  });

  return { success: true };
}
