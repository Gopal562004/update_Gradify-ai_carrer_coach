// // "use client";

// // import { useEffect, useState, useRef } from "react";
// // import { useRouter } from "next/navigation";
// // import { getUserCoverLetters } from "@/actions/coverletter";
// // import {
// //   ArrowLeft,
// //   Mail,
// //   Upload,
// //   FileText,
// //   Users,
// //   Send,
// //   AlertCircle,
// //   CheckCircle,
// //   Loader2,
// //   XCircle,
// //   Info,
// //   X,
// //   Clock,
// //   BarChart3,
// //   RefreshCw,
// //   History,
// //   Calendar,
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Progress } from "@/components/ui/progress";
// // import { Alert, AlertDescription } from "@/components/ui/alert";
// // import { Badge } from "@/components/ui/badge";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Switch } from "@/components/ui/switch";

// // export default function BulkEmailToHR() {
// //   const router = useRouter();
// //   const [emails, setEmails] = useState("");
// //   const [selectedLetterId, setSelectedLetterId] = useState("");
// //   const [campaignTitle, setCampaignTitle] = useState("");
// //   const [coverLetters, setCoverLetters] = useState([]);
// //   const [csvFile, setCsvFile] = useState(null);
// //   const [status, setStatus] = useState({ type: "", message: "" });
// //   const [loading, setLoading] = useState(false);
// //   const [isGmailConnected, setIsGmailConnected] = useState(false);
// //   const [checkingConnection, setCheckingConnection] = useState(true);
// //   const [userEmail, setUserEmail] = useState("");

// //   // Background job states
// //   const [activeCampaign, setActiveCampaign] = useState(null);
// //   const [campaignProgress, setCampaignProgress] = useState(0);
// //   const [campaignStatus, setCampaignStatus] = useState(null);
// //   const [campaignResults, setCampaignResults] = useState(null);
// //   const [pollingInterval, setPollingInterval] = useState(null);
// //   const [estimatedTime, setEstimatedTime] = useState(null);
// //   const cancelRef = useRef(false);

// //   useEffect(() => {
// //     async function loadLetters() {
// //       const data = await getUserCoverLetters();
// //       setCoverLetters(data);
// //     }
// //     loadLetters();
// //     checkGmailConnection();

// //     // Check for any active campaigns on mount
// //     checkActiveCampaigns();

// //     return () => {
// //       if (pollingInterval) {
// //         clearInterval(pollingInterval);
// //       }
// //     };
// //   }, []);

// //   const checkGmailConnection = async () => {
// //     try {
// //       const response = await fetch("/api/google/status");
// //       if (response.ok) {
// //         const data = await response.json();
// //         setIsGmailConnected(data.connected);
// //         setUserEmail(data.email || "");
// //       }
// //     } catch (error) {
// //       console.error("Error checking Gmail connection:", error);
// //     } finally {
// //       setCheckingConnection(false);
// //     }
// //   };

// //  const checkActiveCampaigns = async () => {
// //    try {
// //      const response = await fetch("/api/bulk-email/jobs/active");
// //      if (response.ok) {
// //        const data = await response.json();
// //        if (data.campaigns && data.campaigns.length > 0) {
// //          const latestCampaign = data.campaigns[0];
// //          setActiveCampaign({
// //            id: latestCampaign.id,
// //            title: latestCampaign.title,
// //            totalEmails: latestCampaign.totalEmails, // Use totalEmails, not total
// //            sentCount: latestCampaign.sentCount, // Use sentCount, not sent
// //            failedCount: latestCampaign.failedCount, // Use failedCount, not failed
// //            progress: latestCampaign.progress,
// //            startedAt: latestCampaign.startedAt,
// //          });
// //          startCampaignPolling(latestCampaign.id);
// //        }
// //      }
// //    } catch (error) {
// //      console.error("Error checking active campaigns:", error);
// //    }
// //  };

// // const startCampaignPolling = (campaignId) => {
// //   if (pollingInterval) {
// //     clearInterval(pollingInterval);
// //   }

// //   const interval = setInterval(async () => {
// //     const result = await fetchCampaignStatus(campaignId);
// //     const campaign = result?.campaign;

// //     if (campaign && campaign.status !== "PROCESSING") {
// //       clearInterval(interval);
// //       setPollingInterval(null);
// //       setActiveCampaign(null);
// //       setStatus({
// //         type: campaign.status === "COMPLETED" ? "success" : "error",
// //         message: `Campaign ${
// //           campaign.status === "COMPLETED" ? "completed" : "failed"
// //         }! Sent: ${campaign.sentCount || 0}, Failed: ${
// //           campaign.failedCount || 0
// //         }`,
// //       });
// //     }
// //   }, 3000); // Poll every 3 seconds

// //   setPollingInterval(interval);

// //   // Initial fetch
// //   fetchCampaignStatus(campaignId);
// // };

// //   const fetchCampaignStatus = async (campaignId) => {
// //     try {
// //       const response = await fetch(`/api/campaigns/${campaignId}`);
// //       if (response.ok) {
// //         const data = await response.json();

// //         // Access the campaign object from the response
// //         const campaign = data.campaign;

// //         setCampaignProgress(campaign?.progress || 0);
// //         setCampaignStatus(campaign?.status);
// //         setCampaignResults(data);

// //         if (campaign?.status === "PROCESSING") {
// //           // Calculate estimated time remaining
// //           const elapsedMs = new Date() - new Date(campaign.startedAt);
// //           const processed =
// //             (campaign.sentCount || 0) + (campaign.failedCount || 0);
// //           if (processed > 0) {
// //             const msPerEmail = elapsedMs / processed;
// //             const remaining = campaign.totalEmails - processed;
// //             const remainingMs = msPerEmail * remaining;
// //             setEstimatedTime(Math.round(remainingMs / 60000)); // Convert to minutes
// //           }
// //         }

// //         return data;
// //       }
// //     } catch (error) {
// //       console.error("Error fetching campaign status:", error);
// //     }
// //     return null;
// //   };

// //   const handleCsvUpload = async (e) => {
// //     const file = e.target.files[0];
// //     setCsvFile(file);

// //     const reader = new FileReader();
// //     reader.onload = function (event) {
// //       const text = event.target.result;
// //       const lines = text.split(/\r?\n/);
// //       const extractedEmails = lines
// //         .map((line) => line.trim())
// //         .filter((line) => /\S+@\S+\.\S+/.test(line));
// //       setEmails(extractedEmails.join(", "));
// //     };
// //     reader.readAsText(file);
// //   };

// //   const validateEmail = (email) => {
// //     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     return re.test(email);
// //   };

// //   const handleSend = async () => {
// //     if (!isGmailConnected) {
// //       setStatus({
// //         type: "error",
// //         message: "Please connect your Gmail account first!",
// //       });
// //       return;
// //     }

// //     if (!selectedLetterId) {
// //       setStatus({
// //         type: "error",
// //         message: "Please select a cover letter.",
// //       });
// //       return;
// //     }

// //     if (!emails || emails.trim().length === 0) {
// //       setStatus({
// //         type: "error",
// //         message: "Please enter at least one email address.",
// //       });
// //       return;
// //     }

// //     // Count valid emails
// //     const emailList = emails
// //       .split(/[,;\n]/)
// //       .map((e) => e.trim())
// //       .filter((e) => validateEmail(e));

// //     if (emailList.length === 0) {
// //       setStatus({
// //         type: "error",
// //         message: "No valid email addresses found. Please check your input.",
// //       });
// //       return;
// //     }

// //     // Warn for large sends
// //     if (emailList.length > 100) {
// //       if (
// //         !confirm(
// //           `You are about to send ${emailList.length} emails. This may take several minutes and could hit Gmail rate limits. Continue?`
// //         )
// //       ) {
// //         return;
// //       }
// //     }

// //     setLoading(true);
// //     setStatus({
// //       type: "info",
// //       message: `Starting campaign for ${emailList.length} emails...`,
// //     });

