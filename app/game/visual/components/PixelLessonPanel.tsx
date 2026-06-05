import { useMemo, useState } from "react";
import { getQuestion, getVocab, type LessonNode, XP } from "../../data/learningData";
import { useGame } from "../../engine/store";
import { sfx } from "../../engine/sfx";
import { PixelFrame } from "./PixelFrame";
import { PixelSprite } from "./PixelSprite";
import { PixelCommandButtons, type CommandState } from "./PixelCommandButtons";

// ───────────────────────────────────────────────────────────────────────────
// Component 8 of 15 — PixelLessonPanel
// Magical lesson UI: navy translucent pixel frame, gold border, a parchment
// inner card for the Korean content, a Bori hint bubble (pixel-sprite, no
// emoji), and a hearts / XP / streak / progress footer. Drives the exact same
// learning logic as the original lesson (vocab learn, XP, hearts, mastery).
// ───────────────────────────────────────────────────────────────────────────

export interface LessonResult {
  lessonId: string;
  correct: number;
  total: number;
  xpGained: number;
  coinsGained: number;
  failed: boolean;
  wordsLearned: string[];
  mistakes: string[];
}

interface PixelLessonPanelProps {
  lesson: LessonNode;
  onComplete: (result: LessonResult) => void;
  onAbort: () => void;
}

const BORI_CORRECT = [
  "Yes! You've got it.",
  "Beautiful. The letters are listening.",
  "See? You're a natural.",
  "That's the one. Keep going!",
];
const BORI_WRONG = [
  "Close! Don't worry, every traveler stumbles.",
  "Not quite — but now you'll remember it.",
  "Hmm, not that one. Let's lock it in next time.",
];

