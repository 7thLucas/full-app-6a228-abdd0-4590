// ───────────────────────────────────────────────────────────────────────────
// 2.5D world definitions for the HD-2D diorama explore scenes.
//
// Each area is authored in WORLD space (worldX horizontal, worldY depth) sized
// to roughly fill a 16:9 viewport plus depth. The ExploreScene projects these
// to screen via engine/projection.ts. NO tile grid — walkable space is a set of
// HAND-AUTHORED ROAD POLYGONS that narrow as they recede, branch toward
// crystals/NPCs, and connect via stair platforms. The player's feet are
// constrained to these polygons every frame (point-in-polygon); everything off
// the road (grass, trees, props, walls, water) is NOT walkable.
//
// The ground renderer paints ONLY the walkable polygons as carved road and the
// rest as off-road terrain, so the natural road communicates walkability with
// no debug outlines.
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

// Road-surface palette for the carved walkable polygons (drawn by groundPlane).
export interface RoadStyle {
  /** off-road terrain base (grass / dark field) painted under everything. */
  offBase: string;
  offShade: string;
  /** road surface fill, near→far for subtle depth shading. */
  roadNear: string;
  roadFar: string;
  /** road edge / curb tint. */
  curb: string;
  /** road speckle (cobbles / cracks). */
  speck: string;
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
  road: RoadStyle;
}

// ── helper builders ──────────────────────────────────────────────────────────
const rect = (x: number, y: number, w: number, d: number): BlockRect => ({ x, y, w, d });

