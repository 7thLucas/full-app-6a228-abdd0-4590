import { useState } from "react";
import { Sprite } from "../visual/Sprite";
import { Panel, Heading, GoldButton } from "../ui/primitives";
import { sfx } from "../engine/sfx";

interface OnboardingProps {
  onDone: (level: string, placement: string, name: string) => void;
  onBack: () => void;
}

const LEVELS = [
  { id: "beginner", label: "Total Beginner", reply: "Perfect. We'll start from the first letters." },
  { id: "hangul", label: "I know some Hangul", reply: "Great. We'll review the letters quickly before moving into phrases." },
  { id: "phrases", label: "I know basic phrases", reply: "Wonderful. We'll warm up, then build real sentences." },
  { id: "review", label: "I want to review", reply: "Let's polish what you know and keep your Memory Flame bright." },
];

const PLACEMENT = {
  prompt: "Quick check — what does 안녕하세요 mean?",
  korean: "안녕하세요",
  options: ["Hello", "Goodbye", "Thank you", "I don't know yet"],
  answer: "Hello",
};

export function OnboardingScreen({ onDone, onBack }: OnboardingProps) {
  const [step, setStep] = useState<"level" | "placement" | "intro">("level");
  const [level, setLevel] = useState<string>("");
  const [placement, setPlacement] = useState<string>("");
  const [name, setName] = useState("Arin");

  const chosen = LEVELS.find((l) => l.id === level);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,#0c1428 0%,#1a2a4a 50%,#2a3a5e 100%)" }}
      />
      <div className="absolute coer-bob" style={{ left: "12%", bottom: "14%" }}>
        <Sprite kind="bori" size={84} />
      </div>

      <Panel className="relative z-10 w-full max-w-[520px] p-5">
        {step === "level" && (
          <>
            <Heading className="text-xl mb-1">What is your Korean level?</Heading>
            <p className="text-sm text-[#bfb59c] mb-4">Bori will tailor your first steps. Everyone begins at Chapter 0.</p>
            <div className="flex flex-col gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setLevel(l.id);
                    sfx("select");
                  }}
                  className={`text-left rounded border px-4 py-3 transition-all bg-gradient-to-b from-[rgba(25,32,58,0.9)] to-[rgba(10,15,30,0.95)] ${
                    level === l.id
                      ? "border-[#e9cf86] text-[#e9cf86] shadow-[0_0_16px_rgba(216,178,90,0.3)]"
                      : "border-[rgba(216,178,90,0.4)] text-[#ece6d6] hover:border-[#e9cf86]"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            {chosen && (
              <div className="mt-3 text-sm text-[#ffd98a] bg-black/30 rounded p-2 border border-[rgba(216,178,90,0.3)]">
                🦊 Bori: {chosen.reply}
              </div>
            )}
            <div className="mt-4 flex justify-between">
              <GoldButton onClick={onBack}>Back</GoldButton>
              <GoldButton disabled={!level} onClick={() => setStep("placement")}>
                Continue
              </GoldButton>
            </div>
          </>
        )}

        {step === "placement" && (
          <>
            <Heading className="text-xl mb-1">A tiny placement question</Heading>
            <p className="text-sm text-[#bfb59c] mb-3">No pressure — there are no wrong starts here.</p>
            <div className="text-center text-4xl text-[#ffe9a8] mb-1" style={{ textShadow: "0 0 16px rgba(255,220,140,0.6)" }}>
              {PLACEMENT.korean}
            </div>
            <div className="text-center text-[#ece6d6] mb-3">{PLACEMENT.prompt}</div>
            <div className="grid grid-cols-2 gap-2">
              {PLACEMENT.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => {
                    setPlacement(o);
                    sfx(o === PLACEMENT.answer ? "item" : "select");
                  }}
                  className={`rounded border px-3 py-2.5 text-sm transition-all bg-gradient-to-b from-[rgba(25,32,58,0.9)] to-[rgba(10,15,30,0.95)] ${
                    placement === o
                      ? "border-[#e9cf86] text-[#e9cf86]"
                      : "border-[rgba(216,178,90,0.4)] text-[#ece6d6] hover:border-[#e9cf86]"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
            {placement && (
              <div className="mt-3 text-sm text-[#ffd98a] bg-black/30 rounded p-2 border border-[rgba(216,178,90,0.3)]">
                🦊 Bori:{" "}
                {placement === PLACEMENT.answer
                  ? "Nicely done — you already know a greeting! We'll still cover the letters."
                  : "No worries at all. That's exactly what we're here to learn together."}
              </div>
            )}
            <div className="mt-4 flex justify-between">
              <GoldButton onClick={() => setStep("level")}>Back</GoldButton>
              <GoldButton disabled={!placement} onClick={() => setStep("intro")}>
                Continue
              </GoldButton>
            </div>
          </>
        )}

        {step === "intro" && (
          <>
            <Heading className="text-xl mb-1">Your name, traveler?</Heading>
            <p className="text-sm text-[#bfb59c] mb-3">
              You are a lost traveler seeking the Letters of Light to restore language to Haneul Road.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 16))}
              className="w-full rounded border border-[rgba(216,178,90,0.4)] bg-black/40 px-3 py-2 text-[#ece6d6] focus:outline-none focus:border-[#e9cf86]"
              placeholder="Arin"
            />
            <div className="mt-3 text-sm text-[#ffd98a] bg-black/30 rounded p-2 border border-[rgba(216,178,90,0.3)]">
              🦊 Bori: Then let's go, {name || "traveler"}. The Letter Shrine is waiting at dawn.
            </div>
            <div className="mt-4 flex justify-between">
              <GoldButton onClick={() => setStep("placement")}>Back</GoldButton>
              <GoldButton onClick={() => onDone(level, placement, name || "Arin")}>Begin the Journey</GoldButton>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}
