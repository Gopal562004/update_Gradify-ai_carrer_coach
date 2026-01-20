// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// // Helper to get database user from Clerk
// async function getDbUserFromClerk() {
//   const { userId } = await auth();

//   if (!userId) {
//     throw new Error("User not authenticated");
//   }

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//     select: {
//       id: true,
//       email: true,
//       name: true,
//     },
//   });

//   if (!user) {
//     throw new Error("User not found in database");
//   }

//   return user;
// }

// // GET: Get active campaigns
// export async function GET() {
//   try {
//     const dbUser = await getDbUserFromClerk();

//     // Find all active campaigns for this user
//     // IMPORTANT: Use uppercase "PROCESSING" as defined in your enum
//     const activeCampaigns = await db.campaign.findMany({
//       where: {
//         userId: dbUser.id,
//         status: "PROCESSING", // Use uppercase
//       },
//       include: {
//         coverLetter: {
//           select: {
//             jobTitle: true,
//             companyName: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       take: 5,
//     });

//     // Calculate progress for each campaign
//     const campaignsWithProgress = activeCampaigns.map((campaign) => {
//       const processed = campaign.sentCount + campaign.failedCount;
//       const progress =
//         campaign.totalEmails > 0
//           ? Math.round((processed / campaign.totalEmails) * 100)
//           : 0;

//       // Calculate estimated time remaining
//       let estimatedTimeRemaining = null;
//       if (
//         campaign.status === "PROCESSING" &&
//         processed > 0 &&
//         campaign.startedAt
//       ) {
//         const elapsedMs = new Date() - new Date(campaign.startedAt);
//         const msPerEmail = elapsedMs / processed;
//         const remainingEmails = campaign.totalEmails - processed;
//         estimatedTimeRemaining = Math.ceil(
//           (msPerEmail * remainingEmails) / 60000
//         ); // in minutes
//       }

//       return {
//         id: campaign.id,
//         title: campaign.title,
//         type: campaign.type,
//         status: campaign.status,
//         progress,
//         totalEmails: campaign.totalEmails,
//         sentCount: campaign.sentCount,
//         failedCount: campaign.failedCount,
//         startedAt: campaign.startedAt,
//         coverLetter: campaign.coverLetter,
//         estimatedTimeRemaining,
//       };
//     });

//     return Response.json({
//       success: true,
//       campaigns: campaignsWithProgress,
//       totalActive: activeCampaigns.length,
//     });
//   } catch (err) {
//     console.error("Active jobs error:", err);

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
//         error: "Failed to get active campaigns",
//         details: err.message,
//       },
//       { status: 500 }
//     );
//   }
// }

// export const runtime = "nodejs";


import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const dbUser = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Get active campaigns (PROCESSING or PENDING)
    const activeCampaigns = await db.campaign.findMany({
      where: {
        userId: dbUser.id,
        status: {
          in: ["PROCESSING", "PENDING"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // Format campaigns with progress
    const formattedCampaigns = activeCampaigns.map((campaign) => {
      const progress =
        campaign.totalEmails > 0
          ? Math.round(
              ((campaign.sentCount + campaign.failedCount) /
                campaign.totalEmails) *
                100
            )
          : 0;

      return {
        ...campaign,
        progress,
      };
    });

    return Response.json({
      campaigns: formattedCampaigns,
      count: formattedCampaigns.length,
    });
  } catch (error) {
    console.error("Error fetching active campaigns:", error);
    return Response.json(
      { error: "Failed to fetch active campaigns" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";