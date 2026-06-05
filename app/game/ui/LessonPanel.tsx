import { useMemo, useState } from "react";
import { getQuestion, getVocab, type LessonNode, XP } from "../data/learningData";
import { useGame } from "../engine/store";
import { QuestionCard } from "./QuestionCard";
import { Sprite } from "../visual/Sprite";
import { GoldButton } from "./primitives";
import { sfx } from "../engine/sfx";

export interface LessonResult {
  lessonId: string;
  correct: number;
  total: number;
  xpGained: number;
  coinsGained: number;
  failed: boolean;
  wordsLearned: string[];
  mistakes: string[]; // question ids missed
}

interface LessonPanelProps {
  lesson: LessonNode;
  onComplete: (result: LessonResult) => void;
  onAbort: () => void;
}

// Runs a full lesson: teach intro -> question sequence -> tally. Hearts come
// from player progress; a wrong answer costs a heart. 0 hearts = lesson fails
// (retryable). Tracks vocab mastery and XP via the store.
export function LessonPanel({ lesson, onComplete, onAbort }: LessonPanelProps) {
  const game = useGame();
  const { progress } = game;
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

  const introVocab = lesson.vocabIds.map(getVocab).filter(Boolean);

  function startQuiz() {
    sfx("advance");
    // learn the words up front
    lesson.vocabIds.forEach((v) => game.learnWord(v));
    setPhase("quiz");
  }

  function handleResult(isCorrect: boolean, usedHint: boolean) {
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

    if (qi + 1 < questions.length) {
      setQi((i) => i + 1);
    } else {
      finish(false);
    }
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

  return (
    <div className="absolute inset-0 z-40 flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 w-full max-w-[560px]">
        {/* hearts + progress */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1">
            {Array.from({ length: progress.maxHearts }).map((_, i) => (
              <span key={i} className={i < progress.hearts ? "text-rose-400" : "text-[#3a3340]"}>
                ♥
              </span>
            ))}
          </div>
          {phase === "quiz" && (
            <div className="flex-1 mx-3 h-2 rounded-full bg-black/50 border border-black/60 overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${((qi + (phase === "quiz" ? 0 : 0)) / questions.length) * 100}%`,
                  background: "linear-gradient(90deg,#caa24e,#e9cf86)",
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
          <div className="coer-panel coer-panel-frame p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded border border-[rgba(216,178,90,0.4)] bg-black/40 flex items-center justify-center">
                <Sprite kind="bori" size={48} />
              </div>
              <div>
                <div className="coer-heading text-base">{lesson.title}</div>
                <div className="text-xs text-[#bfb59c]">{lesson.goal}</div>
              </div>
            </div>
            <p className="text-sm text-[#ece6d6] mb-3">
              🦊 Bori: Let's learn this together. Read it once, then I'll quiz you gently.
            </p>
            {introVocab.length > 0 && (
              <div className="grid gap-2 mb-3">
                {introVocab.map((v) => (
                  <div key={v!.id} className="rounded border border-[rgba(216,178,90,0.3)] bg-black/30 p-2.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl text-[#ffe9a8]" style={{ textShadow: "0 0 14px rgba(255,220,140,0.6)" }}>
                        {v!.korean}
                      </span>
                      {game.settings.showRomanization && <span className="text-sm text-[#bfb59c]">{v!.romanization}</span>}
                      <span className="text-sm text-[#ece6d6]">— {v!.english}</span>
                    </div>
                    <div className="text-[12px] text-[#bfb59c] mt-1">
                      {v!.example}
                      {game.settings.showEnglishHint && ` (${v!.exampleEnglish})`}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {introVocab.length === 0 && (
              <div className="rounded border border-[rgba(216,178,90,0.3)] bg-black/30 p-3 mb-3 text-center">
                <div className="text-4xl text-[#ffe9a8]" style={{ textShadow: "0 0 16px rgba(255,220,140,0.6)" }}>
                  {lesson.id === "l1" ? "ㅏ" : lesson.id === "l2" ? "ㅓ" : "ㄱ + ㅏ = 가"}
                </div>
                <div className="text-sm text-[#bfb59c] mt-1">{lesson.goal}</div>
              </div>
            )}
            <div className="flex justify-end">
              <GoldButton onClick={startQuiz}>Start practice →</GoldButton>
            </div>
          </div>
        ) : (
          <QuestionCard key={questions[qi].id} question={questions[qi]} onResult={handleResult} />
        )}
      </div>
    </div>
  );
}
