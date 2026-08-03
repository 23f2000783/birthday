# Build Spec — "For Her" · An Interactive Friendship Day Canvas

> This is the canonical brief for this project. **Keep it updated whenever the build
> changes.**
>
> - **Part I** (§0–§9) — the main scroll site. Implementation log in §9.
> - **Part II** (§10–§20) — **The Studio**, the three-game room unlocked after signing.
>   Implementation log in §20.
> - **Part III** (§21–§31) — **v2 additions**: living background, main-site download,
>   the Instagram reveal, the Coloring Lab, My Collection, sound; §30 is the v3
>   artwork pass, warmer audio and hidden details. **Supersedes I–II
>   where they disagree** — read it first.
> - **Delivery target: mobile browsers.** This is opened on a phone, essentially always.
>   Every layout, tap target, and motion decision is made for a 360–430px portrait screen
>   first; desktop is the graceful widening, not the reference case.

---

## 0. One-line thesis

**A blank canvas that She fills as she scrolls — she doesn't realize she's painting
the whole page until the end, when she looks back and sees the finished piece was her
doing all along.** The site is an argument, in interaction form, against her habit of
underestimating herself.

Every design and motion decision must serve that thesis. Cut anything that doesn't.

---

## 1. Who it's for (drives tone + copy)

She is a painter — genuinely skilled. She is positive, quietly spiritual (believes
someone is watching over everyone), gentle with animals, the eldest child carrying
responsibility for her home. Her one flaw is aimed only at herself: she overthinks her
own capability and doubts her ceiling. The site should make her feel *seen* and end on
"you can fly higher than you think."


---

## 2. Tech stack (use exactly this — no WebGL)

- Vanilla **HTML + CSS + JS** (no framework needed; keep it deployable to GitHub Pages).
- **GSAP 3.14** + **ScrollTrigger** (via CDN) — all scroll-driven, directed motion.
- **Lenis** (via CDN) — smooth momentum scroll, paired with GSAP's ticker.
- **Canvas 2D** for (a) the real paint tool and (b) the ambient brush-glow cursor trail.
  Do NOT use Three.js/WebGL — it's overkill and a mobile perf liability.
- Fonts via Google Fonts: **Fraunces** (display, use optical sizing / `opsz`),
  **Instrument Sans** (body), **Space Mono** (captions / "artist's notes").
- Paper/canvas grain: a subtle SVG `feTurbulence` noise overlay at low opacity, fixed.

**Non-negotiable quality floor:**
- 60fps target; throttle canvas trail with `requestAnimationFrame`, cap particle counts.
- Full `prefers-reduced-motion` support: replace paint-wipes/stroke-draws with simple
  fades, disable the cursor trail, keep every section readable and functional.
- Responsive to 360px; the paint tool must work with touch events (pointer events).
- Visible keyboard focus states; all interactive controls reachable and labeled.
- Respect that GSAP ScrollTrigger + Lenis must be synced (call `ScrollTrigger.update`
  on Lenis scroll, and drive `lenis.raf` from `gsap.ticker`).

---

## 3. Art direction

### Palette — "Studio Light" (a painter's palette, NOT candy colors)
| Token | Hex | Role |
|---|---|---|
| Gesso White | `#F7F4EF` | canvas / page background |
| Ink | `#22201C` | text, charcoal sketch lines |
| Cadmium | `#E8552D` | warm accent (oil-paint orange) |
| Ultramarine | `#2B4A8B` | cool accent |
| Viridian | `#1F7A5A` | green pigment |
| Naples Yellow | `#F2C14E` | highlight pigment |

Accents must read as **pigment** (textured, slightly irregular, painterly edges) — never
flat UI color fills. Use the four pigment colors as the paint-tool palette.

### Typography
- **Display:** Fraunces, large, soft, a little wobbly — hand-made warmth suited to an artist.
- **Body:** Instrument Sans — clean, gets out of the way.
- **Captions / margin notes:** Space Mono, small, used like an artist's pencilled
  annotations in the margins (e.g. `est. class 6 · 2014`).

### Texture
Faint paper grain over everything (fixed SVG noise, ~4–6% opacity). This one detail sells
"real canvas" and keeps it from feeling like sterile glassmorphism.

---

## 4. Sections (each is a beat in the scroll-painted story)

### Section 1 — The blank canvas (hero)
- Opens nearly empty: a faint **pencil-sketch outline** of "Happy Friendship Day, She."
- On load, an SVG **stroke-draw** animation paints the letters in with ink (animate
  `stroke-dashoffset`). Fraunces, large.
- A **brush-glow cursor trail** follows the mouse/finger across the whole page (soft
  radial pigment glow on the ambient canvas layer).
- Margin note in Space Mono: `est. class 6 · 2014`.
- Subtle scroll cue ("↓") that fades as she scrolls.

### Section 2 — The paint-reveal counter
- The friendship day-count is initially **hidden under a paint smear**; on scroll the
  smear **wipes away** (GSAP + a canvas/SVG mask) to reveal `X,XXX days since Class 6`.
- Count is computed live from an editable origin date (see §6, `MEET_DATE`).
- A few honest one-line stats beside it in Space Mono (e.g. `1 canvas, infinite range`).

