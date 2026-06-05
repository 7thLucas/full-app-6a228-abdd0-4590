import { useCallback, useEffect, useRef, useState } from "react";
import type { MapDef, MapInteractable } from "../data/types";
import { getMap, SHRINE_GATE } from "../data/maps";
import { useGame } from "../engine/store";
import { useInput, type ActionKey } from "../engine/useInput";
import { WorldTiles } from "./WorldTiles";
import { Sprite, type SpriteKind } from "../visual/Sprite";
import { Atmosphere } from "../visual/Atmosphere";
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

// Pixel-space player position lives in a ref; the loop writes it back to the
// store on transitions. Camera follows with easing.
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

  const posRef = useRef({
    x: game.state.world.x * ts + ts / 2,
    y: game.state.world.y * ts + ts / 2,
  });
  const facingRef = useRef(game.state.world.facing);
  const camRef = useRef({ x: 0, y: 0 });
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
    facingRef.current = game.state.world.facing;
    onEnterArea(map);
  }, [map.id]);

  const isBlocked = useCallback(
    (tileX: number, tileY: number): boolean => {
      if (tileX < 0 || tileY < 0 || tileX >= map.width || tileY >= map.height) return true;
      if (map.collision[tileY][tileX] === 1) return true;
      // shrine gate: blocked until lever flag set
      if (
        map.theme === "shrine" &&
        tileY === SHRINE_GATE.row &&
        SHRINE_GATE.cols.includes(tileX) &&
        !game.state.flags.shrineGateOpen
      ) {
        return true;
      }
      // solid interactables (props/NPCs block movement)
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
    // check current tile + the tile being faced + 4-neighbours
    const candidates = [
      { x: px, y: py },
      facingOffset(px, py, facingRef.current),
      { x: px, y: py - 1 },
      { x: px, y: py + 1 },
      { x: px - 1, y: py },
      { x: px + 1, y: py },
    ];
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
          // sync store tile before handing off
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
        const dx = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
        const dy = (inp.down ? 1 : 0) - (inp.up ? 1 : 0);

        if (dx !== 0 || dy !== 0) {
          // facing
          if (Math.abs(dx) >= Math.abs(dy)) {
            facingRef.current = dx > 0 ? "right" : "left";
          } else {
            facingRef.current = dy > 0 ? "down" : "up";
          }
          const speed = SPEED * (inp.dash ? DASH_MULT : 1);
          const len = Math.hypot(dx, dy) || 1;
          const nx = posRef.current.x + (dx / len) * speed;
          const ny = posRef.current.y + (dy / len) * speed;

          // collision check per-axis using player half-size
          const half = ts * 0.32;
          if (!collides(nx, posRef.current.y, half, isBlocked, ts)) {
            posRef.current.x = nx;
          }
          if (!collides(posRef.current.x, ny, half, isBlocked, ts)) {
            posRef.current.y = ny;
          }
          handleStepTriggers();
        }

        // camera easing
        const targetCamX = clamp(
          posRef.current.x - viewportW / 2,
          0,
          Math.max(0, map.width * ts - viewportW),
        );
        const targetCamY = clamp(
          posRef.current.y - viewportH / 2,
          0,
          Math.max(0, map.height * ts - viewportH),
        );
        camRef.current.x += (targetCamX - camRef.current.x) * 0.12;
        camRef.current.y += (targetCamY - camRef.current.y) * 0.12;

        // nearby indicator
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
  }, [map.id, paused, viewportW, viewportH]);

  const cam = camRef.current;
  const worldStyle: React.CSSProperties = {
    position: "absolute",
    left: -cam.x,
    top: -cam.y,
    willChange: "transform",
  };

  const items = activeInteractables(map, game.state.flags);

  return (
    <div
      className={shakeKey ? "coer-shake" : undefined}
      key={`shake-${shakeKey}`}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      {/* Parallax backdrop for snow/shrine */}
      {(map.theme === "snow" || map.theme === "shrine") && (
        <ParallaxBack theme={map.theme} camX={cam.x} camY={cam.y} />
      )}

      <div style={worldStyle}>
        <WorldTiles map={map} />

        {/* interactables */}
        {items.map((it) => (
          <Interactable key={it.id} it={it} ts={ts} highlight={nearby?.id === it.id} />
        ))}

        {/* player */}
        <div
          style={{
            position: "absolute",
            left: posRef.current.x - ts / 2,
            top: posRef.current.y - ts * 0.85,
            width: ts,
            height: ts,
            zIndex: Math.floor(posRef.current.y),
          }}
        >
          <div className="coer-breathe">
            <Sprite kind="kael" size={ts} facing={facingRef.current} />
          </div>
        </div>
      </div>

      <Atmosphere theme={map.theme} />

      {/* interaction prompt */}
      {nearby && !paused && (
        <div
          className="coer-fade-in"
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 40,
          }}
        >
          <div className="px-3 py-1.5 rounded border border-[rgba(216,178,90,0.5)] bg-black/70 text-xs text-[#e9cf86] flex items-center gap-2">
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

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function facingOffset(x: number, y: number, facing: string) {
  switch (facing) {
    case "up":
      return { x, y: y - 1 };
    case "down":
      return { x, y: y + 1 };
    case "left":
      return { x: x - 1, y };
    case "right":
      return { x: x + 1, y };
    default:
      return { x, y };
  }
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

function Interactable({
  it,
  ts,
  highlight,
}: {
  it: MapInteractable;
  ts: number;
  highlight: boolean;
}) {
  const kind = (it.sprite ?? "door") as SpriteKind;
  const bob =
    it.kind === "save" || it.kind === "npc" || it.kind === "shop" ? "coer-bob" : "";
  const glow = it.kind === "save" ? "coer-pulse-glow" : "";
  return (
    <div
      style={{
        position: "absolute",
        left: it.x * ts,
        top: it.y * ts - ts * 0.4,
        width: ts,
        height: ts * 1.4,
        zIndex: Math.floor(it.y * ts),
      }}
    >
      {highlight && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -8,
            transform: "translateX(-50%)",
            width: ts * 0.5,
            height: 4,
            borderRadius: 4,
            background: "radial-gradient(circle, rgba(233,207,134,0.9), transparent)",
          }}
          className="coer-blink"
        />
      )}
      <div className={`${bob} ${glow}`} style={{ position: "absolute", bottom: 0 }}>
        <Sprite kind={kind} size={ts} />
      </div>
    </div>
  );
}

