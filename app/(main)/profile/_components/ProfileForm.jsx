// "use client";

// import React, { useState } from "react";
// import { updateUserProfileLinks } from "@/actions/user";
// import { Linkedin, Github, Globe, FileText, Loader2, Save } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";

// export default function ProfileForm({ initialData }) {
//   const [formData, setFormData] = useState({
//     linkedinUrl: initialData?.linkedinUrl || "",
//     githubUrl: initialData?.githubUrl || "",
//     portfolioUrl: initialData?.portfolioUrl || "",
//     externalResumeText: initialData?.externalResumeText || "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await updateUserProfileLinks(formData);
//       toast.success("Profile connections saved securely!");
//     } catch (error) {
//       toast.error(error.message || "Failed to save profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-8">

//       {/* Social Links Section */}
//       <div className="space-y-5">
//         <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Digital Footprint</h3>

//         <div className="space-y-4">
//           <div>
//             <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1.5"><Linkedin className="w-4 h-4 text-blue-600"/> LinkedIn URL</label>
//             <input
//               type="url"
//               name="linkedinUrl"
//               value={formData.linkedinUrl}
//               onChange={handleChange}
//               placeholder="https://linkedin.com/in/username"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1.5"><Github className="w-4 h-4 text-gray-800"/> GitHub URL</label>
//             <input
//               type="url"
//               name="githubUrl"
//               value={formData.githubUrl}
//               onChange={handleChange}
//               placeholder="https://github.com/username"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition-all"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1.5"><Globe className="w-4 h-4 text-emerald-600"/> Portfolio / Website URL</label>
//             <input
//               type="url"
//               name="portfolioUrl"
//               value={formData.portfolioUrl}
//               onChange={handleChange}
//               placeholder="https://yourportfolio.com"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//             />
//           </div>
//         </div>
//       </div>

//       {/* External Resume Section */}
//       <div className="space-y-4 pt-4 border-t border-gray-100">
//         <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2"><FileText className="w-5 h-5 text-indigo-600"/> External Resume Text</h3>
//         <p className="text-sm text-gray-500 mb-2">
//             While we analyze the resume you've built on our platform, you can optionally paste the raw text of a different current resume here. Our AI will analyze this for your Career Insights!
//         </p>
//         <textarea
//           name="externalResumeText"
//           value={formData.externalResumeText}
//           onChange={handleChange}
//           rows="8"
//           placeholder="Paste your plain resume text here..."
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y text-sm text-gray-700"
//         ></textarea>
//       </div>

//       <div className="flex justify-end pt-4">
//          <Button
//            type="submit"
//            disabled={loading}
//            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
//          >
//            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//            Save Profile Data
//          </Button>
//       </div>

