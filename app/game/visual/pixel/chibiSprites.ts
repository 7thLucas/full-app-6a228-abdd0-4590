// ───────────────────────────────────────────────────────────────────────────
// 4-direction chibi pixel humans for the 2.5D diorama. Each character has
// down / up / left / right facings, with idle + 2 walk frames per facing.
// Chibi proportions: big head (~40%), short body, stubby limbs. Drawn blocky so
// they read as crisp pixel art when scaled up 3-4x. Original designs only.
// ───────────────────────────────────────────────────────────────────────────

import type { PixelGrid } from "./pixelArt";

// shared palette for chibi cast
const P = {
  _: "transparent",
  k: "#16111f", // outline
  s: "#f0c89a", // skin
  S: "#cf9c70", // skin shade
  e: "#241726", // eyes
  // Arin — blue cloak traveler
  c: "#4a78b0", // cloak
  C: "#345a86", // cloak shade
  l: "#6fa0d8", // cloak light
  h: "#2f4c6e", // hood
  b: "#8a6238", // satchel strap
  B: "#5e4226", // satchel
  g: "#ffe79a", // glowing notebook / gold
  G: "#fff6cf", // gold light
  // hair
  n: "#2a1e2e", // dark hair
  N: "#3e2c40",
  // Elder — grey robe + gat hat
  v: "#5d6a82", // robe
  V: "#454f66",
  W: "#e8e4da", // beard / white
  t: "#15151c", // hat black
  // Shopkeeper — red apron
  r: "#b54a4a", // red
  R: "#8e3636",
  a: "#d9c4a0", // apron cream
  // Guard — steel
  m: "#56607e", // steel
  M: "#3a4258",
  q: "#c6cad6", // steel light
  // Child — orange scarf
  d: "#d98a40", // child clothes
  D: "#b56c2c",
  f: "#ff6a6a", // bright scarf
  // misc
  o: "#e8923c", // bori orange
  O: "#c46f24",
  w: "#fff1d6", // white belly
  F: "#ffd98a", // flame/glow
  p: "#caa8ff", // wisp violet
  Q: "#3a2a5e", // wisp dark
  z: "#7a5ad0", // wisp mid
};

function grid(rows: string[]): PixelGrid {
  return { rows, palette: P };
}

// A character is a set of facing → [idle, walkA, walkB] grids.
export interface ChibiSet {
  down: [PixelGrid, PixelGrid, PixelGrid];
  up: [PixelGrid, PixelGrid, PixelGrid];
  side: [PixelGrid, PixelGrid, PixelGrid]; // faces right; flip for left
}

export type ChibiName =
  | "arin"
  | "elder"
  | "shopkeeper"
  | "guard"
  | "child";

// ── ARIN (player) — 16w chibi, hood, cloak/cape, satchel, glowing notebook ───
// Facing DOWN (toward camera): face + eyes visible.
const ARIN_D_IDLE = grid([
  "                ",
  "     knnnk      ",
  "    knnnnnk     ",
  "    nssssn      ",
  "    ksesesk     ",
  "    ksssssk     ",
  "   khccccchk    ",
  "  gGkccccckBb   ",
  "  gGlccccclBb   ",
  "  gGkccllcckB   ",
  "   kcccccck     ",
  "   kcCccCck     ",
  "   kc    ck     ",
  "   kk    kk     ",
  "   ks    sk     ",
  "   kk    kk     ",
]);
const ARIN_D_A = grid([
  "                ",
  "     knnnk      ",
  "    knnnnnk     ",
  "    nssssn      ",
  "    ksesesk     ",
  "    ksssssk     ",
  "   khccccchk    ",
  "  gGkccccckBb   ",
  "  gGlccccclBb   ",
  "  gGkccllcckB   ",
  "   kcccccck     ",
  "   kcCccCck     ",
  "  kc     ck     ",
  "  kk     kk     ",
  " ks       sk    ",
  " kk       kk    ",
]);
const ARIN_D_B = grid([
  "                ",
  "     knnnk      ",
  "    knnnnnk     ",
  "    nssssn      ",
  "    ksesesk     ",
  "    ksssssk     ",
  "   khccccchk    ",
  "  gGkccccckBb   ",
  "  gGlccccclBb   ",
  "  gGkccllcckB   ",
  "   kcccccck     ",
  "   kcCccCck     ",
  "    kc  ck      ",
  "    kk  kk      ",
  "    sk  ks      ",
  "    kk  kk      ",
]);

