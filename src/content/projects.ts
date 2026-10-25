import type { Project } from "./types";

/**
 * All portfolio projects live here.
 * To add a project: copy one object, change the fields, save. The grid,
 * filters, hero graph and project page update automatically.
 * Order in this array = order on the site.
 */
export const projects: Project[] = [
  // ───────────────────────── Paz Oil Company ─────────────────────────
  {
    slug: "municipal-signage-agent",
    kind: "paz",
    featured: true,
    status: "production",
    year: "2025–2026",
    title: { he: "סוכן AI לאגרות שילוט עירוניות", en: "Municipal Signage AI Agent" },
    summary: {
      he: "סוכן שקורא דרישות תשלום מעיריות, מאתר את השלטים, משווה מול הנתונים ומעביר לאישור אנושי.",
      en: "An agent that reads municipal fee notices, finds the signs, cross-checks the data and routes it for human approval.",
    },
    problem: {
      he: "דרישות תשלום על אגרות שילוט מגיעות מעשרות עיריות, כל אחת בפורמט אחר. הבדיקה הידנית מול רשימות השלטים לקחה זמן רב והייתה חשופה לטעויות.",
      en: "Signage fee notices arrive from dozens of municipalities, each in its own format. Checking them by hand against the sign registry was slow and error-prone.",
    },
    solution: {
      he: "תכננתי Backend ב-Azure וסוכן Wonderful עם כלים ייעודיים: עיבוד מסמכים, חיפוש שלטים, השוואת גיליונות, שלב אישור אנושי ואוטומציה של כל זרימת העבודה. כל עירייה מקבלת פרופיל מבודד משלה, כך שהוספת עירייה חדשה לא שוברת את הקיימות.",
      en: "I designed an Azure backend and a Wonderful agent with dedicated tools for document processing, sign search, spreadsheet comparison, a human-approval step and end-to-end workflow automation. Each municipality gets its own isolated profile, so onboarding a new one never breaks the others.",
    },
    results: [
      { he: "החלפת בדיקה ידנית בתהליך אוטומטי עם נקודת אישור אנושית", en: "Replaced a manual review with an automated flow that keeps a human approval step" },
      { he: "פרופיל ובדיקות רגרסיה לכל עירייה", en: "Per-municipality profiles with regression tests" },
    ],
    topics: ["agents", "evals", "documents", "automation"],
    tech: ["Python", "Azure Functions", "Wonderful", "Azure Document Intelligence", "Blob Storage", "Service Bus"],
    flow: [
      { he: "מסמך דרישת תשלום", en: "Fee notice" },
      { he: "חילוץ נתונים", en: "Document extraction" },
      { he: "סוכן עם כלים: חיפוש שלטים והשוואת גיליונות", en: "Agent tools: sign search, sheet compare" },
      { he: "אישור אנושי", en: "Human approval" },
      { he: "עדכון תהליך העבודה", en: "Workflow update" },
    ],
  },
  {
    slug: "call-analytics",
    kind: "paz",
    status: "production",
    year: "2025",
    title: { he: "אוטומציית הקלטות וניתוח שיחות", en: "Call Analytics & Recording Automation" },
    summary: {
      he: "קליטה אוטומטית של הקלטות שיחה לפתרון ניתוח מבוסס AI, כולל התחברות עם OTP.",
      en: "Automated ingestion of call recordings into an AI analytics solution, including OTP sign-in.",
    },
    problem: {
      he: "הקלטות השיחות ישבו במערכת שדורשת התחברות עם קוד חד-פעמי, ולא היה API להוציא אותן. בלי זה לא היה אפשר לנתח את השיחות בהיקף.",
      en: "Call recordings lived behind a portal with one-time-code sign-in and no export API, so they couldn't be analyzed at scale.",
    },
    solution: {
      he: "בניתי תהליך Playwright שמתחבר לפורטל, שולף את קוד ה-OTP מהמייל דרך Microsoft Graph, מוריד את ההקלטות ומזין אותן לפתרון Wonderful Observer.",
      en: "I built a Playwright workflow that signs in to the portal, reads the OTP from email through Microsoft Graph, downloads recordings and feeds them into a Wonderful Observer solution.",
    },
    results: [
      { he: "כ-10,000 שיחות בחודש עוברות ניתוח אוטומטי", en: "About 10,000 calls a month analyzed automatically" },
      { he: "ללא התערבות ידנית בהתחברות", en: "No manual step in the sign-in flow" },
    ],
    metric: { value: "10K", label: { he: "שיחות בחודש", en: "calls a month" } },
    topics: ["automation", "agents"],
    tech: ["Python", "Playwright", "Microsoft Graph", "Wonderful", "Azure"],
    flow: [
      { he: "התחברות לפורטל עם Playwright", en: "Portal sign-in with Playwright" },
      { he: "קוד OTP מהמייל דרך Graph", en: "OTP from email via Graph" },
      { he: "הורדת הקלטות", en: "Recording download" },
      { he: "ניתוח ב-Wonderful Observer", en: "Wonderful Observer analysis" },
    ],
  },
  {
    slug: "pazomat-chat-widget",
    kind: "paz",
    status: "production",
    year: "2025",
    title: { he: "וידג׳ט צ׳אט AI לפזומט", en: "Pazomat AI Chat Widget" },
    summary: {
      he: "וידג׳ט צ׳אט JavaScript באתר פרודקשן, מחובר לסוכן AI, עם מיתוג ותמיכה מלאה בעברית.",
      en: "A JavaScript chat widget on a production website, connected to an AI agent, with full branding and Hebrew RTL.",
    },
    problem: {
      he: "האתר היה צריך צ׳אט AI שנראה כמו חלק מהמותג ועובד בעברית, אבל הווידג׳ט המקורי לא תמך ב-RTL והחיבור שלו נפל.",
      en: "The site needed an AI chat that looked native to the brand and worked in Hebrew, but the stock widget had no RTL support and its connection kept dropping.",
    },
    solution: {
      he: "פיתחתי ושילבתי את הווידג׳ט, התאמתי מיתוג ו-RTL, תיקנתי את התנהגות ה-WebSocket וחיברתי את הממשק לסוכן Wonderful. הקבצים מוגשים מ-Azure Storage.",
      en: "I developed and integrated the widget, adapted branding and RTL, fixed the WebSocket behavior and connected the UI to a Wonderful agent. Assets are served from Azure Storage.",
    },
    results: [
      { he: "צ׳אט AI פעיל באתר פרודקשן", en: "AI chat live on a production site" },
      { he: "חיבור יציב לאחר תיקון ה-WebSocket", en: "Stable connection after the WebSocket fix" },
    ],
    topics: ["agents", "web"],
    tech: ["JavaScript", "WebSockets", "HTML/CSS", "Azure Storage", "Wonderful"],
    flow: [
      { he: "מבקר באתר", en: "Site visitor" },
      { he: "וידג׳ט JS עם RTL", en: "JS widget with RTL" },
      { he: "חיבור WebSocket", en: "WebSocket session" },
      { he: "סוכן Wonderful", en: "Wonderful agent" },
    ],
  },
  {
    slug: "survey-insights",
    kind: "paz",
    status: "production",
    year: "2025",
    title: { he: "פלטפורמת תובנות מסקרי לקוחות", en: "Survey Insights AI Platform" },
    summary: {
      he: "ניתוח סקרי לקוחות עם LLM: מדדים מובנים, תובנות לכל סניף ודוחות הנהלה אוטומטיים.",
      en: "LLM analysis of customer surveys: structured KPIs, per-branch insights and automated management reports.",
    },
    problem: {
      he: "אלפי תשובות פתוחות בסקרים לא נקראו בפועל, ומנהלי הסניפים לא קיבלו תמונה ברורה מה ללקוחות שלהם חשוב.",
      en: "Thousands of open-ended survey answers went unread, and branch managers had no clear picture of what mattered to their customers.",
    },
    solution: {
      he: "בניתי ניתוח מבוסס LLM עם פלט מובנה, מדדי KPI, הערכות איכות (evaluations) ותהליך Power Automate עם Azure Function ששולח לכל סניף את הדוח שלו ומייל בקרה מסכם.",
      en: "I built LLM analysis with structured outputs, KPIs and quality evaluations, plus a Power Automate flow with an Azure Function that sends every branch its own report and a summary control email.",
    },
    results: [
      { he: "דוח תובנות ייעודי לכל סניף", en: "A dedicated insights report for every branch" },
      { he: "דיווח הנהלה אוטומטי במקום ריכוז ידני", en: "Automated management reporting instead of manual compilation" },
    ],
    topics: ["agents", "evals", "automation"],
    tech: ["Python", "LLM", "Structured Outputs", "Azure Functions", "Power Automate"],
    flow: [
      { he: "תשובות סקר", en: "Survey responses" },
      { he: "ניתוח LLM עם פלט מובנה", en: "LLM analysis, structured output" },
      { he: "הערכות איכות", en: "Evaluations" },
      { he: "דוח לכל סניף", en: "Per-branch report" },
      { he: "סיכום להנהלה", en: "Management summary" },
    ],
  },
  {
    slug: "document-intelligence",
    kind: "paz",
    status: "production",
    year: "2025–2026",
    title: { he: "חילוץ נתונים ממסמכים", en: "Document Intelligence Pipelines" },
    summary: {
      he: "חילוץ חשבוניות, תעודות משלוח ומסמכי תשתית ל-JSON/XML מאומת.",
      en: "Extraction of invoices, delivery certificates and utility documents into validated JSON/XML.",
    },
    problem: {
      he: "מסמכים סרוקים ו-PDF בפורמטים שונים הוקלדו ידנית למערכות הארגון.",
      en: "Scanned and PDF documents in many layouts were being typed into internal systems by hand.",
    },
    solution: {
      he: "פיתחתי צינורות חילוץ עם Azure Document Intelligence ו-LLM, עם סכמות פלט מוגדרות ושכבת ולידציה לפני שהנתונים נכנסים למערכות.",
      en: "I built extraction pipelines with Azure Document Intelligence and LLMs, with defined output schemas and a validation layer before data reaches downstream systems.",
    },
    results: [
      { he: "פלט JSON/XML מאומת במקום הקלדה ידנית", en: "Validated JSON/XML output instead of manual entry" },
    ],
    topics: ["documents", "automation"],
    tech: ["Python", "Azure Document Intelligence", "OCR", "LLM", "Structured Outputs"],
    flow: [
      { he: "PDF או סריקה", en: "PDF or scan" },
      { he: "OCR ו-Document Intelligence", en: "OCR and Document Intelligence" },
      { he: "חילוץ מובנה עם LLM", en: "LLM structured extraction" },
      { he: "ולידציה", en: "Validation" },
      { he: "JSON / XML", en: "JSON / XML" },
    ],
  },
  {
    slug: "wolt-catalog-ingestion",
    kind: "paz",
    status: "production",
    year: "2025",
    title: { he: "קליטת מוצרים ומבצעים ל-Wolt", en: "Wolt Catalog & Promotions Ingestion" },
    summary: {
      he: "סנכרון מוצרים ומבצעים ל-Wolt בהיקף של יותר מ-200 סניפים, עם התאוששות מכשלים.",
      en: "Product and promotion sync to Wolt across 200+ branches, with retry and failure recovery.",
    },
    problem: {
      he: "עדכון קטלוג ומבצעים ידני ליותר מ-200 סניפים לא החזיק, ותקלה בסניף אחד עצרה את כל העדכון.",
      en: "Updating catalog and promotions by hand for 200+ branches didn't scale, and one failing branch stalled the whole run.",
    },
    solution: {
      he: "הרחבתי את תהליך הקליטה כך שכל סניף מטופל בנפרד דרך תורים, עם ניסיונות חוזרים, טיפול בכשלים וניטור ב-Application Insights.",
      en: "I scaled the ingestion so each branch is processed independently through queues, with retries, failure handling and monitoring in Application Insights.",
    },
    results: [
      { he: "יותר מ-200 סניפים מסונכרנים", en: "200+ branches in sync" },
      { he: "כשל בסניף אחד לא עוצר את האחרים", en: "One failing branch no longer blocks the rest" },
    ],
    metric: { value: "200+", label: { he: "סניפים", en: "branches" } },
    topics: ["automation"],
    tech: ["Python", "Azure Functions", "Service Bus", "Application Insights", "REST APIs"],
    flow: [
      { he: "קטלוג ומבצעים", en: "Catalog and promotions" },
      { he: "תור Service Bus לכל סניף", en: "Service Bus queue per branch" },
      { he: "Azure Functions עם ניסיונות חוזרים", en: "Azure Functions with retries" },
      { he: "Wolt API", en: "Wolt API" },
      { he: "ניטור ב-App Insights", en: "App Insights monitoring" },
    ],
  },

  // ───────────────────────── Personal products ─────────────────────────
  {
    slug: "scam-checker",
    kind: "personal",
    status: "prototype",
    year: "2026",
    title: { he: "עוקץ או לא", en: "Okets O Lo – Scam Checker" },
    summary: {
      he: "מדביקים הודעת SMS או וואטסאפ חשודה ומקבלים תשובה: עוקץ, חשוד או תקין.",
      en: "Paste a suspicious SMS or WhatsApp message and get a verdict: scam, suspicious or fine.",
    },
    problem: {
      he: "כמעט כל מי שיש לו טלפון בישראל מקבל הודעות התחזות לחברות שליחויות, בנקים ורשויות, ורוב האנשים לא יודעים איך לבדוק אותן.",
      en: "Almost everyone in Israel gets messages impersonating couriers, banks and authorities, and most people have no quick way to check them.",
    },
    solution: {
      he: "כלי חינמי בעברית שמנתח את ההודעה עם LLM, בודק קישורים ודפוסים מוכרים ומסביר בשפה פשוטה למה ההודעה חשודה.",
      en: "A free Hebrew tool that analyzes the message with an LLM, checks links and known patterns, and explains in plain language why it looks suspicious.",
    },
    results: [{ he: "אב-טיפוס עובד, בתכנון להשקה", en: "Working prototype, launch in planning" }],
    topics: ["agents", "web", "product"],
    tech: ["LLM API", "Web"],
    flow: [
      { he: "הדבקת הודעה", en: "Pasted message" },
      { he: "בדיקת קישורים ודפוסים", en: "Link and pattern checks" },
      { he: "סיווג עם LLM", en: "LLM classification" },
      { he: "תשובה והסבר", en: "Verdict and explanation" },
    ],
  },
  {
    slug: "seder-bakesef",
    track: "other",
    kind: "personal",
    status: "live",
    year: "2026",
    title: { he: "סדר בכסף", en: "Seder BaKesef – Budget Templates" },
    summary: {
      he: "תבנית תקציב משפחתית בעברית שנמכרת אונליין, עם משפך שיווק אוטומטי מאינסטגרם.",
      en: "A Hebrew family budget template sold online, with an automated Instagram marketing funnel.",
    },
    problem: {
      he: "משפחות צעירות רוצות לעשות סדר בהוצאות, אבל רוב הכלים באנגלית או מסובכים מדי.",
      en: "Young families want to get their spending in order, but most tools are in English or too complicated.",
    },
    solution: {
      he: "דשבורד תקציב חודשי ב-Google Sheets: תכנון מול ביצוע, גרפים אוטומטיים ועשר ההוצאות הגדולות. נמכר דרך Gumroad, עם רילס ותגובה אוטומטית ב-DM.",
      en: "A monthly budget dashboard in Google Sheets: plan vs. actual, automatic charts and top-10 expenses. Sold through Gumroad, with reels and an automated DM reply.",
    },
    results: [{ he: "המוצר באוויר ונמכר דרך Gumroad", en: "Live and selling on Gumroad" }],
    topics: ["product", "automation"],
    tech: ["Google Sheets", "Gumroad", "ManyChat", "Instagram"],
  },
  {
    slug: "quick-audio-cutter",
    track: "other",
    kind: "personal",
    status: "live",
    year: "2026",
    title: { he: "Quick Audio Cutter", en: "Quick Audio Cutter" },
    summary: {
      he: "אפליקציית אנדרואיד לחיתוך קבצי MP3 ויצירת רינגטונים, זמינה ב-Google Play.",
      en: "An Android app for trimming MP3s and making ringtones, available on Google Play.",
    },
    problem: {
      he: "רוב אפליקציות החיתוך עמוסות בפרסומות ומסובכות לפעולה פשוטה של חיתוך קטע משיר.",
      en: "Most audio cutters are cluttered with ads and overcomplicated for the simple job of trimming a clip.",
    },
    solution: {
      he: "אפליקציה פשוטה וממוקדת: בוחרים קובץ, מסמנים קטע ושומרים. עברה בדיקות סגורות וקיבלה אישור הפצה מגוגל.",
      en: "A focused app: pick a file, mark the clip, save. Passed closed testing and was approved for production by Google.",
    },
    results: [{ he: "פורסמה ב-Google Play", en: "Published on Google Play" }],
    topics: ["mobile", "product"],
    tech: ["Android", "Google Play"],
  },
  {
    slug: "pack-the-truck",
    track: "other",
    kind: "personal",
    status: "building",
    year: "2026",
    title: { he: "Pack the Truck", en: "Pack the Truck" },
    summary: {
      he: "משחק פאזל קז׳ואל למובייל: מסדרים חבילות במשאית לפני שהיא יוצאת.",
      en: "A casual mobile puzzle game: fit the parcels into the truck before it leaves.",
    },
    problem: {
      he: "רציתי לבדוק מודל הכנסה ממשחק עם פרסומות, בלי להשקיע בפרסום ממומן לפני שיש משחק אמיתי.",
      en: "I wanted to test an ad-supported game model without spending on paid ads before having a real, playable game.",
    },
    solution: {
      he: "אב-טיפוס HTML5 שנעטף כאפליקציית אנדרואיד, עם סאונד, מוזיקה ו-AdMob, ותרחישי משחק אוטומטיים להקלטת סרטוני פרסומת.",
      en: "An HTML5 prototype wrapped as an Android app with sound, music and AdMob, plus self-playing scenarios for recording ad videos.",
    },
    results: [{ he: "גרסה ניתנת למשחק, בדרך לחנות", en: "Playable build, heading to the store" }],
    topics: ["mobile", "product"],
    tech: ["HTML5 Canvas", "JavaScript", "Android", "AdMob"],
  },
  {
    slug: "pdfpro",
    track: "other",
    kind: "personal",
    status: "live",
    year: "2025",
    title: { he: "PDF Pro", en: "PDF Pro" },
    summary: {
      he: "אתר להמרת קבצי PDF, עם עבודת SEO ומונטיזציה דרך AdSense.",
      en: "A PDF conversion website, with SEO work and AdSense monetization.",
    },
    problem: {
      he: "כלי המרת PDF הם שוק עם הרבה תנועה אורגנית, אבל כדי לקבל אותה צריך אתר מהיר ותקין טכנית.",
      en: "PDF tools get huge organic search traffic, but winning it takes a fast, technically clean site.",
    },
    solution: {
      he: "בניתי אתר רספונסיבי שרץ על Vercel, תיקנתי canonical URLs, הרחבתי את ה-sitemap והגדרתי AdSense.",
      en: "I built a responsive site on Vercel, fixed canonical URLs, expanded the sitemap and set up AdSense.",
    },
    results: [{ he: "האתר באוויר ומאונדקס", en: "Live and indexed" }],
    links: [{ label: { he: "לאתר", en: "Visit site" }, href: "https://pdfproapp.com" }],
    topics: ["web", "product"],
    tech: ["Vercel", "SEO", "AdSense"],
  },
  {
    slug: "clinic-whatsapp-automation",
    kind: "personal",
    status: "building",
    year: "2026",
    title: { he: "אוטומציית וואטסאפ למרפאות", en: "WhatsApp Automation for Clinics" },
    summary: {
      he: "שירות שמענה אוטומטית לפניות מטופלים בוואטסאפ ומעביר לידים מסוננים למרפאה.",
      en: "A service that answers patient inquiries on WhatsApp automatically and hands qualified leads to the clinic.",
    },
    problem: {
      he: "מרפאות שיניים פרטיות מאבדות מטופלים כי פניות בוואטסאפ נענות באיחור או לא נענות בכלל.",
      en: "Private dental clinics lose patients because WhatsApp inquiries get answered late, or not at all.",
    },
    solution: {
      he: "מערכת על WhatsApp Cloud API ו-n8n שעונה מיד, שואלת שאלות סינון וקובעת המשך טיפול, ארוזה כשירות במחיר קבוע ומנוי חודשי.",
      en: "A system on the WhatsApp Cloud API and n8n that replies instantly, asks screening questions and books the next step, packaged as a fixed-price service with a monthly plan.",
    },
    results: [{ he: "בשלב תיקוף מול מרפאות שיניים באזור המרכז", en: "Validating with dental clinics in central Israel" }],
    topics: ["automation", "agents"],
    tech: ["n8n", "WhatsApp Cloud API", "LLM"],
    flow: [
      { he: "הודעת וואטסאפ ממטופל", en: "Patient WhatsApp message" },
      { he: "Webhook של Cloud API", en: "Cloud API webhook" },
      { he: "תהליך n8n עם LLM", en: "n8n flow with LLM" },
      { he: "שאלות סינון", en: "Screening questions" },
      { he: "ליד מסונן למרפאה", en: "Qualified lead to clinic" },
    ],
  },

  // ───────────────────────── Client work ─────────────────────────
  {
    slug: "nail-studio-booking",
    track: "other",
    kind: "client",
    status: "building",
    year: "2026",
    title: { he: "אפליקציית תורים לסטודיו ציפורניים", en: "Nail Studio Booking App" },
    summary: {
      he: "אפליקציית ווב לקביעת תורים עם מחירון שירותים, שמחליפה מנוי חודשי למערכת חיצונית.",
      en: "A booking web app with a service price list, replacing a monthly subscription to an external system.",
    },
    problem: {
      he: "הסטודיו שילם מנוי חודשי למערכת תורים כללית שלא שמרה על המראה של העסק.",
      en: "The studio paid a monthly fee for a generic booking system that didn't match the brand.",
    },
    solution: {
      he: "PWA ללקוחות עם Supabase: בחירת שירות, חלונות זמן פנויים ואישור תור, בעיצוב של המותג. הבסיס בנוי כך שאפשר להפוך אותו לפלטפורמה לעסקים נוספים.",
      en: "A customer PWA on Supabase: pick a service, see open slots, confirm. Styled to the brand, and built so it can grow into a platform for other businesses.",
    },
    results: [{ he: "מחליף מנוי חודשי למערכת חיצונית", en: "Replaces a monthly third-party subscription" }],
    topics: ["web", "product"],
    tech: ["Supabase", "PWA"],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const aiProjects = projects.filter((p) => p.track !== "other");
export const otherProjects = projects.filter((p) => p.track === "other");
