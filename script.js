/* ============================================================================
 *  FOR MANSI — an interactive Friendship Day canvas
 *  ---------------------------------------------------------------------------
 *  Blocks:  1 CONFIG · 2 utils · 3 boot · 4 smooth scroll · 5 ambient canvas
 *           6 hero · 7 counter · 8 paint tool · 9 museum · 10 painting
 *           11 signature · 12 reveals & wiring
 * ========================================================================= */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════
   *  1 · CONFIG — EVERYTHING PERSONAL LIVES HERE.
   *      Change these values and nothing else. No other file needs editing.
   * ═══════════════════════════════════════════════════════════════════════ */

  /** Who this is for. */
  const FRIEND_NAME = "Mansi";
  /** Who it's from. */
  const YOUR_NAME = "Nishant";
  /** When you two met — drives the live day-count. Format: YYYY-MM-DD. */
  const MEET_DATE = "2014-06-01";   // approx. Class 6 start — adjust to taste
  /** How that moment is named on screen ("… days since Class 6"). */
  const MEET_LABEL = "Class 6";
  /** The pencilled note in the top corner of the hero. */
  const MARGIN_NOTE = "est. class 6 · 2014";

  /** The two hero lines that draw themselves in. */
  const HERO_LINE_1 = "Happy Friendship Day,";
  const HERO_LINE_2 = FRIEND_NAME + ".";

  /** The four pigments — palette, cursor trail, confetti, everything. */
  const PIGMENTS = ["#E8552D", "#2B4A8B", "#1F7A5A", "#F2C14E"];
  const PIGMENT_NAMES = ["Cadmium", "Ultramarine", "Viridian", "Naples Yellow"];

  /** Small honest stats beside the day-count. */
  const STATS = [
    "1 canvas · infinite range",
    "0 ceilings located so far",
    "still the eldest, still holding it up",
    "friendship: ongoing, no end date"
  ];

  /** Sub-line under the counter. {years} is replaced with the real number. */
  const COUNTER_SUB = "that's about {years} years of you.";

  /** Section 3 copy. */
  const PAINT_GUIDE = "draw something 🖌️";
  const PAINT_PRAISE = "that's going in the museum.";

  /** Section 4 — the museum. No wrong answers; every option gets its own note. */
  const MUSEUM_QUESTIONS = [
    {
      q: "Blank canvas appears. First instinct?",
      options: [
        { label: "make a mess first, fix it later", note: "chaos as a first draft. respect." },
        { label: "stare at it for 3 hours",         note: "that's not stalling, that's composing." },
        { label: "already have 4 ideas",            note: "the ideas were never the problem." },
        { label: "trust it'll come",                note: "it always does. it always has." }
      ]
    },
    {
      q: "Your art gets 3 likes instead of 300. You:",
      options: [
        { label: "post it anyway, it's mine",       note: "ownership over applause. huge." },
        { label: "already onto the next one",       note: "prolific beats popular." },
        { label: "save it for me, not the feed",    note: "some pieces are just for you." },
        { label: "shrug, keep painting",            note: "unbothered, still making. iconic." }
      ]
    },
    {
      q: "Someone says “you should paint more like [famous artist].” You:",
      options: [
        { label: "nah, I paint like " + FRIEND_NAME, note: "there's exactly one of those." },
        { label: "take the note, keep my soul",      note: "growth without erasure. rare." },
        { label: "smile and do my own thing",        note: "quiet defiance is still defiance." },
        { label: "already unmatched, thanks",        note: "correct answer, obviously." }
      ]
    },
    {
      q: "The realest flex?",
      options: [
        { label: "liking my own work before anyone else does", note: "hardest flex there is." },
        { label: "finishing the hard piece",                   note: "the ones that fight back mean the most." },
        { label: "being gentle when it's hard",                note: "you do this without even noticing." },
        { label: "showing up for everyone",                    note: "eldest-daughter superpower. documented." }
      ]
    },
    {
      q: "Who's watching over all of this?",
      options: [
        { label: "someone up there, always", note: "and they've been paying attention." },
        { label: "the people I carry",       note: "they'd say you carry them well." },
        { label: "me, quietly",              note: "the quiet ones do the most." },
        { label: "all of the above 🙏",       note: "the fullest answer. of course." }
      ]
    }
  ];

  /** The reveal placard, shown once all five are answered. */
  const FINAL_PLACARD = {
    title: "Diagnosis: You are your own favourite artist — and that's the masterpiece.",
    body: "The care you pour in is the whole point. Keep going."
  };

  /** Section 5 — the letter. Blank lines separate paragraphs. */
  const LETTER_TEXT = `${FRIEND_NAME},

Somewhere along the way you became the person everyone leans on — the eldest,
the responsible one, the one who holds it together when things get hard. You do it
quietly, without asking for anything back, gentle with every living thing that crosses
your path, quietly certain that someone up there is watching over all of us.

You put so much of yourself into everything — every canvas, every effort, every late
thought about whether it was good enough. And here's what you keep missing: it always
is. The care you pour in shows. The work is beautiful because you are the one who made
it, and you make things the way only you can.

The only person who ever doubts ${FRIEND_NAME} is ${FRIEND_NAME}. You wonder if you're enough, if you can,
if there's a ceiling. There isn't. There never was. The limit you're so sure you're
standing under — you've been above it this whole time.

You just painted this entire page and didn't even notice you were doing it. That's you,
every single time. So look at what you made. Then go fly — you were always meant to.

Happy Friendship Day. 🎨`;

  /** Signature line under the letter. */
  const LETTER_SIGN = "— " + YOUR_NAME;

  /** Section 6 — the send-off. */
  const SIGN_HINT = "your initials, here";
  const SIGN_DONE = "signed, and hung where it belongs.";
  const FOOTER_NOTE = `made for ${FRIEND_NAME} · with paint and pixels`;
  const PAINTING_TAG = `untitled · ${FRIEND_NAME}, ${new Date().getFullYear()} · mixed media on scroll`;

  /* ═══════════════════════ END OF CONFIG ═══════════════════════ */


  /* ───────────────────────── 2 · UTILITIES ───────────────────────── */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  /** Small deterministic PRNG so a given set of answers always paints the same picture. */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** "#E8552D" + alpha -> "rgba(232,85,45,0.5)" */
  function rgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  const DPR = () => Math.min(window.devicePixelRatio || 1, 2);

  /** Size a canvas to its CSS box at capped DPR. Returns {w,h} in CSS pixels. */
  function fitCanvas(canvas, ctx) {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const d = DPR();
    canvas.width = Math.round(w * d);
    canvas.height = Math.round(h * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    return { w: w, h: h };
  }

  /* Brush dabs are pre-rendered once per colour and blitted — creating a radial
     gradient per dab is what kills framerates on phones.
     Two falloffs: 'firm' has a loaded-brush core and a painterly edge (real
     brushwork); 'soft' is a wide bloom (cursor trail, background washes). */
  const SPRITE_SIZE = 128;
  const FALLOFF = {
    firm: [[0, 1], [0.5, 0.96], [0.78, 0.44], [1, 0]],
    soft: [[0, 1], [0.42, 0.72], [0.72, 0.24], [1, 0]]
  };
  const spriteCache = new Map();
  function sprite(color, kind) {
    const key = (kind || 'soft') + '|' + color;
    let c = spriteCache.get(key);
    if (c) return c;
    c = document.createElement('canvas');
    c.width = c.height = SPRITE_SIZE;
    const x = c.getContext('2d');
    const half = SPRITE_SIZE / 2;
    const g = x.createRadialGradient(half, half, 0, half, half, half);
    (FALLOFF[kind] || FALLOFF.soft).forEach(function (stop) {
      g.addColorStop(stop[0], rgba(color, stop[1]));
    });
    x.fillStyle = g;
    x.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
    spriteCache.set(key, c);
    return c;
  }

  function dab(ctx, x, y, r, color, alpha, kind) {
    if (r <= 0.2) return;
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprite(color, kind), x - r, y - r, r * 2, r * 2);
  }


  /* ───────────────────────── 3 · BOOT ───────────────────────── */

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* On a phone every pointermove IS a scroll gesture, so a cursor trail just
     smears pigment across whatever she's reading — and costs frames doing it.
     Trail is a mouse affordance; confetti and splats still fire on touch. */
  const COARSE = window.matchMedia('(pointer: coarse)').matches;
  const HAS_GSAP = typeof window.gsap !== 'undefined' &&
                   typeof window.ScrollTrigger !== 'undefined';

  if (HAS_GSAP) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    // Only now is it safe for CSS to hide things — if the CDN had failed,
    // every section stays plainly visible.
    document.documentElement.classList.add('js-motion');
  }
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;

  /** Everything Mansi makes on the way down, collected for the final painting. */
  const Art = {
    trail: [],       // normalised pointer samples {x,y,c,r}
    strokes: [],     // her paint-tool strokes
    choices: [],     // museum answers (option indices)
    signature: null  // her signature strokes
  };


  /* ─────────────────── 4 · SMOOTH SCROLL (Lenis ⟷ GSAP) ─────────────────── */

  let lenis = null;

  function initScroll() {
    const Lenis = window.Lenis && (window.Lenis.default || window.Lenis);
    if (!HAS_GSAP || REDUCED || typeof Lenis !== 'function') return;

    lenis = new Lenis({
      lerp: 0.095,
      wheelMultiplier: 1,
      touchMultiplier: 1.7,
      smoothWheel: true
    });

    // The two halves of the sync the docs insist on, and they're right:
    lenis.on('scroll', ST.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -20 });
        else target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }


  /* ─────────── 5 · AMBIENT CANVAS — brush trail, splats, confetti ─────────── */

  const Ambient = (function () {
    const canvas = $('#ambient');
    if (!canvas || REDUCED) {
      return { splat: function () {}, burst: function () {}, suppress: function () {} };
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    let W = 0, H = 0;
    let running = false, idleFrames = 0;
    let suppressed = false;

    const MAX_QUEUE = 90;
    const MAX_CONFETTI = 130;
    const queue = [];      // dabs to stamp this frame
    const confetti = [];

    let last = null;       // last pointer position
    let travel = 0;        // distance travelled, drives pigment cycling
    let lastSample = 0;    // throttle for Art.trail

    function size() {
      W = window.innerWidth;
      H = window.innerHeight;
      const d = DPR();
      canvas.width = Math.round(W * d);
      canvas.height = Math.round(H * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
    }

    function wake() {
      idleFrames = 0;
      if (!running) { running = true; requestAnimationFrame(frame); }
    }

    function pushDab(x, y, r, color, alpha) {
      if (queue.length >= MAX_QUEUE) return;
      queue.push({ x: x, y: y, r: r, c: color, a: alpha });
    }

    function onPointerMove(e) {
      if (suppressed) { last = null; return; }
      const x = e.clientX, y = e.clientY;
      // A touch drag is a scroll gesture, not a brush stroke: we still record the
      // path (the final painting is built from it) but we don't paint a trail.
      const draws = !COARSE && e.pointerType !== 'touch';

      if (last) {
        const dx = x - last.x, dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.6) return;
        travel += dist;

        const color = PIGMENTS[Math.floor(travel / 170) % PIGMENTS.length];
        const radius = clamp(11 + dist * 0.45, 11, 42);

        if (draws) {
          // interpolate so fast flicks stay continuous
          const steps = Math.min(6, Math.max(1, Math.round(dist / 9)));
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            pushDab(lerp(last.x, x, t), lerp(last.y, y, t),
                    radius * (0.85 + Math.random() * 0.3), color, 0.055);
          }
          wake();
        }

        // sample sparsely for the final painting — on every input type
        const now = performance.now();
        if (now - lastSample > 70) {
          lastSample = now;
          if (Art.trail.length >= 320) {
            Art.trail.splice(Math.floor(Math.random() * Art.trail.length), 1);
          }
          Art.trail.push({ x: x / W, y: y / H, c: color, r: radius / W });
        }
      }
      last = { x: x, y: y };
    }

    /** Paint-splat ripple — used on button presses. */
    function splat(x, y, color) {
      const c = color || PIGMENTS[Math.floor(Math.random() * PIGMENTS.length)];
      for (let i = 0; i < 14; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = 6 + Math.random() * 26;
        pushDab(x + Math.cos(a) * d, y + Math.sin(a) * d,
                4 + Math.random() * 13, c, 0.14);
      }
      for (let i = 0; i < 5; i++) addFleck(x, y, 2.4, c);
      wake();
    }

    function addFleck(x, y, power, color) {
      if (confetti.length >= MAX_CONFETTI) return;
      const a = Math.random() * Math.PI * 2;
      const s = (0.8 + Math.random() * 1.9) * power;
      confetti.push({
        x: x, y: y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - power * 1.2,
        w: 3 + Math.random() * 7,
        h: 2 + Math.random() * 5,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        life: 1,
        decay: 0.011 + Math.random() * 0.013,
        c: color || PIGMENTS[Math.floor(Math.random() * PIGMENTS.length)]
      });
    }

    /** Pigment-confetti burst. */
    function burst(x, y, count) {
      const n = Math.min(count || 60, MAX_CONFETTI - confetti.length);
      for (let i = 0; i < n; i++) addFleck(x, y, 2 + Math.random() * 1.8);
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = Math.random() * 40;
        pushDab(x + Math.cos(a) * d, y + Math.sin(a) * d, 10 + Math.random() * 22,
                PIGMENTS[i % PIGMENTS.length], 0.09);
      }
      wake();
    }

    function frame() {
      // decay whatever is on the layer
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0,0,0,0.055)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';

      let busy = false;

      for (let i = 0; i < queue.length; i++) {
        const q = queue[i];
        dab(ctx, q.x, q.y, q.r, q.c, q.a);
      }
      if (queue.length) { queue.length = 0; busy = true; }

      for (let i = confetti.length - 1; i >= 0; i--) {
        const p = confetti[i];
        p.vy += 0.16;              // gravity
        p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy;
        p.rot += p.vr;
        p.life -= p.decay;
        if (p.life <= 0 || p.y > H + 60) { confetti.splice(i, 1); continue; }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = clamp(p.life, 0, 1) * 0.85;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        busy = true;
      }
      ctx.globalAlpha = 1;

      // park the loop once the layer has faded out, restart on activity
      idleFrames = busy ? 0 : idleFrames + 1;
      if (idleFrames > 90) {
        running = false;
        ctx.clearRect(0, 0, W, H);
        return;
      }
      requestAnimationFrame(frame);
    }

    size();
    window.addEventListener('resize', size);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerMove, { passive: true });
    window.addEventListener('blur', function () { last = null; });

    return {
      splat: splat,
      burst: burst,
      /** Silence the trail while she's drawing, so painting feels precise. */
      suppress: function (on) { suppressed = !!on; if (on) last = null; }
    };
  })();

  /** Burst confetti from the centre of an element. */
  function burstFrom(el, count) {
    const r = el.getBoundingClientRect();
    Ambient.burst(r.left + r.width / 2, r.top + r.height / 2, count);
  }


  /* ───────────────────────── 6 · HERO ───────────────────────── */

  function initHero() {
    const svg = $('.hero__svg');
    if (!svg) return;

    // config-driven copy
    $$('.hl[data-line="1"]').forEach(function (t) { t.textContent = HERO_LINE_1; });
    $$('.hl[data-line="2"]').forEach(function (t) { t.textContent = HERO_LINE_2; });
    const sr = $('[data-el="heroSrText"]');
    if (sr) sr.textContent = HERO_LINE_1 + ' ' + HERO_LINE_2;
    const note = $('[data-el="marginNote"]');
    if (note) note.textContent = MARGIN_NOTE;

    const VIEW_W = 900, SAFE_W = 840;

    /** Shrink any line that would overflow the viewBox (long names, etc.). */
    function fitLines() {
      [1, 2].forEach(function (n) {
        const els = $$('.hl[data-line="' + n + '"]');
        const probe = els[els.length - 1];
        if (!probe || !probe.getComputedTextLength) return;
        els.forEach(function (el) { el.style.fontSize = ''; });
        const len = probe.getComputedTextLength();
        if (len > SAFE_W) {
          const base = parseFloat(window.getComputedStyle(probe).fontSize) || 84;
          const next = Math.floor(base * (SAFE_W / len));
          els.forEach(function (el) { el.style.fontSize = next + 'px'; });
        }
      });
    }

    function play() {
      fitLines();

      const sketch = $$('.hl--sketch');
      const ink = $$('.hl--ink');
      const fill = $$('.hl--fill');

      if (!HAS_GSAP || REDUCED) {
        // reduced motion: the letters are simply, calmly there
        fill.forEach(function (el) { el.style.opacity = '1'; });
        ink.forEach(function (el) { el.style.display = 'none'; });
        if (HAS_GSAP) {
          gsap.fromTo(['.hero__sub', '.hero__note', '#scrollCue'],
            { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.08 });
        }
        return;
      }

      // SVG <text> has no getTotalLength(); the glyph outline runs roughly
      // 3.5–4× the advance width, which is plenty for a clean single sweep.
      ink.forEach(function (el) {
        const len = (el.getComputedTextLength ? el.getComputedTextLength() : 700) * 3.8;
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = len;
      });

      gsap.set(sketch, { opacity: 0 });
      gsap.set(fill, { opacity: 0 });
      gsap.set(['.hero__sub', '#scrollCue'], { opacity: 0, y: 14 });
      gsap.set('.hero__note', { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.to('.hero__note', { opacity: 1, duration: 0.7 }, 0)
        .to(sketch, { opacity: 1, duration: 0.9, stagger: 0.12 }, 0.1)
        .to(ink, {
          strokeDashoffset: 0,
          duration: 2.3,
          stagger: 0.42,
          ease: 'power1.inOut'
        }, 0.45)
        .to(fill, { opacity: 1, duration: 0.9, stagger: 0.42 }, '-=1.15')
        .to(ink, { opacity: 0.32, duration: 0.8 }, '-=0.6')
        .to('.hero__sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.45')
        .to('#scrollCue', { opacity: 1, y: 0, duration: 0.7 }, '-=0.55');

      // the cue retires as soon as she takes the hint
      ST.create({
        trigger: '#hero',
        start: 'top top',
        end: '35% top',
        onUpdate: function (self) {
          gsap.set('#scrollCue', { opacity: 1 - self.progress });
        }
      });
    }

    // wait for Fraunces so the dash lengths and fitting are measured correctly
    const fonts = document.fonts && document.fonts.ready
      ? document.fonts.ready
      : Promise.resolve();
    let started = false;
    const start = function () { if (!started) { started = true; play(); } };
    fonts.then(start);
    setTimeout(start, 1600);         // never let a font stall the intro
    window.addEventListener('resize', function () { if (started) fitLines(); });
  }


  /* ───────────────────────── 7 · COUNTER ───────────────────────── */

  function initCounter() {
    const stage = $('.smear-stage');
    const numEl = $('#counterNum');
    const valEl = $('#counterValue');
    const subEl = $('#counterSub');
    const statsEl = $('#counterStats');
    const labelEl = $('[data-el="meetLabel"]');
    if (!stage || !numEl) return;

    if (labelEl) labelEl.textContent = MEET_LABEL;

    const meet = new Date(MEET_DATE + 'T00:00:00');
    const days = Math.max(0, Math.floor((Date.now() - meet.getTime()) / 86400000));
    const years = (days / 365.25).toFixed(1).replace(/\.0$/, '');

    const fmt = function (n) { return n.toLocaleString('en-US'); };

    // Screen readers get the finished sentence once, not every scrub frame.
    if (valEl) {
      valEl.setAttribute('aria-hidden', 'true');
      valEl.removeAttribute('aria-live');
      const srLine = document.createElement('p');
      srLine.className = 'sr-only';
      srLine.textContent = fmt(days) + ' days since ' + MEET_LABEL + '.';
      valEl.parentNode.insertBefore(srLine, valEl);
    }

    if (subEl) subEl.textContent = COUNTER_SUB.replace('{years}', years);

    if (statsEl) {
      statsEl.innerHTML = '';
      STATS.forEach(function (s, i) {
        const li = document.createElement('li');
        li.style.setProperty('--pig', PIGMENTS[i % PIGMENTS.length]);
        li.textContent = s;
        statsEl.appendChild(li);
      });
    }

    if (!HAS_GSAP || REDUCED) {
      numEl.textContent = fmt(days);
      stage.style.setProperty('--wipe', '1');
      return;
    }

    numEl.textContent = '0';
    let shown = -1;

    // She wipes the paint away herself — the count rides the same gesture.
    ST.create({
      trigger: stage,
      start: 'top 82%',
      end: 'top 28%',
      scrub: 0.6,
      onUpdate: function (self) {
        const p = self.progress;
        stage.style.setProperty('--wipe', p.toFixed(4));
        // the number lands well before the smear finishes clearing
        const cp = clamp(p / 0.55, 0, 1);
        const eased = 1 - Math.pow(1 - cp, 3);
        const v = Math.round(days * eased);
        if (v !== shown) { shown = v; numEl.textContent = fmt(v); }
      }
    });
  }


  /* ─────────────────── 8 · PAINT TOOL (the signature beat) ─────────────────── */

  /**
   * A real Canvas 2D brush. Strokes are stored normalised so they survive
   * resizes and can be replayed into the final painting.
   */
  function PaintSurface(canvas, opts) {
    opts = opts || {};
    const ctx = canvas.getContext('2d', { alpha: true });
    const strokes = [];
    let W = 0, H = 0;
    let current = null;
    let lastPt = null;
    let lastTime = 0;

    const api = {
      strokes: strokes,
      color: opts.color || PIGMENTS[0],
      size: opts.size || 26,
      onFirstStroke: opts.onFirstStroke || function () {},
      onStrokeEnd: opts.onStrokeEnd || function () {}
    };

    function resize() {
      const dims = fitCanvas(canvas, ctx);
      W = dims.w; H = dims.h;
      redraw();
    }

    function stamp(x, y, r, color, alpha) {
      // slight positional + size jitter keeps the edge from reading as vector
      const jx = (Math.random() - 0.5) * r * 0.12;
      const jy = (Math.random() - 0.5) * r * 0.12;
      dab(ctx, x + jx, y + jy, r * (0.92 + Math.random() * 0.16), color, alpha, 'firm');
    }

    /** Lay dabs from a→b at a spacing derived from brush size. */
    function paintSegment(ax, ay, bx, by, size, color, speed) {
      const dist = Math.hypot(bx - ax, by - ay);
      // faster strokes run thinner, like a real loaded brush
      const r = (size / 2) * (1 - clamp(speed * 0.055, 0, 0.34));
      const spacing = Math.max(1.1, r * 0.2);
      const steps = Math.max(1, Math.ceil(dist / spacing));
      const alpha = clamp(0.16 - size * 0.0009, 0.075, 0.16);

      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const x = lerp(ax, bx, t), y = lerp(ay, by, t);
        stamp(x, y, r, color, alpha);
        // occasional bristle satellites for texture
        if (i % 4 === 0 && r > 5) {
          const a = Math.random() * Math.PI * 2;
          const d = r * (0.5 + Math.random() * 0.45);
          dab(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d,
              r * (0.16 + Math.random() * 0.2), color, alpha * 0.6, 'firm');
        }
      }
      ctx.globalAlpha = 1;
    }

    function redraw() {
      ctx.clearRect(0, 0, W, H);
      strokes.forEach(function (s) {
        const scale = W / s.wRef;
        const size = s.size * scale;
        const pts = s.pts;
        if (pts.length === 1) {
          stamp(pts[0].x * W, pts[0].y * H, size / 2, s.color, 0.16);
          ctx.globalAlpha = 1;
          return;
        }
        for (let i = 1; i < pts.length; i++) {
          paintSegment(pts[i - 1].x * W, pts[i - 1].y * H,
                       pts[i].x * W, pts[i].y * H, size, s.color, 0);
        }
      });
    }

    function local(e) {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function begin(x, y) {
      const first = strokes.length === 0;
      current = { color: api.color, size: api.size, wRef: W, pts: [] };
      strokes.push(current);
      current.pts.push({ x: x / W, y: y / H });
      lastPt = { x: x, y: y };
      lastTime = performance.now();
      stamp(x, y, api.size / 2, api.color, 0.16);
      ctx.globalAlpha = 1;
      if (first) api.onFirstStroke();
    }

    function extend(x, y) {
      if (!current || !lastPt) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dist = Math.hypot(x - lastPt.x, y - lastPt.y);
      if (dist < 0.8) return;
      const speed = dist / dt * 10;
      paintSegment(lastPt.x, lastPt.y, x, y, current.size, current.color, speed);
      current.pts.push({ x: x / W, y: y / H });
      lastPt = { x: x, y: y };
      lastTime = now;
    }

    function end() {
      if (!current) return;
      current = null; lastPt = null;
      api.onStrokeEnd();
    }

    canvas.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
      e.preventDefault();
      // capture keeps the stroke alive past the canvas edge — but never let a
      // refused capture stop her from drawing
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* no-op */ }
      const p = local(e);
      begin(p.x, p.y);
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!current) return;
      e.preventDefault();
      // coalesced events give phones a much smoother line
      const evts = (e.getCoalescedEvents && e.getCoalescedEvents()) || [e];
      const r = canvas.getBoundingClientRect();
      for (let i = 0; i < evts.length; i++) {
        extend(evts[i].clientX - r.left, evts[i].clientY - r.top);
      }
    });
    // NB: no pointerleave here — with pointer capture active it would cut a
    // stroke short the moment she painted past the edge.
    ['pointerup', 'pointercancel'].forEach(function (t) {
      canvas.addEventListener(t, function () { end(); });
    });
    window.addEventListener('pointerup', function () { end(); });

    /* Keyboard drawing: Enter/Space puts the pen down, arrows move it. */
    const kb = { x: 0.5, y: 0.5, down: false };
    canvas.addEventListener('keydown', function (e) {
      const step = e.shiftKey ? 0.06 : 0.02;
      let moved = false;
      if (e.key === 'ArrowLeft')  { kb.x -= step; moved = true; }
      if (e.key === 'ArrowRight') { kb.x += step; moved = true; }
      if (e.key === 'ArrowUp')    { kb.y -= step; moved = true; }
      if (e.key === 'ArrowDown')  { kb.y += step; moved = true; }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        kb.down = !kb.down;
        if (kb.down) begin(kb.x * W, kb.y * H); else end();
        if (opts.onKeyState) opts.onKeyState(kb.down);
        return;
      }
      if (!moved) return;
      e.preventDefault();
      kb.x = clamp(kb.x, 0, 1); kb.y = clamp(kb.y, 0, 1);
      if (kb.down) extend(kb.x * W, kb.y * H);
    });
    canvas.addEventListener('blur', function () {
      if (kb.down) { kb.down = false; end(); }
    });

    api.clear = function () {
      strokes.length = 0;
      ctx.clearRect(0, 0, W, H);
    };
    api.resize = resize;
    api.isEmpty = function () { return strokes.length === 0; };

    resize();
    return api;
  }

  let painter = null;

  function initPaint() {
    const canvas = $('#paintCanvas');
    const wrap = $('.easel__canvas-wrap');
    const guide = $('#paintGuide');
    const praise = $('#paintPraise');
    const palette = $('#palette');
    const sizeInput = $('#brushSize');
    const sizeOut = $('#brushSizeOut');
    const clearBtn = $('#clearPaint');
    if (!canvas) return;

    if (guide) guide.textContent = PAINT_GUIDE;

    painter = PaintSurface(canvas, {
      color: PIGMENTS[0],
      size: parseInt(sizeInput && sizeInput.value, 10) || 26,
      onFirstStroke: function () {
        if (guide) guide.classList.add('is-gone');
      },
      onStrokeEnd: function () {
        if (praise && !praise.classList.contains('is-on')) {
          praise.textContent = PAINT_PRAISE;
          praise.classList.add('is-on');
        }
        Art.strokes = painter.strokes;
      },
      onKeyState: function (down) {
        if (praise) {
          praise.textContent = down
            ? 'pen down — arrow keys to draw, enter to lift'
            : (painter.isEmpty() ? 'pen up' : PAINT_PRAISE);
          praise.classList.add('is-on');
        }
      }
    });

    // painter.strokes is the same array object throughout, so this stays in sync
    Art.strokes = painter.strokes;

    // palette
    if (palette) {
      PIGMENTS.forEach(function (hex, i) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'swatch';
        b.style.setProperty('--pig', hex);
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-checked', i === 0 ? 'true' : 'false');
        b.setAttribute('aria-label', PIGMENT_NAMES[i] || hex);
        b.tabIndex = i === 0 ? 0 : -1;
        b.addEventListener('click', function (e) {
          select(i);
          Ambient.splat(e.clientX, e.clientY, hex);
        });
        b.addEventListener('keydown', function (e) {
          let next = -1;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % PIGMENTS.length;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + PIGMENTS.length) % PIGMENTS.length;
          if (next < 0) return;
          e.preventDefault();
          select(next);
          palette.children[next].focus();
        });
        palette.appendChild(b);
      });

      function select(i) {
        painter.color = PIGMENTS[i];
        $$('.swatch', palette).forEach(function (s, j) {
          s.setAttribute('aria-checked', j === i ? 'true' : 'false');
          s.tabIndex = j === i ? 0 : -1;
        });
      }
    }

    // brush size
    if (sizeInput) {
      const sync = function () {
        painter.size = parseInt(sizeInput.value, 10);
        if (sizeOut) sizeOut.textContent = sizeInput.value;
      };
      sizeInput.addEventListener('input', sync);
      sync();
    }

    // clear
    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        painter.clear();
        Art.strokes = painter.strokes;
        if (guide) guide.classList.remove('is-gone');
        if (praise) { praise.classList.remove('is-on'); praise.textContent = ''; }
        Ambient.splat(e.clientX, e.clientY, PIGMENTS[1]);
      });
    }

    // the trail steps aside while she's actually painting
    if (wrap) {
      wrap.addEventListener('pointerenter', function () { Ambient.suppress(true); });
      wrap.addEventListener('pointerleave', function () { Ambient.suppress(false); });
    }

    window.addEventListener('resize', debounce(function () { painter.resize(); }, 180));
  }


  /* ───────────────────────── 9 · THE MUSEUM ───────────────────────── */

  function initMuseum() {
    const wall = $('#museumWall');
    const finalCard = $('#finalPlacard');
    const locked = $('#finalLocked');
    const revealed = $('#finalRevealed');
    const nameEl = $('[data-el="museumName"]');
    if (!wall) return;

    if (nameEl) nameEl.textContent = FRIEND_NAME;
    if ($('#finalTitle')) $('#finalTitle').textContent = FINAL_PLACARD.title;
    if ($('#finalBody')) $('#finalBody').textContent = FINAL_PLACARD.body;

    let answered = 0;

    MUSEUM_QUESTIONS.forEach(function (item, qi) {
      const card = document.createElement('article');
      card.className = 'placard';
      card.setAttribute('aria-labelledby', 'q' + qi);

      const pin = document.createElement('span');
      pin.className = 'pin';
      pin.setAttribute('aria-hidden', 'true');

      const idx = document.createElement('p');
      idx.className = 'placard__index margin-note';
      idx.textContent = 'no. 0' + (qi + 1) + ' · no wrong answers';

      const q = document.createElement('h3');
      q.className = 'placard__q';
      q.id = 'q' + qi;
      q.textContent = item.q;

      const opts = document.createElement('div');
      opts.className = 'opts';
      opts.setAttribute('role', 'group');
      opts.setAttribute('aria-labelledby', 'q' + qi);

      const note = document.createElement('p');
      note.className = 'placard__note';
      note.setAttribute('aria-live', 'polite');

      item.options.forEach(function (opt, oi) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.style.setProperty('--pig', PIGMENTS[oi % PIGMENTS.length]);
        b.innerHTML = '<span></span>';
        b.firstChild.textContent = opt.label;

        b.addEventListener('click', function (e) {
          const fresh = !card.classList.contains('is-answered');
          $$('.opt', opts).forEach(function (o) { o.classList.remove('is-picked'); });
          b.classList.add('is-picked');
          card.classList.add('is-answered');
          note.textContent = opt.note;
          Art.choices[qi] = oi;
          Ambient.splat(e.clientX, e.clientY, PIGMENTS[oi % PIGMENTS.length]);

          if (fresh) {
            answered++;
            if (answered === MUSEUM_QUESTIONS.length) unlock();
          }
        });

        opts.appendChild(b);
      });

      card.appendChild(pin);
      card.appendChild(idx);
      card.appendChild(q);
      card.appendChild(opts);
      card.appendChild(note);
      wall.appendChild(card);
    });

    function unlock() {
      if (!finalCard || finalCard.dataset.unlocked) return;
      finalCard.dataset.unlocked = '1';
      finalCard.classList.remove('is-locked');
      if (locked) locked.hidden = true;
      if (revealed) revealed.hidden = false;

      const show = function () {
        if (HAS_GSAP) {
          gsap.fromTo(revealed,
            { opacity: 0, y: REDUCED ? 0 : 18 },
            { opacity: 1, y: 0, duration: REDUCED ? 0.4 : 0.9, ease: 'power2.out' });
        }
        if (!REDUCED) {
          burstFrom(finalCard, 70);
          setTimeout(function () { burstFrom(finalCard, 40); }, 260);
        }
      };

      // if the placard is off-screen, save the burst for when she gets there
      const r = finalCard.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) show();
      else if (HAS_GSAP) {
        ST.create({ trigger: finalCard, start: 'top 80%', once: true, onEnter: show });
      } else show();
    }

    // placards drop onto the wall as she arrives
    if (HAS_GSAP && !REDUCED) {
      $$('.placard', wall).forEach(function (card, i) {
        gsap.set(card, { opacity: 0, y: 54, rotate: i % 2 ? 1.4 : -1.4, transformOrigin: '50% -10px' });
        gsap.to(card, {
          opacity: 1, y: 0, rotate: 0,
          duration: 1.05, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true }
        });
        gsap.fromTo($('.pin', card),
          { scale: 0, y: -10 },
          {
            scale: 1, y: 0, duration: 0.5, ease: 'back.out(3)',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true }, delay: 0.18
          });
      });
      gsap.set(finalCard, { opacity: 0, y: 40 });
      gsap.to(finalCard, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: finalCard, start: 'top 88%', once: true }
      });
    } else if (HAS_GSAP) {
      $$('.placard').forEach(function (card) {
        gsap.fromTo(card, { opacity: 0 }, {
          opacity: 1, duration: 0.5,
          scrollTrigger: { trigger: card, start: 'top 92%', once: true }
        });
      });
    }
  }


  /* ─────────────── 10 · THE FINISHED PAINTING (it was her all along) ─────────────── */

  const Painting = (function () {
    const canvas = $('#paintingCanvas');
    if (!canvas) return { build: function () {}, render: function () {}, addSignature: function () {} };

    const ctx = canvas.getContext('2d', { alpha: true });
    let W = 0, H = 0;
    let marks = [];
    let drawn = 0;
    let progress = 0;
    let signature = null;
    let signatureDrawn = false;

    function size() {
      const d = fitCanvas(canvas, ctx);
      W = d.w; H = d.h;
    }

    /**
     * Everything she touched on the way down, ordered into layers:
     *   A washes · B the sweep of her cursor · C her actual brushwork · D flecks
     */
    function build() {
      const seedBits = Art.choices.reduce(function (a, c, i) {
        return a + ((c === undefined ? 3 : c) + 1) * (i + 7) * 31;
      }, 1013);
      const rnd = mulberry32(seedBits + Art.strokes.length * 977 + Art.trail.length);
      const out = [];

      /* A · ground washes — big soft blooms of pigment */
      const washCount = 7;
      for (let i = 0; i < washCount; i++) {
        const color = PIGMENTS[(Art.choices[i % 5] !== undefined ? Art.choices[i % 5] : i) % PIGMENTS.length];
        const cx = 0.16 + rnd() * 0.68;
        const cy = 0.18 + rnd() * 0.62;
        const rad = 0.16 + rnd() * 0.2;
        // each wash is a cluster of overlapping dabs so the edge stays organic
        for (let k = 0; k < 16; k++) {
          const a = rnd() * Math.PI * 2;
          const d = rnd() * rad * 0.55;
          out.push({
            x: cx + Math.cos(a) * d,
            y: cy + Math.sin(a) * d * 0.8,
            r: rad * (0.55 + rnd() * 0.5),
            c: color,
            a: 0.035 + rnd() * 0.03
          });
        }
      }

      /* B · the path her cursor actually took */
      const trail = Art.trail.slice();
      if (trail.length > 24) {
        const stride = Math.max(1, Math.floor(trail.length / 150));
        for (let i = stride; i < trail.length; i += stride) {
          const p = trail[i], q = trail[i - stride];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist > 0.3) continue;                 // don't connect across jumps
          const steps = Math.max(1, Math.round(dist / 0.012));
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            out.push({
              x: lerp(q.x, p.x, t),
              y: lerp(q.y, p.y, t) * 0.92 + 0.04,
              r: Math.max(0.012, p.r * (0.8 + rnd() * 0.8)),
              c: p.c,
              a: 0.05 + rnd() * 0.035
            });
          }
        }
      } else {
        // she may have arrived by touch and never hovered — compose it for her
        for (let arc = 0; arc < 5; arc++) {
          const color = PIGMENTS[arc % PIGMENTS.length];
          const x0 = rnd(), y0 = 0.15 + rnd() * 0.7;
          const x1 = rnd(), y1 = 0.15 + rnd() * 0.7;
          const cx = 0.5 + (rnd() - 0.5) * 0.9, cy = 0.5 + (rnd() - 0.5) * 0.9;
          for (let s = 0; s <= 90; s++) {
            const t = s / 90, it = 1 - t;
            out.push({
              x: it * it * x0 + 2 * it * t * cx + t * t * x1,
              y: it * it * y0 + 2 * it * t * cy + t * t * y1,
              r: 0.02 + rnd() * 0.035,
              c: color,
              a: 0.045
            });
          }
        }
      }

      /* C · her brushwork, scaled up and centred — the focal marks */
      const strokes = Art.strokes;
      if (strokes && strokes.length) {
        let minX = 1, minY = 1, maxX = 0, maxY = 0;
        strokes.forEach(function (s) {
          s.pts.forEach(function (p) {
            if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
          });
        });
        const bw = Math.max(0.06, maxX - minX);
        const bh = Math.max(0.06, maxY - minY);
        // fit her drawing into the middle of the frame, aspect preserved
        const scale = Math.min(0.62 / bw, 0.58 / bh);
        const offX = 0.5 - (minX + bw / 2) * scale;
        const offY = 0.47 - (minY + bh / 2) * scale;

        strokes.forEach(function (s) {
          const rBase = (s.size / 2 / s.wRef) * scale * 1.35;
          const pts = s.pts;
          for (let i = 1; i < pts.length; i++) {
            const ax = pts[i - 1].x * scale + offX, ay = pts[i - 1].y * scale + offY;
            const bx = pts[i].x * scale + offX, by = pts[i].y * scale + offY;
            const dist = Math.hypot(bx - ax, by - ay);
            const steps = Math.max(1, Math.round(dist / Math.max(0.004, rBase * 0.35)));
            for (let s2 = 1; s2 <= steps; s2++) {
              const t = s2 / steps;
              out.push({
                x: lerp(ax, bx, t),
                y: lerp(ay, by, t),
                r: rBase * (0.9 + rnd() * 0.25),
                c: s.color,
                a: 0.15,
                k: 'firm'
              });
            }
          }
          if (pts.length === 1) {
            out.push({ x: pts[0].x * scale + offX, y: pts[0].y * scale + offY, r: rBase, c: s.color, a: 0.16, k: 'firm' });
          }
        });
      } else {
        // nothing drawn? then the page paints a few gestures in her palette
        for (let g = 0; g < 4; g++) {
          const color = PIGMENTS[g % PIGMENTS.length];
          const x0 = 0.25 + rnd() * 0.2, y0 = 0.25 + rnd() * 0.45;
          const dx = (rnd() - 0.4) * 0.45, dy = (rnd() - 0.5) * 0.4;
          for (let s = 0; s <= 60; s++) {
            const t = s / 60;
            out.push({
              x: x0 + dx * t + Math.sin(t * 5 + g) * 0.03,
              y: y0 + dy * t + Math.cos(t * 4 + g) * 0.03,
              r: 0.028 + rnd() * 0.02,
              c: color,
              a: 0.11,
              k: 'firm'
            });
          }
        }
      }

      /* D · flecks, the last thing any painter does */
      for (let i = 0; i < 55; i++) {
        out.push({
          x: rnd(), y: rnd(),
          r: 0.004 + rnd() * 0.011,
          c: PIGMENTS[Math.floor(rnd() * PIGMENTS.length)],
          a: 0.16 + rnd() * 0.2
        });
      }

      marks = out.length > 2200 ? out.slice(0, 2200) : out;
      drawn = 0;
      ctx.clearRect(0, 0, W, H);
      signatureDrawn = false;
    }

    function drawMark(m) {
      dab(ctx, m.x * W, m.y * H, m.r * W, m.c, m.a, m.k);
    }

    function drawSignature() {
      if (!signature || signatureDrawn || !signature.length) return;
      signatureDrawn = true;
      // bottom-right corner, small, like any signed canvas
      let minX = 1, minY = 1, maxX = 0, maxY = 0;
      signature.forEach(function (s) {
        s.pts.forEach(function (p) {
          if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
        });
      });
      const bw = Math.max(0.05, maxX - minX), bh = Math.max(0.05, maxY - minY);
      const targetW = 0.2;
      const scale = Math.min(targetW / bw, 0.1 / bh);
      const offX = 0.97 - (maxX * scale);
      const offY = 0.93 - (maxY * scale);

      signature.forEach(function (s) {
        const r = Math.max(0.0022, (s.size / 2 / s.wRef) * scale);
        const pts = s.pts;
        for (let i = 1; i < pts.length; i++) {
          const ax = pts[i - 1].x * scale + offX, ay = pts[i - 1].y * scale + offY;
          const bx = pts[i].x * scale + offX, by = pts[i].y * scale + offY;
          const dist = Math.hypot(bx - ax, by - ay);
          const steps = Math.max(1, Math.round(dist / Math.max(0.002, r * 0.4)));
          for (let s2 = 1; s2 <= steps; s2++) {
            const t = s2 / steps;
            dab(ctx, (lerp(ax, bx, t)) * W, (lerp(ay, by, t)) * H, r * W, '#22201C', 0.22, 'firm');
          }
        }
      });
      ctx.globalAlpha = 1;
    }

    function render(p) {
      progress = clamp(p, 0, 1);
      const target = Math.floor(progress * marks.length);
      if (target < drawn) {                 // scrubbed backwards — start over
        ctx.clearRect(0, 0, W, H);
        drawn = 0;
        signatureDrawn = false;
      }
      for (let i = drawn; i < target; i++) drawMark(marks[i]);
      ctx.globalAlpha = 1;
      drawn = target;
      if (drawn >= marks.length && marks.length) drawSignature();
    }

    function rerender() {
      size();
      ctx.clearRect(0, 0, W, H);
      drawn = 0;
      signatureDrawn = false;
      render(progress);
    }

    size();
    window.addEventListener('resize', debounce(rerender, 200));

    return {
      build: build,
      render: render,
      rerender: rerender,
      addSignature: function (strokes) {
        signature = strokes;
        signatureDrawn = false;
        if (drawn >= marks.length && marks.length) drawSignature();
      }
    };
  })();

  function initPainting() {
    const stage = $('.painting-stage');
    const tag = $('#paintingTag');
    if (tag) tag.textContent = PAINTING_TAG;
    if (!stage) return;

    // the letter itself
    const body = $('#letterBody');
    if (body) {
      body.innerHTML = '';
      LETTER_TEXT.split(/\n\s*\n/).forEach(function (para) {
        const p = document.createElement('p');
        p.textContent = para.replace(/\s*\n\s*/g, ' ').trim();
        body.appendChild(p);
      });
    }
    const signEl = $('#letterSign');
    if (signEl) signEl.textContent = LETTER_SIGN;

    if (!HAS_GSAP) { Painting.build(); Painting.render(1); return; }

    if (REDUCED) {
      ST.create({
        trigger: stage, start: 'top 85%', once: true,
        onEnter: function () { Painting.build(); Painting.render(1); }
      });
      gsap.fromTo('.letter-placard', { opacity: 0 }, {
        opacity: 1, duration: 0.6,
        scrollTrigger: { trigger: '.letter-placard', start: 'top 90%', once: true }
      });
      return;
    }

    // built at the moment she arrives, so it contains everything she's done
    let built = false;
    ST.create({
      trigger: stage,
      start: 'top 92%',
      end: 'bottom 55%',
      scrub: 0.7,
      onEnter: function () { if (!built) { built = true; Painting.build(); } },
      onEnterBack: function () { if (!built) { built = true; Painting.build(); } },
      onUpdate: function (self) {
        if (!built) { built = true; Painting.build(); }
        // ease the assembly so it lands rather than stops
        const p = self.progress;
        Painting.render(p < 1 ? 1 - Math.pow(1 - p, 1.6) : 1);
      }
    });

    gsap.set('.letter-placard', { opacity: 0, y: 46 });
    gsap.to('.letter-placard', {
      opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.letter-placard', start: 'top 86%', once: true }
    });
    gsap.fromTo('.painting-stage__tag', { opacity: 0 }, {
      opacity: 0.85, duration: 1, delay: 0.5,
      scrollTrigger: { trigger: stage, start: 'top 60%', once: true }
    });
  }


  /* ───────────────────────── 11 · SIGN THE CANVAS ───────────────────────── */

  function initSign() {
    const canvas = $('#signCanvas');
    const done = $('#signDone');
    const hint = $('#signHint');
    const clearBtn = $('#clearSign');
    if (!canvas) return;

    if (hint) hint.textContent = SIGN_HINT;

    let celebrated = false;

    const sig = PaintSurface(canvas, {
      color: '#22201C',
      size: 9,
      onStrokeEnd: function () {
        Art.signature = sig.strokes;
        Painting.addSignature(sig.strokes);
        if (celebrated) return;
        celebrated = true;
        if (done) {
          done.textContent = SIGN_DONE;
          done.classList.add('is-on');
        }
        if (!REDUCED) {
          const r = canvas.getBoundingClientRect();
          Ambient.burst(r.left + r.width / 2, r.top + r.height / 2, 60);
          setTimeout(function () {
            Ambient.burst(r.left + r.width * 0.25, r.top + r.height / 2, 30);
            Ambient.burst(r.left + r.width * 0.75, r.top + r.height / 2, 30);
          }, 260);
        }
        openStudioDoor();
      }
    });

    canvas.addEventListener('pointerenter', function () { Ambient.suppress(true); });
    canvas.addEventListener('pointerleave', function () { Ambient.suppress(false); });

    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        sig.clear();
        Art.signature = null;
        if (done) { done.classList.remove('is-on'); }
        celebrated = false;
        Ambient.splat(e.clientX, e.clientY, PIGMENTS[3]);
      });
    }

    window.addEventListener('resize', debounce(function () { sig.resize(); }, 180));
  }


  /* ─────────────── 11b · THE DOOR TO THE STUDIO (§12) ─────────────── */

  /**
   * Signing the canvas unlocks a second room. The door panels split apart and
   * pigment spills through the gap. Called once, from the signature handler.
   */
  let doorOpened = false;
  function openStudioDoor() {
    const door = $('#studioDoor');
    if (!door || doorOpened) return;
    doorOpened = true;
    door.hidden = false;

    if (!HAS_GSAP || REDUCED) {
      door.style.opacity = '1';
      return;
    }

    const panels = $$('.door__panel', door);
    const tl = gsap.timeline({ delay: 0.85, defaults: { ease: 'power3.out' } });

    gsap.set(door, { opacity: 0, y: 26 });
    gsap.set('.door__inner', { opacity: 0, scale: 0.94 });

    tl.to(door, { opacity: 1, y: 0, duration: 0.8 })
      // the two halves swing open
      .to(panels[0], { xPercent: -102, duration: 1.15, ease: 'power4.inOut' }, 0.25)
      .to(panels[1], { xPercent: 102, duration: 1.15, ease: 'power4.inOut' }, 0.25)
      // pigment floods out of the gap
      .fromTo('.door__spill',
        { opacity: 0, scale: 0.25 },
        { opacity: 0.9, scale: 1.5, duration: 1.5, ease: 'power2.out' }, 0.4)
      .to('.door__spill', { opacity: 0.34, duration: 1.2 }, 1.5)
      .to('.door__inner', { opacity: 1, scale: 1, duration: 0.9 }, 0.75)
      .add(function () {
        const r = door.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          Ambient.burst(r.left + r.width / 2, r.top + r.height / 2, 40);
        }
      }, 0.95);
  }


  /* ───────────────────── 12 · REVEALS, WIRING, LIFECYCLE ───────────────────── */

  function debounce(fn, wait) {
    let t = 0;
    return function () {
      const args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait);
    };
  }

  function initReveals() {
    if (!HAS_GSAP) return;
    $$('[data-reveal]').forEach(function (el) {
      gsap.set(el, { opacity: 0, y: REDUCED ? 0 : 26 });
      gsap.to(el, {
        opacity: 1, y: 0,
        duration: REDUCED ? 0.5 : 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  }

  function initFooter() {
    const f = $('#footerNote');
    if (f) f.textContent = FOOTER_NOTE;
    document.title = 'For ' + FRIEND_NAME + ' — Happy Friendship Day';
  }

  function boot() {
    initScroll();
    initAnchors();
    initFooter();
    initHero();
    initCounter();
    initPaint();
    initMuseum();
    initPainting();
    initSign();
    initReveals();

    if (HAS_GSAP) {
      // fonts change layout; re-measure once they've landed
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { ST.refresh(); });
      }
      window.addEventListener('load', function () { ST.refresh(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
