// ───────────────────────────────────────────────────────────────────────────
// Pixel-art prop sprites for the 2.5D diorama (lanterns, trees, pillars, stone
// lanterns, stalls, hanok rooftops, fences, broken pillars, gates, grass,
// flowers, bridges, signs). Built as PixelGrids so they render crisp + blocky.
// ───────────────────────────────────────────────────────────────────────────

import type { PixelGrid } from "./pixelArt";
import type { PropKind } from "../../data/world2d";

const P = {
  _: "transparent",
  k: "#1a1422",
  // wood / stone
  w: "#8a6b44",
  W: "#6a4f30",
  s: "#9aa0ac", // stone
  S: "#6c7280",
  d: "#3a4252", // dark stone
  // lantern
  p: "#caa24e", // lantern post
  P: "#8a6f34",
  f: "#ffd98a", // lantern light
  F: "#fff0c0",
  // foliage
  g: "#3f7a4a",
  G: "#56a062",
  G2: "#2c5a38",
  b: "#5a3f28", // trunk
  // hanok roof
  r: "#3a4458",
  R: "#46506a",
  r2: "#2a3242",
  // flowers
  m: "#e85a7a",
  M: "#c43a5a",
  y: "#ffd86a",
  // gate
  q: "#241a40",
  Q: "#3a2c5e",
  v: "#9a7ad0",
  // grass
  e: "#3a6a40",
  E: "#508a56",
  // cream
  c: "#e0c89a",
};

function g(rows: string[]): PixelGrid {
  return { rows, palette: P };
}

// ── stone lantern (Korean-style) ────────────────────────────────────────────
const LANTERN = g([
  "  ppp   ",
  " pPPPp  ",
  " pfFfp  ",
  " pfFFp  ",
  " pfffp  ",
  " pPPPp  ",
  "  pPp   ",
  "  pPp   ",
  " PPPPP  ",
  " PPPPP  ",
]);

// ── tree (rounded pixel canopy + trunk) ─────────────────────────────────────
const TREE = g([
  "   GGGG    ",
  "  GGGGGG   ",
  " GGgGGgGG  ",
  " GgGGGGgG  ",
  "GGGGgGGGGG ",
  "GgGGGGGGgG ",
  " GGgGGGgG  ",
  " GGGGgGGG  ",
  "  GGgGGG   ",
  "   bbb     ",
  "   bWb     ",
  "   bbb     ",
]);
const TREE2 = g([
  "  GGGGGG   ",
  " GGGgGGGG  ",
  "GGGGGGgGGG ",
  "GgGGGGGGGg ",
  "GGGgGGGgGG ",
  "GGGGGgGGGG ",
  " GGgGGGgG  ",
  "  GGGGgG   ",
  "   GGGG    ",
  "    bb     ",
  "    bb     ",
  "    bb     ",
]);

// ── shrine / temple gate (torii-like) ───────────────────────────────────────
const GATE = g([
  " kkkkkkkkkkkkk ",
  "kwwwwwwwwwwwwwk",
  "kk kkkkkkkkk kk",
  "  wkkkkkkkkkw  ",
  "  kwffffffwk  ",
  "  wk     kw   ",
  "  wk     kw   ",
  "  wk     kw   ",
  "  wk     kw   ",
  "  wk     kw   ",
  "  wk     kw   ",
  "  ww     ww   ",
]);

// ── big ancient gate (silent gate, broken, glowing) ─────────────────────────
const GATE_BIG = g([
  "qqqqqqqqqqqqqqqq",
  "qQQQQQQQQQQQQQQq",
  "qQvvvvvvvvvvvvQq",
  "qQ kkkkkkkkkk Qq",
  "qQk          kQq",
  "qk    vv      kq",
  "qk   vffv     kq",
  "qk    vv      kq",
  "qk            kq",
  "qk     v      kq",
  "qk            kq",
  "qQkkkkkkkkkkkkQq",
]);

// ── broken pillar ───────────────────────────────────────────────────────────
const BROKEN_PILLAR = g([
  " kSSk ",
  " SssS ",
  " SssS ",
  " kSSk ",
  " SssS ",
  " SsSk ",
  " kSS  ",
  " SssS ",
  "kSSSSk",
]);

