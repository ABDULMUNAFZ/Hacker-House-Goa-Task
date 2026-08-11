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

const field =
  "mt-1 w-full rounded-lg border-2 border-goa-yellow/40 bg-goa-deep px-3 py-3 font-body text-sm text-goa-cream placeholder:text-goa-cream/40 focus:border-goa-yellow focus:outline-none";

export function BuilderForm({ name, role, vibe, title, onName, onRole, onVibe, onRoll }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="hh-name" className="label-cond text-[0.6rem] text-goa-yellow">
          NAME
        </label>
        <input
          id="hh-name"
          className={field}
          value={name}
          maxLength={44}
          placeholder="Abdul Munaf"
          onChange={(e) => onName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="hh-role" className="label-cond text-[0.6rem] text-goa-yellow">
          STACK / ROLE
        </label>
        <input
          id="hh-role"
          className={field}
          value={role}
          maxLength={44}
          placeholder="Frontend Engineer"
          onChange={(e) => onRole(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="hh-vibe" className="label-cond text-[0.6rem] text-goa-yellow">
          VIBE <span className="text-goa-cream/60">(OPTIONAL)</span>
        </label>
        <input
          id="hh-vibe"
          className={field}
          value={vibe}
          maxLength={70}
          placeholder="Building weird things for the web."
          onChange={(e) => onVibe(e.target.value)}
        />
      </div>

      <div className="rounded-lg border-2 border-goa-pink/70 bg-goa-pink/15 p-3">
        <p className="label-cond text-[0.55rem] text-goa-cream/80">YOUR BUILDER TITLE</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="font-cond text-lg font-semibold uppercase tracking-wide text-goa-yellow">
            {title}
          </p>
          <button type="button" onClick={onRoll} className="hh-btn hh-btn-pink px-4 py-2 text-[0.6rem]">
            <Dices className="h-4 w-4" aria-hidden="true" />
            Roll again
          </button>
        </div>
      </div>
    </div>
  );
}
