import type { DialogueSequence } from "./types";

export const DIALOGUES: Record<string, DialogueSequence> = {
  // ── Opening: Kael wakes in the chapel ─────────────────────────────────────
  opening: {
    id: "opening",
    lines: [
      { speaker: "", portrait: "none", text: "Cold. Stone. The smell of melted candle wax and old snow..." },
      { speaker: "Kael", portrait: "kael", text: "...Where— where am I? My head. A burning throne... a masked figure..." },
      { speaker: "Edrin", portrait: "edrin", text: "Easy, now. You've been asleep three days. I feared you wouldn't wake at all." },
      { speaker: "Kael", portrait: "kael", text: "Who are you? This place..." },
      { speaker: "Edrin", portrait: "edrin", text: "Edrin. A healer, or what's left of one. I found you half-frozen at the chapel door, bleeding into the snow." },
      { speaker: "Edrin", portrait: "edrin", text: "The soldiers are saying a knight murdered King Aldren. They're saying his name is Kael." },
      { speaker: "Kael", portrait: "kael", text: "...That's my name. But I didn't— I can't remember. Only the black sun." },
      { speaker: "Edrin", portrait: "edrin", text: "Then we have little time. Whatever you are, you're hunted now. Come — let me teach you to move on these old legs of stone." },
      { speaker: "Edrin", portrait: "edrin", text: "Use the arrow keys or W, A, S, D to walk. Press E or Enter near anything that glows to look closer. Press Esc for your menu." },
      { speaker: "Edrin", portrait: "edrin", text: "There's an old chest by the altar. Take what's inside — you'll need it. Then meet me at the door." },
    ],
  },

  edrinIdle: {
    id: "edrinIdle",
    lines: [
      { speaker: "Edrin", portrait: "edrin", text: "Take the herbs from the chest, then come to the door. The snow won't wait, and neither will the soldiers." },
    ],
  },

  edrinDoor: {
    id: "edrinDoor",
    lines: [
      { speaker: "Edrin", portrait: "edrin", text: "Beyond this door is the Snowfield Path. Veyrhold lies past it — your old home, now your hunting ground." },
      { speaker: "Edrin", portrait: "edrin", text: "Take this. A rusted sword and an old shield. They've kept me alive longer than I deserved." },
      { speaker: "Kael", portrait: "kael", text: "You're not coming?" },
      { speaker: "Edrin", portrait: "edrin", text: "An old man only slows the hunted. Go. Find the truth of that black sun — and remember who you were before they decided who you are." },
    ],
  },

  chestHerbs: {
    id: "chestHerbs",
    lines: [
      { speaker: "", portrait: "none", text: "Inside the chest: two Healing Herbs, frost-dried but still potent." },
    ],
  },

  examineAltar: {
    id: "examineAltar",
    lines: [
      { speaker: "Kael", portrait: "kael", text: "A broken altar. The stained glass above it shows eight roads branching from a single dying sun." },
    ],
  },

  examineBed: {
    id: "examineBed",
    lines: [
      { speaker: "Kael", portrait: "kael", text: "The cot where I slept for three days. The blanket still smells of woodsmoke and herbs." },
    ],
  },

  // ── Snowfield ─────────────────────────────────────────────────────────────
  snowfieldEnter: {
    id: "snowfieldEnter",
    lines: [
      { speaker: "Kael", portrait: "kael", text: "The cold bites through everything. Veyrhold's spires are just visible past the ridge... and something is moving in the snow ahead." },
    ],
  },

  frostWolfPre: {
    id: "frostWolfPre",
    lines: [
      { speaker: "", portrait: "none", text: "A low growl. An icy-blue shape uncoils from the drift — a Frost Wolf, hackles raised." },
      { speaker: "Kael", portrait: "kael", text: "So this is how it starts. Come on, then." },
    ],
  },

  // ── Veyrhold ──────────────────────────────────────────────────────────────
  veyrholdEnter: {
    id: "veyrholdEnter",
    lines: [
      { speaker: "Kael", portrait: "kael", text: "Veyrhold's outskirts. I grew up within these walls. Now my own face is nailed to a post." },
    ],
  },

  townsfolk1: {
    id: "townsfolk1",
    lines: [
      { speaker: "Townsfolk", portrait: "townsfolk", text: "Did you hear? The king's own knight did it. They say he had a black mark, like a sun gone out." },
      { speaker: "Townsfolk", portrait: "townsfolk", text: "Keep your hood up, stranger. The shrine to the east has been making noises again. Unnatural ones." },
    ],
  },

  townsfolk2: {
    id: "townsfolk2",
    lines: [
      { speaker: "Townsfolk", portrait: "townsfolk", text: "The blacksmith's gone quiet since the murder. Whole town's holding its breath." },
    ],
  },

  wantedPoster: {
    id: "wantedPoster",
    lines: [
      { speaker: "", portrait: "none", text: "WANTED — for the murder of King Aldren. A crude sketch of a scarred knight. The reward could buy a small village." },
      { speaker: "Kael", portrait: "kael", text: "That's... not even my face. They drew a monster. Maybe that's all they need me to be." },
    ],
  },

  blacksmith: {
    id: "blacksmith",
    lines: [
      { speaker: "Townsfolk", portrait: "townsfolk", text: "Forge's cold today. No new steel until the soldiers clear out. Come back another chapter, friend." },
    ],
  },

  merchantGreet: {
    id: "merchantGreet",
    lines: [
      { speaker: "Merchant", portrait: "merchant", text: "A traveler with coin and no questions — my favorite kind. Take a look. Herbs, plums, charms for the road ahead." },
    ],
  },

  saveCrystal: {
    id: "saveCrystal",
    lines: [
      { speaker: "", portrait: "none", text: "A pillar of pale blue light hums softly. Touching it steadies something inside you — a moment held against the dark." },
    ],
  },

  // ── Frozen Shrine ─────────────────────────────────────────────────────────
  shrineEnter: {
    id: "shrineEnter",
    lines: [
      { speaker: "Kael", portrait: "kael", text: "The Frozen Shrine. The cold here is wrong — older than weather. The black sun pulls me toward it like a thread in my chest." },
    ],
  },

  shrineLever: {
    id: "shrineLever",
    lines: [
      { speaker: "", portrait: "none", text: "An ancient lever, crusted in frost. You haul it down — and ahead, a sealed gate grinds open." },
      { speaker: "Kael", portrait: "kael", text: "Whatever's been making those sounds... it's just past that gate." },
    ],
  },

  shrineGateLocked: {
    id: "shrineGateLocked",
    lines: [
      { speaker: "Kael", portrait: "kael", text: "Sealed shut. There must be a lever somewhere in this hall." },
    ],
  },

  hollowGuardPre: {
    id: "hollowGuardPre",
    lines: [
      { speaker: "", portrait: "none", text: "In the heart of the shrine, a towering dark figure turns. Where its chest should be, a small black sun burns without light." },
      { speaker: "Hollow Guard", portrait: "voice", text: "...oath-bearer... you should not have woken..." },
      { speaker: "Kael", portrait: "kael", text: "It knows me. It KNOWS me. Then maybe it knows the truth — and I'll cut it out of you if I have to." },
    ],
  },

  // ── Ending cutscene ───────────────────────────────────────────────────────
  ending: {
    id: "ending",
    lines: [
      { speaker: "", portrait: "none", text: "The Hollow Guard collapses into ash and cold light. Silence. Then — a searing pain in Kael's right hand." },
      { speaker: "Kael", portrait: "kael", text: "What— agh— my hand—!" },
      { speaker: "", portrait: "none", text: "A mark burns itself into his skin: a black sun, ringed in dying fire. The same symbol from his shattered memory." },
      { speaker: "???", portrait: "voice", text: "One oath has awakened." },
      { speaker: "Kael", portrait: "kael", text: "Who's there?! Show yourself!" },
      { speaker: "???", portrait: "voice", text: "Seven remain. The roads are stirring, exile. You did not start this journey... you were chosen for it." },
      { speaker: "", portrait: "none", text: "The light fades. Kael stands alone in the frozen dark, hunted, marked — and, for the first time, certain his story is larger than a murder." },
    ],
  },
};

export function getDialogue(id: string): DialogueSequence | undefined {
  return DIALOGUES[id];
}