// ════════════════════════════════════════════════════════════════════════════
// LETTER SHRINE — a narrow stone road begins wide at the lower foreground and
// NARROWS as it recedes toward the shrine gate in the back. Two side branches
// (left → ㅏ crystal, right → ㅓ crystal) and a stair platform up to ㅗ / ㅜ.
// Everything off the road (grass, flowers, trees, lantern bases, shrine walls)
// is NOT walkable.
// ════════════════════════════════════════════════════════════════════════════
function shrineWorld(): World2D {
  const area = getArea("shrine");
  const npcMap = Object.fromEntries(area.npcs.map((n) => [n.id, n]));
  const W = 1280;

  // Main spine: wide near the camera (front), narrowing toward the gate.
  const mainRoad: Polygon = [
    { x: 470, y: 545 }, // front-left
    { x: 800, y: 545 }, // front-right
    { x: 720, y: 250 }, // narrows mid
    { x: 700, y: 150 }, // approach to gate
    { x: 560, y: 150 },
    { x: 540, y: 250 },
  ];
  // Gate apron at the very back (small landing in front of the gate trigger).
  const gateApron: Polygon = [
    { x: 545, y: 165 },
    { x: 715, y: 165 },
    { x: 700, y: 95 },
    { x: 560, y: 95 },
  ];
  // Left branch → ㅏ crystal.
  const leftBranch: Polygon = [
    { x: 560, y: 470 },
    { x: 600, y: 470 },
    { x: 470, y: 210 },
    { x: 410, y: 210 },
  ];
  // Right branch → ㅓ crystal.
  const rightBranch: Polygon = [
    { x: 690, y: 470 },
    { x: 730, y: 470 },
    { x: 870, y: 230 },
    { x: 810, y: 230 },
  ];
  // Stair platform up to ㅗ / ㅜ (raised; sits to the right of the spine).
  const stairs: Polygon = [
    { x: 730, y: 320 },
    { x: 940, y: 300 },
    { x: 960, y: 200 },
    { x: 770, y: 220 },
  ];

  return {
    id: "shrine",
    theme: "shrine",
    width: W,
    depthNear: 90,
    depthFar: 560,
    spawn: { x: 635, y: 520 },
    walkable: [mainRoad, gateApron, leftBranch, rightBranch, stairs],
    blocks: [
      // shrine gate pillars (back center) — flank the apron
      rect(548, 110, 16, 26),
      rect(712, 110, 16, 26),
      // flanking trees
      rect(300, 300, 50, 28),
      rect(980, 300, 50, 28),
      // side lantern bases
      rect(450, 360, 18, 14),
      rect(820, 360, 18, 14),
    ],
    props: [
      { id: "gate", kind: "gate", worldX: 630, worldY: 80, worldZ: 0, scale: 1.25, light: "#ffe6a8" },
      { id: "tree-l", kind: "tree", worldX: 300, worldY: 300, canOcclude: true, scale: 1.15 },
      { id: "tree-r", kind: "tree", worldX: 980, worldY: 300, canOcclude: true, scale: 1.15, variant: 1 },
      { id: "tree-l2", kind: "tree", worldX: 220, worldY: 460, canOcclude: true, scale: 1.3 },
      { id: "tree-r2", kind: "tree", worldX: 1080, worldY: 460, canOcclude: true, scale: 1.3, variant: 1 },
      { id: "lantern-l", kind: "lantern", worldX: 450, worldY: 360, canOcclude: true, light: "#ffcf7a" },
      { id: "lantern-r", kind: "lantern", worldX: 820, worldY: 360, canOcclude: true, light: "#ffcf7a" },
      { id: "lantern-lf", kind: "lantern", worldX: 430, worldY: 520, canOcclude: true, light: "#ffcf7a" },
      { id: "lantern-rf", kind: "lantern", worldX: 850, worldY: 520, canOcclude: true, light: "#ffcf7a" },
      { id: "stone-a", kind: "stone", worldX: 520, worldY: 410, scale: 0.85 },
      { id: "stone-b", kind: "stone", worldX: 760, worldY: 410, scale: 0.8, variant: 1 },
      // floating vowel crystals — sit at the ends of branches / stair landing
      { id: "crystal-a", kind: "crystal", worldX: 440, worldY: 210, worldZ: 92, glyph: "ㅏ", glyphColor: "#9fe8ff", light: "#9fe8ff" },
      { id: "crystal-eo", kind: "crystal", worldX: 840, worldY: 230, worldZ: 84, glyph: "ㅓ", glyphColor: "#9fe8ff", light: "#9fe8ff" },
      { id: "crystal-o", kind: "crystal", worldX: 850, worldY: 230, worldZ: 118, glyph: "ㅗ", glyphColor: "#ffd98a", light: "#ffd98a" },
      { id: "crystal-u", kind: "crystal", worldX: 910, worldY: 250, worldZ: 96, glyph: "ㅜ", glyphColor: "#ffd98a", light: "#ffd98a" },
      // stone tablet on the stair platform
      { id: "tablet", kind: "tablet", worldX: 880, worldY: 280, canOcclude: true, scale: 1.0, glyph: "가" },
      // foreground flowers / grass (near camera, occlude)
      { id: "grass-fl", kind: "grass", worldX: 330, worldY: 545, canOcclude: true },
      { id: "grass-fr", kind: "grass", worldX: 960, worldY: 545, canOcclude: true, variant: 1 },
      { id: "flower-l", kind: "flower", worldX: 410, worldY: 545, canOcclude: true },
      { id: "flower-r", kind: "flower", worldX: 880, worldY: 548, canOcclude: true, variant: 1 },
    ],
    npcs: [],
    interactables: [
      { id: "i-a", kind: "lesson", worldX: 440, worldY: 210, worldZ: 92, radius: 80, label: "Learn ㅏ", lessonId: npcMap["letter-a"]?.lessonId, npcId: "letter-a" },
      { id: "i-eo", kind: "lesson", worldX: 840, worldY: 230, worldZ: 84, radius: 80, label: "Learn ㅓ", lessonId: npcMap["letter-eo"]?.lessonId, npcId: "letter-eo" },
      { id: "i-tablet", kind: "lesson", worldX: 880, worldY: 280, radius: 90, label: "Read the Stone Tablet", lessonId: npcMap["stone-tablet"]?.lessonId, npcId: "stone-tablet" },
      { id: "i-exit", kind: "exit", worldX: 630, worldY: 120, radius: 95, label: "Dawn Village", exitTo: "village", exitLabel: "Dawn Village" },
    ],
    lighting: {
      ambient: "#23314f",
      ambientStrength: 0.34,
      key: "#ffdca0",
      keyX: 0.5,
      keyY: 0.16,
      bloom: "#ffe6b0",
      fog: "#cfe0ff",
      fogStrength: 0.32,
      vignette: 0.44,
    },
    road: {
      offBase: "#2f4a39",
      offShade: "#22382b",
      roadNear: "#6a5c42",
      roadFar: "#8b8166",
      curb: "#cdbb88",
      speck: "#574a36",
    },
  };
}

