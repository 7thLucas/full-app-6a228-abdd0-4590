import { memo } from "react";
import type { AreaTheme } from "../data/gameData";

// ───────────────────────────────────────────────────────────────────────────
// Hangul Roads HD-2D side-view diorama. Korean-inspired fantasy environments,
// pure CSS/SVG (no external assets), 5 parallax planes filling the 16:9 frame.
//   shrine  -> Letter Shrine (sunrise, stone steps, floating Hangul, mountains)
//   village -> Dawn Village (hanok rooftops, lanterns, morning fog)
//   gate    -> Silent Gate (black fog, broken glowing letters, cold + warm)
// ───────────────────────────────────────────────────────────────────────────

interface DioramaProps {
  theme: AreaTheme;
  camX: number;
  worldWidth: number;
  viewportW: number;
  viewportH: number;
  laneBottomFrac: number;
}

export const Diorama = memo(function Diorama({
  theme,
  camX,
  worldWidth,
  viewportW,
  viewportH,
  laneBottomFrac,
}: DioramaProps) {
  switch (theme) {
    case "village":
      return <VillageDiorama camX={camX} w={worldWidth} vw={viewportW} vh={viewportH} lane={laneBottomFrac} />;
    case "gate":
      return <GateDiorama camX={camX} w={worldWidth} vw={viewportW} vh={viewportH} lane={laneBottomFrac} />;
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

const HANGUL_FLOAT = ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ", "ㅣ", "가", "나"];

// ── LETTER SHRINE ─────────────────────────────────────────────────────────────
function ShrineDiorama({ camX, w, vw, lane }: SubProps) {
  const floorTop = `${lane * 100}%`;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* sunrise sky */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg,#1a2a4a 0%,#3a5080 30%,#a9785a 62%,#e9b87a 82%,#f6d89a 100%)",
        }}
      />
      {/* rising sun + rays */}
      <Plane factor={0.05} camX={camX} zIndex={1}>
        <div
          style={{
            position: "absolute",
            left: vw * 0.46,
            top: "30%",
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "radial-gradient(circle,#fff3d6 0%,#ffd98a 50%,transparent 74%)",
            boxShadow: "0 0 120px 50px rgba(255,210,140,0.4)",
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
            height: "40%",
            background:
              "radial-gradient(ellipse 16% 100% at 14% 100%,#3a4a6e 0,transparent 72%),radial-gradient(ellipse 20% 100% at 36% 100%,#445278 0,transparent 73%),radial-gradient(ellipse 22% 100% at 62% 100%,#3a4a6e 0,transparent 72%),radial-gradient(ellipse 18% 100% at 84% 100%,#445278 0,transparent 73%)",
            opacity: 0.85,
          }}
        />
      </Plane>

      {/* floating glowing Hangul letters drifting in the back */}
      <Plane factor={0.3} camX={camX} zIndex={3}>
        {Array.from({ length: Math.ceil(w / 220) }).map((_, i) => (
          <div
            key={i}
            className="coer-bob"
            style={{
              position: "absolute",
              left: 60 + i * 220 + ((i * 47) % 70),
              top: `${18 + ((i * 23) % 30)}%`,
              fontSize: 30 + (i % 3) * 10,
              color: "#ffe9a8",
              textShadow: "0 0 18px rgba(255,220,140,0.9)",
              opacity: 0.85,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {HANGUL_FLOAT[i % HANGUL_FLOAT.length]}
          </div>
        ))}
      </Plane>

      {/* shrine pillars / stone steps */}
      <Plane factor={0.45} camX={camX} zIndex={4}>
        {Array.from({ length: Math.ceil(w / 300) }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 100 + i * 300,
              top: "30%",
              width: 40,
              height: `${lane * 100 - 30}%`,
              background: "linear-gradient(90deg,#7a6a52,#b6a07c,#7a6a52)",
              boxShadow: "0 0 24px rgba(255,210,140,0.2)",
              borderRadius: "4px 4px 0 0",
            }}
          />
        ))}
        {/* central stone arch */}
        <div
          style={{
            position: "absolute",
            left: w * 0.5 - 90,
            top: "22%",
            width: 180,
            height: "20%",
            borderRadius: "90px 90px 0 0",
            border: "10px solid #9a8460",
            borderBottom: "none",
            boxShadow: "0 0 30px rgba(255,210,140,0.25)",
          }}
        />
      </Plane>

      <FloorPlane
        camX={camX}
        w={w}
        floorTop={floorTop}
        top="repeating-linear-gradient(90deg,#9a8460 0 60px,#8a7654 60px 64px),linear-gradient(180deg,#9a8460,#6a5840)"
        front="linear-gradient(180deg,#5a4a36,#3a2e22)"
        seam="rgba(255,224,150,0.18)"
      />

      {/* foreground flowers + lanterns (blurred) */}
      <Plane factor={1.4} camX={camX} zIndex={28} style={{ filter: "blur(2px)" }}>
        {Array.from({ length: Math.ceil(w / 460) }).map((_, i) => (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: 40 + i * 460,
                bottom: "0%",
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "radial-gradient(circle,#ff9ab0,#e8607a 70%,transparent)",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 280 + i * 460,
                bottom: "-2%",
                width: 50,
                height: 70,
                borderRadius: "40% 40% 20% 20%",
                background: "radial-gradient(circle at 50% 40%,#ffd98a,#caa24e 70%)",
                boxShadow: "0 0 30px rgba(255,210,140,0.5)",
                opacity: 0.9,
              }}
            />
          </div>
        ))}
      </Plane>

      <LightingGrade tint="rgba(255,210,140,0.14)" topTint="rgba(60,90,150,0.16)" />
      <GodRays from="46%" color="rgba(255,225,160,0.16)" />
    </div>
  );
}

