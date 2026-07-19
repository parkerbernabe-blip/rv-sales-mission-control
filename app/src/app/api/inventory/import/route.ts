import { NextRequest, NextResponse } from "next/server";
import { sampleImportPayload } from "@/lib/inventory";

const MAX_RESPONSE_BYTES = 240_000;
const MAX_NORMALIZED_BYTES = 80_000;
const MAX_IMAGE_URLS = 8;
const REQUEST_TIMEOUT_MS = 8_000;
const DEVELOPMENT = process.env.NODE_ENV !== "production";

function isAllowedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
      return false;
    }

    if (hostname.startsWith("192.168.") || hostname.startsWith("10.") || hostname.startsWith("172.")) {
      return false;
    }

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function sanitizeText(value?: string | null) {
  return (value ?? "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function stripNoise(html: string) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<(nav|footer|aside|noscript|button)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<link[^>]*>/gi, " ")
    .replace(/<(?:div|section|article|p|li|td|th|h1|h2|h3|h4|h5|h6)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeText(text: string) {
  const sections = text.split(/(?=\b(?:stock number|vin|msrp|sale price|floorplan|specifications|features|sleeps|length|weight|year|make|model)\b)/i);
  const relevant = sections.filter((section) => /stock number|vin|msrp|sale price|floorplan|specifications|features|sleeps|length|weight|year|make|model/i.test(section));
  const compact = (relevant.length ? relevant.join(" | ") : text).replace(/\s+/g, " ").trim();
  return truncateText(compact, MAX_NORMALIZED_BYTES);
}

function extractImages(html: string) {
  const hrefs = Array.from(html.matchAll(/https?:\/\/[^"'\s<>]+/gi))
    .map((match) => match[0])
    .filter((value) => /\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i.test(value))
    .filter((value) => !/(logo|icon|pixel|tracker|sprite|thumbnail)/i.test(value))
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .slice(0, MAX_IMAGE_URLS);

  return hrefs;
}

function parseJsonLd(html: string) {
  const matches = Array.from(html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
  return matches.map((match) => match[1]).join("\n");
}

type ExtractedData = {
  year?: string;
  make?: string;
  model?: string;
  floorplan?: string;
  price?: string;
  stockNumber?: string;
  vin?: string;
  unitType?: string;
  location?: string;
  description?: string;
  structuredData: string;
  normalizedText: string;
  imageUrls: string[];
  source: string;
};

function extractCandidate(payload: string): ExtractedData {
  const lower = payload.toLowerCase();
  const result: Record<string, string> = {};
  const structured = parseJsonLd(payload);
  const compactHtml = stripNoise(payload);
  const normalized = normalizeText(compactHtml);

  const patterns = [
    /"year"\s*:\s*"?([0-9]{4})"?/i,
    /"make"\s*:\s*"?([^"\\n]+)"?/i,
    /"model"\s*:\s*"?([^"\\n]+)"?/i,
    /"floorplan"\s*:\s*"?([^"\\n]+)"?/i,
    /"price"\s*:\s*"?([^"\\n]+)"?/i,
    /"stockNumber"\s*:\s*"?([^"\\n]+)"?/i,
    /"vin"\s*:\s*"?([^"\\n]+)"?/i,
    /"unitType"\s*:\s*"?([^"\\n]+)"?/i,
    /"location"\s*:\s*"?([^"\\n]+)"?/i,
    /"description"\s*:\s*"?([^"\\n]+)"?/i,
  ];

  patterns.forEach((pattern) => {
    const match = payload.match(pattern);
    if (match?.[1]) {
      const key = pattern.toString().match(/"([^"]+)"/)?.[1] ?? "value";
      result[key] = sanitizeText(match[1]);
    }
  });

  const metaDescription = payload.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ?? payload.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  if (metaDescription?.[1]) {
    result.description = sanitizeText(metaDescription[1]);
  }

  const titleMatch = payload.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch?.[1] && !result.model) {
    result.model = sanitizeText(titleMatch[1]);
  }

  const priceField = payload.match(/(?:sale price|msrp|price)[^<]{0,40}([\$€£][0-9,\.]+|[0-9,\.]+(?:usd|eur|gbp)?)/i);
  if (priceField?.[1] && !result.price) {
    result.price = sanitizeText(priceField[1]);
  }

  const stockMatch = payload.match(/stock(?:\s+number)?[^<]{0,30}([A-Za-z0-9\-_/]{2,20})/i);
  if (stockMatch?.[1] && !result.stockNumber) {
    result.stockNumber = sanitizeText(stockMatch[1]);
  }

  const vinMatch = payload.match(/\bVIN\b[^<]{0,20}([A-Za-z0-9]{8,20})/i);
  if (vinMatch?.[1] && !result.vin) {
    result.vin = sanitizeText(vinMatch[1]);
  }

  if (lower.includes("travel trailer")) {
    result.unitType = "Travel trailer";
  }

  if (!result.description) {
    result.description = truncateText(normalized, 240);
  }

  return {
    ...result,
    structuredData: truncateText(structured, 12_000),
    normalizedText: truncateText(normalized, MAX_NORMALIZED_BYTES),
    imageUrls: extractImages(payload),
    source: structured ? "json-ld" : metaDescription ? "meta" : "text",
  };
}

