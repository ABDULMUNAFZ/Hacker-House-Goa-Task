/** Canvas-measurement based text fitting. No CSS overflow tricks. */

export type FitResult = { lines: string[]; fontSize: number; lineHeight: number };

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Hard-splits a single word that cannot fit on one line. */
function hardSplit(ctx: CanvasRenderingContext2D, word: string, maxWidth: number): string[] {
  const out: string[] = [];
  let cur = "";
  for (const ch of word) {
    if (ctx.measureText(cur + ch).width > maxWidth && cur) {
      out.push(cur);
      cur = ch;
    } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

export function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  opts: {
    maxWidth: number;
    maxHeight: number;
    maxLines: number;
    maxFontSize: number;
    minFontSize: number;
    lineHeightRatio?: number;
    font: (size: number) => string;
  },
): FitResult {
  const lhr = opts.lineHeightRatio ?? 0.92;
  for (let size = opts.maxFontSize; size >= opts.minFontSize; size -= 2) {
    ctx.font = opts.font(size);
    let lines = wrap(ctx, text, opts.maxWidth);
    if (lines.some((l) => ctx.measureText(l).width > opts.maxWidth)) {
      lines = lines.flatMap((l) =>
        ctx.measureText(l).width > opts.maxWidth ? hardSplit(ctx, l, opts.maxWidth) : [l],
      );
    }
    if (lines.length <= opts.maxLines && lines.length * size * lhr <= opts.maxHeight) {
      return { lines, fontSize: size, lineHeight: size * lhr };
    }
  }
  ctx.font = opts.font(opts.minFontSize);
  let lines = wrap(ctx, text, opts.maxWidth).flatMap((l) =>
    ctx.measureText(l).width > opts.maxWidth ? hardSplit(ctx, l, opts.maxWidth) : [l],
  );
  lines = lines.slice(0, opts.maxLines);
  return { lines, fontSize: opts.minFontSize, lineHeight: opts.minFontSize * lhr };
}

export function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
  align: "left" | "right" | "center" = "left",
) {
  const chars = [...text];
  const total =
    chars.reduce((sum, c) => sum + ctx.measureText(c).width, 0) + tracking * (chars.length - 1);
  let cx = align === "left" ? x : align === "right" ? x - total : x - total / 2;
  const prev = ctx.textAlign;
  ctx.textAlign = "left";
  for (const c of chars) {
    ctx.fillText(c, cx, y);
    cx += ctx.measureText(c).width + tracking;
  }
  ctx.textAlign = prev;
  return total;
}

export function measureTracked(ctx: CanvasRenderingContext2D, text: string, tracking: number) {
  const chars = [...text];
  return chars.reduce((s, c) => s + ctx.measureText(c).width, 0) + tracking * (chars.length - 1);
}
