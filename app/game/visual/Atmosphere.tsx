import { useMemo } from "react";

type ParticleTheme = "snow" | "chapel" | "town" | "shrine";

interface AtmosphereProps {
  theme: ParticleTheme;
}

// Deterministic-ish particle field. Generated once per mount; uses CSS animations
// so it is cheap and never blocks the render loop.
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
      {/* fog band */}
      {(theme === "snow" || theme === "shrine") && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              theme === "shrine"
                ? "linear-gradient(180deg, rgba(40,60,90,0.25), transparent 40%, rgba(20,30,55,0.35))"
                : "linear-gradient(180deg, rgba(180,200,220,0.12), transparent 50%, rgba(160,180,210,0.18))",
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
  const count = theme === "town" ? 18 : 34;
  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 8;
    if (theme === "snow") {
      out.push({
        id: i,
        left,
        top: -10,
        size: 2 + Math.random() * 3,
        color: "rgba(235,245,255,0.9)",
        opacity: 0.5 + Math.random() * 0.5,
        glow: false,
        anim: "coer-snow",
        duration: 6 + Math.random() * 8,
        delay,
      });
    } else if (theme === "chapel") {
      out.push({
        id: i,
        left,
        top,
        size: 2 + Math.random() * 2.5,
        color: "rgba(240,200,120,0.9)",
        opacity: 0.4 + Math.random() * 0.5,
        glow: true,
        anim: "coer-ember-rise",
        duration: 5 + Math.random() * 6,
        delay,
      });
    } else if (theme === "shrine") {
      out.push({
        id: i,
        left,
        top,
        size: 2 + Math.random() * 3,
        color: "rgba(150,200,235,0.9)",
        opacity: 0.35 + Math.random() * 0.5,
        glow: true,
        anim: "coer-float-up",
        duration: 7 + Math.random() * 7,
        delay,
      });
    } else {
      // town: drifting dust / firefly motes
      out.push({
        id: i,
        left,
        top,
        size: 2 + Math.random() * 2,
        color: "rgba(220,200,150,0.7)",
        opacity: 0.3 + Math.random() * 0.4,
        glow: true,
        anim: "coer-float-up",
        duration: 8 + Math.random() * 8,
        delay,
      });
    }
  }
  return out;
}
