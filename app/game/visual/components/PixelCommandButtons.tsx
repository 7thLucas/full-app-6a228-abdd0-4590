import { cn } from "~/lib/utils";

// ───────────────────────────────────────────────────────────────────────────
// Component 10 of 15 — PixelCommandButtons
// Fantasy answer/command buttons for battle and lessons: gold pixel trim, navy
// fill, hover glow, and reveal states (correct = gold glow, wrong = red shake).
// ───────────────────────────────────────────────────────────────────────────

export type CommandState = "idle" | "correct" | "wrong" | "dim";

export interface CommandOption {
  label: string;
  state?: CommandState;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
}

interface PixelCommandButtonsProps {
  options: CommandOption[];
  columns?: 2 | 3;
  big?: boolean;
}

export function PixelCommandButtons({ options, columns = 2, big }: PixelCommandButtonsProps) {
  return (
    <div className={cn("grid gap-2", columns === 3 ? "grid-cols-3" : "grid-cols-2")}>
      {options.map((o, i) => (
        <PixelCommandButton key={`${o.label}-${i}`} {...o} big={big} />
      ))}
    </div>
  );
}

export function PixelCommandButton({
  label,
  state = "idle",
  disabled,
  onClick,
  title,
  big,
}: CommandOption & { big?: boolean }) {
  const stateClass =
    state === "correct"
      ? "border-emerald-300 text-emerald-100 shadow-[0_0_20px_rgba(110,231,183,0.55)] bg-emerald-900/25"
      : state === "wrong"
      ? "border-rose-400 text-rose-200 bg-rose-900/20 coer-shake"
      : state === "dim"
      ? "border-[rgba(216,178,90,0.2)] opacity-45"
      : "border-[rgba(216,178,90,0.55)] hover:border-[#e9cf86] hover:text-[#e9cf86] hover:shadow-[0_0_16px_rgba(216,178,90,0.3)]";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={cn(
        "relative rounded-none border-2 text-[#ece6d6] transition-all duration-150",
        "bg-gradient-to-b from-[rgba(25,32,58,0.95)] to-[rgba(10,15,30,0.97)]",
        big ? "px-3 py-3 text-lg" : "px-3 py-2.5 text-[15px]",
        "disabled:cursor-not-allowed",
        stateClass,
      )}
      style={{ imageRendering: "pixelated" }}
    >
      {/* inner pixel border accent */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[2px] border"
        style={{ borderColor: "rgba(216,178,90,0.18)" }}
      />
      <span className="relative">{label}</span>
    </button>
  );
}
