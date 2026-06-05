import { LESSONS, CHAPTERS, type LessonNode } from "../data/learningData";
import { useGame } from "../engine/store";
import { Heading } from "../ui/primitives";
import { sfx } from "../engine/sfx";

interface LearningMapProps {
  onPickLesson: (lesson: LessonNode) => void;
  onClose: () => void;
}

// Node positions along a winding fantasy path (percent of the frame).
const NODE_POS = [
  { x: 12, y: 70 },
  { x: 24, y: 52 },
  { x: 35, y: 68 },
  { x: 47, y: 48 },
  { x: 58, y: 66 },
  { x: 68, y: 46 },
  { x: 79, y: 62 },
  { x: 90, y: 40 },
];

// Stubbed future chapters as dimmed nodes.
const FUTURE = [
  { label: "Market of Words", x: 50, y: 22 },
  { label: "Verb Forest", x: 70, y: 18 },
  { label: "Sentence Gate", x: 88, y: 16 },
];

export function LearningMap({ onPickLesson, onClose }: LearningMapProps) {
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
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 40% 30%,#1c2a4c 0%,#0e1730 60%,#070c1c 100%)" }}
      />
      {/* parchment grain */}
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: "repeating-linear-gradient(45deg,rgba(216,178,90,0.06) 0 2px,transparent 2px 24px)" }}
      />

      {/* connecting path */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} preserveAspectRatio="none">
        {NODE_POS.slice(0, -1).map((p, i) => {
          const n = NODE_POS[i + 1];
          const unlocked = isUnlocked(i + 1) || done(LESSONS[i].id);
          return (
            <line
              key={i}
              x1={`${p.x}%`}
              y1={`${p.y}%`}
              x2={`${n.x}%`}
              y2={`${n.y}%`}
              stroke={unlocked ? "rgba(233,207,134,0.6)" : "rgba(120,120,140,0.25)"}
              strokeWidth={3}
              strokeDasharray="2 6"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <div className="absolute top-4 left-0 right-0 text-center z-10">
        <Heading className="text-2xl">Learning Path</Heading>
        <p className="text-sm text-[#bfb59c]">
          {CHAPTERS[0].title} · {CHAPTERS[1].title}
        </p>
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
            onClick={() => {
              if (!unlocked) return;
              sfx("select");
              onPickLesson(l);
            }}
            className="absolute z-10 group"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%,-50%)" }}
          >
            <div
              className={`flex items-center justify-center rounded-full border-2 transition-all ${
                isBoss ? "w-16 h-16" : "w-12 h-12"
              } ${
                complete
                  ? "border-emerald-400 bg-emerald-900/40 shadow-[0_0_18px_rgba(110,231,183,0.5)]"
                  : unlocked
                  ? "border-[#e9cf86] bg-[rgba(25,32,58,0.9)] shadow-[0_0_18px_rgba(216,178,90,0.4)] group-hover:scale-110"
                  : "border-[rgba(120,120,140,0.4)] bg-black/40 opacity-50"
              }`}
            >
              <span className={`${isBoss ? "text-2xl" : "text-lg"}`}>
                {complete ? "✓" : isBoss ? "👁" : unlocked ? i + 1 : "🔒"}
              </span>
            </div>
            <div
              className={`mt-1 text-[11px] max-w-[110px] mx-auto leading-tight ${
                unlocked ? "text-[#ece6d6]" : "text-[#777]"
              }`}
            >
              {l.title}
            </div>
          </button>
        );
      })}

      {/* future stub nodes */}
      {FUTURE.map((f, i) => (
        <div
          key={i}
          className="absolute z-10 opacity-40"
          style={{ left: `${f.x}%`, top: `${f.y}%`, transform: "translate(-50%,-50%)" }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-[rgba(120,120,140,0.4)] bg-black/40 flex items-center justify-center text-sm">
            🔒
          </div>
          <div className="mt-1 text-[10px] text-[#888] max-w-[100px] text-center leading-tight">{f.label}</div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          sfx("select");
          onClose();
        }}
        className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded border border-[rgba(216,178,90,0.5)] text-[#e9cf86] text-sm hover:border-[#e9cf86]"
      >
        ✕ Close
      </button>
    </div>
  );
}
