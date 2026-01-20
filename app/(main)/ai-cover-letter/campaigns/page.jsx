// // "use client";

// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import {
// //   ArrowLeft,
// //   RefreshCw,
// //   Filter,
// //   Search,
// //   Mail,
// //   Users,
// //   Calendar,
// //   CheckCircle,
// //   XCircle,
// //   Clock,
// //   FileText,
// //   ChevronRight,
// //   BarChart3,
// //   Download,
// //   Eye,
// //   MoreVertical,
// //   Send,
// //   Copy,
// //   ChevronLeft,
// //   ChevronRight as ChevronRightIcon,
// //   Hash,
// //   ExternalLink,
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { Progress } from "@/components/ui/progress";
// // import { Input } from "@/components/ui/input";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";

// // export default function CampaignsPage() {
// //   const router = useRouter();
// //   const [campaigns, setCampaigns] = useState([]);
// //   const [filteredCampaigns, setFilteredCampaigns] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [statusFilter, setStatusFilter] = useState("ALL");
// //   const [typeFilter, setTypeFilter] = useState("ALL");
// //   const [sortBy, setSortBy] = useState("newest");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 8;

// //   useEffect(() => {
// //     fetchCampaigns();
// //   }, []);

// //   useEffect(() => {
// //     filterAndSortCampaigns();
// //     setCurrentPage(1);
// //   }, [campaigns, searchTerm, statusFilter, typeFilter, sortBy]);

// //   async function fetchCampaigns() {
// //     setLoading(true);
// //     try {
// //       const response = await fetch("/api/campaigns");
// //       if (response.ok) {
// //         const data = await response.json();
// //         setCampaigns(data.campaigns || []);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching campaigns:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   function filterAndSortCampaigns() {
// //     let filtered = [...campaigns];

// //     if (searchTerm) {
// //       filtered = filtered.filter(
// //         (campaign) =>
// //           campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           campaign.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           campaign.coverLetter?.jobTitle
// //             ?.toLowerCase()
// //             .includes(searchTerm.toLowerCase()) ||
// //           campaign.coverLetter?.companyName
// //             ?.toLowerCase()
// //             .includes(searchTerm.toLowerCase())
// //       );
// //     }

// //     if (statusFilter !== "ALL") {
// //       filtered = filtered.filter(
// //         (campaign) => campaign.status === statusFilter
// //       );
// //     }

// //     if (typeFilter !== "ALL") {
// //       filtered = filtered.filter((campaign) => campaign.type === typeFilter);
// //     }

// //     filtered.sort((a, b) => {
// //       switch (sortBy) {
// //         case "newest":
// //           return new Date(b.createdAt) - new Date(a.createdAt);
// //         case "oldest":
// //           return new Date(a.createdAt) - new Date(b.createdAt);
// //         case "most-emails":
// //           return b.totalEmails - a.totalEmails;
// //         case "least-emails":
// //           return a.totalEmails - b.totalEmails;
// //         case "name-asc":
// //           return (a.title || "").localeCompare(b.title || "");
// //         case "name-desc":
// //           return (b.title || "").localeCompare(a.title || "");
// //         default:
// //           return new Date(b.createdAt) - new Date(a.createdAt);
// //       }
// //     });

// //     setFilteredCampaigns(filtered);
// //   }

// //   const getCampaignStats = () => {
// //     const stats = {
// //       total: campaigns.length,
// //       bulk: campaigns.filter((c) => c.type === "BULK").length,
// //       single: campaigns.filter((c) => c.type === "SINGLE").length,
// //       completed: campaigns.filter((c) => c.status === "COMPLETED").length,
// //       processing: campaigns.filter((c) => c.status === "PROCESSING").length,
// //       failed: campaigns.filter((c) => c.status === "FAILED").length,
// //       pending: campaigns.filter((c) => c.status === "PENDING").length,
// //       totalEmailsSent: campaigns.reduce((acc, c) => acc + c.sentCount, 0),
// //       totalEmails: campaigns.reduce((acc, c) => acc + c.totalEmails, 0),
// //       successRate:
// //         campaigns.reduce((acc, c) => acc + c.totalEmails, 0) > 0
// //           ? Math.round(
// //               (campaigns.reduce((acc, c) => acc + c.sentCount, 0) /
// //                 campaigns.reduce((acc, c) => acc + c.totalEmails, 0)) *
// //                 100
// //             )
// //           : 0,
// //     };
// //     return stats;
// //   };

// //   const getStatusIcon = (status) => {
// //     switch (status) {
// //       case "COMPLETED":
// //         return <CheckCircle className="h-4 w-4 text-green-600" />;
// //       case "FAILED":
// //         return <XCircle className="h-4 w-4 text-red-600" />;
// //       case "PROCESSING":
// //         return <Clock className="h-4 w-4 text-blue-600" />;
// //       case "PENDING":
// //         return <Clock className="h-4 w-4 text-amber-600" />;
// //       case "CANCELLED":
// //         return <XCircle className="h-4 w-4 text-gray-600" />;
// //       default:
// //         return <Clock className="h-4 w-4 text-gray-600" />;
// //     }
// //   };

// //   const getStatusBadge = (status) => {
// //     switch (status) {
// //       case "COMPLETED":
// //         return "default";
// //       case "FAILED":
// //         return "destructive";
// //       case "PROCESSING":
// //         return "secondary";
// //       case "PENDING":
// //         return "outline";
// //       case "CANCELLED":
// //         return "secondary";
// //       default:
// //         return "secondary";
// //     }
// //   };

// //   const getTypeIcon = (type) => {
// //     switch (type) {
// //       case "BULK":
// //         return <Users className="h-4 w-4" />;
// //       case "SINGLE":
// //         return <Send className="h-4 w-4" />;
// //       default:
// //         return <Send className="h-4 w-4" />;
// //     }
// //   };

// //   const formatDate = (dateString) => {
// //     if (!dateString) return "N/A";
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString([], {
// //       month: "short",
// //       day: "numeric",
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     });
// //   };

