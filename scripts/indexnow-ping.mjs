#!/usr/bin/env node
/**
 * IndexNow ping (https://www.indexnow.org).
 *
 * Notifies Bing (and every IndexNow-participating engine, which feeds
 * ChatGPT Search and Perplexity) that our URLs changed, so they recrawl in
 * minutes instead of waiting for their own schedule.
 *
 * How ownership works: the KEY below is public by design. It is served as a
 * static file at https://rondaprive.com/<KEY>.txt (see public/<KEY>.txt).
 * IndexNow fetches that file to confirm we own the domain before accepting
 * the submission. To rotate: generate a new hex key (`openssl rand -hex 16`),
 * rename the public/*.txt file to match, and update KEY here.
 *
 * Runs after every GitHub Pages deploy (see .github/workflows/deploy.yml).
 * It reads the LIVE sitemap so it always pings exactly what is published.
 */

const KEY = "39a0e07302e3b83614a0fadcf2d047a3";
const HOST = "rondaprive.com";
const SITE = `https://${HOST}`;
const SITEMAP_URL = `${SITE}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const fetchSitemapUrls = async () => {
  const res = await fetch(SITEMAP_URL, { headers: { "cache-control": "no-cache" } });
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status} ${res.statusText}`);
  const xml = await res.text();
  // Only top-level <loc> entries (the canonical page URLs), not the
  // <xhtml:link> hreflang alternates which repeat the same URLs.
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  return [...new Set(urls)];
};

const ping = async (urlList) => {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList,
    }),
  });
  return res;
};

const main = async () => {
  const urls = await fetchSitemapUrls();
  if (!urls.length) {
    console.error("✗ No URLs found in sitemap — nothing to ping.");
    process.exit(1);
  }
  console.log(`Pinging IndexNow with ${urls.length} URLs from ${SITEMAP_URL}`);
  const res = await ping(urls);
  const body = await res.text();
  // IndexNow returns 200 (accepted) or 202 (accepted, pending validation).
  if (res.status === 200 || res.status === 202) {
    console.log(`✓ IndexNow accepted (${res.status}).`);
  } else {
    console.error(`✗ IndexNow responded ${res.status} ${res.statusText}: ${body}`);
    process.exit(1);
  }
};

main().catch((err) => {
  console.error(`✗ IndexNow ping failed: ${err.message}`);
  process.exit(1);
});
