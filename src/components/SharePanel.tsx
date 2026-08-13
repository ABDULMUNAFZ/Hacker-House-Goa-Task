import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Download, RotateCcw, Share2 } from "lucide-react";
import { XLogo } from "./HHIcons";
import { exportBlob, fileNameFor, downloadBlob } from "@/lib/exportImage";
import { Muxer, ArrayBufferTarget } from "mp4-muxer";
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
  webglCanvas?: HTMLCanvasElement | null;
  name: string;
  mode?: string;
  onRecordingChange?: (recording: boolean) => void;
  onError: (message: string) => void;
  onNotice: (message: string) => void;
  onReset: () => void;
};

export function SharePanel({
  getCanvas,
  webglCanvas,
  name,
  mode = "builder",
  onRecordingChange,
  onError,
  onNotice,
  onReset,
}: Props) {
  const [caption, setCaption] = useState(DEFAULT_CAPTION);
  const [copied, setCopied] = useState(false);
  const [savedFormat, setSavedFormat] = useState<"png" | "jpg" | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [fileShareSupported, setFileShareSupported] = useState(false);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [recordingMode, setRecordingMode] = useState<"download" | "share" | null>(null);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState<Blob | null>(null);
  const [recordedVideoName, setRecordedVideoName] = useState<string>("");

  useEffect(() => {
    setRecordedVideoBlob(null);
    setRecordedVideoName("");
  }, [name]);

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
      downloadBlob(blob, fileNameFor(name, format));
      setSavedFormat(format);
      setTimeout(() => setSavedFormat(null), 2600);
    } catch (err) {
      onError(err instanceof Error ? err.message : "That download didn't work. Try again.");
    } finally {
      setBusy(null);
    }
  };

  /** Save a video blob with proper filename — uses File System Access API for native Save dialog */
  const saveVideoBlob = async (blob: Blob, fileName: string) => {
    // Try the File System Access API first — gives a native Save dialog with correct filename
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'MP4 Video',
            accept: { 'video/mp4': ['.mp4'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        onNotice("3D Badge swing video saved successfully!");
        return;
      } catch (err) {
        // User cancelled the dialog — that's OK
        if ((err as DOMException)?.name === "AbortError") return;
        // Fall through to fallback
      }
    }
    
    // Fallback: create a hidden <a> with download attribute and click it
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    onNotice("3D Badge swing video downloaded!");
  };

  const recordVideo = async (action: "download" | "share") => {
    setRecordingVideo(true);
    setRecordingMode(action);
    onRecordingChange?.(true);
    
    // Wait 100ms for the recording overlay to mount before starting capture
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Use the passed webglCanvas reference directly, or fall back to DOM queries
    let activeCanvas: HTMLCanvasElement | null = webglCanvas || null;
    
    if (!activeCanvas) {
      // During recording, Lanyard3D wraps the canvas in a container with id="lanyard-recording-container-..."
      const isMobile = window.innerWidth < 1024;
      const containerId = isMobile
        ? "lanyard-recording-container-lanyard-3d-canvas-mobile"
        : "lanyard-recording-container-lanyard-3d-canvas-desktop";
      const container = document.getElementById(containerId);
      if (container) {
        activeCanvas = container.querySelector("canvas") as HTMLCanvasElement | null;
      }
      
      // Fallback: query by R3F Canvas id directly
      if (!activeCanvas) {
        const desktopCanvas = document.querySelector("#lanyard-3d-canvas-desktop canvas") as HTMLCanvasElement | null;
        const mobileCanvas = document.querySelector("#lanyard-3d-canvas-mobile canvas") as HTMLCanvasElement | null;
        if (desktopCanvas && desktopCanvas.clientWidth > 0) {
          activeCanvas = desktopCanvas;
        } else if (mobileCanvas && mobileCanvas.clientWidth > 0) {
          activeCanvas = mobileCanvas;
        }
      }
    }

    if (!activeCanvas) {
      onRecordingChange?.(false);
      setRecordingVideo(false);
      setRecordingMode(null);
      onError("3D viewport canvas could not be found. Please try again.");
      return;
    }

    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "builder";
      const fileName = `hh-goa-2026-${slug}.mp4`;

      // Create a temporary 2D canvas to copy WebGL frames. 
      // Capturing from a 2D canvas instead of a WebGL canvas completely bypasses Chrome's GPU H.264 encoder green-screen bug!
      const recorderCanvas = document.createElement("canvas");
      recorderCanvas.width = 1080;
      recorderCanvas.height = 1080;
      const recorderCtx = recorderCanvas.getContext("2d");
      if (!recorderCtx) {
        throw new Error("Failed to initialize 2D recording context.");
      }

      // Configure high-quality image smoothing for pristine WebGL downscaling/upscaling interpolation
      recorderCtx.imageSmoothingEnabled = true;
      recorderCtx.imageSmoothingQuality = "high";

      // Detect WebCodecs support for generating standard native H.264 MP4 container directly in Chrome/Brave/Safari
      const useWebCodecs = typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined";

      if (useWebCodecs) {
        // Initialize mp4-muxer with standard AVC/H.264 settings for universal QuickTime & iOS compatibility
        const muxer = new Muxer({
          target: new ArrayBufferTarget(),
          video: {
            codec: 'avc',
            width: 1080,
            height: 1080
          },
          fastStart: 'in-memory',
          firstTimestampBehavior: 'offset'
        });

        // Initialize Native VideoEncoder
        const videoEncoder = new VideoEncoder({
          output: (chunk, metadata) => muxer.addVideoChunk(chunk, metadata),
          error: (e) => {
            console.error("VideoEncoder error:", e);
          }
        });

        // Configure VideoEncoder settings
        videoEncoder.configure({
          codec: 'avc1.4d002a', // H.264 Main Profile
          width: 1080,
          height: 1080,
          bitrate: 6_000_000, // 6 Mbps for pristine details & fast download speeds
          framerate: 30
        });

        let active = true;
        let frameCount = 0;
        const frameDuration = 1000 / 30; // exactly 30fps
        const startTime = performance.now();

        const copyLoop = () => {
          if (!active) return;
          const now = performance.now();
          const elapsed = now - startTime;
          const targetFrameIndex = Math.floor(elapsed / frameDuration);

          if (targetFrameIndex > frameCount && activeCanvas) {
            recorderCtx.clearRect(0, 0, 1080, 1080);
            recorderCtx.drawImage(activeCanvas, 0, 0, 1080, 1080);

            // Construct and queue the VideoFrame for encoding using actual elapsed real-world time
            const timestampUs = Math.round(elapsed * 1000);
            const frame = new VideoFrame(recorderCanvas, { timestamp: timestampUs });
            const isKeyFrame = frameCount % 30 === 0;

            videoEncoder.encode(frame, { keyFrame: isKeyFrame });
            frame.close(); // immediately free native memory resources
            frameCount++;
          }

          if (elapsed < 6600) {
            requestAnimationFrame(copyLoop);
          } else {
            active = false;
            finalizeRecording();
          }
        };

        const finalizeRecording = async () => {
          onRecordingChange?.(false);
          setRecordingVideo(false);
          setRecordingMode(null);

          try {
            await videoEncoder.flush();
            videoEncoder.close();
            
            muxer.finalize();
            const { buffer } = muxer.target;
            const blob = new Blob([buffer], { type: "video/mp4" });
            const file = new File([blob], fileName, { type: "video/mp4" });

            setRecordedVideoBlob(blob);
            setRecordedVideoName(fileName);

            if (action === "share") {
              if (canShareFiles(file)) {
                try {
                  await shareFile(file, caption);
                  onNotice("3D Lanyard video shared successfully!");
                  return;
                } catch (err) {
                  if ((err as DOMException)?.name === "AbortError") return;
                }
              }
              await saveVideoBlob(blob, fileName);
              toX();
            } else {
              onNotice("3D Video is ready! Click 'Save Video (.MP4)' to download.");
            }
          } catch (err) {
            onError(err instanceof Error ? err.message : "Failed to compile MP4 video container.");
          }
        };

        copyLoop();
      } else {
        // Fallback: standard MediaRecorder loop for Firefox/old browsers
        let active = true;
        const copyLoop = () => {
          if (!active) return;
          if (activeCanvas) {
            recorderCtx.clearRect(0, 0, 1080, 1080);
            recorderCtx.drawImage(activeCanvas, 0, 0, 1080, 1080);
          }
          requestAnimationFrame(copyLoop);
        };
        copyLoop();

        const captureFn = recorderCanvas.captureStream || (recorderCanvas as any).webkitCaptureStream;
        if (!captureFn) {
          active = false;
          throw new Error("Your browser does not support canvas stream recording.");
        }
        
        const stream = captureFn.call(recorderCanvas, 30);
        let mimeType = "";
        const candidates = [
          'video/mp4;codecs="avc1.4D401F"',
          'video/mp4',
          'video/webm;codecs=vp9',
          'video/webm'
        ];

        for (const candidate of candidates) {
          if (MediaRecorder.isTypeSupported(candidate)) {
            mimeType = candidate;
            break;
          }
        }

        const options: any = {};
        if (mimeType) {
          options.mimeType = mimeType;
        }
        options.videoBitsPerSecond = 8_000_000;

        const chunks: BlobPart[] = [];
        const mediaRecorder = new MediaRecorder(stream, options);
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };
        
        mediaRecorder.onstop = async () => {
          active = false;
          if (chunks.length === 0) {
            onError("Recording produced no video data. Please keep the browser window active and visible while downloading.");
            return;
          }
          const blob = new Blob(chunks, { type: mimeType || "video/mp4" });
          const file = new File([blob], fileName, { type: mimeType || "video/mp4" });

          setRecordedVideoBlob(blob);
          setRecordedVideoName(fileName);

          if (action === "share") {
            if (canShareFiles(file)) {
              try {
                await shareFile(file, caption);
                onNotice("3D Lanyard video shared successfully!");
                return;
              } catch (err) {
                if ((err as DOMException)?.name === "AbortError") return;
              }
            }
            await saveVideoBlob(blob, fileName);
            toX();
          } else {
            onNotice("3D Video is ready! Click 'Save Video (.MP4)' to download.");
          }
        };

        mediaRecorder.start();
        
        setTimeout(() => {
          mediaRecorder.stop();
          onRecordingChange?.(false);
          setRecordingVideo(false);
          setRecordingMode(null);
        }, 6600);
      }
    } catch (err) {
      onRecordingChange?.(false);
      setRecordingVideo(false);
      setRecordingMode(null);
      onError(err instanceof Error ? err.message : "Failed to record WebGL lanyard video.");
    } finally {
      setBusy(null);
    }
  };

  const toX = () => {
    openX(caption);
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
          disabled={busy === "png" || recordingVideo}
        >
          <span className="relative z-10 flex items-center gap-2">
            {savedFormat === "png" ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Download className="h-4 w-4" aria-hidden="true" />
            )}
            {savedFormat === "png" ? "Saved" : "Save my card (PNG)"}
          </span>
        </button>
        <button
          type="button"
          className="hh-btn hh-btn-ghost"
          onClick={() => save("jpg")}
          disabled={busy === "jpg" || recordingVideo}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Download className="h-4 w-4" aria-hidden="true" />
            {savedFormat === "jpg" ? "Saved" : "Download JPG"}
          </span>
        </button>
        
        {mode === "builder" && webglCanvas && (
          <>
            {recordedVideoBlob ? (
              <button
                type="button"
                className="hh-btn hh-btn-primary"
                onClick={() => {
                  saveVideoBlob(recordedVideoBlob, recordedVideoName);
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Check className="h-4 w-4 text-goa-yellow" aria-hidden="true" />
                  Save Video (.MP4)
                </span>
              </button>
            ) : (
              <button
                type="button"
                className="hh-btn hh-btn-pink"
                onClick={() => recordVideo("download")}
                disabled={recordingVideo}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Download className={`h-4 w-4 ${recordingVideo && recordingMode === "download" ? "animate-pulse text-goa-yellow" : ""}`} aria-hidden="true" />
                  {recordingVideo && recordingMode === "download" ? "Recording..." : "Download Video (MP4)"}
                </span>
              </button>
            )}
            <button
              type="button"
              className="hh-btn hh-btn-pink"
              onClick={() => recordVideo("share")}
              disabled={recordingVideo}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Share2 className={`h-4 w-4 ${recordingVideo && recordingMode === "share" ? "animate-pulse text-goa-yellow" : ""}`} aria-hidden="true" />
                {recordingVideo && recordingMode === "share" ? "Sharing..." : "Share Video"}
              </span>
            </button>
          </>
        )}

        {mode === "pfp" && fileShareSupported && (
          <button
            type="button"
            className="hh-btn hh-btn-pink"
            onClick={async () => {
              setBusy("share");
              try {
                const blob = await makeBlob("png");
                const file = new File([blob], fileNameFor(name, "png"), { type: "image/png" });
                if (canShareFiles(file)) {
                  await shareFile(file, caption);
                } else {
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
            }}
            disabled={busy === "share" || recordingVideo}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share PFP
            </span>
          </button>
        )}

        <button type="button" className="hh-btn hh-btn-pink" onClick={toX} disabled={recordingVideo}>
          <span className="relative z-10 flex items-center gap-2">
            <XLogo className="h-4 w-4" aria-hidden="true" />
            Take it to X
          </span>
        </button>
      </div>

      <label htmlFor="hh-caption" className="label-cond mt-6 block text-xs sm:text-sm text-goa-yellow font-semibold tracking-wider">
        YOUR CAPTION
      </label>
      <textarea
        id="hh-caption"
        rows={4}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        onBlur={() => setCaption((c) => withHashtag(c))}
        className="mt-1 w-full rounded-lg border-2 border-goa-yellow/40 bg-goa-green px-3 py-3 font-body text-base text-goa-cream focus:border-goa-yellow focus:outline-none"
      />
      <p className="mt-1 font-body text-sm sm:text-base text-goa-cream/70">
        #FrameInGoa is always added back before posting.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="hh-btn hh-btn-ghost px-4 py-2 text-xs sm:text-sm"
          onClick={async () => {
            const ok = await copyText(withHashtag(caption));
            if (!ok) {
              onError("Copying failed — select the caption and copy it manually.");
              return;
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
          }}
          disabled={recordingVideo}
        >
          <span className="relative z-10 flex items-center gap-2">
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? "Copied ✓" : "Copy caption"}
          </span>
        </button>
        <button type="button" className="hh-btn hh-btn-ghost px-4 py-2 text-xs sm:text-sm" onClick={onReset} disabled={recordingVideo}>
          <span className="relative z-10 flex items-center gap-2">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Start over
          </span>
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