export function PixelLessonPanel({ lesson, onComplete, onAbort }: PixelLessonPanelProps) {
  const game = useGame();
  const { progress, settings } = game;
  const questions = useMemo(
    () => lesson.questionIds.map(getQuestion).filter(Boolean) as NonNullable<ReturnType<typeof getQuestion>>[],
    [lesson],
  );

  const [phase, setPhase] = useState<"intro" | "quiz">("intro");
  const [qi, setQi] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [noHintAll, setNoHintAll] = useState(true);

  // per-question UI state
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [boriLine, setBoriLine] = useState("");

  const introVocab = lesson.vocabIds.map(getVocab).filter(Boolean);

  function startQuiz() {
    sfx("advance");
    lesson.vocabIds.forEach((v) => game.learnWord(v));
    setPhase("quiz");
  }

  function commitResult(isCorrect: boolean) {
    const q = questions[qi];
    game.recordAnswer(q.vocabId, isCorrect);
    if (!usedHint && !isCorrect) setNoHintAll(false);
    if (usedHint) setNoHintAll(false);

    if (isCorrect) {
      setCorrect((c) => c + 1);
      let gain = XP.correct;
      if (!usedHint) gain += XP.noHintBonus;
      game.addXp(gain);
      setXpGained((x) => x + gain);
      game.bumpDaily("dq2");
    } else {
      setMistakes((m) => [...m, q.id]);
      const h = game.loseHeart();
      if (h <= 0) {
        finish(true);
        return;
      }
    }

    window.setTimeout(() => {
      if (qi + 1 < questions.length) {
        setQi((i) => i + 1);
        setPicked(null);
        setRevealed(false);
        setUsedHint(false);
        setShowHint(false);
        setBoriLine("");
      } else {
        finish(false);
      }
    }, 1100);
  }

  function choose(opt: string) {
    if (revealed) return;
    const q = questions[qi];
    const isCorrect = opt === q.answer;
    setPicked(opt);
    setRevealed(true);
    sfx(isCorrect ? "item" : "error");
    const arr = isCorrect ? BORI_CORRECT : BORI_WRONG;
    setBoriLine(arr[Math.floor(Math.random() * arr.length)]);
    commitResult(isCorrect);
  }

  function finish(failed: boolean) {
    const total = questions.length;
    let bonus = 0;
    let coins = 0;
    if (!failed) {
      bonus += XP.lessonComplete;
      if (mistakes.length === 0) bonus += XP.perfectLesson;
      if (noHintAll) bonus += XP.noHintBonus;
      coins = 8 + correct * 2;
      game.addXp(bonus);
      game.addCoins(coins);
      game.completeLesson(lesson.id);
      game.bumpDaily("dq1");
      sfx("victory");
    } else {
      sfx("error");
    }
    game.saveNow();
    onComplete({
      lessonId: lesson.id,
      correct,
      total,
      xpGained: xpGained + bonus,
      coinsGained: coins,
      failed,
      wordsLearned: lesson.vocabIds,
      mistakes,
    });
  }

  const q = questions[qi];
  const vocab = q?.vocabId ? getVocab(q.vocabId) : undefined;
  const big = settings.largerText;

  function optState(opt: string): CommandState {
    if (!revealed) return "idle";
    if (opt === q.answer) return "correct";
    if (opt === picked) return "wrong";
    return "dim";
  }

  return (
    <div className="absolute inset-0 z-40 flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 w-full max-w-[580px]">
        {/* footer-style header: hearts + progress + exit */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1">
            {Array.from({ length: progress.maxHearts }).map((_, i) => (
              <span key={i} className={i < progress.hearts ? "text-rose-400" : "text-[#3a3340]"}>♥</span>
            ))}
          </div>
          {phase === "quiz" && (
            <div className="flex-1 mx-3 h-2.5 bg-black/55 border border-black/60 overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${(qi / questions.length) * 100}%`,
                  background: "repeating-linear-gradient(90deg,#caa24e 0 4px,#e9cf86 4px 8px)",
                  transition: "width 0.4s",
                }}
              />
            </div>
          )}
          <button type="button" onClick={onAbort} className="text-xs text-[#bfb59c] hover:text-[#e9cf86]">
            ✕ Exit
          </button>
        </div>

        {phase === "intro" ? (
          <PixelFrame className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 border-2 border-[rgba(216,178,90,0.4)] bg-[rgba(8,12,26,0.6)] flex items-center justify-center">
                <PixelSprite name="bori" height={50} hover glow />
              </div>
              <div>
                <div className="coer-heading text-base">{lesson.title}</div>
                <div className="text-xs text-[#bfb59c]">{lesson.goal}</div>
              </div>
            </div>
            <BoriBubble text="Let's learn this together. Read it once, then I'll quiz you gently." />
            {introVocab.length > 0 ? (
              <div className="grid gap-2 my-3">
                {introVocab.map((v) => (
                  <div key={v!.id} className="border-2 border-[rgba(216,178,90,0.3)] bg-[rgba(54,46,32,0.5)] p-2.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl text-[#ffe9a8]" style={{ textShadow: "0 0 14px rgba(255,220,140,0.6)" }}>{v!.korean}</span>
                      {settings.showRomanization && <span className="text-sm text-[#bfb59c]">{v!.romanization}</span>}
                      <span className="text-sm text-[#ece6d6]">— {v!.english}</span>
                    </div>
                    <div className="text-[12px] text-[#bfb59c] mt-1">
                      {v!.example}
                      {settings.showEnglishHint && ` (${v!.exampleEnglish})`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-[rgba(216,178,90,0.3)] bg-[rgba(54,46,32,0.5)] p-3 my-3 text-center">
                <div className="text-4xl text-[#ffe9a8]" style={{ textShadow: "0 0 16px rgba(255,220,140,0.6)" }}>
                  {lesson.id === "l1" ? "ㅏ" : lesson.id === "l2" ? "ㅓ" : "ㄱ + ㅏ = 가"}
                </div>
                <div className="text-sm text-[#bfb59c] mt-1">{lesson.goal}</div>
              </div>
            )}
            <div className="flex justify-end">
              <PixelCommandButtons options={[{ label: "Start practice →", onClick: startQuiz }]} columns={2} />
            </div>
          </PixelFrame>
        ) : (
          <PixelFrame className="p-4 sm:p-5">
            <div className="text-center mb-3">
              {q.subPrompt && (
                <div className="text-[#ffe9a8] mb-1" style={{ fontSize: big ? 52 : 42, textShadow: "0 0 18px rgba(255,220,140,0.6)", lineHeight: 1.1 }}>
                  {q.subPrompt}
                </div>
              )}
              <div className={`text-[#ece6d6] ${big ? "text-lg" : "text-base"}`}>{q.prompt}</div>
              {q.type === "listening" && (
                <button type="button" className="mt-2 px-3 py-1.5 border-2 border-[rgba(216,178,90,0.5)] text-[#e9cf86] text-sm hover:border-[#e9cf86]" onClick={() => sfx("advance")}>
                  ▶ Play Audio Placeholder
                </button>
              )}
            </div>

            <PixelCommandButtons
              big={big}
              columns={2}
              options={q.options.map((opt) => ({
                label: opt,
                state: optState(opt),
                disabled: revealed,
                onClick: () => choose(opt),
              }))}
            />

            {!revealed && (
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setShowHint(true); setUsedHint(true); sfx("select"); }}
                  className="text-xs text-[#bfb59c] hover:text-[#e9cf86] hover:underline underline-offset-2"
                >
                  Ask Bori for a hint
                </button>
                {usedHint && <span className="text-[10px] text-[#bfb59c]">hint used · less XP</span>}
              </div>
            )}

            {showHint && !revealed && (
              <div className="mt-2">
                <BoriBubble text={vocab ? `${vocab.korean} = ${vocab.english}${settings.showRomanization ? ` (${vocab.romanization})` : ""}.` : `The answer is "${q.answer}".`} />
              </div>
            )}

            {revealed && (
              <div className={`mt-3 p-3 border-2 ${picked === q.answer ? "border-emerald-400/50 bg-emerald-900/15" : "border-amber-400/40 bg-amber-900/10"}`}>
                <div className={`text-sm font-semibold ${picked === q.answer ? "text-emerald-200" : "text-amber-200"}`}>
                  {picked === q.answer ? "Correct!" : `The answer is ${q.answer}`}
                </div>
                <div className="text-[13px] text-[#ece6d6] mt-0.5">{q.explanation}</div>
                {vocab && (settings.showRomanization || settings.showEnglishHint) && (
                  <div className="text-[12px] text-[#bfb59c] mt-1">
                    {vocab.korean}
                    {settings.showRomanization && ` · ${vocab.romanization}`}
                    {settings.showEnglishHint && ` · ${vocab.english}`}
                  </div>
                )}
                <div className="mt-2"><BoriBubble text={boriLine} /></div>
              </div>
            )}
          </PixelFrame>
        )}
      </div>
    </div>
  );
}

// Small Bori hint bubble using the pixel sprite (no emoji).
function BoriBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 bg-[rgba(8,12,26,0.45)] border border-[rgba(216,178,90,0.25)] p-2">
      <div className="shrink-0 -mt-0.5">
        <PixelSprite name="bori" height={26} hover glow />
      </div>
      <p className="text-[13px] text-[#ffd98a] leading-snug">
        <span className="text-[#e9cf86] font-semibold">Bori: </span>
        {text}
      </p>
    </div>
  );
}
