// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getUserCoverLetters, deleteCoverLetter } from "@/actions/coverletter";
// import {
//   ArrowLeft,
//   Plus,
//   Trash2,
//   Eye,
//   Mail,
//   FileText,
//   Building,
//   Calendar,
//   Users,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// export default function CoverLetterDashboard() {
//   const [letters, setLetters] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchLetters() {
//       const result = await getUserCoverLetters();
//       setLetters(result);
//     }
//     fetchLetters();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this cover letter?"
//     );
//     if (!confirmDelete) return;

//     await deleteCoverLetter(id);
//     setLetters((prev) => prev.filter((letter) => letter.id !== id));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <Button
//             variant="outline"
//             onClick={() => router.back()}
//             className="mb-6 border-gray-300 text-gray-700 hover:bg-gray-50"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </Button>

//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
//                 <FileText className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">
//                   Cover Letters
//                 </h1>
//                 <p className="text-gray-600 mt-1">
//                   Manage and track your professional cover letters
//                 </p>
//               </div>
//             </div>
//             <Link href="/ai-cover-letter/new">
//               <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
//                 <Plus className="h-4 w-4 mr-2" />
//                 New Cover Letter
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Cover Letters Grid */}
//         {letters.length === 0 ? (
//           <Card className="text-center py-12 border-2 border-dashed border-gray-300 bg-white/50">
//             <CardContent className="space-y-4">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
//                 <FileText className="h-8 w-8 text-gray-400" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   No Cover Letters Yet
//                 </h3>
//                 <p className="text-gray-600 max-w-sm mx-auto">
//                   Create your first AI-powered cover letter to start your job
//                   application journey.
//                 </p>
//               </div>
//               <Link href="/ai-cover-letter/new">
//                 <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white mt-4">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Create First Cover Letter
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//             {letters.map((letter) => (
//               <Card
//                 key={letter.id}
//                 className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
//               >
//                 <CardHeader className="pb-3">
//                   <div className="flex justify-between items-start">
//                     <div className="space-y-2 flex-1">
//                       <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
//                         {letter.jobTitle}
//                       </CardTitle>
//                       <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <Building className="h-4 w-4" />
//                         <span className="line-clamp-1">
//                           {letter.companyName}
//                         </span>
//                       </div>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleDelete(letter.id)}
//                       className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="pb-3">
//                   <div className="flex items-center gap-2 text-sm text-gray-500">
//                     <Calendar className="h-4 w-4" />
//                     <span>
//                       Created {new Date(letter.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </CardContent>
//                 <CardFooter className="flex gap-2 pt-3">
//                   <Link
//                     href={`/ai-cover-letter/${letter.id}`}
//                     className="flex-1"
//                   >
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
//                     >
//                       <Eye className="h-4 w-4 mr-2" />
//                       View
//                     </Button>
//                   </Link>
//                   <Link
//                     href={`/ai-cover-letter/${letter.id}/email`}
//                     className="flex-1"
//                   >
//                     <Button
//                       size="sm"
//                       className="w-full bg-green-600 hover:bg-green-700 text-white"
//                     >
//                       <Mail className="h-4 w-4 mr-2" />
//                       Email
//                     </Button>
//                   </Link>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         )}

