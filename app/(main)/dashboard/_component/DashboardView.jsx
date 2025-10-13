// "use client";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   BriefcaseIcon,
//   LineChart,
//   TrendingUp,
//   TrendingDown,
//   Brain,
// } from "lucide-react";
// import { format, formatDistanceToNow } from "date-fns";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";

// export default function DashboardView({ insights }) {
//   const getDemandLevelColor = (level) => {
//     switch (level.toLowerCase()) {
//       case "high":
//         return "bg-green-500";
//       case "medium":
//         return "bg-yellow-500";
//       case "low":
//         return "bg-red-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const getMarketOutlookInfo = (outlook) => {
//     switch (outlook.toLowerCase()) {
//       case "positive":
//         return { icon: TrendingUp, color: "text-green-500" };
//       case "neutral":
//         return { icon: LineChart, color: "text-yellow-500" };
//       case "negative":
//         return { icon: TrendingDown, color: "text-red-500" };
//       default:
//         return { icon: LineChart, color: "text-gray-500" };
//     }
//   };

//   const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
//   const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;
//   const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
//   const nextUpdateDistance = formatDistanceToNow(
//     new Date(insights.nextUpdate),
//     { addSuffix: true }
//   );

//   return (
//     <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
//           Industry Insights: {insights.industry}
//         </h1>
//         <Badge variant="outline" className="text-xs sm:text-sm">
//           Last updated: {lastUpdatedDate}
//         </Badge>
//       </div>

