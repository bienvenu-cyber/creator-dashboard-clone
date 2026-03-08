import { siteUrl } from "@/lib/constants";

export async function GET() {
  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
          <channel>
              <title>GhostDash Changelog</title>
              <description>Latest updates to GhostDash</description>
              <link>${siteUrl}/changelog</link>
              <language>en-us</language>
          </channel>
      </rss>`;

  return new Response(feed, {
    status: 200,
    headers: { "Content-Type": "application/rss+xml" },
  });
}
