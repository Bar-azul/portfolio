import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@fontsource/ibm-plex-sans-hebrew/400.css";
import "@fontsource/ibm-plex-sans-hebrew/500.css";
import "@fontsource/ibm-plex-sans-hebrew/600.css";
import "@fontsource/ibm-plex-sans-hebrew/700.css";
import "../globals.css";
import { profile } from "@/content/profile";
import { dir, isLocale, localePath, locales, t } from "@/lib/i18n";
import { Header } from "@/components/Header";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const title = `${t(profile.name, locale)} | ${t(profile.role, locale)}`;
  return {
    title: { default: title, template: `%s | ${t(profile.name, locale)}` },
    description: t(profile.intro, locale),
    alternates: { canonical: localePath(locale), languages: { en: "/", he: "/he", "x-default": "/" } },
    openGraph: { title, description: t(profile.intro, locale), locale: locale === "he" ? "he_IL" : "en_US", type: "website" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} dir={dir(locale)}>
      <body className="min-h-dvh">
        <Header locale={locale} />
        {children}
      </body>
    </html>
  );
}
