export const MAX_FILE_BYTES = 25 * 1024 * 1024;

export const ACCEPTED = "image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,.heic,.heif,.dng,.tiff,.tif,.raw";

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

function isRawOrDng(file: File) {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".dng") ||
    name.endsWith(".tiff") ||
    name.endsWith(".tif") ||
    name.endsWith(".raw") ||
    file.type === "image/x-adobe-dng" ||
    file.type === "image/tiff"
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

/** Scans binary buffers for embedded JPEG preview images and returns the largest chunk.
 *  Uses backward scanning from limits to ensure we extract the complete, untruncated JPEG.
 */
function extractLargestJpeg(buffer: ArrayBuffer): Blob | null {
  const bytes = new Uint8Array(buffer);
  const positions: number[] = [];
  
  // Find all SOI markers (0xFF, 0xD8)
  for (let i = 0; i < bytes.length - 1; i++) {
    if (bytes[i] === 0xFF && bytes[i + 1] === 0xD8) {
      positions.push(i);
    }
  }
  
  let largestBlob: Blob | null = null;
  let largestSize = 0;
  
  for (let idx = 0; idx < positions.length; idx++) {
    const start = positions[idx]!;
    const limit = idx < positions.length - 1 ? positions[idx + 1]! : bytes.length;
    
    // Search backward from the limit for the last EOI marker (0xFF, 0xD9) in this JPEG segment
    let end = -1;
    for (let j = limit - 2; j >= start; j--) {
      if (bytes[j] === 0xFF && bytes[j + 1] === 0xD9) {
        end = j + 2;
        break;
      }
    }
    
    if (end > start) {
      const size = end - start;
      if (size > largestSize) {
        largestSize = size;
        const jpegBytes = bytes.subarray(start, end);
        largestBlob = new Blob([jpegBytes], { type: "image/jpeg" });
      }
    }
  }
  
  return largestBlob;
}

/** Loads any supported file into an <img>, converting HEIC client-side or extracting DNG/RAW embedded JPEGs. */
export async function loadImageFile(file: File): Promise<{ img: HTMLImageElement; url: string }> {
  if (file.size > MAX_FILE_BYTES) {
    throw new ImageError("That photo is a bit too large. Try one under 25MB.");
  }

  // 1. ALWAYS try native browser decoding first (works for PNG, JPG, WebP, SVG, BMP, and native Safari TIFF/HEIC)
  let url = URL.createObjectURL(file);
  try {
    const img = await decode(url);
    return { img, url };
  } catch {
    URL.revokeObjectURL(url);
  }

  // 2. If it is a RAW/DNG file, or native decode failed on TIFF, extract embedded JPEG preview
  if (isRawOrDng(file)) {
    try {
      const buffer = await file.arrayBuffer();
      const jpegBlob = extractLargestJpeg(buffer);
      if (!jpegBlob) {
        throw new Error("No embedded JPEG preview found in raw image.");
      }
      const url = URL.createObjectURL(jpegBlob);
      const img = await decode(url);
      return { img, url };
    } catch {
      throw new ImageError("We couldn't decode that RAW/DNG image. Try converting it to JPG or PNG.");
    }
  }

  // 3. If it is a HEIC file, convert it to JPEG using heic2any
  if (isHeic(file)) {
    try {
      const { default: heic2any } = await import("heic2any");
      const converted = (await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 })) as
        | Blob
        | Blob[];
      const blob = Array.isArray(converted) ? converted[0]! : converted;
      const url = URL.createObjectURL(blob);
      const img = await decode(url);
      return { img, url };
    } catch {
      throw new ImageError(
        "We couldn't convert that HEIC photo. Try saving it as JPG and uploading again.",
      );
    }
  }

  // 4. Last-resort fallback for any other custom image format: try to scan for an embedded JPEG
  try {
    const buffer = await file.arrayBuffer();
    const jpegBlob = extractLargestJpeg(buffer);
    if (jpegBlob) {
      const url = URL.createObjectURL(jpegBlob);
      const img = await decode(url);
      return { img, url };
    }
  } catch {
    // Ignore and fall through to default error
  }

  throw new ImageError("That photo format isn't supported by this browser. Try JPG or PNG.");
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