// Facing UP (away): back of hood, no face, cape visible.
const ARIN_U_IDLE = grid([
  "                ",
  "     kCCCk      ",
  "    kCCCCCk     ",
  "    kCCCCCk     ",
  "    kCCCCCk     ",
  "    kCCCCCk     ",
  "   khCCCCChk    ",
  "   kCCCCCCCk    ",
  "   lCCCCCCCl    ",
  "   kCCCCCCCk    ",
  "   kCCCCCCk     ",
  "   kCcccCck     ",
  "   kc    ck     ",
  "   kk    kk     ",
  "   ks    sk     ",
  "   kk    kk     ",
]);
const ARIN_U_A = grid([
  "                ",
  "     kCCCk      ",
  "    kCCCCCk     ",
  "    kCCCCCk     ",
  "    kCCCCCk     ",
  "    kCCCCCk     ",
  "   khCCCCChk    ",
  "   kCCCCCCCk    ",
  "   lCCCCCCCl    ",
  "   kCCCCCCCk    ",
  "   kCCCCCCk     ",
  "   kCcccCck     ",
  "  kc     ck     ",
  "  kk     kk     ",
  " ks       sk    ",
  " kk       kk    ",
]);
const ARIN_U_B = grid([
  "                ",
  "     kCCCk      ",
  "    kCCCCCk     ",
  "    kCCCCCk     ",
  "    kCCCCCk     ",
  "    kCCCCCk     ",
  "   khCCCCChk    ",
  "   kCCCCCCCk    ",
  "   lCCCCCCCl    ",
  "   kCCCCCCCk    ",
  "   kCCCCCCk     ",
  "   kCcccCck     ",
  "    kc  ck      ",
  "    kk  kk      ",
  "    sk  ks      ",
  "    kk  kk      ",
]);

// Facing SIDE (right): profile, one eye, satchel on near side, cape trailing.
const ARIN_S_IDLE = grid([
  "                ",
  "     knnnk      ",
  "    knnnnnk     ",
  "    nsssk       ",
  "    ksesk       ",
  "   Ckssssk      ",
  "  Ckhcccck      ",
  "  Ckccccckg     ",
  "  ClcccccGg     ",
  "   kccccckg     ",
  "   Bcccck       ",
  "   BkcCck       ",
  "    kc ck       ",
  "    kk kk       ",
  "    ks sk       ",
  "    kk kk       ",
]);
const ARIN_S_A = grid([
  "                ",
  "     knnnk      ",
  "    knnnnnk     ",
  "    nsssk       ",
  "    ksesk       ",
  "   Ckssssk      ",
  "  Ckhcccck      ",
  "  Ckccccckg     ",
  "  ClcccccGg     ",
  "   kccccckg     ",
  "   Bcccck       ",
  "   BkcCck       ",
  "   kc  ck       ",
  "  kk    kk      ",
  " ks      k      ",
  " kk      k      ",
]);
const ARIN_S_B = grid([
  "                ",
  "     knnnk      ",
  "    knnnnnk     ",
  "    nsssk       ",
  "    ksesk       ",
  "   Ckssssk      ",
  "  Ckhcccck      ",
  "  Ckccccckg     ",
  "  ClcccccGg     ",
  "   kccccckg     ",
  "   Bcccck       ",
  "   BkcCck       ",
  "    kc ck       ",
  "    k   kk      ",
  "    k    ks     ",
  "    k    kk     ",
]);