// //   const formatDateShort = (dateString) => {
// //     if (!dateString) return "N/A";
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString([], {
// //       month: "short",
// //       day: "numeric",
// //     });
// //   };

// //   const copyToClipboard = (text) => {
// //     navigator.clipboard.writeText(text);
// //     // Add toast notification
// //   };

// //   // Pagination calculations
// //   const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
// //   const startIndex = (currentPage - 1) * itemsPerPage;
// //   const endIndex = startIndex + itemsPerPage;
// //   const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

// //   const stats = getCampaignStats();

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-8">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="flex items-center justify-center min-h-[400px]">
// //             <div className="text-center space-y-4">
// //               <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
// //                 <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
// //               </div>
// //               <div>
// //                 <h3 className="text-lg font-semibold text-gray-800">
// //                   Loading Campaigns
// //                 </h3>
// //                 <p className="text-gray-600 text-sm">
// //                   Fetching your campaign data...
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-8">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <div className="flex items-center justify-between mb-6">
// //             <Button
// //               variant="outline"
// //               onClick={() => router.push("/ai-cover-letter")}
// //               className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
// //             >
// //               <ArrowLeft className="h-4 w-4 mr-2" />
// //               <span className="text-gray-700">Back to Cover Letters</span>
// //             </Button>
// //             <Button
// //               variant="outline"
// //               onClick={fetchCampaigns}
// //               className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
// //             >
// //               <RefreshCw className="h-4 w-4 text-gray-700" />
// //               <span className="text-gray-700">Refresh</span>
// //             </Button>
// //           </div>

// //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
// //             <div className="flex items-center gap-4">
// //               <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
// //                 <BarChart3 className="h-6 w-6 text-white" />
// //               </div>
// //               <div>
// //                 <h1 className="text-3xl font-bold text-gray-800">
// //                   Email Campaigns
// //                 </h1>
// //                 <p className="text-gray-600 mt-1">
// //                   Track all your email campaigns - single and bulk
// //                 </p>
// //               </div>
// //             </div>
// //             <div className="flex flex-wrap gap-2">
// //               <Button
// //                 onClick={() => router.push("/ai-cover-letter/email")}
// //                 className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
// //               >
// //                 <Mail className="h-4 w-4 mr-2 text-white" />
// //                 <span className="text-white">New Bulk Campaign</span>
// //               </Button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Stats Cards */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
// //           <Card className="bg-white border border-gray-300 shadow-sm">
// //             <CardContent className="p-3">
// //               <div className="text-2xl font-bold text-gray-800">
// //                 {stats.total}
// //               </div>
// //               <div className="text-xs text-gray-700">Total Campaigns</div>
// //             </CardContent>
// //           </Card>
// //           <Card className="bg-white border border-gray-300 shadow-sm">
// //             <CardContent className="p-3">
// //               <div className="text-2xl font-bold text-green-700">
// //                 {stats.completed}
// //               </div>
// //               <div className="text-xs text-gray-700">Completed</div>
// //             </CardContent>
// //           </Card>
// //           <Card className="bg-white border border-gray-300 shadow-sm">
// //             <CardContent className="p-3">
// //               <div className="text-2xl font-bold text-blue-700">
// //                 {stats.totalEmailsSent}
// //               </div>
// //               <div className="text-xs text-gray-700">Emails Sent</div>
// //             </CardContent>
// //           </Card>
// //           <Card className="bg-white border border-gray-300 shadow-sm">
// //             <CardContent className="p-3">
// //               <div className="text-2xl font-bold text-blue-700">
// //                 {stats.bulk}
// //               </div>
// //               <div className="text-xs text-gray-700">Bulk Campaigns</div>
// //             </CardContent>
// //           </Card>
// //           <Card className="bg-white border border-gray-300 shadow-sm">
// //             <CardContent className="p-3">
// //               <div className="text-2xl font-bold text-purple-700">
// //                 {stats.single}
// //               </div>
// //               <div className="text-xs text-gray-700">Single Emails</div>
// //             </CardContent>
// //           </Card>
// //           <Card className="bg-white border border-gray-300 shadow-sm">
// //             <CardContent className="p-3">
// //               <div className="text-2xl font-bold text-green-700">
// //                 {stats.successRate}%
// //               </div>
// //               <div className="text-xs text-gray-700">Success Rate</div>
// //             </CardContent>
// //           </Card>
// //         </div>

// //         {/* Filters and Search */}
// //         <Card className="mb-8 bg-white border border-gray-300 shadow-sm">
// //           <CardContent className="p-4">
// //             <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
// //               <div className="md:col-span-2">
// //                 <div className="relative">
// //                   <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
// //                   <Input
// //                     placeholder="Search campaigns..."
// //                     value={searchTerm}
// //                     onChange={(e) => setSearchTerm(e.target.value)}
// //                     className="pl-10 border-gray-300 text-gray-700"
// //                   />
// //                 </div>
// //               </div>
// //               <div>
// //                 <Select value={statusFilter} onValueChange={setStatusFilter}>
// //                   <SelectTrigger className="border-gray-300 text-gray-700">
// //                     <SelectValue
// //                       placeholder="Filter by status"
// //                       className="text-gray-700"
// //                     />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="ALL" className="text-gray-700">
// //                       All Status
// //                     </SelectItem>
// //                     <SelectItem value="COMPLETED" className="text-gray-700">
// //                       Completed
// //                     </SelectItem>
// //                     <SelectItem value="PROCESSING" className="text-gray-700">
// //                       Processing
// //                     </SelectItem>
// //                     <SelectItem value="PENDING" className="text-gray-700">
// //                       Pending
// //                     </SelectItem>
// //                     <SelectItem value="FAILED" className="text-gray-700">
// //                       Failed
// //                     </SelectItem>
// //                     <SelectItem value="CANCELLED" className="text-gray-700">
// //                       Cancelled
// //                     </SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //               <div>
// //                 <Select value={typeFilter} onValueChange={setTypeFilter}>
// //                   <SelectTrigger className="border-gray-300 text-gray-700">
// //                     <SelectValue
// //                       placeholder="Filter by type"
// //                       className="text-gray-700"
// //                     />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="ALL" className="text-gray-700">
// //                       All Types
// //                     </SelectItem>
// //                     <SelectItem value="BULK" className="text-gray-700">
// //                       Bulk Campaigns
// //                     </SelectItem>
// //                     <SelectItem value="SINGLE" className="text-gray-700">
// //                       Single Emails
// //                     </SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>
// //             <div className="flex items-center justify-between mt-3">
// //               <div className="text-sm text-gray-700">
// //                 Showing {paginatedCampaigns.length} of{" "}
// //                 {filteredCampaigns.length} campaigns
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <Filter className="h-4 w-4 text-gray-600" />
// //                 <Select value={sortBy} onValueChange={setSortBy}>
// //                   <SelectTrigger className="w-[160px] border-gray-300 text-gray-700">
// //                     <SelectValue
// //                       placeholder="Sort by"
// //                       className="text-gray-700"
// //                     />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="newest" className="text-gray-700">
// //                       Newest First
// //                     </SelectItem>
// //                     <SelectItem value="oldest" className="text-gray-700">
// //                       Oldest First
// //                     </SelectItem>
// //                     <SelectItem value="most-emails" className="text-gray-700">
// //                       Most Emails
// //                     </SelectItem>
// //                     <SelectItem value="least-emails" className="text-gray-700">
// //                       Least Emails
// //                     </SelectItem>
// //                     <SelectItem value="name-asc" className="text-gray-700">
// //                       Name A-Z
// //                     </SelectItem>
// //                     <SelectItem value="name-desc" className="text-gray-700">
// //                       Name Z-A
// //                     </SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Campaigns List */}
// //         {paginatedCampaigns.length === 0 ? (
// //           <Card className="text-center py-12 border-2 border-dashed border-gray-300 bg-white shadow-sm">
// //             <CardContent className="space-y-4">
// //               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
// //                 <Mail className="h-8 w-8 text-gray-500" />
// //               </div>
// //               <div>
// //                 <h3 className="text-lg font-semibold text-gray-800 mb-2">
// //                   No Campaigns Found
// //                 </h3>
// //                 <p className="text-gray-600 max-w-sm mx-auto">
// //                   {searchTerm || statusFilter !== "ALL" || typeFilter !== "ALL"
// //                     ? "No campaigns match your filters."
// //                     : "Start sending emails to see your campaigns here."}
// //                 </p>
// //               </div>
// //               {searchTerm || statusFilter !== "ALL" || typeFilter !== "ALL" ? (
// //                 <Button
// //                   variant="outline"
// //                   onClick={() => {
// //                     setSearchTerm("");
// //                     setStatusFilter("ALL");
// //                     setTypeFilter("ALL");
// //                   }}
// //                   className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
// //                 >
// //                   Clear Filters
// //                 </Button>
// //               ) : (
// //                 <Button
// //                   onClick={() => router.push("/ai-cover-letter/email")}
// //                   className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
// //                 >
// //                   <Users className="h-4 w-4 mr-2" />
// //                   Start New Campaign
// //                 </Button>
// //               )}
// //             </CardContent>
// //           </Card>
// //         ) : (
// //           <>
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
// //               {paginatedCampaigns.map((campaign) => (
// //                 <Card
// //                   key={campaign.id}
// //                   className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
// //                 >
// //                   <CardContent className="p-4">
// //                     <div className="space-y-3">
// //                       {/* Header row */}
// //                       <div className="flex items-start justify-between">
// //                         <div className="flex items-center gap-2">
// //                           <div className="p-2 bg-blue-100 rounded-lg">
// //                             {getTypeIcon(campaign.type)}
// //                           </div>
// //                           <div>
// //                             <h3 className="font-semibold text-gray-800 text-sm">
// //                               {campaign.title?.substring(0, 40) ||
// //                                 `${
// //                                   campaign.type === "BULK" ? "Bulk" : "Single"
// //                                 } Campaign`}
// //                               {campaign.title?.length > 40 && "..."}
// //                             </h3>
// //                             <div className="flex items-center gap-2 mt-1">
// //                               <Badge
// //                                 variant={getStatusBadge(campaign.status)}
// //                                 className="text-xs"
// //                               >
// //                                 <span className="flex items-center gap-1 text-gray-700">
// //                                   {getStatusIcon(campaign.status)}
// //                                   {campaign.status}
// //                                 </span>
// //                               </Badge>
// //                               <span className="text-xs text-gray-600 flex items-center gap-1">
// //                                 <Calendar className="h-3 w-3 text-gray-600" />
// //                                 {formatDateShort(campaign.startedAt)}
// //                               </span>
// //                             </div>
// //                           </div>
// //                         </div>
// //                         <DropdownMenu>
// //                           <DropdownMenuTrigger asChild>
// //                             <Button
// //                               variant="ghost"
// //                               size="sm"
// //                               className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900"
// //                             >
// //                               <MoreVertical className="h-4 w-4" />
// //                             </Button>
// //                           </DropdownMenuTrigger>
// //                           <DropdownMenuContent
// //                             align="end"
// //                             className="border border-gray-300"
// //                           >
// //                             <DropdownMenuItem
// //                               onClick={() =>
// //                                 router.push(
// //                                   `/ai-cover-letter/campaigns/${campaign.id}`
// //                                 )
// //                               }
// //                               className="text-gray-700"
// //                             >
// //                               <Eye className="h-4 w-4 mr-2 text-gray-600" />
// //                               View Details
// //                             </DropdownMenuItem>
// //                             {campaign.coverLetterId && (
// //                               <DropdownMenuItem
// //                                 onClick={() =>
// //                                   router.push(
// //                                     `/ai-cover-letter/${campaign.coverLetterId}`
// //                                   )
// //                                 }
// //                                 className="text-gray-700"
// //                               >
// //                                 <FileText className="h-4 w-4 mr-2 text-gray-600" />
// //                                 View Letter
// //                               </DropdownMenuItem>
// //                             )}
// //                             <DropdownMenuItem
// //                               onClick={() => copyToClipboard(campaign.id)}
// //                               className="text-gray-700"
// //                             >
// //                               <Copy className="h-4 w-4 mr-2 text-gray-600" />
// //                               Copy ID
// //                             </DropdownMenuItem>
// //                           </DropdownMenuContent>
// //                         </DropdownMenu>
// //                       </div>

// //                       {/* Progress and stats */}
// //                       <div className="space-y-2">
// //                         <div className="flex justify-between text-xs">
// //                           <span className="text-gray-700">Progress</span>
// //                           <span className="font-medium text-gray-800">
// //                             {campaign.progress}%
// //                           </span>
// //                         </div>
// //                         <Progress
// //                           value={campaign.progress}
// //                           className="h-1.5 border border-gray-300"
// //                         />
// //                       </div>

// //                       {/* Compact stats */}
// //                       <div className="grid grid-cols-4 gap-2 text-xs">
// //                         <div className="text-center p-2 bg-gray-50 rounded border border-gray-300">
// //                           <div className="font-semibold text-gray-800">
// //                             {campaign.totalEmails}
// //                           </div>
// //                           <div className="text-gray-700">Total</div>
// //                         </div>
// //                         <div className="text-center p-2 bg-green-50 rounded border border-green-300">
// //                           <div className="font-semibold text-green-700">
// //                             {campaign.sentCount}
// //                           </div>
// //                           <div className="text-green-700">Sent</div>
// //                         </div>
// //                         <div className="text-center p-2 bg-red-50 rounded border border-red-300">
// //                           <div className="font-semibold text-red-700">
// //                             {campaign.failedCount}
// //                           </div>
// //                           <div className="text-red-700">Failed</div>
// //                         </div>
// //                         <div className="text-center p-2 bg-blue-50 rounded border border-blue-300">
// //                           <div className="font-semibold text-blue-700">
// //                             {campaign.type === "BULK" ? "Bulk" : "Single"}
// //                           </div>
// //                           <div className="text-blue-700">Type</div>
// //                         </div>
// //                       </div>

// //                       {/* Footer */}
// //                       <div className="flex items-center justify-between pt-2 border-t border-gray-300">
// //                         <div className="text-xs text-gray-700 truncate max-w-[200px]">
// //                           {campaign.subject || "No subject"}
// //                         </div>
// //                         <Button
// //                           variant="outline"
// //                           size="sm"
// //                           onClick={() =>
// //                             router.push(
// //                               `/ai-cover-letter/campaigns/${campaign.id}`
// //                             )
// //                           }
// //                           className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50 h-7 shadow-sm"
// //                         >
// //                           <span className="text-gray-700">Details</span>
// //                           <ChevronRight className="h-3 w-3 ml-1 text-gray-700" />
// //                         </Button>
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               ))}
// //             </div>

