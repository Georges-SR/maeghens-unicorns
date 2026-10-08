// Maeghen's Unicorns — interaction layer. Plain ES module, no dependencies.

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
if (reduced) document.documentElement.classList.add('reduced');

/* ───────────────────────── Starfield + Monoceros constellation ───────────────────────── */

// Unicorn head in profile, facing left, in a unit box. [x, y, size]
const P = {
  hornTip: [0.10, 0.02, 3.2], hornMid: [0.23, 0.16, 1.4], hornBase: [0.36, 0.30, 2.2],
  brow: [0.33, 0.37, 1.6], earFront: [0.42, 0.27, 1.4], earTip: [0.47, 0.10, 2.2], earBack: [0.50, 0.26, 1.4],
  eye: [0.34, 0.45, 2.6], bridge: [0.24, 0.53, 1.6], nose: [0.15, 0.62, 1.6],
  muzzle: [0.10, 0.69, 2.0], lip: [0.12, 0.75, 1.3], mouth: [0.19, 0.76, 1.3], chin: [0.25, 0.79, 1.6],
  jaw: [0.35, 0.72, 2.0], throat: [0.44, 0.70, 1.5], neck1: [0.50, 0.84, 1.5], neck2: [0.54, 1.00, 1.8],
  poll: [0.53, 0.30, 1.8], crest1: [0.64, 0.42, 1.6], crest2: [0.73, 0.60, 1.5], crest3: [0.80, 0.80, 1.6], withers: [0.86, 1.00, 2.0],
  mane1: [0.58, 0.22, 1.3], mane2: [0.70, 0.27, 1.6], mane3: [0.80, 0.40, 1.3], mane4: [0.88, 0.58, 1.8], mane5: [0.93, 0.80, 1.3],
};
const EDGES = [
  ['hornTip', 'hornMid', 1], ['hornMid', 'hornBase', 1],
  ['hornBase', 'brow'], ['hornBase', 'earFront'], ['earFront', 'earTip'], ['earTip', 'earBack'], ['earBack', 'poll'],
  ['brow', 'bridge'], ['bridge', 'nose'], ['nose', 'muzzle'], ['muzzle', 'lip'], ['lip', 'mouth'], ['mouth', 'chin'],
  ['chin', 'jaw'], ['jaw', 'throat'], ['throat', 'neck1'], ['neck1', 'neck2'],
  ['poll', 'crest1'], ['crest1', 'crest2'], ['crest2', 'crest3'], ['crest3', 'withers'],
  ['earBack', 'mane1', 2], ['mane1', 'mane2', 2], ['mane2', 'mane3', 2], ['mane3', 'mane4', 2], ['mane4', 'mane5', 2],
];

