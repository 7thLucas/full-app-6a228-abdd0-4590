import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AreaId } from "../data/types";
import {
  type GameState,
  createNewGame,
  loadGame,
  saveGame,
  applyExp,
  type LevelUpResult,
} from "./state";
import { MAIN_QUEST } from "../data/quests";
import { getItem } from "../data/items";

export type Screen =
  | "title"
  | "select"
  | "credits"
  | "settings"
  | "cutscene-open"
  | "explore"
  | "ending";

export interface Settings {
  master: number;
  music: number;
  sfx: number;
  textSpeed: "slow" | "normal" | "fast";
}

interface PendingBattle {
  enemyId: string;
  interactableId: string;
  isBoss: boolean;
  afterFlag?: string;
}

export interface BattleOutcome {
  result: "victory" | "defeat" | "flee";
  exp?: number;
  coins?: number;
  levelUp?: LevelUpResult;
}

interface GameStore {
  state: GameState;
  screen: Screen;
  settings: Settings;
  pendingBattle: PendingBattle | null;
  battleOutcome: BattleOutcome | null;

  setScreen: (s: Screen) => void;
  setSettings: (s: Partial<Settings>) => void;

  newGame: (startingCoins: number) => void;
  continueGame: () => boolean;

  // world mutations
  moveTo: (area: AreaId, x: number, y: number) => void;
  setPlayerTile: (x: number, y: number, facing: GameState["world"]["facing"]) => void;
  setFlag: (flag: string) => void;
  advanceQuest: (toIndex?: number) => void;

  // inventory / economy
  addItem: (itemId: string, qty: number) => void;
  removeItem: (itemId: string, qty: number) => void;
  buyItem: (itemId: string) => boolean;
  useConsumable: (itemId: string) => { healedHp: number; healedSp: number } | null;
  equip: (itemId: string) => void;

  // combat plumbing
  startBattle: (b: PendingBattle) => void;
  clearBattle: () => void;
  resolveBattle: (outcome: BattleOutcome, playerHp: number, playerSp: number) => void;
  clearOutcome: () => void;
  unlockSkill: (id: string) => void;

  saveNow: () => void;
  forceUpdate: () => void;
}

const Ctx = createContext<GameStore | null>(null);

const DEFAULT_SETTINGS: Settings = {
  master: 70,
  music: 60,
  sfx: 80,
  textSpeed: "normal",
};

