import { useCallback, useEffect, useRef, useState } from "react";
import { GameStoreProvider, useGame, type Screen } from "./engine/store";
import { setAudioLevels, sfx } from "./engine/sfx";
import { getArea, type AreaId, type NpcDef } from "./data/gameData";
import { getLesson, type LessonNode } from "./data/learningData";
import { MainMenu } from "./scenes/MainMenu";
import { OnboardingScreen } from "./scenes/OnboardingScreen";
import { LearningMap } from "./scenes/LearningMap";
import { ExploreScene } from "./scenes/ExploreScene";
import { BattleScene } from "./scenes/BattleScene";
import { LessonCompleteScreen } from "./scenes/LessonCompleteScreen";
import { StreakScreen } from "./scenes/StreakScreen";
import { Wordbook } from "./scenes/Wordbook";
import { ReviewScreen } from "./scenes/ReviewScreen";
import { QuestJournal } from "./scenes/QuestJournal";
import { ShopScreen } from "./scenes/ShopScreen";
import { SettingsScreen } from "./scenes/SettingsScreen";
import { DailyQuestScreen } from "./scenes/DailyQuestScreen";
import { CharacterScreen } from "./scenes/CharacterScreen";
import { EndingScreen } from "./scenes/EndingScreen";
import { DialogueBox, type DialogueLine } from "./ui/DialogueBox";
import { LessonPanel, type LessonResult } from "./ui/LessonPanel";
import { Hud } from "./ui/Hud";
import { PauseMenu } from "./ui/PauseMenu";

const ASPECT_W = 16;
const ASPECT_H = 9;

export function GameRoot() {
  return (
    <GameStoreProvider>
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
        background: "radial-gradient(ellipse at center, #0a0e1a 0%, #05070f 70%, #020308 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, rgba(216,178,90,0.015) 0 2px, transparent 2px 22px)", pointerEvents: "none" }}
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
          boxShadow: "0 0 0 1px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.8), 0 0 60px rgba(216,178,90,0.06)",
        }}
      >
        <Router vpW={vp.w} vpH={vp.h} />
      </div>
    </div>
  );
}

type Overlay =
  | { kind: "dialogue"; lines: DialogueLine[]; after?: () => void }
  | { kind: "lesson"; lesson: LessonNode }
  | { kind: "pause" }
  | null;

// Map a lesson's NPC interaction into intro dialogue lines.
function npcDialogue(npc: NpcDef): DialogueLine[] {
  const lines: DialogueLine[] = [
    {
      speaker: npc.name,
      portrait: npc.sprite === "bori" ? "bori" : npc.sprite,
      text: npc.line,
      korean: npc.korean,
    },
  ];
  return lines;
}

