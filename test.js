// test-oauth.js
const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/gmail.send",
  ],
});

console.log("Current redirect_uri being sent to Google:");
console.log("From .env:", process.env.GOOGLE_REDIRECT_URI);
console.log(
  "Generated URL:",
  url.split("redirect_uri=")[1]?.split("&")[0] || "Not found"
);
