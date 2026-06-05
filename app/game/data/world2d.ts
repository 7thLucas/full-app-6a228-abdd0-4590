// ───────────────────────────────────────────────────────────────────────────
// 2.5D world definitions for the HD-2D diorama explore scenes.
//
// Each area is authored in WORLD space (worldX horizontal, worldY depth) sized
// to roughly fill a 16:9 viewport plus depth. The ExploreScene projects these
// to screen via engine/projection.ts. NO tile grid — walkable space is a set of
// polygons; obstacles are blocking rects; props/NPCs/interactables are depth
// sorted by their depthAnchor (worldY).
// ───────────────────────────────────────────────────────────────────────────

import type { AreaId, AreaTheme, NpcDef } from "./gameData";
import { getArea } from "./gameData";
import type { BlockRect, Polygon } from "../engine/projection";

export type PropKind =
  | "lantern"
  | "tree"
  | "pillar"
  | "stone"
  | "tablet"
  | "stall"
  | "rooftop"
  | "fence"
  | "flower"
  | "grass"
  | "brokenPillar"
  | "gate"
  | "crystal"
  | "bridge"
  | "sign";

// A depth-sorted world object. Rendered by DepthSortedStage, sorted by worldY.
export interface WorldProp {
  id: string;
  kind: PropKind;
  worldX: number;
  worldY: number; // depth → also the depth anchor
  worldZ?: number; // elevation
  /** if true the prop can occlude the player when player is in front of it. */
  canOcclude?: boolean;
  /** visual tuning */
  scale?: number;
  variant?: number;
  /** floating Hangul (crystals / gate fragments) */
  glyph?: string;
  glyphColor?: string;
  /** local light tint emitted by this prop. */
  light?: string;
}

// An interactable in the world (lesson crystal, tablet, exit gate, npc proxy).
export interface Interactable {
  id: string;
  worldX: number;
  worldY: number;
  worldZ?: number;
  radius: number; // world-space interaction radius
  kind: "lesson" | "exit" | "npc" | "hint";
  label: string;
  npcId?: string; // links back to NpcDef
  lessonId?: string;
  exitTo?: AreaId;
  exitLabel?: string;
}

// NPC placed in world space, optionally patrolling between waypoints.
export interface WorldNpc {
  def: NpcDef;
  worldX: number;
  worldY: number;
  facing: "down" | "up" | "left" | "right";
  canOcclude?: boolean;
  /** patrol waypoints in world space (loops). */
  patrol?: { x: number; y: number }[];
  patrolSpeed?: number;
}

export interface LightingProfile {
  /** ambient color washed over the whole scene. */
  ambient: string;
  ambientStrength: number; // 0..1
  /** key light tint (sun/moon) painted as a soft radial from a corner. */
  key: string;
  keyX: number; // 0..1 viewport
  keyY: number;
  /** bloom tint for glows. */
  bloom: string;
  /** fog color + density. */
  fog: string;
  fogStrength: number; // 0..1
  vignette: number; // 0..1
}

export interface World2D {
  id: AreaId;
  theme: AreaTheme;
  /** world bounds (camera clamp). */
  width: number; // worldX extent
  depthNear: number; // smallest worldY (front)
  depthFar: number; // largest worldY (back)
  /** player spawn. */
  spawn: { x: number; y: number };
  walkable: Polygon[];
  blocks: BlockRect[];
  props: WorldProp[];
  npcs: WorldNpc[];
  interactables: Interactable[];
  lighting: LightingProfile;
}

// ── helper builders ──────────────────────────────────────────────────────────
const rect = (x: number, y: number, w: number, d: number): BlockRect => ({ x, y, w, d });

