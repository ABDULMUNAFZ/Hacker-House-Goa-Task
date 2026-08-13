export const REQUIRED_HASHTAG = "#FrameInGoa";

export const DEFAULT_CAPTION = `I just got my HH Goa 2026 Builder Card 🌴🔥

See you in Goa — 28–31 Oct 2026.
Made mine at hacker-house-goa-task.vercel.app

#FrameInGoa #HackerHouseGoa #HHGoa2026 #Builders @hhgoa`;

export const SITE_URL = "https://hacker-house-goa-task.vercel.app";

/** The hashtag is non-negotiable — restore it if the user edited it out. */
export function withHashtag(caption: string) {
  const text = caption.trim();
  if (text.toLowerCase().includes(REQUIRED_HASHTAG.toLowerCase())) return text;
  return `${text}\n\n${REQUIRED_HASHTAG}`.trim();
}

export function buildIntentUrl(caption: string, url = typeof window !== "undefined" ? window.location.origin : SITE_URL) {
  const params = new URLSearchParams({ text: withHashtag(caption), url });
  return `https://x.com/intent/post?${params.toString()}`;
}

export function openX(caption: string) {
  const target = window.open(buildIntentUrl(caption), "_blank", "noopener,noreferrer");
  if (!target) {
    return { ok: false as const, url: buildIntentUrl(caption) };
  }
  return { ok: true as const, url: buildIntentUrl(caption) };
}

export function canShareFiles(file: File) {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    typeof navigator.share === "function" &&
    navigator.canShare({ files: [file] })
  );
}

export async function shareFile(file: File, caption: string) {
  await navigator.share({ files: [file], text: withHashtag(caption) });
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}
