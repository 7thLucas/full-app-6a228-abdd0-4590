/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  gameTitle: string;
  gameSubtitle: string;
  tagline: string;
  newGameLabel: string;
  continueLabel: string;
  settingsLabel: string;
  creditsLabel: string;
  creditsBody: string;
  startingCoins: number;
  textSpeed: "slow" | "normal" | "fast";
  showMobileControls: boolean;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Chronicles of the Eight Roads",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#d8b25a", // gold
    secondary: "#7fb4d6", // ice blue
    accent: "#e07a3c", // ember
  },
  gameTitle: "Chronicles of the Eight Roads",
  gameSubtitle: "Chapter 1 — The Ashen Oath",
  tagline: "Lonely, hunted, but destined for something bigger.",
  newGameLabel: "New Game",
  continueLabel: "Continue",
  settingsLabel: "Settings",
  creditsLabel: "Credits",
  creditsBody:
    "An original HD-2D-inspired vertical slice. World, characters, music, and art are wholly original — a genre homage, never a clone.",
  startingCoins: 100,
  textSpeed: "normal",
  showMobileControls: true,
};