export async function POST(request: NextRequest) {
  let rawUrl = "";

  try {
    const body = await request.json();
    rawUrl = typeof body?.url === "string" ? body.url.trim() : "";

    if (!rawUrl || !isAllowedUrl(rawUrl)) {
      return NextResponse.json({ error: "Please provide a public http or https URL." }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(rawUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RVMissionControl/1.0)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error("The URL did not return HTML content.");
    }

    const bytes = await response.arrayBuffer();
    const payload = Buffer.from(bytes).toString("utf-8");
    const responseSize = payload.length;
    const safePayload = responseSize > MAX_RESPONSE_BYTES ? payload.slice(0, MAX_RESPONSE_BYTES) : payload;

    const extracted = extractCandidate(safePayload);
    const normalized = {
      year: extracted.year ?? "",
      make: extracted.make ?? "",
      model: extracted.model ?? "",
      floorplan: extracted.floorplan ?? "",
      condition: "Used",
      price: extracted.price ?? "",
      stockNumber: extracted.stockNumber ?? "",
      vin: extracted.vin ?? "",
      unitType: extracted.unitType ?? "",
      location: extracted.location ?? "",
      description: extracted.description ?? "",
      specifications: extracted.normalizedText ?? "",
      features: extracted.normalizedText ?? "",
      imageUrls: extracted.imageUrls ?? [],
      originalUrl: rawUrl,
      sourceNotes: `Partial import based on server-side HTML analysis${responseSize > MAX_RESPONSE_BYTES ? " with truncated payload" : ""}.`,
      missingFields: [
        ...(extracted.vin ? [] : ["VIN"]),
        ...(extracted.normalizedText ? [] : ["Specifications"]),
        ...(extracted.imageUrls?.length ? [] : ["Features"]),
      ],
      debug: DEVELOPMENT ? {
        responseSize,
        normalizedPayloadSize: extracted.normalizedText?.length ?? 0,
        extractionSource: extracted.source,
        fieldsFound: Object.keys(extracted).filter((key) => key !== "normalizedText" && key !== "structuredData" && key !== "imageUrls"),
      } : undefined,
    };

    if (!normalized.year && !normalized.make && !normalized.model) {
      return NextResponse.json({
        ...sampleImportPayload,
        originalUrl: rawUrl,
        sourceNotes: "The page blocked automated extraction, so a sample draft was returned.",
        missingFields: ["Year", "Make", "Model", "VIN", "Specifications", "Features"],
      });
    }

    return NextResponse.json(normalized);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to analyze the supplied URL.";
    return NextResponse.json({
      ...sampleImportPayload,
      originalUrl: rawUrl,
      sourceNotes: `The server could not analyze the page automatically. ${message}`,
      missingFields: ["Year", "Make", "Model", "VIN", "Specifications", "Features"],
      error: message,
    }, { status: 200 });
  }
}
