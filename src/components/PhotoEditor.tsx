import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import type { PhotoTransform } from "@/lib/renderCard";

type Props = {
  transform: PhotoTransform;
  onChange: (t: PhotoTransform) => void;
  imageSize: { w: number; h: number } | null;
  frame: { w: number; h: number };
};

export function PhotoEditor({ transform, onChange, imageSize, frame }: Props) {
  const set = (patch: Partial<PhotoTransform>) => onChange({ ...transform, ...patch });
  const clampZoom = (z: number) => Math.min(4, Math.max(0.2, z));

  const fitZoom = () => {
    if (!imageSize) return 1;
    const cover = Math.max(frame.w / imageSize.w, frame.h / imageSize.h);
    const contain = Math.min(frame.w / imageSize.w, frame.h / imageSize.h);
    return contain / cover;
  };

  return (
    <div className="rounded-xl border-2 border-goa-yellow/40 bg-goa-deep/70 p-4">
      <p className="label-cond text-[0.6rem] text-goa-yellow">POSITION YOUR PHOTO</p>
      <p className="mt-1 font-body text-xs text-goa-cream/75">
        Drag on the card to move. Pinch or scroll to zoom. Nothing gets stretched.
      </p>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          aria-label="Zoom out"
          className="rounded-full border-2 border-goa-yellow/60 p-2 text-goa-yellow"
          onClick={() => set({ zoom: clampZoom(transform.zoom - 0.1) })}
        >
          <ZoomOut className="h-4 w-4" aria-hidden="true" />
        </button>
        <input
          type="range"
          min={0.2}
          max={4}
          step={0.01}
          value={transform.zoom}
          aria-label="Zoom level"
          onChange={(e) => set({ zoom: clampZoom(Number(e.target.value)) })}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-goa-cream/25 accent-[oklch(0.62_0.28_3.5)]"
        />
        <button
          type="button"
          aria-label="Zoom in"
          className="rounded-full border-2 border-goa-yellow/60 p-2 text-goa-yellow"
          onClick={() => set({ zoom: clampZoom(transform.zoom + 0.1) })}
        >
          <ZoomIn className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="hh-btn hh-btn-ghost px-4 py-2 text-[0.62rem]"
          onClick={() => onChange({ zoom: 1, x: 0, y: 0 })}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </button>
        <button
          type="button"
          className="hh-btn hh-btn-ghost px-4 py-2 text-[0.62rem]"
          onClick={() => onChange({ zoom: fitZoom(), x: 0, y: 0 })}
        >
          <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
          Fit
        </button>
        <button
          type="button"
          className="hh-btn hh-btn-ghost px-4 py-2 text-[0.62rem]"
          onClick={() => onChange({ zoom: 1, x: 0, y: 0 })}
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          Fill
        </button>
      </div>
    </div>
  );
}
