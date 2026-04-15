"use server";

import { db } from "@/lib/prisma";
import { currentUser, auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
interface UpdateUserData {
  industry: string;
  experience: number;
  bio: string;
  skills: string[];
}

export async function updateUser(data: UpdateUserData) {
  const user = await currentUser();
  console.log("✅ Clerk currentUser:", user);

  if (!user) {
    console.error("❌ No authenticated Clerk user.");
    throw new Error("User not authenticated");
  }
  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!dbUser) {
    throw new Error("User not found in database");
  }

  try {
    const result = await db.$transaction(async (tx) => {
      let industryInsight = await tx.industryInsight.findUnique({
        where: { industry: data.industry },
      });

      if (!industryInsight) {
        industryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            growthRate: 0,
            demandLevel: "MEDIUM",
            salaryRanges: [],
            topSkills: [],
            marketOutlook: "STABLE",
            keyTrends: [],
            recommendedSkills: [],
            lastUpdated: new Date(),
            nextUpdate: new Date(),
          },
        });
      }

      const updatedUser = await tx.user.update({
        where: { id: dbUser.id },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: Array.isArray(data.skills) ? data.skills : [],
        },
      });
      return { updatedUser, industryInsight };
    });

    return result;
  } catch (error: any) {
    console.error("Error updating user:", error);
    throw new Error(error.message || "Failed to update user onboarding info");
  }
}
// ✅ Safe way to get Clerk User ID
export async function getUserIdFromClerkSafe(): Promise<string | null> {
  const { userId } = await auth();
  console.log("🧪 DEBUG USER:", userId);
  if (!userId) {
    console.warn("Clerk: No userId from auth()");
    return null;
  }
  //console.log("🧪 DEBUG COOKIES:", cookies().getAll());
  console.log("✅ Server UserID:", userId);
  return userId;
}
// ✅ Check if user completed onboarding
export async function getUserOnboardingStatus(): Promise<{
  isAuthenticated: boolean;
  isOnboarded: boolean;
}> {
  const userId = await getUserIdFromClerkSafe();
  //console.log("Auth UserID:", userId);
  if (!userId) {
    console.warn("User not authenticated");
    console.log(userId);
    return { isAuthenticated: false, isOnboarded: false };
  }

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      experience: true,
      bio: true,
      skills: true,
    },
  });

  if (!dbUser) {
    console.warn("User not found in DB");
    return { isAuthenticated: false, isOnboarded: false };
  }

  const isOnboarded =
    !!dbUser.industry &&
    dbUser.experience !== null &&
    dbUser.bio !== null &&
    Array.isArray(dbUser.skills) &&
    dbUser.skills.length > 0;

  return { isAuthenticated: true, isOnboarded };
}

export async function updateUserProfileLinks(data: {
  industry?: string;
  experience?: number | string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  externalResumeText?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const experienceValue =
    data.experience !== undefined &&
    data.experience !== null &&
    data.experience !== ""
      ? Number(data.experience)
      : null;

  try {
    const dbUser = await db.user.update({
      where: { clerkUserId: userId },
      data: {
        industry: data.industry || null,
        experience: experienceValue,
        bio: data.bio || null,
        linkedinUrl: data.linkedinUrl || null,
        githubUrl: data.githubUrl || null,
        portfolioUrl: data.portfolioUrl || null,
        externalResumeText: data.externalResumeText || null,
      },
      select: {
        industry: true,
        experience: true,
        bio: true,
        linkedinUrl: true,
        githubUrl: true,
        portfolioUrl: true,
      },
    });
    return dbUser;
  } catch (error: any) {
    console.error("Error updating profile links:", error);
    throw new Error(error.message || "Failed to update profile links");
  }
}

export async function deleteUserAccount() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  try {
    await db.$transaction([
      db.subscription.deleteMany({ where: { userId: dbUser.id } }),
      db.resume.deleteMany({ where: { userId: dbUser.id } }),
      db.coverLetter.deleteMany({ where: { userId: dbUser.id } }),
      db.assessment.deleteMany({ where: { userId: dbUser.id } }),
      db.careerEvaluation.deleteMany({ where: { userId: dbUser.id } }),
      db.careerInsight.deleteMany({ where: { userId: dbUser.id } }),
      db.campaign.deleteMany({ where: { userId: dbUser.id } }),
      db.emailLog.deleteMany({ where: { userId: dbUser.id } }),
      db.user.delete({ where: { id: dbUser.id } }),
    ]);

    return {
      success: true,
      message: "Your account data has been removed from our system.",
    };
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    throw new Error(error.message || "Failed to delete account");
  }
}
