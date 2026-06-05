import { memo } from "react";
import type { MapDef } from "../data/types";

// ───────────────────────────────────────────────────────────────────────────
// Diorama: the 5-layer HD-2D side-view environment for an area.
//   1. Far background  (sky, moon, mountains, distant city) — slow parallax
//   2. Background architecture (walls, pillars, windows, light sources)
//   3. (midground actors are drawn by ExploreScene, not here)
//   4. Foreground (blurred framing objects) — fast parallax
//   5. Lighting / atmosphere overlays (god rays, fog band, vignette grade)
//
// All layers are absolutely-positioned planes translated by the shared camera.
// Pure CSS/SVG — no external assets.
// ───────────────────────────────────────────────────────────────────────────

interface DioramaProps {
  map: MapDef;
  camX: number; // current camera x in stage px
  worldWidth: number;
  viewportW: number;
  viewportH: number;
  laneBottomFrac: number; // where the near edge of the floor sits
}

export const Diorama = memo(function Diorama({
  map,
  camX,
  worldWidth,
  viewportW,
  viewportH,
  laneBottomFrac,
}: DioramaProps) {
  switch (map.theme) {
    case "chapel":
      return <ChapelDiorama camX={camX} w={worldWidth} vw={viewportW} vh={viewportH} lane={laneBottomFrac} />;
    case "snow":
      return <SnowDiorama camX={camX} w={worldWidth} vw={viewportW} vh={viewportH} lane={laneBottomFrac} />;
    case "town":
      return <TownDiorama camX={camX} w={worldWidth} vw={viewportW} vh={viewportH} lane={laneBottomFrac} />;
    case "shrine":
    default:
      return <ShrineDiorama camX={camX} w={worldWidth} vw={viewportW} vh={viewportH} lane={laneBottomFrac} />;
  }
});

interface SubProps {
  camX: number;
  w: number;
  vw: number;
  vh: number;
  lane: number;
}

