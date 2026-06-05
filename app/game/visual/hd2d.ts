// ───────────────────────────────────────────────────────────────────────────
// HD-2D projection model.
// The gameplay engine still thinks in tile coordinates (collision grid,
// interactable x/y, quest triggers — all untouched). This module projects that
// tile/pixel world into a cinematic SIDE-VIEW diorama:
//
//   - worldX  : horizontal position along a walkable lane (px in stage space)
//   - depth   : 0 (front of lane) .. 1 (back of lane) — drives scale + y-offset
//   - scale   : foreshortening for depth (closer = bigger)
//   - screenY : baseline (feet) y on screen for a given depth
//
// We derive worldX from the tile X (horizontal) and depth from the tile Y
// (how "far down/up" the corridor the tile sits). This is purely presentational:
// the same tile (x,y) that the engine uses for collision/interaction is mapped
// to a believable side-view spot. Nothing in combat/state/save changes.
// ───────────────────────────────────────────────────────────────────────────

import type { MapDef } from "../data/types";

export interface SceneLayout {
  // Pixel width of the side-view world (the horizontal corridor the camera pans).
  worldWidth: number;
  // The lane the player walks on, expressed as screen baseline fractions.
  laneTopY: number; // baseline y-fraction for the FAR edge of the lane (depth=1)
  laneBottomY: number; // baseline y-fraction for the NEAR edge of the lane (depth=0)
  // Scale at far vs near depth.
  scaleFar: number;
  scaleNear: number;
  // Horizontal padding (px) so edge tiles aren't flush against the frame.
  padX: number;
}

export interface Projected {
  worldX: number; // horizontal px in stage space (pre-camera)
  depth: number; // 0 near .. 1 far
  scale: number;
  screenYFrac: number; // baseline y as a fraction of viewport height (0..1)
}

// Which tile axis runs ALONG the corridor (horizontal travel) for this map.
// Tall maps (snowfield/shrine) travel down the rows, so tile-Y is the corridor;
// wide maps (chapel/town) travel across columns, so tile-X is the corridor.
export function corridorAxis(map: MapDef): "x" | "y" {
  return map.height > map.width ? "y" : "x";
}

// Length (in tiles) of the corridor axis, and of the depth axis.
function axisSpans(map: MapDef): { along: number; depth: number } {
  return corridorAxis(map) === "y"
    ? { along: map.height, depth: map.width }
    : { along: map.width, depth: map.height };
}

// Build a layout for a given map. The corridor length scales with the map's
// "horizontal span" (max tile-x range) so larger rooms pan more.
export function sceneLayout(map: MapDef, viewportW: number): SceneLayout {
  // Horizontal extent in tiles = length of the corridor axis.
  const span = Math.max(6, axisSpans(map).along);
  // Generous world width so the camera glides; minimum 1.6x viewport.
  const worldWidth = Math.max(viewportW * 1.6, span * 150);

  // Each theme gets a slightly different lane geometry for variety.
  switch (map.theme) {
    case "chapel":
      return { worldWidth, laneTopY: 0.66, laneBottomY: 0.9, scaleFar: 0.72, scaleNear: 1.18, padX: 220 };
    case "snow":
      return { worldWidth, laneTopY: 0.68, laneBottomY: 0.92, scaleFar: 0.7, scaleNear: 1.16, padX: 240 };
    case "town":
      return { worldWidth, laneTopY: 0.64, laneBottomY: 0.9, scaleFar: 0.74, scaleNear: 1.16, padX: 220 };
    case "shrine":
    default:
      return { worldWidth, laneTopY: 0.62, laneBottomY: 0.9, scaleFar: 0.68, scaleNear: 1.2, padX: 240 };
  }
}

// Project a continuous pixel-space position (the engine stores player position
// in pixels: tileX*tileSize). Convert to side-view stage coordinates, using the
// corridor axis for horizontal travel and the other axis for depth.
export function projectPixel(
  map: MapDef,
  layout: SceneLayout,
  pxX: number,
  pxY: number,
): Projected {
  const ts = map.tileSize;
  const tileXf = pxX / ts - 0.5; // continuous tile-x
  const tileYf = pxY / ts - 0.5; // continuous tile-y

  const axis = corridorAxis(map);
  const { along, depth: depthSpan } = axisSpans(map);

  const alongPos = axis === "y" ? tileYf : tileXf;
  const depthPos = axis === "y" ? tileXf : tileYf;

  const usable = layout.worldWidth - layout.padX * 2;
  const alongMax = Math.max(1, along - 1);
  const worldX = layout.padX + (clampf(alongPos, 0, alongMax) / alongMax) * usable;

  const depthMax = Math.max(1, depthSpan - 1);
  // small depth -> far (1) so the back wall is "up/in"
  const dRaw = depthSpan <= 1 ? 0.3 : 1 - depthPos / depthMax;
  const depth = clamp01(dRaw * 0.8 + 0.1);

  const scale = lerp(layout.scaleNear, layout.scaleFar, depth);
  const screenYFrac = lerp(layout.laneBottomY, layout.laneTopY, depth);

  return { worldX, depth, scale, screenYFrac };
}

export function projectTile(
  map: MapDef,
  layout: SceneLayout,
  tileX: number,
  tileY: number,
): Projected {
  return projectPixel(map, layout, tileX * map.tileSize + map.tileSize / 2, tileY * map.tileSize + map.tileSize / 2);
}

// Camera: keep the player roughly centred horizontally, clamped to the world.
export function cameraFor(worldX: number, worldWidth: number, viewportW: number): number {
  return clampf(worldX - viewportW / 2, 0, Math.max(0, worldWidth - viewportW));
}

// ── small math helpers ───────────────────────────────────────────────────────
export function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
export function clampf(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
