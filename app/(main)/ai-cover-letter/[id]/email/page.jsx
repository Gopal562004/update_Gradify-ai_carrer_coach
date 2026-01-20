// // // "use client";

// // // import { useEffect, useState } from "react";
// // // import { useParams, useRouter } from "next/navigation";
// // // import { getCoverLetter, sendEmail } from "@/actions/coverletter";
// // // import { ArrowLeft, Mail, Send, Building, Briefcase } from "lucide-react";
// // // import { Button } from "@/components/ui/button";
// // // import {
// // //   Card,
// // //   CardContent,
// // //   CardDescription,
// // //   CardHeader,
// // //   CardTitle,
// // // } from "@/components/ui/card";
// // // import { Input } from "@/components/ui/input";
// // // import { Textarea } from "@/components/ui/textarea";
// // // import { Label } from "@/components/ui/label";

// // // export default function SendEmailPage() {
// // //   const { id } = useParams();
// // //   const router = useRouter();

// // //   const [coverLetter, setCoverLetter] = useState(null);
// // //   const [to, setTo] = useState("");
// // //   const [subject, setSubject] = useState("");
// // //   const [message, setMessage] = useState("");
// // //   const [status, setStatus] = useState("idle");
// // //   const [loading, setLoading] = useState(true);
// // //   const [accessToken, setAccessToken] = useState(null);

// // //   // Fetch cover letter
// // //   useEffect(() => {
// // //     async function fetchLetter() {
// // //       try {
// // //         const data = await getCoverLetter(id);
// // //         setCoverLetter(data);
// // //         setSubject(`Application for ${data.jobTitle} at ${data.companyName}`);
// // //         setMessage(data.content);
// // //       } catch (error) {
// // //         console.error("Failed to fetch cover letter:", error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     }
// // //     fetchLetter();
// // //   }, [id]);

// // //   // Load access token from localStorage
// // //   useEffect(() => {
// // //     const token = localStorage.getItem("gmail_access_token");
// // //     if (token) setAccessToken(token);
// // //   }, []);

// // //   // Redirect to Google OAuth API
// // //   const handleGoogleSignIn = () => {
// // //     window.location.href = "/api/oauth/google"; // <-- Correct API route
// // //   };

// // //   // Handle sending email
// // //   const handleSend = async (e) => {
// // //     e.preventDefault();

// // //     if (!to || !subject || !message) {
// // //       alert("Please fill in all fields.");
// // //       return;
// // //     }

// // //     if (!accessToken) {
// // //       alert("You must sign in with Google to send email.");
// // //       return;
// // //     }

// // //     setStatus("sending");

// // //     try {
// // //       await sendEmail({ to, subject, message, accessToken });
// // //       setStatus("sent");
// // //       setTo("");
// // //       setTimeout(() => setStatus("idle"), 3000);
// // //     } catch (error) {
// // //       console.error("Failed to send email:", error);
// // //       setStatus("error");
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
// // //         <div className="text-center space-y-4">
// // //           <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
// // //             <Mail className="h-8 w-8 text-blue-600 animate-pulse" />
// // //           </div>
// // //           <div>
// // //             <h3 className="text-lg font-semibold text-gray-900">
// // //               Loading Cover Letter
// // //             </h3>
// // //             <p className="text-gray-600 text-sm">Preparing your email...</p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (!coverLetter) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
// // //         <Card className="bg-white border-gray-200 text-center py-8">
// // //           <CardContent className="space-y-4">
// // //             <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
// // //               <Mail className="h-8 w-8 text-rose-600" />
// // //             </div>
// // //             <h3 className="text-lg font-semibold text-gray-900 mb-2">
// // //               Cover Letter Not Found
// // //             </h3>
// // //             <p className="text-gray-600">
// // //               The cover letter you're looking for doesn't exist.
// // //             </p>
// // //             <Button
// // //               onClick={() => router.back()}
// // //               className="bg-blue-600 hover:bg-blue-700 text-white"
// // //             >
// // //               Go Back
// // //             </Button>
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 py-8 sm:px-6 lg:px-8">
// // //       <div className="max-w-4xl mx-auto text-black">
// // //         {/* Header */}
// // //         <div className="mb-8">
// // //           <Button
// // //             variant="outline"
// // //             onClick={() => router.back()}
// // //             className="mb-6 border-gray-300 text-gray-700 hover:bg-gray-50"
// // //           >
// // //             <ArrowLeft className="h-4 w-4 mr-2" />
// // //             Back to Cover Letter
// // //           </Button>

// // //           <div className="flex items-center gap-4">
// // //             <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
// // //               <Send className="h-8 w-8 text-white" />
// // //             </div>
// // //             <div>
// // //               <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
// // //                 Send Email
// // //               </h1>
// // //               <p className="text-gray-600 mt-2 text-lg">
// // //                 Send your cover letter via Gmail
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //           {/* Email Form */}
// // //           <div className="lg:col-span-2">
// // //             <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
// // //               <CardHeader className="pb-4">
// // //                 <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
// // //                   <Mail className="h-5 w-5 text-green-600" /> Compose Email
// // //                 </CardTitle>
// // //                 <CardDescription className="text-gray-600">
// // //                   Send your cover letter for {coverLetter.jobTitle} at{" "}
// // //                   {coverLetter.companyName}
// // //                 </CardDescription>
// // //               </CardHeader>

// // //               <CardContent>
// // //                 {!accessToken ? (
// // //                   <Button
// // //                     onClick={handleGoogleSignIn}
// // //                     className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
// // //                   >
// // //                     Sign in with Google to Send Email
// // //                   </Button>
// // //                 ) : (
// // //                   <form onSubmit={handleSend} className="space-y-6">
// // //                     <div className="space-y-2">
// // //                       <Label
// // //                         htmlFor="to"
// // //                         className="text-sm font-semibold text-gray-900"
// // //                       >
// // //                         Recipient Email
// // //                       </Label>
// // //                       <Input
// // //                         id="to"
// // //                         type="email"
// // //                         placeholder="hr@company.com"
// // //                         value={to}
// // //                         onChange={(e) => setTo(e.target.value)}
// // //                         required
// // //                       />
// // //                     </div>

// // //                     <div className="space-y-2">
// // //                       <Label
// // //                         htmlFor="subject"
// // //                         className="text-sm font-semibold text-gray-900"
// // //                       >
// // //                         Subject Line
// // //                       </Label>
// // //                       <Input
// // //                         id="subject"
// // //                         type="text"
// // //                         value={subject}
// // //                         onChange={(e) => setSubject(e.target.value)}
// // //                         required
// // //                       />
// // //                     </div>

// // //                     <div className="space-y-2">
// // //                       <Label
// // //                         htmlFor="message"
// // //                         className="text-sm font-semibold text-gray-900"
// // //                       >
// // //                         Cover Letter Content
// // //                       </Label>
// // //                       <Textarea
// // //                         id="message"
// // //                         value={message}
// // //                         onChange={(e) => setMessage(e.target.value)}
// // //                         className="min-h-[300px] resize-vertical text-black"
// // //                         required
// // //                       />
// // //                     </div>

// // //                     <Button
// // //                       type="submit"
// // //                       disabled={status === "sending"}
// // //                       className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3"
// // //                     >
// // //                       {status === "sending" ? "Sending..." : "Send Email"}
// // //                     </Button>

// // //                     {status === "sent" && (
// // //                       <p className="text-green-700 font-semibold text-center mt-2">
// // //                         Email sent successfully!
// // //                       </p>
// // //                     )}
// // //                     {status === "error" && (
// // //                       <p className="text-red-700 font-semibold text-center mt-2">
// // //                         Failed to send email. Try again.
// // //                       </p>
// // //                     )}
// // //                   </form>
// // //                 )}
// // //               </CardContent>
// // //             </Card>
// // //           </div>

// // //           {/* Sidebar */}
// // //           <div className="space-y-6">
// // //             <Card className="bg-white border-gray-200 shadow-sm">
// // //               <CardHeader className="pb-3">
// // //                 <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
// // //                   <Briefcase className="h-5 w-5 text-blue-600" /> Job Details
// // //                 </CardTitle>
// // //               </CardHeader>
// // //               <CardContent className="space-y-3">
// // //                 <div>
// // //                   <p className="text-sm font-medium text-gray-700">Position</p>
// // //                   <p className="text-gray-900 font-semibold">
// // //                     {coverLetter.jobTitle}
// // //                   </p>
// // //                 </div>
// // //                 <div>
// // //                   <p className="text-sm font-medium text-gray-700">Company</p>
// // //                   <p className="text-gray-900 font-semibold flex items-center gap-1">
// // //                     <Building className="h-4 w-4 text-gray-500" />{" "}
// // //                     {coverLetter.companyName}
// // //                   </p>
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // "use client";

// // import { useEffect, useState, useRef } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import { getCoverLetter } from "@/actions/coverletter";
// // import {
// //   ArrowLeft,
// //   Mail,
// //   Send,
// //   Building,
// //   Briefcase,
// //   AlertCircle,
// //   CheckCircle,
// //   Loader2,
// //   XCircle,
// //   Info,
// //   Eye,
// //   Edit,
// //   X,
// //   Clock,
// //   FileText,
// //   ChevronRight,
// //   Save,
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Label } from "@/components/ui/label";
// // import { Alert, AlertDescription } from "@/components/ui/alert";
// // import { Progress } from "@/components/ui/progress";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Badge } from "@/components/ui/badge";