// //             {/* Pagination */}
// //             {totalPages > 1 && (
// //               <Card className="bg-white border border-gray-300 shadow-sm">
// //                 <CardContent className="p-4">
// //                   <div className="flex items-center justify-between">
// //                     <div className="text-sm text-gray-700">
// //                       Page {currentPage} of {totalPages} •{" "}
// //                       {filteredCampaigns.length} total campaigns
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                       <Button
// //                         variant="outline"
// //                         size="sm"
// //                         onClick={() => setCurrentPage(1)}
// //                         disabled={currentPage === 1}
// //                         className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 shadow-sm"
// //                       >
// //                         <span className="text-gray-700">First</span>
// //                       </Button>
// //                       <Button
// //                         variant="outline"
// //                         size="sm"
// //                         onClick={() => setCurrentPage(currentPage - 1)}
// //                         disabled={currentPage === 1}
// //                         className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 shadow-sm"
// //                       >
// //                         <ChevronLeft className="h-4 w-4 text-gray-700" />
// //                       </Button>
// //                       <div className="flex items-center gap-1">
// //                         {Array.from(
// //                           { length: Math.min(5, totalPages) },
// //                           (_, i) => {
// //                             let pageNum;
// //                             if (totalPages <= 5) {
// //                               pageNum = i + 1;
// //                             } else if (currentPage <= 3) {
// //                               pageNum = i + 1;
// //                             } else if (currentPage >= totalPages - 2) {
// //                               pageNum = totalPages - 4 + i;
// //                             } else {
// //                               pageNum = currentPage - 2 + i;
// //                             }

// //                             return (
// //                               <Button
// //                                 key={pageNum}
// //                                 variant={
// //                                   currentPage === pageNum
// //                                     ? "default"
// //                                     : "outline"
// //                                 }
// //                                 size="sm"
// //                                 onClick={() => setCurrentPage(pageNum)}
// //                                 className={`h-8 w-8 ${
// //                                   currentPage === pageNum
// //                                     ? "bg-blue-600 text-white shadow-sm"
// //                                     : "border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
// //                                 }`}
// //                               >
// //                                 <span
// //                                   className={
// //                                     currentPage === pageNum
// //                                       ? "text-white"
// //                                       : "text-gray-700"
// //                                   }
// //                                 >
// //                                   {pageNum}
// //                                 </span>
// //                               </Button>
// //                             );
// //                           }
// //                         )}
// //                       </div>
// //                       <Button
// //                         variant="outline"
// //                         size="sm"
// //                         onClick={() => setCurrentPage(currentPage + 1)}
// //                         disabled={currentPage === totalPages}
// //                         className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 shadow-sm"
// //                       >
// //                         <ChevronRightIcon className="h-4 w-4 text-gray-700" />
// //                       </Button>
// //                       <Button
// //                         variant="outline"
// //                         size="sm"
// //                         onClick={() => setCurrentPage(totalPages)}
// //                         disabled={currentPage === totalPages}
// //                         className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 shadow-sm"
// //                       >
// //                         <span className="text-gray-700">Last</span>
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}
// //           </>
// //         )}

