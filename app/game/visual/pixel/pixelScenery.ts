// ───────────────────────────────────────────────────────────────────────────
// Procedural pixel-art scenery painters. Each function paints a wide, seamless
// strip of HD-2D pixel art directly to a canvas context (1 unit = 1 pixel cell)
// so layers can be scaled up nearest-neighbor. Everything is blocky pixel art:
// stepped mountains, dithered skies, hanok rooftops, shrine gates, stone paths.
// ───────────────────────────────────────────────────────────────────────────

import { rng } from "./pixelArt";

type Ctx = CanvasRenderingContext2D;

function rect(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

// Bayer-ish dither between two colors over a band (cheap pixel gradient).
function ditherBand(ctx: Ctx, x0: number, y0: number, w: number, h: number, top: string, bot: string) {
  for (let y = 0; y < h; y++) {
    const t = y / h;
    // probabilistic dither: more "bot" toward the bottom
    for (let x = 0; x < w; x++) {
      const on = ((x + y) % 2 === 0 ? 0.5 : 0) + t;
      rect(ctx, x0 + x, y0 + y, 1, 1, on > 0.75 ? bot : top);
    }
  }
}

// Stepped pixel mountain ridge.
function mountains(ctx: Ctx, w: number, h: number, baseY: number, color: string, shade: string, seed: number, height: number) {
  const r = rng(seed);
  let peakAt = 0;
  while (peakAt < w) {
    const span = 60 + Math.floor(r() * 120);
    const peakH = height * (0.5 + r() * 0.5);
    const cx = peakAt + span / 2;
    for (let x = peakAt; x < peakAt + span && x < w; x++) {
      const d = Math.abs(x - cx) / (span / 2);
      const colH = Math.max(0, peakH * (1 - d * d));
      const top = baseY - colH;
      rect(ctx, x, top, 1, baseY - top, color);
      // light snow cap / ridge highlight
      if (colH > peakH * 0.7) rect(ctx, x, top, 1, 3, shade);
    }
    peakAt += span - 10;
  }
}

// ── SHRINE: sunrise sky, mountains, shrine gate, stone path ─────────────────
export function paintShrineSky(ctx: Ctx, w: number, h: number) {
  // banded sunrise sky (navy -> gold), stepped not smooth
  const bands: [number, string][] = [
    [0.0, "#16213f"],
    [0.16, "#243a63"],
    [0.34, "#3a5080"],
    [0.5, "#6a5e84"],
    [0.62, "#a9785a"],
    [0.78, "#d99a64"],
    [0.9, "#e9b87a"],
    [1.0, "#f6d89a"],
  ];
  for (let i = 0; i < bands.length; i++) {
    const y0 = Math.floor(bands[i][0] * h);
    const y1 = i + 1 < bands.length ? Math.floor(bands[i + 1][0] * h) : h;
    rect(ctx, 0, y0, w, y1 - y0, bands[i][1]);
  }
  // sun disc
  const sx = Math.floor(w * 0.46);
  const sy = Math.floor(h * 0.34);
  const rad = 16;
  for (let y = -rad; y <= rad; y++)
    for (let x = -rad; x <= rad; x++)
      if (x * x + y * y <= rad * rad) rect(ctx, sx + x, sy + y, 1, 1, x * x + y * y < rad * rad * 0.5 ? "#fff3d6" : "#ffd98a");
  // pixel stars in the dark upper band
  const r = rng(7);
  for (let i = 0; i < 40; i++) rect(ctx, Math.floor(r() * w), Math.floor(r() * h * 0.22), 1, 1, "#cdd8f0");
}

export function paintShrineMountains(ctx: Ctx, w: number, h: number) {
  mountains(ctx, w, h, h, "#3a4a6e", "#566488", 21, h * 0.7);
  mountains(ctx, w, h, h, "#2e3c5c", "#3a4a6e", 99, h * 0.45);
}

export function paintShrineMid(ctx: Ctx, w: number, h: number) {
  // big central shrine gate (torii-like pixel arch) + flanking pillars
  const gx = Math.floor(w * 0.5);
  const top = Math.floor(h * 0.18);
  const baseY = h;
  // pillars
  rect(ctx, gx - 70, top + 12, 14, baseY - top - 12, "#9a8460");
  rect(ctx, gx - 70, top + 12, 4, baseY - top - 12, "#b6a07c");
  rect(ctx, gx + 56, top + 12, 14, baseY - top - 12, "#9a8460");
  rect(ctx, gx + 56, top + 12, 4, baseY - top - 12, "#b6a07c");
  // top beams
  rect(ctx, gx - 96, top, 192, 12, "#7a6a52");
  rect(ctx, gx - 96, top, 192, 4, "#b6a07c");
  rect(ctx, gx - 84, top + 16, 168, 8, "#8a7654");
  // gold glow seam
  rect(ctx, gx - 84, top + 16, 168, 2, "#e9cf86");
  // distant stone lanterns
  const r = rng(33);
  for (let i = 0; i < Math.ceil(w / 260); i++) {
    const lx = 60 + i * 260 + Math.floor(r() * 30);
    rect(ctx, lx, baseY - 40, 12, 26, "#5a4632");
    rect(ctx, lx + 2, baseY - 36, 8, 10, "#ffd98a");
  }
}

// ── VILLAGE: morning sky, hanok rooftops, lanterns ──────────────────────────
export function paintVillageSky(ctx: Ctx, w: number, h: number) {
  const bands: [number, string][] = [
    [0.0, "#22335a"],
    [0.22, "#324a72"],
    [0.42, "#5a6a8a"],
    [0.58, "#8a7a86"],
    [0.72, "#b88a6a"],
    [0.86, "#d9a578"],
    [1.0, "#e9c08a"],
  ];
  for (let i = 0; i < bands.length; i++) {
    const y0 = Math.floor(bands[i][0] * h);
    const y1 = i + 1 < bands.length ? Math.floor(bands[i + 1][0] * h) : h;
    rect(ctx, 0, y0, w, y1 - y0, bands[i][1]);
  }
  const sx = Math.floor(w * 0.68);
  const sy = Math.floor(h * 0.3);
  const rad = 11;
  for (let y = -rad; y <= rad; y++)
    for (let x = -rad; x <= rad; x++)
      if (x * x + y * y <= rad * rad) rect(ctx, sx + x, sy + y, 1, 1, "#fff3d6");
}

export function paintVillageMountains(ctx: Ctx, w: number, h: number) {
  mountains(ctx, w, h, h, "#46567a", "#5a6a90", 41, h * 0.55);
}

export function paintVillageBuildings(ctx: Ctx, w: number, h: number) {
  const r = rng(55);
  const baseY = h;
  let x = 0;
  while (x < w) {
    const bw = 60 + Math.floor(r() * 34);
    const bh = Math.floor(h * (0.42 + r() * 0.28));
    const top = baseY - bh;
    // body (dark wood)
    rect(ctx, x, top, bw, bh, "#4a3f30");
    rect(ctx, x, top, bw, 3, "#5a4f3c");
    // curved hanok roof (stepped tiers)
    rect(ctx, x - 6, top - 8, bw + 12, 8, "#3a4458");
    rect(ctx, x - 10, top - 6, 8, 6, "#2a3242"); // upturned eave
    rect(ctx, x + bw + 2, top - 6, 8, 6, "#2a3242");
    rect(ctx, x - 2, top - 14, bw + 4, 7, "#46506a");
    rect(ctx, x - 2, top - 14, bw + 4, 2, "#5a6688");
    // warm paper windows
    const wy = top + Math.floor(bh * 0.45);
    rect(ctx, x + 8, wy, 14, 16, "#e0a84a");
    rect(ctx, x + 8, wy, 14, 16, "#e0a84a");
    rect(ctx, x + 10, wy + 2, 10, 12, "#ffe6a8");
    if (bw > 70) {
      rect(ctx, x + bw - 24, wy, 14, 16, "#e0a84a");
      rect(ctx, x + bw - 22, wy + 2, 10, 12, "#ffe6a8");
    }
    x += bw + 6;
  }
}

// ── GATE: night/dawn sky, broken gate, violet fog ──────────────────────────
export function paintGateSky(ctx: Ctx, w: number, h: number) {
  const bands: [number, string][] = [
    [0.0, "#0b0820"],
    [0.3, "#160f2a"],
    [0.55, "#1e1838"],
    [0.78, "#2a2048"],
    [1.0, "#1a1430"],
  ];
  for (let i = 0; i < bands.length; i++) {
    const y0 = Math.floor(bands[i][0] * h);
    const y1 = i + 1 < bands.length ? Math.floor(bands[i + 1][0] * h) : h;
    rect(ctx, 0, y0, w, y1 - y0, bands[i][1]);
  }
  // big moon glow
  const sx = Math.floor(w * 0.5);
  const sy = Math.floor(h * 0.26);
  const rad = 18;
  for (let y = -rad; y <= rad; y++)
    for (let x = -rad; x <= rad; x++) {
      const d = x * x + y * y;
      if (d <= rad * rad) rect(ctx, sx + x, sy + y, 1, 1, d < rad * rad * 0.55 ? "#d8c8ff" : "#9a7ad0");
    }
  const r = rng(13);
  for (let i = 0; i < 60; i++) rect(ctx, Math.floor(r() * w), Math.floor(r() * h * 0.5), 1, 1, "#b9a8e8");
}

export function paintGateStructure(ctx: Ctx, w: number, h: number) {
  const gx = Math.floor(w * 0.5);
  const top = Math.floor(h * 0.1);
  const baseY = h;
  // huge dark gate
  rect(ctx, gx - 60, top, 120, baseY - top, "#1a1432");
  rect(ctx, gx - 60, top, 8, baseY - top, "#2a2048");
  rect(ctx, gx + 52, top, 8, baseY - top, "#2a2048");
  rect(ctx, gx - 76, top, 152, 14, "#241a40");
  rect(ctx, gx - 76, top, 152, 3, "#3a2c5e");
  // broken glowing letters embedded
  const letters = ["ㅎ", "ㅏ", "ㄴ", "ㄱ"];
  // (letters are drawn as glyph overlays in the layer, not pixel-painted)
  // side pillars
  const r = rng(8);
  for (let i = 0; i < Math.ceil(w / 300); i++) {
    const px = 50 + i * 300 + Math.floor(r() * 30);
    rect(ctx, px, top + 30, 16, baseY - top - 30, "#140e28");
    rect(ctx, px, top + 30, 4, baseY - top - 30, "#241a40");
  }
  void letters;
}

// ── shared pixel ground / walkable path ─────────────────────────────────────
export function paintPath(ctx: Ctx, w: number, h: number, theme: "shrine" | "village" | "gate") {
  const r = rng(theme === "shrine" ? 3 : theme === "village" ? 6 : 9);
  const top =
    theme === "shrine" ? "#9a8460" : theme === "village" ? "#5a4f42" : "#221a3a";
  const top2 =
    theme === "shrine" ? "#8a7654" : theme === "village" ? "#4e453a" : "#160f2a";
  const front =
    theme === "shrine" ? "#5a4a36" : theme === "village" ? "#2e271d" : "#0c0820";
  const seam =
    theme === "shrine" ? "#e9cf86" : theme === "village" ? "#d8b25a" : "#9a7ad0";
  // top face
  rect(ctx, 0, 0, w, h, top);
  // cobble stipple
  for (let i = 0; i < w * 0.4; i++) {
    rect(ctx, Math.floor(r() * w), Math.floor(r() * h * 0.7), 2, 2, top2);
  }
  // seam highlight at the very top edge
  rect(ctx, 0, 0, w, 1, seam);
  // shaded front lip
  rect(ctx, 0, Math.floor(h * 0.82), w, Math.ceil(h * 0.18), front);
}
