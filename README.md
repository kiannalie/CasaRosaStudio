# Casa Rosa Studio

A simple, gallery-style artist website. Plain HTML and CSS: no build step.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home (Works): two large boxes, **Older Works** and **Current Collection** |
| `older-works.html` | Two-column gallery of older works, with a caption under each photo |
| `current-collection.html` | Two-column gallery of the current collection |
| `about.html` | Portrait on the left, bio on the right |
| `contact.html` | Contact form: first name, last name, email, message |
| `css/colors.css` | **The brand colours** (burgundy, blush, olive). Change a colour here and it updates everywhere |
| `css/style.css` | All styling. Fonts, which colour goes where, and the background image are set at the top |
| `assets/logo/` | The CR monogram in olive, burgundy and blush, plus the favicon |
| `js/contact.js` | Makes the contact form send |

Look for `✏️` comments in the files: they mark everything you need to change.

## Adding your brand

1. **Colours**: the brand colours are in `css/colors.css`. To change *where* a
   colour is used (background, text, lines), edit the `--color-…` values at the
   top of `css/style.css`.
2. **Font (Perida Display)**: the site is already set to use it. Put the font
   files in `assets/fonts/` named `PeridaDisplay-Regular.woff2` (or `.otf`) and
   `PeridaDisplay-SemiBold.woff2` (or `.otf`), or change the file names at the
   top of `css/style.css` to match yours.
3. **Paper texture background**: `assets/images/paper-texture.jpg`. Replace
   that file to change it. It's used on every page and stretches to fill the screen.
4. **Logo**: the header uses `assets/logo/cr-monogram-olive.png`. To switch
   colour, change `olive` to `burgundy` or `blush` in each page's header.
5. **Favicon**: `assets/logo/favicon.png` (the burgundy monogram).

## Adding your photos

The grey boxes in `assets/images/` are placeholders. Replace them with your
photos (JPG or PNG) and update the `src="…"` paths in the HTML:

- Home boxes: `older-works-cover` and `current-collection-cover` in `index.html`.
  Portrait photos look best (about 3:4).
- Galleries: each photo is a `<figure>` block in `older-works.html` and
  `current-collection.html`. Copy a block to add a photo; delete one to remove it.
  Change `Title, Year` to your caption.
- About: `about-portrait` in `about.html`.

## Contact form

Out of the box, **Send** opens the visitor's email app addressed to the
`data-email` address in `contact.html`. Change it to your email.

To receive messages directly instead, create a free form at
[formspree.io](https://formspree.io), then put its URL in the form's
`action="…"` in `contact.html`.

## Instagram

Change the `href` on the Instagram icon in each page's header.

## Running it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Hosting

Any static host works: GitHub Pages, Netlify or Vercel.
