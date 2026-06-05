import type { MetaFunction } from "react-router";
import { GameRoot } from "~/game/GameRoot";

export const meta: MetaFunction = () => [
  { title: "Hangul Roads — Learn Korean Through Adventure" },
  {
    name: "description",
    content:
      "An HD-2D side-view adventure for learning Korean. Walk the Haneul Road, restore the Letters of Light, and master Hangul through battles, quests, and a daily habit loop.",
  },
];

export default function IndexPage() {
  return <GameRoot />;
}
