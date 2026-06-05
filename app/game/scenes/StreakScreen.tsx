import { useGame } from "../engine/store";
import { levelForXp, nextLevel } from "../data/learningData";
import { Panel, Heading, GoldButton } from "../ui/primitives";

interface Props {
  onContinue: () => void;
  onClose?: () => void;
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

// Daily streak screen with the Memory Flame (glowing spirit fire, not a plain
// fire icon) plus weekly calendar and daily XP goal.
export function StreakScreen({ onContinue, onClose }: Props) {
  const game = useGame();
  const { progress } = game;
  const lvl = levelForXp(progress.xp);
  const nxt = nextLevel(progress.xp);
  const goalPct = Math.min(100, Math.round((progress.dailyXp / Math.max(1, progress.dailyGoal)) * 100));

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 60%,#3a2a1e,#140d08 70%)" }} />
      <Panel className="relative z-10 w-full max-w-[440px] p-6 text-center">
        {onClose && (
          <button type="button" onClick={onClose} className="absolute top-3 right-3 text-xs text-[#bfb59c] hover:text-[#e9cf86]">
            ✕
          </button>
        )}
        {/* Memory Flame: layered glowing spirit fire */}
        <div className="relative mx-auto mb-3" style={{ width: 90, height: 110 }}>
          <div
            className="absolute coer-flicker"
            style={{
              left: "50%",
              bottom: 0,
              transform: "translateX(-50%)",
              width: 60,
              height: 90,
              borderRadius: "50% 50% 50% 50% / 70% 70% 40% 40%",
              background: "radial-gradient(circle at 50% 70%,#fff3c0,#ffb84a 40%,#ff6a3c 70%,transparent 85%)",
              boxShadow: "0 0 50px 20px rgba(255,150,70,0.5)",
            }}
          />
          <div
            className="absolute coer-flicker"
            style={{
              left: "50%",
              bottom: 10,
              transform: "translateX(-50%)",
              width: 30,
              height: 55,
              borderRadius: "50% 50% 50% 50% / 70% 70% 40% 40%",
              background: "radial-gradient(circle at 50% 70%,#fff,#9fd0ff 50%,#5a9ad8 80%,transparent)",
              animationDelay: "0.3s",
            }}
          />
        </div>
        <Heading className="text-3xl mb-0.5">Day {progress.streak}</Heading>
        <p className="text-sm text-[#ffd98a] mb-4">Your Memory Flame burns bright. Keep it alive!</p>

        {/* weekly calendar */}
        <div className="flex justify-center gap-1.5 mb-4">
          {DAYS.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-[#bfb59c]">{d}</span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border ${
                  progress.weekDays[i]
                    ? "border-amber-400 bg-amber-500/30 text-amber-200 shadow-[0_0_10px_rgba(255,180,90,0.5)]"
                    : "border-[rgba(216,178,90,0.25)] bg-black/30 text-[#555]"
                }`}
              >
                {progress.weekDays[i] ? "✦" : "·"}
              </div>
            </div>
          ))}
        </div>

        {/* daily XP goal — scroll-shaped bar */}
        <div className="text-left mb-4">
          <div className="flex justify-between text-xs text-[#bfb59c] mb-1">
            <span>Daily XP Goal</span>
            <span>{progress.dailyXp}/{progress.dailyGoal} XP</span>
          </div>
          <div className="h-3 rounded-full bg-black/50 border border-[rgba(216,178,90,0.3)] overflow-hidden">
            <div className="h-full" style={{ width: `${goalPct}%`, background: "linear-gradient(90deg,#caa24e,#ffd98a)", transition: "width 0.5s" }} />
          </div>
        </div>

        <div className="mb-4 rounded border border-[rgba(216,178,90,0.3)] bg-black/30 p-2.5 text-sm">
          <span className="text-[#bfb59c]">Learner Level </span>
          <span className="text-[#e9cf86]">L{lvl.level} · {lvl.title}</span>
          {nxt && <div className="text-[11px] text-[#bfb59c] mt-0.5">{nxt.xpRequired - progress.xp} XP to {nxt.title}</div>}
        </div>

        <GoldButton onClick={onContinue}>Continue your journey</GoldButton>
      </Panel>
    </div>
  );
}
