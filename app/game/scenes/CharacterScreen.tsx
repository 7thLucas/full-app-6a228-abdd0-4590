import { useGame } from "../engine/store";
import { levelForXp, nextLevel, LEARNER_LEVELS } from "../data/learningData";
import { MenuShell } from "./Wordbook";
import { Sprite } from "../visual/Sprite";

// Character screen: learner identity, level ladder, totals.
export function CharacterScreen({ onClose }: { onClose: () => void }) {
  const game = useGame();
  const { progress } = game;
  const lvl = levelForXp(progress.xp);
  const nxt = nextLevel(progress.xp);
  const learned = Object.keys(progress.learnedWords).length;
  const mastered = Object.values(progress.learnedWords).filter((w) => w.mastery === "Mastered").length;

  return (
    <MenuShell title="Character" onClose={onClose}>
      <div className="coer-panel coer-panel-frame p-4 mb-4 flex items-center gap-4">
        <div className="w-20 h-20 rounded border border-[rgba(216,178,90,0.4)] bg-black/40 flex items-center justify-center">
          <Sprite kind="arin" size={64} />
        </div>
        <div>
          <div className="coer-heading text-xl">{progress.learnerName}</div>
          <div className="text-sm text-[#e9cf86]">L{lvl.level} · {lvl.title}</div>
          <div className="text-[12px] text-[#bfb59c] mt-0.5">{progress.xp} XP · 🪙 {progress.coins} · 🔥 Day {progress.streak}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Stat label="Words" value={`${learned}`} />
        <Stat label="Mastered" value={`${mastered}`} />
        <Stat label="Lessons" value={`${progress.completedLessons.length}`} />
      </div>

      <div className="coer-panel p-4">
        <div className="text-sm text-[#ece6d6] mb-2">Learner Levels</div>
        <div className="grid gap-1.5">
          {LEARNER_LEVELS.map((l) => {
            const reached = progress.xp >= l.xpRequired;
            const current = lvl.level === l.level;
            return (
              <div
                key={l.level}
                className={`flex items-center justify-between rounded px-2.5 py-1.5 text-sm ${
                  current ? "bg-[rgba(216,178,90,0.12)] border border-[rgba(216,178,90,0.4)]" : ""
                }`}
              >
                <span className={reached ? "text-[#e9cf86]" : "text-[#777]"}>
                  L{l.level} · {l.title}
                </span>
                <span className="text-[11px] text-[#bfb59c]">{l.xpRequired} XP</span>
              </div>
            );
          })}
        </div>
        {nxt && <div className="text-[12px] text-[#ffd98a] mt-2">{nxt.xpRequired - progress.xp} XP until {nxt.title}.</div>}
      </div>
    </MenuShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[rgba(216,178,90,0.3)] bg-black/30 py-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-[#bfb59c]">{label}</div>
      <div className="text-xl text-[#e9cf86]">{value}</div>
    </div>
  );
}