// //     try {
// //       const res = await fetch("/api/send-bulk-email", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           letterId: selectedLetterId,
// //           emails: emailList.join(","),
// //           campaignTitle: campaignTitle || undefined,
// //         }),
// //       });

// //       const result = await res.json();

// //       if (res.ok) {
// //         setActiveCampaign({
// //           id: result.campaignId,
// //           title: result.campaignTitle,
// //           totalEmails: result.totalEmails, // Changed from 'total'
// //           sentCount: 0, // Changed from 'sent'
// //           failedCount: 0, // Changed from 'failed'
// //           progress: 0,
// //           startedAt: new Date(),
// //         });

// //         startCampaignPolling(result.campaignId);

// //         setStatus({
// //           type: "success",
// //           message: result.message,
// //         });

// //         // Reset form
// //         setEmails("");
// //         setCampaignTitle("");
// //         setCsvFile(null);
// //       } else {
// //         setStatus({
// //           type: "error",
// //           message: result.error || "Failed to start campaign",
// //         });
// //       }
// //     } catch (err) {
// //       setStatus({
// //         type: "error",
// //         message: "Error starting campaign. Please try again.",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleCancelCampaign = async () => {
// //     if (!activeCampaign?.id) return;

// //     if (
// //       confirm(
// //         "Are you sure you want to cancel this campaign? Emails already sent cannot be recalled."
// //       )
// //     ) {
// //       try {
// //         const res = await fetch(`/api/campaigns/${activeCampaign.id}`, {
// //           method: "DELETE",
// //         });

// //         const result = await res.json();

// //         if (res.ok) {
// //           setStatus({
// //             type: "success",
// //             message: result.message,
// //           });

// //           if (pollingInterval) {
// //             clearInterval(pollingInterval);
// //             setPollingInterval(null);
// //           }

// //           setActiveCampaign(null);
// //           setCampaignProgress(0);
// //         } else {
// //           setStatus({
// //             type: "error",
// //             message: result.error || "Failed to cancel campaign",
// //           });
// //         }
// //       } catch (err) {
// //         setStatus({
// //           type: "error",
// //           message: "Error cancelling campaign",
// //         });
// //       }
// //     }
// //   };

// //   const handleConnectGmail = () => {
// //     window.location.href = "/api/google/auth";
// //   };

// //   const handleViewHistory = () => {
// //     router.push("/dashboard/campaigns");
// //   };

// //   const validEmailCount = emails
// //     .split(/[,;\n]/)
// //     .map((e) => e.trim())
// //     .filter((e) => validateEmail(e)).length;

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 py-8 sm:px-6 lg:px-8">
// //       <div className="max-w-4xl mx-auto text-black">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <div className="flex items-center justify-between mb-6">
// //             <Button
// //               variant="outline"
// //               onClick={() => router.back()}
// //               className="border-gray-300 text-gray-700 hover:bg-gray-50"
// //             >
// //               <ArrowLeft className="h-4 w-4 mr-2" />
// //               Back to Dashboard
// //             </Button>

// //             <Button
// //               variant="outline"
// //               onClick={handleViewHistory}
// //               className="border-blue-200 text-blue-700 hover:bg-blue-50"
// //             >
// //               <History className="h-4 w-4 mr-2" />
// //               View History
// //             </Button>
// //           </div>

// //           <div className="text-center space-y-4">
// //             <div className="flex items-center justify-center gap-3">
// //               <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
// //                 <Users className="h-8 w-8 text-white" />
// //               </div>
// //               <div>
// //                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
// //                   Bulk Email Campaign
// //                 </h1>
// //                 <p className="text-gray-600 mt-2 text-lg">
// //                   Send your cover letter to multiple HR professionals
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Active Campaign Progress */}
// //         {activeCampaign && (
// //           <Card className="mb-6 border-blue-200 bg-blue-50 shadow-lg">
// //             <CardContent className="p-6">
// //               <div className="space-y-4">
// //                 <div className="flex items-center justify-between">
// //                   <div className="flex items-center gap-3">
// //                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
// //                       <Clock className="h-5 w-5 text-blue-600" />
// //                     </div>
// //                     <div>
// //                       <h4 className="font-semibold text-gray-900 text-lg">
// //                         {activeCampaign.title || "Campaign in Progress"}
// //                       </h4>
// //                       <div className="flex items-center gap-4 text-sm text-gray-600">
// //                         <span>
// //                           Sent: {campaignResults?.campaign?.sentCount || 0}/
// //                           {activeCampaign.totalEmails} {/* Use totalEmails */}
// //                         </span>
// //                         {(campaignResults?.campaign?.failedCount || 0) > 0 && (
// //                           <span className="text-rose-600">
// //                             Failed: {campaignResults.campaign.failedCount}{" "}
// //                             {/* Use failedCount */}
// //                           </span>
// //                         )}
// //                         {estimatedTime && (
// //                           <span className="flex items-center gap-1">
// //                             <Calendar className="h-3 w-3" />~{estimatedTime} min
// //                             remaining
// //                           </span>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <Badge
// //                     variant={
// //                       campaignStatus === "processing" ? "default" : "secondary"
// //                     }
// //                   >
// //                     {campaignStatus === "processing"
// //                       ? "PROCESSING"
// //                       : campaignStatus?.toUpperCase()}
// //                   </Badge>
// //                 </div>

// //                 <div className="space-y-2">
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-gray-600">Progress</span>
// //                     <span className="font-medium">{campaignProgress}%</span>
// //                   </div>
// //                   <Progress value={campaignProgress} className="h-3" />
// //                 </div>

// //                 <div className="flex justify-center gap-3">
// //                   <Button
// //                     onClick={() => fetchCampaignStatus(activeCampaign.id)}
// //                     variant="outline"
// //                     className="border-gray-300"
// //                     disabled={campaignStatus !== "processing"}
// //                   >
// //                     <RefreshCw className="h-4 w-4 mr-2" />
// //                     Refresh
// //                   </Button>
// //                   <Button
// //                     onClick={handleCancelCampaign}
// //                     variant="outline"
// //                     className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
// //                     disabled={campaignStatus !== "processing"}
// //                   >
// //                     <X className="h-4 w-4 mr-2" />
// //                     Cancel Campaign
// //                   </Button>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         )}

// //         {/* Gmail Connection Status */}
// //         <Card
// //           className={`mb-6 border ${
// //             isGmailConnected
// //               ? "border-green-200 bg-green-50"
// //               : "border-amber-200 bg-amber-50"
// //           }`}
// //         >
// //           <CardContent className="p-4">
// //             <div className="flex items-center justify-between">
// //               <div className="flex items-center gap-3">
// //                 <div
// //                   className={`p-2 rounded-lg ${
// //                     isGmailConnected ? "bg-green-100" : "bg-amber-100"
// //                   }`}
// //                 >
// //                   {checkingConnection ? (
// //                     <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
// //                   ) : isGmailConnected ? (
// //                     <CheckCircle className="h-5 w-5 text-green-600" />
// //                   ) : (
// //                     <AlertCircle className="h-5 w-5 text-amber-600" />
// //                   )}
// //                 </div>
// //                 <div>
// //                   <h3 className="font-semibold text-gray-900">
// //                     {checkingConnection
// //                       ? "Checking connection..."
// //                       : isGmailConnected
// //                       ? "Gmail Connected"
// //                       : "Gmail Not Connected"}
// //                   </h3>
// //                   <p className="text-sm text-gray-600">
// //                     {checkingConnection
// //                       ? "Verifying your Gmail connection..."
// //                       : isGmailConnected
// //                       ? `Connected as ${userEmail || "your Gmail account"}`
// //                       : "Connect your Gmail account to send emails"}
// //                   </p>
// //                 </div>
// //               </div>
// //               {!isGmailConnected && !checkingConnection && (
// //                 <Button
// //                   onClick={handleConnectGmail}
// //                   className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
// //                 >
// //                   <Mail className="h-4 w-4 mr-2" />
// //                   Connect Gmail
// //                 </Button>
// //               )}
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Main Form */}
// //         <Tabs defaultValue="compose" className="w-full">
// //           <TabsList className="grid grid-cols-2 mb-6">
// //             <TabsTrigger value="compose" className="flex items-center gap-2">
// //               <Mail className="h-4 w-4" />
// //               Compose
// //             </TabsTrigger>
// //             <TabsTrigger value="preview" className="flex items-center gap-2">
// //               <BarChart3 className="h-4 w-4" />
// //               Campaign Details
// //             </TabsTrigger>
// //           </TabsList>

