import { streamGemini, type ChatMessage } from "./gemini";

export type Provider = "gemini" | "openai" | "anthropic";

const encoder = new TextEncoder();

/** Reads the key from the env, trimming spaces and stray quotes pasted into the dashboard. */
export function readKey(): string | undefined {
  const raw = process.env.LLM_CV_API_Key || process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;
  const key = raw?.trim().replace(/^["']|["']$/g, "").trim();
  return key || undefined;
}

/** Works out the provider from the key's prefix, unless LLM_PROVIDER says otherwise. */
export function detectProvider(key: string): Provider {
  const forced = process.env.LLM_PROVIDER?.toLowerCase();
  if (forced === "gemini" || forced === "openai" || forced === "anthropic") return forced;
  if (key.startsWith("sk-ant-")) return "anthropic";
  if (key.startsWith("sk-")) return "openai";
  return "gemini"; // Google AI Studio keys start with "AIza"
}

const DEFAULT_MODEL: Record<Provider, string> = {
  gemini: "gemini-3.8-flash",
  openai: "gpt-4.1-mini",
  anthropic: "claude-haiku-5-5",
};

export const modelFor = (p: Provider) => process.env.LLM_MODEL || (p === "gemini" && process.env.GEMINI_MODEL) || DEFAULT_MODEL[p];

/** Reads an SSE response and emits the text pulled out of each `data:` event. */
function sseText(res: Response, pick: (json: any) => string | undefined): ReadableStream<Uint8Array> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) return controller.close();
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const text = pick(JSON.parse(data));
          if (text) controller.enqueue(encoder.encode(text));
        } catch {
          // ignore partial lines
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}

async function fail(res: Response, provider: Provider): Promise<never> {
  const detail = await res.text().catch(() => "");
  throw new Error(`${provider} ${res.status}: ${detail.slice(0, 400)}`);
}

export async function streamLLM(opts: {
  key: string;
  system: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
  maxTokens?: number;
}): Promise<ReadableStream<Uint8Array>> {
  const provider = detectProvider(opts.key);
  const model = modelFor(provider);
  // Newer models may spend part of the budget on reasoning, so leave room for the answer
  const maxTokens = opts.maxTokens ?? 1500;

  if (provider === "gemini") {
    // Google retires model names over time; if the chosen one is gone (404), fall back to the
    // "latest Flash" alias so the chat keeps working without a code change.
    const candidates = [...new Set([model, "gemini-flash-latest"])];
    let lastErr: unknown;
    for (const m of candidates) {
      try {
        return await streamGemini({ apiKey: opts.key, model: m, system: opts.system, messages: opts.messages, signal: opts.signal, maxTokens });
      } catch (err) {
        lastErr = err;
        if (!/^gemini 404/.test(String((err as Error).message))) throw err;
      }
    }
    throw lastErr;
  }

  if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: opts.signal,
      headers: { "content-type": "application/json", authorization: `Bearer ${opts.key}` },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.3,
        max_tokens: maxTokens,
        messages: [{ role: "system", content: opts.system }, ...opts.messages],
      }),
    });
    if (!res.ok || !res.body) await fail(res, provider);
    return sseText(res, (j) => j?.choices?.[0]?.delta?.content);
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal: opts.signal,
    headers: { "content-type": "application/json", "x-api-key": opts.key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model, stream: true, max_tokens: maxTokens, temperature: 0.3, system: opts.system, messages: opts.messages }),
  });
  if (!res.ok || !res.body) await fail(res, provider);
  return sseText(res, (j) => (j?.type === "content_block_delta" ? j.delta?.text : undefined));
}
