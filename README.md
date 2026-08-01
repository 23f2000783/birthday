# For Mansi — An Interactive Friendship Day Canvas

A site that starts as a blank canvas and fills itself in as you scroll — until the last
section, where the whole thing turns out to be a painting you made without noticing.
Signing it unlocks **The Studio**: three gentle games, each of which ends with an image
she can save.

Built for a phone. No build step, no dependencies to install — drop the folder on any
static host.

```
index.html   the main scroll story + CDN links (GSAP, ScrollTrigger, Lenis, fonts)
style.css    shared styling — design tokens, paper grain, responsive, reduced-motion
script.js    main-site config block + every bit of interactivity

studio.html  The Studio — three rooms, plus the replaceable girl-and-dog artwork
studio.css   studio layout (reuses the tokens from style.css)
studio.js    studio config block + the three games + the PNG export

SPEC.md      the design brief this was built from (keep it updated if you change things)
```

---

## Preview it locally

Just open `index.html` in a browser. That works.

If you'd rather serve it properly (recommended — matches how GitHub Pages behaves):

```bash
# any one of these, from inside the project folder
python -m http.server 8000
npx serve .
```

Then visit <http://localhost:8000>.

---

## Personalising it

**Everything you'd want to change lives in one block at the top of `script.js`,**
between the `1 · CONFIG` and `END OF CONFIG` comments. You do not need to touch
`index.html` or `style.css` at all.

### The basics

```js
const FRIEND_NAME = "Mansi";        // who it's for — used everywhere, including the title
const YOUR_NAME   = "Nishant";      // who it's from
const MEET_DATE   = "2014-06-01";   // YYYY-MM-DD — drives the live day-count
const MEET_LABEL  = "Class 6";      // "… days since Class 6"
const MARGIN_NOTE = "est. class 6 · 2014";   // the pencilled note in the hero corner
```

The day counter is computed live from `MEET_DATE`, so it's correct on any day she opens it.

### The rest of the knobs

| Constant | What it controls |
|---|---|
| `HERO_LINE_1` / `HERO_LINE_2` | The two big hero lines that draw themselves in |
| `PIGMENTS` / `PIGMENT_NAMES` | The four paint colours — palette, cursor trail, confetti, the final painting |
| `STATS` | The little monospace lines beside the day count |
| `COUNTER_SUB` | Sub-line under the count. `{years}` is swapped for the real number |
| `PAINT_GUIDE` / `PAINT_PRAISE` | "draw something 🖌️" and the line that appears after her first stroke |
| `MUSEUM_QUESTIONS` | The five placards. Each option has a `label` and a `note` (its affirming reply) |
| `FINAL_PLACARD` | The reveal after all five are answered |
| `LETTER_TEXT` | The letter. Blank lines separate paragraphs; single line breaks are joined |
| `LETTER_SIGN` | The signature under the letter |
| `SIGN_HINT` / `SIGN_DONE` | Copy for the sign-the-canvas section |
| `FOOTER_NOTE` / `PAINTING_TAG` | Footer line and the gallery label on the painting |

### Adding or removing a museum question

Just add or delete entries in `MUSEUM_QUESTIONS`. The placards, the unlock counter,
and the "answer all N to unlock" gate all follow the array length automatically. Keep
four options per question if you want the layout to stay balanced — and keep every
option affirming; the whole point is that there are no wrong answers.

### Changing the colours

If you change `PIGMENTS`, also update the matching CSS custom properties at the top of
`style.css` (`--cadmium`, `--ultramarine`, `--viridian`, `--naples`) so the paint smear
in section 2 and the pigment washes stay in the same family.

---

## The Studio

Signing the canvas at the bottom of the main page opens a door through to `studio.html`.
Three rooms, in a deliberate order — find yourself, feel your colours, go back to being
a kid. Nothing is timed or scored, and nothing can be failed.

Its own config block sits at the top of `studio.js`:

| Constant | What it controls |
|---|---|
| `GAMES` | The three rooms — name, blurb, and the little easel thumbnail |
| `RESTORATION_LINES` | The six lines, each with the `at` fraction of dust that triggers it |
| `WELLS` / `COLOR_BLENDS` | The pigments, and the six mixes with their memory lines |
| `PAINT_ACTIONS` | The nine gentle actions (`bubble`, `prompt`, `leaf`, `brush`, `dab`) |
| `PAINT_INTRO` / `PAINT_DONE` | The opening and closing lines of room three |
| `EXPORT_MARK` | The footer stamped onto every saved image |

### Swapping in your own artwork

Both pieces of art are marked in the source so you don't have to read the rest.

- **The portrait** — search `PORTRAIT_SWAP` in `studio.js`. To use a real photo-traced
  silhouette, replace the body of `drawPortrait(ctx, W, H)` with an image draw. Keep the
  signature and it slots straight in.
