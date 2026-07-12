/* ============================================================
   CASA ROSA · STUDIO — interactions
   ============================================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------
   1. THE BLOOM — CSS fallback rose, used only when WebGL is
   unavailable (js/rose3d.js renders the real turning rose).
   ------------------------------------------------------------ */
function buildFlower() {
  const flower = document.getElementById("flower");
  if (!flower) return;

  /* a rose seen almost from the front: wide open outer petals,
     each ring smaller, darker and more curled toward the heart */
  const layers = [
    { count: 9, length: 52, width: 26, tilt: 8, z: -22 },
    { count: 8, length: 43, width: 23, tilt: 0, z: -10 },
    { count: 6, length: 33, width: 19, tilt: -12, z: 2 },
    { count: 5, length: 24, width: 15, tilt: -26, z: 12 },
    { count: 3, length: 15, width: 11, tilt: -44, z: 20 },
  ];

  layers.forEach((layer, li) => {
    for (let i = 0; i < layer.count; i++) {
      const petal = document.createElement("div");
      petal.className = "petal";
      const jitter = (Math.random() - 0.5) * 9;
      const angle = (360 / layer.count) * i + li * 26 + jitter;
      petal.style.width = layer.width + "%";
      petal.style.height = layer.length + "%";
      petal.style.marginLeft = -(layer.width / 2) + "%";
      petal.style.marginTop = -layer.length + "%";
      petal.style.transform =
        "rotateZ(" + angle + "deg) rotateX(" + layer.tilt + "deg) translateZ(" + layer.z + "px)";
      petal.style.animationDelay = (i * 0.35 + li * 0.6) + "s";
      /* the heart of the rose falls into shadow */
      petal.style.filter = "brightness(" + (1.04 - li * 0.055 + Math.random() * 0.05) + ")";
      flower.appendChild(petal);
    }
  });

  const core = document.createElement("div");
  core.className = "flower-core";
  core.style.transform = "translate(-50%, -50%) translateZ(30px)";
  flower.appendChild(core);

  /* gentle life: idle sway + cursor lean */
  let targetX = 0, targetY = 0, curX = 0, curY = 0;

  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", (e) => {
      targetY = (e.clientX / window.innerWidth - 0.5) * 26;
      targetX = -(e.clientY / window.innerHeight - 0.5) * 20;
    });
  }

  if (prefersReducedMotion) {
    flower.style.transform = "rotateX(-14deg)";
    return;
  }

  function tick(t) {
    const s = t / 1000;
    const idleY = Math.sin(s * 0.45) * 12;
    const idleX = -13 + Math.cos(s * 0.32) * 7;
    const spin = s * 1.1; // slow, dreamy rotation
    curX += (targetX + idleX - curX) * 0.04;
    curY += (targetY + idleY - curY) * 0.04;
    flower.style.transform =
      "rotateX(" + curX + "deg) rotateY(" + curY + "deg) rotateZ(" + spin + "deg)";
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ------------------------------------------------------------
   2. Petals drifting through the hero air
   ------------------------------------------------------------ */
function scatterPetals() {
  const hero = document.querySelector(".hero");
  if (!hero || prefersReducedMotion) return;
  for (let i = 0; i < 9; i++) {
    const p = document.createElement("div");
    p.className = "drift";
    p.style.left = 8 + Math.random() * 84 + "%";
    p.style.top = "-4%";
    const scale = 0.6 + Math.random() * 0.9;
    p.style.width = 16 * scale + "px";
    p.style.height = 22 * scale + "px";
    p.style.animationDuration = 11 + Math.random() * 10 + "s";
    p.style.animationDelay = Math.random() * 14 + "s";
    hero.appendChild(p);
  }
}

/* ------------------------------------------------------------
   3. Ink-soak scroll reveals
   ------------------------------------------------------------ */
function watchReveals() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  els.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------
   4. Collection cards (homepage + "more pieces" strip)
   ------------------------------------------------------------ */
function cardHTML(piece) {
  return (
    '<a class="piece-card reveal" href="piece.html#' + piece.id + '">' +
    '<div class="frame"><img src="' + piece.image + '" alt="' + piece.title + ' — original painting by Casa Rosa Studio" loading="lazy"></div>' +
    '<div class="card-meta">' +
    '<div class="card-title">' + piece.title + "</div>" +
    '<div class="card-script">' + piece.script + "</div>" +
    '<span class="card-cta">view the piece —</span>' +
    "</div></a>"
  );
}

function renderGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;
  gallery.innerHTML = CASA_ROSA_PIECES.map(cardHTML).join("");
}

/* ------------------------------------------------------------
   5. Piece page (piece.html#some-id)
   ------------------------------------------------------------ */
function renderPiece() {
  const root = document.getElementById("piece-root");
  if (!root) return;

  const id = decodeURIComponent(location.hash.replace("#", ""));
  const piece =
    CASA_ROSA_PIECES.find((p) => p.id === id) || CASA_ROSA_PIECES[0];

  document.title = piece.title + " · Casa Rosa Studio";

  const details = piece.details
    .map(
      (d) =>
        "<li><span>" + d[0] + "</span><span>" + d[1] + "</span></li>"
    )
    .join("");

  root.innerHTML =
    '<div class="piece-visual reveal is-visible">' +
    '<div class="frame"><img src="' + piece.image + '" alt="' + piece.title + ' — original painting by Casa Rosa Studio"></div>' +
    '<p class="caption">' + piece.title + " · " + piece.year + "</p>" +
    "</div>" +
    '<div class="piece-info">' +
    '<p class="breadcrumb"><a href="index.html#collection">the collection</a> &nbsp;/&nbsp; ' + piece.title + "</p>" +
    "<h1>" + piece.title + "</h1>" +
    '<span class="piece-script">' + piece.script + "</span>" +
    '<p class="piece-price">' + piece.price + "</p>" +
    '<p class="piece-meta-line">' + piece.medium + " · " + piece.size + " · " + piece.year + "</p>" +
    '<p class="piece-intro">' + piece.intro + "</p>" +
    '<p class="piece-story">' + piece.story + "</p>" +
    '<ul class="detail-list">' + details + "</ul>" +
    '<div class="piece-actions">' +
    '<a class="btn-drawn btn-rose" href="' + piece.etsy + '" target="_blank" rel="noopener">Acquire on Etsy</a>' +
    '<a class="ask-link" href="mailto:' + CASA_ROSA_LINKS.email + "?subject=About " + encodeURIComponent(piece.title) + '">ask about this piece</a>' +
    "</div></div>";

  const more = document.getElementById("more-gallery");
  if (more) {
    more.innerHTML = CASA_ROSA_PIECES.filter((p) => p.id !== piece.id)
      .map(cardHTML)
      .join("");
    more.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  window.scrollTo(0, 0);
}

/* re-render when navigating between pieces on the same page */
window.addEventListener("hashchange", renderPiece);

/* ------------------------------------------------------------
   6. Global links (Etsy / Instagram / email) from pieces-data.js
   ------------------------------------------------------------ */
function wireGlobalLinks() {
  document.querySelectorAll("[data-link-etsy]").forEach((a) => (a.href = CASA_ROSA_LINKS.etsyShop));
  document.querySelectorAll("[data-link-instagram]").forEach((a) => (a.href = CASA_ROSA_LINKS.instagram));
  document.querySelectorAll("[data-link-email]").forEach((a) => (a.href = "mailto:" + CASA_ROSA_LINKS.email));
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

/* ------------------------------------------------------------ */
window.buildCSSFlower = buildFlower; // kept for the retired rose hero
renderGallery();
renderPiece();
wireGlobalLinks();
watchReveals();