### Section 3 — "Pick up the brush" (THE SIGNATURE — real paint tool)
- A genuinely working **Canvas 2D paint tool**. She can draw with cursor/finger.
- Palette of the four pigments + brush size; strokes bloom with slight softness/texture.
- Faint centered guide text `draw something 🖌️` that clears on first stroke.
- After she draws, a gentle line appears: `that's going in the museum.`
- Include a subtle **Clear** control. Must feel great on touch (pointer events, no lag).
- Ambient trail is suppressed inside this canvas so painting feels precise.

### Section 4 — "The She Museum" (quiz reframed as a personality reveal)
Museum-placard styled cards that **pin onto a gallery wall** as she scrolls (GSAP).
It is NOT trivia — there are **no wrong answers**. Every choice is celebrated, and every
path leads to the same warm conclusion. Gen-Z, playful, modern voice.

Questions + options (all options are "correct" / affirming):
1. **"Blank canvas appears. First instinct?"**
   - make a mess first, fix it later · stare at it for 3 hours · already have 4 ideas · trust it'll come
2. **"Your art gets 3 likes instead of 300. You:"**
   - post it anyway, it's mine · already onto the next one · save it for me, not the feed · shrug, keep painting
3. **"Someone says 'you should paint more like [famous artist].' You:"**
   - nah, I paint like She · take the note, keep my soul · smile and do my own thing · already unmatched, thanks
4. **"The realest flex?"**
   - liking my own work before anyone else does · finishing the hard piece · being gentle when it's hard · showing up for everyone
5. **"Who's watching over all of this?"**
   - someone up there, always · the people I carry · me, quietly · all of the above 🙏

**Final placard (the reveal, shown after Q5):**
> **Diagnosis: You are your own favourite artist — and that's the masterpiece.**
> The care you pour in is the whole point. Keep going.

Trigger a small pigment-confetti burst on reaching the final placard.

### Section 5 — The finished painting (the letter)
- As she reaches this section, the brush-strokes/pigments accumulated through the scroll
  **assemble into one finished abstract painting** behind the letter (GSAP timeline that
  fades/composites collected stroke layers into a composition). This is the emotional
  reveal — "you painted this whole thing."
- The letter sits on top like a **signed gallery placard**. Use the EXACT copy in §5a.

#### 5a. Letter copy (use verbatim)
```
She,

Somewhere along the way you became the person everyone leans on — the eldest,
the responsible one, the one who holds it together when things get hard. You do it
quietly, without asking for anything back, gentle with every living thing that crosses
your path, quietly certain that someone up there is watching over all of us.

You put so much of yourself into everything — every canvas, every effort, every late
thought about whether it was good enough. And here's what you keep missing: it always
is. The care you pour in shows. The work is beautiful because you are the one who made
it, and you make things the way only you can.

The only person who ever doubts her is herself only. You wonder if you're enough, if you can,
if there's a ceiling. There isn't. There never was. The limit you're so sure you're
standing under — you've been above it this whole time.

You just painted this entire page and didn't even notice you were doing it. That's you,
every single time. So look at what you made. Then go fly — you were always meant to.

Happy Friendship Day. 🎨

— Nishant
```

### Section 6 — Sign the canvas (send-off)
- Invite her to **sign** — a small canvas where she draws her initials.
- On signing, a final flourish of **pigment-confetti** and a soft line:
  `signed, and hung where it belongs.`
- Footer: `made for She · with paint and pixels`.

---

## 5. Motion language (the "directed" part — this is what wins)

- **Lenis** smooth scroll everywhere; page glides.
- **GSAP ScrollTrigger** drives every reveal so **She controls the pace**: the hero
  stroke-draw, the counter smear-wipe, museum placards pinning to the wall, the final
  painting assembly.
- Micro-interactions: brush-glow cursor; paint-splat ripple on button clicks; placards
  lift/settle as if pinned; letter placard fades up last.
- Choreography over decoration — motion should feel like a director staged it, not like
  scattered library effects. One orchestrated moment per section beats five random ones.
- `prefers-reduced-motion`: swap all of the above for gentle opacity fades; disable trail.

---

## 6. Editable config (put at top of the JS, clearly commented)

```js
const FRIEND_NAME = "She";
const YOUR_NAME   = "Nishant";
const MEET_DATE   = "2014-06-01"; // approx Class 6 start — adjust to taste
// LETTER_TEXT: exact copy from §5a
// MUSEUM_QUESTIONS: the array from §4
// PIGMENTS: ["#E8552D","#2B4A8B","#1F7A5A","#F2C14E"]
```

Everything a non-coder would want to change (names, date, letter, quiz text) lives in one
labeled block. No other file edits required to personalize.

---

## 7. File structure & delivery

```
index.html   — structure + CDN links (GSAP, ScrollTrigger, Lenis, fonts)
style.css    — all styling, tokens as CSS custom properties, paper-grain, responsive
script.js    — editable config block + Lenis/GSAP setup + all interactivity
README.md    — how to personalize + GitHub Pages deploy steps
SPEC.md      — this document (kept in sync with the build)
```

Deploy target: **GitHub Pages** (static, no build step). README must include the
`git init → push → Settings ▸ Pages ▸ deploy from main` walkthrough and the resulting
`https://USERNAME.github.io/REPO/` link format.

---

## 8. Definition of done (self-check before finishing)

