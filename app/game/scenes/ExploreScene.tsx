import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getArea, type AreaId, type NpcDef } from "../data/gameData";
import { useGame } from "../engine/store";
import { useInput } from "../engine/useInput";
import { HD2DStage } from "../visual/components/HD2DStage";
import { PixelSprite } from "../visual/components/PixelSprite";
import type { SpriteName } from "../visual/pixel/pixelSprites";
import { sfx } from "../engine/sfx";

const SPEED = 5.0; // px per frame
const DASH = 1.7;
const LANE_Y = 0.82; // baseline (feet) fraction
const PAD = 180;

interface ExploreSceneProps {
  area: AreaId;
  viewportW: number;
  viewportH: number;
  paused: boolean;
  onInteractNpc: (npc: NpcDef) => void;
  onExit: (to: AreaId, label: string) => void;
}

// HD-2D side-view explore: Arin walks left/right along a cinematic pixel lane;
// the camera pans horizontally; NPCs and glowing letter crystals sit along the
// lane and are interacted with E. All world art is pixel-art (HD2DStage).
export function ExploreScene({ area, viewportW, viewportH, paused, onInteractNpc, onExit }: ExploreSceneProps) {
  const game = useGame();
  const def = getArea(area);

  const worldWidth = Math.max(viewportW * 1.9, 1500);
  const usable = worldWidth - PAD * 2;

  const npcX = useMemo(() => def.npcs.map((n) => PAD + n.atFrac * usable), [def, usable]);
  const exitX = PAD + 0.92 * usable;

  const posRef = useRef(PAD + 0.08 * usable);
  const facingRef = useRef<"left" | "right">("right");
  const movingRef = useRef(false);
  const camRef = useRef(0);
  const rafRef = useRef(0);
  const [, setTick] = useState(0);
  const [nearby, setNearby] = useState<{ kind: "npc" | "exit"; idx: number } | null>(null);

  useEffect(() => {
    posRef.current = PAD + 0.08 * usable;
    facingRef.current = "right";
    camRef.current = clamp(posRef.current - viewportW / 2, 0, Math.max(0, worldWidth - viewportW));
    setTick((t) => t + 1);
  }, [area, usable, viewportW, worldWidth]);

  const findNearby = useCallback((): { kind: "npc" | "exit"; idx: number } | null => {
    const px = posRef.current;
    type Cand = { kind: "npc" | "exit"; idx: number; d: number };
    const cands: Cand[] = [];
    npcX.forEach((x, i) => {
      const d = Math.abs(x - px);
      if (d < 90) cands.push({ kind: "npc", idx: i, d });
    });
    if (def.exitTo) {
      const d = Math.abs(exitX - px);
      if (d < 90) cands.push({ kind: "exit", idx: 0, d });
    }
    if (cands.length === 0) return null;
    const best = cands.reduce((a, b) => (b.d < a.d ? b : a));
    return { kind: best.kind, idx: best.idx };
  }, [npcX, exitX, def.exitTo]);

  const input = useInput({
    enabled: !paused,
    onAction: (a) => {
      if (paused) return;
      if (a === "interact" || a === "advance") {
        const hit = findNearby();
        if (!hit) return;
        sfx("select");
        if (hit.kind === "npc") onInteractNpc(def.npcs[hit.idx]);
        else if (def.exitTo) onExit(def.exitTo, def.exitLabel ?? "");
      }
    },
  });

  useEffect(() => {
    let running = true;
    function loop() {
      if (!running) return;
      if (!paused) {
        const inp = input.current;
        const dir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
        movingRef.current = dir !== 0;
        if (dir !== 0) {
          facingRef.current = dir > 0 ? "right" : "left";
          const speed = SPEED * (inp.dash ? DASH : 1);
          posRef.current = clamp(posRef.current + dir * speed, PAD - 40, worldWidth - PAD + 40);
        }
        const target = clamp(posRef.current - viewportW / 2, 0, Math.max(0, worldWidth - viewportW));
        camRef.current += (target - camRef.current) * 0.12;
        const n = findNearby();
        setNearby((prev) => (prev?.kind === n?.kind && prev?.idx === n?.idx ? prev : n));
        setTick((t) => (t + 1) % 1000000);
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [area, paused, viewportW, worldWidth, findNearby]);

  const camX = camRef.current;
  const completed = game.progress.completedLessons;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <HD2DStage
        theme={def.theme}
        camX={camX}
        worldWidth={worldWidth}
        viewportW={viewportW}
        viewportH={viewportH}
        laneFrac={LANE_Y}
      >
        {/* NPCs / lesson crystals */}
        {def.npcs.map((n, i) => {
          const isLessonDone = n.lessonId ? completed.includes(n.lessonId) : false;
          return (
            <NpcActor
              key={n.id}
              npc={n}
              worldX={npcX[i]}
              viewportH={viewportH}
              highlight={nearby?.kind === "npc" && nearby.idx === i}
              done={isLessonDone}
            />
          );
        })}

        {/* exit gate marker (pixel torii arch) */}
        {def.exitTo && (
          <div
            style={{ position: "absolute", left: exitX, top: LANE_Y * viewportH, transform: "translate(-50%,-100%)", zIndex: 18 }}
          >
            <div className="coer-bob flex flex-col items-center" style={{ filter: "drop-shadow(0 0 14px rgba(255,220,140,0.6))" }}>
              <PixelGate />
              <div className="mt-1 px-2 py-0.5 bg-black/65 border border-[rgba(216,178,90,0.5)] text-[11px] text-[#e9cf86] whitespace-nowrap">
                → {def.exitLabel}
              </div>
            </div>
          </div>
        )}

        {/* player */}
        <div style={{ position: "absolute", left: posRef.current, top: LANE_Y * viewportH, transform: "translate(-50%,-100%)", zIndex: 20 }}>
          <PixelSprite name="arin" height={150} facing={facingRef.current} moving={movingRef.current && !paused} />
        </div>
      </HD2DStage>

      {/* interaction prompt */}
      {nearby && !paused && (
        <div className="coer-fade-in absolute z-40" style={{ bottom: 70, left: "50%", transform: "translateX(-50%)" }}>
          <div className="px-3 py-1.5 border-2 border-[rgba(216,178,90,0.5)] bg-black/70 text-xs text-[#e9cf86] flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 border border-[rgba(216,178,90,0.4)] bg-black/50 font-mono text-[10px]">E</kbd>
            {nearby.kind === "npc"
              ? `${def.npcs[nearby.idx].lessonId && completed.includes(def.npcs[nearby.idx].lessonId!) ? "Talk again to" : "Talk to"} ${def.npcs[nearby.idx].name}`
              : `Travel to ${def.exitLabel}`}
          </div>
        </div>
      )}
    </div>
  );
}

function NpcActor({
  npc,
  worldX,
  viewportH,
  highlight,
  done,
}: {
  npc: NpcDef;
  worldX: number;
  viewportH: number;
  highlight: boolean;
  done: boolean;
}) {
  const isLetter = npc.id.startsWith("letter-") || npc.id === "stone-tablet";
  if (isLetter) {
    const char = npc.id === "letter-a" ? "ㅏ" : npc.id === "letter-eo" ? "ㅓ" : "가";
    return (
      <div style={{ position: "absolute", left: worldX, top: LANE_Y * viewportH, transform: "translate(-50%,-100%)", zIndex: 18 }}>
        {highlight && <Pointer />}
        <div className="flex flex-col items-center">
          {/* floating glowing Hangul lesson crystal */}
          <div
            className="coer-crystal"
            style={{
              fontSize: 56,
              color: done ? "#9ff0c8" : "#ffe9a8",
              textShadow: `0 0 22px ${done ? "rgba(110,231,183,0.8)" : "rgba(255,220,140,0.95)"}`,
            }}
          >
            {char}
          </div>
          {/* crystal pedestal */}
          <div style={{ width: 30, height: 10, background: "linear-gradient(180deg,#9a8460,#5a4a36)", border: "2px solid #3a2e22", marginTop: -4 }} />
          {done && <div className="text-emerald-300 text-xs mt-0.5">✓ learned</div>}
        </div>
      </div>
    );
  }

  const sprite: SpriteName =
    npc.sprite === "bori" ? "bori"
    : npc.sprite === "shopkeeper" ? "shopkeeper"
    : npc.sprite === "guard" ? "guard"
    : npc.sprite === "child" ? "child"
    : "elder";

  return (
    <div style={{ position: "absolute", left: worldX, top: LANE_Y * viewportH, transform: "translate(-50%,-100%)", zIndex: 18 }}>
      {highlight && <Pointer />}
      <div className="flex flex-col items-center">
        <PixelSprite name={sprite} height={130} facing="left" hover={npc.sprite === "bori"} glow={npc.sprite === "bori"} />
        {done && <div className="text-emerald-300 text-[11px] -mt-1">✓</div>}
      </div>
    </div>
  );
}

// Small pixel torii-style gate marker.
function PixelGate() {
  return (
    <div style={{ position: "relative", width: 54, height: 56 }}>
      <div style={{ position: "absolute", left: 4, top: 12, width: 8, height: 44, background: "#9a8460", border: "2px solid #5a4a36" }} />
      <div style={{ position: "absolute", right: 4, top: 12, width: 8, height: 44, background: "#9a8460", border: "2px solid #5a4a36" }} />
      <div style={{ position: "absolute", left: -2, top: 4, width: 58, height: 8, background: "#7a6a52", border: "2px solid #5a4a36" }} />
      <div style={{ position: "absolute", left: 4, top: 16, width: 46, height: 5, background: "#caa24e" }} />
    </div>
  );
}

function Pointer() {
  return (
    <div
      className="coer-blink"
      style={{
        position: "absolute",
        left: "50%",
        top: -18,
        transform: "translateX(-50%)",
        width: 0,
        height: 0,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
        borderTop: "11px solid #e9cf86",
        filter: "drop-shadow(0 0 6px rgba(233,207,134,0.8))",
        zIndex: 30,
      }}
    />
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
