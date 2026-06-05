Build a playable browser-based JRPG prototype inspired by classic HD-2D turn-based fantasy RPGs.

IMPORTANT:
Do not copy Octopath Traveler characters, names, logos, story, music, maps, UI assets, exact towns, exact classes, or copyrighted content. Create an original game with a similar genre feeling: pixel characters inside a cinematic 2.5D world, dramatic lighting, turn-based party combat, multiple protagonists, story chapters, towns, exploration, NPCs, quests, and tactical weakness-based battles.

PROJECT TITLE:
“Chronicles of the Eight Roads”

CORE GOAL:
Create a playable vertical slice of an HD-2D-inspired JRPG that runs in the browser. The game should feel like a premium fantasy RPG prototype with exploration, dialogue, town interaction, overworld movement, combat, inventory, party management, and a chapter-based story system.

Use React + TypeScript as the main frontend. Use HTML Canvas, PixiJS, or Phaser-style rendering if possible. If a game engine library is not available, create the game using React components plus canvas-style rendering. The final result must be playable directly in the browser.

GAME STYLE:
The game should feel like a 2.5D pixel-art diorama. Characters are 2D pixel sprites, but the world has depth, atmospheric lighting, soft bloom, vignette, parallax backgrounds, fog layers, warm lantern glow, and cinematic camera framing.

Visual direction:
- Pixel-art characters.
- 2.5D layered environments.
- Fantasy medieval world.
- Warm taverns, misty forests, cobblestone towns, ancient ruins, candle-lit interiors.
- Dramatic light beams.
- Subtle animated particles: dust, fireflies, ember sparks, fog.
- Camera should slightly follow the player.
- Use modern UI polish while keeping a fantasy RPG feel.
- The whole game should feel nostalgic but premium.

Do not use photorealistic art. Use stylized pixel-art-inspired visuals.

SCREEN LAYOUT:
Create a 16:9 game viewport centered on the page.
Around the game viewport, use a clean dark fantasy UI shell.
The game should have:
- Main menu.
- New Game button.
- Continue button disabled or placeholder.
- Settings button.
- In-game HUD.
- Dialogue box.
- Battle screen.
- Party menu.
- Inventory menu.
- Quest journal.
- Character status screen.

MAIN MENU:
The main menu should show:
- Game title: Chronicles of the Eight Roads
- Background: animated misty fantasy crossroads at dawn.
- A small campfire glowing in the middle.
- Eight faint roads branching into the distance.
- Menu buttons:
  1. New Game
  2. Continue
  3. Settings
  4. Credits
- The UI should feel elegant, dark, serif-inspired, fantasy premium.

STORY PREMISE:
The world of Asterra is divided by eight ancient roads, each connected to a forgotten oath. Long ago, eight guardians sealed a force called The Hollow Sun beneath the continent. Now the seal is breaking. Across the world, eight different travelers begin separate journeys, each driven by personal goals. Their stories slowly connect into one larger mystery.

The game should begin with the player choosing one of eight protagonists. For this prototype, fully implement one starting character path, but show all eight character options on the selection screen.

EIGHT PROTAGONISTS:
Create eight original characters. Each should have a unique class, personality, starting town, motivation, and combat role.

1. Kael — The Exiled Knight
- Role: Tank / frontline damage
- Weapon: Sword and shield
- Element: Fire
- Personality: honorable, quiet, haunted by his past
- Motivation: clear his name after being framed for killing the king
- Starting town: Veyrhold, a snowy fortress town

2. Mira — The Runebinder
- Role: Magic damage / debuffer
- Weapon: Staff
- Element: Arcane
- Personality: curious, sarcastic, emotionally guarded
- Motivation: find the missing pages of her master’s forbidden spellbook
- Starting town: Lumenwick, a candle-lit scholar city

3. Rowan — The Wandering Merchant
- Role: Support / money-based skills
- Weapon: Dagger and crossbow
- Element: Wind
- Personality: charming, clever, greedy but kind-hearted
- Motivation: repay a dangerous debt and rebuild his family’s trade guild
- Starting town: Goldmere, a port market city