// //           <TabsContent value="compose">
// //             <Card className="bg-white border-gray-200 shadow-lg">
// //               <CardHeader>
// //                 <CardTitle className="text-xl font-bold text-gray-900">
// //                   New Campaign
// //                 </CardTitle>
// //                 <CardDescription>
// //                   Configure your bulk email campaign
// //                 </CardDescription>
// //               </CardHeader>

// //               <CardContent className="space-y-6">
// //                 {/* Campaign Title */}
// //                 <div className="space-y-2">
// //                   <Label htmlFor="campaignTitle">
// //                     Campaign Title (Optional)
// //                   </Label>
// //                   <Input
// //                     id="campaignTitle"
// //                     value={campaignTitle}
// //                     onChange={(e) => setCampaignTitle(e.target.value)}
// //                     placeholder="e.g., Tech Companies Campaign - Dec 2025"
// //                     disabled={!isGmailConnected || loading}
// //                   />
// //                   <p className="text-xs text-gray-500">
// //                     Helps you identify this campaign in your history
// //                   </p>
// //                 </div>

// //                 {/* Select Cover Letter */}
// //                 <div className="space-y-2">
// //                   <Label
// //                     htmlFor="coverLetter"
// //                     className="flex items-center gap-2"
// //                   >
// //                     <FileText className="h-4 w-4 text-blue-600" />
// //                     Select Cover Letter *
// //                   </Label>
// //                   <Select
// //                     value={selectedLetterId}
// //                     onValueChange={setSelectedLetterId}
// //                     disabled={!isGmailConnected || loading}
// //                   >
// //                     <SelectTrigger className="w-full">
// //                       <SelectValue placeholder="Choose a cover letter" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {coverLetters.map((letter) => (
// //                         <SelectItem key={letter.id} value={letter.id}>
// //                           {letter.jobTitle} @ {letter.companyName}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>

// //                 {/* CSV Upload */}
// //                 <div className="space-y-3">
// //                   <Label className="flex items-center gap-2">
// //                     <Upload className="h-4 w-4 text-purple-600" />
// //                     Upload CSV File (Optional)
// //                   </Label>
// //                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
// //                     <input
// //                       type="file"
// //                       accept=".csv"
// //                       onChange={handleCsvUpload}
// //                       className="hidden"
// //                       id="csvUpload"
// //                       disabled={!isGmailConnected || loading}
// //                     />
// //                     <label
// //                       htmlFor="csvUpload"
// //                       className={`cursor-pointer ${
// //                         (!isGmailConnected || loading) && "cursor-not-allowed"
// //                       }`}
// //                     >
// //                       <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
// //                       <p className="text-sm text-gray-600">
// //                         {csvFile ? csvFile.name : "Click to upload CSV file"}
// //                       </p>
// //                       <p className="text-xs text-gray-500 mt-1">
// //                         Each line should contain one email address
// //                       </p>
// //                     </label>
// //                   </div>
// //                 </div>

// //                 {/* Manual Emails */}
// //                 <div className="space-y-2">
// //                   <Label htmlFor="emails">Email Addresses *</Label>
// //                   <Textarea
// //                     id="emails"
// //                     placeholder="hr@company.com, recruiter@techcorp.com, hiring@startup.io"
// //                     value={emails}
// //                     onChange={(e) => setEmails(e.target.value)}
// //                     className="min-h-[120px]"
// //                     disabled={!isGmailConnected || loading}
// //                   />
// //                   <div className="flex justify-between items-center">
// //                     <p className="text-xs text-gray-500">
// //                       Separate emails with commas, semicolons, or new lines
// //                     </p>
// //                     <Badge
// //                       variant={validEmailCount > 0 ? "default" : "outline"}
// //                     >
// //                       {validEmailCount} valid email(s)
// //                     </Badge>
// //                   </div>
// //                 </div>

// //                 {/* Send Button */}
// //                 <div className="pt-4">
// //                   <Button
// //                     onClick={handleSend}
// //                     disabled={
// //                       loading ||
// //                       !selectedLetterId ||
// //                       !isGmailConnected ||
// //                       validEmailCount === 0 ||
// //                       activeCampaign
// //                     }
// //                     className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-base font-semibold"
// //                   >
// //                     {loading ? (
// //                       <>
// //                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
// //                         Starting Campaign...
// //                       </>
// //                     ) : (
// //                       <>
// //                         <Send className="h-4 w-4 mr-2" />
// //                         Start Campaign ({validEmailCount} emails)
// //                       </>
// //                     )}
// //                   </Button>

// //                   {validEmailCount > 100 && (
// //                     <p className="text-xs text-amber-600 mt-2 text-center">
// //                       ⚠️ Sending {validEmailCount} emails may take several
// //                       minutes
// //                     </p>
// //                   )}
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </TabsContent>

// //           <TabsContent value="preview">
// //             <Card className="bg-white border-gray-200 shadow-lg">
// //               <CardHeader>
// //                 <CardTitle className="text-xl font-bold text-gray-900">
// //                   Campaign Status
// //                 </CardTitle>
// //                 <CardDescription>
// //                   Monitor your active and completed campaigns
// //                 </CardDescription>
// //               </CardHeader>

// //               <CardContent className="space-y-6">
// //                 {/* Active Campaign Card */}
// //                 {activeCampaign ? (
// //                   <div className="space-y-4">
// //                     <div className="flex items-center justify-between">
// //                       <h4 className="font-semibold text-gray-900">
// //                         Active Campaign
// //                       </h4>
// //                       <Badge variant="default">
// //                         {campaignStatus?.toUpperCase() || "PROCESSING"}
// //                       </Badge>
// //                     </div>

// //                     <div className="space-y-4">
// //                       <div>
// //                         <div className="flex justify-between text-sm mb-1">
// //                           <span className="text-gray-600">Progress</span>
// //                           <span className="font-medium">
// //                             {campaignProgress}%
// //                           </span>
// //                         </div>
// //                         <Progress value={campaignProgress} className="h-2" />
// //                       </div>

// //                       <div className="grid grid-cols-3 gap-4 text-center">
// //                         <div>
// //                           <div className="text-2xl font-bold text-gray-900">
// //                             {campaignResults?.total || 0}
// //                           </div>
// //                           <div className="text-xs text-gray-500">Total</div>
// //                         </div>
// //                         <div>
// //                           <div className="text-2xl font-bold text-green-600">
// //                             {campaignResults?.sent || 0}
// //                           </div>
// //                           <div className="text-xs text-gray-500">Sent</div>
// //                         </div>
// //                         <div>
// //                           <div className="text-2xl font-bold text-rose-600">
// //                             {campaignResults?.failed || 0}
// //                           </div>
// //                           <div className="text-xs text-gray-500">Failed</div>
// //                         </div>
// //                       </div>

