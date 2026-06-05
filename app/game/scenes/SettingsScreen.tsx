import { useGame, type Settings } from "../engine/store";
import { setAudioLevels, sfx } from "../engine/sfx";
import { MenuShell } from "./Wordbook";

// Accessibility + game settings.
export function SettingsScreen({ onClose }: { onClose: () => void }) {
  const game = useGame();
  const { settings } = game;

  function toggle(key: keyof Settings, value: boolean) {
    game.setSettings({ [key]: value } as Partial<Settings>);
    sfx("select");
  }

  return (
    <MenuShell title="Settings" onClose={onClose}>
      <div className="grid gap-2.5 max-w-[480px] mx-auto">
        <Toggle
          label="Show romanization"
          hint="Display romanized pronunciation (recommended for beginners)"
          value={settings.showRomanization}
          onChange={(v) => toggle("showRomanization", v)}
        />
        <Toggle
          label="Show English hint"
          hint="Show English meaning alongside Korean"
          value={settings.showEnglishHint}
          onChange={(v) => toggle("showEnglishHint", v)}
        />
        <Toggle
          label="Slow mode"
          hint="Extra time and gentler pacing"
          value={settings.slowMode}
          onChange={(v) => toggle("slowMode", v)}
        />
        <Toggle
          label="Larger text"
          hint="Bigger Korean and answer text"
          value={settings.largerText}
          onChange={(v) => toggle("largerText", v)}
        />
        <Toggle
          label="Sound"
          hint="Procedural sound effects"
          value={settings.sound}
          onChange={(v) => {
            setAudioLevels(v ? 70 : 0, v ? 80 : 0);
            toggle("sound", v);
          }}
        />

        <div className="coer-panel p-3">
          <div className="text-sm text-[#ece6d6] mb-2">Text speed</div>
          <div className="flex gap-2">
            {(["slow", "normal", "fast"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  game.setSettings({ textSpeed: s });
                  sfx("select");
                }}
                className={`flex-1 rounded border px-3 py-2 text-sm capitalize ${
                  settings.textSpeed === s ? "border-[#e9cf86] text-[#e9cf86]" : "border-[rgba(216,178,90,0.3)] text-[#bfb59c]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="coer-panel p-3 flex items-center justify-between">
          <div>
            <div className="text-sm text-[#ece6d6]">Background music</div>
            <div className="text-[11px] text-[#bfb59c]">Village Theme Placeholder</div>
          </div>
          <span className="text-[11px] text-[#bfb59c]">(placeholder)</span>
        </div>
      </div>
    </MenuShell>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="coer-panel p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm text-[#ece6d6]">{label}</div>
        <div className="text-[11px] text-[#bfb59c]">{hint}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`shrink-0 w-12 h-6 rounded-full border transition-all relative ${
          value ? "border-[#e9cf86] bg-[rgba(216,178,90,0.3)]" : "border-[rgba(216,178,90,0.3)] bg-black/40"
        }`}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
          style={{ left: value ? 26 : 3, background: value ? "#e9cf86" : "#6a6458" }}
        />
      </button>
    </div>
  );
}
