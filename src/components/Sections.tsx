import type { Locale } from "@/content/types";
import { profile } from "@/content/profile";
import { t, ui } from "@/lib/i18n";
import Link from "next/link";
import { otherProjects } from "@/content/projects";
import { statusLabel } from "@/lib/i18n";
import { StatusDot } from "./ProjectCard";
import { StackList } from "./StackList";

export function Experience({ locale }: { locale: Locale }) {
  return (
    <section id="experience" className="scroll-mt-16 border-t border-line/60">
      <div className="mx-auto grid max-w-6xl xl:max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_2fr]">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t(ui.experienceTitle, locale)}</h2>
        <ol className="relative border-s border-line">
          {profile.experience.map((e, i) => (
            <li key={i} className="relative ps-7 pb-10 last:pb-0">
              <span
                aria-hidden
                className={`absolute -start-[6px] top-2 size-[11px] rounded-full border-2 border-canvas ${i === 0 ? "bg-signal" : "bg-line"}`}
              />
              <p dir="ltr" className="text-sm text-muted [unicode-bidi:plaintext]">
                {e.period}
              </p>
              <h3 className="mt-1 text-xl font-semibold">{t(e.title, locale)}</h3>
              <p className="text-ink/80">{t(e.org, locale)}</p>
              {t(e.text, locale) && <p className="mt-3 max-w-[65ch] text-muted">{t(e.text, locale)}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Stack({ locale }: { locale: Locale }) {
  return (
    <section id="stack" className="scroll-mt-16 border-t border-line/60">
      <div className="mx-auto grid max-w-6xl xl:max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t(ui.stackTitle, locale)}</h2>
          <p className="mt-2 text-muted">{t(ui.stackLead, locale)}</p>
        </div>
        <StackList locale={locale} />
      </div>
    </section>
  );
}

export function Contact({ locale }: { locale: Locale }) {
  const wa = `https://wa.me/${profile.phone.replace(/\D/g, "")}`;
  const links = [
    { label: profile.email, href: `mailto:${profile.email}`, primary: true },
    { label: t(ui.whatsapp, locale), href: wa },
    { label: "LinkedIn", href: profile.linkedin },
    { label: "GitHub", href: profile.github },
    { label: t(ui.cv, locale), href: profile.cv, download: true },
  ];
  return (
    <section id="contact" className="scroll-mt-16 dot-grid border-t border-line/60">
      <div className="mx-auto max-w-6xl xl:max-w-7xl px-4 py-24 sm:px-6">
        <h2 className="max-w-[18ch] text-[clamp(2.2rem,5.5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.025em]">
          {t(ui.contactTitle, locale)}
        </h2>
        <p className="mt-4 max-w-[55ch] text-lg text-muted">{t(ui.contactLead, locale)}</p>
        <ul className="mt-10 flex flex-wrap gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                download={"download" in l ? true : undefined}
                rel="noreferrer"
                dir={l.primary ? "ltr" : undefined}
                className={
                  l.primary
                    ? "inline-block rounded-lg bg-signal px-5 py-3 font-semibold text-canvas hover:bg-[#ffc66f]"
                    : "inline-block rounded-lg border border-line px-5 py-3 font-semibold hover:border-muted"
                }
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-12 max-w-[60ch] border-s-2 border-line ps-4 text-muted">{t(ui.freelance, locale)}</p>
      </div>
      <footer className="mx-auto flex max-w-6xl xl:max-w-7xl justify-between px-4 pb-8 text-sm text-muted sm:px-6">
        <span>
          © {new Date().getFullYear()} {t(profile.name, locale)}
        </span>
        <span>{t(ui.footer, locale)}</span>
      </footer>
    </section>
  );
}

export function About({ locale }: { locale: Locale }) {
  return (
    <section id="about" className="scroll-mt-16 border-t border-line/60">
      <div className="mx-auto grid max-w-6xl xl:max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_2fr]">
        <div className="flex items-center gap-5 lg:flex-col lg:items-start">
          {profile.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photo}
              alt={t(profile.name, locale)}
              className="size-24 rounded-2xl border border-line object-cover lg:size-40"
            />
          ) : (
            <div
              aria-hidden
              className="grid size-24 place-items-center rounded-2xl border border-line bg-surface text-3xl font-bold text-signal lg:size-40 lg:text-5xl"
            >
              BA
            </div>
          )}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t(ui.aboutTitle, locale)}</h2>
        </div>
        <div>
          <div className="max-w-[65ch] space-y-4 text-[17px] leading-relaxed text-ink/90">
            {profile.about[locale].map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {profile.highlights.map((h) => (
              <div key={h.value} className="border-s-2 border-signal ps-4">
                <dt className="sr-only">{t(h.label, locale)}</dt>
                <dd dir="ltr" className="text-3xl font-bold tracking-tight [unicode-bidi:plaintext]">
                  {h.value}
                </dd>
                <dd className="mt-1 text-sm text-muted">{t(h.label, locale)}</dd>
              </div>
            ))}
          </dl>
          <a
            href={profile.cv}
            download
            className="mt-10 inline-block rounded-lg border border-line px-5 py-2.5 font-semibold transition-colors hover:border-muted"
          >
            {t(ui.cv, locale)}
          </a>
        </div>
      </div>
    </section>
  );
}

export function OtherBuilds({ locale }: { locale: Locale }) {
  return (
    <section id="other" className="scroll-mt-16 border-t border-line/60">
      <div className="mx-auto grid max-w-6xl xl:max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(ui.otherTitle, locale)}</h2>
          <p className="mt-2 text-muted">{t(ui.otherLead, locale)}</p>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {otherProjects.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/${locale}/projects/${p.slug}`}
                className="flex flex-col gap-1 py-4 transition-colors hover:bg-surface/60 sm:flex-row sm:items-baseline sm:gap-6 sm:px-2"
              >
                <span className="font-semibold sm:w-56 sm:shrink-0">{t(p.title, locale)}</span>
                <span className="min-w-0 flex-1 text-[15px] text-muted">{t(p.summary, locale)}</span>
                <span className="flex shrink-0 items-center gap-1.5 text-[13px] text-muted">
                  <StatusDot status={p.status} />
                  {t(statusLabel[p.status], locale)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
