import { Sprite, type SpriteKind } from "./Sprite";

// Upright side-view pixel actor placed on the HD-2D lane. Position is given in
// stage space (worldX) with a screen-baseline fraction + depth scale from the
// projection. Renders a soft ground shadow and idle/walk motion.
interface PixelCharacterProps {
  kind: SpriteKind;
  baseSize: number; // sprite size at scale 1
  worldX: number; // stage px (camera applied by parent container)
  screenYFrac: number; // baseline (feet) y as fraction of viewport height
  viewportH: number;
  scale: number;
  facing?: "left" | "right";
  moving?: boolean;
  z: number;
  glow?: boolean;
  bob?: boolean;
  highlight?: boolean;
}

export function PixelCharacter({
  kind,
  baseSize,
  worldX,
  screenYFrac,
  viewportH,
  scale,
  facing = "right",
  moving = false,
  z,
  glow = false,
  bob = false,
  highlight = false,
}: PixelCharacterProps) {
  const size = baseSize * scale;
  const baselineY = screenYFrac * viewportH;

  return (
    <div
      style={{
        position: "absolute",
        left: worldX,
        top: baselineY,
        transform: "translate(-50%, -100%)",
        zIndex: z,
        willChange: "transform",
        filter: glow ? "drop-shadow(0 0 10px rgba(127,180,214,0.6))" : undefined,
      }}
    >
      {highlight && (
        <div
          className="coer-blink"
          style={{
            position: "absolute",
            left: "50%",
            top: -14 * scale,
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: `${6 * scale}px solid transparent`,
            borderRight: `${6 * scale}px solid transparent`,
            borderTop: `${8 * scale}px solid rgba(233,207,134,0.95)`,
            filter: "drop-shadow(0 0 6px rgba(233,207,134,0.8))",
          }}
        />
      )}
      {/* contact shadow under the feet */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          transform: "translateX(-50%)",
          width: size * 0.62,
          height: size * 0.16,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.5), transparent 70%)",
          filter: "blur(1px)",
        }}
      />
      <div className={moving ? "coer-walk" : bob ? "coer-bob" : "coer-breathe"}>
        <Sprite kind={kind} size={size} facing={facing} />
      </div>
    </div>
  );
}
