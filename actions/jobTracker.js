"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Get all job applications for user
export async function getUserJobApplications() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) throw new Error("User not found");

  const applications = await db.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { applicationDate: "desc" },
  });

  return applications;
}

// Create new job application
export async function createJobApplication(applicationData) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) throw new Error("User not found");

  const application = await db.jobApplication.create({
    data: {
      userId: user.id,
      companyName: applicationData.companyName,
      jobTitle: applicationData.jobTitle,
      jobDescription: applicationData.jobDescription || "",
      status: applicationData.status || "APPLIED",
      priority: applicationData.priority || "MEDIUM",
      salaryRange: applicationData.salaryRange || "",
      jobLocation: applicationData.jobLocation || "",
      jobType: applicationData.jobType || "FULL_TIME",
      applicationUrl: applicationData.applicationUrl || "",
      notes: applicationData.notes || "",
      followUpDate: applicationData.followUpDate || null,
      interviewDate: applicationData.interviewDate || null,
    },
  });

  return application;
}

// Update job application
export async function updateJobApplication(id, updateData) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) throw new Error("User not found");

  const application = await db.jobApplication.update({
    where: {
      id,
      userId: user.id, // Ensure user owns this application
    },
    data: updateData,
  });

  return application;
}

// Delete job application
export async function deleteJobApplication(id) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) throw new Error("User not found");

  await db.jobApplication.delete({
    where: {
      id,
      userId: user.id, // Ensure user owns this application
    },
  });

  return { success: true };
}

// Get application statistics
export async function getApplicationStats() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) throw new Error("User not found");

  const applications = await db.jobApplication.findMany({
    where: { userId: user.id },
  });

  const stats = {
    total: applications.length,
    byStatus: {
      WISHLIST: applications.filter((app) => app.status === "WISHLIST").length,
      APPLIED: applications.filter((app) => app.status === "APPLIED").length,
      PHONE_SCREEN: applications.filter((app) => app.status === "PHONE_SCREEN")
        .length,
      TECHNICAL_INTERVIEW: applications.filter(
        (app) => app.status === "TECHNICAL_INTERVIEW"
      ).length,
      ON_SITE: applications.filter((app) => app.status === "ON_SITE").length,
      OFFER_RECEIVED: applications.filter(
        (app) => app.status === "OFFER_RECEIVED"
      ).length,
      OFFER_ACCEPTED: applications.filter(
        (app) => app.status === "OFFER_ACCEPTED"
      ).length,
      REJECTED: applications.filter((app) => app.status === "REJECTED").length,
    },
    byPriority: {
      LOW: applications.filter((app) => app.priority === "LOW").length,
      MEDIUM: applications.filter((app) => app.priority === "MEDIUM").length,
      HIGH: applications.filter((app) => app.priority === "HIGH").length,
      URGENT: applications.filter((app) => app.priority === "URGENT").length,
    },
    recentActivity: applications.slice(0, 5),
  };

  return stats;
}

// AI-powered application suggestions
export async function getAISuggestions(jobDescription) {
  const prompt = `
    Analyze this job description and provide suggestions for the job application:

    Job Description:
    ${jobDescription}

    Provide your response in this JSON format:
    {
      "suggestedPriority": "LOW|MEDIUM|HIGH|URGENT",
      "keySkills": ["skill1", "skill2", "skill3"],
      "potentialFit": "LOW|MEDIUM|HIGH",
      "suggestedNotes": "Customized notes for this application",
      "estimatedSalary": "Salary range if mentioned or estimated"
    }

    Focus on being practical and actionable.
  `;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response
      .text()
      .replace(/```(?:json)?/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("Error parsing AI suggestions:", err);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("AI suggestion error:", error);
    return null;
  }
}

// Generate follow-up email using AI
export async function generateFollowUpEmail(applicationId) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) throw new Error("User not found");

  const application = await db.jobApplication.findUnique({
    where: {
      id: applicationId,
      userId: user.id,
    },
  });

  if (!application) throw new Error("Application not found");

  const prompt = `
    Generate a professional follow-up email for a job application.

    Context:
    - Company: ${application.companyName}
    - Position: ${application.jobTitle}
    - Applicant: ${user.name}
    - Application Date: ${application.applicationDate}

    Write a polite, professional follow-up email that:
    1. Reiterates interest in the position
    2. Is respectful of the hiring manager's time
    3. Keeps it concise (under 150 words)
    4. Includes a call to action

    Return only the email content, no additional text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const emailContent = result.response.text().trim();

    return emailContent;
  } catch (error) {
    console.error("Follow-up email generation error:", error);
    return "Unable to generate follow-up email at this time.";
  }
}
