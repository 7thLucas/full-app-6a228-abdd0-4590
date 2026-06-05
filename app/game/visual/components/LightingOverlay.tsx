import type { LightingProfile } from "../../data/world2d";

// ───────────────────────────────────────────────────────────────────────────
// LightingOverlay — per-area cinematic lighting + atmosphere stacked above the
// world: ambient color wash, a soft key-light glow (sun/moon) from a corner,
// volumetric fog, floating dust/light-shafts, bloom tint, and a vignette. All
// blend modes are tuned so the pixel world still reads through the atmosphere.
// ───────────────────────────────────────────────────────────────────────────

interface Props {
  lighting: LightingProfile;
  /** transient battle/meaning-break flash intensity 0..1 */
  flash?: number;
  flashColor?: string;
  zIndex?: number;
}

export function LightingOverlay({ lighting: L, flash = 0, flashColor = "#ffe6b0", zIndex = 30 }: Props) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex, pointerEvents: "none", overflow: "hidden" }}>
      {/* ambient color wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: L.ambient,
          opacity: L.ambientStrength,
          mixBlendMode: "soft-light",
        }}
      />
      {/* key light glow from corner */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${L.keyX * 100}% ${L.keyY * 100}%, ${L.key}66, transparent 55%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* light shafts from the key direction */}
      <div
        className="coer-shafts"
        style={{
          position: "absolute",
          inset: "-20%",
          background: `repeating-linear-gradient(${L.keyX > 0.5 ? "-18deg" : "18deg"}, ${L.key}10 0 14px, transparent 14px 60px)`,
          opacity: 0.5,
          mixBlendMode: "screen",
        }}
      />
      {/* fog — two layers drifting */}
      <div
        className="coer-fog"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, ${L.fog} 0%, transparent 45%)`,
          opacity: L.fogStrength,
          mixBlendMode: "screen",
        }}
      />
      <div
        className="coer-fog2"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 80%, ${L.fog}55, transparent 60%)`,
          opacity: L.fogStrength * 0.8,
          mixBlendMode: "screen",
        }}
      />
      {/* drifting dust motes */}
      <Dust color={L.bloom} />
      {/* bloom tint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: L.bloom,
          opacity: 0.06,
          mixBlendMode: "screen",
        }}
      />
      {/* vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `inset 0 0 ${120}px ${60}px rgba(0,0,0,${L.vignette})`,
        }}
      />
      {/* transient flash (meaning break / hit) */}
      {flash > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: flashColor,
            opacity: flash * 0.6,
            mixBlendMode: "screen",
          }}
        />
      )}
    </div>
  );
}

function Dust({ color }: { color: string }) {
  const motes = Array.from({ length: 22 });
  return (
    <>
      {motes.map((_, i) => {
        const left = (i * 53) % 100;
        const top = (i * 37) % 100;
        const dur = 7 + (i % 5) * 2;
        const size = 1 + (i % 3);
        return (
          <div
            key={i}
            className="coer-mote"
            style={{
              position: "absolute",
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: 0.5,
              boxShadow: `0 0 4px ${color}`,
              animationDuration: `${dur}s`,
              animationDelay: `${-i * 0.6}s`,
            }}
          />
        );
      })}
    </>
  );
}
