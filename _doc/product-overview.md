# Hangul Roads — Product Overview

## What it is
**Hangul Roads** is a playable, browser-based **Korean language-learning game** presented as
a premium **HD-2D pixel JRPG**. It wraps Duolingo-style daily-habit learning inside a
cinematic **2.5D diorama adventure**: chibi pixel-art characters explore staged worlds with
real depth, dramatic lighting, and atmospheric particles, where **every interaction teaches
Korean** — Hangul
letters, greetings, vocabulary, and grammar — through quests, NPC dialogue, and
learning-driven turn-based battles. It is an **original** game (genre homage, not a clone):
no copyrighted characters, names, logos, story, music, maps, or UI assets are used.

It is a **vertical slice**, not a full game. The goal is a polished, atmospheric prototype
that proves the **learn-by-playing loop**: a returning learner builds a daily Korean habit
because the RPG makes practice feel like an adventure, not a flashcard drill.

## Core concept — learning IS the game
The RPG layer is in service of learning, never decoration. The player learns Korean by
playing:
- **Exploration** moves through chapters of the Korean curriculum (Hangul → greetings → …).
- **NPC dialogue** teaches and quizzes real Korean; progressing a conversation requires
  using the right Korean.
- **Turn-based battles** are powered by answering Korean prompts correctly — combat is an
  engaging assessment, not a skin over generic fighting.
- **Retention systems** (Wordbook, Memory Flame streak, XP/levels) turn one session into a
  daily habit.

## Cast & world
The journey is set in **Haneul Road**, a world where language itself is the magic that holds
things together. The learner plays **Arin**, a traveler who arrives unable to read, guided by
**Bori** — a small, glowing fox-spirit companion. Bori is an **original character** (a guide,
not a mascot clone): they introduce each lesson, offer optional hints, correct wrong answers
warmly and without shaming, and celebrate streaks and wins. Bori is the encouraging voice of
the whole experience and the through-line that ties exploration, dialogue, and battle
together — present in lessons, on the field, and beside the player in combat.

## The playable slice — Chapter 0 & Chapter 1 (a 10-minute prototype)
The prototype covers the first two beats of the journey and proves the full loop end to end.

### Chapter 0 — "The Letter Shrine" (Hangul basics)
The learner begins at the **Letter Shrine**, a cinematic HD-2D diorama where they are
introduced to **Hangul** — the consonants and vowels — through interactive lessons and
quick recognition/recall checks. Reading is the literacy foundation everything downstream
assumes. Clearing the shrine awards XP, records learned letters into the Wordbook, and
unlocks travel onward.

### Chapter 1 — "Dawn Village" (greetings)
In **Dawn Village**, the learner explores a living HD-2D town and meets **NPCs** who teach
and quiz **Korean greetings** (e.g. *annyeonghaseyo* hello, *gamsahamnida* thank you).
Advancing each conversation requires choosing/using the correct greeting, rewarding XP and
new Wordbook entries. The village leads the learner toward the chapter's boss.

### The **Silent Gate** & boss — the **Silence Wisp** (learning-driven battle)
Chapter 1 culminates at the **Silent Gate**, a dramatic third explorable 2.5D area: an
ancient stone gate at the end of a curving path where dark fog leaks out and broken Hangul
floats in the air. The learner walks the gate's approach (still full 4-direction diorama
exploration) until nearing it triggers a cinematic transition into a turn-based HD-2D battle
against the **Silence Wisp**, a spirit that feeds on hesitation. The player attacks by
answering Korean prompts drawn from
Chapters 0–1:
- **Meaning Break** — a correct answer lands an attack on the Wisp.
- **Fluency Combo** — chaining consecutive correct answers builds a combo for escalating
  bonus damage; a wrong answer breaks the combo and costs a turn/HP.
Victory grants XP and a level-up, and the prototype ends on a hook toward the next chapter.

## Signature systems (learning mechanics)
- **Meaning Break** — correct Korean answers (letter recognition, greeting recall, vocab
  meaning) power the player's attacks in battle.
- **Fluency Combo** — consecutive correct answers chain into a combo that escalates reward
  and reinforces recall under light pressure.
