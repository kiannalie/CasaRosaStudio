/* ============================================================
   CASA ROSA — COLLECTION DATA
   Edit everything about your paintings here: titles, stories,
   prices, sizes, and the Etsy listing links.
   To use real photos, drop them in assets/paintings/ and point
   `image` at the file (jpg/png work great).
   ============================================================ */

const CASA_ROSA_PIECES = [
  {
    id: "jardin-de-la-manana",
    title: "Jardín de la Mañana",
    script: "the morning garden",
    year: "2026",
    medium: "Oil on canvas",
    size: '24" × 30"',
    price: "$480",
    etsy: "https://www.etsy.com/shop/CasaRosaStudio", // TODO: replace with the listing link
    image: "assets/paintings/jardin-de-la-manana.svg",
    intro:
      "Painted in the first quiet hour of the day, when the garden still belongs to itself.",
    story:
      "Jardín de la Mañana began as a study of the roses outside the studio window — the way morning light softens every edge until the flowers seem to breathe. It is a painting about slowness, and about letting a room hold the same stillness a garden does at dawn.",
    details: [
      ["Medium", "Oil on stretched canvas"],
      ["Dimensions", '24" × 30" (61 × 76 cm)'],
      ["Finish", "Satin varnish, ready to hang"],
      ["Edition", "Original — one of one"],
      ["Ships", "Carefully wrapped, from the studio"],
    ],
  },
  {
    id: "rosa-del-rio",
    title: "Rosa del Río",
    script: "the river rose",
    year: "2026",
    medium: "Acrylic & gouache on canvas",
    size: '18" × 24"',
    price: "$360",
    etsy: "https://www.etsy.com/shop/CasaRosaStudio", // TODO: replace with the listing link
    image: "assets/paintings/rosa-del-rio.svg",
    intro:
      "A single bloom carried on green water — movement and rest in the same frame.",
    story:
      "Rosa del Río is about the moment a flower lets go of its stem and trusts the current. The greens were mixed from memories of river water in late spring; the rose is every rose that has ever floated past and made someone stop walking.",
    details: [
      ["Medium", "Acrylic & gouache on canvas"],
      ["Dimensions", '18" × 24" (46 × 61 cm)'],
      ["Finish", "Matte varnish, ready to hang"],
      ["Edition", "Original — one of one"],
      ["Ships", "Carefully wrapped, from the studio"],
    ],
  },
  {
    id: "flor-y-sombra",
    title: "Flor y Sombra",
    script: "flower & shadow",
    year: "2025",
    medium: "Oil on linen",
    size: '20" × 26"',
    price: "$520",
    etsy: "https://www.etsy.com/shop/CasaRosaStudio", // TODO: replace with the listing link
    image: "assets/paintings/flor-y-sombra.svg",
    intro:
      "A cream bloom held by the dark — proof that softness reads loudest against shadow.",
    story:
      "Flor y Sombra was painted at night, by one warm lamp. It is the moodiest piece in the collection and the most tender: a reminder that a home needs its dim corners too, and that nature does its most honest growing in the dark.",
    details: [
      ["Medium", "Oil on linen"],
      ["Dimensions", '20" × 26" (51 × 66 cm)'],
      ["Finish", "Satin varnish, ready to hang"],
      ["Edition", "Original — one of one"],
      ["Ships", "Carefully wrapped, from the studio"],
    ],
  },
];

/* Global links — update these once and they change everywhere */
const CASA_ROSA_LINKS = {
  etsyShop: "https://www.etsy.com/shop/CasaRosaStudio", // TODO: your Etsy shop
  instagram: "https://www.instagram.com/casarosa.studio", // TODO: your Instagram
  email: "hola@casarosa.studio", // TODO: your studio email
};
