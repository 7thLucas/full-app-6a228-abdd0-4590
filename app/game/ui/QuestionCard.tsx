import { useMemo, useState } from "react";
import type { Question } from "../data/learningData";
import { getVocab } from "../data/learningData";
import { GoldButton } from "./primitives";
import { useGame } from "../engine/store";
import { sfx } from "../engine/sfx";

interface QuestionCardProps {
  question: Question;
  onResult: (correct: boolean, usedHint: boolean) => void;
  // compact battle mode tightens spacing
  compact?: boolean;
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

// QuestionCard renders any mini-game question type with feedback, hints, and
// accessibility-aware romanization / english hints.
export function QuestionCard({ question, onResult, compact }: QuestionCardProps) {
  const game = useGame();
  const { settings } = game;
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const vocab = question.vocabId ? getVocab(question.vocabId) : undefined;
  const boriLine = useMemo(() => {
    if (!revealed) return "";
    const correct = picked === question.answer;
    const arr = correct ? BORI_CORRECT : BORI_WRONG;
    return arr[Math.floor(Math.random() * arr.length)];
  }, [revealed, picked, question.answer]);

  const isCorrect = picked === question.answer;

  function choose(opt: string) {
    if (revealed) return;
    setPicked(opt);
    setRevealed(true);
    const correct = opt === question.answer;
    sfx(correct ? "item" : "error");
    // brief reveal pause before reporting
    window.setTimeout(() => onResult(correct, usedHint), 1100);
  }

  function optClass(opt: string): string {
    if (!revealed) {
      return "border-[rgba(216,178,90,0.5)] hover:border-[#e9cf86] hover:text-[#e9cf86]";
    }
    if (opt === question.answer) {
      return "border-emerald-400 text-emerald-200 shadow-[0_0_18px_rgba(110,231,183,0.4)] bg-emerald-900/20";
    }
    if (opt === picked) {
      return "border-rose-400/70 text-rose-200 bg-rose-900/15";
    }
    return "border-[rgba(216,178,90,0.2)] opacity-50";
  }

  const big = settings.largerText;

  return (
    <div className={compact ? "" : "coer-panel coer-panel-frame p-4 sm:p-5"}>
      {/* prompt */}
      <div className="text-center mb-3">
        {question.subPrompt && (
          <div
            className="text-[#ffe9a8] mb-1"
            style={{
              fontSize: big ? 52 : 42,
              textShadow: "0 0 18px rgba(255,220,140,0.6)",
              lineHeight: 1.1,
            }}
          >
            {question.subPrompt}
          </div>
        )}
        <div className={`text-[#ece6d6] ${big ? "text-lg" : "text-base"}`}>{question.prompt}</div>
        {question.type === "listening" && (
          <button
            type="button"
            className="mt-2 px-3 py-1.5 rounded border border-[rgba(216,178,90,0.5)] text-[#e9cf86] text-sm hover:border-[#e9cf86]"
            onClick={() => sfx("advance")}
          >
            ▶ Play Audio Placeholder
          </button>
        )}
      </div>

      {/* options grid */}
      <div className={`grid ${compact ? "grid-cols-2 gap-2" : "grid-cols-2 gap-2.5"}`}>
        {question.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => choose(opt)}
            disabled={revealed}
            className={`rounded border px-3 transition-all duration-150 bg-gradient-to-b from-[rgba(25,32,58,0.9)] to-[rgba(10,15,30,0.95)] text-[#ece6d6] ${
              big ? "py-3.5 text-lg" : "py-2.5 text-[15px]"
            } ${optClass(opt)}`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* hint button */}
      {!revealed && (
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setShowHint(true);
              setUsedHint(true);
              sfx("select");
            }}
            className="text-xs text-[#bfb59c] hover:text-[#e9cf86] underline-offset-2 hover:underline"
          >
            Ask Bori for a hint
          </button>
          {usedHint && <span className="text-[10px] text-[#bfb59c]">hint used · less XP</span>}
        </div>
      )}

      {showHint && !revealed && (
        <div className="mt-2 text-sm text-[#e9cf86] bg-black/30 rounded p-2 border border-[rgba(216,178,90,0.3)]">
          <span className="font-semibold">Bori:</span>{" "}
          {vocab
            ? `${vocab.korean} = ${vocab.english}${settings.showRomanization ? ` (${vocab.romanization})` : ""}.`
            : `The answer is "${question.answer}".`}
        </div>
      )}

      {/* feedback */}
      {revealed && (
        <div
          className={`mt-3 rounded p-3 border ${
            isCorrect
              ? "border-emerald-400/50 bg-emerald-900/15"
              : "border-amber-400/40 bg-amber-900/10"
          }`}
        >
          <div className={`text-sm font-semibold ${isCorrect ? "text-emerald-200" : "text-amber-200"}`}>
            {isCorrect ? "Correct!" : `The answer is ${question.answer}`}
          </div>
          <div className="text-[13px] text-[#ece6d6] mt-0.5">{question.explanation}</div>
          {vocab && (settings.showRomanization || settings.showEnglishHint) && (
            <div className="text-[12px] text-[#bfb59c] mt-1">
              {vocab.korean}
              {settings.showRomanization && ` · ${vocab.romanization}`}
              {settings.showEnglishHint && ` · ${vocab.english}`}
            </div>
          )}
          <div className="text-[13px] text-[#ffd98a] mt-1.5">🦊 Bori: {boriLine}</div>
        </div>
      )}
    </div>
  );
}