// Helper: a parallax plane. `factor` 0 = locked to camera (sky), 1 = world speed.
function Plane({
  factor,
  camX,
  children,
  zIndex,
  style,
}: {
  factor: number;
  camX: number;
  children?: React.ReactNode;
  zIndex: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate3d(${-camX * factor}px,0,0)`,
        willChange: "transform",
        zIndex,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── 1. ABANDONED CHAPEL ──────────────────────────────────────────────────────
function ChapelDiorama({ camX, w, vw, vh, lane }: SubProps) {
  const floorTop = `${lane * 100}%`;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* cold night sky seen through the broken back wall */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg,#0a1322 0%,#101b30 45%,#16120c 78%,#0d0a06 100%)",
        }}
      />
      {/* moon + cold light through gaps (slow parallax) */}
      <Plane factor={0.06} camX={camX} zIndex={1}>
        <div
          style={{
            position: "absolute",
            left: vw * 0.7,
            top: "8%",
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "radial-gradient(circle,#dfe9ff 0%,#aab9d8 55%,transparent 75%)",
            boxShadow: "0 0 80px 30px rgba(160,185,235,0.25)",
          }}
        />
        {/* distant frozen ridge */}
        <div
          style={{
            position: "absolute",
            bottom: `${(1 - lane) * 100 + 4}%`,
            left: -200,
            width: w + 400,
            height: "26%",
            background:
              "radial-gradient(ellipse 18% 100% at 15% 100%,#26344d 0,transparent 70%),radial-gradient(ellipse 22% 100% at 45% 100%,#2c3b54 0,transparent 72%),radial-gradient(ellipse 18% 100% at 78% 100%,#26344d 0,transparent 70%)",
            opacity: 0.7,
          }}
        />
      </Plane>

      {/* 2. Background architecture: chapel back wall, arches, stained glass */}
      <Plane factor={0.42} camX={camX} zIndex={2}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: w,
            height: floorTop,
            background:
              "linear-gradient(180deg,#241a12 0%,#2c2016 55%,#1b130c 100%)",
            boxShadow: "inset 0 -40px 80px rgba(0,0,0,0.6)",
          }}
        />
        {/* repeating gothic arches with cold gaps */}
        {Array.from({ length: Math.ceil(w / 320) }).map((_, i) => {
          const x = 120 + i * 320;
          return (
            <div key={i}>
              {/* arch pillar */}
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: "14%",
                  width: 34,
                  height: `${lane * 100 - 14}%`,
                  background: "linear-gradient(90deg,#1a130c,#3a2c1c,#1a130c)",
                  borderRadius: "4px 4px 0 0",
                }}
              />
              {/* arched window opening to the cold night */}
              <div
                style={{
                  position: "absolute",
                  left: x + 70,
                  top: "16%",
                  width: 150,
                  height: "34%",
                  borderRadius: "75px 75px 8px 8px",
                  background:
                    i % 3 === 1
                      ? "linear-gradient(180deg,rgba(120,150,210,0.5),rgba(40,60,110,0.35))"
                      : "linear-gradient(180deg,#0c1526,#0a1018)",
                  boxShadow:
                    i % 3 === 1
                      ? "0 0 30px rgba(150,180,235,0.35), inset 0 0 22px rgba(120,160,220,0.3)"
                      : "inset 0 0 24px rgba(0,0,0,0.7)",
                  border: "2px solid rgba(58,44,28,0.9)",
                }}
              />
              {/* stained-glass tint on a few windows */}
              {i % 3 === 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: x + 78,
                    top: "18%",
                    width: 134,
                    height: "26%",
                    borderRadius: "67px 67px 4px 4px",
                    background:
                      "linear-gradient(180deg,rgba(216,120,90,0.4),rgba(120,80,170,0.35),rgba(90,140,200,0.3))",
                    mixBlendMode: "screen",
                    opacity: 0.8,
                  }}
                />
              )}
            </div>
          );
        })}
      </Plane>

      {/* warm candle glow pools along the wall */}
      <Plane factor={0.42} camX={camX} zIndex={3}>
        {Array.from({ length: Math.ceil(w / 320) }).map((_, i) => (
          <div
            key={i}
            className="coer-flicker"
            style={{
              position: "absolute",
              left: 150 + i * 320,
              top: `${lane * 100 - 18}%`,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(240,190,110,0.45),transparent 70%)",
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </Plane>

      {/* 3b. floor (stone path) */}
      <FloorPlane
        camX={camX}
        w={w}
        floorTop={floorTop}
        top="linear-gradient(180deg,#2c2317 0%,#1d160d 100%)"
        front="linear-gradient(180deg,#15100a,#0c0805)"
        seam="rgba(216,178,90,0.06)"
      />

      {/* 4. Foreground: blurred broken pews */}
      <Plane factor={1.35} camX={camX} zIndex={28} style={{ filter: "blur(2px)" }}>
        {Array.from({ length: Math.ceil(w / 520) }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 60 + i * 520,
              bottom: "2%",
              width: 180,
              height: 70,
              background: "linear-gradient(180deg,#241a10,#120c06)",
              borderRadius: 6,
              opacity: 0.85,
              boxShadow: "0 -6px 18px rgba(0,0,0,0.4)",
              transform: "skewX(-6deg)",
            }}
          />
        ))}
      </Plane>

      <LightingGrade tint="rgba(240,190,110,0.10)" topTint="rgba(120,150,210,0.12)" />
      <GodRays from="60%" color="rgba(180,205,255,0.10)" />
    </div>
  );
}

// ── 2. SNOWFIELD PATH ────────────────────────────────────────────────────────
function SnowDiorama({ camX, w, vw, vh, lane }: SubProps) {
  const floorTop = `${lane * 100}%`;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg,#1a2740 0%,#3a4f6e 38%,#6b88a8 70%,#9fb4cb 100%)",
        }}
      />
      {/* pale moon */}
      <Plane factor={0.04} camX={camX} zIndex={1}>
        <div
          style={{
            position: "absolute",
            left: vw * 0.6,
            top: "10%",
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "radial-gradient(circle,#eef4ff,#c4d2e6 60%,transparent 78%)",
            boxShadow: "0 0 60px 24px rgba(200,215,240,0.3)",
          }}
        />
      </Plane>
      {/* far mountains */}
      <Plane factor={0.12} camX={camX} zIndex={2}>
        <div
          style={{
            position: "absolute",
            bottom: `${(1 - lane) * 100 - 2}%`,
            left: -300,
            width: w + 600,
            height: "46%",
            background:
              "radial-gradient(ellipse 16% 100% at 12% 100%,#54688a 0,transparent 72%),radial-gradient(ellipse 20% 100% at 32% 100%,#47597a 0,transparent 73%),radial-gradient(ellipse 22% 100% at 58% 100%,#5a6f92 0,transparent 72%),radial-gradient(ellipse 18% 100% at 82% 100%,#48597b 0,transparent 73%)",
          }}
        />
        {/* snow caps */}
        <div
          style={{
            position: "absolute",
            bottom: `${(1 - lane) * 100 + 18}%`,
            left: -300,
            width: w + 600,
            height: "20%",
            background:
              "radial-gradient(ellipse 10% 100% at 12% 100%,rgba(235,243,255,0.7) 0,transparent 70%),radial-gradient(ellipse 12% 100% at 58% 100%,rgba(235,243,255,0.7) 0,transparent 70%)",
          }}
        />
      </Plane>
      {/* distant fortress silhouette */}
      <Plane factor={0.2} camX={camX} zIndex={3}>
        <div
          style={{
            position: "absolute",
            bottom: `${(1 - lane) * 100 + 1}%`,
            left: w * 0.62,
            width: 160,
            height: "22%",
            background: "linear-gradient(180deg,#2c3b54,#1d2940)",
            clipPath: "polygon(0 30%,12% 30%,12% 12%,20% 12%,20% 30%,40% 30%,40% 0,60% 0,60% 30%,80% 30%,80% 14%,88% 14%,88% 30%,100% 30%,100% 100%,0 100%)",
            opacity: 0.85,
          }}
        />
      </Plane>
      {/* pine silhouettes mid */}
      <Plane factor={0.5} camX={camX} zIndex={4}>
        {Array.from({ length: Math.ceil(w / 240) }).map((_, i) => {
          const h = 60 + ((i * 37) % 50);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 40 + i * 240 + ((i * 53) % 80),
                bottom: `${(1 - lane) * 100 - 1}%`,
                width: 0,
                height: 0,
                borderLeft: "20px solid transparent",
                borderRight: "20px solid transparent",
                borderBottom: `${h}px solid #1e2c40`,
                opacity: 0.82,
              }}
            />
          );
        })}
      </Plane>

      <FloorPlane
        camX={camX}
        w={w}
        floorTop={floorTop}
        top="linear-gradient(180deg,#e6eef8 0%,#cbd8e8 60%,#aebfd4 100%)"
        front="linear-gradient(180deg,#9fb2cb,#7d93b0)"
        seam="rgba(255,255,255,0.18)"
      />
      {/* trodden path stripe */}
      <Plane factor={1} camX={camX} zIndex={11}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: `${lane * 100 + 3}%`,
            width: w,
            height: "10%",
            background: "linear-gradient(180deg,rgba(150,170,195,0.5),transparent)",
            filter: "blur(3px)",
          }}
        />
      </Plane>

      {/* 4. foreground blurred snowbanks + branches */}
      <Plane factor={1.4} camX={camX} zIndex={28} style={{ filter: "blur(2.5px)" }}>
        {Array.from({ length: Math.ceil(w / 480) }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * 480 - 40,
              bottom: "-2%",
              width: 280,
              height: 90,
              borderRadius: "50% 50% 0 0",
              background: "linear-gradient(180deg,#f1f6ff,#cdd9ea)",
              opacity: 0.92,
            }}
          />
        ))}
      </Plane>

      <LightingGrade tint="rgba(150,180,220,0.12)" topTint="rgba(40,70,120,0.18)" />
    </div>
  );
}

