import type { MetaFunction } from "react-router";
import { GameRoot } from "~/game/GameRoot";

export const meta: MetaFunction = () => [
  { title: "Chronicles of the Eight Roads — Chapter 1: The Ashen Oath" },
  {
    name: "description",
    content:
      "A premium, melancholic HD-2D-inspired browser JRPG vertical slice. Lonely, hunted, but destined for something bigger.",
  },
];

export default function IndexPage() {
  return <GameRoot />;
}
