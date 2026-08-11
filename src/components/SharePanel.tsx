import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Download, RotateCcw, Share2 } from "lucide-react";
import { XLogo } from "./HHIcons";
import { exportBlob, fileNameFor } from "@/lib/exportImage";
import {
  DEFAULT_CAPTION,
  buildIntentUrl,
  canShareFiles,
  copyText,
  openX,
  shareFile,
  withHashtag,
} from "@/lib/share";

type Props = {
  getCanvas: () => HTMLCanvasElement | null;
  name: string;
  onError: (message: string) => void;
  onNotice: (message: string) => void;
  onReset: () => void;
};

export function SharePanel({ getCanvas, name, onError, onNotice, onReset }: Props) {
  const [caption, setCaption] = useState(DEFAULT_CAPTION);
  const [copied, setCopied] = useState(false);
  const [savedFormat, setSavedFormat] = useState<"png" | "jpg" | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [fileShareSupported, setFileShareSupported] = useState(false);

  useEffect(() => {
    try {
      const probe = new File([new Blob(["x"], { type: "image/png" })], "p.png", {
        type: "image/png",
      });
      setFileShareSupported(canShareFiles(probe));
    } catch {
      setFileShareSupported(false);
    }
  }, []);

  const intentUrl = useMemo(() => buildIntentUrl(caption), [caption]);

  const makeBlob = async (format: "png" | "jpg") => {
    const canvas = getCanvas();
    if (!canvas) throw new Error("Your card isn't ready yet. Give it a second and try again.");
    return exportBlob(canvas, format);
  };

  const save = async (format: "png" | "jpg") => {
    setBusy(format);
    try {
      const blob = await makeBlob(format);
      const { downloadBlob } = await import("@/lib/exportImage");
      downloadBlob(blob, fileNameFor(name, format));
      setSavedFormat(format);
      setTimeout(() => setSavedFormat(null), 2600);
    } catch (err) {
      onError(err instanceof Error ? err.message : "That download didn't work. Try again.");
    } finally {
      setBusy(null);
    }
  };

  const shareImage = async () => {
    setBusy("share");
    try {
      const blob = await makeBlob("png");
      const file = new File([blob], fileNameFor(name, "png"), { type: "image/png" });
      if (canShareFiles(file)) {
        await shareFile(file, caption);
      } else {
        const { downloadBlob } = await import("@/lib/exportImage");
        downloadBlob(blob, fileNameFor(name, "png"));
        onNotice(
          "Your browser can't attach images directly, so we saved your card. Attach it to your X post.",
        );
        toX();
      }
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return;
      onError("Sharing didn't go through. You can still save the card and post it manually.");
    } finally {
      setBusy(null);
    }
  };

  const toX = () => {
    const result = openX(caption);
    if (!result.ok) {
      onNotice("Your browser blocked the popup — use the direct link below to open X.");
    }
  };

  return (
    <div id="share" className="grain rounded-2xl border-4 border-goa-yellow bg-goa-deep p-5 sm:p-6">
      <h2 className="display-xl text-4xl leading-[0.86] text-goa-yellow sm:text-5xl">
        SHOW THE WORLD
        <br />
        <span className="text-goa-cream">YOUR GOA.</span>
      </h2>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="hh-btn hh-btn-primary"
          onClick={() => save("png")}
          disabled={busy === "png"}
        >
          {savedFormat === "png" ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          {savedFormat === "png" ? "Saved" : "Save my card (PNG)"}
        </button>
        <button
          type="button"
          className="hh-btn hh-btn-ghost"
          onClick={() => save("jpg")}
          disabled={busy === "jpg"}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {savedFormat === "jpg" ? "Saved" : "Download JPG"}
        </button>
        {fileShareSupported && (
          <button
            type="button"
            className="hh-btn hh-btn-pink"
            onClick={shareImage}
            disabled={busy === "share"}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share image
          </button>
        )}
        <button type="button" className="hh-btn hh-btn-pink" onClick={toX}>
          <XLogo className="h-4 w-4" aria-hidden="true" />
          Take it to X
        </button>
      </div>

      <label htmlFor="hh-caption" className="label-cond mt-6 block text-[0.6rem] text-goa-yellow">
        YOUR CAPTION
      </label>
      <textarea
        id="hh-caption"
        rows={4}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        onBlur={() => setCaption((c) => withHashtag(c))}
        className="mt-1 w-full rounded-lg border-2 border-goa-yellow/40 bg-goa-green px-3 py-3 font-body text-sm text-goa-cream focus:border-goa-yellow focus:outline-none"
      />
      <p className="mt-1 font-body text-xs text-goa-cream/70">
        #FrameInGoa is always added back before posting.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="hh-btn hh-btn-ghost px-4 py-2 text-[0.62rem]"
          onClick={async () => {
            const ok = await copyText(withHashtag(caption));
            if (!ok) {
              onError("Copying failed — select the caption and copy it manually.");
              return;
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
          }}
        >
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? "Copied ✓" : "Copy caption"}
        </button>
        <button type="button" className="hh-btn hh-btn-ghost px-4 py-2 text-[0.62rem]" onClick={onReset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Start over
        </button>
        <a
          href={intentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="label-cond text-[0.58rem] text-goa-cream/70 underline underline-offset-4 hover:text-goa-yellow"
        >
          Direct X link
        </a>
      </div>

      <p className="mt-4 font-body text-xs text-goa-cream/65">
        X can't attach a local image automatically from a web link. Save your card first, then attach
        it to the pre-filled post — on phones that support it, “Share image” posts the file directly.
      </p>
    </div>
  );
}
