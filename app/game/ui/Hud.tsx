import { useEffect, useState } from "react";
import { useGame } from "../engine/store";
import { MAIN_QUEST } from "../data/quests";
import { StatBar, KeyHint } from "../ui/primitives";

// Top-left location label (fades in on area change), current objective, mini
// HP/SP, and contextual button hints along the bottom.
export function Hud({ areaName }: { areaName: string }) {
  const game = useGame();
  const p = game.state.player;
  const idx = game.state.questIndex;
  const objective =
    idx < MAIN_QUEST.objectives.length
      ? MAIN_QUEST.objectives[idx].text
      : "Chapter complete.";

  const [locKey, setLocKey] = useState(0);
  useEffect(() => setLocKey((k) => k + 1), [areaName]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 45 }}>
      {/* location name */}
      <div
        key={`loc-${locKey}`}
        className="coer-fade-in"
        style={{ position: "absolute", top: 12, left: 14 }}
      >
        <div className="coer-heading text-lg" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
          {areaName}
        </div>
        <div className="text-[11px] text-[#cdbf9a] mt-0.5 max-w-[260px]" style={{ textShadow: "0 1px 4px #000" }}>
          ▸ {objective}
        </div>
      </div>

      {/* mini HP/SP */}
      <div
        style={{ position: "absolute", top: 12, right: 14, width: 150 }}
        className="space-y-1"
      >
        <StatBar value={p.hp} max={p.maxHp} color="hp" label="HP" compact />
        <StatBar value={p.sp} max={p.maxSp} color="sp" label="SP" compact />
        <div className="text-right text-[11px] text-[#e9cf86]">Lv {p.level} · ⛃ {p.coins}</div>
      </div>

      {/* button hints */}
      <div
        style={{ position: "absolute", bottom: 12, left: 14 }}
        className="hidden sm:flex items-center gap-3 opacity-80"
      >
        <KeyHint keys="WASD" label="Move" />
        <KeyHint keys="E" label="Interact" />
        <KeyHint keys="Shift" label="Dash" />
        <KeyHint keys="Esc" label="Menu" />
      </div>
    </div>
  );
}
