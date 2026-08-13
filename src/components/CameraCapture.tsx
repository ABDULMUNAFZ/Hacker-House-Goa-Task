import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  onError: (message: string) => void;
};

export function CameraCapture({ open, onClose, onCapture, onError }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        onError("This browser can't open the camera. Upload a photo instead.");
        onClose();
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
        setReady(true);
      } catch {
        onError("Camera access was blocked. No problem — upload a photo instead.");
        onClose();
      }
    };
    void start();

    return () => {
      cancelled = true;
      setReady(false);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open, onClose, onError]);

  if (!open) return null;

  const shoot = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      onError("We couldn't capture that shot. Try uploading a photo.");
      return;
    }
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          onError("We couldn't capture that shot. Try uploading a photo.");
          return;
        }
        onCapture(new File([blob], "hh-goa-selfie.jpg", { type: "image/jpeg" }));
        onClose();
      },
      "image/jpeg",
      0.94,
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Take a selfie"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-goa-black/80 p-4 pointer-events-auto"
    >
      <div className="grain w-full max-w-md rounded-2xl border-4 border-goa-yellow bg-goa-deep p-4">
        <div className="flex items-center justify-between">
          <p className="label-cond text-xs text-goa-yellow">TAKE A SELFIE</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close camera"
            className="rounded-full p-2 text-goa-cream hover:text-goa-yellow"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3 overflow-hidden rounded-xl border-2 border-goa-cream/40 bg-goa-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className="aspect-square w-full scale-x-[-1] object-cover"
          />
        </div>
        <button
          type="button"
          onClick={shoot}
          disabled={!ready}
          className="hh-btn hh-btn-primary mt-4 w-full"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
          Capture
        </button>
      </div>
    </div>
  );
}
