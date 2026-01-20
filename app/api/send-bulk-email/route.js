// // // // import { db } from "@/lib/prisma";
// // // // import { auth } from "@clerk/nextjs/server";
// // // // import { getGmailService } from "@/lib/google";

// // // // // helper to create Gmail raw email
// // // // function createEmail(to, subject, message) {
// // // //   const email = [
// // // //     `To: ${to}`,
// // // //     `Subject: ${subject}`,
// // // //     "Content-Type: text/html; charset=UTF-8",
// // // //     "",
// // // //     message,
// // // //   ].join("\n");

// // // //   return Buffer.from(email)
// // // //     .toString("base64")
// // // //     .replace(/\+/g, "-")
// // // //     .replace(/\//g, "_")
// // // //     .replace(/=+$/, "");
// // // // }

// // // // export async function POST(req) {
// // // //   try {
// // // //     const { userId } = await auth();
// // // //     if (!userId)
// // // //       return Response.json({ error: "Unauthorized" }, { status: 401 });

// // // //     const body = await req.json();
// // // //     const { emails, letterId } = body;

// // // //     if (!emails || !letterId) {
// // // //       return Response.json({ error: "Missing fields" }, { status: 400 });
// // // //     }

// // // //     // get refresh token
// // // //     const user = await db.user.findUnique({
// // // //       where: { clerkUserId: userId },
// // // //       select: { refreshToken: true, canSendEmail: true },
// // // //     });

// // // //     if (!user?.refreshToken) {
// // // //       return Response.json({ error: "Gmail not connected" }, { status: 400 });
// // // //     }

// // // //     // fetch cover letter
// // // //     const letter = await db.coverLetter.findUnique({
// // // //       where: { id: letterId },
// // // //     });

// // // //     if (!letter) {
// // // //       return Response.json(
// // // //         { error: "Cover letter not found" },
// // // //         { status: 404 }
// // // //       );
// // // //     }

// // // //     // gmail client
// // // //     const gmail = getGmailService(user.refreshToken);

// // // //     // convert emails to list
// // // //     const list = emails
// // // //       .split(",")
// // // //       .map((e) => e.trim())
// // // //       .filter((e) => e.length > 0);

// // // //     let sent = 0;
// // // //     let failed = 0;

// // // //     for (const to of list) {
// // // //       try {
// // // //         const raw = createEmail(
// // // //           to,
// // // //           `Application for ${letter.jobTitle}`,
// // // //           letter.content
// // // //         );

// // // //         await gmail.users.messages.send({
// // // //           userId: "me",
// // // //           requestBody: { raw },
// // // //         });

// // // //         sent++;
// // // //       } catch (err) {
// // // //         console.error("Email error:", err);
// // // //         failed++;
// // // //       }
// // // //     }

// // // //     return Response.json({
// // // //       success: true,
// // // //       sent,
// // // //       failed,
// // // //       total: list.length,
// // // //     });
// // // //   } catch (err) {
// // // //     console.error("Bulk email error:", err);
// // // //     return Response.json({ error: "Server error" }, { status: 500 });
// // // //   }
// // // // }
// // // // app/api/send-bulk-email/route.js
// // // import { db } from "@/lib/prisma";
// // // import { auth } from "@clerk/nextjs/server";
// // // import { getGmailService } from "@/lib/google";

// // // // Helper function to create properly formatted Gmail raw email
// // // function createEmail(to, subject, message) {
// // //   // Convert plain text to HTML with proper formatting
// // //   const htmlMessage = message
// // //     .replace(/\n/g, '<br>')
// // //     .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

// // //   const email = [
// // //     `To: ${to}`,
// // //     `Subject: ${subject}`,
// // //     "Content-Type: text/html; charset=UTF-8",
// // //     "MIME-Version: 1.0",
// // //     "",
// // //     `<html>
// // //       <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
// // //         <div style="max-width: 600px; margin: 0 auto;">
// // //           ${htmlMessage}
// // //         </div>
// // //       </body>
// // //     </html>`
// // //   ].join('\n');

// // //   return Buffer.from(email)
// // //     .toString('base64')
// // //     .replace(/\+/g, '-')
// // //     .replace(/\//g, '_')
// // //     .replace(/=+$/, '');
// // // }

// // // // Validate email format
// // // function validateEmail(email) {
// // //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // //   return emailRegex.test(email);
// // // }

// // // export async function POST(req) {
// // //   try {
// // //     const { userId } = await auth();
// // //     if (!userId) {
// // //       return Response.json({ error: "Unauthorized" }, { status: 401 });
// // //     }

// // //     const body = await req.json();
// // //     const { emails, letterId, subject, customMessage } = body;

