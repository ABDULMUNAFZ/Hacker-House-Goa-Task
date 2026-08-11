import { THEMES, type ThemeId } from "@/data/themes";
import {
  drawGrain,
  drawHalftone,
  drawHandBorder,
  drawHut,
  drawPalm,
  drawSun,
  drawSurfboard,
  drawUmbrella,
  drawWaves,
  roundRectPath,
  type Ctx,
} from "./illustration";
import { drawTracked, fitText, measureTracked } from "./textfit";

export const SERIF = (size: number, weight = 700) =>
  `${weight} ${size}px "Bodoni Moda", "Times New Roman", serif`;
export const COND = (size: number, weight = 600) =>
  `${weight} ${size}px "Oswald", "Arial Narrow", sans-serif`;
export const BODY = (size: number, weight = 500) => `${weight} ${size}px "DM Sans", sans-serif`;

export type PhotoTransform = { zoom: number; x: number; y: number };

export type CardData = {
  mode: "pfp" | "builder";
  theme: ThemeId;
  name: string;
  role: string;
  vibe: string;
  title: string;
};

export const PFP_SIZE = { w: 1080, h: 1080 };
export const BUILDER_SIZE = { w: 1080, h: 1350 };

export function sizeFor(mode: "pfp" | "builder") {
  return mode === "pfp" ? PFP_SIZE : BUILDER_SIZE;
}

function drawPhoto(
  ctx: Ctx,
  img: CanvasImageSource & { width: number; height: number },
  x: number,
  y: number,
  w: number,
  h: number,
  t: PhotoTransform,
) {
  const iw = img.width;
  const ih = img.height;
  const base = Math.max(w / iw, h / ih);
  const scale = base * t.zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = x + (w - dw) / 2 + t.x * w;
  const dy = y + (h - dh) / 2 + t.y * h;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img as CanvasImageSource, dx, dy, dw, dh);
}

function textOnArc(
  ctx: Ctx,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  direction: 1 | -1,
  tracking: number,
) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width + tracking);
  const total = widths.reduce((a, b) => a + b, 0);
  let angle = startAngle - (direction * (total / radius)) / 2;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  chars.forEach((c, i) => {
    const w = widths[i]!;
    angle += (direction * (w / 2)) / radius;
    ctx.save();
    ctx.translate(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.rotate(angle + (direction === 1 ? Math.PI / 2 : -Math.PI / 2));
    ctx.fillText(c, 0, 0);
    ctx.restore();
    angle += (direction * (w / 2)) / radius;
  });
  ctx.restore();
}

