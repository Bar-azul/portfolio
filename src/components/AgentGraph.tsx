"use client";

import { useState } from "react";
import clsx from "clsx";
import type { L, Locale, ProjectKind, Topic } from "@/content/types";
import { aiProjects as projects } from "@/content/projects";
import { t } from "@/lib/i18n";
import { useFilters } from "./FilterContext";

type NodeId = "inputs" | "agent" | "evals" | "workflows" | "interfaces" | "product";

type GraphNode = {
  id: NodeId;
  title: L;
  sub: L;
  topics: Topic[];
  kind?: ProjectKind;
  state: "idle" | "running" | "live";
  /** Second within the execution loop when this node lights up */
  at: number;
};

const NODES: GraphNode[] = [
  { id: "inputs", title: { he: "קלט", en: "Inputs" }, sub: { he: "מסמכים, הודעות, שיחות", en: "Documents, messages, calls" }, topics: ["documents"], state: "idle", at: 0 },
  { id: "agent", title: { he: "סוכן AI", en: "AI agent" }, sub: { he: "LLM, כלים, RAG", en: "LLM, tools, RAG" }, topics: ["agents"], state: "running", at: 0.7 },
  { id: "evals", title: { he: "בקרת איכות", en: "Quality gate" }, sub: { he: "סוכני Evals וסקירת קוד", en: "Evals & code-review agents" }, topics: ["evals"], state: "idle", at: 1.3 },
  { id: "workflows", title: { he: "תהליכים", en: "Workflows" }, sub: { he: "אינטגרציות ותורים", en: "Integrations, queues" }, topics: ["automation"], state: "idle", at: 2.6 },
  { id: "interfaces", title: { he: "ממשקים", en: "Interfaces" }, sub: { he: "ווב, צ׳אט, מובייל", en: "Web, chat, mobile" }, topics: ["web", "mobile"], state: "idle", at: 2.6 },
  { id: "product", title: { he: "בפרודקשן", en: "In production" }, sub: { he: "משתמשים אמיתיים", en: "Real users" }, topics: [], kind: "paz", state: "live", at: 3.3 },
];

/** [from, to, start, end, side offset] — start/end are seconds within the loop */
const EDGES: [NodeId, NodeId, number, number, number][] = [
  ["inputs", "agent", 0.1, 0.7, 0],
  ["agent", "evals", 0.75, 1.3, -14],
  ["evals", "agent", 1.4, 1.95, 14],
  ["agent", "workflows", 2.0, 2.6, 0],
  ["agent", "interfaces", 2.0, 2.6, 0],
  ["workflows", "product", 2.65, 3.3, 0],
  ["interfaces", "product", 2.65, 3.3, 0],
];

const LOOP = 5; // seconds per execution
const BOOT = 1.2; // wait for the draw-in before the first run

const NW = 152;
const NH = 88;

type Layout = { w: number; h: number; dir: "h" | "v"; pos: Record<NodeId, [number, number]> };

const H_LAYOUT: Layout = {
  w: 740,
  h: 360,
  dir: "h",
  pos: { inputs: [0, 136], agent: [196, 136], evals: [196, 272], workflows: [392, 0], interfaces: [392, 272], product: [588, 136] },
};
const V_LAYOUT: Layout = {
  w: 340,
  h: 484,
  dir: "v",
  pos: { inputs: [94, 0], agent: [0, 132], evals: [188, 132], workflows: [0, 264], interfaces: [188, 264], product: [94, 396] },
};

function place(layout: Layout, rtl: boolean) {
  const out = {} as Record<NodeId, [number, number]>;
  for (const id of Object.keys(layout.pos) as NodeId[]) {
    const [x, y] = layout.pos[id];
    out[id] = [rtl ? layout.w - x - NW : x, y];
  }
  return out;
}

function edgePath(layout: Layout, pos: Record<NodeId, [number, number]>, a: NodeId, b: NodeId, off: number) {
  const [ax, ay] = pos[a];
  const [bx, by] = pos[b];
  const sameRow = Math.abs(ay - by) < NH;
  const sameCol = Math.abs(ax - bx) < NW;
  const horizontal = layout.dir === "h" ? !sameCol : sameRow;
  if (horizontal) {
    const fwd = bx > ax;
    const x1 = fwd ? ax + NW : ax;
    const x2 = fwd ? bx : bx + NW;
    const y1 = ay + NH / 2 + off;
    const y2 = by + NH / 2 + off;
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  }
  const down = by > ay;
  const x1 = ax + NW / 2 + off;
  const x2 = bx + NW / 2 + off;
  const y1 = down ? ay + NH : ay;
  const y2 = down ? by : by + NH;
  const my = (y1 + y2) / 2;
  return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
}