// // //     // Validate required fields
// // //     if (!emails || !letterId) {
// // //       return Response.json(
// // //         { error: "Email list and cover letter are required" },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Get user's refresh token
// // //     const user = await db.user.findUnique({
// // //       where: { clerkUserId: userId },
// // //       select: { 
// // //         refreshToken: true, 
// // //         email: true,
// // //         canSendEmail: true 
// // //       },
// // //     });

// // //     if (!user?.refreshToken) {
// // //       return Response.json(
// // //         { error: "Gmail not connected. Please connect your Gmail account first." },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Fetch cover letter
// // //     const letter = await db.coverLetter.findUnique({
// // //       where: { id: letterId },
// // //     });

// // //     if (!letter) {
// // //       return Response.json(
// // //         { error: "Cover letter not found" },
// // //         { status: 404 }
// // //       );
// // //     }

// // //     // Get Gmail service
// // //     let gmail;
// // //     try {
// // //       gmail = getGmailService(user.refreshToken);
// // //     } catch (authError) {
// // //       console.error("Gmail auth error:", authError);
// // //       return Response.json(
// // //         { error: "Gmail authentication failed. Please reconnect your account." },
// // //         { status: 401 }
// // //       );
// // //     }

// // //     // Parse and validate email list
// // //     const emailList = emails
// // //       .split(/[,;\n]/) // Split by comma, semicolon, or newline
// // //       .map(email => email.trim())
// // //       .filter(email => {
// // //         // Remove empty entries
// // //         if (!email) return false;
        
// // //         // Validate email format
// // //         if (!validateEmail(email)) {
// // //           console.warn(`Invalid email format skipped: ${email}`);
// // //           return false;
// // //         }
        
// // //         return true;
// // //       });

// // //     if (emailList.length === 0) {
// // //       return Response.json(
// // //         { error: "No valid email addresses provided" },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Prepare email content
// // //     let finalContent = letter.content;
// // //     if (customMessage && customMessage.trim()) {
// // //       finalContent = `${customMessage}\n\n${letter.content}`;
// // //     }

// // //     // Prepare email subject
// // //     const emailSubject = subject || `Application for ${letter.jobTitle} at ${letter.companyName}`;

// // //     // Send emails
// // //     const results = [];
// // //     let sent = 0;
// // //     let failed = 0;

// // //     for (const recipientEmail of emailList) {
// // //       try {
// // //         // Create raw email
// // //         const raw = createEmail(recipientEmail, emailSubject, finalContent);

// // //         // Send email
// // //         const response = await gmail.users.messages.send({
// // //           userId: "me",
// // //           requestBody: { raw },
// // //         });

// // //         // Log successful email
// // //         try {
// // //           await db.emailLog.create({
// // //             data: {
// // //               userId,
// // //               recipientEmail,
// // //               subject: emailSubject,
// // //               coverLetterId: letterId,
// // //               status: "SENT",
// // //               messageId: response.data.id,
// // //               sentAt: new Date(),
// // //               isBulk: true,
// // //               contentLength: finalContent.length,
// // //             },
// // //           });
// // //         } catch (logError) {
// // //           console.error("Failed to log email:", logError);
// // //         }

// // //         sent++;
// // //         results.push({
// // //           email: recipientEmail,
// // //           status: "sent",
// // //           messageId: response.data.id,
// // //         });
// // //       } catch (err) {
// // //         console.error(`Failed to send to ${recipientEmail}:`, err);
        
// // //         // Log failed email
// // //         try {
// // //           await db.emailLog.create({
// // //             data: {
// // //               userId,
// // //               recipientEmail,
// // //               subject: emailSubject,
// // //               coverLetterId: letterId,
// // //               status: "FAILED",
// // //               errorMessage: err.message?.substring(0, 200) || "Unknown error",
// // //               sentAt: new Date(),
// // //               isBulk: true,
// // //             },
// // //           });
// // //         } catch (logError) {
// // //           console.error("Failed to log failed email:", logError);
// // //         }

// // //         failed++;
// // //         results.push({
// // //           email: recipientEmail,
// // //           status: "failed",
// // //           error: err.message || "Unknown error",
// // //         });
// // //       }
// // //     }

// // //     // Return comprehensive results
// // //     return Response.json({
// // //       success: true,
// // //       message: `Bulk email sending completed. Sent: ${sent}, Failed: ${failed}`,
// // //       sent,
// // //       failed,
// // //       total: emailList.length,
// // //       results,
// // //       summary: {
// // //         subject: emailSubject,
// // //         totalRecipients: emailList.length,
// // //         successRate: sent > 0 ? (sent / emailList.length) * 100 : 0,
// // //         completedAt: new Date().toISOString(),
// // //       },
// // //     });

// // //   } catch (err) {
// // //     console.error("Bulk email processing error:", err);
    
// // //     // Handle specific errors
// // //     if (err.code === 429) {
// // //       return Response.json(
// // //         { error: "Gmail sending limit reached. Please try again later." },
// // //         { status: 429 }
// // //       );
// // //     }

