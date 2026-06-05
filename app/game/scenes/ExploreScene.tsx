import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getArea, type AreaId, type NpcDef } from "../data/gameData";
import { getWorld2D, type Interactable, type WorldNpc, type WorldProp } from "../data/world2d";
import { useGame } from "../engine/store";
import { useInput } from "../engine/useInput";
import { sfx } from "../engine/sfx";
import {
  project,
  resolveMove,
  clamp,
  dist2,
  type CameraState,
} from "../engine/projection";
import { HD2DWorld } from "../visual/components/HD2DWorld";
import { PixelChibiSprite, type ChibiState } from "../visual/components/PixelChibiSprite";
import { BoriCompanion } from "../visual/components/BoriCompanion";
import { WorldPropSprite } from "../visual/components/WorldPropSprite";
import { HangulCrystal } from "../visual/components/HangulCrystal";
import type { ChibiName } from "../visual/pixel/chibiSprites";

const SPEED = 3.1; // world units / frame
const DASH = 1.75;
const ARIN_H = 132; // base rendered height (pre depth-scale)

type Facing = "down" | "up" | "left" | "right";

interface ExploreSceneProps {
  area: AreaId;
  viewportW: number;
  viewportH: number;
  paused: boolean;
  onInteractNpc: (npc: NpcDef) => void;
  onExit: (to: AreaId, label: string) => void;
}

