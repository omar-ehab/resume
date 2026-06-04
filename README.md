# Omar Ehab — Portfolio

Personal portfolio of **Omar Ehab**, Senior Software Engineer.

Built with **pure HTML5, CSS3 and vanilla JavaScript** — zero frameworks,
zero build step, zero third-party runtime requests. Engineered for top-tier
**SEO**, **performance** and **accessibility**.

## Highlights

- **No dependencies.** Swiper, Noty and the Unicons icon-font CDN were removed.
  Carousels, toasts and theming are hand-rolled; icons are an inline SVG sprite.
- **Performance.** Critical CSS is inlined (no render-blocking stylesheet), fonts
  are self-hosted and preloaded, JS is deferred, images are compressed,
  responsive and lazy-loaded with intrinsic sizing to avoid layout shift.
- **SEO.** Semantic HTML5, a single `<h1>`, descriptive `alt` text, canonical URL,
  full Open Graph + Twitter cards, a generated 1200×630 share image,
  JSON-LD (`Person` + `WebSite` + `ProfilePage`), `sitemap.xml` and a `robots.txt`
  that explicitly welcomes search **and AI/LLM crawlers** (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, Applebot, etc.).
- **UX.** Dark/light theme with system detection and persistence (no flash),
  scroll-spy nav, reveal-on-scroll, animated counters, sticky blurred header,
  back-to-top — all respecting `prefers-reduced-motion`. Mobile-first responsive.
- **PWA-ready.** Web manifest + maskable icons.

## Structure

```
index.html                 # the whole page (markup + inlined critical CSS + JSON-LD)
manifest.webmanifest
robots.txt  sitemap.xml
assets/
  js/main.js               # all interactivity (vanilla, no deps)
  fonts/                    # self-hosted Poppins (woff2/woff)
  img/                      # photos, optimized project shots, icons, og-image
  pdf/omar-ehab-cv.pdf      # downloadable CV
```

> The legacy `assets/css/{swiper-bundle,noty,styles}.min?.css` and
> `assets/js/{swiper-bundle,noty}.min.js` files are no longer referenced and can
> be safely deleted.

## Run locally

```bash
python -m http.server 5500
# then open http://localhost:5500
```

(Any static server works. A server is needed so the self-hosted fonts and the
web manifest resolve correctly.)

## Things to verify / personalize

- **Open-source links** in the Open Source section point to best-guess URLs —
  confirm `tafgeet-arabic` (npm), `laravel-aramex` and `nafezly/payments` resolve
  to the repos/packages you want.
- **Contact form** posts to the existing `formsubmit.io` endpoint and redirects to
  `https://omarehab.net/?thanks=true` (which shows a success toast). Confirm the
  endpoint is still active.
- Update the canonical domain (`https://omarehab.net/`) in `index.html`,
  `sitemap.xml` and `robots.txt` if it ever changes.
