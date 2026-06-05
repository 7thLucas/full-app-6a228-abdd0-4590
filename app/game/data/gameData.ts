// ───────────────────────────────────────────────────────────────────────────
// Hangul Roads — world data: areas, NPCs, enemies, quests, items, shop.
// Original Korean-inspired fantasy. No copyrighted content.
// ───────────────────────────────────────────────────────────────────────────

export type AreaTheme = "shrine" | "village" | "gate";
export type AreaId = "shrine" | "village" | "gate";

export interface NpcDef {
  id: string;
  name: string;
  sprite: "elder" | "shopkeeper" | "guard" | "child" | "bori";
  // worldX as a fraction of the area's walkable corridor (0..1)
  atFrac: number;
  line: string; // ambient greeting
  korean?: string; // korean phrase they teach
  teachesVocabId?: string;
  lessonId?: string; // lesson to trigger
  exit?: AreaId; // if this NPC is actually an exit gate
  exitLabel?: string;
}

export interface AreaDef {
  id: AreaId;
  name: string;
  theme: AreaTheme;
  goal: string;
  npcs: NpcDef[];
  exitTo?: AreaId;
  exitLabel?: string;
}

// ── Areas (3 playable) ───────────────────────────────────────────────────────
export const AREAS: Record<AreaId, AreaDef> = {
  shrine: {
    id: "shrine",
    name: "Letter Shrine",
    theme: "shrine",
    goal: "Learn ㅏ and ㅓ with Bori",
    npcs: [
      {
        id: "bori",
        name: "Bori",
        sprite: "bori",
        atFrac: 0.2,
        line: "Hi traveler! I'm Bori. Touch the glowing letters to learn them.",
      },
      {
        id: "letter-a",
        name: "Floating ㅏ",
        sprite: "elder",
        atFrac: 0.38,
        line: "The letter ㅏ glows softly. It sounds like \"a\".",
        lessonId: "l1",
      },
      {
        id: "letter-eo",
        name: "Floating ㅓ",
        sprite: "elder",
        atFrac: 0.52,
        line: "The letter ㅓ hums quietly. It sounds like \"eo\".",
        lessonId: "l2",
      },
      {
        id: "stone-tablet",
        name: "Stone Tablet",
        sprite: "elder",
        atFrac: 0.66,
        line: "An ancient tablet shows ㄱ + ㅏ. Build the syllable 가.",
        lessonId: "l3",
      },
    ],
    exitTo: "village",
    exitLabel: "Dawn Village",
  },
  village: {
    id: "village",
    name: "Dawn Village",
    theme: "village",
    goal: "Greet the villagers in Korean",
    npcs: [
      {
        id: "elder",
        name: "Village Elder",
        sprite: "elder",
        atFrac: 0.28,
        line: "안녕하세요, traveler. That means Hello.",
        korean: "안녕하세요",
        teachesVocabId: "annyeong",
        lessonId: "l4",
      },
      {
        id: "shopkeeper",
        name: "Shopkeeper",
        sprite: "shopkeeper",
        atFrac: 0.44,
        line: "감사합니다 for visiting! That means Thank you.",
        korean: "감사합니다",
        teachesVocabId: "gamsa",
        lessonId: "l5",
      },
      {
        id: "guard",
        name: "Gate Guard",
        sprite: "guard",
        atFrac: 0.6,
        line: "네 means Yes, 아니요 means No. Learn them to pass.",
        korean: "네 / 아니요",
        teachesVocabId: "ne",
        lessonId: "l6",
      },
      {
        id: "child",
        name: "Village Child",
        sprite: "child",
        atFrac: 0.74,
        line: "What's your name? Say 저는 [name]입니다!",
        korean: "저는 ...입니다",
        teachesVocabId: "jeoneun",
        lessonId: "l7",
      },
    ],
    exitTo: "gate",
    exitLabel: "The Silent Gate",
  },
  gate: {
    id: "gate",
    name: "The Silent Gate",
    theme: "gate",
    goal: "Defeat the Silence Wisp",
    npcs: [
      {
        id: "silence-wisp",
        name: "Silence Wisp",
        sprite: "bori",
        atFrac: 0.6,
        line: "A swirl of black fog blocks the gate. Letters flicker inside it.",
        lessonId: "l8",
      },
    ],
  },
};

export function getArea(id: AreaId): AreaDef {
  return AREAS[id];
}

