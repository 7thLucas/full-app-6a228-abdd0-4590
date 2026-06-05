import type { ElementId } from "./types";

// Display metadata for elements/affinities — icon + name + color for weakness
// chips, combat log, and skill tinting.
export const ELEMENT_META: Record<ElementId, { name: string; icon: string; color: string }> = {
  sword: { name: "Sword", icon: "⚔", color: "#cdd2dc" },
  fire: { name: "Fire", icon: "🔥", color: "#e07a3c" },
  ice: { name: "Ice", icon: "❄", color: "#7fb4d6" },
  light: { name: "Light", icon: "✦", color: "#f0e3a0" },
  dark: { name: "Dark", icon: "🌑", color: "#9a6ad0" },
  arcane: { name: "Arcane", icon: "✧", color: "#b06ad6" },
  wind: { name: "Wind", icon: "🌪", color: "#9fd6b0" },
  earth: { name: "Earth", icon: "⛰", color: "#bfa06a" },
  moonlight: { name: "Moonlight", icon: "🌙", color: "#cdd6f0" },
  lightning: { name: "Lightning", icon: "⚡", color: "#f0d66a" },
};
