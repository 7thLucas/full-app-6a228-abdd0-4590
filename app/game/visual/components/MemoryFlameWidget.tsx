// ───────────────────────────────────────────────────────────────────────────
// Component 13 of 15 — MemoryFlameWidget
// The daily streak as a pixel shrine-bowl flame, plus the current week as a row
// of stone tablets: glowing = practiced, cracked = missed, current day pulses.
// ───────────────────────────────────────────────────────────────────────────

interface MemoryFlameWidgetProps {
  streak: number;
  weekDays: boolean[]; // 7 booleans Mon..Sun
  compact?: boolean;
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function currentWeekday(): number {
  const d = new Date().getDay(); // Sun=0..Sat=6
  return (d + 6) % 7; // Mon=0..Sun=6
}

export function MemoryFlameWidget({ streak, weekDays, compact }: MemoryFlameWidgetProps) {
  const today = currentWeekday();

  return (
    <div className="flex items-center gap-3">
      {/* shrine bowl + flame */}
      <div style={{ position: "relative", width: compact ? 30 : 44, height: compact ? 40 : 56 }}>
        {/* flame */}
        <div
          className="coer-flicker"
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: "translateX(-50%)",
            width: compact ? 16 : 22,
            height: compact ? 22 : 30,
            clipPath: "polygon(50% 0, 78% 40%, 70% 100%, 30% 100%, 22% 40%)",
            background: streak > 0 ? "linear-gradient(180deg,#fff3c4,#ff8a2a)" : "#3a3340",
            boxShadow: streak > 0 ? "0 0 16px rgba(255,160,70,0.85)" : undefined,
          }}
        />
        {/* inner blue core */}
        {streak > 0 && (
          <div
            className="coer-flicker"
            style={{
              position: "absolute",
              left: "50%",
              top: compact ? 8 : 12,
              transform: "translateX(-50%)",
              width: compact ? 6 : 8,
              height: compact ? 10 : 14,
              clipPath: "polygon(50% 0, 78% 40%, 70% 100%, 30% 100%, 22% 40%)",
              background: "#9fdcff",
            }}
          />
        )}
        {/* stone bowl */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: compact ? 28 : 40,
            height: compact ? 14 : 20,
            background: "linear-gradient(180deg,#6a7382,#3a4250)",
            clipPath: "polygon(8% 0, 92% 0, 78% 100%, 22% 100%)",
            border: "2px solid #2a3038",
          }}
        />
      </div>

      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="coer-heading" style={{ fontSize: compact ? 18 : 22 }}>{streak}</span>
          <span className="text-[11px] text-[#bfb59c]">day streak</span>
        </div>
        {/* week tablets */}
        <div className="flex gap-1 mt-1">
          {DAY_LABELS.map((d, i) => {
            const done = weekDays[i];
            const isToday = i === today;
            const past = i < today;
            const cracked = past && !done;
            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={isToday ? "coer-flicker" : undefined}
                  style={{
                    width: compact ? 10 : 14,
                    height: compact ? 12 : 16,
                    background: done
                      ? "linear-gradient(180deg,#ffe9a8,#caa24e)"
                      : cracked
                      ? "#2a2028"
                      : "#3a4250",
                    border: `1px solid ${isToday ? "#e9cf86" : "#2a3038"}`,
                    boxShadow: done ? "0 0 8px rgba(255,210,140,0.6)" : undefined,
                    clipPath: cracked
                      ? "polygon(0 0,100% 0,100% 40%,60% 55%,100% 70%,100% 100%,0 100%)"
                      : undefined,
                  }}
                />
                <span className="text-[8px] text-[#8a8270] mt-0.5">{d}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