// HD-2D 2.5D diorama explore: a chibi pixel Arin walks left/right/up/down on a
// receding floor plane. Entities depth-sort by worldY; Arin renders behind or in
// front of props; occluders fade when they fully hide her. Camera follows with a
// dead-zone and pushes in near interactables.
export function ExploreScene({ area, viewportW, viewportH, paused, onInteractNpc, onExit }: ExploreSceneProps) {
  const game = useGame();
  const areaDef = getArea(area);
  const world = useMemo(() => getWorld2D(area), [area]);
  const completed = game.progress.completedLessons;

  // ── mutable game-loop state (refs so the loop doesn't re-bind) ──────────────
  const px = useRef(world.spawn.x);
  const py = useRef(world.spawn.y);
  const facing = useRef<Facing>("down");
  const moving = useRef(false);
  const arinState = useRef<ChibiState>("idle");
  const cam = useRef<CameraState>({ offsetX: 0, offsetY: 0, zoom: 1, shake: 0 });
  // Bori delayed-follow position (world space)
  const boriX = useRef(world.spawn.x - 70);
  const boriY = useRef(world.spawn.y + 30);
  // npc patrol progress
  const patrol = useRef<Record<string, { wp: number; x: number; y: number }>>({});
  const rafRef = useRef(0);
  const [, setTick] = useState(0);
  const [nearby, setNearby] = useState<Interactable | null>(null);
  const [boriMood, setBoriMood] = useState<"idle" | "happy" | "worried">("idle");

  // base camera offsetY so the floor sits in the lower portion of the viewport
  const baseOffsetY = useMemo(() => viewportH * 0.30, [viewportH]);

  // ── reset on area change ────────────────────────────────────────────────────
  useEffect(() => {
    px.current = world.spawn.x;
    py.current = world.spawn.y;
    facing.current = "down";
    boriX.current = world.spawn.x - 70;
    boriY.current = world.spawn.y + 30;
    patrol.current = {};
    world.npcs.forEach((n) => {
      if (n.patrol) patrol.current[n.def.id] = { wp: 0, x: n.worldX, y: n.worldY };
    });
    cam.current = {
      offsetX: clamp(world.spawn.x - viewportW / 2, 0, Math.max(0, world.width - viewportW)),
      offsetY: baseOffsetY,
      zoom: 1,
      shake: 0,
    };
    setTick((t) => t + 1);
  }, [area, world, viewportW, baseOffsetY]);

  // ── find nearest interactable to the player ────────────────────────────────
  const findNearby = useCallback((): Interactable | null => {
    let best: Interactable | null = null;
    let bestD = Infinity;
    for (const it of world.interactables) {
      const d = dist2(px.current, py.current, it.worldX, it.worldY);
      if (d < it.radius * it.radius && d < bestD) {
        bestD = d;
        best = it;
      }
    }
    return best;
  }, [world]);

  const triggerInteract = useCallback(() => {
    if (paused) return;
    const hit = findNearby();
    if (!hit) return;
    sfx("select");
    if (hit.kind === "exit" && hit.exitTo) {
      onExit(hit.exitTo, hit.exitLabel ?? "");
      return;
    }
    // resolve the NpcDef behind this interactable
    const npc = areaDef.npcs.find((n) => n.id === hit.npcId);
    if (npc) {
      arinState.current = "cast";
      setTimeout(() => (arinState.current = "idle"), 400);
      onInteractNpc(npc);
    }
  }, [paused, findNearby, areaDef, onExit, onInteractNpc]);

  const input = useInput({
    enabled: !paused,
    onAction: (a) => {
      if (a === "interact" || a === "advance") triggerInteract();
    },
  });

  // ── main loop ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let running = true;
    const halfW = viewportW / 2;
    const deadZone = viewportW * 0.18;

    function loop() {
      if (!running) {
        return;
      }
      if (!paused) {
        const inp = input.current;
        const dxRaw = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
        const dyRaw = (inp.down ? 1 : 0) - (inp.up ? 1 : 0); // down=toward camera=+worldY
        let dx = dxRaw;
        let dy = dyRaw;
        const isMoving = dx !== 0 || dy !== 0;
        moving.current = isMoving;

        if (isMoving) {
          // normalize diagonals
          if (dx !== 0 && dy !== 0) {
            const inv = 1 / Math.SQRT2;
            dx *= inv;
            dy *= inv;
          }
          const sp = SPEED * (inp.dash ? DASH : 1);
          // pick facing: prioritise the dominant axis
          if (Math.abs(dxRaw) >= Math.abs(dyRaw) && dxRaw !== 0) {
            facing.current = dxRaw > 0 ? "right" : "left";
          } else if (dyRaw !== 0) {
            facing.current = dyRaw > 0 ? "down" : "up";
          }
          const res = resolveMove(px.current, py.current, dx * sp, dy * sp, world.walkable, world.blocks);
          px.current = res.x;
          py.current = res.y;
          if (arinState.current === "idle" || arinState.current === "walk") {
            arinState.current = "walk";
          }
        } else if (arinState.current === "walk") {
          arinState.current = "idle";
        }

        // ── Bori delayed follow (trails behind, offset to player's side) ──────
        const targetBX = px.current + (facing.current === "right" ? -64 : 64);
        const targetBY = py.current + 22;
        boriX.current += (targetBX - boriX.current) * 0.08;
        boriY.current += (targetBY - boriY.current) * 0.08;

        // ── NPC patrols ──────────────────────────────────────────────────────
        for (const n of world.npcs) {
          if (!n.patrol) continue;
          const st = patrol.current[n.def.id];
          if (!st) continue;
          const wp = n.patrol[st.wp];
          const ddx = wp.x - st.x;
          const ddy = wp.y - st.y;
          const d = Math.hypot(ddx, ddy);
          const psp = n.patrolSpeed ?? 1;
          if (d < psp + 0.5) {
            st.wp = (st.wp + 1) % n.patrol.length;
          } else {
            st.x += (ddx / d) * psp;
            st.y += (ddy / d) * psp;
          }
        }

        // ── camera follow with dead zone + cinematic push-in ─────────────────
        const screenPX = px.current - cam.current.offsetX;
        let targetCamX = cam.current.offsetX;
        if (screenPX < halfW - deadZone) targetCamX = px.current - (halfW - deadZone);
        else if (screenPX > halfW + deadZone) targetCamX = px.current - (halfW + deadZone);
        targetCamX = clamp(targetCamX, 0, Math.max(0, world.width - viewportW));

        const near = findNearby();
        const targetZoom = near ? 1.06 : 1.0;
        cam.current.offsetX += (targetCamX - cam.current.offsetX) * 0.1;
        cam.current.offsetY = baseOffsetY;
        cam.current.zoom += (targetZoom - cam.current.zoom) * 0.08;
        cam.current.shake *= 0.85;

        setNearby((prev) => (prev?.id === near?.id ? prev : near ?? null));
        setBoriMood((m) => (near ? (m === "happy" ? m : "happy") : m === "idle" ? m : "idle"));
        setTick((t) => (t + 1) % 1_000_000);
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [paused, viewportW, viewportH, world, baseOffsetY, findNearby, input]);

  const c = cam.current;

  // ── build the depth-sorted render list ──────────────────────────────────────
  type Item = { y: number; z: number; node: React.ReactNode };
  const items: Item[] = [];

  // player projection (used for occlusion checks)
  const arinProj = project(px.current, py.current, 0, c);

  // props
  for (const prop of world.props) {
    if (prop.kind === "crystal") {
      items.push({ y: prop.worldY, z: 1, node: renderCrystal(prop, c, completed) });
      continue;
    }
    const proj = project(prop.worldX, prop.worldY, prop.worldZ ?? 0, c);
    // occlusion fade: if this occluder is in front of Arin AND overlaps her, fade
    const faded =
      !!prop.canOcclude &&
      prop.worldY > py.current && // in front (nearer camera)
      Math.abs(prop.worldX - px.current) < 60 &&
      prop.worldY - py.current < 60;
    items.push({
      y: prop.worldY,
      z: 0,
      node: (
        <Positioned key={`prop-${prop.id}`} x={proj.screenX} y={proj.screenY} anchor="bottom">
          <WorldPropSprite prop={prop} visualScale={proj.scale} worldY={prop.worldY} faded={faded} />
        </Positioned>
      ),
    });
  }

  // NPCs
  for (const n of world.npcs) {
    const st = patrol.current[n.def.id];
    const wx = st ? st.x : n.worldX;
    const wy = st ? st.y : n.worldY;
    const proj = project(wx, wy, 0, c);
    const done = n.def.lessonId ? completed.includes(n.def.lessonId) : false;
    const sprite = npcSprite(n.def);
    items.push({
      y: wy,
      z: 0,
      node: (
        <Positioned key={`npc-${n.def.id}`} x={proj.screenX} y={proj.screenY} anchor="bottom">
          <div style={{ position: "relative" }}>
            {nearby?.npcId === n.def.id && <Bubble label={done ? "✓" : "!"} />}
            <PixelChibiSprite
              name={sprite}
              facing={facingTo(wx, wy, px.current, py.current)}
              moving={!!st}
              height={ARIN_H * 0.92 * proj.scale}
              worldY={wy}
              glowColor={done ? "rgba(110,231,183,0.6)" : undefined}
            />
          </div>
        </Positioned>
      ),
    });
  }

  // Bori
  {
    const proj = project(boriX.current, boriY.current, 26, c);
    items.push({
      y: boriY.current,
      z: 0,
      node: (
        <Positioned key="bori" x={proj.screenX} y={proj.screenY} anchor="bottom">
          <BoriCompanion height={56 * proj.scale} mood={boriMood} facing={facing.current === "right" ? "left" : "right"} />
        </Positioned>
      ),
    });
  }

  // Arin
  items.push({
    y: py.current,
    z: 1,
    node: (
      <Positioned key="arin" x={arinProj.screenX} y={arinProj.screenY} anchor="bottom">
        <PixelChibiSprite
          name="arin"
          facing={facing.current}
          moving={moving.current && !paused}
          height={ARIN_H * arinProj.scale}
          worldY={py.current}
          state={arinState.current}
        />
      </Positioned>
    ),
  });

  // sort by depth (worldY); ties broken by z (sub-layer)
  items.sort((a, b) => a.y - b.y || a.z - b.z);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <HD2DWorld world={world} cam={c} viewportW={viewportW} viewportH={viewportH}>
        {items.map((it) => it.node)}
      </HD2DWorld>

      {/* interaction prompt */}
      {nearby && !paused && (
        <div className="coer-fade-in absolute z-40" style={{ bottom: 64, left: "50%", transform: "translateX(-50%)" }}>
          <div className="px-3 py-1.5 border-2 border-[rgba(216,178,90,0.55)] bg-black/72 text-xs text-[#e9cf86] flex items-center gap-2 rounded-sm" style={{ boxShadow: "0 0 14px rgba(216,178,90,0.25)" }}>
            <kbd className="px-1.5 py-0.5 border border-[rgba(216,178,90,0.4)] bg-black/50 font-mono text-[10px]">E</kbd>
            {nearby.label}
          </div>
        </div>
      )}

      {/* movement hint */}
      {!paused && (
        <div className="absolute z-30 text-[10px] text-[#e9cf86]/55" style={{ bottom: 12, left: 14 }}>
          WASD / arrows to move · Shift dash · E interact
        </div>
      )}
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────

function Positioned({
  x,
  y,
  anchor,
  children,
}: {
  x: number;
  y: number;
  anchor: "bottom";
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: anchor === "bottom" ? "translate(-50%,-100%)" : "translate(-50%,-50%)",
      }}
    >
      {children}
    </div>
  );
}