// ── DAWN VILLAGE ─────────────────────────────────────────────────────────────
function VillageDiorama({ camX, w, vw, lane }: SubProps) {
  const floorTop = `${lane * 100}%`;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg,#2a3a5e 0%,#5a6a8a 36%,#b88a6a 70%,#e9c08a 100%)",
        }}
      />
      <Plane factor={0.05} camX={camX} zIndex={1}>
        <div
          style={{
            position: "absolute",
            left: vw * 0.66,
            top: "26%",
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "radial-gradient(circle,#fff3d6,#ffd98a 55%,transparent 76%)",
            boxShadow: "0 0 90px 36px rgba(255,210,140,0.32)",
          }}
        />
      </Plane>

      {/* far mountains */}
      <Plane factor={0.12} camX={camX} zIndex={2}>
        <div
          style={{
            position: "absolute",
            bottom: `${(1 - lane) * 100 + 6}%`,
            left: -300,
            width: w + 600,
            height: "32%",
            background:
              "radial-gradient(ellipse 18% 100% at 18% 100%,#46567a 0,transparent 72%),radial-gradient(ellipse 22% 100% at 50% 100%,#3e4e72 0,transparent 73%),radial-gradient(ellipse 18% 100% at 80% 100%,#46567a 0,transparent 72%)",
            opacity: 0.8,
          }}
        />
      </Plane>

      {/* hanok-style houses with curved rooftops + warm windows */}
      <Plane factor={0.24} camX={camX} zIndex={3}>
        {Array.from({ length: Math.ceil(w / 220) }).map((_, i) => {
          const hh = 90 + ((i * 41) % 60);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: i * 220 + ((i * 29) % 40),
                bottom: `${(1 - lane) * 100 + 4}%`,
                width: 170,
                height: hh,
                background: "linear-gradient(180deg,#4a3f30,#2e271d)",
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              {/* curved hanok roof */}
              <div
                style={{
                  position: "absolute",
                  top: -26,
                  left: -18,
                  width: 206,
                  height: 34,
                  background: "linear-gradient(180deg,#3a4458,#222b3a)",
                  borderRadius: "50% 50% 8px 8px / 80% 80% 8px 8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: -30,
                  left: -26,
                  width: 18,
                  height: 18,
                  background: "#222b3a",
                  borderRadius: "0 0 0 80%",
                }}
              />
              {/* warm paper windows */}
              {[0, 1].map((wi) => (
                <div
                  key={wi}
                  className="coer-flicker"
                  style={{
                    position: "absolute",
                    left: 34 + wi * 72,
                    top: hh * 0.4,
                    width: 40,
                    height: 44,
                    background: "linear-gradient(180deg,#ffe6a8,#e0a84a)",
                    boxShadow: "0 0 20px rgba(240,180,90,0.7)",
                    borderRadius: 3,
                    border: "2px solid #5a4632",
                    animationDelay: `${(i + wi) * 0.3}s`,
                  }}
                />
              ))}
            </div>
          );
        })}
      </Plane>

      {/* hanging lanterns string */}
      <Plane factor={0.55} camX={camX} zIndex={5}>
        {Array.from({ length: Math.ceil(w / 160) }).map((_, i) => (
          <div
            key={i}
            className="coer-flicker"
            style={{
              position: "absolute",
              left: 80 + i * 160,
              top: `${lane * 100 - 30}%`,
              width: 22,
              height: 30,
              borderRadius: "40% 40% 50% 50%",
              background: "radial-gradient(circle at 50% 35%,#ffd98a,#d24a4a 80%)",
              boxShadow: "0 0 18px rgba(255,160,90,0.7)",
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </Plane>

      <FloorPlane
        camX={camX}
        w={w}
        floorTop={floorTop}
        top="repeating-linear-gradient(90deg,#5a4f42 0 30px,#4e453a 30px 33px),linear-gradient(180deg,#5a4f42,#3a3228)"
        front="linear-gradient(180deg,#2e271d,#1a1610)"
        seam="rgba(255,220,150,0.12)"
      />

      {/* foreground blurred lantern post + jar */}
      <Plane factor={1.4} camX={camX} zIndex={28} style={{ filter: "blur(2px)" }}>
        {Array.from({ length: Math.ceil(w / 520) }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 30 + i * 520,
              bottom: "-2%",
              width: 56,
              height: 90,
              borderRadius: "40% 40% 18% 18%",
              background: "linear-gradient(180deg,#4a3f30,#1c140c)",
              opacity: 0.9,
            }}
          />
        ))}
      </Plane>

      <LightingGrade tint="rgba(255,200,130,0.12)" topTint="rgba(40,60,100,0.16)" />
      <GodRays from="60%" color="rgba(255,220,150,0.12)" />
    </div>
  );
}

