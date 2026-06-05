import { useEffect, useRef } from "react";

// ───────────────────────────────────────────────────────────────────────────
// Component 3 of 15 — ParallaxPixelLayer
// A single parallax plane whose pixel art is painted to an offscreen-resolution
// canvas (low-res) and scaled up nearest-neighbor. Scrolls at `factor` relative
// to the camera. Used for far/deep/mid background planes.
// ───────────────────────────────────────────────────────────────────────────

interface ParallaxPixelLayerProps {
  /** paints the strip at the given low-res dimensions. */
  paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  /** low-res pixel width of the strip (should exceed viewport/scale). */
  pxWidth: number;
  pxHeight: number;
  /** rendered scale (px per pixel cell). */
  scale: number;
  camX: number;
  factor: number;
  zIndex: number;
  /** vertical placement: top offset as fraction of parent height. */
  topFrac?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxPixelLayer({
  paint,
  pxWidth,
  pxHeight,
  scale,
  camX,
  factor,
  zIndex,
  topFrac = 0,
  className,
  style,
}: ParallaxPixelLayerProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, pxWidth, pxHeight);
    paint(ctx, pxWidth, pxHeight);
  }, [paint, pxWidth, pxHeight]);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        top: `${topFrac * 100}%`,
        transform: `translate3d(${-camX * factor}px,0,0)`,
        willChange: "transform",
        zIndex,
        ...style,
      }}
    >
      <canvas
        ref={ref}
        width={pxWidth}
        height={pxHeight}
        style={{
          width: pxWidth * scale,
          height: pxHeight * scale,
          imageRendering: "pixelated",
          display: "block",
        }}
        aria-hidden
      />
    </div>
  );
}
