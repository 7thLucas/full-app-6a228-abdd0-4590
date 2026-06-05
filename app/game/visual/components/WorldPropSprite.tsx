import { PixelArt, gridWidth } from "../pixel/pixelArt";
import { getPropGrid, PROP_HEIGHT } from "../pixel/propSprites";
import { depthShadow } from "../../engine/projection";
import type { WorldProp } from "../../data/world2d";

// ───────────────────────────────────────────────────────────────────────────
// WorldPropSprite — renders a single depth-sorted world prop (lantern, tree,
// pillar, stall, rooftop, etc.) as pixel art, pinned by its base to the floor
// with a depth-scaled shadow and optional local-light glow. Crystals are
// rendered by HangulCrystal instead. Occlusion fade is applied by the caller.
// ───────────────────────────────────────────────────────────────────────────

interface Props {
  prop: WorldProp;
  /** depth-scaled rendered height multiplier from projection. */
  visualScale: number;
  worldY: number;
  /** drop opacity when this occluder fully hides the player. */
  faded?: boolean;
}

export function WorldPropSprite({ prop, visualScale, worldY, faded }: Props) {
  const grid = getPropGrid(prop.kind, prop.variant ?? 0);
  const baseH = PROP_HEIGHT[prop.kind] * (prop.scale ?? 1);
  const height = baseH * visualScale;
  const gw = gridWidth(grid);
  const gh = grid.rows.length;
  const scale = height / gh;
  const width = gw * scale;
  const shadow = depthShadow(worldY);

  const filter = prop.light
    ? `drop-shadow(0 0 5px ${prop.light}) drop-shadow(0 0 11px ${prop.light}88)`
    : undefined;

  const lit = prop.light && (prop.kind === "lantern" || prop.kind === "gate" || prop.kind === "rooftop");

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        opacity: faded ? 0.68 : 1,
        transition: "opacity 160ms ease",
      }}
    >
      {/* local light pool on the ground */}
      {lit && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -height * 0.06,
            transform: "translateX(-50%)",
            width: width * 2.0,
            height: width * 0.7,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${prop.light}44, transparent 70%)`,
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        />
      )}
      {/* contact shadow (skip for grass/flowers which sit flat) */}
      {prop.kind !== "grass" && prop.kind !== "flower" && prop.kind !== "bridge" && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -3,
            transform: `translateX(-50%) scale(${shadow.scale})`,
            width: width * 0.7,
            height: width * 0.2,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, rgba(0,0,0,${shadow.opacity * 0.9}), transparent 72%)`,
            filter: "blur(1.5px)",
            pointerEvents: "none",
          }}
        />
      )}
      <PixelArt grid={grid} scale={scale} filter={filter} />
    </div>
  );
}
