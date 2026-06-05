import type { SkillDef } from "./types";

export const SKILLS: Record<string, SkillDef> = {
  flameSlash: {
    id: "flameSlash",
    name: "Flame Slash",
    spCost: 6,
    power: 1.55,
    element: "fire",
    uses: "atk",
    description: "A blade wreathed in ash-fire. Strong against Fire-weak foes.",
  },
  shieldBash: {
    id: "shieldBash",
    name: "Shield Bash",
    spCost: 4,
    power: 0.9,
    element: "sword",
    uses: "atk",
    description: "Low damage with a chance to stagger the target.",
    effect: "stun",
  },
  defiantGuard: {
    id: "defiantGuard",
    name: "Defiant Guard",
    spCost: 5,
    power: 0,
    element: "sword",
    uses: "atk",
    description: "Raise DEF sharply for two turns. The exile does not break.",
    effect: "defUp",
  },
  ashenStrike: {
    id: "ashenStrike",
    name: "Ashen Strike",
    spCost: 12,
    power: 2.4,
    element: "fire",
    uses: "atk",
    description: "A devastating single strike that remembers a burning throne.",
    locked: true,
  },
  // ── Enemy skills ──────────────────────────────────────────────────────────
  frostBite: {
    id: "frostBite",
    name: "Frost Bite",
    spCost: 0,
    power: 1.1,
    element: "ice",
    uses: "atk",
    description: "Freezing fangs.",
  },
  cutpurse: {
    id: "cutpurse",
    name: "Cutpurse Lunge",
    spCost: 0,
    power: 1.15,
    element: "sword",
    uses: "atk",
    description: "A quick, dirty thrust.",
  },
  chillWisp: {
    id: "chillWisp",
    name: "Chill Wisp",
    spCost: 0,
    power: 1.0,
    element: "ice",
    uses: "mag",
    description: "A cold spectral pulse.",
  },
  hollowSlam: {
    id: "hollowSlam",
    name: "Hollow Slam",
    spCost: 0,
    power: 1.35,
    element: "dark",
    uses: "atk",
    description: "A crushing blow from the black-sun core.",
  },
};

export function getSkill(id: string): SkillDef {
  return SKILLS[id];
}