- [x] Hero letters stroke-draw in on load; brush-glow trail follows pointer.
- [x] Counter smear wipes on scroll to reveal real day-count from MEET_DATE.
- [x] Paint tool actually draws (mouse + touch), 4 pigments, brush size, clear.
- [x] Museum: 5 affirming placards pin on scroll; final "own favourite artist" reveal + confetti.
- [x] Final painting assembles behind the letter; letter copy exact (§5a).
- [x] Sign-the-canvas works; pigment-confetti send-off.
- [x] 60fps on a mid phone; prefers-reduced-motion path fully works.
- [x] Responsive to 360px; keyboard focus visible; controls labeled.
- [x] All personalization in one config block; README has Pages deploy steps.

Build it like it's going in a gallery. It is.

---

## 9. Implementation log (keep this current)

### 9.1 Build v1 — 2026-08-02

**Files shipped:** `index.html`, `style.css`, `script.js`, `README.md`, `SPEC.md`.

**Libraries (CDN, pinned):**
- GSAP `3.14.0` + ScrollTrigger — jsDelivr.
- Lenis `1.1.18` — jsDelivr, global `Lenis`.
- Google Fonts: `Fraunces` (axes `opsz,wght,SOFT,WONK`), `Instrument Sans`, `Space Mono`.

**Architecture notes:**
- `script.js` is split into numbered blocks: (1) CONFIG, (2) utils, (3) boot/feature
  detection, (4) smooth scroll, (5) ambient canvas, (6) hero, (7) counter, (8) paint
  tool, (9) museum, (10) painting assembly, (11) signature, (12) reveals/resize.
- **Brush sprites**: radial dabs are pre-rendered once per pigment into offscreen
  canvases and blitted with `drawImage`. Avoids creating a gradient per dab — this is
  what keeps the paint tool and trail at 60fps on mobile. Two falloff curves
  (`FALLOFF.firm` / `FALLOFF.soft`): *firm* has a loaded-brush core and is used for real
  brushwork (paint tool, her strokes in the final painting, the signature); *soft* is a
  wide bloom used for the cursor trail and the painting's background washes. Using one
  shared soft falloff made strokes read as airbrush — the split is what makes them read
  as pigment.
- **Ambient canvas** (`#ambient`, fixed, full-viewport) hosts *both* the cursor trail and
  all pigment-confetti/splat bursts. Trail decay is a `destination-out` fill each frame;
  the RAF loop self-parks after ~90 idle frames and restarts on pointer activity.
- **Collected art**: `Art.trail` (throttled, normalized pointer samples), `Art.strokes`
  (paint-tool strokes, normalized), `Art.choices` (museum answers) and `Art.signature`
  feed §5's composition. All coordinates are normalized 0–1 so the painting re-renders
  correctly on resize.
- **Painting assembly** builds a flat, layer-ordered `marks[]` array and draws it
  *incrementally* as the GSAP tween progresses (`drawnUpTo` cursor), redrawing from
  scratch only on rewind or resize.
- **Fallbacks**: if she never draws, the composition is synthesized from a seeded PRNG +
  her museum answers, so the reveal is never empty. If GSAP/Lenis fail to load, the
  `js-motion` class is never added and every section renders statically visible.

**Deliberate deviations from the brief (all within its spirit):**
1. **Museum placards** use per-card ScrollTrigger *entrance* choreography (drop + rotate
   + settle onto a visible brass pin) rather than `ScrollTrigger.pin`. `pin` on a stacked
   card sequence is a known jank source on mobile Safari and would violate the 60fps
   floor; the "pinned to the wall" read is achieved visually instead.
2. **`MUSEUM_QUESTIONS` options are objects** (`{label, note}`) rather than bare strings,
   so every option carries its own affirming micro-response. Keeps "every choice is
   celebrated" literal, and keeps that copy inside the one editable config block.
3. **Paper grain** is the `feTurbulence` SVG inlined as a `data:` URI background-image
   (rasterized once, tiled) rather than a live `filter: url(#grain)` on a fixed element —
   same visual, no per-composite filter cost.
4. **Hero stroke-draw** uses a fixed `stroke-dasharray` per line (SVG `<text>` has no
   `getTotalLength()`), with an auto-fit pass that shrinks lines wider than the viewBox.
5. Added a small extra beat in §2: a `that's about NN years of you.` sub-line under the
   day count. Config-editable.
6. The painting's gallery label sits **top-left** of the stage, not bottom-left — the
   letter placard's negative top margin cropped it at the bottom.

**Gotchas worth remembering before touching this code:**
- `setPointerCapture` is wrapped in `try/catch`. Without it, a refused capture throws
  inside `pointerdown` and silently kills drawing for that stroke.
- `pointerleave` is deliberately **not** bound to end a stroke — with capture active it
  fires the moment the pointer crosses the canvas edge and cuts the stroke short.
- `touch-action: none` is needed on `#paintCanvas` and `#signCanvas` **themselves**, not
  just their wrappers, or the page scrolls out from under her finger while she draws.
- Nothing may carry both `data-reveal` and its own explicit reveal tween — that double-
  animates the element. `.letter-placard` and `.hero__sub` are choreographed by hand and
  therefore carry no `data-reveal`.
- CSS hides `[data-reveal]` and the hero letterforms only under `html.js-motion`, which
  `script.js` adds *after* confirming GSAP loaded. Keep it that way: it's the reason a
  failed CDN degrades to a readable page instead of a blank one.

**Verification (2026-08-02, headless Chromium):** all six sections exercised end-to-end —
hero stroke-draw, smear-wipe + live count (4,445 days), mouse *and* real touch drawing,
all five placards + unlock, painting assembly, signature → confetti. Zero console or page
errors across three passes (desktop, 360/390px mobile with touch, `prefers-reduced-motion`).
Confirmed no horizontal overflow at 360px, that the page does not scroll while drawing by
touch, and that no element is left stuck at `opacity: 0` under reduced motion.