// ════════════════════════════════════════════════════════════════════════════
// LETTER SHRINE — stone courtyard receding upward toward a shrine gate; floating
// vowel crystals at varied depths; lanterns + trees frame the sides.
// ════════════════════════════════════════════════════════════════════════════
function shrineWorld(): World2D {
  const area = getArea("shrine");
  const npcMap = Object.fromEntries(area.npcs.map((n) => [n.id, n]));
  const W = 1280;
  // courtyard polygon: wide at the front (near camera), narrowing toward the
  // shrine gate in back → reads as a receding plaza.
  const courtyard: Polygon = [
    { x: 120, y: 80 },
    { x: 1160, y: 80 },
    { x: 1000, y: 560 },
    { x: 280, y: 560 },
  ];
  // raised step area toward the gate (still walkable)
  const steps: Polygon = [
    { x: 430, y: 40 },
    { x: 850, y: 40 },
    { x: 880, y: 120 },
    { x: 400, y: 120 },
  ];

  return {
    id: "shrine",
    theme: "shrine",
    width: W,
    depthNear: 80,
    depthFar: 560,
    spawn: { x: 640, y: 500 },
    walkable: [courtyard, steps],
    blocks: [
      // shrine gate pillars (back center)
      rect(560, 70, 26, 18),
      rect(720, 70, 26, 18),
      // flanking trees
      rect(210, 260, 48, 26),
      rect(1070, 260, 48, 26),
      // side lanterns
      rect(330, 200, 22, 16),
      rect(950, 200, 22, 16),
      // stone tablet (front-right)
      rect(870, 430, 40, 22),
    ],
    props: [
      { id: "gate", kind: "gate", worldX: 640, worldY: 55, worldZ: 0, scale: 1.25, light: "#ffe6a8" },
      { id: "tree-l", kind: "tree", worldX: 210, worldY: 260, canOcclude: true, scale: 1.15 },
      { id: "tree-r", kind: "tree", worldX: 1070, worldY: 260, canOcclude: true, scale: 1.15, variant: 1 },
      { id: "lantern-l", kind: "lantern", worldX: 330, worldY: 200, canOcclude: true, light: "#ffcf7a" },
      { id: "lantern-r", kind: "lantern", worldX: 950, worldY: 200, canOcclude: true, light: "#ffcf7a" },
      { id: "lantern-l2", kind: "lantern", worldX: 380, worldY: 420, canOcclude: true, light: "#ffcf7a" },
      { id: "lantern-r2", kind: "lantern", worldX: 900, worldY: 420, canOcclude: true, light: "#ffcf7a" },
      { id: "stone-a", kind: "stone", worldX: 480, worldY: 340, scale: 0.9 },
      { id: "stone-b", kind: "stone", worldX: 800, worldY: 300, scale: 0.8, variant: 1 },
      // floating vowel crystals at varied depth + elevation
      { id: "crystal-a", kind: "crystal", worldX: 470, worldY: 170, worldZ: 92, glyph: "ㅏ", glyphColor: "#9fe8ff", light: "#9fe8ff" },
      { id: "crystal-eo", kind: "crystal", worldX: 640, worldY: 210, worldZ: 80, glyph: "ㅓ", glyphColor: "#9fe8ff", light: "#9fe8ff" },
      { id: "crystal-o", kind: "crystal", worldX: 790, worldY: 160, worldZ: 100, glyph: "ㅗ", glyphColor: "#ffd98a", light: "#ffd98a" },
      { id: "crystal-u", kind: "crystal", worldX: 900, worldY: 250, worldZ: 70, glyph: "ㅜ", glyphColor: "#ffd98a", light: "#ffd98a" },
      // tablet
      { id: "tablet", kind: "tablet", worldX: 870, worldY: 430, canOcclude: true, scale: 1.0, glyph: "가" },
      // foreground flowers / grass (near camera, occlude)
      { id: "grass-fl", kind: "grass", worldX: 250, worldY: 540, canOcclude: true },
      { id: "grass-fr", kind: "grass", worldX: 1040, worldY: 540, canOcclude: true, variant: 1 },
      { id: "flower-l", kind: "flower", worldX: 400, worldY: 545, canOcclude: true },
      { id: "flower-r", kind: "flower", worldX: 880, worldY: 548, canOcclude: true, variant: 1 },
    ],
    npcs: [
      // Bori is the companion, rendered separately; keep elder-free shrine.
    ],
    interactables: [
      { id: "i-a", kind: "lesson", worldX: 470, worldY: 170, worldZ: 92, radius: 90, label: "Learn ㅏ", lessonId: npcMap["letter-a"]?.lessonId, npcId: "letter-a" },
      { id: "i-eo", kind: "lesson", worldX: 640, worldY: 210, worldZ: 80, radius: 90, label: "Learn ㅓ", lessonId: npcMap["letter-eo"]?.lessonId, npcId: "letter-eo" },
      { id: "i-tablet", kind: "lesson", worldX: 870, worldY: 430, radius: 95, label: "Read the Stone Tablet", lessonId: npcMap["stone-tablet"]?.lessonId, npcId: "stone-tablet" },
      { id: "i-exit", kind: "exit", worldX: 640, worldY: 95, radius: 110, label: "Dawn Village", exitTo: "village", exitLabel: "Dawn Village" },
    ],
    lighting: {
      ambient: "#23314f",
      ambientStrength: 0.34,
      key: "#ffdca0",
      keyX: 0.5,
      keyY: 0.18,
      bloom: "#ffe6b0",
      fog: "#cfe0ff",
      fogStrength: 0.3,
      vignette: 0.42,
    },
  };
}

