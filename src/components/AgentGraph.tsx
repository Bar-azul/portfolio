"use client";

import { useState } from "react";
import type { L, Locale, Topic } from "@/content/types";
import { projects } from "@/content/projects";
import { t } from "@/lib/i18n";
import { useFilters } from "./FilterContext";

type NodeId = "inputs" | "agent" | "workflows" | "interfaces" | "product";

const NODES: { id: NodeId; title: L; sub: L; topics: Topic[]; state: "idle" | "running" | "live" }[] = [
  {
    id: "inputs",
    title: { he: "קלט", en: "Inputs" },
    sub: { he: "מסמכים, הודעות, שיחות", en: "Documents, messages, calls" },
    topics: ["documents"],
    state: "idle",
  },
  {
    id: "agent",
    title: { he: "סוכן AI", en: "AI agent" },
    sub: { he: "LLM, כלים, RAG", en: "LLM, tools, RAG" },
    topics: ["agents"],
    state: "running",
  },
  {
    id: "workflows",
    title: { he: "תהליכים", en: "Workflows" },
    sub: { he: "אינטגרציות ותורים", en: "Integrations, queues" },
    topics: ["automation"],
    state: "idle",
  },
  {
    id: "interfaces",
    title: { he: "ממשקים", en: "Interfaces" },
    sub: { he: "ווב, צ׳אט, מובייל", en: "Web, chat, mobile" },
    topics: ["web", "mobile"],
    state: "idle",
  },
  {
    id: "product",
    title: { he: "בפרודקשן", en: "In production" },
    sub: { he: "משתמשים אמיתיים", en: "Real users" },
    topics: ["product"],
    state: "live",
  },
];

const EDGES: [NodeId, NodeId][] = [
  ["inputs", "agent"],
  ["agent", "workflows"],
  ["agent", "interfaces"],
  ["workflows", "product"],
  ["interfaces", "product"],
];

const NW = 152;
const NH = 88;

type Layout = { w: number; h: number; dir: "h" | "v"; pos: Record<NodeId, [number, number]> };

const H_LAYOUT: Layout = {
  w: 740,
  h: 330,
  dir: "h",
  pos: { inputs: [0, 121], agent: [196, 121], workflows: [392, 12], interfaces: [392, 230], product: [588, 121] },
};
const V_LAYOUT: Layout = {
  w: 340,
  h: 484,
  dir: "v",
  pos: { inputs: [94, 0], agent: [94, 132], workflows: [0, 264], interfaces: [188, 264], product: [94, 396] },
};

function place(layout: Layout, rtl: boolean) {
  const out = {} as Record<NodeId, [number, number]>;
  for (const id of Object.keys(layout.pos) as NodeId[]) {
    const [x, y] = layout.pos[id];
    out[id] = [rtl ? layout.w - x - NW : x, y];
  }
  return out;
}

function edgePath(layout: Layout, pos: Record<NodeId, [number, number]>, a: NodeId, b: NodeId) {
  const [ax, ay] = pos[a];
  const [bx, by] = pos[b];
  if (layout.dir === "h") {
    const forward = bx > ax;
    const x1 = forward ? ax + NW : ax;
    const x2 = forward ? bx : bx + NW;
    const y1 = ay + NH / 2;
    const y2 = by + NH / 2;
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  }
  const x1 = ax + NW / 2;
  const x2 = bx + NW / 2;
  const y1 = ay + NH;
  const y2 = by;
  const my = (y1 + y2) / 2;
  return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
}

function countFor(topics: Topic[]) {
  return projects.filter((p) => p.topics.some((x) => topics.includes(x))).length;
}

function Graph({ layout, locale, className }: { layout: Layout; locale: Locale; className: string }) {
  const { jump } = useFilters();
  const [hover, setHover] = useState<NodeId | null>(null);
  const pos = place(layout, locale === "he");
  const lit = (a: NodeId, b: NodeId) => hover === a || hover === b;

  // Two pulse routes: through workflows, and through interfaces
  const routeA = [edgePath(layout, pos, "inputs", "agent"), edgePath(layout, pos, "agent", "workflows"), edgePath(layout, pos, "workflows", "product")];
  const routeB = [edgePath(layout, pos, "inputs", "agent"), edgePath(layout, pos, "agent", "interfaces"), edgePath(layout, pos, "interfaces", "product")];
  // Each segment starts where the previous ended, so drop the leading "Mx,y" of later ones
  const join = (parts: string[]) => parts.map((p, i) => (i === 0 ? p : p.replace(/^M\S+\s*/, ""))).join(" ");

  const order: Record<NodeId, number> = { inputs: 0, agent: 1, workflows: 2, interfaces: 2, product: 3 };

  return (
    <svg viewBox={`-8 -8 ${layout.w + 16} ${layout.h + 16}`} className={className} role="group" aria-label={locale === "he" ? "תרשים מערכת" : "System diagram"}>
      {EDGES.map(([a, b], i) => (
        <path
          key={`${a}-${b}`}
          d={edgePath(layout, pos, a, b)}
          pathLength={1}
          fill="none"
          className="edge transition-[stroke] duration-200"
          style={{ animationDelay: `${0.25 + i * 0.12}s` }}
          stroke={lit(a, b) ? "var(--color-signal)" : "var(--color-line)"}
          strokeWidth={lit(a, b) ? 2 : 1.5}
        />
      ))}

      {[routeA, routeB].map((r, i) => (
        <circle key={i} r={4} fill="var(--color-signal)" className="pulse" opacity={0}>
          <animateMotion dur="1.9s" begin="1.1s" fill="freeze" path={join(r)} calcMode="spline" keySplines="0.45 0 0.55 1" keyTimes="0;1" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="1.9s" begin="1.1s" fill="freeze" />
        </circle>
      ))}

      {NODES.map((n) => {
        const [x, y] = pos[n.id];
        const active = hover === n.id;
        const count = countFor(n.topics);
        return (
          <foreignObject key={n.id} x={x} y={y} width={NW} height={NH} className="overflow-visible">
            <button
              type="button"
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n.id)}
              onBlur={() => setHover(null)}
              onClick={() => jump({ topics: n.topics })}
              className="node-in flex h-full w-full flex-col justify-between rounded-xl border bg-surface px-3 py-2.5 text-start transition-colors duration-200"
              style={{
                animationDelay: `${order[n.id] * 0.15}s`,
                borderColor: active ? "var(--color-signal)" : "var(--color-line)",
              }}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={`size-2 shrink-0 rounded-full ${n.state === "running" ? "running bg-signal" : n.state === "live" ? "bg-live" : "bg-muted/60"}`}
                />
                <span className="text-[15px] font-semibold leading-tight text-ink">{t(n.title, locale)}</span>
              </span>
              <span className="text-[12.5px] leading-snug text-muted">{t(n.sub, locale)}</span>
              <span className="text-[12px] font-medium text-signal/90">
                {count} {locale === "he" ? "פרויקטים" : "projects"}
              </span>
            </button>
          </foreignObject>
        );
      })}
    </svg>
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
