"use client";

import Link from "next/link";
import { ArrowLeft, Target, Brain, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";

export default function MockInterviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <Link href="/interview">
          <Button
            variant="outline"
            className="gap-2 pl-3 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation
          </Button>
        </Link>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                Skills Assessment
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Test your knowledge with industry-specific questions
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
            <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">
                  10 Questions
                </p>
                <p className="text-gray-600 text-xs">Industry-focused</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">
                  10-15 mins
                </p>
                <p className="text-gray-600 text-xs">Quick assessment</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-xl shadow-blue-500/10">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Target className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">
                  AI-Powered
                </p>
                <p className="text-gray-600 text-xs">Personalized feedback</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Component */}
      <div className="max-w-4xl mx-auto">
        <Quiz />
      </div>
    </div>
  );
}