// ── THE SILENT GATE ──────────────────────────────────────────────────────────
function GateDiorama({ camX, w, vw, lane }: SubProps) {
  const floorTop = `${lane * 100}%`;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 30%,#1e1838 0%,#120e26 55%,#070512 100%)",
        }}
      />
      {/* warm village glow leaking from the left, cold gate ahead */}
      <Plane factor={0.06} camX={camX} zIndex={1}>
        <div
          style={{
            position: "absolute",
            left: -120,
            top: "30%",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(255,180,90,0.22),transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: vw * 0.5,
            top: "20%",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(150,100,220,0.22),transparent 70%)",
          }}
        />
      </Plane>

      {/* the great gate + broken glowing letters */}
      <Plane factor={0.4} camX={camX} zIndex={3}>
        <div
          style={{
            position: "absolute",
            left: w * 0.5 - 140,
            top: "12%",
            width: 280,
            height: `${lane * 100 - 12}%`,
            background: "linear-gradient(90deg,#14102a,#2a2048,#14102a)",
            borderRadius: "140px 140px 0 0",
            boxShadow: "0 0 50px rgba(150,100,220,0.25)",
          }}
        />
        {/* broken letters scattered on the gate */}
        {["ㅎ", "ㅏ", "ㄴ", "ㄱ", "ㅡ", "ㄹ"].map((c, i) => (
          <div
            key={i}
            className="coer-flicker"
            style={{
              position: "absolute",
              left: w * 0.5 - 90 + (i % 3) * 70,
              top: `${24 + Math.floor(i / 3) * 24}%`,
              fontSize: 28,
              color: "#c89aff",
              textShadow: "0 0 16px rgba(170,110,230,0.9)",
              opacity: 0.6,
              transform: `rotate(${(i % 2 ? 1 : -1) * (8 + i * 3)}deg)`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {c}
          </div>
        ))}
        {/* pillars */}
        {Array.from({ length: Math.ceil(w / 300) }).map((_, i) => (
          <div
            key={`p${i}`}
            style={{
              position: "absolute",
              left: 60 + i * 300,
              top: "20%",
              width: 36,
              height: `${lane * 100 - 20}%`,
              background: "linear-gradient(90deg,#100c22,#241a40,#100c22)",
              borderRadius: "3px 3px 0 0",
            }}
          />
        ))}
      </Plane>

      <FloorPlane
        camX={camX}
        w={w}
        floorTop={floorTop}
        top="linear-gradient(180deg,#221a3a 0%,#160f2a 70%,#0c0820 100%)"
        front="linear-gradient(180deg,#0c0820,#060410)"
        seam="rgba(170,110,230,0.16)"
      />

      {/* foreground broken shards (blurred) */}
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
              borderLeft: "30px solid transparent",
              borderRight: "30px solid transparent",
              borderBottom: "110px solid rgba(120,80,180,0.45)",
              opacity: 0.6,
            }}
          />
        ))}
      </Plane>

      <LightingGrade tint="rgba(150,100,220,0.14)" topTint="rgba(40,25,70,0.24)" />
      <GodRays from="48%" color="rgba(170,120,230,0.12)" />
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
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 70%, ${tint}, transparent 60%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${topTint}, transparent 45%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "12%", background: "linear-gradient(180deg,rgba(0,0,0,0.4),transparent)" }} />
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
