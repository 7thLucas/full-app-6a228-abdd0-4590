import { rng } from "../pixel/pixelArt";

// ───────────────────────────────────────────────────────────────────────────
// Component 4 of 15 — ForegroundBlurLayer
// Blurred pixel silhouettes (branches, flowers, stones, pillars, roof edges)
// pinned in front of the camera for depth-of-field. Built from pixel-blocky
// clip-path/box shapes, then blurred. Parallaxes faster than the stage.
// ───────────────────────────────────────────────────────────────────────────

interface ForegroundBlurLayerProps {
  theme: "shrine" | "village" | "gate";
  camX: number;
  worldWidth: number;
  zIndex?: number;
}

export function ForegroundBlurLayer({ theme, camX, worldWidth, zIndex = 28 }: ForegroundBlurLayerProps) {
  const r = rng(theme === "shrine" ? 101 : theme === "village" ? 202 : 303);
  const count = Math.ceil(worldWidth / 420);
  const items = Array.from({ length: count });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate3d(${-camX * 1.4}px,0,0)`,
        willChange: "transform",
        zIndex,
        filter: "blur(2.5px)",
        pointerEvents: "none",
      }}
    >
      {items.map((_, i) => {
        const x = 30 + i * 420 + Math.floor(r() * 80);
        if (theme === "shrine") {
          // chunky pixel flower clusters + grass blades
          return (
            <div key={i} style={{ position: "absolute", left: x, bottom: -4 }}>
              <div style={{ width: 18, height: 18, background: "#e8607a", boxShadow: "8px -6px 0 #ff9ab0, -8px 2px 0 #caa24e", opacity: 0.92 }} />
              <div style={{ width: 8, height: 40, background: "#2e4a30", marginLeft: 6 }} />
            </div>
          );
        }
        if (theme === "village") {
          // dark roof edge / jar silhouettes
          return (
            <div key={i} style={{ position: "absolute", left: x, bottom: -6 }}>
              <div style={{ width: 70, height: 14, background: "#1c140c", clipPath: "polygon(0 100%, 12% 0, 88% 0, 100% 100%)" }} />
              <div style={{ width: 30, height: 54, background: "#241a10", marginLeft: 20, borderRadius: 0 }} />
            </div>
          );
        }
        // gate: broken violet pillar shards
        return (
          <div key={i} style={{ position: "absolute", left: x, bottom: -8 }}>
            <div style={{ width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderBottom: "96px solid rgba(90,60,140,0.7)" }} />
          </div>
        );
      })}
    </div>
  );
}