// ════════════════════════════════════════════════════════════════════════════
// DAWN VILLAGE — hanok rooftops; a curved cobblestone road from lower-left
// foreground to upper-right background; villagers at varied depth.
// ════════════════════════════════════════════════════════════════════════════
function villageWorld(): World2D {
  const area = getArea("village");
  const npcMap = Object.fromEntries(area.npcs.map((n) => [n.id, n]));
  const W = 1340;
  // Curved road: a broad band sweeping from front-left up to back-right.
  const road: Polygon = [
    { x: 120, y: 540 },
    { x: 520, y: 560 },
    { x: 760, y: 300 },
    { x: 1180, y: 120 },
    { x: 1260, y: 200 },
    { x: 900, y: 380 },
    { x: 640, y: 560 },
    { x: 150, y: 560 },
  ];
  // small plaza near the front
  const plaza: Polygon = [
    { x: 120, y: 420 },
    { x: 560, y: 420 },
    { x: 560, y: 560 },
    { x: 120, y: 560 },
  ];

  return {
    id: "village",
    theme: "village",
    width: W,
    depthNear: 120,
    depthFar: 560,
    spawn: { x: 260, y: 520 },
    walkable: [road, plaza],
    blocks: [
      // hanok stall (foreground-right) — shopkeeper's
      rect(1010, 470, 60, 30),
      // elder stands mid-depth
      rect(560, 330, 24, 16),
      // guard upper-bg near the exit
      rect(1140, 175, 24, 16),
      // rooftops / building footprints (block walking)
      rect(300, 250, 90, 40),
      rect(880, 220, 80, 36),
      // stream / bridge sides
      rect(700, 470, 50, 18),
    ],
    props: [
      // deep-bg hanok rooftops
      { id: "roof-1", kind: "rooftop", worldX: 300, worldY: 230, scale: 1.2 },
      { id: "roof-2", kind: "rooftop", worldX: 880, worldY: 210, scale: 1.1, variant: 1 },
      { id: "roof-3", kind: "rooftop", worldX: 560, worldY: 180, scale: 0.95, variant: 2 },
      // hanging lanterns along the road
      { id: "vlantern-1", kind: "lantern", worldX: 430, worldY: 300, worldZ: 60, light: "#ffb070" },
      { id: "vlantern-2", kind: "lantern", worldX: 820, worldY: 250, worldZ: 64, light: "#ffb070" },
      { id: "vlantern-3", kind: "lantern", worldX: 1080, worldY: 180, worldZ: 56, light: "#ffb070" },
      // shop sign with Hangul
      { id: "sign-1", kind: "sign", worldX: 1010, worldY: 430, worldZ: 40, canOcclude: true, glyph: "가게", glyphColor: "#ffe6a8" },
      // shopkeeper stall (foreground occluder)
      { id: "stall", kind: "stall", worldX: 1010, worldY: 470, canOcclude: true, scale: 1.1 },
      // small bridge / stream
      { id: "bridge", kind: "bridge", worldX: 700, worldY: 470, canOcclude: true },
      // fences framing the road
      { id: "fence-l", kind: "fence", worldX: 200, worldY: 360, canOcclude: true },
      { id: "fence-r", kind: "fence", worldX: 1160, worldY: 320, canOcclude: true },
      // foreground roof-edge / branch occluder
      { id: "branch", kind: "tree", worldX: 160, worldY: 545, worldZ: 40, canOcclude: true, scale: 1.3 },
      { id: "grass-vfl", kind: "grass", worldX: 380, worldY: 548, canOcclude: true },
      { id: "flower-vr", kind: "flower", worldX: 600, worldY: 550, canOcclude: true, variant: 1 },
    ],
    npcs: [
      {
        def: npcMap["elder"],
        worldX: 560,
        worldY: 330,
        facing: "down",
        canOcclude: true,
      },
      {
        def: npcMap["shopkeeper"],
        worldX: 980,
        worldY: 440,
        facing: "left",
        canOcclude: true,
      },
      {
        def: npcMap["guard"],
        worldX: 1140,
        worldY: 175,
        facing: "down",
        canOcclude: true,
      },
      {
        def: npcMap["child"],
        worldX: 420,
        worldY: 460,
        facing: "down",
        canOcclude: true,
        patrol: [
          { x: 360, y: 480 },
          { x: 700, y: 360 },
          { x: 500, y: 520 },
        ],
        patrolSpeed: 1.3,
      },
    ],
    interactables: [
      { id: "i-elder", kind: "npc", worldX: 560, worldY: 330, radius: 95, label: "Talk to Village Elder", npcId: "elder", lessonId: npcMap["elder"]?.lessonId },
      { id: "i-shop", kind: "npc", worldX: 980, worldY: 440, radius: 95, label: "Talk to Shopkeeper", npcId: "shopkeeper", lessonId: npcMap["shopkeeper"]?.lessonId },
      { id: "i-guard", kind: "npc", worldX: 1140, worldY: 175, radius: 100, label: "Talk to Gate Guard", npcId: "guard", lessonId: npcMap["guard"]?.lessonId },
      { id: "i-child", kind: "npc", worldX: 420, worldY: 460, radius: 95, label: "Talk to Village Child", npcId: "child", lessonId: npcMap["child"]?.lessonId },
      { id: "i-exit", kind: "exit", worldX: 1200, worldY: 140, radius: 110, label: "The Silent Gate", exitTo: "gate", exitLabel: "The Silent Gate" },
    ],
    lighting: {
      ambient: "#3a2f3e",
      ambientStrength: 0.3,
      key: "#ffcf8a",
      keyX: 0.74,
      keyY: 0.22,
      bloom: "#ffba78",
      fog: "#e8d2b8",
      fogStrength: 0.22,
      vignette: 0.4,
    },
  };
}

