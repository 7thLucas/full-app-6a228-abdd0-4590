import { LESSONS, CHAPTERS, type LessonNode } from "../../data/learningData";
import { useGame } from "../../engine/store";
import { sfx } from "../../engine/sfx";
import { MemoryFlameWidget } from "./MemoryFlameWidget";
import { CinematicLightOverlay } from "./CinematicLightOverlay";
import { AtmosphereLayer } from "./AtmosphereLayer";

// ───────────────────────────────────────────────────────────────────────────
// Component 14 of 15 — PixelWorldMap
// The learning path as a pixel world map: connected glowing nodes along a
// winding road, completed = gold, current = pulsing, locked = dark/fogged.
// Memory Flame streak shown at the top. Same unlock logic as before.
// ───────────────────────────────────────────────────────────────────────────

interface PixelWorldMapProps {
  onPickLesson: (lesson: LessonNode) => void;
  onClose: () => void;
}

const NODE_POS = [
  { x: 12, y: 72 },
  { x: 24, y: 54 },
  { x: 35, y: 70 },
  { x: 47, y: 50 },
  { x: 58, y: 68 },
  { x: 68, y: 48 },
  { x: 79, y: 64 },
  { x: 90, y: 42 },
];

const FUTURE = [
  { label: "Market of Words", x: 50, y: 22 },
  { label: "Verb Forest", x: 70, y: 18 },
  { label: "Sentence Gate", x: 88, y: 14 },
];

export function PixelWorldMap({ onPickLesson, onClose }: PixelWorldMapProps) {
  const game = useGame();
  const { progress } = game;

  function isUnlocked(index: number): boolean {
    if (index === 0) return true;
    const prev = LESSONS[index - 1];
    return progress.completedLessons.includes(prev.id);
  }
  function done(id: string) {
    return progress.completedLessons.includes(id);
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* pixel-styled night sky base */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#16213f 0%,#0e1730 55%,#070c1c 100%)" }} />
      <AtmosphereLayer theme="shrine" zIndex={2} />

      {/* connecting road (dashed gold pixels) */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 3 }} preserveAspectRatio="none">
        {NODE_POS.slice(0, -1).map((p, i) => {
          const n = NODE_POS[i + 1];
          const unlocked = isUnlocked(i + 1) || done(LESSONS[i].id);
          return (
            <line
              key={i}
              x1={`${p.x}%`} y1={`${p.y}%`} x2={`${n.x}%`} y2={`${n.y}%`}
              stroke={unlocked ? "rgba(233,207,134,0.7)" : "rgba(120,120,140,0.25)"}
              strokeWidth={4}
              strokeDasharray="3 7"
              strokeLinecap="butt"
            />
          );
        })}
      </svg>

      {/* header: title + memory flame */}
      <div className="absolute top-4 left-0 right-0 z-10 flex items-start justify-between px-5">
        <div className="px-3 py-2" style={{ background: "linear-gradient(160deg,rgba(19,26,49,0.9),rgba(8,12,26,0.95))", border: "2px solid #d8b25a" }}>
          <MemoryFlameWidget streak={progress.streak} weekDays={progress.weekDays} compact />
        </div>
        <div className="text-center">
          <h2 className="coer-heading text-2xl">Learning Path</h2>
          <p className="text-sm text-[#bfb59c]">{CHAPTERS[0].title} · {CHAPTERS[1].title}</p>
        </div>
        <button
          type="button"
          onClick={() => { sfx("select"); onClose(); }}
          className="px-3 py-1.5 border-2 border-[rgba(216,178,90,0.5)] text-[#e9cf86] text-sm hover:border-[#e9cf86]"
        >
          ✕ Close
        </button>
      </div>

      {/* lesson nodes */}
      {LESSONS.map((l, i) => {
        const pos = NODE_POS[i];
        const unlocked = isUnlocked(i);
        const complete = done(l.id);
        const isBoss = l.kind === "boss";
        return (
          <button
            key={l.id}
            type="button"
            disabled={!unlocked}
            onClick={() => { if (!unlocked) return; sfx("select"); onPickLesson(l); }}
            className="absolute z-10 group"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%,-50%)" }}
          >
            <div
              className={`flex items-center justify-center transition-all ${isBoss ? "w-16 h-16" : "w-12 h-12"} ${
                complete
                  ? "shadow-[0_0_18px_rgba(255,210,140,0.6)]"
                  : unlocked
                  ? "shadow-[0_0_18px_rgba(216,178,90,0.45)] group-hover:scale-110 coer-flicker"
                  : "opacity-50"
              }`}
              style={{
                border: "3px solid",
                borderColor: complete ? "#e9cf86" : unlocked ? "#e9cf86" : "rgba(120,120,140,0.4)",
                background: complete
                  ? "linear-gradient(180deg,#caa24e,#7a5a2a)"
                  : unlocked
                  ? "linear-gradient(180deg,rgba(25,32,58,0.95),rgba(10,15,30,0.97))"
                  : "rgba(8,8,14,0.7)",
                imageRendering: "pixelated",
              }}
            >
              <span className={`${isBoss ? "text-2xl" : "text-lg"} ${complete ? "text-[#1a1426]" : unlocked ? "text-[#e9cf86]" : "text-[#777]"}`}>
                {complete ? "★" : isBoss ? "✦" : unlocked ? i + 1 : "✕"}
              </span>
            </div>
            <div className={`mt-1 text-[11px] max-w-[110px] mx-auto leading-tight ${unlocked ? "text-[#ece6d6]" : "text-[#777]"}`}>
              {l.title}
            </div>
          </button>
        );
      })}

      {/* future stub nodes (fogged) */}
      {FUTURE.map((f, i) => (
        <div key={i} className="absolute z-10 opacity-40" style={{ left: `${f.x}%`, top: `${f.y}%`, transform: "translate(-50%,-50%)" }}>
          <div className="w-10 h-10 flex items-center justify-center text-sm text-[#888]" style={{ border: "3px solid rgba(120,120,140,0.4)", background: "rgba(8,8,14,0.7)" }}>
            ✕
          </div>
          <div className="mt-1 text-[10px] text-[#888] max-w-[100px] text-center leading-tight">{f.label}</div>
        </div>
      ))}

      <CinematicLightOverlay theme="gate" zIndex={20} />
    </div>
  );
}
