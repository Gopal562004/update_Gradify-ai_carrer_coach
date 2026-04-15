// "use client";

// import React, { useEffect, useState } from "react";
// import { getCareerInsights, generateCareerInsights } from "@/actions/career_insight";
// import { 
//   Briefcase, 
//   TrendingUp, 
//   DollarSign, 
//   Target, 
//   Linkedin, 
//   BookOpen, 
//   Award,
//   Sparkles,
//   Loader2,
//   RefreshCw,
//   CheckCircle2,
//   User,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default function CareerInsightsPage() {
//   const [insights, setInsights] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [generating, setGenerating] = useState(false);

//   useEffect(() => {
//     fetchInsights();
//   }, []);

//   const fetchInsights = async () => {
//     try {
//       const data = await getCareerInsights();
//       setInsights(data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerate = async () => {
//     setGenerating(true);
//     try {
//       const data = await generateCareerInsights();
//       setInsights(data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setGenerating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
//         <p className="text-gray-500 font-medium pb-[300px]">Loading your career profile...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       {/* Profile Optimization Banner */}
//       <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
//          <div className="flex items-center gap-3">
//             <div className="p-2 bg-indigo-100 rounded-full shrink-0">
//                <User className="w-5 h-5 text-indigo-600" />
//             </div>
//             <p className="text-sm text-indigo-900 font-medium">
//                <strong>Want better insights?</strong> Add your LinkedIn, GitHub, and external resume to your profile for a deeper AI analysis!
//             </p>
//          </div>
//          <Link href="/profile">
//            <Button variant="outline" className="shrink-0 bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 text-sm h-9">
//               Complete Profile
//            </Button>
//          </Link>
//       </div>

//       {/* Header Section */}
//       <div className="bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
//         <div className="absolute top-0 right-0 p-8 opacity-20 hidden md:block">
//           <Sparkles className="w-48 h-48" />
//         </div>
//         <div className="relative z-10 max-w-2xl">
//           <h1 className="text-4xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
//             AI Career Coach <Sparkles className="w-8 h-8 text-amber-400" />
//           </h1>
//           <p className="text-lg text-indigo-100 mb-6 leading-relaxed">
//             Personalized insights based on your resume, assessment scores, and career evaluation mapping. Unlock your potential with our deep AI analysis.
//           </p>
          
//           <Button
//             onClick={handleGenerate}
//             disabled={generating}
//             className="bg-white text-indigo-900 hover:bg-gray-100 font-semibold px-6 py-6 h-auto rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
//           >
//             {generating ? (
//               <>
//                 <Loader2 className="w-5 h-5 mr-3 animate-spin text-indigo-600" />
//                 Analyzing Profile...
//               </>
//             ) : insights ? (
//               <>
//                 <RefreshCw className="w-5 h-5 mr-3 text-indigo-600" />
//                 Refresh AI Analysis
//               </>
//             ) : (
//               <>
//                 <Sparkles className="w-5 h-5 mr-3 text-amber-500" />
//                 Generate Deep Insights
//               </>
//             )}
//           </Button>
//         </div>
//       </div>

//       {!insights && !generating && (
//         <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 mt-10">
//           <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">No Insights Generated Yet</h2>
//           <p className="text-gray-500 max-w-md mx-auto">
//             Click the generate button above to let our AI analyze your profile, test scores, and resumes to provide tailored career optimization.
//           </p>
//         </div>
//       )}

//       {insights && (
//         <div className="space-y-8">
//           {/* Summary Alert */}
//           <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
//             <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
//               <Briefcase className="w-6 h-6" />
//             </div>
//             <div>
//               <h3 className="font-semibold text-blue-900 mb-1">AI Executive Summary</h3>
//               <p className="text-blue-800 text-sm leading-relaxed">{insights.summary}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* LinkedIn Optimization */}
//             <div className="bg-white border text-gray-900 border-gray-100 rounded-3xl p-8 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group">
//               <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 z-0"></div>
//               <div className="relative z-10 flex items-center gap-3 mb-6">
//                 <div className="p-3 bg-[#0A66C2]/10 text-[#0A66C2] rounded-xl">
//                   <Linkedin className="w-6 h-6" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900">LinkedIn Optimization</h3>
//               </div>
              
