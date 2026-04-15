import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_component/DashboardView";
import { getCareerInsights } from "@/actions/career_insight";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const rawInsights = await getIndustryInsights();

const parsedSalary = rawInsights.salaryRanges.map((item) => ({
  role: item.role,
  min: item.min,
  max: item.max,
  median: item.median,
}));


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

  return <DashboardView insights={insights} userStats={userStats} careerInsight={careerInsight} />;
}