**Personalization surface:** everything is in the `CONFIG` block at the top of
`script.js` — names, `MEET_DATE`, margin note, stats, all museum copy, final placard,
letter text, pigments. No other file needs editing.

---
---

# PART II — THE STUDIO

> A second gift, unlocked after she signs the canvas in §4 Section 6. Three gentle games.
> Same rule as the main site: build it like it's going in a gallery. It is.

---

## 10. Concept & emotional arc

After She finishes the main experience (signs the canvas in Section 6), a hidden door
appears: **"The Studio."** It's a second gift she unlocks, not just more scrolling.

Inside are three gentle games. The order is deliberate and emotional:

1. **Restoration Room** — she brushes dust off a faded canvas and finds her own portrait
   underneath. (self → *"you were always lovely"*)
2. **Color Mix Lab** — she mixes pigments; each blend unlocks a short color-memory.
   (feeling → *"your colors hold meaning"*)
3. **Paint-by-Scroll** — small actions fill in a hidden picture: a little girl playing
   with a dog. (innocence → *"the joy you started with"*)

**Arc: find yourself → feel your colors → return to childhood joy.**

No timers, no scores, no fail states. Gentle over challenging. Every game ends with a
downloadable image (subtly marked *for She · from Nishant*) she can save and share
however she likes.

---

## 11. Reuse from the main site (do not redefine)

- Same stack: vanilla HTML/CSS/JS, GSAP 3.14 + ScrollTrigger, Lenis, Canvas 2D.
- Same palette (Gesso White `#F7F4EF`, Ink `#22201C`, Cadmium `#E8552D`,
  Ultramarine `#2B4A8B`, Viridian `#1F7A5A`, Naples Yellow `#F2C14E`).
- Same fonts (Fraunces / Instrument Sans / Space Mono) and paper-grain overlay.
- Same accessibility floor: `prefers-reduced-motion`, touch support (pointer events),
  keyboard focus, responsive to 360px, 60fps target.
- **Downloads:** render the result to an offscreen canvas and trigger a PNG download
  (`canvas.toBlob` → object URL → `<a download>`).

---

## 12. The unlock

- On completing the main site's "Sign the canvas" (Section 6), reveal an
  **"Enter The Studio →"** door/button (GSAP: the door "opens," pigment spills through).
- The Studio is its own route (`studio.html`) so it feels like a distinct room she can
  revisit.
- Persist unlock with a simple in-memory/URL flag — **NOT `localStorage`**, not supported
  in this environment. Simplest: link directly to `studio.html`; the "unlock" is narrative.
- Studio landing: three framed "canvases on easels," one per game, that she picks from.
  Gentle intro line (Fraunces): *"Welcome to the studio. Take your time."*

---

## 13. Game 1 — Restoration Room

**Mechanic:** A canvas shows a faded, dust-greyed version of She's stylized portrait.
She brushes/taps to remove the dust layer; color is revealed underneath where she brushes.
As coverage crosses thresholds, short restoration lines fade in one at a time.

**The portrait** (no photo needed): a stylized profile silhouette of a young woman, hair
loosely tied, chin lifted slightly upward (looking up, not down — the "reaching / go fly"
posture built into the pose), rendered in the pigment palette, not realistic skin tones.
Build it as an SVG or a pre-drawn canvas layer that's easy to swap for a real photo-traced
silhouette later (**clearly comment the swap point**).

**Reveal technique:** two stacked canvases (or one canvas + `destination-out`):

- Bottom = the coloured portrait.
- Top = a grey "dust" layer; brushing erases dust
  (`globalCompositeOperation = 'destination-out'`) to expose the portrait beneath.
  Soft round brush.

**Restoration lines** (fade in at ~15/35/55/75/90/100% uncovered):

1. "Some things fade. Your worth was never one of them."
2. "The dust settles on everything but the good in you."
3. "What's underneath was always lovely — it just waited to be seen."
4. "Keep your heart light. The best is still ahead."
5. "Clear away the doubt, and there you are — enough, all along."
6. *(at 100%)* "This is you. Just as you always were. 🤍"

**Finish:** at full reveal, the portrait gently saturates/blooms; offer **"Save this"**
(downloads the restored portrait with the final line + *for She · from Nishant*).
Reduced-motion: skip bloom, keep reveal + lines.

---

## 14. Game 2 — Color Mix Lab

**Mechanic:** Two pigment wells; she drags one blob into another (or taps two pigments) to
mix them on a small canvas. When a mix lands near one of the defined blends, a short
color-memory fades in and that swatch is "collected" onto her palette.

**Gentle, not a match-race:** no timer, no score. Exploring is the point. Optional soft
target ("try for a green") but any pleasing mix is celebrated. Collected swatches build a
personal palette strip at the bottom.

| Mix | Result | Memory line |
|---|---|---|
| Cadmium + Naples Yellow | warm orange | "a morning that goes well." |
| Ultramarine + Ink | deep blue | "a quiet, private prayer." |
| Viridian + Naples Yellow | green | "growing, slow and certain." |
| Cadmium + white | soft rose | "gentleness for small creatures." |
| Naples Yellow + touch Cadmium | gold | "the light you carry home." |
| Ultramarine + Cadmium | violet | "a ceiling, about to be painted past." |

