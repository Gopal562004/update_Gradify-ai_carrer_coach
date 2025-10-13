// app/onboarding/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import OnBoardingForm from "./_components/OnboardingForm";
import { industries, Industry } from "@/data/industries";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    redirect("/dashboard");
  }

  const industriesData: Industry[] = industries;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <OnBoardingForm industries={industriesData} />
      </div>
    </div>
  );
};

export default OnboardingPage;