- **Wordbook** — a growing record of every Hangul letter, greeting, and vocabulary item the
  player has learned; doubles as a review surface and the battle question pool source.
- **Memory Flame** — a daily streak that tracks consistent practice and frames the
  daily-habit loop (the flame stays lit while the learner keeps coming back).
- **XP & Levels** — progress through lessons, dialogue, and battles raises XP and level,
  giving the adventure a sense of growth tied to real learning.

## Feature scope (must-have playable features)
Letter Shrine Hangul lessons (Chapter 0) · Dawn Village exploration + NPC greeting dialogue
(Chapter 1) · Silent Gate approach (Chapter 1 finale) · HD-2D 2.5D diorama scenes with
4-direction movement, depth sorting, foreground occlusion & parallax · dialogue system
(speaker, portrait, typewriter, Korean answer choices) · learning-driven turn-based battle
vs the Silence Wisp ·
Meaning Break + Fluency Combo mechanics · Wordbook of learned content · Memory Flame daily
streak · XP/level progression · **save/load** so a returning learner resumes where they
left off.

## Emotional north star & learner experience
The guiding feeling is **"I'm actually learning Korean, and I can't wait to come back
tomorrow."** Hangul Roads should feel like a **calm, beautiful, premium adventure** where
every correct answer feels earned and every session leaves the learner a little more
fluent. Practice should never feel like a worksheet; it should feel like progress in a
world worth returning to.

For the learner's **first ten minutes** they should go from "I can't read any of this" to
"I can read Hangul and greet someone in Korean, and I just beat a boss doing it." The
atmosphere stays **warm, encouraging, and confidence-building** — the HD-2D look and game
feel exist to make learning feel rewarding and habit-forming.

**The learning arc (the spine of the prototype):**
1. Arrive unable to read Hangul.
2. Learn the letters at the Letter Shrine and feel the first "I can read this."
3. Step into Dawn Village and use real greetings with NPCs.
4. Win the Silence Wisp battle by recalling what you learned under pressure.
5. Watch the Wordbook fill and the Memory Flame light up.
6. End on the feeling: **"I want to keep my streak going tomorrow."**

## Look, feel & tone
A **premium HD-2D 2.5D pixel diorama**: chibi 2D pixel sprites walking inside staged,
miniature 3D-feeling worlds with real depth, atmospheric lighting, soft bloom, vignette,
parallax, fog, and warm glow. The camera is a **fixed 3/4 diorama view** — angled slightly
downward, near-orthographic, explicitly **NOT top-down, NOT a side-scroller, and with no
visible grid or square tiles**. Exploration is **guided, road-based — not an open plaza**:
the learner sees **handcrafted roads, paths, stairs, bridges, and village streets** receding
into depth and walks **only along them**, never across the open ground. They move in **all
four directions** *within the path*: left/right travels horizontally, while up/down moves
*into and out of* the scene (with diagonals when two directions combine). A pseudo-3D
coordinate system (x horizontal, y depth, z elevation for stairs/bridges/raised areas) drives
the world, and movement is clamped to **organic walkable path polygons** (main road plus side
branches) and stopped by **blocked collision zones**, never a tile grid. Everything off the
path — grass, flower beds, water, cliffs, trees, lanterns, walls, roofs, props, and
background architecture — is **not walkable**, so each area reads like an intentional,
hand-authored route through a 2.5D stage rather than a decorated open floor. The visible road
is the only playable surface: it is clearly brighter/more detailed than its surroundings, has
edges, curves and branches to interaction points (NPCs, Hangul crystals, gates), and is
framed by non-walkable scenery that guides the eye.

The world stops feeling flat through a stack of depth systems, all mandatory:
**y-depth sorting** (characters, NPCs, and props render in front of or behind each other by
depth — Arin walks behind a lantern and is partly covered, or in front of a tablet and
covers it), **foreground occlusion** (trees, roof edges, pillars, stall cloth, tall grass
partly cover the player), **multi-layer parallax** (far sky → deep background architecture →
midground props → walkable ground → foreground occluders → lighting/atmosphere), **slight
scale-by-depth** (Arin shrinks moving deeper, grows moving toward camera), **ground and soft
contact shadows**, **fog at multiple depths**, **bloom around lights**, and a
**vignette / depth-of-field** finish. Each area fills the **16:9 viewport** as a spatial
stage, not a flat illustration, and the **camera smoothly follows Arin** (stronger
horizontally, with a dead zone, never showing empty space past the map edges, and pushing in
for key moments like the Silent Gate battle trigger).