// // //     if (err.code === 403) {
// // //       return Response.json(
// // //         {
// // //           error: "Gmail sending permission denied. Please reconnect your account.",
// // //         },
// // //         { status: 403 }
// // //       );
// // //     }

// // //     if (err.message?.includes("invalid_grant") || err.message?.includes("token expired")) {
// // //       return Response.json(
// // //         {
// // //           error: "Gmail authentication expired. Please reconnect your account.",
// // //         },
// // //         { status: 401 }
// // //       );
// // //     }

// // //     return Response.json(
// // //       { 
// // //         error: err.message || "Failed to process bulk email request",
// // //         details: "Please check your input and try again."
// // //       },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // // Add rate limiting headers
// // // export function OPTIONS() {
// // //   return new Response(null, {
// // //     status: 204,
// // //     headers: {
// // //       'Access-Control-Allow-Methods': 'POST, OPTIONS',
// // //       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// // //     },
// // //   });
// // // }

// // // export const runtime = "nodejs";

// // // app/api/send-bulk-email/route.js
// // import { db } from "@/lib/prisma";
// // import { auth } from "@clerk/nextjs/server";
// // import { getGmailService } from "@/lib/google";

// // // Helper function to create properly formatted Gmail raw email
// // function createEmail(to, subject, message) {
// //   const htmlMessage = message
// //     .replace(/\n/g, '<br>')
// //     .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

// //   const email = [
// //     `To: ${to}`,
// //     `Subject: ${subject}`,
// //     "Content-Type: text/html; charset=UTF-8",
// //     "MIME-Version: 1.0",
// //     "",
// //     `<html>
// //       <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
// //         <div style="max-width: 600px; margin: 0 auto;">
// //           ${htmlMessage}
// //         </div>
// //       </body>
// //     </html>`
// //   ].join('\n');

// //   return Buffer.from(email)
// //     .toString('base64')
// //     .replace(/\+/g, '-')
// //     .replace(/\//g, '_')
// //     .replace(/=+$/, '');
// // }

// // // Validate email format
// // function validateEmail(email) {
// //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //   return emailRegex.test(email);
// // }

// // // Get database user from Clerk user ID
// // async function getDbUserFromClerk() {
// //   const { userId } = await auth();
  
// //   if (!userId) {
// //     throw new Error("User not authenticated");
// //   }

// //   const user = await db.user.findUnique({
// //     where: { clerkUserId: userId },
// //     select: { 
// //       id: true,
// //       refreshToken: true, 
// //       email: true,
// //       canSendEmail: true 
// //     },
// //   });

// //   if (!user) {
// //     throw new Error("User not found in database. Please complete onboarding first.");
// //   }

// //   return user;
// // }

// // // POST: Start a new bulk email campaign
// // export async function POST(req) {
// //   try {
// //     const body = await req.json();
// //     const { emails, letterId, subject, customMessage, campaignTitle } = body;

// //     // Validate required fields
// //     if (!emails || !letterId) {
// //       return Response.json(
// //         { error: "Email list and cover letter are required" },
// //         { status: 400 }
// //       );
// //     }

// //     // Get database user using Clerk pattern
// //     const dbUser = await getDbUserFromClerk();

// //     if (!dbUser?.refreshToken) {
// //       return Response.json(
// //         { error: "Gmail not connected. Please connect your Gmail account first." },
// //         { status: 400 }
// //       );
// //     }

// //     // Fetch cover letter
// //     const letter = await db.coverLetter.findUnique({
// //       where: { id: letterId },
// //     });

// //     if (!letter) {
// //       return Response.json(
// //         { error: "Cover letter not found" },
// //         { status: 404 }
// //       );
// //     }

// //     // Parse and validate email list
// //     const emailList = emails
// //       .split(/[,;\n]/)
// //       .map(email => email.trim())
// //       .filter(email => {
// //         if (!email) return false;
// //         if (!validateEmail(email)) {
// //           console.warn(`Invalid email format skipped: ${email}`);
// //           return false;
// //         }
// //         return true;
// //       });

// //     if (emailList.length === 0) {
// //       return Response.json(
// //         { error: "No valid email addresses provided" },
// //         { status: 400 }
// //       );
// //     }

// //     // Prepare email content
// //     let finalContent = letter.content;
// //     if (customMessage && customMessage.trim()) {
// //       finalContent = `${customMessage}\n\n${letter.content}`;
// //     }

// //     // Prepare email subject
// //     const emailSubject = subject || `Application for ${letter.jobTitle} at ${letter.companyName}`;

// //     // Create campaign record
// //     const campaign = await db.campaign.create({
// //       data: {
// //         title: campaignTitle || `Bulk Send - ${letter.jobTitle}`,
// //         subject: emailSubject,
// //         message: finalContent,
// //         userId: dbUser.id,
// //         total: emailList.length,
// //         sent: 0,
// //         failed: 0,
// //         status: 'processing',
// //       }
// //     });

