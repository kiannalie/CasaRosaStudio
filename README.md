# Casa Rosa Studio 🌸

A hand-drawn, paper-textured website for the Casa Rosa art studio — a world
where a home can feel, and hold the elements of nature.

## What's here

| File | What it is |
| --- | --- |
| `index.html` | Homepage — 3-D bloom hero, the vision, the 1×3 collection row, the artist |
| `piece.html` | The product page for a single painting (opens via `piece.html#piece-id`) |
| `js/pieces-data.js` | **⭐ Edit this one!** All painting titles, stories, prices, sizes, Etsy links, plus your Instagram/email |
| `css/style.css` | All the styling — paper texture, ink type, hand-drawn buttons |
| `js/main.js` | The 3-D flower, drifting petals, scroll reveals, page rendering |
| `assets/paintings/` | Painting images — currently placeholder illustrations |

## How to update it (no coding needed)

1. **Your copy & paintings** → open `js/pieces-data.js`. Every title, story,
   price, and link is there with comments. There are also `✏️ EDIT ME`
   comments in `index.html` marking the vision & artist-statement text.
2. **Real painting photos** → drop your photos into `assets/paintings/`
   (JPG or PNG), then change each piece's `image:` path in
   `js/pieces-data.js`. Photos look best in portrait, roughly 4:5.
3. **Etsy links** → in `js/pieces-data.js`, set `etsy:` on each piece to its
   listing URL, and `etsyShop` at the bottom to your shop URL.

## Running it locally

It's a plain static site — no build step. Either double-click `index.html`,
or from this folder run:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Hosting

Any static host works: GitHub Pages (Settings → Pages → deploy from branch),
Netlify, or Vercel. Later, Etsy links can be swapped for real checkout
(Stripe/Shopify Lite) without changing the design.
