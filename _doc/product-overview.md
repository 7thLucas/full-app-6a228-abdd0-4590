# Chronicles of the Eight Roads — Product Overview

## What it is
**Chronicles of the Eight Roads** is a playable, browser-based JRPG prototype inspired by
classic **HD-2D** turn-based fantasy RPGs — pixel-art characters set inside a cinematic
2.5D diorama world with dramatic lighting, atmospheric particles, and tactical
weakness-based combat. It is an **original** game (genre homage, not a clone): no
copyrighted characters, names, logos, story, music, maps, classes, or UI assets are used.

It is a **vertical slice**, not a full game. The goal is a polished, atmospheric prototype
that feels like a premium fantasy RPG — proving exploration, dialogue, town interaction,
overworld movement, turn-based combat, inventory, party management, and a chapter-based
story system all working together in the browser.

## The world & premise
The world of **Asterra** is divided by eight ancient roads, each bound to a forgotten
oath. Long ago, eight guardians sealed a force called **The Hollow Sun** beneath the
continent. The seal is now breaking. Across the world, eight travelers begin separate
journeys driven by personal goals; their stories slowly converge into one larger mystery.

The player begins by choosing one of **eight protagonists**. All eight are shown on the
selection screen with full lore cards; for this prototype **Kael is fully playable** and
the other seven are presented as locked / "Coming Soon."

## The eight travelers
1. **Kael — The Exiled Knight** — Tank / frontline damage · Sword & shield · Fire · framed for the king's murder · Veyrhold (snowy fortress town). *Playable.*
2. **Mira — The Runebinder** — Magic damage / debuffer · Staff · Arcane · seeks her master's forbidden spellbook · Lumenwick (candle-lit scholar city).
3. **Rowan — The Wandering Merchant** — Support / money skills · Dagger & crossbow · Wind · repaying a debt, rebuilding a trade guild · Goldmere (port market city).
4. **Selene — The Moonlit Dancer** — Buffer / evasive attacker · Fans & daggers · Moonlight · avenging her destroyed troupe · Mirravale (desert festival city).
5. **Bram — The Beast Hunter** — Physical damage / monster capture · Axe & bow · Earth · hunting the beast that cursed his village · Thornwild (forest settlement).
6. **Elian — The Young Cleric** — Healer / holy magic · Mace · Light · investigating why prayers no longer reach the gods · Sancta Vale (cathedral valley).
7. **Nyra — The Shadow Thief** — Speed / steal / crits · Twin blades · Dark · stealing back her gang's stolen relic · Duskrun (rainy criminal district).
8. **Orin — The Clockwork Scholar** — Utility / gadgets / turn manipulation · Pistol & tools · Lightning · repairing an ancient machine that predicts disasters · Gearford (industrial clocktower city).

## The playable slice — Kael, Chapter 1: "The Ashen Oath"
Kael wakes in an abandoned mountain chapel, rescued by an old healer named **Edrin**.
Accused of murdering **King Aldren**, he remembers only flashes of a masked figure, a
burning throne room, and a **black sun** symbol. He must escape the snowy region, find
evidence of the real murderer, and survive the soldiers hunting him.

Playable flow: chapel → talk to Edrin → learn movement/interaction → receive Rusted Sword
& Old Shield → Snowfield Path (Frost Wolf tutorial fight) → Veyrhold Outskirts (NPCs,
blacksmith, merchant, wanted poster, save crystal) → Frozen Shrine dungeon (lever gate,
two encounters, Hollow Guard mini-boss) → ending cutscene: the Hollow Sun mark appears on
Kael's hand. Ends on "End of Prototype — Chapter 1 Continues Soon."

### Four playable areas
1. **Abandoned Chapel** — warm candlelit interior, broken stained glass, snow through
   cracked walls; Edrin; bed/altar/chest/door interactables; chest holds Healing Herb x2.
2. **Snowfield Path** — outdoor snowy route, parallax mountains, falling snow, scripted
   encounter; exits to Chapel and Veyrhold.
