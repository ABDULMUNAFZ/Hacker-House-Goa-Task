import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; tx: number; ty: number; r: number; c: string };

/**
 * Lightweight canvas particle-text. Particles fly in once, settle, then the
 * canvas stops rendering entirely (no permanent RAF loop).
 */
export function ParticleText({
  text,
  height = 190,
  className,
}: {
  text: string;
  height?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let particles: Particle[] = [];
    let start = 0;
    let cancelled = false;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement?.clientWidth ?? 600;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      let size = Math.min(height * 0.92, width * 0.42);
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      do {
        octx.font = `700 ${size}px "Bodoni Moda", serif`;
        if (octx.measureText(text).width <= width * 0.9) break;
        size -= 4;
      } while (size > 16);
      octx.clearRect(0, 0, width, height);
      octx.fillStyle = "#fff";
      octx.fillText(text, width / 2, height / 2);

      const data = octx.getImageData(0, 0, width, height).data;
      const gap = width < 480 ? 6 : 5;
      const palette = ["#FFD400", "#FF168C", "#FFF8DD"];
      particles = [];
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const alpha = data[(y * width + x) * 4 + 3] ?? 0;
          if (alpha > 128) {
            particles.push({
              x: reduced ? x : x + (Math.random() - 0.5) * width * 0.7,
              y: reduced ? y : y + (Math.random() - 0.5) * height * 2.2,
              tx: x,
              ty: y,
              r: gap * 0.42,
              c: palette[(x + y) % 3 === 0 ? 1 : (x * y) % 5 === 0 ? 2 : 0]!,
            });
          }
        }
      }
      start = performance.now();
    };

    const paint = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min(1, (now - start) / 1400);
      const ease = 1 - Math.pow(1 - t, 3);
      let moving = false;
      for (const p of particles) {
        p.x += (p.tx - p.x) * (0.06 + ease * 0.14);
        p.y += (p.ty - p.y) * (0.06 + ease * 0.14);
        if (Math.abs(p.tx - p.x) > 0.4 || Math.abs(p.ty - p.y) > 0.4) moving = true;
      }
      paint();
      if (moving && t < 1.6) raf = requestAnimationFrame(tick);
    };

    build();
    if (reduced) paint();
    else raf = requestAnimationFrame(tick);

    const onResize = () => {
      cancelAnimationFrame(raf);
      build();
      if (reduced) paint();
      else raf = requestAnimationFrame(tick);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [text, height]);

  return (
    <div className={className} role="img" aria-label={text}>
      <canvas ref={ref} className="block w-full" />
    </div>
  );
}
