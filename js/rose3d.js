/* ============================================================
   CASA ROSA — the turning rose
   A procedural 3-D rose rendered in antique monochrome:
   sculpted petal surfaces in a natural spiral, lit like an old
   photographic plate, slowly turning on its axis.
   Falls back to the CSS bloom if WebGL is unavailable.
   ============================================================ */

import * as THREE from "three";

const stage = document.querySelector(".flower-stage");

function fallback() {
  if (window.buildCSSFlower) window.buildCSSFlower();
}

if (!stage) {
  /* no hero on this page */
} else {
  try {
    initRose();
  } catch (e) {
    fallback();
  }
}

/* ------------------------------------------------------------
   One petal: a curved sheet. u runs base→tip, v runs edge→edge.
   `curl` bends the tip outward (+) or inward (−); `cup` bows the
   cross-section toward the flower's axis.
   ------------------------------------------------------------ */
function smoothstep(a, b, x) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

function petalGeometry(curl, cup, ruffle, shade, mess) {
  const NU = 30, NV = 18;
  const L = 1.0, W = 0.92;
  const positions = [];
  const colors = [];
  const indices = [];

  /* every petal gets its own imperfections — no two alike.
     `mess` grows toward the outer rings: the bud stays neat,
     the open petals loosen up */
  const p1 = Math.random() * Math.PI * 2;
  const p2 = Math.random() * Math.PI * 2;
  const p3 = Math.random() * Math.PI * 2;
  const asym = (Math.random() - 0.5) * 0.16 * mess;  // leans a little to one side
  const twist = (Math.random() - 0.5) * 0.5 * mess;  // slow twist along its length
  const droop = Math.random() * 0.24 * mess;         // tip gives in to gravity
  const bend = (Math.random() - 0.5) * 0.12 * mess;  // uneven bow along the spine

  for (let iu = 0; iu <= NU; iu++) {
    const u = iu / NU;
    /* rose petal outline: narrow base, broad shoulders, rounded tip —
       with a slow wobble so the edge is never a clean curve */
    let profile = Math.pow(Math.sin(Math.PI * u * 0.68), 0.8);
    profile *= 1 - 0.55 * smoothstep(0.84, 1, u);
    profile *= 1 + (0.09 * Math.sin(u * 6.2 + p1) + 0.05 * Math.sin(u * 11 + p2)) * mess;
    const width = W * profile;
    for (let iv = 0; iv <= NV; iv++) {
      const v = iv / NV;
      const e = (v - 0.5) * 2; // -1 at one edge, +1 at the other
      let x = (v - 0.5) * width + asym * u * u;
      let y = u * L;
      y -= 0.09 * e * e * smoothstep(0.75, 1, u);                // arc the tip
      y -= droop * Math.pow(u, 2.5);                             // gravity
      let z = 0;
      z += cup * e * e * (0.1 + 0.34 * u);                       // soft cupping
      z += curl * Math.pow(u, 2.1);                              // tip curls back / in
      z += bend * Math.sin(u * Math.PI);                         // uneven spine
      z += ruffle * Math.sin(v * Math.PI * 3 + p3) * u * u * 0.05 * mess; // wavering edge
      z += 0.02 * Math.sin(u * 9 + p2) * Math.sin(v * 7 + p1) * mess;    // gentle ripple
      /* slow twist along the length */
      const tw = twist * u;
      const xt = x * Math.cos(tw) - z * Math.sin(tw);
      const zt = x * Math.sin(tw) + z * Math.cos(tw);
      positions.push(xt, y, zt);
      /* soft depth: petals darken toward their base, like a photograph */
      const l = 0.8 + 0.28 * Math.pow(u, 0.8);
      colors.push(shade.r * l, shade.g * l, shade.b * l);
    }
  }
  for (let iu = 0; iu < NU; iu++) {
    for (let iv = 0; iv < NV; iv++) {
      const a = iu * (NV + 1) + iv;
      const b = a + NV + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function initRose() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const canvas = renderer.domElement;
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.filter = "blur(0.6px)"; // the softness of an old lens
  stage.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 1.05, 5.4);
  camera.lookAt(0, 0.12, 0);

  /* lighting pitched like an old studio photograph:
     broad diffuse fill, one gentle frontal key — low contrast,
     shadows that grey out instead of going black */
  scene.add(new THREE.AmbientLight(0x9a988c, 2.1));
  scene.add(new THREE.HemisphereLight(0xfffbe8, 0x55544a, 0.9));
  const key = new THREE.DirectionalLight(0xfff8e6, 1.15);
  key.position.set(2, 2.5, 3.2);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xd8d8cc, 0.45);
  rim.position.set(-3, 1.2, -2.5);
  scene.add(rim);

  const pivot = new THREE.Group();  // pointer lean
  const rose = new THREE.Group();   // turntable spin
  pivot.add(rose);
  pivot.rotation.x = 0.22;          // tipped gently toward the viewer
  scene.add(pivot);

  /* petals in a phyllotaxis spiral, bud → open outer ring */
  const COUNT = 34;
  const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // ≈137.5°
  const dark = new THREE.Color(0x7e796b);
  const light = new THREE.Color(0xf1eee0);

  for (let i = 0; i < COUNT; i++) {
    const t = i / (COUNT - 1);
    const jit = () => (Math.random() - 0.5) * 0.08;
    const tilt = 0.14 + 1.18 * Math.pow(t, 0.7) + jit(); // lean out from the axis
    const scale = 0.48 + 0.6 * Math.pow(t, 0.75);
    const curl = -0.22 + 0.72 * Math.pow(t, 1.35) + jit(); // inner wraps in, outer rolls back
    const cup = 0.42 - 0.22 * t;
    const shade = dark.clone().lerp(light, 0.4 + 0.6 * Math.pow(t, 0.8));

    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: 0.78,
      metalness: 0,
      side: THREE.DoubleSide,
    });

    const mess = 0.25 + 0.75 * t; // the bud is neat; the open petals loosen
    const petal = new THREE.Mesh(petalGeometry(curl, cup, 0.4 + t, shade, mess), mat);
    petal.rotation.x = tilt;
    petal.rotation.y = (Math.random() - 0.5) * 0.16 * mess;
    petal.scale.setScalar(scale * 1.35 * (0.95 + Math.random() * 0.1));
    /* petals attach around a small receptacle, outer rings lower */
    petal.position.y = 0.12 - 0.4 * t;
    petal.position.z = 0.04 + 0.18 * t;

    const holder = new THREE.Group();
    holder.rotation.y = i * GOLDEN + (Math.random() - 0.5) * 0.2;
    holder.add(petal);
    rose.add(holder);
  }

  /* the shadowed heart of the rose */
  const bud = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 20, 16),
    new THREE.MeshStandardMaterial({ color: 0x6b675c, roughness: 0.85 })
  );
  bud.scale.y = 1.25;
  bud.position.y = 0.3;
  rose.add(bud);

  rose.position.y = -0.16; // centre the head in frame

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  /* pointer lean, same feel as the rest of the site */
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", (e) => {
      targetY = (e.clientX / window.innerWidth - 0.5) * 0.5;
      targetX = -(e.clientY / window.innerHeight - 0.5) * 0.35;
    });
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    renderer.render(scene, camera);
    return;
  }

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime();
    rose.rotation.y = t * 0.22;                       // the slow turn
    pivot.position.y = Math.sin(t * 0.5) * 0.045;     // a gentle breath
    curX += (targetX - curX) * 0.04;
    curY += (targetY - curY) * 0.04;
    pivot.rotation.x = 0.22 + curX + Math.cos(t * 0.32) * 0.04;
    pivot.rotation.z = curY * 0.4;
    renderer.render(scene, camera);
  });
}
