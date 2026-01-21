import { oauth2Client } from "@/lib/google";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return Response.json({ error: "Missing code" }, { status: 400 });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Save refresh token in database
    await db.user.update({
      where: { clerkUserId: userId },
      data: {
        provider: "google",
        refreshToken: tokens.refresh_token, // store securely
        canSendEmail: true,
      },
    });

    // return Response.redirect("http://localhost:3000/ai-cover-letter/email");
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/ai-cover-letter/email`,
    );
  } catch (error) {
    console.error("Google OAuth Error:", error);
    return Response.json({ error: "OAuth failed" }, { status: 500 });
  }
}
