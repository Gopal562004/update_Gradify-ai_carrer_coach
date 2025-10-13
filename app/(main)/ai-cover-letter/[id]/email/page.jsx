"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCoverLetter } from "@/actions/coverletter";
import {
  ArrowLeft,
  Mail,
  Send,
  Building,
  Briefcase,
  Clock,
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

export default function SendEmailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [coverLetter, setCoverLetter] = useState(null);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLetter() {
      try {
        const data = await getCoverLetter(id);
        setCoverLetter(data);
        setSubject(`Application for ${data.jobTitle} at ${data.companyName}`);
        setMessage(data.content);
      } catch (error) {
        console.error("Failed to fetch cover letter:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLetter();
  }, [id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!to || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }

    setStatus("sending");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus("sent");
      setTo("");

      // Reset status after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      setStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Loading Cover Letter
            </h3>
            <p className="text-gray-600 text-sm">Preparing your email...</p>
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
              <Mail className="h-8 w-8 text-rose-600" />
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cover Letter
          </Button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Send className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Send Email
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Send your cover letter via email
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  Compose Email
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Send your cover letter for {coverLetter.jobTitle} at{" "}
                  {coverLetter.companyName}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSend} className="space-y-6">
                  {/* Recipient Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="to"
                      className="text-sm font-semibold text-gray-900"
                    >
                      Recipient Email
                    </Label>
                    <Input
                      id="to"
                      type="email"
                      placeholder="hr@company.com, hiring@techcorp.com"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="border-gray-300 focus:border-green-500"
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-sm font-semibold text-gray-900"
                    >
                      Subject Line
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="border-gray-300 focus:border-green-500"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-sm font-semibold text-gray-900"
                    >
                      Cover Letter Content
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[300px] border-gray-300 focus:border-green-500 resize-vertical text-black"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={
                      status === "sending" || !to || !subject || !message
                    }
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Email...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="h-5 w-5" />
                        Send Email
                      </span>
                    )}
                  </Button>

                  {/* Status Message */}
                  {status === "sent" && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                      <p className="text-emerald-700 font-semibold flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        Email sent successfully!
                      </p>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-center">
                      <p className="text-rose-700 font-semibold">
                        Failed to send email. Please try again.
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Job Information Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Job Details
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
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-blue-900">
                  Email Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Send during business hours (9 AM - 5 PM)</p>
                </div>
                <div className="flex items-start gap-2 text-sm text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Use a professional email signature</p>
                </div>
                <div className="flex items-start gap-2 text-sm text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Follow up in 3-5 business days if no response</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