// ════════════════════════════════════════════════════════════════════════════
// DAWN VILLAGE — a curved cobblestone road sweeps from the bottom-left
// foreground, curves through the middle, crosses a small bridge, and climbs to
// the town gate in the back-right. Shop-front side platforms branch off. NPCs
// stand ON the road. Off-road (rooftops, stream banks, fences, grass) is not
// walkable.
// ════════════════════════════════════════════════════════════════════════════
function villageWorld(): World2D {
  const area = getArea("village");
  const npcMap = Object.fromEntries(area.npcs.map((n) => [n.id, n]));
  const W = 1360;

  // Curved road: front-left → center → up to the gate (authored as a band).
  const roadA: Polygon = [
    { x: 110, y: 545 }, // front-left mouth (wide)
    { x: 360, y: 545 },
    { x: 470, y: 380 },
    { x: 540, y: 330 },
    { x: 470, y: 330 },
    { x: 360, y: 400 },
    { x: 230, y: 470 },
    { x: 110, y: 470 },
  ];
  // mid bend across the bridge
  const roadB: Polygon = [
    { x: 470, y: 360 },
    { x: 600, y: 330 },
    { x: 760, y: 300 },
    { x: 760, y: 250 },
    { x: 600, y: 280 },
    { x: 470, y: 320 },
  ];
  // climb to the gate (narrows as it recedes)
  const roadC: Polygon = [
    { x: 760, y: 295 },
    { x: 900, y: 250 },
    { x: 1080, y: 175 },
    { x: 1070, y: 130 },
    { x: 900, y: 205 },
    { x: 760, y: 250 },
  ];
  // gate landing at the back
  const gateLanding: Polygon = [
    { x: 1065, y: 175 },
    { x: 1180, y: 150 },
    { x: 1170, y: 110 },
    { x: 1060, y: 132 },
  ];
  // shop-front platform branching to the right (shopkeeper stands here).
  // Overlaps roadB near (640,300) so it is reachable from the main road.
  const shopFront: Polygon = [
    { x: 600, y: 300 },
    { x: 700, y: 270 },
    { x: 840, y: 360 },
    { x: 780, y: 410 },
    { x: 660, y: 400 },
    { x: 600, y: 360 },
  ];
  // small front plaza
  const plaza: Polygon = [
    { x: 120, y: 470 },
    { x: 360, y: 470 },
    { x: 320, y: 545 },
    { x: 110, y: 545 },
  ];

  return {
    id: "village",
    theme: "village",
    width: W,
    depthNear: 110,
    depthFar: 560,
    spawn: { x: 210, y: 510 },
    walkable: [roadA, roadB, roadC, gateLanding, shopFront, plaza],
    blocks: [
      // hanok stall behind the shop-front
      rect(820, 340, 50, 26),
      // building footprints (block walking)
      rect(300, 240, 90, 40),
      rect(900, 210, 80, 36),
      rect(560, 200, 70, 34),
      // stream banks flanking the bridge
      rect(630, 360, 30, 14),
    ],
    props: [
      // deep-bg hanok rooftops
      { id: "roof-1", kind: "rooftop", worldX: 300, worldY: 225, scale: 1.2 },
      { id: "roof-2", kind: "rooftop", worldX: 900, worldY: 205, scale: 1.1, variant: 1 },
      { id: "roof-3", kind: "rooftop", worldX: 560, worldY: 185, scale: 0.95, variant: 2 },
      // hanging lanterns along the road
      { id: "vlantern-1", kind: "lantern", worldX: 430, worldY: 330, worldZ: 64, light: "#ffb070" },
      { id: "vlantern-2", kind: "lantern", worldX: 720, worldY: 280, worldZ: 66, light: "#ffb070" },
      { id: "vlantern-3", kind: "lantern", worldX: 1010, worldY: 195, worldZ: 56, light: "#ffb070" },
      // shop sign with Hangul
      { id: "sign-1", kind: "sign", worldX: 840, worldY: 360, worldZ: 44, canOcclude: true, glyph: "가게", glyphColor: "#ffe6a8" },
      // shopkeeper stall (occluder behind the shop-front)
      { id: "stall", kind: "stall", worldX: 820, worldY: 340, canOcclude: true, scale: 1.1 },
      // small bridge over the stream
      { id: "bridge", kind: "bridge", worldX: 640, worldY: 300, canOcclude: false },
      // fences framing the road
      { id: "fence-l", kind: "fence", worldX: 260, worldY: 350, canOcclude: true },
      { id: "fence-r", kind: "fence", worldX: 1130, worldY: 300, canOcclude: true },
      // foreground branch occluder
      { id: "branch", kind: "tree", worldX: 150, worldY: 545, worldZ: 40, canOcclude: true, scale: 1.4 },
      { id: "tree-vr", kind: "tree", worldX: 1180, worldY: 470, canOcclude: true, scale: 1.3, variant: 1 },
      { id: "grass-vfl", kind: "grass", worldX: 420, worldY: 548, canOcclude: true },
      { id: "flower-vr", kind: "flower", worldX: 560, worldY: 550, canOcclude: true, variant: 1 },
    ],
    npcs: [
      {
        def: npcMap["elder"],
        worldX: 500,
        worldY: 350,
        facing: "down",
        canOcclude: true,
      },
      {
        def: npcMap["shopkeeper"],
        worldX: 730,
        worldY: 370,
        facing: "left",
        canOcclude: true,
      },
      {
        def: npcMap["guard"],
        worldX: 1110,
        worldY: 145,
        facing: "down",
        canOcclude: true,
      },
      {
        def: npcMap["child"],
        worldX: 300,
        worldY: 500,
        facing: "down",
        canOcclude: true,
        // small SAFE loop kept inside roadA / plaza
        patrol: [
          { x: 200, y: 500 },
          { x: 340, y: 520 },
          { x: 300, y: 460 },
        ],
        patrolSpeed: 1.1,
      },
    ],
    interactables: [
      { id: "i-elder", kind: "npc", worldX: 500, worldY: 350, radius: 88, label: "Talk to Village Elder", npcId: "elder", lessonId: npcMap["elder"]?.lessonId },
      { id: "i-shop", kind: "npc", worldX: 730, worldY: 370, radius: 88, label: "Talk to Shopkeeper", npcId: "shopkeeper", lessonId: npcMap["shopkeeper"]?.lessonId },
      { id: "i-guard", kind: "npc", worldX: 1110, worldY: 145, radius: 95, label: "Talk to Gate Guard", npcId: "guard", lessonId: npcMap["guard"]?.lessonId },
      { id: "i-child", kind: "npc", worldX: 300, worldY: 500, radius: 88, label: "Talk to Village Child", npcId: "child", lessonId: npcMap["child"]?.lessonId },
      { id: "i-exit", kind: "exit", worldX: 1120, worldY: 130, radius: 95, label: "The Silent Gate", exitTo: "gate", exitLabel: "The Silent Gate" },
    ],
    lighting: {
      ambient: "#3a2f3e",
      ambientStrength: 0.3,
      key: "#ffcf8a",
      keyX: 0.74,
      keyY: 0.22,
      bloom: "#ffba78",
      fog: "#e8d2b8",
      fogStrength: 0.24,
      vignette: 0.42,
    },
    road: {
      offBase: "#33402a",
      offShade: "#27331f",
      roadNear: "#4a3d2c",
      roadFar: "#7a7268",
      curb: "#d8b25a",
      speck: "#3a3022",
    },
  };
}