// //     // Create email logs for each recipient
// //     await db.emailLog.createMany({
// //       data: emailList.map(email => ({
// //         campaignId: campaign.id,
// //         userId: dbUser.id,
// //         emailTo: email,
// //         status: 'PENDING',
// //       }))
// //     });

// //     // Start background processing (non-blocking)
// //     processBulkEmailsInBackground(
// //       campaign.id,
// //       emailList,
// //       emailSubject,
// //       finalContent,
// //       dbUser.refreshToken,
// //       dbUser.id,
// //       letterId
// //     );

// //     // Return immediately with campaign ID for tracking
// //     return Response.json({
// //       success: true,
// //       message: "Bulk email campaign started in background",
// //       campaignId: campaign.id,
// //       totalEmails: emailList.length,
// //       campaignTitle: campaign.title,
// //       trackUrl: `/api/bulk-email/status/${campaign.id}`,
// //     });

// //   } catch (err) {
// //     console.error("Bulk email processing error:", err);
    
// //     // Handle specific errors
// //     if (err.code === 429) {
// //       return Response.json(
// //         { error: "Gmail sending limit reached. Please try again later." },
// //         { status: 429 }
// //       );
// //     }

// //     if (err.code === 403) {
// //       return Response.json(
// //         {
// //           error: "Gmail sending permission denied. Please reconnect your account.",
// //         },
// //         { status: 403 }
// //       );
// //     }

// //     if (err.message?.includes("not authenticated") || err.message?.includes("not found")) {
// //       return Response.json(
// //         { error: "Authentication required. Please log in again." },
// //         { status: 401 }
// //       );
// //     }

// //     return Response.json(
// //       { 
// //         error: err.message || "Failed to process bulk email request",
// //         details: "Please check your input and try again."
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // Background processing function
// // async function processBulkEmailsInBackground(
// //   campaignId,
// //   emailList,
// //   subject,
// //   content,
// //   refreshToken,
// //   userId,
// //   letterId
// // ) {
// //   let sent = 0;
// //   let failed = 0;
// //   const BATCH_SIZE = 20;
// //   const batches = [];

// //   // Create batches
// //   for (let i = 0; i < emailList.length; i += BATCH_SIZE) {
// //     batches.push(emailList.slice(i, i + BATCH_SIZE));
// //   }

// //   try {
// //     const gmail = getGmailService(refreshToken);

// //     for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
// //       // Check if campaign was cancelled
// //       const campaign = await db.campaign.findUnique({
// //         where: { id: campaignId },
// //       });

// //       if (campaign?.status === 'cancelled') {
// //         break;
// //       }

// //       const batch = batches[batchIndex];
// //       const batchPromises = [];

// //       for (const recipientEmail of batch) {
// //         const promise = (async () => {
// //           try {
// //             const raw = createEmail(recipientEmail, subject, content);
// //             await gmail.users.messages.send({
// //               userId: "me",
// //               requestBody: { raw },
// //             });

// //             // Update email log to SENT
// //             await db.emailLog.updateMany({
// //               where: {
// //                 campaignId,
// //                 emailTo: recipientEmail,
// //                 status: 'PENDING',
// //               },
// //               data: {
// //                 status: 'SENT',
// //               }
// //             });

// //             return { email: recipientEmail, success: true };
// //           } catch (err) {
// //             console.error(`Failed to send to ${recipientEmail}:`, err);
            
// //             // Update email log to FAILED
// //             await db.emailLog.updateMany({
// //               where: {
// //                 campaignId,
// //                 emailTo: recipientEmail,
// //                 status: 'PENDING',
// //               },
// //               data: {
// //                 status: 'FAILED',
// //                 error: err.message?.substring(0, 200) || "Unknown error",
// //               }
// //             });

// //             return { email: recipientEmail, success: false, error: err.message };
// //           }
// //         })();

// //         batchPromises.push(promise);
// //       }

// //       // Wait for batch to complete
// //       await new Promise(resolve => setTimeout(resolve, 500));
// //       const batchResults = await Promise.allSettled(batchPromises);

// //       // Count batch results
// //       const batchSent = batchResults.filter(r => 
// //         r.status === 'fulfilled' && r.value.success
// //       ).length;
// //       const batchFailed = batchResults.length - batchSent;

// //       sent += batchSent;
// //       failed += batchFailed;

// //       // Update campaign progress
// //       const progress = Math.round(((sent + failed) / emailList.length) * 100);
      
// //       await db.campaign.update({
// //         where: { id: campaignId },
// //         data: {
// //           sent,
// //           failed,
// //           status: (sent + failed) === emailList.length ? 'completed' : 'processing',
// //         }
// //       });

