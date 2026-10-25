import type { L, Locale } from "@/content/types";
import { t } from "@/lib/i18n";

/** The project's system drawn as a chain of workflow nodes. Vertical on phones, horizontal from md up. */
export function FlowDiagram({ steps, locale }: { steps: L[]; locale: Locale }) {
  return (
    <ol className="dot-grid mt-4 flex flex-col items-stretch rounded-2xl border border-line p-4 sm:p-6 md:flex-row md:items-center">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const first = i === 0;
        return (
          <li key={i} className="flex flex-col items-center md:min-w-0 md:flex-1 md:flex-row">
            <div
              className={`relative w-full rounded-xl border bg-surface px-3 py-3 text-center text-[14px] font-medium leading-snug md:min-h-[76px] md:content-center ${
                first ? "border-muted/60" : last ? "border-live/60" : "border-line"
              }`}
            >
              {t(s, locale)}
            </div>
            {!last && (
              <span aria-hidden className="flex items-center justify-center md:w-6 md:shrink-0">
                <span className="block h-5 w-px bg-signal/70 md:h-px md:w-full" />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
