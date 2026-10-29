import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { kindLabel, statusLabel } from "@/lib/i18n";

const PLACEHOLDER_LINKS = new Set(["https://www.linkedin.com/", "https://github.com/"]);

/**
 * Everything the chat assistant is allowed to know, as plain text.
 * Built from the same content files as the site, so the assistant never drifts from what the pages say.
 */
export function buildKnowledge(): string {
  const out: string[] = [];
  const add = (s = "") => out.push(s);

  add(`# ${profile.name.en} (Hebrew: ${profile.name.he})`);
  add(`Role: ${profile.role.en}`);
  add(`Location: ${profile.location.en}`);
  add(`Availability: ${profile.availability.en}. Also takes a small number of freelance AI projects.`);
  add(`Summary: ${profile.intro.en}`);
  add(profile.about.en.join(" "));
  add(`Highlights: ${profile.highlights.map((h) => `${h.value} ${h.label.en}`).join("; ")}`);

  add();
  add("## Contact");
  add(`Email: ${profile.email}`);
  add("WhatsApp: available through the Contact section of the site");
  if (!PLACEHOLDER_LINKS.has(profile.github)) add(`GitHub: ${profile.github}`);
  if (!PLACEHOLDER_LINKS.has(profile.linkedin)) add(`LinkedIn: ${profile.linkedin}`);
  add("CV: downloadable from the site (Download CV button)");

  add();
  add("## Experience and education");
  for (const e of profile.experience) {
    add(`- ${e.period}: ${e.title.en}, ${e.org.en}${e.text.en ? `. ${e.text.en}` : ""}`);
  }

  add();
  add("## Skills");
  for (const g of profile.skills) add(`- ${g.group.en}: ${g.items.join(", ")}`);

  add();
  add("## Projects (cite with the slug in brackets)");
  for (const p of projects) {
    add();
    add(`### ${p.title.en} (Hebrew title: ${p.title.he}) [[${p.slug}]]`);
    add(`Where: ${kindLabel[p.kind].en}. Status: ${statusLabel[p.status].en}. Year: ${p.year}.`);
    add(`Section on site: ${p.track === "other" ? "Other things I built and shipped" : "AI projects"}`);
    add(`Summary: ${p.summary.en}`);
    add(`Problem: ${p.problem.en}`);
    add(`What was built: ${p.solution.en}`);
    add(`Results: ${p.results.map((r) => r.en).join("; ")}`);
    if (p.metric) add(`Key number: ${p.metric.value} ${p.metric.label.en}`);
    add(`Tech: ${p.tech.join(", ")}`);
    if (p.flow?.length) add(`How it works: ${p.flow.map((f) => f.en).join(" -> ")}`);
    if (p.links?.length) add(`Links: ${p.links.map((l) => `${l.label.en}: ${l.href}`).join("; ")}`);
  }
  return out.join("\n");
}

export const projectSlugs = new Set(projects.map((p) => p.slug));
