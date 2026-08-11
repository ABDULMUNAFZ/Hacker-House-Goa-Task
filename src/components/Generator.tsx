import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { UploadZone } from "./UploadZone";
import { CameraCapture } from "./CameraCapture";
import { PhotoEditor } from "./PhotoEditor";
import { FormatSelector } from "./FormatSelector";
import { BuilderForm } from "./BuilderForm";
import { CardCanvas, type CardImage } from "./CardCanvas";
import { Lanyard } from "./Lanyard";
import { SharePanel } from "./SharePanel";
import { rollTitle } from "@/data/titles";
import type { ThemeId } from "@/data/themes";
import { ImageError, loadImageFile, normalizeImage } from "@/lib/imageProcessing";
import { sizeFor, type CardData, type PhotoTransform } from "@/lib/renderCard";

const GEN_STEPS = ["PHOTO", "TYPE", "DESIGN", "GOA"];

export function Generator() {
  const [mode, setMode] = useState<"pfp" | "builder">("builder");
  const [theme, setTheme] = useState<ThemeId>("sunset");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [vibe, setVibe] = useState("");
  const [title, setTitle] = useState("GOA CODE SURFER");
  const [image, setImage] = useState<CardImage>(null);
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [transform, setTransform] = useState<PhotoTransform>({ zoom: 1, x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [replayKey, setReplayKey] = useState("0");

  const previewCanvas = useRef<HTMLCanvasElement | null>(null);
  const finalCanvas = useRef<HTMLCanvasElement | null>(null);

  // Roll the first title on the client only (keeps SSR markup stable).
  useEffect(() => setTitle(rollTitle()), []);

  useEffect(() => () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const data: CardData = useMemo(
    () => ({ mode, theme, name, role, vibe, title }),
    [mode, theme, name, role, vibe, title],
  );

  const handleFile = useCallback(
    async (file: File) => {
      setLoading(true);
      try {
        const { img, url } = await loadImageFile(file);
        setObjectUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        const normalized = normalizeImage(img);
        setImage(normalized as CardImage);
        setImageSize({ w: normalized.width, h: normalized.height });
        setTransform({ zoom: 1, x: 0, y: 0 });
        setGenerated(false);
        toast.success("Photo loaded. Position it however you like.");
      } catch (err) {
        toast.error(
          err instanceof ImageError
            ? err.message
            : "We couldn't read that photo. Try a JPG or PNG instead.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const generate = async () => {
    if (!image) {
      toast.error("Add a photo first — then we'll make it Goa.");
      return;
    }
    setGenerating(true);
    setGenStep(0);
    for (let i = 0; i < GEN_STEPS.length; i++) {
      setGenStep(i);
      await new Promise((r) => setTimeout(r, 180));
    }
    setGenerating(false);
    setGenerated(true);
    setReplayKey(String(Date.now()));
    requestAnimationFrame(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const reset = () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(null);
    setImage(null);
    setImageSize(null);
    setTransform({ zoom: 1, x: 0, y: 0 });
    setName("");
    setRole("");
    setVibe("");
    setTitle(rollTitle());
    setGenerated(false);
    finalCanvas.current = null;
    document.getElementById("create")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const frame = sizeFor(mode);

  return (
    <section id="create" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="display-xl text-5xl text-goa-yellow sm:text-7xl">
          BUILD YOUR
          <br />
          <span className="text-goa-cream">GOA IDENTITY.</span>
        </h2>
        <p className="label-cond max-w-xs text-[0.6rem] text-goa-cream/75">
          NO LOGIN. NO SIGNUP. EVERYTHING HAPPENS IN YOUR BROWSER.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_minmax(320px,460px)] lg:items-start">
        <div className="space-y-6">
          {!image ? (
            <UploadZone onFile={handleFile} onSelfie={() => setCameraOpen(true)} busy={loading} />
          ) : (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-goa-yellow/40 bg-goa-deep/70 p-3">
              <span className="label-cond text-[0.58rem] text-goa-yellow">PHOTO LOADED</span>
              <button
                type="button"
                className="hh-btn hh-btn-ghost px-4 py-2 text-[0.6rem]"
                onClick={() => {
                  setImage(null);
                  setImageSize(null);
                  setGenerated(false);
                }}
              >
                Change photo
              </button>
              <button
                type="button"
                className="hh-btn hh-btn-ghost px-4 py-2 text-[0.6rem]"
                onClick={() => setCameraOpen(true)}
              >
                Retake selfie
              </button>
            </div>
          )}

          <FormatSelector mode={mode} onMode={setMode} theme={theme} onTheme={setTheme} />

          {image && (
            <PhotoEditor
              transform={transform}
              onChange={setTransform}
              imageSize={imageSize}
              frame={frame}
            />
          )}

          <BuilderForm
            name={name}
            role={role}
            vibe={vibe}
            title={title}
            onName={setName}
            onRole={setRole}
            onVibe={setVibe}
            onRoll={() => setTitle((t) => rollTitle(t))}
          />

          <button type="button" className="hh-btn hh-btn-pink w-full text-sm" onClick={generate}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {generated ? "Rebuild my card" : "Make it Goa"}
          </button>
        </div>

        <div className="lg:sticky lg:top-24">
          <p className="label-cond text-[0.58rem] text-goa-yellow">LIVE PREVIEW</p>
          <div className="mt-2 rounded-2xl border-4 border-goa-yellow/50 bg-goa-deep p-2">
            <CardCanvas
              data={data}
              image={image}
              transform={transform}
              interactive
              onTransformChange={setTransform}
              onCanvas={(c) => (previewCanvas.current = c)}
              onError={(m) => toast.error(m)}
              className="w-full cursor-grab rounded-lg active:cursor-grabbing"
            />
          </div>
          <p className="mt-2 font-body text-xs text-goa-cream/65">
            This is exactly what gets exported — {frame.w} × {frame.h}px, no website UI.
          </p>
        </div>
      </div>

      {generating && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-goa-deep/95 px-6"
        >
          <p className="display-xl text-4xl text-goa-yellow sm:text-6xl">BUILDING YOUR GOA ID…</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {GEN_STEPS.map((s, i) => (
              <span
                key={s}
                className={`label-cond text-sm transition-colors ${
                  i <= genStep ? "text-goa-pink" : "text-goa-cream/35"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {generated && (
        <div id="result" className="mt-16 scroll-mt-24">
          <p className="display-xl text-center text-4xl text-goa-yellow sm:text-6xl">
            YOUR GOA ID IS READY.
          </p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(300px,460px)_1fr] lg:items-start">
            <Lanyard replayKey={replayKey}>
              <CardCanvas
                data={data}
                image={image}
                transform={transform}
                onCanvas={(c) => (finalCanvas.current = c)}
                onError={(m) => toast.error(m)}
                className="w-full rounded-[10px]"
              />
            </Lanyard>
            <SharePanel
              getCanvas={() => finalCanvas.current ?? previewCanvas.current}
              name={name}
              onError={(m) => toast.error(m)}
              onNotice={(m) => toast(m)}
              onReset={reset}
            />
          </div>
        </div>
      )}

      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleFile}
        onError={(m) => toast.error(m)}
      />
    </section>
  );
}
