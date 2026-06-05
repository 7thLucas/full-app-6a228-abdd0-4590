import { useEffect, useRef, useState } from "react";
import { PixelArt, gridWidth } from "../pixel/pixelArt";
import { chibiFrame, type ChibiName } from "../pixel/chibiSprites";
import { depthShadow } from "../../engine/projection";

// ───────────────────────────────────────────────────────────────────────────
// PixelChibiSprite — a depth-aware chibi pixel human with 4-direction walk
// cycles, idle breathing, a soft cast-shadow that scales with depth, and
// state-driven glow / flinch / cast / victory effects. The sprite is pinned by
// its FEET to (screenX, screenY) so it sits on the diorama floor correctly.
// ───────────────────────────────────────────────────────────────────────────

export type ChibiState = "idle" | "walk" | "cast" | "flinch" | "victory" | "glow";

interface Props {
  name: ChibiName;
  facing: "down" | "up" | "left" | "right";
  moving: boolean;
  /** rendered height of the sprite in px (already depth-scaled by caller). */
  height: number;
  /** depth (worldY) → shadow size/opacity. */
  worldY: number;
  state?: ChibiState;
  glowColor?: string;
}

export function PixelChibiSprite({
  name,
  facing,
  moving,
  height,
  worldY,
  state = "idle",
  glowColor,
}: Props) {
  const [frame, setFrame] = useState(0);

  // walk-cycle frame swap: 1,2 alternate while moving; 0 is the idle pose.
  useEffect(() => {
    if (!moving) {
      setFrame(0);
      return;
    }
    let f = 1;
    setFrame(1);
    const id = window.setInterval(() => {
      f = f === 1 ? 2 : 1;
      setFrame(f);
    }, 140);
    return () => window.clearInterval(id);
  }, [moving]);

  const { grid, flip } = chibiFrame(name, facing, frame);
  const gw = gridWidth(grid);
  const gh = grid.rows.length;
  const scale = height / gh;
  const width = gw * scale;

  const shadow = depthShadow(worldY);

  let filter: string | undefined;
  if (state === "glow" || glowColor) {
    const c = glowColor ?? "rgba(255,224,150,0.9)";
    filter = `drop-shadow(0 0 6px ${c}) drop-shadow(0 0 13px ${c})`;
  }
  if (state === "cast") filter = "drop-shadow(0 0 8px rgba(159,232,255,0.95)) drop-shadow(0 0 16px rgba(120,200,255,0.6)) brightness(1.15)";
  if (state === "flinch") filter = "brightness(1.5) sepia(1) hue-rotate(-30deg) saturate(3)";
  if (state === "victory") filter = "drop-shadow(0 0 10px rgba(255,224,150,1)) brightness(1.1)";

  const bodyAnim =
    state === "cast" ? "coer-cast"
    : state === "flinch" ? "coer-flinch"
    : state === "victory" ? "coer-victory"
    : moving ? "coer-walk"
    : "coer-breathe";

  return (
    <div style={{ position: "relative", width, height }}>
      {/* depth-scaled contact shadow on the floor */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -3,
          transform: `translateX(-50%) scale(${shadow.scale})`,
          width: width * 0.66,
          height: width * 0.2,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(0,0,0,${shadow.opacity}), transparent 72%)`,
          filter: "blur(1.5px)",
          pointerEvents: "none",
        }}
      />
      <div className={bodyAnim} style={{ width, height }}>
        <PixelArt grid={grid} scale={scale} flip={flip} filter={filter} />
      </div>
    </div>
  );
}
