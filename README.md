# Casa Rosa Studio

A simple, gallery-style artist website. Plain HTML and CSS: no build step.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home (Works): two large boxes, **Older Works** and **Current Collection** |
| `older-works.html` | Two-column gallery of older works, with a caption under each photo |
| `current-collection.html` | Two-column gallery of the current collection |
| `about.html` | Portrait on the left, bio on the right |
| `contact.html` | Contact form: first name, last name, email, message. Sends to thecasarosastudio@gmail.com |
| `thank-you.html` | The page visitors see after sending a message |
| `css/colors.css` | **The brand colours** (burgundy, blush, olive). Change a colour here and it updates everywhere |
| `css/style.css` | All styling. Fonts, which colour goes where, and the background image are set at the top |
| `assets/logo/` | The CR monogram in olive, burgundy and blush, plus the favicon |
| `js/contact.js` | Points the form at the thank-you page |

Look for `✏️` comments in the files: they mark everything you need to change.

## Adding your brand

1. **Colours**: the brand colours are in `css/colors.css`. To change *where* a
   colour is used (background, text, lines), edit the `--color-…` values at the
   top of `css/style.css`.
2. **Font (Peridia Display)**: `assets/fonts/PeridiaDisplay-Regular.woff2`.
   This is currently the **trial** version, which is missing some characters
   (© : ; quotes, dashes, /). Trial fonts are usually not licensed for a live
   site, so check En Travaux's licence before launch. When you buy
   the full font, convert it to WOFF2 and replace that file, keeping the name.
3. **Paper texture background**: `assets/images/paper-texture.jpg`. Replace
   that file to change it. It's used on every page and stretches to fill the screen.
   On screens wider than 1000px the site uses a plain soft white instead
   (`--soft-white` in `css/colors.css`).
4. **Logo**: the header uses `assets/logo/cr-monogram-olive.png`. To switch
   colour, change `olive` to `burgundy` or `blush` in each page's header.
5. **Favicon**: `assets/logo/favicon.png` (the burgundy monogram).

## Adding your photos

The grey boxes in `assets/images/` are placeholders. Replace them with your
photos (JPG or PNG) and update the `src="…"` paths in the HTML:

- Home boxes: the two `<img>` tags in `index.html` (Older Works uses
  `older-works/red-bedroom.jpg`; Current Collection plays
  `assets/video/current-collection.mp4`, a silent loop).
  Portrait photos look best (about 3:4).
- Galleries: each photo is a `<figure>` block in `older-works.html` and
  `current-collection.html`. Copy a block to add a photo; delete one to remove it.
  Change `Title, Year` to your caption.
- About: `about-portrait` in `about.html`.

## Contact form

Messages from the Contact page are emailed to **thecasarosastudio@gmail.com**
by [FormSubmit](https://formsubmit.co), a free service with no account needed.

- **Spam protection:** visitors tick a Google reCAPTCHA "I'm not a robot" box
  before the message sends, and a hidden spam-trap field blocks bots.
- **Reply:** each email's reply-to is the visitor's address, so you can just
  hit Reply in Gmail.

**One-time activation (required):** after the site is live, send yourself a
test message from the Contact page. FormSubmit emails
thecasarosastudio@gmail.com an activation link — click it, and from then on
every message comes straight through. Check spam if you don't see it.

**Optional, hides your email from spammers:** the activation email also gives
you a random code. Replace `thecasarosastudio@gmail.com` in the form's
`action="…"` in `contact.html` with that code.

To change the email address, edit the form's `action="…"` in `contact.html`.

## Instagram and TikTok

Change the `href` on the Instagram and TikTok icons in each page's header.

## Running it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Hosting

Any static host works: GitHub Pages, Netlify or Vercel.
