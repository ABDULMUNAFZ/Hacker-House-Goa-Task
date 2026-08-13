import { Dices } from "lucide-react";

type Props = {
  name: string;
  role: string;
  vibe: string;
  title: string;
  onName: (v: string) => void;
  onRole: (v: string) => void;
  onVibe: (v: string) => void;
  onRoll: () => void;
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-goa-yellow/20 bg-goa-deep/40 backdrop-blur-md px-5 py-4 font-body text-base sm:text-lg text-goa-cream placeholder:text-goa-cream/30 focus:border-goa-yellow focus:ring-1 focus:ring-goa-yellow/30 focus:outline-none transition-all duration-200 shadow-inner";

export function BuilderForm({ name, role, vibe, title, onName, onRole, onVibe, onRoll }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="hh-name" className="label-cond text-xs sm:text-sm text-goa-yellow tracking-[0.2em] font-semibold uppercase">
          NAME
        </label>
        <input
          id="hh-name"
          className={inputClass}
          value={name}
          maxLength={44}
          placeholder="Abdul Munaf"
          onChange={(e) => onName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="hh-role" className="label-cond text-xs sm:text-sm text-goa-yellow tracking-[0.2em] font-semibold uppercase">
          STACK / ROLE
        </label>
        <input
          id="hh-role"
          className={inputClass}
          value={role}
          maxLength={44}
          placeholder="Frontend Engineer"
          onChange={(e) => onRole(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="hh-vibe" className="label-cond text-xs sm:text-sm text-goa-yellow tracking-[0.2em] font-semibold uppercase">
          VIBE <span className="text-goa-cream/50 font-normal">(OPTIONAL)</span>
        </label>
        <input
          id="hh-vibe"
          className={inputClass}
          value={vibe}
          maxLength={70}
          placeholder="Building weird things for the web."
          onChange={(e) => onVibe(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-goa-pink/40 bg-goa-pink/10 backdrop-blur-md p-4 transition-all hover:border-goa-pink/60 shadow-md">
        <p className="label-cond text-xs text-goa-cream/60 tracking-wider font-semibold">YOUR BUILDER TITLE</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="font-cond text-2xl sm:text-3xl font-bold uppercase tracking-wider text-goa-yellow text-poster-shadow leading-none">
            {title}
          </p>
          <button 
            type="button" 
            onClick={onRoll} 
            className="hh-btn hh-btn-pink px-4 py-2 text-[0.62rem] tracking-widest font-semibold flex items-center gap-2"
          >
            <Dices className="h-3.5 w-3.5" aria-hidden="true" />
            Roll again
          </button>
        </div>
      </div>
    </div>
  );
}