// ════════════════════════════════════════════════════════════════════════════
// SILENT GATE — ancient stone gate at the far end; path curving from the
// foreground into the gate; broken floating Hangul; dark fog leaking out.
// ════════════════════════════════════════════════════════════════════════════
function gateWorld(): World2D {
  const area = getArea("gate");
  const npcMap = Object.fromEntries(area.npcs.map((n) => [n.id, n]));
  const W = 1180;
  const path: Polygon = [
    { x: 360, y: 560 },
    { x: 760, y: 560 },
    { x: 680, y: 90 },
    { x: 500, y: 90 },
  ];
  const apron: Polygon = [
    { x: 220, y: 470 },
    { x: 940, y: 470 },
    { x: 840, y: 560 },
    { x: 320, y: 560 },
  ];

  return {
    id: "gate",
    theme: "gate",
    width: W,
    depthNear: 90,
    depthFar: 560,
    spawn: { x: 580, y: 530 },
    walkable: [path, apron],
    blocks: [
      // the gate body
      rect(590, 75, 70, 22),
      // broken pillars flanking the approach
      rect(360, 300, 30, 20),
      rect(800, 300, 30, 20),
      rect(420, 470, 26, 18),
      rect(740, 470, 26, 18),
    ],
    props: [
      { id: "gate-big", kind: "gate", worldX: 590, worldY: 70, scale: 1.7, variant: 1, light: "#9a7ad0" },
      // broken floating Hangul fragments leaking from the gate
      { id: "frag-1", kind: "crystal", worldX: 500, worldY: 150, worldZ: 110, glyph: "ㅎ", glyphColor: "#b9a8e8", light: "#7a5ad0" },
      { id: "frag-2", kind: "crystal", worldX: 690, worldY: 180, worldZ: 90, glyph: "ㄴ", glyphColor: "#b9a8e8", light: "#7a5ad0" },
      { id: "frag-3", kind: "crystal", worldX: 600, worldY: 240, worldZ: 130, glyph: "ㄱ", glyphColor: "#caa8ff", light: "#7a5ad0" },
      // broken pillars (occluders)
      { id: "bpillar-l", kind: "brokenPillar", worldX: 360, worldY: 300, canOcclude: true },
      { id: "bpillar-r", kind: "brokenPillar", worldX: 800, worldY: 300, canOcclude: true, variant: 1 },
      { id: "bpillar-lf", kind: "brokenPillar", worldX: 420, worldY: 470, canOcclude: true, variant: 1 },
      { id: "bpillar-rf", kind: "brokenPillar", worldX: 740, worldY: 470, canOcclude: true },
      // distant village lanterns
      { id: "far-lantern", kind: "lantern", worldX: 250, worldY: 220, worldZ: 40, light: "#ffb070" },
      // foreground broken grass
      { id: "grass-gfl", kind: "grass", worldX: 380, worldY: 548, canOcclude: true, variant: 1 },
      { id: "grass-gfr", kind: "grass", worldX: 780, worldY: 550, canOcclude: true },
    ],
    npcs: [],
    interactables: [
      { id: "i-wisp", kind: "lesson", worldX: 590, worldY: 130, radius: 150, label: "Approach the Silent Gate", lessonId: npcMap["silence-wisp"]?.lessonId, npcId: "silence-wisp" },
    ],
    lighting: {
      ambient: "#1a1636",
      ambientStrength: 0.45,
      key: "#b8a8ff",
      keyX: 0.5,
      keyY: 0.14,
      bloom: "#9a7ad0",
      fog: "#2a2050",
      fogStrength: 0.5,
      vignette: 0.55,
    },
  };
}

const WORLDS: Record<AreaId, World2D> = {
  shrine: shrineWorld(),
  village: villageWorld(),
  gate: gateWorld(),
};

export function getWorld2D(id: AreaId): World2D {
  return WORLDS[id];
}
