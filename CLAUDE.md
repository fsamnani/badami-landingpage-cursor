# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static "coming soon" landing page for Badami, a South Asian skincare brand. No build step, no framework, no package manager — just `index.html`, `style.css`, and `mailchimp-form.js`. Open `index.html` directly in a browser or serve it with any static server.

```bash
# Quick local server (Python)
python3 -m http.server 8080
# or
npx serve .
```

## Architecture

Three files do everything:

- **`index.html`** — single-page layout: fixed nav (social icons), full-bleed video hero with centered content card, email signup form, footer.
- **`style.css`** — all styles for the above. CSS custom properties for the brand palette are declared in `:root`. Responsive via `clamp()` and two breakpoints (768px mobile, 1024px desktop). Respects `prefers-reduced-motion` (hides video, disables animations).
- **`mailchimp-form.js`** — vanilla JS IIFE; intercepts form submit, validates email client-side, then fires a JSONP request to Mailchimp's `post-json` endpoint. On success it replaces the form DOM with a success state. No external dependencies.

## Assets

- `assets/background-video.mp4` — optimized video used in production (committed).
- `assets/background-video-4k-source.mp4` — source file, gitignored (too large).
- `assets/logo.png` — brand logo.
- `assets/IvyPrestoDisplay-SemiBold.otf` — local font file, gitignored. The font is loaded via the hosted Typenetwork CDN (`fastly-cloud.typenetwork.com`) instead.

## Brand design tokens

All colors and fonts live in `:root` in `style.css`:

| Variable | Value | Use |
|---|---|---|
| `--cream-warm` | `#f6f3ec` | page & card background |
| `--dark-truffle` | `#5A4B47` | primary text, button bg |
| `--brown` | `#776D69` | secondary text |
| `--rose` / `--rose-muted` | `#D99A9F` / `#C48C90` | accents, focus rings |
| `--font-display` | IvyPresto Disp → Cormorant Garamond → Georgia | headings |
| `--font-body` | Inter → system-ui | body / UI |

## Typography & Font Licensing

Badami uses Ivy Presto Display SemiBold as its primary display font.

**IMPORTANT:** Do not serve local font files directly from the repository.

The original font file (`IvyPrestoDisplay-SemiBold.otf`) is intentionally NOT committed to GitHub and should not be deployed to Vercel.

**Reason:**
- Production font loading uses the licensed Type Network hosted webfont service.
- The local OTF exists only for local design/reference purposes.
- Earlier deployments failed because production could not access the local OTF file.
- The issue was resolved by using the Type Network hosted resource code.

**Current implementation:**
- Font is loaded through the Type Network hosted stylesheet (`//fastly-cloud.typenetwork.com/projects/9176/fontface.css?6a2603cf` in `index.html`).
- CSS references the hosted font family name via `--font-display`.
- Production should not depend on local font assets.

**Before making typography changes:**
1. Verify the hosted Type Network resource remains present in `index.html`.
2. Verify display fonts render correctly on both Vercel and production domains.
3. Do not replace the hosted implementation with local font files without confirming licensing implications.

**License notes:**
- Webfont usage is licensed through Type Network.
- Current project license covers up to 10,000 page views/month.
- If traffic materially exceeds that threshold, review the license and upgrade if necessary.

## Mailchimp integration

Credentials are hardcoded in `mailchimp-form.js` (lines 12–17) — `MC_U`, `MC_ID`, `MC_F_ID`, `MC_HONEYPOT`. These are Mailchimp audience/form IDs (not API secrets) and are intentionally public. The form in `index.html` has a matching `action` URL and hidden inputs — keep both in sync if credentials change.

`MC_DEV_BYPASS_DUPLICATE_CHECK` (line 19) can be flipped to `true` during local testing so "already subscribed" responses render as success.
