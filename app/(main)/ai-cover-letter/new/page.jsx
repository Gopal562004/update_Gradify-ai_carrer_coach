"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateCoverLetter } from "@/actions/coverletter";
import {
  ArrowLeft,
  FileText,
  Building,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";

export default function NewCoverLetterPage() {
  const [form, setForm] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await toast.promise(generateCoverLetter(form), {
        loading: "✨ Generating your cover letter...",
        success: "✅ Cover letter generated successfully!",
        error: "❌ Failed to generate cover letter. Please try again.",
      });

      router.push(`/ai-cover-letter/${result.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 py-8 sm:px-6 lg:px-8 text-black">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Create Cover Letter
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Let AI craft a personalized cover letter for your dream job
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              Job Details
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Provide the job information and we'll generate a professional
              cover letter
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="jobTitle"
                  className="text-sm font-semibold text-gray-900 flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  required
                  placeholder="e.g. Senior Software Engineer, Product Manager, Marketing Specialist"
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  value={form.jobTitle}
                  onChange={(e) =>
                    setForm({ ...form, jobTitle: e.target.value })
                  }
                />
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="companyName"
                  className="text-sm font-semibold text-gray-900 flex items-center gap-2"
                >
                  <Building className="h-4 w-4 text-blue-600" />
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, Amazon"
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                />
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="jobDescription"
                  className="text-sm font-semibold text-gray-900"
                >
                  Job Description
                </Label>
                <Textarea
                  id="jobDescription"
                  required
                  placeholder="Paste the complete job description here. Include key responsibilities, requirements, and any specific qualifications mentioned..."
                  className="w-full min-h-[200px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-vertical transition-colors duration-200 text-black"
                  value={form.jobDescription}
                  onChange={(e) =>
                    setForm({ ...form, jobDescription: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  The more detailed the job description, the better tailored
                  your cover letter will be.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating Cover Letter...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Generate Cover Letter
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-blue-900 text-sm">Pro Tip</h4>
                <p className="text-blue-800 text-sm">
                  For best results, include specific skills, technologies, and
                  requirements from the job description. The AI will match your
                  qualifications to the job requirements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
