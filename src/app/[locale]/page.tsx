import type { Locale } from "@/content/types";
import { FilterProvider } from "@/components/FilterContext";
import { Hero } from "@/components/Hero";
import { ProjectExplorer } from "@/components/ProjectExplorer";
import { Contact, Experience, Stack } from "@/components/Sections";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <main>
      <FilterProvider>
        <Hero locale={locale} />
        <ProjectExplorer locale={locale} />
        <Experience locale={locale} />
        <Stack locale={locale} />
      </FilterProvider>
      <Contact locale={locale} />
    </main>
  );
}
