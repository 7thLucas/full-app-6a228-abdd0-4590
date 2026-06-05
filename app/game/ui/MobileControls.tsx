import { useEffect } from "react";

// On-screen controls for touch devices. Synthesizes keyboard events so the same
// input pipeline (useInput) handles them — no special-casing in the game loop.
function press(key: string, type: "keydown" | "keyup") {
  window.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true }));
}

function HoldButton({
  k,
  label,
  className,
}: {
  k: string;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        press(k, "keydown");
      }}
      onPointerUp={() => press(k, "keyup")}
      onPointerLeave={() => press(k, "keyup")}
      onPointerCancel={() => press(k, "keyup")}
      className={className}
      style={{
        userSelect: "none",
        touchAction: "none",
        width: 52,
        height: 52,
        borderRadius: 10,
        border: "1px solid rgba(216,178,90,0.5)",
        background: "linear-gradient(180deg, rgba(25,32,58,0.85), rgba(10,15,30,0.9))",
        color: "#e9cf86",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label}
    </button>
  );
}

function TapButton({ k, label }: { k: string; label: string }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        press(k, "keydown");
        setTimeout(() => press(k, "keyup"), 40);
      }}
      style={{
        userSelect: "none",
        touchAction: "none",
        minWidth: 58,
        height: 44,
        padding: "0 10px",
        borderRadius: 10,
        border: "1px solid rgba(216,178,90,0.5)",
        background: "linear-gradient(180deg, rgba(25,32,58,0.85), rgba(10,15,30,0.9))",
        color: "#e9cf86",
        fontSize: 13,
        fontFamily: "'Cinzel', serif",
      }}
    >
      {label}
    </button>
  );
}

export function MobileControls() {
  // release all on unmount to avoid stuck keys
  useEffect(() => {
    return () => {
      ["w", "a", "s", "d", "Shift"].forEach((k) => press(k, "keyup"));
    };
  }, []);

  return (
    <div
      className="sm:hidden"
      style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none" }}
    >
      {/* D-pad */}
      <div
        style={{
          position: "absolute",
          left: 14,
          bottom: 18,
          display: "grid",
          gridTemplateColumns: "repeat(3, 52px)",
          gridTemplateRows: "repeat(3, 52px)",
          gap: 4,
          pointerEvents: "auto",
        }}
      >
        <span />
        <HoldButton k="w" label="▲" />
        <span />
        <HoldButton k="a" label="◀" />
        <span />
        <HoldButton k="d" label="▶" />
        <span />
        <HoldButton k="s" label="▼" />
        <span />
      </div>

      {/* action cluster */}
      <div
        style={{
          position: "absolute",
          right: 14,
          bottom: 18,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "flex-end",
          pointerEvents: "auto",
        }}
      >
        <div className="flex gap-2">
          <TapButton k=" " label="Talk" />
          <TapButton k="e" label="Act" />
        </div>
        <div className="flex gap-2">
          <TapButton k="Escape" label="Menu" />
          <HoldButton k="Shift" label="⚡" />
        </div>
      </div>
    </div>
  );
}