function sky() {
  const canvas = $('.sky');
  if (!canvas) return;
  const hero = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, stars = [], shooters = [], box, visible = true, t0 = performance.now();
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, px: -999, py: -999 };

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(clamp(w * h / 2600, 160, 520));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      z: Math.random() ** 2,                 // depth: 0 far … 1 near
      r: Math.random() * 1.1 + .25,
      p: Math.random() * Math.PI * 2,        // twinkle phase
      s: Math.random() * 1.5 + .5,           // twinkle speed
      hue: Math.random() < .14 ? 'warm' : Math.random() < .3 ? 'cool' : 'white',
    }));
    // constellation box: right side on wide screens, centred behind the title on narrow ones
    const size = w > 900 ? Math.min(h * .78, w * .46) : Math.min(w * .9, h * .62);
    box = w > 900
      ? { x: w - size - Math.max(40, w * .06), y: (h - size) / 2 + 10, s: size }
      : { x: (w - size) / 2, y: h * .2, s: size };
  }

  const pt = (k) => {
    const [x, y, r] = P[k];
    // the constellation drifts a little with the mouse (parallax)
    return { x: box.x + x * box.s + mouse.x * 18, y: box.y + y * box.s + mouse.y * 14, r };
  };

  function starColor(s, a) {
    if (s.hue === 'warm') return `rgba(241,217,154,${a})`;
    if (s.hue === 'cool') return `rgba(170,195,240,${a})`;
    return `rgba(239,230,210,${a})`;
  }

  function draw(now) {
    const t = (now - t0) / 1000;
    mouse.x += (mouse.tx - mouse.x) * .05; mouse.y += (mouse.ty - mouse.y) * .05;
    ctx.clearRect(0, 0, w, h);

    // field stars
    for (const s of stars) {
      const tw = reduced ? .8 : .55 + .45 * Math.sin(t * s.s + s.p);
      const x = s.x + mouse.x * 30 * s.z, y = s.y + mouse.y * 22 * s.z;
      const dx = x - mouse.px, dy = y - mouse.py, d = Math.hypot(dx, dy);
      const near = d < 140 ? 1 - d / 140 : 0;
      const a = clamp((.25 + s.z * .6) * tw + near * .6, 0, 1);
      ctx.fillStyle = starColor(s, a);
      ctx.beginPath(); ctx.arc(x, y, s.r * (1 + s.z * .8 + near * .8), 0, Math.PI * 2); ctx.fill();
      if (near > .35 && finePointer) {
        ctx.strokeStyle = `rgba(241,217,154,${(near - .35) * .35})`; ctx.lineWidth = .6;
        ctx.beginPath(); ctx.moveTo(mouse.px, mouse.py); ctx.lineTo(x, y); ctx.stroke();
      }
    }

    // constellation lines draw themselves in, one after another
    const drawDur = reduced ? 0 : 4.2, delay = reduced ? 0 : .6;
    const prog = clamp((t - delay) / (drawDur || 1), 0, 1) * EDGES.length;
    ctx.lineCap = 'round';
    EDGES.forEach(([a, b, kind], i) => {
      const f = reduced ? 1 : clamp(prog - i, 0, 1);
      if (f <= 0) return;
      const A = pt(a), B = pt(b);
      const x2 = A.x + (B.x - A.x) * f, y2 = A.y + (B.y - A.y) * f;
      if (kind === 1) { // the horn — gilded and glowing
        ctx.shadowColor = 'rgba(241,217,154,.9)'; ctx.shadowBlur = 14;
        ctx.strokeStyle = 'rgba(241,217,154,.9)'; ctx.lineWidth = 1.6;
      } else if (kind === 2) { // mane — soft dashed
        ctx.shadowBlur = 0; ctx.setLineDash([2, 6]);
        ctx.strokeStyle = 'rgba(127,162,220,.45)'; ctx.lineWidth = 1;
      } else {
        ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(201,164,92,.42)'; ctx.lineWidth = .9;
      }
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]); ctx.shadowBlur = 0;
    });

    // constellation stars
    const keys = Object.keys(P);
    keys.forEach((k, i) => {
      const appear = reduced ? 1 : clamp((t - .2 - i * .05) * 1.5, 0, 1);
      if (!appear) return;
      const { x, y, r } = pt(k);
      const tw = reduced ? 1 : .8 + .2 * Math.sin(t * 2 + i);
      const d = Math.hypot(x - mouse.px, y - mouse.py), near = d < 60 ? 1 - d / 60 : 0;
      const R = r * tw * (1 + near * .9) * appear;
      const g = ctx.createRadialGradient(x, y, 0, x, y, R * 7);
      g.addColorStop(0, `rgba(255,248,225,${.55 * appear})`);
      g.addColorStop(.25, `rgba(241,217,154,${.18 * appear})`);
      g.addColorStop(1, 'rgba(241,217,154,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R * 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff8e1'; ctx.beginPath(); ctx.arc(x, y, R * .9, 0, Math.PI * 2); ctx.fill();
      if (k === 'hornTip' || k === 'eye') { // four-point sparkle
        const L = R * (k === 'hornTip' ? 7 : 4.5) * (reduced ? 1 : .8 + .2 * Math.sin(t * 3));
        ctx.strokeStyle = `rgba(255,248,225,${.7 * appear})`; ctx.lineWidth = .8;
        ctx.beginPath(); ctx.moveTo(x - L, y); ctx.lineTo(x + L, y); ctx.moveTo(x, y - L); ctx.lineTo(x, y + L); ctx.stroke();
      }
    });

    // shooting stars
    shooters = shooters.filter((s) => s.life < 1);
    for (const s of shooters) {
      s.life += 1 / 70; s.x += s.vx; s.y += s.vy;
      const a = Math.sin(Math.PI * s.life);
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 14, s.y - s.vy * 14);
      g.addColorStop(0, `rgba(255,248,225,${a})`); g.addColorStop(1, 'rgba(241,217,154,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 14, s.y - s.vy * 14); ctx.stroke();
    }
    if (!reduced && Math.random() < .0025) shoot(Math.random() * w, Math.random() * h * .4);

    if (visible && !reduced) requestAnimationFrame(draw);
  }

  function shoot(x, y) {
    const ang = Math.PI * (.12 + Math.random() * .12), sp = 9 + Math.random() * 6;
    const dir = Math.random() < .5 ? -1 : 1;
    shooters.push({ x, y, vx: Math.cos(ang) * sp * dir, vy: Math.sin(ang) * sp, life: 0 });
  }

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    mouse.px = e.clientX - r.left; mouse.py = e.clientY - r.top;
    mouse.tx = (mouse.px / w - .5) * 2; mouse.ty = (mouse.py / h - .5) * 2;
  });
  hero.addEventListener('pointerleave', () => { mouse.px = mouse.py = -999; mouse.tx = mouse.ty = 0; });
  canvas.addEventListener('click', (e) => {
    const r = hero.getBoundingClientRect();
    for (let i = 0; i < 3; i++) setTimeout(() => shoot(e.clientX - r.left, e.clientY - r.top), i * 120);
    if (reduced) requestAnimationFrame(draw);
  });

  new IntersectionObserver(([en]) => {
    const was = visible; visible = en.isIntersecting;
    if (visible && !was && !reduced) requestAnimationFrame(draw);
  }).observe(hero);

  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduced) draw(performance.now()); }, 120); });
  resize(); requestAnimationFrame(draw);
}

