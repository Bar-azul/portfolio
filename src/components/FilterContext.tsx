"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ProjectKind, Topic } from "@/content/types";

type Filters = {
  kind: ProjectKind | "all";
  topics: Topic[]; // empty = all
  tech: string | null;
};

type Ctx = Filters & {
  setKind: (k: Filters["kind"]) => void;
  setTopics: (t: Topic[]) => void;
  setTech: (t: string | null) => void;
  clear: () => void;
  /** Apply a filter and scroll to the projects grid */
  jump: (f: Partial<Filters>) => void;
};

const FilterCtx = createContext<Ctx | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [f, setF] = useState<Filters>({ kind: "all", topics: [], tech: null });

  const clear = useCallback(() => setF({ kind: "all", topics: [], tech: null }), []);
  const jump = useCallback((next: Partial<Filters>) => {
    setF({ kind: "all", topics: [], tech: null, ...next });
    requestAnimationFrame(() => document.getElementById("projects")?.scrollIntoView({ block: "start" }));
  }, []);

  return (
    <FilterCtx.Provider
      value={{
        ...f,
        setKind: (kind) => setF((s) => ({ ...s, kind })),
        setTopics: (topics) => setF((s) => ({ ...s, topics })),
        setTech: (tech) => setF((s) => ({ ...s, tech })),
        clear,
        jump,
      }}
    >
      {children}
    </FilterCtx.Provider>
  );
}

export function useFilters() {
  const c = useContext(FilterCtx);
  if (!c) throw new Error("useFilters must be inside FilterProvider");
  return c;
}