4. Selene — The Moonlit Dancer
- Role: Buffer / evasive attacker
- Weapon: Fans and daggers
- Element: Moonlight
- Personality: elegant, playful, secretly vengeful
- Motivation: uncover who destroyed her troupe
- Starting town: Mirravale, a desert festival city

5. Bram — The Beast Hunter
- Role: Physical damage / monster capture
- Weapon: Axe and bow
- Element: Earth
- Personality: blunt, loyal, wilderness-minded
- Motivation: hunt the mythical beast that cursed his village
- Starting town: Thornwild, a forest settlement

6. Elian — The Young Cleric
- Role: Healer / holy magic
- Weapon: Mace
- Element: Light
- Personality: gentle, naive, brave when needed
- Motivation: investigate why prayers have stopped reaching the gods
- Starting town: Sancta Vale, a cathedral valley

7. Nyra — The Shadow Thief
- Role: Speed / steal / critical attacks
- Weapon: Twin blades
- Element: Dark
- Personality: witty, distrustful, street-smart
- Motivation: steal back a relic taken from her orphan gang
- Starting town: Duskrun, a rainy criminal district

8. Orin — The Clockwork Scholar
- Role: Utility / gadgets / turn manipulation
- Weapon: Pistol and mechanical tools
- Element: Lightning
- Personality: awkward, brilliant, obsessive
- Motivation: repair an ancient machine that predicts disasters
- Starting town: Gearford, an industrial clocktower city

CHARACTER SELECTION SCREEN:
Create an animated character select screen with eight cards arranged in a circular or grid layout.
Each card should include:
- Character name
- Class
- Starting region
- Short tagline
- Pixel-style portrait placeholder
- Difficulty indicator
- “Select Traveler” button

For the playable prototype, make Kael fully playable. The other seven should show locked or “Coming Soon” but still have full lore cards.

PLAYABLE VERTICAL SLICE:
Fully implement Kael’s Chapter 1 opening.

Kael Chapter 1:
Title: “The Ashen Oath”

Opening:
Kael wakes inside an abandoned mountain chapel after being rescued by an old healer named Edrin. He is accused of murdering King Aldren, but Kael remembers only flashes of a masked figure, a burning throne room, and a black sun symbol. He must escape the snowy region, find evidence of the real murderer, and survive soldiers hunting him.

Playable flow:
1. Start in Abandoned Chapel interior.
2. Talk to Edrin.
3. Learn basic movement and interaction.
4. Receive Rusted Sword and Old Shield.
5. Exit to Snowfield Path.
6. Fight tutorial enemy: Frost Wolf.
7. Reach Veyrhold Outskirts.
8. Talk to NPCs.
9. Discover wanted poster.
10. Enter small dungeon: Frozen Shrine.
11. Fight mini boss: Hollow Guard.
12. End with story reveal: the Hollow Sun symbol appears on Kael’s hand.

LOCATIONS TO IMPLEMENT:
Create at least four playable areas.

1. Abandoned Chapel
- Interior map.
- Warm candle light.
- Broken stained glass.
- Snow visible through cracked walls.
- NPC: Edrin the healer.
- Interactables: bed, old altar, chest, door.
- Chest contains Healing Herb x2.

2. Snowfield Path
- Outdoor snowy route.
- Parallax mountains.
- Falling snow particles.
- Random battle trigger zone or scripted enemy encounter.
- Exit points to Chapel and Veyrhold Outskirts.

3. Veyrhold Outskirts
- Small town edge.
- NPCs walking or standing.
- A blacksmith stall.
- Wanted poster on wall.
- Merchant NPC.
- Save point crystal.
- Town should feel alive even if small.

4. Frozen Shrine
- Short dungeon.
- Blue icy lighting.
- Ancient stone pillars.
- Locked gate requiring a lever.
- Two enemy encounters.
- Final mini boss area.
- End-of-demo story cutscene.

MOVEMENT:
Implement top-down / 2.5D RPG movement.
Controls:
- WASD or arrow keys to move.
- E or Enter to interact.
- Space to advance dialogue.
- Esc to open menu.
- Shift to walk faster or dash.
- Mouse/touch support for UI buttons.

