"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Locale } from "@/content/types";
import { chatUi, localePath, t } from "@/lib/i18n";

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };

export const OPEN_CHAT_EVENT = "portfolio:open-chat";
const MAX_CHARS = 600;
// [[slug]] tags; tolerate a model putting several slugs in one tag: [[a, b]]
const CITE = /\[\[\s*([a-z0-9-]+(?:\s*[,;]\s*[a-z0-9-]+)*)\s*\]\]/g;

/** Turns assistant text into paragraphs, "- " bullets and project citation chips. */
function Answer({ text, locale, titles }: { text: string; locale: Locale; titles: Record<string, string> }) {
  const inline = (s: string, key: string) => {
    const parts = s.split(CITE);
    return parts.map((part, i) => {
      if (i % 2 === 0) return <Fragment key={`${key}-${i}`}>{part}</Fragment>;
      // unknown slugs are dropped rather than shown as broken links
      const slugs = [...new Set(part.split(/\s*[,;]\s*/))].filter((x) => titles[x]);
      return slugs.map((slug) => (
        <Link
          key={`${key}-${i}-${slug}`}
          href={localePath(locale, `/projects/${slug}`)}
          className="mx-0.5 inline-flex items-center rounded-md border border-signal/40 bg-signal/10 px-1.5 py-px align-baseline text-[12px] font-medium text-signal hover:border-signal"
        >
          {titles[slug]}
        </Link>
      ));
    });
  };

  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (!list.length) return;
    const items = list;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="space-y-1 ps-4 [list-style:disc] marker:text-signal">
        {items.map((li, i) => (
          <li key={i}>{inline(li, `li-${blocks.length}-${i}`)}</li>
        ))}
      </ul>,
    );
    list = [];
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (/^[-•*]\s+/.test(line)) {
      list.push(line.replace(/^[-•*]\s+/, ""));
      continue;
    }
    flush();
    if (line) blocks.push(<p key={`p-${blocks.length}`}>{inline(line.replace(/\*\*/g, ""), `p-${blocks.length}`)}</p>);
  }
  flush();
  return <div className="space-y-2">{blocks}</div>;
}

