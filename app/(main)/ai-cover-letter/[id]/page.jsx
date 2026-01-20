"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCoverLetter, updateCoverLetter } from "@/actions/coverletter";
import {
  ArrowLeft,
  Save,
  FileText,
  Tag,
  Edit3,
  Building,
  Briefcase,
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

export default function ViewCoverLetter() {
  const router = useRouter();
  const { id } = useParams();
  const [coverLetter, setCoverLetter] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCoverLetter(id);
        setCoverLetter(data);
        setTitle(data.title || "");
        setTags(data.tags || "");
        setContent(data.content || "");
      } catch (error) {
        console.error("Failed to fetch cover letter:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content fields.");
      return;
    }

    setStatus("saving");
    try {
      await updateCoverLetter({ id, title, tags, content });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Loading Cover Letter
            </h3>
            <p className="text-gray-600 text-sm">
              Getting your content ready...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!coverLetter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <Card className="bg-white border-gray-200 text-center py-8">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
              <FileText className="h-8 w-8 text-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cover Letter Not Found
              </h3>
              <p className="text-gray-600">
                The cover letter you're looking for doesn't exist.
              </p>
            </div>
            <Button
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
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

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Edit3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Edit Cover Letter
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Refine and customize your AI-generated cover letter
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-black">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Cover Letter Content
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Make changes to your cover letter content and formatting
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Cover Letter Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Software Engineer Application - John Doe"
                    className="border-gray-300 focus:border-blue-500 text-black"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label
                    htmlFor="tags"
                    className="text-sm font-semibold text-gray-900 flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4 text-purple-600" />
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., frontend, react, senior-level, remote"
                    className="border-gray-300 focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-500">
                    Separate tags with commas for better organization
                  </p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label
                    htmlFor="content"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Cover Letter Content
                  </Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your professional cover letter content here..."
                    className="min-h-[400px] border-gray-300 focus:border-blue-500 resize-vertical font-mono text-sm leading-relaxed text-black"
                  />
                  <p className="text-xs text-gray-500">
                    Tip: Use professional language and tailor the content to the
                    specific job
                  </p>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {status === "saving" && (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Saving changes...
                      </div>
                    )}
                    {status === "saved" && (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <Save className="h-4 w-4" />
                        Changes saved successfully!
                      </div>
                    )}
                    {status === "error" && (
                      <div className="flex items-center gap-2 text-rose-600">
                        Failed to save. Please try again.
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleUpdate}
                    disabled={
                      status === "saving" || !title.trim() || !content.trim()
                    }
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Information */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Job Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Position</p>
                  <p className="text-gray-900 font-semibold">
                    {coverLetter.jobTitle}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Company</p>
                  <p className="text-gray-900 font-semibold flex items-center gap-1">
                    <Building className="h-4 w-4 text-gray-500" />
                    {coverLetter.companyName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Created</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(coverLetter.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Editing Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-blue-900">
                  Editing Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Keep it concise - aim for 250-400 words</p>
                </div>
                <div className="flex items-start gap-2 text-sm text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Use specific examples from your experience</p>
                </div>
                <div className="flex items-start gap-2 text-sm text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Tailor content to the job description</p>
                </div>
                <div className="flex items-start gap-2 text-sm text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Include relevant keywords from the job posting</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
