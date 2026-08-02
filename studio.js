/* ============================================================================
 *  THE STUDIO — three gentle rooms, for Mansi
 *  ---------------------------------------------------------------------------
 *  Blocks:  1 CONFIG · 2 utils · 3 boot · 4 ambient · 5 export · 6 router
 *           7 entrance · 8 Restoration Room · 9 Colour Mix Lab
 *           10 Paint-by-Scroll
 *
 *  No timers, no scores, no fail states. Everything ends with something she
 *  can keep.
 * ========================================================================= */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════
   *  1 · CONFIG — EVERYTHING PERSONAL LIVES HERE.
   *      Change these and nothing else. Replaceable artwork is marked with
   *      PORTRAIT_SWAP (below) and SCENE_SWAP (in studio.html).
   * ═══════════════════════════════════════════════════════════════════════ */

  const FRIEND_NAME = "Mansi";
  const YOUR_NAME   = "Nishant";

  /** Stamped into the corner of every saved image. */
  const EXPORT_MARK = "for " + FRIEND_NAME + " · from " + YOUR_NAME + " · Happy Friendship Day";

  /** Same four pigments as the main site. */
  const PIGMENTS = ["#E8552D", "#2B4A8B", "#1F7A5A", "#F2C14E"];

  /** Landing copy. */
  const LANDING_EYEBROW = "the studio · always open";
  const LANDING_FOOTER  = "made for " + FRIEND_NAME + " · with paint and pixels";

  /** The three rooms, in emotional order. `thumb` is the little easel preview. */
  const GAMES = [
    {
      id: "restore",
      view: "viewRestore",
      name: "Restoration Room",
      blurb: "A canvas that's gone dusty. Brush it back and see who's underneath.",
      go: "start cleaning →",
      thumb:
        '<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="80" height="100" fill="#F2C14E" opacity=".28"/>' +
        '<circle cx="40" cy="34" r="18" fill="#2B4A8B"/>' +
        '<path d="M14 100c0-24 12-42 26-42s26 18 26 42z" fill="#2B4A8B"/>' +
        '<rect x="42" y="0" width="38" height="100" fill="#B4AEA2" opacity=".92"/>' +
        '</svg>'
    },
    {
      id: "mix",
      view: "viewMix",
      name: "Colour & Coloring Lab",
      blurb: "Stir two pigments together, then colour six drawings with what you made.",
      go: "start mixing →",
      thumb:
        '<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="80" height="100" fill="#F7F4EF"/>' +
        '<circle cx="31" cy="44" r="22" fill="#E8552D" opacity=".85"/>' +
        '<circle cx="49" cy="58" r="22" fill="#2B4A8B" opacity=".78"/>' +
        '<circle cx="40" cy="51" r="9" fill="#1F7A5A" opacity=".6"/>' +
        '</svg>'
    },
    {
      id: "paint",
      view: "viewPaint",
      name: "Paint-by-Scroll",
      blurb: "Little moments, one at a time, until a picture turns up.",
      go: "start filling →",
      thumb:
        '<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="80" height="100" fill="#FBF1DF"/>' +
        '<circle cx="60" cy="24" r="12" fill="#F2C14E"/>' +
        '<path d="M0 68c18-8 40-4 80-12v44H0z" fill="#1F7A5A"/>' +
        '<circle cx="30" cy="56" r="9" fill="#E8552D"/>' +
        '<circle cx="55" cy="62" r="7" fill="#F2C14E"/>' +
        '</svg>'
    }
  ];

  /* ── Game 1 · Restoration Room ──────────────────────────────────────────
     Lines fade in one at a time as she uncovers more of the portrait.
     `at` is the fraction of dust removed that triggers the line.            */
  const RESTORATION_LINES = [
    { at: 0.15, text: "Some things fade. Your worth was never one of them." },
    { at: 0.35, text: "The dust settles on everything but the good in you." },
    { at: 0.55, text: "What's underneath was always lovely — it just waited to be seen." },
    { at: 0.75, text: "Keep your heart light. The best is still ahead." },
    { at: 0.90, text: "Clear away the doubt, and there you are — enough, all along." },
    { at: 1.00, text: "This is you. Just as you always were. 🤍" }
  ];
  const RESTORE_HINT = "brush the dust away";

  /* What's underneath the dust is a post — hers. */
  const IG_HANDLE = FRIEND_NAME.toLowerCase();
  const IG_LOCATION = "somewhere with a view";
  const IG_LIKED_BY = "Liked by " + YOUR_NAME.toLowerCase() + " and others";
  const IG_TIMESTAMP = "today";
  const IG_CAPTION_PLACEHOLDER = "chasing sunrises…";
  const IG_CAPTION_LABEL = "write your caption";

  /* ── Game 2 · Colour Mix Lab ────────────────────────────────────────────
     `recipe` is the ratio of pigments, order doesn't matter and neither does
     how many drops she uses — 2 cadmium + 2 naples is the same 1:1 mix as
     1 + 1. "A touch of" something is simply a smaller share (see gold).     */
  const WELLS = [
    { id: "cadmium",     name: "Cadmium",       hex: "#E8552D" },
    { id: "naples",      name: "Naples Yellow", hex: "#F2C14E" },
    { id: "viridian",    name: "Viridian",      hex: "#1F7A5A" },
    { id: "ultramarine", name: "Ultramarine",   hex: "#2B4A8B" },
    { id: "white",       name: "Titanium White", hex: "#FFFFFF" },
    { id: "ink",         name: "Ink Black",     hex: "#22201C" }
  ];

  const COLOR_BLENDS = [
    { name: "warm orange", recipe: { cadmium: 1, naples: 1 },     resultColor: "#ED8B3F", memory: "a morning that goes well." },
    { name: "deep blue",   recipe: { ultramarine: 1, ink: 1 },    resultColor: "#263553", memory: "a quiet, private prayer." },
    { name: "green",       recipe: { viridian: 1, naples: 1 },    resultColor: "#899D54", memory: "growing, slow and certain." },
    { name: "soft rose",   recipe: { cadmium: 1, white: 1 },      resultColor: "#F3AA96", memory: "gentleness for small creatures." },
    { name: "gold",        recipe: { naples: 2, cadmium: 1 },     resultColor: "#EFA646", memory: "the light you carry home." },
    { name: "violet",      recipe: { ultramarine: 1, cadmium: 1 }, resultColor: "#8A4E6B", memory: "a ceiling, about to be painted past." }
  ];

  /** Ambient studio sound — never autoplays regardless; this only pre-arms it. */
  const MUSIC_ON_BY_DEFAULT = false;

  /** Coloring Lab (§4b) copy. The drawings live in studio.html (SKETCHES_SWAP). */
  const COLOR_HINT = "your colours · tap one, then tap the drawing";
  const COLOR_FIRST_HINT = "mix a colour first, or use a pigment below";
  const SKETCH_CARD_LINE = "coloured in by " + FRIEND_NAME + ".";

  const MIX_EMPTY_HINT   = "tap two pigments";
  const MIX_UNNAMED      = "a colour that doesn't have a name yet. it's yours.";
  const MIX_SAVE_AFTER   = 3;   // collected swatches before "Save palette" appears
  const MIX_CARD_TITLE   = FRIEND_NAME + "'s Palette";
  const MIX_CARD_LINE    = "every colour you found remembers something.";

  /* ── Game 3 · Paint-by-Scroll ───────────────────────────────────────────
     One action per region of the scene, in order. Types:
       bubble · prompt · leaf · brush · dab                                  */
  const PAINT_INTRO = "fill it in, one little moment at a time.";
  const PAINT_DONE  = "There it is — the joy you started with.";

  const PAINT_ACTIONS = [
    { type: "bubble", prompt: "pop a bubble" },
    { type: "prompt", prompt: "one tap, no wrong answer",
      question: "today, are you being kind to yourself?",
      choices: ["trying to be", "getting better at it"] },
    { type: "leaf",   prompt: "catch the leaf" },
    { type: "brush",  prompt: "drag a brush across" },
    { type: "dab",    prompt: "tap two colours to mix" },
    { type: "bubble", prompt: "pop another" },
    { type: "prompt", prompt: "one tap, no wrong answer",
      question: "what did you make this week?",
      choices: ["something small", "something for someone else"] },
    { type: "leaf",   prompt: "one more leaf" },
    { type: "brush",  prompt: "last stroke — go on" }
  ];

  /* ═══════════════════════ END OF CONFIG ═══════════════════════ */


  /* ───────────────────────── 2 · UTILITIES ───────────────────────── */

  const $ = function (s, r) { return (r || document).querySelector(s); };
  const $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };
  const clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  const lerp = function (a, b, t) { return a + (b - a) * t; };

  /* The same motion vocabulary the main site uses (§8) — shared deliberately,
     so the two halves of the gift feel like one hand made them. */
  const EASE_OUT = 'power3.out';    // things arriving
  const EASE_IO = 'power2.inOut';   // things travelling through
  const EASE_SOFT = 'power2.out';   // small settles
  const D_SLOW = 1.2, D_MED = 0.9, D_FAST = 0.6;

  function rgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function toRGB(hex) {
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function toHex(r, g, b) {
    const h = function (v) { return ('0' + clamp(Math.round(v), 0, 255).toString(16)).slice(-2); };
    return '#' + h(r) + h(g) + h(b);
  }

  const DPR = function () { return Math.min(window.devicePixelRatio || 1, 2); };

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

  /* pre-rendered soft dabs, same trick the main site uses */
  const spriteCache = new Map();
  function sprite(color) {
    let c = spriteCache.get(color);
    if (c) return c;
    const S = 128;
    c = document.createElement('canvas');
    c.width = c.height = S;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, rgba(color, 1));
    g.addColorStop(0.5, rgba(color, 0.92));
    g.addColorStop(0.8, rgba(color, 0.38));
    g.addColorStop(1, rgba(color, 0));
    x.fillStyle = g;
    x.fillRect(0, 0, S, S);
    spriteCache.set(color, c);
    return c;
  }
  function dab(ctx, x, y, r, color, alpha) {
    if (r <= 0.2) return;
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprite(color), x - r, y - r, r * 2, r * 2);
  }

  function debounce(fn, wait) {
    let t = 0;
    return function () {
      const a = arguments, s = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(s, a); }, wait);
    };
  }

  /** Wrap text on a canvas. Returns the y after the last line. */
  function wrapText(ctx, text, x, y, maxW, lineH, align) {
    ctx.textAlign = align || 'center';
    const words = String(text).split(' ');
    let line = '';
    const lines = [];
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = words[i];
      } else line = test;
    }
    if (line) lines.push(line);
    lines.forEach(function (l, i) { ctx.fillText(l, x, y + i * lineH); });
    return y + lines.length * lineH;
  }


  /* ───────────────────────── 3 · BOOT ───────────────────────── */

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COARSE = window.matchMedia('(pointer: coarse)').matches;
  const HAS_GSAP = typeof window.gsap !== 'undefined' &&
                   typeof window.ScrollTrigger !== 'undefined';
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  if (HAS_GSAP) gsap.registerPlugin(ST);

  let lenis = null;
  function initScroll() {
    const Lenis = window.Lenis && (window.Lenis.default || window.Lenis);
    if (!HAS_GSAP || REDUCED || typeof Lenis !== 'function') return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.7, smoothWheel: true });
    lenis.on('scroll', ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function toast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('is-on'); }, 2600);
  }


  /* ─────────────────── 4 · AMBIENT (pigment confetti) ─────────────────── */

  const Ambient = (function () {
    const canvas = $('#ambient');
    if (!canvas || REDUCED) return { burst: function () {}, splat: function () {} };

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, running = false, idle = 0;
    const MAX = 130;
    const bits = [];
    const dabs = [];

    function size() {
      W = window.innerWidth; H = window.innerHeight;
      const d = DPR();
      canvas.width = Math.round(W * d);
      canvas.height = Math.round(H * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    function wake() { idle = 0; if (!running) { running = true; requestAnimationFrame(frame); } }

    function fleck(x, y, power, color) {
      if (bits.length >= MAX) return;
      const a = Math.random() * Math.PI * 2;
      const s = (0.8 + Math.random() * 1.9) * power;
      bits.push({
        x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - power * 1.2,
        w: 3 + Math.random() * 7, h: 2 + Math.random() * 5,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
        life: 1, decay: 0.011 + Math.random() * 0.013,
        c: color || PIGMENTS[Math.floor(Math.random() * PIGMENTS.length)]
      });
    }

    function burst(x, y, count, color) {
      const n = Math.min(count || 50, MAX - bits.length);
      for (let i = 0; i < n; i++) fleck(x, y, 2 + Math.random() * 1.8, color);
      wake();
    }
    function splat(x, y, color) {
      const c = color || PIGMENTS[Math.floor(Math.random() * PIGMENTS.length)];
      for (let i = 0; i < 12; i++) {
        const a = Math.random() * Math.PI * 2, d = 6 + Math.random() * 24;
        if (dabs.length < 80) {
          dabs.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, r: 4 + Math.random() * 12, c: c, a: 0.16 });
        }
      }
      for (let i = 0; i < 4; i++) fleck(x, y, 2.2, c);
      wake();
    }

    function frame() {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';

      let busy = false;
      for (let i = 0; i < dabs.length; i++) dab(ctx, dabs[i].x, dabs[i].y, dabs[i].r, dabs[i].c, dabs[i].a);
      if (dabs.length) { dabs.length = 0; busy = true; }

      for (let i = bits.length - 1; i >= 0; i--) {
        const p = bits[i];
        p.vy += 0.16; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= p.decay;
        if (p.life <= 0 || p.y > H + 60) { bits.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = clamp(p.life, 0, 1) * 0.85;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        busy = true;
      }
      ctx.globalAlpha = 1;

      idle = busy ? 0 : idle + 1;
      if (idle > 90) { running = false; ctx.clearRect(0, 0, W, H); return; }
      requestAnimationFrame(frame);
    }

    size();
    window.addEventListener('resize', size);
    return { burst: burst, splat: splat };
  })();

  function burstFrom(el, count, color) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    Ambient.burst(r.left + r.width / 2, r.top + r.height / 2, count, color);
  }


  /* ─────────────────── 5 · EXPORT (save / share a PNG) ─────────────────── */

  const CARD_W = 1080, CARD_H = 1350;

  /**
   * One shared card composer for all three games.
   * opts = { file, eyebrow, line, draw(ctx, box) }  — `draw` may return a Promise.
   * `box` is the content rectangle reserved for the artwork.
   */
  async function exportCard(opts) {
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (e) { /* carry on with fallbacks */ }
    }

    const c = document.createElement('canvas');
    c.width = CARD_W; c.height = CARD_H;
    const ctx = c.getContext('2d');

    // ground
    ctx.fillStyle = '#F7F4EF';
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    // paper grain
    const grain = ctx.createImageData(CARD_W, CARD_H);
    const gd = grain.data;
    for (let i = 0; i < gd.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * 46;
      gd[i] = gd[i + 1] = gd[i + 2] = v;
      gd[i + 3] = 12;
    }
    ctx.putImageData(grain, 0, 0);
    ctx.fillStyle = 'rgba(247,244,239,0.82)';
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    /* The painterly framer (§6.2): loose pigment brushed along the edges under
       two hairlines, so every saved piece looks like it came from the same
       hand and the same collection. */
    const edge = 30;
    for (let i = 0; i < 150; i++) {
      const side = i % 4;
      const t = Math.random();
      let px, py;
      if (side === 0) { px = lerp(edge, CARD_W - edge, t); py = edge + (Math.random() - 0.5) * 16; }
      else if (side === 1) { px = CARD_W - edge + (Math.random() - 0.5) * 16; py = lerp(edge, CARD_H - edge, t); }
      else if (side === 2) { px = lerp(edge, CARD_W - edge, t); py = CARD_H - edge + (Math.random() - 0.5) * 16; }
      else { px = edge + (Math.random() - 0.5) * 16; py = lerp(edge, CARD_H - edge, t); }
      dab(ctx, px, py, 9 + Math.random() * 16,
          PIGMENTS[Math.floor(Math.random() * PIGMENTS.length)], 0.05);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(34,32,28,0.18)';
    ctx.lineWidth = 2;
    ctx.strokeRect(38, 38, CARD_W - 76, CARD_H - 76);
    ctx.strokeStyle = 'rgba(34,32,28,0.07)';
    ctx.strokeRect(54, 54, CARD_W - 108, CARD_H - 108);

    // eyebrow
    ctx.fillStyle = '#8C877D';
    ctx.font = '400 26px "Space Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(String(opts.eyebrow || '').toLowerCase(), CARD_W / 2, 138);

    // the artwork
    const box = { x: 110, y: 190, w: CARD_W - 220, h: 760 };
    await opts.draw(ctx, box);

    // the line
    ctx.fillStyle = '#22201C';
    ctx.font = '500 46px Fraunces, Georgia, serif';
    ctx.textAlign = 'center';
    const endY = wrapText(ctx, opts.line || '', CARD_W / 2, 1055, CARD_W - 190, 60);

    // the mark
    ctx.fillStyle = '#8C877D';
    ctx.font = '400 24px "Space Mono", ui-monospace, monospace';
    ctx.fillText(EXPORT_MARK, CARD_W / 2, Math.max(endY + 74, CARD_H - 108));

    return new Promise(function (resolve) {
      c.toBlob(function (blob) { resolve(blob); }, 'image/png');
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  /** Download is the guaranteed path; the share sheet is a bonus where it exists. */
  async function saveOrShare(opts, wantShare) {
    let blob;
    try {
      blob = await exportCard(opts);
    } catch (e) {
      toast("couldn't build the image — try again");
      return;
    }
    if (!blob) { toast("couldn't build the image — try again"); return; }

    const filename = opts.file || 'mansi-studio.png';
    // everything she saves joins the collection, however she saves it
    Collection.add(blob, opts.label || opts.eyebrow || 'a piece', filename);

    if (wantShare && navigator.canShare) {
      try {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'The Studio' });
          return;
        }
      } catch (e) {
        if (e && e.name === 'AbortError') return;   // she changed her mind
      }
    }
    downloadBlob(blob, filename);
    toast('saved to your downloads 🤍');
  }

  /** Show the Share button only where the browser can actually share a file. */
  function enableShareButtons() {
    if (!navigator.canShare) return;
    let ok = false;
    try {
      ok = navigator.canShare({ files: [new File([new Blob(['x'])], 'x.png', { type: 'image/png' })] });
    } catch (e) { ok = false; }
    if (ok) $$('[data-share]').forEach(function (b) { b.hidden = false; });
  }


  /* ─────────────── 5b · MY COLLECTION (§2) ─────────────── */

  /** Everything she saves also lands in a session tray — a little portfolio. */
  const Collection = (function () {
    const btn = $('#collectionBtn');
    const count = $('#collectionN');
    const tray = $('#tray');
    const items = $('#trayItems');
    const closeBtn = $('#trayClose');
    if (!btn || !tray || !items) return { add: function () {} };

    const kept = [];

    function open(on) {
      tray.classList.toggle('is-open', on);
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      if (on) closeBtn.focus({ preventScroll: true });
    }

    btn.addEventListener('click', function () { open(!tray.classList.contains('is-open')); });
    closeBtn.addEventListener('click', function () { open(false); btn.focus({ preventScroll: true }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && tray.classList.contains('is-open')) { open(false); btn.focus(); }
    });

    return {
      add: function (blob, label, filename) {
        const url = URL.createObjectURL(blob);
        kept.push({ url: url, label: label, filename: filename });

        const fig = document.createElement('figure');
        fig.className = 'tray__item';
        fig.setAttribute('role', 'button');
        fig.tabIndex = 0;
        fig.setAttribute('aria-label', 'Save ' + label + ' again');
        const img = document.createElement('img');
        img.src = url;
        img.alt = label;
        const cap = document.createElement('figcaption');
        cap.textContent = label;
        fig.appendChild(img);
        fig.appendChild(cap);

        const again = function () { downloadBlob(blob, filename); toast('saved again 🤍'); };
        fig.addEventListener('click', again);
        fig.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); again(); }
        });

        items.appendChild(fig);
        btn.hidden = false;
        if (count) count.textContent = kept.length;
        if (HAS_GSAP && !REDUCED) {
          gsap.fromTo(fig, { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2)' });
          gsap.fromTo(btn, { scale: 1 }, { scale: 1.12, duration: 0.22, yoyo: true, repeat: 1 });
        }
      }
    };
  })();


  /* ─────────────── 5c · AMBIENT STUDIO SOUND (§6.4) ─────────────── */

  /* Off by default, never autoplays, built with WebAudio so there's no asset
     to ship. Two detuned oscillators through a lowpass, breathing slowly. */
  const Sound = (function () {
    const btn = $('#soundBtn');
    if (!btn) return;
    let actx = null, master = null, nodes = [], on = false;

    function build() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      actx = new AC();
      master = actx.createGain();
      master.gain.value = 0;
      master.connect(actx.destination);

      /* Warmth comes from three things, not from the notes alone:
         a gentle delay for air, a low-passed triangle body under sines,
         and a filter that drifts so the pad never sits still. */
      const air = actx.createDelay(1.2);
      air.delayTime.value = 0.42;
      const feedback = actx.createGain();
      feedback.gain.value = 0.34;
      const airLevel = actx.createGain();
      airLevel.gain.value = 0.45;
      air.connect(feedback); feedback.connect(air);
      air.connect(airLevel); airLevel.connect(master);

      const filter = actx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 540;
      filter.Q.value = 0.4;
      filter.connect(master);
      filter.connect(air);

      // takes the boxiness out of the low end
      const clean = actx.createBiquadFilter();
      clean.type = 'highpass';
      clean.frequency.value = 70;
      clean.connect(filter);

      // the cutoff breathes very slowly — this is most of the "gentle"
      const sweep = actx.createOscillator();
      sweep.frequency.value = 0.028;
      const sweepAmt = actx.createGain();
      sweepAmt.gain.value = 190;
      sweep.connect(sweepAmt);
      sweepAmt.connect(filter.frequency);
      sweep.start();
      nodes.push(sweep);

      /* F major with a ninth — warm and open, and it never resolves, so it
         can sit under her for as long as she likes without asking for
         attention. Triangles underneath for body, sines on top for air. */
      const voices = [
        { f: 87.31,  type: 'triangle', gain: 0.30, lfo: 0.031 },  // F2
        { f: 130.81, type: 'triangle', gain: 0.24, lfo: 0.024 },  // C3
        { f: 174.61, type: 'sine',     gain: 0.20, lfo: 0.019 },  // F3
        { f: 261.63, type: 'sine',     gain: 0.13, lfo: 0.015 },  // C4
        { f: 329.63, type: 'sine',     gain: 0.07, lfo: 0.012 }   // E4 — the ninth
      ];

      voices.forEach(function (v, i) {
        const o = actx.createOscillator();
        o.type = v.type;
        o.frequency.value = v.f;
        o.detune.value = (i % 2 ? 4 : -4);      // a little chorus, not tuning drift

        const g = actx.createGain();
        g.gain.value = v.gain;

        // each voice swells on its own slow cycle, so they drift in and out
        const lfo = actx.createOscillator();
        lfo.frequency.value = v.lfo;
        const lfoGain = actx.createGain();
        lfoGain.gain.value = v.gain * 0.55;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);

        o.connect(g); g.connect(clean);
        o.start(); lfo.start();
        nodes.push(o, lfo);
      });
      return true;
    }

    function toggle() {
      if (!actx && !build()) { toast('sound is not available here'); return; }
      on = !on;
      if (actx.state === 'suspended') actx.resume();
      const t = actx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      // a long fade in, a shorter one out — it should arrive like weather
      master.gain.linearRampToValueAtTime(on ? 0.085 : 0, t + (on ? 3.4 : 1.4));
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Stop the studio sound' : 'Play quiet studio sound');
      const icon = $('#soundIcon');
      if (icon) icon.textContent = on ? '♫' : '♪';
    }

    btn.addEventListener('click', toggle);
    if (MUSIC_ON_BY_DEFAULT) {
      // still gated behind her first interaction — browsers require it
      document.addEventListener('pointerdown', function once() {
        document.removeEventListener('pointerdown', once);
        if (!on) toggle();
      }, { once: true });
    }
  })();


  /* ───────────────────────── 6 · VIEW ROUTER ───────────────────────── */

  const Views = (function () {
    let current = 'landing';
    let busy = false;

    function el(id) { return id === 'landing' ? $('#viewLanding') : $('#' + GAMES.filter(function (g) { return g.id === id; })[0].view); }

    function show(id, skipHistory) {
      if (busy || id === current) return;
      const from = el(current), to = el(id);
      if (!to) return;
      busy = true;

      const finish = function () {
        from.classList.remove('is-active');
        from.hidden = true;
        busy = false;
        // hand focus to the new view's heading
        const h = to.querySelector('h1, h2');
        if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
        if (id === 'landing') { if (lenis) lenis.start(); }
        else if (lenis) lenis.stop();
        current = id;
        onEnter(id);
      };

      to.hidden = false;
      to.classList.add('is-active');

      if (!HAS_GSAP || REDUCED) {
        gsapSafeSet(to, { opacity: 1, scale: 1 });
        finish();
      } else {
        // "walking up to the easel"
        gsap.set(to, { opacity: 0, scale: id === 'landing' ? 1.02 : 0.965 });
        gsap.to(from, { opacity: 0, duration: 0.28, ease: 'power2.in' });
        gsap.to(to, {
          opacity: 1, scale: 1, duration: 0.62, ease: EASE_OUT, delay: 0.16,
          onStart: function () { gsap.set(from, { opacity: 0 }); },
          onComplete: function () { gsap.set(from, { opacity: 1 }); finish(); }
        });
      }

      if (!skipHistory) {
        try {
          history.pushState({ view: id }, '', id === 'landing' ? '#' : '#' + id);
        } catch (e) { /* file:// can refuse pushState — navigation still works */ }
      }
    }

    function gsapSafeSet(node, props) {
      if (HAS_GSAP) gsap.set(node, props);
      else node.style.opacity = '1';
    }

    function onEnter(id) {
      if (id === 'restore') Restore.enter();
      if (id === 'mix') Mix.enter();
      if (id === 'paint') Paint.enter();
    }

    return {
      show: show,
      get current() { return current; },
      init: function () {
        // the phone's back button should leave a room, not the site
        window.addEventListener('popstate', function (e) {
          const id = (e.state && e.state.view) || 'landing';
          if (id !== current) show(id, true);
        });
        const hash = (location.hash || '').replace('#', '');
        if (hash && GAMES.some(function (g) { return g.id === hash; })) {
          // deep link straight into a room
          setTimeout(function () { show(hash, true); }, 60);
        }
      }
    };
  })();


  /* ───────────────────────── 7 · ENTRANCE ───────────────────────── */

  function initEntrance() {
    const ent = $('#entrance');
    if (!ent) return;
    if (!HAS_GSAP || REDUCED) { ent.classList.add('is-done'); return; }

    const tl = gsap.timeline({
      onComplete: function () { ent.classList.add('is-done'); }
    });
    tl.fromTo('.entrance__spill',
        { opacity: 0, scale: 0.3 },
        { opacity: 0.95, scale: 1.35, duration: 1.1, ease: EASE_SOFT }, 0.15)
      .to('.entrance__panel--l', { xPercent: -101, duration: 1.25, ease: 'power4.inOut' }, 0.35)
      .to('.entrance__panel--r', { xPercent: 101, duration: 1.25, ease: 'power4.inOut' }, 0.35)
      .to('.entrance__spill', { opacity: 0, scale: 2.1, duration: 0.9, ease: 'power2.in' }, 0.9)
      .fromTo('.landing__head > *',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.09, ease: EASE_OUT }, 0.85)
      .fromTo('.easel-card',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: EASE_OUT }, 1.1)
      .fromTo('.landing__foot', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.5);
  }

  function initLanding() {
    const eyebrow = $('#landingEyebrow');
    if (eyebrow) eyebrow.textContent = LANDING_EYEBROW;
    const foot = $('#studioFooterNote');
    if (foot) foot.textContent = LANDING_FOOTER;

    const list = $('#easels');
    if (!list) return;
    list.innerHTML = '';

    GAMES.forEach(function (g, i) {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'easel-card';
      b.setAttribute('aria-label', g.name + ' — ' + g.blurb);
      b.innerHTML =
        '<span class="easel-card__frame">' + g.thumb + '</span>' +
        '<span class="easel-card__body">' +
          '<span class="easel-card__n margin-note">room ' + '0' + (i + 1) + '</span>' +
          '<span class="easel-card__name"></span>' +
          '<span class="easel-card__blurb"></span>' +
          '<span class="easel-card__go"></span>' +
        '</span>';
      $('.easel-card__name', b).textContent = g.name;
      $('.easel-card__blurb', b).textContent = g.blurb;
      $('.easel-card__go', b).textContent = g.go;
      b.addEventListener('click', function (e) {
        Ambient.splat(e.clientX || 0, e.clientY || 0, PIGMENTS[i % PIGMENTS.length]);
        Views.show(g.id);
      });
      li.appendChild(b);
      list.appendChild(li);
    });

    $$('[data-back]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (history.state && history.state.view) history.back();
        else Views.show('landing');
      });
    });
  }


  /* ═══════════════ 8 · GAME 1 — RESTORATION ROOM ═══════════════ */

  const Restore = (function () {
    const frame = $('#restoreFrame');
    const pCanvas = $('#restorePortrait');
    const dCanvas = $('#restoreDust');
    const meter = $('#restoreMeter');
    const lineEl = $('#restoreLine');
    const hintEl = $('#restoreHint');
    const actions = $('#restoreActions');
    if (!frame || !pCanvas || !dCanvas) return { enter: function () {} };

    const pCtx = pCanvas.getContext('2d');
    const dCtx = dCanvas.getContext('2d', { willReadFrequently: true });
    let W = 0, H = 0;
    let started = false, done = false;
    let lineIdx = -1;
    let drawing = false, last = null;
    let captionText = '';   // whatever she types onto the post
    let lastCheck = 0;

    // low-res mirror used only to measure how much dust is gone
    const MW = 60, MH = 75;
    const meas = document.createElement('canvas');
    meas.width = MW; meas.height = MH;
    const mCtx = meas.getContext('2d', { willReadFrequently: true });

    /* ═══════════════════════════════════════════════════════════════
       PORTRAIT_SWAP · What's underneath the dust: an Instagram post.
       drawPortrait() lays out the post chrome (avatar, handle, action
       row, "Liked by…"), and calls drawSunrisePhoto() for the picture
       itself — a slim figure seen from behind, hair worn open, facing
       sunrise mountains.

       To drop in a real photo-traced silhouette, replace only the body
       of drawSunrisePhoto(ctx, x, y, w, h) — e.g.
           ctx.drawImage(myImage, x, y, w, h);
       and the post chrome around it keeps working untouched.
       ═══════════════════════════════════════════════════════════════ */

    /** The photo inside the post: sunrise, mountains, her looking at them. */
    function drawSunrisePhoto(ctx, x, y, w, h) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      const P = function (u, v) { return [x + u * w, y + v * h]; };

      // sunrise sky
      const sky = ctx.createLinearGradient(0, y, 0, y + h);
      sky.addColorStop(0, '#F7C85E');
      sky.addColorStop(0.34, '#F5A64B');
      sky.addColorStop(0.62, '#E8734A');
      sky.addColorStop(1, '#C9556B');
      ctx.fillStyle = sky;
      ctx.fillRect(x, y, w, h);

      // the sun, just clearing the ridge
      const sun = P(0.60, 0.50);
      const glow = ctx.createRadialGradient(sun[0], sun[1], 0, sun[0], sun[1], w * 0.45);
      glow.addColorStop(0, 'rgba(255,244,210,0.95)');
      glow.addColorStop(0.28, 'rgba(255,226,150,0.55)');
      glow.addColorStop(1, 'rgba(255,214,120,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x, y, w, h);
      ctx.beginPath();
      ctx.arc(sun[0], sun[1], w * 0.105, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF0C4';
      ctx.fill();

      // far range
      ctx.beginPath();
      ctx.moveTo.apply(ctx, P(-0.02, 0.66));
      ctx.lineTo.apply(ctx, P(0.16, 0.46));
      ctx.lineTo.apply(ctx, P(0.30, 0.60));
      ctx.lineTo.apply(ctx, P(0.46, 0.40));
      ctx.lineTo.apply(ctx, P(0.62, 0.60));
      ctx.lineTo.apply(ctx, P(0.78, 0.44));
      ctx.lineTo.apply(ctx, P(1.02, 0.68));
      ctx.lineTo.apply(ctx, P(1.02, 1.02));
      ctx.lineTo.apply(ctx, P(-0.02, 1.02));
      ctx.closePath();
      ctx.fillStyle = 'rgba(43,74,139,0.42)';
      ctx.fill();

      // near range
      ctx.beginPath();
      ctx.moveTo.apply(ctx, P(-0.02, 0.78));
      ctx.lineTo.apply(ctx, P(0.22, 0.60));
      ctx.lineTo.apply(ctx, P(0.40, 0.76));
      ctx.lineTo.apply(ctx, P(0.58, 0.62));
      ctx.lineTo.apply(ctx, P(0.80, 0.80));
      ctx.lineTo.apply(ctx, P(1.02, 0.72));
      ctx.lineTo.apply(ctx, P(1.02, 1.02));
      ctx.lineTo.apply(ctx, P(-0.02, 1.02));
      ctx.closePath();
      ctx.fillStyle = '#2B4A8B';
      ctx.fill();

      // snow still on the two nearest peaks
      ctx.fillStyle = 'rgba(255,240,214,0.62)';
      [[0.22, 0.60, 0.055], [0.58, 0.62, 0.05]].forEach(function (pk) {
        ctx.beginPath();
        ctx.moveTo.apply(ctx, P(pk[0], pk[1]));
        ctx.lineTo.apply(ctx, P(pk[0] + pk[2], pk[1] + pk[2] * 0.9));
        ctx.bezierCurveTo.apply(ctx, [].concat(
          P(pk[0] + pk[2] * 0.5, pk[1] + pk[2] * 0.5),
          P(pk[0] - pk[2] * 0.45, pk[1] + pk[2] * 1.0),
          P(pk[0] - pk[2], pk[1] + pk[2] * 0.9)));
        ctx.closePath();
        ctx.fill();
      });

      // the last stars, not quite gone
      ctx.fillStyle = 'rgba(255,248,226,0.55)';
      [[0.10, 0.09], [0.24, 0.05], [0.17, 0.17], [0.86, 0.08], [0.74, 0.14], [0.93, 0.19]]
        .forEach(function (s, i) {
          ctx.globalAlpha = 0.5 - i * 0.05;
          ctx.beginPath();
          ctx.arc.apply(ctx, [].concat(P(s[0], s[1]), [w * (0.006 - i * 0.0004), 0, Math.PI * 2]));
          ctx.fill();
        });
      ctx.globalAlpha = 1;

      // three birds already up, because someone always is
      ctx.strokeStyle = 'rgba(27,36,54,0.55)';
      ctx.lineWidth = Math.max(1, w * 0.006);
      ctx.lineCap = 'round';
      [[0.20, 0.26, 1], [0.29, 0.21, 0.78], [0.135, 0.205, 0.62]].forEach(function (b) {
        const s = w * 0.028 * b[2];
        const p = P(b[0], b[1]);
        ctx.beginPath();
        ctx.moveTo(p[0] - s, p[1]);
        ctx.quadraticCurveTo(p[0] - s * 0.45, p[1] - s * 0.62, p[0], p[1] - s * 0.05);
        ctx.quadraticCurveTo(p[0] + s * 0.45, p[1] - s * 0.62, p[0] + s, p[1]);
        ctx.stroke();
      });

      // the ground she's standing on
      ctx.beginPath();
      ctx.moveTo.apply(ctx, P(-0.02, 0.90));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.26, 0.865), P(0.70, 0.875), P(1.02, 0.855)));
      ctx.lineTo.apply(ctx, P(1.02, 1.02));
      ctx.lineTo.apply(ctx, P(-0.02, 1.02));
      ctx.closePath();
      ctx.fillStyle = '#22304E';
      ctx.fill();

      /* ── her, from behind: slim, hair worn open, looking at the light ──
         Drawing order matters: body, then head, then the hair over both, so
         open hair falls across the shoulders instead of merging with them. */
      const figure = '#1B2436';

      // backlight — she's between us and the sun, so the air glows around her
      const halo = ctx.createRadialGradient.apply(ctx,
        [].concat(P(0.472, 0.660), [0], P(0.472, 0.660), [w * 0.20]));
      halo.addColorStop(0, 'rgba(255,226,160,0.55)');
      halo.addColorStop(1, 'rgba(255,226,160,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(x, y, w, h);

      // arms, hanging easy — drawn first so they sit behind the dress edge
      ctx.strokeStyle = figure;
      ctx.lineWidth = Math.max(2, w * 0.017);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo.apply(ctx, P(0.437, 0.626));
      ctx.quadraticCurveTo.apply(ctx, [].concat(P(0.421, 0.700), P(0.427, 0.768)));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo.apply(ctx, P(0.505, 0.626));
      ctx.quadraticCurveTo.apply(ctx, [].concat(P(0.521, 0.700), P(0.515, 0.768)));
      ctx.stroke();

      // body: sloped shoulders, nipped waist, a long skirt to the ground
      ctx.beginPath();
      ctx.moveTo.apply(ctx, P(0.470, 0.598));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.450, 0.600), P(0.437, 0.612), P(0.433, 0.634)));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.429, 0.672), P(0.432, 0.700), P(0.436, 0.716)));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.428, 0.786), P(0.420, 0.856), P(0.416, 0.906)));
      ctx.lineTo.apply(ctx, P(0.524, 0.906));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.520, 0.856), P(0.512, 0.786), P(0.504, 0.716)));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.508, 0.700), P(0.511, 0.672), P(0.507, 0.634)));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.503, 0.612), P(0.490, 0.600), P(0.470, 0.598)));
      ctx.closePath();
      ctx.fillStyle = figure;
      ctx.fill();

      // head + a slip of neck, so she isn't one solid shape
      ctx.beginPath();
      ctx.arc.apply(ctx, [].concat(P(0.470, 0.552), [w * 0.043, 0, Math.PI * 2]));
      ctx.fill();
      ctx.beginPath();
      ctx.rect.apply(ctx, [].concat(P(0.459, 0.578), [w * 0.022, h * 0.026]));
      ctx.fill();

      /* Open hair — it follows the head at the crown, widens past the
         shoulders and ends above the waist, so the shape of her still reads
         instead of becoming one dark column. */
      ctx.beginPath();
      ctx.moveTo.apply(ctx, P(0.470, 0.507));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.434, 0.507), P(0.424, 0.542), P(0.426, 0.586)));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.428, 0.624), P(0.432, 0.652), P(0.442, 0.674)));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.455, 0.684), P(0.485, 0.684), P(0.498, 0.674)));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.508, 0.652), P(0.512, 0.624), P(0.514, 0.586)));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.516, 0.542), P(0.506, 0.507), P(0.470, 0.507)));
      ctx.closePath();
      ctx.fill();

      // the sun catching the outer edge of her hair, and again on the skirt
      ctx.strokeStyle = 'rgba(255,224,162,0.6)';
      ctx.lineWidth = Math.max(1.2, w * 0.006);
      ctx.beginPath();
      ctx.moveTo.apply(ctx, P(0.503, 0.516));
      ctx.bezierCurveTo.apply(ctx, [].concat(P(0.516, 0.544), P(0.517, 0.612), P(0.508, 0.668)));
      ctx.stroke();
      // NB: no matching highlight down the skirt — it lines up with the hair
      // edge and the two together read as a walking staff.

      /* A small heart drawn in the dirt beside her feet — she got here early
         enough to have time for it. Nobody has to notice this. */
      ctx.strokeStyle = 'rgba(255,226,168,0.5)';
      ctx.lineWidth = Math.max(1, w * 0.005);
      const hx = 0.615, hy = 0.932, hs = 0.026;
      ctx.beginPath();
      ctx.moveTo.apply(ctx, P(hx, hy + hs * 0.75));
      ctx.bezierCurveTo.apply(ctx, [].concat(
        P(hx - hs * 1.15, hy - hs * 0.1), P(hx - hs * 0.5, hy - hs * 0.85), P(hx, hy - hs * 0.18)));
      ctx.bezierCurveTo.apply(ctx, [].concat(
        P(hx + hs * 0.5, hy - hs * 0.85), P(hx + hs * 1.15, hy - hs * 0.1), P(hx, hy + hs * 0.75)));
      ctx.stroke();

      ctx.restore();
    }

    function drawPortrait(ctx, W, H) {
      const X = function (u) { return u * W; };
      const Y = function (v) { return v * H; };

      ctx.clearRect(0, 0, W, H);

      // the wall the post is pinned to
      const wall = ctx.createLinearGradient(0, 0, 0, H);
      wall.addColorStop(0, '#FBF3E4');
      wall.addColorStop(1, '#F1E9DA');
      ctx.fillStyle = wall;
      ctx.fillRect(0, 0, W, H);

      /* ── the post card ── */
      const cx0 = X(0.045), cy0 = Y(0.042), cw = X(0.91), ch = Y(0.916);
      const r = W * 0.035;
      ctx.save();
      ctx.shadowColor = 'rgba(34,32,28,0.18)';
      ctx.shadowBlur = W * 0.06;
      ctx.shadowOffsetY = W * 0.02;
      roundRect(ctx, cx0, cy0, cw, ch, r);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.restore();

      /* ── header: avatar + handle ── */
      const avX = cx0 + W * 0.075, avY = cy0 + H * 0.055, avR = W * 0.042;
      // a little gradient ring, like the app draws
      const ring = ctx.createLinearGradient(avX - avR, avY - avR, avX + avR, avY + avR);
      ring.addColorStop(0, '#F2C14E');
      ring.addColorStop(0.5, '#E8552D');
      ring.addColorStop(1, '#2B4A8B');
      ctx.beginPath();
      ctx.arc(avX, avY, avR * 1.22, 0, Math.PI * 2);
      ctx.fillStyle = ring;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(avX, avY, avR * 1.06, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      // the avatar itself: a tiny brushmark, because she's a painter
      ctx.save();
      ctx.beginPath();
      ctx.arc(avX, avY, avR, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#F7E6C4';
      ctx.fillRect(avX - avR, avY - avR, avR * 2, avR * 2);
      dab(ctx, avX - avR * 0.2, avY + avR * 0.1, avR * 0.9, '#E8552D', 0.5);
      dab(ctx, avX + avR * 0.35, avY - avR * 0.25, avR * 0.6, '#2B4A8B', 0.4);
      ctx.globalAlpha = 1;
      ctx.restore();

      ctx.fillStyle = '#22201C';
      ctx.font = '600 ' + Math.round(W * 0.052) + 'px "Instrument Sans", system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(IG_HANDLE, avX + avR * 1.6, avY - W * 0.014);
      ctx.fillStyle = '#8C877D';
      ctx.font = '400 ' + Math.round(W * 0.038) + 'px "Instrument Sans", system-ui, sans-serif';
      ctx.fillText(IG_LOCATION, avX + avR * 1.6, avY + W * 0.032);

      // the ··· menu
      ctx.fillStyle = '#8C877D';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(cx0 + cw - W * 0.075 + i * W * 0.032, avY, W * 0.011, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── the photo ── */
      const px = cx0, py = cy0 + H * 0.115, pw = cw, ph = H * 0.545;
      drawSunrisePhoto(ctx, px, py, pw, ph);

      /* ── action row ── */
      const ay = py + ph + H * 0.055;
      const ax = cx0 + W * 0.07;
      ctx.strokeStyle = '#22201C';
      ctx.lineWidth = Math.max(2, W * 0.011);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // heart — filled, because it's already been liked
      const hs = W * 0.05;
      ctx.beginPath();
      ctx.moveTo(ax, ay + hs * 0.32);
      ctx.bezierCurveTo(ax - hs * 0.1, ay - hs * 0.34, ax - hs * 0.98, ay + hs * 0.06, ax, ay + hs * 0.86);
      ctx.bezierCurveTo(ax + hs * 0.98, ay + hs * 0.06, ax + hs * 0.1, ay - hs * 0.34, ax, ay + hs * 0.32);
      ctx.closePath();
      ctx.fillStyle = '#E8552D';
      ctx.fill();

      // speech bubble
      const bx = ax + W * 0.135;
      ctx.beginPath();
      ctx.arc(bx, ay + hs * 0.3, hs * 0.62, 0.35 * Math.PI, 0.15 * Math.PI, false);
      ctx.lineTo(bx - hs * 0.5, ay + hs * 1.06);
      ctx.closePath();
      ctx.stroke();

      // paper plane
      const sx = ax + W * 0.265;
      ctx.beginPath();
      ctx.moveTo(sx - hs * 0.62, ay + hs * 0.3);
      ctx.lineTo(sx + hs * 0.66, ay - hs * 0.28);
      ctx.lineTo(sx + hs * 0.1, ay + hs * 0.96);
      ctx.lineTo(sx - hs * 0.02, ay + hs * 0.36);
      ctx.closePath();
      ctx.stroke();

      // bookmark, right side
      const mx = cx0 + cw - W * 0.085;
      ctx.beginPath();
      ctx.moveTo(mx - hs * 0.42, ay - hs * 0.28);
      ctx.lineTo(mx + hs * 0.42, ay - hs * 0.28);
      ctx.lineTo(mx + hs * 0.42, ay + hs * 0.92);
      ctx.lineTo(mx, ay + hs * 0.42);
      ctx.lineTo(mx - hs * 0.42, ay + hs * 0.92);
      ctx.closePath();
      ctx.stroke();

      /* ── liked by · caption · timestamp ── */
      let ty = ay + H * 0.078;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#22201C';
      ctx.font = '600 ' + Math.round(W * 0.046) + 'px "Instrument Sans", system-ui, sans-serif';
      ctx.fillText(IG_LIKED_BY, ax, ty);

      ty += H * 0.05;
      const cap = (captionText || IG_CAPTION_PLACEHOLDER).trim();
      ctx.font = '600 ' + Math.round(W * 0.046) + 'px "Instrument Sans", system-ui, sans-serif';
      const handleW = ctx.measureText(IG_HANDLE).width;
      ctx.fillText(IG_HANDLE, ax, ty);
      ctx.font = '400 ' + Math.round(W * 0.046) + 'px "Instrument Sans", system-ui, sans-serif';
      ctx.fillStyle = '#3A3630';
      // one line, ellipsised — the card stays tidy however much she types
      let text = cap;
      const room = cw - (ax - cx0) * 2 - handleW - W * 0.03;
      if (ctx.measureText(text).width > room) {
        while (text.length > 1 && ctx.measureText(text + '…').width > room) text = text.slice(0, -1);
        text += '…';
      }
      ctx.fillText(text, ax + handleW + W * 0.022, ty);

      ty += H * 0.045;
      ctx.fillStyle = '#8C877D';
      ctx.font = '400 ' + Math.round(W * 0.034) + 'px "Instrument Sans", system-ui, sans-serif';
      ctx.fillText(IG_TIMESTAMP, ax, ty);

      ctx.textBaseline = 'alphabetic';
    }

    /** Rounded rect, for browsers without ctx.roundRect. */
    function roundRect(ctx, x, y, w, h, r) {
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    /** Grey, mottled, slightly vignetted — decades of dust. */
    function drawDust(ctx, W, H) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#B3ADA1';
      ctx.fillRect(0, 0, W, H);

      // blotching so it doesn't read as flat grey
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * W, y = Math.random() * H;
        const r = W * (0.05 + Math.random() * 0.22);
        const tone = Math.random() > 0.5 ? '#C7C2B6' : '#9C968B';
        dab(ctx, x, y, r, tone, 0.16);
      }
      ctx.globalAlpha = 1;

      // speckle
      ctx.fillStyle = 'rgba(90,86,78,0.20)';
      for (let i = 0; i < 900; i++) {
        ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5);
      }

      // heavier in the corners, like it settled
      const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.85);
      vig.addColorStop(0, 'rgba(90,86,78,0)');
      vig.addColorStop(1, 'rgba(74,70,63,0.42)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    }

    function size() {
      const a = fitCanvas(pCanvas, pCtx);
      W = a.w; H = a.h;
      fitCanvas(dCanvas, dCtx);
      drawPortrait(pCtx, W, H);
      if (!started) drawDust(dCtx, W, H);
      else if (done) dCtx.clearRect(0, 0, W, H);
      else drawDust(dCtx, W, H);   // a resize mid-clean starts the dust over
    }

    function erase(x, y) {
      const r = W * 0.11;
      dCtx.globalCompositeOperation = 'destination-out';
      if (last) {
        const dist = Math.hypot(x - last.x, y - last.y);
        const steps = Math.max(1, Math.ceil(dist / (r * 0.35)));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          dab(dCtx, lerp(last.x, x, t), lerp(last.y, y, t), r, '#000000', 1);
        }
      } else {
        dab(dCtx, x, y, r, '#000000', 1);
      }
      dCtx.globalAlpha = 1;
      dCtx.globalCompositeOperation = 'source-over';
      last = { x: x, y: y };
    }

    function coverage() {
      mCtx.clearRect(0, 0, MW, MH);
      mCtx.drawImage(dCanvas, 0, 0, MW, MH);
      const d = mCtx.getImageData(0, 0, MW, MH).data;
      let clear = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i] < 42) clear++;
      return clear / (MW * MH);
    }

    function showLine(i) {
      if (i <= lineIdx || !RESTORATION_LINES[i]) return;
      lineIdx = i;
      const text = RESTORATION_LINES[i].text;
      if (!HAS_GSAP || REDUCED) { lineEl.textContent = text; return; }
      gsap.to(lineEl, {
        opacity: 0, duration: 0.28, ease: 'power2.in',
        onComplete: function () {
          lineEl.textContent = text;
          gsap.fromTo(lineEl, { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.85, ease: EASE_SOFT });
        }
      });
    }

    function update(force) {
      const now = performance.now();
      if (!force && now - lastCheck < 110) return;
      lastCheck = now;

      let p = coverage();
      if (p >= 0.97) p = 1;
      if (meter) meter.textContent = Math.round(p * 100) + '%';

      for (let i = RESTORATION_LINES.length - 1; i >= 0; i--) {
        if (p >= RESTORATION_LINES[i].at) { showLine(i); break; }
      }
      if (p >= 1) finish();
    }

    function finish() {
      if (done) return;
      done = true;
      frame.classList.add('is-clean');

      // sweep the last specks away
      if (HAS_GSAP && !REDUCED) {
        gsap.to(dCanvas, {
          opacity: 0, duration: 0.9, ease: EASE_SOFT,
          onComplete: function () { dCtx.clearRect(0, 0, W, H); }
        });
        // and let the colour bloom
        gsap.fromTo(pCanvas,
          { filter: 'saturate(1) brightness(1)' },
          { filter: 'saturate(1.28) brightness(1.06)', duration: 1.1, ease: EASE_SOFT,
            yoyo: true, repeat: 1, repeatDelay: 0.5 });
        gsap.fromTo(frame, { scale: 1 }, { scale: 1.025, duration: 0.7, ease: EASE_SOFT, yoyo: true, repeat: 1 });
        setTimeout(function () { burstFrom(frame, 60); }, 350);
      } else {
        dCanvas.style.opacity = '0';
        dCtx.clearRect(0, 0, W, H);
      }

      showLine(RESTORATION_LINES.length - 1);
      if (meter) meter.textContent = '100%';
      if (hintEl) hintEl.classList.add('is-gone');

      // now she can put her own words on it
      const capRow = $('#captionRow');
      const capInput = $('#captionInput');
      const capLabel = $('#captionLabel');
      if (capRow && capRow.hidden) {
        capRow.hidden = false;
        if (capLabel) capLabel.textContent = IG_CAPTION_LABEL;
        if (capInput) {
          capInput.placeholder = IG_CAPTION_PLACEHOLDER;
          capInput.addEventListener('input', function () {
            captionText = capInput.value;
            drawPortrait(pCtx, W, H);      // the post updates as she types
          });
        }
        if (HAS_GSAP && !REDUCED) {
          gsap.fromTo(capRow, { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: D_MED, delay: 0.35, ease: EASE_OUT });
        }
      }

      if (actions) {
        actions.hidden = false;
        if (HAS_GSAP && !REDUCED) {
          gsap.fromTo(actions, { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: EASE_SOFT });
        }
      }
    }

    function begin(x, y) {
      if (done) return;
      drawing = true;
      last = null;
      if (!started) {
        started = true;
        if (hintEl) hintEl.classList.add('is-gone');
      }
      erase(x, y);
      update(true);
    }

    function local(e) {
      const r = dCanvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    dCanvas.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      try { dCanvas.setPointerCapture(e.pointerId); } catch (err) { /* fine */ }
      const p = local(e);
      begin(p.x, p.y);
    });
    dCanvas.addEventListener('pointermove', function (e) {
      if (!drawing || done) return;
      e.preventDefault();
      const evts = (e.getCoalescedEvents && e.getCoalescedEvents()) || [e];
      const r = dCanvas.getBoundingClientRect();
      for (let i = 0; i < evts.length; i++) {
        erase(evts[i].clientX - r.left, evts[i].clientY - r.top);
      }
      update(false);
    });
    ['pointerup', 'pointercancel'].forEach(function (t) {
      dCanvas.addEventListener(t, function () {
        if (!drawing) return;
        drawing = false; last = null;
        update(true);
      });
    });
    window.addEventListener('pointerup', function () {
      if (drawing) { drawing = false; last = null; update(true); }
    });

    /* keyboard: arrows sweep the brush, enter/space clears a big patch */
    const kb = { x: 0.5, y: 0.5 };
    dCanvas.addEventListener('keydown', function (e) {
      if (done) return;
      const step = e.shiftKey ? 0.12 : 0.05;
      let moved = false;
      if (e.key === 'ArrowLeft') { kb.x -= step; moved = true; }
      if (e.key === 'ArrowRight') { kb.x += step; moved = true; }
      if (e.key === 'ArrowUp') { kb.y -= step; moved = true; }
      if (e.key === 'ArrowDown') { kb.y += step; moved = true; }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        last = null;
        erase(kb.x * W, kb.y * H);
        update(true);
        return;
      }
      if (!moved) return;
      e.preventDefault();
      kb.x = clamp(kb.x, 0, 1); kb.y = clamp(kb.y, 0, 1);
      if (!started) { started = true; if (hintEl) hintEl.classList.add('is-gone'); }
      erase(kb.x * W, kb.y * H);
      update(false);
    });

    // save / share
    $$('[data-save="restore"]').forEach(function (b) {
      b.addEventListener('click', function () { save(false); });
    });
    $$('[data-share="restore"]').forEach(function (b) {
      b.addEventListener('click', function () { save(true); });
    });

    function save(share) {
      saveOrShare({
        file: 'mansi-restored.png',
        eyebrow: 'restoration room',
        line: RESTORATION_LINES[RESTORATION_LINES.length - 1].text,
        draw: function (ctx, box) {
          // the portrait is 4:5 — fit it into the reserved box
          const ar = 4 / 5;
          let w = box.w, h = w / ar;
          if (h > box.h) { h = box.h; w = h * ar; }
          const x = box.x + (box.w - w) / 2;
          const y = box.y + (box.h - h) / 2;
          ctx.save();
          ctx.strokeStyle = 'rgba(34,32,28,0.2)';
          ctx.lineWidth = 2;
          ctx.strokeRect(x - 10, y - 10, w + 20, h + 20);
          ctx.drawImage(pCanvas, x, y, w, h);
          ctx.restore();
        }
      }, share);
    }

    let sized = false;
    window.addEventListener('resize', debounce(function () {
      if (sized && Views.current === 'restore') size();
    }, 220));

    return {
      enter: function () {
        if (!sized) { sized = true; size(); }
        if (hintEl && !started) hintEl.textContent = RESTORE_HINT;
      }
    };
  })();


  /* ─────────── 8b · THE SHARED PALETTE (mix → colour in) ─────────── */

  /**
   * The colours she can paint with: the base pigments, plus every blend she
   * discovers in the Mix half. This is the hinge between §4a and §4b — what
   * she makes on the left is what she paints with on the right.
   */
  const Palette = (function () {
    const strip = $('#paletteStrip');
    const list = [];
    let selected = 0;

    function render() {
      if (!strip) return;
      strip.innerHTML = '';
      list.forEach(function (c, i) {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'swatch-btn';
        b.style.setProperty('--pig', c.hex);
        b.setAttribute('aria-pressed', i === selected ? 'true' : 'false');
        b.setAttribute('aria-label', c.name + (c.memory ? ' — ' + c.memory : ''));
        if (c.memory) b.title = c.name + ' — ' + c.memory;
        b.addEventListener('click', function () {
          selected = i;
          render();
        });
        li.appendChild(b);
        strip.appendChild(li);
      });
    }

    return {
      init: function () {
        if (list.length) return;
        WELLS.filter(function (w) { return w.id !== 'ink'; })
             .forEach(function (w) { list.push({ hex: w.hex, name: w.name }); });
        render();
      },
      /** A blend she just discovered joins the palette. */
      add: function (hex, name, memory) {
        if (list.some(function (c) { return c.hex.toLowerCase() === hex.toLowerCase(); })) return null;
        list.push({ hex: hex, name: name, memory: memory });
        selected = list.length - 1;      // hand her the colour she just made
        render();
        return strip ? strip.lastElementChild : null;
      },
      current: function () { return (list[selected] || list[0] || { hex: PIGMENTS[0] }).hex; }
    };
  })();


  /* ═══════════════ 9 · GAME 2 — COLOUR & COLORING LAB ═══════════════ */

  const Mix = (function () {
    const bowl = $('#mixBowl');
    const wellsEl = $('#wells');
    const memoryEl = $('#mixMemory');
        const meter = $('#mixMeter');
    const emptyEl = $('#bowlEmpty');
    const actions = $('#mixActions');
    const rinseBtn = $('#rinseBowl');
    if (!bowl || !wellsEl) return { enter: function () {} };

    const ctx = bowl.getContext('2d');
    let W = 0, H = 0;
    let drops = [];               // well ids, in the order she added them
    let shown = { r: 247, g: 244, b: 239 };   // the colour currently on screen
    let target = { r: 247, g: 244, b: 239 };
    const collected = [];         // blends she's found
    let raf = 0, wobble = 0, active = false;

    function size() {
      const d = fitCanvas(bowl, ctx);
      W = d.w; H = d.h;
    }

    function wellById(id) {
      return WELLS.filter(function (w) { return w.id === id; })[0];
    }

    /** §14's model: average the pigments, then darken a touch. */
    function mixedColor(ids) {
      if (!ids.length) return { r: 247, g: 244, b: 239 };
      let r = 0, g = 0, b = 0;
      ids.forEach(function (id) {
        const c = toRGB(wellById(id).hex);
        r += c.r; g += c.g; b += c.b;
      });
      const n = ids.length;
      const k = 0.94;             // pigment loses a little light every time
      return { r: (r / n) * k, g: (g / n) * k, b: (b / n) * k };
    }

    function gcd(a, b) { return b ? gcd(b, a % b) : a; }

    /** Reduce the drops to their simplest ratio: 2:2 -> 1:1, 4:2 -> 2:1. */
    function ratioOf(ids) {
      const counts = {};
      ids.forEach(function (id) { counts[id] = (counts[id] || 0) + 1; });
      const keys = Object.keys(counts);
      let g = counts[keys[0]];
      keys.forEach(function (k) { g = gcd(g, counts[k]); });
      const out = {};
      keys.forEach(function (k) { out[k] = counts[k] / g; });
      return out;
    }

    function sameRatio(a, b) {
      const ka = Object.keys(a), kb = Object.keys(b);
      if (ka.length !== kb.length) return false;
      for (let i = 0; i < ka.length; i++) if (a[ka[i]] !== b[ka[i]]) return false;
      return true;
    }

    function findBlend(ids) {
      if (ids.length < 2) return null;
      const r = ratioOf(ids);
      for (let i = 0; i < COLOR_BLENDS.length; i++) {
        if (sameRatio(r, COLOR_BLENDS[i].recipe)) return COLOR_BLENDS[i];
      }
      return null;
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const base = Math.min(W, H) / 2 - 6;

      // gooey wobbling rim
      ctx.beginPath();
      const N = 64;
      for (let i = 0; i <= N; i++) {
        const a = (i / N) * Math.PI * 2;
        const wob = 1 + Math.sin(a * 3 + wobble) * 0.017 + Math.sin(a * 5 - wobble * 1.4) * 0.011;
        const r = base * wob;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const hex = toHex(shown.r, shown.g, shown.b);
      const grd = ctx.createRadialGradient(cx - base * 0.3, cy - base * 0.34, base * 0.1, cx, cy, base);
      grd.addColorStop(0, rgba(hex, 1));
      grd.addColorStop(0.62, rgba(hex, 0.97));
      grd.addColorStop(1, rgba(toHex(shown.r * 0.82, shown.g * 0.82, shown.b * 0.82), 1));
      ctx.fillStyle = drops.length ? grd : 'rgba(255,255,255,0.55)';
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(34,32,28,0.16)';
      ctx.stroke();

      // swirls of the pigments she actually dropped in
      if (drops.length) {
        ctx.save();
        ctx.clip();
        drops.slice(-6).forEach(function (id, i) {
          const c = wellById(id).hex;
          const a = wobble * 0.35 + i * 1.9;
          const rr = base * (0.34 + (i % 3) * 0.15);
          dab(ctx, cx + Math.cos(a) * rr * 0.7, cy + Math.sin(a) * rr * 0.7,
              base * 0.42, c, 0.2);
        });
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      // highlight
      ctx.beginPath();
      ctx.ellipse(cx - base * 0.34, cy - base * 0.42, base * 0.22, base * 0.13, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.34)';
      ctx.fill();
    }

    function loop() {
      wobble += 0.035;
      shown.r = lerp(shown.r, target.r, 0.12);
      shown.g = lerp(shown.g, target.g, 0.12);
      shown.b = lerp(shown.b, target.b, 0.12);
      render();
      if (active) raf = requestAnimationFrame(loop);
    }

    function setMemory(text) {
      if (!memoryEl) return;
      if (!HAS_GSAP || REDUCED) { memoryEl.textContent = text; return; }
      gsap.to(memoryEl, {
        opacity: 0, duration: 0.24, ease: 'power2.in',
        onComplete: function () {
          memoryEl.textContent = text;
          gsap.fromTo(memoryEl, { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.75, ease: EASE_SOFT });
        }
      });
    }

    /** A gooey blob arcs from the well into the bowl. */
    function flingBlob(fromEl, hex) {
      if (!HAS_GSAP || REDUCED) return;
      const a = fromEl.getBoundingClientRect();
      const b = bowl.getBoundingClientRect();
      const blob = document.createElement('span');
      blob.setAttribute('aria-hidden', 'true');
      blob.style.cssText =
        'position:fixed;z-index:40;pointer-events:none;border-radius:50%;' +
        'width:26px;height:26px;background:' + hex + ';' +
        'left:' + (a.left + a.width / 2 - 13) + 'px;top:' + (a.top + a.height / 2 - 13) + 'px;';
      document.body.appendChild(blob);
      gsap.timeline({ onComplete: function () { blob.remove(); } })
        .to(blob, {
          x: (b.left + b.width / 2) - (a.left + a.width / 2),
          y: (b.top + b.height / 2) - (a.top + a.height / 2),
          duration: 0.52, ease: 'power2.in'
        })
        .to(blob, { scale: 2.1, opacity: 0, duration: 0.3, ease: EASE_SOFT }, '-=0.06')
        .fromTo(blob, { scaleX: 1 }, { scaleX: 1.35, duration: 0.18, yoyo: true, repeat: 1 }, 0.2);
    }

    /** A discovered blend plinks onto the palette — and is hers to paint with. */
    function plink(blend) {
      const li = Palette.add(blend.resultColor, blend.name, blend.memory);
      if (li && HAS_GSAP && !REDUCED) {
        gsap.fromTo(li, { scale: 0, y: -16, rotate: -12 },
          { scale: 1, y: 0, rotate: 0, duration: 0.55, ease: 'back.out(2.4)' });
      }
      burstFrom(bowl, 34, blend.resultColor);
    }

    function addDrop(id, fromEl) {
      const w = wellById(id);
      if (!w) return;
      drops.push(id);
      flingBlob(fromEl, w.hex);

      if (emptyEl) emptyEl.classList.add('is-gone');

      const blend = findBlend(drops);
      if (blend) {
        target = toRGB(blend.resultColor);      // land on the promised colour
        const already = collected.some(function (c) { return c.name === blend.name; });
        if (!already) {
          collected.push(blend);
          setTimeout(function () { plink(blend); }, 420);
          setMemory(blend.memory);
          if (meter) meter.textContent = collected.length + '/' + COLOR_BLENDS.length;
          if (collected.length >= MIX_SAVE_AFTER && actions && actions.hidden) {
            actions.hidden = false;
            if (HAS_GSAP && !REDUCED) {
              gsap.fromTo(actions, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 });
            }
          }
        } else {
          setMemory(blend.memory);
        }
      } else {
        target = mixedColor(drops);
        if (drops.length >= 2) setMemory(MIX_UNNAMED);
        else setMemory('');
      }
    }

    function rinse() {
      drops = [];
      target = { r: 247, g: 244, b: 239 };
      setMemory('');
      if (emptyEl) emptyEl.classList.remove('is-gone');
    }

    // build the wells
    WELLS.forEach(function (w) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'well';
      b.style.setProperty('--pig', w.hex);
      b.setAttribute('aria-label', 'Add ' + w.name);
      b.addEventListener('click', function (e) {
        addDrop(w.id, b);
        Ambient.splat(e.clientX || 0, e.clientY || 0, w.hex);
      });
      wellsEl.appendChild(b);
    });

    if (rinseBtn) rinseBtn.addEventListener('click', rinse);

    $$('[data-save="mix"]').forEach(function (b) {
      b.addEventListener('click', function () { save(false); });
    });
    $$('[data-share="mix"]').forEach(function (b) {
      b.addEventListener('click', function () { save(true); });
    });

    function save(share) {
      saveOrShare({
        file: 'mansi-palette.png',
        eyebrow: MIX_CARD_TITLE,
        line: MIX_CARD_LINE,
        draw: function (ctx, box) {
          const n = collected.length;
          if (!n) return;
          const rowH = Math.min(120, box.h / Math.max(n, 1));
          const sw = Math.min(96, rowH - 16);
          let y = box.y + (box.h - rowH * n) / 2;

          collected.forEach(function (c) {
            // swatch
            ctx.fillStyle = c.resultColor;
            const rx = box.x + 16;
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(rx, y + (rowH - sw) / 2, sw, sw, 10)
                          : ctx.rect(rx, y + (rowH - sw) / 2, sw, sw);
            ctx.fill();
            ctx.strokeStyle = 'rgba(34,32,28,0.16)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // name + memory
            ctx.textAlign = 'left';
            ctx.fillStyle = '#22201C';
            ctx.font = '500 34px Fraunces, Georgia, serif';
            ctx.fillText(c.name, rx + sw + 30, y + rowH / 2 - 4);
            ctx.fillStyle = '#4A463F';
            ctx.font = '400 26px "Instrument Sans", system-ui, sans-serif';
            ctx.fillText(c.memory, rx + sw + 30, y + rowH / 2 + 32);

            y += rowH;
          });
          ctx.textAlign = 'center';
        }
      }, share);
    }

    /* the two halves: mix on the left, colour in on the right */
    function initTabs() {
      const tabMix = $('#tabMix'), tabColor = $('#tabColor');
      const panelMix = $('#panelMix'), panelColor = $('#panelColor');
      const footMix = $('#footMix'), footColor = $('#footColor');
      const stripLabel = $('#stripLabel');
      if (!tabMix || !tabColor) return;

      function go(which) {
        const colouring = which === 'color';
        tabMix.classList.toggle('is-on', !colouring);
        tabColor.classList.toggle('is-on', colouring);
        tabMix.setAttribute('aria-selected', String(!colouring));
        tabColor.setAttribute('aria-selected', String(colouring));
        panelMix.hidden = colouring;
        panelColor.hidden = !colouring;
        footMix.hidden = colouring;
        footColor.hidden = !colouring;
        if (stripLabel) stripLabel.textContent = colouring ? COLOR_HINT : COLOR_FIRST_HINT;
        if (colouring) Colouring.enter();
        const panel = colouring ? panelColor : panelMix;
        if (HAS_GSAP && !REDUCED) {
          gsap.fromTo(panel, { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: D_FAST, ease: EASE_OUT });
        }
      }
      tabMix.addEventListener('click', function () { go('mix'); });
      tabColor.addEventListener('click', function () { go('color'); });
      if (stripLabel) stripLabel.textContent = COLOR_FIRST_HINT;
    }
    initTabs();

    return {
      enter: function () {
        size();
        Palette.init();
        if (meter) meter.textContent = collected.length + '/' + COLOR_BLENDS.length;
        if (emptyEl) emptyEl.textContent = MIX_EMPTY_HINT;
        active = true;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
        // park the loop when she leaves the room
        const stop = function () {
          if (Views.current !== 'mix') {
            active = false;
            cancelAnimationFrame(raf);
          } else setTimeout(stop, 600);
        };
        setTimeout(stop, 600);
      }
    };
  })();


  /* ─────────── 9b · COLOURING IN THE SKETCHES (§4b) ─────────── */

  /** Rasterise an inline SVG so it can be drawn onto an export canvas. */
  function svgToImage(svgEl, w, h, prep) {
    return new Promise(function (resolve, reject) {
      const clone = svgEl.cloneNode(true);
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clone.removeAttribute('style');
      clone.removeAttribute('class');
      clone.setAttribute('width', w);
      clone.setAttribute('height', h);
      if (prep) prep(clone);
      const str = new XMLSerializer().serializeToString(clone);
      const img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(str);
    });
  }

  const Colouring = (function () {
    const frame = $('#sketchFrame');
    const nameEl = $('#sketchName');
    const nav = $('#sketchNav');
    const source = $('#sketchSource');
    if (!frame || !source) return { enter: function () {} };

    const PAPER = '#FCFAF6';
    const sheets = [];      // { svg, name, history: [] }
    let idx = 0;
    let ready = false;

    function build() {
      if (ready) return;
      ready = true;

      $$('[data-sketch]', source).forEach(function (proto) {
        const svg = proto.cloneNode(true);
        svg.removeAttribute('data-sketch');
        const sheet = { svg: svg, name: svg.getAttribute('data-name') || 'a drawing', history: [] };

        // the line-art look is applied as attributes, not CSS, so the saved
        // PNG looks exactly like what she sees
        $$('.rg', svg).forEach(function (rg, i) {
          rg.setAttribute('fill', PAPER);
          rg.setAttribute('stroke', '#22201C');
          rg.setAttribute('stroke-width', '2.4');
          rg.setAttribute('stroke-linejoin', 'round');
          rg.setAttribute('tabindex', '0');
          rg.setAttribute('role', 'button');
          rg.setAttribute('aria-label', 'Fill area ' + (i + 1));

          const fill = function () {
            const next = Palette.current();
            const prev = rg.getAttribute('fill');
            if (prev === next) return;
            sheet.history.push({ el: rg, prev: prev });
            rg.setAttribute('fill', next);
            markProgress();
          };
          rg.addEventListener('click', fill);
          rg.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fill(); }
          });
        });

        // detail marks get their look as attributes too, so the saved PNG
        // carries the faces and stems the stylesheet is drawing on screen
        $$('.ln', svg).forEach(function (el) {
          el.setAttribute('fill', 'none');
          el.setAttribute('stroke', '#22201C');
          el.setAttribute('stroke-width', '2.1');
          el.setAttribute('stroke-linecap', 'round');
          el.setAttribute('stroke-linejoin', 'round');
        });
        $$('.dt', svg).forEach(function (el) {
          el.setAttribute('fill', '#22201C');
          el.setAttribute('stroke', 'none');
        });

        sheets.push(sheet);
      });

      // the little numbered chooser
      if (nav) {
        nav.innerHTML = '';
        sheets.forEach(function (s, i) {
          const b = document.createElement('button');
          b.type = 'button';
          b.textContent = i + 1;
          b.setAttribute('aria-label', s.name);
          b.addEventListener('click', function () { show(i); });
          nav.appendChild(b);
        });
      }
      show(0);
    }

    function markProgress() {
      if (!nav) return;
      sheets.forEach(function (s, i) {
        const touched = s.history.length > 0;
        const b = nav.children[i];
        if (b) b.classList.toggle('is-done', touched);
      });
    }

    function show(i) {
      idx = clamp(i, 0, sheets.length - 1);
      const sheet = sheets[idx];
      frame.innerHTML = '';
      frame.appendChild(sheet.svg);
      if (nameEl) nameEl.textContent = sheet.name;
      if (nav) {
        $$('button', nav).forEach(function (b, n) {
          b.setAttribute('aria-current', n === idx ? 'true' : 'false');
        });
      }
      if (HAS_GSAP && !REDUCED) {
        gsap.fromTo(sheet.svg, { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: D_FAST, ease: EASE_OUT });
      }
      markProgress();
    }

    function undo() {
      const sheet = sheets[idx];
      if (!sheet || !sheet.history.length) return;
      const last = sheet.history.pop();
      last.el.setAttribute('fill', last.prev);
      markProgress();
    }

    function reset() {
      const sheet = sheets[idx];
      if (!sheet) return;
      $$('.rg', sheet.svg).forEach(function (rg) { rg.setAttribute('fill', PAPER); });
      sheet.history.length = 0;
      markProgress();
    }

    function save(share) {
      const sheet = sheets[idx];
      if (!sheet) return;
      saveOrShare({
        file: 'mansi-' + sheet.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.png',
        eyebrow: sheet.name,
        label: sheet.name,
        line: SKETCH_CARD_LINE,
        draw: async function (ctx, box) {
          let img;
          try { img = await svgToImage(sheet.svg, 760, 760); } catch (e) { return; }
          const side = Math.min(box.w, box.h);
          const x = box.x + (box.w - side) / 2;
          const y = box.y + (box.h - side) / 2;
          ctx.save();
          ctx.fillStyle = PAPER;
          ctx.fillRect(x, y, side, side);
          ctx.drawImage(img, x, y, side, side);
          ctx.strokeStyle = 'rgba(34,32,28,0.2)';
          ctx.lineWidth = 2;
          ctx.strokeRect(x - 10, y - 10, side + 20, side + 20);
          ctx.restore();
        }
      }, share);
    }

    const undoBtn = $('#undoFill');
    const resetBtn = $('#resetSketch');
    if (undoBtn) undoBtn.addEventListener('click', undo);
    if (resetBtn) resetBtn.addEventListener('click', reset);
    $$('[data-save="sketch"]').forEach(function (b) {
      b.addEventListener('click', function () { save(false); });
    });
    $$('[data-share="sketch"]').forEach(function (b) {
      b.addEventListener('click', function () { save(true); });
    });

    return { enter: build };
  })();


  /* ═══════════════ 10 · GAME 3 — PAINT-BY-SCROLL ═══════════════ */

  const Paint = (function () {
    const svg = $('#scene');
    const stage = $('#actStage');
    const meter = $('#paintMeter');
    const doneEl = $('#paintDone');
    const actions = $('#paintActions');
    if (!svg || !stage) return { enter: function () {} };

    const regions = $$('[data-region]', svg).sort(function (a, b) {
      return (+a.dataset.region) - (+b.dataset.region);
    });
    let step = 0;
    let ready = false;
    let finished = false;

    /** Build one wipe clip-path per region, sized from its own bounding box. */
    function prepare() {
      if (ready) return;
      ready = true;

      let defs = svg.querySelector('defs');
      if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.insertBefore(defs, svg.firstChild);
      }

      regions.forEach(function (g, i) {
        let box;
        try { box = g.getBBox(); } catch (e) { box = null; }
        if (!box || !box.width) { g.style.opacity = '0'; g._noBox = true; return; }

        const pad = 2;
        const cp = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        cp.setAttribute('id', 'rgnClip' + i);
        cp.setAttribute('clipPathUnits', 'userSpaceOnUse');
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', box.x - pad);
        rect.setAttribute('y', box.y - pad);
        rect.setAttribute('height', box.height + pad * 2);
        rect.setAttribute('width', 0);
        cp.appendChild(rect);
        defs.appendChild(cp);

        g.setAttribute('clip-path', 'url(#rgnClip' + i + ')');
        g._clipRect = rect;
        g._fullW = box.width + pad * 2;
      });

      if (meter) meter.textContent = '0/' + regions.length;
    }

    function fillRegion(i) {
      const g = regions[i];
      if (!g) return;
      if (g._noBox) {
        if (HAS_GSAP) gsap.to(g, { opacity: 1, duration: 0.7 });
        else g.style.opacity = '1';
        return;
      }
      if (!HAS_GSAP || REDUCED) {
        g._clipRect.setAttribute('width', g._fullW);
        return;
      }
      // the soft wipe
      gsap.to(g._clipRect, {
        attr: { width: g._fullW },
        duration: 0.95,
        ease: EASE_IO
      });
    }

    /* ── the gentle actions ──────────────────────────────────────────── */

    function clearStage() { stage.innerHTML = ''; }

    function head(text) {
      const p = document.createElement('p');
      p.className = 'act__prompt';
      p.textContent = text;
      stage.appendChild(p);
      return p;
    }

    function field() {
      const d = document.createElement('div');
      d.className = 'act__field';
      stage.appendChild(d);
      return d;
    }

    function pips() {
      const d = document.createElement('div');
      d.className = 'pips';
      for (let i = 0; i < regions.length; i++) {
        const s = document.createElement('span');
        if (i < step) s.classList.add('is-on');
        s.style.setProperty('--pig', PIGMENTS[i % PIGMENTS.length]);
        d.appendChild(s);
      }
      stage.appendChild(d);
    }

    function advance() {
      fillRegion(step);
      step++;
      if (meter) meter.textContent = step + '/' + regions.length;
      const intro = $('#paintIntro');
      if (intro) intro.classList.add('is-gone');
      if (step >= regions.length) { complete(); return; }
      setTimeout(renderAction, 620);
    }

    const Actions = {
      bubble: function (cfg) {
        head(cfg.prompt);
        const f = field();
        let popped = false;
        for (let i = 0; i < 3; i++) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'bubble';
          b.style.setProperty('--pig', PIGMENTS[(step + i) % PIGMENTS.length]);
          b.style.left = (12 + i * 34) + '%';
          b.style.top = (10 + (i % 2) * 26) + '%';
          b.setAttribute('aria-label', 'Pop this bubble');
          if (HAS_GSAP && !REDUCED) {
            gsap.to(b, {
              y: -10, duration: 1.3 + i * 0.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.15
            });
          }
          b.addEventListener('click', function (e) {
            if (popped) return;
            popped = true;
            Ambient.splat(e.clientX || 0, e.clientY || 0, PIGMENTS[(step + i) % PIGMENTS.length]);
            if (HAS_GSAP && !REDUCED) {
              gsap.to($$('.bubble', f), { scale: 0, opacity: 0, duration: 0.4, ease: 'back.in(2)', stagger: 0.05 });
            }
            advance();
          });
          f.appendChild(b);
        }
        pips();
      },

      leaf: function (cfg) {
        head(cfg.prompt);
        const f = field();
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'leaf';
        b.style.setProperty('--pig', PIGMENTS[2]);
        b.style.left = '10%';
        b.style.top = '4%';
        b.setAttribute('aria-label', 'Catch the falling leaf');
        f.appendChild(b);

        let caught = false;
        if (HAS_GSAP && !REDUCED) {
          gsap.to(b, {
            keyframes: [
              { x: '160%', y: 18, rotate: 40, duration: 1.9, ease: 'sine.inOut' },
              { x: '320%', y: 4, rotate: -30, duration: 1.9, ease: 'sine.inOut' },
              { x: '60%', y: 24, rotate: 25, duration: 1.9, ease: 'sine.inOut' },
              { x: '0%', y: 0, rotate: 0, duration: 1.9, ease: 'sine.inOut' }
            ],
            repeat: -1
          });
        }
        b.addEventListener('click', function (e) {
          if (caught) return;
          caught = true;
          Ambient.splat(e.clientX || 0, e.clientY || 0, PIGMENTS[2]);
          if (HAS_GSAP && !REDUCED) gsap.to(b, { scale: 0, opacity: 0, duration: 0.35 });
          advance();
        });
        pips();
      },

      prompt: function (cfg) {
        head(cfg.prompt);
        const q = document.createElement('p');
        q.textContent = cfg.question;
        q.style.cssText = 'max-width:28ch;font-size:0.98rem;line-height:1.35;';
        stage.appendChild(q);

        const wrap = document.createElement('div');
        wrap.className = 'act__choices';
        (cfg.choices || []).forEach(function (label, i) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'act__choice';
          b.textContent = label;
          b.addEventListener('click', function (e) {
            Ambient.splat(e.clientX || 0, e.clientY || 0, PIGMENTS[i % PIGMENTS.length]);
            $$('.act__choice', wrap).forEach(function (o) { o.disabled = true; });
            advance();
          });
          wrap.appendChild(b);
        });
        stage.appendChild(wrap);
        pips();
      },

      brush: function (cfg) {
        head(cfg.prompt);
        const patch = document.createElement('div');
        patch.className = 'act__patch';
        const c = document.createElement('canvas');
        const label = document.createElement('span');
        label.className = 'act__patch-label';
        label.textContent = 'drag across';
        patch.appendChild(c);
        patch.appendChild(label);
        stage.appendChild(patch);

        const cx = c.getContext('2d', { willReadFrequently: true });
        const dims = fitCanvas(c, cx);
        const cw = dims.w, ch = dims.h;
        const color = PIGMENTS[step % PIGMENTS.length];

        let painting = false, lastP = null, doneHere = false;
        const cover = { hit: 0, need: Math.round((cw / 14)) };
        const seen = {};

        function paintAt(x, y) {
          const r = ch * 0.42;
          if (lastP) {
            const d = Math.hypot(x - lastP.x, y - lastP.y);
            const steps = Math.max(1, Math.ceil(d / (r * 0.3)));
            for (let i = 1; i <= steps; i++) {
              const t = i / steps;
              dab(cx, lerp(lastP.x, x, t), lerp(lastP.y, y, t), r, color, 0.22);
            }
          } else dab(cx, x, y, r, color, 0.22);
          cx.globalAlpha = 1;
          lastP = { x: x, y: y };

          // count distinct columns touched — simple, cheap, and forgiving
          const col = Math.floor(x / 14);
          if (!seen[col]) { seen[col] = 1; cover.hit++; }
          if (!doneHere && cover.hit >= cover.need * 0.55) {
            doneHere = true;
            label.style.opacity = '0';
            setTimeout(advance, 260);
          }
        }

        function pt(e) {
          const r = c.getBoundingClientRect();
          return { x: e.clientX - r.left, y: e.clientY - r.top };
        }
        c.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          try { c.setPointerCapture(e.pointerId); } catch (err) { /* fine */ }
          painting = true; lastP = null;
          label.style.opacity = '0.35';
          const p = pt(e); paintAt(p.x, p.y);
        });
        c.addEventListener('pointermove', function (e) {
          if (!painting) return;
          e.preventDefault();
          const p = pt(e); paintAt(p.x, p.y);
        });
        ['pointerup', 'pointercancel'].forEach(function (t) {
          c.addEventListener(t, function () { painting = false; lastP = null; });
        });
        // keyboard: a tap of Enter counts as a full sweep
        c.tabIndex = 0;
        c.setAttribute('role', 'button');
        c.setAttribute('aria-label', 'Drag across to paint. Or press Enter.');
        c.addEventListener('keydown', function (e) {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          if (doneHere) return;
          lastP = null;
          for (let x = 6; x < cw; x += 10) paintAt(x, ch / 2);
        });
        pips();
      },

      dab: function (cfg) {
        head(cfg.prompt);
        const wrap = document.createElement('div');
        wrap.className = 'act__dabs';
        const picked = {};
        [0, 3].forEach(function (pi, i) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'act__dab';
          b.style.setProperty('--pig', PIGMENTS[pi]);
          b.setAttribute('aria-pressed', 'false');
          b.setAttribute('aria-label', 'Add this colour');
          b.addEventListener('click', function (e) {
            if (picked[i]) return;
            picked[i] = true;
            b.setAttribute('aria-pressed', 'true');
            Ambient.splat(e.clientX || 0, e.clientY || 0, PIGMENTS[pi]);
            if (picked[0] && picked[1]) setTimeout(advance, 340);
          });
          wrap.appendChild(b);
        });
        stage.appendChild(wrap);
        pips();
      }
    };

    function renderAction() {
      if (finished) return;
      clearStage();
      const cfg = PAINT_ACTIONS[step % PAINT_ACTIONS.length];
      const fn = Actions[cfg.type] || Actions.bubble;
      fn(cfg);
      if (HAS_GSAP && !REDUCED) {
        gsap.fromTo(stage.children,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: EASE_SOFT });
      }
    }

    function complete() {
      if (finished) return;
      finished = true;
      clearStage();

      // let the scene breathe: drop the clips so idle motion isn't cropped —
      // but only once the final wipe has actually finished playing
      setTimeout(function () {
        regions.forEach(function (g) { g.removeAttribute('clip-path'); });
      }, (HAS_GSAP && !REDUCED) ? 1000 : 0);

      if (doneEl) {
        doneEl.textContent = PAINT_DONE;
        doneEl.classList.add('is-on');
      }
      if (actions) {
        actions.hidden = false;
        if (HAS_GSAP && !REDUCED) {
          gsap.fromTo(actions, { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.7, delay: 0.35, ease: EASE_SOFT });
        }
      }
      burstFrom(svg, 70);
      idle();
    }

    /** The finished scene never sits still — it just breathes. */
    function idle() {
      if (!HAS_GSAP || REDUCED) return;
      const tail = $('#sceneTail', svg);
      const girl = [$('[data-region="7"]', svg), $('[data-region="8"]', svg)].filter(Boolean);
      const ball = $('#sceneBall', svg);
      const ears = $('#sceneEars', svg);
      const rays = $('#sceneRays', svg);

      if (tail) {
        gsap.to(tail, {
          rotation: 22, svgOrigin: '320 288', duration: 0.36,
          yoyo: true, repeat: -1, ease: 'sine.inOut'
        });
      }
      if (girl.length) {
        gsap.to(girl, { y: -3.5, duration: 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      }
      if (ball) {
        gsap.to(ball, { y: -11, duration: 0.95, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      }
      if (ears) {
        gsap.to(ears, { rotation: 5, svgOrigin: '250 256', duration: 0.72, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      }
      if (rays) {
        gsap.to(rays, { rotation: 360, svgOrigin: '322 72', duration: 52, repeat: -1, ease: 'none' });
      }
      // the butterfly doesn't hold still either
      const flutter = $('#sceneButterfly', svg);
      if (flutter) {
        gsap.to(flutter, {
          keyframes: [
            { x: -14, y: -22, rotation: -8, duration: 3.2 },
            { x: -30, y: -6, rotation: 6, duration: 3.2 },
            { x: -8, y: -30, rotation: -4, duration: 3.2 },
            { x: 0, y: 0, rotation: 0, duration: 3.2 }
          ],
          svgOrigin: '330 232', ease: 'sine.inOut', repeat: -1
        });
      }
    }

    /* ── export: rasterise the SVG, unclipped ── */
    function sceneToImage() {
      return new Promise(function (resolve, reject) {
        const clone = svg.cloneNode(true);
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clone.removeAttribute('style');
        clone.setAttribute('width', '800');
        clone.setAttribute('height', '840');
        // a saved frame shows the whole picture, however far she got
        $$('[data-region]', clone).forEach(function (g) {
          g.removeAttribute('clip-path');
          g.style.opacity = '1';
        });
        const defs = clone.querySelector('defs');
        if (defs) defs.remove();

        const str = new XMLSerializer().serializeToString(clone);
        const img = new Image();
        img.onload = function () { resolve(img); };
        img.onerror = reject;
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(str);
      });
    }

    $$('[data-save="paint"]').forEach(function (b) {
      b.addEventListener('click', function () { save(false); });
    });
    $$('[data-share="paint"]').forEach(function (b) {
      b.addEventListener('click', function () { save(true); });
    });

    function save(share) {
      saveOrShare({
        file: 'mansi-and-the-dog.png',
        eyebrow: 'paint-by-scroll',
        line: PAINT_DONE,
        draw: async function (ctx, box) {
          let img;
          try { img = await sceneToImage(); } catch (e) { return; }
          const ar = 400 / 420;
          let w = box.w, h = w / ar;
          if (h > box.h) { h = box.h; w = h * ar; }
          const x = box.x + (box.w - w) / 2;
          const y = box.y + (box.h - h) / 2;
          ctx.save();
          ctx.strokeStyle = 'rgba(34,32,28,0.2)';
          ctx.lineWidth = 2;
          ctx.strokeRect(x - 10, y - 10, w + 20, h + 20);
          ctx.drawImage(img, x, y, w, h);
          ctx.restore();
        }
      }, share);
    }

    return {
      enter: function () {
        prepare();
        if (!finished && !stage.children.length) {
          if (doneEl && !doneEl.textContent) doneEl.textContent = '';
          renderAction();
        }
      }
    };
  })();


  /* ───────────────────────── BOOT ───────────────────────── */

  function boot() {
    initScroll();
    initLanding();
    initEntrance();
    Views.init();
    enableShareButtons();

    const intro = $('#paintIntro');
    if (intro) intro.textContent = PAINT_INTRO;

    if (HAS_GSAP && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ST.refresh(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else boot();
})();
