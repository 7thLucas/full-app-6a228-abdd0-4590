import { useMemo, useRef, useState } from "react";
import { getEnemy, type EnemyDef, type AreaTheme } from "../data/gameData";
import { getQuestion, getVocab, XP } from "../data/learningData";
import { useGame } from "../engine/store";
import { Diorama } from "../visual/Diorama";
import { Atmosphere } from "../visual/Atmosphere";
import { PixelCharacter } from "../visual/PixelCharacter";
import { Sprite } from "../visual/Sprite";
import { GoldButton, StatBar } from "../ui/primitives";
import { sfx } from "../engine/sfx";

interface BattleSceneProps {
  enemyId: string;
  theme: AreaTheme;
  viewportW: number;
  viewportH: number;
  onEnd: (victory: boolean, stats: { correct: number; xp: number }) => void;
}

type Command = "word" | "sound" | "grammar" | "hint" | "review" | "item";

// Fluency Combo multipliers
const COMBO = [1, 1.2, 1.4, 1.7, 2.0];
function comboMult(streak: number): number {
  return COMBO[Math.min(streak, COMBO.length - 1)];
}

const BASE_DMG = 14;

// Side-view HD-2D learning battle. Correct Korean answers attack; the enemy's
// Confusion Shield (Meaning Break) must be broken; consecutive correct answers
// build a Fluency Combo for escalating damage.
export function BattleScene({ enemyId, theme, viewportW, viewportH, onEnd }: BattleSceneProps) {
  const game = useGame();
  const { progress, settings } = game;
  const enemy = getEnemy(enemyId) as EnemyDef;

  const questions = useMemo(
    () => enemy.questionIds.map(getQuestion).filter(Boolean) as NonNullable<ReturnType<typeof getQuestion>>[],
    [enemy],
  );

  const [enemyHp, setEnemyHp] = useState(enemy.hp);
  const [shield, setShield] = useState(enemy.confusionShield);
  const [combo, setCombo] = useState(0);
  const [meaningBreak, setMeaningBreak] = useState(false); // enemy loses next attack
  const [exposed, setExposed] = useState(false); // boss: 3 in a row
  const [correctRun, setCorrectRun] = useState(0);
  const [playerHp, setPlayerHp] = useState(progress.hearts * 20);
  const maxPlayerHp = progress.maxHearts * 20;

  const [phase, setPhase] = useState<"command" | "question" | "result" | "over">("command");
  const [activeCmd, setActiveCmd] = useState<Command>("word");
  const qIdxRef = useRef(0);
  const [currentQ, setCurrentQ] = useState(questions[0]);
  const [log, setLog] = useState<string[]>([`A ${enemy.name} blocks the gate!`]);
  const [floatDmg, setFloatDmg] = useState<{ id: number; n: number; crit: boolean } | null>(null);
  const [glowWord, setGlowWord] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const [correctTotal, setCorrectTotal] = useState(0);
  const [xpTotal, setXpTotal] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const floatId = useRef(0);

  function pushLog(s: string) {
    setLog((l) => [...l.slice(-4), s]);
  }

  function pickCommand(cmd: Command) {
    if (phase !== "command") return;
    sfx("select");
    if (cmd === "hint") {
      setShowHint(true);
      setUsedHint(true);
      pushLog("Bori whispers a hint... (XP bonus reduced)");
      return;
    }
    if (cmd === "review") {
      pushLog("You review your learned words. The turn passes.");
      enemyTurn(false);
      return;
    }
    if (cmd === "item") {
      const charm = progress.inventory.memoryCharm ?? 0;
      if (charm > 0) {
        progress.inventory.memoryCharm -= 1;
        setPlayerHp((h) => Math.min(maxPlayerHp, h + 20));
        pushLog("You use a Memory Charm. +20 HP.");
        game.forceUpdate();
      } else {
        pushLog("No usable items. (Buy some at the Shop!)");
      }
      return;
    }
    // word / sound / grammar -> ask a question
    setActiveCmd(cmd);
    const q = questions[qIdxRef.current % questions.length];
    setCurrentQ(q);
    setShowHint(false);
    setUsedHint(false);
    setPhase("question");
  }

  function answer(opt: string) {
    if (phase !== "question") return;
    const q = currentQ;
    const isCorrect = opt === q.answer;
    qIdxRef.current += 1;
    game.recordAnswer(q.vocabId, isCorrect);

    if (isCorrect) {
      sfx("hit");
      const newCombo = combo + 1;
      setCombo(newCombo);
      const run = correctRun + 1;
      setCorrectRun(run);
      setCorrectTotal((c) => c + 1);
      let gain = XP.correct + (usedHint ? 0 : XP.noHintBonus);
      game.addXp(gain);
      setXpTotal((x) => x + gain);
      game.bumpDaily("dq2");

      // damage with combo + break + exposed bonuses
      let dmg = BASE_DMG * comboMult(newCombo);
      let crit = newCombo >= 4;
      if (meaningBreak) {
        dmg *= 1.6;
        crit = true;
        setMeaningBreak(false);
      }
      if (exposed) {
        dmg *= 1.5;
        crit = true;
        setExposed(false);
      }
      dmg = Math.round(dmg);

      // shield handling (Meaning Break)
      let newShield = shield;
      if (shield > 0) {
        newShield = shield - 1;
        setShield(newShield);
        if (newShield === 0) {
          setMeaningBreak(true);
          setShowBreak(true);
          sfx("shatter");
          window.setTimeout(() => setShowBreak(false), 1200);
          pushLog("MEANING RESTORED — the fog recoils! It loses its next attack.");
        } else {
          pushLog(`Confusion Shield weakens (${newShield} left).`);
        }
      }

      // boss exposed at 3-in-a-row
      if (enemy.isBoss && run >= 3 && !exposed) {
        setExposed(true);
        pushLog(`${enemy.name} is EXPOSED! Bonus damage next hit.`);
      }

      const vocab = q.vocabId ? getVocab(q.vocabId) : undefined;
      setGlowWord(vocab?.korean ?? q.answer);
      floatId.current += 1;
      setFloatDmg({ id: floatId.current, n: dmg, crit });
      setShake((s) => s + 1);
      const nextHp = Math.max(0, enemyHp - dmg);
      setEnemyHp(nextHp);
      pushLog(`Correct! ${vocab?.korean ?? q.answer} strikes for ${dmg}${crit ? " (combo!)" : ""}.`);

      window.setTimeout(() => {
        setGlowWord(null);
        if (nextHp <= 0) {
          victory();
        } else {
          setPhase("command");
        }
      }, 900);
    } else {
      sfx("error");
      setCombo(0);
      setCorrectRun(0);
      // boss restores a little shield on wrong
      if (enemy.isBoss && shield < enemy.confusionShield) {
        setShield((s) => Math.min(enemy.confusionShield, s + 1));
        pushLog("Wrong — the fog thickens, restoring some shield.");
      }
      const vocab = q.vocabId ? getVocab(q.vocabId) : undefined;
      pushLog(
        `Not quite. ${q.answer}${vocab ? ` = ${vocab.english}` : ""}. Bori: "It's okay — you'll get it!"`,
      );
      enemyTurn(true);
    }
  }

  function enemyTurn(playerWrong: boolean) {
    setPhase("result");
    window.setTimeout(() => {
      if (meaningBreak) {
        pushLog(`${enemy.name} is dazed and cannot attack.`);
        setMeaningBreak(false);
        setPhase("command");
        return;
      }
      // enemy attack costs HP (and a heart only if player answered wrong)
      const dmg = enemy.isBoss ? 16 : 12;
      const charm = progress.inventory.memoryCharm ?? 0;
      if (playerWrong && charm > 0) {
        progress.inventory.memoryCharm -= 1;
        pushLog("Memory Charm absorbs the hit! No heart lost.");
        game.forceUpdate();
      } else if (playerWrong) {
        const h = game.loseHeart();
        pushLog(`${enemy.name} lashes out — you lose a heart (${h} left).`);
      }
      sfx("hit");
      setShake((s) => s + 1);
      const nextHp = Math.max(0, playerHp - dmg);
      setPlayerHp(nextHp);
      if (nextHp <= 0 || progress.hearts <= 0) {
        defeat();
      } else {
        setPhase("command");
      }
    }, 700);
  }

  function victory() {
    setPhase("over");
    game.addXp(XP.battleVictory);
    game.addCoins(20);
    game.bumpDaily("dq4");
    game.refillHearts();
    game.saveNow();
    sfx("victory");
    window.setTimeout(() => onEnd(true, { correct: correctTotal, xp: xpTotal + XP.battleVictory }), 600);
  }

  function defeat() {
    setPhase("over");
    game.refillHearts();
    game.saveNow();
    window.setTimeout(() => onEnd(false, { correct: correctTotal, xp: xpTotal }), 600);
  }

  const worldWidth = Math.max(viewportW * 1.2, 1100);
  const vocabHint = currentQ.vocabId ? getVocab(currentQ.vocabId) : undefined;

  const commands: { id: Command; label: string; desc: string }[] = [
    { id: "word", label: "Word Strike", desc: "Answer a vocab question" },
    { id: "sound", label: "Sound Guard", desc: "Hangul sound question" },
    { id: "grammar", label: "Grammar Spell", desc: "Meaning question, big dmg" },
    { id: "hint", label: "Hint", desc: "Bori helps (less XP)" },
    { id: "review", label: "Review", desc: "Recall words (uses turn)" },
    { id: "item", label: "Item", desc: "Use a charm" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className={shake ? "coer-shake absolute inset-0" : "absolute inset-0"} key={`shk-${shake}`}>
        <Diorama theme={theme} camX={0} worldWidth={worldWidth} viewportW={viewportW} viewportH={viewportH} laneBottomFrac={0.62} />
        <Atmosphere theme={theme} />

        {/* battle entry flash */}
        <div className="coer-battle-flash absolute inset-0 bg-violet-300/30 pointer-events-none" style={{ zIndex: 25 }} />

        {/* party: Arin + Bori bottom-left */}
        <div style={{ position: "absolute", left: "20%", top: "60%", zIndex: 22 }}>
          <PixelCharacter kind="arin" baseSize={140} worldX={0} screenYFrac={1} viewportH={140} scale={1} facing="right" z={2} />
          {glowWord && (
            <div
              className="coer-dmg absolute"
              style={{ left: "50%", top: -70, transform: "translateX(-50%)", color: "#ffe9a8", fontSize: 26, textShadow: "0 0 16px rgba(255,220,140,0.9)", whiteSpace: "nowrap" }}
            >
              {glowWord}
            </div>
          )}
        </div>
        <div style={{ position: "absolute", left: "9%", top: "66%", zIndex: 21 }}>
          <PixelCharacter kind="bori" baseSize={84} worldX={0} screenYFrac={1} viewportH={84} scale={1} facing="right" glow bob z={1} />
        </div>

        {/* enemy right */}
        <div style={{ position: "absolute", right: "16%", top: "56%", zIndex: 22 }}>
          <div className={meaningBreak ? "opacity-60" : ""}>
            <Sprite kind="wisp" size={150} facing="left" />
          </div>
          {floatDmg && (
            <div
              key={floatDmg.id}
              className="coer-dmg absolute"
              style={{ left: "50%", top: -40, transform: "translateX(-50%)", color: floatDmg.crit ? "#ffd86a" : "#ff8a8a", fontSize: floatDmg.crit ? 34 : 26, fontWeight: 700, textShadow: "0 0 12px rgba(0,0,0,0.7)" }}
            >
              {floatDmg.n}
            </div>
          )}
        </div>

        {showBreak && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 26 }}>
            <div className="coer-shatter-flash coer-heading text-4xl" style={{ color: "#c89aff", textShadow: "0 0 30px rgba(200,154,255,0.9)" }}>
              MEANING RESTORED
            </div>
          </div>
        )}
      </div>

      {/* enemy HP + shield bar (top) */}
      <div className="absolute top-3 right-3 z-30 w-[260px]">
        <div className="coer-panel p-2">
          <div className="flex justify-between text-xs text-[#e9cf86] mb-1">
            <span>{enemy.name}{enemy.isBoss ? " (Boss)" : ""}</span>
            <span>{enemyHp}/{enemy.hp}</span>
          </div>
          <div className="h-2.5 rounded-full bg-black/50 overflow-hidden border border-black/60">
            <div className="h-full" style={{ width: `${(enemyHp / enemy.hp) * 100}%`, background: "linear-gradient(90deg,#7a3aa0,#b06ad6)", transition: "width 0.4s" }} />
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#bfb59c]">
            <span>Confusion Shield:</span>
            {Array.from({ length: enemy.confusionShield }).map((_, i) => (
              <span key={i} className={i < shield ? "text-violet-300" : "text-[#3a3340]"}>◆</span>
            ))}
            {meaningBreak && <span className="text-amber-300 ml-1">BROKEN</span>}
            {exposed && <span className="text-rose-300 ml-1">EXPOSED</span>}
          </div>
        </div>
      </div>

      {/* combo indicator */}
      {combo >= 2 && (
        <div className="absolute top-3 left-3 z-30 coer-panel px-3 py-1.5">
          <span className="coer-heading text-sm">Fluency Combo x{combo}</span>
          <span className="text-[11px] text-[#bfb59c] ml-2">+{Math.round((comboMult(combo) - 1) * 100)}% dmg</span>
        </div>
      )}

      {/* bottom command / question panel */}
      <div className="absolute inset-x-0 bottom-0 z-30 p-3">
        <div className="coer-panel coer-panel-frame mx-auto max-w-[720px] p-3">
          {/* player hearts/hp */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-0.5">
              {Array.from({ length: progress.maxHearts }).map((_, i) => (
                <span key={i} className={i < progress.hearts ? "text-rose-400" : "text-[#3a3340]"}>♥</span>
              ))}
            </div>
            <div className="flex-1">
              <StatBar value={playerHp} max={maxPlayerHp} color="hp" compact />
            </div>
          </div>

          {/* log */}
          <div className="h-[52px] overflow-hidden text-[12px] text-[#cfc6ad] leading-tight mb-2 bg-black/25 rounded p-1.5 border border-[rgba(216,178,90,0.15)]">
            {log.slice(-3).map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>

          {phase === "command" || phase === "result" || phase === "over" ? (
            <div className="grid grid-cols-3 gap-2">
              {commands.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  disabled={phase !== "command"}
                  onClick={() => pickCommand(c.id)}
                  title={c.desc}
                  className="rounded border border-[rgba(216,178,90,0.5)] px-2 py-2 text-[13px] text-[#ece6d6] bg-gradient-to-b from-[rgba(25,32,58,0.9)] to-[rgba(10,15,30,0.95)] hover:border-[#e9cf86] hover:text-[#e9cf86] disabled:opacity-40 transition-all"
                >
                  {c.label}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div className="text-center mb-2">
                {currentQ.subPrompt && (
                  <div className="text-3xl text-[#ffe9a8] mb-0.5" style={{ textShadow: "0 0 16px rgba(255,220,140,0.6)" }}>
                    {currentQ.subPrompt}
                  </div>
                )}
                <div className="text-sm text-[#ece6d6]">{currentQ.prompt}</div>
                {showHint && (
                  <div className="text-xs text-[#ffd98a] mt-1">
                    🦊 {vocabHint ? `${vocabHint.korean} = ${vocabHint.english}` : `Answer: ${currentQ.answer}`}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {currentQ.options.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => answer(o)}
                    className="rounded border border-[rgba(216,178,90,0.5)] px-3 py-2 text-sm text-[#ece6d6] bg-gradient-to-b from-[rgba(25,32,58,0.9)] to-[rgba(10,15,30,0.95)] hover:border-[#e9cf86] hover:text-[#e9cf86] transition-all"
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