function countFor(n: GraphNode) {
  return projects.filter((p) => (n.kind ? p.kind === n.kind : p.topics.some((x) => n.topics.includes(x)))).length;
}

const kt = (s: number) => (s / LOOP).toFixed(3);

function Graph({ layout, locale, className }: { layout: Layout; locale: Locale; className: string }) {
  const { jump } = useFilters();
  const [hover, setHover] = useState<NodeId | null>(null);
  const pos = place(layout, locale === "he");
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  // px at the design width, scaled to the rendered width
  const cq = (px: number) => `${((px / layout.w) * 100).toFixed(3)}cqw`;

  return (
    // The wrapper is a size container so node text scales with the diagram (cqw units)
    <div className={clsx("[container-type:inline-size]", className)}>
    <div className="relative" style={{ aspectRatio: `${layout.w} / ${layout.h}` }}>
      <svg viewBox={`0 0 ${layout.w} ${layout.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        {EDGES.map(([a, b, s, e, off], i) => {
          const d = edgePath(layout, pos, a, b, off);
          const lit = hover === a || hover === b;
          return (
            <g key={`${a}-${b}`}>
              <path
                d={d}
                pathLength={1}
                fill="none"
                className="edge transition-[stroke] duration-200"
                style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                stroke={lit ? "var(--color-signal)" : "var(--color-line)"}
                strokeWidth={lit ? 2 : 1.5}
              />
              {/* the edge lights up while data travels along it */}
              <path d={d} fill="none" stroke="var(--color-signal)" strokeWidth={2} className="pulse" opacity={0}>
                <animate attributeName="opacity" values="0;0.55;0" keyTimes={`0;${kt(s)};${kt(e + 0.25)}`} calcMode="discrete" dur={`${LOOP}s`} begin={`${BOOT}s`} repeatCount="indefinite" />
              </path>
              <circle r={4.5} fill="var(--color-signal)" className="pulse packet" opacity={0}>
                <animateMotion path={d} dur={`${LOOP}s`} begin={`${BOOT}s`} repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes={`0;${kt(s)};${kt(e)};1`} />
                <animate attributeName="opacity" values="0;1;0" keyTimes={`0;${kt(s)};${kt(e)}`} calcMode="discrete" dur={`${LOOP}s`} begin={`${BOOT}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </svg>

      {NODES.map((n, i) => {
        const [x, y] = pos[n.id];
        const count = countFor(n);
        return (
          <button
            key={n.id}
            type="button"
            data-node={n.id}
            data-topics={n.topics.join(",")}
            data-kind={n.kind ?? ""}
            onMouseEnter={() => setHover(n.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(n.id)}
            onBlur={() => setHover(null)}
            onClick={() => jump(n.kind ? { kind: n.kind } : { topics: n.topics })}
            className="graph-node absolute flex cursor-pointer flex-col justify-between rounded-xl border border-line bg-surface text-start active:scale-[0.97]"
            style={
              {
                left: pct(x, layout.w),
                top: pct(y, layout.h),
                width: pct(NW, layout.w),
                height: pct(NH, layout.h),
                animationDelay: `${i * 0.08}s, ${BOOT + n.at}s`,
                padding: `${cq(10)} ${cq(12)}`,
              } as React.CSSProperties
            }
          >
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className={clsx(
                  "size-2 shrink-0 rounded-full",
                  n.state === "running" ? "running bg-signal" : n.state === "live" ? "bg-live" : "bg-muted/60",
                )}
              />
              <span className="truncate font-semibold leading-tight text-ink" style={{ fontSize: cq(15) }}>{t(n.title, locale)}</span>
            </span>
            <span className="leading-snug text-muted" style={{ fontSize: cq(12.5) }}>{t(n.sub, locale)}</span>
            <span className="font-medium text-signal/90" style={{ fontSize: cq(12) }}>
              {count} {locale === "he" ? "פרויקטים" : "projects"}
            </span>
          </button>
        );
      })}
    </div>
    </div>
  );
}

export function AgentGraph({ locale }: { locale: Locale }) {
  return (
    <>
      <Graph layout={H_LAYOUT} locale={locale} className="hidden w-full lg:block" />
      <Graph layout={V_LAYOUT} locale={locale} className="mx-auto block w-full max-w-[380px] lg:hidden" />
    </>
  );
}
