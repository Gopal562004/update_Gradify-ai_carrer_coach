// // // // app/api/send-single-email/route.js
// // // import { db } from "@/lib/prisma";
// // // import { auth } from "@clerk/nextjs/server";
// // // import { getGmailService } from "@/lib/google";

// // // // Same helper function as bulk email
// // // function createEmail(to, subject, message) {
// // //   const email = [
// // //     `To: ${to}`,
// // //     `Subject: ${subject}`,
// // //     "Content-Type: text/html; charset=UTF-8",
// // //     "",
// // //     message,
// // //   ].join("\n");

// // //   return Buffer.from(email)
// // //     .toString("base64")
// // //     .replace(/\+/g, "-")
// // //     .replace(/\//g, "_")
// // //     .replace(/=+$/, "");
// // // }

// // // export async function POST(req) {
// // //   try {
// // //     const { userId } = await auth();
// // //     if (!userId)
// // //       return Response.json({ error: "Unauthorized" }, { status: 401 });

// // //     const body = await req.json();
// // //     const {
// // //       recipientEmail,
// // //       recipientName,
// // //       subject,
// // //       emailContent, // CHANGED: Use emailContent instead of customMessage
// // //       customMessage, // Keep for backward compatibility
// // //       letterId,
// // //     } = body;

// // //     // Validate required fields
// // //     if (!recipientEmail || !letterId) {
// // //       return Response.json(
// // //         { error: "Recipient email and cover letter are required" },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Validate email format
// // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // //     if (!emailRegex.test(recipientEmail)) {
// // //       return Response.json({ error: "Invalid email format" }, { status: 400 });
// // //     }

// // //     // Get user's refresh token - same as bulk email
// // //     const user = await db.user.findUnique({
// // //       where: { clerkUserId: userId },
// // //       select: { refreshToken: true, canSendEmail: true },
// // //     });

// // //     if (!user?.refreshToken) {
// // //       return Response.json({ error: "Gmail not connected" }, { status: 400 });
// // //     }

// // //     // Fetch cover letter - same as bulk email
// // //     const letter = await db.coverLetter.findUnique({
// // //       where: { id: letterId },
// // //     });

// // //     if (!letter) {
// // //       return Response.json(
// // //         { error: "Cover letter not found" },
// // //         { status: 404 }
// // //       );
// // //     }

// // //     // Create Gmail client - same as bulk email
// // //     const gmail = getGmailService(user.refreshToken);

// // //     // FIX: Use the pre-formatted emailContent from frontend
// // //     // This prevents double content issue
// // //     let finalEmailContent = "";

// // //     if (emailContent) {
// // //       // Use the pre-formatted content from frontend (includes everything)
// // //       finalEmailContent = emailContent;
// // //     } else if (customMessage) {
// // //       // Fallback for backward compatibility
// // //       finalEmailContent = customMessage + "\n\n" + letter.content;
// // //     } else {
// // //       // Just send the cover letter
// // //       finalEmailContent = letter.content;
// // //     }

// // //     // Create email subject
// // //     const emailSubject = subject || `Application for ${letter.jobTitle}`;

// // //     // Create raw email - same function as bulk
// // //     const raw = createEmail(recipientEmail, emailSubject, finalEmailContent);

// // //     // Send single email (instead of loop in bulk)
// // //     const response = await gmail.users.messages.send({
// // //       userId: "me",
// // //       requestBody: { raw },
// // //     });

// // //     // Optional: Log the email send
// // //     try {
// // //       await db.emailLog.create({
// // //         data: {
// // //           userId,
// // //           recipientEmail,
// // //           recipientName: recipientName || null,
// // //           subject: emailSubject,
// // //           coverLetterId: letterId,
// // //           status: "SENT",
// // //           messageId: response.data.id,
// // //           sentAt: new Date(),
// // //         },
// // //       });
// // //     } catch (logError) {
// // //       console.error("Failed to log email:", logError);
// // //       // Don't fail the whole request if logging fails
// // //     }

// // //     return Response.json({
// // //       success: true,
// // //       sent: 1,
// // //       failed: 0,
// // //       total: 1,
// // //       recipientEmail,
// // //       recipientName,
// // //       subject: emailSubject,
// // //       sentAt: new Date().toISOString(),
// // //       messageId: response.data.id,
// // //     });
// // //   } catch (err) {
// // //     console.error("Single email error:", err);

