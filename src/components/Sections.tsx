import type { Locale } from "@/content/types";
import { profile } from "@/content/profile";
import { t, ui } from "@/lib/i18n";
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
