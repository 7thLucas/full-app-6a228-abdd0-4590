// ───────────────────────────────────────────────────────────────────────────
// Hangul Roads — player progress + localStorage save/load.
// Tracks streak, XP, level, coins, hearts, completed lessons, learned words,
// word mastery & memory strength, quest progress, current area, daily quests.
// ───────────────────────────────────────────────────────────────────────────

import {
  levelForXp,
  type MasteryLevel,
  type MemoryStrength,
  VOCAB,
} from "./learningData";
import type { AreaId } from "./gameData";

const SAVE_KEY = "hangul-roads-save-v1";

export interface WordProgress {
  vocabId: string;
  mastery: MasteryLevel;
  strength: MemoryStrength;
  correctCount: number;
  wrongCount: number;
  learnedOn: string; // iso date
  lastReviewed: string; // iso date
}

export interface PlayerProgress {
  // identity
  learnerName: string;
  onboardingLevel: string; // chosen Korean level
  // currency / vitals
  xp: number;
  coins: number;
  hearts: number;
  maxHearts: number;
  // streak
  streak: number;
  lastLessonDate: string; // yyyy-mm-dd
  weekDays: boolean[]; // 7 booleans for current week's activity (Mon..Sun)
  dailyXp: number; // xp earned today
  dailyGoal: number;
  // learning
  completedLessons: string[];
  learnedWords: Record<string, WordProgress>;
  // story
  questIndex: number; // index into MAIN_QUEST.objectives
  currentArea: AreaId;
  // economy / inventory
  inventory: Record<string, number>;
  boriAffection: number;
  // daily quests
  dailyProgress: Record<string, number>;
  dailyClaimed: string[];
  // flags
  flags: Record<string, boolean>;
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function weekdayIndex(): number {
  // Mon=0 .. Sun=6
  const d = new Date().getDay(); // Sun=0..Sat=6
  return (d + 6) % 7;
}

export function createNewProgress(level: string, name = "Arin"): PlayerProgress {
  const week = [false, false, false, false, false, false, false];
  return {
    learnerName: name,
    onboardingLevel: level,
    xp: 0,
    coins: 50,
    hearts: 5,
    maxHearts: 5,
    streak: 0,
    lastLessonDate: "",
    weekDays: week,
    dailyXp: 0,
    dailyGoal: 50,
    completedLessons: [],
    learnedWords: {},
    questIndex: 0,
    currentArea: "shrine",
    inventory: {},
    boriAffection: 0,
    dailyProgress: {},
    dailyClaimed: [],
    flags: {},
  };
}

export function saveProgress(p: PlayerProgress): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(p));
  } catch {
    // ignore quota / private-mode errors
  }
}

export function loadProgress(): PlayerProgress | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlayerProgress;
    // light migration / defaults
    return { ...createNewProgress(parsed.onboardingLevel || "beginner"), ...parsed };
  } catch {
    return null;
  }
}

export function hasSave(): boolean {
  try {
    return !!localStorage.getItem(SAVE_KEY);
  } catch {
    return false;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
}

// ── Streak handling ──────────────────────────────────────────────────────────
// Returns whether the streak advanced (for celebration UI).
export function touchStreak(p: PlayerProgress): { advanced: boolean; reset: boolean } {
  const today = todayStr();
  if (p.lastLessonDate === today) return { advanced: false, reset: false };

  let reset = false;
  if (p.lastLessonDate) {
    const last = new Date(p.lastLessonDate);
    const now = new Date(today);
    const diff = Math.round((now.getTime() - last.getTime()) / 86400000);
    if (diff === 1) {
      p.streak += 1;
    } else if (diff > 1) {
      p.streak = 1;
      reset = true;
    }
  } else {
    p.streak = 1;
  }
  p.lastLessonDate = today;
  p.weekDays[weekdayIndex()] = true;
  return { advanced: true, reset };
}

// ── Word mastery progression ─────────────────────────────────────────────────
const MASTERY_ORDER: MasteryLevel[] = ["New", "Practiced", "Familiar", "Strong", "Mastered"];
const STRENGTH_ORDER: MemoryStrength[] = ["Weak", "Medium", "Strong"];

export function learnWord(p: PlayerProgress, vocabId: string): void {
  if (!VOCAB.find((v) => v.id === vocabId)) return;
  if (p.learnedWords[vocabId]) return;
  p.learnedWords[vocabId] = {
    vocabId,
    mastery: "New",
    strength: "Medium",
    correctCount: 0,
    wrongCount: 0,
    learnedOn: todayStr(),
    lastReviewed: todayStr(),
  };
}

export function recordAnswer(p: PlayerProgress, vocabId: string | undefined, correct: boolean): void {
  if (!vocabId) return;
  learnWord(p, vocabId);
  const w = p.learnedWords[vocabId];
  if (!w) return;
  w.lastReviewed = todayStr();
  if (correct) {
    w.correctCount += 1;
    const mi = Math.min(MASTERY_ORDER.length - 1, MASTERY_ORDER.indexOf(w.mastery) + 1);
    w.mastery = MASTERY_ORDER[mi];
    const si = Math.min(STRENGTH_ORDER.length - 1, STRENGTH_ORDER.indexOf(w.strength) + 1);
    w.strength = STRENGTH_ORDER[si];
  } else {
    w.wrongCount += 1;
    const si = Math.max(0, STRENGTH_ORDER.indexOf(w.strength) - 1);
    w.strength = STRENGTH_ORDER[si];
  }
}

export function loseHeart(p: PlayerProgress): number {
  p.hearts = Math.max(0, p.hearts - 1);
  return p.hearts;
}

export function refillHearts(p: PlayerProgress): void {
  p.hearts = p.maxHearts;
}

export function addXp(p: PlayerProgress, amount: number): { leveledUp: boolean; newLevel: number } {
  const before = levelForXp(p.xp).level;
  p.xp += amount;
  p.dailyXp += amount;
  const after = levelForXp(p.xp).level;
  return { leveledUp: after > before, newLevel: after };
}

export function addCoins(p: PlayerProgress, amount: number): void {
  p.coins = Math.max(0, p.coins + amount);
}

export function completeLesson(p: PlayerProgress, lessonId: string): void {
  if (!p.completedLessons.includes(lessonId)) p.completedLessons.push(lessonId);
}

export function bumpDaily(p: PlayerProgress, dqId: string, by = 1): void {
  p.dailyProgress[dqId] = (p.dailyProgress[dqId] ?? 0) + by;
}

// Review helpers — weak words surface more often.
export function getDueWords(p: PlayerProgress): WordProgress[] {
  return Object.values(p.learnedWords).sort((a, b) => {
    const order = (s: MemoryStrength) => STRENGTH_ORDER.indexOf(s);
    return order(a.strength) - order(b.strength);
  });
}
