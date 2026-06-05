import { Sprite } from "../visual/Sprite";
import { sfx } from "../engine/sfx";

interface MainMenuProps {
  hasSave: boolean;
  onStart: () => void;
  onContinue: () => void;
  onDaily: () => void;
  onReview: () => void;
  onSettings: () => void;
}

const FLOATERS = ["ㅏ", "ㅓ", "안", "녕", "가", "한", "글"];

// HD-2D fantasy road at sunrise with floating Hangul and Bori by a lantern.
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

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* sunrise sky + far village */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,#1c2a4c 0%,#3e5688 28%,#a9785a 60%,#e9b87a 82%,#f6d89a 100%)" }}
      />
      <div
        className="absolute"
        style={{
          left: "52%",
          top: "26%",
          width: 150,
          height: 150,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle,#fff3d6,#ffd98a 52%,transparent 74%)",
          boxShadow: "0 0 130px 56px rgba(255,210,140,0.4)",
        }}
      />
      {/* distant village silhouette */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "26%",
          height: "16%",
          background:
            "radial-gradient(ellipse 8% 100% at 20% 100%,#2a3450 0,transparent 70%),radial-gradient(ellipse 10% 100% at 40% 100%,#2a3450 0,transparent 70%),radial-gradient(ellipse 9% 100% at 64% 100%,#2a3450 0,transparent 70%),radial-gradient(ellipse 8% 100% at 80% 100%,#2a3450 0,transparent 70%)",
          opacity: 0.6,
        }}
      />
      {/* road */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ height: "26%", background: "linear-gradient(180deg,#6a5840,#3a2e22)" }}
      />
      <div
        className="absolute"
        style={{
          left: "50%",
          bottom: 0,
          width: "30%",
          height: "26%",
          transform: "translateX(-50%)",
          background: "linear-gradient(180deg,rgba(255,220,150,0.12),transparent)",
          clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)",
        }}
      />

      {/* floating glowing Hangul */}
      {FLOATERS.map((c, i) => (
        <div
          key={i}
          className="coer-bob absolute"
          style={{
            left: `${8 + i * 12}%`,
            top: `${16 + ((i * 27) % 30)}%`,
            fontSize: 26 + (i % 3) * 12,
            color: "#ffe9a8",
            textShadow: "0 0 18px rgba(255,220,140,0.9)",
            opacity: 0.85,
            animationDelay: `${i * 0.35}s`,
          }}
        >
          {c}
        </div>
      ))}

      {/* Bori + lantern bottom-left */}
      <div className="absolute" style={{ left: "10%", bottom: "22%" }}>
        <Sprite kind="lantern" size={64} />
      </div>
      <div className="absolute coer-bob" style={{ left: "16%", bottom: "23%" }}>
        <Sprite kind="bori" size={70} />
      </div>

      {/* vignette + grade */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%,transparent 45%,rgba(0,0,0,0.55))" }} />

      {/* title + menu */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
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
