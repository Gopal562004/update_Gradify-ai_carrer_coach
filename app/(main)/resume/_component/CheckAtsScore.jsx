"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { checkAtsScoreFromText, getResumeWithAtsScore } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Upload,
  FileText,
  Target,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

let pdfjsLib = null; // will load only in browser

const CheckAtsScore = () => {
  const [score, setScore] = useState(null);
  const [logicScore, setLogicScore] = useState(null);
  const [aiScore, setAiScore] = useState(null);
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentResume, setCurrentResume] = useState(null);

  // Load current resume on component mount
  React.useEffect(() => {
    const loadCurrentResume = async () => {
      try {
        const resume = await getResumeWithAtsScore();
        setCurrentResume(resume);
        if (resume.atsScore) {
          setScore(resume.atsScore);
          setSuggestions(resume.feedback ? resume.feedback.split(" • ") : []);
        }
      } catch (error) {
        // Silent fail - user might not have a resume yet
      }
    };
    loadCurrentResume();
  }, []);

  const extractTextFromPDF = async (file) => {
    if (!pdfjsLib) {
      pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      fullText += strings.join(" ") + "\n";
    }

    return fullText;
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    toast.loading("Analyzing your resume...", { id: "loading" });
    setLoading(true);

    try {
      const text = await extractTextFromPDF(file);
      const result = await checkAtsScoreFromText(text);

      setScore(result.score);
      setLogicScore(result.logicScore);
      setAiScore(result.aiScore);
      setMatchedKeywords(result.matchedKeywords || []);
      setSuggestions(result.suggestions || []);
      toast.success("ATS analysis complete!", { id: "loading" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to analyze resume", { id: "loading" });
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreLevel = (score) => {
    if (score >= 80)
      return {
        text: "Excellent",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    if (score >= 60)
      return {
        text: "Good",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    if (score >= 40)
      return {
        text: "Fair",
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

  const scoreLevel = score ? getScoreLevel(score) : null;

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black">ATS Score Check</h1>
            <p className="text-black text-lg">
              Optimize your resume for applicant tracking systems
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Card */}
          <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-black flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-600" />
                Upload Resume for Analysis
              </CardTitle>
              <CardDescription className="text-black">
                Upload your PDF resume to check ATS compatibility and get
                improvement suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 cursor-pointer text-center transition-all duration-200 ${
                  isDragActive
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-300 bg-gray-50 hover:border-purple-300 hover:bg-purple-25"
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-black">
                      {isDragActive
                        ? "Drop your resume here"
                        : "Drag & drop your resume"}
                    </p>
                    <p className="text-black text-sm mt-1">
                      or click to select a PDF file
                    </p>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-800 font-medium">
                      Analyzing your resume content...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {score !== null && (
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-black flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div
                        className={`text-4xl sm:text-5xl font-bold ${getScoreColor(
                          score
                        )}`}
                      >
                        {score}%
                      </div>
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium mt-2 ${scoreLevel.bg} ${scoreLevel.border} ${scoreLevel.color}`}
                      >
                        <Target className="h-3 w-3" />
                        {scoreLevel.text}
                      </div>
                    </div>
                  </div>

                  <Progress value={score} className="w-full h-3 bg-gray-100" />

                  {logicScore !== null && aiScore !== null && (
                    <div className="flex justify-center gap-6 text-sm text-black">
                      <span>Keyword Match: {logicScore}%</span>
                      <span>AI Evaluation: {aiScore}%</span>
                    </div>
                  )}
                </div>

                {/* Matched Keywords */}
                {matchedKeywords.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-black flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Keywords Found
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {matchedKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-black flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-600" />
                      Improvement Suggestions
                    </h3>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
                        >
                          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-black text-sm">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Resume Status */}
          {currentResume && (
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Current Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-black text-sm">Last Updated</span>
                  <span className="text-black text-sm font-medium">
                    {new Date(currentResume.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {currentResume.atsScore && (
                  <div className="flex items-center justify-between">
                    <span className="text-black text-sm">Current Score</span>
                    <span
                      className={`text-sm font-medium ${getScoreColor(
                        currentResume.atsScore
                      )}`}
                    >
                      {currentResume.atsScore}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tips Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-blue-900">
                ATS Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-blue-800">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <p>
                  Use standard section headings (Experience, Education, Skills)
                </p>
              </div>
              <div className="flex items-start gap-2 text-sm text-blue-800">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <p>Include relevant keywords from job descriptions</p>
              </div>
              <div className="flex items-start gap-2 text-sm text-blue-800">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <p>Avoid images, tables, and complex formatting</p>
              </div>
              <div className="flex items-start gap-2 text-sm text-blue-800">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <p>Use common file formats (PDF, DOCX)</p>
              </div>
            </CardContent>
          </Card>

          {/* Score Guide */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-black">
                Score Interpretation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-black">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span>80-100%: Excellent match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span>60-79%: Good match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span>40-59%: Needs improvement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                <span>0-39%: Major improvements needed</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckAtsScore;
