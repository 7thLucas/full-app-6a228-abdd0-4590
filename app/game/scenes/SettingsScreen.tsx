import { useConfigurables } from "~/modules/configurables";
import { useGame } from "../engine/store";
import { Heading, GoldButton, Panel, KeyHint } from "../ui/primitives";
import { setAudioLevels, sfx } from "../engine/sfx";

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const game = useGame();
  const { settings, setSettings } = game;

  const update = (patch: Partial<typeof settings>) => {
    setSettings(patch);
    const next = { ...settings, ...patch };
    setAudioLevels(next.master, next.sfx);
  };

  return (
    <Overlay title="Settings" onBack={onBack}>
      <div className="space-y-4">
        <Slider
          label="Master Volume (placeholder mix)"
          value={settings.master}
          onChange={(v) => update({ master: v })}
        />
        <Slider
          label="Music — Theme Placeholder"
          value={settings.music}
          onChange={(v) => update({ music: v })}
        />
        <Slider label="SFX" value={settings.sfx} onChange={(v) => { update({ sfx: v }); sfx("select"); }} />

        <div>
          <div className="text-xs text-[#bfb59c] mb-1.5 uppercase tracking-wider">Text Speed</div>
          <div className="flex gap-2">
            {(["slow", "normal", "fast"] as const).map((s) => (
              <GoldButton
                key={s}
                active={settings.textSpeed === s}
                onClick={() => { setSettings({ textSpeed: s }); sfx("advance"); }}
                className="capitalize px-4"
              >
                {s}
              </GoldButton>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-[#bfb59c] mb-1.5 uppercase tracking-wider">Controls</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            <KeyHint keys="WASD / ←↑↓→" label="Move" />
            <KeyHint keys="Shift" label="Dash" />
            <KeyHint keys="E / Enter" label="Interact" />
            <KeyHint keys="Space" label="Advance dialogue" />
            <KeyHint keys="Esc" label="Menu" />
            <KeyHint keys="Click" label="UI / commands" />
          </div>
        </div>
      </div>
    </Overlay>
  );
}

export function CreditsScreen({ onBack }: { onBack: () => void }) {
  const { config } = useConfigurables();
  return (
    <Overlay title={config.creditsLabel || "Credits"} onBack={onBack}>
      <div className="space-y-3 text-sm text-[#cdbf9a] leading-relaxed">
        <p>{config.creditsBody}</p>
        <div className="pt-2 border-t border-white/10 space-y-1 text-[13px]">
          <CreditRow role="World & Story" name="Asterra — The Eight Roads" />
          <CreditRow role="Chapter" name="The Ashen Oath (Kael, Chapter 1)" />
          <CreditRow role="Systems" name="Guard Shatter · Momentum · Turn-based Combat" />
          <CreditRow role="Art" name="Original placeholder pixel sprites (SVG/CSS)" />
          <CreditRow role="Audio" name="Procedural placeholder SFX" />
        </div>
        <p className="text-[11px] text-[#7c745f] italic pt-2">
          A genre homage — all characters, names, world, and assets are original.
        </p>
      </div>
    </Overlay>
  );
}

function CreditRow({ role, name }: { role: string; name: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#bfb59c]">{role}</span>
      <span className="text-[#ece6d6] text-right ml-3">{name}</span>
    </div>
  );
}

function Overlay({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, #161f38 0%, #0a0f1f 60%, #05070f 100%)",
        }}
      />
      <div className="coer-vignette" style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 30 }} className="flex items-center justify-center p-6">
        <Panel className="w-full max-w-lg p-6">
          <Heading className="text-2xl mb-4 text-center">{title}</Heading>
          {children}
          <div className="mt-6 text-center">
            <GoldButton onClick={() => { sfx("select"); onBack(); }} active className="px-6">
              Back
            </GoldButton>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs text-[#bfb59c] mb-1.5">
        <span className="uppercase tracking-wider">{label}</span>
        <span className="text-[#e9cf86]">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#d8b25a]"
        style={{ accentColor: "#d8b25a" }}
      />
    </div>
  );
}