The characters are **chibi pixel humans** — short proportions, big readable heads, simple
expressive pixel faces — with **4-direction walk and idle animations** (toward camera, away,
left, right), feet shadows, and depth sorting. Arin is a tiny traveler with a cloak, satchel,
and glowing notebook; NPCs share the chibi style with distinct outfits and some walk set path
routes; **Bori** is a small floating fox-spirit companion with a tail flame and glow who
trails Arin with a slight delay and is depth-sorted into the scene. **Battles are an HD-2D
2.5D combat stage too** — Arin on the left-mid foreground with Bori beside, the Silence Wisp
on the right-mid background, a ground plane with real depth, foreground objects framing the
shot, and the current area blurred behind — with hit flashes, screen shake, and a Meaning
Break burst of light when the enemy's Confusion Shield breaks.

**UI direction:** a clean, premium shell around a centered **16:9 viewport**, with clear,
highly readable Korean and romanization, gentle glow highlights, smooth transitions, and
prominent surfaces for the Wordbook, Memory Flame streak, and XP/level. Korean text is
always legible; romanization and meaning support beginners.

**Audio:** placeholder labels and volume toggles only; no copyrighted music. Small SFX for
correct/incorrect answers, dialogue advance, Meaning Break, combo build, and level-up where
possible. Optional pronunciation cues for letters/greetings as placeholder labels.

**Art:** original placeholder pixel-style sprites built from CSS / SVG / canvas shapes
(e.g. Arin the traveler-avatar; Bori the glowing fox-spirit companion; friendly Dawn Village
NPCs; the Silence Wisp as a hushed, shadowy spirit). Composition stays polished even with
placeholder art.

## Technology & platform
- **React + TypeScript** frontend, runs directly in the browser.
- Canvas / Pixi / Phaser-style rendering where available; otherwise React components plus
  canvas-style rendering.
- **Desktop-first** with keyboard controls — **WASD / arrow keys for 4-direction movement**,
  Shift to dash, E to interact, Esc for menu, plus advancing dialogue and answering prompts —
  and mouse for UI; mobile-friendly on-screen controls as a secondary layer.
- **localStorage** save/load (chapter progress, Wordbook, Memory Flame streak, XP/level);
  a returning learner resumes their place.
- Expandable, data-driven structure for learning content: Hangul letters, greetings/vocab,
  lessons, dialogue, battle question pools, and chapters — so the curriculum can grow.

## Audience
- **Korean learners** — especially adult self-learners and beginners — who want to build a
  **daily Korean habit** and find flashcard apps dry; they want learning that feels like a
  game.
- **The creator / stakeholders** evaluating the prototype as a vertical slice and a
  foundation to expand into a full multi-chapter Korean curriculum.

## Strategic principles
- **Learning is the game** — every quest, dialogue, and battle teaches or assesses Korean;
  the RPG wrapper exists to make practice rewarding and habit-forming, never decorative.
- **Daily habit by design** — Memory Flame streak, Wordbook, and XP/levels are built to pull
  the learner back tomorrow, Duolingo-style.
- **Genre homage, never a clone** — original characters, world, names, and UI; the feeling
  of HD-2D turn-based JRPGs without any copyrighted content.
- **Playable, not a mockup** — interactive lessons, real dialogue, real learning-driven
  combat, real save/load; never a static landing page or menu-only shell.
- **A slice that scales** — one fully realized path (Chapter 0 Hangul + Chapter 1 greetings)
  on a clean, data-driven curriculum foundation ready to grow into more chapters.
- **Implementation priority when constrained:** Chapter 0 Hangul lessons → Chapter 1
  greetings dialogue → learning-driven battle (Meaning Break / Fluency Combo) → Wordbook +
  Memory Flame + XP → save/load → visual polish.
