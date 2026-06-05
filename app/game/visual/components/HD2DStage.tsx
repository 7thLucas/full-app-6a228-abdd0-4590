import { useCallback } from "react";
import { ParallaxPixelLayer } from "./ParallaxPixelLayer";
import { ForegroundBlurLayer } from "./ForegroundBlurLayer";
import { AtmosphereLayer } from "./AtmosphereLayer";
import { CinematicLightOverlay } from "./CinematicLightOverlay";
import {
  paintShrineSky,
  paintShrineMountains,
  paintShrineMid,
  paintVillageSky,
  paintVillageMountains,
  paintVillageBuildings,
  paintGateSky,
  paintGateStructure,
  paintPath,
} from "../pixel/pixelScenery";

// ───────────────────────────────────────────────────────────────────────────
// Component 1 of 15 — HD2DStage
// Full-screen scene renderer assembling the 6-layer HD-2D pixel system:
//   1 far background  (sky + sun/moon + stars)        slow parallax
//   2 deep background (mountains / large architecture) slow parallax
//   3 mid background  (gate / hanok / lanterns)        medium parallax
//   4 walkable stage  (pixel ground path)              1:1 with camera
//   5 foreground      (blurred pixel silhouettes)      fast parallax
//   6 atmosphere + cinematic lighting overlay
// Children (sprites/interactables) are rendered on the stage layer by the scene.
// ───────────────────────────────────────────────────────────────────────────

interface HD2DStageProps {
  theme: "shrine" | "village" | "gate";
  camX: number;
  worldWidth: number;
  viewportW: number;
  viewportH: number;
  /** baseline (feet line) fraction where the lane sits. */
  laneFrac: number;
  /** stage-space children (sprites, NPCs) — receive the same camX transform. */
  children?: React.ReactNode;
}

const SCALE = 4; // px per pixel cell for backgrounds

export function HD2DStage({
  theme,
  camX,
  worldWidth,
  viewportW,
  viewportH,
  laneFrac,
  children,
}: HD2DStageProps) {
  // low-res strip dimensions
  const skyPxW = Math.ceil((viewportW + 80) / SCALE);
  const skyPxH = Math.ceil(viewportH / SCALE);
  const farPxW = Math.ceil(worldWidth / SCALE) + 40;
  const lanePx = Math.round(laneFrac * viewportH);
  const groundPxH = Math.ceil((viewportH - lanePx) / SCALE) + 2;
  const groundPxW = Math.ceil(worldWidth / SCALE) + 40;

  // painters bound to the theme
  const skyPaint = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (theme === "shrine") paintShrineSky(ctx, w, h);
      else if (theme === "village") paintVillageSky(ctx, w, h);
      else paintGateSky(ctx, w, h);
    },
    [theme],
  );
  const mountPaint = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (theme === "shrine") paintShrineMountains(ctx, w, h);
      else if (theme === "village") paintVillageMountains(ctx, w, h);
      else paintGateSky(ctx, w, h * 0.0001); // gate has no separate mountains
    },
    [theme],
  );
  const midPaint = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (theme === "shrine") paintShrineMid(ctx, w, h);
      else if (theme === "village") paintVillageBuildings(ctx, w, h);
      else paintGateStructure(ctx, w, h);
    },
    [theme],
  );
  const groundPaint = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => paintPath(ctx, w, h, theme),
    [theme],
  );

  const midPxH = Math.ceil((viewportH * 0.62) / SCALE);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* 1 — far background: sky (very slow) */}
      <ParallaxPixelLayer
        paint={skyPaint}
        pxWidth={skyPxW}
        pxHeight={skyPxH}
        scale={SCALE}
        camX={camX}
        factor={0.04}
        zIndex={1}
      />

      {/* 2 — deep background: mountains */}
      {theme !== "gate" && (
        <ParallaxPixelLayer
          paint={mountPaint}
          pxWidth={farPxW}
          pxHeight={Math.ceil((viewportH * 0.4) / SCALE)}
          scale={SCALE}
          camX={camX}
          factor={0.12}
          zIndex={2}
          topFrac={laneFrac - 0.42}
        />
      )}

      {/* 3 — mid background: gate / hanok / lanterns */}
      <ParallaxPixelLayer
        paint={midPaint}
        pxWidth={Math.ceil(worldWidth / SCALE) + 40}
        pxHeight={midPxH}
        scale={SCALE}
        camX={camX}
        factor={theme === "village" ? 0.26 : 0.4}
        zIndex={3}
        topFrac={laneFrac - 0.62}
      />

      {/* 4 — walkable stage: ground path (camera 1:1) + sprites */}
      <ParallaxPixelLayer
        paint={groundPaint}
        pxWidth={groundPxW}
        pxHeight={groundPxH}
        scale={SCALE}
        camX={camX}
        factor={1}
        zIndex={10}
        topFrac={laneFrac}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate3d(${-camX}px,0,0)`,
          willChange: "transform",
          zIndex: 16,
        }}
      >
        {children}
      </div>

      {/* 5 — foreground blurred silhouettes (fast parallax) */}
      <ForegroundBlurLayer theme={theme} camX={camX} worldWidth={worldWidth} zIndex={28} />

      {/* 6 — atmosphere + cinematic lighting */}
      <AtmosphereLayer theme={theme} zIndex={24} />
      <CinematicLightOverlay theme={theme} zIndex={31} />
    </div>
  );
}
