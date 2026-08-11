import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Physical conference badge: drops in from above, swings, settles — once.
 * After settling it only responds to subtle pointer/touch parallax.
 */
export function Lanyard({ children, replayKey }: { children: ReactNode; replayKey: string }) {
  const reduced = useReducedMotion();
  const [settled, setSettled] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotate = useSpring(useTransform(px, [-1, 1], [-5, 5]), { stiffness: 90, damping: 14 });
  const shiftX = useSpring(useTransform(px, [-1, 1], [-10, 10]), { stiffness: 90, damping: 16 });
  const shiftY = useSpring(useTransform(py, [-1, 1], [-6, 6]), { stiffness: 90, damping: 16 });

  useEffect(() => {
    setSettled(false);
  }, [replayKey]);

  useEffect(() => {
    if (reduced || !settled) return;
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      px.set(Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2))));
      py.set(Math.max(-1, Math.min(1, (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2))));
    };
    const reset = () => {
      px.set(0);
      py.set(0);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", reset);
    el.addEventListener("pointercancel", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      el.removeEventListener("pointercancel", reset);
    };
  }, [reduced, settled, px, py]);

  return (
    <div ref={wrapRef} className="flex w-full flex-col items-center overflow-hidden pt-2">
      <motion.div
        key={replayKey}
        className="flex w-full flex-col items-center"
        style={{ transformOrigin: "top center" }}
        initial={reduced ? { y: 0, rotate: 0, opacity: 1 } : { y: -420, rotate: -12, opacity: 0 }}
        animate={
          reduced
            ? { y: 0, rotate: 0, opacity: 1 }
            : { y: 0, rotate: [-12, 6, -3.5, 1.5, 0], opacity: 1 }
        }
        transition={
          reduced
            ? { duration: 0 }
            : {
                y: { type: "spring", stiffness: 62, damping: 12, mass: 1.15 },
                rotate: { duration: 1.8, times: [0, 0.34, 0.58, 0.8, 1], ease: "easeOut" },
                opacity: { duration: 0.28 },
              }
        }
        onAnimationComplete={() => setSettled(true)}
      >
        {/* strap */}
        <svg
          viewBox="0 0 220 170"
          className="h-24 w-40 shrink-0 sm:h-28 sm:w-48"
          aria-hidden="true"
        >
          <path d="M14 0 L96 132 L124 132 L206 0" fill="none" stroke="#004F32" strokeWidth="26" />
          <path d="M14 0 L96 132 L124 132 L206 0" fill="none" stroke="#FFD400" strokeWidth="18" />
          <g fontFamily="Oswald, sans-serif" fontSize="15" fill="#004F32" letterSpacing="3">
            <text transform="translate(46 52) rotate(58)">HH GOA</text>
            <text transform="translate(176 52) rotate(-58)">2026</text>
          </g>
          <rect x="92" y="126" width="36" height="26" rx="6" fill="#FF168C" />
          <rect x="86" y="146" width="48" height="18" rx="7" fill="#FFF8DD" />
        </svg>

        <motion.div
          className="w-full max-w-[380px] px-2 sm:max-w-[420px]"
          style={settled && !reduced ? { rotate, x: shiftX, y: shiftY } : {}}
        >
          <div className="relative rounded-[18px] border-4 border-goa-cream bg-goa-deep p-2 shadow-[var(--shadow-poster)]">
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1 h-2 w-16 -translate-x-1/2 rounded-full bg-goa-black/45"
            />
            {children}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
