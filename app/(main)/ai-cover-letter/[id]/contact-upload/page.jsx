"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function UploadContactsPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        alert("Please upload a CSV or Excel file");
        return;
      }
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Simulate successful upload
      setUploadResult({
        success: true,
        message: "Contacts uploaded successfully!",
        stats: {
          total: 156,
          imported: 150,
          duplicates: 6,
          invalid: 0,
        },
      });
    } catch (error) {
      clearInterval(progressInterval);
      setUploadResult({
        success: false,
        message: "Failed to upload contacts. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

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
            Back
          </Button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Upload Contacts
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Import your contact list via CSV or Excel file
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Upload Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-purple-600" />
                  Upload Contact File
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Supported formats: CSV, XLS, XLSX
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-colors hover:border-purple-400">
                  <input
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-gray-900">
                        {file ? file.name : "Choose file or drag and drop"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {file
                          ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                          : "CSV or Excel files up to 10MB"}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress
                      value={uploadProgress}
                      className="h-2 bg-gray-100"
                    />
                  </div>
                )}

                {/* Upload Result */}
                {uploadResult && (
                  <div
                    className={`p-4 rounded-lg border ${
                      uploadResult.success
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {uploadResult.success ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-rose-600" />
                      )}
                      <div>
                        <p className="font-semibold">{uploadResult.message}</p>
                        {uploadResult.stats && (
                          <div className="text-sm mt-2 space-y-1">
                            <p>• Total contacts: {uploadResult.stats.total}</p>
                            <p>
                              • Successfully imported:{" "}
                              {uploadResult.stats.imported}
                            </p>
                            <p>
                              • Duplicates skipped:{" "}
                              {uploadResult.stats.duplicates}
                            </p>
                            <p>
                              • Invalid entries: {uploadResult.stats.invalid}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading Contacts...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload Contacts
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Instructions Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  File Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Maximum file size: 10MB
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Supported formats: CSV, XLS, XLSX
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Include: Name, Email, Company columns
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-blue-900">
                  Template Download
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 text-sm mb-4">
                  Download our template to ensure your file format is correct.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
