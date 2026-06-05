import { useMemo, useState } from "react";
import { useGame } from "../engine/store";
import { getVocab, XP } from "../data/learningData";
import { MenuShell } from "./Wordbook";
import { GoldButton } from "../ui/primitives";
import { sfx } from "../engine/sfx";

type Tab = "due" | "weak" | "recent" | "mastered";

const STRENGTH_COLOR: Record<string, string> = {
  Weak: "text-rose-300 border-rose-500/40",
  Medium: "text-amber-300 border-amber-500/40",
  Strong: "text-emerald-300 border-emerald-500/40",
};

// Spaced-repetition review. Weak words surface first; correct review raises
// strength, wrong lowers it. Includes a quick review quiz.
export function ReviewScreen({ onClose }: { onClose: () => void }) {
  const game = useGame();
  const { progress, settings } = game;
  const [tab, setTab] = useState<Tab>("due");
  const [quiz, setQuiz] = useState<string | null>(null);

  const words = Object.values(progress.learnedWords);
  const filtered = useMemo(() => {
    const arr = [...words];
    switch (tab) {
      case "weak":
        return arr.filter((w) => w.strength === "Weak");
      case "recent":
        return arr.sort((a, b) => b.learnedOn.localeCompare(a.learnedOn)).slice(0, 8);
      case "mastered":
        return arr.filter((w) => w.mastery === "Mastered");
      default:
        // due: weakest first
        return arr.sort((a, b) => strengthOrder(a.strength) - strengthOrder(b.strength));
    }
  }, [words, tab]);

  if (quiz) {
    const v = getVocab(quiz);
    if (!v) {
      setQuiz(null);
      return null;
    }
    // build a 4-option meaning quiz
    const distractors = ["Water", "Book", "House", "Friend", "Rice", "School"];
    const opts = [v.english, ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5);
    return (
      <MenuShell title="Review" onClose={() => setQuiz(null)}>
        <div className="coer-panel coer-panel-frame p-5 max-w-[420px] mx-auto text-center">
          <div className="text-4xl text-[#ffe9a8] mb-1" style={{ textShadow: "0 0 16px rgba(255,220,140,0.6)" }}>
            {v.korean}
          </div>
          {settings.showRomanization && <div className="text-sm text-[#bfb59c] mb-3">{v.romanization}</div>}
          <div className="text-sm text-[#ece6d6] mb-3">What does it mean?</div>
          <div className="grid grid-cols-2 gap-2">
            {opts.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => {
                  const correct = o === v.english;
                  game.recordAnswer(v.id, correct);
                  if (correct) {
                    game.addXp(XP.reviewCorrect);
                    game.bumpDaily("dq3");
                    sfx("item");
                  } else {
                    sfx("error");
                  }
                  game.saveNow();
                  setQuiz(null);
                }}
                className="rounded border border-[rgba(216,178,90,0.5)] px-3 py-2.5 text-sm text-[#ece6d6] bg-gradient-to-b from-[rgba(25,32,58,0.9)] to-[rgba(10,15,30,0.95)] hover:border-[#e9cf86] hover:text-[#e9cf86]"
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </MenuShell>
    );
  }

  return (
    <MenuShell title="Review Words" onClose={onClose}>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {(["due", "weak", "recent", "mastered"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
              tab === t ? "border-[#e9cf86] text-[#e9cf86] bg-[rgba(216,178,90,0.1)]" : "border-[rgba(216,178,90,0.3)] text-[#bfb59c]"
            }`}
          >
            {t === "due" ? "Due today" : t === "weak" ? "Weak" : t === "recent" ? "Recently learned" : "Mastered"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[#bfb59c] text-center py-8">Nothing here yet. Learn more words first!</p>
      ) : (
        <div className="grid gap-2">
          {filtered.map((w) => {
            const v = getVocab(w.vocabId);
            if (!v) return null;
            return (
              <div key={w.vocabId} className="coer-panel p-3 flex items-center gap-2">
                <span className="text-xl text-[#ffe9a8]">{v.korean}</span>
                <span className="text-sm text-[#ece6d6]">{v.english}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${STRENGTH_COLOR[w.strength]}`}>{w.strength}</span>
                <GoldButton className="ml-auto !px-3 !py-1 text-xs" onClick={() => setQuiz(w.vocabId)}>
                  Review
                </GoldButton>
              </div>
            );
          })}
        </div>
      )}
    </MenuShell>
  );
}

function strengthOrder(s: string): number {
  return s === "Weak" ? 0 : s === "Medium" ? 1 : 2;
}
