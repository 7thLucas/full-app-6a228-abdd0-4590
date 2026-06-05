import { PixelArt } from "../pixel/pixelArt";
import type { PixelGrid } from "../pixel/pixelArt";

// ───────────────────────────────────────────────────────────────────────────
// BoriCompanion — small glowing pixel fox-spirit that floats beside Arin with a
// delayed follow (interpolated by the scene), soft cyan/gold glow, a tail flame
// and a gentle hover bob. Reacts to correct/wrong via the `mood` prop. Depth is
// supplied by the caller so Bori sorts into the diorama like any other entity.
// ───────────────────────────────────────────────────────────────────────────

const PAL = {
  _: "transparent",
  o: "#f0a050", // fox body
  O: "#c97a30", // body shade
  w: "#fff3da", // belly / face
  k: "#241726", // outline
  e: "#2a1a30", // eye
  f: "#ffd98a", // tail flame
  F: "#fff0c0", // flame core
  g: "#9fe8ff", // spirit glow tint
};

function g(rows: string[]): PixelGrid {
  return { rows, palette: PAL };
}

// floating fox, ~16x14, ears up, fluffy flame tail
const BORI = g([
  "  k        k    ",
  "  ko      ok    ",
  "  koo    ook    ",
  " kooooooooook   ",
  " kowooooowok    ",
  " koeooooeook    ",
  " kooowwwooo k f ",
  " koowwwwwook ffF",
  "  kowwwwwok  fFf",
  "  koooooook  ff ",
  "   koooook      ",
  "   kO  Ok       ",
  "   kk  kk       ",
  "                ",
]);

const BORI_HAPPY = g([
  "  k        k    ",
  "  ko      ok    ",
  " koo      ook   ",
  " kooooooooook   ",
  " kowooooowok f ",
  " ko^oooo^ook ffF",
  " kooowwwooo ffFf",
  " koowwwwwook ff ",
  "  kowwwwwok     ",
  "  koooooook     ",
  "   koooook      ",
  "   kO  Ok       ",
  "   kk  kk       ",
  "                ",
]);

interface Props {
  height: number;
  mood?: "idle" | "happy" | "worried";
  facing?: "left" | "right";
}

export function BoriCompanion({ height, mood = "idle", facing = "left" }: Props) {
  const grid = mood === "happy" ? BORI_HAPPY : BORI;
  const scale = height / grid.rows.length;
  const glow =
    mood === "happy"
      ? "drop-shadow(0 0 7px rgba(255,224,150,1)) drop-shadow(0 0 14px rgba(159,232,255,0.7))"
      : mood === "worried"
        ? "drop-shadow(0 0 6px rgba(180,160,255,0.8))"
        : "drop-shadow(0 0 6px rgba(255,216,138,0.85)) drop-shadow(0 0 12px rgba(159,232,255,0.5))";

  return (
    <div className="coer-bob" style={{ position: "relative" }}>
      {/* soft spirit aura */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: height * 1.6,
          height: height * 1.6,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(159,232,255,0.28), transparent 68%)",
          pointerEvents: "none",
        }}
      />
      <PixelArt grid={grid} scale={scale} filter={glow} flip={facing === "right"} />
    </div>
  );
}