//         {/* Bulk Email Section */}
//         <Card className="bg-white border-gray-200 shadow-sm">
//           <CardHeader className="pb-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <Users className="h-5 w-5 text-green-600" />
//               </div>
//               <div>
//                 <CardTitle className="text-xl font-bold text-gray-900">
//                   Bulk Email Campaign
//                 </CardTitle>
//                 <CardDescription className="text-gray-600">
//                   Reach multiple recruiters efficiently with our bulk email tool
//                 </CardDescription>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-700 mb-4">
//               Send your cover letters to multiple HR professionals and
//               recruiters at once. Perfect for mass applications or networking
//               campaigns.
//             </p>
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//               <span>Send to multiple recipients</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
//               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//               <span>Track email delivery status</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
//               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//               <span>Personalized email templates</span>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Link href="/ai-cover-letter/email" className="w-full">
//               <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
//                 <Mail className="h-4 w-4 mr-2" />
//                 Open Bulk Email Sender
//               </Button>
//             </Link>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }
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
  BarChart3,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  History,
  MoreVertical,
  ChevronDown,
  ChevronUp,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CoverLetterDashboard() {
  const [letters, setLetters] = useState([]);
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchLetters() {
      const result = await getUserCoverLetters();
      setLetters(result);
    }
    fetchLetters();
    fetchRecentCampaigns();
  }, []);

  async function fetchRecentCampaigns() {
    setLoadingCampaigns(true);
    try {
      const response = await fetch("/api/campaigns");
      if (response.ok) {
        const data = await response.json();
        // Sort by most recent
        const sorted = (data.campaigns || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentCampaigns(sorted);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoadingCampaigns(false);
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this cover letter?"
    );
    if (!confirmDelete) return;

    await deleteCoverLetter(id);
    setLetters((prev) => prev.filter((letter) => letter.id !== id));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case "FAILED":
        return <XCircle className="h-3 w-3 text-red-600" />;
      case "PROCESSING":
        return <Clock className="h-3 w-3 text-blue-600" />;
      case "PENDING":
        return <Clock className="h-3 w-3 text-amber-600" />;
      default:
        return <Clock className="h-3 w-3 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "FAILED":
        return "destructive";
      case "PROCESSING":
        return "secondary";
      case "PENDING":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayedCampaigns = showAllCampaigns
    ? recentCampaigns
    : recentCampaigns.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/ai-cover-letter/campaigns")}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                All Campaigns
              </Button>
            </div>
          </div>

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

        {/* Cover Letters at Top */}
        {letters.length === 0 ? (
          <Card className="mb-6 text-center py-8 border-2 border-dashed border-gray-300 bg-white/50 shadow-sm">
            <CardContent className="space-y-4">
              <FileText className="h-12 w-12 text-gray-300 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Cover Letters Yet
                </h3>
                <p className="text-gray-600">
                  Create your first AI-powered cover letter to get started
                </p>
              </div>
              <Link href="/ai-cover-letter/new">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Letter
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Cover Letters
              </h2>
              <div className="text-sm text-gray-600">
                {letters.length} cover letter{letters.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {letters.map((letter) => (
                <Card
                  key={letter.id}
                  className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {letter.jobTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="h-4 w-4" />
                          <span className="line-clamp-1">
                            {letter.companyName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Created{" "}
                            {new Date(letter.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/ai-cover-letter/${letter.id}`)
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/ai-cover-letter/${letter.id}/email`)
                            }
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(letter.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex gap-2">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Campaigns - Concise List */}
        <div className="mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-gray-600" />
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Recent Campaign History
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Latest email campaign activities
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {recentCampaigns.length} total
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {loadingCampaigns ? (
                <div className="py-8 text-center">
                  <Clock className="h-6 w-6 text-gray-400 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading campaigns...</p>
                </div>
              ) : recentCampaigns.length === 0 ? (
                <div className="py-8 text-center">
                  <Send className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No campaigns yet</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Create your first email campaign to see history here
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {displayedCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() =>
                        router.push(`/ai-cover-letter/campaigns/${campaign.id}`)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          {/* Campaign Info Line */}
                          <div className="flex items-center gap-2 mb-1">
                            {campaign.type === "BULK" ? (
                              <Users className="h-3 w-3 text-blue-600 flex-shrink-0" />
                            ) : (
                              <Send className="h-3 w-3 text-purple-600 flex-shrink-0" />
                            )}
                            <Badge
                              variant={getStatusBadge(campaign.status)}
                              className="text-xs py-0 h-5"
                            >
                              <span className="flex items-center gap-1">
                                {getStatusIcon(campaign.status)}
                                {campaign.status}
                              </span>
                            </Badge>
                            <span className="text-sm font-medium text-gray-800 truncate">
                              {campaign.title?.substring(0, 40) ||
                                `${
                                  campaign.type === "BULK" ? "Bulk" : "Single"
                                } Campaign`}
                              {campaign.title?.length > 40 && "..."}
                            </span>
                          </div>

                          {/* Stats Line */}
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDateShort(campaign.startedAt)}</span>
                              <span className="text-gray-400">•</span>
                              <span>{formatTime(campaign.startedAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <span className="text-gray-700">
                                {campaign.totalEmails || 0}
                              </span>
                              <span className="text-gray-500">emails</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <span className="text-green-600 font-medium">
                                {campaign.sentCount || 0}
                              </span>
                              <span className="text-gray-500">sent</span>
                            </div>
                            {campaign.failedCount > 0 && (
                              <div className="flex items-center gap-1">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span className="text-red-600 font-medium">
                                  {campaign.failedCount}
                                </span>
                                <span className="text-gray-500">failed</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 ml-auto">
                              <div className="text-xs text-gray-700 font-medium">
                                {campaign.progress || 0}%
                              </div>
                              <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${campaign.progress || 0}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Subject Line */}
                          {campaign.subject && (
                            <div className="text-xs text-gray-500 truncate mt-1">
                              {campaign.subject}
                            </div>
                          )}
                        </div>

                        <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            {recentCampaigns.length > 3 && (
              <CardFooter className="border-t border-gray-200 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllCampaigns(!showAllCampaigns)}
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {showAllCampaigns ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Show More ({recentCampaigns.length - 3} more campaigns)
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Bulk Email Card */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Bulk Email
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Send to multiple recipients
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Send your cover letters to multiple HR professionals and
                recruiters at once.
              </p>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Multiple recipients</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Track delivery status</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Personalized templates</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/ai-cover-letter/email" className="w-full">
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                  <Mail className="h-4 w-4 mr-2 cursor-pointer" />
                  Start Campaign
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Campaign Stats */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Campaign Stats
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Performance overview
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Campaigns</span>
                  <span className="font-bold text-gray-800">
                    {recentCampaigns.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-bold text-green-700">
                    {
                      recentCampaigns.filter((c) => c.status === "COMPLETED")
                        .length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-bold text-blue-700">
                    {
                      recentCampaigns.filter(
                        (c) =>
                          c.status === "PROCESSING" || c.status === "PENDING"
                      ).length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Total Emails Sent
                  </span>
                  <span className="font-bold text-gray-800">
                    {recentCampaigns.reduce(
                      (sum, c) => sum + (c.sentCount || 0),
                      0
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => router.push("/ai-cover-letter/campaigns")}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-gray-600">
                Get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                onClick={() => router.push("/ai-cover-letter/new")}
                className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Cover Letter
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/ai-cover-letter/campaigns")}
                className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <History className="h-4 w-4 mr-2" />
                View All Campaigns
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/ai-cover-letter/email")}
                className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Send className="h-4 w-4 mr-2" />
                Email Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Need help getting started? Check out our documentation or contact
            support.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push("/ai-cover-letter/campaigns")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Campaign Analytics
            </Button>
            <Link href="/ai-cover-letter/new">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Letter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}