/* ───────────────────────── Gold-dust cursor trail ───────────────────────── */

function dust() {
  const c = $('.dust');
  if (!c || reduced || !finePointer) { c?.remove(); return; }
  const ctx = c.getContext('2d');
  let parts = [], running = false, dpr = 1;
  const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener('resize', size);
  let lx = 0, ly = 0;
  addEventListener('pointermove', (e) => {
    const d = Math.hypot(e.clientX - lx, e.clientY - ly);
    lx = e.clientX; ly = e.clientY;
    const n = Math.min(3, Math.floor(d / 8));
    for (let i = 0; i < n; i++) {
      parts.push({ x: e.clientX + (Math.random() - .5) * 6, y: e.clientY + (Math.random() - .5) * 6,
        vx: (Math.random() - .5) * .6, vy: Math.random() * .6 + .2, life: 1, r: Math.random() * 1.4 + .4 });
    }
    if (parts.length > 160) parts.splice(0, parts.length - 160);
    if (!running) { running = true; requestAnimationFrame(tick); }
  }, { passive: true });
  function tick() {
    ctx.clearRect(0, 0, c.width, c.height);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += .01; p.life -= .022;
      ctx.fillStyle = `rgba(241,217,154,${Math.max(p.life, 0) * .8})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * Math.max(p.life, 0), 0, Math.PI * 2); ctx.fill();
    }
    parts = parts.filter((p) => p.life > 0);
    if (parts.length) requestAnimationFrame(tick); else { running = false; ctx.clearRect(0, 0, c.width, c.height); }
  }
}

/* ───────────────────────── Reveal, nav, progress ───────────────────────── */

function reveals() {
  const els = $$('[data-reveal]');
  if (reduced) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  els.forEach((e) => io.observe(e));
}

function chrome() {
  const nav = $('#nav'), bar = $('.progress span');
  const links = $$('.nav__links a');
  const sections = links.map((a) => $(a.getAttribute('href')));
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', max > 0 ? scrollY / max : 0);
    nav.classList.toggle('is-scrolled', scrollY > 40);
    let current = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .4) current = i; });
    links.forEach((a, i) => a.classList.toggle('is-active', i === current));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* ───────────────────────── Pinned horizontal timeline ───────────────────────── */

function timeline() {
  const sec = $('.timeline'), track = $('.timeline__track');
  const yearEl = $('.timeline__year'), meter = $('.timeline__meter b');
  const events = $$('.event', track);
  const mq = matchMedia('(min-width: 900px) and (min-height: 600px)');
  let dist = 0, ticking = false;

  function layout() {
    const pin = mq.matches && !reduced;
    sec.classList.toggle('is-pinned', pin);
    if (!pin) { sec.style.height = ''; track.style.transform = ''; return; }
    dist = Math.max(0, track.scrollWidth - innerWidth);
    sec.style.height = `${innerHeight + dist}px`;
    update();
  }
  function update() {
    ticking = false;
    if (!sec.classList.contains('is-pinned')) return;
    const top = sec.getBoundingClientRect().top;
    const p = clamp(-top / (dist || 1), 0, 1);
    track.style.transform = `translate3d(${-p * dist}px,0,0)`;
    meter.style.setProperty('--tp', p);
    // year = the event nearest the left third of the screen
    const focus = innerWidth * .35;
    let best = events[0], bd = Infinity;
    for (const ev of events) {
      const r = ev.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - focus);
      if (d < bd) { bd = d; best = ev; }
      ev.style.opacity = clamp(1.25 - Math.abs(r.left + r.width / 2 - innerWidth / 2) / innerWidth, .35, 1);
    }
    if (yearEl.textContent !== best.dataset.year) yearEl.textContent = best.dataset.year;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', layout);
  mq.addEventListener('change', layout);
  addEventListener('load', layout);
  layout();
}

/* ───────────────────────── Tilt cards ───────────────────────── */

function tilt() {
  if (reduced || !finePointer) return;
  for (const card of $$('[data-tilt]')) {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.classList.add('is-tilting');
      card.style.setProperty('--ry', `${(x - .5) * 10}deg`);
      card.style.setProperty('--rx', `${(.5 - y) * 10}deg`);
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg');
    });
  }
}

/* ───────────────────────── Tapestry hotspots ───────────────────────── */

function tapestry() {
  const spots = $$('.spot'), entries = $$('.tapestry__entry');
  const order = spots.map((s) => s.dataset.spot);
  let idx = -1;
  function show(key) {
    idx = order.indexOf(key);
    spots.forEach((s) => s.setAttribute('aria-pressed', String(s.dataset.spot === key)));
    entries.forEach((en) => {
      const on = en.dataset.entry === key;
      en.hidden = !on; en.classList.toggle('is-active', on);
    });
  }
  spots.forEach((s) => s.addEventListener('click', () => show(s.dataset.spot)));
  $$('[data-step]').forEach((b) => b.addEventListener('click', () => {
    const n = order.length, step = +b.dataset.step;
    idx = idx < 0 ? (step > 0 ? 0 : n - 1) : (idx + step + n) % n;
    show(order[idx]);
  }));
  spots.forEach((s) => s.setAttribute('aria-pressed', 'false'));
}

/* ───────────────────────── Gallery lightbox ───────────────────────── */

function gallery() {
  const dlg = $('.lightbox'); if (!dlg || !dlg.showModal) return;
  const tiles = $$('.tile button'), img = $('img', dlg), cap = $('figcaption', dlg);
  let i = 0;
  const open = (n) => {
    i = (n + tiles.length) % tiles.length;
    const t = tiles[i];
    img.src = t.dataset.full; img.alt = $('img', t).alt;
    cap.innerHTML = t.parentElement.querySelector('figcaption').innerHTML;
    img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
    if (!dlg.open) dlg.showModal();
  };
  tiles.forEach((t, n) => t.addEventListener('click', () => open(n)));
  $('.lightbox__arrow--prev', dlg).addEventListener('click', () => open(i - 1));
  $('.lightbox__arrow--next', dlg).addEventListener('click', () => open(i + 1));
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') open(i - 1);
    if (e.key === 'ArrowRight') open(i + 1);
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.tagName === 'FIGURE') dlg.close(); });
}

/* ───────────────────────── Fiction filters ───────────────────────── */

function fiction() {
  const chips = $$('.chip'), books = $$('.book');
  chips.forEach((c) => c.addEventListener('click', () => {
    const f = c.dataset.filter;
    chips.forEach((x) => { const on = x === c; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); });
    books.forEach((b, n) => {
      const show = f === 'all' || b.dataset.kind === f;
      b.classList.toggle('is-hidden', !show);
      b.classList.remove('is-entering');
      if (show && !reduced) { void b.offsetWidth; b.style.animationDelay = `${(n % 8) * 40}ms`; b.classList.add('is-entering'); }
    });
  }));
}

/* ───────────────────────── The Oracle (quiz) ───────────────────────── */

const QUESTIONS = [
  ['Most “unicorn horns” sold in medieval and Renaissance Europe were really narwhal tusks.', true,
    'Arctic traders brought narwhal tusks south, where they sold as alicorns for fortunes. Ole Worm exposed the trade in 1638.'],
  ['The word “unicorn” appears in the King James Bible.', true,
    'Several times. Translators followed the Greek “monokeros” for the Hebrew re’em — probably the wild aurochs.'],
  ['Pliny the Elder wrote that the unicorn was gentle and easily tamed.', false,
    'The opposite: Pliny’s monoceros was the fiercest of beasts, and “cannot be taken alive”.'],
  ['The unicorn is the national animal of Scotland.', true,
    'It has supported Scotland’s royal arms since the 15th century, and still does, chained, on the UK arms.'],
  ['Ctesias described the unicorn’s horn as pure white from base to tip.', false,
    'His horn was tricolour: white at the base, black in the middle, and crimson at the tip.'],
  ['Raphael’s “Young Woman with Unicorn” has always shown a unicorn.', false,
    'The unicorn was painted over for centuries — she was disguised as Saint Catherine — until a 1930s restoration revealed it.'],
  ['A one-horned “Siberian unicorn” really walked the Earth alongside early humans.', true,
    'Elasmotherium, a giant rhinoceros, survived until at least 39,000 years ago — after modern humans had reached its range.'],
  ['In 1414, a giraffe presented to the Ming emperor was celebrated as a qilin.', true,
    'Envoys from Bengal brought it to Nanjing, and the court painter Shen Du recorded the auspicious “qilin”.'],
];

function oracle() {
  const card = $('.quiz__card'); if (!card) return;
  const q = $('.quiz__q'), count = $('.quiz__count'), score = $('.quiz__score');
  const verdict = $('.quiz__verdict'), explain = $('.quiz__explain'), next = $('.quiz__next');
  const btns = $('.quiz__btns');
  let n = 0, pts = 0;
  function render() {
    card.classList.remove('is-flipped', 'is-done');
    count.textContent = `${n + 1} / ${QUESTIONS.length}`;
    q.textContent = QUESTIONS[n][0];
    btns.hidden = false;
  }
  btns.addEventListener('click', (e) => {
    const b = e.target.closest('[data-answer]'); if (!b) return;
    const [, truth, why] = QUESTIONS[n];
    const right = (b.dataset.answer === 'truth') === truth;
    if (right) pts++;
    score.textContent = `Score ${pts}`;
    verdict.textContent = right ? (truth ? 'Truth — well read.' : 'Myth — well spotted.') : (truth ? 'Alas — it’s true.' : 'Alas — a myth.');
    verdict.className = `quiz__verdict ${right ? 'is-right' : 'is-wrong'}`;
    explain.textContent = why;
    next.textContent = n === QUESTIONS.length - 1 ? 'See my fate' : 'Next';
    card.classList.add('is-flipped');
    next.focus({ preventScroll: true });
  });
  let done = false;
  next.addEventListener('click', () => {
    if (done) { done = false; n = 0; pts = 0; score.textContent = 'Score 0'; render(); return; }
    if (n < QUESTIONS.length - 1) { n++; render(); $('[data-answer]', btns).focus({ preventScroll: true }); return; }
    // finale
    const ranks = [
      [8, 'Keeper of the Alicorn', 'Flawless. The unicorn would lay its head in your lap.'],
      [6, 'Royal Bestiarist', 'A scholar of the marvellous. The tapestry weavers would hire you.'],
      [4, 'Wandering Hunter', 'You’ve glimpsed the white flank between the trees. Keep going.'],
      [0, 'Bewildered Villager', 'The unicorn eludes you — for now. Scroll up and try the hunt again.'],
    ];
    const [, title, line] = ranks.find(([min]) => pts >= min);
    done = true;
    card.classList.remove('is-flipped'); card.classList.add('is-done');
    count.textContent = 'Your fate';
    q.innerHTML = `${pts} of ${QUESTIONS.length}: <em>${title}</em>`;
    btns.hidden = true;
    setTimeout(() => {
      verdict.textContent = title; verdict.className = 'quiz__verdict is-right';
      explain.textContent = line; next.textContent = 'Consult again';
      card.classList.add('is-flipped');
    }, 700);
  });
  render();
}

/* ───────────────────────── boot ───────────────────────── */

sky(); dust(); reveals(); chrome(); timeline(); tilt(); tapestry(); gallery(); fiction(); oracle();