// ── ELDER — long grey robe, gat hat, white beard, staff ──────────────────────
function elderSet(): ChibiSet {
  const d = (legShift: number) =>
    grid([
      "    ttttt       ",
      "   ttttttt      ",
      "  ttttttttt     ",
      "    sssss       ",
      "    sesess      ",
      "    ksssk       ",
      "    kWWWk       ",
      "   kvvvvvk      ",
      "   kvVvVvk      ",
      "   kvvvvvk      ",
      "   kvVvVvk      ",
      "   kvvvvvk      ",
      legShift === 0 ? "   kvv vvk      " : legShift < 0 ? "  kvv  vvk      " : "    kvv vvk     ",
      "   kk   kk      ",
      "   ks   sk      ",
      "   kk   kk      ",
    ]);
  const u = grid([
    "    ttttt       ",
    "   ttttttt      ",
    "  ttttttttt     ",
    "    vvvvv       ",
    "    vvvvv       ",
    "    kvvvk       ",
    "   kvvvvvk      ",
    "   kvVvVvk      ",
    "   kvvvvvk      ",
    "   kvVvVvk      ",
    "   kvvvvvk      ",
    "   kvVvVvk      ",
    "   kvv vvk      ",
    "   kk   kk      ",
    "   ks   sk      ",
    "   kk   kk      ",
  ]);
  const s = grid([
    "    tttt        ",
    "   ttttttt      ",
    "  tttttttt      ",
    "    ssss        ",
    "    sesk        ",
    "    kssk        ",
    "    WWWk        ",
    "   kvvvk        ",
    "   kvVvk        ",
    "   kvvvk        ",
    "   kvVvk        ",
    "   kvvvk        ",
    "   kvvk         ",
    "   kk k         ",
    "   ks sk        ",
    "   kk kk        ",
  ]);
  return { down: [d(0), d(-1), d(1)], up: [u, u, u], side: [s, s, s] };
}

// ── SHOPKEEPER — apron + headband, red ─────────────────────────────────────
function shopSet(): ChibiSet {
  const base = (lo: string) =>
    grid([
      "                ",
      "    ggggg       ",
      "   ksssssk      ",
      "   ksesesk      ",
      "   ksssssk      ",
      "   krrrrrk      ",
      "  karrrrrak     ",
      "  kaRrrRrak     ",
      "   krrrrrk      ",
      "   krRrRrk      ",
      "   krrrrrk      ",
      "   kaaaaak      ",
      lo,
      "   kk   kk      ",
      "   ks   sk      ",
      "   kk   kk      ",
    ]);
  return {
    down: [base("   krr rrk      "), base("  krr  rrk      "), base("    krr rrk     ")],
    up: [base("   krr rrk      "), base("   krr rrk      "), base("   krr rrk      ")],
    side: [
      grid([
        "                ",
        "    gggg        ",
        "   kssssk       ",
        "   ksesk        ",
        "   ksssk        ",
        "   krrrk        ",
        "  karrrk        ",
        "  kaRrRk        ",
        "   krrrk        ",
        "   krRrk        ",
        "   krrrk        ",
        "   kaaak        ",
        "   krrk         ",
        "   kk k         ",
        "   ks sk        ",
        "   kk kk        ",
      ]),
      grid(["                ", "    gggg        ", "   kssssk       ", "   ksesk        ", "   ksssk        ", "   krrrk        ", "  karrrk        ", "  kaRrRk        ", "   krrrk        ", "   krRrk        ", "   krrrk        ", "   kaaak        ", "  krrk          ", "  kk  k         ", " ks    k        ", " kk    k        "]),
      grid(["                ", "    gggg        ", "   kssssk       ", "   ksesk        ", "   ksssk        ", "   krrrk        ", "  karrrk        ", "  kaRrRk        ", "   krrrk        ", "   krRrk        ", "   krrrk        ", "   kaaak        ", "   krrk         ", "   k  kk        ", "   k   ks       ", "   k   kk       "]),
    ],
  };
}

