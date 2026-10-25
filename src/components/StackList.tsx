"use client";

import type { Locale } from "@/content/types";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { t } from "@/lib/i18n";
import { useFilters } from "./FilterContext";

const used = new Map<string, number>();
for (const p of projects) for (const x of p.tech) used.set(x, (used.get(x) ?? 0) + 1);

export function StackList({ locale }: { locale: Locale }) {
  const { jump } = useFilters();
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {profile.skills.map((g) => (
        <div key={g.group.en}>
          <h3 className="mb-3 font-semibold">{t(g.group, locale)}</h3>
          <ul className="flex flex-wrap gap-1.5">
            {g.items.map((x) => {
              const n = used.get(x);
              return (
                <li key={x}>
                  {n ? (
                    <button
                      onClick={() => jump({ tech: x })}
                      dir="ltr"
                      className="flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-sm transition-colors hover:border-signal"
                    >
                      {x}
                      <span className="text-[12px] text-signal">{n}</span>
                    </button>
                  ) : (
                    <span dir="ltr" className="inline-block rounded-md px-2.5 py-1 text-sm text-muted">
                      {x}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