// // export default function SendEmailPage() {
// //   const { id } = useParams();
// //   const router = useRouter();
// //   const cancelRef = useRef(false);

// //   const [coverLetter, setCoverLetter] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [sending, setSending] = useState(false);
// //   const [isGmailConnected, setIsGmailConnected] = useState(false);
// //   const [checkingConnection, setCheckingConnection] = useState(true);
// //   const [userEmail, setUserEmail] = useState("");
// //   const [status, setStatus] = useState({ type: "", message: "" });
// //   const [sendResult, setSendResult] = useState(null);
// //   const [progress, setProgress] = useState(0);
// //   const [activeTab, setActiveTab] = useState("compose");
// //   const [isEditingPreview, setIsEditingPreview] = useState(false);

// //   // Email form fields
// //   const [recipientEmail, setRecipientEmail] = useState("");
// //   const [subject, setSubject] = useState("");
// //   const [salutation, setSalutation] = useState("Dear Hiring Manager,");
// //   const [closing, setClosing] = useState("Sincerely,");
// //   const [signature, setSignature] = useState("");

// //   // Preview edit state
// //   const [previewContent, setPreviewContent] = useState("");

// //   // Fetch cover letter
// //   useEffect(() => {
// //     async function fetchLetter() {
// //       try {
// //         const data = await getCoverLetter(id);
// //         setCoverLetter(data);
// //         setSubject(`Application for ${data.jobTitle} at ${data.companyName}`);
// //         setSignature(`\n\nBest regards,\n[Your Name]`);
// //         // Initialize preview content
// //         updatePreviewContent();
// //       } catch (error) {
// //         console.error("Failed to fetch cover letter:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //     fetchLetter();
// //     checkGmailConnection();
// //   }, [id]);

// //   // Update preview content when form fields change
// //   useEffect(() => {
// //     if (coverLetter) {
// //       updatePreviewContent();
// //     }
// //   }, [salutation, closing, signature]);

// //   // Check Gmail connection status
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

// //   // Validate email format
// //   const validateEmail = (email) => {
// //     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     return re.test(email);
// //   };

// //   // Update preview content from form fields
// //   const updatePreviewContent = () => {
// //     let content = "";

// //     // Add salutation
// //     content += `${salutation}\n\n`;

// //     // Add cover letter content
// //     if (coverLetter?.content) {
// //       content += `${coverLetter.content}\n\n`;
// //     }

// //     // Add closing and signature
// //     content += `${closing}${signature}`;

// //     setPreviewContent(content);
// //   };

// //   // Handle editing in preview mode
// //   const handlePreviewEdit = () => {
// //     setIsEditingPreview(true);
// //   };

// //   // Handle saving preview edits
// //   const handleSavePreviewEdits = () => {
// //     setIsEditingPreview(false);
// //     setStatus({
// //       type: "success",
// //       message: "Preview edits saved successfully!",
// //     });
// //   };

// //   // Format final email content (single body only)
// //   const getFinalEmailContent = () => {
// //     if (isEditingPreview) {
// //       // Use edited preview content
// //       return previewContent;
// //     } else {
// //       // Generate fresh content from form fields
// //       return previewContent;
// //     }
// //   };

// //   // Simulate progress for better UX
// //   const simulateProgress = () => {
// //     return new Promise((resolve) => {
// //       let currentProgress = 0;
// //       const interval = setInterval(() => {
// //         if (cancelRef.current) {
// //           clearInterval(interval);
// //           resolve(false);
// //           return;
// //         }

// //         currentProgress += 10;
// //         setProgress(Math.min(currentProgress, 90));

// //         if (currentProgress >= 90) {
// //           clearInterval(interval);
// //           resolve(true);
// //         }
// //       }, 200);
// //     });
// //   };

// //   // Handle sending email
// //   const handleSend = async () => {
// //     if (!isGmailConnected) {
// //       setStatus({
// //         type: "error",
// //         message: "Please connect your Gmail account first!",
// //       });
// //       return;
// //     }

// //     if (!recipientEmail.trim()) {
// //       setStatus({
// //         type: "error",
// //         message: "Please enter recipient email address",
// //       });
// //       return;
// //     }

// //     if (!validateEmail(recipientEmail)) {
// //       setStatus({
// //         type: "error",
// //         message: "Please enter a valid email address",
// //       });
// //       return;
// //     }

// //     if (!subject.trim()) {
// //       setStatus({
// //         type: "error",
// //         message: "Please enter email subject",
// //       });
// //       return;
// //     }

// //     cancelRef.current = false;
// //     setSending(true);
// //     setProgress(0);
// //     setStatus({ type: "info", message: "Preparing to send email..." });
// //     setSendResult(null);

// //     try {
// //       // Simulate progress
// //       const shouldContinue = await simulateProgress();
// //       if (!shouldContinue) {
// //         setStatus({ type: "info", message: "Email sending cancelled" });
// //         return;
// //       }

// //       const finalEmailContent = getFinalEmailContent();

// //       const res = await fetch("/api/send-single-email", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           letterId: id,
// //           recipientEmail,
// //           subject,
// //           // Send ONLY the final content, not additional fields
// //           emailContent: finalEmailContent,
// //         }),
// //       });

// //       const result = await res.json();

// //       if (res.ok) {
// //         setProgress(100);
// //         setSendResult(result);
// //         setStatus({
// //           type: "success",
// //           message: "Email sent successfully!",
// //         });

// //         // Reset form after successful send
// //         setTimeout(() => {
// //           setRecipientEmail("");
// //           setActiveTab("compose");
// //           setIsEditingPreview(false);
// //           updatePreviewContent();
// //         }, 2000);
// //       } else {
// //         setStatus({
// //           type: "error",
// //           message: result.error || "Failed to send email",
// //         });
// //       }
// //     } catch (err) {
// //       setStatus({
// //         type: "error",
// //         message: "Error sending email. Please try again.",
// //       });
// //     } finally {
// //       setSending(false);
// //       setTimeout(() => setProgress(0), 2000);
// //     }
// //   };

// //   // Cancel sending
// //   const handleCancel = () => {
// //     cancelRef.current = true;
// //     setSending(false);
// //     setProgress(0);
// //     setStatus({ type: "info", message: "Cancelling email send..." });
// //   };

// //   const handleConnectGmail = () => {
// //     window.location.href = "/api/google/auth";
// //   };

// //   const handleDiscardPreviewEdits = () => {
// //     setIsEditingPreview(false);
// //     updatePreviewContent(); // Reset to original
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
// //         <div className="text-center space-y-4">
// //           <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
// //             <Mail className="h-8 w-8 text-blue-600 animate-pulse" />
// //           </div>
// //           <div>
// //             <h3 className="text-lg font-semibold text-gray-900">
// //               Loading Cover Letter
// //             </h3>
// //             <p className="text-gray-600 text-sm">Preparing your email...</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!coverLetter) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
// //         <Card className="bg-white border-gray-200 text-center py-8">
// //           <CardContent className="space-y-4">
// //             <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
// //               <Mail className="h-8 w-8 text-rose-600" />
// //             </div>
// //             <h3 className="text-lg font-semibold text-gray-900 mb-2">
// //               Cover Letter Not Found
// //             </h3>
// //             <p className="text-gray-600">
// //               The cover letter you're looking for doesn't exist.
// //             </p>
// //             <Button
// //               onClick={() => router.back()}
// //               className="bg-blue-600 hover:bg-blue-700 text-white"
// //             >
// //               Go Back
// //             </Button>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 py-8 sm:px-6 lg:px-8">
// //       <div className="max-w-6xl mx-auto text-black">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <div className="flex items-center justify-between mb-6">
// //             <Button
// //               variant="outline"
// //               onClick={() => router.back()}
// //               className="border-gray-300 text-gray-700 hover:bg-gray-50"
// //             >
// //               <ArrowLeft className="h-4 w-4 mr-2" />
// //               Back to Cover Letter
// //             </Button>

// //             <div className="flex items-center gap-2">
// //               <Badge
// //                 variant={isGmailConnected ? "default" : "destructive"}
// //                 className="flex items-center gap-1"
// //               >
// //                 {isGmailConnected ? (
// //                   <>
// //                     <CheckCircle className="h-3 w-3" />
// //                     Gmail Connected
// //                   </>
// //                 ) : (
// //                   <>
// //                     <AlertCircle className="h-3 w-3" />
// //                     Gmail Disconnected
// //                   </>
// //                 )}
// //               </Badge>
// //             </div>
// //           </div>

// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-4">
// //               <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
// //                 <Send className="h-8 w-8 text-white" />
// //               </div>
// //               <div>
// //                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
// //                   Send Email
// //                 </h1>
// //                 <p className="text-gray-600 mt-2 text-lg">
// //                   Send your cover letter via Gmail
// //                 </p>
// //               </div>
// //             </div>

// //             <Button
// //               variant="outline"
// //               onClick={() => setIsEditingPreview(!isEditingPreview)}
// //               className="flex items-center gap-2"
// //             >
// //               {isEditingPreview ? (
// //                 <>
// //                   <Eye className="h-4 w-4" />
// //                   Preview Mode
// //                 </>
// //               ) : (
// //                 <>
// //                   <Edit className="h-4 w-4" />
// //                   Edit Mode
// //                 </>
// //               )}
// //             </Button>
// //           </div>
// //         </div>

