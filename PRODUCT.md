## Product: Chronicles of the Eight Roads

A playable, browser-based HD-2D-inspired JRPG **vertical slice** (genre homage, NOT a clone — all original characters/names/world/assets, no copyrighted IP). Goal: a polished, atmospheric, genuinely PLAYABLE prototype — never a static mockup, menu-only shell, or card game; never sci-fi.

### North star feeling
**"Lonely, hunted, but destined for something bigger."** Cold, quiet, dangerous — yet beautiful and expensive. Snow, candlelight, ruined chapel walls, distant mountains, soft glowing magic that read nostalgic, mysterious, premium. The HD-2D look serves this feeling; it is not the goal itself.

### Players
Players wanting a quick, atmospheric, nostalgic-but-premium fantasy RPG in the browser (fans of HD-2D / classic turn-based JRPGs), plus stakeholders evaluating the slice as a foundation to scale to all eight travelers.

### The playable slice — Kael, Chapter 1 "The Ashen Oath"
Kael wakes in an abandoned mountain chapel, rescued by healer **Edrin**. Accused of murdering **King Aldren**, he remembers only flashes of a masked figure, a burning throne room, and a black sun. He must escape the snowy region and survive soldiers hunting him.

Flow: Chapel (talk Edrin, learn movement, get Rusted Sword + Old Shield, chest = Healing Herb x2) → Snowfield Path (Frost Wolf tutorial fight, parallax mountains, snow) → Veyrhold Outskirts (NPCs, blacksmith stall, wanted poster, merchant shop, blue save crystal) → Frozen Shrine (icy dungeon, lever-gated gate, 2 encounters, Hollow Guard mini-boss) → ending cutscene: black sun mark appears on Kael's hand + voice "One oath has awakened" → "End of Prototype — Chapter 1 Continues Soon."

### Build priority (ship the playable spine first; later items may be simplified)
1. Playable exploration + collision across all 4 areas with smooth follow camera.
2. Dialogue system (speaker name, portrait placeholder, typewriter, continue indicator, choices) + quest journal "Clear Your Name" (8 ordered objectives + checkmarks).
3. Turn-based combat (Attack/Skills/Guard/Item/Analyze/Flee; turn-order bar; HP/SP bars; weakness icons; combat log; damage numbers; victory + level-up).
4. Original **Guard Shatter** (hit weakness → -1 Guard Point; at 0 → SHATTERED 1 turn: skip action, +50% damage taken, screen shake + particle burst) + **Momentum** (gain 1/turn, max 5; spend for +20%/+40%/+70%/+100%/+150% damage, chosen before Attack/Skill). Never call these "Break" or "Boost."
5. Inventory + equipment (Healing Herb +50HP, Spirit Plum +20SP, Antidote; weapon/shield/armor/accessory slots), merchant shop (Healing Herb 20, Spirit Plum 35, Traveler's Charm 80; start 100 coins), localStorage save/load (save crystal in town; Continue on main menu loads).
6. Visual polish: atmospheric lighting, bloom, vignette, parallax, fog, dust/firefly/ember particles, torch flicker, idle breathing/bobbing.
7. Menus: main menu (New Game/Continue/Settings/Credits over animated misty crossroads w/ campfire + 8 faint roads); character select (8 lore cards — Kael playable, other 7 "Coming Soon"); Esc menu tabs (Party/Inventory/Equipment/Skills/Quests/Settings/Save-Load/Return to Title); settings (volume/text-speed/controls placeholders); HUD (location name, objective, mini HP/SP, button hints).

### Combat content
- **Kael (L1):** HP120, SP30, ATK18, DEF14, MAG6, SPD8, Crit5%. Skills: Flame Slash (6SP fire+sword), Shield Bash (4SP low dmg + stun chance), Defiant Guard (5SP +DEF 2 turns), Ashen Strike (12SP strong single-target, locked until after mini-boss).
- **Enemies:** Frost Wolf (HP45, weak Sword/Fire, 25EXP, tutorial), Bandit Scout (HP60, weak ShieldBash/Fire, 35EXP), Ice Wisp (HP40, weak Sword/Light, resists Ice, 30EXP), **Hollow Guard** mini-boss (HP220, weak Sword/Fire, 3 Guard Points, 120EXP).
- 100 EXP to L2; level-up raises max HP/SP/ATK/DEF and restores some HP/SP via modal.

### The eight travelers (selection screen lore cards)
Kael (Exiled Knight, sword & shield, Fire, framed for king's murder — **playable**); Mira (Runebinder, Arcane); Rowan (Wandering Merchant, Wind); Selene (Moonlit Dancer, Moonlight); Bram (Beast Hunter, Earth); Elian (Young Cleric, Light); Nyra (Shadow Thief, Dark); Orin (Clockwork Scholar, Lightning). Only Kael playable; rest "Coming Soon."

### Strategic principles
- Genre homage, never a clone — original everything.
- Playable, not a mockup — real movement, real combat, real story flow.
- Atmosphere and game feel first; every screen cinematic and intentional.
- A slice that scales — clean data-driven foundation (characters.ts, enemies.ts, items.ts, quests.ts, maps.ts, dialogue.ts, skills.ts) ready to grow.
- Priority when constrained: exploration → dialogue/quest → battle → Guard Shatter/Momentum → inventory/save → polish → extra menus.