import type { LessonResult } from "../ui/LessonPanel";
import { getVocab } from "../data/learningData";
import { useGame } from "../engine/store";
import { Panel, Heading, GoldButton } from "../ui/primitives";
import { Sprite } from "../visual/Sprite";

interface Props {
  result: LessonResult;
  streak: number;
  onContinue: () => void;
  onReview: () => void;
  onMap: () => void;
}

export function LessonCompleteScreen({ result, streak, onContinue, onReview, onMap }: Props) {
  const game = useGame();
  const accuracy = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 100;
  const words = result.wordsLearned.map(getVocab).filter(Boolean);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%,#2a3a5e,#0e1730 70%)" }} />
      <Panel className="relative z-10 w-full max-w-[460px] p-6 text-center">
        <div className="flex justify-center mb-2">
          <Sprite kind="bori" size={64} />
        </div>
        <Heading className="text-2xl mb-1">{result.failed ? "Lesson Paused" : "Lesson Complete!"}</Heading>
        {result.failed ? (
          <p className="text-sm text-[#bfb59c] mb-4">You ran out of hearts — no shame, traveler. Try again when ready.</p>
        ) : (
          <p className="text-sm text-[#ffd98a] mb-4">🦊 Bori: That was wonderful. The letters shine brighter now.</p>
        )}

        {words.length > 0 && (
          <div className="text-left mb-4">
            <div className="text-xs uppercase tracking-wider text-[#bfb59c] mb-1">Words Restored</div>
            <div className="grid gap-1.5">
              {words.map((w) => (
                <div key={w!.id} className="flex items-baseline gap-2 rounded border border-[rgba(216,178,90,0.3)] bg-black/30 px-2.5 py-1.5">
                  <span className="text-lg text-[#ffe9a8]">{w!.korean}</span>
                  <span className="text-xs text-[#bfb59c]">{w!.romanization}</span>
                  <span className="text-sm text-[#ece6d6] ml-auto">{w!.english}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <Stat label="Accuracy" value={`${accuracy}%`} />
          <Stat label="XP" value={`+${result.xpGained}`} />
          <Stat label="Coins" value={`+${result.coinsGained}`} />
        </div>

        {!result.failed && (
          <div className="mb-4 rounded border border-amber-500/40 bg-amber-900/15 p-2.5 flex items-center justify-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="text-sm text-amber-200">Memory Flame: Day {streak} streak alive</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <GoldButton onClick={onContinue}>{result.failed ? "Try Again" : "Continue Story"}</GoldButton>
          <div className="flex gap-2">
            <GoldButton className="flex-1" onClick={onReview}>Review Mistakes</GoldButton>
            <GoldButton className="flex-1" onClick={onMap}>Return to Map</GoldButton>
          </div>
        </div>
        <div className="text-[11px] text-[#bfb59c] mt-3">
          Level {game.progress.xp >= 0 ? "" : ""}XP total: {game.progress.xp}
        </div>
      </Panel>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[rgba(216,178,90,0.3)] bg-black/30 py-2">
      <div className="text-[10px] uppercase tracking-wider text-[#bfb59c]">{label}</div>
      <div className="text-lg text-[#e9cf86]">{value}</div>
    </div>
  );
}
