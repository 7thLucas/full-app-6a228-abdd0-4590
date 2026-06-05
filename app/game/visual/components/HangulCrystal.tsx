// ───────────────────────────────────────────────────────────────────────────
// HangulCrystal — a floating glowing Hangul letter on a pixel pedestal. Used for
// the Letter Shrine vowel crystals and the Silent Gate's broken fragments. The
// glyph bobs and pulses; a pedestal grounds it; a beam of light rises from the
// floor. When `done` it shifts to a calm green "learned" state.
// ───────────────────────────────────────────────────────────────────────────

interface Props {
  glyph: string;
  color: string;
  /** depth-scaled size in px. */
  size: number;
  done?: boolean;
  highlight?: boolean;
  broken?: boolean; // silent-gate fragments flicker
}

export function HangulCrystal({ glyph, color, size, done, highlight, broken }: Props) {
  const c = done ? "#9ff0c8" : color;
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {highlight && (
        <div
          className="coer-blink"
          style={{
            position: "absolute",
            top: -size * 0.5,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: `11px solid ${c}`,
            filter: `drop-shadow(0 0 6px ${c})`,
          }}
        />
      )}
      {/* light shaft rising from pedestal */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: size * 0.5,
          height: size * 2.0,
          background: `linear-gradient(to top, ${c}55, transparent)`,
          filter: "blur(3px)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
      {/* the glyph */}
      <div
        className={broken ? "coer-flicker" : "coer-crystal"}
        style={{
          fontSize: size,
          lineHeight: 1,
          color: c,
          fontWeight: 800,
          textShadow: `0 0 ${size * 0.4}px ${c}, 0 0 ${size * 0.16}px ${c}`,
          imageRendering: "pixelated",
          fontFamily: "'Noto Sans KR', system-ui, sans-serif",
          userSelect: "none",
        }}
      >
        {glyph}
      </div>
      {/* pedestal */}
      <div
        style={{
          width: size * 0.7,
          height: size * 0.2,
          marginTop: -size * 0.05,
          background: "linear-gradient(180deg,#9aa0ac,#6c7280 60%,#3a4252)",
          border: "2px solid #1a1422",
          boxShadow: `0 0 10px ${c}66`,
        }}
      />
      {done && (
        <div className="text-emerald-300 text-[10px] mt-0.5" style={{ textShadow: "0 1px 2px #000" }}>
          ✓ learned
        </div>
      )}
    </div>
  );
}