// //       // Delay between batches
// //       if (batchIndex < batches.length - 1) {
// //         await new Promise(resolve => setTimeout(resolve, 2000));
// //       }
// //     }

// //     // Final update
// //     await db.campaign.update({
// //       where: { id: campaignId },
// //       data: {
// //         status: 'completed',
// //         updatedAt: new Date(),
// //       }
// //     });

// //   } catch (error) {
// //     console.error("Background processing error:", error);
    
// //     await db.campaign.update({
// //       where: { id: campaignId },
// //       data: {
// //         status: 'failed',
// //         error: error.message?.substring(0, 200),
// //         updatedAt: new Date(),
// //       }
// //     });
// //   }
// // }

// // export const runtime = "nodejs";

// import { db } from "@/lib/prisma";
// import { getGmailService } from "@/lib/google";
// import { auth } from "@clerk/nextjs/server";

// // Helper function to create properly formatted email
// function createEmail(to, subject, message) {
//   const htmlMessage = message
//     .replace(/\n/g, "<br>")
//     .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

//   const email = [
//     `To: ${to}`,
//     `Subject: ${subject}`,
//     "Content-Type: text/html; charset=UTF-8",
//     "MIME-Version: 1.0",
//     "",
//     `<html>
//       <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
//         <div style="max-width: 600px; margin: 0 auto;">
//           ${htmlMessage}
//         </div>
//       </body>
//     </html>`,
//   ].join("\n");

//   return Buffer.from(email)
//     .toString("base64")
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");
// }

// // Validate email format
// function validateEmail(email) {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// export async function POST(req) {
//   try {
//     // First get the user ID from Clerk
//     const { userId } = await auth();

//     console.log("🧪 Bulk Email API Route Clerk UserID:", userId);

//     if (!userId) {
//       return Response.json(
//         { error: "User not authenticated. Please log in again." },
//         { status: 401 }
//       );
//     }

//     // Get database user
//     const dbUser = await db.user.findUnique({
//       where: { clerkUserId: userId },
//       select: {
//         id: true,
//         clerkUserId: true,
//         email: true,
//         name: true,
//         refreshToken: true,
//         canSendEmail: true,
//       },
//     });

//     if (!dbUser) {
//       return Response.json(
//         { error: "User not found in database. Please complete onboarding." },
//         { status: 404 }
//       );
//     }

//     const body = await req.json();
//     const {
//       emails,
//       letterId,
//       subject,
//       customMessage,
//       campaignTitle,
//       rateLimitDelay = 2000,
//     } = body;

//     // Validate required fields
//     if (!emails || !letterId) {
//       return Response.json(
//         { error: "Email list and cover letter are required" },
//         { status: 400 }
//       );
//     }

//     if (!dbUser?.refreshToken) {
//       return Response.json(
//         {
//           error: "Gmail not connected. Please connect your Gmail account first.",
//         },
//         { status: 400 }
//       );
//     }

//     // Fetch cover letter
//     const letter = await db.coverLetter.findUnique({
//       where: { id: letterId },
//     });

//     if (!letter) {
//       return Response.json(
//         { error: "Cover letter not found" },
//         { status: 404 }
//       );
//     }

//     // Parse and validate email list
//     const emailList = emails
//       .split(/[,;\n]/)
//       .map((email) => email.trim())
//       .filter((email) => {
//         if (!email) return false;
//         if (!validateEmail(email)) {
//           console.warn(`Invalid email format skipped: ${email}`);
//           return false;
//         }
//         return true;
//       });

//     if (emailList.length === 0) {
//       return Response.json(
//         { error: "No valid email addresses provided" },
//         { status: 400 }
//       );
//     }

//     // Prepare email content
//     let finalContent = letter.content;
//     if (customMessage && customMessage.trim()) {
//       finalContent = `${customMessage}\n\n${letter.content}`;
//     }

//     // Prepare email subject
//     const emailSubject =
//       subject || `Application for ${letter.jobTitle} at ${letter.companyName}`;

//     // Create campaign record
//     const campaign = await db.campaign.create({
//       data: {
//         userId: dbUser.id,
//         title:
//           campaignTitle ||
//           `Bulk: ${letter.jobTitle} to ${emailList.length} recipients`,
//         type: "BULK",
//         status: "PROCESSING",
//         subject: emailSubject,
//         content: finalContent,
//         coverLetterId: letterId,
//         totalEmails: emailList.length,
//         sentCount: 0,
//         failedCount: 0,
//         rateLimitDelay: parseInt(rateLimitDelay),
//         startedAt: new Date(),
//       },
//     });

//     // Create initial email logs with PENDING status
//     const emailLogsData = emailList.map((email) => ({
//       campaignId: campaign.id,
//       userId: dbUser.id,
//       coverLetterId: letterId,
//       toEmail: email,
//       subject: emailSubject,
//       content: finalContent,
//       status: "PENDING",
//       statusText: "Queued for sending",
//     }));