// //                       <Button
// //                         onClick={handleCancelCampaign}
// //                         variant="outline"
// //                         className="w-full border-rose-200 text-rose-700 hover:bg-rose-50"
// //                         disabled={campaignStatus !== "processing"}
// //                       >
// //                         <X className="h-4 w-4 mr-2" />
// //                         Cancel Campaign
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 ) : (
// //                   <div className="text-center py-8">
// //                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //                       <Clock className="h-8 w-8 text-gray-400" />
// //                     </div>
// //                     <h4 className="font-semibold text-gray-900 mb-2">
// //                       No Active Campaigns
// //                     </h4>
// //                     <p className="text-gray-600 text-sm">
// //                       Start a new campaign to see progress here
// //                     </p>
// //                   </div>
// //                 )}

// //                 {/* Campaign History Button */}
// //                 <Button
// //                   variant="outline"
// //                   onClick={handleViewHistory}
// //                   className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
// //                 >
// //                   <History className="h-4 w-4 mr-2" />
// //                   View Campaign History
// //                 </Button>
// //               </CardContent>
// //             </Card>
// //           </TabsContent>
// //         </Tabs>

// //         {/* Status Message */}
// //         {status.message && (
// //           <Alert
// //             className={`mt-6 ${
// //               status.type === "success"
// //                 ? "bg-emerald-50 border-emerald-200 text-emerald-700"
// //                 : status.type === "error"
// //                 ? "bg-rose-50 border-rose-200 text-rose-700"
// //                 : "bg-blue-50 border-blue-200 text-blue-700"
// //             }`}
// //           >
// //             {status.type === "success" ? (
// //               <CheckCircle className="h-4 w-4" />
// //             ) : status.type === "error" ? (
// //               <XCircle className="h-4 w-4" />
// //             ) : (
// //               <Info className="h-4 w-4" />
// //             )}
// //             <AlertDescription className="font-medium">
// //               {status.message}
// //             </AlertDescription>
// //           </Alert>
// //         )}

// //         {/* Tips Section */}
// //         {/* Tips Section */}
// //         <Card className="mt-6 bg-blue-50 border-blue-200">
// //           <CardContent className="p-4">
// //             <div className="flex items-start gap-3">
// //               <div className="p-2 bg-blue-100 rounded-lg">
// //                 <Info className="h-4 w-4 text-blue-600" />
// //               </div>
// //               <div className="space-y-2">
// //                 <h4 className="font-semibold text-blue-900 text-sm">
// //                   Bulk Email Best Practices
// //                 </h4>
// //                 <ul className="text-blue-800 text-sm space-y-1">
// //                   <li>
// //                     • Campaigns run in background - you can close this page
// //                   </li>
// //                   <li>• Check "Campaign Details" tab for real-time progress</li>
// //                   <li>• Gmail has daily sending limits (~500 emails/day)</li>
// //                   <li>
// //                     • Large campaigns (&gt;100 emails) may take 10-30 minutes
// //                   </li>
// //                   <li>
// //                     • Failed emails are automatically logged with error details
// //                   </li>
// //                   <li>• View complete history in Campaign History page</li>
// //                 </ul>
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { getUserCoverLetters } from "@/actions/coverletter";
// import {
//   ArrowLeft,
//   Mail,
//   Upload,
//   FileText,
//   Users,
//   Send,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
//   XCircle,
//   Info,
//   X,
//   Clock,
//   BarChart3,
//   RefreshCw,
//   History,
//   Calendar,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Progress } from "@/components/ui/progress";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function BulkEmailToHR() {
//   const router = useRouter();
//   const [emails, setEmails] = useState("");
//   const [selectedLetterId, setSelectedLetterId] = useState("");
//   const [campaignTitle, setCampaignTitle] = useState("");
//   const [coverLetters, setCoverLetters] = useState([]);
//   const [csvFile, setCsvFile] = useState(null);
//   const [status, setStatus] = useState({ type: "", message: "" });
//   const [loading, setLoading] = useState(false);
//   const [isGmailConnected, setIsGmailConnected] = useState(false);
//   const [checkingConnection, setCheckingConnection] = useState(true);
//   const [userEmail, setUserEmail] = useState("");

//   // Background job states
//   const [activeCampaign, setActiveCampaign] = useState(null);
//   const [campaignProgress, setCampaignProgress] = useState(0);
//   const [campaignStatus, setCampaignStatus] = useState(null);
//   const [campaignResults, setCampaignResults] = useState(null);
//   const [pollingInterval, setPollingInterval] = useState(null);
//   const [estimatedTime, setEstimatedTime] = useState(null);
//   const cancelRef = useRef(false);

//   useEffect(() => {
//     async function loadLetters() {
//       const data = await getUserCoverLetters();
//       setCoverLetters(data);
//     }
//     loadLetters();
//     checkGmailConnection();

//     // Check for any active campaigns on mount
//     checkActiveCampaigns();

//     return () => {
//       if (pollingInterval) {
//         clearInterval(pollingInterval);
//       }
//     };
//   }, []);

//   const checkGmailConnection = async () => {
//     try {
//       const response = await fetch("/api/google/status");
//       if (response.ok) {
//         const data = await response.json();
//         setIsGmailConnected(data.connected);
//         setUserEmail(data.email || "");
//       }
//     } catch (error) {
//       console.error("Error checking Gmail connection:", error);
//     } finally {
//       setCheckingConnection(false);
//     }
//   };

//   const checkActiveCampaigns = async () => {
//     try {
//       const response = await fetch("/api/bulk-email/jobs/active");
//       if (response.ok) {
//         const data = await response.json();
//         if (data.campaigns && data.campaigns.length > 0) {
//           const latestCampaign = data.campaigns[0];
//           setActiveCampaign({
//             id: latestCampaign.id,
//             title: latestCampaign.title,
//             totalEmails: latestCampaign.totalEmails,
//             sentCount: latestCampaign.sentCount,
//             failedCount: latestCampaign.failedCount,
//             progress: latestCampaign.progress,
//             startedAt: latestCampaign.startedAt,
//             status: latestCampaign.status,
//           });
//           startCampaignPolling(latestCampaign.id);
//         }
//       }
//     } catch (error) {
//       console.error("Error checking active campaigns:", error);
//     }
//   };

//   const startCampaignPolling = (campaignId) => {
//     if (pollingInterval) {
//       clearInterval(pollingInterval);
//     }

//     const interval = setInterval(async () => {
//       const result = await fetchCampaignStatus(campaignId);
//       const campaign = result?.campaign;

//       if (campaign && campaign.status !== "PROCESSING") {
//         clearInterval(interval);
//         setPollingInterval(null);
//         setActiveCampaign(null);
//         setStatus({
//           type: campaign.status === "COMPLETED" ? "success" : "error",
//           message: `Campaign ${
//             campaign.status === "COMPLETED" ? "completed" : "failed"
//           }! Sent: ${campaign.sentCount || 0}, Failed: ${
//             campaign.failedCount || 0
//           }`,
//         });
//       }
//     }, 3000);

//     setPollingInterval(interval);

//     // Initial fetch
//     fetchCampaignStatus(campaignId);
//   };

//   const fetchCampaignStatus = async (campaignId) => {
//     try {
//       const response = await fetch(`/api/campaigns/${campaignId}`);
//       if (response.ok) {
//         const data = await response.json();

//         // Access the campaign object from the response
//         const campaign = data.campaign;

//         setCampaignProgress(campaign?.progress || 0);
//         setCampaignStatus(campaign?.status);
//         setCampaignResults({
//           total: campaign?.totalEmails || 0,
//           sent: campaign?.sentCount || 0,
//           failed: campaign?.failedCount || 0,
//         });

//         if (campaign?.status === "PROCESSING") {
//           // Calculate estimated time remaining
//           const elapsedMs = new Date() - new Date(campaign.startedAt);
//           const processed =
//             (campaign.sentCount || 0) + (campaign.failedCount || 0);
//           if (processed > 0) {
//             const msPerEmail = elapsedMs / processed;
//             const remaining = campaign.totalEmails - processed;
//             const remainingMs = msPerEmail * remaining;
//             setEstimatedTime(Math.round(remainingMs / 60000));
//           }
//         }

//         return data;
//       }
//     } catch (error) {
//       console.error("Error fetching campaign status:", error);
//     }
//     return null;
//   };

//   const handleCsvUpload = async (e) => {
//     const file = e.target.files[0];
//     setCsvFile(file);

//     const reader = new FileReader();
//     reader.onload = function (event) {
//       const text = event.target.result;
//       const lines = text.split(/\r?\n/);
//       const extractedEmails = lines
//         .map((line) => line.trim())
//         .filter((line) => /\S+@\S+\.\S+/.test(line));
//       setEmails(extractedEmails.join(", "));
//     };
//     reader.readAsText(file);
//   };

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const handleSend = async () => {
//     if (!isGmailConnected) {
//       setStatus({
//         type: "error",
//         message: "Please connect your Gmail account first!",
//       });
//       return;
//     }

//     if (!selectedLetterId) {
//       setStatus({
//         type: "error",
//         message: "Please select a cover letter.",
//       });
//       return;
//     }

//     if (!emails || emails.trim().length === 0) {
//       setStatus({
//         type: "error",
//         message: "Please enter at least one email address.",
//       });
//       return;
//     }

//     // Count valid emails
//     const emailList = emails
//       .split(/[,;\n]/)
//       .map((e) => e.trim())
//       .filter((e) => validateEmail(e));

//     if (emailList.length === 0) {
//       setStatus({
//         type: "error",
//         message: "No valid email addresses found. Please check your input.",
//       });
//       return;
//     }

//     // Warn for large sends
//     if (emailList.length > 100) {
//       if (
//         !confirm(
//           `You are about to send ${emailList.length} emails. This may take several minutes and could hit Gmail rate limits. Continue?`
//         )
//       ) {
//         return;
//       }
//     }

//     setLoading(true);
//     setStatus({
//       type: "info",
//       message: `Starting campaign for ${emailList.length} emails...`,
//     });

//     try {
//       const res = await fetch("/api/send-bulk-email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           letterId: selectedLetterId,
//           emails: emailList.join(","),
//           campaignTitle: campaignTitle || undefined,
//           subject: "", // Add subject field if needed
//         }),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         setActiveCampaign({
//           id: result.campaignId,
//           title: result.campaignTitle,
//           totalEmails: result.totalEmails,
//           sentCount: 0,
//           failedCount: 0,
//           progress: 0,
//           startedAt: new Date(),
//         });

//         startCampaignPolling(result.campaignId);

//         setStatus({
//           type: "success",
//           message: result.message,
//         });

//         // Reset form
//         setEmails("");
//         setCampaignTitle("");
//         setCsvFile(null);
//       } else {
//         setStatus({
//           type: "error",
//           message: result.error || "Failed to start campaign",
//         });
//       }
//     } catch (err) {
//       setStatus({
//         type: "error",
//         message: "Error starting campaign. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelCampaign = async () => {
//     if (!activeCampaign?.id) return;

//     if (
//       confirm(
//         "Are you sure you want to cancel this campaign? Emails already sent cannot be recalled."
//       )
//     ) {
//       try {
//         const res = await fetch(`/api/campaigns/${activeCampaign.id}`, {
//           method: "DELETE",
//         });

//         const result = await res.json();

//         if (res.ok) {
//           setStatus({
//             type: "success",
//             message: result.message,
//           });

//           if (pollingInterval) {
//             clearInterval(pollingInterval);
//             setPollingInterval(null);
//           }

//           setActiveCampaign(null);
//           setCampaignProgress(0);
//           setCampaignStatus(null);
//         } else {
//           setStatus({
//             type: "error",
//             message: result.error || "Failed to cancel campaign",
//           });
//         }
//       } catch (err) {
//         setStatus({
//           type: "error",
//           message: "Error cancelling campaign",
//         });
//       }
//     }
//   };

//   const handleConnectGmail = () => {
//     window.location.href = "/api/google/auth";
//   };

//   const handleViewHistory = () => {
//     router.push("/ai-cover-letter/campaigns");
//   };

//   const validEmailCount = emails
//     .split(/[,;\n]/)
//     .map((e) => e.trim())
//     .filter((e) => validateEmail(e)).length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto text-black">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <Button
//               variant="outline"
//               onClick={() => router.back()}
//               className="border-gray-300 text-gray-700 hover:bg-gray-50"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Dashboard
//             </Button>

//             <Button
//               variant="outline"
//               onClick={handleViewHistory}
//               className="border-blue-200 text-blue-700 hover:bg-blue-50"
//             >
//               <History className="h-4 w-4 mr-2" />
//               View History
//             </Button>
//           </div>

//           <div className="text-center space-y-4">
//             <div className="flex items-center justify-center gap-3">
//               <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
//                 <Users className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
//                   Bulk Email Campaign
//                 </h1>
//                 <p className="text-gray-600 mt-2 text-lg">
//                   Send your cover letter to multiple HR professionals
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Active Campaign Progress */}
//         {activeCampaign && (
//           <Card className="mb-6 border-blue-200 bg-blue-50 shadow-lg">
//             <CardContent className="p-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                       <Clock className="h-5 w-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-900 text-lg">
//                         {activeCampaign.title || "Campaign in Progress"}
//                       </h4>
//                       <div className="flex items-center gap-4 text-sm text-gray-600">
//                         <span>
//                           Sent: {campaignResults?.sent || 0}/
//                           {activeCampaign.totalEmails}
//                         </span>
//                         {(campaignResults?.failed || 0) > 0 && (
//                           <span className="text-rose-600">
//                             Failed: {campaignResults.failed}
//                           </span>
//                         )}
//                         {estimatedTime && (
//                           <span className="flex items-center gap-1">
//                             <Calendar className="h-3 w-3" />~{estimatedTime} min
//                             remaining
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <Badge
//                     variant={
//                       campaignStatus === "PROCESSING" ? "default" : "secondary"
//                     }
//                   >
//                     {campaignStatus === "PROCESSING"
//                       ? "PROCESSING"
//                       : campaignStatus?.toUpperCase()}
//                   </Badge>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Progress</span>
//                     <span className="font-medium">{campaignProgress}%</span>
//                   </div>
//                   <Progress value={campaignProgress} className="h-3" />
//                 </div>

//                 <div className="flex justify-center gap-3">
//                   <Button
//                     onClick={() => fetchCampaignStatus(activeCampaign.id)}
//                     variant="outline"
//                     className="border-gray-300"
//                     disabled={campaignStatus !== "PROCESSING"}
//                   >
//                     <RefreshCw className="h-4 w-4 mr-2" />
//                     Refresh
//                   </Button>
//                   <Button
//                     onClick={handleCancelCampaign}
//                     variant="outline"
//                     className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
//                     disabled={campaignStatus !== "PROCESSING"}
//                   >
//                     <X className="h-4 w-4 mr-2" />
//                     Cancel Campaign
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Gmail Connection Status */}
//         <Card
//           className={`mb-6 border ${
//             isGmailConnected
//               ? "border-green-200 bg-green-50"
//               : "border-amber-200 bg-amber-50"
//           }`}
//         >
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div
//                   className={`p-2 rounded-lg ${
//                     isGmailConnected ? "bg-green-100" : "bg-amber-100"
//                   }`}
//                 >
//                   {checkingConnection ? (
//                     <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
//                   ) : isGmailConnected ? (
//                     <CheckCircle className="h-5 w-5 text-green-600" />
//                   ) : (
//                     <AlertCircle className="h-5 w-5 text-amber-600" />
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">
//                     {checkingConnection
//                       ? "Checking connection..."
//                       : isGmailConnected
//                       ? "Gmail Connected"
//                       : "Gmail Not Connected"}
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     {checkingConnection
//                       ? "Verifying your Gmail connection..."
//                       : isGmailConnected
//                       ? `Connected as ${userEmail || "your Gmail account"}`
//                       : "Connect your Gmail account to send emails"}
//                   </p>
//                 </div>
//               </div>
//               {!isGmailConnected && !checkingConnection && (
//                 <Button
//                   onClick={handleConnectGmail}
//                   className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
//                 >
//                   <Mail className="h-4 w-4 mr-2" />
//                   Connect Gmail
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Main Form */}
//         <Tabs defaultValue="compose" className="w-full">
//           <TabsList className="grid grid-cols-2 mb-6">
//             <TabsTrigger value="compose" className="flex items-center gap-2">
//               <Mail className="h-4 w-4" />
//               Compose
//             </TabsTrigger>
//             <TabsTrigger value="preview" className="flex items-center gap-2">
//               <BarChart3 className="h-4 w-4" />
//               Campaign Details
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="compose">
//             <Card className="bg-white border-gray-200 shadow-lg">
//               <CardHeader>
//                 <CardTitle className="text-xl font-bold text-gray-900">
//                   New Campaign
//                 </CardTitle>
//                 <CardDescription>
//                   Configure your bulk email campaign
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="space-y-6">
//                 {/* Campaign Title */}
//                 <div className="space-y-2">
//                   <Label htmlFor="campaignTitle">
//                     Campaign Title (Optional)
//                   </Label>
//                   <Input
//                     id="campaignTitle"
//                     value={campaignTitle}
//                     onChange={(e) => setCampaignTitle(e.target.value)}
//                     placeholder="e.g., Tech Companies Campaign - Dec 2025"
//                     disabled={!isGmailConnected || loading || activeCampaign}
//                   />
//                   <p className="text-xs text-gray-500">
//                     Helps you identify this campaign in your history
//                   </p>
//                 </div>

