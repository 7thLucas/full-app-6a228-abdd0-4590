import { useId } from "react";

// Original placeholder pixel-style sprites built from SVG shapes. No copyrighted
// assets — each is an abstract silhouette matching the design brief.

export type SpriteKind =
  | "kael"
  | "edrin"
  | "townsfolk"
  | "merchant"
  | "frostWolf"
  | "banditScout"
  | "iceWisp"
  | "hollowGuard"
  | "chest"
  | "crystal"
  | "lever"
  | "poster"
  | "anvil"
  | "altar"
  | "bed"
  | "door"
  | "stall";

interface SpriteProps {
  kind: SpriteKind;
  size?: number;
  className?: string;
  facing?: "up" | "down" | "left" | "right";
}

export function Sprite({ kind, size = 40, className, facing = "down" }: SpriteProps) {
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
    case "kael":
      return <KaelSprite />;
    case "edrin":
      return <EdrinSprite />;
    case "townsfolk":
      return <TownsfolkSprite />;
    case "merchant":
      return <MerchantSprite />;
    case "frostWolf":
      return <FrostWolfSprite />;
    case "banditScout":
      return <BanditScoutSprite />;
    case "iceWisp":
      return <IceWispSprite />;
    case "hollowGuard":
      return <HollowGuardSprite />;
    case "chest":
      return <ChestSprite />;
    case "crystal":
      return <CrystalSprite />;
    case "lever":
      return <LeverSprite />;
    case "poster":
      return <PosterSprite />;
    case "anvil":
      return <AnvilSprite />;
    case "altar":
      return <AltarSprite />;
    case "bed":
      return <BedSprite />;
    case "door":
      return <DoorSprite />;
    case "stall":
      return <StallSprite />;
    default:
      return null;
  }
}

// ── Kael: dark armored figure with red scarf ─────────────────────────────────
function KaelSprite() {
  return (
    <g>
      <ellipse cx="16" cy="29" rx="9" ry="2.5" fill="#000" opacity="0.35" />
      {/* legs */}
      <rect x="11" y="22" width="4" height="7" fill="#2a2f3d" />
      <rect x="17" y="22" width="4" height="7" fill="#2a2f3d" />
      {/* body armor */}
      <rect x="10" y="13" width="12" height="11" rx="1.5" fill="#3a4154" />
      <rect x="10" y="13" width="12" height="3" fill="#4a5269" />
      {/* scarf */}
      <rect x="11" y="12" width="10" height="3" fill="#b23a3a" />
      <rect x="9" y="14" width="2" height="6" fill="#9c2f2f" />
      {/* head */}
      <rect x="12" y="6" width="8" height="7" rx="1.5" fill="#d8b08a" />
      <rect x="12" y="6" width="8" height="3" fill="#3a3026" />
      {/* shield arm */}
      <rect x="6" y="15" width="4" height="8" rx="1" fill="#5a6173" />
      {/* sword glint */}
      <rect x="23" y="11" width="2" height="11" fill="#c8cdd8" />
      <rect x="22" y="20" width="4" height="2" fill="#8a6a3a" />
    </g>
  );
}

// ── Edrin: cloaked old healer with staff ─────────────────────────────────────
function EdrinSprite() {
  return (
    <g>
      <ellipse cx="16" cy="29" rx="8" ry="2.5" fill="#000" opacity="0.3" />
      {/* robe */}
      <path d="M10 14 L22 14 L24 29 L8 29 Z" fill="#5b4a6b" />
      <path d="M10 14 L22 14 L23 20 L9 20 Z" fill="#6d5a80" />
      {/* hood */}
      <path d="M11 7 Q16 3 21 7 L21 14 L11 14 Z" fill="#4a3c58" />
      {/* face shadow */}
      <rect x="13" y="9" width="6" height="4" rx="1" fill="#c9a98a" />
      <rect x="13" y="9" width="6" height="1.5" fill="#9c8270" />
      {/* staff */}
      <rect x="24" y="6" width="1.6" height="22" fill="#7a5a3a" />
      <circle cx="24.8" cy="6" r="2.4" fill="#9ad0e0" opacity="0.9" />
      <circle cx="24.8" cy="6" r="3.6" fill="#9ad0e0" opacity="0.25" />
    </g>
  );
}

