//import React from "react";
//           <User className="w-10 h-10 text-white" />
//         </div>
//         <div>
//           <h1 className="text-3xl font-bold">Career Profile</h1>
//           <p className="text-blue-100 mt-1">Manage your professional footprint and external assets for precise AI analysis.</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-b-3xl shadow-lg border-x border-b border-gray-100 p-8">
//         <ProfileForm initialData={user} />
//       </div>
//     </div>
//   );
// }

import React from "react";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "./_components/ProfileForm";
import { getUsageDashboard } from "@/actions/subscription";
import {
  User,
  Link as LinkIcon,
  FileText,
  Briefcase,
  Sparkles,
  Globe,
  Github,
  Linkedin,
} from "lucide-react";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      experience: true,
      bio: true,
      linkedinUrl: true,
      githubUrl: true,
      portfolioUrl: true,
      externalResumeText: true,
    },
  });

  if (!user) {
    redirect("/onboarding");
  }

  const subscription = await getUsageDashboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 text-black">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-5 lg:px-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-xl">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Career Profile</h1>
          </div>
          <p className="text-gray-600 ml-12">
            Manage your professional footprint and external assets for precise
            AI analysis.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-semibold text-gray-900">
                  {user.industry || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-semibold text-gray-900">
                  {user.experience || "Not specified"} years
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resume Status</p>
                <p className="font-semibold text-gray-900">
                  {user.externalResumeText ? "Uploaded" : "Not uploaded"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Preview (if any exist) */}
        {(user.linkedinUrl || user.githubUrl || user.portfolioUrl) && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Connected Profiles
            </h3>
            <div className="flex flex-wrap gap-3">
              {user.linkedinUrl && (
                <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">LinkedIn</span>
                </div>
              )}
              {user.githubUrl && (
                <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                  <Github className="w-4 h-4 text-gray-700" />
                  <span className="text-gray-600">GitHub</span>
                </div>
              )}
              {user.portfolioUrl && (
                <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Portfolio</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Hub */}
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.95fr] mb-8">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  Account hub
                </p>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">
                  Plan, billing and account controls
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Review your subscription, billing status, token usage and
                  account actions in one place.
                </p>
              </div>
              <div className="rounded-2xl bg-blue-100 p-3">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Current plan</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {subscription.planName}
                </p>
                <p className="mt-1 text-sm text-slate-500 capitalize">
                  {subscription.status.toLowerCase()}
                </p>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Billing cadence</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {subscription.billingPeriod.toLowerCase()}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {subscription.currentPeriodEnd
                    ? new Date(
                        subscription.currentPeriodEnd,
                      ).toLocaleDateString()
                    : "Free plan does not renew"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Quick actions
            </p>
            <div className="mt-5 space-y-3">
              <a
                href="/pricing"
                className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Upgrade or change plan
              </a>
              <a
                href="/pricing"
                className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Manage billing details
              </a>
              <a
                href="/pricing"
                className="block rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                Cancel subscription
              </a>
              <a
                href="#account-security"
                className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Account settings & security
              </a>
              <a
                href="#account-security"
                className="block rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                Delete account
              </a>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Profile
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Update your professional information for better career
              recommendations
            </p>
          </div>
          <div className="p-6">
            <ProfileForm initialData={user} subscriptionData={subscription} />
          </div>
        </div>
      </div>
    </div>
  );
}
