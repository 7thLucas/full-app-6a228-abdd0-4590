import { HD2DStage } from "../visual/components/HD2DStage";
import { PixelSprite } from "../visual/components/PixelSprite";
import { sfx } from "../engine/sfx";

interface MainMenuProps {
  hasSave: boolean;
  onStart: () => void;
  onContinue: () => void;
  onDaily: () => void;
  onReview: () => void;
  onSettings: () => void;
}

// HD-2D pixel title screen: a fantasy road at sunrise built from the same
// 6-layer pixel scene system, with Bori by a glowing lantern, floating Hangul,
// parallax mountains/clouds, bloom + fog, and fantasy pixel buttons.
export function MainMenu({ hasSave, onStart, onContinue, onDaily, onReview, onSettings }: MainMenuProps) {
  function click(fn: () => void) {
    sfx("select");
    fn();
  }

  const items: { label: string; fn: () => void; disabled?: boolean; hint?: string }[] = [
    { label: "Start Learning", fn: onStart },
    { label: "Continue Journey", fn: onContinue, disabled: !hasSave, hint: hasSave ? undefined : "no save yet" },
    { label: "Daily Quest", fn: onDaily },
    { label: "Review Words", fn: onReview },
    { label: "Settings", fn: onSettings },
  ];

  // a fixed, gently-panning camera value gives the title a calm parallax drift
  const camX = 60;
  const W = 1280;
  const H = 720;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* pixel HD-2D backdrop (shrine sunrise scene) */}
      <HD2DStage theme="shrine" camX={camX} worldWidth={W * 1.4} viewportW={W} viewportH={H} laneFrac={0.82}>
        {/* Bori beside a glowing lantern, lower-left of the road */}
        <div style={{ position: "absolute", left: W * 0.16, top: 0.82 * H, transform: "translate(-50%,-100%)", zIndex: 20 }}>
          <PixelSprite name="bori" height={96} hover glow />
        </div>
        <div style={{ position: "absolute", left: W * 0.1, top: 0.82 * H, transform: "translate(-50%,-100%)", zIndex: 19 }}>
          <PixelLantern />
        </div>
      </HD2DStage>

      {/* title + menu */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-40">
        <h1 className="coer-heading" style={{ fontSize: "clamp(34px,6vw,68px)", lineHeight: 1 }}>
          Hangul Roads
        </h1>
        <p className="mt-2 text-[#f3e6c8] tracking-wide" style={{ fontSize: "clamp(13px,1.6vw,18px)", textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
          Learn Korean Through Adventure
        </p>

        <div className="mt-7 flex flex-col gap-1.5">
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

// Pixel stone lantern with a glowing flame.
function PixelLantern() {
  return (
    <div style={{ position: "relative", width: 34, height: 80 }}>
      {/* post */}
      <div style={{ position: "absolute", left: 13, bottom: 0, width: 8, height: 50, background: "#5a4632", border: "2px solid #3a2e22" }} />
      {/* lamp box */}
      <div style={{ position: "absolute", left: 4, top: 6, width: 26, height: 26, background: "#5a4632", border: "2px solid #3a2e22" }} />
      {/* glow */}
      <div className="coer-flicker" style={{ position: "absolute", left: 9, top: 11, width: 16, height: 16, background: "radial-gradient(circle,#fff3c4,#ffb24a 70%)", boxShadow: "0 0 18px rgba(255,170,80,0.9)" }} />
      {/* cap */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 34, height: 8, background: "#3a2e22" }} />
    </div>
  );
}
