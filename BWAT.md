# BWAT.md

This file provides guidance to Bwat when working with code in this repository.

## Tech Stack
- Pure static HTML/CSS/JS — no framework, no build step, no package manager
- Deployed as flat files (likely GitHub Pages or similar static host)
- EmailJS for contact form and newsletter delivery
- Google Fonts: Inter, Space Grotesk, Orbitron, IBM Plex Mono, Exo 2
- Font Awesome 6 for icons (CDN)

## Brand Identity
**Colors** (canonical tokens from `assets/css/main.css`):
- Background: `#000000` (`--bg`)
- Surface: `#0f0f0f` (`--surface`), `#161616` (`--surface-soft`)
- Text: `#f5f5f5` (`--text`), muted `#c9c9c9` (`--text-muted`)
- Accent: `#ffd700` (gold yellow, `--accent`), `#f0c400` (`--accent-soft`)
- Border: `#2a2a2a` (`--border`)
- Radius: `14px` (`--radius`)
- Container max-width: `1120px` (`--container`)

**Note**: `tokens.css` defines an overlapping token system (`--color-yellow: #f5c518`, `--color-bg: #0d0d0d`, etc.) but `assets/css/main.css` tokens are the canonical ones driving current pages. Both files are loaded. Keep `main.css` tokens as the source of truth for new work; do not add new variables to both systems.

**Typography**:
- Body: `'Inter', sans-serif`
- Headings: `'Inter', sans-serif` (main.css doesn't use Orbitron/Space Grotesk for headings on current pages)
- Accent/mono text: `'IBM Plex Mono', monospace` (from tokens.css, used for tags, nav, stats labels)

**Visual language**: Dark, minimal, high-contrast — black background, gold accent, generous whitespace, subtle yellow grid-line texture on body, cards with yellow-top-bar reveal on hover.

## Coding Conventions
- Pages in subdirectories (e.g. `about/index.html`) MUST set `data-root="../"` on `<body>` so `assets/js/layout.js` resolves nav/footer links correctly. Top-level pages use `data-root=""`.
- Every page MUST include `<div id="site-nav"></div>` before main content and `<div id="site-footer"></div>` after it. These are injected by `assets/js/layout.js`.
- CSS load order: `tokens.css` first, then `assets/css/main.css`, then any page-specific CSS (e.g. `blog.css`). This lets `main.css` override tokens.css where needed.
- JS load order: `assets/js/layout.js` first (blocks on nav/footer injection), then `assets/js/main.js`, then page-specific JS. Scripts go at the end of `<body>`.
- Use semantic HTML5 elements (`<section>`, `<article>`, `<nav>`, `<footer>`) and the `.container` / `.section` / `.card` / `.grid` utility patterns from `tokens.css` + `main.css`.
- Form submissions go through EmailJS. Initialize with `emailjs.init({ publicKey })` then use `emailjs.send(serviceId, templateId, formData)`.
- Scroll-reveal animations: add class `reveal` to elements for fade-up-on-scroll (defined in tokens.css). Stagger with `delay-1`, `delay-2`, `delay-3` classes.

## Architecture Notes
- **Navigation/footer are dynamic**: `assets/js/layout.js` reads `document.body.dataset.root` and injects shared nav and footer HTML into `#site-nav` and `#site-footer` divs. Updating nav links means editing `layout.js` — there is no templating system.
- **CSS is split across three files**: `style.css` (legacy, cyan-themed, appears unused by current pages), `tokens.css` (shared design tokens + nav/footer/hero/section/card/button patterns), and `assets/css/main.css` (canonical styles for current pages, redefines nav/footer with different variables). `style.css` should be treated as dead code unless proven otherwise.
- **Blog** (`blog.html` + `blog.js`) has its own post store, category filtering, search, and newsletter signup via EmailJS. Posts are stored as JS objects in `blog.js`, not fetched from a CMS or API.
- **Project detail pages** live under `projects/<slug>/index.html`. Each is a standalone page with its own content. The `projects/index.html` page lists them all.
- **Environment config** (`emailjs-config.js`) contains live EmailJS keys — do not add more secrets here. The `.env` file (gitignored) is loaded by `env-loader.js` in dev mode only.

## Commands
- No build step. Open any `.html` file in a browser or serve the root directory with any static server.
- To test locally: `npx serve .` or `python -m http.server 8000` from the project root.
- Pages in subdirectories load assets via relative paths (`../assets/...`). A static server that serves from project root is required for these to resolve correctly.

## Gotchas
- `emailjs-config.js` contains live API keys and IS committed to git. If you rotate credentials, update this file. The `.env` → `env-loader.js` path is dev-only; production always falls back to `emailjs-config.js`.
- `style.css` defines a completely different cyan-themed design system (`--accent-color: #00d4ff`, `--font-heading: 'Space Grotesk'`) that conflicts visually. It appears to be legacy — do not add new styles to it.
- The `tokens.css` and `main.css` nav/footer styles overlap. `main.css` nav styles win (it loads second) and are the canonical look. When fixing nav CSS, edit `main.css`, not `tokens.css`.
- Pages in subdirectories need `data-root="../"` (one level) or `data-root="../../"` (two levels). Getting this wrong breaks all nav links, logo link, and footer links. Always check the `data-root` value when creating a new page in a subdirectory.
- `index.html` in root uses `assets/css/main.css` via `<link>` but also has inline styles and `style.css` loaded via older pages. The `about.html` in root (not `about/index.html`) is a duplicate — prefer editing `about/index.html` which uses the shared layout system.
- Some project card links in `index.html` point to the wrong project subdirectory (e.g. "Walter Bishop Labs" links to `projects/titanic-survival/`). Verify project links when adding new projects.
