// // // "use server";

// // // import { db } from "@/lib/prisma";
// // // import { auth } from "@clerk/nextjs/server";
// // // import { GoogleGenerativeAI } from "@google/generative-ai";
// // // import { demandLevel, marketOutlook } from "@prisma/client";

// // // // -------------------- Setup --------------------
// // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// // // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// // // // -------------------- Types --------------------
// // // type DemandLevelText = "High" | "Medium" | "Low";
// // // type MarketOutlookText = "Positive" | "Neutral" | "Negative";

// // // interface SalaryRange {
// // //   role: string;
// // //   min: number;
// // //   max: number;
// // //   median: number;
// // //   location: string;
// // // }

// // // interface AIInsightResult {
// // //   salaryRanges: SalaryRange[];
// // //   growthRate: number;
// // //   demandLevel: DemandLevelText;
// // //   topSkills: string[];
// // //   marketOutlook: MarketOutlookText;
// // //   keyTrends: string[];
// // //   recommendedSkills: string[];
// // // }

// // // // -------------------- AI Generator --------------------
// // // export const generateAIInsights = async (
// // //   industry: string
// // // ): Promise<AIInsightResult> => {
// // //   const prompt = `
// // // Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format WITHOUT any additional notes or explanations:

// // // {
// // //   "salaryRanges": [
// // //     { "role": "string", "min": "number in LPA", "max": "number in LPA", "median": "number in LPA", "location": "string" }
// // //   ],
// // //   "growthRate": "number in percentage",
// // //   "demandLevel": "High" | "Medium" | "Low",
// // //   "topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
// // //   "marketOutlook": "Positive" | "Neutral" | "Negative",
// // //   "keyTrends": ["trend1", "trend2", "trend3", "trend4", "trend5"],
// // //   "recommendedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"]
// // // }

// // // IMPORTANT:
// // // 1. Return ONLY JSON. No extra text, notes, or markdown.
// // // 2. Salary should be in **whole numbers in LPA**, e.g., 40, 60, 25 (not 0.004 or 0.06).
// // // 3. Growth rate should be in percentage, e.g., 10, 25.
// // // 4. Example salary: { "role": "Software Engineer", "min": 30, "max": 50, "median": 40, "location": "India" }
// // // `;


// // //   const result = await model.generateContent(prompt);
// // //   const rawText = await result.response.text();
// // //   const cleaned = rawText.replace(/```(?:json)?/g, "").trim();

// // //   try {
// // //     return JSON.parse(cleaned);
// // //   } catch (err) {
// // //     console.error("❌ JSON parsing error:", err);
// // //     throw new Error("Failed to parse Gemini AI response.");
// // //   }
// // // };

// // // // -------------------- Enum Mappers --------------------
// // // function mapDemandLevel(level: DemandLevelText): demandLevel {
// // //   switch (level.toUpperCase()) {
// // //     case "HIGH":
// // //       return "HIGH";
// // //     case "MEDIUM":
// // //       return "MEDIUM";
// // //     case "LOW":
// // //       return "LOW";
// // //     default:
// // //       return "MEDIUM";
// // //   }
// // // }

// // // function mapMarketOutlook(outlook: MarketOutlookText): marketOutlook {
// // //   switch (outlook.toUpperCase()) {
// // //     case "POSITIVE":
// // //       return "POSITIVE";
// // //     case "NEUTRAL":
// // //       return "STABLE"; // Mapping "Neutral" to "STABLE"
// // //     case "NEGATIVE":
// // //       return "NEGATIVE";
// // //     default:
// // //       return "STABLE";
// // //   }
// // // }

// // // // -------------------- Main Function --------------------
// // // export async function getIndustryInsights() {
// // //   const { userId } = await auth();
// // //   if (!userId) throw new Error("Unauthorized");

// // //   const user = await db.user.findUnique({
// // //     where: { clerkUserId: userId },
// // //     include: { IndustryInsight: true },
// // //   });

