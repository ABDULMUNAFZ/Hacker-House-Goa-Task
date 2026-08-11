import { useCallback, useRef, useState } from "react";
import { Camera, ImagePlus, Upload } from "lucide-react";
import { ACCEPTED } from "@/lib/imageProcessing";

type Props = {
  onFile: (file: File) => void;
  onSelfie: () => void;
  busy?: boolean;
};

export function UploadZone({ onFile, onSelfie, busy }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const pick = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          pick(e.dataTransfer.files);
        }}
        className={`grain relative flex flex-col items-center justify-center rounded-2xl border-4 border-dashed p-8 text-center transition-all duration-200 sm:p-12 ${
          over
            ? "scale-[1.01] border-goa-yellow bg-goa-deep"
            : "border-goa-yellow/45 bg-goa-deep/60 hover:border-goa-yellow"
        }`}
      >
        <ImagePlus className="h-10 w-10 text-goa-yellow" aria-hidden="true" />
        <p className="display-xl mt-4 text-3xl text-goa-yellow sm:text-4xl">DROP YOUR SELFIE</p>
        <p className="mt-2 max-w-sm font-body text-sm text-goa-cream/80">
          JPG, PNG, WEBP or HEIC. Your photo is processed locally in your browser whenever possible.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="hh-btn hh-btn-primary"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Choose your photo
          </button>
          <button type="button" className="hh-btn hh-btn-pink" disabled={busy} onClick={onSelfie}>
            <Camera className="h-4 w-4" aria-hidden="true" />
            Take a selfie
          </button>
        </div>

        <button
          type="button"
          className="label-cond mt-4 text-[0.6rem] text-goa-cream/70 underline underline-offset-4 hover:text-goa-yellow"
          onClick={() => cameraRef.current?.click()}
        >
          Or use your phone camera app
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="sr-only"
          aria-label="Upload your photo"
          onChange={(e) => {
            pick(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif"
          capture="user"
          className="sr-only"
          aria-label="Take a photo with your camera"
          onChange={(e) => {
            pick(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
