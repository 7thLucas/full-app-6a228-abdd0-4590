import { useGame } from "../engine/store";
import { DAILY_QUESTS } from "../data/gameData";
import { MenuShell } from "./Wordbook";
import { GoldButton } from "../ui/primitives";
import { sfx } from "../engine/sfx";

// Daily quests: track progress, claim rewards (XP, coins, Bori affection).
export function DailyQuestScreen({ onClose }: { onClose: () => void }) {
  const game = useGame();
  const { progress } = game;

  function claim(id: string, xp: number, coins: number) {
    if (progress.dailyClaimed.includes(id)) return;
    progress.dailyClaimed.push(id);
    game.addXp(xp);
    game.addCoins(coins);
    progress.boriAffection += 1;
    game.saveNow();
    sfx("quest");
  }

  return (
    <MenuShell title="Daily Quest" onClose={onClose}>
      <p className="text-sm text-[#ffd98a] text-center mb-4">
        Bori: Finish a few of these every day to keep your Memory Flame burning!
      </p>
      <div className="grid gap-2.5">
        {DAILY_QUESTS.map((dq) => {
          const cur = Math.min(dq.target, progress.dailyProgress[dq.id] ?? 0);
          const complete = cur >= dq.target;
          const claimed = progress.dailyClaimed.includes(dq.id);
          return (
            <div key={dq.id} className="coer-panel p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-[#ece6d6]">{dq.text}</span>
                <span className="text-[11px] text-[#bfb59c]">{cur}/{dq.target}</span>
              </div>
              <div className="h-2 rounded-full bg-black/50 overflow-hidden border border-black/60 mb-2">
                <div className="h-full" style={{ width: `${(cur / dq.target) * 100}%`, background: "linear-gradient(90deg,#caa24e,#ffd98a)", transition: "width 0.4s" }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#caa24e]">+{dq.reward.xp} XP · ◈ {dq.reward.coins} · ♥ Bori</span>
                <GoldButton className="!px-3 !py-1 text-xs" disabled={!complete || claimed} onClick={() => claim(dq.id, dq.reward.xp, dq.reward.coins)}>
                  {claimed ? "Claimed" : complete ? "Claim" : "In progress"}
                </GoldButton>
              </div>
            </div>
          );
        })}
      </div>
    </MenuShell>
  );
}
