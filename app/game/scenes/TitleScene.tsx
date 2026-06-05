import { useEffect, useMemo, useState } from "react";
import { useConfigurables } from "~/modules/configurables";
import { useGame } from "../engine/store";
import { hasSave } from "../engine/state";
import { Heading, GoldButton } from "../ui/primitives";
import { sfx } from "../engine/sfx";

// Animated misty crossroads at dawn: a campfire glow and eight faint branching
// roads radiating outward beneath the title.
export function TitleScene({
  onNewGame,
  onContinue,
  onSettings,
  onCredits,
}: {
  onNewGame: () => void;
  onContinue: () => void;
  onSettings: () => void;
  onCredits: () => void;
}) {
  const { config } = useConfigurables();
  void useGame();
  const [saveExists, setSaveExists] = useState(false);

  useEffect(() => {
    setSaveExists(hasSave());
  }, []);

  const roads = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => {
        const angle = -90 + (i / 7) * 170; // fan across the top half-ish
        return { angle, delay: i * 0.4 };
      }),
    [],
  );

  const items = [
    { label: config.newGameLabel || "New Game", action: onNewGame, disabled: false },
    {
      label: config.continueLabel || "Continue",
      action: onContinue,
      disabled: !saveExists,
    },
    { label: config.settingsLabel || "Settings", action: onSettings, disabled: false },
    { label: config.creditsLabel || "Credits", action: onCredits, disabled: false },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* dawn sky */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #1a2238 0%, #2c2a44 35%, #46364a 65%, #5a3a3a 100%)",
        }}
      />
      {/* mist bands */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "-20%",
            right: "-20%",
            bottom: `${10 + i * 16}%`,
            height: 90,
            background: "radial-gradient(ellipse at center, rgba(180,190,210,0.18), transparent 70%)",
            animation: `coer-float-up ${12 + i * 4}s ease-in-out ${i}s infinite alternate`,
          }}
        />
      ))}

      {/* eight faint roads from the crossroads */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "18%",
          width: 0,
          height: 0,
        }}
      >
        {roads.map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: 2,
              height: 420,
              transformOrigin: "bottom center",
              transform: `rotate(${r.angle}deg)`,
              background:
                "linear-gradient(to top, rgba(216,178,90,0.5), transparent 80%)",
              animation: `coer-road-pulse ${4 + (i % 3)}s ease-in-out ${r.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* campfire */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "16%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          className="coer-flicker"
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,200,110,0.9), rgba(224,122,60,0.4) 50%, transparent 75%)",
            filter: "blur(2px)",
          }}
        />
        <div
          className="coer-flicker"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,180,90,0.25), transparent 70%)",
          }}
        />
      </div>

      {/* embers */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${48 + Math.random() * 6}%`,
            bottom: "18%",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(255,180,90,0.9)",
            boxShadow: "0 0 6px rgba(255,180,90,0.9)",
            animation: `coer-ember-rise ${3 + Math.random() * 4}s linear ${Math.random() * 4}s infinite`,
          }}
        />
      ))}

      <div className="coer-vignette" style={{ position: "absolute", inset: 0 }} />

      {/* Title + menu */}
      <div
        style={{ position: "absolute", inset: 0, zIndex: 40 }}
        className="flex flex-col items-center justify-center text-center px-6"
      >
        {config.logoUrl && !config.logoUrl.startsWith("FILL_") && (
         
          <img
            src={config.logoUrl}
            alt=""
            style={{ width: 92, height: 92, objectFit: "contain", marginBottom: 8 }}
            className="coer-bloom"
          />
        )}
        <Heading as="h1" className="text-4xl sm:text-5xl mb-1 coer-fade-in">
          {config.gameTitle || "Chronicles of the Eight Roads"}
        </Heading>
        {config.gameSubtitle && (
          <p className="text-sm tracking-[0.3em] uppercase text-[#bfb59c] mb-2">
            {config.gameSubtitle}
          </p>
        )}
        {config.tagline && (
          <p className="text-[#cdbf9a] italic text-sm mb-8 max-w-md">"{config.tagline}"</p>
        )}

        <nav className="flex flex-col items-center gap-3">
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              disabled={it.disabled}
              data-active={false}
              onMouseEnter={() => !it.disabled && sfx("advance")}
              onClick={() => {
                if (it.disabled) return;
                sfx("select");
                it.action();
              }}
              className="coer-menu-item text-lg disabled:opacity-30 disabled:cursor-not-allowed text-[#ece6d6]"
            >
              {it.label}
            </button>
          ))}
        </nav>

        {!saveExists && (
          <p className="mt-6 text-[11px] text-[#7c745f]">No journey saved yet.</p>
        )}
      </div>
    </div>
  );
}