// ════════════════════════════════════════════════════════════════════════════
// SILENT GATE — a narrow, broken stone road runs from the foreground straight
// to the gate; the sides are dark grass, broken walls, and black fog (NOT
// walkable). A Silence Wisp lurks near the gate trigger zone.
// ════════════════════════════════════════════════════════════════════════════
function gateWorld(): World2D {
  const area = getArea("gate");
  const npcMap = Object.fromEntries(area.npcs.map((n) => [n.id, n]));
  const W = 1180;

  // Narrow broken road, slightly serpentine, narrowing toward the gate.
  const path: Polygon = [
    { x: 500, y: 555 }, // front mouth
    { x: 700, y: 555 },
    { x: 690, y: 400 },
    { x: 640, y: 280 },
    { x: 660, y: 160 },
    { x: 580, y: 160 },
    { x: 555, y: 280 },
    { x: 520, y: 400 },
  ];
  // gate apron at the back
  const apron: Polygon = [
    { x: 585, y: 175 },
    { x: 655, y: 175 },
    { x: 645, y: 110 },
    { x: 595, y: 110 },
  ];

  return {
    id: "gate",
    theme: "gate",
    width: W,
    depthNear: 100,
    depthFar: 560,
    spawn: { x: 600, y: 525 },
    walkable: [path, apron],
    blocks: [
      // the gate body
      rect(620, 95, 60, 22),
      // broken pillars flanking the approach
      rect(420, 330, 30, 20),
      rect(820, 330, 30, 20),
      rect(470, 470, 26, 18),
      rect(770, 470, 26, 18),
    ],
    props: [
      { id: "gate-big", kind: "gate", worldX: 620, worldY: 90, scale: 1.7, variant: 1, light: "#9a7ad0" },
      // broken floating Hangul fragments leaking from the gate
      { id: "frag-1", kind: "crystal", worldX: 530, worldY: 170, worldZ: 120, glyph: "ㅎ", glyphColor: "#b9a8e8", light: "#7a5ad0" },
      { id: "frag-2", kind: "crystal", worldX: 700, worldY: 200, worldZ: 98, glyph: "ㄴ", glyphColor: "#b9a8e8", light: "#7a5ad0" },
      { id: "frag-3", kind: "crystal", worldX: 620, worldY: 250, worldZ: 138, glyph: "ㄱ", glyphColor: "#caa8ff", light: "#7a5ad0" },
      // broken pillars (occluders)
      { id: "bpillar-l", kind: "brokenPillar", worldX: 420, worldY: 330, canOcclude: true },
      { id: "bpillar-r", kind: "brokenPillar", worldX: 820, worldY: 330, canOcclude: true, variant: 1 },
      { id: "bpillar-lf", kind: "brokenPillar", worldX: 470, worldY: 470, canOcclude: true, variant: 1 },
      { id: "bpillar-rf", kind: "brokenPillar", worldX: 770, worldY: 470, canOcclude: true },
      // distant lantern
      { id: "far-lantern", kind: "lantern", worldX: 300, worldY: 240, worldZ: 40, light: "#ffb070" },
      // foreground broken grass
      { id: "grass-gfl", kind: "grass", worldX: 430, worldY: 548, canOcclude: true, variant: 1 },
      { id: "grass-gfr", kind: "grass", worldX: 780, worldY: 550, canOcclude: true },
    ],
    npcs: [],
    interactables: [
      { id: "i-wisp", kind: "lesson", worldX: 620, worldY: 150, radius: 130, label: "Approach the Silent Gate", lessonId: npcMap["silence-wisp"]?.lessonId, npcId: "silence-wisp" },
    ],
    lighting: {
      ambient: "#1a1636",
      ambientStrength: 0.45,
      key: "#b8a8ff",
      keyX: 0.5,
      keyY: 0.12,
      bloom: "#9a7ad0",
      fog: "#2a2050",
      fogStrength: 0.52,
      vignette: 0.58,
    },
    road: {
      offBase: "#171430",
      offShade: "#0e0b22",
      roadNear: "#241d3a",
      roadFar: "#3a3158",
      curb: "#6a5ab0",
      speck: "#0d0820",
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