// ── Enemies ──────────────────────────────────────────────────────────────────
export interface EnemyDef {
  id: string;
  name: string;
  hp: number;
  weakness: string; // descriptive
  confusionShield: number; // Meaning Break shield
  questionIds: string[]; // questions used in this battle
  isBoss: boolean;
  flavor: string;
}

export const ENEMIES: Record<string, EnemyDef> = {
  silenceWisp: {
    id: "silenceWisp",
    name: "Silence Wisp",
    hp: 100,
    weakness: "Greetings & correct Hangul sounds",
    confusionShield: 3,
    questionIds: ["q1", "q5", "q10", "q2", "q3", "q15", "q6", "q14"],
    isBoss: true,
    flavor: "A whirl of black fog that smothers words. Answer in Korean to break it.",
  },
  forgottenLetter: {
    id: "forgottenLetter",
    name: "Forgotten Letter",
    hp: 60,
    weakness: "Hangul sound matching",
    confusionShield: 2,
    questionIds: ["q5", "q6", "q7"],
    isBoss: false,
    flavor: "A broken glowing letter that forgot its own sound.",
  },
};

export function getEnemy(id: string): EnemyDef | undefined {
  return ENEMIES[id];
}

// ── Items / Shop ─────────────────────────────────────────────────────────────
export interface ShopItem {
  id: string;
  name: string;
  korean?: string;
  description: string;
  price: number;
  kind: "hint" | "heart" | "xp" | "cosmetic";
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "hintTea",
    name: "Hint Tea",
    description: "Brew of clarity. Reveals one free hint in a lesson.",
    price: 20,
    kind: "hint",
  },
  {
    id: "memoryCharm",
    name: "Memory Charm",
    description: "Protects 1 heart from a wrong answer.",
    price: 35,
    kind: "heart",
  },
  {
    id: "focusLantern",
    name: "Focus Lantern",
    description: "Doubles XP for your next lesson.",
    price: 50,
    kind: "xp",
  },
  {
    id: "boriSnack",
    name: "Bori Snack",
    description: "A treat for Bori. +1 affection (cosmetic).",
    price: 15,
    kind: "cosmetic",
  },
  {
    id: "travelerCloak",
    name: "Traveler Cloak",
    description: "A warm cloak for Arin (cosmetic).",
    price: 80,
    kind: "cosmetic",
  },
];

export function getShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((s) => s.id === id);
}

// ── Main story quest ─────────────────────────────────────────────────────────
export interface QuestObjective {
  id: string;
  text: string;
  learning?: string;
}

export interface MainQuest {
  id: string;
  name: string;
  learningObjective: string;
  storyObjective: string;
  objectives: QuestObjective[];
  rewards: string;
}

export const MAIN_QUEST: MainQuest = {
  id: "restore-greeting",
  name: "Restore the First Greeting",
  learningObjective: "Read Hangul vowels & say your first Korean phrases.",
  storyObjective: "Rekindle the Letters of Light and reopen the Silent Gate.",
  objectives: [
    { id: "o1", text: "Meet Bori at the Letter Shrine", learning: "Meet your guide" },
    { id: "o2", text: "Learn the vowel ㅏ", learning: "ㅏ = a" },
    { id: "o3", text: "Learn the vowel ㅓ", learning: "ㅓ = eo" },
    { id: "o4", text: "Build your first syllable 가", learning: "ㄱ+ㅏ = 가" },
    { id: "o5", text: "Enter Dawn Village", learning: "Travel onward" },
    { id: "o6", text: "Respond to 안녕하세요", learning: "Hello" },
    { id: "o7", text: "Defeat the Silence Wisp", learning: "Use Korean in battle" },
    { id: "o8", text: "Complete your first daily lesson", learning: "Keep the Memory Flame alive" },
  ],
  rewards: "+80 XP, +40 coins, Traveler's title",
};

// ── Daily quests ─────────────────────────────────────────────────────────────
export interface DailyQuest {
  id: string;
  text: string;
  target: number;
  reward: { xp: number; coins: number };
}

export const DAILY_QUESTS: DailyQuest[] = [
  { id: "dq1", text: "Complete 1 lesson", target: 1, reward: { xp: 20, coins: 10 } },
  { id: "dq2", text: "Get 5 correct answers", target: 5, reward: { xp: 15, coins: 8 } },
  { id: "dq3", text: "Review 3 weak words", target: 3, reward: { xp: 12, coins: 6 } },
  { id: "dq4", text: "Win 1 battle", target: 1, reward: { xp: 25, coins: 15 } },
  { id: "dq5", text: "Keep your Memory Flame alive", target: 1, reward: { xp: 10, coins: 5 } },
];
