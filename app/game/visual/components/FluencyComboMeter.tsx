// ───────────────────────────────────────────────────────────────────────────
// Component 12 of 15 — FluencyComboMeter
// Combo meter shown during battle: a chain of pixel flame/letter links that
// light up as the player chains correct answers.
//   combo 1 = x1.0 · 2 = +20% · 3 = +40% · 4 = +70% · 5 = +100% (special)
// ───────────────────────────────────────────────────────────────────────────

const MULT = [1, 1.2, 1.4, 1.7, 2.0];

interface FluencyComboMeterProps {
  combo: number; // current consecutive-correct count
}

export function FluencyComboMeter({ combo }: FluencyComboMeterProps) {
  if (combo < 2) return null;
  const tier = Math.min(combo, 5);
  const bonusPct = Math.round((MULT[Math.min(combo, MULT.length - 1)] - 1) * 100);
  const special = combo >= 5;

  return (
    <div
      className="absolute top-3 left-3 z-30 px-3 py-2"
      style={{
        background: "linear-gradient(160deg, rgba(19,26,49,0.96), rgba(8,12,26,0.97))",
        border: `2px solid ${special ? "#ff9a4a" : "#d8b25a"}`,
        boxShadow: special ? "0 0 24px rgba(255,150,70,0.5)" : "0 0 16px rgba(0,0,0,0.5)",
        imageRendering: "pixelated",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="coer-heading text-sm" style={{ color: special ? "#ffce8a" : undefined }}>
          Fluency Combo x{combo}
        </span>
        <span className="text-[11px] text-[#bfb59c]">+{bonusPct}% dmg</span>
      </div>
      {/* pixel flame chain */}
      <div className="mt-1.5 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const lit = i < tier;
          return (
            <span
              key={i}
              className={lit ? "coer-flicker" : undefined}
              style={{
                width: 12,
                height: 16,
                clipPath: "polygon(50% 0, 80% 45%, 70% 100%, 30% 100%, 20% 45%)",
                background: lit
                  ? special
                    ? "linear-gradient(180deg,#fff3c4,#ff7a2a)"
                    : "linear-gradient(180deg,#ffe9a8,#e07a3c)"
                  : "#2a2436",
                boxShadow: lit ? "0 0 8px rgba(255,160,80,0.8)" : undefined,
              }}
            />
          );
        })}
      </div>
      {special && (
        <div className="mt-1 text-[10px] text-[#ffce8a] coer-flicker tracking-wide">SPECIAL · DOUBLE DAMAGE</div>
      )}
    </div>
  );
}
