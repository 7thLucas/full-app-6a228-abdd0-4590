// ───────────────────────────────────────────────────────────────────────────
// Core pixel-art renderer for Hangul Roads. Every piece of world art is built
// from a low-resolution grid of colored cells, then drawn to a <canvas> and
// scaled up with nearest-neighbor (image-rendering: pixelated) so the result is
// crisp, blocky, HD-2D pixel art — never smooth gradients or vector shapes.
//
// A "PixelGrid" is an array of rows; each row is a string where every character
// is a single cell keyed into a palette. Space (or ".") = transparent.
// ───────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";

export type Palette = Record<string, string>;

export interface PixelGrid {
  rows: string[];
  palette: Palette;
}

interface PixelArtProps {
  grid: PixelGrid;
  /** rendered pixel size of each cell (device px). */
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
  /** optional css filter (glow etc.) */
  filter?: string;
  flip?: boolean;
}

// Draw a PixelGrid into a canvas at 1px/cell then upscale via CSS for crispness.
export function PixelArt({ grid, scale = 4, className, style, filter, flip }: PixelArtProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const w = gridWidth(grid);
  const h = grid.rows.length;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    drawGridToCtx(ctx, grid);
  }, [grid, w, h]);

  return (
    <canvas
      ref={ref}
      width={w}
      height={h}
      className={className}
      style={{
        width: w * scale,
        height: h * scale,
        imageRendering: "pixelated",
        display: "block",
        transform: flip ? "scaleX(-1)" : undefined,
        filter,
        ...style,
      }}
      aria-hidden
    />
  );
}

export function gridWidth(grid: PixelGrid): number {
  return grid.rows.reduce((m, r) => Math.max(m, r.length), 0);
}

// Paint a single grid onto a 2d context at 1 unit = 1 cell (no scaling).
export function drawGridToCtx(ctx: CanvasRenderingContext2D, grid: PixelGrid, ox = 0, oy = 0) {
  const { rows, palette } = grid;
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === " " || ch === ".") continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(ox + x, oy + y, 1, 1);
    }
  }
}

// Deterministic pseudo-random so generated scenery is stable across renders.
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
