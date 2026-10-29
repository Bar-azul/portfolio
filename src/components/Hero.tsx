import type { Locale } from "@/content/types";
import { profile } from "@/content/profile";
import { chatUi, t, ui } from "@/lib/i18n";
import { OpenChatButton } from "./ChatWidget";
import { AgentGraph } from "./AgentGraph";
import { Spotlight } from "./Spotlight";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="dot-grid border-b border-line/60">
      <Spotlight>
      <div className="mx-auto grid max-w-6xl xl:max-w-7xl items-center gap-14 px-4 pb-14 pt-14 sm:px-6 sm:pt-20 xl:max-w-7xl xl:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] xl:gap-10 xl:pb-20">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-sm text-muted">
            <span aria-hidden className="size-2 rounded-full bg-live" />
            {t(profile.availability, locale)}
          </p>
          <h1 className="mt-5 text-[clamp(2.6rem,7vw,5rem)] xl:text-[4.25rem] font-bold leading-[1.02] tracking-[-0.03em]">
            {t(profile.name, locale)}
          </h1>
          <p className="mt-2 text-[clamp(1.25rem,2.6vw,1.75rem)] font-medium text-muted">{t(profile.role, locale)}</p>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink/90">{t(profile.intro, locale)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.cv}
              download
              className="rounded-lg bg-signal px-5 py-2.5 font-semibold text-canvas transition-colors hover:bg-[#ffc66f]"
            >
              {t(ui.cv, locale)}
            </a>
            <a
              href="#projects"
              className="rounded-lg border border-line px-5 py-2.5 font-semibold transition-colors hover:border-muted"
            >
              {t(ui.heroCtaProjects, locale)}
            </a>
            <OpenChatButton className="flex items-center gap-2 rounded-lg border border-signal/50 bg-signal/10 px-5 py-2.5 font-semibold text-signal transition-colors hover:border-signal">
              <span aria-hidden className="size-1.5 rounded-full bg-signal running" />
              {t(chatUi.launch, locale)}
            </OpenChatButton>
          </div>
        </div>

        <figure className="rounded-2xl border border-line/70 bg-canvas/70 p-4 sm:p-8 xl:p-5">
          <AgentGraph locale={locale} />
          <figcaption className="mt-5 text-sm text-muted">{t(ui.graphHint, locale)}</figcaption>
        </figure>
      </div>
      </Spotlight>
    </section>
  );
}