//                 {/* Select Cover Letter */}
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="coverLetter"
//                     className="flex items-center gap-2"
//                   >
//                     <FileText className="h-4 w-4 text-blue-600" />
//                     Select Cover Letter *
//                   </Label>
//                   <Select
//                     value={selectedLetterId}
//                     onValueChange={setSelectedLetterId}
//                     disabled={!isGmailConnected || loading || activeCampaign}
//                   >
//                     <SelectTrigger className="w-full bg-white">
//                       <SelectValue placeholder="Choose a cover letter" />
//                     </SelectTrigger>
//                     <SelectContent className="max-h-60 overflow-y-auto bg-white ">
//                       {coverLetters.map((letter) => (
//                         <SelectItem key={letter.id} value={letter.id}>
//                           {letter.jobTitle} @ {letter.companyName}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* CSV Upload */}
//                 <div className="space-y-3">
//                   <Label className="flex items-center gap-2">
//                     <Upload className="h-4 w-4 text-purple-600" />
//                     Upload CSV File (Optional)
//                   </Label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
//                     <input
//                       type="file"
//                       accept=".csv"
//                       onChange={handleCsvUpload}
//                       className="hidden"
//                       id="csvUpload"
//                       disabled={!isGmailConnected || loading || activeCampaign}
//                     />
//                     <label
//                       htmlFor="csvUpload"
//                       className={`cursor-pointer ${
//                         (!isGmailConnected || loading || activeCampaign) &&
//                         "cursor-not-allowed"
//                       }`}
//                     >
//                       <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//                       <p className="text-sm text-gray-600">
//                         {csvFile ? csvFile.name : "Click to upload CSV file"}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         Each line should contain one email address
//                       </p>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Manual Emails */}
//                 <div className="space-y-2">
//                   <Label htmlFor="emails">Email Addresses *</Label>
//                   <Textarea
//                     id="emails"
//                     placeholder="hr@company.com, recruiter@techcorp.com, hiring@startup.io"
//                     value={emails}
//                     onChange={(e) => setEmails(e.target.value)}
//                     className="min-h-[120px]"
//                     disabled={!isGmailConnected || loading || activeCampaign}
//                   />
//                   <div className="flex justify-between items-center">
//                     <p className="text-xs text-gray-500">
//                       Separate emails with commas, semicolons, or new lines
//                     </p>
//                     <Badge
//                       variant={validEmailCount > 0 ? "default" : "outline"}
//                     >
//                       {validEmailCount} valid email(s)
//                     </Badge>
//                   </div>
//                 </div>

