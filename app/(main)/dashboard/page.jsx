import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_component/DashboardView";
import { getCareerInsights } from "@/actions/career_insight";
import { getAllRoadmapProgress } from "@/actions/progress";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const rawInsights = await getIndustryInsights();

  // Parse, normalize, and deduplicate salaries
  const roleMap = new Map();
  rawInsights.salaryRanges.forEach((item) => {
    // Parse strings to numbers (e.g., "5 LPA" -> 5)
    let min = typeof item.min === "string" ? parseFloat(item.min.replace(/[^\d.]/g, "")) : item.min;
    let max = typeof item.max === "string" ? parseFloat(item.max.replace(/[^\d.]/g, "")) : item.max;
    let median = typeof item.median === "string" ? parseFloat(item.median.replace(/[^\d.]/g, "")) : item.median;

    // Normalize: If AI accidentally provided raw values (e.g., 500000) instead of LPA (5), convert them to LPA
    if (min > 1000) min = min / 100000;
    if (max > 1000) max = max / 100000;
    if (median > 1000) median = median / 100000;

    // Only keep if valid
    if (max > 0) {
      roleMap.set(item.role, { role: item.role, min, max, median });
    }
  });

  const parsedSalary = Array.from(roleMap.values());


  const insights = {
    ...rawInsights,
    salaryRanges: parsedSalary,
  };

  const { userId } = await auth();
  let userStats = null;
  let careerInsight = null;
  if (userId) {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        resumes: true,
        assessments: true,
        careerInsight: true,
      }
    });
    if (user) {
      userStats = {
        resumesCount: user.resumes ? 1 : 0,
        atsScore: user.resumes?.atsScore || null,
        assessmentsCount: user.assessments?.length || 0,
        avgAssessmentScore: user.assessments?.length 
          ? (user.assessments.reduce((acc, a) => acc + a.quizScore, 0) / user.assessments.length).toFixed(1) 
          : null,
      };
      careerInsight = user.careerInsight ? JSON.parse(user.careerInsight.insights) : null;
    }
  }

  let roadmapProgress = [];
  try {
    roadmapProgress = await getAllRoadmapProgress();
  } catch (err) {
    console.error("Failed to fetch roadmap progress:", err);
  }

  return <DashboardView insights={insights} userStats={userStats} careerInsight={careerInsight} roadmapProgress={roadmapProgress} />;
}
