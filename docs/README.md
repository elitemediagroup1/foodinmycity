# FoodInMyCity

**Stop searching. Start craving.**

FoodInMyCity helps people decide where to eat tonight in seconds. Instead of a directory of hundreds of restaurants, you tell us what kind of night you are having and get **one confident local pick** plus **exactly what to order**. It is a food-first, cinematic experience built around real dishes and local stories.

This repository is the **production-ready static site starter** for the FoodInMyCity v6 concept. It is intentionally simple: plain HTML, CSS, and JavaScript with no build step, framework, or package manager.

---

## What's inside

The customer-facing experience is organized as a scrollable set of "acts":

- **Tonight's Pick** — one confident recommendation for your night.
- **The Daily Table** — twelve dishes that define what your city is eating today.
- **Cravings** — browse by how food makes you feel (cheesy, smoky, sweet...).
- **Live Local Feed** — what's open, selling out, and happening in the next hour.
- **Tastemakers** — trusted local food editors and their trails.
- **Your Taste** — a personal food profile, like a year in food.
- **Food Passport** — collect stamps for everything you've tasted.

---

## Run locally

No build step is required. Because the page loads `assets/css/styles.css` and `assets/js/app.js` with relative paths, just serve the folder with any static server:

```bash
# Python 3
python3 -m http.server 8000

# or Node (if you have it)
npx serve .
```

Then open http://localhost:8000/ in your browser.

Opening `index.html` directly via `file://` mostly works, but a local server is recommended so relative paths and fonts behave consistently.

## File structure

```
/foodinmycity/
  index.html                  # the full single-page experience
  /assets/
    /images/                  # photography (placeholders for now)
      logo-foodinmycity-dark.png
      hero-steak.jpg
      /daily-table/
      /cravings/
      /editors/
      /passport/
    /css/
      styles.css              # all styles (design direction preserved)
    /js/
      app.js                  # UI logic, tracking, integration placeholders
  /docs/
    README.md                 # this file
    TODO.md                   # production checklist
    INTEGRATIONS.md           # integration architecture
    PHOTO_LICENSES.md         # image source tracking
  robots.txt
  sitemap.xml
  indexnow.json
  b9f140612ecf495f85fc08b1452af5f0.txt   # IndexNow key file (site root)
```

---

## Integration placeholders

`assets/js/app.js` exposes safe placeholder functions that only log to the console today. They are wired so production teams can drop in real implementations later:

- `trackEvent(eventName, payload)` — GA4 analytics (live, see below).
- `sendLoopEvent(eventType, payload)` — EMG Loop webhook (placeholder).
- `fetchNearbyRestaurants(query, location)` — Google Places via backend proxy (placeholder).
- `getTonightRecommendation(context)` — the single confident pick (placeholder).
- `explainRecommendationWithClaude(context)` — friendly "why we picked this" via Anthropic proxy (placeholder).
- `fetchCreatorTrails(market)` — tastemaker data (placeholder).
- `getFoodDnaProfile()` / `saveFoodDnaProfile(profile)` — Food DNA storage (placeholder).
- `openDirections(destination)` — Google Maps / Directions (placeholder).
- `submitIndexNowUrl(url)` — IndexNow submission (placeholder; run from backend after deploy).

See `INTEGRATIONS.md` for the full planned architecture.

## Configuration

A small frontend config object lives at the top of `assets/js/app.js`:

```js
const FIMC_CONFIG = {
  market: "Long Beach Island",
  ga4MeasurementId: "G-TC8GHW3X6S",
  googlePlacesApiKey: "",
  anthropicProxyEndpoint: "",
  loopWebhookEndpoint: "",
  indexNowKey: "b9f140612ecf495f85fc08b1452af5f0",
  indexNowKeyLocation: "https://foodinmycity.com/b9f140612ecf495f85fc08b1452af5f0.txt",
  environment: "development"
};
```

**Never put private API keys in this file.** Only public identifiers (GA4 ID, IndexNow key location) belong here. Secrets must live behind serverless functions / backend endpoints.

### Current integration status

| Integration        | Status                                   |
|--------------------|------------------------------------------|
| GA4 / Analytics    | **Configured** — `G-TC8GHW3X6S` (gtag in `index.html`) |
| IndexNow           | **Partially configured** — key + key file + `indexnow.json` in place; submission runs from backend |
| Google Places      | Placeholder — needs serverless proxy     |
| Anthropic          | Placeholder — needs serverless proxy     |
| EMG Loop webhook   | Placeholder — needs endpoint             |

---

## Deployment notes

This is a static site and can be deployed to Netlify, Vercel, GitHub Pages, Cloudflare Pages, or any static host. The IndexNow key file and `robots.txt` / `sitemap.xml` must be served from the **site root** (`https://foodinmycity.com/...`).

After each deploy, submit new or updated URLs to IndexNow **from a serverless function / backend** — not from the browser.

---

## Required future environment variables

These belong in your serverless / backend environment, **never** in frontend code:

- `GOOGLE_PLACES_API_KEY`
- `ANTHROPIC_API_KEY`
- `LOOP_WEBHOOK_SECRET` (or signed webhook URL)
- `INDEXNOW_KEY` (already public, but used server-side for submissions)

---

## Production next steps

1. Replace placeholder Unsplash images with owned / local / creator photography (see `PHOTO_LICENSES.md`).
2. Add the final logo asset and favicons.
3. Stand up serverless proxies for Google Places and Anthropic.
4. Wire the EMG Loop webhook endpoint.
5. Add real restaurant and creator data (JSON, Supabase, or API).
6. Accessibility pass, mobile QA pass, and image/performance optimization.
7. Add Google Consent Mode for EEA traffic before analytics/ads personalization.

See `TODO.md` for the working checklist.

---

_Concept demo. EMG property. LBI & Staten Island launch markets._
