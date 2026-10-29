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
}): Promise<ReadableStream<Uint8Array>> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(opts.model)}:streamGenerateContent?alt=sse`;
  const res = await fetch(url, {
    method: "POST",
    signal: opts.signal,
    headers: { "content-type": "application/json", "x-goog-api-key": opts.apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: opts.messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 600,
        // Answers come from the profile, so skip "thinking" tokens: faster and cheaper
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini ${res.status}: ${detail.slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? "";
      for (const ev of events) {
        for (const line of ev.split(/\r?\n/)) {
          if (!line.startsWith("data:")) continue;
          try {
            const json = JSON.parse(line.slice(5).trim());
            const parts: { text?: string }[] = json?.candidates?.[0]?.content?.parts ?? [];
            const text = parts.map((p) => p.text ?? "").join("");
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            // ignore keep-alives and partial lines
          }
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
