/* ============================================================
   CASA ROSA — the climbing vine
   Drawn to look hand-inked, like an antique book endpaper:
   every line wavers like a pen stroke, leaves and blossoms are
   contour drawings (outlines with veins and fold lines, only
   occasionally washed with ink), every shape is a little
   asymmetric, and a turbulence filter roughens the ink edges.
   The centre stays open for the monogram.
   ============================================================ */

(function () {
  const svg = document.getElementById("vine-frame");
  if (!svg) return;

  const NS = "http://www.w3.org/2000/svg";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* seeded random so the vine is drawn the same way on every visit */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function el(name, attrs, parent) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ---------- the pen: nothing is drawn perfectly straight ---------- */

  /* a smooth wandering offset, like a hand that never quite holds still */
  function penWobble(rnd, amp) {
    const f1 = 0.09 + rnd() * 0.08, f2 = 0.23 + rnd() * 0.15;
    const p1 = rnd() * 6.28, p2 = rnd() * 6.28;
    const f3 = 0.11 + rnd() * 0.09, p3 = rnd() * 6.28;
    return (i) => [
      amp * (Math.sin(i * f1 + p1) + 0.5 * Math.sin(i * f2 + p2)) * 0.65,
      amp * (Math.sin(i * f3 + p3) + 0.5 * Math.sin(i * f2 + p1)) * 0.65,
    ];
  }

  function jitter(samples, rnd, amp) {
    const w = penWobble(rnd, amp);
    return samples.map((p, i) => {
      const [dx, dy] = w(i);
      return [p[0] + dx, p[1] + dy];
    });
  }

  /* Catmull-Rom through waypoints → dense polyline */
  function samplePath(pts, per = 16) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i],
            p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let j = 0; j < per; j++) {
        const t = j / per, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
        ]);
      }
    }
    out.push(pts[pts.length - 1].slice());
    return out;
  }

  const d = (samples, close) =>
    "M" + samples.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L ") + (close ? " Z" : "");

  function pointAt(samples, t) {
    const i = Math.min(samples.length - 2, Math.max(0, Math.floor(t * (samples.length - 1))));
    const p = samples[i], q = samples[i + 1];
    return { x: p[0], y: p[1], angle: Math.atan2(q[1] - p[1], q[0] - p[0]) };
  }

  /* sample a cubic bezier (for petal contours we then roughen) */
  function bez(p0, c1, c2, p3, n) {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      out.push([
        u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p3[1],
      ]);
    }
    return out;
  }

  const ink = (rnd, lo, hi) => (lo + rnd() * (hi - lo)).toFixed(2);

  /* ---------- ornaments, drawn as contour sketches ---------- */

  /* one leaf: an asymmetric outline with a vein, only sometimes washed */
  function leaf(parent, size, rnd) {
    const hUp = size * (0.28 + rnd() * 0.14);
    const hDn = size * (0.22 + rnd() * 0.14);
    const skew = (rnd() - 0.5) * 0.35;
    const N = 11;
    const pts = [];
    for (let i = 0; i <= N; i++) {          // out along the top edge
      const t = i / N;
      pts.push([size * t, -hUp * Math.pow(Math.sin(Math.PI * Math.min(t * (1 + skew * 0.3), 1)), 0.85)]);
    }
    for (let i = N - 1; i > 0; i--) {        // back along the underside
      const t = i / N;
      pts.push([size * t * (1 - skew * 0.06), hDn * Math.pow(Math.sin(Math.PI * t), 0.9)]);
    }
    const rough = jitter(pts, rnd, size * 0.035);
    const washed = rnd() < 0.3;
    el("path", {
      d: d(rough, true),
      fill: washed ? "currentColor" : "none",
      "fill-opacity": washed ? ink(rnd, 0.14, 0.24) : "0",
      stroke: "currentColor",
      "stroke-width": ink(rnd, 0.8, 1.15),
      opacity: ink(rnd, 0.45, 0.6),
      "stroke-linejoin": "round",
    }, parent);
    /* the vein */
    const vein = jitter(samplePath([[size * 0.08, 0], [size * 0.5, (rnd() - 0.5) * size * 0.06], [size * 0.85, (rnd() - 0.5) * size * 0.1]], 6), rnd, size * 0.02);
    el("path", { d: d(vein), fill: "none", stroke: "currentColor", "stroke-width": 0.6, opacity: ink(rnd, 0.3, 0.42) }, parent);
  }

  /* a pinnate sprig — leaflet pairs along a wavering midrib */
  function sprig(parent, x, y, angle, size, rnd) {
    const g = el("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(angle * 180 / Math.PI).toFixed(1)})` }, parent);
    const rib = jitter(samplePath([[0, 0], [size * 0.5, -size * (0.05 + rnd() * 0.08)], [size, -size * (0.12 + rnd() * 0.08)]], 8), rnd, size * 0.02);
    el("path", { d: d(rib), fill: "none", stroke: "currentColor", "stroke-width": ink(rnd, 0.8, 1.1), opacity: 0.5 }, g);
    const pairs = 4 + Math.floor(rnd() * 3);
    for (let i = 1; i <= pairs; i++) {
      const t = i / pairs;
      const p = pointAt(rib, t);
      const ls = size * 0.3 * (1 - t * 0.4) * (0.85 + rnd() * 0.3);
      const spread = 34 + rnd() * 24;
      leaf(el("g", { transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(-spread + (rnd() - 0.5) * 10).toFixed(1)})` }, g), ls, rnd);
      leaf(el("g", { transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(spread + (rnd() - 0.5) * 10).toFixed(1)})` }, g), ls, rnd);
    }
    const tip = pointAt(rib, 1);
    leaf(el("g", { transform: `translate(${tip.x.toFixed(1)} ${tip.y.toFixed(1)}) rotate(${((rnd() - 0.5) * 14).toFixed(1)})` }, g), size * 0.2, rnd);
    return g;
  }

  /* one pea-flower: two shell petals drawn in contour, with a fold line */
  function blossom(parent, x, y, angle, size, rnd) {
    const g = el("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${(size / 10).toFixed(2)})` }, parent);
    const washed = rnd() < 0.35;
    const stroke = {
      fill: washed ? "currentColor" : "none",
      "fill-opacity": washed ? ink(rnd, 0.16, 0.26) : "0",
      stroke: "currentColor",
      "stroke-width": (0.9 + rnd() * 0.3).toFixed(2),
      opacity: ink(rnd, 0.45, 0.6),
      "stroke-linejoin": "round",
    };
    const s1 = 0.85 + rnd() * 0.3, s2 = 0.8 + rnd() * 0.3;
    /* right lobe */
    let o = bez([0, 0], [2 * s1, -7], [10, -8 * s1], [11 * s1, -2], 8)
      .concat(bez([11 * s1, -2], [11.5, 3 * s1], [5 * s1, 6], [0, 3], 8));
    el("path", { d: d(jitter(o, rnd, 0.35), true), ...stroke }, g);
    /* left lobe */
    o = bez([0, 0], [-2 * s2, -6], [-9, -7 * s2], [-10 * s2, -1.5], 8)
      .concat(bez([-10 * s2, -1.5], [-10.5, 3 * s2], [-4.5 * s2, 5.5], [0, 2.5], 8));
    el("path", { d: d(jitter(o, rnd, 0.35), true), ...stroke }, g);
    /* the fold at the throat */
    const fold = jitter(bez([0, 0.5], [1.5, -2.5], [4, -3.5], [6 * s1, -2], 7), rnd, 0.3);
    el("path", { d: d(fold), fill: "none", stroke: "currentColor", "stroke-width": 0.55, opacity: 0.35 }, g);
    return g;
  }

  /* a hanging raceme — blossoms cascading down a wavering stem */
  function raceme(parent, x, y, size, rnd) {
    const g = el("g", {}, parent);
    const sway = (rnd() - 0.5) * size * 0.5;
    const s = jitter(samplePath([[x, y], [x + sway * 0.4, y + size * 0.35], [x + sway, y + size * 0.75], [x + sway * 0.8, y + size]], 12), rnd, size * 0.015);
    el("path", { d: d(s), fill: "none", stroke: "currentColor", "stroke-width": ink(rnd, 0.85, 1.1), opacity: 0.5 }, g);
    const n = 7 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      const t = 0.1 + (i / n) * 0.9;
      const p = pointAt(s, t);
      const side = i % 2 ? 1 : -1;
      const bs = (13 - t * 6) * (size / 120) * (0.85 + rnd() * 0.3);
      /* a little stalk from the stem to each blossom */
      const st = jitter(samplePath([[p.x, p.y], [p.x + side * bs * 0.5, p.y + bs * 0.2]], 4), rnd, 0.3);
      el("path", { d: d(st), fill: "none", stroke: "currentColor", "stroke-width": 0.6, opacity: 0.4 }, g);
      blossom(g, p.x + side * bs * 0.75, p.y + bs * 0.25, side * (18 + rnd() * 34), bs, rnd);
    }
    stipple(g, x + sway * 0.6, y + size * 0.55, size * 0.5, 10 + Math.floor(rnd() * 8), rnd);
    return g;
  }

  /* a curling tendril: a short reach, then a tight shrinking curl */
  function tendril(parent, x, y, angle, size, dir, rnd) {
    const pts = [[x, y]];
    const reach = size * 1.6;
    pts.push([x + Math.cos(angle) * reach * 0.6, y + Math.sin(angle) * reach * 0.6]);
    const cx = x + Math.cos(angle) * reach;
    const cy = y + Math.sin(angle) * reach;
    const turns = 2.2 + rnd() * 0.8;
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const a = angle + Math.PI + dir * t * turns * Math.PI * 2;
      const r = size * 0.85 * (1 - t * 0.85);
      pts.push([cx + Math.cos(a) * r + Math.cos(angle) * size * 0.85, cy + Math.sin(a) * r + Math.sin(angle) * size * 0.85]);
    }
    return el("path", {
      d: d(jitter(samplePath(pts, 4), rnd, size * 0.02)),
      fill: "none", stroke: "currentColor", "stroke-width": 1, opacity: 0.55, "stroke-linecap": "round",
    }, parent);
  }

  /* the airy dusting of dots around the blossoms */
  function stipple(parent, x, y, r, count, rnd) {
    const g = el("g", { opacity: 0.5 }, parent);
    for (let i = 0; i < count; i++) {
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * r;
      el("circle", { cx: (x + Math.cos(a) * rr).toFixed(1), cy: (y + Math.sin(a) * rr).toFixed(1), r: (0.6 + rnd() * 0.9).toFixed(2), fill: "currentColor" }, g);
    }
    return g;
  }

  /* ---------- a branch: a doubled pen stroke + its ornaments ---------- */

  function branch(parent, waypoints, orns, delay, rnd) {
    const g = el("g", {}, parent);
    const s = jitter(samplePath(waypoints), rnd, 2.2);
    /* the main stroke, and a lighter second pass beside it — the way
       an inked line is often gone over twice */
    const stem = el("path", {
      d: d(s), fill: "none", stroke: "currentColor",
      "stroke-width": 1.9, "stroke-linecap": "round", opacity: 0.55,
    }, g);
    const second = el("path", {
      d: d(jitter(s, rnd, 1.4)), fill: "none", stroke: "currentColor",
      "stroke-width": 0.7, "stroke-linecap": "round", opacity: 0.3,
    }, g);

    const grow = 2.4; // seconds for a stem to draw itself
    const made = [{ node: second, at: delay + grow * 0.6 }];
    orns.forEach((o) => {
      const p = pointAt(s, o.t);
      let node = null;
      if (o.kind === "sprig") node = sprig(g, p.x, p.y, p.angle + (o.rot || 0), o.size, rnd);
      if (o.kind === "raceme") node = raceme(g, p.x, p.y, o.size, rnd);
      if (o.kind === "tendril") node = tendril(g, p.x, p.y, p.angle, o.size, o.dir || 1, rnd);
      if (node) made.push({ node, at: delay + o.t * grow });
    });

    if (reduced) return;

    const len = stem.getTotalLength();
    stem.style.strokeDasharray = len;
    stem.style.strokeDashoffset = len;
    stem.getBoundingClientRect(); // flush
    stem.style.transition = `stroke-dashoffset ${grow}s ease-out ${delay}s`;
    stem.style.strokeDashoffset = "0";

    made.forEach(({ node, at }) => {
      node.style.opacity = "0";
      node.getBoundingClientRect();
      node.style.transition = `opacity 1.4s ease ${at + 0.5}s`;
      node.style.opacity = "1";
    });
  }

  /* ---------- compose the frame ---------- */

  let lastW = 0;

  function build() {
    const w = svg.parentElement.clientWidth;
    const h = svg.parentElement.clientHeight;
    lastW = w;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.replaceChildren();
    const rnd = mulberry32(20260712);
    const m = Math.min(w, h); // scale ornaments to the short side
    const P = (fx, fy) => [w * fx, h * fy];

    /* roughen the ink edges, like print soaked into paper */
    const defs = el("defs", {}, svg);
    const filt = el("filter", { id: "ink-rough", x: "-4%", y: "-4%", width: "108%", height: "108%" }, defs);
    el("feTurbulence", { type: "fractalNoise", baseFrequency: "0.11", numOctaves: "2", seed: "7", result: "n" }, filt);
    el("feDisplacementMap", { in: "SourceGraphic", in2: "n", scale: "3.5", xChannelSelector: "R", yChannelSelector: "G" }, filt);
    const root = el("g", { filter: "url(#ink-rough)" }, svg);

    /* along the top, entering from the left */
    branch(root, [P(-0.02, 0.12), P(0.09, 0.075), P(0.22, 0.05), P(0.36, 0.065), P(0.5, 0.04), P(0.58, 0.055)], [
      { t: 0.1, kind: "raceme", size: m * 0.2 },
      { t: 0.32, kind: "sprig", size: m * 0.13, rot: -0.5 },
      { t: 0.5, kind: "raceme", size: m * 0.16 },
      { t: 0.68, kind: "sprig", size: m * 0.11, rot: 0.35 },
      { t: 0.9, kind: "raceme", size: m * 0.14 },
      { t: 1.0, kind: "tendril", size: m * 0.016, dir: -1 },
    ], 0, rnd);

    /* falling down the left edge */
    branch(root, [P(0.055, 0.09), P(0.075, 0.2), P(0.055, 0.31), P(0.08, 0.42)], [
      { t: 0.3, kind: "raceme", size: m * 0.17 },
      { t: 0.55, kind: "sprig", size: m * 0.1, rot: 0.9 },
      { t: 0.85, kind: "raceme", size: m * 0.2 },
    ], 0.5, rnd);

    /* sweeping down the right side */
    branch(root, [P(0.62, -0.02), P(0.75, 0.07), P(0.87, 0.14), P(0.93, 0.28), P(0.9, 0.44), P(0.94, 0.6), P(0.9, 0.74)], [
      { t: 0.12, kind: "sprig", size: m * 0.14, rot: -0.6 },
      { t: 0.3, kind: "raceme", size: m * 0.18 },
      { t: 0.45, kind: "sprig", size: m * 0.12, rot: -0.9 },
      { t: 0.58, kind: "raceme", size: m * 0.22 },
      { t: 0.72, kind: "tendril", size: m * 0.018, dir: 1 },
      { t: 0.85, kind: "raceme", size: m * 0.17 },
      { t: 0.97, kind: "sprig", size: m * 0.1, rot: 0.7 },
    ], 0.7, rnd);

    /* resting along the bottom */
    branch(root, [P(0.74, 0.99), P(0.6, 0.945), P(0.46, 0.93), P(0.33, 0.95), P(0.23, 0.91)], [
      { t: 0.2, kind: "sprig", size: m * 0.12, rot: 0.4 },
      { t: 0.45, kind: "sprig", size: m * 0.13, rot: -0.3 },
      { t: 0.7, kind: "sprig", size: m * 0.1, rot: 0.5 },
      { t: 0.92, kind: "tendril", size: m * 0.02, dir: -1 },
      { t: 1.0, kind: "tendril", size: m * 0.015, dir: 1 },
    ], 1.4, rnd);
  }

  build();

  let timer;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (Math.abs(svg.parentElement.clientWidth - lastW) > 80) build();
    }, 300);
  });
})();
