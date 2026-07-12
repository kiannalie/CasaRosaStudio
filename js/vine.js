/* ============================================================
   CASA ROSA — the climbing vine
   A hand-drawn wisteria vine grows around the edges of the
   hero, in the manner of an antique book endpaper: wandering
   stems, pinnate leaf sprigs, hanging blossom racemes, curling
   tendrils and a dusting of stipple — leaving the centre open
   for the monogram.
   ============================================================ */

(function () {
  const svg = document.getElementById("vine-frame");
  if (!svg) return;

  const NS = "http://www.w3.org/2000/svg";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* seeded random so the vine grows the same way on every visit */
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

  /* Catmull-Rom through waypoints → dense polyline (for both the
     path and for placing ornaments along it) */
  function samplePath(pts, per = 14) {
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

  const d = (samples) => "M" + samples.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L ");

  function pointAt(samples, t) {
    const i = Math.min(samples.length - 2, Math.max(0, Math.floor(t * (samples.length - 1))));
    const p = samples[i], q = samples[i + 1];
    return { x: p[0], y: p[1], angle: Math.atan2(q[1] - p[1], q[0] - p[0]) };
  }

  /* ---------- ornaments ---------- */

  function leafShape(size, g, rnd) {
    return el("path", {
      d: `M0 0 Q ${(size * 0.5).toFixed(1)} ${(-size * 0.36).toFixed(1)} ${size.toFixed(1)} 0 Q ${(size * 0.5).toFixed(1)} ${(size * 0.36).toFixed(1)} 0 0 Z`,
      fill: "currentColor",
      opacity: (0.4 + rnd() * 0.25).toFixed(2),
    }, g);
  }

  /* a pinnate sprig — leaflet pairs along a little midrib */
  function sprig(parent, x, y, angle, size, rnd) {
    const g = el("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(angle * 180 / Math.PI).toFixed(1)})` }, parent);
    el("path", { d: `M0 0 Q ${size * 0.5} ${-size * 0.08} ${size} ${-size * 0.16}`, fill: "none", stroke: "currentColor", "stroke-width": 1, opacity: 0.5 }, g);
    const pairs = 4 + Math.floor(rnd() * 3);
    for (let i = 1; i <= pairs; i++) {
      const t = i / pairs;
      const lx = size * t, ly = -size * 0.16 * t;
      const ls = size * 0.30 * (1 - t * 0.45);
      const spread = 38 + rnd() * 16;
      const up = el("g", { transform: `translate(${lx.toFixed(1)} ${ly.toFixed(1)}) rotate(${-spread})` }, g);
      leafShape(ls, up, rnd);
      const dn = el("g", { transform: `translate(${lx.toFixed(1)} ${ly.toFixed(1)}) rotate(${spread})` }, g);
      leafShape(ls, dn, rnd);
    }
    leafShape(size * 0.22, el("g", { transform: `translate(${size} ${-size * 0.16}) rotate(-8)` }, g), rnd);
    return g;
  }

  /* one pea-flower blossom: two soft shell petals */
  function blossom(parent, x, y, angle, size, rnd) {
    const g = el("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${(size / 10).toFixed(2)})` }, parent);
    const filled = rnd() > 0.45;
    const style = filled
      ? { fill: "currentColor", opacity: (0.38 + rnd() * 0.2).toFixed(2) }
      : { fill: "none", stroke: "currentColor", "stroke-width": 1.1, opacity: 0.55 };
    el("path", { d: "M0 0 C 2 -7 10 -8 11 -2 C 11.5 3 5 6 0 3 Z", ...style }, g);
    el("path", { d: "M0 0 C -2 -6 -9 -7 -10 -1.5 C -10.5 3 -4.5 5.5 0 2.5 Z", ...style }, g);
    return g;
  }

  /* a hanging raceme — blossoms cascading down a drooping stem */
  function raceme(parent, x, y, size, rnd) {
    const g = el("g", {}, parent);
    const sway = (rnd() - 0.5) * size * 0.5;
    const pts = [[x, y], [x + sway * 0.4, y + size * 0.35], [x + sway, y + size * 0.75], [x + sway * 0.8, y + size]];
    const s = samplePath(pts, 10);
    el("path", { d: d(s), fill: "none", stroke: "currentColor", "stroke-width": 1.1, opacity: 0.5 }, g);
    const n = 7 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      const t = 0.1 + (i / n) * 0.9;
      const p = pointAt(s, t);
      const side = i % 2 ? 1 : -1;
      const bs = (13 - t * 6) * (size / 120);
      blossom(g, p.x + side * bs * 0.75, p.y, side * (20 + rnd() * 30), bs, rnd);
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
    return el("path", { d: d(samplePath(pts, 4)), fill: "none", stroke: "currentColor", "stroke-width": 1.1, opacity: 0.55, "stroke-linecap": "round" }, parent);
  }

  /* the airy dusting of dots around the blossoms */
  function stipple(parent, x, y, r, count, rnd) {
    const g = el("g", { opacity: 0.5 }, parent);
    for (let i = 0; i < count; i++) {
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * r;
      el("circle", { cx: (x + Math.cos(a) * rr).toFixed(1), cy: (y + Math.sin(a) * rr).toFixed(1), r: (0.7 + rnd() * 0.9).toFixed(2), fill: "currentColor" }, g);
    }
    return g;
  }

  /* ---------- a branch: stem + its ornaments ---------- */

  function branch(parent, waypoints, orns, delay, rnd) {
    const g = el("g", { class: "vine-branch" }, parent);
    const s = samplePath(waypoints);
    const stem = el("path", {
      d: d(s), fill: "none", stroke: "currentColor",
      "stroke-width": 2.1, "stroke-linecap": "round", opacity: 0.6,
    }, g);

    g.style.transformOrigin = waypoints[0][0] + "px " + waypoints[0][1] + "px";
    if (!reduced) {
      g.style.animation = `vineSway ${9 + rnd() * 4}s ease-in-out ${rnd() * 5}s infinite alternate`;
    }

    const grow = 2.4; // seconds for a stem to draw itself
    const made = [];
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

    /* along the top, entering from the left */
    branch(svg, [P(-0.02, 0.12), P(0.09, 0.075), P(0.22, 0.05), P(0.36, 0.065), P(0.5, 0.04), P(0.58, 0.055)], [
      { t: 0.1, kind: "raceme", size: m * 0.2 },
      { t: 0.32, kind: "sprig", size: m * 0.13, rot: -0.5 },
      { t: 0.5, kind: "raceme", size: m * 0.16 },
      { t: 0.68, kind: "sprig", size: m * 0.11, rot: 0.35 },
      { t: 0.9, kind: "raceme", size: m * 0.14 },
      { t: 1.0, kind: "tendril", size: m * 0.016, dir: -1 },
    ], 0, rnd);

    /* falling down the left edge */
    branch(svg, [P(0.055, 0.09), P(0.075, 0.2), P(0.055, 0.31), P(0.08, 0.42)], [
      { t: 0.3, kind: "raceme", size: m * 0.17 },
      { t: 0.55, kind: "sprig", size: m * 0.1, rot: 0.9 },
      { t: 0.85, kind: "raceme", size: m * 0.2 },
    ], 0.5, rnd);

    /* sweeping down the right side */
    branch(svg, [P(0.62, -0.02), P(0.75, 0.07), P(0.87, 0.14), P(0.93, 0.28), P(0.9, 0.44), P(0.94, 0.6), P(0.9, 0.74)], [
      { t: 0.12, kind: "sprig", size: m * 0.14, rot: -0.6 },
      { t: 0.3, kind: "raceme", size: m * 0.18 },
      { t: 0.45, kind: "sprig", size: m * 0.12, rot: -0.9 },
      { t: 0.58, kind: "raceme", size: m * 0.22 },
      { t: 0.72, kind: "tendril", size: m * 0.018, dir: 1 },
      { t: 0.85, kind: "raceme", size: m * 0.17 },
      { t: 0.97, kind: "sprig", size: m * 0.1, rot: 0.7 },
    ], 0.7, rnd);

    /* resting along the bottom */
    branch(svg, [P(0.74, 0.99), P(0.6, 0.945), P(0.46, 0.93), P(0.33, 0.95), P(0.23, 0.91)], [
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