// // //     // Handle Gmail API errors
// // //     if (err.code === 429) {
// // //       return Response.json(
// // //         { error: "Gmail sending limit reached. Please try again later." },
// // //         { status: 429 }
// // //       );
// // //     }

// // //     if (err.code === 403) {
// // //       return Response.json(
// // //         {
// // //           error:
// // //             "Gmail sending permission denied. Please reconnect your account.",
// // //         },
// // //         { status: 403 }
// // //       );
// // //     }

// // //     return Response.json(
// // //       { error: "Failed to send email. Please try again." },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }


// // // app/api/send-single-email/route.js
// // import { db } from "@/lib/prisma";
// // import { auth } from "@clerk/nextjs/server";
// // import { getGmailService } from "@/lib/google";

// // // Helper function to create properly formatted email
// // function createEmail(to, subject, message) {
// //   // Convert plain text to HTML with proper line breaks
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

// // export async function POST(req) {
// //   try {
// //     const { userId } = await auth();
// //     if (!userId) {
// //       return Response.json({ error: "Unauthorized" }, { status: 401 });
// //     }

// //     const body = await req.json();
// //     const {
// //       recipientEmail,
// //       recipientName,
// //       subject,
// //       emailContent,
// //       letterId,
// //       salutation,
// //       closing,
// //       signature,
// //       customMessage,
// //     } = body;

// //     // Validate required fields
// //     if (!recipientEmail || !letterId) {
// //       return Response.json(
// //         { error: "Recipient email and cover letter are required" },
// //         { status: 400 }
// //       );
// //     }