function TownsfolkSprite() {
  return (
    <g>
      <ellipse cx="16" cy="29" rx="7" ry="2.2" fill="#000" opacity="0.28" />
      <path d="M11 14 L21 14 L22 29 L10 29 Z" fill="#6a5b48" />
      <rect x="12" y="7" width="8" height="7" rx="1.5" fill="#d8b08a" />
      <rect x="12" y="6" width="8" height="3" fill="#4a3f30" />
      <rect x="11" y="14" width="10" height="3" fill="#8a7456" />
    </g>
  );
}

function MerchantSprite() {
  return (
    <g>
      <ellipse cx="16" cy="29" rx="8" ry="2.4" fill="#000" opacity="0.3" />
      <path d="M10 14 L22 14 L23 29 L9 29 Z" fill="#3f5e54" />
      <rect x="12" y="7" width="8" height="7" rx="1.5" fill="#d8b08a" />
      <path d="M11 6 L21 6 L22 8 L10 8 Z" fill="#caa24e" />
      <rect x="10" y="15" width="12" height="2.4" fill="#caa24e" />
    </g>
  );
}

// ── Frost Wolf: icy blue silhouette ──────────────────────────────────────────
function FrostWolfSprite() {
  return (
    <g>
      <ellipse cx="16" cy="27" rx="11" ry="2.6" fill="#000" opacity="0.3" />
      <path d="M4 22 Q6 14 14 15 L24 14 Q29 13 29 18 L27 23 Q20 25 13 24 L7 24 Z" fill="#5b8fb8" />
      <path d="M24 14 L29 9 L28 16 Z" fill="#7fb4d6" />
      <path d="M23 15 L26 11 L27 17 Z" fill="#9ecbe6" />
      <circle cx="26" cy="16" r="1.2" fill="#dff2ff" />
      <path d="M5 22 L3 27 L7 24 Z" fill="#4a7aa0" />
      <rect x="9" y="23" width="2.5" height="5" fill="#4a7aa0" />
      <rect x="19" y="23" width="2.5" height="5" fill="#4a7aa0" />
    </g>
  );
}

function BanditScoutSprite() {
  return (
    <g>
      <ellipse cx="16" cy="29" rx="8" ry="2.4" fill="#000" opacity="0.3" />
      <path d="M11 14 L21 14 L22 29 L10 29 Z" fill="#4a3f33" />
      <rect x="12" y="7" width="8" height="7" rx="1.5" fill="#c9a98a" />
      <rect x="11" y="9" width="10" height="2.4" fill="#2a2a2a" />
      <rect x="23" y="9" width="1.6" height="13" fill="#b0b6c0" />
      <rect x="6" y="13" width="4" height="3" fill="#7a3a3a" />
    </g>
  );
}

function IceWispSprite() {
  return (
    <g>
      <ellipse cx="16" cy="28" rx="6" ry="2" fill="#000" opacity="0.2" />
      <circle cx="16" cy="15" r="7" fill="#bfe6f5" opacity="0.85" />
      <circle cx="16" cy="15" r="10" fill="#9ad0e0" opacity="0.25" />
      <circle cx="13" cy="13" r="1.4" fill="#1b3a4a" />
      <circle cx="19" cy="13" r="1.4" fill="#1b3a4a" />
      <path d="M12 20 L16 26 L20 20 Z" fill="#bfe6f5" opacity="0.7" />
    </g>
  );
}

// ── Hollow Guard: dark figure with glowing black-sun core ─────────────────────
function HollowGuardSprite() {
  return (
    <g>
      <ellipse cx="16" cy="29" rx="11" ry="2.8" fill="#000" opacity="0.4" />
      <path d="M8 12 L24 12 L26 28 L6 28 Z" fill="#1c1828" />
      <path d="M8 12 L24 12 L25 18 L7 18 Z" fill="#2a2440" />
      <rect x="11" y="4" width="10" height="9" rx="2" fill="#15121f" />
      <rect x="12" y="6" width="8" height="3" fill="#3a2f5a" opacity="0.7" />
      {/* black-sun core */}
      <circle cx="16" cy="20" r="3.4" fill="#0a0710" />
      <circle cx="16" cy="20" r="3.4" fill="none" stroke="#c75bff" strokeWidth="1" opacity="0.9" />
      <circle cx="16" cy="20" r="6" fill="#c75bff" opacity="0.18" />
      {/* shoulder spikes */}
      <path d="M6 12 L9 8 L10 13 Z" fill="#2a2440" />
      <path d="M26 12 L23 8 L22 13 Z" fill="#2a2440" />
    </g>
  );
}

