"use client";

import Script from "next/script";
import { useEffect } from "react";
import { GA_ID } from "@/lib/site";

type Gtag = (...args: unknown[]) => void;

/**
 * Sends a named event to Google Analytics. Safe to call anywhere: does nothing when
 * analytics isn't configured or has been blocked by the visitor's browser.
 */
export function track(event: string, params: Record<string, string | number> = {}) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (GA_ID && typeof gtag === "function") gtag("event", event, params);
}

/**
 * Loads Google Analytics 4 when NEXT_PUBLIC_GA_ID is set.
 * Page views (including client-side navigation) come from GA4's enhanced measurement;
 * the click listener below adds the actions a recruiter takes.
 */
export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    // One delegated listener covers links rendered anywhere on the page, now or later
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const lang = document.documentElement.lang;
      if (/\.pdf($|\?)/i.test(href)) track("cv_download", { lang });
      else if (href.startsWith("mailto:")) track("contact_click", { method: "email", lang });
      else if (href.includes("wa.me")) track("contact_click", { method: "whatsapp", lang });
      else if (href.includes("linkedin.com")) track("contact_click", { method: "linkedin", lang });
      else if (href.includes("github.com")) track("contact_click", { method: "github", lang });
      else if (a.hasAttribute("hreflang")) track("language_switch", { to: a.getAttribute("hreflang") || "" });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