// // //   if (!user) throw new Error("User not found");
// // //   if (!user.industry) throw new Error("User has not selected an industry");

// // //   console.log("🤖 Generating new insight for:", user.industry);
// // //   const aiInsight = await generateAIInsights(user.industry);

// // //   const updateData = {
// // //     industry: user.industry,
// // //     salaryRanges: JSON.parse(JSON.stringify(aiInsight.salaryRanges)),
// // //     growthRate: aiInsight.growthRate,
// // //     demandLevel: mapDemandLevel(aiInsight.demandLevel),
// // //     marketOutlook: mapMarketOutlook(aiInsight.marketOutlook),
// // //     topSkills: aiInsight.topSkills,
// // //     keyTrends: aiInsight.keyTrends,
// // //     recommendedSkills: aiInsight.recommendedSkills,
// // //     lastUpdated: new Date(),
// // //     nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
// // //   };

// // //   let result;
// // //   if (user.IndustryInsight) {
// // //     // If exists, update it
// // //     result = await db.industryInsight.update({
// // //       where: { id: user.IndustryInsight.id },
// // //       data: updateData,
// // //     });
// // //     console.log("🔄 Insight updated in DB:", result.id);
// // //   } else {
// // //     // If not exists, create it
// // //     result = await db.industryInsight.create({ data: updateData });
// // //     console.log("✅ New insight saved to DB:", result.id);
// // //   }

// // //   return result;
// // // }



"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// REMOVE THIS LINE: import { demandLevel, marketOutlook } from "@prisma/client";

// -------------------- Setup --------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


// -------------------- Types --------------------
type DemandLevelText = "High" | "Medium" | "Low";
type MarketOutlookText = "Positive" | "Neutral" | "Negative";

interface SalaryRange {
  role: string;
  min: number;
  max: number;
  median: number;
  location: string;
}

interface AIInsightResult {
  salaryRanges: SalaryRange[];
  growthRate: number;
  demandLevel: DemandLevelText;
  topSkills: string[];
  marketOutlook: MarketOutlookText;
  keyTrends: string[];
  recommendedSkills: string[];
}

