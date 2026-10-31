/** Public address of the site, used for the sitemap, canonical links and link previews. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://bar-azulay-portfolio.vercel.app").replace(/\/$/, "");

/** Google Analytics 4 measurement ID (G-XXXXXXX). Analytics stays off until it is set. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

/** Google Search Console HTML-tag verification code (the content="..." value only). */
export const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION || "";
