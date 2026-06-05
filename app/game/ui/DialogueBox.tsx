import { useEffect, useRef, useState } from "react";
import { Sprite, type SpriteKind } from "../visual/Sprite";

export interface DialogueLine {
  speaker: string;
  portrait?: SpriteKind;
  text: string;
  korean?: string;
}

interface DialogueBoxProps {
  lines: DialogueLine[];
  textSpeed: "slow" | "normal" | "fast";
  onComplete: () => void;
}

const SPEEDS = { slow: 55, normal: 28, fast: 12 };

// Typewriter dialogue panel anchored to the bottom of the viewport.
export function DialogueBox({ lines, textSpeed, onComplete }: DialogueBoxProps) {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const line = lines[idx];

  useEffect(() => {
    if (!line) return;
    setShown("");
    setDone(false);
    let i = 0;
    const full = line.text;
    timerRef.current = setInterval(() => {
      i += 1;
      setShown(full.slice(0, i));
      if (i >= full.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setDone(true);
      }
    }, SPEEDS[textSpeed]);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [idx, line, textSpeed]);

  const advance = () => {
    if (!done) {
      if (timerRef.current) clearInterval(timerRef.current);
      setShown(line.text);
      setDone(true);
      return;
    }
    if (idx + 1 < lines.length) setIdx(idx + 1);
    else onComplete();
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        advance();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!line) return null;

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-40 p-3 sm:p-4 cursor-pointer"
      onClick={advance}
    >
      <div className="coer-panel coer-panel-frame mx-auto max-w-[760px] p-3 sm:p-4">
        <div className="flex items-start gap-3">
          {line.portrait && (
            <div className="shrink-0 w-14 h-14 rounded border border-[rgba(216,178,90,0.4)] bg-black/40 flex items-center justify-center">
              <Sprite kind={line.portrait} size={46} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="coer-heading text-sm mb-1">{line.speaker}</div>
            {line.korean && (
              <div className="text-2xl text-[#ffe9a8] mb-1" style={{ textShadow: "0 0 14px rgba(255,220,140,0.6)" }}>
                {line.korean}
              </div>
            )}
            <p className="text-[15px] leading-relaxed text-[#ece6d6]">{shown}</p>
          </div>
        </div>
        <div className="mt-2 text-right text-[11px] text-[#bfb59c]">
          {done ? (idx + 1 < lines.length ? "▶ Space / Click" : "✓ Space / Click") : "…"}
        </div>
      </div>
    </div>
  );
}