// -------------------- AI Generator --------------------
export const generateAIInsights = async (
  industry: string
): Promise<AIInsightResult> => {
  const prompt = `
Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format WITHOUT any additional notes or explanations:

{
  "salaryRanges": [
    { "role": "string", "min": "number in LPA", "max": "number in LPA", "median": "number in LPA", "location": "string" }
  ],
  "growthRate": "number in percentage",
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1", "trend2", "trend3", "trend4", "trend5"],
  "recommendedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"]
}

IMPORTANT:
1. Return ONLY JSON. No extra text, notes, or markdown.
2. Salary should be in **whole numbers in LPA**, e.g., 40, 60, 25 (not 0.004 or 0.06).
3. Growth rate should be in percentage, e.g., 10, 25.
4. Example salary: { "role": "Software Engineer", "min": 30, "max": 50, "median": 40, "location": "India" }
`;

  const result = await model.generateContent(prompt);
  console.log("🔍 GEMINI USAGE:", result.response.usageMetadata);
  const rawText = await result.response.text();
  const cleaned = rawText.replace(/```(?:json)?/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ JSON parsing error:", err);
    throw new Error("Failed to parse Gemini AI response.");
  }
};
// -------------------- Enum Mappers --------------------
function mapDemandLevel(level: DemandLevelText): "HIGH" | "MEDIUM" | "LOW" {
  switch (level.toUpperCase()) {
    case "HIGH":
      return "HIGH";
    case "MEDIUM":
      return "MEDIUM";
    case "LOW":
      return "LOW";
    default:
      return "MEDIUM";
  }
}

function mapMarketOutlook(
  outlook: MarketOutlookText
): "POSITIVE" | "STABLE" | "NEGATIVE" {
  switch (outlook.toUpperCase()) {
    case "POSITIVE":
      return "POSITIVE";
    case "NEUTRAL":
      return "STABLE"; // Mapping "Neutral" to "STABLE"
    case "NEGATIVE":
      return "NEGATIVE";
    default:
      return "STABLE";
  }
}

// -------------------- Main Function --------------------
// export async function getIndustryInsights() {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//     include: { IndustryInsight: true },
//   });

//   if (!user) throw new Error("User not found");
//   if (!user.industry) throw new Error("User has not selected an industry");

//   console.log("🤖 Generating new insight for:", user.industry);
//   const aiInsight = await generateAIInsights(user.industry);

//   const updateData = {
//     industry: user.industry,
//     salaryRanges: JSON.parse(JSON.stringify(aiInsight.salaryRanges)),
//     growthRate: aiInsight.growthRate,
//     demandLevel: mapDemandLevel(aiInsight.demandLevel),
//     marketOutlook: mapMarketOutlook(aiInsight.marketOutlook),
//     topSkills: aiInsight.topSkills,
//     keyTrends: aiInsight.keyTrends,
//     recommendedSkills: aiInsight.recommendedSkills,
//     lastUpdated: new Date(),
//     nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
//   };

//   let result;
//   if (user.IndustryInsight) {
//     // If exists, update it
//     result = await db.industryInsight.update({
//       where: { id: user.IndustryInsight.id },
//       data: updateData,
//     });
//     console.log("🔄 Insight updated in DB:", result.id);
//   } else {
//     // If not exists, create it
//     result = await db.industryInsight.create({ data: updateData });
//     console.log("✅ New insight saved to DB:", result.id);
//   }

//   return result;
// }

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { IndustryInsight: true },
  });

  if (!user) throw new Error("User not found");
  if (!user.industry) throw new Error("User has not selected an industry");

  // Check if ANY valid insight exists for this industry (shared across users)
  const existingIndustryInsight = await db.industryInsight.findFirst({
    where: {
      industry: user.industry,
      nextUpdate: { gt: new Date() }, // Not expired
    },
  });

  if (existingIndustryInsight) {
    console.log(
      "📊 Returning cached industry insight:",
      existingIndustryInsight.industry
    );

    // Connect this user to the existing insight if not already connected
    if (
      !user.IndustryInsight ||
      user.IndustryInsight.id !== existingIndustryInsight.id
    ) {
      await db.user.update({
        where: { id: user.id },
        data: {
          IndustryInsight: {
            connect: { id: existingIndustryInsight.id },
          },
        },
      });
    }

    return existingIndustryInsight;
  }

  console.log("🤖 Calling Gemini API for new insight:", user.industry);
  const aiInsight = await generateAIInsights(user.industry);

  const updateData = {
    industry: user.industry,
    salaryRanges: JSON.parse(JSON.stringify(aiInsight.salaryRanges)),
    growthRate: aiInsight.growthRate,
    demandLevel: mapDemandLevel(aiInsight.demandLevel),
    marketOutlook: mapMarketOutlook(aiInsight.marketOutlook),
    topSkills: aiInsight.topSkills,
    keyTrends: aiInsight.keyTrends,
    recommendedSkills: aiInsight.recommendedSkills,
    lastUpdated: new Date(),
    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };

  let result;

  // Check if an expired insight exists for this industry
  const expiredIndustryInsight = await db.industryInsight.findFirst({
    where: { industry: user.industry },
  });

  if (expiredIndustryInsight) {
    // Update the expired insight
    result = await db.industryInsight.update({
      where: { id: expiredIndustryInsight.id },
      data: updateData,
    });
    console.log("🔄 Updated expired industry insight:", result.id);
  } else {
    // Create new insight and connect the user
    result = await db.industryInsight.create({
      data: {
        ...updateData,
        users: {
          connect: { id: user.id },
        },
      },
    });
    console.log("✅ Created new industry insight:", result.id);
  }

  return result;
}




















// "use server";

// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { parseToon } from "../lib/toon/toon";
// import { Prisma } from "@prisma/client";

// // -------------------- Setup --------------------
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// // -------------------- Types --------------------
// type DemandLevelText = "High" | "Medium" | "Low";
// type MarketOutlookText = "Positive" | "Neutral" | "Negative";

// interface SalaryRange {
//   role: string;
//   min: number;
//   max: number;
//   median: number;
//   location: string;
// }

// interface AIInsightResult {
//   salaryRanges: SalaryRange[];
//   growthRate: number;
//   demandLevel: DemandLevelText;
//   topSkills: string[];
//   marketOutlook: MarketOutlookText;
//   keyTrends: string[];
//   recommendedSkills: string[];
// }

// // -------------------- SANITIZER --------------------
// function sanitizeToon(obj: any) {
//   const cleanStr = (v: any) => {
//     if (typeof v !== "string") return v;
//     return v
//       .replace(/^"+|"+$/g, "")
//       .replace(/,$/, "")
//       .trim();
//   };

//   if (Array.isArray(obj.salaryRanges)) {
//     obj.salaryRanges = obj.salaryRanges
//       .map((s: any) => ({
//         role: cleanStr(s.role),
//         min: Number(s.min),
//         max: Number(s.max),
//         median: Number(s.median),
//         location: cleanStr(s.location),
//       }))
//       .filter(
//         (s: any) =>
//           !!s.role &&
//           typeof s.role === "string" &&
//           !isNaN(s.min) &&
//           !isNaN(s.max) &&
//           !isNaN(s.median)
//       );
//   } else {
//     obj.salaryRanges = [];
//   }

//   if (!obj.growthRate || isNaN(Number(obj.growthRate))) {
//     obj.growthRate = 5; // conservative fallback
//   } else {
//     obj.growthRate = Number(obj.growthRate);
//   }

//   // arrays for skills/trends
//   const ensureArrayTokens = (v: any) => {
//     if (!v) return [];
//     if (Array.isArray(v))
//       return v.map(String).map((s) =>
//         s
//           .replace(/^"+|"+$/g, "")
//           .replace(/,$/, "")
//           .trim()
//       );
//     // if TOON compact array rendered as a single token string, split by spaces
//     if (typeof v === "string") return v.split(/\s+/).map(String);
//     return [];
//   };

//   obj.topSkills = ensureArrayTokens(obj.topSkills);
//   obj.keyTrends = ensureArrayTokens(obj.keyTrends);
//   obj.recommendedSkills = ensureArrayTokens(obj.recommendedSkills);

//   // normalize enums to TitleCase-ish expected strings
//   if (typeof obj.demandLevel === "string") {
//     const dl = obj.demandLevel.replace(/[^A-Za-z]/g, "").toLowerCase();
//     if (dl.startsWith("h")) obj.demandLevel = "High";
//     else if (dl.startsWith("m")) obj.demandLevel = "Medium";
//     else if (dl.startsWith("l")) obj.demandLevel = "Low";
//     else obj.demandLevel = "Medium";
//   } else {
//     obj.demandLevel = "Medium";
//   }

//   if (typeof obj.marketOutlook === "string") {
//     const mo = obj.marketOutlook.replace(/[^A-Za-z]/g, "").toLowerCase();
//     if (mo.startsWith("p")) obj.marketOutlook = "Positive";
//     else if (mo.startsWith("n")) obj.marketOutlook = "Neutral";
//     else obj.marketOutlook = "Neutral";
//   } else {
//     obj.marketOutlook = "Neutral";
//   }

//   return obj;
// }

// // -------------------- VALIDATOR --------------------
// function toAIInsightResult(obj: any): AIInsightResult {
//   return {
//     salaryRanges: (obj.salaryRanges || []).map((s: any) => ({
//       role: String(s.role),
//       min: Number(s.min),
//       max: Number(s.max),
//       median: Number(s.median),
//       location: String(s.location),
//     })),
//     growthRate: Number(obj.growthRate),
//     demandLevel: obj.demandLevel as DemandLevelText,
//     topSkills: Array.isArray(obj.topSkills) ? obj.topSkills.map(String) : [],
//     marketOutlook: obj.marketOutlook as MarketOutlookText,
//     keyTrends: Array.isArray(obj.keyTrends) ? obj.keyTrends.map(String) : [],
//     recommendedSkills: Array.isArray(obj.recommendedSkills)
//       ? obj.recommendedSkills.map(String)
//       : [],
//   };
// }

// // -------------------- AI Generator --------------------
// export async function generateAIInsights(
//   industry: string
// ): Promise<AIInsightResult> {
//   const prompt = `
// Return ONLY this TOON object. STRICT FORMAT:

// {
//   salaryRanges: @ {
//     role: token
//     min: int
//     max: int
//     median: int
//     location: token
//   }{5}

//   growthRate: int
//   demandLevel: High|Medium|Low

//   topSkills: @ token{5}

//   marketOutlook: Positive|Neutral|Negative

//   keyTrends: @ token{5}

//   recommendedSkills: @ token{5}
// }

// RULES:
// - NO JSON
// - NO quotes
// - NO commas
// - salaryRanges MUST contain exactly 5 job roles
// - topSkills MUST contain exactly 5 skills
// - keyTrends MUST contain exactly 5 trends
// - recommendedSkills MUST contain exactly 5 items
// - Provide realistic values for the ${industry} industry
// - Output ONLY the TOON block and nothing else
// `;


//   const res = await model.generateContent(prompt);
//   // optional: track token usage
//   try {
//     console.log("🔍 GEMINI USAGE:", res.response.usageMetadata);
//   } catch {
//     /* ignore */
//   }

//   const raw = await res.response.text();
//   let toon = parseToon(raw.trim());
//   toon = sanitizeToon(toon);
//   return toAIInsightResult(toon);
// }

// // -------------------- ENUM MAPPERS --------------------
// function mapDemandLevel(level: DemandLevelText) {
//   return level.toUpperCase() as "HIGH" | "MEDIUM" | "LOW";
// }

// function mapMarketOutlook(level: MarketOutlookText) {
//   return level === "Neutral"
//     ? "STABLE"
//     : (level.toUpperCase() as "POSITIVE" | "NEGATIVE");
// }

// // -------------------- MAIN FUNCTION --------------------
// export async function getIndustryInsights() {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//     include: { IndustryInsight: true },
//   });
//   if (!user) throw new Error("User not found");
//   if (!user.industry) throw new Error("User has no industry selected");

//   // try cached (not expired)
//   const cached = await db.industryInsight.findFirst({
//     where: { industry: user.industry, nextUpdate: { gt: new Date() } },
//   });

//   if (cached) {
//     if (!user.IndustryInsight || user.IndustryInsight.id !== cached.id) {
//       await db.user.update({
//         where: { id: user.id },
//         data: { IndustryInsight: { connect: { id: cached.id } } },
//       });
//     }
//     return cached;
//   }

//   // generate new
//   const ai = await generateAIInsights(user.industry);

//   const payload = {
//     industry: user.industry,
//     salaryRanges: ai.salaryRanges as unknown as Prisma.InputJsonValue[],
//     growthRate: ai.growthRate,
//     demandLevel: mapDemandLevel(ai.demandLevel),
//     marketOutlook: mapMarketOutlook(ai.marketOutlook),
//     topSkills: ai.topSkills,
//     keyTrends: ai.keyTrends,
//     recommendedSkills: ai.recommendedSkills,
//     lastUpdated: new Date(),
//     nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//   };

//   // store (cast to any for TS/Prisma JSON compatibility)
//   const expired = await db.industryInsight.findFirst({
//     where: { industry: user.industry },
//   });

//   let saved;
//   if (expired) {
//     saved = await db.industryInsight.update({
//       where: { id: expired.id },
//       data: payload as any,
//     });
//   } else {
//     saved = await db.industryInsight.create({
//       data: {
//         ...(payload as any),
//         users: { connect: { id: user.id } },
//       } as any,
//     });
//   }

//   return saved;
// }
