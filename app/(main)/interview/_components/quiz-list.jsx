"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";
import { History, Plus, ArrowRight, Calendar, Target } from "lucide-react";

export default function QuizList({ assessments }) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <>
      <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <History className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Assessment History
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Review your past quiz performance and improvement tips
                </CardDescription>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              onClick={() => router.push("/interview/mock")}
            >
              <Plus className="h-4 w-4" />
              New Assessment
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {assessments?.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Assessments Yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Start your first assessment to track your progress and get
                personalized improvement tips.
              </p>
              <Button
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                onClick={() => router.push("/interview/mock")}
              >
                Take First Assessment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments?.map((assessment, i) => (
                <Card
                  key={assessment.id}
                  className="cursor-pointer border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                  onClick={() => setSelectedQuiz(assessment)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <span className="text-lg font-bold text-blue-600">
                            {i + 1}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            Assessment #{i + 1}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {format(
                              new Date(assessment.createdAt),
                              "MMM dd, yyyy 'at' HH:mm"
                            )}
                          </div>
                          {assessment.improvementTip && (
                            <p className="text-sm text-gray-600 max-w-2xl">
                              {assessment.improvementTip}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div
                          className={`px-3 py-1 rounded-full border text-sm font-medium ${getScoreBadge(
                            assessment.quizScore
                          )}`}
                        >
                          {assessment.quizScore.toFixed(1)}%
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiz result dialog */}
      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-4xl w-full max-h-[85vh] overflow-y-auto bg-white border-gray-200 shadow-xl">
          <DialogHeader className="pb-4 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Assessment Results
            </DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz}
            hideStartNew
            onStartNew={() => router.push("/interview/mock")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
