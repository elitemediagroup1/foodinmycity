# FoodInMyCity — TODO

Working checklist to take the static starter to production. Items are grouped by area. Check items off as they ship.

## Content & assets
- [ ] Replace **TEMPORARY remote Unsplash placeholder photos** (currently hardcoded in `index.html` as a stop-gap to fix broken images on the live site) with owned/local/creator-shot photography before final production. Only the logo (`assets/images/logo-foodinmycity-dark.png`) is a real local asset. See `docs/PHOTO_LICENSES.md` for the full list of temporary URLs.
- [ ] Add real logo asset (final `logo-foodinmycity-dark.png`)
- [ ] Add favicons and social share (Open Graph) image
- [ ] Add restaurant data JSON
- [ ] Add creator profile JSON

## Integrations
- [x] Add GA4 measurement ID (`G-TC8GHW3X6S`, installed in `index.html`)
- [x] Add IndexNow key + key file + `indexnow.json`
- [ ] Add Google Places serverless function
- [ ] Add Anthropic serverless proxy
- [ ] Add EMG Loop webhook endpoint
- [ ] Wire IndexNow submission from a serverless function (post-deploy)

## Quality
- [ ] Accessibility pass
- [ ] Mobile QA pass
- [ ] Performance / image optimization pass
- [ ] Add Google Consent Mode for EEA traffic (before analytics/ads personalization)

## Notes
- Frontend never stores secrets. Keys live in serverless/backend env vars.
- GA4 and IndexNow are now **partially configured**. Google Places, Anthropic, and the EMG Loop webhook are still placeholders.
