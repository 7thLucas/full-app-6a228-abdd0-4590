// ───────────────────────────────────────────────────────────────────────────
// Original pixel-art character sprites for Hangul Roads. Each is a hand-built
// low-res PixelGrid (see pixelArt.tsx). Upright side-view actors, drawn blocky
// so they read as genuine pixel art when scaled up nearest-neighbor.
// No copyrighted designs — abstract original travelers/spirits.
// ───────────────────────────────────────────────────────────────────────────

import type { PixelGrid } from "./pixelArt";

export type SpriteName =
  | "arin"
  | "arinWalk"
  | "bori"
  | "elder"
  | "shopkeeper"
  | "guard"
  | "child"
  | "wisp";

// shared palette tokens
const P = {
  _: "transparent",
  k: "#1a1426", // dark outline
  s: "#e8c49a", // skin
  S: "#c89a72", // skin shadow
  c: "#3f6e9e", // cloak blue
  C: "#2c5076", // cloak shadow
  l: "#5f8fc0", // cloak light
  h: "#2a4866", // hood
  b: "#7a5a36", // strap/leather
  g: "#e9cf86", // gold/notebook
  G: "#fff3c4", // gold light
  o: "#e8923c", // bori orange
  O: "#c46f24", // bori orange shadow
  w: "#fff1d6", // bori belly / white
  f: "#ffd98a", // flame/glow
  e: "#2a1a12", // eye dark
  r: "#9a3a3a", // shop red robe
  R: "#7a2c2c",
  v: "#5b6b80", // elder robe
  V: "#465468",
  m: "#43506a", // guard steel
  M: "#2e3650",
  n: "#c8cdd8", // metal light
  p: "#c75bff", // wisp eye violet
  q: "#6a4aa0", // wisp body violet
  Q: "#2a1d44", // wisp dark
  d: "#c87a3c", // child orange
  t: "#1a1a22", // hat black
  W: "#e8e4da", // white beard
};

// Build a grid from a list of rows using the shared palette.
function grid(rows: string[]): PixelGrid {
  return { rows, palette: P };
}

// ── Arin: cloaked traveler, satchel, glowing notebook (16x18) ───────────────
const ARIN = grid([
  "                ",
  "      kkkk      ",
  "     khhhhk     ",
  "     hssssh     ",
  "     ksssesk    ",
  "     kssssk     ",
  "    kkccckkk    ",
  "   kclcccclk    ",
  "  gGkcccccckb   ",
  "  gGkclcclckb   ",
  "  gGkcccccckk   ",
  "   kkcccccck    ",
  "    kcCCCck     ",
  "    kcCCCck     ",
  "    kk   kk     ",
  "    kh   hk     ",
  "    kh   hk     ",
  "    kk   kk     ",
]);

// Arin mid-step (legs apart) for the walk frame.
const ARIN_WALK = grid([
  "                ",
  "      kkkk      ",
  "     khhhhk     ",
  "     hssssh     ",
  "     ksssesk    ",
  "     kssssk     ",
  "    kkccckkk    ",
  "   kclcccclk    ",
  "  gGkcccccckb   ",
  "  gGkclcclckb   ",
  "  gGkcccccckk   ",
  "   kkcccccck    ",
  "    kcCCCck     ",
  "    kcCCCck     ",
  "   kk    kk     ",
  "  kh      hk    ",
  " kh       hk    ",
  " kk        kk   ",
]);

// ── Bori: glowing fox-spirit companion (16x14) ──────────────────────────────
const BORI = grid([
  "   f        f   ",
  "   fo      of   ",
  "   ook    koo   ",
  "  fooooooooof   ",
  "  fokooooookof  ",
  "  foeooooooeof  ",
  "  fooowwwooof   ",
  "   fowwwwwof    ",
  "   foowwwoof    ",
  "    fooooof  ff ",
  "     fooof ffff ",
  "      fff fff   ",
  "       f f      ",
  "                ",
]);

