/** Vector illustration primitives drawn straight onto a 2D canvas. */

export type Ctx = CanvasRenderingContext2D;

export function roundRectPath(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Hand-drawn looking leaf/frond. */
function frond(ctx: Ctx, len: number, spread: number, color: string, lw: number) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(len * 0.5, -spread * 0.6, len, spread * 0.15);
  ctx.stroke();
  const blades = 9;
  for (let i = 1; i <= blades; i++) {
    const t = i / (blades + 1);
    const px = len * t;
    const py = -spread * 0.6 * 2 * t * (1 - t) - spread * 0.15 * t + spread * 0.15 * t * t;
    const bl = spread * 0.75 * Math.sin(Math.PI * t);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(px + bl * 0.3, py - bl * 0.7, px - bl * 0.15, py - bl);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(px + bl * 0.35, py + bl * 0.6, px + bl * 0.05, py + bl * 0.95);
    ctx.stroke();
  }
}

export function drawPalm(
  ctx: Ctx,
  x: number,
  y: number,
  s: number,
  color: string,
  lean = 1,
  fronds = 6,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s * lean, s);
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(18, -110, 8, -220);
  ctx.stroke();
  // trunk rings
  for (let i = 1; i < 7; i++) {
    const t = i / 7;
    const px = 2 * (1 - t) * t * 18 + t * t * 8;
    const py = -220 * t * (0.6 + 0.4 * t);
    ctx.beginPath();
    ctx.moveTo(px - 6, py);
    ctx.lineTo(px + 6, py + 3);
    ctx.stroke();
  }
  ctx.translate(8, -222);
  for (let i = 0; i < fronds; i++) {
    ctx.save();
    ctx.rotate((-Math.PI * (i + 0.5)) / fronds - 0.1);
    frond(ctx, 96, 40, color, 5);
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 6, 7, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export function drawSun(ctx: Ctx, x: number, y: number, r: number, color: string, rays = true) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(2, r * 0.06);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 7; i++) {
    const yy = y - r * 0.75 + (i * r * 1.5) / 6;
    const half = Math.sqrt(Math.max(0, r * r - (yy - y) * (yy - y))) * 0.86;
    ctx.beginPath();
    ctx.moveTo(x - half, yy);
    ctx.lineTo(x + half, yy);
    ctx.stroke();
  }
  if (rays) {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2);
      ctx.lineTo(x + Math.cos(a) * r * 1.38, y + Math.sin(a) * r * 1.38);
      ctx.stroke();
    }
  }
  ctx.restore();
}

export function drawWaves(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  rows: number,
  color: string,
  lw: number,
  gap: number,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  for (let r = 0; r < rows; r++) {
    const yy = y + r * gap;
    ctx.beginPath();
    const amp = gap * 0.34;
    const step = w / 12;
    ctx.moveTo(x, yy);
    for (let i = 0; i < 12; i++) {
      const sx = x + i * step;
      ctx.quadraticCurveTo(sx + step * 0.25, yy - amp, sx + step * 0.5, yy);
      ctx.quadraticCurveTo(sx + step * 0.75, yy + amp, sx + step, yy);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export function drawHut(ctx: Ctx, x: number, y: number, s: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 6;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-70, 0);
  ctx.lineTo(0, -62);
  ctx.lineTo(70, 0);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-52, 0);
  ctx.lineTo(-52, 54);
  ctx.moveTo(52, 0);
  ctx.lineTo(52, 54);
  ctx.moveTo(-58, 54);
  ctx.lineTo(58, 54);
  ctx.stroke();
  ctx.restore();
}

export function drawUmbrella(ctx: Ctx, x: number, y: number, s: number, a: string, b: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.lineWidth = 6;
  ctx.strokeStyle = b;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? a : b;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 60, Math.PI + (i * Math.PI) / 6, Math.PI + ((i + 1) * Math.PI) / 6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 64);
  ctx.stroke();
  ctx.restore();
}

export function drawSurfboard(ctx: Ctx, x: number, y: number, s: number, rot: number, color: string, stripe: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -120);
  ctx.quadraticCurveTo(38, 0, 0, 120);
  ctx.quadraticCurveTo(-38, 0, 0, -120);
  ctx.fill();
  ctx.strokeStyle = stripe;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, -104);
  ctx.lineTo(0, 104);
  ctx.stroke();
  ctx.restore();
}

/** Subtle print grain. Deterministic-ish, cheap. */
export function drawGrain(ctx: Ctx, w: number, h: number, alpha = 0.05) {
  const cell = 3;
  ctx.save();
  for (let y = 0; y < h; y += cell) {
    for (let x = 0; x < w; x += cell) {
      const n = Math.random();
      if (n > 0.86) {
        ctx.fillStyle = `rgba(0,0,0,${alpha * n})`;
        ctx.fillRect(x, y, cell, cell);
      } else if (n < 0.05) {
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
        ctx.fillRect(x, y, cell, cell);
      }
    }
  }
  ctx.restore();
}

export function drawHalftone(ctx: Ctx, x: number, y: number, w: number, h: number, color: string, step = 16) {
  ctx.save();
  ctx.fillStyle = color;
  for (let iy = 0; iy < h; iy += step) {
    for (let ix = 0; ix < w; ix += step) {
      const t = 1 - iy / h;
      const r = Math.max(0, step * 0.28 * t);
      if (r <= 0.2) continue;
      ctx.beginPath();
      ctx.arc(x + ix, y + iy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** Wobbly hand-drawn rectangle border. */
export function drawHandBorder(ctx: Ctx, x: number, y: number, w: number, h: number, color: string, lw: number) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  const wob = lw * 0.9;
  const pts: [number, number][] = [];
  const per = 9;
  for (let i = 0; i < per; i++) pts.push([x + (w * i) / per, y + Math.sin(i * 1.7) * wob]);
  for (let i = 0; i < per; i++) pts.push([x + w + Math.sin(i * 2.1) * wob, y + (h * i) / per]);
  for (let i = 0; i < per; i++) pts.push([x + w - (w * i) / per, y + h + Math.sin(i * 1.3) * wob]);
  for (let i = 0; i < per; i++) pts.push([x + Math.sin(i * 1.9) * wob, y + h - (h * i) / per]);
  ctx.beginPath();
  const first = pts[0]!;
  ctx.moveTo(first[0], first[1]);
  for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