// //         {/* Gmail Connection Status Card */}
// //         {!isGmailConnected && (
// //           <Card className="mb-6 border border-amber-200 bg-amber-50">
// //             <CardContent className="p-4">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-3">
// //                   <div className="p-2 rounded-lg bg-amber-100">
// //                     {checkingConnection ? (
// //                       <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
// //                     ) : (
// //                       <AlertCircle className="h-5 w-5 text-amber-600" />
// //                     )}
// //                   </div>
// //                   <div>
// //                     <h3 className="font-semibold text-gray-900">
// //                       {checkingConnection
// //                         ? "Checking connection..."
// //                         : "Gmail Not Connected"}
// //                     </h3>
// //                     <p className="text-sm text-gray-600">
// //                       Connect your Gmail account to send emails
// //                     </p>
// //                   </div>
// //                 </div>
// //                 {!checkingConnection && (
// //                   <Button
// //                     onClick={handleConnectGmail}
// //                     className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
// //                   >
// //                     <Mail className="h-4 w-4 mr-2" />
// //                     Connect Gmail
// //                   </Button>
// //                 )}
// //               </div>
// //             </CardContent>
// //           </Card>
// //         )}

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* Main Content */}
// //           <div className="lg:col-span-2">
// //             <Tabs
// //               value={activeTab}
// //               onValueChange={setActiveTab}
// //               className="w-full"
// //             >
// //               <TabsList className="grid grid-cols-3 mb-6">
// //                 <TabsTrigger
// //                   value="compose"
// //                   className="flex items-center gap-2"
// //                 >
// //                   <Edit className="h-4 w-4" />
// //                   Compose
// //                 </TabsTrigger>
// //                 <TabsTrigger
// //                   value="preview"
// //                   className="flex items-center gap-2"
// //                 >
// //                   <Eye className="h-4 w-4" />
// //                   Preview
// //                 </TabsTrigger>
// //                 <TabsTrigger
// //                   value="settings"
// //                   className="flex items-center gap-2"
// //                 >
// //                   <FileText className="h-4 w-4" />
// //                   Format
// //                 </TabsTrigger>
// //               </TabsList>

// //               <TabsContent value="compose" className="space-y-6">
// //                 <Card className="bg-white border-gray-200 shadow-lg">
// //                   <CardHeader>
// //                     <CardTitle className="text-xl font-bold text-gray-900">
// //                       Compose Email
// //                     </CardTitle>
// //                     <CardDescription>
// //                       Fill in recipient details and send your cover letter
// //                     </CardDescription>
// //                   </CardHeader>

// //                   <CardContent className="space-y-6">
// //                     {/* Recipient Email */}
// //                     <div className="space-y-2">
// //                       <Label
// //                         htmlFor="recipientEmail"
// //                         className="flex items-center gap-2"
// //                       >
// //                         <Mail className="h-4 w-4 text-blue-600" />
// //                         Email Address *
// //                       </Label>
// //                       <Input
// //                         id="recipientEmail"
// //                         type="email"
// //                         value={recipientEmail}
// //                         onChange={(e) => setRecipientEmail(e.target.value)}
// //                         placeholder="hr@company.com"
// //                         disabled={!isGmailConnected || sending}
// //                         required
// //                       />
// //                       {recipientEmail && !validateEmail(recipientEmail) && (
// //                         <p className="text-xs text-rose-600">
// //                           Invalid email format
// //                         </p>
// //                       )}
// //                     </div>

// //                     {/* Subject */}
// //                     <div className="space-y-2">
// //                       <Label htmlFor="subject">Subject Line *</Label>
// //                       <Input
// //                         id="subject"
// //                         value={subject}
// //                         onChange={(e) => setSubject(e.target.value)}
// //                         placeholder="Important: Application for [Position]"
// //                         disabled={!isGmailConnected || sending}
// //                         required
// //                       />
// //                     </div>

// //                     <div className="flex items-center justify-between pt-4">
// //                       <Button
// //                         type="button"
// //                         variant="outline"
// //                         onClick={() => setActiveTab("preview")}
// //                         className="flex items-center gap-2"
// //                       >
// //                         Preview Email
// //                         <ChevronRight className="h-4 w-4" />
// //                       </Button>

// //                       <div className="flex items-center gap-2">
// //                         <Button
// //                           type="button"
// //                           variant="outline"
// //                           onClick={() => {
// //                             setRecipientEmail("");
// //                             setSubject(
// //                               `Application for ${coverLetter.jobTitle} at ${coverLetter.companyName}`
// //                             );
// //                           }}
// //                           disabled={sending}
// //                         >
// //                           Clear
// //                         </Button>
// //                         <Button
// //                           onClick={handleSend}
// //                           disabled={
// //                             sending ||
// //                             !isGmailConnected ||
// //                             !recipientEmail ||
// //                             !validateEmail(recipientEmail) ||
// //                             !subject.trim()
// //                           }
// //                           className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
// //                         >
// //                           <Send className="h-4 w-4 mr-2" />
// //                           Send Email
// //                         </Button>
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </TabsContent>

// //               <TabsContent value="preview">
// //                 <Card className="bg-white border-gray-200 shadow-lg">
// //                   <CardHeader>
// //                     <div className="flex items-center justify-between">
// //                       <div>
// //                         <CardTitle className="text-xl font-bold text-gray-900">
// //                           Email Preview
// //                         </CardTitle>
// //                         <CardDescription>
// //                           {isEditingPreview
// //                             ? "Edit your email content directly"
// //                             : "Review your email before sending"}
// //                         </CardDescription>
// //                       </div>
// //                       {!isEditingPreview ? (
// //                         <Button
// //                           variant="outline"
// //                           onClick={handlePreviewEdit}
// //                           className="flex items-center gap-2"
// //                         >
// //                           <Edit className="h-4 w-4" />
// //                           Edit Content
// //                         </Button>
// //                       ) : (
// //                         <div className="flex items-center gap-2">
// //                           <Button
// //                             variant="outline"
// //                             onClick={handleDiscardPreviewEdits}
// //                             className="flex items-center gap-2"
// //                           >
// //                             <X className="h-4 w-4" />
// //                             Discard
// //                           </Button>
// //                           <Button
// //                             onClick={handleSavePreviewEdits}
// //                             className="bg-blue-600 hover:bg-blue-700 text-white"
// //                           >
// //                             <Save className="h-4 w-4 mr-2" />
// //                             Save
// //                           </Button>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </CardHeader>

// //                   <CardContent>
// //                     <div className="border rounded-lg bg-gray-50 p-6 space-y-4">
// //                       {/* Email Header */}
// //                       <div className="space-y-2 border-b pb-4">
// //                         <div className="flex justify-between text-sm">
// //                           <span className="text-gray-600">To:</span>
// //                           <span className="font-medium">
// //                             {recipientEmail || "No recipient"}
// //                           </span>
// //                         </div>
// //                         <div className="flex justify-between text-sm">
// //                           <span className="text-gray-600">Subject:</span>
// //                           <span className="font-medium">
// //                             {subject || "No subject"}
// //                           </span>
// //                         </div>
// //                       </div>

// //                       {/* Email Body Preview - Editable or Read-only */}
// //                       {isEditingPreview ? (
// //                         <div className="space-y-2">
// //                           <Label>Edit Email Content:</Label>
// //                           <Textarea
// //                             value={previewContent}
// //                             onChange={(e) => setPreviewContent(e.target.value)}
// //                             className="min-h-[300px] font-sans text-sm whitespace-pre-wrap"
// //                             placeholder="Edit your email content here..."
// //                           />
// //                           <p className="text-xs text-gray-500">
// //                             Make any final edits before sending
// //                           </p>
// //                         </div>
// //                       ) : (
// //                         <div className="bg-white p-4 rounded border min-h-[300px] whitespace-pre-wrap font-sans text-sm">
// //                           {previewContent ||
// //                             "Compose your email to see preview..."}
// //                         </div>
// //                       )}

// //                       {/* Email Stats */}
// //                       <div className="grid grid-cols-3 gap-4 pt-4 border-t text-sm">
// //                         <div className="text-center">
// //                           <div className="font-semibold text-gray-900">
// //                             {previewContent.length}
// //                           </div>
// //                           <div className="text-gray-600 text-xs">
// //                             Characters
// //                           </div>
// //                         </div>
// //                         <div className="text-center">
// //                           <div className="font-semibold text-gray-900">
// //                             {previewContent.split(/\s+/).length}
// //                           </div>
// //                           <div className="text-gray-600 text-xs">Words</div>
// //                         </div>
// //                         <div className="text-center">
// //                           <div className="font-semibold text-gray-900">
// //                             {previewContent.split("\n").length}
// //                           </div>
// //                           <div className="text-gray-600 text-xs">Lines</div>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <div className="flex items-center justify-between pt-6">
// //                       <Button
// //                         variant="outline"
// //                         onClick={() => setActiveTab("compose")}
// //                         className="flex items-center gap-2"
// //                       >
// //                         <Edit className="h-4 w-4" />
// //                         Back to Compose
// //                       </Button>

// //                       <Button
// //                         onClick={handleSend}
// //                         disabled={
// //                           sending ||
// //                           !isGmailConnected ||
// //                           !recipientEmail ||
// //                           !validateEmail(recipientEmail) ||
// //                           !subject.trim()
// //                         }
// //                         className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
// //                       >
// //                         <Send className="h-4 w-4 mr-2" />
// //                         Send Now
// //                       </Button>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </TabsContent>

// //               <TabsContent value="settings">
// //                 <Card className="bg-white border-gray-200 shadow-lg">
// //                   <CardHeader>
// //                     <CardTitle className="text-xl font-bold text-gray-900">
// //                       Email Format Settings
// //                     </CardTitle>
// //                     <CardDescription>
// //                       Customize email formatting and structure
// //                     </CardDescription>
// //                   </CardHeader>

