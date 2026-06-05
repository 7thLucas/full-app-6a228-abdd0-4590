import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export function Panel({
  children,
  className,
  frame = true,
}: {
  children: ReactNode;
  className?: string;
  frame?: boolean;
}) {
  return (
    <div className={cn("coer-panel", frame && "coer-panel-frame", className)}>
      {children}
    </div>
  );
}

export function Heading({
  children,
  className,
  as: As = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return <As className={cn("coer-heading", className)}>{children}</As>;
}

export function GoldButton({
  children,
  onClick,
  disabled,
  active,
  className,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "px-4 py-2 rounded border text-sm transition-all duration-150",
        "border-[rgba(216,178,90,0.5)] text-[#ece6d6]",
        "bg-gradient-to-b from-[rgba(25,32,58,0.9)] to-[rgba(10,15,30,0.95)]",
        "hover:border-[#e9cf86] hover:text-[#e9cf86] hover:shadow-[0_0_16px_rgba(216,178,90,0.25)]",
        "disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-[rgba(216,178,90,0.5)] disabled:hover:text-[#ece6d6]",
        active && "border-[#e9cf86] text-[#e9cf86] shadow-[0_0_16px_rgba(216,178,90,0.35)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function StatBar({
  value,
  max,
  color,
  label,
  compact,
}: {
  value: number;
  max: number;
  color: "hp" | "sp";
  label?: string;
  compact?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  const fill =
    color === "hp"
      ? "linear-gradient(90deg, #8a2f2f, #d24a4a)"
      : "linear-gradient(90deg, #2f5a8a, #4a8fd2)";
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-[10px] uppercase tracking-wider text-[#bfb59c] mb-0.5">
          <span>{label}</span>
          <span>
            {Math.max(0, Math.round(value))}/{max}
          </span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden border border-black/60"
        style={{ height: compact ? 6 : 10, background: "rgba(0,0,0,0.5)" }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: fill,
            transition: "width 0.45s cubic-bezier(0.22,1,0.36,1)",
            boxShadow: "0 0 8px rgba(0,0,0,0.4) inset",
          }}
        />
      </div>
    </div>
  );
}

export function KeyHint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#bfb59c]">
      <kbd className="px-1.5 py-0.5 rounded border border-[rgba(216,178,90,0.4)] bg-black/40 text-[#e9cf86] font-mono text-[10px]">
        {keys}
      </kbd>
      {label}
    </span>
  );
}
