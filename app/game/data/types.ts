// ───────────────────────────────────────────────────────────────────────────
// Chronicles of the Eight Roads — shared game type definitions.
// Data-driven foundation: every system reads from typed data files so the
// vertical slice can scale to all eight travelers and chapters.
// ───────────────────────────────────────────────────────────────────────────

export type ElementId =
  | "sword"
  | "fire"
  | "ice"
  | "light"
  | "dark"
  | "arcane"
  | "wind"
  | "earth"
  | "moonlight"
  | "lightning";

export type AreaId = "chapel" | "snowfield" | "veyrhold" | "shrine";

export type Affinity = "weak" | "resist" | "normal";

export interface Stats {
  hp: number;
  sp: number;
  atk: number;
  def: number;
  mag: number;
  spd: number;
  crit: number; // percent
}

export interface SkillDef {
  id: string;
  name: string;
  spCost: number;
  power: number; // multiplier applied to atk/mag
  element: ElementId;
  uses: "atk" | "mag";
  description: string;
  effect?: "stun" | "defUp";
  locked?: boolean; // unlocked after a flag
}

export interface CharacterDef {
  id: string;
  name: string;
  title: string;
  role: string;
  weapon: string;
  element: ElementId;
  hometown: string;
  motive: string;
  playable: boolean;
  baseStats: Stats;
  skillIds: string[];
}

export interface EnemyDef {
  id: string;
  name: string;
  stats: Stats;
  weaknesses: ElementId[];
  resists: ElementId[];
  expReward: number;
  coinReward: number;
  guardPoints: number; // > 0 enables Guard Shatter
  isBoss?: boolean;
  skillIds?: string[];
  spriteKind: "frostWolf" | "banditScout" | "iceWisp" | "hollowGuard";
}

export type ItemCategory = "consumable" | "weapon" | "shield" | "armor" | "accessory";
export type EquipSlot = "weapon" | "shield" | "armor" | "accessory";

export interface ItemDef {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  price: number; // shop price; 0 = not sold
  // consumable effects
  healHp?: number;
  healSp?: number;
  cure?: "poison";
  // equipment bonuses
  slot?: EquipSlot;
  bonus?: Partial<Stats>;
}

export interface QuestObjective {
  id: string;
  text: string;
}

export interface QuestDef {
  id: string;
  name: string;
  description: string;
  objectives: QuestObjective[];
}

export interface DialogueLine {
  speaker: string;
  portrait?: PortraitKind;
  text: string;
  choices?: { label: string; goto?: string }[];
}

export interface DialogueSequence {
  id: string;
  lines: DialogueLine[];
}

export type PortraitKind = "kael" | "edrin" | "townsfolk" | "merchant" | "voice" | "none";

// ── Map / world ────────────────────────────────────────────────────────────
export type InteractKind =
  | "npc"
  | "chest"
  | "door"
  | "examine"
  | "save"
  | "shop"
  | "lever"
  | "encounter"
  | "boss";

export interface MapInteractable {
  id: string;
  kind: InteractKind;
  x: number; // tile coords
  y: number;
  label: string;
  sprite?: PortraitKind | "chest" | "crystal" | "lever" | "poster" | "anvil" | "altar" | "bed" | "door" | "stall";
  dialogueId?: string;
  itemId?: string;
  qty?: number;
  enemyId?: string; // for encounter/boss
  target?: { area: AreaId; x: number; y: number }; // for doors
  flagRequired?: string; // only active if flag set
  flagBlocks?: string; // hidden once flag set
  oneShotFlag?: string; // set after first trigger
}

export interface MapDef {
  id: AreaId;
  name: string;
  width: number; // tiles
  height: number;
  tileSize: number;
  theme: "chapel" | "snow" | "town" | "shrine";
  // collision grid: 1 = blocked, 0 = walkable (row-major, height rows of width)
  collision: number[][];
  spawn: { x: number; y: number };
  interactables: MapInteractable[];
  ambientDialogueId?: string;
}
