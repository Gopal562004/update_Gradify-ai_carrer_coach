"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { scrapeUserLinks } from "@/lib/scraper";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

/**
 * Generate Career Insights based on user history and store it in DB.
 */
export async function generateCareerInsights() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    // Fetch user and all relevant data
    const user = await db.user.findUnique({
      where: { clerkUserId },
      include: {
        resumes: true,
        assessments: true,
        careerEvaluation: true,
      },
    });

    if (!user) throw new Error("User not found");

    // We don't apply token limit here for now since it wasn't requested explicitly to be bound to a subscription,
    // or we can just proceed.

    // Prepare context for AI
    const resumeInfo = user.resumes
      ? `User Resume ATS target: ${user.resumes.atsScore || "N/A"}. Feedback: ${user.resumes.feedback || "N/A"}`
      : "No resume created yet.";

    const assessmentsInfo = user.assessments?.length
      ? user.assessments.map(a => `Category: ${a.category}, Score: ${a.quizScore}, Improvement: ${a.improvementTip}`).join("; ")
      : "No coding or skill assessments taken yet.";

    const interestInfo = user.careerEvaluation?.result
      ? `Prior Career Eval (Interest Map): ${user.careerEvaluation.result}`
      : "No prior interest mapping available.";

    // Scrape external links (in parallel)
    const scrapedData = await scrapeUserLinks(user.githubUrl, user.linkedinUrl, user.portfolioUrl);

    // Construct deep, holistic prompt
    const prompt = `
You are an expert AI Career Coach, evaluating a candidate deeply within the context of the Indian Job Market (use INR or specific Indian context if relevant, but maintain global standards).

Analyze the following COMBINED user data (including resume feedback, test assessments, and freshly scraped web data) to provide personalized, actionable, and detailed career guidance tracking skill improvements and career growth trends:

=== USER PROFILE ===
User Industry: ${user.industry || "Not specified"}
User Experience: ${user.experience ? user.experience + " years" : "Not specified"}
User Skills: ${user.skills?.join(", ") || "None listed"}

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

=== INSTRUCTIONS ===
Use ALL the information above to provide deeply personalized career growth trends and specific skill improvement suggestions. Relate their assessment scores to their Github projects and Resume feedback where possible.

CRITICAL INSTRUCTION ON SKILLS: 
DO NOT HALLUCINATE OR GUESS SKILLS. If a skill (like PHP, Python, Java) is NOT explicitly mentioned in the User Profile, User Skills, Platform Data, or Scraped Web Data, DO NOT list it as a current strength or suggest they are good at it. Only ever refer to their ACTUAL explicit skills.

CRITICAL FORMATTING RULES:
1. Return ONLY a valid JSON object.
2. Under NO circumstances should you use Markdown formatting characters INSIDE the JSON values (No \`**\` or \`*\`).
3. Do not wrap the JSON in Markdown code blocks (e.g. \`\`\`json). Just the raw JSON format.

Return strictly matching this format carefully:
{
  "summary": "A brief empowering summary of the user's current stance, specifically drawing from their provided profile links, external resume, or assessment data.",
  "linkedinOptimization": {
    "headline": "Suggested optimized headline",
    "aboutSection": "A short recommended text for the summary section",
    "keyAdditions": ["tip 1 based on their actual provided github/portfolio/resume", "tip 2", "tip 3"]
  },
  "salaryNegotiation": {
    "expectedRange": "Estimated salary range based on experience and industry (preferably in INR given the Indian context, e.g. 5-8 LPA)",
    "marketInsights": "Current market trend for this profile in India/Globally",
    "negotiationTips": ["tip 1", "tip 2", "tip 3"]
  },
  "careerPathAnalytics": {
    "currentPath": "Where they currently stand",
    "nextSteps": ["step 1", "step 2", "step 3"],
    "futureRoles": ["Role 1", "Role 2", "Role 3"]
  },
  "skillGapAnalysis": {
    "currentStrengths": ["strength 1", "strength 2"],
    "missingSkills": ["missing skill 1", "missing skill 2"],
    "learningResources": ["resource 1", "resource 2", "resource 3"]
  }
}`;

    const result = await model.generateContent(prompt);
    const raw = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();

    const parsed = JSON.parse(raw);

    const insight = await db.careerInsight.upsert({
      where: { userId: user.id },
      update: { insights: JSON.stringify(parsed) },
      create: { userId: user.id, insights: JSON.stringify(parsed) },
    });

    return parsed;
  } catch (error) {
    console.error("Error generating career insights:", error);
    throw error;
  }
}

/**
 * Fetch existing Career Insights for the logged-in user.
 */
export async function getCareerInsights() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });
  if (!user) throw new Error("User not found");

  const insight = await db.careerInsight.findUnique({
    where: { userId: user.id },
  });

  return insight ? JSON.parse(insight.insights) : null;
}