Player should not walk through walls, NPCs, or major obstacles. Use simple collision rectangles.

CAMERA:
Camera follows the player smoothly.
Add slight cinematic zoom in dialogue or cutscenes.
During exploration, camera should be stable and readable.

DIALOGUE SYSTEM:
Create a dialogue system with:
- Speaker name.
- Dialogue text.
- Character portrait placeholder.
- Typewriter text effect.
- Continue indicator.
- Optional dialogue choices.

Dialogue box style:
- Bottom of screen.
- Semi-transparent dark blue/black panel.
- Thin gold border.
- Serif-inspired fantasy typography for names.
- Clean readable font for body.

Sample opening dialogue:

Edrin:
“You’re awake. Good. For a moment, I thought the mountain had claimed you.”

Kael:
“Where am I?”

Edrin:
“An old chapel north of Veyrhold. Far enough from the king’s men, for now.”

Kael:
“The king… I didn’t kill him.”

Edrin:
“Then you’d better live long enough to prove it.”

Add 10–20 dialogue lines in the opening chapel sequence.

NPC INTERACTION:
NPCs should have short dialogue lines.
Examples:
- Town Guard: “The roads are closed. Traitors have a habit of running.”
- Merchant: “Cold weather, colder rumors. Need supplies?”
- Old Woman: “I saw a black mark in the sky the night the king died.”
- Child: “Mister, why is your face on that poster?”

QUEST SYSTEM:
Implement a quest journal.
Main quest:
“Clear Your Name”
Objectives:
1. Speak with Edrin.
2. Take the sword from the chest.
3. Leave the chapel.
4. Survive the Snowfield Path.
5. Inspect the wanted poster.
6. Enter the Frozen Shrine.
7. Defeat the Hollow Guard.
8. Follow the black sun symbol.

Quest UI should show:
- Quest title
- Current objective
- Completed objectives with checkmarks
- Main quest / side quest labels

COMBAT SYSTEM:
Create a turn-based battle system inspired by classic JRPGs.

Battle screen layout:
- Enemy sprites at top/middle.
- Party sprites at bottom.
- Command menu on the right or bottom.
- Turn order bar at top.
- HP/SP bars.
- Weakness icons.
- Status effects.
- Combat log.

Core combat commands:
1. Attack
2. Skills
3. Guard
4. Item
5. Analyze
6. Flee

PLAYER STATS:
Kael:
- Level: 1
- HP: 120
- SP: 30
- Attack: 18
- Defense: 14
- Magic: 6
- Speed: 8
- Crit: 5%

Kael skills:
1. Flame Slash
- Cost: 6 SP
- Fire + sword damage
- Good against ice enemies

2. Shield Bash
- Cost: 4 SP
- Low damage, chance to stun

3. Defiant Guard
- Cost: 5 SP
- Raises defense for 2 turns

4. Ashen Strike
- Cost: 12 SP
- Strong single-target attack unlocked after mini boss or shown locked

ENEMY SYSTEM:
Enemies should have:
- Name
- HP
- Weaknesses
- Resistance
- Attack pattern
- Sprite placeholder
- Break meter / guard meter

Implement these enemies:

1. Frost Wolf
- HP: 45
- Weak to: Sword, Fire
- Attacks: Bite, Howl
- Used in tutorial

2. Bandit Scout
- HP: 60
- Weak to: Shield Bash, Fire
- Attacks: Slash, Throw Knife

3. Ice Wisp
- HP: 40
- Weak to: Sword, Light
- Resistant to: Ice
- Attacks: Frost Spark

4. Hollow Guard
- Mini Boss
- HP: 220
- Weak to: Sword, Fire
- Has 3 Guard Points
- Attacks: Heavy Cleave, Black Sun Pulse, Guard Stance

WEAKNESS / BREAK SYSTEM:
Create an original system called “Guard Shatter.”