// //                   <CardContent className="space-y-6">
// //                     {/* Salutation */}
// //                     <div className="space-y-2">
// //                       <Label htmlFor="salutation">Email Salutation</Label>
// //                       <Input
// //                         id="salutation"
// //                         value={salutation}
// //                         onChange={(e) => setSalutation(e.target.value)}
// //                         placeholder="Dear Hiring Manager,"
// //                       />
// //                       <p className="text-xs text-gray-500">
// //                         Standard opening for the email
// //                       </p>
// //                     </div>

// //                     {/* Closing */}
// //                     <div className="space-y-2">
// //                       <Label htmlFor="closing">Email Closing</Label>
// //                       <Input
// //                         id="closing"
// //                         value={closing}
// //                         onChange={(e) => setClosing(e.target.value)}
// //                         placeholder="Sincerely,"
// //                       />
// //                     </div>

// //                     {/* Signature */}
// //                     <div className="space-y-2">
// //                       <Label htmlFor="signature">Signature Template</Label>
// //                       <Textarea
// //                         id="signature"
// //                         value={signature}
// //                         onChange={(e) => setSignature(e.target.value)}
// //                         placeholder="Best regards,\n[Your Name]\n[Your Contact Info]"
// //                         className="min-h-[100px] font-mono text-sm"
// //                       />
// //                       <p className="text-xs text-gray-500">
// //                         Use placeholders like [Your Name] for personalization
// //                       </p>
// //                     </div>

// //                     <div className="pt-4">
// //                       <Button
// //                         variant="outline"
// //                         onClick={() => setActiveTab("preview")}
// //                         className="w-full"
// //                       >
// //                         Update Preview
// //                       </Button>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </TabsContent>
// //             </Tabs>

// //             {/* Sending Progress */}
// //             {sending && (
// //               <Card className="mt-6 border-blue-200 bg-blue-50">
// //                 <CardContent className="p-6">
// //                   <div className="space-y-4">
// //                     <div className="flex items-center justify-between">
// //                       <div className="flex items-center gap-3">
// //                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
// //                           <Clock className="h-5 w-5 text-blue-600" />
// //                         </div>
// //                         <div>
// //                           <h4 className="font-semibold text-gray-900">
// //                             Sending Email...
// //                           </h4>
// //                           <p className="text-sm text-gray-600">
// //                             Your email is being sent to {recipientEmail}
// //                           </p>
// //                         </div>
// //                       </div>
// //                       <div className="text-right">
// //                         <div className="text-2xl font-bold text-blue-600">
// //                           {progress}%
// //                         </div>
// //                         <div className="text-xs text-gray-500">Complete</div>
// //                       </div>
// //                     </div>

// //                     <Progress value={progress} className="h-2" />

// //                     <div className="flex justify-center gap-3">
// //                       <Button
// //                         onClick={handleCancel}
// //                         variant="outline"
// //                         className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
// //                       >
// //                         <X className="h-4 w-4 mr-2" />
// //                         Cancel Send
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}

// //             {/* Status Messages */}
// //             {status.message && !sending && (
// //               <Alert
// //                 className={`mt-6 ${
// //                   status.type === "success"
// //                     ? "bg-emerald-50 border-emerald-200 text-emerald-700"
// //                     : status.type === "error"
// //                     ? "bg-rose-50 border-rose-200 text-rose-700"
// //                     : "bg-blue-50 border-blue-200 text-blue-700"
// //                 }`}
// //               >
// //                 {status.type === "success" ? (
// //                   <CheckCircle className="h-4 w-4" />
// //                 ) : status.type === "error" ? (
// //                   <XCircle className="h-4 w-4" />
// //                 ) : (
// //                   <Info className="h-4 w-4" />
// //                 )}
// //                 <AlertDescription className="font-medium">
// //                   {status.message}
// //                 </AlertDescription>
// //               </Alert>
// //             )}

// //             {/* Send Results */}
// //             {sendResult && (
// //               <Card className="mt-6 border-emerald-200 bg-emerald-50">
// //                 <CardContent className="p-6">
// //                   <div className="flex items-center gap-4">
// //                     <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
// //                       <CheckCircle className="h-6 w-6 text-emerald-600" />
// //                     </div>
// //                     <div className="flex-1">
// //                       <h4 className="font-semibold text-gray-900 text-lg">
// //                         Email Sent Successfully!
// //                       </h4>
// //                       <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
// //                         <div>
// //                           <p className="text-gray-600">To</p>
// //                           <p className="font-medium">
// //                             {sendResult.recipientEmail}
// //                           </p>
// //                         </div>
// //                         <div>
// //                           <p className="text-gray-600">Subject</p>
// //                           <p className="font-medium">{sendResult.subject}</p>
// //                         </div>
// //                         <div>
// //                           <p className="text-gray-600">Sent At</p>
// //                           <p className="font-medium">
// //                             {new Date(sendResult.sentAt).toLocaleTimeString(
// //                               [],
// //                               {
// //                                 hour: "2-digit",
// //                                 minute: "2-digit",
// //                               }
// //                             )}
// //                           </p>
// //                         </div>
// //                         <div>
// //                           <p className="text-gray-600">Status</p>
// //                           <p className="font-medium text-emerald-600">
// //                             Delivered
// //                           </p>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}
// //           </div>

// //           {/* Sidebar */}
// //           <div className="space-y-6">
// //             {/* Job Details */}
// //             <Card className="bg-white border-gray-200 shadow-sm">
// //               <CardHeader className="pb-3">
// //                 <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
// //                   <Briefcase className="h-5 w-5 text-blue-600" />
// //                   Job Details
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="space-y-3">
// //                   <div>
// //                     <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
// //                       Position
// //                     </p>
// //                     <p className="text-gray-900 font-semibold text-lg">
// //                       {coverLetter.jobTitle}
// //                     </p>
// //                   </div>
// //                   <div>
// //                     <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
// //                       Company
// //                     </p>
// //                     <p className="text-gray-900 font-semibold flex items-center gap-2">
// //                       <Building className="h-4 w-4 text-gray-500" />
// //                       {coverLetter.companyName}
// //                     </p>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Cover Letter Preview */}
// //             <Card className="bg-white border-gray-200 shadow-sm">
// //               <CardHeader className="pb-3">
// //                 <CardTitle className="text-lg font-semibold text-gray-900">
// //                   Original Cover Letter
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-[250px] overflow-y-auto">
// //                   <div className="text-sm text-gray-600 whitespace-pre-line">
// //                     {coverLetter.content?.substring(0, 400)}
// //                     {coverLetter.content?.length > 400 ? "..." : ""}
// //                   </div>
// //                 </div>
// //                 <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
// //                   <Info className="h-3 w-3" />
// //                   This content is included in your email
// //                 </p>
// //               </CardContent>
// //             </Card>

// //             {/* Quick Actions */}
// //             <Card className="bg-blue-50 border-blue-200">
// //               <CardHeader className="pb-3">
// //                 <CardTitle className="text-lg font-semibold text-blue-900">
// //                   Quick Actions
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent className="space-y-3">
// //                 <Button
// //                   variant="outline"
// //                   onClick={() => router.push(`/cover-letters/${id}`)}
// //                   className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-100"
// //                 >
// //                   <FileText className="h-4 w-4 mr-2" />
// //                   Edit Cover Letter
// //                 </Button>

// //                 <Button
// //                   variant="outline"
// //                   onClick={() => {
// //                     setRecipientEmail("");
// //                     setSubject(
// //                       `Application for ${coverLetter.jobTitle} at ${coverLetter.companyName}`
// //                     );
// //                     updatePreviewContent();
// //                   }}
// //                   className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-100"
// //                 >
// //                   <X className="h-4 w-4 mr-2" />
// //                   Clear Form
// //                 </Button>

// //                 <Button
// //                   variant="outline"
// //                   onClick={() => {
// //                     setActiveTab("preview");
// //                     setIsEditingPreview(true);
// //                   }}
// //                   className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-100"
// //                 >
// //                   <Edit className="h-4 w-4 mr-2" />
// //                   Edit in Preview
// //                 </Button>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { getCoverLetter } from "@/actions/coverletter";
// import {
//   ArrowLeft,
//   Mail,
//   Send,
//   Building,
//   Briefcase,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
//   XCircle,
//   Info,
//   Eye,
//   Edit,
//   X,
//   Clock,
//   FileText,
//   ChevronRight,
//   Save,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";

// export default function SendEmailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const cancelRef = useRef(false);

//   const [coverLetter, setCoverLetter] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [isGmailConnected, setIsGmailConnected] = useState(false);
//   const [checkingConnection, setCheckingConnection] = useState(true);
//   const [userEmail, setUserEmail] = useState("");
//   const [status, setStatus] = useState({ type: "", message: "" });
//   const [sendResult, setSendResult] = useState(null);
//   const [progress, setProgress] = useState(0);
//   const [activeTab, setActiveTab] = useState("compose");
//   const [isEditingPreview, setIsEditingPreview] = useState(false);

//   // Email form fields
//   const [recipientEmail, setRecipientEmail] = useState("");
//   const [subject, setSubject] = useState("");
//   const [salutation, setSalutation] = useState("Dear Hiring Manager,");
//   const [closing, setClosing] = useState("Sincerely,");
//   const [signature, setSignature] = useState("\n\nBest regards,\n[Your Name]");
//   const [customMessage, setCustomMessage] = useState("");

