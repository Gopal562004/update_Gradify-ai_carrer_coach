"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { checkAtsScoreFromText, getResumeWithAtsScore, getUserResume } from "@/actions/resume";
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
  Sparkles,
  ScanSearch,
} from "lucide-react";
import UpgradeModal from "@/components/UpgradeModal";

let pdfjsLib = null;

const CheckAtsScore = () => {
  const [score, setScore] = useState(null);
  const [logicScore, setLogicScore] = useState(null);
  const [aiScore, setAiScore] = useState(null);
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(false);
  const [currentResume, setCurrentResume] = useState(null);

  // Upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState(null);
  const [upgradePlan, setUpgradePlan] = useState(null);

  // Load current resume on mount
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

  // Parse UPGRADE_REQUIRED errors
  const handleError = (err) => {
    const msg = err.message || "";
    if (msg.startsWith("UPGRADE_REQUIRED:")) {
      const parts = msg.replace("UPGRADE_REQUIRED:", "").split("|");
      toast.error(parts[0] || "You've reached your limit. Please upgrade.");
      setUpgradeFeature(parts[1] || "atsCheck");
      setUpgradePlan(parts[2] || "FREE");
      setShowUpgradeModal(true);
      return true;
    }
    return false;
  };

  const extractTextFromPDF = async (file) => {
    if (!pdfjsLib) {
      // Import the library dynamically
      pdfjsLib = await import("pdfjs-dist/build/pdf");
      
      // Since Next.js and Webpack can complicate worker configuration, 
      // we can set up the worker to use standard unpkg URL for the exact version
      const pkgVersion = pdfjsLib.version;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pkgVersion}/build/pdf.worker.min.mjs`;
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

    toast.loading("Analyzing your resume...", { id: "ats-loading" });
    setLoading(true);

    try {
      const text = await extractTextFromPDF(file);
      const result = await checkAtsScoreFromText(text);

      setScore(result.score);
      setLogicScore(result.logicScore);
      setAiScore(result.aiScore);
      setMatchedKeywords(result.matchedKeywords || []);
      setSuggestions(result.suggestions || []);
      toast.success("ATS analysis complete!", { id: "ats-loading" });
    } catch (err) {
      console.error(err);
      if (!handleError(err)) {
        toast.error("Failed to analyze resume", { id: "ats-loading" });
      } else {
        toast.dismiss("ats-loading");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Check saved resume directly
  const handleCheckSavedResume = async () => {
    setCheckingSaved(true);
    toast.loading("Analyzing your saved resume...", { id: "ats-saved" });

    try {
      const resume = await getUserResume();
      // Build text from resume data
      const parts = [];
      if (resume.summary) parts.push(resume.summary);
      if (resume.skills?.length) parts.push("Skills: " + resume.skills.join(", "));
      if (resume.experience?.length) parts.push("Experience: " + resume.experience.join(" | "));
      if (resume.education?.length) parts.push("Education: " + resume.education.join(" | "));
      if (resume.projects?.length) parts.push("Projects: " + resume.projects.join(" | "));

      const text = parts.join("\n\n");
      if (!text.trim()) {
        toast.error("Your saved resume is empty. Please fill in the resume form first.", { id: "ats-saved" });
        return;
      }

      const result = await checkAtsScoreFromText(text);
      setScore(result.score);
      setLogicScore(result.logicScore);
      setAiScore(result.aiScore);
      setMatchedKeywords(result.matchedKeywords || []);
      setSuggestions(result.suggestions || []);
      toast.success("ATS analysis complete!", { id: "ats-saved" });
    } catch (err) {
      console.error(err);
      if (!handleError(err)) {
        toast.error("Failed to analyze resume", { id: "ats-saved" });
      } else {
        toast.dismiss("ats-saved");
      }
    } finally {
      setCheckingSaved(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const getScoreColor = (s) => {
    if (s >= 80) return "text-emerald-600";
    if (s >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreLevel = (s) => {
    if (s >= 80)
      return { text: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (s >= 60)
      return { text: "Good", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    if (s >= 40)
      return { text: "Fair", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    return { text: "Needs Improvement", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" };
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
            <h1 className="text-3xl font-bold text-gray-900">ATS Score Check</h1>
            <p className="text-gray-600 text-lg">
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
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-600" />
                Upload Resume for Analysis
              </CardTitle>
              <CardDescription className="text-gray-600">
                Upload your PDF resume or check your saved resume directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 cursor-pointer text-center transition-all duration-200 ${
                  isDragActive
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-300 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      or click to select a PDF file
                    </p>
                  </div>
                </div>
              </div>

              {/* Check Saved Resume Button */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <Button
                onClick={handleCheckSavedResume}
                disabled={checkingSaved || loading}
                variant="outline"
                className="w-full py-3 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold"
              >
                {checkingSaved ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    Analyzing saved resume...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ScanSearch className="h-4 w-4" />
                    Check Your Saved Resume
                  </span>
                )}
              </Button>

              {loading && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-blue-800 font-medium">
                      Analyzing your resume with AI...
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
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
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
                        className={`text-5xl font-bold ${getScoreColor(score)}`}
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
                    <div className="flex justify-center gap-6 text-sm text-gray-600">
                      <span>Keyword Match: <strong>{logicScore}%</strong></span>
                      <span>AI Evaluation: <strong>{aiScore}%</strong></span>
                    </div>
                  )}
                </div>

                {/* Matched Keywords */}
                {matchedKeywords.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Keywords Found ({matchedKeywords.length})
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
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-600" />
                      AI Improvement Suggestions
                    </h3>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
                        >
                          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm">{suggestion}</p>
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
          {currentResume && (
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Current Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Last Updated</span>
                  <span className="text-gray-800 text-sm font-medium">
                    {new Date(currentResume.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {currentResume.atsScore && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Current Score</span>
                    <span className={`text-sm font-medium ${getScoreColor(currentResume.atsScore)}`}>
                      {currentResume.atsScore}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-blue-900">
                ATS Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "Use standard section headings (Experience, Education, Skills)",
                "Include relevant keywords from job descriptions",
                "Avoid images, tables, and complex formatting",
                "Use common file formats (PDF, DOCX)",
                "Quantify achievements with numbers",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <p>{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Score Interpretation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              {[
                { color: "bg-emerald-500", label: "80-100%: Excellent match" },
                { color: "bg-amber-500", label: "60-79%: Good match" },
                { color: "bg-amber-400", label: "40-59%: Needs improvement" },
                { color: "bg-rose-500", label: "0-39%: Major improvements needed" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full`} />
                  <span>{item.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature}
        currentPlan={upgradePlan}
      />
    </div>
  );
};

export default CheckAtsScore;
