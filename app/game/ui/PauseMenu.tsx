import type { Screen } from "../engine/store";
import { Heading } from "./primitives";
import { sfx } from "../engine/sfx";

interface PauseMenuProps {
  onResume: () => void;
  onOpen: (s: Screen) => void;
  onSave: () => void;
  onTitle: () => void;
}

const TABS: { label: string; screen: Screen; icon: string }[] = [
  { label: "Learn Path", screen: "map", icon: "🗺️" },
  { label: "Wordbook", screen: "wordbook", icon: "📖" },
  { label: "Quests", screen: "quests", icon: "📜" },
  { label: "Review", screen: "review", icon: "🔁" },
  { label: "Character", screen: "character", icon: "🧭" },
  { label: "Shop", screen: "shop", icon: "🏮" },
  { label: "Settings", screen: "settings", icon: "⚙️" },
];

// ESC pause menu with all the game's tabs.
export function PauseMenu({ onResume, onOpen, onSave, onTitle }: PauseMenuProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/65" onClick={onResume} />
      <div className="coer-panel coer-panel-frame relative z-10 w-full max-w-[420px] p-5">
        <Heading className="text-xl mb-4 text-center">Paused</Heading>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {TABS.map((t) => (
            <button
              key={t.screen}
              type="button"
              onClick={() => {
                sfx("select");
                onOpen(t.screen);
              }}
              className="rounded border border-[rgba(216,178,90,0.4)] px-3 py-2.5 text-sm text-[#ece6d6] bg-gradient-to-b from-[rgba(25,32,58,0.9)] to-[rgba(10,15,30,0.95)] hover:border-[#e9cf86] hover:text-[#e9cf86] flex items-center gap-2 transition-all"
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              sfx("save");
              onSave();
            }}
            className="flex-1 rounded border border-[rgba(216,178,90,0.4)] px-3 py-2 text-sm text-[#ece6d6] hover:border-[#e9cf86] hover:text-[#e9cf86]"
          >
            💾 Save
          </button>
          <button
            type="button"
            onClick={onResume}
            className="flex-1 rounded border border-[#e9cf86] px-3 py-2 text-sm text-[#e9cf86]"
          >
            ▶ Resume
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            sfx("select");
            onTitle();
          }}
          className="w-full mt-2 text-xs text-[#bfb59c] hover:text-[#e9cf86]"
        >
          Save & Return to Title
        </button>
      </div>
    </div>
  );
}
