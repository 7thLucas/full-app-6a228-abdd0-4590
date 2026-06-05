import { useGame } from "../engine/store";
import { levelForXp, nextLevel } from "../data/learningData";
import { KeyHint } from "./primitives";

// Exploration HUD: area, learning goal, hearts, XP bar, Memory Flame streak.
export function Hud({ areaName, goal }: { areaName: string; goal: string }) {
  const game = useGame();
  const { progress } = game;
  const lvl = levelForXp(progress.xp);
  const nxt = nextLevel(progress.xp);
  const xpInto = progress.xp - lvl.xpRequired;
  const xpSpan = nxt ? nxt.xpRequired - lvl.xpRequired : 1;
  const xpPct = nxt ? Math.min(100, (xpInto / xpSpan) * 100) : 100;

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
      <div className="flex items-start justify-between p-2.5 gap-2">
        {/* left: area + goal */}
        <div className="coer-panel px-3 py-2 max-w-[280px]">
          <div className="text-[11px] uppercase tracking-wider text-[#caa24e]">Area</div>
          <div className="text-sm text-[#e9cf86]">{areaName}</div>
          <div className="text-[11px] text-[#bfb59c] mt-1">Goal: {goal}</div>
        </div>

        {/* right: vitals */}
        <div className="coer-panel px-3 py-2 min-w-[180px]">
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: progress.maxHearts }).map((_, i) => (
              <span key={i} className={i < progress.hearts ? "text-rose-400" : "text-[#3a3340]"}>♥</span>
            ))}
            <span className="ml-auto flex items-center gap-1 text-amber-300 text-xs">
              <span className="coer-flicker">🔥</span> Day {progress.streak}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#bfb59c] mb-0.5">
            <span>L{lvl.level} {lvl.title}</span>
            <span>{nxt ? `${xpInto}/${xpSpan} XP` : "MAX"}</span>
          </div>
          <div className="h-2 rounded-full bg-black/50 overflow-hidden border border-black/60">
            <div className="h-full" style={{ width: `${xpPct}%`, background: "linear-gradient(90deg,#caa24e,#ffd98a)", transition: "width 0.45s" }} />
          </div>
          <div className="mt-1 text-[10px] text-[#caa24e] text-right">🪙 {progress.coins}</div>
        </div>
      </div>

      <div className="px-3 mt-0.5">
        <div className="coer-panel inline-flex gap-3 px-3 py-1 pointer-events-auto">
          <KeyHint keys="A / D" label="Walk" />
          <KeyHint keys="E" label="Interact" />
          <KeyHint keys="Esc" label="Menu" />
        </div>
      </div>
    </div>
  );
}
