// ───────────────────────────────────────────────────────────────────────────
// Component 6 of 15 — CinematicLightOverlay
// Lighting grade applied over a finished pixel scene: key-light bloom, warm/cool
// contrast, vignette, top/bottom shadow falloff, and a soft god-ray beam from
// the scene's light source. Gradients are used ONLY as lighting (never as art).
// ───────────────────────────────────────────────────────────────────────────

interface CinematicLightOverlayProps {
  theme: "shrine" | "village" | "gate";
  zIndex?: number;
}

const GRADE: Record<
  CinematicLightOverlayProps["theme"],
  { warm: string; cool: string; ray: string; rayFrom: string }
> = {
  shrine: {
    warm: "rgba(255,210,140,0.16)",
    cool: "rgba(60,90,150,0.18)",
    ray: "rgba(255,225,160,0.18)",
    rayFrom: "46%",
  },
  village: {
    warm: "rgba(255,200,130,0.14)",
    cool: "rgba(40,60,100,0.18)",
    ray: "rgba(255,220,150,0.13)",
    rayFrom: "66%",
  },
  gate: {
    warm: "rgba(170,120,230,0.14)",
    cool: "rgba(40,25,70,0.28)",
    ray: "rgba(180,130,240,0.14)",
    rayFrom: "50%",
  },
};

export function CinematicLightOverlay({ theme, zIndex = 31 }: CinematicLightOverlayProps) {
  const g = GRADE[theme];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex }}>
      {/* god-ray beam */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: g.rayFrom,
            width: "38%",
            height: "120%",
            background: `linear-gradient(105deg, transparent 40%, ${g.ray} 50%, transparent 60%)`,
            transform: "rotate(8deg)",
            filter: "blur(6px)",
          }}
        />
      </div>
      {/* warm key bloom from below the light */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 68%, ${g.warm}, transparent 60%)` }} />
      {/* cool top fill */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${g.cool}, transparent 45%)` }} />
      {/* vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 46%, rgba(0,0,0,0.6))" }} />
      {/* top / bottom shadow falloff */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "12%", background: "linear-gradient(180deg,rgba(0,0,0,0.45),transparent)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "18%", background: "linear-gradient(0deg,rgba(0,0,0,0.55),transparent)" }} />
    </div>
  );
}
