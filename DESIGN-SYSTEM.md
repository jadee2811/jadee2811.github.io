# Jade Share design system

Source of truth: `style.css` (tokens in `:root`), pages built by `tools/build-routes.py` from `tools/shell.html` and `pages/*.html`. This file says what exists and how to use it. When you need something new, add a token or component here first.

## 1. Principles
1. Calm and literate: warm paper background, deep jade ink, one warm accent. Large serif-italic emphasis words inside sans headlines.
2. Square-ish, never pill: controls use a 6px corner, media uses 8px.
3. Illustration language is the forest (mountains, conifers, round trees, flowers, star). Use it for empty, error and intro moments, not for data.
4. Two languages are equal citizens: every page exists at `/` (EN) and `/vi/` (VI), every string has both versions.
5. Motion is gentle (sway, blink, drift), always off under `prefers-reduced-motion`.

## 2. Tokens
Colour
| Token | Value | Use |
|---|---|---|
| `--paper` | #f6f4ed | page background, text on jade |
| `--ink` | #142824 | body text, headlines |
| `--muted` | #5c6d67 | secondary text |
| `--jade` | #116b54 | brand, primary buttons, links, emphasis words |
| `--wash` | #e3eee7 | tinted panels, hover |
| `--line` | #ccd8d1 | hairlines, input borders |
| `--terra` | #b55239 | accent: kickers, active nav underline, logo star, butterfly |
| `--terra-wash` | #f0ddd5 | soft accent panels |
Star yellow `#f2c46d` is only for the star motif (favicon, illustration, back-to-top focus). Night palette (#050f1c to #14473c, trees #0c3028 to #061c17) is only for the intro.

Type
- Headlines: Arial/Helvetica, weight 400, tight tracking (`-.055em`), size by `clamp()`; emphasis word in Georgia italic, colour `--jade`.
- Body: Arial 15px/1.65. Lead text: 17-24px by `clamp()`.
- Quote, standfirst: Georgia (italic for quotes).
- Labels and kickers: uppercase, `--fs-label` 11.5px, letter-spacing 1.4px. `--fs-small` 13px for captions. Nothing below 11px.

Shape and depth
- `--r-control` 6px: buttons, inputs, language switch, filter chips, back-to-top, chat widget buttons.
- `--r-media` 8px: cards, images, mockups, hero illustration.
- Shadow for lifted media: `0 24px 55px #17382c24`. Floating control: `0 6px 18px rgba(20,40,36,.14)`. No other shadows.
- Layout width: `min(1180px, 100% - 48px)` (32px gutters under 760px). Section rhythm `--space-section`.

## 3. Components and rules
Header: logo (SVG wordmark with star), nav (About, Work, Blog, Contact), language switch. Current page link gets the terra underline. Under 760px nav collapses into the Menu button.
Language switch (`a.lang`): two segments EN | VI, the current language is filled jade with paper text, the other is muted. It is a real link to the same page in the other language. Never a toggle that rewrites text in place.
Button `.button`: filled jade, paper text, 6px corner, trailing arrow `↗`. One primary button per view. Secondary: text link `.more` with underline in terra.
Kicker + Heading + Lead: kicker (uppercase label), h1/h2 with one italic jade emphasis phrase, lead paragraph max 520px wide.
Hero (`.hero2`): copy column left (kicker, h1, lead, button stacked), illustration `.hero-art` right, one column under 900px.
Strip `.strip`: four uppercase capabilities separated by terra dots, used once under the hero.
Cards `.card`, `.spot`: cover image (8px), small uppercase category, serif or sans title, one-line summary. The whole card is the link.
Writing list `.writing`: row of date/category, title, arrow.
Case study / article templates (`.sc-*`, `.casehero`, `.article-*`): hero with label, h1, meta; body with sticky side index; images 8px with caption; end with a back link.
Form: label above field, 6px inputs with `--line` border, jade primary submit. Placeholder text is a real example, not an instruction.
Footer: brand + one-line role, EXPLORE, CONNECT, CONTACT columns, copyright and tagline row on jade background.
Back-to-top `.to-top`: 44px square, 6px, appears after 500px of scroll, sits above the chat launcher.
404: forest illustration, card with label, h1 with emphasis, two actions (home, work). Translated by URL language.
Intro: night forest, falling blinking star, star-shaped zoom into home. Once per session, home pages only, skippable by click, skipped under reduced motion.
Chat widget (Jason): jade accent, 6px buttons, avatar is the Jade wordmark tile (`assets/chat-logo.png`), greeting and suggestions per language (`/vi*` pages Vietnamese). Corner overrides live at the end of `spa.js`.

## 4. Writing rules
- Sentence case for headings, uppercase only for labels.
- Emphasis: at most one italic jade phrase per headline.
- VI copy is written for a Vietnamese reader, not translated word by word; keep product names in English.
- Alt text describes the content in the page language.

## 5. Language and SEO rules
- URLs: EN at `/path/`, VI at `/vi/path/`. Each page has its own title, description, canonical, `hreflang` en, vi and x-default, `og:locale`.
- After editing `pages/*.html`, `data/*.json` or `tools/shell.html` run `python3 tools/build-routes.py` then `python3 tools/prerender.py`, then commit generated files.
- Bump the `?v=` on `style.css` and `spa.js` in `tools/shell.html` when you change them.
- Share cards: every page has `og:image` 1200x630 under `assets/og/`.

## 6. Checklist before shipping a change
1. Uses only tokens above (no new colour, radius, shadow).
2. Works at 1280, 900 and 390px.
3. EN and VI both exist and are not mixed.
4. Animation respects `prefers-reduced-motion`.
5. Chat widget does not cover the main action; back-to-top and launcher do not overlap.
