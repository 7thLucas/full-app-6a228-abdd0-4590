import { useGame } from "../engine/store";
import { MAIN_QUEST } from "../data/gameData";
import { MenuShell } from "./Wordbook";

// Story quest journal: title, learning objective, story objective, progress, rewards.
export function QuestJournal({ onClose }: { onClose: () => void }) {
  const game = useGame();
  const idx = game.progress.questIndex;
  const total = MAIN_QUEST.objectives.length;
  const pct = Math.round((idx / total) * 100);

  return (
    <MenuShell title="Quests" onClose={onClose}>
      <div className="coer-panel coer-panel-frame p-4 mb-4">
        <div className="coer-heading text-lg mb-1">{MAIN_QUEST.name}</div>
        <div className="grid sm:grid-cols-2 gap-2 mb-3 text-sm">
          <div className="rounded border border-[rgba(216,178,90,0.3)] bg-black/30 p-2">
            <div className="text-[10px] uppercase tracking-wider text-[#caa24e]">Learning Objective</div>
            <div className="text-[#ece6d6]">{MAIN_QUEST.learningObjective}</div>
          </div>
          <div className="rounded border border-[rgba(216,178,90,0.3)] bg-black/30 p-2">
            <div className="text-[10px] uppercase tracking-wider text-[#caa24e]">Story Objective</div>
            <div className="text-[#ece6d6]">{MAIN_QUEST.storyObjective}</div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-[#bfb59c] mb-1">
          <span>Progress</span>
          <span>{idx}/{total}</span>
        </div>
        <div className="h-3 rounded-full bg-black/50 border border-[rgba(216,178,90,0.3)] overflow-hidden mb-3">
          <div className="h-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#caa24e,#ffd98a)", transition: "width 0.5s" }} />
        </div>

        <div className="grid gap-1.5">
          {MAIN_QUEST.objectives.map((o, i) => {
            const done = i < idx;
            const active = i === idx;
            return (
              <div
                key={o.id}
                className={`flex items-center gap-2 rounded px-2.5 py-1.5 text-sm ${
                  active ? "bg-[rgba(216,178,90,0.1)] border border-[rgba(216,178,90,0.4)]" : ""
                }`}
              >
                <span className={done ? "text-emerald-400" : active ? "text-[#e9cf86]" : "text-[#555]"}>
                  {done ? "✓" : active ? "▶" : "○"}
                </span>
                <span className={done ? "text-[#bfb59c] line-through" : active ? "text-[#ece6d6]" : "text-[#888]"}>
                  {o.text}
                </span>
                {o.learning && <span className="ml-auto text-[11px] text-[#ffd98a]">{o.learning}</span>}
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-[12px] text-[#caa24e]">Rewards: {MAIN_QUEST.rewards}</div>
      </div>
    </MenuShell>
  );
}