**Mixing model:** simple subtractive-ish blend is fine (average RGB with slight
darkening), then snap to nearest defined blend within a tolerance to trigger its memory.
Make blobs feel gooey/soft (radial gradients, slight wobble).

**Finish:** when she's collected several, assemble them into a tidy **"She's Palette"**
card she can download (swatches + their memory phrases + *for She · from Nishant*).

---

## 15. Game 3 — Paint-by-Scroll

**Mechanic:** One hidden picture — a little girl playing with a dog, animated/illustrated
style — divided into regions. Completing small gentle actions fills one region each, in
colour, until the full scene is revealed and gently animates (the dog wags, the girl bobs).

**Actions that fill regions** (each simple, ~6–10 regions): e.g. pop a soft bubble, tap a
falling leaf, drag a brush across a patch, answer a one-tap affirming prompt, mix a dab of
colour. Reuse simple interaction primitives from the main site. Gentle, unmissable — she
cannot "lose," only progress.

**Final image:** stylized, warm illustration of a young girl mid-play with a happy dog
(nods to childhood + her gentleness with animals). Build as **layered SVG** so regions can
be individually revealed/coloured and the finished scene can do a light idle animation
(tail wag, ear bounce) via GSAP. **Comment it as easy-to-replace art.**

**Copy:** opening (Space Mono): `fill it in, one little moment at a time.`
On completion (Fraunces): *"There it is — the joy you started with."*

**Finish:** the completed, gently animating scene; **"Save this"** downloads a static frame
with the line + *for She · from Nishant*.

---

## 16. Sharing (static-host friendly)

No backend. For every "Save this":

- Compose the result on an offscreen canvas at ~**1080×1350** (nice for phone/IG).
- Add a small footer mark: `for She · from Nishant · Happy Friendship Day`.
- `canvas.toBlob()` → object URL → programmatic `<a download="She-studio.png">`.
- Optional: a "Share" button that, if `navigator.share` + files are supported, opens the
  native share sheet with the image; otherwise falls back to download.
  (**Progressive enhancement only — download is the guaranteed path.**)

---

## 17. Editable config (top of the studio JS, commented)

```js
const FRIEND_NAME = "She";
const YOUR_NAME   = "Nishant";
// RESTORATION_LINES: the 6 lines from §13
// COLOR_BLENDS: the table from §14 (mix -> resultColor -> memory)
// PAINT_REGIONS: region list + final scene art reference (§15)
// EXPORT_MARK: "for She · from Nishant · Happy Friendship Day"
// PORTRAIT_SWAP: clearly marked line to replace silhouette with a real photo-traced one
// SCENE_SWAP: clearly marked line to replace the girl+dog art
```

Everything personal lives in one labeled block. Art assets clearly marked as replaceable.

---

## 18. Motion & feel

- Studio entrance: door opens, pigment spills, easels fade up (GSAP timeline).
- Each game framed like a canvas on an easel; picking one "walks up" to it (scale/parallax).
- Restoration: soft brush cursor; lines fade like ink blooming.
- Mix Lab: gooey blob physics; collected swatch "plinks" onto the palette strip.
- Paint-by-Scroll: each region fills with a soft wipe; final scene idle-animates.
- Between games: a calm "back to the studio" transition, never jarring.
- `prefers-reduced-motion`: all of the above become gentle opacity fades; games stay fully
  playable.

---

## 19. File structure

```
studio.html   — the three-game room (linked from main site's Section 6 unlock)
studio.css    — reuses main tokens; studio-specific layout
studio.js     — editable config + Lenis/GSAP setup + all three games + export
```

Keep the editable config and replaceable-art comments obvious.

### Definition of done

- [x] Studio unlocks from main site's "Sign the canvas" via an "Enter The Studio" door.
- [x] Restoration: brush reveals the upward-gazing silhouette; 6 lines fade in on
      thresholds; final bloom; downloadable result.
- [x] Mix Lab: mixing triggers the 6 short memories; collected palette; downloadable card.
- [x] Paint-by-Scroll: gentle actions fill regions; girl+dog scene completes and
      idle-animates; downloadable frame.
- [x] Every game exports a marked PNG (download guaranteed; native share as enhancement).
- [x] Palette/fonts/grain/motion match the main site; reduced-motion path works.
- [x] Touch + keyboard friendly; responsive to 360px; 60fps.
- [x] Personal content + replaceable art in one clearly-commented config block.

---

## 20. Studio implementation log (keep this current)

### 20.1 Build v1 — 2026-08-02

**Files shipped:** `studio.html`, `studio.css`, `studio.js` (plus the mobile-first pass on
the main site and the unlock door in Section 6).

**Architecture:**
- `studio.js` blocks: (1) CONFIG, (2) shared utils + export, (3) boot + view router,
  (4) entrance, (5) Restoration Room, (6) Colour Mix Lab, (7) Paint-by-Scroll.
- **View router, not scroll sections.** On a phone each game is a full-screen panel; the
  landing is the only scrolling view. Transitions are GSAP cross-fades with a scale
  "walk-up," and every game is fully reachable by keyboard.
- **Export pipeline** is one shared `exportCard({ title, line, draw })` used by all three
  games: 1080×1350 offscreen canvas, gesso ground + procedural paper grain, the game's own
  `draw(ctx, W, H)` callback, then the `EXPORT_MARK` footer. `toBlob` -> object URL ->
  `<a download>`, with `navigator.canShare({files})` tried first when available and the
  download always kept as the guaranteed fallback.