// //         {/* Quick Actions Footer */}
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
// //           <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-300 shadow-sm">
// //             <CardContent className="p-4">
// //               <div className="flex items-center gap-2 mb-3">
// //                 <div className="p-1.5 bg-blue-100 rounded-lg">
// //                   <Mail className="h-4 w-4 text-blue-700" />
// //                 </div>
// //                 <div>
// //                   <h3 className="font-semibold text-gray-800 text-sm">
// //                     Bulk Email
// //                   </h3>
// //                   <p className="text-xs text-gray-700">
// //                     Send to multiple recipients
// //                   </p>
// //                 </div>
// //               </div>
// //               <Button
// //                 onClick={() => router.push("/ai-cover-letter/email")}
// //                 className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-8 shadow-sm"
// //               >
// //                 <Users className="h-3 w-3 mr-1" />
// //                 <span className="text-white">New Bulk Campaign</span>
// //               </Button>
// //             </CardContent>
// //           </Card>

// //           <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-300 shadow-sm">
// //             <CardContent className="p-4">
// //               <div className="flex items-center gap-2 mb-3">
// //                 <div className="p-1.5 bg-green-100 rounded-lg">
// //                   <FileText className="h-4 w-4 text-green-700" />
// //                 </div>
// //                 <div>
// //                   <h3 className="font-semibold text-gray-800 text-sm">
// //                     New Cover Letter
// //                   </h3>
// //                   <p className="text-xs text-gray-700">
// //                     Generate AI-powered cover letter
// //                   </p>
// //                 </div>
// //               </div>
// //               <Button
// //                 onClick={() => router.push("/ai-cover-letter/new")}
// //                 className="w-full bg-green-600 hover:bg-green-700 text-white text-sm h-8 shadow-sm"
// //               >
// //                 <FileText className="h-3 w-3 mr-1" />
// //                 <span className="text-white">Create New</span>
// //               </Button>
// //             </CardContent>
// //           </Card>

// //           <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-300 shadow-sm">
// //             <CardContent className="p-4">
// //               <div className="flex items-center gap-2 mb-3">
// //                 <div className="p-1.5 bg-purple-100 rounded-lg">
// //                   <BarChart3 className="h-4 w-4 text-purple-700" />
// //                 </div>
// //                 <div>
// //                   <h3 className="font-semibold text-gray-800 text-sm">
// //                     Analytics
// //                   </h3>
// //                   <p className="text-xs text-gray-700">
// //                     View campaign performance
// //                   </p>
// //                 </div>
// //               </div>
// //               <Button
// //                 variant="outline"
// //                 className="w-full border bg-purple-700 border-purple-300 text-white hover:bg-purple-600 text-sm h-8 shadow-sm"
// //                 onClick={() => {
// //                   // Analytics feature
// //                 }}
// //               >
// //                 <BarChart3 className="h-3 w-3 mr-1 text-white" />
// //                 <span className="text-white">View Analytics</span>
// //               </Button>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   RefreshCw,
//   Filter,
//   Search,
//   Mail,
//   Users,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   Clock,
//   FileText,
//   ChevronRight,
//   BarChart3,
//   Download,
//   Eye,
//   MoreVertical,
//   Send,
//   Copy,
//   ChevronLeft,
//   ChevronRight as ChevronRightIcon,
//   ExternalLink,
//   Hash,
//   Globe,
//   User,
//   Target,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// export default function CampaignsPage() {
//   const router = useRouter();
//   const [campaigns, setCampaigns] = useState([]);
//   const [filteredCampaigns, setFilteredCampaigns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [typeFilter, setTypeFilter] = useState("ALL");
//   const [sortBy, setSortBy] = useState("newest");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 15;

//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   useEffect(() => {
//     filterAndSortCampaigns();
//     setCurrentPage(1);
//   }, [campaigns, searchTerm, statusFilter, typeFilter, sortBy]);

//   async function fetchCampaigns() {
//     setLoading(true);
//     try {
//       const response = await fetch("/api/campaigns");
//       if (response.ok) {
//         const data = await response.json();
//         setCampaigns(data.campaigns || []);
//       }
//     } catch (error) {
//       console.error("Error fetching campaigns:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function filterAndSortCampaigns() {
//     let filtered = [...campaigns];

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (campaign) =>
//           campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           campaign.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           campaign.coverLetter?.jobTitle
//             ?.toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           campaign.coverLetter?.companyName
//             ?.toLowerCase()
//             .includes(searchTerm.toLowerCase())
//       );
//     }

//     if (statusFilter !== "ALL") {
//       filtered = filtered.filter(
//         (campaign) => campaign.status === statusFilter
//       );
//     }

//     if (typeFilter !== "ALL") {
//       filtered = filtered.filter((campaign) => campaign.type === typeFilter);
//     }

//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "newest":
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         case "oldest":
//           return new Date(a.createdAt) - new Date(b.createdAt);
//         case "most-emails":
//           return b.totalEmails - a.totalEmails;
//         case "least-emails":
//           return a.totalEmails - b.totalEmails;
//         case "name-asc":
//           return (a.title || "").localeCompare(b.title || "");
//         case "name-desc":
//           return (b.title || "").localeCompare(a.title || "");
//         default:
//           return new Date(b.createdAt) - new Date(a.createdAt);
//       }
//     });

//     setFilteredCampaigns(filtered);
//   }

//   const getCampaignStats = () => {
//     const stats = {
//       total: campaigns.length,
//       bulk: campaigns.filter((c) => c.type === "BULK").length,
//       single: campaigns.filter((c) => c.type === "SINGLE").length,
//       completed: campaigns.filter((c) => c.status === "COMPLETED").length,
//       processing: campaigns.filter((c) => c.status === "PROCESSING").length,
//       failed: campaigns.filter((c) => c.status === "FAILED").length,
//       pending: campaigns.filter((c) => c.status === "PENDING").length,
//       totalEmailsSent: campaigns.reduce((acc, c) => acc + c.sentCount, 0),
//       totalEmails: campaigns.reduce((acc, c) => acc + c.totalEmails, 0),
//       successRate:
//         campaigns.reduce((acc, c) => acc + c.totalEmails, 0) > 0
//           ? Math.round(
//               (campaigns.reduce((acc, c) => acc + c.sentCount, 0) /
//                 campaigns.reduce((acc, c) => acc + c.totalEmails, 0)) *
//                 100
//             )
//           : 0,
//     };
//     return stats;
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "COMPLETED":
//         return <CheckCircle className="h-4 w-4 text-green-600" />;
//       case "FAILED":
//         return <XCircle className="h-4 w-4 text-red-600" />;
//       case "PROCESSING":
//         return <Clock className="h-4 w-4 text-blue-600" />;
//       case "PENDING":
//         return <Clock className="h-4 w-4 text-amber-600" />;
//       case "CANCELLED":
//         return <XCircle className="h-4 w-4 text-gray-600" />;
//       default:
//         return <Clock className="h-4 w-4 text-gray-600" />;
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "COMPLETED":
//         return "default";
//       case "FAILED":
//         return "destructive";
//       case "PROCESSING":
//         return "secondary";
//       case "PENDING":
//         return "outline";
//       case "CANCELLED":
//         return "secondary";
//       default:
//         return "secondary";
//     }
//   };