function renderCrystal(prop: WorldProp, cam: CameraState, completed: string[]) {
  const proj = project(prop.worldX, prop.worldY, prop.worldZ ?? 0, cam);
  // map crystal id → lesson done state via interactable's lesson
  const done =
    (prop.id === "crystal-a" && completed.includes("l1")) ||
    (prop.id === "crystal-eo" && completed.includes("l2"));
  const broken = prop.glyphColor === "#b9a8e8" || prop.glyphColor === "#caa8ff";
  return (
    <Positioned key={`crystal-${prop.id}`} x={proj.screenX} y={proj.screenY} anchor="bottom">
      <HangulCrystal
        glyph={prop.glyph ?? "?"}
        color={prop.glyphColor ?? "#9fe8ff"}
        size={Math.round(54 * proj.scale)}
        done={done}
        broken={broken}
      />
    </Positioned>
  );
}

function Bubble({ label }: { label: string }) {
  return (
    <div
      className="coer-blink"
      style={{
        position: "absolute",
        top: -22,
        left: "50%",
        transform: "translateX(-50%)",
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.7)",
        border: "1px solid rgba(216,178,90,0.6)",
        color: "#ffe6a8",
        fontSize: 11,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 8px rgba(216,178,90,0.5)",
      }}
    >
      {label}
    </div>
  );
}

function npcSprite(def: NpcDef): ChibiName {
  switch (def.sprite) {
    case "shopkeeper":
      return "shopkeeper";
    case "guard":
      return "guard";
    case "child":
      return "child";
    default:
      return "elder";
  }
}

// face an NPC toward the player when close, else keep down
function facingTo(nx: number, ny: number, pxv: number, pyv: number): Facing {
  if (dist2(nx, ny, pxv, pyv) > 200 * 200) return "down";
  const dx = pxv - nx;
  const dy = pyv - ny;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
  return dy > 0 ? "down" : "up";
}
