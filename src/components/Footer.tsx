import { LinkedInLogo } from "./HHIcons";
import { TEAM_NAME, teamMembers } from "@/data/team";

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden border-t-4 border-goa-yellow bg-goa-deep py-12">
      <svg
        viewBox="0 0 400 140"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-32 w-80 opacity-45"
      >
        <g stroke="#FFD400" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M320 140 q 14 -70 4 -120" />
          <path d="M324 22 q -40 -20 -66 -4 M324 22 q -26 -34 -64 -32 M324 22 q 40 -28 70 -8" />
          <path d="M0 118 q 30 -14 60 0 t 60 0 t 60 0 t 60 0" opacity="0.6" />
        </g>
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <p className="display-xl text-4xl leading-[0.9] text-goa-yellow sm:text-6xl">
          BUILT WITH
          <br />
          <span className="text-goa-pink">CURIOSITY + CODE</span>
        </p>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-cond text-[0.6rem] text-goa-cream/70">DONE BY</p>
            <p className="font-cond text-2xl font-semibold uppercase tracking-[0.14em] text-goa-yellow">
              {TEAM_NAME}
            </p>
          </div>
          <ul className="flex flex-col gap-2 sm:items-end">
            {teamMembers.map((m) => (
              <li key={m.name}>
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-cond inline-flex items-center gap-2 text-[0.62rem] text-goa-cream transition-colors hover:text-goa-yellow"
                >
                  <LinkedInLogo className="h-4 w-4" aria-hidden="true" />
                  {m.name}
                  <span className="sr-only"> on LinkedIn</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t-2 border-goa-yellow/30 pt-5">
          <p className="label-cond text-[0.58rem] text-goa-yellow">HH GOA 2026 — GOA, INDIA — 28–31 OCT 2026</p>
          <p className="label-cond text-[0.58rem] text-goa-pink">#FRAMEINGOA</p>
        </div>
      </div>
    </footer>
  );
}