// ── Props ────────────────────────────────────────────────────────────────────
function ChestSprite() {
  return (
    <g>
      <ellipse cx="16" cy="27" rx="8" ry="2" fill="#000" opacity="0.3" />
      <rect x="8" y="16" width="16" height="10" rx="1" fill="#6a4a2a" />
      <path d="M8 16 Q16 10 24 16 Z" fill="#7a5a36" />
      <rect x="8" y="18" width="16" height="2" fill="#caa24e" />
      <rect x="14" y="18" width="4" height="5" fill="#caa24e" />
    </g>
  );
}

function CrystalSprite() {
  return (
    <g>
      <ellipse cx="16" cy="28" rx="6" ry="1.8" fill="#3a7fb0" opacity="0.4" />
      <path d="M16 4 L22 16 L16 28 L10 16 Z" fill="#6fc3e8" opacity="0.9" />
      <path d="M16 4 L22 16 L16 28 L10 16 Z" fill="none" stroke="#bfe6f5" strokeWidth="0.8" />
      <path d="M16 4 L16 28" stroke="#dff2ff" strokeWidth="0.6" opacity="0.6" />
    </g>
  );
}

function LeverSprite() {
  return (
    <g>
      <rect x="12" y="20" width="8" height="6" rx="1" fill="#444a58" />
      <rect x="15" y="8" width="2" height="13" fill="#7a8090" transform="rotate(18 16 16)" />
      <circle cx="20" cy="8" r="2.4" fill="#caa24e" />
    </g>
  );
}

function PosterSprite() {
  return (
    <g>
      <rect x="9" y="6" width="14" height="18" rx="0.5" fill="#d8c8a8" />
      <rect x="9" y="6" width="14" height="18" rx="0.5" fill="none" stroke="#6a5b48" strokeWidth="1" />
      <rect x="12" y="9" width="8" height="6" fill="#8a7456" />
      <rect x="11" y="17" width="10" height="1.6" fill="#5a4a38" />
      <rect x="11" y="20" width="7" height="1.6" fill="#5a4a38" />
    </g>
  );
}

function AnvilSprite() {
  return (
    <g>
      <ellipse cx="16" cy="27" rx="9" ry="2" fill="#000" opacity="0.3" />
      <rect x="11" y="22" width="10" height="5" fill="#3a3f4a" />
      <path d="M7 16 L25 16 L22 20 L10 20 Z" fill="#5a6070" />
      <path d="M25 16 L29 18 L25 19 Z" fill="#5a6070" />
    </g>
  );
}

function AltarSprite() {
  return (
    <g>
      <rect x="9" y="16" width="14" height="10" fill="#5a5560" />
      <rect x="9" y="16" width="14" height="3" fill="#6a6470" />
      <rect x="13" y="8" width="6" height="8" fill="#7a7480" />
      <circle cx="16" cy="9" r="2.4" fill="#f0c66a" opacity="0.9" />
      <circle cx="16" cy="9" r="4" fill="#f0c66a" opacity="0.25" />
    </g>
  );
}

function BedSprite() {
  return (
    <g>
      <rect x="6" y="16" width="20" height="10" rx="1.5" fill="#4a4250" />
      <rect x="6" y="16" width="7" height="10" rx="1.5" fill="#cfc2b0" />
      <rect x="6" y="20" width="20" height="6" fill="#6a4a3a" />
    </g>
  );
}

function DoorSprite() {
  return (
    <g>
      <rect x="9" y="6" width="14" height="20" rx="2" fill="#3a2e22" />
      <rect x="11" y="8" width="10" height="16" rx="1.5" fill="#5a4632" />
      <rect x="11" y="8" width="10" height="3" fill="#6a5440" />
      <circle cx="19" cy="16" r="1.2" fill="#caa24e" />
    </g>
  );
}

function StallSprite() {
  return (
    <g>
      <rect x="7" y="16" width="18" height="9" fill="#5a4a36" />
      <path d="M5 16 L27 16 L24 10 L8 10 Z" fill="#7a3a3a" />
      <path d="M8 10 L24 10 L24 13 L8 13 Z" fill="#caa24e" opacity="0.5" />
    </g>
  );
}

// Standalone hook-free export for combat scenes needing a glow color per enemy.
export function useStableId(): string {
  return useId();
}
