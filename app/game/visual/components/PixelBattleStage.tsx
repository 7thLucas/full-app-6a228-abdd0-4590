import { useMemo, useRef, useState } from "react";
import { getEnemy, type EnemyDef, type AreaTheme } from "../../data/gameData";
import { getQuestion, getVocab, XP } from "../../data/learningData";
import { useGame } from "../../engine/store";
import { sfx } from "../../engine/sfx";
import { HD2DStage } from "./HD2DStage";
import { PixelSprite } from "./PixelSprite";
import { PixelFrame } from "./PixelFrame";
import { PixelCommandButtons } from "./PixelCommandButtons";
import { FluencyComboMeter } from "./FluencyComboMeter";
import { MeaningBreakEffect } from "./MeaningBreakEffect";
import { StatBar } from "../../ui/primitives";

// ───────────────────────────────────────────────────────────────────────────
// Component 9 of 15 — PixelBattleStage
// Side-view HD-2D learning battle: Arin + Bori on the left, the Silence Wisp on
// the right, the current area as a pixel backdrop, and a bottom pixel command
// panel. Correct Korean answers attack (glowing pixel word over Arin, slash +
// damage pop), reduce the Confusion Shield (Meaning Break), and build the
// Fluency Combo. Preserves the original battle logic exactly.
// ───────────────────────────────────────────────────────────────────────────

interface PixelBattleStageProps {
  enemyId: string;
  theme: AreaTheme;
  viewportW: number;
  viewportH: number;
  onEnd: (victory: boolean, stats: { correct: number; xp: number }) => void;
}

type Command = "word" | "sound" | "grammar" | "hint" | "review" | "item";

const COMBO = [1, 1.2, 1.4, 1.7, 2.0];
function comboMult(streak: number): number {
  return COMBO[Math.min(streak, COMBO.length - 1)];
}
const BASE_DMG = 14;

