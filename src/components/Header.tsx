"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/content/types";
import { profile } from "@/content/profile";
import { t, ui, localePath, switchLocalePath } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? localePath(locale);
  const other: Locale = locale === "he" ? "en" : "he";
  const switched = switchLocalePath(pathname, other);
  const home = localePath(locale);
  const anchor = (id: string) => `${home === "/" ? "" : home}/#${id}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl xl:max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6">
        <Link href={home} className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span aria-hidden className="grid size-7 place-items-center rounded-md bg-signal text-[13px] font-bold text-on-signal">
            BA
          </span>
          <span className="hidden sm:inline">{t(profile.name, locale)}</span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-0.5 whitespace-nowrap text-sm text-muted sm:gap-1">
          <a href={anchor("projects")} className="rounded-md px-2 py-1.5 hover:text-ink sm:px-2.5">
            {t(ui.nav.projects, locale)}
          </a>
          <a href={anchor("about")} className="rounded-md px-2 py-1.5 hover:text-ink sm:px-2.5">
            {t(ui.nav.about, locale)}
          </a>
          <a href={anchor("stack")} className="hidden rounded-md px-2.5 py-1.5 hover:text-ink md:inline">
            {t(ui.nav.stack, locale)}
          </a>
          <a href={anchor("contact")} className="rounded-md px-2 py-1.5 hover:text-ink sm:px-2.5">
            {t(ui.nav.contact, locale)}
          </a>
          <span className="ms-1 sm:ms-2">
            <ThemeToggle locale={locale} />
          </span>
          <Link
            href={switched}
            hrefLang={other}
            className="ms-1 rounded-md border border-line px-2.5 py-1 text-ink hover:border-muted"
          >
            {t(ui.switchLang, locale)}
          </Link>
        </nav>
      </div>
    </header>
  );
}
