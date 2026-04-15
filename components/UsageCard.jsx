// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   FileText,
//   Pencil,
//   MessageSquare,
//   Target,
//   TrendingUp,
//   Zap,
//   Crown,
//   Star,
//   Sparkles,
//   ArrowRight,
// } from "lucide-react";
// import Link from "next/link";
// import { getUsageDashboard } from "@/actions/subscription";

// const ICON_MAP = {
//   FileText,
//   Pencil,
//   MessageSquare,
//   Target,
//   TrendingUp,
// };

// const PLAN_COLORS = {
//   FREE: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", gradient: "from-gray-400 to-gray-500" },
//   STARTER: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", gradient: "from-blue-500 to-blue-600" },
//   PROFESSIONAL: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", gradient: "from-purple-500 to-purple-600" },
//   ENTERPRISE: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", gradient: "from-amber-500 to-amber-600" },
// };

// const PLAN_ICONS = {
//   FREE: Sparkles,
//   STARTER: Star,
//   PROFESSIONAL: Zap,
//   ENTERPRISE: Crown,
// };

// export default function UsageCard() {
//   const [usage, setUsage] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadUsage();
//   }, []);

//   async function loadUsage() {
//     try {
//       const data = await getUsageDashboard();
//       setUsage(data);
//     } catch (err) {
//       console.error("Failed to load usage:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
//         <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
//         <div className="space-y-3">
//           {[1, 2, 3, 4, 5].map((i) => (
//             <div key={i} className="h-4 bg-gray-100 rounded"></div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!usage) return null;

//   const planColor = PLAN_COLORS[usage.plan] || PLAN_COLORS.FREE;
//   const PlanIcon = PLAN_ICONS[usage.plan] || Sparkles;

//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//       {/* Plan Header */}
//       <div className={`bg-gradient-to-r ${planColor.gradient} p-5`}>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
//               <PlanIcon className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h3 className="text-white font-bold text-lg">
//                 {usage.planName} Plan
//               </h3>
//               <p className="text-white/80 text-sm">
//                 {usage.plan === "FREE"
//                   ? "Free tokens included"
//                   : `${usage.billingPeriod.toLowerCase()} billing`}
//               </p>
//             </div>
//           </div>
//           {usage.plan === "FREE" && (
//             <Link href="/pricing">
//               <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-1.5">
//                 Upgrade
//                 <ArrowRight className="w-3.5 h-3.5" />
//               </button>
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* Usage Stats */}
//       <div className="p-5 space-y-4">
//         <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
//           Token Usage
//         </h4>
//         {usage.features.map((feature) => {
//           const IconComp = ICON_MAP[feature.icon] || FileText;
//           const percentage = feature.isUnlimited
//             ? 100
//             : feature.limit > 0
//             ? Math.round((feature.used / feature.limit) * 100)
//             : 0;
//           const isNearLimit = !feature.isUnlimited && percentage >= 80;
//           const isAtLimit = !feature.isUnlimited && feature.used >= feature.limit;

//           return (
//             <div key={feature.key} className="group">
//               <div className="flex items-center justify-between mb-1.5">
//                 <div className="flex items-center gap-2">
//                   <IconComp className="w-4 h-4 text-gray-400" />
//                   <span className="text-sm font-medium text-gray-700">
//                     {feature.label}
//                   </span>
//                 </div>
//                 <span
//                   className={`text-sm font-semibold ${
//                     isAtLimit
//                       ? "text-red-600"
//                       : isNearLimit
//                       ? "text-amber-600"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   {feature.isUnlimited ? (
//                     <span className="flex items-center gap-1">
//                       <span className="text-green-600">∞</span>
//                       <span className="text-gray-400 text-xs">unlimited</span>
//                     </span>
//                   ) : (
//                     `${feature.used}/${feature.limit}`
//                   )}
//                 </span>
//               </div>

//               {/* Progress Bar */}
//               {!feature.isUnlimited && (
//                 <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
//                   <div
//                     className={`h-full rounded-full transition-all duration-500 ${
//                       isAtLimit
//                         ? "bg-gradient-to-r from-red-400 to-red-500"
//                         : isNearLimit
//                         ? "bg-gradient-to-r from-amber-400 to-amber-500"
//                         : "bg-gradient-to-r from-blue-400 to-blue-500"
//                     }`}
//                     style={{ width: `${Math.min(percentage, 100)}%` }}
//                   />
//                 </div>
//               )}

//               {feature.isUnlimited && (
//                 <div className="w-full bg-green-50 rounded-full h-2 overflow-hidden">
//                   <div className="h-full rounded-full bg-gradient-to-r from-green-300 to-green-400 w-full" />
//                 </div>
//               )}
//             </div>
//           );
//         })}

