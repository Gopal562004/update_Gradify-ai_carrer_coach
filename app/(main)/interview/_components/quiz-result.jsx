"use client";

import {
  Trophy,
  CheckCircle2,
  XCircle,
  Star,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function QuizResult({
  result,
  hideStartNew = false,
  onStartNew,
}) {
  if (!result) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreLevel = (score) => {
    if (score >= 90)
      return {
        text: "Excellent",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    if (score >= 80)
      return {
        text: "Great",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    if (score >= 70)
      return {
        text: "Good",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    if (score >= 60)
      return {
        text: "Average",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    return {
      text: "Needs Improvement",
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
    };
  };

  const scoreLevel = getScoreLevel(result.quizScore);

  return (
    <div className="mx-auto bg-white px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Assessment Complete!
          </h1>
        </div>

        {/* Score Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div
                className={`text-4xl sm:text-5xl font-bold ${getScoreColor(
                  result.quizScore
                )}`}
              >
                {result.quizScore.toFixed(1)}%
              </div>
              <div
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium mt-2 ${scoreLevel.bg} ${scoreLevel.border} ${scoreLevel.color}`}
              >
                <Star className="h-3 w-3 fill-current" />
                {scoreLevel.text}
              </div>
            </div>
          </div>

          <Progress
            value={result.quizScore}
            className="w-full h-3 bg-gray-100"
          />
        </div>
      </div>

      {/* Improvement Tip */}
      {result.improvementTip && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900 text-lg">
              Improvement Tip
            </h3>
          </div>
          <p className="text-blue-800 leading-relaxed">
            {result.improvementTip}
          </p>
        </div>
      )}

      {/* Question Review */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-blue-600" />
          Question Review
        </h3>
        <div className="space-y-4">
          {result.questions.map((q, index) => (
            <div
              key={index}
              className={`border rounded-xl p-4 space-y-4 transition-all duration-200 ${
                q.isCorrect
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-rose-200 bg-rose-50/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        q.isCorrect
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <p className="font-medium text-gray-900 text-sm leading-relaxed">
                      {q.question}
                    </p>
                  </div>

                  <div className="ml-9 space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">
                        Your answer:{" "}
                      </span>
                      <span
                        className={`font-semibold ${
                          q.isCorrect ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {q.userAnswer}
                      </span>
                    </div>

                    {!q.isCorrect && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">
                          Correct answer:{" "}
                        </span>
                        <span className="font-semibold text-emerald-700">
                          {q.answer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {q.isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-rose-500" />
                  )}
                </div>
              </div>

              {q.explanation && (
                <div className="ml-9 bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                  <p className="font-medium text-gray-900 text-sm">
                    Explanation:
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Start New Button */}
      {!hideStartNew && (
        <CardFooter className="px-0 pt-4">
          <Button
            onClick={onStartNew}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start New Assessment
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