// ── 3. VEYRHOLD OUTSKIRTS ────────────────────────────────────────────────────
function TownDiorama({ camX, w, vw, vh, lane }: SubProps) {
  const floorTop = `${lane * 100}%`;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg,#10182b 0%,#1b2740 45%,#33415c 80%,#475a78 100%)",
        }}
      />
      <Plane factor={0.05} camX={camX} zIndex={1}>
        <div
          style={{
            position: "absolute",
            left: vw * 0.2,
            top: "12%",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "radial-gradient(circle,#eef4ff,#c4d2e6 60%,transparent 78%)",
            boxShadow: "0 0 50px 18px rgba(200,215,240,0.25)",
          }}
        />
      </Plane>

      {/* 2. stacked wooden houses with warm windows (depth via 2 rows) */}
      <Plane factor={0.22} camX={camX} zIndex={2}>
        {Array.from({ length: Math.ceil(w / 200) }).map((_, i) => {
          const hh = 90 + ((i * 41) % 70);
          return (
            <div
              key={`b1-${i}`}
              style={{
                position: "absolute",
                left: i * 200 + ((i * 31) % 40),
                bottom: `${(1 - lane) * 100 + 4}%`,
                width: 150,
                height: hh,
                background: "linear-gradient(180deg,#3a3326,#241f17)",
                borderTop: "6px solid #4a4030",
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              {/* roof */}
              <div
                style={{
                  position: "absolute",
                  top: -22,
                  left: -10,
                  width: 170,
                  height: 26,
                  background: "linear-gradient(180deg,#e8eef7,#b9c6da)",
                  clipPath: "polygon(8% 100%,50% 0,92% 100%)",
                }}
              />
              {/* warm windows */}
              {[0, 1].map((wi) => (
                <div
                  key={wi}
                  className="coer-flicker"
                  style={{
                    position: "absolute",
                    left: 28 + wi * 64,
                    top: hh * 0.38,
                    width: 30,
                    height: 36,
                    background: "linear-gradient(180deg,#ffd98a,#e0992f)",
                    boxShadow: "0 0 18px rgba(240,180,90,0.7)",
                    borderRadius: 3,
                    animationDelay: `${(i + wi) * 0.3}s`,
                  }}
                />
              ))}
            </div>
          );
        })}
      </Plane>

      {/* chimney smoke */}
      <Plane factor={0.22} camX={camX} zIndex={3}>
        {Array.from({ length: Math.ceil(w / 400) }).map((_, i) => (
          <div
            key={i}
            className="coer-float-smoke"
            style={{
              position: "absolute",
              left: 80 + i * 400,
              bottom: `${(1 - lane) * 100 + 18}%`,
              width: 40,
              height: 80,
              background: "radial-gradient(circle,rgba(220,225,235,0.25),transparent 70%)",
              borderRadius: "50%",
              animationDelay: `${i * 1.1}s`,
            }}
          />
        ))}
      </Plane>

      <FloorPlane
        camX={camX}
        w={w}
        floorTop={floorTop}
        top="repeating-linear-gradient(90deg,#3a3a44 0 26px,#33333d 26px 28px),linear-gradient(180deg,#3a3a44,#2a2a33)"
        front="linear-gradient(180deg,#26262e,#16161c)"
        seam="rgba(255,255,255,0.06)"
      />
      {/* snow dusting on cobbles */}
      <Plane factor={1} camX={camX} zIndex={11}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: `${lane * 100}%`,
            width: w,
            height: "8%",
            background: "linear-gradient(180deg,rgba(235,243,255,0.35),transparent)",
          }}
        />
      </Plane>

      {/* 4. foreground lantern + blurred barrel */}
      <Plane factor={1.4} camX={camX} zIndex={28} style={{ filter: "blur(2px)" }}>
        {Array.from({ length: Math.ceil(w / 560) }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 30 + i * 560,
              bottom: "0%",
              width: 70,
              height: 90,
              borderRadius: "40% 40% 20% 20%",
              background: "linear-gradient(180deg,#3a2c1c,#1c140c)",
              opacity: 0.9,
            }}
          />
        ))}
      </Plane>

      <LightingGrade tint="rgba(220,180,110,0.10)" topTint="rgba(40,60,100,0.16)" />
    </div>
  );
}

