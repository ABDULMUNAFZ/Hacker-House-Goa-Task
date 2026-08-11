export const MAX_FILE_BYTES = 25 * 1024 * 1024;

export const ACCEPTED = "image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,.heic,.heif";

export class ImageError extends Error {}

function isHeic(file: File) {
  const name = file.name.toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

async function decode(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new ImageError("We couldn't read that image."));
    img.src = url;
  });
}

/** Loads any supported file into an <img>, converting HEIC/HEIF client-side when needed. */
export async function loadImageFile(file: File): Promise<{ img: HTMLImageElement; url: string }> {
  if (file.size > MAX_FILE_BYTES) {
    throw new ImageError("That photo is a bit too large. Try one under 25MB.");
  }
  if (!file.type.startsWith("image/") && !isHeic(file)) {
    throw new ImageError("That file isn't an image. Try a JPG, PNG or HEIC.");
  }

  let url = URL.createObjectURL(file);
  try {
    const img = await decode(url);
    return { img, url };
  } catch {
    URL.revokeObjectURL(url);
  }

  if (!isHeic(file)) {
    throw new ImageError("That photo format isn't supported by this browser. Try JPG or PNG.");
  }

  try {
    const { default: heic2any } = await import("heic2any");
    const converted = (await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 })) as
      | Blob
      | Blob[];
    const blob = Array.isArray(converted) ? converted[0]! : converted;
    url = URL.createObjectURL(blob);
    const img = await decode(url);
    return { img, url };
  } catch {
    throw new ImageError(
      "We couldn't convert that HEIC photo. Try saving it as JPG and uploading again.",
    );
  }
}

/** Downscales huge photos so canvas work stays fast on mobile. */
export function normalizeImage(img: HTMLImageElement, maxEdge = 2000): HTMLCanvasElement | HTMLImageElement {
  const longest = Math.max(img.width, img.height);
  if (longest <= maxEdge) return img;
  const scale = maxEdge / longest;
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * scale);
  c.height = Math.round(img.height * scale);
  const ctx = c.getContext("2d");
  if (!ctx) return img;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return c;
}
