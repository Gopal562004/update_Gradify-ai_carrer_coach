"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserCoverLetters } from "@/actions/coverletter";
import { ArrowLeft, Mail, Upload, FileText, Users, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BulkEmailToHR() {
  const router = useRouter();
  const [emails, setEmails] = useState("");
  const [selectedLetterId, setSelectedLetterId] = useState("");
  const [coverLetters, setCoverLetters] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLetters() {
      const data = await getUserCoverLetters();
      setCoverLetters(data);
    }
    loadLetters();
  }, []);

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target.result;
      const lines = text.split(/\r?\n/);
      const extractedEmails = lines
        .map((line) => line.trim())
        .filter((line) => /\S+@\S+\.\S+/.test(line));
      setEmails(extractedEmails.join(", "));
    };
    reader.readAsText(file);
  };

  const handleSend = async () => {
    if (!selectedLetterId || !emails) {
      alert("Please select a cover letter and enter at least one email.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/send-bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterId: selectedLetterId, emails }),
      });

      if (res.ok) {
        setStatus("✅ Emails sent successfully!");
      } else {
        const error = await res.text();
        setStatus(`❌ Failed: ${error}`);
      }
    } catch (err) {
      setStatus("❌ Error sending emails.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-black">
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Bulk Email Campaign
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Send your cover letter to multiple HR professionals
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Mail className="h-6 w-6 text-green-600" />
              Send to Multiple Recipients
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Choose a cover letter and send it to multiple HR contacts
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Select Cover Letter */}
            <div className="space-y-3">
              <Label
                htmlFor="coverLetter"
                className="text-sm font-semibold text-gray-900 flex items-center gap-2"
              >
                <FileText className="h-4 w-4 text-blue-600" />
                Select Cover Letter
              </Label>
              <Select
                value={selectedLetterId}
                onValueChange={setSelectedLetterId}
              >
                <SelectTrigger className="w-full border-gray-300 focus:border-blue-500">
                  <SelectValue placeholder="Choose a cover letter" />
                </SelectTrigger>
                <SelectContent>
                  {coverLetters.map((letter) => (
                    <SelectItem key={letter.id} value={letter.id}>
                      {letter.jobTitle} @ {letter.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CSV Upload */}
            <div className="space-y-3">
              <Label
                htmlFor="csvUpload"
                className="text-sm font-semibold text-gray-900 flex items-center gap-2"
              >
                <Upload className="h-4 w-4 text-purple-600" />
                Upload CSV File (Optional)
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-colors hover:border-purple-400">
                <input
                  id="csvUpload"
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
                <label htmlFor="csvUpload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {csvFile ? csvFile.name : "Click to upload CSV file"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Each line should contain one email address
                  </p>
                </label>
              </div>
            </div>

            {/* Manual Emails */}
            <div className="space-y-3">
              <Label
                htmlFor="emails"
                className="text-sm font-semibold text-gray-900"
              >
                Email Addresses
              </Label>
              <Textarea
                id="emails"
                placeholder="hr@company.com, recruiter@techcorp.com, hiring@startup.io"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="w-full min-h-[120px] border-gray-300 focus:border-blue-500 resize-vertical"
              />
              <p className="text-xs text-gray-500">
                Enter email addresses separated by commas.{" "}
                {emails.split(",").filter((e) => e.trim()).length} email(s)
                detected.
              </p>
            </div>

            {/* Send Button */}
            <div className="pt-4">
              <Button
                onClick={handleSend}
                disabled={loading || !selectedLetterId || !emails}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Emails...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="h-5 w-5" />
                    Send to {
                      emails.split(",").filter((e) => e.trim()).length
                    }{" "}
                    Recipient(s)
                  </span>
                )}
              </Button>
            </div>

            {/* Status Message */}
            {status && (
              <div
                className={`p-4 rounded-lg text-center ${
                  status.includes("✅")
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-rose-50 border border-rose-200 text-rose-700"
                }`}
              >
                <p className="font-medium">{status}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900 text-sm">
                  Best Practices
                </h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Verify email addresses before sending</li>
                  <li>
                    • Personalize the subject line for better response rates
                  </li>
                  <li>• Send during business hours for better visibility</li>
                  <li>• Follow up after 3-5 business days</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
