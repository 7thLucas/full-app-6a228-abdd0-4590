import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DialogueSequence, PortraitKind } from "../data/types";
import { Sprite } from "../visual/Sprite";
import { sfx } from "../engine/sfx";

const SPEED_MS: Record<string, number> = { slow: 42, normal: 22, fast: 8 };

interface DialogueBoxProps {
  sequence: DialogueSequence;
  textSpeed: "slow" | "normal" | "fast";
  onComplete: (lastChoice?: string) => void;
}

export function DialogueBox({ sequence, textSpeed, onComplete }: DialogueBoxProps) {
  const [lineIdx, setLineIdx] = useState(0);
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const charRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const line = sequence.lines[lineIdx];
  const fullText = line?.text ?? "";

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // typewriter
  useEffect(() => {
    setShown("");
    setDone(false);
    charRef.current = 0;
    clearTimer();
    const ms = SPEED_MS[textSpeed] ?? 22;
    timerRef.current = setInterval(() => {
      charRef.current += 1;
      setShown(fullText.slice(0, charRef.current));
      if (charRef.current % 2 === 0) sfx("advance");
      if (charRef.current >= fullText.length) {
        clearTimer();
        setDone(true);
      }
    }, ms);
    return clearTimer;
  }, [lineIdx, sequence.id]);

  const advance = useCallback(() => {
    if (!done) {
      // reveal full line instantly
      clearTimer();
      setShown(fullText);
      setDone(true);
      return;
    }
    if (line?.choices && line.choices.length > 0) return; // wait for choice click
    if (lineIdx < sequence.lines.length - 1) {
      sfx("select");
      setLineIdx((i) => i + 1);
    } else {
      sfx("select");
      onComplete();
    }
  }, [done, fullText, line, lineIdx, sequence.lines.length, onComplete]);

  // keyboard: space / enter advance
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if (k === " " || k === "enter" || k === "e") {
        e.preventDefault();
        advance();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance]);

  const speakerColor = useMemo(() => portraitTint(line?.portrait), [line?.portrait]);

  if (!line) return null;

  return (
    <div
      style={{ position: "absolute", inset: 0, zIndex: 60 }}
      className="flex items-end justify-center"
      onClick={advance}
    >
      {/* dim film */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />

      <div
        className="coer-panel coer-panel-frame coer-fade-in"
        style={{
          position: "relative",
          width: "92%",
          maxWidth: 760,
          margin: "0 0 18px",
          padding: "14px 18px 16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-4">
          {/* portrait */}
          {line.portrait && line.portrait !== "none" && (
            <div
              className="shrink-0 rounded coer-flicker"
              style={{
                width: 78,
                height: 78,
                border: `1px solid ${speakerColor}`,
                background: "radial-gradient(circle at 50% 40%, rgba(30,40,70,0.9), rgba(5,8,18,1))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 18px ${speakerColor}33`,
              }}
            >
              <PortraitGlyph portrait={line.portrait} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {line.speaker && (
              <div
                className="coer-heading text-sm mb-1"
                style={{ color: speakerColor }}
              >
                {line.speaker}
              </div>
            )}
            <p
              className="text-[15px] leading-relaxed text-[#ece6d6]"
              style={{ minHeight: 48, fontFamily: "'EB Garamond', serif" }}
            >
              {shown}
              {!done && <span className="coer-blink">▍</span>}
            </p>

            {/* choices */}
            {done && line.choices && line.choices.length > 0 && (
              <div className="mt-2 flex flex-col gap-1.5">
                {line.choices.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => {
                      sfx("select");
                      onComplete(c.label);
                    }}
                    className="coer-menu-item text-left text-sm px-3 py-1.5 rounded border border-[rgba(216,178,90,0.4)] hover:bg-[rgba(216,178,90,0.08)] text-[#ece6d6]"
                  >
                    ▸ {c.label}
                  </button>
                ))}
              </div>
            )}

            {/* continue indicator */}
            {done && (!line.choices || line.choices.length === 0) && (
              <div className="flex justify-end mt-1">
                <span className="coer-blink text-[#e9cf86] text-lg">▼</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function portraitTint(p?: PortraitKind): string {
  switch (p) {
    case "kael":
      return "#d8b25a";
    case "edrin":
      return "#a98fd0";
    case "voice":
      return "#c75bff";
    case "merchant":
      return "#6fc3a0";
    default:
      return "#cdbf9a";
  }
}

function PortraitGlyph({ portrait }: { portrait: PortraitKind }) {
  const kind =
    portrait === "kael"
      ? "kael"
      : portrait === "edrin"
        ? "edrin"
        : portrait === "merchant"
          ? "merchant"
          : portrait === "voice"
            ? "hollowGuard"
            : "townsfolk";
  return <Sprite kind={kind as never} size={62} />;
}
