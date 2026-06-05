import { useCallback, useEffect, useRef } from "react";
import { ParallaxPixelLayer } from "./ParallaxPixelLayer";
import { LightingOverlay } from "./LightingOverlay";
import { paintGround } from "../pixel/groundPlane";
import {
  paintShrineSky,
  paintShrineMountains,
  paintShrineMid,
  paintVillageSky,
  paintVillageMountains,
  paintVillageBuildings,
  paintGateSky,
  paintGateStructure,
} from "../pixel/pixelScenery";
import type { World2D } from "../../data/world2d";
import type { CameraState } from "../../engine/projection";
import { DEPTH_SCALE } from "../../engine/projection";

// ───────────────────────────────────────────────────────────────────────────
// HD2DWorld — the full 2.5D diorama stage. Composes the layered scene:
//   1 far sky (slowest parallax)        2 mountains
//   3 deep architecture (gate/hanok)    4 receding ground plane (perspective)
//   5 depth-sorted entities (children)  6 foreground occluders (children)
//   7 lighting + atmosphere overlay
// The camera offsetX pans horizontally; the ground plane is drawn as a canvas
// whose top edge sits at the scene's far-depth screen line and recedes down to
// the near edge, giving the floor real depth (not a flat tile mat).
// ───────────────────────────────────────────────────────────────────────────

const SCALE = 4;

interface Props {
  world: World2D;
  cam: CameraState;
  viewportW: number;
  viewportH: number;
  /** depth-sorted stage content (entities) projected by the scene. */
  children: React.ReactNode;
  /** foreground occluders rendered above everything but below atmosphere. */
  foreground?: React.ReactNode;
  flash?: number;
  flashColor?: string;
}

export function HD2DWorld({ world, cam, viewportW, viewportH, children, foreground, flash, flashColor }: Props) {
  const theme = world.theme;
  const camX = cam.offsetX;

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
    },
    [theme],
  );
  const archPaint = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (theme === "shrine") paintShrineMid(ctx, w, h);
      else if (theme === "village") paintVillageBuildings(ctx, w, h);
      else paintGateStructure(ctx, w, h);
    },
    [theme],
  );

  // Floor plane screen geometry: the far edge (depthFar) and near edge
  // (depthNear) map to screen Y via depth * DEPTH_SCALE + offsetY.
  const farScreenY = world.depthNear * DEPTH_SCALE + cam.offsetY;
  const nearScreenY = world.depthFar * DEPTH_SCALE + cam.offsetY;
  const planeScreenH = Math.max(40, nearScreenY - farScreenY) + viewportH * 0.5;
  const planeW = world.width;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* 1 — far sky */}
      <ParallaxPixelLayer
        paint={skyPaint}
        pxWidth={Math.ceil((viewportW + 120) / SCALE)}
        pxHeight={Math.ceil(viewportH / SCALE)}
        scale={SCALE}
        camX={camX}
        factor={0.05}
        zIndex={1}
      />
      {/* 2 — mountains */}
      {theme !== "gate" && (
        <ParallaxPixelLayer
          paint={mountPaint}
          pxWidth={Math.ceil(world.width / SCALE) + 40}
          pxHeight={Math.ceil((viewportH * 0.42) / SCALE)}
          scale={SCALE}
          camX={camX}
          factor={0.12}
          zIndex={2}
          topFrac={0.12}
        />
      )}
      {/* 3 — deep architecture (gate / hanok / temple) */}
      <ParallaxPixelLayer
        paint={archPaint}
        pxWidth={Math.ceil(world.width / SCALE) + 40}
        pxHeight={Math.ceil((viewportH * 0.6) / SCALE)}
        scale={SCALE}
        camX={camX}
        factor={0.25}
        zIndex={3}
        topFrac={Math.max(0, farScreenY / viewportH - 0.42)}
      />

      {/* 4 — receding ground plane (off-road terrain + carved road polygons) */}
      <GroundPlane
        world={world}
        camX={camX}
        worldW={planeW}
        screenTopY={farScreenY}
        screenH={planeScreenH}
        zIndex={5}
      />

      {/* 5 + 6 — depth-sorted entities and foreground occluders.
          The scene already projects each entity to screen coords; we just give
          them a camera-panned container. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate3d(${-camX}px,0,0)`,
          willChange: "transform",
          zIndex: 10,
        }}
      >
        {children}
        {foreground}
      </div>

      {/* 7 — lighting + atmosphere */}
      <LightingOverlay lighting={world.lighting} flash={flash} flashColor={flashColor} zIndex={28} />
    </div>
  );
}

// Receding floor canvas: paints off-road terrain then carves the walkable road
// polygons, positioned so its top is the far depth line and it slopes down to
// fill the lower diorama. The polygon world points are mapped to canvas pixels
// so the road lands exactly under the projected entities.
function GroundPlane({
  world,
  camX,
  worldW,
  screenTopY,
  screenH,
  zIndex,
}: {
  world: World2D;
  camX: number;
  worldW: number;
  screenTopY: number;
  screenH: number;
  zIndex: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pxW = Math.ceil(worldW / SCALE);
  const pxH = Math.max(20, Math.ceil(screenH / SCALE));
  const { theme, walkable, road, depthNear } = world;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    // world → canvas-pixel mapper.
    //   canvas x   = worldX / SCALE
    //   canvas y   = (worldY - depthNear) * DEPTH_SCALE / SCALE
    // (the canvas top edge sits at depthNear's screen line in HD2DWorld).
    const toPx = (wx: number, wy: number) => ({
      x: wx / SCALE,
      y: ((wy - depthNear) * DEPTH_SCALE) / SCALE,
    });
    const seed = theme === "shrine" ? 11 : theme === "village" ? 22 : 33;
    paintGround({ ctx, pxW, pxH, road, walkable, toPx, seed });
  }, [theme, walkable, road, depthNear, pxW, pxH]);

  return (
    <canvas
      ref={ref}
      width={pxW}
      height={pxH}
      style={{
        position: "absolute",
        left: 0,
        top: screenTopY,
        width: worldW,
        height: screenH,
        transform: `translate3d(${-camX}px,0,0)`,
        imageRendering: "pixelated",
        willChange: "transform",
        zIndex,
      }}
      aria-hidden
    />
  );
}
