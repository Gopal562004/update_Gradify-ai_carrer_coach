import {
  Brain,
  Target,
  Trophy,
  TrendingUp,
  BarChart3,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCards({ assessments }) {
  const getAverageScore = () => {
    if (!assessments?.length) return 0;
    const total = assessments.reduce(
      (sum, assessment) => sum + assessment.quizScore,
      0
    );
    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[assessments.length - 1];
  };

  const getTotalQuestions = () => {
    if (!assessments?.length) return 0;
    return assessments.reduce(
      (sum, assessment) => sum + assessment.questions.length,
      0
    );
  };

  const getImprovement = () => {
    if (!assessments?.length || assessments.length < 2) return 0;
    const firstScore = assessments[0].quizScore;
    const latestScore = assessments[assessments.length - 1].quizScore;
    return (latestScore - firstScore).toFixed(1);
  };

  const stats = [
    {
      title: "Average Score",
      value: `${getAverageScore()}%`,
      description: "Across all assessments",
      icon: Trophy,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Questions Practiced",
      value: getTotalQuestions().toLocaleString(),
      description: "Total questions answered",
      icon: Brain,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Latest Score",
      value: `${getLatestAssessment()?.quizScore.toFixed(1) || 0}%`,
      description: "Most recent assessment",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Performance Trend",
      value: `${getImprovement()}%`,
      description: "Since first assessment",
      icon: TrendingUp,
      color: getImprovement() >= 0 ? "text-emerald-600" : "text-rose-600",
      bgColor: getImprovement() >= 0 ? "bg-emerald-50" : "bg-rose-50",
      borderColor:
        getImprovement() >= 0 ? "border-emerald-200" : "border-rose-200",
    },
    {
      title: "Total Assessments",
      value: assessments?.length || 0,
      description: "Practice sessions completed",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Avg. Time",
      value: "12min",
      description: "Per assessment",
      icon: Clock,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`w-full border-2 ${stat.borderColor} bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
                {stat.title.includes("Trend") && getImprovement() >= 0 && " ↗"}
                {stat.title.includes("Trend") && getImprovement() < 0 && " ↘"}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