//     await db.emailLog.createMany({
//       data: emailLogsData,
//     });

//     // Start background processing
//     processBulkEmailsInBackground(
//       campaign.id,
//       dbUser.id,
//       dbUser.refreshToken,
//       emailSubject,
//       finalContent,
//       rateLimitDelay
//     );

//     // Return immediately with campaign ID
//     return Response.json({
//       success: true,
//       message: `Bulk email campaign started for ${emailList.length} recipients`,
//       campaignId: campaign.id,
//       totalEmails: emailList.length,
//       campaignTitle: campaign.title,
//       trackUrl: `/api/campaigns/${campaign.id}`,
//       estimatedTime: `${Math.ceil(
//         (emailList.length * (rateLimitDelay / 1000)) / 60
//       )} minutes`,
//       initialStatus: {
//         sentCount: 0,
//         failedCount: 0,
//         progress: 0,
//         status: "PROCESSING",
//       },
//     });
//   } catch (err) {
//     console.error("Bulk email processing error:", err);

//     // Handle specific errors
//     if (err.code === 429) {
//       return Response.json(
//         { error: "Gmail sending limit reached. Please try again later." },
//         { status: 429 }
//       );
//     }

//     if (err.code === 403) {
//       return Response.json(
//         {
//           error: "Gmail sending permission denied. Please reconnect your account.",
//         },
//         { status: 403 }
//       );
//     }

//     if (
//       err.message?.includes("not authenticated") ||
//       err.message?.includes("not found")
//     ) {
//       return Response.json(
//         { error: "Authentication required. Please log in again." },
//         { status: 401 }
//       );
//     }

//     return Response.json(
//       {
//         error: err.message || "Failed to process bulk email request",
//         details: "Please check your input and try again.",
//       },
//       { status: 500 }
//     );
//   }
// }

// // Background processing function
// async function processBulkEmailsInBackground(
//   campaignId,
//   userId,
//   refreshToken,
//   subject,
//   content,
//   rateLimitDelay = 2000
// ) {
//   let sentCount = 0;
//   let failedCount = 0;

//   try {
//     const gmail = getGmailService(refreshToken);

//     // Get pending emails for this campaign
//     const pendingEmails = await db.emailLog.findMany({
//       where: {
//         campaignId,
//         userId,
//         status: "PENDING",
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//     });

//     // Process emails one by one with delay
//     for (const emailLog of pendingEmails) {
//       try {
//         // Check if campaign was cancelled
//         const campaign = await db.campaign.findUnique({
//           where: { id: campaignId },
//         });

//         if (campaign?.status === "CANCELLED" || campaign?.status === "FAILED") {
//           console.log(`Campaign ${campaignId} was cancelled, stopping...`);
//           break;
//         }

//         // Send email
//         const startTime = Date.now();
//         const raw = createEmail(emailLog.toEmail, subject, content);
//         const response = await gmail.users.messages.send({
//           userId: "me",
//           requestBody: { raw },
//         });
//         const processingTimeMs = Date.now() - startTime;

//         // Update email log to SENT
//         await db.emailLog.update({
//           where: { id: emailLog.id },
//           data: {
//             status: "SENT",
//             statusText: "Sent successfully",
//             messageId: response.data.id,
//             sentAt: new Date(),
//             processingTimeMs,
//           },
//         });

//         sentCount++;

//         // Update campaign progress
//         await db.campaign.update({
//           where: { id: campaignId },
//           data: {
//             sentCount: { increment: 1 },
//           },
//         });

//         // Update user statistics
//         await db.user.update({
//           where: { id: userId },
//           data: {
//             totalEmailsSent: { increment: 1 },
//             lastEmailSentAt: new Date(),
//           },
//         });
//       } catch (err) {
//         console.error(`Failed to send to ${emailLog.toEmail}:`, err);

//         // Update email log to FAILED
//         await db.emailLog.update({
//           where: { id: emailLog.id },
//           data: {
//             status: "FAILED",
//             statusText: "Failed to send",
//             error: err.message?.substring(0, 200) || "Unknown error",
//           },
//         });

//         failedCount++;

//         // Update campaign progress
//         await db.campaign.update({
//           where: { id: campaignId },
//           data: {
//             failedCount: { increment: 1 },
//           },
//         });

//         // Update user statistics
//         await db.user.update({
//           where: { id: userId },
//           data: {
//             totalEmailsFailed: { increment: 1 },
//           },
//         });

//         // Handle rate limits - pause if we hit a limit
//         if (err.code === 429) {
//           console.warn("Rate limit hit, pausing for 60 seconds...");
//           await new Promise((resolve) => setTimeout(resolve, 60000));
//         }
//       }

