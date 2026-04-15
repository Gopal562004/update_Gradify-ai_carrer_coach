"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// ==================== PLAN LIMITS CONFIG ====================
const PLAN_LIMITS = {
  FREE: {
    resumeLimit: 2,
    coverLetterLimit: 1,
    interviewLimit: 3,
    atsCheckLimit: 2,
    careerEvalLimit: 1,
  },
  STARTER: {
    resumeLimit: 5,
    coverLetterLimit: 3,
    interviewLimit: 10,
    atsCheckLimit: 5,
    careerEvalLimit: 3,
  },
  PROFESSIONAL: {
    resumeLimit: -1, // unlimited
    coverLetterLimit: -1,
    interviewLimit: -1,
    atsCheckLimit: -1,
    careerEvalLimit: -1,
  },
  ENTERPRISE: {
    resumeLimit: -1,
    coverLetterLimit: -1,
    interviewLimit: -1,
    atsCheckLimit: -1,
    careerEvalLimit: -1,
  },
} as const;

type PlanKey = keyof typeof PLAN_LIMITS;

// Feature name to DB column mapping
const FEATURE_MAP = {
  resume: { limit: "resumeLimit", used: "resumesUsed" },
  coverLetter: { limit: "coverLetterLimit", used: "coverLettersUsed" },
  interview: { limit: "interviewLimit", used: "interviewsUsed" },
  atsCheck: { limit: "atsCheckLimit", used: "atsChecksUsed" },
  careerEval: { limit: "careerEvalLimit", used: "careerEvalsUsed" },
} as const;

type FeatureKey = keyof typeof FEATURE_MAP;

// ==================== HELPERS ====================
async function getInternalUser() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });
  if (!user) throw new Error("User not found");
  return user;
}

// ==================== GET OR CREATE SUBSCRIPTION ====================
export async function getUserSubscription() {
  const user = await getInternalUser();

  let subscription = await db.subscription.findUnique({
    where: { userId: user.id },
  });

  if (!subscription) {
    // Auto-create FREE subscription for new users
    const now = new Date();
    subscription = await db.subscription.create({
      data: {
        userId: user.id,
        plan: "FREE",
        billingPeriod: "MONTHLY",
        status: "ACTIVE",
        ...PLAN_LIMITS.FREE,
        currentPeriodStart: now,
        currentPeriodEnd: null, // FREE tier never expires
      },
    });
  }

  // Check if billing period needs to be reset (for paid plans)
  if (
    subscription.currentPeriodEnd &&
    new Date() > subscription.currentPeriodEnd &&
    subscription.plan !== "FREE"
  ) {
    subscription = await resetMonthlyUsage(subscription.id);
  }

  return subscription;
}

// ==================== CHECK FEATURE ACCESS ====================
export async function checkFeatureAccess(feature: string) {
  const featureKey = feature as FeatureKey;
  if (!FEATURE_MAP[featureKey]) {
    throw new Error(`Unknown feature: ${feature}`);
  }

  const subscription = await getUserSubscription();
  const limitField = FEATURE_MAP[featureKey].limit;
  const usedField = FEATURE_MAP[featureKey].used;

  const limit = (subscription as any)[limitField] as number;
  const used = (subscription as any)[usedField] as number;

  // -1 means unlimited
  const isUnlimited = limit === -1;
  const remaining = isUnlimited ? -1 : Math.max(0, limit - used);
  const allowed = isUnlimited || used < limit;

  return {
    allowed,
    remaining,
    limit,
    used,
    isUnlimited,
    plan: subscription.plan,
    planName: subscription.plan.charAt(0) + subscription.plan.slice(1).toLowerCase(),
  };
}

// ==================== CONSUME TOKEN ====================
export async function consumeToken(feature: string) {
  const featureKey = feature as FeatureKey;
  if (!FEATURE_MAP[featureKey]) {
    throw new Error(`Unknown feature: ${feature}`);
  }

  const subscription = await getUserSubscription();
  const limitField = FEATURE_MAP[featureKey].limit;
  const usedField = FEATURE_MAP[featureKey].used;

  const limit = (subscription as any)[limitField] as number;
  const used = (subscription as any)[usedField] as number;

  // Check if allowed
  if (limit !== -1 && used >= limit) {
    throw new Error(
      `You've reached your ${subscription.plan} plan limit for this feature. Please upgrade to continue.`
    );
  }

  // Don't increment for unlimited plans
  if (limit === -1) return subscription;

  // Increment usage
  const updated = await db.subscription.update({
    where: { id: subscription.id },
    data: {
      [usedField]: used + 1,
    },
  });

  return updated;
}