export function GameStoreProvider({
  children,
  initialTextSpeed = "normal",
}: {
  children: ReactNode;
  initialTextSpeed?: "slow" | "normal" | "fast";
}) {
  const stateRef = useRef<GameState>(createNewGame(100));
  const [, setTick] = useState(0);
  const [screen, setScreen] = useState<Screen>("title");
  const [settings, setSettingsState] = useState<Settings>({
    ...DEFAULT_SETTINGS,
    textSpeed: initialTextSpeed,
  });
  const [pendingBattle, setPendingBattle] = useState<PendingBattle | null>(null);
  const [battleOutcome, setBattleOutcome] = useState<BattleOutcome | null>(null);

  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  const setSettings = useCallback((s: Partial<Settings>) => {
    setSettingsState((prev) => ({ ...prev, ...s }));
  }, []);

  const newGame = useCallback((startingCoins: number) => {
    stateRef.current = createNewGame(startingCoins);
    forceUpdate();
  }, [forceUpdate]);

  const continueGame = useCallback(() => {
    const loaded = loadGame();
    if (!loaded) return false;
    stateRef.current = loaded;
    forceUpdate();
    return true;
  }, [forceUpdate]);

  const moveTo = useCallback((area: AreaId, x: number, y: number) => {
    const s = stateRef.current;
    s.world.area = area;
    s.world.x = x;
    s.world.y = y;
    if (!s.visitedAreas.includes(area)) s.visitedAreas.push(area);
    forceUpdate();
  }, [forceUpdate]);

  const setPlayerTile = useCallback(
    (x: number, y: number, facing: GameState["world"]["facing"]) => {
      const s = stateRef.current;
      s.world.x = x;
      s.world.y = y;
      s.world.facing = facing;
      // no forceUpdate here; the explore loop owns its own render cadence
    },
    [],
  );

  const setFlag = useCallback((flag: string) => {
    stateRef.current.flags[flag] = true;
    forceUpdate();
  }, [forceUpdate]);

  const advanceQuest = useCallback((toIndex?: number) => {
    const s = stateRef.current;
    const next = toIndex ?? s.questIndex + 1;
    s.questIndex = Math.min(next, MAIN_QUEST.objectives.length);
    forceUpdate();
  }, [forceUpdate]);

  const addItem = useCallback((itemId: string, qty: number) => {
    const inv = stateRef.current.player.inventory;
    inv[itemId] = (inv[itemId] ?? 0) + qty;
    forceUpdate();
  }, [forceUpdate]);

  const removeItem = useCallback((itemId: string, qty: number) => {
    const inv = stateRef.current.player.inventory;
    inv[itemId] = Math.max(0, (inv[itemId] ?? 0) - qty);
    if (inv[itemId] === 0) delete inv[itemId];
    forceUpdate();
  }, [forceUpdate]);

  const buyItem = useCallback((itemId: string) => {
    const p = stateRef.current.player;
    const item = getItem(itemId);
    if (!item || item.price <= 0 || p.coins < item.price) return false;
    p.coins -= item.price;
    p.inventory[itemId] = (p.inventory[itemId] ?? 0) + 1;
    forceUpdate();
    return true;
  }, [forceUpdate]);

  const useConsumable = useCallback((itemId: string) => {
    const p = stateRef.current.player;
    const item = getItem(itemId);
    if (!item || (p.inventory[itemId] ?? 0) <= 0) return null;
    let healedHp = 0;
    let healedSp = 0;
    if (item.healHp) {
      const before = p.hp;
      p.hp = Math.min(p.maxHp, p.hp + item.healHp);
      healedHp = p.hp - before;
    }
    if (item.healSp) {
      const before = p.sp;
      p.sp = Math.min(p.maxSp, p.sp + item.healSp);
      healedSp = p.sp - before;
    }
    p.inventory[itemId] -= 1;
    if (p.inventory[itemId] <= 0) delete p.inventory[itemId];
    forceUpdate();
    return { healedHp, healedSp };
  }, [forceUpdate]);

  const equip = useCallback((itemId: string) => {
    const p = stateRef.current.player;
    const item = getItem(itemId);
    if (!item || !item.slot) return;
    p.equipment[item.slot] = itemId;
    forceUpdate();
  }, [forceUpdate]);

  const startBattle = useCallback((b: PendingBattle) => {
    setPendingBattle(b);
  }, []);

  const clearBattle = useCallback(() => setPendingBattle(null), []);

  const resolveBattle = useCallback(
    (outcome: BattleOutcome, playerHp: number, playerSp: number) => {
      const s = stateRef.current;
      s.player.hp = Math.max(0, playerHp);
      s.player.sp = Math.max(0, playerSp);
      if (outcome.result === "victory") {
        // exp/coins applied in battle component via applyExp; but ensure coins set
        // (applyExp mutates player.exp/level there). Coins added here if provided.
      }
      setBattleOutcome(outcome);
      setPendingBattle(null);
      forceUpdate();
    },
    [forceUpdate],
  );

  const clearOutcome = useCallback(() => setBattleOutcome(null), []);

  const unlockSkill = useCallback((id: string) => {
    const p = stateRef.current.player;
    if (!p.unlockedSkills.includes(id)) p.unlockedSkills.push(id);
    forceUpdate();
  }, [forceUpdate]);

  const saveNow = useCallback(() => {
    saveGame(stateRef.current);
    forceUpdate();
  }, [forceUpdate]);

  const value = useMemo<GameStore>(
    () => ({
      state: stateRef.current,
      screen,
      settings,
      pendingBattle,
      battleOutcome,
      setScreen,
      setSettings,
      newGame,
      continueGame,
      moveTo,
      setPlayerTile,
      setFlag,
      advanceQuest,
      addItem,
      removeItem,
      buyItem,
      useConsumable,
      equip,
      startBattle,
      clearBattle,
      resolveBattle,
      clearOutcome,
      unlockSkill,
      saveNow,
      forceUpdate,
    }),
    // stateRef.current identity is stable; tick re-renders consumers
    [screen, settings, pendingBattle, battleOutcome, newGame, continueGame, moveTo, setPlayerTile, setFlag, advanceQuest, addItem, removeItem, buyItem, useConsumable, equip, startBattle, clearBattle, resolveBattle, clearOutcome, unlockSkill, saveNow, forceUpdate, setSettings],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame(): GameStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame must be used within GameStoreProvider");
  return ctx;
}

// Re-export for battle component to apply exp consistently.
export { applyExp };