// ── Village Elder: long robe + gat hat + white beard (14x18) ────────────────
const ELDER = grid([
  "    ttttt     ",
  "   ttttttt    ",
  "  tttttttt    ",
  "    ssss      ",
  "   ksssek     ",
  "   ksssk      ",
  "   kWWWk      ",
  "  kvvvvvk     ",
  "  kvVvVvk     ",
  "  kvvvvvk     ",
  "  kvVvVvk     ",
  "  kvvvvvk     ",
  "  kvVvVvk     ",
  "  kvvvvvk     ",
  "  kvVvVvk     ",
  "  kvvvvvk     ",
  "  kk   kk     ",
  "  kk   kk     ",
]);

// ── Shopkeeper: red robe + headband (14x18) ─────────────────────────────────
const SHOPKEEPER = grid([
  "              ",
  "   ggggg      ",
  "  kssssssk    ",
  "  ksssesk     ",
  "  kssssk      ",
  "  kssssk      ",
  "  krrrrrk     ",
  "  krRrRrk     ",
  " kgrrrrrgk    ",
  "  krrrrrk     ",
  "  krRrRrk     ",
  "  krrrrrk     ",
  "  krRrRrk     ",
  "  krrrrrk     ",
  "  krrrrrk     ",
  "  krRrRrk     ",
  "  kk   kk     ",
  "  kk   kk     ",
]);

// ── Gate Guard: steel armor + spear (16x18) ─────────────────────────────────
const GUARD = grid([
  "              n ",
  "   kmmmk     nn ",
  "  kssssk     n  ",
  "  ksssek     m  ",
  "  kssssk     m  ",
  " kkmmmmmkk   m  ",
  " kmnmmmnmk   m  ",
  " kmmmmmmmk   m  ",
  " kmMmmmMmk   m  ",
  " kmmmmmmmk   m  ",
  "  kmMmMmk    m  ",
  "  kmmmmmk    m  ",
  "  kmMmMmk    m  ",
  "  kmmmmmk    m  ",
  "  kMm mMk    m  ",
  "  kMk kMk    b  ",
  "  kMk kMk    b  ",
  "  kk   kk       ",
]);

// ── Village Child: small, capped (14x14) ────────────────────────────────────
const CHILD = grid([
  "              ",
  "              ",
  "   ttttt      ",
  "  kssssk      ",
  "  ksesesk     ",
  "  kssssk      ",
  "  kddddk      ",
  " kgddddgk     ",
  "  kddddk      ",
  "  kdDdDk      ",
  "  kddddk      ",
  "  kk  kk      ",
  "  kk  kk      ",
  "              ",
]);

// ── Silence Wisp boss: swirling fog with hollow violet eyes (18x16) ─────────
const WISP = grid([
  "    QQ    QQ      ",
  "   QqqQ  QqqQ     ",
  "  QqqqqqqqqqqQ    ",
  " QqqqqqqqqqqqqQ   ",
  " QqqppqqqqppqqQ   ",
  "QqqppqqqqqqppqqQ  ",
  "QqqqqqqqqqqqqqqQ  ",
  "QqqqqqqqqqqqqqqQ  ",
  " QqqqqQQQqqqqqQ   ",
  " QqqqqqqqqqqqqQ   ",
  "  QqqqqqqqqqqQ    ",
  "   QqqqqqqqqQ     ",
  "    QqqQqqqQ      ",
  "     QqQ Qq       ",
  "      Q  Q        ",
  "                  ",
]);

export const SPRITES: Record<SpriteName, PixelGrid> = {
  arin: ARIN,
  arinWalk: ARIN_WALK,
  bori: BORI,
  elder: ELDER,
  shopkeeper: SHOPKEEPER,
  guard: GUARD,
  child: CHILD,
  wisp: WISP,
};

export function getSprite(name: SpriteName): PixelGrid {
  return SPRITES[name];
}
