import { NextRequest, NextResponse } from "next/server";
import { sampleImportPayload } from "@/lib/inventory";

const MAX_RESPONSE_BYTES = 180_000;
const REQUEST_TIMEOUT_MS = 8_000;

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
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCandidate(payload: string) {
  const lower = payload.toLowerCase();
  const result: Record<string, string> = {};

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

  if (lower.includes("travel trailer")) {
    result.unitType = "Travel trailer";
  }

  if (!result.description) {
    const descriptionMatch = payload.match(/<meta property="og:description" content="([^"]+)"/i);
    if (descriptionMatch?.[1]) {
      result.description = sanitizeText(descriptionMatch[1]);
    }
  }

  return result;
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
    if (payload.length > MAX_RESPONSE_BYTES) {
      throw new Error("The fetched page was too large to analyze.");
    }

    const extracted = extractCandidate(payload);
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
      specifications: "",
      features: "",
      imageUrls: [] as string[],
      originalUrl: rawUrl,
      sourceNotes: "Partial import based on server-side HTML analysis.",
      missingFields: ["VIN", "Specifications", "Features"],
    };

    if (!normalized.year && !normalized.make && !normalized.model) {
      return NextResponse.json({
        ...sampleImportPayload,
        originalUrl: rawUrl,
        sourceNotes: "The page blocked automated extraction, so a sample draft was returned.",
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
