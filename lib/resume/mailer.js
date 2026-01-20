import nodemailer from "nodemailer";
import { oauth2Client } from "./google";

export async function createTransporter(refreshToken: string) {
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_SENDER, // your Gmail
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken,
      accessToken: accessToken.token,
    },
  });
}