// ── GUARD — light armor + spear ────────────────────────────────────────────
function guardSet(): ChibiSet {
  const d = (lo: string) =>
    grid([
      "             q  ",
      "   kmmmk     q  ",
      "  kqmmmqk    q  ",
      "  ksssssk    q  ",
      "  ksesesk    m  ",
      "  ksssssk    m  ",
      " kmmmmmmmk   m  ",
      " kmqmmmqmk   m  ",
      " kmmmmmmmk   m  ",
      "  kmMmMmk    m  ",
      "  kmmmmmk    m  ",
      "  kmMmMmk    m  ",
      lo,
      "  kk   kk    b  ",
      "  ks   sk       ",
      "  kk   kk       ",
    ]);
  const u = grid([
    "             q  ",
    "   kmmmk     q  ",
    "  kqmmmqk    q  ",
    "  kmmmmmk    q  ",
    "  kmmmmmk    m  ",
    "  kmmmmmk    m  ",
    " kmmmmmmmk   m  ",
    " kmqmmmqmk   m  ",
    " kmmmmmmmk   m  ",
    "  kmMmMmk    m  ",
    "  kmmmmmk    m  ",
    "  kmMmMmk    m  ",
    "  kmm mmk    b  ",
    "  kk   kk       ",
    "  ks   sk       ",
    "  kk   kk       ",
  ]);
  const s = grid([
    "      q         ",
    "   kmmkq        ",
    "  kqmmkq        ",
    "  ksskq         ",
    "  ksekm         ",
    "  ksskm         ",
    " kmmmkm         ",
    " kmqmkm         ",
    " kmmmkm         ",
    "  kmMkm         ",
    "  kmmk          ",
    "  kmMk          ",
    "  kmmk          ",
    "  kk k          ",
    "  ks sk         ",
    "  kk kk         ",
  ]);
  return { down: [d("  kmm mmk    m  "), d(" kmm  mmk    m  "), d("   kmm mmk   m  ")], up: [u, u, u], side: [s, s, s] };
}

// ── CHILD — small, bright scarf ────────────────────────────────────────────
function childSet(): ChibiSet {
  const d = (lo: string) =>
    grid([
      "                ",
      "                ",
      "    knnnk       ",
      "   knnnnnk      ",
      "   ksssssk      ",
      "   ksesesk      ",
      "   ksssssk      ",
      "   kfffffk      ",
      "   kddddk       ",
      "   kdDdDk       ",
      "   kddddk       ",
      lo,
      "   kk  kk       ",
      "   ks  sk       ",
      "   kk  kk       ",
      "                ",
    ]);
  const u = grid([
    "                ",
    "                ",
    "    knnnk       ",
    "   knnnnnk      ",
    "   knnnnnk      ",
    "   knnnnnk      ",
    "   kfffffk      ",
    "   kfffffk      ",
    "   kddddk       ",
    "   kdDdDk       ",
    "   kddddk       ",
    "   kdd dk       ",
    "   kk  kk       ",
    "   ks  sk       ",
    "   kk  kk       ",
    "                ",
  ]);
  const s = grid([
    "                ",
    "                ",
    "    knnk        ",
    "   knnnnk       ",
    "   ksssk        ",
    "   ksek         ",
    "   ksssk        ",
    "   kffk         ",
    "   kddk         ",
    "   kdDk         ",
    "   kddk         ",
    "   kdk          ",
    "   kk           ",
    "   ks k         ",
    "   kk k         ",
    "                ",
  ]);
  return { down: [d("   kdd dk       "), d("  kdd  dk       "), d("    kdd dk      ")], up: [u, u, u], side: [s, s, s] };
}

const ARIN_SET: ChibiSet = {
  down: [ARIN_D_IDLE, ARIN_D_A, ARIN_D_B],
  up: [ARIN_U_IDLE, ARIN_U_A, ARIN_U_B],
  side: [ARIN_S_IDLE, ARIN_S_A, ARIN_S_B],
};

export const CHIBI: Record<ChibiName, ChibiSet> = {
  arin: ARIN_SET,
  elder: elderSet(),
  shopkeeper: shopSet(),
  guard: guardSet(),
  child: childSet(),
};

export function getChibi(name: ChibiName): ChibiSet {
  return CHIBI[name];
}

// Resolve a facing+frame to a grid + whether to flip horizontally.
export function chibiFrame(
  name: ChibiName,
  facing: "down" | "up" | "left" | "right",
  frame: number,
): { grid: PixelGrid; flip: boolean } {
  const set = getChibi(name);
  const f = frame % 3;
  if (facing === "down") return { grid: set.down[f], flip: false };
  if (facing === "up") return { grid: set.up[f], flip: false };
  if (facing === "right") return { grid: set.side[f], flip: false };
  return { grid: set.side[f], flip: true };
}