//                 {/* Send Button */}
//                 <div className="pt-4">
//                   <Button
//                     onClick={handleSend}
//                     disabled={
//                       loading ||
//                       !selectedLetterId ||
//                       !isGmailConnected ||
//                       validEmailCount === 0 ||
//                       activeCampaign
//                     }
//                     className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-base font-semibold"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Starting Campaign...
//                       </>
//                     ) : (
//                       <>
//                         <Send className="h-4 w-4 mr-2" />
//                         Start Campaign ({validEmailCount} emails)
//                       </>
//                     )}
//                   </Button>

//                   {validEmailCount > 100 && (
//                     <p className="text-xs text-amber-600 mt-2 text-center">
//                       ⚠️ Sending {validEmailCount} emails may take several
//                       minutes
//                     </p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="preview">
//             <Card className="bg-white border-gray-200 shadow-lg">
//               <CardHeader>
//                 <CardTitle className="text-xl font-bold text-gray-900">
//                   Campaign Status
//                 </CardTitle>
//                 <CardDescription>
//                   Monitor your active and completed campaigns
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="space-y-6">
//                 {/* Active Campaign Card */}
//                 {activeCampaign ? (
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <h4 className="font-semibold text-gray-900">
//                         Active Campaign
//                       </h4>
//                       <Badge variant="default">
//                         {campaignStatus?.toUpperCase() || "PROCESSING"}
//                       </Badge>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <div className="flex justify-between text-sm mb-1">
//                           <span className="text-gray-600">Progress</span>
//                           <span className="font-medium">
//                             {campaignProgress}%
//                           </span>
//                         </div>
//                         <Progress value={campaignProgress} className="h-2" />
//                       </div>

//                       <div className="grid grid-cols-3 gap-4 text-center">
//                         <div>
//                           <div className="text-2xl font-bold text-gray-900">
//                             {campaignResults?.total || 0}
//                           </div>
//                           <div className="text-xs text-gray-500">Total</div>
//                         </div>
//                         <div>
//                           <div className="text-2xl font-bold text-green-600">
//                             {campaignResults?.sent || 0}
//                           </div>
//                           <div className="text-xs text-gray-500">Sent</div>
//                         </div>
//                         <div>
//                           <div className="text-2xl font-bold text-rose-600">
//                             {campaignResults?.failed || 0}
//                           </div>
//                           <div className="text-xs text-gray-500">Failed</div>
//                         </div>
//                       </div>

//                       <Button
//                         onClick={handleCancelCampaign}
//                         variant="outline"
//                         className="w-full border-rose-200 text-rose-700 hover:bg-rose-50"
//                         disabled={campaignStatus !== "PROCESSING"}
//                       >
//                         <X className="h-4 w-4 mr-2" />
//                         Cancel Campaign
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <Clock className="h-8 w-8 text-gray-400" />
//                     </div>
//                     <h4 className="font-semibold text-gray-900 mb-2">
//                       No Active Campaigns
//                     </h4>
//                     <p className="text-gray-600 text-sm">
//                       Start a new campaign to see progress here
//                     </p>
//                   </div>
//                 )}