//       {/* Overview Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card>
//           <CardHeader className="flex flex-row justify-between">
//             <CardTitle className="text-sm">Market Outlook</CardTitle>
//             <OutlookIcon className={`h-5 w-5 ${outlookColor}`} />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{insights.marketOutlook}</div>
//             <p className="text-xs text-muted-foreground">
//               Next update {nextUpdateDistance}
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row justify-between">
//             <CardTitle className="text-sm">Industry Growth</CardTitle>
//             <TrendingUp className="h-5 w-5 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {insights.growthRate.toFixed(1)}%
//             </div>
//             <Progress value={insights.growthRate} className="mt-2" />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row justify-between">
//             <CardTitle className="text-sm">Demand Level</CardTitle>
//             <BriefcaseIcon className="h-5 w-5 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{insights.demandLevel}</div>
//             <div
//               className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
//                 insights.demandLevel
//               )}`}
//             />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row justify-between">
//             <CardTitle className="text-sm">Top Skills</CardTitle>
//             <Brain className="h-5 w-5 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-wrap gap-2">
//               {insights.topSkills.map((skill, i) => (
//                 <Badge
//                   key={i}
//                   variant="secondary"
//                   className="text-xs sm:text-sm"
//                 >
//                   {skill}
//                 </Badge>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Salary Chart */}
//       <Card>
//         <CardHeader>
//           <CardTitle>💼 Salary Ranges</CardTitle>
//           <CardDescription>
//             In thousands, based on roles in {insights.industry}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[300px] sm:h-[400px] overflow-x-auto">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={insights.salaryRanges}
//                 margin={{ left: 20, right: 20 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="role"
//                 />
//                 <YAxis />
//                 <Tooltip formatter={(value) => `${value} LPA`} />
//                 <Bar dataKey="min" fill="#3b82f6" name="Min" />
//                 <Bar dataKey="median" fill="#10b981" name="Median" />
//                 <Bar dataKey="max" fill="#ef4444" name="Max" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Trends and Skills */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>🌟 Key Trends</CardTitle>
//             <CardDescription>
//               What’s shaping the future of this industry
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2 list-disc list-inside text-sm sm:text-base">
//               {insights.keyTrends.map((trend, i) => (
//                 <li key={i}>{trend}</li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>📚 Recommended Skills</CardTitle>
//             <CardDescription>Upskill suggestions</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-wrap gap-2">
//               {insights.recommendedSkills.map((skill, i) => (
//                 <Badge key={i} variant="outline" className="text-xs sm:text-sm">
//                   {skill}
//                 </Badge>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import {
  BriefcaseIcon,
  TrendingUp,
  TrendingDown,
  Brain,
  Calendar,
  ArrowUpRight,
  Users,
  Target,
  Sparkles,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function IndustryInsightsDashboard({ insights }) {
  const getDemandLevelConfig = (level) => {
    const config = {
      high: {
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
      },
      medium: {
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      },
      low: {
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
      },
    };
    return config[level.toLowerCase()] || config.medium;
  };

  const getMarketOutlookConfig = (outlook) => {
    const config = {
      positive: {
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        icon: TrendingUp,
        gradient: "from-emerald-50 to-emerald-25",
      },
      neutral: {
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        icon: TrendingUp,
        gradient: "from-amber-50 to-amber-25",
      },
      negative: {
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        icon: TrendingDown,
        gradient: "from-rose-50 to-rose-25",
      },
    };
    return config[outlook.toLowerCase()] || config.neutral;
  };

  const marketOutlookConfig = getMarketOutlookConfig(insights.marketOutlook);
  const OutlookIcon = marketOutlookConfig.icon;
  const demandConfig = getDemandLevelConfig(insights.demandLevel);

  const lastUpdatedDate = format(
    new Date(insights.lastUpdated),
    "MMM dd, yyyy"
  );
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  // Custom tooltip for salary chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} LPA
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {insights.industry} Industry Insights
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Comprehensive market analysis and career opportunities
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Badge
                variant="secondary"
                className="px-4 py-2 bg-blue-50 text-blue-700 border-blue-200"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Updated: {lastUpdatedDate}
              </Badge>
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border">
                Next update: {nextUpdateDistance}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Market Outlook Card */}
          <Card
            className={`border-l-4 border-l-emerald-400 ${marketOutlookConfig.bgColor} hover:shadow-md transition-all duration-300`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Market Outlook
                </CardTitle>
                <OutlookIcon
                  className={`h-5 w-5 ${marketOutlookConfig.color}`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span
                  className={`text-2xl font-bold ${marketOutlookConfig.color}`}
                >
                  {insights.marketOutlook}
                </span>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Current industry sentiment
              </p>
            </CardContent>
          </Card>

          {/* Growth Rate Card */}
          <Card className="border-l-4 border-l-blue-400 bg-blue-50 hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Growth Rate
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {insights.growthRate.toFixed(1)}%
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    +2.1% YoY
                  </span>
                </div>
                <Progress
                  value={insights.growthRate}
                  className="h-2 bg-blue-100"
                />
                <p className="text-xs text-gray-600">
                  Annual growth projection
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demand Level Card */}
          <Card
            className={`border-l-4 ${demandConfig.borderColor} ${demandConfig.bgColor} hover:shadow-md transition-all duration-300`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Demand Level
                </CardTitle>
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-bold ${demandConfig.color}`}>
                  {insights.demandLevel}
                </span>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${demandConfig.color.replace(
                      "text",
                      "bg"
                    )}`}
                  />
                  <span className="text-xs text-gray-600">Active</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Current job market demand
              </p>
            </CardContent>
          </Card>

          {/* Top Skills Card */}
          <Card className="border-l-4 border-l-purple-400 bg-purple-50 hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Top Skills
                </CardTitle>
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {insights.topSkills.slice(0, 3).map((skill, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs bg-white text-purple-700 border-purple-200"
                  >
                    {skill}
                  </Badge>
                ))}
                {insights.topSkills.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-white">
                    +{insights.topSkills.length - 3} more
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Most sought-after skills
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Salary Ranges Chart */}
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Salary Ranges by Role
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Annual compensation in LPA (Lakhs Per Annum) across different
                  positions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={insights.salaryRanges}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  barSize={28}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="role"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis
                    label={{
                      value: "LPA (Lakhs Per Annum)",
                      angle: -90,
                      position: "insideLeft",
                      offset: -10,
                      style: { textAnchor: "middle", fontSize: 12 },
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                  <Bar
                    dataKey="min"
                    name="Minimum"
                    fill="#3b82f6"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="median"
                    name="Median"
                    fill="#10b981"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="max"
                    name="Maximum"
                    fill="#ef4444"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trends and Skills Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Trends Card */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Key Industry Trends
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Emerging patterns shaping the future
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.keyTrends.map((trend, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{trend}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Skills Card */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Recommended Skills
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    High-value skills for career advancement
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {insights.recommendedSkills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {skill}
                      </h4>
                      <p className="text-xs text-gray-500">High demand</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 text-center">
                  💡 <strong>Pro Tip:</strong> Focus on mastering 2-3 of these
                  skills to maximize your market value
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}