import { useEffect, useState } from "react";
import { PixelArt, gridWidth } from "../pixel/pixelArt";
import { getSprite, SPRITES, type SpriteName } from "../pixel/pixelSprites";

// ───────────────────────────────────────────────────────────────────────────
// Component 2 of 15 — PixelSprite
// Reusable upright pixel-art actor with idle (breathing), walk (frame swap),
// and glow states. Renders a soft ground shadow and pins the sprite by its feet
// to a screen baseline so it sits correctly on the HD-2D lane.
// ───────────────────────────────────────────────────────────────────────────

interface PixelSpriteProps {
  name: SpriteName;
  /** target rendered height in px (width scales to keep pixel ratio). */
  height: number;
  facing?: "left" | "right";
  moving?: boolean;
  glow?: boolean;
  /** floating bob (companions / spirits). */
  hover?: boolean;
  /** optional gold highlight pointer above the head. */
  highlight?: boolean;
  className?: string;
}

export function PixelSprite({
  name,
  height,
  facing = "right",
  moving = false,
  glow = false,
  hover = false,
  highlight = false,
  className,
}: PixelSpriteProps) {
  const [walkFrame, setWalkFrame] = useState(0);

  // swap walk frames while moving (arin only has a walk variant)
  useEffect(() => {
    if (!moving) return;
    const id = window.setInterval(() => setWalkFrame((f) => (f + 1) % 2), 150);
    return () => window.clearInterval(id);
  }, [moving]);

  const active: SpriteName =
    moving && name === "arin" ? (walkFrame === 0 ? "arin" : "arinWalk") : name;
  const grid = getSprite(active);
  const gw = gridWidth(SPRITES[name]);
  const gh = SPRITES[name].rows.length;
  const scale = height / gh;
  const width = gw * scale;

  const filter = glow
    ? "drop-shadow(0 0 6px rgba(255,217,138,0.85)) drop-shadow(0 0 12px rgba(255,200,120,0.4))"
    : undefined;

  const anim = moving ? "coer-walk" : hover ? "coer-bob" : "coer-breathe";

  return (
    <div className={className} style={{ position: "relative", width, height }}>
      {highlight && (
        <div
          className="coer-blink"
          style={{
            position: "absolute",
            left: "50%",
            top: -16,
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: "10px solid #e9cf86",
            filter: "drop-shadow(0 0 6px rgba(233,207,134,0.9))",
            zIndex: 5,
          }}
        />
      )}
      {/* contact shadow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -2,
          transform: "translateX(-50%)",
          width: width * 0.6,
          height: width * 0.16,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
          filter: "blur(1px)",
        }}
      />
      <div className={anim} style={{ width, height }}>
        <PixelArt grid={grid} scale={scale} filter={filter} flip={facing === "left"} />
      </div>
    </div>
  );
}
