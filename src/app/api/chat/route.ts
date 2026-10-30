import type { Locale } from "@/content/types";
import { systemPrompt } from "@/lib/chat/prompt";
import { mockStream, streamGemini, type ChatMessage } from "@/lib/chat/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_CHARS = 600;
const MAX_TURNS = 10; // only the latest messages are sent to the model
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 20; // per visitor
const MAX_PER_DAY = Number(process.env.CHAT_DAILY_LIMIT ?? 400); // whole site, per server instance

// In-memory limits: reset when the server instance restarts. Enough for a portfolio;
// for hard limits use a shared store (e.g. Upstash Redis) or a spending cap on the API key.
const visitors = new Map<string, number[]>();
let day = { date: "", count: 0 };

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  if (day.date !== today) day = { date: today, count: 0 };
  if (day.count >= MAX_PER_DAY) return true;

  const recent = (visitors.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    visitors.set(ip, recent);
    return true;
  }
  recent.push(now);
  visitors.set(ip, recent);
  if (visitors.size > 5000) visitors.clear();
  day.count++;
  return false;
}

const json = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { "content-type": "application/json" } });

function parseBody(body: unknown): { messages: ChatMessage[]; locale: Locale } | null {
  if (!body || typeof body !== "object") return null;
  const { messages, locale } = body as { messages?: unknown; locale?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const clean: ChatMessage[] = [];
  for (const m of messages.slice(-MAX_TURNS)) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim();
    if (!text || text.length > (role === "user" ? MAX_MESSAGE_CHARS : 4000)) return null;
    clean.push({ role, content: text });
  }
  if (clean[0].role !== "user") clean.shift();
  if (!clean.length || clean[clean.length - 1].role !== "user") return null;
  return { messages: clean, locale: locale === "he" ? "he" : "en" };
}

export async function POST(req: Request) {
  // Only accept calls from the site itself
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json(403, "forbidden");
    } catch {
      return json(403, "forbidden");
    }
  }

  const parsed = parseBody(await req.json().catch(() => null));
  if (!parsed) return json(400, "bad_request");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
  if (rateLimited(ip)) return json(429, "rate_limited");

  const headers = {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  };

  // Vercel env var name chosen in the dashboard; GEMINI_API_KEY also works
  const apiKey = process.env.LLM_CV_API_Key || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production" || process.env.CHAT_MOCK === "1") {
      return new Response(mockStream(parsed.locale), { headers });
    }
    return json(503, "not_configured");
  }

  try {
    const stream = await streamGemini({
      apiKey,
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      system: systemPrompt(parsed.locale),
      messages: parsed.messages,
      signal: req.signal,
    });
    return new Response(stream, { headers });
  } catch (err) {
    console.error("[chat]", err);
    return json(502, "upstream_error");
  }
}