export function PixelBattleStage({ enemyId, theme, viewportW, viewportH, onEnd }: PixelBattleStageProps) {
  const game = useGame();
  const { progress } = game;
  const enemy = getEnemy(enemyId) as EnemyDef;

  const questions = useMemo(
    () => enemy.questionIds.map(getQuestion).filter(Boolean) as NonNullable<ReturnType<typeof getQuestion>>[],
    [enemy],
  );

  const [enemyHp, setEnemyHp] = useState(enemy.hp);
  const [shield, setShield] = useState(enemy.confusionShield);
  const [combo, setCombo] = useState(0);
  const [meaningBreak, setMeaningBreak] = useState(false);
  const [exposed, setExposed] = useState(false);
  const [correctRun, setCorrectRun] = useState(0);
  const [playerHp, setPlayerHp] = useState(progress.hearts * 20);
  const maxPlayerHp = progress.maxHearts * 20;

  const [phase, setPhase] = useState<"command" | "question" | "result" | "over">("command");
  const qIdxRef = useRef(0);
  const [currentQ, setCurrentQ] = useState(questions[0]);
  const [log, setLog] = useState<string[]>([`A ${enemy.name} blocks the gate!`]);
  const [floatDmg, setFloatDmg] = useState<{ id: number; n: number; crit: boolean } | null>(null);
  const [glowWord, setGlowWord] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const [slash, setSlash] = useState(0);
  const [arinCast, setArinCast] = useState(false);
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
      const gain = XP.correct + (usedHint ? 0 : XP.noHintBonus);
      game.addXp(gain);
      setXpTotal((x) => x + gain);
      game.bumpDaily("dq2");

      let dmg = BASE_DMG * comboMult(newCombo);
      let crit = newCombo >= 4;
      if (meaningBreak) { dmg *= 1.6; crit = true; setMeaningBreak(false); }
      if (exposed) { dmg *= 1.5; crit = true; setExposed(false); }
      dmg = Math.round(dmg);

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

      if (enemy.isBoss && run >= 3 && !exposed) {
        setExposed(true);
        pushLog(`${enemy.name} is EXPOSED! Bonus damage next hit.`);
      }

      const vocab = q.vocabId ? getVocab(q.vocabId) : undefined;
      setGlowWord(vocab?.korean ?? q.answer);
      setArinCast(true);
      setSlash((s) => s + 1);
      floatId.current += 1;
      setFloatDmg({ id: floatId.current, n: dmg, crit });
      setShake((s) => s + 1);
      const nextHp = Math.max(0, enemyHp - dmg);
      setEnemyHp(nextHp);
      pushLog(`Correct! ${vocab?.korean ?? q.answer} strikes for ${dmg}${crit ? " (combo!)" : ""}.`);

      window.setTimeout(() => {
        setGlowWord(null);
        setArinCast(false);
        if (nextHp <= 0) victory();
        else setPhase("command");
      }, 900);
    } else {
      sfx("error");
      setCombo(0);
      setCorrectRun(0);
      if (enemy.isBoss && shield < enemy.confusionShield) {
        setShield((s) => Math.min(enemy.confusionShield, s + 1));
        pushLog("Wrong — the fog thickens, restoring some shield.");
      }
      const vocab = q.vocabId ? getVocab(q.vocabId) : undefined;
      pushLog(`Not quite. ${q.answer}${vocab ? ` = ${vocab.english}` : ""}. Bori: "It's okay — you'll get it!"`);
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
      if (nextHp <= 0 || progress.hearts <= 0) defeat();
      else setPhase("command");
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

  const worldWidth = Math.max(viewportW * 1.05, 1000);
  const laneFrac = 0.74;
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
        <HD2DStage
          theme={theme}
          camX={0}
          worldWidth={worldWidth}
          viewportW={viewportW}
          viewportH={viewportH}
          laneFrac={laneFrac}
        >
          {/* Arin + Bori on the left */}
          <div style={{ position: "absolute", left: worldWidth * 0.22, top: laneFrac * viewportH, transform: "translate(-50%,-100%)", zIndex: 22 }}>
            <div className={arinCast ? "coer-cast" : undefined}>
              <PixelSprite name="arin" height={150} facing="right" glow={arinCast} />
            </div>
            {glowWord && (
              <div className="coer-dmg absolute" style={{ left: "50%", top: -70, transform: "translateX(-50%)", color: "#ffe9a8", fontSize: 26, textShadow: "0 0 16px rgba(255,220,140,0.9)", whiteSpace: "nowrap" }}>
                {glowWord}
              </div>
            )}
          </div>
          <div style={{ position: "absolute", left: worldWidth * 0.13, top: laneFrac * viewportH - 20, transform: "translate(-50%,-100%)", zIndex: 21 }}>
            <PixelSprite name="bori" height={84} facing="right" glow hover />
          </div>

          {/* enemy right */}
          <div style={{ position: "absolute", left: worldWidth * 0.78, top: laneFrac * viewportH, transform: "translate(-50%,-100%)", zIndex: 22 }}>
            <div className={meaningBreak ? "opacity-60" : ""}>
              <PixelSprite name="wisp" height={150} facing="left" hover glow />
            </div>
            {slash > 0 && (
              <div key={`sl-${slash}`} className="coer-slash absolute" style={{ left: "10%", top: "20%", width: 70, height: 6, background: "linear-gradient(90deg,transparent,#fff3c4,transparent)", boxShadow: "0 0 14px rgba(255,240,180,0.9)" }} />
            )}
            {floatDmg && (
              <div key={floatDmg.id} className="coer-dmg absolute" style={{ left: "50%", top: -40, transform: "translateX(-50%)", color: floatDmg.crit ? "#ffd86a" : "#ff8a8a", fontSize: floatDmg.crit ? 34 : 26, fontWeight: 700, textShadow: "0 0 12px rgba(0,0,0,0.7)" }}>
                {floatDmg.n}
              </div>
            )}
          </div>
        </HD2DStage>

        {/* battle entry flash */}
        <div className="coer-battle-flash absolute inset-0 bg-violet-300/30 pointer-events-none" style={{ zIndex: 25 }} />

        <MeaningBreakEffect show={showBreak} />
      </div>

      {/* enemy HP + shield bar */}
      <div className="absolute top-3 right-3 z-30 w-[260px]">
        <PixelFrame className="p-2">
          <div className="flex justify-between text-xs text-[#e9cf86] mb-1">
            <span>{enemy.name}{enemy.isBoss ? " (Boss)" : ""}</span>
            <span>{enemyHp}/{enemy.hp}</span>
          </div>
          <div className="h-2.5 bg-black/55 overflow-hidden border border-black/60">
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
        </PixelFrame>
      </div>

      <FluencyComboMeter combo={combo} />

      {/* bottom command / question panel */}
      <div className="absolute inset-x-0 bottom-0 z-30 p-3">
        <PixelFrame className="mx-auto max-w-[720px] p-3">
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

          <div className="h-[52px] overflow-hidden text-[12px] text-[#cfc6ad] leading-tight mb-2 bg-black/25 p-1.5 border border-[rgba(216,178,90,0.15)]">
            {log.slice(-3).map((l, i) => (<div key={i}>{l}</div>))}
          </div>

          {phase === "command" || phase === "result" || phase === "over" ? (
            <PixelCommandButtons
              columns={3}
              options={commands.map((c) => ({
                label: c.label,
                title: c.desc,
                disabled: phase !== "command",
                state: phase === "command" ? "idle" : "dim",
                onClick: () => pickCommand(c.id),
              }))}
            />
          ) : (
            <div>
              <div className="text-center mb-2">
                {currentQ.subPrompt && (
                  <div className="text-3xl text-[#ffe9a8] mb-0.5" style={{ textShadow: "0 0 16px rgba(255,220,140,0.6)" }}>{currentQ.subPrompt}</div>
                )}
                <div className="text-sm text-[#ece6d6]">{currentQ.prompt}</div>
                {showHint && (
                  <div className="text-xs text-[#ffd98a] mt-1">
                    Bori: {vocabHint ? `${vocabHint.korean} = ${vocabHint.english}` : `Answer: ${currentQ.answer}`}
                  </div>
                )}
              </div>
              <PixelCommandButtons
                columns={2}
                options={currentQ.options.map((o) => ({ label: o, onClick: () => answer(o) }))}
              />
            </div>
          )}
        </PixelFrame>
      </div>
    </div>
  );
}
