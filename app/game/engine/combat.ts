import type { ElementId, EnemyDef, SkillDef, Stats } from "../data/types";
import { getEnemy } from "../data/enemies";
import { getSkill } from "../data/skills";

// Momentum spend levels -> damage multipliers (+20/+40/+70/+100/+150%).
export const MOMENTUM_BONUS = [0, 0.2, 0.4, 0.7, 1.0, 1.5];
export const MAX_MOMENTUM = 5;
export const SHATTER_DAMAGE_BONUS = 0.5; // +50% taken while Shattered

export interface CombatantStats {
  hp: number;
  maxHp: number;
  sp: number;
  maxSp: number;
  atk: number;
  def: number;
  mag: number;
  spd: number;
  crit: number;
}

export interface EnemyRuntime {
  def: EnemyDef;
  hp: number;
  maxHp: number;
  guardPoints: number;
  maxGuardPoints: number;
  shattered: boolean; // skips next action, takes +50%
  shatterTurns: number;
  defUpTurns: number;
}

export function makeEnemyRuntime(enemyId: string): EnemyRuntime {
  const def = getEnemy(enemyId);
  return {
    def,
    hp: def.stats.hp,
    maxHp: def.stats.hp,
    guardPoints: def.guardPoints,
    maxGuardPoints: def.guardPoints,
    shattered: false,
    shatterTurns: 0,
    defUpTurns: 0,
  };
}

export function affinityOf(enemy: EnemyDef, element: ElementId): "weak" | "resist" | "normal" {
  if (enemy.weaknesses.includes(element)) return "weak";
  if (enemy.resists.includes(element)) return "resist";
  return "normal";
}

export interface DamageResult {
  damage: number;
  crit: boolean;
  affinity: "weak" | "resist" | "normal";
  shatteredNow: boolean; // guard hit 0 this hit
}

// Compute damage from attacker -> enemy for a given element and base power.
export function computeDamageToEnemy(params: {
  atkStat: number;
  power: number;
  element: ElementId;
  critChance: number;
  enemy: EnemyRuntime;
  momentumLevel: number; // 0..5
}): DamageResult {
  const { atkStat, power, element, critChance, enemy, momentumLevel } = params;
  const affinity = affinityOf(enemy.def, element);

  let base = atkStat * power - enemy.def.stats.def * 0.5;
  if (enemy.defUpTurns > 0) base -= enemy.def.stats.def * 0.3;
  base = Math.max(1, base);

  let mult = 1;
  if (affinity === "weak") mult *= 1.6;
  if (affinity === "resist") mult *= 0.5;
  if (enemy.shattered) mult *= 1 + SHATTER_DAMAGE_BONUS;
  mult *= 1 + MOMENTUM_BONUS[momentumLevel];

  const crit = Math.random() * 100 < critChance;
  if (crit) mult *= 1.5;

  // small variance
  const variance = 0.92 + Math.random() * 0.16;
  let damage = Math.round(base * mult * variance);
  damage = Math.max(1, damage);

  // Guard Shatter: hitting a weakness removes one Guard Point.
  let shatteredNow = false;
  if (affinity === "weak" && enemy.guardPoints > 0 && !enemy.shattered) {
    enemy.guardPoints -= 1;
    if (enemy.guardPoints <= 0) {
      enemy.shattered = true;
      enemy.shatterTurns = 1;
      shatteredNow = true;
    }
  }

  return { damage, crit, affinity, shatteredNow };
}

// Enemy attacking the player.
export function computeDamageToPlayer(params: {
  enemy: EnemyRuntime;
  skill?: SkillDef;
  playerDef: number;
  playerDefUp: boolean;
}): { damage: number } {
  const { enemy, skill, playerDef, playerDefUp } = params;
  const stat = skill?.uses === "mag" ? enemy.def.stats.mag : enemy.def.stats.atk;
  const power = skill?.power ?? 1;
  let defStat = playerDef;
  if (playerDefUp) defStat *= 1.5;
  let base = stat * power - defStat * 0.5;
  base = Math.max(1, base);
  const variance = 0.9 + Math.random() * 0.2;
  return { damage: Math.max(1, Math.round(base * variance)) };
}

export function pickEnemySkill(enemy: EnemyRuntime): SkillDef | undefined {
  const ids = enemy.def.skillIds ?? [];
  if (ids.length === 0) return undefined;
  return getSkill(ids[Math.floor(Math.random() * ids.length)]);
}

// Flee chance based on relative speed.
export function fleeChance(playerSpd: number, enemySpd: number): number {
  const c = 0.5 + (playerSpd - enemySpd) * 0.05;
  return Math.min(0.95, Math.max(0.15, c));
}

export function statsFromCombatant(s: CombatantStats): Stats {
  return {
    hp: s.maxHp,
    sp: s.maxSp,
    atk: s.atk,
    def: s.def,
    mag: s.mag,
    spd: s.spd,
    crit: s.crit,
  };
}
