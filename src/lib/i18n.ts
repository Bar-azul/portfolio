import type { L, Locale, ProjectKind, Status, Topic } from "@/content/types";

export const locales: Locale[] = ["he", "en"];
export const isLocale = (v: string): v is Locale => (locales as string[]).includes(v);
export const dir = (l: Locale) => (l === "he" ? "rtl" : "ltr");
export const t = (v: L, l: Locale) => v[l];

export const ui = {
  nav: {
    projects: { he: "פרויקטים", en: "Projects" },
    about: { he: "עליי", en: "About" },
    experience: { he: "ניסיון", en: "Experience" },
    stack: { he: "טכנולוגיות", en: "Stack" },
    contact: { he: "יצירת קשר", en: "Contact" },
  },
  switchLang: { he: "English", en: "עברית" },
  heroCtaProjects: { he: "לפרויקטים", en: "See projects" },
  heroCtaContact: { he: "שלחו לי מייל", en: "Email me" },
  cv: { he: "הורדת קורות חיים", en: "Download CV" },
  aboutTitle: { he: "עליי", en: "About" },
  otherTitle: { he: "עוד דברים שבניתי והשקתי", en: "Other things I built and shipped" },
  otherLead: {
    he: "מוצרים קטנים שבניתי לבד מהרעיון ועד ההשקה, מחוץ לעבודה ב-AI.",
    en: "Small products I built alone from idea to launch, outside my AI work.",
  },
  flowTitle: { he: "איך זה עובד", en: "How it works" },
  graphHint: {
    he: "כך נראית מערכת טיפוסית שאני בונה. לחצו על רכיב כדי לראות פרויקטים שמשתמשים בו.",
    en: "This is what a typical system I build looks like. Select a part to see the projects that use it.",
  },
  projectsTitle: { he: "פרויקטי AI", en: "AI projects" },
  projectsLead: {
    he: "מערכות שרצות בפרודקשן בפז, ופרויקטים עצמאיים.",
    en: "Systems running in production at Paz, plus independent projects.",
  },
  all: { he: "הכול", en: "All" },
  allTopics: { he: "כל הנושאים", en: "All topics" },
  empty: {
    he: "אין פרויקטים בשילוב הזה. נסו נושא אחר.",
    en: "No projects match this combination. Try another topic.",
  },
  clearFilters: { he: "ניקוי סינון", en: "Clear filters" },
  filteredByTech: { he: "מסונן לפי", en: "Filtered by" },
  experienceTitle: { he: "ניסיון והשכלה", en: "Experience & education" },
  stackTitle: { he: "טכנולוגיות", en: "Stack" },
  stackLead: {
    he: "לחצו על טכנולוגיה כדי לראות איפה השתמשתי בה.",
    en: "Select a technology to see where I used it.",
  },
  contactTitle: { he: "מגייסים מהנדס AI?", en: "Hiring an AI engineer?" },
  contactLead: {
    he: "אשמח לשמוע על התפקיד והצוות. אפשר לפנות במייל, בלינקדאין או בוואטסאפ.",
    en: "I'd be glad to hear about the role and the team. Reach me by email, LinkedIn or WhatsApp.",
  },
  whatsapp: { he: "וואטסאפ", en: "WhatsApp" },
  freelance: {
    he: "עובדים על פרויקט AI ומחפשים עזרה חיצונית? אני לוקח גם מספר מצומצם של פרויקטים כפרילנסר.",
    en: "Working on an AI project and need outside help? I also take a small number of freelance projects.",
  },
  back: { he: "חזרה לפרויקטים", en: "Back to projects" },
  problem: { he: "הבעיה", en: "The problem" },
  solution: { he: "מה בניתי", en: "What I built" },
  results: { he: "תוצאות", en: "Results" },
  tech: { he: "טכנולוגיות", en: "Tech" },
  next: { he: "הפרויקט הבא", en: "Next project" },
  footer: { he: "נבנה עם Next.js", en: "Built with Next.js" },
} satisfies Record<string, L | Record<string, L>>;

export const kindLabel: Record<ProjectKind, L> = {
  paz: { he: "עבודה בפז", en: "At Paz" },
  personal: { he: "פרויקטים עצמאיים", en: "Independent" },
  client: { he: "לקוחות", en: "Client work" },
};

export const topicLabel: Record<Topic, L> = {
  agents: { he: "סוכני AI", en: "AI agents" },
  automation: { he: "אוטומציה", en: "Automation" },
  documents: { he: "עיבוד מסמכים", en: "Documents" },
  web: { he: "ווב", en: "Web" },
  mobile: { he: "מובייל", en: "Mobile" },
  product: { he: "מוצר", en: "Product" },
};

export const statusLabel: Record<Status, L> = {
  production: { he: "בפרודקשן", en: "In production" },
  live: { he: "באוויר", en: "Live" },
  building: { he: "בפיתוח", en: "In development" },
  prototype: { he: "אב-טיפוס", en: "Prototype" },
};
