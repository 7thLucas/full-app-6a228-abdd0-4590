import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

// ───────────────────────────────────────────────────────────────────────────
// PixelFrame — shared fantasy JRPG panel: dark-navy translucent fill, a crisp
// double gold pixel border, and small gold corner ornaments. Used by all the
// pixel UI components (dialogue, lesson, battle, command buttons, widgets).
// ───────────────────────────────────────────────────────────────────────────

interface PixelFrameProps {
  children: ReactNode;
  className?: string;
  /** parchment inner card variant (warmer fill). */
  parchment?: boolean;
}

export function PixelFrame({ children, className, parchment }: PixelFrameProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{
        background: parchment
          ? "linear-gradient(160deg, rgba(54,46,32,0.96), rgba(34,28,18,0.97))"
          : "linear-gradient(160deg, rgba(19,26,49,0.96), rgba(8,12,26,0.97))",
        border: "2px solid #d8b25a",
        boxShadow:
          "0 0 0 2px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(216,178,90,0.25), 0 0 26px rgba(0,0,0,0.6), 0 0 30px rgba(216,178,90,0.1)",
        imageRendering: "pixelated",
      }}
    >
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />
      {children}
    </div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: 8,
    height: 8,
    background: "#e9cf86",
    boxShadow: "0 0 4px rgba(233,207,134,0.8)",
  };
  const offsets: Record<typeof pos, React.CSSProperties> = {
    tl: { top: -3, left: -3 },
    tr: { top: -3, right: -3 },
    bl: { bottom: -3, left: -3 },
    br: { bottom: -3, right: -3 },
  } as const;
  return <span style={{ ...base, ...offsets[pos] }} />;
}
