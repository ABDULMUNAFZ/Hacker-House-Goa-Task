import { useCallback, useEffect, useRef } from "react";
import { renderCard, sizeFor, type CardData, type PhotoTransform } from "@/lib/renderCard";

export type CardImage = (CanvasImageSource & { width: number; height: number }) | null;

type Props = {
  data: CardData;
  image: CardImage;
  transform: PhotoTransform;
  className?: string;
  interactive?: boolean;
  onTransformChange?: (t: PhotoTransform) => void;
  onCanvas?: (canvas: HTMLCanvasElement) => void;
  onError?: (message: string) => void;
};

export function CardCanvas({
  data,
  image,
  transform,
  className,
  interactive = false,
  onTransformChange,
  onCanvas,
  onError,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);
  const points = useRef(new Map<number, { x: number; y: number }>());
  const size = sizeFor(data.mode);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      renderCard(canvas, image, data, transform);
      onCanvas?.(canvas);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "We couldn't draw your card.");
    }
  }, [data, image, transform, onCanvas, onError]);

  useEffect(() => {
    paint();
    let cancelled = false;
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        if (!cancelled) paint();
      });
    }
    return () => {
      cancelled = true;
    };
  }, [paint]);

  const clamp = (t: PhotoTransform): PhotoTransform => ({
    zoom: Math.min(4, Math.max(0.2, t.zoom)),
    x: Math.min(1, Math.max(-1, t.x)),
    y: Math.min(1, Math.max(-1, t.y)),
  });

  const handlers = interactive
    ? {
        onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => {
          if (!image) return;
          (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
          points.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (points.current.size === 1) drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
          if (points.current.size === 2) {
            const [a, b] = [...points.current.values()];
            pinch.current = { dist: Math.hypot(a!.x - b!.x, a!.y - b!.y), zoom: transform.zoom };
          }
        },
        onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => {
          if (!image || !points.current.has(e.pointerId)) return;
          points.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          const rect = e.currentTarget.getBoundingClientRect();
          if (points.current.size >= 2 && pinch.current) {
            const [a, b] = [...points.current.values()];
            const dist = Math.hypot(a!.x - b!.x, a!.y - b!.y);
            onTransformChange?.(
              clamp({ ...transform, zoom: (pinch.current.zoom * dist) / pinch.current.dist }),
            );
            return;
          }
          if (drag.current && drag.current.id === e.pointerId) {
            const dx = (e.clientX - drag.current.x) / rect.width;
            const dy = (e.clientY - drag.current.y) / rect.height;
            drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
            onTransformChange?.(clamp({ ...transform, x: transform.x + dx, y: transform.y + dy }));
          }
        },
        onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => {
          points.current.delete(e.pointerId);
          if (points.current.size < 2) pinch.current = null;
          if (points.current.size === 0) drag.current = null;
        },
        onPointerCancel: () => {
          points.current.clear();
          drag.current = null;
          pinch.current = null;
        },
        onWheel: (e: React.WheelEvent<HTMLCanvasElement>) => {
          if (!image) return;
          onTransformChange?.(clamp({ ...transform, zoom: transform.zoom * (e.deltaY > 0 ? 0.94 : 1.06) }));
        },
      }
    : {};

  return (
    <canvas
      ref={canvasRef}
      width={size.w}
      height={size.h}
      className={className}
      style={{ touchAction: interactive ? "none" : undefined, aspectRatio: `${size.w} / ${size.h}` }}
      role="img"
      aria-label={`HH Goa 2026 ${data.mode === "pfp" ? "profile frame" : "builder card"} preview for ${
        data.name || "your name"
      }`}
      {...handlers}
    />
  );
}
