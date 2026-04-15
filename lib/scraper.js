import * as cheerio from "cheerio";

// Configuration for fetch
const FETCH_TIMEOUT = 5000; // 5 seconds timeout

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = FETCH_TIMEOUT } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
    headers: {
      ...options.headers,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
  });
  
  clearTimeout(id);
  return response;
}

/**
 * Fetches and parses a Github user's profile and top public repositories.
 */
async function scrapeGithub(url) {
  if (!url) return null;
  try {
    // Extract username from standard github URLs
    const regex = /github\.com\/([a-zA-Z0-9-]+)\/?/;
    const match = url.match(regex);
    if (!match) return "Invalid Github URL format.";
    
    const username = match[1];
    
    // Fetch profile
    const profileRes = await fetchWithTimeout(`https://api.github.com/users/${username}`);
    if (!profileRes.ok) return `Could not fetch Github profile (Status: ${profileRes.status})`;
    const profileData = await profileRes.json();
    
    // Fetch repositories
    const reposRes = await fetchWithTimeout(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    let reposInfo = "";
    if (reposRes.ok) {
      const reposData = await reposRes.json();
      reposInfo = reposData.map((repo) => 
        `- ${repo.name}: ${repo.description || 'No description'} (Lang: ${repo.language || 'N/A'})`
      ).join("\n");
    }

    return `
Bio: ${profileData.bio || "No bio"}
Public Repos: ${profileData.public_repos}
Followers: ${profileData.followers}
Recent Top Repos:
${reposInfo}
    `.trim();

  } catch (error) {
    console.warn("Github scrape failed:", error);
    return "Failed to scrape Github data.";
  }
}

/**
 * Basic native scrape for Portfolio sites. Truncates text.
 */
async function scrapePortfolio(url) {
  if (!url) return null;
  try {
    const response = await fetchWithTimeout(url);
    if (!response.ok) return `Could not fetch Portfolio (Status: ${response.status})`;
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove unwanted scripts and styling
    $('script, style, noscript, nav, footer, iframe').remove();
    
    // Extract main text
    let text = $('body').text().replace(/\s+/g, ' ').trim();
    
    // Truncate to save tokens (limit to ~1000 characters)
    if (text.length > 1000) {
      text = text.substring(0, 1000) + "...";
    }
    
    // Also grab meta description
    const metaDesc = $('meta[name="description"]').attr('content') || "";
    
    return `
Meta Description: ${metaDesc}
Content Snippet: ${text}
    `.trim();

  } catch (error) {
    console.warn("Portfolio scrape failed:", error);
    return "Failed to scrape Portfolio data.";
  }
}

/**
 * Basic attempt at LinkedIn meta tags. Will likely miss robust data due to anti-bot mechanisms.
 */
async function scrapeLinkedIn(url) {
  if (!url) return null;
  try {
    const response = await fetchWithTimeout(url);
    if (!response.ok) return `Could not fetch LinkedIn (Bot blocked or Status: ${response.status})`;
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const title = $('title').text() || "No title";
    const metaDesc = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || "";
    
    return `
Profile Title: ${title}
Meta Detail: ${metaDesc}
(Note: Deep extraction blocked by LinkedIn. Review URL manually if needed.)
    `.trim();

  } catch (error) {
    console.warn("LinkedIn scrape failed:", error);
    return "Failed to scrape LinkedIn data.";
  }
}

/**
 * Main coordinated scraper
 */
export async function scrapeUserLinks(githubUrl, linkedinUrl, portfolioUrl) {
  const [githubData, linkedinData, portfolioData] = await Promise.all([
    scrapeGithub(githubUrl),
    scrapeLinkedIn(linkedinUrl),
    scrapePortfolio(portfolioUrl)
  ]);

  return { githubData, linkedinData, portfolioData };
}
