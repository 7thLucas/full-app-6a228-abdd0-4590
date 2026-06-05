import { useState } from "react";
import { VOCAB, getVocab } from "../../data/learningData";
import { useGame } from "../../engine/store";
import { sfx } from "../../engine/sfx";

// ───────────────────────────────────────────────────────────────────────────
// Component 15 of 15 — MagicalWordbook
// Open-book word collection: left page is the list of restored words, right
// page shows the selected word's detail with a mastery meter and a bookmark to
// flag weak words for review. Styled as an aged parchment tome.
// ───────────────────────────────────────────────────────────────────────────

const MASTERY_PCT: Record<string, number> = {
  New: 20,
  Practiced: 40,
  Familiar: 60,
  Strong: 80,
  Mastered: 100,
};

interface MagicalWordbookProps {
  onClose: () => void;
}

export function MagicalWordbook({ onClose }: MagicalWordbookProps) {
  const game = useGame();
  const { progress, settings } = game;
  const learnedIds = Object.keys(progress.learnedWords);
  const [selected, setSelected] = useState<string | null>(learnedIds[0] ?? null);

  const v = selected ? getVocab(selected) : undefined;
  const wp = selected ? progress.learnedWords[selected] : undefined;
  const weak = wp?.strength === "Weak";

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-3">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%,#162038,#0a0f1e 75%)" }} />

      {/* tome */}
      <div
        className="relative z-10 w-full max-w-[760px] h-[80%] flex"
        style={{
          background: "linear-gradient(180deg,#3a2f1e,#241b10)",
          border: "3px solid #6a5226",
          boxShadow: "0 0 0 3px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.7)",
        }}
      >
        {/* spine */}
        <div className="absolute left-1/2 top-2 bottom-2 -translate-x-1/2 w-3 bg-[#1a130a] z-20" style={{ boxShadow: "0 0 12px rgba(0,0,0,0.8)" }} />

        {/* left page: list */}
        <div className="flex-1 p-4 overflow-y-auto coer-scroll" style={{ background: "linear-gradient(180deg,#ece6d6,#d9cfb6)" }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#5a4422] font-semibold tracking-wide" style={{ fontFamily: "Cinzel, serif" }}>Wordbook</h3>
            <span className="text-[11px] text-[#7a6240]">{learnedIds.length}/{VOCAB.length} restored</span>
          </div>
          {learnedIds.length === 0 && (
            <p className="text-sm text-[#7a6240] py-6 text-center">No words yet. Complete lessons and talk to villagers to fill these pages.</p>
          )}
          <div className="space-y-1">
            {learnedIds.map((id) => {
              const ve = getVocab(id);
              const w = progress.learnedWords[id];
              if (!ve) return null;
              const active = id === selected;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => { sfx("select"); setSelected(id); }}
                  className={`w-full text-left px-2 py-1.5 flex items-center gap-2 border-l-4 transition-colors ${active ? "bg-[#c9bb98] border-[#caa24e]" : "border-transparent hover:bg-[#dcd2b9]"}`}
                >
                  <span className="text-lg text-[#3a2c14]">{ve.korean}</span>
                  <span className="text-[12px] text-[#6a5226]">{ve.english}</span>
                  {w.strength === "Weak" && <span className="ml-auto text-[#9a3a3a] text-xs" title="weak word">⚑</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* right page: detail */}
        <div className="flex-1 p-5 overflow-y-auto coer-scroll" style={{ background: "linear-gradient(180deg,#e7e0cd,#d4c9af)" }}>
          {v && wp ? (
            <div>
              <div className="text-4xl text-[#3a2c14] mb-1" style={{ textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>{v.korean}</div>
              {settings.showRomanization && <div className="text-sm text-[#7a6240] italic">{v.romanization}</div>}
              <div className="text-lg text-[#4a3818] mt-1">{v.english}</div>
              <div className="text-[11px] uppercase tracking-wider text-[#9a7a3a] mt-1">{v.category}</div>

              {/* mastery meter */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-[#7a6240] mb-1">
                  <span>Mastery: {wp.mastery}</span>
                  <span>Memory: {wp.strength}</span>
                </div>
                <div className="h-3 bg-[#b8a981] border border-[#8a6e3a] overflow-hidden">
                  <div className="h-full" style={{ width: `${MASTERY_PCT[wp.mastery]}%`, background: "repeating-linear-gradient(90deg,#caa24e 0 4px,#e9cf86 4px 8px)" }} />
                </div>
              </div>

              {/* example */}
              <div className="mt-4 p-2 bg-[#d9cfb1] border border-[#bca97a]">
                <div className="text-[#3a2c14]">{v.example}</div>
                {settings.showRomanization && <div className="text-[12px] text-[#7a6240] italic">{v.exampleRoman}</div>}
                {settings.showEnglishHint && <div className="text-[12px] text-[#6a5226]">{v.exampleEnglish}</div>}
              </div>

              <div className="mt-3 flex items-center gap-3 text-[11px] text-[#7a6240]">
                <span>✓ {wp.correctCount} correct</span>
                <span>✕ {wp.wrongCount} missed</span>
                {weak && <span className="ml-auto text-[#9a3a3a]">⚑ Bookmarked weak — review soon</span>}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#7a6240] py-10 text-center">Select a word from the left page.</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => { sfx("select"); onClose(); }}
        className="absolute top-4 right-4 z-20 px-3 py-1.5 border-2 border-[rgba(216,178,90,0.5)] text-[#e9cf86] text-sm hover:border-[#e9cf86]"
      >
        ✕ Close
      </button>
    </div>
  );
}