//   const getTypeIcon = (type) => {
//     switch (type) {
//       case "BULK":
//         return <Users className="h-4 w-4" />;
//       case "SINGLE":
//         return <Send className="h-4 w-4" />;
//       default:
//         return <Send className="h-4 w-4" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString([], {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatDateShort = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString([], {
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString([], {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     // Add toast notification
//   };

//   // Pagination calculations
//   const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

//   const stats = getCampaignStats();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-center min-h-[400px]">
//             <div className="text-center space-y-4">
//               <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
//                 <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Loading Campaigns
//                 </h3>
//                 <p className="text-gray-600 text-sm">
//                   Fetching your campaign data...
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <Button
//               variant="outline"
//               onClick={() => router.push("/ai-cover-letter")}
//               className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               <span className="text-gray-700">Back to Cover Letters</span>
//             </Button>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 onClick={fetchCampaigns}
//                 className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
//               >
//                 <RefreshCw className="h-4 w-4 text-gray-700" />
//                 <span className="text-gray-700">Refresh</span>
//               </Button>
//               <Button
//                 onClick={() => router.push("/ai-cover-letter/email")}
//                 className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
//               >
//                 <Mail className="h-4 w-4 mr-2 text-white" />
//                 <span className="text-white">New Campaign</span>
//               </Button>
//             </div>
//           </div>

//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
//                 <BarChart3 className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-800">
//                   Email Campaigns
//                 </h1>
//                 <p className="text-gray-600 mt-1">
//                   Track all your email campaigns - history and logs
//                 </p>
//               </div>
//             </div>
//             <div className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-300">
//               <div className="flex items-center gap-2">
//                 <Hash className="h-4 w-4" />
//                 <span>{campaigns.length} total campaigns</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
//           <Card className="bg-white border border-gray-300 shadow-sm">
//             <CardContent className="p-3">
//               <div className="text-2xl font-bold text-gray-800">
//                 {stats.total}
//               </div>
//               <div className="text-xs text-gray-700">Total</div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white border border-gray-300 shadow-sm">
//             <CardContent className="p-3">
//               <div className="text-2xl font-bold text-green-700">
//                 {stats.completed}
//               </div>
//               <div className="text-xs text-gray-700">Completed</div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white border border-gray-300 shadow-sm">
//             <CardContent className="p-3">
//               <div className="text-2xl font-bold text-blue-700">
//                 {stats.totalEmailsSent}
//               </div>
//               <div className="text-xs text-gray-700">Sent</div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white border border-gray-300 shadow-sm">
//             <CardContent className="p-3">
//               <div className="text-2xl font-bold text-red-700">
//                 {stats.failed}
//               </div>
//               <div className="text-xs text-gray-700">Failed</div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white border border-gray-300 shadow-sm">
//             <CardContent className="p-3">
//               <div className="text-2xl font-bold text-amber-700">
//                 {stats.pending}
//               </div>
//               <div className="text-xs text-gray-700">Pending</div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white border border-gray-300 shadow-sm">
//             <CardContent className="p-3">
//               <div className="text-2xl font-bold text-green-700">
//                 {stats.successRate}%
//               </div>
//               <div className="text-xs text-gray-700">Success Rate</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters and Search */}
//         <Card className="mb-6 bg-white border border-gray-300 shadow-sm">
//           <CardContent className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
//               <div className="md:col-span-2">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//                   <Input
//                     placeholder="Search campaigns, subjects, job titles..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 border-gray-300 text-gray-700"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="border-gray-300 text-gray-700">
//                     <SelectValue
//                       placeholder="Filter by status"
//                       className="text-gray-700"
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ALL" className="text-gray-700">
//                       All Status
//                     </SelectItem>
//                     <SelectItem value="COMPLETED" className="text-gray-700">
//                       Completed
//                     </SelectItem>
//                     <SelectItem value="PROCESSING" className="text-gray-700">
//                       Processing
//                     </SelectItem>
//                     <SelectItem value="PENDING" className="text-gray-700">
//                       Pending
//                     </SelectItem>
//                     <SelectItem value="FAILED" className="text-gray-700">
//                       Failed
//                     </SelectItem>
//                     <SelectItem value="CANCELLED" className="text-gray-700">
//                       Cancelled
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Select value={typeFilter} onValueChange={setTypeFilter}>
//                   <SelectTrigger className="border-gray-300 text-gray-700">
//                     <SelectValue
//                       placeholder="Filter by type"
//                       className="text-gray-700"
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ALL" className="text-gray-700">
//                       All Types
//                     </SelectItem>
//                     <SelectItem value="BULK" className="text-gray-700">
//                       Bulk Campaigns
//                     </SelectItem>
//                     <SelectItem value="SINGLE" className="text-gray-700">
//                       Single Emails
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Select value={sortBy} onValueChange={setSortBy}>
//                   <SelectTrigger className="border-gray-300 text-gray-700">
//                     <SelectValue
//                       placeholder="Sort by"
//                       className="text-gray-700"
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="newest" className="text-gray-700">
//                       Newest First
//                     </SelectItem>
//                     <SelectItem value="oldest" className="text-gray-700">
//                       Oldest First
//                     </SelectItem>
//                     <SelectItem value="most-emails" className="text-gray-700">
//                       Most Emails
//                     </SelectItem>
//                     <SelectItem value="least-emails" className="text-gray-700">
//                       Least Emails
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="flex items-center justify-between mt-3">
//               <div className="text-sm text-gray-700">
//                 Showing {paginatedCampaigns.length} of{" "}
//                 {filteredCampaigns.length} campaigns
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
//                   onClick={() => {
//                     // Export functionality
//                   }}
//                 >
//                   <Download className="h-4 w-4 mr-2" />
//                   Export CSV
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Campaigns List - Table View */}
//         {paginatedCampaigns.length === 0 ? (
//           <Card className="text-center py-12 border-2 border-dashed border-gray-300 bg-white shadow-sm">
//             <CardContent className="space-y-4">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
//                 <Mail className="h-8 w-8 text-gray-500" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                   No Campaigns Found
//                 </h3>
//                 <p className="text-gray-600 max-w-sm mx-auto">
//                   {searchTerm || statusFilter !== "ALL" || typeFilter !== "ALL"
//                     ? "No campaigns match your filters."
//                     : "Start sending emails to see your campaigns here."}
//                 </p>
//               </div>
//               {searchTerm || statusFilter !== "ALL" || typeFilter !== "ALL" ? (
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setSearchTerm("");
//                     setStatusFilter("ALL");
//                     setTypeFilter("ALL");
//                   }}
//                   className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
//                 >
//                   Clear Filters
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={() => router.push("/ai-cover-letter/email")}
//                   className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
//                 >
//                   <Users className="h-4 w-4 mr-2" />
//                   Start New Campaign
//                 </Button>
//               )}
//             </CardContent>
//           </Card>
//         ) : (
//           <>
//             <Card className="bg-white border border-gray-300 shadow-sm mb-6">
//               <CardHeader className="bg-gray-50 border-b border-gray-300">
//                 <CardTitle className="text-gray-800">
//                   Campaign History
//                 </CardTitle>
//                 <CardDescription className="text-gray-600">
//                   Track all your email campaigns in chronological order
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="p-0">
//                 <div className="rounded-md overflow-hidden">
//                   <Table>
//                     <TableHeader className="bg-gray-50 border-b border-gray-300">
//                       <TableRow>
//                         <TableHead className="text-gray-700 font-medium w-[200px]">
//                           Campaign
//                         </TableHead>
//                         <TableHead className="text-gray-700 font-medium">
//                           Status
//                         </TableHead>
//                         <TableHead className="text-gray-700 font-medium">
//                           Type
//                         </TableHead>
//                         <TableHead className="text-gray-700 font-medium">
//                           Progress
//                         </TableHead>
//                         <TableHead className="text-gray-700 font-medium">
//                           Emails
//                         </TableHead>
//                         <TableHead className="text-gray-700 font-medium">
//                           Started
//                         </TableHead>
//                         <TableHead className="text-gray-700 font-medium text-right">
//                           Actions
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {paginatedCampaigns.map((campaign) => (
//                         <TableRow
//                           key={campaign.id}
//                           className="hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
//                         >
//                           <TableCell>
//                             <div className="flex items-center gap-2">
//                               <div className="p-1.5 bg-blue-100 rounded">
//                                 {getTypeIcon(campaign.type)}
//                               </div>
//                               <div>
//                                 <div className="font-medium text-gray-800 text-sm">
//                                   {campaign.title?.substring(0, 30) ||
//                                     `${
//                                       campaign.type === "BULK"
//                                         ? "Bulk"
//                                         : "Single"
//                                     } Campaign`}
//                                   {campaign.title?.length > 30 && "..."}
//                                 </div>
//                                 {campaign.subject && (
//                                   <div className="text-xs text-gray-600 truncate max-w-[150px]">
//                                     {campaign.subject}
//                                   </div>
//                                 )}
//                                 {campaign.coverLetter && (
//                                   <div className="text-xs text-gray-500 mt-1">
//                                     {campaign.coverLetter.jobTitle} @{" "}
//                                     {campaign.coverLetter.companyName}
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <Badge
//                               variant={getStatusBadge(campaign.status)}
//                               className="flex items-center gap-1 w-fit"
//                             >
//                               {getStatusIcon(campaign.status)}
//                               {campaign.status}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-1">
//                               {campaign.type === "BULK" ? (
//                                 <>
//                                   <Users className="h-3 w-3 text-blue-600" />
//                                   <span className="text-sm text-gray-700">
//                                     Bulk
//                                   </span>
//                                 </>
//                               ) : (
//                                 <>
//                                   <Send className="h-3 w-3 text-purple-600" />
//                                   <span className="text-sm text-gray-700">
//                                     Single
//                                   </span>
//                                 </>
//                               )}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-2">
//                               <Progress
//                                 value={campaign.progress}
//                                 className="h-2 w-20 border border-gray-300"
//                               />
//                               <span className="text-xs text-gray-700 font-medium">
//                                 {campaign.progress}%
//                               </span>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="space-y-1">
//                               <div className="flex items-center gap-2">
//                                 <div className="text-xs text-gray-700">
//                                   <span className="font-medium">
//                                     {campaign.sentCount}
//                                   </span>
//                                   /
//                                   <span className="text-gray-600">
//                                     {campaign.totalEmails}
//                                   </span>
//                                 </div>
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {campaign.failedCount > 0 && (
//                                   <span className="text-red-600">
//                                     {campaign.failedCount} failed
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="text-sm text-gray-700">
//                               {formatDateTime(campaign.startedAt)}
//                             </div>
//                             {campaign.completedAt && (
//                               <div className="text-xs text-gray-500">
//                                 Completed:{" "}
//                                 {formatDateShort(campaign.completedAt)}
//                               </div>
//                             )}
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <div className="flex items-center justify-end gap-1">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() =>
//                                   router.push(
//                                     `/ai-cover-letter/campaigns/${campaign.id}`
//                                   )
//                                 }
//                                 className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900"
//                                 title="View Details"
//                               >
//                                 <Eye className="h-4 w-4" />
//                               </Button>
//                               {campaign.coverLetterId && (
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() =>
//                                     router.push(
//                                       `/ai-cover-letter/${campaign.coverLetterId}`
//                                     )
//                                   }
//                                   className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900"
//                                   title="View Cover Letter"
//                                 >
//                                   <FileText className="h-4 w-4" />
//                                 </Button>
//                               )}
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => copyToClipboard(campaign.id)}
//                                 className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900"
//                                 title="Copy Campaign ID"
//                               >
//                                 <Copy className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <Card className="bg-white border border-gray-300 shadow-sm">
//                 <CardContent className="p-4">
//                   <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                     <div className="text-sm text-gray-700">
//                       Page {currentPage} of {totalPages} •{" "}
//                       {filteredCampaigns.length} total campaigns
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(1)}
//                         disabled={currentPage === 1}
//                         className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 shadow-sm"
//                       >
//                         <span className="text-gray-700">First</span>
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 shadow-sm"
//                       >
//                         <ChevronLeft className="h-4 w-4 text-gray-700" />
//                       </Button>
//                       <div className="flex items-center gap-1">
//                         {Array.from(
//                           { length: Math.min(5, totalPages) },
//                           (_, i) => {
//                             let pageNum;
//                             if (totalPages <= 5) {
//                               pageNum = i + 1;
//                             } else if (currentPage <= 3) {
//                               pageNum = i + 1;
//                             } else if (currentPage >= totalPages - 2) {
//                               pageNum = totalPages - 4 + i;
//                             } else {
//                               pageNum = currentPage - 2 + i;
//                             }

//                             return (
//                               <Button
//                                 key={pageNum}
//                                 variant={
//                                   currentPage === pageNum
//                                     ? "default"
//                                     : "outline"
//                                 }
//                                 size="sm"
//                                 onClick={() => setCurrentPage(pageNum)}
//                                 className={`h-8 w-8 ${
//                                   currentPage === pageNum
//                                     ? "bg-blue-600 text-white shadow-sm"
//                                     : "border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
//                                 }`}
//                               >
//                                 <span
//                                   className={
//                                     currentPage === pageNum
//                                       ? "text-white"
//                                       : "text-gray-700"
//                                   }
//                                 >
//                                   {pageNum}
//                                 </span>
//                               </Button>
//                             );
//                           }
//                         )}
//                       </div>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 shadow-sm"
//                       >
//                         <ChevronRightIcon className="h-4 w-4 text-gray-700" />
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(totalPages)}
//                         disabled={currentPage === totalPages}
//                         className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 shadow-sm"
//                       >
//                         <span className="text-gray-700">Last</span>
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </>
//         )}

//         {/* Quick Stats Footer */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
//           <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-300 shadow-sm">
//             <CardContent className="p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="p-1.5 bg-blue-100 rounded-lg">
//                   <Target className="h-4 w-4 text-blue-700" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-800 text-sm">
//                     Campaign Performance
//                   </h3>
//                   <p className="text-xs text-gray-700">
//                     Success Rate: {stats.successRate}%
//                   </p>
//                 </div>
//               </div>
//               <div className="text-xs text-gray-700 space-y-1">
//                 <div className="flex justify-between">
//                   <span>Total Emails:</span>
//                   <span className="font-medium">{stats.totalEmails}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Successfully Sent:</span>
//                   <span className="font-medium text-green-700">
//                     {stats.totalEmailsSent}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-300 shadow-sm">
//             <CardContent className="p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="p-1.5 bg-green-100 rounded-lg">
//                   <BarChart3 className="h-4 w-4 text-green-700" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-800 text-sm">
//                     Quick Actions
//                   </h3>
//                   <p className="text-xs text-gray-700">
//                     Manage your email campaigns
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   onClick={() => router.push("/ai-cover-letter/email")}
//                   className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs h-7 shadow-sm"
//                 >
//                   <Send className="h-3 w-3 mr-1" />
//                   New Campaign
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="flex-1 border border-green-300 text-green-700 hover:bg-green-50 text-xs h-7 shadow-sm"
//                   onClick={fetchCampaigns}
//                 >
//                   <RefreshCw className="h-3 w-3 mr-1" />
//                   Refresh
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-300 shadow-sm">
//             <CardContent className="p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="p-1.5 bg-purple-100 rounded-lg">
//                   <Globe className="h-4 w-4 text-purple-700" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-800 text-sm">
//                     Activity Summary
//                   </h3>
//                   <p className="text-xs text-gray-700">
//                     Recent campaign activity
//                   </p>
//                 </div>
//               </div>
//               <div className="text-xs text-gray-700 space-y-1">
//                 <div className="flex justify-between">
//                   <span>Active Campaigns:</span>
//                   <span className="font-medium text-blue-700">
//                     {stats.processing + stats.pending}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Completed Today:</span>
//                   <span className="font-medium text-green-700">
//                     {
//                       campaigns.filter((c) => {
//                         const today = new Date();
//                         const campaignDate = new Date(
//                           c.completedAt || c.updatedAt
//                         );
//                         return (
//                           campaignDate.toDateString() === today.toDateString()
//                         );
//                       }).length
//                     }
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Filter,
  Search,
  Mail,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ChevronRight,
  BarChart3,
  Download,
  Eye,
  MoreVertical,
  Send,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ExternalLink,
  Hash,
  Globe,
  User,
  Target,
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [progressAnimations, setProgressAnimations] = useState({});
  const itemsPerPage = 15;

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    filterAndSortCampaigns();
    setCurrentPage(1);
  }, [campaigns, searchTerm, statusFilter, typeFilter, sortBy]);

  useEffect(() => {
    // Animate progress bars
    const animations = {};
    filteredCampaigns.forEach((campaign) => {
      animations[campaign.id] = campaign.progress || 0;
    });
    setProgressAnimations(animations);

    // Animate progress bars
    const timer = setTimeout(() => {
      const updatedAnimations = {};
      filteredCampaigns.forEach((campaign) => {
        updatedAnimations[campaign.id] = campaign.progress || 0;
      });
      setProgressAnimations(updatedAnimations);
    }, 100);

    return () => clearTimeout(timer);
  }, [filteredCampaigns]);

  async function fetchCampaigns() {
    setLoading(true);
    try {
      const response = await fetch("/api/campaigns");
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
        toast.success("Campaigns refreshed");
      } else {
        toast.error("Failed to fetch campaigns");
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Error loading campaigns");
    } finally {
      setLoading(false);
    }
  }

  function filterAndSortCampaigns() {
    let filtered = [...campaigns];

    if (searchTerm) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.coverLetter?.jobTitle
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          campaign.coverLetter?.companyName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (campaign) => campaign.status === statusFilter
      );
    }

    if (typeFilter !== "ALL") {
      filtered = filtered.filter((campaign) => campaign.type === typeFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "most-emails":
          return b.totalEmails - a.totalEmails;
        case "least-emails":
          return a.totalEmails - b.totalEmails;
        case "name-asc":
          return (a.title || "").localeCompare(b.title || "");
        case "name-desc":
          return (b.title || "").localeCompare(a.title || "");
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredCampaigns(filtered);
  }

  const getCampaignStats = () => {
    const stats = {
      total: campaigns.length,
      bulk: campaigns.filter((c) => c.type === "BULK").length,
      single: campaigns.filter((c) => c.type === "SINGLE").length,
      completed: campaigns.filter((c) => c.status === "COMPLETED").length,
      processing: campaigns.filter((c) => c.status === "PROCESSING").length,
      failed: campaigns.filter((c) => c.status === "FAILED").length,
      pending: campaigns.filter((c) => c.status === "PENDING").length,
      totalEmailsSent: campaigns.reduce(
        (acc, c) => acc + (c.sentCount || 0),
        0
      ),
      totalEmails: campaigns.reduce((acc, c) => acc + (c.totalEmails || 0), 0),
      successRate:
        campaigns.reduce((acc, c) => acc + (c.totalEmails || 0), 0) > 0
          ? Math.round(
              (campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0) /
                campaigns.reduce((acc, c) => acc + (c.totalEmails || 0), 0)) *
                100
            )
          : 0,
    };
    return stats;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "PROCESSING":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
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
      case "CANCELLED":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getProgressColor = (status, progress) => {
    if (status === "COMPLETED") return "bg-green-500";
    if (status === "FAILED") return "bg-red-500";
    if (status === "CANCELLED") return "bg-gray-500";
    if (progress >= 90) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-amber-500";
    return "bg-gray-300";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "BULK":
        return <Users className="h-4 w-4" />;
      case "SINGLE":
        return <Send className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success("Campaign ID copied to clipboard");

    // Reset after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const exportToCSV = () => {
    if (filteredCampaigns.length === 0) {
      toast.error("No campaigns to export");
      return;
    }

    try {
      const headers = [
        "Campaign ID",
        "Title",
        "Type",
        "Status",
        "Progress",
        "Total Emails",
        "Sent",
        "Failed",
        "Subject",
        "Started At",
        "Completed At",
        "Cover Letter Job",
        "Cover Letter Company",
      ];

      const csvData = filteredCampaigns.map((campaign) => [
        campaign.id,
        campaign.title || "",
        campaign.type,
        campaign.status,
        campaign.progress,
        campaign.totalEmails || 0,
        campaign.sentCount || 0,
        campaign.failedCount || 0,
        campaign.subject || "",
        campaign.startedAt || "",
        campaign.completedAt || "",
        campaign.coverLetter?.jobTitle || "",
        campaign.coverLetter?.companyName || "",
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `campaigns_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${filteredCampaigns.length} campaigns to CSV`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export campaigns");
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

  const stats = getCampaignStats();

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
                  Loading Campaigns
                </h3>
                <p className="text-gray-600 text-sm">
                  Fetching your campaign data...
                </p>
              </div>
            </div>
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
              onClick={() => router.push("/ai-cover-letter")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-gray-700">Back to Cover Letters</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={fetchCampaigns}
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
              >
                <RefreshCw className="h-4 w-4 text-gray-700" />
                <span className="text-gray-700">Refresh</span>
              </Button>
              <Button
                onClick={() => router.push("/ai-cover-letter/email")}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
              >
                <Mail className="h-4 w-4 mr-2 text-white" />
                <span className="text-white">New Campaign</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Email Campaigns
                </h1>
                <p className="text-gray-600 mt-1">
                  Track all your email campaigns - history and logs
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-300">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                <span>{campaigns.length} total campaigns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          <Card className="bg-white border border-gray-300 shadow-sm">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-gray-800">
                {stats.total}
              </div>
              <div className="text-xs text-gray-700">Total</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-300 shadow-sm">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-green-700">
                {stats.completed}
              </div>
              <div className="text-xs text-gray-700">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-300 shadow-sm">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-blue-700">
                {stats.totalEmailsSent}
              </div>
              <div className="text-xs text-gray-700">Sent</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-300 shadow-sm">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-red-700">
                {stats.failed}
              </div>
              <div className="text-xs text-gray-700">Failed</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-300 shadow-sm">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-amber-700">
                {stats.pending}
              </div>
              <div className="text-xs text-gray-700">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-300 shadow-sm">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-green-700">
                {stats.successRate}%
              </div>
              <div className="text-xs text-gray-700">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 bg-white border border-gray-300 shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search campaigns, subjects, job titles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 text-gray-700"
                  />
                </div>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-gray-300 text-gray-700">
                    <SelectValue
                      placeholder="Filter by status"
                      className="text-gray-700"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="ALL" className="text-gray-700">
                      All Status
                    </SelectItem>
                    <SelectItem value="COMPLETED" className="text-gray-700">
                      Completed
                    </SelectItem>
                    <SelectItem value="PROCESSING" className="text-gray-700">
                      Processing
                    </SelectItem>
                    <SelectItem value="PENDING" className="text-gray-700">
                      Pending
                    </SelectItem>
                    <SelectItem value="FAILED" className="text-gray-700">
                      Failed
                    </SelectItem>
                    <SelectItem value="CANCELLED" className="text-gray-700">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="border-gray-300 text-gray-700">
                    <SelectValue
                      placeholder="Filter by type"
                      className="text-gray-700"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="ALL" className="text-gray-700">
                      All Types
                    </SelectItem>
                    <SelectItem value="BULK" className="text-gray-700">
                      Bulk Campaigns
                    </SelectItem>
                    <SelectItem value="SINGLE" className="text-gray-700">
                      Single Emails
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="border-gray-300 text-gray-700">
                    <SelectValue
                      placeholder="Sort by"
                      className="text-gray-700"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="newest" className="text-gray-700">
                      Newest First
                    </SelectItem>
                    <SelectItem value="oldest" className="text-gray-700">
                      Oldest First
                    </SelectItem>
                    <SelectItem value="most-emails" className="text-gray-700">
                      Most Emails
                    </SelectItem>
                    <SelectItem value="least-emails" className="text-gray-700">
                      Least Emails
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="text-sm text-gray-700">
                Showing {paginatedCampaigns.length} of{" "}
                {filteredCampaigns.length} campaigns
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                  onClick={exportToCSV}
                  disabled={filteredCampaigns.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns List - Table View */}
        {paginatedCampaigns.length === 0 ? (
          <Card className="text-center py-12 border-2 border-dashed border-gray-300 bg-white shadow-sm">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Campaigns Found
                </h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  {searchTerm || statusFilter !== "ALL" || typeFilter !== "ALL"
                    ? "No campaigns match your filters."
                    : "Start sending emails to see your campaigns here."}
                </p>
              </div>
              {searchTerm || statusFilter !== "ALL" || typeFilter !== "ALL" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("ALL");
                    setTypeFilter("ALL");
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                >
                  Clear Filters
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/ai-cover-letter/email")}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Start New Campaign
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-white border border-gray-300 shadow-sm mb-6">
              <CardHeader className="bg-gray-50 border-b border-gray-300">
                <CardTitle className="text-gray-800">
                  Campaign History
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Track all your email campaigns in chronological order
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50 border-b border-gray-300">
                      <TableRow>
                        <TableHead className="text-gray-700 font-medium w-[200px]">
                          Campaign
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          Status
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          Type
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          Progress
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          Emails
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          Started
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCampaigns.map((campaign) => {
                        const progressValue =
                          progressAnimations[campaign.id] || 0;
                        const progressColor = getProgressColor(
                          campaign.status,
                          progressValue
                        );

                        return (
                          <TableRow
                            key={campaign.id}
                            className="hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 rounded">
                                  {getTypeIcon(campaign.type)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800 text-sm">
                                    {campaign.title?.substring(0, 30) ||
                                      `${
                                        campaign.type === "BULK"
                                          ? "Bulk"
                                          : "Single"
                                      } Campaign`}
                                    {campaign.title?.length > 30 && "..."}
                                  </div>
                                  {campaign.subject && (
                                    <div className="text-xs text-gray-600 truncate max-w-[150px]">
                                      {campaign.subject}
                                    </div>
                                  )}
                                  {campaign.coverLetter && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {campaign.coverLetter.jobTitle} @{" "}
                                      {campaign.coverLetter.companyName}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadge(campaign.status)}
                                className="flex items-center gap-1 w-fit"
                              >
                                {getStatusIcon(campaign.status)}
                                {campaign.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {campaign.type === "BULK" ? (
                                  <>
                                    <Users className="h-3 w-3 text-blue-600" />
                                    <span className="text-sm text-gray-700">
                                      Bulk
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-3 w-3 text-purple-600" />
                                    <span className="text-sm text-gray-700">
                                      Single
                                    </span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="relative w-20 h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                                  <div
                                    className={`absolute top-0 left-0 h-full ${progressColor} transition-all duration-500 ease-out rounded-full`}
                                    style={{ width: `${progressValue}%` }}
                                  />
                                  {progressValue < 20 && progressValue > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-[10px] font-bold text-white">
                                        {progressValue}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs text-gray-700 font-medium min-w-[30px]">
                                  {progressValue}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="text-xs text-gray-700">
                                    <span className="font-medium">
                                      {campaign.sentCount || 0}
                                    </span>
                                    /
                                    <span className="text-gray-600">
                                      {campaign.totalEmails || 0}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {campaign.failedCount > 0 && (
                                    <span className="text-red-600">
                                      {campaign.failedCount} failed
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-700">
                                {formatDateTime(campaign.startedAt)}
                              </div>
                              {campaign.completedAt && (
                                <div className="text-xs text-gray-500">
                                  Completed:{" "}
                                  {formatDateShort(campaign.completedAt)}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    router.push(
                                      `/ai-cover-letter/campaigns/${campaign.id}`
                                    )
                                  }
                                  className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {campaign.coverLetterId && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      router.push(
                                        `/ai-cover-letter/${campaign.coverLetterId}`
                                      )
                                    }
                                    className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900"
                                    title="View Cover Letter"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(campaign.id)}
                                  className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900 transition-all duration-200"
                                  title="Copy Campaign ID"
                                >
                                  {copiedId === campaign.id ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card className="bg-white border border-gray-300 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages} •{" "}
                      {filteredCampaigns.length} total campaigns
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 shadow-sm"
                      >
                        <span className="text-gray-700">First</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 shadow-sm"
                      >
                        <ChevronLeft className="h-4 w-4 text-gray-700" />
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className={`h-8 w-8 ${
                                  currentPage === pageNum
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                                }`}
                              >
                                <span
                                  className={
                                    currentPage === pageNum
                                      ? "text-white"
                                      : "text-gray-700"
                                  }
                                >
                                  {pageNum}
                                </span>
                              </Button>
                            );
                          }
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 shadow-sm"
                      >
                        <ChevronRightIcon className="h-4 w-4 text-gray-700" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 shadow-sm"
                      >
                        <span className="text-gray-700">Last</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-300 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Target className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Campaign Performance
                  </h3>
                  <p className="text-xs text-gray-700">
                    Success Rate: {stats.successRate}%
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span>Total Emails:</span>
                  <span className="font-medium">{stats.totalEmails}</span>
                </div>
                <div className="flex justify-between">
                  <span>Successfully Sent:</span>
                  <span className="font-medium text-green-700">
                    {stats.totalEmailsSent}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-300 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Quick Actions
                  </h3>
                  <p className="text-xs text-gray-700">
                    Manage your email campaigns
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push("/ai-cover-letter/email")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs h-7 shadow-sm"
                >
                  <Send className="h-3 w-3 mr-1" />
                  New Campaign
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border border-green-300 text-green-700 hover:bg-green-50 text-xs h-7 shadow-sm"
                  onClick={fetchCampaigns}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-300 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Globe className="h-4 w-4 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Activity Summary
                  </h3>
                  <p className="text-xs text-gray-700">
                    Recent campaign activity
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span>Active Campaigns:</span>
                  <span className="font-medium text-blue-700">
                    {stats.processing + stats.pending}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completed Today:</span>
                  <span className="font-medium text-green-700">
                    {
                      campaigns.filter((c) => {
                        const today = new Date();
                        const campaignDate = new Date(
                          c.completedAt || c.updatedAt
                        );
                        return (
                          campaignDate.toDateString() === today.toDateString()
                        );
                      }).length
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}