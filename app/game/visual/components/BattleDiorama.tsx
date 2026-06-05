import { useMemo } from "react";
import { HD2DWorld } from "./HD2DWorld";
import { PixelChibiSprite } from "./PixelChibiSprite";
import { BoriCompanion } from "./BoriCompanion";
import { WorldPropSprite } from "./WorldPropSprite";
import { getWorld2D } from "../../data/world2d";
import type { AreaTheme } from "../../data/gameData";
import { project, type CameraState } from "../../engine/projection";
import { PixelArt, gridWidth } from "../pixel/pixelArt";
import { getSprite } from "../pixel/pixelSprites";

// ───────────────────────────────────────────────────────────────────────────
// BattleDiorama — a fixed 3/4 diorama combat backdrop. Reuses the area's 2.5D
// world for the receding floor, parallax background and lighting, then stages
// the combatants: chibi Arin at left-mid foreground, Bori beside her, the
// Silence Wisp at right-mid background. Foreground framing props sit nearest the
// camera. All battle LOGIC stays in PixelBattleStage; this is purely visual.
// ───────────────────────────────────────────────────────────────────────────

interface Props {
  theme: AreaTheme;
  viewportW: number;
  viewportH: number;
  arinCast: boolean;
  arinFlinch: boolean;
  enemyDazed: boolean;
  enemyHurt: boolean;
  glowWord: string | null;
  floatDmg: { id: number; n: number; crit: boolean } | null;
  slash: number;
  boriMood: "idle" | "happy" | "worried";
}

const WISP_GRID_H = 16;

export function BattleDiorama({
  theme,
  viewportW,
  viewportH,
  arinCast,
  arinFlinch,
  enemyDazed,
  enemyHurt,
  glowWord,
  floatDmg,
  slash,
  boriMood,
}: Props) {
  // pick the matching world for backdrop + lighting; center the camera
  const areaId = theme;
  const world = useMemo(() => getWorld2D(areaId), [areaId]);

  // Fixed battle camera: center on the world, slight push-in zoom.
  const cam: CameraState = useMemo(
    () => ({
      offsetX: Math.max(0, (world.width - viewportW) / 2),
      offsetY: viewportH * 0.32,
      zoom: 1.04,
      shake: 0,
    }),
    [world.width, viewportW, viewportH],
  );

  // Stage positions in world space.
  const cx = cam.offsetX + viewportW / 2;
  const arinPos = { x: cx - viewportW * 0.26, y: 420 };
  const boriPos = { x: arinPos.x - 56, y: 450 };
  const wispPos = { x: cx + viewportW * 0.24, y: 230 };

  const arinProj = project(arinPos.x, arinPos.y, 0, cam);
  const boriProj = project(boriPos.x, boriPos.y, 28, cam);
  const wispProj = project(wispPos.x, wispPos.y, 60, cam);

  const wispGrid = getSprite("wisp");
  const wispScale = (150 * wispProj.scale) / WISP_GRID_H;
  const wispW = gridWidth(wispGrid) * wispScale;

  // foreground framing props (broken pillars / grass from the world, nearest)
  const fgProps = world.props.filter((p) => p.canOcclude && (p.worldY ?? 0) > 460).slice(0, 3);

  return (
    <HD2DWorld
      world={world}
      cam={cam}
      viewportW={viewportW}
      viewportH={viewportH}
      flash={enemyHurt ? 0.4 : 0}
      flashColor="#fff0c4"
      foreground={
        <>
          {fgProps.map((p) => {
            const pr = project(p.worldX, p.worldY, p.worldZ ?? 0, cam);
            return (
              <div key={`bfg-${p.id}`} style={{ position: "absolute", left: pr.screenX, top: pr.screenY, transform: "translate(-50%,-100%)", filter: "blur(1px)", opacity: 0.92 }}>
                <WorldPropSprite prop={p} visualScale={pr.scale * 1.2} worldY={p.worldY} />
              </div>
            );
          })}
        </>
      }
    >
      {/* enemy (back-right) */}
      <div style={{ position: "absolute", left: wispProj.screenX, top: wispProj.screenY, transform: "translate(-50%,-100%)" }}>
        <div className={enemyDazed ? "opacity-60" : enemyHurt ? "coer-flinch" : "coer-bob"} key={`wisp-${enemyHurt ? floatDmg?.id : "i"}`}>
          {/* dark aura */}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: wispW * 1.8, height: wispW * 1.8, borderRadius: "50%", background: "radial-gradient(circle, rgba(122,90,208,0.35), transparent 68%)", pointerEvents: "none" }} />
          <PixelArt grid={wispGrid} scale={wispScale} filter="drop-shadow(0 0 8px rgba(150,110,220,0.8)) drop-shadow(0 0 16px rgba(110,70,180,0.5))" />
        </div>
        {slash > 0 && (
          <div key={`sl-${slash}`} className="coer-slash absolute" style={{ left: "8%", top: "24%", width: wispW * 0.7, height: 6, background: "linear-gradient(90deg,transparent,#fff3c4,transparent)", boxShadow: "0 0 14px rgba(255,240,180,0.9)" }} />
        )}
        {floatDmg && (
          <div key={floatDmg.id} className="coer-dmg absolute" style={{ left: "50%", top: -40, transform: "translateX(-50%)", color: floatDmg.crit ? "#ffd86a" : "#ff8a8a", fontSize: floatDmg.crit ? 34 : 26, fontWeight: 700, textShadow: "0 0 12px rgba(0,0,0,0.7)" }}>
            {floatDmg.n}
          </div>
        )}
      </div>

      {/* Bori (beside Arin) */}
      <div style={{ position: "absolute", left: boriProj.screenX, top: boriProj.screenY, transform: "translate(-50%,-100%)" }}>
        <BoriCompanion height={62 * boriProj.scale} mood={boriMood} facing="right" />
      </div>

      {/* Arin (front-left) */}
      <div style={{ position: "absolute", left: arinProj.screenX, top: arinProj.screenY, transform: "translate(-50%,-100%)" }}>
        <PixelChibiSprite
          name="arin"
          facing="right"
          moving={false}
          height={150 * arinProj.scale}
          worldY={arinPos.y}
          state={arinCast ? "cast" : arinFlinch ? "flinch" : "idle"}
        />
        {glowWord && (
          <div className="coer-dmg absolute" style={{ left: "50%", top: -72, transform: "translateX(-50%)", color: "#ffe9a8", fontSize: 26, fontWeight: 800, textShadow: "0 0 16px rgba(255,220,140,0.95)", whiteSpace: "nowrap", fontFamily: "'Noto Sans KR', sans-serif" }}>
            {glowWord}
          </div>
        )}
      </div>
    </HD2DWorld>
  );
}