//       // Delay between emails to respect rate limits
//       if (rateLimitDelay > 0) {
//         await new Promise((resolve) =>
//           setTimeout(resolve, parseInt(rateLimitDelay))
//         );
//       }
//     }

//     // Final campaign update
//     const finalStatus =
//       failedCount === pendingEmails.length ? "FAILED" : "COMPLETED";

//     await db.campaign.update({
//       where: { id: campaignId },
//       data: {
//         status: finalStatus,
//         completedAt: new Date(),
//         ...(failedCount > 0 && {
//           errorMessage: `${failedCount} emails failed to send`,
//         }),
//       },
//     });

//     console.log(
//       `Campaign ${campaignId} completed: ${sentCount} sent, ${failedCount} failed`
//     );
//   } catch (error) {
//     console.error("Background processing error:", error);

//     // Mark campaign as failed
//     await db.campaign.update({
//       where: { id: campaignId },
//       data: {
//         status: "FAILED",
//         errorMessage:
//           error.message?.substring(0, 200) || "Background processing failed",
//         completedAt: new Date(),
//       },
//     });
//   }
// }

// export const runtime = "nodejs";

import { db } from "@/lib/prisma";
import { getGmailService } from "@/lib/google";
import { auth } from "@clerk/nextjs/server";

// Helper function to create properly formatted email
function createEmail(to, subject, message) {
  const htmlMessage = message
    .replace(/\n/g, "<br>")
    .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=UTF-8",
    "MIME-Version: 1.0",
    "",
    `<html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          ${htmlMessage}
        </div>
      </body>
    </html>`,
  ].join("\n");

  return Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Background processing function (must be declared before POST)
