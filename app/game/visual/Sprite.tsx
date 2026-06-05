// Original placeholder pixel-style sprites built from SVG shapes for
// Hangul Roads. No copyrighted assets — every figure is an abstract silhouette.

export type SpriteKind =
  | "arin" // player: cloaked traveler with satchel + glowing notebook
  | "bori" // glowing fox spirit guide
  | "elder"
  | "shopkeeper"
  | "guard"
  | "child"
  | "wisp" // Silence Wisp boss
  | "lantern"
  | "tablet";

interface SpriteProps {
  kind: SpriteKind;
  size?: number;
  className?: string;
  facing?: "left" | "right";
}

export function Sprite({ kind, size = 40, className, facing = "right" }: SpriteProps) {
  const flip = facing === "left";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      style={{
        imageRendering: "pixelated",
        transform: flip ? "scaleX(-1)" : undefined,
        overflow: "visible",
      }}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {renderSprite(kind)}
    </svg>
  );
}

function renderSprite(kind: SpriteKind) {
  switch (kind) {
    case "arin":
      return <ArinSprite />;
    case "bori":
      return <BoriSprite />;
    case "elder":
      return <ElderSprite />;
    case "shopkeeper":
      return <ShopkeeperSprite />;
    case "guard":
      return <GuardSprite />;
    case "child":
      return <ChildSprite />;
    case "wisp":
      return <WispSprite />;
    case "lantern":
      return <LanternSprite />;
    case "tablet":
      return <TabletSprite />;
    default:
      return null;
  }
}

// ── Arin: cloaked traveler, satchel, glowing notebook ────────────────────────
function ArinSprite() {
  return (
    <g>
      <ellipse cx="16" cy="29" rx="8" ry="2.4" fill="#000" opacity="0.32" />
      {/* legs */}
      <rect x="12" y="22" width="3.4" height="7" fill="#3a3550" />
      <rect x="16.6" y="22" width="3.4" height="7" fill="#3a3550" />
      {/* cloak */}
      <path d="M9 13 L23 13 L24 25 L8 25 Z" fill="#3f5e7e" />
      <path d="M9 13 L23 13 L23 17 L9 17 Z" fill="#4f739a" />
      {/* hood/head */}
      <rect x="12" y="6" width="8" height="7" rx="1.6" fill="#e6c6a0" />
      <path d="M11 6 Q16 2 21 6 L21 9 L11 9 Z" fill="#2e4a66" />
      {/* satchel strap */}
      <rect x="10" y="14" width="12" height="2" fill="#7a5a36" transform="rotate(8 16 15)" />
      {/* glowing notebook in hand */}
      <rect x="6" y="17" width="6" height="7" rx="1" fill="#d8b25a" />
      <rect x="6" y="17" width="6" height="7" rx="1" fill="none" stroke="#ffe9a8" strokeWidth="0.6" />
      <circle cx="9" cy="20.5" r="4.5" fill="#ffe9a8" opacity="0.25" />
    </g>
  );
}

// ── Bori: glowing fox spirit (original, not an owl) ──────────────────────────
function BoriSprite() {
  return (
    <g>
      <ellipse cx="16" cy="28" rx="7" ry="2" fill="#caa24e" opacity="0.3" />
      {/* glow aura */}
      <circle cx="16" cy="16" r="11" fill="#ffd98a" opacity="0.16" />
      {/* body */}
      <path d="M9 18 Q9 12 16 12 Q23 12 23 18 L22 23 Q16 25 10 23 Z" fill="#e8923c" />
      <path d="M11 20 Q16 22 21 20 L20 23 Q16 24 12 23 Z" fill="#fff1d6" />
      {/* ears */}
      <path d="M10 13 L8 7 L13 11 Z" fill="#e8923c" />
      <path d="M22 13 L24 7 L19 11 Z" fill="#e8923c" />
      <path d="M10.5 12 L9.5 9 L12 11 Z" fill="#2a1a12" />
      <path d="M21.5 12 L22.5 9 L20 11 Z" fill="#2a1a12" />
      {/* eyes */}
      <circle cx="13" cy="16" r="1.3" fill="#2a1a12" />
      <circle cx="19" cy="16" r="1.3" fill="#2a1a12" />
      {/* nose */}
      <path d="M15 18 L17 18 L16 19.4 Z" fill="#2a1a12" />
      {/* glowing tail */}
      <path d="M22 20 Q28 18 27 24 Q24 26 22 23 Z" fill="#ffd98a" opacity="0.9" />
    </g>
  );
}

// ── Village Elder: long robe, top-knot hat ───────────────────────────────────
function ElderSprite() {
  return (
    <g>
      <ellipse cx="16" cy="29" rx="8" ry="2.4" fill="#000" opacity="0.3" />
      <path d="M10 13 L22 13 L24 29 L8 29 Z" fill="#5b6b80" />
      <path d="M10 13 L22 13 L23 19 L9 19 Z" fill="#6d7d92" />
      <rect x="12" y="7" width="8" height="7" rx="1.5" fill="#e6c6a0" />
      {/* gat (traditional hat) */}
      <rect x="11" y="5" width="10" height="2.4" fill="#1a1a22" />
      <rect x="13.5" y="2.5" width="5" height="3" rx="1" fill="#1a1a22" />
      {/* white beard */}
      <path d="M13 12 L19 12 L17 16 L15 16 Z" fill="#e8e4da" />
    </g>
  );
}

