import type { EnemyDef } from "./types";

export const ENEMIES: Record<string, EnemyDef> = {
  frostWolf: {
    id: "frostWolf",
    name: "Frost Wolf",
    stats: { hp: 45, sp: 0, atk: 12, def: 8, mag: 4, spd: 9, crit: 4 },
    weaknesses: ["sword", "fire"],
    resists: ["ice"],
    expReward: 25,
    coinReward: 12,
    guardPoints: 0,
    skillIds: ["frostBite"],
    spriteKind: "frostWolf",
  },
  banditScout: {
    id: "banditScout",
    name: "Bandit Scout",
    stats: { hp: 60, sp: 0, atk: 14, def: 9, mag: 3, spd: 11, crit: 6 },
    weaknesses: ["fire"],
    resists: [],
    expReward: 35,
    coinReward: 18,
    guardPoints: 0,
    skillIds: ["cutpurse"],
    spriteKind: "banditScout",
  },
  iceWisp: {
    id: "iceWisp",
    name: "Ice Wisp",
    stats: { hp: 40, sp: 10, atk: 9, def: 6, mag: 14, spd: 13, crit: 5 },
    weaknesses: ["sword", "light"],
    resists: ["ice"],
    expReward: 30,
    coinReward: 15,
    guardPoints: 0,
    skillIds: ["chillWisp"],
    spriteKind: "iceWisp",
  },
  hollowGuard: {
    id: "hollowGuard",
    name: "Hollow Guard",
    stats: { hp: 220, sp: 30, atk: 20, def: 16, mag: 12, spd: 7, crit: 8 },
    weaknesses: ["sword", "fire"],
    resists: ["dark", "ice"],
    expReward: 120,
    coinReward: 80,
    guardPoints: 3,
    isBoss: true,
    skillIds: ["hollowSlam"],
    spriteKind: "hollowGuard",
  },
};

export function getEnemy(id: string): EnemyDef {
  return ENEMIES[id];
}
