"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Locale, ProjectKind, Topic } from "@/content/types";
import { projects } from "@/content/projects";
import { kindLabel, t, topicLabel, ui } from "@/lib/i18n";
import { useFilters } from "./FilterContext";
import { ProjectCard } from "./ProjectCard";

const KINDS: (ProjectKind | "all")[] = ["all", "paz", "personal", "client"];
const TOPICS = Object.keys(topicLabel) as Topic[];

export function ProjectExplorer({ locale }: { locale: Locale }) {
  const { kind, topics, tech, setKind, setTopics, setTech, clear } = useFilters();
  const reduce = useReducedMotion();

  const byKind = (k: ProjectKind | "all") => projects.filter((p) => k === "all" || p.kind === k);
  const visible = byKind(kind).filter(
    (p) => (topics.length === 0 || p.topics.some((x) => topics.includes(x))) && (!tech || p.tech.includes(tech)),
  );
  const toggleTopic = (x: Topic) => setTopics(topics.includes(x) ? topics.filter((y) => y !== x) : [...topics, x]);
  const filtered = topics.length > 0 || !!tech || kind !== "all";

  return (
    <section id="projects" className="scroll-mt-16 mx-auto max-w-6xl xl:max-w-7xl px-4 py-20 sm:px-6">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t(ui.projectsTitle, locale)}</h2>
      <p className="mt-2 text-muted">{t(ui.projectsLead, locale)}</p>

      {/* Where: tabs */}
      <div role="tablist" className="mt-8 flex gap-1 overflow-x-auto border-b border-line">
        {KINDS.map((k) => {
          const on = kind === k;
          return (
            <button
              key={k}
              role="tab"
              aria-selected={on}
              onClick={() => setKind(k)}
              className={clsx(
                "relative -mb-px shrink-0 border-b-2 px-3 pb-3 pt-1 text-[15px] font-medium transition-colors",
                on ? "border-signal text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {k === "all" ? t(ui.all, locale) : t(kindLabel[k], locale)}
              <span className="ms-1.5 text-[13px] text-muted">{byKind(k).length}</span>
            </button>
          );
        })}
      </div>

      {/* What: topic chips */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {TOPICS.map((x) => {
          const on = topics.includes(x);
          return (
            <button
              key={x}
              aria-pressed={on}
              onClick={() => toggleTopic(x)}
              className={clsx(
                "rounded-full border px-3.5 py-1 text-sm transition-colors",
                on ? "border-signal bg-signal/10 text-signal" : "border-line text-muted hover:border-muted hover:text-ink",
              )}
            >
              {t(topicLabel[x], locale)}
            </button>
          );
        })}
        {tech && (
          <button
            onClick={() => setTech(null)}
            className="rounded-full border border-signal bg-signal/10 px-3.5 py-1 text-sm text-signal"
            aria-label={`${t(ui.filteredByTech, locale)} ${tech}, ${t(ui.clearFilters, locale)}`}
          >
            {t(ui.filteredByTech, locale)}: <span dir="ltr">{tech}</span> ✕
          </button>
        )}
        {filtered && (
          <button onClick={clear} className="ms-1 text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
            {t(ui.clearFilters, locale)}
          </button>
        )}
      </div>

      <motion.ul layout={!reduce} className="mt-8 grid grid-flow-dense grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p) => (
            <motion.li
              key={p.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className={clsx(p.featured && "md:col-span-2 lg:col-span-2")}
            >
              <ProjectCard p={p} locale={locale} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {visible.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-line p-10 text-center text-muted">
          <p>{t(ui.empty, locale)}</p>
          <button onClick={clear} className="mt-4 rounded-lg border border-line px-4 py-2 text-ink hover:border-muted">
            {t(ui.clearFilters, locale)}
          </button>
        </div>
      )}
    </section>
  );
}
