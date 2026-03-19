import { XMLParser } from "@/lib/insights/xml";
import { insightSources } from "@/lib/insights/sources";
import type { FetchedInsightItem, InsightSourceConfig, InsightSourceRun } from "@/lib/insights/types";

function cleanText(value: string) {
  return value.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parsePublishedAt(value: string) {
  const normalized = value.replace(/\bJST\b/g, "+0900").trim();
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "YorisouInsightsBot/1.0 (+https://yorisou.online)",
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, text/html;q=0.8",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const headerText = new TextDecoder("utf-8").decode(bytes.slice(0, 120));
  const encodingMatch = headerText.match(/encoding=["']([^"']+)["']/i);
  const encoding = encodingMatch?.[1]?.toLowerCase() === "shift_jis" ? "shift_jis" : "utf-8";

  return new TextDecoder(encoding).decode(bytes);
}

function parseRss(xml: string, source: InsightSourceConfig): FetchedInsightItem[] {
  const parser = new XMLParser(xml);
  const items = parser.getRepeated("item");

  return items
    .map((item) => {
      const publishedAt = parsePublishedAt(cleanText(item.getFirst("pubDate") || item.getFirst("dc:date") || ""));

      return {
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: cleanText(item.getFirst("link") || ""),
        title: cleanText(item.getFirst("title") || ""),
        excerpt: cleanText(item.getFirst("description") || ""),
        publishedAt,
      };
    })
    .filter((item): item is FetchedInsightItem => Boolean(item.sourceUrl && item.title && item.publishedAt));
}

function parseAtom(xml: string, source: InsightSourceConfig): FetchedInsightItem[] {
  const parser = new XMLParser(xml);
  const entries = parser.getRepeated("entry");

  return entries
    .map((entry) => {
      const links = entry.getRepeated("link");
      const href = links.find((link) => link.getAttribute("rel") !== "self")?.getAttribute("href") || links[0]?.getAttribute("href") || "";
      const summary = cleanText(entry.getFirst("summary") || entry.getFirst("content") || "");
      const publishedAt = parsePublishedAt(cleanText(entry.getFirst("updated") || entry.getFirst("published") || ""));

      return {
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: cleanText(href),
        title: cleanText(entry.getFirst("title") || ""),
        excerpt: summary,
        publishedAt,
      };
    })
    .filter((item): item is FetchedInsightItem => Boolean(item.sourceUrl && item.title && item.publishedAt));
}

export async function fetchFromSource(source: InsightSourceConfig) {
  const xml = await fetchText(source.url);
  return source.type === "atom" ? parseAtom(xml, source) : parseRss(xml, source);
}

export async function fetchConfiguredSources() {
  const results = await Promise.allSettled(insightSources.map((source) => fetchFromSource(source)));

  const items = results.flatMap((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    console.error(`Insight fetch failed for ${insightSources[index].name}:`, result.reason);
    return [];
  });

  const sourceRuns: InsightSourceRun[] = results.map((result, index) => {
    const source = insightSources[index];

    if (result.status === "fulfilled") {
      return {
        sourceId: source.id,
        sourceName: source.name,
        fetched: result.value.length,
      };
    }

    return {
      sourceId: source.id,
      sourceName: source.name,
      fetched: 0,
      error: result.reason instanceof Error ? result.reason.message : String(result.reason),
    };
  });

  return {
    items,
    sourceRuns,
  };
}
