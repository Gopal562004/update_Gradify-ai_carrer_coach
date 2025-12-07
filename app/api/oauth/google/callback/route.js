import { google } from "googleapis";

export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response(JSON.stringify({ error: "No code provided" }), {
      status: 400,
    });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Store token in localStorage via redirect
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/oauth2callback?access_token=${tokens.access_token}`,
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to get token" }), {
      status: 500,
    });
  }
}