function Router({ vpW, vpH }: { vpW: number; vpH: number }) {
  const game = useGame();
  const { screen, setScreen, progress } = game;

  const [overlay, setOverlay] = useState<Overlay>(null);
  const [battle, setBattle] = useState<{ enemyId: string; lessonId: string } | null>(null);
  const [lastResult, setLastResult] = useState<LessonResult | null>(null);
  const [reviewFromComplete, setReviewFromComplete] = useState(false);
  // where to go after closing a menu overlay opened from pause
  const returnScreenRef = useRef<Screen>("explore");

  useEffect(() => {
    setAudioLevels(game.settings.sound ? 70 : 0, game.settings.sound ? 80 : 0);
  }, [game.settings.sound]);

  const paused = overlay !== null;

  // ── Quest progression helper ──────────────────────────────────────────────
  const advance = useCallback(
    (to: number) => {
      if (progress.questIndex < to) {
        game.advanceQuest(to);
        sfx("quest");
      }
    },
    [game, progress],
  );

  // ── start a lesson (from map or NPC) ──────────────────────────────────────
  const startLesson = useCallback(
    (lesson: LessonNode) => {
      // a boss lesson opens the battle directly
      if (lesson.kind === "boss") {
        setBattle({ enemyId: "silenceWisp", lessonId: lesson.id });
        setScreen("battle");
        return;
      }
      // make sure we're in the right area visually
      const area = lesson.area as AreaId;
      if (getArea(area) && progress.currentArea !== area) {
        game.setArea(area);
      }
      setScreen("explore");
      setOverlay({ kind: "lesson", lesson });
    },
    [game, progress, setScreen],
  );

  // ── NPC interaction in explore ────────────────────────────────────────────
  const onInteractNpc = useCallback(
    (npc: NpcDef) => {
      const lesson = npc.lessonId ? getLesson(npc.lessonId) : undefined;
      setOverlay({
        kind: "dialogue",
        lines: npcDialogue(npc),
        after: () => {
          if (lesson) {
            if (lesson.kind === "boss") {
              setOverlay(null);
              setBattle({ enemyId: "silenceWisp", lessonId: lesson.id });
              setScreen("battle");
              return;
            }
            setOverlay({ kind: "lesson", lesson });
          } else {
            setOverlay(null);
          }
        },
      });
      // quest beats
      if (npc.id === "bori") advance(1);
    },
    [advance, setScreen],
  );

  // ── area exit ─────────────────────────────────────────────────────────────
  const onExit = useCallback(
    (to: AreaId, label: string) => {
      game.setArea(to);
      sfx("advance");
      if (to === "village") advance(5);
      setOverlay({
        kind: "dialogue",
        lines: [
          { speaker: "Bori", portrait: "bori", text: `We've reached ${label}. Let's keep going!` },
        ],
      });
    },
    [game, advance],
  );

  // ── lesson finished ───────────────────────────────────────────────────────
  const onLessonComplete = useCallback(
    (result: LessonResult) => {
      setOverlay(null);
      setLastResult(result);
      if (!result.failed) {
        // streak ticks on first successful lesson of the day
        game.touchStreak();
        // quest beats keyed by lesson id
        const beats: Record<string, number> = { l1: 2, l2: 3, l3: 4, l4: 6 };
        if (beats[result.lessonId]) advance(beats[result.lessonId]);
        game.addXp(0); // ensure level recompute
      }
      game.saveNow();
      setScreen("lessonComplete");
    },
    [game, advance, setScreen],
  );

  // ── battle finished ───────────────────────────────────────────────────────
  const onBattleEnd = useCallback(
    (victory: boolean, _stats: { correct: number; xp: number }) => {
      const lessonId = battle?.lessonId;
      setBattle(null);
      if (victory && lessonId) {
        game.completeLesson(lessonId);
        game.touchStreak();
        advance(7); // defeat the Silence Wisp
        game.bumpDaily("dq5"); // memory flame alive
        advance(8); // complete first daily lesson
        game.saveNow();
        setScreen("ending");
      } else {
        // retry: back to map
        setScreen("map");
      }
    },
    [battle, game, advance, setScreen],
  );

  // ── ESC handling in explore ───────────────────────────────────────────────
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

  // ── new game / continue ───────────────────────────────────────────────────
  const beginOnboarding = useCallback(() => setScreen("onboarding"), [setScreen]);

  const finishOnboarding = useCallback(
    (level: string, _placement: string, name: string) => {
      game.newGame(level, name);
      // opening cutscene -> wake in Letter Shrine
      setScreen("explore");
      setOverlay({
        kind: "dialogue",
        lines: [
          { speaker: "Narrator", text: `Long ago, the Letters of Light kept Haneul Road alive with language. Then the words fell silent...` },
          { speaker: "Narrator", text: `You wake at the ancient Letter Shrine, a notebook glowing in your satchel.` },
          { speaker: "Bori", portrait: "bori", text: `Oh! A traveler! I'm Bori — a humble fox spirit, and your guide. Touch the glowing letters and I'll teach you to read them.`, korean: "안녕하세요" },
        ],
      });
    },
    [game, setScreen],
  );

  const continueJourney = useCallback(() => {
    const ok = game.continueGame();
    if (!ok) return;
    setScreen("explore");
  }, [game, setScreen]);

  const returnTitle = useCallback(() => {
    game.saveNow();
    setOverlay(null);
    setBattle(null);
    setScreen("menu");
  }, [game, setScreen]);

  // ── open a menu screen from pause, remembering where to return ────────────
  const openMenu = useCallback(
    (s: Screen) => {
      returnScreenRef.current = "explore";
      setOverlay(null);
      setScreen(s);
    },
    [setScreen],
  );

  // ════════════════════════════ RENDER ═════════════════════════════════════

  if (screen === "menu") {
    return (
      <MainMenu
        hasSave={game.hasSaveFile}
        onStart={beginOnboarding}
        onContinue={continueJourney}
        onDaily={() => setScreen("dailyQuest")}
        onReview={() => setScreen("review")}
        onSettings={() => setScreen("settings")}
      />
    );
  }

  if (screen === "onboarding") {
    return <OnboardingScreen onDone={finishOnboarding} onBack={() => setScreen("menu")} />;
  }

  if (screen === "map") {
    return <LearningMap onPickLesson={(l) => startLesson(l)} onClose={() => setScreen("explore")} />;
  }

  if (screen === "battle" && battle) {
    const area = getArea(progress.currentArea);
    return (
      <BattleScene
        key={battle.enemyId}
        enemyId={battle.enemyId}
        theme={area.theme}
        viewportW={vpW}
        viewportH={vpH}
        onEnd={onBattleEnd}
      />
    );
  }

  if (screen === "lessonComplete" && lastResult) {
    return (
      <LessonCompleteScreen
        result={lastResult}
        streak={progress.streak}
        onContinue={() => {
          if (lastResult.failed) {
            // retry same lesson
            const l = getLesson(lastResult.lessonId);
            game.refillHearts();
            setScreen("explore");
            if (l) setOverlay({ kind: "lesson", lesson: l });
          } else {
            setScreen("streak");
          }
        }}
        onReview={() => {
          setReviewFromComplete(true);
          setScreen("review");
        }}
        onMap={() => setScreen("map")}
      />
    );
  }

  if (screen === "streak") {
    return <StreakScreen onContinue={() => setScreen("map")} />;
  }

  if (screen === "ending") {
    return <EndingScreen onReturn={returnTitle} />;
  }

  // ── menu overlays (also reachable from main menu) ─────────────────────────
  const menuBack = () => {
    if (reviewFromComplete) {
      setReviewFromComplete(false);
      setScreen("lessonComplete");
      return;
    }
    // if we have an active game, go back to explore; otherwise menu
    setScreen(progress.completedLessons.length > 0 || progress.currentArea !== "shrine" || game.hasSaveFile ? returnScreenRef.current : "menu");
    // when coming straight from main menu without a started game, go to menu
  };

  if (screen === "wordbook") return <Wordbook onClose={() => setScreen("explore")} />;
  if (screen === "review") return <ReviewScreen onClose={menuBack} />;
  if (screen === "quests") return <QuestJournal onClose={() => setScreen("explore")} />;
  if (screen === "character") return <CharacterScreen onClose={() => setScreen("explore")} />;
  if (screen === "shop") return <ShopScreen onClose={() => setScreen("explore")} />;
  if (screen === "settings")
    return <SettingsScreen onClose={() => setScreen(game.hasSaveFile || progress.completedLessons.length ? "explore" : "menu")} />;
  if (screen === "dailyQuest") return <DailyQuestScreen onClose={() => setScreen(game.hasSaveFile || progress.completedLessons.length ? "explore" : "menu")} />;

  // ── explore (+ overlays) ──────────────────────────────────────────────────
  const area = getArea(progress.currentArea);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <ExploreScene
        area={progress.currentArea}
        viewportW={vpW}
        viewportH={vpH}
        paused={paused}
        onInteractNpc={onInteractNpc}
        onExit={onExit}
      />

      <Hud areaName={area.name} goal={area.goal} />

      {overlay?.kind === "dialogue" && (
        <DialogueBox
          lines={overlay.lines}
          textSpeed={game.settings.textSpeed}
          onComplete={() => {
            const after = overlay.after;
            if (after) after();
            else setOverlay(null);
          }}
        />
      )}

      {overlay?.kind === "lesson" && (
        <LessonPanel
          lesson={overlay.lesson}
          onComplete={onLessonComplete}
          onAbort={() => setOverlay(null)}
        />
      )}

      {overlay?.kind === "pause" && (
        <PauseMenu
          onResume={() => setOverlay(null)}
          onOpen={openMenu}
          onSave={() => {
            game.saveNow();
            setOverlay(null);
          }}
          onTitle={returnTitle}
        />
      )}
    </div>
  );
}
