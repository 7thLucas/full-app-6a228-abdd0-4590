// ───────────────────────────────────────────────────────────────────────────
// Receding ground-plane painter for the 2.5D diorama.
//
// CRITICAL: the floor is NOT a uniform mat. It paints OFF-ROAD terrain (grass /
// dark field) across the whole world, then CARVES the hand-authored walkable
// road polygons on top as a lit stone/cobble surface with curb edges. This is
// what makes the road visibly guide the player — off-road reads as terrain you
// cannot walk on, with no debug outlines.
//
// The canvas is world-sized: pixel x = worldX / SCALE, and pixel y maps depth
// depthNear (top) → depthFar (bottom) compressed by DEPTH_SCALE. The painter is
// handed a mapper so polygon world points land exactly under the projected
// entities.
// ───────────────────────────────────────────────────────────────────────────

import { rng } from "./pixelArt";
import type { Polygon } from "../../engine/projection";
import type { RoadStyle } from "../../data/world2d";

type Ctx = CanvasRenderingContext2D;

function hex(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lerpColor(a: string, b: string, t: number): string {
  const pa = hex(a);
  const pb = hex(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

export interface GroundPaintArgs {
  ctx: Ctx;
  /** canvas pixel size. */
  pxW: number;
  pxH: number;
  road: RoadStyle;
  walkable: Polygon[];
  /** maps a world point to canvas pixel coords. */
  toPx: (worldX: number, worldY: number) => { x: number; y: number };
  seed: number;
}

// Build a Path2D from a walkable polygon in canvas pixel space.
function polyPath(poly: Polygon, toPx: GroundPaintArgs["toPx"]): Path2D {
  const p = new Path2D();
  poly.forEach((pt, i) => {
    const c = toPx(pt.x, pt.y);
    if (i === 0) p.moveTo(c.x, c.y);
    else p.lineTo(c.x, c.y);
  });
  p.closePath();
  return p;
}

export function paintGround(args: GroundPaintArgs) {
  const { ctx, pxW, pxH, road, walkable, toPx, seed } = args;
  const r = rng(seed);
  ctx.clearRect(0, 0, pxW, pxH);

  // ── 1. OFF-ROAD terrain across the whole plane (far→near banded) ──────────
  const bands = Math.max(10, Math.floor(pxH / 5));
  for (let i = 0; i < bands; i++) {
    const t = i / bands; // 0 far .. 1 near
    const y0 = Math.floor(t * pxH);
    const y1 = Math.floor(((i + 1) / bands) * pxH);
    ctx.fillStyle = lerpColor(road.offBase, road.offShade, 0.25 + t * 0.55);
    ctx.fillRect(0, y0, pxW, y1 - y0);
  }
  // off-road speckle (grass tufts / texture)
  const offCount = Math.floor(pxW * pxH * 0.02);
  for (let i = 0; i < offCount; i++) {
    const x = Math.floor(r() * pxW);
    const y = Math.floor(r() * pxH);
    const depthT = y / pxH;
    if (r() > 0.35 + depthT * 0.4) continue;
    ctx.fillStyle = r() > 0.5 ? road.offBase : road.offShade;
    ctx.fillRect(x, y, depthT > 0.65 ? 2 : 1, depthT > 0.65 ? 2 : 1);
  }

  // ── 2. CARVE the road polygons ────────────────────────────────────────────
  for (const poly of walkable) {
    const path = polyPath(poly, toPx);

    // soft curb glow just outside the road for a lit-edge read
    ctx.save();
    ctx.clip(path);
    // road base gradient: lighter (hazier) far, warmer/darker near
    for (let i = 0; i < bands; i++) {
      const t = i / bands;
      const y0 = Math.floor(t * pxH);
      const y1 = Math.floor(((i + 1) / bands) * pxH);
      ctx.fillStyle = lerpColor(road.roadFar, road.roadNear, t);
      ctx.fillRect(0, y0, pxW, y1 - y0);
    }
    // cobble speckle on the road, denser near camera
    const roadCount = Math.floor(pxW * pxH * 0.03);
    for (let i = 0; i < roadCount; i++) {
      const x = Math.floor(r() * pxW);
      const y = Math.floor(r() * pxH);
      const depthT = y / pxH;
      if (r() > 0.3 + depthT * 0.5) continue;
      const sz = depthT > 0.6 ? 2 : 1;
      ctx.fillStyle = r() > 0.55 ? road.speck : road.curb;
      ctx.globalAlpha = r() > 0.5 ? 0.5 : 0.28;
      ctx.fillRect(x, y, sz, sz);
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // curb edge stroke (the natural road border)
    ctx.strokeStyle = road.curb;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 2;
    ctx.stroke(path);
    // inner darker lip for depth
    ctx.strokeStyle = road.speck;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;
    ctx.stroke(path);
    ctx.globalAlpha = 1;
  }

  // ── 3. near-edge shadow lip grounds the front of the diorama ──────────────
  ctx.fillStyle = "rgba(0,0,0,0.30)";
  ctx.fillRect(0, Math.floor(pxH * 0.93), pxW, Math.ceil(pxH * 0.07));
}
