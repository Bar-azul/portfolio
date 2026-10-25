import type { L } from "./types";

export const profile = {
  name: { he: "בר אזולאי", en: "Bar Azulay" } as L,
  role: { he: "מהנדס AI ואוטומציה", en: "AI & Automation Engineer" } as L,
  intro: {
    he: "אני בונה סוכני AI ומערכות אוטומציה שרצות בפרודקשן, מהאפיון והארכיטקטורה ועד הניטור אחרי ההשקה.",
    en: "I build AI agents and automation systems that run in production, from spec and architecture to monitoring after launch.",
  } as L,
  availability: {
    he: "פתוח לפרויקטים, ייעוץ ותפקידים מעניינים",
    en: "Open to projects, consulting and interesting roles",
  } as L,
  location: { he: "ישראל", en: "Israel" } as L,

  // TODO: replace with your real profile URLs
  email: "bar3882@gmail.com",
  phone: "+972549466126",
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",

  experience: [
    {
      period: "2025 –",
      org: { he: "פז חברת נפט", en: "Paz Oil Company" } as L,
      title: { he: "מהנדס AI ואוטומציה", en: "AI & Automation Engineer" } as L,
      text: {
        he: "אחריות מקצה לקצה: מדרישות עסקיות לארכיטקטורה, שירותי Backend, אינטגרציות והשקות לפרודקשן. סוכני AI, RAG, חילוץ מסמכים, הערכות איכות, ו-Azure עם ניטור, ניסיונות חוזרים וטיפול בכשלים.",
        en: "End-to-end ownership: from business requirements to architecture, backend services, integrations and production releases. AI agents, RAG, document extraction and evaluations, on Azure with monitoring, retries and failure handling.",
      } as L,
    },
    {
      period: "2026",
      org: { he: "המכון הטכנולוגי חולון (HIT)", en: "Holon Institute of Technology (HIT)" } as L,
      title: { he: "קורס AI-Driven Development", en: "AI-Driven Development course" } as L,
      text: {
        he: "פיתוח Full-stack עם תהליכי עבודה מבוססי AI: React, Node.js ו-Next.js.",
        en: "Full-stack development with AI-assisted workflows: React, Node.js and Next.js.",
      } as L,
    },
    {
      period: "2020 – 2024",
      org: { he: "המכון הטכנולוגי חולון (HIT)", en: "Holon Institute of Technology (HIT)" } as L,
      title: { he: "B.Sc. במדעי המחשב", en: "B.Sc. Computer Science" } as L,
      text: { he: "", en: "" } as L,
    },
  ],

  skills: [
    {
      group: { he: "AI ו-LLM", en: "AI & LLM" } as L,
      items: ["AI Agents", "RAG", "Semantic Search", "LLM Evaluation", "Structured Outputs", "Prompt Engineering", "Azure Document Intelligence", "OCR", "LangChain", "LangGraph", "LangSmith", "MCP"],
    },
    {
      group: { he: "Backend ו-Web", en: "Backend & Web" } as L,
      items: ["Python", "FastAPI", "REST APIs", "JavaScript", "React", "Next.js", "Node.js", "WebSockets", "SQL", "gRPC"],
    },
    {
      group: { he: "ענן ואוטומציה", en: "Cloud & Automation" } as L,
      items: ["Azure Functions", "Container Apps", "Blob Storage", "Service Bus", "APIM", "Application Insights", "Microsoft Graph", "Power Automate", "n8n", "Playwright"],
    },
    {
      group: { he: "פלטפורמות", en: "Platforms" } as L,
      items: ["Wonderful", "Supabase", "WhatsApp Cloud API", "Android", "AdMob", "Vercel"],
    },
    {
      group: { he: "DevOps", en: "DevOps" } as L,
      items: ["Docker", "Kubernetes", "Git", "GitHub", "CI/CD"],
    },
  ],
};