//   // Preview edit state
//   const [previewContent, setPreviewContent] = useState("");

//   // Fetch cover letter
//   useEffect(() => {
//     async function fetchLetter() {
//       try {
//         const data = await getCoverLetter(id);
//         setCoverLetter(data);
//         setSubject(`Application for ${data.jobTitle} at ${data.companyName}`);

//         // Initialize preview content
//         updatePreviewContent();
//       } catch (error) {
//         console.error("Failed to fetch cover letter:", error);
//         setStatus({
//           type: "error",
//           message: "Failed to load cover letter. Please try again.",
//         });
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) {
//       fetchLetter();
//       checkGmailConnection();
//     }
//   }, [id]);

//   // Update preview content when form fields change
//   useEffect(() => {
//     if (coverLetter) {
//       updatePreviewContent();
//     }
//   }, [salutation, closing, signature, customMessage]);

//   // Check Gmail connection status
//   const checkGmailConnection = async () => {
//     try {
//       const response = await fetch("/api/google/status");
//       if (response.ok) {
//         const data = await response.json();
//         setIsGmailConnected(data.connected);
//         setUserEmail(data.email || "");
//       } else {
//         setIsGmailConnected(false);
//       }
//     } catch (error) {
//       console.error("Error checking Gmail connection:", error);
//       setIsGmailConnected(false);
//     } finally {
//       setCheckingConnection(false);
//     }
//   };

//   // Validate email format
//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   // Update preview content from form fields
//   const updatePreviewContent = () => {
//     if (!coverLetter?.content) return;

//     let content = "";

//     // Add salutation
//     content += `${salutation}\n\n`;

//     // Add custom message if provided
//     if (customMessage.trim()) {
//       content += `${customMessage}\n\n`;
//     }

//     // Add cover letter content
//     content += `${coverLetter.content}\n\n`;

//     // Add closing and signature
//     content += `${closing}${signature}`;

//     setPreviewContent(content);
//   };

//   // Handle editing in preview mode
//   const handlePreviewEdit = () => {
//     setIsEditingPreview(true);
//   };

//   // Handle saving preview edits
//   const handleSavePreviewEdits = () => {
//     setIsEditingPreview(false);
//     setStatus({
//       type: "success",
//       message: "Preview edits saved successfully!",
//     });
//   };

//   // Format final email content
//   const getFinalEmailContent = () => {
//     if (isEditingPreview) {
//       // Use edited preview content
//       return previewContent;
//     } else {
//       // Generate fresh content from form fields
//       return previewContent;
//     }
//   };

//   // Simulate progress for better UX
//   const simulateProgress = () => {
//     return new Promise((resolve) => {
//       let currentProgress = 0;
//       const interval = setInterval(() => {
//         if (cancelRef.current) {
//           clearInterval(interval);
//           resolve(false);
//           return;
//         }

//         currentProgress += 10;
//         setProgress(Math.min(currentProgress, 90));

//         if (currentProgress >= 90) {
//           clearInterval(interval);
//           resolve(true);
//         }
//       }, 200);
//     });
//   };

//   // Handle sending email
//   const handleSend = async () => {
//     // Validation checks
//     if (!isGmailConnected) {
//       setStatus({
//         type: "error",
//         message: "Please connect your Gmail account first!",
//       });
//       return;
//     }

//     if (!recipientEmail.trim()) {
//       setStatus({
//         type: "error",
//         message: "Please enter recipient email address",
//       });
//       return;
//     }

//     if (!validateEmail(recipientEmail)) {
//       setStatus({
//         type: "error",
//         message: "Please enter a valid email address",
//       });
//       return;
//     }

//     if (!subject.trim()) {
//       setStatus({
//         type: "error",
//         message: "Please enter email subject",
//       });
//       return;
//     }

//     cancelRef.current = false;
//     setSending(true);
//     setProgress(0);
//     setStatus({ type: "info", message: "Preparing to send email..." });
//     setSendResult(null);

//     try {
//       // Simulate progress
//       const shouldContinue = await simulateProgress();
//       if (!shouldContinue) {
//         setStatus({ type: "info", message: "Email sending cancelled" });
//         return;
//       }

//       const finalEmailContent = getFinalEmailContent();

//       // Send to API
//       const res = await fetch("/api/send-single-email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           letterId: id,
//           recipientEmail,
//           subject,
//           emailContent: finalEmailContent,
//           // Include all components for flexibility
//           salutation,
//           closing,
//           signature,
//           customMessage,
//         }),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         setProgress(100);
//         setSendResult(result);
//         setStatus({
//           type: "success",
//           message: "Email sent successfully!",
//         });

//         // Reset form after successful send
//         setTimeout(() => {
//           setRecipientEmail("");
//           setCustomMessage("");
//           setActiveTab("compose");
//           setIsEditingPreview(false);
//           updatePreviewContent();
//         }, 3000);
//       } else {
//         setStatus({
//           type: "error",
//           message: result.error || "Failed to send email",
//         });
//       }
//     } catch (err) {
//       console.error("Send error:", err);
//       setStatus({
//         type: "error",
//         message: "Error sending email. Please try again.",
//       });
//     } finally {
//       setSending(false);
//       setTimeout(() => setProgress(0), 2000);
//     }
//   };

//   // Cancel sending
//   const handleCancel = () => {
//     cancelRef.current = true;
//     setSending(false);
//     setProgress(0);
//     setStatus({ type: "info", message: "Cancelling email send..." });
//   };

//   const handleConnectGmail = () => {
//     window.location.href = "/api/google/auth";
//   };

//   const handleDiscardPreviewEdits = () => {
//     setIsEditingPreview(false);
//     updatePreviewContent(); // Reset to original
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
//             <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">
//               Loading Cover Letter
//             </h3>
//             <p className="text-gray-600 text-sm">Preparing your email...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!coverLetter) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
//         <Card className="bg-white border-gray-200 text-center py-8">
//           <CardContent className="space-y-4">
//             <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
//               <XCircle className="h-8 w-8 text-rose-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               Cover Letter Not Found
//             </h3>
//             <p className="text-gray-600">
//               The cover letter you're looking for doesn't exist.
//             </p>
//             <Button
//               onClick={() => router.back()}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               Go Back
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto text-black">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <Button
//               variant="outline"
//               onClick={() => router.back()}
//               className="border-gray-300 text-gray-700 hover:bg-gray-50"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Cover Letter
//             </Button>

//             <div className="flex items-center gap-2">
//               <Badge
//                 variant={isGmailConnected ? "default" : "destructive"}
//                 className="flex items-center gap-1"
//               >
//                 {isGmailConnected ? (
//                   <>
//                     <CheckCircle className="h-3 w-3" />
//                     Gmail Connected
//                   </>
//                 ) : (
//                   <>
//                     <AlertCircle className="h-3 w-3" />
//                     Gmail Disconnected
//                   </>
//                 )}
//               </Badge>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
//                 <Send className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
//                   Send Email
//                 </h1>
//                 <p className="text-gray-600 mt-2 text-lg">
//                   Send your cover letter via Gmail
//                 </p>
//               </div>
//             </div>

//             <Button
//               variant="outline"
//               onClick={() => setIsEditingPreview(!isEditingPreview)}
//               className="flex items-center gap-2"
//             >
//               {isEditingPreview ? (
//                 <>
//                   <Eye className="h-4 w-4" />
//                   Preview Mode
//                 </>
//               ) : (
//                 <>
//                   <Edit className="h-4 w-4" />
//                   Edit Mode
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Gmail Connection Status Card */}
//         {!isGmailConnected && !checkingConnection && (
//           <Card className="mb-6 border border-amber-200 bg-amber-50">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 rounded-lg bg-amber-100">
//                     <AlertCircle className="h-5 w-5 text-amber-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900">
//                       Gmail Not Connected
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       Connect your Gmail account to send emails
//                     </p>
//                   </div>
//                 </div>
//                 <Button
//                   onClick={handleConnectGmail}
//                   className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
//                 >
//                   <Mail className="h-4 w-4 mr-2" />
//                   Connect Gmail
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Content */}
//           <div className="lg:col-span-2">
//             <Tabs
//               value={activeTab}
//               onValueChange={setActiveTab}
//               className="w-full"
//             >
//               <TabsList className="grid grid-cols-3 mb-6">
//                 <TabsTrigger
//                   value="compose"
//                   className="flex items-center gap-2"
//                 >
//                   <Edit className="h-4 w-4" />
//                   Compose
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="preview"
//                   className="flex items-center gap-2"
//                 >
//                   <Eye className="h-4 w-4" />
//                   Preview
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="settings"
//                   className="flex items-center gap-2"
//                 >
//                   <FileText className="h-4 w-4" />
//                   Format
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="compose" className="space-y-6">
//                 <Card className="bg-white border-gray-200 shadow-lg">
//                   <CardHeader>
//                     <CardTitle className="text-xl font-bold text-gray-900">
//                       Compose Email
//                     </CardTitle>
//                     <CardDescription>
//                       Fill in recipient details and send your cover letter
//                     </CardDescription>
//                   </CardHeader>