//         {/* Period Info */}
//         {usage.currentPeriodEnd && (
//           <div className="pt-3 border-t border-gray-100">
//             <p className="text-xs text-gray-500">
//               Resets on{" "}
//               {new Date(usage.currentPeriodEnd).toLocaleDateString("en-IN", {
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </p>
//           </div>
//         )}

//         {usage.plan === "FREE" && (
//           <div className="pt-3 border-t border-gray-100">
//             <p className="text-xs text-gray-500">
//               ⚡ Free tokens are one-time. Upgrade for monthly refills.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Pencil,
  MessageSquare,
  Target,
  TrendingUp,
  Zap,
  Crown,
  Star,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getUsageDashboard } from "@/actions/subscription";

const ICON_MAP = {
  FileText,
  Pencil,
  MessageSquare,
  Target,
  TrendingUp,
};

const PLAN_STYLES = {
  FREE: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", iconBg: "bg-gray-100", iconColor: "text-gray-600" },
  STARTER: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  PROFESSIONAL: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
  ENTERPRISE: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
};

const PLAN_ICONS = {
  FREE: Sparkles,
  STARTER: Star,
  PROFESSIONAL: Zap,
  ENTERPRISE: Crown,
};

export default function UsageCard() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsage();
  }, []);

  async function loadUsage() {
    try {
      const data = await getUsageDashboard();
      setUsage(data);
    } catch (err) {
      console.error("Failed to load usage:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!usage) return null;

  const planStyle = PLAN_STYLES[usage.plan] || PLAN_STYLES.FREE;
  const PlanIcon = PLAN_ICONS[usage.plan] || Sparkles;

  const getProgressColor = (percentage, isAtLimit, isNearLimit) => {
    if (isAtLimit) return "bg-rose-500";
    if (isNearLimit) return "bg-amber-500";
    return "bg-blue-500";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Plan Header - No gradient */}
      <div className={`${planStyle.bg} border-b border-gray-100 p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${planStyle.iconBg} rounded-xl flex items-center justify-center`}>
              <PlanIcon className={`w-5 h-5 ${planStyle.iconColor}`} />
            </div>
            <div>
              <h3 className={`font-semibold text-lg ${planStyle.text}`}>
                {usage.planName} Plan
              </h3>
              <p className="text-gray-500 text-xs">
                {usage.plan === "FREE"
                  ? "Free tokens included"
                  : `${usage.billingPeriod.toLowerCase()} billing`}
              </p>
            </div>
          </div>
          {usage.plan === "FREE" && (
            <Link href="/pricing">
              <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm">
                Upgrade
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Token Usage
          </h4>
          {usage.plan !== "FREE" && (
            <span className="text-xs text-gray-400">
              Resets {new Date(usage.currentPeriodEnd).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {usage.features.map((feature) => {
            const IconComp = ICON_MAP[feature.icon] || FileText;
            const percentage = feature.isUnlimited
              ? 100
              : feature.limit > 0
              ? Math.round((feature.used / feature.limit) * 100)
              : 0;
            const isNearLimit = !feature.isUnlimited && percentage >= 80 && percentage < 100;
            const isAtLimit = !feature.isUnlimited && feature.used >= feature.limit;
            const progressColor = getProgressColor(percentage, isAtLimit, isNearLimit);

            return (
              <div key={feature.key} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <IconComp className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {feature.label}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isAtLimit
                        ? "text-rose-600"
                        : isNearLimit
                        ? "text-amber-600"
                        : "text-gray-600"
                    }`}
                  >
                    {feature.isUnlimited ? (
                      <span className="flex items-center gap-1">
                        <span className="text-emerald-600">∞</span>
                        <span className="text-gray-400 text-xs">unlimited</span>
                      </span>
                    ) : (
                      `${feature.used}/${feature.limit}`
                    )}
                  </span>
                </div>

                {/* Progress Bar - No gradient */}
                {!feature.isUnlimited && (
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                )}

                {feature.isUnlimited && (
                  <div className="w-full bg-emerald-50 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400 w-full" />
                  </div>
                )}

                {/* Warning text for near limit */}
                {isNearLimit && !isAtLimit && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Approaching limit
                  </p>
                )}

                {/* Warning text for at limit */}
                {isAtLimit && (
                  <p className="text-xs text-rose-600 mt-1">
                    ❌ Limit reached. Upgrade for more tokens.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Period Info - Moved to header for non-free plans */}
        {usage.plan === "FREE" && usage.currentPeriodEnd && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Resets on{" "}
              {new Date(usage.currentPeriodEnd).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        )}

        {usage.plan === "FREE" && (
          <div className="pt-2">
            <p className="text-xs text-gray-400">
              ⚡ Free tokens are one-time. Upgrade for monthly refills.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}