export function ChatWidget({ locale, titles }: { locale: Locale; titles: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || busy) return;
      if (q.length > MAX_CHARS) {
        setMessages((m) => [...m, { role: "user", content: q }, { role: "assistant", content: t(chatUi.tooLong, locale), error: true }]);
        return;
      }
      const history = [...messages.filter((m) => !m.error), { role: "user" as const, content: q }];
      setMessages((m) => [...m, { role: "user", content: q }]);
      setInput("");
      setBusy(true);

      const ctrl = new AbortController();
      abortRef.current = ctrl;
      let timedOut = false;
      // If nothing arrives for 45s, stop and say so rather than leaving the dots running
      let watchdog = setTimeout(() => ((timedOut = true), ctrl.abort()), 45_000);
      const bump = () => {
        clearTimeout(watchdog);
        watchdog = setTimeout(() => ((timedOut = true), ctrl.abort()), 20_000);
      };
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ locale, messages: history.map(({ role, content }) => ({ role, content })) }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const code = (await res.json().catch(() => ({}))).error as keyof typeof chatUi.errors | undefined;
          const msg = chatUi.errors[code && code in chatUi.errors ? code : "generic"];
          setMessages((m) => [...m, { role: "assistant", content: t(msg, locale), error: true }]);
          return;
        }
        setMessages((m) => [...m, { role: "assistant", content: "" }]);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          bump();
          const chunk = decoder.decode(value, { stream: true });
          setMessages((m) => {
            const copy = m.slice();
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = { ...last, content: last.content + chunk };
            return copy;
          });
        }
        setMessages((m) => {
          const last = m[m.length - 1];
          return last.content.trim() ? m : [...m.slice(0, -1), { role: "assistant", content: t(chatUi.errors.generic, locale), error: true }];
        });
      } catch (err) {
        if (timedOut) {
          setMessages((m) => {
            const last = m[m.length - 1];
            const base = last?.role === "assistant" && !last.content.trim() ? m.slice(0, -1) : m;
            return last?.role === "assistant" && last.content.trim()
              ? m
              : [...base, { role: "assistant", content: t(chatUi.errors.busy, locale), error: true }];
          });
        } else if ((err as Error).name !== "AbortError") {
          setMessages((m) => [...m, { role: "assistant", content: t(chatUi.errors.generic, locale), error: true }]);
        }
      } finally {
        clearTimeout(watchdog);
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, locale, messages],
  );

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
    inputRef.current?.focus();
  };

  const waiting = busy && messages[messages.length - 1]?.role === "user";

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          data-chat-launch
          onClick={() => setOpen(true)}
          className="chat-launcher fixed z-50 flex items-center gap-2 rounded-full bg-signal py-3 pe-5 ps-4 font-semibold text-canvas shadow-[0_8px_30px_rgb(0_0_0/0.45)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
          style={{
            bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
            // start side: left in English, right in Hebrew
            insetInlineStart: "calc(1rem + max(env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px)))",
          }}
          aria-haspopup="dialog"
        >
          <span aria-hidden className="relative grid size-5 place-items-center">
            <span className="absolute size-5 animate-ping rounded-full bg-canvas/25 motion-reduce:hidden" />
            <svg viewBox="0 0 20 20" className="size-5" fill="currentColor">
              <path d="M10 2a1 1 0 0 1 .95.68l1.1 3.27 3.27 1.1a1 1 0 0 1 0 1.9l-3.27 1.1-1.1 3.27a1 1 0 0 1-1.9 0l-1.1-3.27-3.27-1.1a1 1 0 0 1 0-1.9l3.27-1.1 1.1-3.27A1 1 0 0 1 10 2Zm5.5 10a.75.75 0 0 1 .71.51l.43 1.28 1.28.43a.75.75 0 0 1 0 1.42l-1.28.43-.43 1.28a.75.75 0 0 1-1.42 0l-.43-1.28-1.28-.43a.75.75 0 0 1 0-1.42l1.28-.43.43-1.28A.75.75 0 0 1 15.5 12Z" />
            </svg>
          </span>
          {t(chatUi.launch, locale)}
        </button>
      )}

      {open && (
        <section
          role="dialog"
          aria-modal="false"
          aria-label={t(chatUi.title, locale)}
          onKeyDown={(e) => e.key === "Escape" && close()}
          className="chat-panel fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-[0_20px_60px_rgb(0_0_0/0.55)]"
        >
          <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
            <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-lg bg-signal text-[13px] font-bold text-canvas">
              BA
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 font-semibold leading-tight">
                {t(chatUi.title, locale)}
                <span aria-hidden className="size-1.5 rounded-full bg-live" />
              </p>
              <p className="truncate text-[12.5px] text-muted">{t(chatUi.subtitle, locale)}</p>
            </div>
            {messages.length > 0 && (
              <button type="button" onClick={reset} className="rounded-md px-2 py-1 text-[13px] text-muted hover:text-ink">
                {t(chatUi.reset, locale)}
              </button>
            )}
            <button
              type="button"
              onClick={close}
              aria-label={t(chatUi.close, locale)}
              className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-ink"
            >
              <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </header>

          <div ref={scroller} className="chat-scroll dot-grid min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 text-[14.5px] leading-relaxed" aria-live="polite">
            <div className="max-w-[90%] rounded-2xl rounded-ss-sm border border-line bg-surface px-3.5 py-2.5">{t(chatUi.intro, locale)}</div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {chatUi.suggestions[locale].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-line bg-canvas px-3 py-1.5 text-start text-[13px] text-ink/90 transition-colors hover:border-signal hover:text-signal"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="ms-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-se-sm bg-signal px-3.5 py-2.5 text-canvas">
                  {m.content}
                </div>
              ) : (
                <div
                  key={i}
                  className={clsx(
                    "max-w-[90%] rounded-2xl rounded-ss-sm border px-3.5 py-2.5",
                    m.error ? "border-signal/40 bg-signal/5 text-ink/90" : "border-line bg-surface",
                  )}
                >
                  {m.content ? <Answer text={m.content} locale={locale} titles={titles} /> : null}
                </div>
              ),
            )}

            {waiting && (
              <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-ss-sm border border-line bg-surface px-3.5 py-3" aria-label={t(chatUi.thinking, locale)}>
                {[0, 1, 2].map((d) => (
                  <span key={d} className="typing-dot size-1.5 rounded-full bg-signal" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-line bg-surface px-3 pb-2 pt-3"
          >
            <div className="flex items-end gap-2">
              <label htmlFor="chat-input" className="sr-only">
                {t(chatUi.placeholder, locale)}
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                rows={1}
                maxLength={MAX_CHARS}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={t(chatUi.placeholder, locale)}
                className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-line bg-canvas px-3 py-2.5 text-[16px] leading-snug text-ink placeholder:text-muted focus:border-signal focus:outline-none sm:text-[14.5px]"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={t(chatUi.send, locale)}
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-signal text-canvas transition-opacity disabled:opacity-40"
              >
                <svg viewBox="0 0 20 20" className="size-5 rtl:-scale-x-100" fill="currentColor">
                  <path d="M3.1 2.3a.75.75 0 0 0-.98.93l1.8 5.53a.75.75 0 0 0 .6.5l6.03.98-6.03.98a.75.75 0 0 0-.6.5l-1.8 5.54a.75.75 0 0 0 .98.92l14.5-6.75a.75.75 0 0 0 0-1.36L3.1 2.3Z" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[11.5px] text-muted">{t(chatUi.disclaimer, locale)}</p>
          </form>
        </section>
      )}
    </>
  );
}

/** A button anywhere on the page that opens the chat panel. */
export function OpenChatButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button type="button" data-chat-launch onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))} className={className}>
      {children}
    </button>
  );
}
