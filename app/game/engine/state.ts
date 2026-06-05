import type { AreaId, EquipSlot, Stats } from "../data/types";
import { KAEL } from "../data/characters";
import { ITEMS } from "../data/items";

// ── Runtime player state ─────────────────────────────────────────────────────
export interface PlayerState {
  characterId: string;
  level: number;
  exp: number;
  expToNext: number;
  hp: number;
  maxHp: number;
  sp: number;
  maxSp: number;
  // base stats (grow on level up); equipment bonuses are layered on read
  atk: number;
  def: number;
  mag: number;
  spd: number;
  crit: number;
  coins: number;
  inventory: Record<string, number>; // itemId -> qty
  equipment: Record<EquipSlot, string | null>;
  unlockedSkills: string[];
}

export interface WorldState {
  area: AreaId;
  x: number;
  y: number;
  facing: "up" | "down" | "left" | "right";
}

export interface GameState {
  player: PlayerState;
  world: WorldState;
  flags: Record<string, boolean>;
  questIndex: number; // active objective index in MAIN_QUEST
  visitedAreas: AreaId[];
  savedAt?: number;
}

export const STARTING_AREA: AreaId = "chapel";

export function createNewGame(startingCoins: number): GameState {
  const base = KAEL.baseStats;
  const player: PlayerState = {
    characterId: KAEL.id,
    level: 1,
    exp: 0,
    expToNext: 100,
    hp: base.hp,
    maxHp: base.hp,
    sp: base.sp,
    maxSp: base.sp,
    atk: base.atk,
    def: base.def,
    mag: base.mag,
    spd: base.spd,
    crit: base.crit,
    coins: startingCoins,
    inventory: { healingHerb: 1, spiritPlum: 1 },
    equipment: {
      weapon: "rustedSword",
      shield: "oldShield",
      armor: "travelersCoat",
      accessory: null,
    },
    unlockedSkills: ["flameSlash", "shieldBash", "defiantGuard"],
  };
  return {
    player,
    world: { area: STARTING_AREA, x: 7, y: 7, facing: "down" },
    flags: {},
    questIndex: 0,
    visitedAreas: [STARTING_AREA],
  };
}

// Effective stats include equipment bonuses.
export function effectiveStats(p: PlayerState): Stats {
  const s: Stats = {
    hp: p.maxHp,
    sp: p.maxSp,
    atk: p.atk,
    def: p.def,
    mag: p.mag,
    spd: p.spd,
    crit: p.crit,
  };
  (Object.values(p.equipment) as (string | null)[]).forEach((id) => {
    if (!id) return;
    const bonus = ITEMS[id]?.bonus;
    if (!bonus) return;
    (Object.keys(bonus) as (keyof Stats)[]).forEach((k) => {
      s[k] = (s[k] ?? 0) + (bonus[k] ?? 0);
    });
  });
  return s;
}

// ── Persistence ──────────────────────────────────────────────────────────────
const SAVE_KEY = "coer_save_v1";

export function saveGame(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    const payload: GameState = { ...state, savedAt: Date.now() };
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  } catch {
    // storage may be unavailable; fail silently
  }
}

export function loadGame(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function hasSave(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(SAVE_KEY);
}

export function clearSave(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SAVE_KEY);
}

// ── Leveling ─────────────────────────────────────────────────────────────────
export interface LevelUpResult {
  leveled: boolean;
  newLevel: number;
  gains: { hp: number; sp: number; atk: number; def: number };
}

export function applyExp(p: PlayerState, exp: number): LevelUpResult {
  p.exp += exp;
  const result: LevelUpResult = {
    leveled: false,
    newLevel: p.level,
    gains: { hp: 0, sp: 0, atk: 0, def: 0 },
  };
  while (p.exp >= p.expToNext) {
    p.exp -= p.expToNext;
    p.level += 1;
    const hpGain = 18;
    const spGain = 6;
    const atkGain = 4;
    const defGain = 3;
    p.maxHp += hpGain;
    p.maxSp += spGain;
    p.atk += atkGain;
    p.def += defGain;
    // restore some on level up
    p.hp = Math.min(p.maxHp, p.hp + Math.floor(p.maxHp * 0.4));
    p.sp = Math.min(p.maxSp, p.sp + Math.floor(p.maxSp * 0.4));
    p.expToNext = Math.round(p.expToNext * 1.6);
    result.leveled = true;
    result.newLevel = p.level;
    result.gains.hp += hpGain;
    result.gains.sp += spGain;
    result.gains.atk += atkGain;
    result.gains.def += defGain;
  }
  return result;
}
