"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserCoverLetters, deleteCoverLetter } from "@/actions/coverletter";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  Mail,
  FileText,
  Building,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CoverLetterDashboard() {
  const [letters, setLetters] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchLetters() {
      const result = await getUserCoverLetters();
      setLetters(result);
    }
    fetchLetters();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this cover letter?"
    );
    if (!confirmDelete) return;

    await deleteCoverLetter(id);
    setLetters((prev) => prev.filter((letter) => letter.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Cover Letters
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and track your professional cover letters
                </p>
              </div>
            </div>
            <Link href="/ai-cover-letter/new">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                New Cover Letter
              </Button>
            </Link>
          </div>
        </div>

        {/* Cover Letters Grid */}
        {letters.length === 0 ? (
          <Card className="text-center py-12 border-2 border-dashed border-gray-300 bg-white/50">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Cover Letters Yet
                </h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Create your first AI-powered cover letter to start your job
                  application journey.
                </p>
              </div>
              <Link href="/ai-cover-letter/new">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Cover Letter
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {letters.map((letter) => (
              <Card
                key={letter.id}
                className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {letter.jobTitle}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="h-4 w-4" />
                        <span className="line-clamp-1">
                          {letter.companyName}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(letter.id)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created {new Date(letter.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 pt-3">
                  <Link
                    href={`/ai-cover-letter/${letter.id}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Link
                    href={`/ai-cover-letter/${letter.id}/email`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Bulk Email Section */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Bulk Email Campaign
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Reach multiple recruiters efficiently with our bulk email tool
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Send your cover letters to multiple HR professionals and
              recruiters at once. Perfect for mass applications or networking
              campaigns.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Send to multiple recipients</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Track email delivery status</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Personalized email templates</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/ai-cover-letter/email" className="w-full">
              <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Mail className="h-4 w-4 mr-2" />
                Open Bulk Email Sender
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
