import { useGame } from "../engine/store";
import { Panel, Heading, GoldButton } from "../ui/primitives";
import { Sprite } from "../visual/Sprite";
import { levelForXp } from "../data/learningData";

// End-of-prototype message after the first full daily lesson loop.
export function EndingScreen({ onReturn }: { onReturn: () => void }) {
  const game = useGame();
  const { progress } = game;
  const lvl = levelForXp(progress.xp);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#1c2a4c,#3e5688 50%,#e9b87a 100%)" }} />
      <div
        className="absolute"
        style={{ left: "50%", top: "20%", width: 160, height: 160, transform: "translateX(-50%)", borderRadius: "50%", background: "radial-gradient(circle,#fff3d6,#ffd98a 52%,transparent 74%)", boxShadow: "0 0 140px 60px rgba(255,210,140,0.4)" }}
      />
      <Panel className="relative z-10 w-full max-w-[460px] p-6 text-center">
        <div className="flex justify-center gap-2 mb-2">
          <Sprite kind="arin" size={56} />
          <Sprite kind="bori" size={56} />
        </div>
        <Heading className="text-2xl mb-1">The First Greeting Restored</Heading>
        <p className="text-sm text-[#ece6d6] mb-3">
          The Silence Wisp scatters into light. Across Haneul Road, the first letters glow awake again —
          and you spoke them yourself.
        </p>
        <p className="text-sm text-[#ffd98a] mb-4">
          Bori: You did it, {progress.learnerName}! You read Hangul, greeted a village, and won your first
          battle with Korean. The Market of Words awaits beyond the gate.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <End label="Level" value={`L${lvl.level}`} />
          <End label="XP" value={`${progress.xp}`} />
          <End label="Words" value={`${Object.keys(progress.learnedWords).length}`} />
        </div>

        <div className="mb-4 rounded border border-amber-500/40 bg-amber-900/15 p-3">
          <div className="text-amber-200 text-sm flex items-center justify-center gap-1.5">
            <span
              className="coer-flicker inline-block"
              style={{ width: 12, height: 16, borderRadius: "50% 50% 50% 50% / 70% 70% 40% 40%", background: "radial-gradient(circle at 50% 70%,#fff3c0,#ffb84a 45%,#ff6a3c 75%,transparent)" }}
            />
            Memory Flame · Day {progress.streak}
          </div>
          <div className="text-[13px] text-[#ece6d6] mt-1">Continue your journey tomorrow to keep it alive.</div>
        </div>

        <div className="coer-heading text-sm text-[#caa24e] mb-4">— End of Prototype —</div>
        <GoldButton onClick={onReturn}>Return to Title</GoldButton>
      </Panel>
    </div>
  );
}

function End({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[rgba(216,178,90,0.3)] bg-black/30 py-2">
      <div className="text-[10px] uppercase tracking-wider text-[#bfb59c]">{label}</div>
      <div className="text-lg text-[#e9cf86]">{value}</div>
    </div>
  );
}
