import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Helper function to get user from Clerk
async function getDbUserFromClerk() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!dbUser) {
    throw new Error("User not found in database");
  }

  return dbUser;
}

export async function GET(request, { params }) {
  try {
    const dbUser = await getDbUserFromClerk();

    // Await params before destructuring
    const { id } = await params;

    const campaign = await db.campaign.findFirst({
      where: {
        id: id,
        userId: dbUser.id,
      },
      include: {
        emailLogs: {
          orderBy: {
            createdAt: "desc",
          },
          take: 50,
        },
      },
    });

    if (!campaign) {
      return Response.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Calculate progress
    const progress =
      campaign.totalEmails > 0
        ? Math.round(
            ((campaign.sentCount + campaign.failedCount) /
              campaign.totalEmails) *
              100
          )
        : 0;

    return Response.json({
      campaign: {
        ...campaign,
        progress,
      },
      total: campaign.totalEmails,
      sent: campaign.sentCount,
      failed: campaign.failedCount,
      emailLogs: campaign.emailLogs,
    });
  } catch (error) {
    console.error("Error fetching campaign:", error);

    if (error.message?.includes("not authenticated")) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return Response.json(
      { error: "Failed to fetch campaign details" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const dbUser = await getDbUserFromClerk();
    const { id } = await params;

    // Find the campaign
    const campaign = await db.campaign.findFirst({
      where: {
        id: id,
        userId: dbUser.id,
      },
    });

    if (!campaign) {
      return Response.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Only allow cancelling if still processing
    if (campaign.status !== "PROCESSING") {
      return Response.json(
        { error: "Campaign cannot be cancelled. Status: " + campaign.status },
        { status: 400 }
      );
    }

    // Update campaign status
    await db.campaign.update({
      where: { id: id },
      data: {
        status: "CANCELLED",
        completedAt: new Date(),
        errorMessage: "Cancelled by user",
      },
    });

    // Update pending email logs
    await db.emailLog.updateMany({
      where: {
        campaignId: id,
        status: "PENDING",
      },
      data: {
        status: "FAILED",
        statusText: "Campaign cancelled",
        error: "Campaign was cancelled before sending",
      },
    });

    return Response.json({
      success: true,
      message: "Campaign cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling campaign:", error);

    if (error.message?.includes("not authenticated")) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return Response.json(
      { error: "Failed to cancel campaign" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
