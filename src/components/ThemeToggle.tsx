"use client";

import type { Locale } from "@/content/types";

export const THEME_KEY = "theme";

/**
 * Runs in <head> before the page paints, so there is no flash of the wrong theme.
 * Saved choice wins; otherwise follow the device setting; dark if anything fails.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`;

const label = {
  he: "החלפה בין מצב בהיר לכהה",
  en: "Switch between light and dark mode",
};

/** Sun in dark mode (switch to light), moon in light mode (switch to dark). Icons swap with CSS, so server and client markup match. */
export function ThemeToggle({ locale }: { locale: Locale }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) root.classList.add("theme-switching");
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // private mode etc.: the switch still works for this visit
    }
    if (!reduce) window.setTimeout(() => root.classList.remove("theme-switching"), 300);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label[locale]}
      title={label[locale]}
      className="grid size-8 shrink-0 place-items-center rounded-md border border-line text-ink transition-colors hover:border-muted"
    >
      {/* sun: shown in dark mode */}
      <svg viewBox="0 0 24 24" className="size-[18px] light:hidden" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
      </svg>
      {/* moon: shown in light mode */}
      <svg viewBox="0 0 24 24" className="hidden size-[18px] light:block" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
      </svg>
    </button>
  );
}
