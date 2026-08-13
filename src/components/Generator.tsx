import { useCallback, useEffect, useMemo, useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import { UploadZone } from "./UploadZone";
import ScrambledText from "./ScrambledText";
import { CameraCapture } from "./CameraCapture";
import { PhotoEditor } from "./PhotoEditor";
import { FormatSelector } from "./FormatSelector";
import { BuilderForm } from "./BuilderForm";
import { CardCanvas, type CardImage } from "./CardCanvas";
import { SharePanel } from "./SharePanel";
import { rollTitle } from "@/data/titles";
import type { ThemeId } from "@/data/themes";
import { ImageError, loadImageFile, normalizeImage } from "@/lib/imageProcessing";
import { sizeFor, type CardData, type PhotoTransform } from "@/lib/renderCard";

const Lanyard3D = lazy(() => import("./Lanyard3D"));

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
  
  // Dynamic Canvas references for live 3D texturing
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const [webglCanvas, setWebglCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Roll the first title on the client only
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
        toast.success("Photo loaded! Watch it update live in 3D.");
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
    document.getElementById("create")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const frame = sizeFor(mode);

  return (
    <section id="create" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 relative z-20 pointer-events-none">
      <div className="flex flex-col items-start gap-2 pointer-events-auto">
        <h2 className="display-xl text-5xl text-goa-ink sm:text-7xl leading-[0.9]">
          <ScrambledText radius={150} duration={1.5} scrambleChars="HHGOA">
            BUILD YOUR
          </ScrambledText>
          <br />
          <ScrambledText radius={150} duration={1.5} scrambleChars="HHGOA" className="text-goa-pink">
            GOA IDENTITY.
          </ScrambledText>
        </h2>
        <p className="label-cond text-[0.68rem] text-goa-ink/75 tracking-[0.2em] font-semibold mt-2">
          NO LOGIN. NO SIGNUP. EVERYTHING HAPPENS IN YOUR BROWSER.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_minmax(320px,460px)] lg:items-start">
        {/* Left Side: Creation Controls */}
        <div className="relative z-30 space-y-6 pointer-events-auto bg-goa-deep border-4 border-goa-ink rounded-3xl p-6 sm:p-8 shadow-xl">
          {!image ? (
            <UploadZone onFile={handleFile} onSelfie={() => setCameraOpen(true)} busy={loading} />
          ) : (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-goa-yellow/40 bg-goa-deep/70 p-3">
              <span className="label-cond text-xs sm:text-sm text-goa-yellow font-semibold tracking-wider">PHOTO LOADED</span>
              <button
                type="button"
                className="hh-btn hh-btn-ghost px-4 py-2 text-xs sm:text-sm"
                onClick={() => {
                  setImage(null);
                  setImageSize(null);
                }}
              >
                Change photo
              </button>
              <button
                type="button"
                className="hh-btn hh-btn-ghost px-4 py-2 text-xs sm:text-sm"
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
        </div>

        {/* Right Side: Layout Spacing Placeholder */}
        <div className="lg:sticky lg:top-24 space-y-4 pointer-events-none relative z-30">
          {/* On mobile, we render Lanyard3D inline right here. On desktop, Lanyard3D renders in the absolute background of this section, and this slot is just a spacer to prevent layout overlap */}
          <div className="lg:h-[420px] w-full pointer-events-none">
            <div className="hidden lg:block lg:h-[420px]" />
            <div className="block lg:hidden pointer-events-auto">
              <Suspense fallback={<div className="relative w-full h-[450px] flex justify-center items-center bg-goa-deep/10 rounded-2xl border border-goa-yellow/10" />}>
                <Lanyard3D
                  id="lanyard-3d-canvas-mobile"
                  canvas={canvasElement}
                  onWebGLCanvas={setWebglCanvas}
                  theme={theme}
                  mode={mode}
                  isRecording={isRecording}
                />
              </Suspense>
            </div>
          </div>
          
          <div className="pointer-events-auto">
            {image ? (
              <SharePanel
                getCanvas={() => canvasElement}
                webglCanvas={webglCanvas}
                name={name}
                mode={mode}
                onRecordingChange={setIsRecording}
                onError={(m) => toast.error(m)}
                onNotice={(m) => toast(m)}
                onReset={reset}
              />
            ) : (
              <div className="rounded-2xl border border-[#05331c]/20 bg-white/60 p-5 text-center shadow-md">
                <p className="font-body text-xs text-[#05331c]/70">
                  Upload a photo on the left to view your card in 3D and unlock downloads!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* On desktop, we render the Lanyard3D absolute inside this relative container so it hangs from the top edge of the section and can be dragged anywhere inside it */}
      <div className="hidden lg:block">
        <Suspense fallback={null}>
          <Lanyard3D
            id="lanyard-3d-canvas-desktop"
            canvas={canvasElement}
            onWebGLCanvas={setWebglCanvas}
            theme={theme}
            mode={mode}
            isRecording={isRecording}
          />
        </Suspense>
      </div>

      {/* Hidden 2D card canvas used to drive the 3D lanyard texture atlas in real-time */}
      <div className="absolute pointer-events-none opacity-0 -z-50" style={{ left: "-9999px", top: "-9999px" }}>
        <CardCanvas
          data={data}
          image={image}
          transform={transform}
          onCanvas={setCanvasElement}
          onError={(m) => toast.error(m)}
        />
      </div>

      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleFile}
        onError={(m) => toast.error(m)}
      />
    </section>
  );
}