//                   <CardContent className="space-y-6">
//                     {/* Recipient Email */}
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="recipientEmail"
//                         className="flex items-center gap-2"
//                       >
//                         <Mail className="h-4 w-4 text-blue-600" />
//                         Email Address *
//                       </Label>
//                       <Input
//                         id="recipientEmail"
//                         type="email"
//                         value={recipientEmail}
//                         onChange={(e) => setRecipientEmail(e.target.value)}
//                         placeholder="hr@company.com"
//                         disabled={!isGmailConnected || sending}
//                         required
//                       />
//                       {recipientEmail && !validateEmail(recipientEmail) && (
//                         <p className="text-xs text-rose-600">
//                           Invalid email format
//                         </p>
//                       )}
//                     </div>

//                     {/* Subject */}
//                     <div className="space-y-2">
//                       <Label htmlFor="subject">Subject Line *</Label>
//                       <Input
//                         id="subject"
//                         value={subject}
//                         onChange={(e) => setSubject(e.target.value)}
//                         placeholder="Important: Application for [Position]"
//                         disabled={!isGmailConnected || sending}
//                         required
//                       />
//                     </div>

//                     {/* Custom Message */}
//                     <div className="space-y-2">
//                       <Label htmlFor="customMessage">
//                         Additional Message (Optional)
//                       </Label>
//                       <Textarea
//                         id="customMessage"
//                         value={customMessage}
//                         onChange={(e) => setCustomMessage(e.target.value)}
//                         placeholder="Add a personal note or introduction..."
//                         className="min-h-[100px]"
//                         disabled={!isGmailConnected || sending}
//                       />
//                       <p className="text-xs text-gray-500">
//                         This will be added before your cover letter content
//                       </p>
//                     </div>

//                     <div className="flex items-center justify-between pt-4">
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={() => setActiveTab("preview")}
//                         className="flex items-center gap-2"
//                       >
//                         Preview Email
//                         <ChevronRight className="h-4 w-4" />
//                       </Button>

//                       <div className="flex items-center gap-2">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => {
//                             setRecipientEmail("");
//                             setCustomMessage("");
//                             setSubject(
//                               `Application for ${coverLetter.jobTitle} at ${coverLetter.companyName}`
//                             );
//                           }}
//                           disabled={sending}
//                         >
//                           Clear
//                         </Button>
//                         <Button
//                           onClick={handleSend}
//                           disabled={
//                             sending ||
//                             !isGmailConnected ||
//                             !recipientEmail ||
//                             !validateEmail(recipientEmail) ||
//                             !subject.trim()
//                           }
//                           className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
//                         >
//                           <Send className="h-4 w-4 mr-2" />
//                           Send Email
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="preview">
//                 <Card className="bg-white border-gray-200 shadow-lg">
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <CardTitle className="text-xl font-bold text-gray-900">
//                           Email Preview
//                         </CardTitle>
//                         <CardDescription>
//                           {isEditingPreview
//                             ? "Edit your email content directly"
//                             : "Review your email before sending"}
//                         </CardDescription>
//                       </div>
//                       {!isEditingPreview ? (
//                         <Button
//                           variant="outline"
//                           onClick={handlePreviewEdit}
//                           className="flex items-center gap-2"
//                           disabled={!previewContent}
//                         >
//                           <Edit className="h-4 w-4" />
//                           Edit Content
//                         </Button>
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           <Button
//                             variant="outline"
//                             onClick={handleDiscardPreviewEdits}
//                             className="flex items-center gap-2"
//                           >
//                             <X className="h-4 w-4" />
//                             Discard
//                           </Button>
//                           <Button
//                             onClick={handleSavePreviewEdits}
//                             className="bg-blue-600 hover:bg-blue-700 text-white"
//                           >
//                             <Save className="h-4 w-4 mr-2" />
//                             Save
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </CardHeader>

//                   <CardContent>
//                     <div className="border rounded-lg bg-gray-50 p-6 space-y-4">
//                       {/* Email Header */}
//                       <div className="space-y-2 border-b pb-4">
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-600">To:</span>
//                           <span className="font-medium">
//                             {recipientEmail || "No recipient"}
//                           </span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-600">Subject:</span>
//                           <span className="font-medium">
//                             {subject || "No subject"}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Email Body Preview - Editable or Read-only */}
//                       {isEditingPreview ? (
//                         <div className="space-y-2">
//                           <Label>Edit Email Content:</Label>
//                           <Textarea
//                             value={previewContent}
//                             onChange={(e) => setPreviewContent(e.target.value)}
//                             className="min-h-[400px] font-sans text-sm whitespace-pre-wrap"
//                             placeholder="Edit your email content here..."
//                           />
//                           <p className="text-xs text-gray-500">
//                             Make any final edits before sending
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="bg-white p-4 rounded border min-h-[400px] whitespace-pre-wrap font-sans text-sm leading-relaxed">
//                           {previewContent || (
//                             <div className="text-gray-500 italic">
//                               Compose your email to see preview...
//                             </div>
//                           )}
//                         </div>
//                       )}

//                       {/* Email Stats */}
//                       <div className="grid grid-cols-3 gap-4 pt-4 border-t text-sm">
//                         <div className="text-center">
//                           <div className="font-semibold text-gray-900">
//                             {previewContent.length}
//                           </div>
//                           <div className="text-gray-600 text-xs">
//                             Characters
//                           </div>
//                         </div>
//                         <div className="text-center">
//                           <div className="font-semibold text-gray-900">
//                             {previewContent.split(/\s+/).filter(Boolean).length}
//                           </div>
//                           <div className="text-gray-600 text-xs">Words</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="font-semibold text-gray-900">
//                             {previewContent.split("\n").filter(Boolean).length}
//                           </div>
//                           <div className="text-gray-600 text-xs">Lines</div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between pt-6">
//                       <Button
//                         variant="outline"
//                         onClick={() => setActiveTab("compose")}
//                         className="flex items-center gap-2"
//                       >
//                         <Edit className="h-4 w-4" />
//                         Back to Compose
//                       </Button>

//                       <Button
//                         onClick={handleSend}
//                         disabled={
//                           sending ||
//                           !isGmailConnected ||
//                           !recipientEmail ||
//                           !validateEmail(recipientEmail) ||
//                           !subject.trim() ||
//                           !previewContent.trim()
//                         }
//                         className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
//                       >
//                         <Send className="h-4 w-4 mr-2" />
//                         Send Now
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="settings">
//                 <Card className="bg-white border-gray-200 shadow-lg">
//                   <CardHeader>
//                     <CardTitle className="text-xl font-bold text-gray-900">
//                       Email Format Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Customize email formatting and structure
//                     </CardDescription>
//                   </CardHeader>

//                   <CardContent className="space-y-6">
//                     {/* Salutation */}
//                     <div className="space-y-2">
//                       <Label htmlFor="salutation">Email Salutation</Label>
//                       <Input
//                         id="salutation"
//                         value={salutation}
//                         onChange={(e) => setSalutation(e.target.value)}
//                         placeholder="Dear Hiring Manager,"
//                         disabled={sending}
//                       />
//                       <p className="text-xs text-gray-500">
//                         Standard opening for the email
//                       </p>
//                     </div>

//                     {/* Closing */}
//                     <div className="space-y-2">
//                       <Label htmlFor="closing">Email Closing</Label>
//                       <Input
//                         id="closing"
//                         value={closing}
//                         onChange={(e) => setClosing(e.target.value)}
//                         placeholder="Sincerely,"
//                         disabled={sending}
//                       />
//                     </div>

//                     {/* Signature */}
//                     <div className="space-y-2">
//                       <Label htmlFor="signature">Signature Template</Label>
//                       <Textarea
//                         id="signature"
//                         value={signature}
//                         onChange={(e) => setSignature(e.target.value)}
//                         placeholder="Best regards,\n[Your Name]\n[Your Contact Info]"
//                         className="min-h-[100px] font-mono text-sm"
//                         disabled={sending}
//                       />
//                       <p className="text-xs text-gray-500">
//                         Use placeholders like [Your Name] for personalization
//                       </p>
//                     </div>

//                     <div className="pt-4">
//                       <Button
//                         onClick={() => {
//                           updatePreviewContent();
//                           setActiveTab("preview");
//                           setStatus({
//                             type: "success",
//                             message: "Format updated successfully!",
//                           });
//                         }}
//                         className="w-full"
//                         disabled={sending}
//                       >
//                         Update Preview
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>

//             {/* Sending Progress */}
//             {sending && (
//               <Card className="mt-6 border-blue-200 bg-blue-50">
//                 <CardContent className="p-6">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                           <Clock className="h-5 w-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-gray-900">
//                             Sending Email...
//                           </h4>
//                           <p className="text-sm text-gray-600">
//                             Your email is being sent to {recipientEmail}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-2xl font-bold text-blue-600">
//                           {progress}%
//                         </div>
//                         <div className="text-xs text-gray-500">Complete</div>
//                       </div>
//                     </div>

//                     <Progress value={progress} className="h-2" />

//                     <div className="flex justify-center gap-3">
//                       <Button
//                         onClick={handleCancel}
//                         variant="outline"
//                         className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
//                       >
//                         <X className="h-4 w-4 mr-2" />
//                         Cancel Send
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Status Messages */}
//             {status.message && !sending && (
//               <Alert
//                 className={`mt-6 ${
//                   status.type === "success"
//                     ? "bg-emerald-50 border-emerald-200 text-emerald-700"
//                     : status.type === "error"
//                     ? "bg-rose-50 border-rose-200 text-rose-700"
//                     : "bg-blue-50 border-blue-200 text-blue-700"
//                 }`}
//               >
//                 {status.type === "success" ? (
//                   <CheckCircle className="h-4 w-4" />
//                 ) : status.type === "error" ? (
//                   <XCircle className="h-4 w-4" />
//                 ) : (
//                   <Info className="h-4 w-4" />
//                 )}
//                 <AlertDescription className="font-medium">
//                   {status.message}
//                 </AlertDescription>
//               </Alert>
//             )}

