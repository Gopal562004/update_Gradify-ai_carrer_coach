"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * ✅ Generate a new cover letter using Gemini AI
 */
export async function generateCoverLetter({
  jobTitle,
  companyName,
  jobDescription,
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!dbUser) throw new Error("User not found in database");

  const prompt = `
  Generate a personalized cover letter for the following:
  Name: ${dbUser.name || "[Your Name]"}
  Industry: ${dbUser.industry || "N/A"}
  Experience: ${dbUser.experience || 0} years
  Skills: ${dbUser.skills?.join(", ") || "None"}

  Job Title: ${jobTitle}
  Company: ${companyName}
  Job Description: ${jobDescription}

  Format the letter properly and professionally.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();

  const newLetter = await db.coverLetter.create({
    data: {
      userId: dbUser.id, // ⚠️ Important: This is internal DB ID
      content,
      jobDescription,
      companyName,
      jobTitle,
      status: "draft",
    },
  });

  return newLetter;
}

/**
 * ✅ Update an existing cover letter
 */
export async function updateCoverLetter({ id, content }) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!dbUser) throw new Error("User not found in database");

  const existing = await db.coverLetter.findUnique({ where: { id } });
  if (!existing || existing.userId !== dbUser.id)
    throw new Error("Unauthorized or not found");

  return await db.coverLetter.update({
    where: { id },
    data: { content, updatedAt: new Date() },
  });
}

/**
 * ✅ Fetch a single cover letter by ID
 */
export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!dbUser) throw new Error("User not found in database");

  const letter = await db.coverLetter.findUnique({ where: { id } });
  if (!letter || letter.userId !== dbUser.id)
    throw new Error("Unauthorized or not found");

  return letter;
}

/**
 * ✅ Get all cover letters of the current logged-in user
 */
export async function getUserCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!dbUser) throw new Error("User not found in database");

  return await db.coverLetter.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });
}


/**
 * ✅ Delete a cover letter by ID (only if owned by current user)
 */
export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!dbUser) throw new Error("User not found in database");

  const existing = await db.coverLetter.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== dbUser.id) {
    throw new Error("Unauthorized or cover letter not found");
  }

  await db.coverLetter.delete({
    where: { id },
  });

  return { success: true, message: "Cover letter deleted successfully" };
}
