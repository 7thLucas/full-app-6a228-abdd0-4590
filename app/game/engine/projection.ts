// ───────────────────────────────────────────────────────────────────────────
// Pseudo-3D projection + collision math for the HD-2D 2.5D diorama.
//
// World coordinates:
//   worldX  → horizontal position on the floor plane (px, screen-aligned)
//   worldY  → DEPTH into the scene (0 = nearest camera, larger = further away)
//   worldZ  → height/elevation above the floor (px; stairs, floating crystals)
//
// The camera is a fixed 3/4 diorama angle looking slightly down. The floor
// plane recedes upward as worldY grows. We fake perspective by compressing
// depth (depthScale) and shrinking sprites that are deeper in the scene.
// ───────────────────────────────────────────────────────────────────────────

export interface Vec2 {
  x: number;
  y: number;
}

/** A walkable region the player's feet (worldX, worldY) must stay inside. */
export type Polygon = Vec2[];

export interface CameraState {
  /** horizontal world offset of the camera (follows the player). */
  offsetX: number;
  /** vertical screen offset for the whole diorama (depth origin). */
  offsetY: number;
  /** extra cinematic push-in zoom (1 = none). */
  zoom: number;
  /** transient screen-shake magnitude in px. */
  shake: number;
}

// How strongly depth compresses into vertical screen space. The floor recedes
// upward: a deeper worldY maps to a higher (smaller screenY) position.
export const DEPTH_SCALE = 0.62;

// Sprite scale falls off with depth so far entities read as smaller.
export function depthVisualScale(worldY: number): number {
  return clamp(1.08 - worldY * 0.0015, 0.82, 1.12);
}

// Shadow shrinks + fades with depth.
export function depthShadow(worldY: number): { scale: number; opacity: number } {
  const s = clamp(1.0 - worldY * 0.0012, 0.55, 1.05);
  return { scale: s, opacity: clamp(0.5 - worldY * 0.0004, 0.22, 0.5) };
}

export interface Projected {
  screenX: number;
  screenY: number; // feet baseline on screen (before applying worldZ lift)
  baseScreenY: number; // floor contact point (worldZ = 0) for shadow
  scale: number;
  zIndex: number;
}

// Project a world point to screen space given the camera. worldZ lifts the
// sprite up (negative screen Y) without changing its depth sort.
export function project(
  worldX: number,
  worldY: number,
  worldZ: number,
  cam: CameraState,
): Projected {
  const scale = depthVisualScale(worldY);
  const screenX = (worldX - cam.offsetX) * cam.zoom + cam.offsetX + shakeJitter(cam.shake, 1);
  const floorY = worldY * DEPTH_SCALE + cam.offsetY;
  const baseScreenY = (floorY - cam.offsetY) * cam.zoom + cam.offsetY + shakeJitter(cam.shake, 2);
  const screenY = baseScreenY - worldZ * scale;
  return {
    screenX,
    screenY,
    baseScreenY,
    scale,
    zIndex: Math.floor(worldY),
  };
}

let shakeSeed = 1234.5;
function shakeJitter(mag: number, salt: number): number {
  if (mag <= 0.01) return 0;
  shakeSeed = (shakeSeed * 9301 + 49297 + salt) % 233280;
  return ((shakeSeed / 233280) * 2 - 1) * mag;
}

// ── Geometry helpers ─────────────────────────────────────────────────────────

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// Point-in-polygon (ray cast). Coordinates are world (x = worldX, y = worldY).
export function pointInPolygon(px: number, py: number, poly: Polygon): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x,
      yi = poly[i].y;
    const xj = poly[j].x,
      yj = poly[j].y;
    const intersect =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function pointInAnyPolygon(px: number, py: number, polys: Polygon[]): boolean {
  for (const p of polys) if (pointInPolygon(px, py, p)) return true;
  return false;
}

// Axis-aligned blocked zone (world space) for walls/props/water/NPCs.
export interface BlockRect {
  x: number; // worldX center
  y: number; // worldY center
  w: number; // half-width in worldX
  d: number; // half-depth in worldY
}

export function inBlock(px: number, py: number, b: BlockRect): boolean {
  return Math.abs(px - b.x) <= b.w && Math.abs(py - b.y) <= b.d;
}

export function inAnyBlock(px: number, py: number, blocks: BlockRect[]): boolean {
  for (const b of blocks) if (inBlock(px, py, b)) return true;
  return false;
}

// Resolve a desired move against walkable polygons + blocking rects.
// Tries the full move, then slides along each axis so the player doesn't stick.
export function resolveMove(
  fromX: number,
  fromY: number,
  dx: number,
  dy: number,
  walkable: Polygon[],
  blocks: BlockRect[],
): { x: number; y: number } {
  const ok = (x: number, y: number) =>
    pointInAnyPolygon(x, y, walkable) && !inAnyBlock(x, y, blocks);

  const tx = fromX + dx;
  const ty = fromY + dy;
  if (ok(tx, ty)) return { x: tx, y: ty };
  // slide on X only
  if (ok(tx, fromY)) return { x: tx, y: fromY };
  // slide on Y only
  if (ok(fromX, ty)) return { x: fromX, y: ty };
  return { x: fromX, y: fromY };
}

export function dist2(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}