//             {/* Send Results */}
//             {sendResult && (
//               <Card className="mt-6 border-emerald-200 bg-emerald-50">
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
//                       <CheckCircle className="h-6 w-6 text-emerald-600" />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-semibold text-gray-900 text-lg">
//                         Email Sent Successfully!
//                       </h4>
//                       <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
//                         <div>
//                           <p className="text-gray-600">To</p>
//                           <p className="font-medium">
//                             {sendResult.recipientEmail}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-600">Subject</p>
//                           <p className="font-medium">{sendResult.subject}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-600">Sent At</p>
//                           <p className="font-medium">
//                             {new Date(sendResult.sentAt).toLocaleTimeString(
//                               [],
//                               {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               }
//                             )}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-600">Status</p>
//                           <p className="font-medium text-emerald-600">
//                             Delivered
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Job Details */}
//             <Card className="bg-white border-gray-200 shadow-sm">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   <Briefcase className="h-5 w-5 text-blue-600" />
//                   Job Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-3">
//                   <div>
//                     <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
//                       Position
//                     </p>
//                     <p className="text-gray-900 font-semibold text-lg">
//                       {coverLetter.jobTitle}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
//                       Company
//                     </p>
//                     <p className="text-gray-900 font-semibold flex items-center gap-2">
//                       <Building className="h-4 w-4 text-gray-500" />
//                       {coverLetter.companyName}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Cover Letter Preview */}
//             <Card className="bg-white border-gray-200 shadow-sm">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg font-semibold text-gray-900">
//                   Original Cover Letter
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-[250px] overflow-y-auto">
//                   <div className="text-sm text-gray-600 whitespace-pre-line">
//                     {coverLetter.content?.substring(0, 400)}
//                     {coverLetter.content?.length > 400 ? "..." : ""}
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
//                   <Info className="h-3 w-3" />
//                   This content is included in your email
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Quick Actions */}
//             <Card className="bg-blue-50 border-blue-200">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg font-semibold text-blue-900">
//                   Quick Actions
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => router.push(`/ai-cover-letter/${id}`)}
//                   className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-100"
//                 >
//                   <FileText className="h-4 w-4 mr-2" />
//                   Edit Cover Letter
//                 </Button>

//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setRecipientEmail("");
//                     setCustomMessage("");
//                     setSubject(
//                       `Application for ${coverLetter.jobTitle} at ${coverLetter.companyName}`
//                     );
//                     updatePreviewContent();
//                   }}
//                   className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-100"
//                 >
//                   <X className="h-4 w-4 mr-2" />
//                   Clear Form
//                 </Button>

