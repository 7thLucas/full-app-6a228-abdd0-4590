import { useMemo } from "react";

// ───────────────────────────────────────────────────────────────────────────
// Component 11 of 15 — MeaningBreakEffect
// Dramatic "MEANING RESTORED" moment: huge pixel-styled text, a burst of
// Hangul letters flying outward, a brief brightening flash, and a screen-wide
// shockwave. Rendered when the enemy's Confusion Shield reaches 0.
// ───────────────────────────────────────────────────────────────────────────

interface MeaningBreakEffectProps {
  show: boolean;
}

const BURST = ["ㄱ", "ㅏ", "ㅎ", "ㅓ", "ㄴ", "ㅗ", "ㄹ", "ㅜ", "ㅁ", "ㅣ"];

export function MeaningBreakEffect({ show }: MeaningBreakEffectProps) {
  const shards = useMemo(
    () =>
      BURST.map((ch, i) => {
        const ang = (i / BURST.length) * Math.PI * 2;
        return { ch, dx: Math.cos(ang) * 160, dy: Math.sin(ang) * 120, delay: i * 0.02 };
      }),
    [],
  );

  if (!show) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 27 }}>
      {/* brightening flash */}
      <div className="coer-battle-flash absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,240,200,0.5), transparent 60%)" }} />
      {/* shockwave ring */}
      <div
        className="coer-shatter-flash absolute"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "4px solid rgba(200,154,255,0.9)",
          boxShadow: "0 0 40px rgba(200,154,255,0.8)",
        }}
      />
      {/* bursting Hangul */}
      {shards.map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            color: "#ffe9a8",
            fontSize: 26,
            textShadow: "0 0 14px rgba(255,220,140,0.9)",
            animation: "coer-meaning-burst 0.9s ease-out forwards",
            // @ts-expect-error custom props consumed by keyframes
            "--bx": `${s.dx}px`,
            "--by": `${s.dy}px`,
            animationDelay: `${s.delay}s`,
          }}
        >
          {s.ch}
        </span>
      ))}
      {/* headline */}
      <div className="coer-shatter-flash coer-heading text-4xl sm:text-5xl" style={{ color: "#c89aff", textShadow: "0 0 30px rgba(200,154,255,0.95)" }}>
        MEANING RESTORED
      </div>
    </div>
  );
}