Each enemy has Guard Points.
When the player hits an enemy with a weakness, reduce Guard Points by 1.
When Guard Points reach 0:
- Enemy becomes Shattered for 1 turn.
- Enemy loses next action.
- Enemy takes 50% more damage.
- Show dramatic “SHATTERED” visual effect.
- Add screen shake and particle burst.

Do not call it “Break” or “Boost.” Use original names.

MOMENTUM SYSTEM:
Create a resource called Momentum.
At the start of each turn, Kael gains 1 Momentum.
Max Momentum: 5.
Player can spend Momentum to empower attacks:
- 1 Momentum: +20% damage
- 2 Momentum: +40% damage
- 3 Momentum: +70% damage
- 4 Momentum: +100% damage
- 5 Momentum: +150% damage and special flash effect

The battle UI should allow the player to choose Momentum level before using Attack or Skill.

ITEMS:
Implement basic inventory.

Items:
1. Healing Herb
- Restores 50 HP

2. Spirit Plum
- Restores 20 SP

3. Antidote
- Cures poison, placeholder for now

4. Old Iron Sword
- Starting weapon

5. Old Shield
- Starting shield

Inventory UI:
- Item name
- Description
- Quantity
- Use button
- Equipment section

EQUIPMENT SYSTEM:
Basic equipment slots:
- Weapon
- Shield
- Armor
- Accessory

For prototype:
Weapon: Rusted Sword
Shield: Old Shield
Armor: Traveler’s Coat
Accessory: Empty

Equipment should affect stats, even if simple.

SAVE POINT:
Create a glowing blue crystal in Veyrhold Outskirts.
Interacting with it opens:
“Save your journey?”
Buttons:
- Save
- Cancel

Saving can use localStorage.
Save:
- Player location
- HP/SP
- Inventory
- Quest progress
- Character selected

LOAD:
Continue button on main menu should load saved data if available.

SHOP SYSTEM:
Create simple merchant interaction.
Merchant sells:
- Healing Herb — 20 coins
- Spirit Plum — 35 coins
- Traveler’s Charm — 80 coins

Player starts with 100 coins.
Shop UI should allow buy/sell, but selling can be placeholder.

CUTSCENES:
Create simple in-engine cutscenes using movement lock, dialogue, camera focus, fades, and text.

Opening cutscene:
- Fade in from black.
- Snow particles.
- Chapel interior.
- Kael lying on bed.
- Edrin standing nearby.
- Dialogue begins.

Mini boss ending cutscene:
After defeating Hollow Guard:
- Screen darkens.
- Black sun symbol appears on shrine wall.
- Kael’s hand glows with the same mark.
- Kael says: “This mark… was in the throne room.”
- Unknown voice says: “One oath has awakened.”
- Fade to black.
- Show “End of Prototype — Chapter 1 Continues Soon.”

UI DESIGN:
Use a premium fantasy UI style:
- Dark navy / black panels.
- Gold borders.
- Soft glow highlights.
- Clean readable text.
- Pixel icon accents.
- Smooth transitions.
- Menus should not feel plain or default.

HUD:
Exploration HUD should show:
- Current location name.
- Main objective.
- Small minimap placeholder.
- HP/SP small display.
- Button hint: “E Interact | Esc Menu”

MENU:
Press Esc to open menu with tabs:
1. Party
2. Inventory
3. Equipment
4. Skills
5. Quests
6. Settings
7. Save / Load
8. Return to Title

PARTY MENU:
Show Kael’s portrait, level, stats, HP/SP, class, short bio.

SKILLS MENU:
Show skill list with:
- Skill name
- SP cost
- Type
- Description
- Weakness type

QUEST MENU:
Show current quest and completed objectives.

SETTINGS:
Include simple settings:
- Music volume slider placeholder
- SFX volume slider placeholder
- Text speed: Slow / Normal / Fast
- Fullscreen button placeholder
- Controls guide

AUDIO:
If real audio cannot be included, create audio placeholders and UI toggles.
Use labels such as:
- “Town Theme Placeholder”
- “Battle Theme Placeholder”
- “Shrine Ambience Placeholder”
Do not use copyrighted music.

Add small sound effect triggers if possible:
- Menu select
- Dialogue advance
- Attack hit
- Shatter
- Item use
- Quest complete

