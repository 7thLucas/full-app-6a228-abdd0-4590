import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MapDef, MapInteractable } from "../data/types";
import { getMap, SHRINE_GATE } from "../data/maps";
import { useGame } from "../engine/store";
import { useInput, type ActionKey } from "../engine/useInput";
import { Sprite, type SpriteKind } from "../visual/Sprite";
import { PixelCharacter } from "../visual/PixelCharacter";
import { Diorama } from "../visual/Diorama";
import { Atmosphere } from "../visual/Atmosphere";
import {
  sceneLayout,
  projectPixel,
  projectTile,
  cameraFor,
  corridorAxis,
  type SceneLayout,
} from "../visual/hd2d";
import { sfx } from "../engine/sfx";

const SPEED = 4.2; // px per frame at base
const DASH_MULT = 1.7;

interface ExploreSceneProps {
  viewportW: number;
  viewportH: number;
  onInteract: (it: MapInteractable, map: MapDef) => void;
  onEnterArea: (map: MapDef) => void;
  paused: boolean;
  shakeKey: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// HD-2D SIDE-VIEW EXPLORE
// The gameplay engine (collision grid, interactable tile coords, quest/door
// triggers) is unchanged — the player still lives in pixel space over the tile
// grid. We REMAP input (A/D -> horizontal tile-x, W/S -> depth tile-y) and
// PROJECT every world position into a cinematic side-view diorama. No top-down
// camera, no grid, no tiny icons.
// ─────────────────────────────────────────────────────────────────────────────
export function ExploreScene({
  viewportW,
  viewportH,
  onInteract,
  onEnterArea,
  paused,
  shakeKey,
}: ExploreSceneProps) {
  const game = useGame();
  const map = getMap(game.state.world.area);
  const ts = map.tileSize;

  const layout = useMemo<SceneLayout>(() => sceneLayout(map, viewportW), [map.id, viewportW]);

  const posRef = useRef({
    x: game.state.world.x * ts + ts / 2,
    y: game.state.world.y * ts + ts / 2,
  });
  // Facing in the side-view is only left/right.
  const facingRef = useRef<"left" | "right">(
    game.state.world.facing === "left" ? "left" : "right",
  );
  const movingRef = useRef(false);
  const camRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastAreaRef = useRef(map.id);

  const [, setRenderTick] = useState(0);
  const [nearby, setNearby] = useState<MapInteractable | null>(null);

  // Reset position when the area changes (after a door transition).
  useEffect(() => {
    if (lastAreaRef.current !== map.id) {
      lastAreaRef.current = map.id;
    }
    posRef.current = {
      x: game.state.world.x * ts + ts / 2,
      y: game.state.world.y * ts + ts / 2,
    };
    facingRef.current = game.state.world.facing === "left" ? "left" : "right";
    // snap camera to player so the new area doesn't slide in jarringly
    const p = projectPixel(map, layout, posRef.current.x, posRef.current.y);
    camRef.current = cameraFor(p.worldX, layout.worldWidth, viewportW);
    onEnterArea(map);
  }, [map.id]);

  const isBlocked = useCallback(
    (tileX: number, tileY: number): boolean => {
      if (tileX < 0 || tileY < 0 || tileX >= map.width || tileY >= map.height) return true;
      if (map.collision[tileY][tileX] === 1) return true;
      if (
        map.theme === "shrine" &&
        tileY === SHRINE_GATE.row &&
        SHRINE_GATE.cols.includes(tileX) &&
        !game.state.flags.shrineGateOpen
      ) {
        return true;
      }
      const solid = activeInteractables(map, game.state.flags).find(
        (it) =>
          it.x === tileX &&
          it.y === tileY &&
          it.kind !== "door" &&
          it.kind !== "encounter" &&
          it.kind !== "boss",
      );
      if (solid) return true;
      return false;
    },
    [map, game.state.flags],
  );

  // Find the interactable the player faces / stands adjacent to.
  const findNearby = useCallback((): MapInteractable | null => {
    const px = Math.floor(posRef.current.x / ts);
    const py = Math.floor(posRef.current.y / ts);
    const items = activeInteractables(map, game.state.flags);
    // Check the current tile and all 8 neighbours — interactables sit close on
    // the lane, and corridor orientation differs per map, so a full ring is the
    // most forgiving for the player.
    const candidates: { x: number; y: number }[] = [{ x: px, y: py }];
    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        if (ox === 0 && oy === 0) continue;
        candidates.push({ x: px + ox, y: py + oy });
      }
    }
    for (const c of candidates) {
      const hit = items.find((it) => it.x === c.x && it.y === c.y);
      if (hit) return hit;
    }
    return null;
  }, [map, ts, game.state.flags]);

  const input = useInput({
    enabled: !paused,
    onAction: (a: ActionKey) => {
      if (paused) return;
      if (a === "interact" || a === "advance") {
        const hit = findNearby();
        if (hit) {
          sfx("select");
          const px = Math.floor(posRef.current.x / ts);
          const py = Math.floor(posRef.current.y / ts);
          game.setPlayerTile(px, py, facingRef.current);
          onInteract(hit, map);
        }
      }
    },
  });

  // Auto-trigger encounters/doors when stepping onto their tile.
  const handleStepTriggers = useCallback(() => {
    const px = Math.floor(posRef.current.x / ts);
    const py = Math.floor(posRef.current.y / ts);
    const items = activeInteractables(map, game.state.flags);
    const hit = items.find((it) => it.x === px && it.y === py);
    if (!hit) return;
    if (hit.kind === "door" || hit.kind === "encounter" || hit.kind === "boss") {
      game.setPlayerTile(px, py, facingRef.current);
      onInteract(hit, map);
    }
  }, [map, ts, game, onInteract]);

  // Game loop.
  useEffect(() => {
    let running = true;
    function loop() {
      if (!running) return;
      if (!paused) {
        const inp = input.current;
        // SIDE-VIEW MAPPING (corridor-axis aware):
        //   A/D (left/right) -> travel ALONG the corridor
        //   W/S (up/down)    -> shallow DEPTH move (into/out of the scene)
        // For tall maps the corridor runs along tile-Y, so A/D drives Y and W/S
        // drives X. For wide maps it's the reverse. Facing is always horizontal.
        const along = (inp.right ? 1 : 0) - (inp.left ? 1 : 0); // +1 = forward
        const depth = (inp.down ? 1 : 0) - (inp.up ? 1 : 0); // +1 = toward camera

        movingRef.current = along !== 0 || depth !== 0;

        if (along !== 0 || depth !== 0) {
          if (along > 0) facingRef.current = "right";
          else if (along < 0) facingRef.current = "left";

          const axis = corridorAxis(map);
          const speed = SPEED * (inp.dash ? DASH_MULT : 1);
          const depthSpeed = speed * 0.7;

          // dTileX / dTileY in pixel space depending on corridor orientation.
          let dPxX: number;
          let dPxY: number;
          if (axis === "y") {
            // along -> +tileY (forward = down the rows); depth -> +tileX
            dPxX = depth * depthSpeed;
            dPxY = along * speed;
          } else {
            // along -> +tileX; depth -> +tileY (toward camera = +y)
            dPxX = along * speed;
            dPxY = depth * depthSpeed;
          }

          const nx = posRef.current.x + dPxX;
          const ny = posRef.current.y + dPxY;

          const half = ts * 0.32;
          if (!collides(nx, posRef.current.y, half, isBlocked, ts)) {
            posRef.current.x = nx;
          }
          if (!collides(posRef.current.x, ny, half, isBlocked, ts)) {
            posRef.current.y = ny;
          }
          handleStepTriggers();
        }

        // camera: horizontal pan following the projected player worldX
        const proj = projectPixel(map, layout, posRef.current.x, posRef.current.y);
        const targetCam = cameraFor(proj.worldX, layout.worldWidth, viewportW);
        camRef.current += (targetCam - camRef.current) * 0.12;

        const n = findNearby();
        setNearby((prev) => (prev?.id === n?.id ? prev : n));

        setRenderTick((t) => (t + 1) % 1000000);
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [map.id, paused, viewportW, viewportH, layout]);

  const camX = camRef.current;
  const items = activeInteractables(map, game.state.flags);

  const playerProj = projectPixel(map, layout, posRef.current.x, posRef.current.y);

  // Stage container is translated by camera; actors live in stage space.
  const stageStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    transform: `translate3d(${-camX}px,0,0)`,
    willChange: "transform",
  };

  return (
    <div
      className={shakeKey ? "coer-shake" : undefined}
      key={`shake-${shakeKey}`}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      {/* 5-layer diorama backdrop (handles its own internal parallax) */}
      <Diorama
        map={map}
        camX={camX}
        worldWidth={layout.worldWidth}
        viewportW={viewportW}
        viewportH={viewportH}
        laneBottomFrac={layout.laneTopY}
      />

      {/* MIDGROUND: interactables + player, depth-sorted, projected to side-view */}
      <div style={stageStyle}>
        {items.map((it) => {
          const p = projectTile(map, layout, it.x, it.y);
          return (
            <InteractableActor
              key={it.id}
              it={it}
              worldX={p.worldX}
              screenYFrac={p.screenYFrac}
              viewportH={viewportH}
              scale={p.scale}
              z={15 + Math.round((1 - p.depth) * 60)}
              highlight={nearby?.id === it.id}
            />
          );
        })}

        {/* player */}
        <PixelCharacter
          kind="kael"
          baseSize={ts * 2.1}
          worldX={playerProj.worldX}
          screenYFrac={playerProj.screenYFrac}
          viewportH={viewportH}
          scale={playerProj.scale}
          facing={facingRef.current}
          moving={movingRef.current && !paused}
          z={16 + Math.round((1 - playerProj.depth) * 60)}
        />
      </div>

      {/* particles / fog over everything but UI */}
      <Atmosphere theme={map.theme} />

      {/* interaction prompt */}
      {nearby && !paused && (
        <div
          className="coer-fade-in"
          style={{
            position: "absolute",
            bottom: 70,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 40,
          }}
        >
          <div className="px-3 py-1.5 rounded border border-[rgba(216,178,90,0.5)] bg-black/70 text-xs text-[#e9cf86] flex items-center gap-2 shadow-[0_0_18px_rgba(216,178,90,0.2)]">
            <kbd className="px-1.5 py-0.5 rounded border border-[rgba(216,178,90,0.4)] bg-black/50 font-mono text-[10px]">
              E
            </kbd>
            {promptVerb(nearby)} {nearby.label}
          </div>
        </div>
      )}
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────
function activeInteractables(map: MapDef, flags: Record<string, boolean>): MapInteractable[] {
  return map.interactables.filter((it) => {
    if (it.flagRequired && !flags[it.flagRequired]) return false;
    if (it.flagBlocks && flags[it.flagBlocks]) return false;
    if (it.oneShotFlag && flags[it.oneShotFlag] && it.kind !== "save" && it.kind !== "shop")
      return false;
    return true;
  });
}

function collides(
  cx: number,
  cy: number,
  half: number,
  isBlocked: (tx: number, ty: number) => boolean,
  ts: number,
): boolean {
  const corners = [
    [cx - half, cy - half],
    [cx + half, cy - half],
    [cx - half, cy + half],
    [cx + half, cy + half],
  ];
  return corners.some(([x, y]) => isBlocked(Math.floor(x / ts), Math.floor(y / ts)));
}

function promptVerb(it: MapInteractable): string {
  switch (it.kind) {
    case "npc":
      return "Talk to";
    case "chest":
      return "Open";
    case "door":
      return "Enter";
    case "save":
      return "Touch";
    case "shop":
      return "Trade with";
    case "lever":
      return "Pull";
    default:
      return "Examine";
  }
}

// An interactable rendered as an upright side-view prop/NPC/enemy on the lane.
function InteractableActor({
  it,
  worldX,
  screenYFrac,
  viewportH,
  scale,
  z,
  highlight,
}: {
  it: MapInteractable;
  worldX: number;
  screenYFrac: number;
  viewportH: number;
  scale: number;
  z: number;
  highlight: boolean;
}) {
  const kind = (it.sprite ?? "door") as SpriteKind;
  const isCharacter = it.kind === "npc" || it.kind === "shop";
  const isEnemyPreview = it.kind === "encounter" || it.kind === "boss";
  const glow = it.kind === "save";
  const bob = it.kind === "save" || isCharacter;

  // characters face the player roughly (face left, toward centre-left spawn)
  const facing = isCharacter ? "left" : "right";
  const baseSize = isEnemyPreview ? 120 : 96;

  return (
    <PixelCharacter
      kind={kind}
      baseSize={baseSize}
      worldX={worldX}
      screenYFrac={screenYFrac}
      viewportH={viewportH}
      scale={scale}
      facing={facing as "left" | "right"}
      moving={false}
      bob={bob}
      glow={glow}
      z={z}
      highlight={highlight}
    />
  );
}

// keep Sprite import used (InteractableActor relies on SpriteKind typing)
void Sprite;
