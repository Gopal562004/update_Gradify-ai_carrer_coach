"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import {
  Brain,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const correct = answers.reduce((acc, ans, i) => {
      return acc + (ans === quizData[i].correctAnswer ? 1 : 0);
    }, 0);
    const score = (correct / quizData.length) * 100;

    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Assessment completed successfully!");
    } catch (err) {
      toast.error("Failed to save assessment results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
  };

  if (generatingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Preparing Your Assessment
          </h3>
          <p className="text-gray-600 text-sm">
            Generating personalized questions...
          </p>
        </div>
        <BarLoader width={200} color="#3b82f6" />
      </div>
    );
  }

  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="mx-2 sm:mx-4 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Target className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Skills Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 text-lg leading-relaxed">
            Test your knowledge with industry-specific questions tailored to
            your career path.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>10-15 min</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>10 questions</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={generateQuizFn}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Assessment
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  return (
    <Card className="mx-2 sm:mx-4 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Progress Header */}
      <CardHeader className="pb-4 border-b border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="font-medium">
              Question {currentQuestion + 1} of {quizData.length}
            </span>
            <span className="font-semibold text-blue-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
            {question.question}
          </h3>

          <RadioGroup
            onValueChange={handleAnswer}
            value={answers[currentQuestion]}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  answers[currentQuestion] === option
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25"
                }`}
                onClick={() => handleAnswer(option)}
              >
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  className="text-blue-600 border-2"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="text-sm font-medium text-gray-900 cursor-pointer flex-1"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {showExplanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <p className="font-semibold text-blue-900 text-sm">Explanation</p>
            </div>
            <p className="text-blue-800 text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4">
        {!showExplanation ? (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Show Explanation
          </Button>
        ) : (
          <div className="w-full sm:w-auto" /> // Spacer for alignment
        )}

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {savingResult ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : currentQuestion < quizData.length - 1 ? (
            <>
              Next Question
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            "Finish Assessment"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