// ── hanok rooftop (curved eaves) ────────────────────────────────────────────
const ROOFTOP = g([
  "  rrrrrrrrrr    ",
  " rrRRRRRRRRrr   ",
  "rrRRRRRRRRRRrr  ",
  "r2RRRRRRRRRRr2  ",
  " r2r2r2r2r2r2   ",
  "  WwWwWwWwWw    ",
  "  WccccccccW    ",
  "  Wc f  f cW    ",
  "  WcfFffFfcW    ",
  "  WccccccccW    ",
  "  WWWWWWWWWW    ",
]);

// ── shop stall (foreground occluder) ────────────────────────────────────────
const STALL = g([
  "kkkkkkkkkkkk",
  "krRrRrRrRrRk",
  "krrrrrrrrrrk",
  "kk kk kk kkk",
  " w        w ",
  " wccccccccw ",
  " wc y  y cw ",
  " wcccccccw  ",
  " w        w ",
  "kwwwwwwwwwwk",
]);

// ── fence ───────────────────────────────────────────────────────────────────
const FENCE = g([
  "k k k k k ",
  "wwwwwwwwww",
  "k k k k k ",
  "k k k k k ",
  "wwwwwwwwww",
  "k k k k k ",
]);

// ── stone block ─────────────────────────────────────────────────────────────
const STONE = g([
  " kSSSSk ",
  "kSsssSk ",
  "kSsSsSk ",
  "kSsssSk ",
  " kSSSk  ",
]);

// ── ancient tablet (with carved glyph area) ─────────────────────────────────
const TABLET = g([
  " kSSSSk ",
  "kSssssSk",
  "kSdddsSk",
  "kSdddsSk",
  "kSdddsSk",
  "kSssssSk",
  "kSssssSk",
  " kkSSkk ",
  "  kSSk  ",
]);

// ── grass tuft ──────────────────────────────────────────────────────────────
const GRASS = g([
  " e  e e ",
  "eEe eEe ",
  "eEeeEeEe",
  "EEEEEEEE",
]);
const GRASS2 = g([
  "  e e   ",
  " eEeEe e",
  "eEeEeEeE",
  "EEEEEEEE",
]);

// ── flower cluster ──────────────────────────────────────────────────────────
const FLOWER = g([
  " m  y m ",
  "mMm yMy ",
  " e e e  ",
  "eEeeEeE ",
  "EEEEEEE ",
]);
const FLOWER2 = g([
  " y  m y ",
  "yMy mMm ",
  " e  e e ",
  "eEeEeEe ",
  "EEEEEEE ",
]);

// ── bridge ──────────────────────────────────────────────────────────────────
const BRIDGE = g([
  "wwwwwwwwwwww",
  "WWWWWWWWWWWW",
  "k k k k k kk",
  "kdddddddddk ",
]);

// ── sign (post + board, glyph drawn over it) ────────────────────────────────
const SIGN = g([
  "kwwwwwwk",
  "kcccccck",
  "kccccccK",
  "kwwwwwwk",
  "   pp   ",
  "   pp   ",
  "   pp   ",
]);

const MAP: Record<PropKind, PixelGrid[]> = {
  lantern: [LANTERN],
  tree: [TREE, TREE2],
  pillar: [BROKEN_PILLAR],
  stone: [STONE],
  tablet: [TABLET],
  stall: [STALL],
  rooftop: [ROOFTOP],
  fence: [FENCE],
  flower: [FLOWER, FLOWER2],
  grass: [GRASS, GRASS2],
  brokenPillar: [BROKEN_PILLAR],
  gate: [GATE, GATE_BIG],
  crystal: [STONE], // crystal glyph rendered as glowing glyph by component
  bridge: [BRIDGE],
  sign: [SIGN],
};

export function getPropGrid(kind: PropKind, variant = 0): PixelGrid {
  const list = MAP[kind] ?? MAP.stone;
  return list[variant % list.length];
}

// nominal pixel height of each prop kind (for baseline sizing)
export const PROP_HEIGHT: Record<PropKind, number> = {
  lantern: 86,
  tree: 150,
  pillar: 96,
  stone: 44,
  tablet: 84,
  stall: 96,
  rooftop: 120,
  fence: 56,
  flower: 36,
  grass: 30,
  brokenPillar: 92,
  gate: 200,
  crystal: 0,
  bridge: 40,
  sign: 70,
};
