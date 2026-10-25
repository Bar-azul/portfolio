export type Locale = "he" | "en";
export type L = { he: string; en: string };

/** Where the project was done. Drives the main tabs. */
export type ProjectKind = "paz" | "personal" | "client";

/** What the project is about. Drives the topic chips and the hero graph. */
export type Topic = "agents" | "evals" | "automation" | "documents" | "web" | "mobile" | "product";

export type Status = "production" | "live" | "building" | "prototype";

export type Project = {
  /** URL-safe id, used in /projects/<slug> */
  slug: string;
  kind: ProjectKind;
  title: L;
  /** One sentence shown on the card */
  summary: L;
  /** The problem the project solves */
  problem: L;
  /** What was built and how */
  solution: L;
  /** Bullet points of concrete outcomes; numbers work best */
  results: L[];
  topics: Topic[];
  tech: string[];
  status: Status;
  /** Year or range, e.g. "2025" or "2025–2026" */
  year: string;
  /** Optional headline number shown big on the card, e.g. { value: "10K", label: {...} } */
  metric?: { value: string; label: L };
  links?: { label: L; href: string }[];
  /** Featured projects get a bigger cell in the grid */
  featured?: boolean;
  /** "ai" (default) = main grid; "other" = short list under "Also built" */
  track?: "ai" | "other";
  /** Steps of the system, drawn as a flow diagram on the project page */
  flow?: L[];
};