async function processBulkEmailsInBackground(
  campaignId,
  userId,
  refreshToken,
  subject,
  content,
  rateLimitDelay = 2000
) {
  let sentCount = 0;
  let failedCount = 0;

  try {
    const gmail = getGmailService(refreshToken);

    // Get pending emails for this campaign
    const pendingEmails = await db.emailLog.findMany({
      where: {
        campaignId,
        userId,
        status: "PENDING",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Process emails one by one with delay
    for (const emailLog of pendingEmails) {
      try {
        // Check if campaign was cancelled
        const campaign = await db.campaign.findUnique({
          where: { id: campaignId },
        });

        if (campaign?.status === "CANCELLED" || campaign?.status === "FAILED") {
          console.log(`Campaign ${campaignId} was cancelled, stopping...`);
          break;
        }

        // Send email
        const startTime = Date.now();
        const raw = createEmail(emailLog.toEmail, subject, content);
        const response = await gmail.users.messages.send({
          userId: "me",
          requestBody: { raw },
        });
        const processingTimeMs = Date.now() - startTime;

        // Update email log to SENT
        await db.emailLog.update({
          where: { id: emailLog.id },
          data: {
            status: "SENT",
            statusText: "Sent successfully",
            messageId: response.data.id,
            sentAt: new Date(),
            processingTimeMs,
          },
        });

        sentCount++;

        // Update campaign progress
        await db.campaign.update({
          where: { id: campaignId },
          data: {
            sentCount: { increment: 1 },
          },
        });

        // Update user statistics
        await db.user.update({
          where: { id: userId },
          data: {
            totalEmailsSent: { increment: 1 },
            lastEmailSentAt: new Date(),
          },
        });
      } catch (err) {
        console.error(`Failed to send to ${emailLog.toEmail}:`, err);

        // Update email log to FAILED
        await db.emailLog.update({
          where: { id: emailLog.id },
          data: {
            status: "FAILED",
            statusText: "Failed to send",
            error: err.message?.substring(0, 200) || "Unknown error",
          },
        });

        failedCount++;

        // Update campaign progress
        await db.campaign.update({
          where: { id: campaignId },
          data: {
            failedCount: { increment: 1 },
          },
        });

        // Update user statistics
        await db.user.update({
          where: { id: userId },
          data: {
            totalEmailsFailed: { increment: 1 },
          },
        });

        // Handle rate limits - pause if we hit a limit
        if (err.code === 429) {
          console.warn("Rate limit hit, pausing for 60 seconds...");
          await new Promise((resolve) => setTimeout(resolve, 60000));
        }
      }

      // Delay between emails to respect rate limits
      if (rateLimitDelay > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, parseInt(rateLimitDelay))
        );
      }
    }

    // Final campaign update
    const finalStatus =
      failedCount === pendingEmails.length ? "FAILED" : "COMPLETED";

    await db.campaign.update({
      where: { id: campaignId },
      data: {
        status: finalStatus,
        completedAt: new Date(),
        ...(failedCount > 0 && {
          errorMessage: `${failedCount} emails failed to send`,
        }),
      },
    });

    console.log(
      `Campaign ${campaignId} completed: ${sentCount} sent, ${failedCount} failed`
    );
  } catch (error) {
    console.error("Background processing error:", error);

    // Mark campaign as failed
    await db.campaign.update({
      where: { id: campaignId },
      data: {
        status: "FAILED",
        errorMessage:
          error.message?.substring(0, 200) || "Background processing failed",
        completedAt: new Date(),
      },
    });
  }
}

export async function POST(req) {
  try {
    // First get the user ID from Clerk
    const { userId } = await auth();

    console.log("🧪 Bulk Email API Route Clerk UserID:", userId);

    if (!userId) {
      return Response.json(
        { error: "User not authenticated. Please log in again." },
        { status: 401 }
      );
    }

    // Get database user
    const dbUser = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        name: true,
        refreshToken: true,
        canSendEmail: true,
      },
    });

    if (!dbUser) {
      return Response.json(
        { error: "User not found in database. Please complete onboarding." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      emails,
      letterId,
      subject,
      customMessage,
      campaignTitle,
      rateLimitDelay = 2000,
    } = body;

    // Validate required fields
    if (!emails || !letterId) {
      return Response.json(
        { error: "Email list and cover letter are required" },
        { status: 400 }
      );
    }

    if (!dbUser?.refreshToken) {
      return Response.json(
        {
          error:
            "Gmail not connected. Please connect your Gmail account first.",
        },
        { status: 400 }
      );
    }

    // Fetch cover letter
    const letter = await db.coverLetter.findUnique({
      where: { id: letterId },
    });

    if (!letter) {
      return Response.json(
        { error: "Cover letter not found" },
        { status: 404 }
      );
    }

    // Parse and validate email list
    const emailList = emails
      .split(/[,;\n]/)
      .map((email) => email.trim())
      .filter((email) => {
        if (!email) return false;
        if (!validateEmail(email)) {
          console.warn(`Invalid email format skipped: ${email}`);
          return false;
        }
        return true;
      });

    if (emailList.length === 0) {
      return Response.json(
        { error: "No valid email addresses provided" },
        { status: 400 }
      );
    }

    // Prepare email content
    let finalContent = letter.content;
    if (customMessage && customMessage.trim()) {
      finalContent = `${customMessage}\n\n${letter.content}`;
    }

    // Prepare email subject
    const emailSubject =
      subject || `Application for ${letter.jobTitle} at ${letter.companyName}`;

    // Create campaign record
    const campaign = await db.campaign.create({
      data: {
        userId: dbUser.id,
        title:
          campaignTitle ||
          `Bulk: ${letter.jobTitle} to ${emailList.length} recipients`,
        type: "BULK",
        status: "PROCESSING",
        subject: emailSubject,
        content: finalContent,
        coverLetterId: letterId,
        totalEmails: emailList.length,
        sentCount: 0,
        failedCount: 0,
        rateLimitDelay: parseInt(rateLimitDelay),
        startedAt: new Date(),
      },
    });

    // Create initial email logs with PENDING status
    const emailLogsData = emailList.map((email) => ({
      campaignId: campaign.id,
      userId: dbUser.id,
      coverLetterId: letterId,
      toEmail: email,
      subject: emailSubject,
      content: finalContent,
      status: "PENDING",
      statusText: "Queued for sending",
    }));

    await db.emailLog.createMany({
      data: emailLogsData,
    });

    // Start background processing (don't await)
    processBulkEmailsInBackground(
      campaign.id,
      dbUser.id,
      dbUser.refreshToken,
      emailSubject,
      finalContent,
      rateLimitDelay
    ).catch((error) => {
      console.error("Background processing failed:", error);
    });

    // Return immediately with campaign ID
    return Response.json({
      success: true,
      message: `Bulk email campaign started for ${emailList.length} recipients`,
      campaignId: campaign.id,
      totalEmails: emailList.length,
      campaignTitle: campaign.title,
      trackUrl: `/api/campaigns/${campaign.id}`,
      estimatedTime: `${Math.ceil(
        (emailList.length * (rateLimitDelay / 1000)) / 60
      )} minutes`,
      initialStatus: {
        sentCount: 0,
        failedCount: 0,
        progress: 0,
        status: "PROCESSING",
      },
    });
  } catch (err) {
    console.error("Bulk email processing error:", err);

    // Handle specific errors
    if (err.code === 429) {
      return Response.json(
        { error: "Gmail sending limit reached. Please try again later." },
        { status: 429 }
      );
    }

    if (err.code === 403) {
      return Response.json(
        {
          error:
            "Gmail sending permission denied. Please reconnect your account.",
        },
        { status: 403 }
      );
    }

    if (
      err.message?.includes("not authenticated") ||
      err.message?.includes("not found")
    ) {
      return Response.json(
        { error: "Authentication required. Please log in again." },
        { status: 401 }
      );
    }

    return Response.json(
      {
        error: err.message || "Failed to process bulk email request",
        details: "Please check your input and try again.",
      },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";