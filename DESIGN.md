## Design Guidelines — Chronicles of the Eight Roads

### Tone
Premium, melancholic, dark-fantasy. Cinematic and intentional on every screen. Nostalgic and mysterious, never photorealistic, never generic browser styling. Cold, quiet, dangerous — yet beautiful and expensive.

### Layout
- Dark-fantasy UI **shell** wrapped around a centered **16:9 viewport** (letterboxed, max-width contained, vertically centered).
- Desktop-first. Keyboard: WASD/arrows = move, E/Enter = interact, Space = advance dialogue, Esc = menu, Shift = dash. Mouse for UI.
- Mobile secondary layer: on-screen virtual joystick + interact + menu buttons; combat command buttons tappable.

### Color
- Base panels: deep navy / near-black (#0a0e1a, #10162a) with subtle gradients.
- **Gold borders** (#c8a04e / #e3c372) on panels, frames, selected states; thin double-line fantasy frame treatment.
- Accents: warm candle/torch amber-orange (interiors), cold cyan/ice-blue (snow/shrine/save crystal), faint black-sun violet for mystery moments.
- Text: warm off-white (#ece6d6) body; gold for headings/emphasis. Maintain readable contrast.

### Typography
- Headings: serif-inspired fantasy face (e.g. Cinzel / Marcellus / EB Garamond style), letter-spaced, gold.
- Body / dialogue: clean readable serif or humanist sans; consistent line-height for typewriter text.
- Pixel-icon accents for stats, weaknesses, items, button hints.

### Depth & atmosphere (game feel)
- Layered 2.5D diorama: parallax background mountains/fog, midground set pieces, foreground sprites with soft drop shadows.
- Effects: soft bloom, vignette, fog overlays, animated particles (snow, dust, fireflies, embers), torch/candle flicker, screen shake on Guard Shatter.
- Idle animation: gentle breathing/bobbing on characters and key objects.
- Floating damage numbers; dramatic SHATTERED flash + particle burst.

### Sprites / art
- Original placeholder pixel-style sprites from CSS/SVG/canvas shapes — never copyrighted assets.
  - Kael: dark armored figure with red scarf.
  - Edrin: cloaked old healer with staff.
  - Frost Wolf: icy-blue silhouette.
  - Hollow Guard: dark figure with glowing black-sun core.
- Composition stays polished even with placeholder art.

### UI components
- Dialogue box: bottom-anchored navy panel, gold frame, speaker nameplate + portrait placeholder, typewriter text, blinking continue indicator, optional choice list.
- Combat HUD: turn-order bar (top), command menu (bottom), HP/SP bars with smooth tween, weakness icons, Guard-Point pips, Momentum meter (1-5), scrollable combat log.
- HUD overlay: location name (top-left, fades in on area enter), current objective, mini HP/SP, contextual button hints (bottom).
- Modals: level-up, victory (EXP/coins), game-over (Retry/Load/Title), settings — all in the gold-framed navy panel style with smooth transitions.

### Audio
- Placeholder labels + volume toggles only ("Town Theme Placeholder"); small SFX triggers where possible (menu select, dialogue advance, attack hit, shatter, item use, quest complete). No copyrighted music.

### Transitions
- Smooth fades between areas and into/out of battle; follow camera with easing. Menu selections animate (glow/scale). Every transition should feel deliberate and premium.