function ParallaxBack({
  theme,
  camX,
  camY,
}: {
  theme: "snow" | "shrine";
  camX: number;
  camY: number;
}) {
  const far = theme === "snow"
    ? "linear-gradient(180deg, #7d93ad 0%, #9fb2c7 45%, #c4d2e0 100%)"
    : "linear-gradient(180deg, #0a1424 0%, #112038 55%, #16263f 100%)";
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: far }} />
      {/* distant mountains */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: -camX * 0.15,
          width: "200%",
          height: "60%",
          background:
            theme === "snow"
              ? "radial-gradient(ellipse 30% 100% at 20% 100%, #6f86a0 0%, transparent 70%), radial-gradient(ellipse 35% 100% at 55% 100%, #5e768f 0%, transparent 72%), radial-gradient(ellipse 28% 100% at 85% 100%, #748aa3 0%, transparent 70%)"
              : "radial-gradient(ellipse 32% 100% at 30% 100%, #15263d 0%, transparent 70%), radial-gradient(ellipse 30% 100% at 70% 100%, #1a2e4a 0%, transparent 72%)",
          opacity: theme === "snow" ? 0.85 : 0.5,
          transform: `translateY(${camY * 0.05}px)`,
        }}
      />
      {/* mid ridge */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: -camX * 0.3,
          width: "200%",
          height: "40%",
          background:
            theme === "snow"
              ? "radial-gradient(ellipse 25% 100% at 30% 100%, #8ba0b8 0%, transparent 70%), radial-gradient(ellipse 30% 100% at 70% 100%, #93a8bf 0%, transparent 72%)"
              : "radial-gradient(ellipse 25% 100% at 40% 100%, #1c3350 0%, transparent 70%)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}
