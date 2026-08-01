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
      name: "Colour Mix Lab",
      blurb: "Stir two pigments together. Every colour you land on remembers something.",
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

    // gallery hairline frame
    ctx.strokeStyle = 'rgba(34,32,28,0.16)';
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
          opacity: 1, scale: 1, duration: 0.62, ease: 'power3.out', delay: 0.16,
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
        { opacity: 0.95, scale: 1.35, duration: 1.1, ease: 'power2.out' }, 0.15)
      .to('.entrance__panel--l', { xPercent: -101, duration: 1.25, ease: 'power4.inOut' }, 0.35)
      .to('.entrance__panel--r', { xPercent: 101, duration: 1.25, ease: 'power4.inOut' }, 0.35)
      .to('.entrance__spill', { opacity: 0, scale: 2.1, duration: 0.9, ease: 'power2.in' }, 0.9)
      .fromTo('.landing__head > *',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.09, ease: 'power3.out' }, 0.85)
      .fromTo('.easel-card',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 1.1)
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
    let lastCheck = 0;

    // low-res mirror used only to measure how much dust is gone
    const MW = 60, MH = 75;
    const meas = document.createElement('canvas');
    meas.width = MW; meas.height = MH;
    const mCtx = meas.getContext('2d', { willReadFrequently: true });

    /* ═══════════════════════════════════════════════════════════════
       PORTRAIT_SWAP · The portrait underneath the dust.
       Everything below draws a stylized profile — hair loosely tied,
       chin lifted, palette colours only. To use a real photo-traced
       silhouette instead, replace the whole body of drawPortrait()
       with e.g.:
           const img = new Image();
           img.onload = () => ctx.drawImage(img, 0, 0, W, H);
           img.src = 'mansi-portrait.png';
       Keep the signature (ctx, W, H) and it will slot straight in.
       ═══════════════════════════════════════════════════════════════ */
    function drawPortrait(ctx, W, H) {
      const X = function (u) { return u * W; };
      const Y = function (v) { return v * H; };

      ctx.clearRect(0, 0, W, H);

      // ground wash
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#FBF3E4');
      bg.addColorStop(1, '#F3E7D2');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // halo of light she's looking up into
      const halo = ctx.createRadialGradient(X(0.66), Y(0.24), 0, X(0.66), Y(0.24), W * 0.62);
      halo.addColorStop(0, rgba('#F2C14E', 0.62));
      halo.addColorStop(0.55, rgba('#F2C14E', 0.16));
      halo.addColorStop(1, rgba('#F2C14E', 0));
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, H);

      // loose painterly marks in the background
      [[0.16, 0.66, 0.30, '#1F7A5A', 0.1], [0.84, 0.72, 0.26, '#2B4A8B', 0.08],
       [0.30, 0.20, 0.22, '#E8552D', 0.07]].forEach(function (m) {
        dab(ctx, X(m[0]), Y(m[1]), W * m[2], m[3], m[4]);
      });
      ctx.globalAlpha = 1;

      // chin lifted: the whole figure tips back a touch
      ctx.save();
      ctx.translate(X(0.47), Y(0.62));
      ctx.rotate(-0.06);
      ctx.translate(-X(0.47), -Y(0.62));

      /* One continuous cameo — head, tied-back hair and shoulders in a single
         outline. Keeping the hair *inside* the silhouette (as a bulge, not an
         overlaid shape) is what stops it reading as a headband. */
      function cameoPath() {
        ctx.beginPath();
        ctx.moveTo(X(0.440), Y(0.098));
        ctx.bezierCurveTo(X(0.545), Y(0.100), X(0.624), Y(0.160), X(0.652), Y(0.246)); // forehead
        ctx.bezierCurveTo(X(0.660), Y(0.272), X(0.650), Y(0.290), X(0.648), Y(0.300)); // brow
        ctx.bezierCurveTo(X(0.656), Y(0.308), X(0.686), Y(0.326), X(0.708), Y(0.350)); // nose
        ctx.bezierCurveTo(X(0.700), Y(0.362), X(0.680), Y(0.364), X(0.670), Y(0.370)); // under nose
        ctx.bezierCurveTo(X(0.678), Y(0.380), X(0.680), Y(0.390), X(0.668), Y(0.398)); // upper lip
        ctx.bezierCurveTo(X(0.682), Y(0.406), X(0.680), Y(0.418), X(0.664), Y(0.424)); // lower lip
        ctx.bezierCurveTo(X(0.674), Y(0.436), X(0.684), Y(0.446), X(0.678), Y(0.466)); // chin
        ctx.bezierCurveTo(X(0.668), Y(0.494), X(0.620), Y(0.516), X(0.566), Y(0.516)); // jaw
        ctx.bezierCurveTo(X(0.520), Y(0.516), X(0.486), Y(0.506), X(0.470), Y(0.494)); // under ear
        ctx.bezierCurveTo(X(0.472), Y(0.530), X(0.476), Y(0.560), X(0.480), Y(0.600)); // neck front
        ctx.bezierCurveTo(X(0.484), Y(0.634), X(0.504), Y(0.652), X(0.548), Y(0.668));
        ctx.bezierCurveTo(X(0.680), Y(0.706), X(0.836), Y(0.792), X(0.930), Y(0.900)); // r shoulder
        ctx.bezierCurveTo(X(0.968), Y(0.944), X(0.986), Y(0.984), X(0.995), Y(1.03));
        ctx.lineTo(X(0.005), Y(1.03));
        ctx.bezierCurveTo(X(0.016), Y(0.972), X(0.048), Y(0.918), X(0.100), Y(0.862)); // l shoulder
        ctx.bezierCurveTo(X(0.176), Y(0.788), X(0.268), Y(0.720), X(0.330), Y(0.686));
        ctx.bezierCurveTo(X(0.356), Y(0.668), X(0.368), Y(0.640), X(0.366), Y(0.606)); // neck back
        ctx.bezierCurveTo(X(0.336), Y(0.588), X(0.302), Y(0.560), X(0.288), Y(0.520)); // nape
        ctx.bezierCurveTo(X(0.278), Y(0.492), X(0.270), Y(0.462), X(0.268), Y(0.430)); // skull
        ctx.bezierCurveTo(X(0.240), Y(0.438), X(0.196), Y(0.418), X(0.188), Y(0.376)); // the bun,
        ctx.bezierCurveTo(X(0.180), Y(0.334), X(0.208), Y(0.298), X(0.248), Y(0.296)); // a lobe of its own
        ctx.bezierCurveTo(X(0.252), Y(0.260), X(0.262), Y(0.220), X(0.288), Y(0.184)); // back to skull
        ctx.bezierCurveTo(X(0.320), Y(0.138), X(0.378), Y(0.102), X(0.440), Y(0.098)); // crown
        ctx.closePath();
      }

      /* The hairline — front edge of the hair, from crown down past the ear.
         Everything behind it becomes the hair mass. */
      function hairPath() {
        ctx.beginPath();
        ctx.moveTo(X(0.470), Y(0.108));
        ctx.bezierCurveTo(X(0.562), Y(0.126), X(0.612), Y(0.180), X(0.626), Y(0.238)); // hairline
        ctx.bezierCurveTo(X(0.600), Y(0.226), X(0.558), Y(0.220), X(0.528), Y(0.236)); // fringe dip
        ctx.bezierCurveTo(X(0.498), Y(0.254), X(0.484), Y(0.300), X(0.490), Y(0.360)); // past the ear
        ctx.bezierCurveTo(X(0.496), Y(0.420), X(0.492), Y(0.472), X(0.474), Y(0.498));
        // it's tied up, so it tapers off at the nape instead of falling
        ctx.bezierCurveTo(X(0.466), Y(0.532), X(0.446), Y(0.562), X(0.418), Y(0.580));
        ctx.bezierCurveTo(X(0.392), Y(0.596), X(0.356), Y(0.600), X(0.322), Y(0.592));
        ctx.lineTo(X(0), Y(0.600));
        ctx.lineTo(X(0), Y(0));
        ctx.lineTo(X(0.470), Y(0));
        ctx.closePath();
      }

      cameoPath();
      ctx.fillStyle = '#2B4A8B';
      ctx.fill();

      // hair: a clean, deliberate hairline rather than a wash across the head
      ctx.save();
      cameoPath();
      ctx.clip();
      hairPath();
      ctx.fillStyle = '#2A2620';
      ctx.fill();

      // light landing on the crown, soft-edged
      const sheen = ctx.createRadialGradient(X(0.44), Y(0.13), 0, X(0.44), Y(0.13), W * 0.34);
      sheen.addColorStop(0, rgba('#F2C14E', 0.4));
      sheen.addColorStop(0.6, rgba('#F2C14E', 0.12));
      sheen.addColorStop(1, rgba('#F2C14E', 0));
      hairPath();
      ctx.fillStyle = sheen;
      ctx.fill();
      ctx.restore();

      // the garment, over the shoulders, with a scooped neckline
      ctx.beginPath();
      ctx.moveTo(X(0.005), Y(1.03));
      ctx.bezierCurveTo(X(0.016), Y(0.972), X(0.048), Y(0.918), X(0.100), Y(0.862));
      ctx.bezierCurveTo(X(0.170), Y(0.788), X(0.258), Y(0.720), X(0.318), Y(0.684));
      ctx.bezierCurveTo(X(0.380), Y(0.762), X(0.502), Y(0.768), X(0.566), Y(0.694)); // neckline
      ctx.bezierCurveTo(X(0.700), Y(0.726), X(0.846), Y(0.800), X(0.930), Y(0.900));
      ctx.bezierCurveTo(X(0.968), Y(0.944), X(0.986), Y(0.984), X(0.995), Y(1.03));
      ctx.closePath();
      ctx.fillStyle = '#1F7A5A';
      ctx.fill();

      // rim light: a stroke straddling the profile edge, so the light reads as
      // coming from the same place she's looking
      ctx.beginPath();
      ctx.moveTo(X(0.452), Y(0.104));
      ctx.bezierCurveTo(X(0.552), Y(0.108), X(0.628), Y(0.166), X(0.654), Y(0.248));
      ctx.bezierCurveTo(X(0.662), Y(0.274), X(0.652), Y(0.292), X(0.650), Y(0.302));
      ctx.bezierCurveTo(X(0.658), Y(0.310), X(0.688), Y(0.328), X(0.710), Y(0.352));
      ctx.bezierCurveTo(X(0.702), Y(0.364), X(0.682), Y(0.366), X(0.672), Y(0.372));
      ctx.bezierCurveTo(X(0.680), Y(0.382), X(0.682), Y(0.392), X(0.670), Y(0.400));
      ctx.bezierCurveTo(X(0.684), Y(0.408), X(0.682), Y(0.420), X(0.666), Y(0.426));
      ctx.bezierCurveTo(X(0.676), Y(0.438), X(0.686), Y(0.448), X(0.680), Y(0.468));
      ctx.bezierCurveTo(X(0.670), Y(0.496), X(0.622), Y(0.518), X(0.568), Y(0.518));
      ctx.strokeStyle = '#F2C14E';
      ctx.lineWidth = Math.max(2, W * 0.019);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // the tie holding the bun
      ctx.strokeStyle = rgba('#F2C14E', 0.55);
      ctx.lineWidth = Math.max(2, W * 0.014);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(X(0.258), Y(0.286));
      ctx.quadraticCurveTo(X(0.286), Y(0.330), X(0.266), Y(0.428));
      ctx.stroke();

      // two strands escaping the tie — started inside the hair so they read
      // as loose hair and not as antennae
      ctx.strokeStyle = rgba('#2A2620', 0.8);
      ctx.lineWidth = Math.max(1.2, W * 0.0055);
      [[0.236, 0.302, 0.176, 0.258, 0.186, 0.202],
       [0.244, 0.416, 0.190, 0.470, 0.184, 0.536]].forEach(function (s) {
        ctx.beginPath();
        ctx.moveTo(X(s[0]), Y(s[1]));
        ctx.quadraticCurveTo(X(s[2]), Y(s[3]), X(s[4]), Y(s[5]));
        ctx.stroke();
      });

      ctx.restore();

      // a painter's signature mark, bottom right
      ctx.fillStyle = rgba('#22201C', 0.4);
      ctx.font = '500 ' + Math.round(W * 0.045) + 'px Fraunces, Georgia, serif';
      ctx.textAlign = 'right';
      ctx.fillText(FRIEND_NAME, X(0.93), Y(0.955));
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
            { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' });
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
          opacity: 0, duration: 0.9, ease: 'power2.out',
          onComplete: function () { dCtx.clearRect(0, 0, W, H); }
        });
        // and let the colour bloom
        gsap.fromTo(pCanvas,
          { filter: 'saturate(1) brightness(1)' },
          { filter: 'saturate(1.28) brightness(1.06)', duration: 1.1, ease: 'power2.out',
            yoyo: true, repeat: 1, repeatDelay: 0.5 });
        gsap.fromTo(frame, { scale: 1 }, { scale: 1.025, duration: 0.7, ease: 'power2.out', yoyo: true, repeat: 1 });
        setTimeout(function () { burstFrom(frame, 60); }, 350);
      } else {
        dCanvas.style.opacity = '0';
        dCtx.clearRect(0, 0, W, H);
      }

      showLine(RESTORATION_LINES.length - 1);
      if (meter) meter.textContent = '100%';
      if (hintEl) hintEl.classList.add('is-gone');

      if (actions) {
        actions.hidden = false;
        if (HAS_GSAP && !REDUCED) {
          gsap.fromTo(actions, { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: 'power2.out' });
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


  /* ═══════════════ 9 · GAME 2 — COLOUR MIX LAB ═══════════════ */

  const Mix = (function () {
    const bowl = $('#mixBowl');
    const wellsEl = $('#wells');
    const memoryEl = $('#mixMemory');
    const stripEl = $('#paletteStrip');
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
            { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' });
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
        .to(blob, { scale: 2.1, opacity: 0, duration: 0.3, ease: 'power2.out' }, '-=0.06')
        .fromTo(blob, { scaleX: 1 }, { scaleX: 1.35, duration: 0.18, yoyo: true, repeat: 1 }, 0.2);
    }

    function plink(blend) {
      const li = document.createElement('li');
      li.style.setProperty('--pig', blend.resultColor);
      li.title = blend.name + ' — ' + blend.memory;
      li.setAttribute('aria-label', blend.name + ': ' + blend.memory);
      stripEl.appendChild(li);
      if (HAS_GSAP && !REDUCED) {
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

    return {
      enter: function () {
        size();
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
        ease: 'power2.inOut'
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
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
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
            { opacity: 1, y: 0, duration: 0.7, delay: 0.35, ease: 'power2.out' });
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