//     </form>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateUserProfileLinks } from "@/actions/user";
import {
  Linkedin,
  Github,
  Globe,
  FileText,
  Loader2,
  Save,
  User,
  Sparkles,
  Shield,
  Zap,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function ProfileForm({ initialData, subscriptionData }) {
  const [formData, setFormData] = useState({
    industry: initialData?.industry || "",
    experience: initialData?.experience || "",
    bio: initialData?.bio || "",
    linkedinUrl: initialData?.linkedinUrl || "",
    githubUrl: initialData?.githubUrl || "",
    portfolioUrl: initialData?.portfolioUrl || "",
    externalResumeText: initialData?.externalResumeText || "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [subscription, setSubscription] = useState(subscriptionData);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [betaAccessEnabled, setBetaAccessEnabled] = useState(false);

  useEffect(() => {
    setSubscription(subscriptionData);
  }, [subscriptionData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfileLinks(formData);
      toast.success("Profile saved successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionAction = async (action) => {
    if (!subscription) return;
    setActionLoading(true);

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Subscription update failed.");
      }

      setSubscription(result.subscription || subscription);
      toast.success(result.message || "Subscription updated successfully.");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch("/api/account", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Account deletion failed.");
      }

      toast.success(result.message || "Account deleted successfully.");
      router.push("/");
    } catch (error) {
      toast.error(error.message || "Unable to delete account right now.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const planLabel = subscription?.planName || "Free";
  const billingLabel = subscription?.billingPeriod?.toLowerCase() || "monthly";
  const renewalDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : "Free plan does not renew";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info Section */}
      <div className="space-y-5 text-black">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g., Software Development, Finance, Healthcare"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gray-400" />
              Years of Experience
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 5"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Professional Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            placeholder="Tell us about your professional background, key achievements, and career goals..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y text-sm bg-white"
          />
          <p className="text-xs text-gray-400 mt-1">
            This helps our AI provide personalized career recommendations.
          </p>
        </div>
      </div>

      {/* Social Links Section */}
      <div className="space-y-5 text-black">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Digital Footprint
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1.5">
              <Linkedin className="w-4 h-4 text-blue-600" />
              LinkedIn Profile
            </label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
            <p className="text-xs text-gray-400 mt-1">
              Connect your LinkedIn for professional verification
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1.5">
              <Github className="w-4 h-4 text-gray-700" />
              GitHub Repository
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-gray-700 outline-none transition-all bg-white"
            />
            <p className="text-xs text-gray-400 mt-1">
              Showcase your code portfolio and contributions
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1.5">
              <Globe className="w-4 h-4 text-emerald-600" />
              Portfolio / Personal Website
            </label>
            <input
              type="url"
              name="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
            />
            <p className="text-xs text-gray-400 mt-1">
              Share your work samples and projects
            </p>
          </div>
        </div>
      </div>

      {/* External Resume Section */}
      <div className="space-y-4 text-black">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            External Resume
          </h3>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-3">
            While we analyze the resume you've built on our platform, you can
            optionally paste the raw text of a different current resume here.
            Our AI will analyze this for your Career Insights!
          </p>
          <textarea
            name="externalResumeText"
            value={formData.externalResumeText}
            onChange={handleChange}
            rows="6"
            placeholder="Paste your plain resume text here..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y text-sm bg-white"
          />
        </div>
      </div>

      {/* Membership, Billing & Tokens */}
      <div className="space-y-5 text-black">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Membership & Billing
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Plan</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">
              {planLabel}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {billingLabel} billing
            </p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Renewal</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">
              {renewalDate}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {subscription?.status === "ACTIVE"
                ? "Plan active"
                : "Free plan or trial"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Button asChild variant="secondary" className="w-full">
            <Link href="/pricing">Upgrade plan</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={
              !subscription || subscription.plan === "FREE" || actionLoading
            }
            onClick={() => handleSubscriptionAction("cancel")}
          >
            {actionLoading ? "Processing..." : "Cancel subscription"}
          </Button>
          {subscription?.plan === "FREE" && (
            <Button
              variant="ghost"
              className="w-full border border-gray-200"
              disabled={actionLoading}
              onClick={() => handleSubscriptionAction("trial")}
            >
              {actionLoading ? "Processing..." : "Start free trial"}
            </Button>
          )}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-gray-900">Token usage</h4>
          <p className="text-sm text-slate-500 mt-1 mb-3">
            Track your plan limits across resume, cover letter, interview, and
            ATS tools.
          </p>
          {subscription?.features?.length ? (
            <div className="space-y-3">
              {subscription.features.slice(0, 4).map((feature) => (
                <div
                  key={feature.key}
                  className="rounded-2xl bg-white p-3 border border-gray-100"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm text-slate-900">
                      {feature.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      {feature.isUnlimited
                        ? "Unlimited"
                        : `${feature.used}/${feature.limit}`}
                    </p>
                  </div>
                  {!feature.isUnlimited && (
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: `${Math.min(100, (feature.used / feature.limit) * 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Your subscription summary is loading or unavailable.
            </p>
          )}
        </div>
      </div>

      {/* Security & Account Settings */}
      <div id="account-security" className="space-y-5 text-black">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Security & Account
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">Notifications</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-700">Product updates</p>
                <p className="text-xs text-slate-500">
                  Receive news and feature announcements.
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">Beta access</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-700">Early feature access</p>
                <p className="text-xs text-slate-500">
                  Enable preview features for faster experimentation.
                </p>
              </div>
              <Switch
                checked={betaAccessEnabled}
                onCheckedChange={setBetaAccessEnabled}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast("Security settings are coming soon.")}
          >
            Update sign-in settings
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
          >
            <Trash2 className="w-4 h-4" />
            {deleteLoading ? "Deleting…" : "Delete account"}
          </Button>
        </div>
      </div>

      {/* API & Token Access */}
      <div className="space-y-5 text-black">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            API & Token Access
          </h3>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            Manage your API tokens and developer access in one place. Token
            management will be available soon.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/pricing">View plan details</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => toast("API token management is coming soon.")}
            >
              Manage tokens
            </Button>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-slate-500">
          Save your profile changes and keep your account ready for the next AI
          recommendation.
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
