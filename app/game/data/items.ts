import type { ItemDef } from "./types";

export const ITEMS: Record<string, ItemDef> = {
  healingHerb: {
    id: "healingHerb",
    name: "Healing Herb",
    category: "consumable",
    description: "A frost-hardy leaf. Restores 50 HP.",
    price: 20,
    healHp: 50,
  },
  spiritPlum: {
    id: "spiritPlum",
    name: "Spirit Plum",
    category: "consumable",
    description: "A bitter, glowing fruit. Restores 20 SP.",
    price: 35,
    healSp: 20,
  },
  antidote: {
    id: "antidote",
    name: "Antidote",
    category: "consumable",
    description: "Cures poison. (Status placeholder.)",
    price: 15,
    cure: "poison",
  },
  // ── Equipment ─────────────────────────────────────────────────────────────
  rustedSword: {
    id: "rustedSword",
    name: "Rusted Sword",
    category: "weapon",
    slot: "weapon",
    description: "Edrin's old blade. Notched, but it remembers how to cut.",
    price: 0,
    bonus: { atk: 4 },
  },
  oldShield: {
    id: "oldShield",
    name: "Old Shield",
    category: "shield",
    slot: "shield",
    description: "A dented chapel relic. Better than bare arms.",
    price: 0,
    bonus: { def: 3 },
  },
  travelersCoat: {
    id: "travelersCoat",
    name: "Traveler's Coat",
    category: "armor",
    slot: "armor",
    description: "Thick wool against the snow.",
    price: 0,
    bonus: { def: 2, hp: 8 },
  },
  travelersCharm: {
    id: "travelersCharm",
    name: "Traveler's Charm",
    category: "accessory",
    slot: "accessory",
    description: "A worn-smooth token. Steadies the hand. +SPD, +Crit.",
    price: 80,
    bonus: { spd: 3, crit: 4 },
  },
};

export function getItem(id: string): ItemDef {
  return ITEMS[id];
}

// Merchant shop stock (Veyrhold).
export const SHOP_STOCK: string[] = ["healingHerb", "spiritPlum", "travelersCharm"];
