import { oauth2Client } from "@/lib/google";

export async function GET() {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://mail.google.com/", // REQUIRED for sending emails
    ],
  });

  return Response.redirect(url);
}
