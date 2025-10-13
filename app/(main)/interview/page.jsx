// import { getAssessments } from "@/actions/interview";
// import StatsCards from "./_components/stats-cards";
// import PerformanceChart from "./_components/performance-chart";
// import QuizList from "./_components/quiz-list";

// export default async function InterviewPrepPage() {
//   const assessments = await getAssessments();

//   return (
//     <div className="w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 md:py-10 space-y-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
//         <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-title leading-tight">
//           Interview Preparation
//         </h1>
//       </div>

//       {/* Sections */}
//       <div className="space-y-6">
//         <StatsCards assessments={assessments} />
//         <PerformanceChart assessments={assessments} />
//         <QuizList assessments={assessments} />
//       </div>
//     </div>
//   );
// }
// InterviewPrepPage.jsx
import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performance-chart";
import QuizList from "./_components/quiz-list";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  return (
    <div className="w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Interview Preparation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Practice with AI-powered assessments and track your progress to ace your next interview
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}