- **Region wipes (§15)** are generated, not authored: for every `[data-region]` group in
  the inline SVG, JS reads its `getBBox()`, builds a `<clipPath>` holding a zero-width
  `<rect>`, and GSAP animates the rect's `width`. Swapping the art means swapping the SVG
  and keeping the `data-region` attributes — no JS edits.

**Deliberate deviations (all within the brief's spirit):**
1. **Mix Lab matches by recipe, not RGB distance.** §14 suggests snapping to the nearest
   blend within a colour tolerance. Two of the six targets — *warm orange* (Cadmium+Naples)
   and *gold* (Naples + touch Cadmium) — land ~28 units apart in RGB, so any tolerance
   loose enough to feel gentle would collide them and fire the wrong memory. Matching on
   the reduced ingredient ratio (1:1 vs 2:1) is unambiguous, order-independent, forgiving
   of how many drops she adds, and makes "a touch of" a real, discoverable mechanic. The
   *displayed* bowl colour still uses the average-with-darkening model from §14, and eases
   to the blend's stated `resultColor` on a match so the promised colour always appears.
2. **Unrecognised mixes are celebrated too** ("a colour that doesn't have a name yet"), so
   exploring is never a dead end — §14 asks for this but lists no copy.
3. **Tap-to-add, not drag-to-mix.** Dragging a blob into a bowl is unreliable under a thumb
   on a 360px screen. Tapping a well flings a gooey blob into the bowl — same gooey feel,
   far better hit rate.
4. **Restoration auto-completes above 97% uncovered.** Chasing the last few dust pixels is
   frustrating and reads as a fail state, which §10 forbids.

**Mobile-first pass on the main site (same build):**
- Tap targets raised to >=44px on coarse pointers; `env(safe-area-inset-*)` respected.
- The ambient cursor trail is disabled for coarse/touch pointers — on a phone every
  pointermove is a scroll gesture, so the trail just smeared pigment while she read, and it
  cost frames. It stays on for mouse users. **The path is still recorded either way**, so
  §5's final painting is still built from where her finger actually went.
- Paint/sign canvases and the painting stage re-proportioned for portrait screens.
- Section 6 gained the **Enter The Studio** door (panels split, pigment spills through).
- `overscroll-behavior: none` so the page doesn't rubber-band past its ends.

**The portrait (PORTRAIT_SWAP) — how it's built, and why:**
It is one continuous *cameo* path: head, tied-back hair and shoulders in a single outline,
filled Ultramarine, with the hair painted in afterwards as a clipped shape whose front
edge is a deliberate hairline. Three earlier attempts failed and are worth not repeating:
overlaying the hair as its own shape read as a headband/headphones; shading the hair with a
left-to-right gradient left no legible hair/face boundary; and letting the hair region run
straight down past the jaw turned the neck into a black slab. The rim light is a *stroke*
straddling the profile edge (not a clipped fill), which is what keeps it aligned to the
face. The bun is a lobe in the silhouette itself, not a separate circle.

**Verification (2026-08-02, headless Chromium, mobile emulation @390×844 + 360×640):**
All three rooms played end-to-end with real CDP touch events — dust brushed to 100% and the
six restoration lines fired on their thresholds; all six blends discovered by recipe
(including the 2:1 gold that RGB matching would have collided with warm orange); all nine
paint regions filled across all five action types. Every room produced a real PNG
(298–312 KB restoration, ~148 KB palette, ~123 KB scene). The phone back button leaves a
room instead of the site. Confirmed: no horizontal overflow at 360px or 390px, the page
does not scroll while she draws by touch, the ambient trail is genuinely off on touch
(0 painted pixels), the door opens and navigates to `studio.html`, and under
`prefers-reduced-motion` the entrance is skipped, the ambient layer is off, nothing is left
at `opacity: 0`, and Paint-by-Scroll still completes to 9/9. **Zero console or page errors
across every pass.**

---
---

# PART III — v2 ADDITIONS (current build)

> v2 supersedes Parts I–II where they disagree. Everything below is **built and
> verified**; the logs in §9 and §20 still describe the v1 groundwork they sit on.

---

## 21. Living background (main site §3 + studio §1)

Instead of a flat page colour, both pages share a **slow, continuously shifting
artistic gradient** — soft tints of the pigment palette drifting like wet paint.

**Built as:** four `.living-bg__blob` spans, each a radial-gradient of one pigment,
drifting on out-of-phase 38/46/52/44-second `alternate` loops. Only `transform`
animates, so it stays on the compositor and costs no layout or paint work.
`html` holds the gesso; `body` is transparent; `main`/`.footer` ride above at `z-index: 1`.

**Deliberate call — it is quieter than first drafted.** The initial pass used
0.50/0.34/0.30/0.26 alphas and read as a full colour wash. That looked lovely in
isolation but fought §0's whole thesis: the hero is supposed to open as a *blank
canvas* she then fills. Halved to 0.26/0.17/0.15/0.13 with an 80px blur, it reads as a
living tint — alive, never distracting, and the blank canvas still reads blank.

`prefers-reduced-motion`: animation off, held as a soft static wash (not removed —
losing it entirely would make the reduced-motion path a different design).

## 22. Smoother transitions (main site §5, studio §8)

Both scripts now declare one motion vocabulary at the top and use it everywhere:

```js
const EASE_OUT  = 'power3.out';    // things arriving
const EASE_IO   = 'power2.inOut';  // things travelling through
const EASE_SOFT = 'power2.out';    // small settles
const D_SLOW = 1.2, D_MED = 0.9, D_FAST = 0.6;
```

Scattered literals were replaced wholesale. The only surviving literals are deliberate
character moments: `power4.inOut` (door/entrance swing), `power1.inOut` (hero
stroke-draw), `back.out()` (pin drop, swatch plink), `sine.inOut` (idle breathing).

## 23. Main site — "Save our canvas" (§4 Section 6)

Signing now reveals **two** things: the keepsake download *and* the Studio door.
`buildCanvasCard()` composes the assembled painting — her signature already
composited into it by §5's `Painting.addSignature()` — onto a 1080×1350 card with the
painterly frame and `EXPORT_MARK`, then `toBlob` → `<a download="our-canvas.png">`.
Share button appears only where `navigator.canShare({files})` is true.

## 24. Restoration Room — the Instagram reveal (studio §3)

The cameo silhouette is **replaced**. Under the dust is now a stylized Instagram post:

- `drawSunrisePhoto()` — sunrise sky, two mountain ranges, the sun clearing the ridge,
  and **her from behind**: slim, hair worn open past the shoulders, backlit.
- `drawPortrait()` — the post chrome around it: gradient avatar ring, `She`,
  location, ··· menu, action row (filled heart, comment, share, bookmark),
  **"Liked by nishant and others"**, the caption line, and a timestamp.

**Her own caption:** at 100% uncovered a text field appears; typing redraws the post
live, and the saved PNG carries her words. Long captions are ellipsised so the card
stays tidy.

**Figure-drawing note (three attempts).** Drawing body → hair → head as one silhouette
produced a featureless blob. The fix was drawing order plus a slip of neck: arms, then
body, then head, then the open hair *over* both, so the hair falls across the shoulders
instead of merging with them. The first rim light was a straight vertical stroke and
read as a walking staff; it is now a short contour arc plus a soft radial backlight,
which also justifies the sunrise.

`PORTRAIT_SWAP` now points at `drawSunrisePhoto(ctx, x, y, w, h)` — replace only that
body with a `drawImage` and the post chrome keeps working untouched.

## 25. Colour & Coloring Lab (studio §4)

Room 2 is now **two linked halves** behind a segmented control.

**4a · Mix** — unchanged from v1 (six blends, recipe matching, memory lines).

**4b · Colour in** — six line-art drawings, tap a region to fill it with the selected
colour, with **undo**, **start over**, per-drawing download, and a numbered chooser
that dots each drawing she's touched:

1. a girl playing · 2. a quiet place · 3. somewhere green ·
4. the two of us · 5. her and her dog · 6. go fly

**The hinge between the halves is the palette.** `Palette` holds the base pigments plus
*every blend she discovers*, and a discovered blend auto-selects itself — so what she
makes on the left is literally what she paints with on the right. That is the point of
putting them on one page.

**Art contract (`SKETCHES_SWAP`, in studio.html):** each drawing is an
`<svg data-sketch data-name>` on a `0 0 300 300` viewBox; every closed shape with
`class="rg"` becomes fillable. Line-art styling is applied by JS as *attributes*, not
CSS, so a saved PNG looks exactly like what she sees on screen.

## 26. My Collection (studio §6.3)

Every save — from any room, whether downloaded or shared — is also thumbnailed into a
session tray behind a floating **my collection** button with a count. Tapping a
thumbnail re-downloads it. In memory only, per §2's `localStorage` prohibition.

## 27. Painterly framer (studio §6.2)

Every export from both pages now shares one frame: gesso ground, procedural paper
grain, ~150 loose pigment dabs brushed along the edges, then two hairlines and the
`EXPORT_MARK` footer. All saved pieces read as one collection.

## 28. Ambient studio sound (studio §6.4)

Off by default, never autoplays. Built on **WebAudio** rather than an audio file or the
`tone` library — three sine voices (D/A/D) through a 620 Hz lowpass, each breathing on
its own sub-0.06 Hz LFO, master gain ramping over 2.2s. No asset to ship, nothing to
load, and it cannot start without her tapping the toggle.

## 29. v2 verification (2026-08-02, mobile Chromium @390×844)

Living background present, animating, correctly behind content. Main site: full run to
signing → `our-canvas.png` (476 KB). Studio: dust brushed to 100% → caption typed →
`She-restored.png` (388 KB); two blends mixed → palette grew 5→7 swatches → switched
to colouring → 5 regions filled → undo verified (5→4) → switched to drawing 6 → saved
`She-go-fly.png` (214 KB); collection tray showed both pieces with correct labels;
sound toggled on and off. No horizontal overflow. **Zero console or page errors.**

### v2 fixes found by testing
- Ease constants were referenced before being declared (a bad regex insert) — the
  studio threw `EASE_SOFT is not defined` on boot. Caught by the console-error check.
- The fixed sound/collection buttons overlapped the palette strip; `.game__foot` and
  the landing now reserve bottom padding for them.
- The bird in "go fly" rendered as a bowtie — the wing paths started inside the body
  ellipse. Rebuilt as two swept cubic wings.

---

## 30. v3 — artwork pass, warmer sound, hidden details

### 30.1 The drawings were redrawn, not tweaked

The v2 sketches were geometrically correct and emotionally flat — stick figures made of
primitives. All six are rebuilt with real proportions and faces. Region counts roughly
tripled (sketch 1 went from 11 to 30), which also makes them far better *to colour*.

**A third mark type was introduced.** Regions alone couldn't carry faces — an eye that is
a fillable region becomes a blob the first time a thumb lands on it. So alongside
`class="rg"`:

- `class="ln"` — drawn detail lines (smiles, stems, sun rays, steam). Never fillable.
- `class="dt"` — filled ink dots (eyes, spots, noses). Never fillable.

Both are `pointer-events: none`, and `Colouring.build()` writes their look on as
*attributes* so a saved PNG carries the faces exactly as drawn.

**Placement bugs found only by rendering them** (worth not repeating):
- Separate ponytail ellipses beside a head read unmistakably as **ears**, in all three
  drawings that had them. Replaced with one hair shape that falls past the shoulders.
- The butterfly in sketch 1 sat on top of the girl's arm; the feather in sketch 6 sat on
  a mountain; the snail in sketch 3 was buried under rocks; the trees in sketch 3 ran off
  the frame. Every one of these looked fine as coordinates and wrong as a picture.
- A heart drawn with `l`/`q` segments left a stray tail. Rebuilt from two cubics.

### 30.2 Hidden things

Small marks, none of them announced, for someone who actually looks:

| Where | What |
|---|---|
| Restoration sunrise | a heart traced in the dirt by her feet · three birds already up · the last stars not quite gone · snow on the two nearest peaks |
| 1 · a girl playing | a ladybug in the grass · a butterfly · a flower |
| 2 · a quiet place | a bird perched on the finial · two lit diyas on the steps |
| 3 · somewhere green | a snail on a rock · birds over the far peak |
| 4 · the two of us | a heart in the picture frame on the wall · a heart floating between them · steam off both cups |
| 5 · her and her dog | a bone · two sets of paw prints · a butterfly over the dog's nose · his collar |
| 6 · go fly | a heart in the cloud · a feather still falling |
| Main site | a small cadmium heart thumbed into the corner of the letter placard |

### 30.3 The ambient sound is warmer

The v2 pad was three sine waves on an open fifth — clean, but thin and slightly cold.
Rebuilt as **F major with a ninth** (F2 · C3 · F3 · C4 · E4), triangles underneath for
body and sines on top for air, through a highpass at 70 Hz to clear the mud and a lowpass
at 540 Hz for warmth. Three things do most of the work:

1. a **feedback delay** (420 ms, 0.34) so it has air around it rather than sitting flat;
2. the **filter cutoff drifting** on a 0.028 Hz sweep, so the pad is never static;
3. each voice swelling on its **own** sub-0.032 Hz LFO, so they drift in and out of each
   other instead of moving as a block.

Fade-in lengthened to 3.4 s (out: 1.4 s) so it arrives like weather. Still WebAudio, still
no asset, still off by default and unable to autoplay.

### 30.4 Verification (2026-08-02)

All six drawings rendered and reviewed as pictures, not just as passing assertions.
Sketch 1 now reports 30 fillable regions, sketch 6 reports 17. Fill → undo → switch
drawing → save verified; saved drawing 233 KB. Main site 481 KB. Collection tray, sound
toggle, reduced-motion and 360px all still pass. **Zero console or page errors.**

**Known remaining softness:** in *the two of us* the pair still have no arms — they read
as two people behind a table, which works, but it is the least resolved of the six.

---

## 31. v3.1 — "the two of us", and more small things

### 31.1 Sketch 4 rebuilt properly

The brief asked for *a boy and a girl at a table, looking at the camera, leaning slightly
toward each other, with all features intact*. The v3 version had two featureless torsos.
Rebuilt with every feature named:

- Each figure sits in its own `<g transform="rotate(+/-4 ...)">` about a pivot at hip
  height, so the **lean** is real geometry rather than two shapes nudged sideways.
- Faces carry brows, eyes, a nose, a smile, blush and ears. Her hair falls long past the
  shoulders with a lock over one side; his is short with a tuft that won't sit down.
- Both have **arms resting on the table** with hands and cuff lines — the thing most
  obviously missing before.
- Clothing: her neckline, his V-collar and three shirt buttons.
- On the table: two cups with saucers and steam, and one slice of cake in the middle with
  a cherry on top.

**Two composition bugs, both visible only once rendered:** at +/-6 degrees the pair leaned
in until their heads nearly touched (reduced to +/-4 and the figures moved apart), and
their inner hands landed on the same spot (moved to either side of the cake). The cat
originally sat in her lap; it now peeks around the table's left leg.

### 31.2 More hidden things

| Where | What |
|---|---|
| 4 - the two of us | a **cat** beside the table leg, a heart in the wall frame, a hanging plant nobody waters, the view out the window |
| Paint-by-Scroll scene | a **bird nesting in the tree**, a **butterfly** drifting on its own four-stage loop forever, flowers scattered through the hill, the dog's **collar and tag**, a heart traced into the cloud |

The butterfly is animated in `Paint.idle()` alongside the tail-wag and the sun's rays, so
the finished scene always has something moving in it that isn't the dog.

### 31.3 Verification

All six drawings re-rendered and reviewed as pictures, not just as passing assertions.
Room 2 now reports **11 palette swatches** once all six blends are found. A full room-3
playthrough still completes 9/9 with the scene additions in place; saved drawing 255 KB,
scene 244 KB, restoration 394 KB. Reduced-motion, 360px and tap-target checks all still
pass. **Zero console or page errors.**
