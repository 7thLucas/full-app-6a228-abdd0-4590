// ───────────────────────────────────────────────────────────────────────────
// Receding ground-plane painter for the 2.5D diorama. Draws an organic pixel
// floor that gets DARKER + denser toward the front (near camera) and lighter /
// hazier toward the back (depth), with a soft perspective curve and NO grid.
// The plane is painted once per area into an offscreen canvas the size of the
// world floor, then positioned by HD2DWorld.
// ───────────────────────────────────────────────────────────────────────────

import { rng } from "./pixelArt";
import type { AreaTheme } from "../../data/gameData";

type Ctx = CanvasRenderingContext2D;

interface Palette {
  far: string;
  mid: string;
  near: string;
  speck1: string;
  speck2: string;
  edge: string; // subtle path-edge tint
}

const THEMES: Record<AreaTheme, Palette> = {
  shrine: {
    far: "#7d8aa2",
    mid: "#8f8466",
    near: "#6a5c42",
    speck1: "#9a8a64",
    speck2: "#574a36",
    edge: "#b9c6e0",
  },
  village: {
    far: "#7a7268",
    mid: "#6b5c48",
    near: "#4a3d2c",
    speck1: "#7a6a4e",
    speck2: "#3a3022",
    edge: "#d8b25a",
  },
  gate: {
    far: "#2c2548",
    mid: "#211a38",
    near: "#140e26",
    speck1: "#352a58",
    speck2: "#0d0820",
    edge: "#7a5ad0",
  },
};

function lerpColor(a: string, b: string, t: number): string {
  const pa = hex(a);
  const pb = hex(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function hex(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Paint a w×h floor where y=0 is the FAR edge (depth) and y=h is the NEAR edge.
export function paintGroundPlane(ctx: Ctx, w: number, h: number, theme: AreaTheme) {
  const pal = THEMES[theme];
  const r = rng(theme === "shrine" ? 11 : theme === "village" ? 22 : 33);

  // vertical gradient far→near, banded for a pixel look
  const bands = Math.max(8, Math.floor(h / 6));
  for (let i = 0; i < bands; i++) {
    const t0 = i / bands;
    const y0 = Math.floor(t0 * h);
    const y1 = Math.floor(((i + 1) / bands) * h);
    const col = t0 < 0.5 ? lerpColor(pal.far, pal.mid, t0 * 2) : lerpColor(pal.mid, pal.near, (t0 - 0.5) * 2);
    ctx.fillStyle = col;
    ctx.fillRect(0, y0, w, y1 - y0);
  }

  // organic speckle — denser + bigger toward the near edge (fakes detail falloff)
  const count = Math.floor(w * h * 0.012);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(r() * w);
    const y = Math.floor(r() * h);
    const depthT = y / h; // 0 far .. 1 near
    if (r() > 0.25 + depthT * 0.5) continue;
    const sz = depthT > 0.6 ? 2 : 1;
    ctx.fillStyle = r() > 0.5 ? pal.speck1 : pal.speck2;
    ctx.fillRect(x, y, sz, sz);
  }

  // soft curved path-edge highlights that converge toward the back (perspective)
  ctx.globalAlpha = 0.22;
  for (let side = 0; side < 2; side++) {
    for (let y = 0; y < h; y++) {
      const depthT = y / h;
      // edges spread apart near camera, converge far → fake vanishing point
      const spread = 0.16 + depthT * 0.30;
      const ex = side === 0 ? w * (0.5 - spread) : w * (0.5 + spread);
      ctx.fillStyle = pal.edge;
      ctx.fillRect(Math.round(ex), y, 2, 1);
    }
  }
  ctx.globalAlpha = 1;

  // near-edge shadow lip (grounds the front of the diorama)
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.fillRect(0, Math.floor(h * 0.92), w, Math.ceil(h * 0.08));
}