// //     // Validate email format
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!emailRegex.test(recipientEmail)) {
// //       return Response.json({ error: "Invalid email format" }, { status: 400 });
// //     }

// //     // Get user's refresh token
// //     const user = await db.user.findUnique({
// //       where: { clerkUserId: userId },
// //       select: { refreshToken: true, email: true },
// //     });

// //     if (!user?.refreshToken) {
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

// //     // Get Gmail service
// //     let gmail;
// //     try {
// //       gmail = getGmailService(user.refreshToken);
// //     } catch (authError) {
// //       console.error("Gmail auth error:", authError);
// //       return Response.json(
// //         { error: "Gmail authentication failed. Please reconnect your account." },
// //         { status: 401 }
// //       );
// //     }

// //     // Determine final email content
// //     let finalEmailContent = "";
    
// //     // Priority: Use emailContent from frontend if available
// //     if (emailContent && emailContent.trim()) {
// //       finalEmailContent = emailContent;
// //     } 
// //     // Fallback: Build from components
// //     else if (customMessage && customMessage.trim()) {
// //       // Build content with custom message
// //       if (salutation) {
// //         finalEmailContent += `${salutation}\n\n`;
// //       }
      
// //       finalEmailContent += `${customMessage}\n\n`;
// //       finalEmailContent += `${letter.content}\n\n`;
      
// //       if (closing) {
// //         finalEmailContent += `${closing}`;
// //       }
      
// //       if (signature) {
// //         finalEmailContent += `${signature}`;
// //       }
// //     }
// //     // Last resort: Just send the cover letter
// //     else {
// //       // Add salutation if provided
// //       if (salutation) {
// //         finalEmailContent += `${salutation}\n\n`;
// //       }
      
// //       finalEmailContent = letter.content;
      
// //       // Add closing and signature if provided
// //       if (closing || signature) {
// //         finalEmailContent += '\n\n';
// //         if (closing) {
// //           finalEmailContent += `${closing}`;
// //         }
// //         if (signature) {
// //           finalEmailContent += `${signature}`;
// //         }
// //       }
// //     }

// //     // Ensure we have content to send
// //     if (!finalEmailContent.trim()) {
// //       return Response.json(
// //         { error: "Email content cannot be empty" },
// //         { status: 400 }
// //       );
// //     }

// //     // Create email subject
// //     const emailSubject = subject || `Application for ${letter.jobTitle} at ${letter.companyName}`;

// //     // Create raw email
// //     const raw = createEmail(recipientEmail, emailSubject, finalEmailContent);

// //     // Send email
// //     const response = await gmail.users.messages.send({
// //       userId: "me",
// //       requestBody: { raw },
// //     });

// //     // Log the email send
// //     try {
// //       await db.emailLog.create({
// //         data: {
// //           userId,
// //           recipientEmail,
// //           recipientName: recipientName || null,
// //           subject: emailSubject,
// //           coverLetterId: letterId,
// //           status: "SENT",
// //           messageId: response.data.id,
// //           sentAt: new Date(),
// //           contentLength: finalEmailContent.length,
// //         },
// //       });
// //     } catch (logError) {
// //       console.error("Failed to log email:", logError);
// //       // Don't fail the whole request if logging fails
// //     }

// //     return Response.json({
// //       success: true,
// //       sent: 1,
// //       failed: 0,
// //       total: 1,
// //       recipientEmail,
// //       recipientName: recipientName || null,
// //       subject: emailSubject,
// //       sentAt: new Date().toISOString(),
// //       messageId: response.data.id,
// //       contentLength: finalEmailContent.length,
// //     });

// //   } catch (err) {
// //     console.error("Single email error:", err);
    
// //     // Handle specific Gmail API errors
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

// //     if (err.message?.includes("invalid_grant") || err.message?.includes("token expired")) {
// //       return Response.json(
// //         {
// //           error: "Gmail authentication expired. Please reconnect your account.",
// //         },
// //         { status: 401 }
// //       );
// //     }

// //     // Handle specific error messages
// //     const errorMessage = err.message || "Failed to send email";
    
// //     if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
// //       return Response.json(
// //         { error: "Gmail sending quota exceeded. Please try again tomorrow." },
// //         { status: 429 }
// //       );
// //     }

// //     if (errorMessage.includes("recipient") || errorMessage.includes("address")) {
// //       return Response.json(
// //         { error: "Invalid recipient email address." },
// //         { status: 400 }
// //       );
// //     }

// //     return Response.json(
// //       { error: errorMessage },
// //       { status: 500 }
// //     );
// //   }
// // }


// import { db } from "@/lib/prisma";
// import { getGmailService } from "@/lib/google";

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

// // Get user from Clerk
// async function getDbUserFromClerk() {
//   const { auth } = await import("@clerk/nextjs/server");
//   const { userId } = await auth();

//   console.log("🧪 Single Email API Route Clerk UserID:", userId);

//   if (!userId) {
//     throw new Error("User not authenticated");
//   }

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//     select: {
//       id: true,
//       clerkUserId: true,
//       email: true,
//       name: true,
//       refreshToken: true,
//       canSendEmail: true,
//     },
//   });

//   if (!user) {
//     throw new Error("User not found in database");
//   }

//   return user;
// }

// export async function POST(req) {
//   try {
//     // Get the user first
//     const dbUser = await getDbUserFromClerk();

//     const body = await req.json();
//     const {
//       recipientEmail,
//       recipientName,
//       recipientCompany,
//       subject,
//       emailContent,
//       letterId,
//       salutation,
//       closing,
//       signature,
//       customMessage,
//     } = body;

//     // Validate required fields
//     if (!recipientEmail || !letterId) {
//       return Response.json(
//         { error: "Recipient email and cover letter are required" },
//         { status: 400 }
//       );
//     }

//     // Validate email format
//     if (!validateEmail(recipientEmail)) {
//       return Response.json({ error: "Invalid email format" }, { status: 400 });
//     }

//     if (!dbUser?.refreshToken) {
//       return Response.json(
//         {
//           error:
//             "Gmail not connected. Please connect your Gmail account first.",
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

//     // Get Gmail service
//     let gmail;
//     try {
//       gmail = getGmailService(dbUser.refreshToken);
//     } catch (authError) {
//       console.error("Gmail auth error:", authError);

//       // Update user stats for failure
//       await db.user.update({
//         where: { id: dbUser.id },
//         data: {
//           totalEmailsFailed: { increment: 1 },
//         },
//       });

//       return Response.json(
//         {
//           error: "Gmail authentication failed. Please reconnect your account.",
//         },
//         { status: 401 }
//       );
//     }

//     // Determine final email content
//     let finalEmailContent = "";

//     // Priority: Use emailContent from frontend if available
//     if (emailContent && emailContent.trim()) {
//       finalEmailContent = emailContent;
//     }
//     // Fallback: Build from components
//     else if (customMessage && customMessage.trim()) {
//       // Build content with custom message
//       if (salutation) {
//         finalEmailContent += `${salutation}\n\n`;
//       }

//       finalEmailContent += `${customMessage}\n\n`;
//       finalEmailContent += `${letter.content}\n\n`;

//       if (closing) {
//         finalEmailContent += `${closing}`;
//       }

//       if (signature) {
//         finalEmailContent += `${signature}`;
//       }
//     }
//     // Last resort: Just send the cover letter
//     else {
//       // Add salutation if provided
//       if (salutation) {
//         finalEmailContent += `${salutation}\n\n`;
//       }

//       finalEmailContent = letter.content;

//       // Add closing and signature if provided
//       if (closing || signature) {
//         finalEmailContent += "\n\n";
//         if (closing) {
//           finalEmailContent += `${closing}`;
//         }
//         if (signature) {
//           finalEmailContent += `${signature}`;
//         }
//       }
//     }

//     // Ensure we have content to send
//     if (!finalEmailContent.trim()) {
//       return Response.json(
//         { error: "Email content cannot be empty" },
//         { status: 400 }
//       );
//     }

//     // Create email subject
//     const emailSubject =
//       subject || `Application for ${letter.jobTitle} at ${letter.companyName}`;

//     // Create campaign for single email
//     const campaign = await db.campaign.create({
//       data: {
//         userId: dbUser.id,
//         title: `Single: ${letter.jobTitle} to ${
//           recipientCompany || recipientEmail.split("@")[1]
//         }`,
//         type: "SINGLE",
//         status: "PROCESSING",
//         subject: emailSubject,
//         content: finalEmailContent,
//         coverLetterId: letterId,
//         totalEmails: 1,
//         sentCount: 0,
//         failedCount: 0,
//         startedAt: new Date(),
//       },
//     });

//     try {
//       // Create raw email
//       const raw = createEmail(recipientEmail, emailSubject, finalEmailContent);

//       // Send email
//       const startTime = Date.now();
//       const response = await gmail.users.messages.send({
//         userId: "me",
//         requestBody: { raw },
//       });
//       const processingTimeMs = Date.now() - startTime;

//       // Update user statistics
//       await db.user.update({
//         where: { id: dbUser.id },
//         data: {
//           totalEmailsSent: { increment: 1 },
//           lastEmailSentAt: new Date(),
//         },
//       });

//       // Create successful email log
//       const emailLog = await db.emailLog.create({
//         data: {
//           campaignId: campaign.id,
//           userId: dbUser.id,
//           coverLetterId: letterId,
//           toEmail: recipientEmail,
//           toName: recipientName,
//           toCompany: recipientCompany,
//           subject: emailSubject,
//           content: finalEmailContent,
//           messageId: response.data.id,
//           status: "SENT",
//           statusText: "Email sent successfully",
//           sentAt: new Date(),
//           processingTimeMs,
//           queuedAt: new Date(),
//         },
//       });

//       // Update campaign to completed
//       await db.campaign.update({
//         where: { id: campaign.id },
//         data: {
//           status: "COMPLETED",
//           sentCount: 1,
//           completedAt: new Date(),
//         },
//       });

//       return Response.json({
//         success: true,
//         campaignId: campaign.id,
//         emailLogId: emailLog.id,
//         recipientEmail,
//         recipientName: recipientName || null,
//         recipientCompany: recipientCompany || null,
//         subject: emailSubject,
//         sentAt: new Date().toISOString(),
//         messageId: response.data.id,
//         processingTimeMs,
//         campaignType: "SINGLE",
//       });
//     } catch (sendError) {
//       console.error("Email send error:", sendError);

//       // Update user statistics for failure
//       await db.user.update({
//         where: { id: dbUser.id },
//         data: {
//           totalEmailsFailed: { increment: 1 },
//         },
//       });

//       // Create failed email log
//       await db.emailLog.create({
//         data: {
//           campaignId: campaign.id,
//           userId: dbUser.id,
//           coverLetterId: letterId,
//           toEmail: recipientEmail,
//           toName: recipientName,
//           toCompany: recipientCompany,
//           subject: emailSubject,
//           content: finalEmailContent,
//           status: "FAILED",
//           statusText: "Failed to send",
//           error: sendError.message?.substring(0, 200) || "Unknown error",
//           queuedAt: new Date(),
//         },
//       });

//       // Update campaign to failed
//       await db.campaign.update({
//         where: { id: campaign.id },
//         data: {
//           status: "FAILED",
//           failedCount: 1,
//           errorMessage:
//             sendError.message?.substring(0, 200) || "Failed to send",
//           completedAt: new Date(),
//         },
//       });

//       // Handle specific Gmail API errors
//       if (sendError.code === 429) {
//         return Response.json(
//           { error: "Gmail sending limit reached. Please try again later." },
//           { status: 429 }
//         );
//       }

//       if (sendError.code === 403) {
//         return Response.json(
//           {
//             error:
//               "Gmail sending permission denied. Please reconnect your account.",
//           },
//           { status: 403 }
//         );
//       }

//       return Response.json(
//         {
//           error: sendError.message || "Failed to send email",
//           details: "Please check your Gmail connection and try again.",
//         },
//         { status: 500 }
//       );
//     }
//   } catch (err) {
//     console.error("Single email processing error:", err);

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
//         error: err.message || "Failed to process email request",
//         details: "Please check your input and try again.",
//       },
//       { status: 500 }
//     );
//   }
// }

// export const runtime = "nodejs";

import { db } from "@/lib/prisma";
import { getGmailService } from "@/lib/google";

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

// Get user from Clerk
async function getDbUserFromClerk() {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  console.log("📧 Single Email API Route Clerk UserID:", userId);

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await db.user.findUnique({
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

  if (!user) {
    throw new Error("User not found in database");
  }

  return user;
}

export async function POST(req) {
  try {
    // Get the user first
    const dbUser = await getDbUserFromClerk();

    const body = await req.json();
    const {
      recipientEmail,
      recipientName,
      recipientCompany,
      subject,
      emailContent,
      letterId,
      salutation,
      closing,
      signature,
      customMessage,
    } = body;

    console.log("📧 Sending single email to:", recipientEmail);

    // Validate required fields
    if (!recipientEmail || !letterId) {
      return Response.json(
        { error: "Recipient email and cover letter are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(recipientEmail)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
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

    // Get Gmail service
    let gmail;
    try {
      gmail = getGmailService(dbUser.refreshToken);
    } catch (authError) {
      console.error("Gmail auth error:", authError);

      // Update user stats for failure
      await db.user.update({
        where: { id: dbUser.id },
        data: {
          totalEmailsFailed: { increment: 1 },
        },
      });

      return Response.json(
        {
          error: "Gmail authentication failed. Please reconnect your account.",
        },
        { status: 401 }
      );
    }

    // Determine final email content
    let finalEmailContent = "";

    // Priority: Use emailContent from frontend if available
    if (emailContent && emailContent.trim()) {
      finalEmailContent = emailContent;
    }
    // Fallback: Build from components
    else if (customMessage && customMessage.trim()) {
      // Build content with custom message
      if (salutation) {
        finalEmailContent += `${salutation}\n\n`;
      }

      finalEmailContent += `${customMessage}\n\n`;
      finalEmailContent += `${letter.content}\n\n`;

      if (closing) {
        finalEmailContent += `${closing}`;
      }

      if (signature) {
        finalEmailContent += `${signature}`;
      }
    }
    // Last resort: Just send the cover letter
    else {
      // Add salutation if provided
      if (salutation) {
        finalEmailContent += `${salutation}\n\n`;
      }

      finalEmailContent = letter.content;

      // Add closing and signature if provided
      if (closing || signature) {
        finalEmailContent += "\n\n";
        if (closing) {
          finalEmailContent += `${closing}`;
        }
        if (signature) {
          finalEmailContent += `${signature}`;
        }
      }
    }

    // Ensure we have content to send
    if (!finalEmailContent.trim()) {
      return Response.json(
        { error: "Email content cannot be empty" },
        { status: 400 }
      );
    }

    console.log("📧 Email content length:", finalEmailContent.length);

    // Create email subject
    const emailSubject =
      subject || `Application for ${letter.jobTitle} at ${letter.companyName}`;

    // Create campaign for single email
    const campaign = await db.campaign.create({
      data: {
        userId: dbUser.id,
        title: `Single: ${letter.jobTitle} to ${
          recipientCompany || recipientEmail.split("@")[1] || "Recipient"
        }`,
        type: "SINGLE",
        status: "PROCESSING",
        subject: emailSubject,
        content: finalEmailContent,
        coverLetterId: letterId,
        totalEmails: 1,
        sentCount: 0,
        failedCount: 0,
        startedAt: new Date(),
      },
    });

    console.log("📧 Created campaign:", campaign.id);

    try {
      // Create raw email
      const raw = createEmail(recipientEmail, emailSubject, finalEmailContent);

      // Send email
      const startTime = Date.now();
      const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw },
      });
      const processingTimeMs = Date.now() - startTime;

      console.log("📧 Email sent successfully, message ID:", response.data.id);

      // Update user statistics
      await db.user.update({
        where: { id: dbUser.id },
        data: {
          totalEmailsSent: { increment: 1 },
          lastEmailSentAt: new Date(),
        },
      });

      // Create successful email log
      const emailLog = await db.emailLog.create({
        data: {
          campaignId: campaign.id,
          userId: dbUser.id,
          coverLetterId: letterId,
          toEmail: recipientEmail,
          toName: recipientName,
          toCompany: recipientCompany,
          subject: emailSubject,
          content: finalEmailContent,
          messageId: response.data.id,
          status: "SENT",
          statusText: "Email sent successfully",
          sentAt: new Date(),
          processingTimeMs,
          queuedAt: new Date(),
        },
      });

      console.log("📧 Created email log:", emailLog.id);

      // Update campaign to completed
      await db.campaign.update({
        where: { id: campaign.id },
        data: {
          status: "COMPLETED",
          sentCount: 1,
          completedAt: new Date(),
        },
      });

      return Response.json({
        success: true,
        campaignId: campaign.id,
        emailLogId: emailLog.id,
        recipientEmail,
        recipientName: recipientName || null,
        recipientCompany: recipientCompany || null,
        subject: emailSubject,
        sentAt: new Date().toISOString(),
        messageId: response.data.id,
        processingTimeMs,
        campaignType: "SINGLE",
      });
    } catch (sendError) {
      console.error("📧 Email send error:", sendError);

      // Update user statistics for failure
      await db.user.update({
        where: { id: dbUser.id },
        data: {
          totalEmailsFailed: { increment: 1 },
        },
      });

      // Create failed email log
      await db.emailLog.create({
        data: {
          campaignId: campaign.id,
          userId: dbUser.id,
          coverLetterId: letterId,
          toEmail: recipientEmail,
          toName: recipientName,
          toCompany: recipientCompany,
          subject: emailSubject,
          content: finalEmailContent,
          status: "FAILED",
          statusText: "Failed to send",
          error: sendError.message?.substring(0, 200) || "Unknown error",
          queuedAt: new Date(),
        },
      });

      // Update campaign to failed
      await db.campaign.update({
        where: { id: campaign.id },
        data: {
          status: "FAILED",
          failedCount: 1,
          errorMessage:
            sendError.message?.substring(0, 200) || "Failed to send",
          completedAt: new Date(),
        },
      });

      // Handle specific Gmail API errors
      if (sendError.code === 429) {
        return Response.json(
          { error: "Gmail sending limit reached. Please try again later." },
          { status: 429 }
        );
      }

      if (sendError.code === 403) {
        return Response.json(
          {
            error:
              "Gmail sending permission denied. Please reconnect your account.",
          },
          { status: 403 }
        );
      }

      if (sendError.message?.includes("invalid_grant")) {
        return Response.json(
          {
            error:
              "Gmail authentication expired. Please reconnect your account.",
          },
          { status: 401 }
        );
      }

      return Response.json(
        {
          error: sendError.message || "Failed to send email",
          details: "Please check your Gmail connection and try again.",
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("📧 Single email processing error:", err);

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
        error: err.message || "Failed to process email request",
        details: "Please check your input and try again.",
      },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";