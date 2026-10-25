import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/types";
import { getProject, projects } from "@/content/projects";
import { kindLabel, locales, statusLabel, t, topicLabel, ui } from "@/lib/i18n";
import { StatusDot } from "@/components/ProjectCard";
import { Contact } from "@/components/Sections";
import { FlowDiagram } from "@/components/FlowDiagram";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const l = locale as Locale;
  return { title: t(p.title, l), description: t(p.summary, l) };
}

export default async function ProjectPage({ params }: Params) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const p = getProject(slug);
  if (!p) notFound();
  // "Next project" stays within the same track (AI projects or other builds)
  const track = projects.filter((x) => (x.track ?? "ai") === (p.track ?? "ai"));
  const next = track[(track.indexOf(p) + 1) % track.length];

  return (
    <main>
      <section className="dot-grid border-b border-line/60">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-4 pb-14 pt-10 sm:px-6">
          <Link href={`/${locale}#projects`} className="text-sm text-muted hover:text-ink">
            {t(ui.back, locale)}
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span>{t(kindLabel[p.kind], locale)}</span>
            <span className="flex items-center gap-1.5">
              <StatusDot status={p.status} />
              {t(statusLabel[p.status], locale)}
            </span>
            <span dir="ltr">{p.year}</span>
          </div>
          <h1 className="mt-4 max-w-[20ch] text-[clamp(2.2rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.025em]">
            {t(p.title, locale)}
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg text-ink/90">{t(p.summary, locale)}</p>
          {p.metric && (
            <p className="mt-8 flex items-baseline gap-3">
              <span className="text-6xl font-bold tracking-tight text-signal">{p.metric.value}</span>
              <span className="text-muted">{t(p.metric.label, locale)}</span>
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl xl:max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[2fr_1fr]">
        <article className="min-w-0 space-y-12">
          {p.flow?.length ? (
            <div>
              <h2 className="text-xl font-semibold">{t(ui.flowTitle, locale)}</h2>
              <FlowDiagram steps={p.flow} locale={locale} />
            </div>
          ) : null}
          <div>
            <h2 className="text-xl font-semibold">{t(ui.problem, locale)}</h2>
            <p className="mt-3 max-w-[65ch] text-[17px] leading-relaxed text-ink/85">{t(p.problem, locale)}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{t(ui.solution, locale)}</h2>
            <p className="mt-3 max-w-[65ch] text-[17px] leading-relaxed text-ink/85">{t(p.solution, locale)}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{t(ui.results, locale)}</h2>
            <ul className="mt-4 space-y-3">
              {p.results.map((r, i) => (
                <li key={i} className="flex gap-3 text-[17px] text-ink/85">
                  <span aria-hidden className="mt-[0.6em] size-2 shrink-0 rounded-full bg-live" />
                  {t(r, locale)}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <aside className="h-fit space-y-8 rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
          <div>
            <h2 className="text-sm text-muted">{t(ui.tech, locale)}</h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {p.tech.map((x) => (
                <li key={x} dir="ltr" className="rounded-md bg-surface-2 px-2.5 py-1 text-sm">
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm text-muted">{locale === "he" ? "נושאים" : "Topics"}</h2>
            <p className="mt-2">{p.topics.map((x) => t(topicLabel[x], locale)).join(", ")}</p>
          </div>
          {p.links?.length ? (
            <ul className="space-y-2">
              {p.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-lg bg-signal px-4 py-2 font-semibold text-canvas hover:bg-[#ffc66f]"
                  >
                    {t(l.label, locale)}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      </div>

      <div className="mx-auto max-w-6xl xl:max-w-7xl px-4 pb-20 sm:px-6">
        <Link
          href={`/${locale}/projects/${next.slug}`}
          className="block rounded-2xl border border-line p-6 transition-colors hover:border-muted"
        >
          <span className="text-sm text-muted">{t(ui.next, locale)}</span>
          <span className="mt-1 block text-2xl font-semibold">{t(next.title, locale)}</span>
        </Link>
      </div>

      <Contact locale={locale} />
    </main>
  );
}
