"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Building,
  Download,
  RefreshCw,
  Copy,
  ExternalLink,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  BarChart3,
  User,
  Hash,
  Target,
  Globe,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState(null);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedIds, setCopiedIds] = useState({});
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  async function fetchCampaign() {
    setLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data.campaign);
        setEmailLogs(data.emailLogs || []);
      } else {
        toast.error("Failed to fetch campaign details");
      }
    } catch (error) {
      console.error("Error fetching campaign:", error);
      toast.error("Error loading campaign details");
    } finally {
      setLoading(false);
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "SENT":
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SENT":
      case "COMPLETED":
        return "default";
      case "FAILED":
        return "destructive";
      case "PENDING":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getCampaignTypeIcon = (type) => {
    switch (type) {
      case "BULK":
        return <Users className="h-4 w-4" />;
      case "SINGLE":
        return <Mail className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedIds((prev) => ({ ...prev, [id]: true }));
    toast.success("Copied to clipboard!");

    // Reset the tick icon after 1.5 seconds
    setTimeout(() => {
      setCopiedIds((prev) => ({ ...prev, [id]: false }));
    }, 1500);
  };

  const exportToCSV = () => {
    if (emailLogs.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      // Prepare CSV headers
      const headers = [
        "Email",
        "Name",
        "Status",
        "Sent At",
        "Processing Time (ms)",
        "Error",
      ];

      // Prepare CSV rows
      const rows = emailLogs.map((log) => [
        `"${log.toEmail}"`,
        `"${log.toName || ""}"`,
        `"${log.status}"`,
        `"${formatDate(log.sentAt || log.createdAt)}"`,
        log.processingTimeMs || "N/A",
        `"${log.errorMessage || ""}"`,
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `campaign-${campaign.id.substring(0, 8)}-emails.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("CSV exported successfully!");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export CSV");
    }
  };

  const exportAnalyticsToPDF = () => {
    toast.info("PDF export feature coming soon!");
  };

  const paginatedLogs = emailLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(emailLogs.length / itemsPerPage);

  const getDomainFromEmail = (email) => {
    if (!email) return "Unknown";
    const parts = email.split("@");
    return parts.length > 1 ? parts[1] : "Unknown";
  };

  const getEmailStats = () => {
    const domains = {};
    emailLogs.forEach((log) => {
      const domain = getDomainFromEmail(log.toEmail);
      domains[domain] = (domains[domain] || 0) + 1;
    });

    const sent = emailLogs.filter((log) => log.status === "SENT").length;
    const failed = emailLogs.filter((log) => log.status === "FAILED").length;
    const pending = emailLogs.filter((log) => log.status === "PENDING").length;

    return {
      sent,
      failed,
      pending,
      successRate:
        emailLogs.length > 0 ? Math.round((sent / emailLogs.length) * 100) : 0,
      topDomains: Object.entries(domains)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    };
  };

  const emailStats = getEmailStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Loading Campaign Details
                </h3>
                <p className="text-gray-600 text-sm">
                  Fetching campaign data...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Campaign Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The campaign you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Button
              onClick={() => router.push("/ai-cover-letter/campaigns")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/ai-cover-letter/campaigns")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={fetchCampaign}
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              {campaign.coverLetterId && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/ai-cover-letter/${campaign.coverLetterId}`)
                  }
                  className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm cursor-pointer"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Cover Letter
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                {getCampaignTypeIcon(campaign.type)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {campaign.title ||
                      `${
                        campaign.type === "BULK" ? "Bulk" : "Single"
                      } Campaign`}
                  </h1>
                  <Badge
                    variant={getStatusBadge(campaign.status)}
                    className="shadow-sm cursor-default"
                  >
                    <span className="flex items-center gap-1 text-gray-800">
                      {getStatusIcon(campaign.status)}
                      {campaign.status}
                    </span>
                  </Badge>
                </div>
                <p className="text-gray-600">
                  Campaign ID: {campaign.id.substring(0, 8)}...
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(campaign.id, "campaign-id")}
                    className="ml-2 h-6 px-2 text-gray-700 hover:text-gray-900 cursor-pointer"
                  >
                    {copiedIds["campaign-id"] ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex items-center justify-start mb-8 bg-white p-1 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-300 text-gray-700 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 rounded-md cursor-pointer"
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="emails"
              className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-300 text-gray-700 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 rounded-md cursor-pointer"
            >
              <Mail className="h-4 w-4" />
              <span className="whitespace-nowrap">
                Emails ({emailLogs.length})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-300 text-gray-700 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 rounded-md cursor-pointer"
            >
              <Target className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-300 text-gray-700 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 rounded-md cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Stats */}
              <div className="lg:col-span-2 space-y-6">
                {/* Progress Card */}
                <Card className="shadow-sm border border-gray-200 bg-white">
                  <CardHeader className="border-b border-gray-200 pb-4">
                    <CardTitle className="text-gray-800">
                      Campaign Progress
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {campaign.status === "PROCESSING"
                        ? "Campaign is currently in progress"
                        : `Campaign ${campaign.status.toLowerCase()} on ${formatDate(
                            campaign.completedAt || campaign.updatedAt
                          )}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Progress</span>
                        <span className="font-medium text-gray-800">
                          {campaign.progress}%
                        </span>
                      </div>
                      <Progress value={campaign.progress} className="h-3" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-gray-800">
                          {campaign.totalEmails}
                        </div>
                        <div className="text-sm text-gray-600">Total</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-700">
                          {campaign.sentCount}
                        </div>
                        <div className="text-sm text-green-600">Sent</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-700">
                          {campaign.failedCount}
                        </div>
                        <div className="text-sm text-red-600">Failed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Campaign Info Card */}
                <Card className="shadow-sm border border-gray-200 bg-white">
                  <CardHeader className="border-b border-gray-200 pb-4">
                    <CardTitle className="text-gray-800">
                      Campaign Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">
                          Campaign Type
                        </div>
                        <div className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                          {getCampaignTypeIcon(campaign.type)}
                          {campaign.type} EMAIL
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Subject</div>
                        <div className="font-medium text-gray-800 truncate mt-1">
                          {campaign.subject || "No subject"}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Started</div>
                        <div className="font-medium text-gray-800 mt-1">
                          {formatDate(campaign.startedAt)}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">
                          {campaign.status === "COMPLETED"
                            ? "Completed"
                            : "Last Updated"}
                        </div>
                        <div className="font-medium text-gray-800 mt-1">
                          {formatDate(
                            campaign.completedAt || campaign.updatedAt
                          )}
                        </div>
                      </div>
                    </div>

                    {campaign.coverLetter && (
                      <div
                        className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() =>
                          router.push(
                            `/ai-cover-letter/${campaign.coverLetterId}`
                          )
                        }
                      >
                        <div className="text-sm text-blue-700">
                          Cover Letter
                        </div>
                        <div className="font-medium text-blue-800 mt-1">
                          {campaign.coverLetter.jobTitle} @{" "}
                          {campaign.coverLetter.companyName}
                        </div>
                      </div>
                    )}

                    {campaign.errorMessage && (
                      <Alert
                        variant="destructive"
                        className="mt-4 border border-red-300 cursor-default"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-white">
                          {campaign.errorMessage}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Quick Stats */}
              <div className="space-y-6">
                {/* Email Stats Card */}
                <Card className="shadow-sm border border-gray-200 bg-white">
                  <CardHeader className="border-b border-gray-200 pb-4">
                    <CardTitle className="text-gray-800">
                      Email Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-700">
                          Success Rate
                        </div>
                        <div className="text-lg font-bold text-green-700">
                          {emailStats.successRate}%
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-700">
                          Average Send Time
                        </div>
                        <div className="font-medium text-gray-800">
                          {emailLogs.length > 0
                            ? `${Math.round(
                                emailLogs.reduce(
                                  (acc, log) =>
                                    acc + (log.processingTimeMs || 0),
                                  0
                                ) / emailLogs.length
                              )}ms`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card className="shadow-sm border border-gray-200 bg-white">
                  <CardHeader className="border-b border-gray-200 pb-4">
                    <CardTitle className="text-gray-800">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-6">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400 shadow-sm bg-white cursor-pointer"
                      onClick={() =>
                        copyToClipboard(campaign.id, "campaign-id-action")
                      }
                    >
                      {copiedIds["campaign-id-action"] ? (
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Copy Campaign ID
                    </Button>
                    {campaign.coverLetterId && (
                      <Button
                        variant="outline"
                        className="w-full justify-start text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400 shadow-sm bg-white cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/ai-cover-letter/${campaign.coverLetterId}`
                          )
                        }
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Cover Letter
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400 shadow-sm bg-white cursor-pointer"
                      onClick={() => setActiveTab("emails")}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      View All Emails
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Emails Tab */}
          <TabsContent value="emails" className="space-y-6">
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardHeader className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-800">Email Logs</CardTitle>
                    <CardDescription className="text-gray-600">
                      {emailLogs.length} emails sent in this campaign
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={exportToCSV}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {emailLogs.length === 0 ? (
                  <div className="text-center py-12 border-t border-gray-200 mt-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      No Email Logs
                    </h4>
                    <p className="text-gray-600">
                      No emails have been sent in this campaign yet.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border border-gray-200 shadow-sm overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50 border-b border-gray-200">
                          <TableRow>
                            <TableHead className="text-gray-700 font-semibold">
                              Recipient
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold">
                              Status
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold">
                              Sent At
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold">
                              Time
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedLogs.map((log) => (
                            <TableRow
                              key={log.id}
                              className="hover:bg-gray-50/50 border-b border-gray-200 last:border-b-0 cursor-pointer"
                            >
                              <TableCell>
                                <div className="font-medium text-gray-800">
                                  {log.toEmail}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {log.toName || "No name"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={getStatusBadge(log.status)}
                                  className="flex items-center gap-1 w-fit shadow-sm text-gray-700 cursor-default"
                                >
                                  {getStatusIcon(log.status)}
                                  {log.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-gray-700">
                                  {formatDate(log.sentAt || log.createdAt)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-gray-700">
                                  {log.processingTimeMs
                                    ? `${log.processingTimeMs}ms`
                                    : "N/A"}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(
                                      log.toEmail,
                                      `email-${log.id}`
                                    );
                                  }}
                                  className="text-gray-600 hover:text-gray-900 border border-gray-300 shadow-sm cursor-pointer"
                                >
                                  {copiedIds[`email-${log.id}`] ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-700">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                            onClick={() =>
                              setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={currentPage === totalPages}
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Campaign Analytics
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                onClick={exportAnalyticsToPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Email Status Distribution */}
              <Card className="shadow-sm border border-gray-200 bg-white">
                <CardHeader className="border-b border-gray-200 pb-4">
                  <CardTitle className="text-gray-800">
                    Email Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
                      {
                        label: "Sent",
                        value: emailStats.sent,
                        color: "bg-green-500",
                        progressColor: "bg-green-600",
                        textColor: "text-green-700",
                        bgColor: "bg-green-50",
                        borderColor: "border-green-200",
                      },
                      {
                        label: "Failed",
                        value: emailStats.failed,
                        color: "bg-red-500",
                        progressColor: "bg-red-600",
                        textColor: "text-red-700",
                        bgColor: "bg-red-50",
                        borderColor: "border-red-200",
                      },
                      {
                        label: "Pending",
                        value: emailStats.pending,
                        color: "bg-amber-500",
                        progressColor: "bg-amber-600",
                        textColor: "text-amber-700",
                        bgColor: "bg-amber-50",
                        borderColor: "border-amber-200",
                      },
                    ].map((item) => {
                      const percentage =
                        emailLogs.length > 0
                          ? Math.round((item.value / emailLogs.length) * 100)
                          : 0;

                      return (
                        <div
                          key={item.label}
                          className="space-y-2 cursor-default"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${item.color} border border-gray-300`}
                              ></div>
                              <span
                                className={`text-sm font-medium ${item.textColor}`}
                              >
                                {item.label}
                              </span>
                            </div>
                            <div className="text-sm text-gray-700">
                              {item.value} ({percentage}%)
                            </div>
                          </div>

                          {/* Progress Bar Container */}
                          <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                            {/* Progress Fill */}
                            <div
                              className={`h-full ${item.progressColor} rounded-full transition-all duration-300 ease-out`}
                              style={{ width: `${percentage}%` }}
                            ></div>

                            {/* Optional: Show percentage text inside bar for small percentages */}
                            {percentage < 15 && percentage > 0 && (
                              <div className="absolute inset-0 flex items-center justify-start pl-2">
                                <span className="text-xs font-medium text-white">
                                  {percentage}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary stats */}
                  {emailLogs.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Emails:</span>
                        <span className="font-medium text-gray-800">
                          {emailLogs.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="font-medium text-green-700">
                          {emailStats.successRate}%
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Domains */}
              <Card className="shadow-sm border border-gray-200 bg-white">
                <CardHeader className="border-b border-gray-200 pb-4">
                  <CardTitle className="text-gray-800">
                    Top Email Domains
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Most common email domains in this campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {emailStats.topDomains.length > 0 ? (
                      emailStats.topDomains.map(([domain, count], index) => (
                        <div
                          key={domain}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-200 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-800">
                              {domain}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              {count} emails
                            </div>
                            <div className="w-20 bg-gray-200 rounded-full h-2 border border-gray-300">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${(count / emailLogs.length) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-600 border-t border-gray-200 mt-2 cursor-default">
                        No domain data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardHeader className="border-b border-gray-200 pb-4">
                <CardTitle className="text-gray-800">
                  Campaign Details
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Complete information about this campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-default">
                      <div className="text-sm text-gray-600">Campaign ID</div>
                      <div className="font-mono text-sm text-gray-800 mt-1">
                        {campaign.id}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-default">
                      <div className="text-sm text-gray-600">Type</div>
                      <div className="font-medium text-gray-800 mt-1">
                        {campaign.type}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-default">
                      <div className="text-sm text-gray-600">Status</div>
                      <div className="font-medium text-gray-800 mt-1">
                        {campaign.status}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-default">
                      <div className="text-sm text-gray-600">
                        Rate Limit Delay
                      </div>
                      <div className="font-medium text-gray-800 mt-1">
                        {campaign.rateLimitDelay || 2000}ms
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-default">
                      <div className="text-sm text-gray-600">Created</div>
                      <div className="font-medium text-gray-800 mt-1">
                        {formatDate(campaign.createdAt)}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-default">
                      <div className="text-sm text-gray-600">Last Updated</div>
                      <div className="font-medium text-gray-800 mt-1">
                        {formatDate(campaign.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Content Preview */}
                {campaign.content && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Email Content Preview
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-text">
                      <div className="text-sm text-gray-800 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                        {campaign.content.substring(0, 1000)}
                        {campaign.content.length > 1000 && "..."}
                      </div>
                    </div>
                  </div>
                )}

                {/* Technical Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Technical Details
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-text">
                    <pre className="text-sm text-gray-800 overflow-x-auto">
                      {JSON.stringify(
                        {
                          id: campaign.id,
                          userId: campaign.userId,
                          type: campaign.type,
                          status: campaign.status,
                          totalEmails: campaign.totalEmails,
                          sentCount: campaign.sentCount,
                          failedCount: campaign.failedCount,
                          coverLetterId: campaign.coverLetterId,
                          createdAt: campaign.createdAt,
                          updatedAt: campaign.updatedAt,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}