function ShopkeeperSprite() {
  return (
    <g>
      <ellipse cx="16" cy="29" rx="8" ry="2.4" fill="#000" opacity="0.3" />
      <path d="M10 14 L22 14 L23 29 L9 29 Z" fill="#7a3f4a" />
      <rect x="12" y="7" width="8" height="7" rx="1.5" fill="#e6c6a0" />
      <path d="M11 6 L21 6 L22 8 L10 8 Z" fill="#caa24e" />
      <rect x="10" y="15" width="12" height="2.4" fill="#caa24e" />
      <rect x="14" y="9" width="4" height="2" fill="#2a1a12" />
    </g>
  );
}

function GuardSprite() {
  return (
    <g>
      <ellipse cx="16" cy="29" rx="8" ry="2.4" fill="#000" opacity="0.3" />
      <rect x="11" y="14" width="10" height="11" rx="1" fill="#43506a" />
      <rect x="11" y="14" width="10" height="3" fill="#566488" />
      <rect x="12" y="7" width="8" height="7" rx="1.5" fill="#e6c6a0" />
      <rect x="11" y="5" width="10" height="3" rx="1" fill="#2e3650" />
      {/* spear */}
      <rect x="24" y="4" width="1.6" height="22" fill="#7a5a3a" />
      <path d="M24.8 2 L26.4 6 L23.2 6 Z" fill="#c8cdd8" />
      <rect x="12" y="22" width="3.4" height="6" fill="#2e3650" />
      <rect x="16.6" y="22" width="3.4" height="6" fill="#2e3650" />
    </g>
  );
}

function ChildSprite() {
  return (
    <g>
      <ellipse cx="16" cy="29" rx="6" ry="2" fill="#000" opacity="0.28" />
      <path d="M12 18 L20 18 L21 29 L11 29 Z" fill="#c87a3c" />
      <rect x="13" y="12" width="6" height="6" rx="1.5" fill="#e6c6a0" />
      <rect x="12.5" y="11" width="7" height="2.5" fill="#2a1a12" />
      <circle cx="15" cy="15" r="0.9" fill="#2a1a12" />
      <circle cx="17.6" cy="15" r="0.9" fill="#2a1a12" />
    </g>
  );
}

// ── Silence Wisp boss: swirl of black fog with flickering letters ────────────
function WispSprite() {
  return (
    <g>
      <ellipse cx="16" cy="28" rx="9" ry="2.4" fill="#000" opacity="0.35" />
      <circle cx="16" cy="15" r="11" fill="#1a1428" opacity="0.92" />
      <circle cx="16" cy="15" r="13" fill="#6a4aa0" opacity="0.18" />
      {/* swirling fog tendrils */}
      <path d="M6 18 Q3 12 9 10" stroke="#3a2f5a" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M26 18 Q29 12 23 10" stroke="#3a2f5a" strokeWidth="2" fill="none" opacity="0.7" />
      {/* hollow eyes */}
      <ellipse cx="12.5" cy="14" rx="1.6" ry="2.2" fill="#c75bff" opacity="0.9" />
      <ellipse cx="19.5" cy="14" rx="1.6" ry="2.2" fill="#c75bff" opacity="0.9" />
      {/* flickering broken letters */}
      <text x="9" y="22" fontSize="5" fill="#9a7ad0" opacity="0.7">ㅁ</text>
      <text x="19" y="23" fontSize="5" fill="#9a7ad0" opacity="0.7">ㄱ</text>
    </g>
  );
}

function LanternSprite() {
  return (
    <g>
      <rect x="14.5" y="4" width="3" height="6" fill="#3a2e22" />
      <rect x="11" y="10" width="10" height="13" rx="2" fill="#5a4632" />
      <rect x="12.5" y="12" width="7" height="9" rx="1.5" fill="#ffd98a" />
      <circle cx="16" cy="16.5" r="6" fill="#ffd98a" opacity="0.3" />
      <rect x="11" y="22" width="10" height="2" fill="#3a2e22" />
    </g>
  );
}

function TabletSprite() {
  return (
    <g>
      <ellipse cx="16" cy="28" rx="8" ry="2" fill="#000" opacity="0.3" />
      <path d="M9 26 L9 10 Q16 5 23 10 L23 26 Z" fill="#6a7382" />
      <path d="M9 26 L9 10 Q16 5 23 10 L23 26 Z" fill="none" stroke="#d8b25a" strokeWidth="0.8" />
      <text x="11" y="18" fontSize="7" fill="#d8b25a">가</text>
    </g>
  );
}