function background(ctx: Ctx, w: number, h: number, t: (typeof THEMES)[ThemeId]) {
  ctx.fillStyle = t.bg;
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "rgba(255,255,255,0.06)");
  g.addColorStop(1, "rgba(0,0,0,0.20)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/* ------------------------------- PFP FRAME ------------------------------- */

function renderPfp(
  ctx: Ctx,
  img: (CanvasImageSource & { width: number; height: number }) | null,
  data: CardData,
  t: PhotoTransform,
) {
  const { w, h } = PFP_SIZE;
  const th = THEMES[data.theme];
  background(ctx, w, h, th);

  const cx = w / 2;
  const cy = h / 2;
  const photoR = 372;
  const ringR = 452;

  // horizon / sea band behind the ring
  ctx.save();
  ctx.globalAlpha = 0.55;
  drawWaves(ctx, -20, h - 190, w + 40, 4, th.sea, 6, 34);
  ctx.restore();
  drawSun(ctx, 148, 150, 74, th.accent, true);
  ctx.save();
  ctx.globalAlpha = 0.35;
  drawHalftone(ctx, 0, h - 260, w, 260, th.ink, 18);
  ctx.restore();

  // corner palms
  drawPalm(ctx, 78, h - 52, 0.86, th.ink, 1, 6);
  drawPalm(ctx, w - 74, h - 30, 0.72, th.ink, -1, 6);
  drawPalm(ctx, w - 92, 300, 0.42, th.cream, -1, 5);
  drawHut(ctx, 132, h - 96, 0.42, th.cream);
  drawSurfboard(ctx, w - 150, h - 250, 0.42, -0.42, th.accent, th.cream);

  // ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.fillStyle = th.bgDeep;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = th.ink;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, ringR - 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = th.accent;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, photoR + 22, -0.35, 1.05);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, photoR + 22, Math.PI - 0.35, Math.PI + 1.05);
  ctx.stroke();
  ctx.restore();

  // photo
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
  ctx.clip();
  if (img) {
    drawPhoto(ctx, img, cx - photoR, cy - photoR, photoR * 2, photoR * 2, t);
  } else {
    ctx.fillStyle = th.bgDeep;
    ctx.fillRect(cx - photoR, cy - photoR, photoR * 2, photoR * 2);
    ctx.fillStyle = th.cream;
    ctx.font = COND(46);
    ctx.textAlign = "center";
    ctx.fillText("YOUR PHOTO", cx, cy);
  }
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = th.cream;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, photoR + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // arc typography
  ctx.fillStyle = th.ink;
  ctx.font = SERIF(74, 700);
  textOnArc(ctx, "HH GOA 2026", cx, cy, ringR - 62, -Math.PI / 2, 1, 6);
  ctx.font = COND(38, 500);
  ctx.fillStyle = th.cream;
  textOnArc(ctx, "#FRAMEINGOA", cx, cy, ringR - 58, Math.PI / 2, -1, 10);

  ctx.font = COND(30, 500);
  ctx.fillStyle = th.ink;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  drawTracked(ctx, "GOA, INDIA", 44, 58, 6, "left");
  ctx.textAlign = "right";
  drawTracked(ctx, "28–31 OCT 2026", w - 44, 58, 6, "right");

  if (data.name.trim()) {
    ctx.font = COND(34, 600);
    ctx.fillStyle = th.accent;
    const label = data.name.trim().toUpperCase();
    const tw = measureTracked(ctx, label, 6) + 48;
    const bx = cx - tw / 2;
    roundRectPath(ctx, bx, h - 96, tw, 56, 28);
    ctx.fillStyle = th.accent;
    ctx.fill();
    ctx.fillStyle = th.cream;
    drawTracked(ctx, label, cx, h - 57, 6, "center");
  }

  drawGrain(ctx, w, h, 0.05);
}

/* ----------------------------- BUILDER CARD ------------------------------ */

function renderBuilder(
  ctx: Ctx,
  img: (CanvasImageSource & { width: number; height: number }) | null,
  data: CardData,
  t: PhotoTransform,
) {
  const { w, h } = BUILDER_SIZE;
  const th = THEMES[data.theme];
  background(ctx, w, h, th);

  // ambient illustration
  ctx.save();
  ctx.globalAlpha = 0.5;
  drawWaves(ctx, -20, h - 150, w + 40, 3, th.sea, 6, 28);
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.55;
  drawSun(ctx, w - 150, h - 330, 78, th.accent, true);
  drawPalm(ctx, 70, h - 40, 0.5, th.ink, 1, 6);
  drawPalm(ctx, w - 58, h - 30, 0.42, th.ink, -1, 6);
  drawUmbrella(ctx, 160, h - 96, 0.28, th.accent, th.cream);
  drawHut(ctx, w - 200, h - 104, 0.26, th.cream);
  ctx.restore();

  drawHandBorder(ctx, 34, 34, w - 68, h - 68, th.ink, 4);

  // header
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = th.ink;
  ctx.font = SERIF(96, 700);
  ctx.textAlign = "left";
  ctx.fillText("HH GOA", 72, 172);
  ctx.font = COND(30, 500);
  ctx.fillStyle = th.cream;
  ctx.textAlign = "right";
  drawTracked(ctx, "BUILDERS OF THE HOUSE", w - 72, 126, 5, "right");
  ctx.font = SERIF(56, 400);
  ctx.fillStyle = th.accent;
  drawTracked(ctx, "2026", w - 72, 180, 6, "right");

  ctx.strokeStyle = th.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(72, 206);
  ctx.lineTo(w - 72, 206);
  ctx.stroke();

  // photo panel
  const px = 84;
  const py = 250;
  const pw = w - 168;
  const ph = 620;
  ctx.save();
  ctx.fillStyle = th.accent;
  roundRectPath(ctx, px + 18, py + 20, pw, ph, 26);
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRectPath(ctx, px, py, pw, ph, 26);
  ctx.clip();
  if (img) {
    drawPhoto(ctx, img, px, py, pw, ph, t);
  } else {
    ctx.fillStyle = th.bgDeep;
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = th.cream;
    ctx.font = COND(52);
    ctx.textAlign = "center";
    ctx.fillText("DROP YOUR SELFIE", px + pw / 2, py + ph / 2);
  }
  ctx.restore();
  ctx.save();
  roundRectPath(ctx, px, py, pw, ph, 26);
  ctx.strokeStyle = th.cream;
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.restore();

  // title chip on photo edge
  const chipText = (data.title || "GOA BUILDER").toUpperCase();
  ctx.font = COND(34, 600);
  const chipW = measureTracked(ctx, chipText, 5) + 56;
  const chipY = py + ph - 34;
  ctx.save();
  ctx.translate(px + 26, chipY);
  ctx.rotate(-0.03);
  roundRectPath(ctx, 0, 0, chipW, 64, 32);
  ctx.fillStyle = th.accent;
  ctx.fill();
  ctx.fillStyle = th.cream;
  ctx.font = COND(34, 600);
  drawTracked(ctx, chipText, 28, 42, 5, "left");
  ctx.restore();

  // name (auto-fitting, never overflows)
  const name = (data.name.trim() || "YOUR NAME").toUpperCase();
  const nameFit = fitText(ctx, name, {
    maxWidth: w - 168,
    maxHeight: 232,
    maxLines: 3,
    maxFontSize: 118,
    minFontSize: 40,
    lineHeightRatio: 0.94,
    font: (s) => SERIF(s, 700),
  });
  ctx.fillStyle = th.ink;
  ctx.textAlign = "left";
  ctx.font = SERIF(nameFit.fontSize, 700);
  let ny = 942 + nameFit.fontSize * 0.78;
  for (const line of nameFit.lines) {
    ctx.fillText(line, 84, ny);
    ny += nameFit.lineHeight;
  }

  // role
  const role = (data.role.trim() || "BUILDER").toUpperCase();
  const roleFit = fitText(ctx, role, {
    maxWidth: w - 168,
    maxHeight: 90,
    maxLines: 2,
    maxFontSize: 46,
    minFontSize: 22,
    lineHeightRatio: 1.1,
    font: (s) => COND(s, 500),
  });
  ctx.fillStyle = th.cream;
  let ry = Math.min(ny + 22, 1186);
  ctx.font = COND(roleFit.fontSize, 500);
  for (const line of roleFit.lines) {
    drawTracked(ctx, line, 84, ry, 4, "left");
    ry += roleFit.lineHeight;
  }

  // vibe
  if (data.vibe.trim()) {
    const vibeFit = fitText(ctx, data.vibe.trim(), {
      maxWidth: w - 200,
      maxHeight: 70,
      maxLines: 2,
      maxFontSize: 30,
      minFontSize: 18,
      lineHeightRatio: 1.25,
      font: (s) => BODY(s, 400),
    });
    ctx.fillStyle = th.ink;
    ctx.font = BODY(vibeFit.fontSize, 400);
    let vy = Math.min(ry + 10, 1244);
    for (const line of vibeFit.lines) {
      ctx.fillText(line, 84, vy);
      vy += vibeFit.lineHeight;
    }
  }

  // footer
  ctx.strokeStyle = th.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(72, h - 108);
  ctx.lineTo(w - 72, h - 108);
  ctx.stroke();

  ctx.font = COND(28, 500);
  ctx.fillStyle = th.cream;
  ctx.textAlign = "left";
  drawTracked(ctx, "GOA, INDIA", 84, h - 62, 5, "left");
  ctx.fillStyle = th.ink;
  drawTracked(ctx, "28–31 OCT 2026", w / 2 - 90, h - 62, 5, "left");
  ctx.fillStyle = th.accent === th.bg ? th.cream : th.accent;
  ctx.font = COND(30, 600);
  drawTracked(ctx, "#FRAMEINGOA", w - 84, h - 62, 5, "right");

  drawGrain(ctx, w, h, 0.05);
}

export function renderCard(
  canvas: HTMLCanvasElement,
  img: (CanvasImageSource & { width: number; height: number }) | null,
  data: CardData,
  transform: PhotoTransform,
) {
  const { w, h } = sizeFor(data.mode);
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas rendering is not available in this browser.");
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  if (data.mode === "pfp") renderPfp(ctx, img, data, transform);
  else renderBuilder(ctx, img, data, transform);
  ctx.restore();
  return canvas;
}
