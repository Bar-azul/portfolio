import type { Locale } from "@/content/types";
import { systemPrompt } from "@/lib/chat/prompt";
import { mockStream, type ChatMessage } from "@/lib/chat/gemini";
import { detectProvider, modelFor, readKey, streamLLM } from "@/lib/chat/providers";

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

  const apiKey = readKey();
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production" || process.env.CHAT_MOCK === "1") {
      return new Response(mockStream(parsed.locale), { headers });
    }
    return json(503, "not_configured");
  }

  try {
    const stream = await streamLLM({
      key: apiKey,
      system: systemPrompt(parsed.locale),
      messages: parsed.messages,
      signal: req.signal,
    });
    return new Response(stream, { headers });
  } catch (err) {
    console.error("[chat]", err);
    const busy = /^\w+ (429|500|503|529)/.test(String((err as Error).message));
    return json(busy ? 503 : 502, busy ? "busy" : "upstream_error");
  }
}

/**
 * Setup check: open /api/chat in a browser.
 * Shows which provider the key points to and whether a one-word test call works.
 * Never returns the key itself.
 */
export async function GET(req: Request) {
  const key = readKey();
  const headers = { "content-type": "application/json", "cache-control": "no-store" };
  if (!key) return new Response(JSON.stringify({ ok: false, problem: "No API key found in LLM_CV_API_Key. Add it in Vercel and redeploy." }, null, 2), { headers });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (rateLimited(ip)) return json(429, "rate_limited");

  const provider = detectProvider(key);
  const info = { provider, model: modelFor(provider), keyStartsWith: key.slice(0, 4) + "…", keyLength: key.length };
  try {
    const stream = await streamLLM({ key, system: "Reply with the single word: ok", messages: [{ role: "user", content: "ping" }], maxTokens: 300 });
    const text = (await new Response(stream).text()).trim();
    return new Response(JSON.stringify({ ok: !!text, ...info, reply: text.slice(0, 40) }, null, 2), { headers });
  } catch (err) {
    // Provider error messages don't include the key; strip anything key-like just in case
    const msg = String((err as Error).message).replaceAll(key, "[key]");
    return new Response(JSON.stringify({ ok: false, ...info, error: msg }, null, 2), { headers });
  }
}
