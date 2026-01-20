import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request) {
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

    // Get user's campaigns with related data
    const campaigns = await db.campaign.findMany({
      where: {
        userId: dbUser.id,
      },
      include: {
        coverLetter: {
          select: {
            id: true,
            jobTitle: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100, // Limit to recent campaigns
    });

    // Format the response with progress calculation
    const formattedCampaigns = campaigns.map((campaign) => {
      const progress =
        campaign.totalEmails > 0
          ? Math.round(
              ((campaign.sentCount + campaign.failedCount) /
                campaign.totalEmails) *
                100
            )
          : 0;

      return {
        id: campaign.id,
        title: campaign.title,
        type: campaign.type,
        status: campaign.status,
        subject: campaign.subject,
        totalEmails: campaign.totalEmails,
        sentCount: campaign.sentCount,
        failedCount: campaign.failedCount,
        startedAt: campaign.startedAt,
        completedAt: campaign.completedAt,
        coverLetterId: campaign.coverLetterId,
        coverLetter: campaign.coverLetter,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        progress,
      };
    });

    return Response.json({
      campaigns: formattedCampaigns,
      total: formattedCampaigns.length,
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return Response.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
