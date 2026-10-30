export type ChatMessage = { role: "user" | "assistant"; content: string };

const encoder = new TextEncoder();

/**
 * Calls the Gemini streaming API and returns a stream of plain text chunks.
 * Swap this file to use another provider; the route only needs a ReadableStream<Uint8Array> of text.
 */
export async function streamGemini(opts: {
  apiKey: string;
  model: string;
  system: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
  maxTokens?: number;
  /** Give up on this model if no answer text arrives within this many ms */
  firstTextTimeoutMs?: number;
  /** Ask the model to skip or minimise its internal reasoning (faster first words) */
  lowThinking?: boolean;
}): Promise<ReadableStream<Uint8Array>> {
  const base = process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com"; // override only for local tests
  const url = `${base}/v1beta/models/${encodeURIComponent(opts.model)}:streamGenerateContent?alt=sse`;

  // Our own abort controller, linked to the visitor's request, so a slow model can be cut off
  const ctrl = new AbortController();
  const onAbort = () => ctrl.abort(opts.signal?.reason);
  opts.signal?.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => ctrl.abort(new Error("timeout")), opts.firstTextTimeoutMs ?? 15_000);

  const is25 = /2\.5/.test(opts.model);
  const thinking = !opts.lowThinking
    ? {}
    : is25
      ? { thinkingConfig: { thinkingBudget: /flash/.test(opts.model) ? 0 : 128 } }
      : { thinkingConfig: { thinkingLevel: "minimal" } };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      signal: ctrl.signal,
      headers: { "content-type": "application/json", "x-goog-api-key": opts.apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: opts.system }] },
        contents: opts.messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { temperature: 0.3, maxOutputTokens: opts.maxTokens ?? 1500, ...thinking },
      }),
    });
  } catch (err) {
    clearTimeout(timer);
    if (opts.signal?.aborted) throw err;
    throw new Error(`gemini timeout: no response from ${opts.model}`);
  }

  if (!res.ok || !res.body) {
    clearTimeout(timer);
    const detail = await res.text().catch(() => "");
    throw new Error(`gemini ${res.status}: ${detail.slice(0, 400)}`);
  }

  // Wait for the first piece of answer text before handing the stream back, so a model that
  // accepts the request but then stalls still counts as a failure and the next model is tried.
  const textStream = sseToText(res.body);
  const reader = textStream.getReader();
  let first: ReadableStreamReadResult<Uint8Array>;
  try {
    first = await reader.read();
  } catch (err) {
    clearTimeout(timer);
    if (opts.signal?.aborted) throw err;
    throw new Error(`gemini timeout: ${opts.model} accepted the request but sent no text in time`);
  }
  clearTimeout(timer);
  if (first.done) throw new Error(`gemini empty: ${opts.model} returned no text`);

  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(first.value);
    },
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          opts.signal?.removeEventListener("abort", onAbort);
          controller.close();
        } else controller.enqueue(value);
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      ctrl.abort();
      reader.cancel().catch(() => {});
    },
  });
}

/** Parses Gemini's SSE stream into a stream of answer text (skipping reasoning "thought" parts). */
function sseToText(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    // Keep reading until there is answer text to hand on (events with only reasoning or
    // keep-alives produce nothing), otherwise a pull with no output can stall the stream.
    async pull(controller) {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() ?? "";
        let out = "";
        for (const ev of events) {
          for (const line of ev.split(/\r?\n/)) {
            if (!line.startsWith("data:")) continue;
            try {
              const json = JSON.parse(line.slice(5).trim());
              const parts: { text?: string; thought?: boolean }[] = json?.candidates?.[0]?.content?.parts ?? [];
              out += parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("");
            } catch {
              // ignore keep-alives and partial lines
            }
          }
        }
        if (out) {
          controller.enqueue(encoder.encode(out));
          return;
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}

/** Local development stand-in when no API key is set, so the UI can be worked on offline. */
export function mockStream(locale: "he" | "en"): ReadableStream<Uint8Array> {
  const text =
    locale === "he"
      ? "זו תשובת בדיקה מקומית (לא מחובר מודל). בר בנה בפז סוכן AI לאגרות שילוט עירוניות [[municipal-signage-agent]] ומערכת לניתוח כ-10,000 שיחות בחודש [[call-analytics]].\n- סוכנים עם כלים ואישור אנושי\n- חילוץ נתונים ממסמכים\nכדאי להוריד את קורות החיים."
      : "This is a local test reply (no model connected). At Paz, Bar built a Municipal Signage AI Agent [[municipal-signage-agent]] and a system that analyzes about 10,000 calls a month [[call-analytics]].\n- Tool-using agents with human approval\n- Document data extraction\nYou can download his CV for more.";
  const words = text.split(/(\s+)/);
  let i = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (i >= words.length) return controller.close();
      await new Promise((r) => setTimeout(r, 18));
      controller.enqueue(encoder.encode(words.slice(i, i + 3).join("")));
      i += 3;
    },
  });
}