// ==================== UPGRADE PLAN (DEMO PAYMENT) ====================
export async function upgradePlan(
  plan: string,
  billingPeriod: string = "MONTHLY"
) {
  const user = await getInternalUser();
  const subscription = await getUserSubscription();
  const planKey = plan.toUpperCase() as PlanKey;

  if (!PLAN_LIMITS[planKey]) {
    throw new Error(`Invalid plan: ${plan}`);
  }

  // --- DEMO PAYMENT SIMULATION ---
  // In production, this would integrate with Razorpay/Stripe
  // For now, we just simulate a successful payment
  const now = new Date();
  const periodEnd = new Date(now);

  if (billingPeriod === "ANNUAL") {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  const updated = await db.subscription.update({
    where: { id: subscription.id },
    data: {
      plan: planKey,
      billingPeriod: billingPeriod as any,
      status: planKey === "FREE" ? "ACTIVE" : "ACTIVE",
      ...PLAN_LIMITS[planKey],
      // Reset usage counters on plan change
      resumesUsed: 0,
      coverLettersUsed: 0,
      interviewsUsed: 0,
      atsChecksUsed: 0,
      careerEvalsUsed: 0,
      currentPeriodStart: now,
      currentPeriodEnd: planKey === "FREE" ? null : periodEnd,
    },
  });

  return {
    success: true,
    message: `Successfully upgraded to ${planKey} plan!`,
    subscription: updated,
    // Demo payment receipt
    payment: {
      id: `demo_${Date.now()}`,
      amount:
        planKey === "STARTER"
          ? billingPeriod === "ANNUAL"
            ? 4999
            : 499
          : planKey === "PROFESSIONAL"
          ? billingPeriod === "ANNUAL"
            ? 14999
            : 1499
          : planKey === "ENTERPRISE"
          ? billingPeriod === "ANNUAL"
            ? 49999
            : 4999
          : 0,
      currency: "INR",
      status: "success",
      method: "demo",
    },
  };
}

// ==================== CANCEL SUBSCRIPTION ====================
export async function cancelSubscription() {
  const subscription = await getUserSubscription();

  if (subscription.plan === "FREE") {
    throw new Error("Cannot cancel a free plan");
  }

  const updated = await db.subscription.update({
    where: { id: subscription.id },
    data: {
      status: "CANCELLED",
      // Downgrade to FREE at period end
      plan: "FREE",
      ...PLAN_LIMITS.FREE,
      currentPeriodEnd: null,
      resumesUsed: 0,
      coverLettersUsed: 0,
      interviewsUsed: 0,
      atsChecksUsed: 0,
      careerEvalsUsed: 0,
    },
  });

  return {
    success: true,
    message: "Subscription cancelled. You have been downgraded to the Free plan.",
    subscription: updated,
  };
}

// ==================== RESET MONTHLY USAGE ====================
async function resetMonthlyUsage(subscriptionId: string) {
  const now = new Date();
  const sub = await db.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!sub) throw new Error("Subscription not found");

  const newPeriodEnd = new Date(now);
  if (sub.billingPeriod === "ANNUAL") {
    newPeriodEnd.setFullYear(newPeriodEnd.getFullYear() + 1);
  } else {
    newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
  }

  return db.subscription.update({
    where: { id: subscriptionId },
    data: {
      resumesUsed: 0,
      coverLettersUsed: 0,
      interviewsUsed: 0,
      atsChecksUsed: 0,
      careerEvalsUsed: 0,
      currentPeriodStart: now,
      currentPeriodEnd: newPeriodEnd,
    },
  });
}

// ==================== USAGE DASHBOARD ====================
export async function getUsageDashboard() {
  const subscription = await getUserSubscription();

  const features = [
    {
      key: "resume",
      label: "AI Resume Generation",
      icon: "FileText",
      used: subscription.resumesUsed,
      limit: subscription.resumeLimit,
      isUnlimited: subscription.resumeLimit === -1,
    },
    {
      key: "coverLetter",
      label: "Cover Letters",
      icon: "Pencil",
      used: subscription.coverLettersUsed,
      limit: subscription.coverLetterLimit,
      isUnlimited: subscription.coverLetterLimit === -1,
    },
    {
      key: "interview",
      label: "Interview Practice",
      icon: "MessageSquare",
      used: subscription.interviewsUsed,
      limit: subscription.interviewLimit,
      isUnlimited: subscription.interviewLimit === -1,
    },
    {
      key: "atsCheck",
      label: "ATS Score Checks",
      icon: "Target",
      used: subscription.atsChecksUsed,
      limit: subscription.atsCheckLimit,
      isUnlimited: subscription.atsCheckLimit === -1,
    },
    {
      key: "careerEval",
      label: "Career Evaluation",
      icon: "TrendingUp",
      used: subscription.careerEvalsUsed,
      limit: subscription.careerEvalLimit,
      isUnlimited: subscription.careerEvalLimit === -1,
    },
  ];

  return {
    plan: subscription.plan,
    planName:
      subscription.plan.charAt(0) + subscription.plan.slice(1).toLowerCase(),
    status: subscription.status,
    billingPeriod: subscription.billingPeriod,
    features,
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
    trialEndsAt: subscription.trialEndsAt,
  };
}

// ==================== START FREE TRIAL ====================
export async function startFreeTrial() {
  const subscription = await getUserSubscription();

  if (subscription.plan !== "FREE") {
    throw new Error("Free trial is only available for Free plan users");
  }

  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial

  const updated = await db.subscription.update({
    where: { id: subscription.id },
    data: {
      plan: "PROFESSIONAL",
      status: "TRIALING",
      ...PLAN_LIMITS.PROFESSIONAL,
      currentPeriodStart: now,
      currentPeriodEnd: trialEnd,
      trialEndsAt: trialEnd,
      resumesUsed: 0,
      coverLettersUsed: 0,
      interviewsUsed: 0,
      atsChecksUsed: 0,
      careerEvalsUsed: 0,
    },
  });

  return {
    success: true,
    message: "14-day free trial activated! Enjoy unlimited access to Professional features.",
    subscription: updated,
  };
}