//               <div className="space-y-4 relative z-10">
//                 <div>
//                   <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Suggested Headline</label>
//                   <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-1">
//                     {insights.linkedinOptimization.headline}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">About Section Starter</label>
//                   <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-1 italic">
//                     "{insights.linkedinOptimization.aboutSection}"
//                   </p>
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Key Profile Additions</label>
//                   <ul className="mt-2 space-y-2">
//                     {insights.linkedinOptimization.keyAdditions.map((tip, i) => (
//                       <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
//                         <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
//                         {tip}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Salary Negotiation */}
//             <div className="bg-white border text-gray-900 border-gray-100 rounded-3xl p-8 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group">
//               <div className="absolute right-0 top-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 z-0"></div>
//               <div className="relative z-10 flex items-center gap-3 mb-6">
//                 <div className="p-3 bg-green-100 text-green-600 rounded-xl">
//                   <DollarSign className="w-6 h-6" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900">Salary Strategy</h3>
//               </div>
              
//               <div className="space-y-5 relative z-10">
//                 <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
//                   <div className="text-green-800 text-sm font-medium">Expected Range</div>
//                   <div className="text-2xl font-bold text-green-600 mt-1">{insights.salaryNegotiation.expectedRange}</div>
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Market Context</label>
//                   <p className="text-sm text-gray-700 mt-1">{insights.salaryNegotiation.marketInsights}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Negotiation Tactics</label>
//                   <ul className="mt-2 space-y-2">
//                     {insights.salaryNegotiation.negotiationTips.map((tip, i) => (
//                       <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
//                         <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
//                         {tip}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Career Path Analytics */}
//             <div className="bg-white border text-gray-900 border-gray-100 rounded-3xl p-8 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group">
//               <div className="absolute right-0 top-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 z-0"></div>
//               <div className="relative z-10 flex items-center gap-3 mb-6">
//                 <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
//                   <TrendingUp className="w-6 h-6" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900">Career Trajectory</h3>
//               </div>
              
//               <div className="space-y-5 relative z-10">
//                 <div>
//                   <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b pb-1 block mb-2">Current Projection</label>
//                   <p className="text-sm text-gray-700 font-medium">{insights.careerPathAnalytics.currentPath}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b pb-1 block mb-2">Strategic Next Steps</label>
//                   <div className="flex flex-col gap-2">
//                     {insights.careerPathAnalytics.nextSteps.map((step, i) => (
//                       <div key={i} className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100/50">
//                         <div className="bg-purple-200 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div>
//                         <span className="text-sm text-gray-800">{step}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b pb-1 block mb-2">Target Future Roles</label>
//                   <div className="flex flex-wrap gap-2">
//                     {insights.careerPathAnalytics.futureRoles.map((role, i) => (
//                       <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
//                         {role}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Skill Gap Analysis */}
//             <div className="bg-white border text-gray-900 border-gray-100 rounded-3xl p-8 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group">
//               <div className="absolute right-0 top-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 z-0"></div>
//               <div className="relative z-10 flex items-center gap-3 mb-6">
//                 <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
//                   <Award className="w-6 h-6" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900">Skill Gap Analysis</h3>
//               </div>
              