ANIMATION:
Even with simple placeholder art, add animation feel:
- Player idle breathing.
- Player walking frames or bobbing.
- NPC idle movement.
- Snow/fog particles.
- Torch flicker.
- Battle attack flash.
- Enemy hit shake.
- Damage numbers floating upward.
- Shatter effect.
- Victory screen.

BATTLE FLOW:
When battle starts:
1. Fade transition.
2. Show enemy name.
3. Show command menu.
4. Player chooses action.
5. Resolve action with animation.
6. Enemy responds.
7. Repeat until enemy defeated or player HP reaches 0.

Victory screen:
- “Victory”
- EXP gained
- Coins gained
- Items found
- Continue button

Leveling:
Kael needs 100 EXP for level 2.
Frost Wolf gives 25 EXP.
Bandit Scout gives 35 EXP.
Ice Wisp gives 30 EXP.
Hollow Guard gives 120 EXP.
When leveling up:
- Increase max HP, SP, Attack, Defense.
- Restore some HP/SP.
- Show level up modal.

GAME OVER:
If player HP reaches 0:
- Fade to dark.
- Show “Your journey ends here…”
- Buttons:
  1. Retry Battle
  2. Load Save
  3. Return to Title

MAP STRUCTURE:
Use a simple map data structure.
Each area should define:
- Background layers
- Collision zones
- NPCs
- Interactables
- Exits
- Enemy encounters
- Quest triggers

Create clean TypeScript data files or objects:
- characters.ts
- enemies.ts
- items.ts
- quests.ts
- maps.ts
- dialogue.ts
- skills.ts

The project should be easy to expand later.

RESPONSIVENESS:
The game should work on desktop first.
Add mobile-friendly buttons if possible:
- Virtual joystick placeholder
- Interact button
- Menu button
But desktop keyboard support is priority.

ART PLACEHOLDERS:
Since no external assets are provided, create original placeholder pixel-style sprites using CSS, SVG, canvas shapes, or simple generated blocks.
Use descriptive placeholders:
- Kael: small dark armored pixel figure with red scarf.
- Edrin: old healer with cloak and staff.
- Frost Wolf: icy blue wolf silhouette.
- Hollow Guard: dark armored figure with glowing black sun core.

The visual composition should still look polished, even with placeholder sprites.

DO NOT:
- Do not create a generic landing page.
- Do not only make static mockups.
- Do not only make menus.
- Do not make a card game.
- Do not make it sci-fi.
- Do not use copyrighted Octopath Traveler names, logos, characters, music, maps, or exact UI.
- Do not skip gameplay.
- Do not make combat non-interactive.
- Do not make the player unable to move.
- Do not ignore the story.
- Do not use plain default browser styling.

MUST HAVE PLAYABLE FEATURES:
1. Main menu.
2. Character selection screen.
3. Playable Kael intro.
4. Movement and collision.
5. Dialogue system.
6. At least 4 areas.
7. NPC interactions.
8. Inventory.
9. Quest journal.
10. Turn-based combat.
11. Guard Shatter weakness system.
12. Momentum empowerment system.
13. Mini boss battle.
14. Victory screen.
15. Save/load using localStorage.
16. End-of-prototype cutscene.

QUALITY BAR:
The game should feel like a serious RPG prototype, not a toy demo. Prioritize atmosphere, readability, and game feel. Every screen should look intentional. Use cinematic fantasy styling, polished UI panels, atmospheric backgrounds, and clear interactions.

IMPLEMENTATION PRIORITY:
If time or complexity is limited, prioritize in this order:
1. Playable exploration.
2. Dialogue and quest flow.
3. Turn-based battle system.
4. Guard Shatter and Momentum mechanics.
5. Inventory and save system.
6. Visual polish.
7. Extra menus and optional features.

FINAL OUTPUT:
Generate the complete working app. Include all needed components, data structures, state management, UI, and styling. The user should be able to click New Game, choose Kael, play through the chapel, walk to the snowfield, fight enemies, reach the town, enter the shrine, defeat the mini boss, and see the ending cutscene.