"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/content/types";
import { profile } from "@/content/profile";
import { t, ui } from "@/lib/i18n";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}`;
  const other: Locale = locale === "he" ? "en" : "he";
  const switched = pathname.replace(/^\/(he|en)/, `/${other}`);
  const home = `/${locale}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl xl:max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href={home} className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span aria-hidden className="grid size-7 place-items-center rounded-md bg-signal text-[13px] font-bold text-canvas">
            BA
          </span>
          <span className="hidden sm:inline">{t(profile.name, locale)}</span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1 text-sm text-muted">
          <a href={`${home}#projects`} className="rounded-md px-2.5 py-1.5 hover:text-ink">
            {t(ui.nav.projects, locale)}
          </a>
          <a href={`${home}#experience`} className="hidden rounded-md px-2.5 py-1.5 hover:text-ink md:inline">
            {t(ui.nav.experience, locale)}
          </a>
          <a href={`${home}#stack`} className="hidden rounded-md px-2.5 py-1.5 hover:text-ink md:inline">
            {t(ui.nav.stack, locale)}
          </a>
          <a href={`${home}#contact`} className="rounded-md px-2.5 py-1.5 hover:text-ink">
            {t(ui.nav.contact, locale)}
          </a>
          <Link
            href={switched}
            hrefLang={other}
            className="ms-2 rounded-md border border-line px-2.5 py-1 text-ink hover:border-muted"
          >
            {t(ui.switchLang, locale)}
          </Link>
        </nav>
      </div>
    </header>
  );
}
