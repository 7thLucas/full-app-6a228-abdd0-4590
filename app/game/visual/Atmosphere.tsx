import { useMemo } from "react";

export type ParticleTheme = "shrine" | "village" | "gate";

interface AtmosphereProps {
  theme: ParticleTheme;
}

// Deterministic-ish particle field for Hangul Roads areas. Uses CSS animations
// so it is cheap and never blocks the render loop.
//   shrine  -> golden motes + rising sparks (sunrise mist)
//   village -> warm lantern dust + morning fog
//   gate    -> cold violet embers in black fog (the Silent Gate)
export function Atmosphere({ theme }: AtmosphereProps) {
  const particles = useMemo(() => buildParticles(theme), [theme]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 20 }}>
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            opacity: p.opacity,
            boxShadow: p.glow ? `0 0 ${p.size * 2}px ${p.color}` : undefined,
            animation: `${p.anim} ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      {(theme === "village" || theme === "gate") && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              theme === "gate"
                ? "linear-gradient(180deg, rgba(40,30,70,0.3), transparent 40%, rgba(20,15,40,0.4))"
                : "linear-gradient(180deg, rgba(220,200,170,0.10), transparent 55%, rgba(200,190,170,0.16))",
          }}
        />
      )}
    </div>
  );
}

interface P {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  opacity: number;
  glow: boolean;
  anim: string;
  duration: number;
  delay: number;
}

function buildParticles(theme: ParticleTheme): P[] {
  const out: P[] = [];
  const count = theme === "village" ? 22 : 32;
  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 8;
    if (theme === "shrine") {
      out.push({
        id: i,
        left,
        top,
        size: 2 + Math.random() * 3,
        color: "rgba(255,224,150,0.9)",
        opacity: 0.4 + Math.random() * 0.5,
        glow: true,
        anim: "coer-float-up",
        duration: 7 + Math.random() * 7,
        delay,
      });
    } else if (theme === "village") {
      out.push({
        id: i,
        left,
        top,
        size: 2 + Math.random() * 2.4,
        color: "rgba(240,200,130,0.8)",
        opacity: 0.3 + Math.random() * 0.4,
        glow: true,
        anim: "coer-ember-rise",
        duration: 6 + Math.random() * 7,
        delay,
      });
    } else {
      // gate: cold violet embers
      out.push({
        id: i,
        left,
        top,
        size: 2 + Math.random() * 3,
        color: "rgba(180,120,230,0.85)",
        opacity: 0.35 + Math.random() * 0.5,
        glow: true,
        anim: "coer-float-up",
        duration: 7 + Math.random() * 7,
        delay,
      });
    }
  }
  return out;
}
