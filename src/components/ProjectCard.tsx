import Link from "next/link";
import clsx from "clsx";
import type { Locale, Project } from "@/content/types";
import { kindLabel, statusLabel, t } from "@/lib/i18n";

export function StatusDot({ status }: { status: Project["status"] }) {
  const live = status === "production" || status === "live";
  return <span aria-hidden className={clsx("size-2 shrink-0 rounded-full", live ? "bg-live" : "bg-signal")} />;
}

export function ProjectCard({ p, locale }: { p: Project; locale: Locale }) {
  const big = !!p.featured;
  return (
    <Link
      href={`/${locale}/projects/${p.slug}`}
      className={clsx(
        "group relative flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-muted/70 sm:p-6",
        big && "lg:min-h-[320px]",
      )}
    >
      {/* input / output ports, as on a workflow node */}
      <span aria-hidden className="absolute start-[-5px] top-8 size-2.5 rounded-full border border-line bg-canvas" />
      <span aria-hidden className="absolute end-[-5px] top-8 size-2.5 rounded-full border border-line bg-canvas transition-colors group-hover:border-signal group-hover:bg-signal" />

      <div className="flex items-center justify-between gap-3 text-[13px] text-muted">
        <span>{t(kindLabel[p.kind], locale)}</span>
        <span className="flex items-center gap-1.5">
          <StatusDot status={p.status} />
          {t(statusLabel[p.status], locale)}
        </span>
      </div>

      <h3 className={clsx("mt-4 font-semibold leading-snug tracking-tight", big ? "text-2xl sm:text-[1.75rem]" : "text-xl")}>
        {t(p.title, locale)}
      </h3>
      <p className={clsx("mt-2 text-muted", big ? "max-w-[52ch] text-[16px]" : "text-[15px]")}>{t(p.summary, locale)}</p>

      {p.metric && (
        <p className="mt-5 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-signal">{p.metric.value}</span>
          <span className="text-sm text-muted">{t(p.metric.label, locale)}</span>
        </p>
      )}

      <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label="Tech">
        {p.tech.slice(0, big ? 6 : 4).map((x) => (
          <li key={x} dir="ltr" className="rounded-md bg-surface-2 px-2 py-0.5 text-[12.5px] text-ink/80">
            {x}
          </li>
        ))}
      </ul>
    </Link>
  );
}