//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setActiveTab("preview");
//                     setIsEditingPreview(true);
//                   }}
//                   className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-100"
//                   disabled={!previewContent}
//                 >
//                   <Edit className="h-4 w-4 mr-2" />
//                   Edit in Preview
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCoverLetter } from "@/actions/coverletter";
import {
  ArrowLeft,
  Mail,
  Send,
  Building,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Loader2,
  XCircle,
  Info,
  Eye,
  Edit,
  X,
  Clock,
  FileText,
  ChevronRight,
  Save,
  Copy,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function SendEmailPage() {
  const { id } = useParams();
  const router = useRouter();
  const cancelRef = useRef(false);

  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sendResult, setSendResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("compose");
  const [isEditingPreview, setIsEditingPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  // Email form fields
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientCompany, setRecipientCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [salutation, setSalutation] = useState("Dear Hiring Manager,");
  const [closing, setClosing] = useState("Sincerely,");
  const [signature, setSignature] = useState("\n\nBest regards,\n[Your Name]");
  const [customMessage, setCustomMessage] = useState("");

  // Preview edit state
  const [previewContent, setPreviewContent] = useState("");

  // Fetch cover letter
  useEffect(() => {
    async function fetchLetter() {
      try {
        const data = await getCoverLetter(id);
        if (!data) {
          throw new Error("Cover letter not found");
        }
        setCoverLetter(data);
        setSubject(`Application for ${data.jobTitle} at ${data.companyName}`);
        setRecipientCompany(data.companyName);

        // Initialize preview content
        updatePreviewContent();
      } catch (error) {
        console.error("Failed to fetch cover letter:", error);
        setStatus({
          type: "error",
          message: "Failed to load cover letter. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchLetter();
      checkGmailConnection();
    }
  }, [id]);

  // Update preview content when form fields change
  useEffect(() => {
    if (coverLetter) {
      updatePreviewContent();
    }
  }, [salutation, closing, signature, customMessage]);

  // Check Gmail connection status
  const checkGmailConnection = async () => {
    try {
      const response = await fetch("/api/google/status");
      if (response.ok) {
        const data = await response.json();
        setIsGmailConnected(data.connected);
        setUserEmail(data.email || "");
      } else {
        setIsGmailConnected(false);
      }
    } catch (error) {
      console.error("Error checking Gmail connection:", error);
      setIsGmailConnected(false);
    } finally {
      setCheckingConnection(false);
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Update preview content from form fields
  const updatePreviewContent = () => {
    if (!coverLetter?.content) return;

    let content = "";

    // Add salutation with recipient name if available
    let salutationText = salutation;
    if (recipientName && salutation.includes("Hiring Manager")) {
      salutationText = salutation.replace("Hiring Manager", recipientName);
    }
    content += `${salutationText}\n\n`;

    // Add custom message if provided
    if (customMessage.trim()) {
      content += `${customMessage}\n\n`;
    }

    // Add cover letter content
    content += `${coverLetter.content}\n\n`;

    // Add closing and signature
    content += `${closing}${signature}`;

    setPreviewContent(content);
  };

  // Copy preview content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(previewContent)
      .then(() => {
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  // Handle editing in preview mode
  const handlePreviewEdit = () => {
    setIsEditingPreview(true);
  };

  // Handle saving preview edits
  const handleSavePreviewEdits = () => {
    setIsEditingPreview(false);
    toast.success("Preview edits saved!");
  };

  // Format final email content
  const getFinalEmailContent = () => {
    if (isEditingPreview) {
      return previewContent;
    } else {
      return previewContent;
    }
  };

  // Simulate progress for better UX
  const simulateProgress = () => {
    return new Promise((resolve) => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        if (cancelRef.current) {
          clearInterval(interval);
          resolve(false);
          return;
        }

        currentProgress += 10;
        setProgress(Math.min(currentProgress, 90));

        if (currentProgress >= 90) {
          clearInterval(interval);
          resolve(true);
        }
      }, 200);
    });
  };

  // Handle sending email
  const handleSend = async () => {
    // Validation checks
    if (!isGmailConnected) {
      toast.error("Please connect your Gmail account first!");
      return;
    }

    if (!recipientEmail.trim()) {
      toast.error("Please enter recipient email address");
      return;
    }

    if (!validateEmail(recipientEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!subject.trim()) {
      toast.error("Please enter email subject");
      return;
    }

    cancelRef.current = false;
    setSending(true);
    setProgress(0);
    toast.info("Preparing to send email...");
    setSendResult(null);

    try {
      // Simulate progress
      const shouldContinue = await simulateProgress();
      if (!shouldContinue) {
        toast.info("Email sending cancelled");
        return;
      }

      const finalEmailContent = getFinalEmailContent();

      // Send to API
      const res = await fetch("/api/send-single-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          letterId: id,
          recipientEmail,
          recipientName,
          recipientCompany,
          subject,
          emailContent: finalEmailContent,
          salutation,
          closing,
          signature,
          customMessage,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setProgress(100);
        setSendResult(result);
        toast.success("Email sent successfully!");

        // Reset form after successful send
        setTimeout(() => {
          setRecipientEmail("");
          setRecipientName("");
          setCustomMessage("");
          setActiveTab("compose");
          setIsEditingPreview(false);
          updatePreviewContent();
        }, 3000);
      } else {
        toast.error(result.error || "Failed to send email");
      }
    } catch (err) {
      console.error("Send error:", err);
      toast.error("Error sending email. Please try again.");
    } finally {
      setSending(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  // Cancel sending
  const handleCancel = () => {
    cancelRef.current = true;
    setSending(false);
    setProgress(0);
    toast.info("Cancelling email send...");
  };

  const handleConnectGmail = () => {
    window.location.href = "/api/google/auth";
  };

  const handleDiscardPreviewEdits = () => {
    setIsEditingPreview(false);
    updatePreviewContent();
    toast.info("Edits discarded");
  };

  const handleResetForm = () => {
    setRecipientEmail("");
    setRecipientName("");
    setRecipientCompany(coverLetter?.companyName || "");
    setCustomMessage("");
    setSubject(
      coverLetter
        ? `Application for ${coverLetter.jobTitle} at ${coverLetter.companyName}`
        : ""
    );
    updatePreviewContent();
    toast.info("Form reset");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <Card className="bg-white border-gray-200 text-center py-8">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cover Letter Not Found
            </h3>
            <p className="text-gray-600">
              The cover letter you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-black">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => router.push(`/ai-cover-letter/${id}`)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cover Letter
            </Button>

            <div className="flex items-center gap-3">
              <Badge
                variant={isGmailConnected ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {isGmailConnected ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Gmail Connected
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    Gmail Disconnected
                  </>
                )}
              </Badge>
              {userEmail && (
                <Badge variant="outline" className="text-xs">
                  {userEmail}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Send className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Send Email
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Send your cover letter via Gmail
                </p>
              </div>
            </div>

            {previewContent && (
              <Button
                variant="outline"
                onClick={() => setIsEditingPreview(!isEditingPreview)}
                className="flex items-center gap-2"
              >
                {isEditingPreview ? (
                  <>
                    <Eye className="h-4 w-4" />
                    Preview Mode
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit Mode
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Gmail Connection Status Card */}
        {!isGmailConnected && !checkingConnection && (
          <Card className="mb-6 border border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Gmail Not Connected
                    </h3>
                    <p className="text-sm text-gray-600">
                      Connect your Gmail account to send emails
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleConnectGmail}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Connect Gmail
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger
                  value="compose"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Compose
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Format
                </TabsTrigger>
              </TabsList>

              <TabsContent value="compose" className="space-y-6">
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Compose Email
                    </CardTitle>
                    <CardDescription>
                      Fill in recipient details and send your cover letter
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Recipient Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientName" className="text-sm">
                          Recipient Name (Optional)
                        </Label>
                        <Input
                          id="recipientName"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="John Doe"
                          disabled={!isGmailConnected || sending}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recipientEmail" className="text-sm">
                          Email Address *
                        </Label>
                        <Input
                          id="recipientEmail"
                          type="email"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          placeholder="hr@company.com"
                          disabled={!isGmailConnected || sending}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recipientCompany" className="text-sm">
                          Company
                        </Label>
                        <Input
                          id="recipientCompany"
                          value={recipientCompany}
                          onChange={(e) => setRecipientCompany(e.target.value)}
                          placeholder="Company Name"
                          disabled={!isGmailConnected || sending}
                        />
                      </div>
                    </div>

                    {recipientEmail && !validateEmail(recipientEmail) && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Please enter a valid email address
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject Line *</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Important: Application for [Position]"
                        disabled={!isGmailConnected || sending}
                        required
                      />
                    </div>

                    {/* Custom Message */}
                    <div className="space-y-2">
                      <Label htmlFor="customMessage">
                        Additional Message (Optional)
                      </Label>
                      <Textarea
                        id="customMessage"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Add a personal note or introduction..."
                        className="min-h-[120px]"
                        disabled={!isGmailConnected || sending}
                      />
                      <p className="text-xs text-gray-500">
                        This will be added before your cover letter content
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("preview")}
                        className="flex items-center gap-2"
                        disabled={
                          !recipientEmail || !validateEmail(recipientEmail)
                        }
                      >
                        Preview Email
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleResetForm}
                          disabled={sending}
                        >
                          Reset Form
                        </Button>
                        <Button
                          onClick={handleSend}
                          disabled={
                            sending ||
                            !isGmailConnected ||
                            !recipientEmail ||
                            !validateEmail(recipientEmail) ||
                            !subject.trim()
                          }
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview">
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                          Email Preview
                        </CardTitle>
                        <CardDescription>
                          {isEditingPreview
                            ? "Edit your email content directly"
                            : "Review your email before sending"}
                        </CardDescription>
                      </div>
                      {!isEditingPreview ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            className="flex items-center gap-1"
                          >
                            {copied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handlePreviewEdit}
                            className="flex items-center gap-2"
                            disabled={!previewContent}
                          >
                            <Edit className="h-4 w-4" />
                            Edit Content
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={handleDiscardPreviewEdits}
                            className="flex items-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            Discard
                          </Button>
                          <Button
                            onClick={handleSavePreviewEdits}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="border rounded-lg bg-gray-50 p-6 space-y-4">
                      {/* Email Header */}
                      <div className="space-y-2 border-b pb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">To:</span>
                          <span className="font-medium">
                            {recipientEmail || "No recipient"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subject:</span>
                          <span className="font-medium">
                            {subject || "No subject"}
                          </span>
                        </div>
                      </div>

                      {/* Email Body Preview */}
                      {isEditingPreview ? (
                        <div className="space-y-2">
                          <Label>Edit Email Content:</Label>
                          <Textarea
                            value={previewContent}
                            onChange={(e) => setPreviewContent(e.target.value)}
                            className="min-h-[400px] font-sans text-sm whitespace-pre-wrap"
                            placeholder="Edit your email content here..."
                          />
                          <p className="text-xs text-gray-500">
                            Make any final edits before sending
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded border min-h-[400px] whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {previewContent || (
                            <div className="text-gray-500 italic flex items-center justify-center h-full">
                              Complete the form to see preview...
                            </div>
                          )}
                        </div>
                      )}

                      {/* Email Stats */}
                      {previewContent && (
                        <div className="grid grid-cols-4 gap-4 pt-4 border-t text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">
                              {previewContent.length}
                            </div>
                            <div className="text-gray-600 text-xs">
                              Characters
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">
                              {
                                previewContent.split(/\s+/).filter(Boolean)
                                  .length
                              }
                            </div>
                            <div className="text-gray-600 text-xs">Words</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">
                              {
                                previewContent.split("\n").filter(Boolean)
                                  .length
                              }
                            </div>
                            <div className="text-gray-600 text-xs">Lines</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">
                              {Math.ceil(
                                previewContent.split(/\s+/).filter(Boolean)
                                  .length / 200
                              )}
                            </div>
                            <div className="text-gray-600 text-xs">
                              Est. Read (mins)
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("compose")}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Back to Compose
                      </Button>

                      <Button
                        onClick={handleSend}
                        disabled={
                          sending ||
                          !isGmailConnected ||
                          !recipientEmail ||
                          !validateEmail(recipientEmail) ||
                          !subject.trim() ||
                          !previewContent.trim()
                        }
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Email Format Settings
                    </CardTitle>
                    <CardDescription>
                      Customize email formatting and structure
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Salutation */}
                    <div className="space-y-2">
                      <Label htmlFor="salutation">Email Salutation</Label>
                      <Input
                        id="salutation"
                        value={salutation}
                        onChange={(e) => setSalutation(e.target.value)}
                        placeholder="Dear Hiring Manager,"
                        disabled={sending}
                      />
                      <p className="text-xs text-gray-500">
                        Use [Name] placeholder to auto-replace with recipient
                        name
                      </p>
                    </div>

                    {/* Closing */}
                    <div className="space-y-2">
                      <Label htmlFor="closing">Email Closing</Label>
                      <Input
                        id="closing"
                        value={closing}
                        onChange={(e) => setClosing(e.target.value)}
                        placeholder="Sincerely,"
                        disabled={sending}
                      />
                    </div>

                    {/* Signature */}
                    <div className="space-y-2">
                      <Label htmlFor="signature">Signature Template</Label>
                      <Textarea
                        id="signature"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        placeholder="Best regards,\n[Your Name]\n[Your Title]\n[Your Contact Info]"
                        className="min-h-[120px] font-mono text-sm"
                        disabled={sending}
                      />
                      <p className="text-xs text-gray-500">
                        Use placeholders like [Your Name] for personalization
                      </p>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button
                        onClick={() => {
                          setSalutation("Dear Hiring Manager,");
                          setClosing("Sincerely,");
                          setSignature("\n\nBest regards,\n[Your Name]");
                          toast.success("Format reset to default");
                        }}
                        variant="outline"
                        className="flex-1"
                        disabled={sending}
                      >
                        Reset to Default
                      </Button>
                      <Button
                        onClick={() => {
                          updatePreviewContent();
                          setActiveTab("preview");
                          toast.success("Format updated!");
                        }}
                        className="flex-1"
                        disabled={sending}
                      >
                        Update Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Sending Progress */}
            {sending && (
              <Card className="mt-6 border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Sending Email...
                          </h4>
                          <p className="text-sm text-gray-600">
                            Your email is being sent to {recipientEmail}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {progress}%
                        </div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>

                    <Progress value={progress} className="h-2" />

                    <div className="flex justify-center gap-3">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Send Results */}
            {sendResult && (
              <Card className="mt-6 border-emerald-200 bg-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        Email Sent Successfully!
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-600">To</p>
                          <p className="font-medium truncate">
                            {sendResult.recipientEmail}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Subject</p>
                          <p className="font-medium truncate">
                            {sendResult.subject}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Sent At</p>
                          <p className="font-medium">
                            {new Date(sendResult.sentAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <p className="font-medium text-emerald-600">
                            Delivered
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/campaigns/${sendResult.campaignId}`
                            )
                          }
                          className="text-xs"
                        >
                          View Email Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Details */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Position
                    </p>
                    <p className="text-gray-900 font-semibold text-lg">
                      {coverLetter.jobTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Company
                    </p>
                    <p className="text-gray-900 font-semibold flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      {coverLetter.companyName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Created
                    </p>
                    <p className="text-gray-900 text-sm">
                      {new Date(coverLetter.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter Preview */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Original Cover Letter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-[200px] overflow-y-auto">
                  <div className="text-sm text-gray-600 whitespace-pre-line">
                    {coverLetter.content?.substring(0, 300)}
                    {coverLetter.content?.length > 300 ? "..." : ""}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  This content is included in your email
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-blue-900">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/ai-cover-letter/${id}`)}
                  className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Cover Letter
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/ai-cover-letter/email")}
                  className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Bulk Email
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab("preview");
                    setIsEditingPreview(true);
                  }}
                  className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-100"
                  disabled={!previewContent}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit in Preview
                </Button>

                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-100"
                  disabled={!previewContent}
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Copy to Clipboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}