3. **Veyrhold Outskirts** — small living town edge: walking NPCs, blacksmith stall,
   wanted poster, merchant, glowing blue save crystal.
4. **Frozen Shrine** — short icy dungeon: blue lighting, stone pillars, locked
   lever-gate, two encounters, mini-boss arena, end-of-demo cutscene.

## Signature systems (original mechanics)
- **Guard Shatter** — every enemy has Guard Points; hitting a weakness removes one. At 0
  the enemy is **Shattered** for one turn: it loses its next action and takes +50% damage,
  with a dramatic "SHATTERED" effect, screen shake, and particle burst. (Original naming —
  never "Break" or "Boost.")
- **Momentum** — Kael gains 1 Momentum per turn (max 5). Before an Attack or Skill the
  player chooses how much Momentum to spend for escalating damage bonuses (+20% / +40% /
  +70% / +100% / +150%, the last with a special flash effect).
- **Turn-based party combat** — commands: Attack, Skills, Guard, Item, Analyze, Flee. Turn
  order bar, HP/SP bars, weakness icons, status effects, combat log, victory screen, EXP /
  coins / level-up modals, and a game-over flow (Retry / Load / Title).

## Combat content (prototype)
- **Kael (Lv1):** HP 120, SP 30, ATK 18, DEF 14, MAG 6, SPD 8, Crit 5%. Skills: Flame
  Slash (6 SP, fire+sword), Shield Bash (4 SP, low dmg + stun chance), Defiant Guard
  (5 SP, +DEF 2 turns), Ashen Strike (12 SP, strong single-target, unlocked after mini-boss).
- **Enemies:** Frost Wolf (HP 45, weak Sword/Fire, 25 EXP, tutorial), Bandit Scout (HP 60,
  weak Shield Bash/Fire, 35 EXP), Ice Wisp (HP 40, weak Sword/Light, resists Ice, 30 EXP),
  **Hollow Guard** mini-boss (HP 220, weak Sword/Fire, 3 Guard Points, 120 EXP).
- **Progression:** 100 EXP to reach Lv2; level-up raises max HP/SP/ATK/DEF and restores
  some HP/SP via a modal.

## Items, equipment & economy
- **Items:** Healing Herb (+50 HP), Spirit Plum (+20 SP), Antidote (cure poison,
  placeholder), Old Iron Sword (starting weapon), Old Shield (starting shield).
- **Equipment slots:** Weapon, Shield, Armor, Accessory — prototype loadout Rusted Sword /
  Old Shield / Traveler's Coat / (empty). Equipment affects stats, even if simply.
- **Shop (Veyrhold merchant):** Healing Herb 20c, Spirit Plum 35c, Traveler's Charm 80c.
  Player starts with 100 coins. Buy works; sell may be placeholder.

## Feature scope (must-have playable features)
Main menu · character selection · playable Kael intro · movement + collision · dialogue
system (speaker, portrait, typewriter, choices) · 4 areas · NPC interactions · inventory ·
equipment · quest journal ("Clear Your Name", 8 objectives) · shop/merchant · turn-based
combat · Guard Shatter · Momentum · mini-boss battle · victory screen · save/load via
localStorage · in-engine cutscenes (opening + ending) · game-over flow. Esc menu tabs:
Party, Inventory, Equipment, Skills, Quests, Settings, Save/Load, Return to Title.

## Emotional north star & player experience
The guiding feeling is **"lonely, hunted, but destined for something bigger."** Chronicles
of the Eight Roads is a **premium, melancholic fantasy escape story** where every step feels
dangerous, every light feels sacred, and every battle makes the player feel like Kael is
slowly reclaiming his truth. The north star is not "make it look HD-2D" — it is this
feeling; the HD-2D look is in service of it.

For Kael's **first ten minutes** the player should feel they are not starting an adventure so
much as running from a world that has already decided they are guilty. The atmosphere stays
**cold, quiet, and dangerous — yet beautiful and expensive**: snow, candlelight, ruined
chapel walls, distant mountains, and soft glowing magic that read as nostalgic, mysterious,
and premium.

