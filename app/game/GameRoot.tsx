import { useCallback, useEffect, useRef, useState } from "react";
import { useConfigurables } from "~/modules/configurables";
import { GameStoreProvider, useGame, type Screen } from "./engine/store";
import { getMap } from "./data/maps";
import { getDialogue, DIALOGUES } from "./data/dialogue";
import { MAIN_QUEST } from "./data/quests";
import type { MapDef, MapInteractable } from "./data/types";
import { TitleScene } from "./scenes/TitleScene";
import { CharacterSelect } from "./scenes/CharacterSelect";
import { CreditsScreen, SettingsScreen } from "./scenes/SettingsScreen";
import { ExploreScene } from "./scenes/ExploreScene";
import { BattleScene } from "./scenes/BattleScene";
import { EndingScene } from "./scenes/EndingScene";
import { DialogueBox } from "./ui/DialogueBox";
import { PauseMenu } from "./ui/PauseMenu";
import { ShopOverlay } from "./ui/ShopOverlay";
import { Hud } from "./ui/Hud";
import { MobileControls } from "./ui/MobileControls";
import { setAudioLevels, sfx } from "./engine/sfx";

const ASPECT_W = 16;
const ASPECT_H = 9;

export function GameRoot() {
  const { config, loading } = useConfigurables();
  const initialTextSpeed = (config?.textSpeed as "slow" | "normal" | "fast") || "normal";

  if (loading) {
    return (
      <div className="coer-root w-screen h-screen flex items-center justify-center">
        <div className="coer-heading text-xl coer-flicker">Lighting the candles...</div>
      </div>
    );
  }

  return (
    <GameStoreProvider initialTextSpeed={initialTextSpeed}>
      <GameShell />
    </GameStoreProvider>
  );
}

