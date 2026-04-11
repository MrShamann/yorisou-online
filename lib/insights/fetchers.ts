import { XMLParser } from "@/lib/insights/xml";
import { getApprovedInsightSourceRegistry } from "@/lib/insights/source-registry";
import type { FetchedInsightItem, InsightSourceConfig, InsightSourceRun } from "@/lib/insights/types";

function cleanText(value: string) {
  return decodeHtmlEntities(value.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parsePublishedAt(value: string) {
  const normalized = value.replace(/\bJST\b/g, "+0900").trim();
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripTags(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function firstMatch(value: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) {
      return match[1] || match[0] || "";
    }
  }
  return "";
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

async function fetchDocument(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "YorisouInsightsBot/1.0 (+https://yorisou.online)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const text = await response.text();
  return {
    finalUrl: response.url || url,
    html: text,
    headers: response.headers,
  };
}

function resolveAbsoluteUrl(href: string, baseUrl: string) {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

function extractMetaContent(html: string, names: string[]) {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `<meta[^>]+(?:name|property)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    );
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeHtmlEntities(match[1]);
    }
  }
  return "";
}

function extractImageUrlFromHtml(html: string, baseUrl?: string) {
  const raw =
    extractMetaContent(html, ["og:image", "twitter:image", "twitter:image:src"]) ||
    firstMatch(html, [
      /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["'][^>]*>/i,
      /<meta[^>]+property=["']og:image:url["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    ]);

  if (!raw) {
    return null;
  }

  const trimmed = decodeHtmlEntities(raw.trim());
  if (!trimmed) {
    return null;
  }

  if (!baseUrl) {
    return trimmed;
  }

  try {
    return new URL(trimmed, baseUrl).toString();
  } catch {
    return trimmed;
  }
}

function extractTitleFromHtml(html: string) {
  return cleanText(
    firstMatch(html, [
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i,
      /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["'][^>]*>/i,
      /<title[^>]*>([\s\S]*?)<\/title>/i,
    ])
  );
}

function extractExcerptFromHtml(html: string) {
  const metaDescription = extractMetaContent(html, ["description", "og:description", "twitter:description"]);
  if (metaDescription) {
    return cleanText(metaDescription);
  }

  const lead = firstMatch(html, [
    /<p[^>]*class=["'][^"']*(?:lead|intro|summary|description)[^"']*["'][^>]*>([\s\S]*?)<\/p>/i,
    /<div[^>]*class=["'][^"']*(?:lead|intro|summary|description)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    /<p[^>]*>([\s\S]{20,500}?)<\/p>/i,
  ]);
  return cleanText(lead);
}

function extractPublishedAtFromHtml(html: string, headers?: Headers) {
  const candidates = [
    extractMetaContent(html, ["article:published_time", "og:updated_time", "publishdate", "date", "lastmod", "cdc:first_published", "cdc:last_updated"]),
    firstMatch(html, [
      /<meta[^>]+property=["']cdc:last_updated["'][^>]+content=["']([^"']+)["'][^>]*>/i,
      /<meta[^>]+property=["']cdc:first_published["'][^>]+content=["']([^"']+)["'][^>]*>/i,
      /<time[^>]+datetime=["']([^"']+)["'][^>]*>/i,
      /(\d{4}[/-]\d{2}[/-]\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?(?:Z|[+-]\d{2}:?\d{2})?)/i,
      /(\d{4}\/\d{2}\/\d{2})/i,
      /(\d{1,2}\.\d{1,2}\.\d{4})/i,
    ]),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const parsed = parsePublishedAt(candidate);
    if (parsed) {
      return parsed;
    }
  }

  const lastModified = headers?.get("last-modified") || headers?.get("Last-Modified") || "";
  const parsedHeader = parsePublishedAt(lastModified);
  return parsedHeader || null;
}

function extractAnchorCandidates(html: string, baseUrl: string, source: InsightSourceConfig) {
  const linkPattern = /<a\b([^>]*?)href=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi;
  const includePatterns = (source.linkIncludePatterns || []).map((pattern) => new RegExp(pattern, "i"));
  const excludePatterns = (source.linkExcludePatterns || []).map((pattern) => new RegExp(pattern, "i"));
  const seen = new Set<string>();
  const anchors: Array<{ url: string; title: string }> = [];

  for (const match of html.matchAll(linkPattern)) {
    const href = decodeHtmlEntities(match[2] || "").trim();
    const title = cleanText(match[4] || "");
    if (!href || !title || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:")) {
      continue;
    }

    const absoluteUrl = resolveAbsoluteUrl(href, baseUrl);
    const lower = `${absoluteUrl} ${title}`.toLowerCase();
    if (includePatterns.length > 0 && !includePatterns.some((pattern) => pattern.test(absoluteUrl) || pattern.test(title))) {
      continue;
    }
    if (excludePatterns.some((pattern) => pattern.test(absoluteUrl) || pattern.test(title) || pattern.test(lower))) {
      continue;
    }
    if (seen.has(absoluteUrl)) {
      continue;
    }

    seen.add(absoluteUrl);
    anchors.push({ url: absoluteUrl, title });
  }

  return anchors;
}

async function parseHtmlArticle(html: string, source: InsightSourceConfig, finalUrl: string, headers?: Headers): Promise<FetchedInsightItem[]> {
  const title = extractTitleFromHtml(html) || source.name;
  const excerpt = extractExcerptFromHtml(html) || title;
  const publishedAt = extractPublishedAtFromHtml(html, headers) || new Date().toISOString();
  return [
    {
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: finalUrl,
      title,
      excerpt,
      publishedAt,
      sourceType: "html_article",
      country: source.country,
      language: source.language,
      imageUrl: extractImageUrlFromHtml(html, finalUrl),
    },
  ];
}

async function parseHtmlIndex(html: string, source: InsightSourceConfig, finalUrl: string, headers?: Headers): Promise<FetchedInsightItem[]> {
  const anchors = extractAnchorCandidates(html, finalUrl, source).slice(0, source.itemLimit || 8);
  const articleItems = await Promise.allSettled(
    anchors.map(async (anchor) => {
      const article = await fetchDocument(anchor.url);
      const title = extractTitleFromHtml(article.html) || anchor.title;
      const excerpt = extractExcerptFromHtml(article.html) || anchor.title;
      const publishedAt = extractPublishedAtFromHtml(article.html, article.headers) || extractPublishedAtFromHtml(html, headers) || new Date().toISOString();
      return {
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: article.finalUrl,
        title,
        excerpt,
        publishedAt,
        sourceType: "html_index" as const,
        country: source.country,
        language: source.language,
        imageUrl: extractImageUrlFromHtml(article.html, article.finalUrl) || extractImageUrlFromHtml(html, finalUrl),
      };
    }),
  );

  const items = articleItems
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter(Boolean) as FetchedInsightItem[];

  if (items.length > 0) {
    return items;
  }

  return parseHtmlArticle(html, source, finalUrl, headers).then((itemsFromPage) => itemsFromPage.map((item) => ({ ...item, sourceType: "html_index" as const })));
}

function parseRss(xml: string, source: InsightSourceConfig): FetchedInsightItem[] {
  const parser = new XMLParser(xml);
  const items = parser.getRepeated("item");

  return items
    .map((item) => {
      const publishedAt = parsePublishedAt(cleanText(item.getFirst("pubDate") || item.getFirst("dc:date") || "")) || new Date().toISOString();

      return {
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: cleanText(item.getFirst("link") || ""),
        title: cleanText(item.getFirst("title") || ""),
        excerpt: cleanText(item.getFirst("description") || ""),
        publishedAt,
        sourceType: "rss" as const,
        country: source.country,
        language: source.language,
        imageUrl: null,
      };
    })
    .filter((item) => Boolean(item.sourceUrl && item.title && item.publishedAt))
    .slice(0, source.itemLimit || 8);
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
        sourceType: "atom",
        country: source.country,
        language: source.language,
      };
    })
    .filter((item): item is FetchedInsightItem => Boolean(item.sourceUrl && item.title && item.publishedAt))
    .slice(0, source.itemLimit || 8);
}

export async function fetchFromSource(source: InsightSourceConfig) {
  if (source.type === "html_article" || source.type === "html_index") {
    const { html, finalUrl, headers } = await fetchDocument(source.url);
    return source.type === "html_article"
      ? parseHtmlArticle(html, source, finalUrl, headers)
      : parseHtmlIndex(html, source, finalUrl, headers);
  }

  const xml = await fetchText(source.url);
  return source.type === "atom" ? parseAtom(xml, source) : parseRss(xml, source);
}

export async function fetchConfiguredSources() {
  const sources = getApprovedInsightSourceRegistry();
  const results = await Promise.allSettled(sources.map((source) => fetchFromSource(source)));

  const items = results.flatMap((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    console.error(`Insight fetch failed for ${sources[index].name}:`, result.reason);
    return [];
  });

  const sourceRuns: InsightSourceRun[] = results.map((result, index) => {
    const source = sources[index];

    if (result.status === "fulfilled") {
      return {
        sourceId: source.id,
        sourceName: source.name,
        fetched: result.value.length,
        sourceType: source.type,
        country: source.country,
        trustScore: source.trust_score,
        approvalStatus: source.approval_status,
        crawlMode: source.crawl_mode,
        sourceClass: source.source_class,
      };
    }

    return {
      sourceId: source.id,
      sourceName: source.name,
      fetched: 0,
      sourceType: source.type,
      country: source.country,
      trustScore: source.trust_score,
      approvalStatus: source.approval_status,
      crawlMode: source.crawl_mode,
      sourceClass: source.source_class,
      error: result.reason instanceof Error ? result.reason.message : String(result.reason),
    };
  });

  return {
    items,
    sourceRuns,
  };
}
