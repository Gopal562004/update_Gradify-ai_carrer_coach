// app/api/google/logout/route.js
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clear Google OAuth tokens from user record
    await db.user.update({
      where: { clerkUserId: userId },
      data: {
        provider: null,
        refreshToken: null,
        canSendEmail: false,
        // Keep email stats, just disable sending
      },
    });

    return NextResponse.json({
      success: true,
      message: "Gmail disconnected successfully",
    });
  } catch (error) {
    console.error("Error disconnecting Gmail:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Gmail" },
      { status: 500 },
    );
  }
}
