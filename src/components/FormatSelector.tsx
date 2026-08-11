import { THEME_LIST, type ThemeId } from "@/data/themes";

type Props = {
  mode: "pfp" | "builder";
  onMode: (mode: "pfp" | "builder") => void;
  theme: ThemeId;
  onTheme: (theme: ThemeId) => void;
};

export function FormatSelector({ mode, onMode, theme, onTheme }: Props) {
  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="label-cond text-[0.6rem] text-goa-yellow">CHOOSE YOUR FORMAT</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {(
            [
              { id: "pfp", title: "PFP FRAME", sub: "1080 × 1080" },
              { id: "builder", title: "BUILDER CARD", sub: "1080 × 1350" },
            ] as const
          ).map((f) => {
            const active = mode === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => onMode(f.id)}
                className={`grain rounded-xl border-4 p-3 text-left transition-all ${
                  active
                    ? "border-goa-yellow bg-goa-pink"
                    : "border-goa-yellow/30 bg-goa-deep/60 hover:border-goa-yellow/70"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`block border-2 ${
                      f.id === "pfp" ? "h-5 w-5 rounded-full" : "h-6 w-5 rounded-sm"
                    } ${active ? "border-goa-cream" : "border-goa-yellow"}`}
                  />
                  <span
                    className={`label-cond text-[0.6rem] ${active ? "text-goa-cream" : "text-goa-yellow"}`}
                  >
                    {f.title}
                  </span>
                </span>
                <span className="mt-1 block font-body text-[0.65rem] text-goa-cream/75">{f.sub}</span>
                {active && <span className="sr-only">Selected</span>}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-cond text-[0.6rem] text-goa-yellow">PICK A COMPOSITION</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {THEME_LIST.map((t) => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onClick={() => onTheme(t.id)}
                className={`label-cond rounded-full border-2 px-3 py-2 text-[0.55rem] transition-colors ${
                  active
                    ? "border-goa-yellow bg-goa-yellow text-goa-ink"
                    : "border-goa-cream/35 text-goa-cream hover:border-goa-yellow"
                }`}
              >
                {t.label}
                {active && <span className="sr-only"> (selected)</span>}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
