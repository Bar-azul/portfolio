import type { L } from "./types";

export const profile = {
  name: { he: "בר אזולאי", en: "Bar Azulay" } as L,
  role: { he: "מהנדס AI Full-Stack", en: "Full-Stack AI Engineer" } as L,
  intro: {
    he: "אני בונה סוכני AI ומערכות LLM שרצות בפרודקשן בארגון גדול: מהדרישה העסקית והארכיטקטורה, דרך הפיתוח וההערכות, ועד הניטור אחרי ההשקה.",
    en: "I build AI agents and LLM systems that run in production at a large enterprise: from business requirements and architecture, through development and evaluations, to monitoring after launch.",
  } as L,
  availability: {
    he: "פתוח לתפקידי AI Engineer",
    en: "Open to AI Engineer roles",
  } as L,
  location: { he: "ישראל", en: "Israel" } as L,

  cv: "/Bar_Azulay_AI_Engineer_CV.pdf",
  /** Put a square photo in /public and set its path here, e.g. "/bar.jpg" */
  photo: "" as string,

  about: {
    he: [
      "אני מהנדס AI בפז חברת נפט, ואחראי על פתרונות AI מקצה לקצה: אני מתרגם צורך עסקי לארכיטקטורה, בוחר את הטכנולוגיה, מפתח ומעלה לפרודקשן.",
      "רוב העבודה שלי היא סוכנים עם כלים, חילוץ נתונים ממסמכים ו-RAG, על Azure, עם הערכות איכות, ניטור וטיפול בכשלים. כלומר מערכות שממשיכות לעבוד גם אחרי הדמו.",
    ],
    en: [
      "I'm an AI engineer at Paz Oil Company, where I own AI solutions end to end: I turn a business need into an architecture, choose the stack, build it and ship it to production.",
      "Most of my work is tool-using agents, document extraction and RAG on Azure, with evaluations, monitoring and failure handling. In other words, systems that keep working after the demo.",
    ],
  },
  highlights: [
    { value: "1.5+", label: { he: "שנים של AI בפרודקשן", en: "years of production AI" } as L },
    { value: "10K", label: { he: "שיחות בחודש עוברות ניתוח AI", en: "calls a month through AI analysis" } as L },
    { value: "200+", label: { he: "סניפים בצנרת נתונים אחת", en: "branches on one data pipeline" } as L },
  ],

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
      items: ["Wonderful", "WhatsApp Cloud API", "Supabase", "Vercel"],
    },
    {
      group: { he: "DevOps", en: "DevOps" } as L,
      items: ["Docker", "Kubernetes", "Git", "GitHub", "CI/CD"],
    },
  ],
};