- **The girl and dog** — search `SCENE_SWAP` in `studio.html`. Replace the contents of
  `<svg id="scene">`. The only rule: anything you want revealed as its own step must be a
  `<g data-region="N">`. The reveal wipes are generated from each group's bounding box at
  runtime, so any number of regions works with no JavaScript changes.

### How the mixing works

A blend is matched on the **ratio** of pigments, not the resulting colour — so two drops
of cadmium and two of naples is the same 1:1 "warm orange" as one and one, while two
naples to one cadmium is "gold". This is deliberate: warm orange and gold sit about 28
units apart in RGB, and any colour tolerance loose enough to feel forgiving would have
fired the wrong memory. Mixes that don't match anything are still celebrated.

### Saving

Every room composes a 1080×1350 card — paper grain, gallery frame, the line, and the
`for Mansi · from Nishant` mark — and downloads it as a PNG. Where the browser supports
sharing files (most phones), a Share button also appears and opens the native share
sheet; the download is always the guaranteed path.

---

## Deploying to GitHub Pages

Free, static, and takes about two minutes.

**1. Make it a git repo and commit**

```bash
cd path/to/this/folder
git init
git add .
git commit -m "For Mansi"
git branch -M main
```

**2. Create an empty repo on GitHub**

Go to <https://github.com/new>. Give it a name (e.g. `for-mansi`). **Don't** tick
"Add a README" — the repo needs to be empty. Create it.

**3. Push**

```bash
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Replace `USERNAME` and `REPO` with yours.

**4. Turn Pages on**

In the repo on GitHub: **Settings ▸ Pages**. Under *Build and deployment*, set
**Source** to **Deploy from a branch**, then pick branch **`main`** and folder **`/ (root)`**.
Hit **Save**.

**5. Wait a minute, then open it**

```
https://USERNAME.github.io/REPO/
```

The first deploy takes 30–60 seconds. After that, every `git push` updates the live site
automatically.

### Updating it later

```bash
git add .
git commit -m "tweak the letter"
git push
```

Give it a minute, then hard-refresh (Ctrl/Cmd + Shift + R) to bypass the cache.

### A couple of Pages gotchas

- **Don't rename `index.html`.** Pages serves it as the entry point.
- If the repo is **private**, Pages requires a paid plan. Public is fine — but note that
  anyone with the link can read the letter.
- All the paths are relative, so it works at `/REPO/` sub-paths without any config.

---

## Other hosts

Nothing here is GitHub-specific. Drag the folder onto
[Netlify Drop](https://app.netlify.com/drop) or run `npx vercel` and it deploys as-is.

---

## How it works, briefly

- **Scroll** is [Lenis](https://github.com/darkroomengineering/lenis), synced to GSAP's
  ticker so `ScrollTrigger` stays in step with the smoothed scroll position.
- **Motion** is GSAP + ScrollTrigger. The hero's letters are SVG `<text>` drawn by
  animating `stroke-dashoffset`; the counter's paint smear is wiped with a CSS mask
  driven by a scrubbed custom property; the placards drop onto the wall on entry.
- **Paint** is Canvas 2D. Brush dabs are pre-rendered sprites blitted along the pointer
  path (with speed-based thinning and a little jitter), which is what keeps it at 60fps
  on a phone. Strokes are stored normalised, so they survive rotation and resizing.
- **The final painting** is assembled from what she actually did on the way down: her
  cursor path, her brushstrokes, her museum answers, and her signature. If she never
  drew anything, a seeded generator composes something in the same palette so the reveal
  is never empty.

### On a phone specifically

- The cursor trail is switched off for touch input — every finger drag on a phone is a
  scroll, so the trail only smeared pigment across whatever she was reading, and cost
  frames doing it. The *path* is still recorded, so the final painting is still built
  from where her finger actually went.
- Tap targets are at least 44px on touch devices, notches and home indicators are
  respected via `env(safe-area-inset-*)`, and the canvases set `touch-action: none` so
  the page holds still while she draws.
- In The Studio, each room is a full-screen panel and the phone's **back button** leaves
  the room rather than the site.

### Accessibility

- Full `prefers-reduced-motion` support: no cursor trail, no confetti, no stroke-draw or
  smear-wipe, no door animations — everything becomes a gentle fade, and every section
  and every game stays fully playable.
- The paint canvas is keyboard-drawable: focus it, press **Enter** or **Space** to put
  the pen down, then use the **arrow keys** (hold **Shift** for bigger steps). The
  restoration canvas works the same way.
- Visible focus rings throughout, labelled controls, and a skip link.
- The day count is announced once to screen readers rather than on every scroll frame.

### Browser support

Any current Chrome, Safari, Firefox or Edge, desktop or mobile. If the CDN scripts fail
to load, the page degrades to a plain, fully readable static version rather than a blank
screen.

---

Made for Mansi · with paint and pixels.
