# FoodInMyCity — Integrations

This document describes the **planned integration architecture** for FoodInMyCity. The site ships as a static frontend; all sensitive logic and secrets live in serverless functions / backend endpoints.

## Guiding principles

- **The frontend never stores secrets.** Only public identifiers (GA4 ID, IndexNow key location) appear in client code.
- **Third-party APIs run behind a proxy.** Google Places and Anthropic are called from serverless functions that hold the keys and return sanitized results.
- **Events fire on meaningful actions.** EMG Loop and GA4 events are triggered by real user intent (CTA clicks, selections), not noise.
- **Search engines are notified after deploy.** IndexNow submissions happen post-deploy / on content updates, from the backend.

---

## Analytics — GA4

- GA4 is installed **manually in `index.html`** using Measurement ID **`G-TC8GHW3X6S`**.
- Exactly **one** Google tag is used per page, placed immediately after the opening `<head>` tag.
- `trackEvent(eventName, payload)` in `app.js` forwards events to `gtag`.
- GA4 tracks core engagement events: `select_night`, `toggle_filter`, `cta_click`, etc.
- **Future EEA traffic may require Google Consent Mode** before running analytics or ads personalization.

---

## EMG Loop webhook

- `sendLoopEvent(eventType, payload)` fires on meaningful user actions (CTA clicks, selections).
- In production, POST to `FIMC_CONFIG.loopWebhookEndpoint` (or a backend proxy that signs the request).
- Do not embed Loop secrets in the frontend.

---

## Google Places

- Called via `fetchNearbyRestaurants(query, location)`.
- **Runs through a serverless / backend proxy** that holds `GOOGLE_PLACES_API_KEY`.
- The browser never sees the key. The proxy returns only the fields the UI needs.

---

## Anthropic

- Called via `explainRecommendationWithClaude(context)` to generate the human "why we picked this" copy.
- **Runs through a serverless / backend proxy** that holds `ANTHROPIC_API_KEY`.
- Keep the experience food-first and human; the model output should read naturally, never robotic.

## IndexNow

- IndexNow **key**: `b9f140612ecf495f85fc08b1452af5f0`.
- The key is hosted at **`/b9f140612ecf495f85fc08b1452af5f0.txt`** (site root). The file contains only the key string.
- IndexNow payloads should submit to **`https://api.indexnow.org/IndexNow`**.
- IndexNow submissions should happen **after deploy or after URL/content updates**, preferably from a serverless function / backend.
- **Do not submit IndexNow repeatedly from frontend user clicks.** The `submitIndexNowUrl(url)` function in `app.js` is a safe placeholder that only logs today.
- `indexnow.json` at the repo root holds the host, key, key location, and the URL list to submit.

Example submission payload:

```json
{
  "host": "foodinmycity.com",
  "key": "b9f140612ecf495f85fc08b1452af5f0",
  "keyLocation": "https://foodinmycity.com/b9f140612ecf495f85fc08b1452af5f0.txt",
  "urlList": ["https://foodinmycity.com/"]
}
```

---

## Restaurant & creator data

- Today the UI uses static demo content.
- Future restaurant and creator/tastemaker data can come from **JSON files, Supabase, or an API**.
- `fetchNearbyRestaurants`, `fetchCreatorTrails`, `getFoodDnaProfile`, and `saveFoodDnaProfile` are the seams where this data plugs in.

---

## Status summary

| Integration      | Status                  | Where the secret lives        |
|------------------|-------------------------|-------------------------------|
| GA4              | Installed (`G-TC8GHW3X6S`) | Public (gtag in index.html)   |
| IndexNow         | Key + file + json ready | Public key; submit via backend |
| Google Places    | Placeholder             | Serverless proxy env          |
| Anthropic        | Placeholder             | Serverless proxy env          |
| EMG Loop webhook | Placeholder             | Backend / signed endpoint     |


## My Palate, The Loop & Neon (added in Sebastian Foundation sprint)

**The Loop** is the backend intelligence system; it stores data in **Neon**. The frontend never connects to Neon directly and holds no credentials.

### Frontend contract (`assets/js/palate.js`)

- `createLoopUserProfile(profile)` — placeholder; production POSTs to `FIMC_CONFIG.loopProfileEndpoint`. Backend writes the profile to Neon.
- `updateLoopUserProfile(profilePatch)` — placeholder; production PATCHes the same endpoint.
- `Palate.loopEvent(type, data)` -> `sendLoopEvent(type, payload)` — structured events; production POSTs to `FIMC_CONFIG.loopWebhookEndpoint`.
- `askSebastian(prompt, context)` — Anthropic placeholder; production POSTs { prompt, My Palate context, local food dataset } to `FIMC_CONFIG.anthropicProxyEndpoint` (a serverless proxy). The Anthropic key stays server-side only.
- `fetchNearbyRestaurants(query, location)` — Google Places placeholder; real requests must go through a backend/serverless function.
- `openGoogleMapsSearch(place, area)` — opens a Maps search URL (acceptable temporary frontend fallback).

### Config keys (`FIMC_CONFIG`)

```
market, ga4MeasurementId, googleMapsApiKey (""), googlePlacesApiKey (""),
anthropicProxyEndpoint (""), loopWebhookEndpoint (""), loopProfileEndpoint (""),
loopNeonStorage ("backend-only"), indexNowKey, indexNowKeyLocation, environment
```

### Security rules

- **No Neon credentials in frontend.** Neon is written by the backend only (`loopNeonStorage: "backend-only"`).
- **No Anthropic key in frontend.** Use the serverless proxy.
- **No Google Places key in production frontend.** Use a backend function; Maps search URL is the only frontend fallback.
- Email is hashed server-side; the frontend `emailHash` is a non-cryptographic placeholder.

See `MY_PALATE.md` and `PRODUCT_FLOW.md` for the full data model and event list.
