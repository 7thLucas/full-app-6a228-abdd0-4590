import { useGame } from "../engine/store";
import { VOCAB, getVocab } from "../data/learningData";
import { Heading } from "../ui/primitives";

const MASTERY_COLOR: Record<string, string> = {
  New: "text-slate-300 border-slate-500/40",
  Practiced: "text-sky-300 border-sky-500/40",
  Familiar: "text-emerald-300 border-emerald-500/40",
  Strong: "text-amber-300 border-amber-500/40",
  Mastered: "text-[#e9cf86] border-[#e9cf86]/60",
};

export function Wordbook({ onClose }: { onClose: () => void }) {
  const game = useGame();
  const { progress, settings } = game;
  const learned = Object.keys(progress.learnedWords);

  return (
    <MenuShell title="Wordbook" onClose={onClose}>
      {learned.length === 0 && (
        <p className="text-sm text-[#bfb59c] text-center py-8">
          No words yet. Talk to villagers and complete lessons to fill your Wordbook.
        </p>
      )}
      <div className="grid gap-2.5">
        {learned.map((id) => {
          const v = getVocab(id);
          const wp = progress.learnedWords[id];
          if (!v) return null;
          return (
            <div key={id} className="coer-panel p-3">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl text-[#ffe9a8]" style={{ textShadow: "0 0 12px rgba(255,220,140,0.5)" }}>
                  {v.korean}
                </span>
                {settings.showRomanization && <span className="text-sm text-[#bfb59c]">{v.romanization}</span>}
                <span className="text-sm text-[#ece6d6]">— {v.english}</span>
                <span className={`ml-auto text-[11px] px-2 py-0.5 rounded-full border ${MASTERY_COLOR[wp.mastery]}`}>
                  {wp.mastery}
                </span>
              </div>
              <div className="text-[12px] text-[#bfb59c] mt-1">
                <span className="text-[#caa24e]">{v.category}</span> · {v.example}
                {settings.showEnglishHint && ` (${v.exampleEnglish})`}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-[11px] text-[#bfb59c] text-center mt-3">
        {learned.length}/{VOCAB.length} words restored
      </div>
    </MenuShell>
  );
}

// Shared menu overlay shell.
export function MenuShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%,#162038,#0a0f1e 70%)" }} />
      <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-[rgba(216,178,90,0.25)]">
        <Heading className="text-xl">{title}</Heading>
        <button type="button" onClick={onClose} className="px-3 py-1.5 rounded border border-[rgba(216,178,90,0.5)] text-[#e9cf86] text-sm hover:border-[#e9cf86]">
          ✕ Close
        </button>
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto coer-scroll p-4 max-w-[680px] mx-auto w-full">{children}</div>
    </div>
  );
}
