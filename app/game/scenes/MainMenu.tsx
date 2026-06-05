import { useEffect, useRef, useState } from "react";
import { HD2DWorld } from "../visual/components/HD2DWorld";
import { PixelChibiSprite } from "../visual/components/PixelChibiSprite";
import { BoriCompanion } from "../visual/components/BoriCompanion";
import { HangulCrystal } from "../visual/components/HangulCrystal";
import { getWorld2D } from "../data/world2d";
import { project, type CameraState } from "../engine/projection";
import { sfx } from "../engine/sfx";

interface MainMenuProps {
  hasSave: boolean;
  onStart: () => void;
  onContinue: () => void;
  onDaily: () => void;
  onReview: () => void;
  onSettings: () => void;
}

// HD-2D 2.5D pixel title screen: chibi Arin + Bori stand on the shrine's
// receding diorama road at sunrise, framed by floating Hangul, parallax
// mountains, bloom, fog and light shafts. A slow camera drift gives it life.
export function MainMenu({ hasSave, onStart, onContinue, onDaily, onReview, onSettings }: MainMenuProps) {
  function click(fn: () => void) {
    sfx("select");
    fn();
  }

  const W = 1280;
  const H = 720;
  const world = getWorld2D("shrine");

  // gentle camera drift
  const [t, setT] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    let run = true;
    let last = performance.now();
    function loop(now: number) {
      if (!run) return;
      setT((v) => v + (now - last) * 0.00018);
      last = now;
      raf.current = requestAnimationFrame(loop);
    }
    raf.current = requestAnimationFrame(loop);
    return () => {
      run = false;
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const cam: CameraState = {
    offsetX: 120 + Math.sin(t) * 40,
    offsetY: H * 0.3,
    zoom: 1.02,
    shake: 0,
  };

  const arinPos = { x: 560, y: 470 };
  const boriPos = { x: 500, y: 500 };
  const arinProj = project(arinPos.x, arinPos.y, 0, cam);
  const boriProj = project(boriPos.x, boriPos.y, 26, cam);

  const items: { label: string; fn: () => void; disabled?: boolean; hint?: string }[] = [
    { label: "Start Learning", fn: onStart },
    { label: "Continue Journey", fn: onContinue, disabled: !hasSave, hint: hasSave ? undefined : "no save yet" },
    { label: "Daily Quest", fn: onDaily },
    { label: "Review Words", fn: onReview },
    { label: "Settings", fn: onSettings },
  ];

  // a couple of floating title Hangul crystals
  const crystals = [
    { glyph: "한", x: 760, y: 200, z: 110, color: "#9fe8ff" },
    { glyph: "글", x: 880, y: 250, z: 90, color: "#ffd98a" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <HD2DWorld world={world} cam={cam} viewportW={W} viewportH={H}>
        {crystals.map((c) => {
          const p = project(c.x, c.y, c.z, cam);
          return (
            <div key={c.glyph} style={{ position: "absolute", left: p.screenX, top: p.screenY, transform: "translate(-50%,-100%)" }}>
              <HangulCrystal glyph={c.glyph} color={c.color} size={Math.round(58 * p.scale)} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: boriProj.screenX, top: boriProj.screenY, transform: "translate(-50%,-100%)" }}>
          <BoriCompanion height={64 * boriProj.scale} mood="happy" facing="right" />
        </div>
        <div style={{ position: "absolute", left: arinProj.screenX, top: arinProj.screenY, transform: "translate(-50%,-100%)" }}>
          <PixelChibiSprite name="arin" facing="down" moving={false} height={150 * arinProj.scale} worldY={arinPos.y} state="glow" glowColor="rgba(255,224,150,0.5)" />
        </div>
      </HD2DWorld>

      {/* title + menu */}
      <div className="absolute inset-0 flex flex-col items-center justify-start text-center px-4 z-40" style={{ paddingTop: "10%" }}>
        <h1 className="coer-heading" style={{ fontSize: "clamp(34px,6vw,68px)", lineHeight: 1 }}>
          Hangul Roads
        </h1>
        <p className="mt-2 text-[#f3e6c8] tracking-wide" style={{ fontSize: "clamp(13px,1.6vw,18px)", textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
          Learn Korean Through Adventure
        </p>

        <div className="mt-6 flex flex-col gap-1.5">
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              disabled={it.disabled}
              onClick={() => !it.disabled && click(it.fn)}
              className="coer-menu-item text-lg sm:text-xl px-6 py-1.5 disabled:opacity-35 disabled:cursor-not-allowed"
              data-active="false"
            >
              {it.label}
              {it.hint && <span className="ml-2 text-[11px] text-[#bfb59c] tracking-normal normal-case">({it.hint})</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
