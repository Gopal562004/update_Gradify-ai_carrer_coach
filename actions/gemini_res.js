// "use server";

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// /**
//  * Generate quiz questions (Part A + Part B)
//  */
// export async function generateQuiz() {
//   const prompt = `
// You are a career guidance system. 
// Generate 2 sets of MCQ questions in JSON:

// Part A – Interest Mapping (20 Qs).
// Ask about preferences like problem-solving, creativity, coding, research, etc.

// Part B – Aptitude & Awareness (15 Qs).
// Ask simple logic, math, reasoning, and basic tech awareness. 
// NO coding.

// Return format:
// {
//   "partA": [
//     {"id": 1, "question": "text", "options": ["a","b","c","d"]},
//     ...
//   ],
//   "partB": [
//     {"id": 1, "question": "text", "options": ["a","b","c","d"]},
//     ...
//   ]
// }
// ONLY return JSON.
//   `;

//   const result = await model.generateContent(prompt);
//   const raw = result.response
//     .text()
//     .replace(/```json|```/g, "")
//     .trim();

//   return JSON.parse(raw);
// }

// /**
//  * Evaluate answers & generate recommendations
//  */
// export async function evaluateAnswers(answers) {
//   const prompt = `
// You are a career counselor. 
// The student gave these answers:

// ${JSON.stringify(answers)}

// 1. Identify interest & aptitude patterns.
// 2. Suggest Top 3–5 IT fields (e.g., Web Dev, Data Science, AI/ML, Cybersecurity, Cloud).
// 3. Generate a roadmap for each field in phases: Fundamentals → Core → Projects → Internships/Hackathons → Job Prep.

// Return JSON format:
// {
//   "topFields": ["field1","field2","field3"],
//   "roadmaps": {
//     "field1": ["Phase 1: ...","Phase 2: ..."],
//     "field2": ["Phase 1: ...","Phase 2: ..."]
//   },
//   "summary": "short explanation for student"
// }
// ONLY return JSON.
//   `;

//   const result = await model.generateContent(prompt);
//   const raw = result.response
//     .text()
//     .replace(/```json|```/g, "")
//     .trim();

//   return JSON.parse(raw);
// }
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

/**
 * Evaluate answers & store Gemini result in DB
 */export async function evaluateAnswers(answers) {
   try {
     const { userId: clerkUserId } = await auth();
     if (!clerkUserId) throw new Error("Unauthorized");

     const user = await db.user.findUnique({
       where: { clerkUserId },
     });
     if (!user) throw new Error("User not found");

     const prompt = `
You are a career counselor. 
The student gave these answers:

${JSON.stringify(answers)}

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