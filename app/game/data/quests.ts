import type { QuestDef } from "./types";

// The spine of Chapter 1. Objectives are ordered; the engine advances the
// active index as the player progresses, checking each off.
export const MAIN_QUEST: QuestDef = {
  id: "clearYourName",
  name: "Clear Your Name",
  description:
    "Accused of murdering King Aldren, Kael must escape the snowy region and find the truth behind the black sun.",
  objectives: [
    { id: "q1", text: "Speak with Edrin in the chapel." },
    { id: "q2", text: "Take the Healing Herbs from the chest." },
    { id: "q3", text: "Leave the chapel and cross the Snowfield Path." },
    { id: "q4", text: "Survive the Frost Wolf ambush." },
    { id: "q5", text: "Reach Veyrhold Outskirts and gather supplies." },
    { id: "q6", text: "Save your progress at the blue crystal." },
    { id: "q7", text: "Enter the Frozen Shrine and open the sealed gate." },
    { id: "q8", text: "Defeat the Hollow Guard." },
  ],
};

export const QUESTS: Record<string, QuestDef> = {
  clearYourName: MAIN_QUEST,
};