// ── 4. FROZEN SHRINE ─────────────────────────────────────────────────────────
function ShrineDiorama({ camX, w, vw, vh, lane }: SubProps) {
  const floorTop = `${lane * 100}%`;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 30%,#13243c 0%,#0c1828 55%,#060c16 100%)",
        }}
      />
      {/* deep glow */}
      <Plane factor={0.08} camX={camX} zIndex={1}>
        <div
          style={{
            position: "absolute",
            left: vw * 0.45,
            top: "20%",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(90,150,220,0.25),transparent 70%)",
          }}
        />
      </Plane>

      {/* 2. tall pillars receding into the dark + black-sun carving */}
      <Plane factor={0.4} camX={camX} zIndex={2}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: w,
            height: floorTop,
            background: "linear-gradient(180deg,#0e1c30 0%,#13263e 60%,#0a1626 100%)",
          }}
        />
        {Array.from({ length: Math.ceil(w / 260) }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 80 + i * 260,
              top: "8%",
              width: 46,
              height: `${lane * 100 - 8}%`,
              background: "linear-gradient(90deg,#0a1424,#27425f,#0a1424)",
              boxShadow: "0 0 30px rgba(80,140,200,0.18)",
              borderRadius: "3px 3px 0 0",
            }}
          />
        ))}
        {/* black-sun symbol carved on back wall */}
        <div
          style={{
            position: "absolute",
            left: w * 0.5 - 60,
            top: "16%",
            width: 120,
            height: 120,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "#05030a",
              boxShadow: "0 0 40px rgba(160,90,220,0.5), inset 0 0 24px rgba(160,90,220,0.6)",
              border: "2px solid rgba(170,110,230,0.6)",
            }}
          />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 4,
                height: 76,
                marginLeft: -2,
                marginTop: -38,
                background: "linear-gradient(180deg,rgba(170,110,230,0.8),transparent)",
                transformOrigin: "center",
                transform: `rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>
      </Plane>

      {/* glowing ice crystals */}
      <Plane factor={0.6} camX={camX} zIndex={4}>
        {Array.from({ length: Math.ceil(w / 200) }).map((_, i) => (
          <div
            key={i}
            className="coer-pulse-glow"
            style={{
              position: "absolute",
              left: 60 + i * 200 + ((i * 47) % 60),
              bottom: `${(1 - lane) * 100 - 2}%`,
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: `${34 + (i % 3) * 14}px solid rgba(120,200,240,0.65)`,
              filter: "drop-shadow(0 0 10px rgba(120,200,240,0.7))",
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </Plane>

      <FloorPlane
        camX={camX}
        w={w}
        floorTop={floorTop}
        top="linear-gradient(180deg,#1d3148 0%,#142336 70%,#0c1526 100%)"
        front="linear-gradient(180deg,#0a1626,#06101c)"
        seam="rgba(120,200,240,0.12)"
      />

      {/* 4. foreground ice shards (blurred) */}
      <Plane factor={1.45} camX={camX} zIndex={28} style={{ filter: "blur(2.5px)" }}>
        {Array.from({ length: Math.ceil(w / 440) }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 20 + i * 440,
              bottom: "-4%",
              width: 0,
              height: 0,
              borderLeft: "34px solid transparent",
              borderRight: "34px solid transparent",
              borderBottom: "120px solid rgba(150,210,245,0.5)",
              opacity: 0.7,
            }}
          />
        ))}
      </Plane>

      <LightingGrade tint="rgba(110,180,235,0.12)" topTint="rgba(40,80,140,0.2)" />
      <GodRays from="50%" color="rgba(120,190,240,0.10)" />
    </div>
  );
}

// ── shared sub-pieces ────────────────────────────────────────────────────────
function FloorPlane({
  camX,
  w,
  floorTop,
  top,
  front,
  seam,
}: {
  camX: number;
  w: number;
  floorTop: string;
  top: string;
  front: string;
  seam: string;
}) {
  return (
    <Plane factor={1} camX={camX} zIndex={10}>
      {/* receding floor (top face) with perspective gradient */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: floorTop,
          width: w,
          bottom: "8%",
          background: top,
          boxShadow: "inset 0 30px 50px rgba(0,0,0,0.35)",
        }}
      />
      {/* front lip of the floor */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: w,
          height: "8%",
          background: front,
        }}
      />
      {/* lane seam highlight */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: floorTop,
          width: w,
          height: 2,
          background: seam,
        }}
      />
    </Plane>
  );
}

function LightingGrade({ tint, topTint }: { tint: string; topTint: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 32 }}>
      {/* warm/cold dual grade */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 70%, ${tint}, transparent 60%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${topTint}, transparent 45%)` }} />
      {/* tilt-shift: blur-emulating dark bands top & bottom for diorama focus */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "12%", background: "linear-gradient(180deg,rgba(0,0,0,0.45),transparent)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "16%", background: "linear-gradient(0deg,rgba(0,0,0,0.5),transparent)" }} />
    </div>
  );
}

function GodRays({ from, color }: { from: string; color: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 31, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: from,
          width: "40%",
          height: "120%",
          background: `linear-gradient(105deg, transparent 40%, ${color} 50%, transparent 60%)`,
          transform: "rotate(8deg)",
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}
