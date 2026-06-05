import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  type PlayerProgress,
  createNewProgress,
  loadProgress,
  saveProgress,
  hasSave,
  addXp as addXpFn,
  addCoins as addCoinsFn,
  loseHeart as loseHeartFn,
  refillHearts as refillHeartsFn,
  recordAnswer as recordAnswerFn,
  learnWord as learnWordFn,
  completeLesson as completeLessonFn,
  touchStreak as touchStreakFn,
  bumpDaily as bumpDailyFn,
} from "../data/playerProgress";
import type { AreaId } from "../data/gameData";

export type Screen =
  | "menu"
  | "onboarding"
  | "map"
  | "explore"
  | "battle"
  | "lessonComplete"
  | "streak"
  | "review"
  | "wordbook"
  | "quests"
  | "character"
  | "shop"
  | "settings"
  | "dailyQuest"
  | "ending";

export interface Settings {
  showRomanization: boolean;
  showEnglishHint: boolean;
  slowMode: boolean;
  largerText: boolean;
  textSpeed: "slow" | "normal" | "fast";
  sound: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  showRomanization: true,
  showEnglishHint: true,
  slowMode: false,
  largerText: false,
  textSpeed: "normal",
  sound: true,
};

interface GameStore {
  progress: PlayerProgress;
  screen: Screen;
  settings: Settings;
  hasSaveFile: boolean;

  setScreen: (s: Screen) => void;
  setSettings: (s: Partial<Settings>) => void;

  newGame: (level: string, name?: string) => void;
  continueGame: () => boolean;

  // mutations
  setArea: (a: AreaId) => void;
  setFlag: (flag: string) => void;
  advanceQuest: (toIndex: number) => void;
  addXp: (n: number) => { leveledUp: boolean; newLevel: number };
  addCoins: (n: number) => void;
  loseHeart: () => number;
  refillHearts: () => void;
  recordAnswer: (vocabId: string | undefined, correct: boolean) => void;
  learnWord: (vocabId: string) => void;
  completeLesson: (id: string) => void;
  touchStreak: () => { advanced: boolean; reset: boolean };
  bumpDaily: (dqId: string, by?: number) => void;
  addItem: (id: string, qty?: number) => void;
  buyShopItem: (id: string, price: number, kind: string) => boolean;

  saveNow: () => void;
  forceUpdate: () => void;
}

const Ctx = createContext<GameStore | null>(null);

export function GameStoreProvider({ children }: { children: ReactNode }) {
  const progressRef = useRef<PlayerProgress>(createNewProgress("beginner"));
  const [, setTick] = useState(0);
  const [screen, setScreen] = useState<Screen>("menu");
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [hasSaveFile] = useState<boolean>(() => (typeof window !== "undefined" ? hasSave() : false));

  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  const setSettings = useCallback((s: Partial<Settings>) => {
    setSettingsState((prev) => ({ ...prev, ...s }));
  }, []);

  const newGame = useCallback(
    (level: string, name = "Arin") => {
      progressRef.current = createNewProgress(level, name);
      saveProgress(progressRef.current);
      forceUpdate();
    },
    [forceUpdate],
  );

  const continueGame = useCallback(() => {
    const loaded = loadProgress();
    if (!loaded) return false;
    progressRef.current = loaded;
    forceUpdate();
    return true;
  }, [forceUpdate]);

  const setArea = useCallback(
    (a: AreaId) => {
      progressRef.current.currentArea = a;
      forceUpdate();
    },
    [forceUpdate],
  );

  const setFlag = useCallback(
    (flag: string) => {
      progressRef.current.flags[flag] = true;
      forceUpdate();
    },
    [forceUpdate],
  );

  const advanceQuest = useCallback(
    (toIndex: number) => {
      const p = progressRef.current;
      if (p.questIndex < toIndex) p.questIndex = toIndex;
      forceUpdate();
    },
    [forceUpdate],
  );

  const addXp = useCallback(
    (n: number) => {
      const r = addXpFn(progressRef.current, n);
      forceUpdate();
      return r;
    },
    [forceUpdate],
  );

  const addCoins = useCallback(
    (n: number) => {
      addCoinsFn(progressRef.current, n);
      forceUpdate();
    },
    [forceUpdate],
  );

  const loseHeart = useCallback(() => {
    const h = loseHeartFn(progressRef.current);
    forceUpdate();
    return h;
  }, [forceUpdate]);

  const refillHearts = useCallback(() => {
    refillHeartsFn(progressRef.current);
    forceUpdate();
  }, [forceUpdate]);

  const recordAnswer = useCallback(
    (vocabId: string | undefined, correct: boolean) => {
      recordAnswerFn(progressRef.current, vocabId, correct);
      forceUpdate();
    },
    [forceUpdate],
  );

  const learnWord = useCallback(
    (vocabId: string) => {
      learnWordFn(progressRef.current, vocabId);
      forceUpdate();
    },
    [forceUpdate],
  );

  const completeLesson = useCallback(
    (id: string) => {
      completeLessonFn(progressRef.current, id);
      forceUpdate();
    },
    [forceUpdate],
  );

  const touchStreak = useCallback(() => {
    const r = touchStreakFn(progressRef.current);
    forceUpdate();
    return r;
  }, [forceUpdate]);

  const bumpDaily = useCallback(
    (dqId: string, by = 1) => {
      bumpDailyFn(progressRef.current, dqId, by);
      forceUpdate();
    },
    [forceUpdate],
  );

  const addItem = useCallback(
    (id: string, qty = 1) => {
      const inv = progressRef.current.inventory;
      inv[id] = (inv[id] ?? 0) + qty;
      forceUpdate();
    },
    [forceUpdate],
  );

  const buyShopItem = useCallback(
    (id: string, price: number, kind: string) => {
      const p = progressRef.current;
      if (p.coins < price) return false;
      p.coins -= price;
      if (kind === "cosmetic" && id === "boriSnack") p.boriAffection += 1;
      p.inventory[id] = (p.inventory[id] ?? 0) + 1;
      saveProgress(p);
      forceUpdate();
      return true;
    },
    [forceUpdate],
  );

  const saveNow = useCallback(() => {
    saveProgress(progressRef.current);
    forceUpdate();
  }, [forceUpdate]);

  const value = useMemo<GameStore>(
    () => ({
      progress: progressRef.current,
      screen,
      settings,
      hasSaveFile,
      setScreen,
      setSettings,
      newGame,
      continueGame,
      setArea,
      setFlag,
      advanceQuest,
      addXp,
      addCoins,
      loseHeart,
      refillHearts,
      recordAnswer,
      learnWord,
      completeLesson,
      touchStreak,
      bumpDaily,
      addItem,
      buyShopItem,
      saveNow,
      forceUpdate,
    }),
    [
      screen,
      settings,
      hasSaveFile,
      setSettings,
      newGame,
      continueGame,
      setArea,
      setFlag,
      advanceQuest,
      addXp,
      addCoins,
      loseHeart,
      refillHearts,
      recordAnswer,
      learnWord,
      completeLesson,
      touchStreak,
      bumpDaily,
      addItem,
      buyShopItem,
      saveNow,
      forceUpdate,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame(): GameStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame must be used within GameStoreProvider");
  return ctx;
}
