import { useMemo } from "react";
import type { MapDef } from "../data/types";

// Renders the tile floor/walls for a map as a single styled grid. Themed per area
// to evoke chapel candlelight, snow, cobblestone town, or icy shrine.
export function WorldTiles({ map }: { map: MapDef }) {
  const ts = map.tileSize;

  const palette = useMemo(() => themePalette(map.theme), [map.theme]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: map.width * ts,
        height: map.height * ts,
      }}
    >
      {/* base floor */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: palette.floor,
        }}
      />
      {/* tiles */}
      {map.collision.map((row, y) =>
        row.map((cell, x) => {
          const blocked = cell === 1;
          return (
            <div
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: x * ts,
                top: y * ts,
                width: ts,
                height: ts,
                boxSizing: "border-box",
                borderRight: `1px solid ${palette.grid}`,
                borderBottom: `1px solid ${palette.grid}`,
                background: blocked ? palette.wall : "transparent",
                boxShadow: blocked
                  ? `inset 0 -4px 6px rgba(0,0,0,0.5), inset 0 2px 2px ${palette.wallTop}`
                  : undefined,
              }}
            />
          );
        }),
      )}
      {/* soft lighting overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: palette.overlay,
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}

function themePalette(theme: MapDef["theme"]) {
  switch (theme) {
    case "chapel":
      return {
        floor: "radial-gradient(ellipse at 50% 40%, #2a2218 0%, #1a140d 70%, #100b07 100%)",
        wall: "linear-gradient(180deg, #3a2f22, #241c14)",
        wallTop: "rgba(120,90,50,0.4)",
        grid: "rgba(80,60,35,0.25)",
        overlay: "radial-gradient(circle at 50% 30%, rgba(240,190,110,0.18), transparent 60%)",
      };
    case "snow":
      return {
        floor: "radial-gradient(ellipse at 50% 30%, #cdd9e6 0%, #aebccd 60%, #8fa1b8 100%)",
        wall: "linear-gradient(180deg, #5f7186, #45556a)",
        wallTop: "rgba(230,240,250,0.6)",
        grid: "rgba(120,140,165,0.3)",
        overlay: "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.15), transparent 65%)",
      };
    case "town":
      return {
        floor: "radial-gradient(ellipse at 50% 40%, #3a3a44 0%, #2a2a33 60%, #1d1d25 100%)",
        wall: "linear-gradient(180deg, #4a4a55, #33333d)",
        wallTop: "rgba(160,160,175,0.4)",
        grid: "rgba(90,90,105,0.3)",
        overlay: "radial-gradient(circle at 50% 50%, rgba(220,200,150,0.1), transparent 60%)",
      };
    case "shrine":
    default:
      return {
        floor: "radial-gradient(ellipse at 50% 30%, #1d3148 0%, #142336 60%, #0c1526 100%)",
        wall: "linear-gradient(180deg, #2c4663, #1c2f45)",
        wallTop: "rgba(120,170,210,0.4)",
        grid: "rgba(70,110,150,0.3)",
        overlay: "radial-gradient(circle at 50% 30%, rgba(130,190,235,0.16), transparent 60%)",
      };
  }
}