//               <div className="space-y-6 relative z-10">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/50">
//                     <label className="text-xs font-bold text-green-700 uppercase mb-2 block">Top Strengths</label>
//                     <ul className="space-y-1">
//                       {insights.skillGapAnalysis.currentStrengths.map((str, i) => (
//                         <li key={i} className="text-sm text-gray-700 flex items-center gap-1.5 before:content-[''] before:block before:w-1.5 before:h-1.5 before:bg-green-500 before:rounded-full">{str}</li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50">
//                     <label className="text-xs font-bold text-red-700 uppercase mb-2 block">Missing Skills</label>
//                     <ul className="space-y-1">
//                       {insights.skillGapAnalysis.missingSkills.map((skill, i) => (
//                         <li key={i} className="text-sm text-gray-700 flex items-center gap-1.5 before:content-[''] before:block before:w-1.5 before:h-1.5 before:bg-red-500 before:rounded-full">{skill}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Recommended Learning Resources</label>
//                   <div className="space-y-2">
//                     {insights.skillGapAnalysis.learningResources.map((res, i) => (
//                       <div key={i} className="flex flex-row items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
//                         <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
//                         <span className="text-sm text-gray-700 font-medium">{res}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import { getCareerInsights, generateCareerInsights } from "@/actions/career_insight";
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Linkedin, 
  BookOpen, 
  Award,
  Sparkles,
  Loader2,
  RefreshCw,
  CheckCircle2,
  User,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CareerInsightsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const data = await getCareerInsights();
      setInsights(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await generateCareerInsights();
      setInsights(data);
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading your career profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Profile Optimization Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-blue-800">
              <strong>Want better insights?</strong> Add your LinkedIn, GitHub, and external resume to your profile for a deeper AI analysis!
            </p>
          </div>
          <Link href="/profile">
            <Button variant="outline" className="shrink-0 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 text-sm h-9">
              Complete Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Header Section - Redesigned without gradient */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">AI Career Coach</h1>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Personalized insights based on your resume, assessment scores, and career evaluation mapping. Unlock your potential with our deep AI analysis.
            </p>
            
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Profile...
                </>
              ) : insights ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh AI Analysis
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Deep Insights
                </>
              )}
            </Button>
          </div>
        </div>

        {!insights && !generating && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200 mt-10">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Insights Generated Yet</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Click the generate button above to let our AI analyze your profile, test scores, and resumes to provide tailored career optimization.
            </p>
          </div>
        )}

        {insights && (
          <div className="space-y-8">
            {/* Summary Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI Executive Summary</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{insights.summary}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LinkedIn Optimization */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-[#0A66C2]/10 rounded-lg">
                    <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">LinkedIn Optimization</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Headline</label>
                    <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-1">
                      {insights.linkedinOptimization.headline}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">About Section Starter</label>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-1 italic">
                      "{insights.linkedinOptimization.aboutSection}"
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Key Profile Additions</label>
                    <ul className="mt-2 space-y-2">
                      {insights.linkedinOptimization.keyAdditions.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Salary Negotiation */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Salary Strategy</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="text-green-800 text-xs font-medium">Expected Range</div>
                    <div className="text-xl font-bold text-green-600 mt-1">{insights.salaryNegotiation.expectedRange}</div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Market Context</label>
                    <p className="text-sm text-gray-700 mt-1">{insights.salaryNegotiation.marketInsights}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Negotiation Tactics</label>
                    <ul className="mt-2 space-y-2">
                      {insights.salaryNegotiation.negotiationTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                          <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Career Path Analytics */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Career Trajectory</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Projection</label>
                    <p className="text-sm text-gray-700 font-medium mt-1">{insights.careerPathAnalytics.currentPath}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Strategic Next Steps</label>
                    <div className="flex flex-col gap-2 mt-2">
                      {insights.careerPathAnalytics.nextSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="bg-purple-200 text-purple-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div>
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Target Future Roles</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {insights.careerPathAnalytics.futureRoles.map((role, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skill Gap Analysis */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Skill Gap Analysis</h3>
                </div>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <label className="text-xs font-bold text-green-700 uppercase">Strengths</label>
                      <ul className="space-y-1 mt-2">
                        {insights.skillGapAnalysis.currentStrengths.map((str, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-center gap-1.5 before:content-[''] before:block before:w-1 before:h-1 before:bg-green-500 before:rounded-full">{str}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                      <label className="text-xs font-bold text-red-700 uppercase">Missing Skills</label>
                      <ul className="space-y-1 mt-2">
                        {insights.skillGapAnalysis.missingSkills.map((skill, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-center gap-1.5 before:content-[''] before:block before:w-1 before:h-1 before:bg-red-500 before:rounded-full">{skill}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Learning Resources</label>
                    <div className="space-y-2">
                      {insights.skillGapAnalysis.learningResources.map((res, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                          <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="text-xs text-gray-700">{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}