The player should feel, in turn: **isolated** at first · **curious** about what really
happened · **tense** because soldiers and monsters are near · **emotionally attached to
Kael's innocence** · **powerful** once they understand Guard Shatter · **intrigued** by the
black sun symbol at the end.

**The emotional arc (the spine of Chapter 1):**
1. Wake confused.
2. Realize the world thinks you are a traitor.
3. Step into a beautiful but hostile snowy world.
4. Survive your first real fight.
5. Discover the mystery is bigger than a murder.
6. End on the feeling: **"I need to know what happens next."**

**Combat must feel tactical but satisfying** — every weakness hit feels smart, and every
Guard Shatter feels dramatic, like the player *outplayed* the enemy instead of just clicking
attack.

## Look, feel & tone
A **2.5D pixel-art diorama**: 2D pixel sprites in layered worlds with depth, atmospheric
lighting, soft bloom, vignette, parallax, fog, warm lantern glow, and cinematic camera
framing. Settings: warm taverns, misty forests, cobblestone towns, ancient ruins,
candlelit interiors. Subtle animated particles (dust, fireflies, embers, fog), torch
flicker, idle breathing, floating damage numbers. **Nostalgic, melancholic, but premium** — never
photorealistic, never generic browser styling.

**UI direction:** dark fantasy shell around a centered **16:9 viewport**. Dark navy/black
panels, **gold borders**, soft glow highlights, serif-inspired fantasy headings with clean
readable body text, pixel-icon accents, smooth transitions. The main menu shows the title
over an animated misty crossroads at dawn, a glowing campfire, and eight faint branching
roads, with New Game / Continue / Settings / Credits.

**Audio:** placeholder labels and volume toggles only (e.g. "Town Theme Placeholder"); no
copyrighted music. Small SFX triggers (menu select, dialogue advance, attack hit, shatter,
item use, quest complete) where possible.

**Art:** original placeholder pixel-style sprites built from CSS / SVG / canvas shapes
(e.g. Kael = dark armored figure with red scarf; Edrin = cloaked old healer with staff;
Frost Wolf = icy blue silhouette; Hollow Guard = dark figure with glowing black-sun core).
Composition stays polished even with placeholder art.

## Technology & platform
- **React + TypeScript** frontend, runs directly in the browser.
- Canvas / Pixi / Phaser-style rendering where available; otherwise React components plus
  canvas-style rendering.
- **Desktop-first** with keyboard controls (WASD/arrows move, E/Enter interact, Space
  advance dialogue, Esc menu, Shift dash) and mouse for UI; mobile-friendly on-screen
  controls (virtual joystick, interact, menu) as a secondary layer.
- **localStorage** save/load (location, HP/SP, inventory, quest progress, selected
  character); main-menu Continue loads a save if one exists.
- Expandable, data-driven structure: `characters.ts`, `enemies.ts`, `items.ts`,
  `quests.ts`, `maps.ts`, `dialogue.ts`, `skills.ts`.

## Audience
- **Players** who want a quick, atmospheric, nostalgic-but-premium fantasy RPG experience
  in the browser — fans of HD-2D and classic turn-based JRPGs.
- **The creator / stakeholders** evaluating the prototype as a vertical slice and a
  foundation to expand into the full eight-road campaign.

## Strategic principles
- **Genre homage, never a clone** — original characters, world, names, music, and UI; the
  feeling of HD-2D turn-based fantasy without any copyrighted content.
- **Playable, not a mockup** — interactive movement, real combat, real story flow; never a
  static landing page, menu-only shell, or card game; never sci-fi.
- **Atmosphere and game feel first** — every screen looks intentional and cinematic, in
  service of the emotional north star: lonely, hunted, but destined for something bigger.
- **A slice that scales** — one fully realized path (Kael, Chapter 1) and a clean,
  data-driven foundation ready to grow into all eight travelers and chapters.
- **Implementation priority when constrained:** playable exploration → dialogue & quest
  flow → turn-based battle → Guard Shatter & Momentum → inventory & save → visual polish →
  extra menus.
