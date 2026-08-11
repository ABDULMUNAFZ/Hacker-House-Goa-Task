export function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || ""
  );
}

export function fileNameFor(name: string, ext: "png" | "jpg") {
  const slug = slugify(name);
  return slug ? `hh-goa-2026-${slug}.${ext}` : `hh-goa-2026-builder.${ext}`;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("We couldn't build that image file."))),
      type,
      quality,
    );
  });
}

/** JPG needs an opaque backdrop. */
function flatten(canvas: HTMLCanvasElement, background: string) {
  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas rendering failed.");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0);
  return out;
}

export async function exportBlob(
  canvas: HTMLCanvasElement,
  format: "png" | "jpg",
  background = "#004F32",
) {
  return format === "png"
    ? canvasToBlob(canvas, "image/png")
    : canvasToBlob(flatten(canvas, background), "image/jpeg", 0.92);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
