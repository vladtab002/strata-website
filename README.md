# STRATA website

A static one-page site: plain HTML, CSS and a little JavaScript. No build step, no frameworks. Any static host can serve this folder as it is.

```
index.html        the one-page site (desktop and phone layouts in one page)
privacy.html      privacy policy
404.html          "page not found" page
css/style.css     all styles (colours and fonts at the top, in :root)
js/main.js        mobile menu, work filters, services accordion, contact form
img/work/         portfolio images (WebP)
img/brand/        logo, icon, social-share image
fonts/            self-hosted Archivo, Teko and Inter (SIL Open Font License, licences included)
favicon.svg, favicon-32.png, apple-touch-icon.png
robots.txt, sitemap.xml
```

## Before launch: fill in the placeholders

Search the project for `[` and `YOUR-` to find them all.

| Where | What to replace |
| --- | --- |
| `index.html` Contact section | `[hello@yourdomain.com]` (the link text and the `mailto:`) |
| `privacy.html` | F40 number, CUI, registered address, privacy email, providers, publication date |

## Contact form

The form posts to [Formspree](https://formspree.io), which emails each message to you. There's no server to run.

1. Create a free Formspree account and a new form; set it to deliver to your STRATA email.
2. Copy the form ID (the part after `/f/` in its endpoint).
3. The form ID goes in the form's `action` in `index.html` (currently `mnppkpod`).

The hidden `_gotcha` field is Formspree's spam trap; leave it in.

Using another form service (Netlify Forms, Basin, Web3Forms) works too: point the `action` at its endpoint.

## Publishing

**Quickest (no account setup beyond a free login):** go to Netlify Drop (app.netlify.com/drop) and drag this whole folder onto the page. You get a live link in seconds; then connect your domain in the site's Domain settings.

**Recommended for ongoing changes:** put this folder in a GitHub repository and connect it to Netlify, Cloudflare Pages or Vercel. Every change pushed to the repository goes live automatically within a minute or two, and every version is kept.

## Editing tips

- After changing `css/style.css` or `js/main.js`, bump the `?v=` number where they're linked in `index.html` (and the CSS link in `privacy.html`) so browsers load the new version instead of a cached one.

- Colours and fonts: the variables at the top of `css/style.css`.
- Add a portfolio piece: export a WebP about 900 px wide into `img/work/`, then copy one `<figure class="work-item">` block in `index.html` and change the image, `width`/`height`, `alt` text, caption and `data-cat` (`ads`, `social` or `print`). The filter counts update themselves.
- The first 12 pieces show on desktop (8 on phones) before the "Show all" button.