// Letterboxed 16:9 viewport inside a dark fantasy shell.
function GameShell() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vp, setVp] = useState({ w: 960, h: 540 });

  useEffect(() => {
    function fit() {
      const el = containerRef.current;
      if (!el) return;
      const aw = el.clientWidth;
      const ah = el.clientHeight;
      let w = aw;
      let h = (w * ASPECT_H) / ASPECT_W;
      if (h > ah) {
        h = ah;
        w = (h * ASPECT_W) / ASPECT_H;
      }
      setVp({ w: Math.floor(w), h: Math.floor(h) });
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div
      ref={containerRef}
      className="coer-root"
      style={{
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(ellipse at center, #0a0e1a 0%, #05070f 70%, #020308 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* faint shell ornament */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(45deg, rgba(216,178,90,0.015) 0 2px, transparent 2px 22px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="coer-vignette"
        style={{
          position: "relative",
          width: vp.w,
          height: vp.h,
          border: "1px solid rgba(216,178,90,0.4)",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.8), 0 0 60px rgba(216,178,90,0.06)",
        }}
      >
        <ScreenRouter vpW={vp.w} vpH={vp.h} />
      </div>
    </div>
  );
}

type Overlay =
  | { kind: "dialogue"; sequenceId: string; after?: () => void }
  | { kind: "pause" }
  | { kind: "shop" }
  | { kind: "battle"; enemyId: string; isBoss: boolean; afterFlag?: string; interactableId: string }
  | null;

function ScreenRouter({ vpW, vpH }: { vpW: number; vpH: number }) {
  const game = useGame();
  const { config } = useConfigurables();
  const { screen, setScreen } = game;

  const [overlay, setOverlay] = useState<Overlay>(null);
  const [areaName, setAreaName] = useState(getMap(game.state.world.area).name);
  const [shakeKey, setShakeKey] = useState(0);
  const [openedAreas, setOpenedAreas] = useState<Set<string>>(new Set());

  // sync audio levels with settings
  useEffect(() => {
    setAudioLevels(game.settings.master, game.settings.sfx);
  }, [game.settings.master, game.settings.sfx]);

  const paused = overlay !== null;

  // ── Quest progression helper ────────────────────────────────────────────────
  const tryAdvanceQuest = useCallback(
    (toIndex: number) => {
      if (game.state.questIndex < toIndex) {
        game.advanceQuest(toIndex);
        sfx("quest");
      }
    },
    [game],
  );

  // ── Area entry: play ambient line first time, set flags ─────────────────────
  const handleEnterArea = useCallback(
    (map: MapDef) => {
      setAreaName(map.name);
      // mark snowfield entered so the back-to-chapel door appears, etc.
      if (map.id === "snowfield") game.setFlag("snowfieldEntered");

      if (!openedAreas.has(map.id) && map.ambientDialogueId && map.id !== "chapel") {
        setOpenedAreas((s) => new Set(s).add(map.id));
        // chapel opening handled separately at new game
        setOverlay({ kind: "dialogue", sequenceId: map.ambientDialogueId });
        // quest beats on first entry
        if (map.id === "snowfield") tryAdvanceQuest(2);
        if (map.id === "veyrhold") tryAdvanceQuest(4);
        if (map.id === "shrine") tryAdvanceQuest(6);
      } else if (!openedAreas.has(map.id)) {
        setOpenedAreas((s) => new Set(s).add(map.id));
      }
    },
    [game, openedAreas, tryAdvanceQuest],
  );

  // ── Interaction dispatch ────────────────────────────────────────────────────
  const handleInteract = useCallback(
    (it: MapInteractable, map: MapDef) => {
      switch (it.kind) {
        case "door": {
          if (it.target) {
            // optional door dialogue (e.g. Edrin gives gear) before transition
            if (it.dialogueId) {
              setOverlay({
                kind: "dialogue",
                sequenceId: it.dialogueId,
                after: () => {
                  if (it.id === "door" && map.id === "chapel") tryAdvanceQuest(2);
                  game.moveTo(it.target!.area, it.target!.x, it.target!.y);
                  setOverlay(null);
                },
              });
            } else {
              game.moveTo(it.target.area, it.target.x, it.target.y);
            }
          }
          break;
        }
        case "npc":
        case "examine": {
          if (it.dialogueId) {
            setOverlay({ kind: "dialogue", sequenceId: it.dialogueId });
            if (it.id === "edrin") tryAdvanceQuest(1);
          }
          break;
        }
        case "chest": {
          if (it.oneShotFlag && game.state.flags[it.oneShotFlag]) return;
          setOverlay({
            kind: "dialogue",
            sequenceId: it.dialogueId ?? "chestHerbs",
            after: () => {
              if (it.itemId) game.addItem(it.itemId, it.qty ?? 1);
              if (it.oneShotFlag) game.setFlag(it.oneShotFlag);
              sfx("item");
              tryAdvanceQuest(2);
              setOverlay(null);
            },
          });
          break;
        }
        case "save": {
          setOverlay({
            kind: "dialogue",
            sequenceId: it.dialogueId ?? "saveCrystal",
            after: () => {
              game.saveNow();
              sfx("save");
              tryAdvanceQuest(6);
              setOverlay(null);
            },
          });
          break;
        }
        case "shop": {
          setOverlay({
            kind: "dialogue",
            sequenceId: it.dialogueId ?? "merchantGreet",
            after: () => setOverlay({ kind: "shop" }),
          });
          break;
        }
        case "lever": {
          if (it.oneShotFlag && game.state.flags[it.oneShotFlag]) return;
          setOverlay({
            kind: "dialogue",
            sequenceId: it.dialogueId ?? "shrineLever",
            after: () => {
              if (it.oneShotFlag) game.setFlag(it.oneShotFlag);
              tryAdvanceQuest(7);
              setOverlay(null);
            },
          });
          break;
        }
        case "encounter":
        case "boss": {
          if (it.oneShotFlag && game.state.flags[it.oneShotFlag]) return;
          const enemyId = it.enemyId!;
          const isBoss = it.kind === "boss";
          const startBattle = () =>
            setOverlay({
              kind: "battle",
              enemyId,
              isBoss,
              afterFlag: it.oneShotFlag,
              interactableId: it.id,
            });
          if (it.dialogueId) {
            setOverlay({
              kind: "dialogue",
              sequenceId: it.dialogueId,
              after: startBattle,
            });
          } else {
            startBattle();
          }
          break;
        }
        default:
          break;
      }
    },
    [game, tryAdvanceQuest],
  );

  // ── Battle resolution ───────────────────────────────────────────────────────
  const handleBattleEnd = useCallback(
    (
      result: "victory" | "defeat" | "flee",
      playerHp: number,
      playerSp: number,
      info: { enemyId: string; isBoss: boolean; afterFlag?: string; interactableId: string },
    ) => {
      game.state.player.hp = Math.max(result === "defeat" ? 1 : playerHp, result === "defeat" ? 1 : playerHp);
      game.state.player.sp = playerSp;

      if (result === "victory") {
        if (info.afterFlag) game.setFlag(info.afterFlag);
        // quest beats
        if (info.enemyId === "frostWolf") tryAdvanceQuest(3);
        if (info.isBoss) tryAdvanceQuest(MAIN_QUEST.objectives.length); // complete
        setShakeKey((s) => s + 1);
        if (info.isBoss) {
          // restore a little then go to ending
          game.state.player.hp = Math.max(1, playerHp);
          setOverlay(null);
          setTimeout(() => setScreen("ending"), 400);
          return;
        }
        setOverlay(null);
      } else if (result === "flee") {
        setOverlay(null);
      } else {
        // defeat: revive at low HP, return to explore (soft game-over)
        game.state.player.hp = Math.floor(game.state.player.maxHp * 0.3);
        game.state.player.sp = Math.floor(game.state.player.maxSp * 0.3);
        setOverlay(null);
      }
      game.forceUpdate();
    },
    [game, tryAdvanceQuest, setScreen],
  );

  // ── Esc to open/close pause while exploring ────────────────────────────────
  useEffect(() => {
    if (screen !== "explore") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOverlay((cur) => {
          if (cur?.kind === "pause") {
            sfx("select");
            return null;
          }
          if (cur === null) {
            sfx("select");
            return { kind: "pause" };
          }
          return cur;
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen]);

  // ── Screen flows ────────────────────────────────────────────────────────────
  const startNewGame = useCallback(() => {
    game.newGame(config.startingCoins ?? 100);
    setOpenedAreas(new Set(["chapel"]));
    setScreen("select");
  }, [game, config.startingCoins, setScreen]);

  const beginPlay = useCallback(() => {
    // chapel opening cutscene as a dialogue overlay once we enter explore
    setScreen("explore");
    setAreaName(getMap(game.state.world.area).name);
    setOverlay({ kind: "dialogue", sequenceId: "opening" });
  }, [game, setScreen]);

  const continueGame = useCallback(() => {
    const ok = game.continueGame();
    if (!ok) return;
    // mark visited areas as opened so we don't replay ambient lines
    const opened = new Set<string>(game.state.visitedAreas as string[]);
    setOpenedAreas(opened);
    setScreen("explore");
    setAreaName(getMap(game.state.world.area).name);
  }, [game, setScreen]);

  const returnTitle = useCallback(() => {
    setOverlay(null);
    setScreen("title");
  }, [setScreen]);

  // ── Render by screen ────────────────────────────────────────────────────────
  if (screen === "title") {
    return (
      <TitleScene
        onNewGame={startNewGame}
        onContinue={continueGame}
        onSettings={() => setScreen("settings")}
        onCredits={() => setScreen("credits")}
      />
    );
  }

  if (screen === "select") {
    return (
      <CharacterSelect onChoose={beginPlay} onBack={() => setScreen("title")} />
    );
  }

  if (screen === "settings") {
    return <SettingsScreen onBack={() => setScreen("title")} />;
  }

  if (screen === "credits") {
    return <CreditsScreen onBack={() => setScreen("title")} />;
  }

  if (screen === "ending") {
    return (
      <EndingScene
        textSpeed={game.settings.textSpeed}
        onReturnTitle={() => {
          game.saveNow();
          returnTitle();
        }}
      />
    );
  }

  // explore (+ overlays)
  const dialogueSeq =
    overlay?.kind === "dialogue" ? getDialogue(overlay.sequenceId) ?? DIALOGUES.edrinIdle : null;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <ExploreScene
        viewportW={vpW}
        viewportH={vpH}
        onInteract={handleInteract}
        onEnterArea={handleEnterArea}
        paused={paused}
        shakeKey={shakeKey}
      />

      <Hud areaName={areaName} />

      {(config.showMobileControls ?? true) && !paused && <MobileControls />}

      {overlay?.kind === "dialogue" && dialogueSeq && (
        <DialogueBox
          sequence={dialogueSeq}
          textSpeed={game.settings.textSpeed}
          onComplete={() => {
            const after = overlay.after;
            if (after) after();
            else setOverlay(null);
          }}
        />
      )}

      {overlay?.kind === "pause" && (
        <PauseMenu
          onClose={() => setOverlay(null)}
          onReturnTitle={() => {
            game.saveNow();
            returnTitle();
          }}
        />
      )}

      {overlay?.kind === "shop" && <ShopOverlay onClose={() => setOverlay(null)} />}

      {overlay?.kind === "battle" && (
        <BattleScene
          key={`${overlay.enemyId}-${overlay.interactableId}`}
          enemyId={overlay.enemyId}
          isBoss={overlay.isBoss}
          battleTheme={getMap(game.state.world.area).theme}
          onEnd={(result, hp, sp) =>
            handleBattleEnd(result, hp, sp, {
              enemyId: overlay.enemyId,
              isBoss: overlay.isBoss,
              afterFlag: overlay.afterFlag,
              interactableId: overlay.interactableId,
            })
          }
        />
      )}
    </div>
  );
}
