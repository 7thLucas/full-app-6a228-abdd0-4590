import { useMemo } from "react";

// ───────────────────────────────────────────────────────────────────────────
// Component 5 of 15 — AtmosphereLayer
// Fog, dust, snow, floating Hangul letters, fireflies and magic particles for
// each area. Pure CSS keyframes (pixel-blocky squares, not soft circles) so it
// stays cheap and never blocks the render loop.
//   shrine  -> golden motes + drifting Hangul + sunrise mist
//   village -> warm lantern dust + morning fog
//   gate    -> cold violet embers + black fog
// ───────────────────────────────────────────────────────────────────────────

interface AtmosphereLayerProps {
  theme: "shrine" | "village" | "gate";
  zIndex?: number;
}

const FLOAT_HANGUL = ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ", "ㅣ", "가", "나"];

export function AtmosphereLayer({ theme, zIndex = 24 }: AtmosphereLayerProps) {
  const motes = useMemo(() => buildMotes(theme), [theme]);
  const glyphs = useMemo(() => buildGlyphs(theme), [theme]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex }}>
      {/* fog band */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            theme === "gate"
              ? "linear-gradient(180deg, rgba(50,30,80,0.34), transparent 38%, rgba(24,15,46,0.46))"
              : theme === "village"
              ? "linear-gradient(180deg, rgba(220,200,170,0.12), transparent 52%, rgba(200,190,170,0.18))"
              : "linear-gradient(180deg, rgba(255,224,160,0.12), transparent 50%, rgba(180,160,200,0.14))",
        }}
      />
      {/* pixel motes (squares, not circles) */}
      {motes.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            imageRendering: "pixelated",
            animation: `${p.anim} ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      {/* drifting Hangul letters */}
      {glyphs.map((g) => (
        <span
          key={g.id}
          className="coer-bob"
          style={{
            position: "absolute",
            left: `${g.left}%`,
            top: `${g.top}%`,
            fontSize: g.size,
            color: g.color,
            textShadow: `0 0 14px ${g.glow}`,
            opacity: g.opacity,
            animationDelay: `${g.delay}s`,
          }}
        >
          {g.ch}
        </span>
      ))}
    </div>
  );
}

interface Mote {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  opacity: number;
  anim: string;
  duration: number;
  delay: number;
}

function buildMotes(theme: AtmosphereLayerProps["theme"]): Mote[] {
  const out: Mote[] = [];
  const count = theme === "village" ? 24 : 34;
  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 8;
    const color =
      theme === "shrine"
        ? "rgba(255,224,150,0.9)"
        : theme === "village"
        ? "rgba(240,200,130,0.85)"
        : "rgba(190,130,240,0.9)";
    out.push({
      id: i,
      left,
      top,
      size: 2 + Math.floor(Math.random() * 3),
      color,
      opacity: 0.4 + Math.random() * 0.5,
      anim: theme === "village" ? "coer-ember-rise" : "coer-float-up",
      duration: 6 + Math.random() * 8,
      delay,
    });
  }
  return out;
}

interface Glyph {
  id: number;
  left: number;
  top: number;
  size: number;
  ch: string;
  color: string;
  glow: string;
  opacity: number;
  delay: number;
}

function buildGlyphs(theme: AtmosphereLayerProps["theme"]): Glyph[] {
  const out: Glyph[] = [];
  const count = theme === "gate" ? 6 : 7;
  for (let i = 0; i < count; i++) {
    out.push({
      id: i,
      left: 8 + (i * 13) % 84,
      top: 14 + ((i * 21) % 34),
      size: 22 + (i % 3) * 10,
      ch: FLOAT_HANGUL[i % FLOAT_HANGUL.length],
      color: theme === "gate" ? "#c89aff" : "#ffe9a8",
      glow: theme === "gate" ? "rgba(180,120,240,0.85)" : "rgba(255,220,140,0.85)",
      opacity: 0.7,
      delay: i * 0.4,
    });
  }
  return out;
}