//                 {/* Campaign History Button */}
//                 <Button
//                   variant="outline"
//                   onClick={handleViewHistory}
//                   className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
//                 >
//                   <History className="h-4 w-4 mr-2" />
//                   View Campaign History
//                 </Button>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         {/* Status Message */}
//         {status.message && (
//           <Alert
//             className={`mt-6 ${
//               status.type === "success"
//                 ? "bg-emerald-50 border-emerald-200 text-emerald-700"
//                 : status.type === "error"
//                 ? "bg-rose-50 border-rose-200 text-rose-700"
//                 : "bg-blue-50 border-blue-200 text-blue-700"
//             }`}
//           >
//             {status.type === "success" ? (
//               <CheckCircle className="h-4 w-4" />
//             ) : status.type === "error" ? (
//               <XCircle className="h-4 w-4" />
//             ) : (
//               <Info className="h-4 w-4" />
//             )}
//             <AlertDescription className="font-medium">
//               {status.message}
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Tips Section */}
//         <Card className="mt-6 bg-blue-50 border-blue-200">
//           <CardContent className="p-4">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Info className="h-4 w-4 text-blue-600" />
//               </div>
//               <div className="space-y-2">
//                 <h4 className="font-semibold text-blue-900 text-sm">
//                   Bulk Email Best Practices
//                 </h4>
//                 <ul className="text-blue-800 text-sm space-y-1">
//                   <li>
//                     • Campaigns run in background - you can close this page
//                   </li>
//                   <li>• Check "Campaign Details" tab for real-time progress</li>
//                   <li>• Gmail has daily sending limits (~500 emails/day)</li>
//                   <li>
//                     • Large campaigns (&gt;100 emails) may take 10-30 minutes
//                   </li>
//                   <li>
//                     • Failed emails are automatically logged with error details
//                   </li>
//                   <li>• View complete history in Campaign History page</li>
//                 </ul>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserCoverLetters } from "@/actions/coverletter";
import {
  ArrowLeft,
  Mail,
  Upload,
  FileText,
  Users,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
  XCircle,
  Info,
  X,
  Clock,
  BarChart3,
  RefreshCw,
  History,
  Calendar,
  LogOut,
  User as UserIcon,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BulkEmailToHR() {
  const router = useRouter();
  const [emails, setEmails] = useState("");
  const [selectedLetterId, setSelectedLetterId] = useState("");
  const [campaignTitle, setCampaignTitle] = useState("");
  const [coverLetters, setCoverLetters] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  // Background job states
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [campaignProgress, setCampaignProgress] = useState(0);
  const [campaignStatus, setCampaignStatus] = useState(null);
  const [campaignResults, setCampaignResults] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

  useEffect(() => {
    async function loadLetters() {
      const data = await getUserCoverLetters();
      setCoverLetters(data);
    }
    loadLetters();
    checkGmailConnection();

    // Check for any active campaigns on mount
    checkActiveCampaigns();

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  const checkGmailConnection = async () => {
    try {
      const response = await fetch("/api/google/status");
      if (response.ok) {
        const data = await response.json();
        setIsGmailConnected(data.connected);
        setUserEmail(data.email || "");
        setUserName(data.name || "");
      }
    } catch (error) {
      console.error("Error checking Gmail connection:", error);
    } finally {
      setCheckingConnection(false);
    }
  };

  const checkActiveCampaigns = async () => {
    try {
      const response = await fetch("/api/bulk-email/jobs/active");
      if (response.ok) {
        const data = await response.json();
        if (data.campaigns && data.campaigns.length > 0) {
          const latestCampaign = data.campaigns[0];
          setActiveCampaign({
            id: latestCampaign.id,
            title: latestCampaign.title,
            totalEmails: latestCampaign.totalEmails,
            sentCount: latestCampaign.sentCount,
            failedCount: latestCampaign.failedCount,
            progress: latestCampaign.progress,
            startedAt: latestCampaign.startedAt,
            status: latestCampaign.status,
          });
          startCampaignPolling(latestCampaign.id);
        }
      }
    } catch (error) {
      console.error("Error checking active campaigns:", error);
    }
  };

  const startCampaignPolling = (campaignId) => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = setInterval(async () => {
      const result = await fetchCampaignStatus(campaignId);
      const campaign = result?.campaign;

      if (campaign && campaign.status !== "PROCESSING") {
        clearInterval(interval);
        setPollingInterval(null);
        setActiveCampaign(null);
        setStatus({
          type: campaign.status === "COMPLETED" ? "success" : "error",
          message: `Campaign ${
            campaign.status === "COMPLETED" ? "completed" : "failed"
          }! Sent: ${campaign.sentCount || 0}, Failed: ${
            campaign.failedCount || 0
          }`,
        });
      }
    }, 3000);

    setPollingInterval(interval);

    // Initial fetch
    fetchCampaignStatus(campaignId);
  };

  const fetchCampaignStatus = async (campaignId) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (response.ok) {
        const data = await response.json();

        // Access the campaign object from the response
        const campaign = data.campaign;

        setCampaignProgress(campaign?.progress || 0);
        setCampaignStatus(campaign?.status);
        setCampaignResults({
          total: campaign?.totalEmails || 0,
          sent: campaign?.sentCount || 0,
          failed: campaign?.failedCount || 0,
        });

        if (campaign?.status === "PROCESSING") {
          // Calculate estimated time remaining
          const elapsedMs = new Date() - new Date(campaign.startedAt);
          const processed =
            (campaign.sentCount || 0) + (campaign.failedCount || 0);
          if (processed > 0) {
            const msPerEmail = elapsedMs / processed;
            const remaining = campaign.totalEmails - processed;
            const remainingMs = msPerEmail * remaining;
            setEstimatedTime(Math.round(remainingMs / 60000));
          }
        }

        return data;
      }
    } catch (error) {
      console.error("Error fetching campaign status:", error);
    }
    return null;
  };

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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSend = async () => {
    if (!isGmailConnected) {
      setStatus({
        type: "error",
        message: "Please connect your Gmail account first!",
      });
      return;
    }

    if (!selectedLetterId) {
      setStatus({
        type: "error",
        message: "Please select a cover letter.",
      });
      return;
    }

    if (!emails || emails.trim().length === 0) {
      setStatus({
        type: "error",
        message: "Please enter at least one email address.",
      });
      return;
    }

    // Count valid emails
    const emailList = emails
      .split(/[,;\n]/)
      .map((e) => e.trim())
      .filter((e) => validateEmail(e));

    if (emailList.length === 0) {
      setStatus({
        type: "error",
        message: "No valid email addresses found. Please check your input.",
      });
      return;
    }

    // Warn for large sends
    if (emailList.length > 100) {
      if (
        !confirm(
          `You are about to send ${emailList.length} emails. This may take several minutes and could hit Gmail rate limits. Continue?`,
        )
      ) {
        return;
      }
    }

    setLoading(true);
    setStatus({
      type: "info",
      message: `Starting campaign for ${emailList.length} emails...`,
    });

    try {
      const res = await fetch("/api/send-bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          letterId: selectedLetterId,
          emails: emailList.join(","),
          campaignTitle: campaignTitle || undefined,
          subject: "", // Add subject field if needed
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setActiveCampaign({
          id: result.campaignId,
          title: result.campaignTitle,
          totalEmails: result.totalEmails,
          sentCount: 0,
          failedCount: 0,
          progress: 0,
          startedAt: new Date(),
        });

        startCampaignPolling(result.campaignId);

        setStatus({
          type: "success",
          message: result.message,
        });

        // Reset form
        setEmails("");
        setCampaignTitle("");
        setCsvFile(null);
      } else {
        setStatus({
          type: "error",
          message: result.error || "Failed to start campaign",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: "Error starting campaign. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCampaign = async () => {
    if (!activeCampaign?.id) return;

    if (
      confirm(
        "Are you sure you want to cancel this campaign? Emails already sent cannot be recalled.",
      )
    ) {
      try {
        const res = await fetch(`/api/campaigns/${activeCampaign.id}`, {
          method: "DELETE",
        });

        const result = await res.json();

        if (res.ok) {
          setStatus({
            type: "success",
            message: result.message,
          });

          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }

          setActiveCampaign(null);
          setCampaignProgress(0);
          setCampaignStatus(null);
        } else {
          setStatus({
            type: "error",
            message: result.error || "Failed to cancel campaign",
          });
        }
      } catch (err) {
        setStatus({
          type: "error",
          message: "Error cancelling campaign",
        });
      }
    }
  };

  const handleConnectGmail = () => {
    window.location.href = "/api/google/auth";
  };

  const handleDisconnectGmail = async () => {
    if (confirm("Are you sure you want to disconnect your Gmail account?")) {
      try {
        setLoading(true);
        const response = await fetch("/api/google/logout", {
          method: "POST",
        });

        if (response.ok) {
          setIsGmailConnected(false);
          setUserEmail("");
          setUserName("");
          setStatus({
            type: "success",
            message: "Gmail account disconnected successfully!",
          });

          // Disable form if there's an active campaign
          if (activeCampaign) {
            setStatus({
              type: "warning",
              message:
                "Gmail disconnected. Active campaign will continue but no new campaigns can be started.",
            });
          }
        } else {
          const data = await response.json();
          setStatus({
            type: "error",
            message: data.error || "Failed to disconnect Gmail account",
          });
        }
      } catch (error) {
        console.error("Error disconnecting Gmail:", error);
        setStatus({
          type: "error",
          message: "Error disconnecting Gmail account",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewHistory = () => {
    router.push("/ai-cover-letter/campaigns");
  };

  const validEmailCount = emails
    .split(/[,;\n]/)
    .map((e) => e.trim())
    .filter((e) => validateEmail(e)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-black">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <Button
              variant="outline"
              onClick={handleViewHistory}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <History className="h-4 w-4 mr-2" />
              View History
            </Button>
          </div>

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

        {/* Active Campaign Progress */}
        {activeCampaign && (
          <Card className="mb-6 border-blue-200 bg-blue-50 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {activeCampaign.title || "Campaign in Progress"}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          Sent: {campaignResults?.sent || 0}/
                          {activeCampaign.totalEmails}
                        </span>
                        {(campaignResults?.failed || 0) > 0 && (
                          <span className="text-rose-600">
                            Failed: {campaignResults.failed}
                          </span>
                        )}
                        {estimatedTime && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />~{estimatedTime} min
                            remaining
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      campaignStatus === "PROCESSING" ? "default" : "secondary"
                    }
                  >
                    {campaignStatus === "PROCESSING"
                      ? "PROCESSING"
                      : campaignStatus?.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{campaignProgress}%</span>
                  </div>
                  <Progress value={campaignProgress} className="h-3" />
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    onClick={() => fetchCampaignStatus(activeCampaign.id)}
                    variant="outline"
                    className="border-gray-300"
                    disabled={campaignStatus !== "PROCESSING"}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    onClick={handleCancelCampaign}
                    variant="outline"
                    className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                    disabled={campaignStatus !== "PROCESSING"}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gmail Connection Status */}
        <Card
          className={`mb-6 border ${
            isGmailConnected
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isGmailConnected ? "bg-green-100" : "bg-amber-100"
                  }`}
                >
                  {checkingConnection ? (
                    <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                  ) : isGmailConnected ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {checkingConnection
                      ? "Checking connection..."
                      : isGmailConnected
                        ? "Gmail Connected"
                        : "Gmail Not Connected"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {checkingConnection
                      ? "Verifying your Gmail connection..."
                      : isGmailConnected
                        ? userName
                          ? `${userName} (${userEmail})`
                          : userEmail || "Your Gmail account"
                        : "Connect your Gmail account to send emails"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!isGmailConnected && !checkingConnection ? (
                  <Button
                    onClick={handleConnectGmail}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Connect Gmail
                  </Button>
                ) : isGmailConnected && !checkingConnection ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserIcon className="h-4 w-4" />
                      <span>Ready to send</span>
                    </div>
                    <Button
                      onClick={handleDisconnectGmail}
                      variant="outline"
                      size="sm"
                      className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4 mr-2" />
                      )}
                      Disconnect
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Tabs defaultValue="compose" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Campaign Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  New Campaign
                </CardTitle>
                <CardDescription>
                  Configure your bulk email campaign
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Campaign Title */}
                <div className="space-y-2">
                  <Label htmlFor="campaignTitle">
                    Campaign Title (Optional)
                  </Label>
                  <Input
                    id="campaignTitle"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    placeholder="e.g., Tech Companies Campaign - Dec 2025"
                    disabled={!isGmailConnected || loading || activeCampaign}
                  />
                  <p className="text-xs text-gray-500">
                    Helps you identify this campaign in your history
                  </p>
                </div>

                {/* Select Cover Letter */}
                <div className="space-y-2">
                  <Label
                    htmlFor="coverLetter"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4 text-blue-600" />
                    Select Cover Letter *
                  </Label>
                  <Select
                    value={selectedLetterId}
                    onValueChange={setSelectedLetterId}
                    disabled={!isGmailConnected || loading || activeCampaign}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Choose a cover letter" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto bg-white">
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
                  <Label className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-purple-600" />
                    Upload CSV File (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      className="hidden"
                      id="csvUpload"
                      disabled={!isGmailConnected || loading || activeCampaign}
                    />
                    <label
                      htmlFor="csvUpload"
                      className={`cursor-pointer ${
                        (!isGmailConnected || loading || activeCampaign) &&
                        "cursor-not-allowed"
                      }`}
                    >
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
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
                <div className="space-y-2">
                  <Label htmlFor="emails">Email Addresses *</Label>
                  <Textarea
                    id="emails"
                    placeholder="hr@company.com, recruiter@techcorp.com, hiring@startup.io"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    className="min-h-[120px]"
                    disabled={!isGmailConnected || loading || activeCampaign}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Separate emails with commas, semicolons, or new lines
                    </p>
                    <Badge
                      variant={validEmailCount > 0 ? "default" : "outline"}
                    >
                      {validEmailCount} valid email(s)
                    </Badge>
                  </div>
                </div>

                {/* Send Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleSend}
                    disabled={
                      loading ||
                      !selectedLetterId ||
                      !isGmailConnected ||
                      validEmailCount === 0 ||
                      activeCampaign
                    }
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-base font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Starting Campaign...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Start Campaign ({validEmailCount} emails)
                      </>
                    )}
                  </Button>

                  {validEmailCount > 100 && (
                    <p className="text-xs text-amber-600 mt-2 text-center">
                      ⚠️ Sending {validEmailCount} emails may take several
                      minutes
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Campaign Status
                </CardTitle>
                <CardDescription>
                  Monitor your active and completed campaigns
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Active Campaign Card */}
                {activeCampaign ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        Active Campaign
                      </h4>
                      <Badge variant="default">
                        {campaignStatus?.toUpperCase() || "PROCESSING"}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            {campaignProgress}%
                          </span>
                        </div>
                        <Progress value={campaignProgress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {campaignResults?.total || 0}
                          </div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {campaignResults?.sent || 0}
                          </div>
                          <div className="text-xs text-gray-500">Sent</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-rose-600">
                            {campaignResults?.failed || 0}
                          </div>
                          <div className="text-xs text-gray-500">Failed</div>
                        </div>
                      </div>

                      <Button
                        onClick={handleCancelCampaign}
                        variant="outline"
                        className="w-full border-rose-200 text-rose-700 hover:bg-rose-50"
                        disabled={campaignStatus !== "PROCESSING"}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel Campaign
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      No Active Campaigns
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Start a new campaign to see progress here
                    </p>
                  </div>
                )}

                {/* Campaign History Button */}
                <Button
                  variant="outline"
                  onClick={handleViewHistory}
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <History className="h-4 w-4 mr-2" />
                  View Campaign History
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status Message */}
        {status.message && (
          <Alert
            className={`mt-6 ${
              status.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : status.type === "error"
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : "bg-blue-50 border-blue-200 text-blue-700"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : status.type === "error" ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <Info className="h-4 w-4" />
            )}
            <AlertDescription className="font-medium">
              {status.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Tips Section */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900 text-sm">
                  Bulk Email Best Practices
                </h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>
                    • Campaigns run in background - you can close this page
                  </li>
                  <li>• Check "Campaign Details" tab for real-time progress</li>
                  <li>• Gmail has daily sending limits (~500 emails/day)</li>
                  <li>
                    • Large campaigns (&gt;100 emails) may take 10-30 minutes
                  </li>
                  <li>
                    • Failed emails are automatically logged with error details
                  </li>
                  <li>• View complete history in Campaign History page</li>
                  <li>
                    • Disconnect Gmail anytime using the Disconnect button
                  </li>
                  <li>
                    • Reconnect anytime if you need to change Gmail accounts
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
