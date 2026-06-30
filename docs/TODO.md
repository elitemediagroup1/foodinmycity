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


## My Palate + Sebastian Foundation (sprint status)

**Shipped (frontend, local/demo):**
- My Palate data model + localStorage persistence (`assets/js/palate.js`).
- Low-friction signup (name + email only) -> profile experience.
- All profile sections: Dining Style, Favorite Flavors, Never Recommend, Your Table, Special Evenings, Local Preferences, Spending Style, Drinks, Bucket List, Saved for Later, What Sebastian Has Learned.
- Sebastian panel (static Anthropic placeholder, passes My Palate context).
- Structured Loop events (14 `food.*` types) + GA4 `trackEvent` mappings.
- Entry points: header "My Palate", final CTA "Build My Palate", Sebastian "Start My Palate", "Save to My Palate".
- Anonymous hero greeting "Welcome. I'm Sebastian." (no fake name before signup).
- AEO/SEO FAQ entries for My Palate.

**Still to do (backend / production):**
- Wire `loopProfileEndpoint` + `loopWebhookEndpoint` to a secure backend that writes to **Neon**. No Neon creds in frontend.
- Wire `anthropicProxyEndpoint` (serverless) so Sebastian reasons live; keep the Anthropic key server-side only.
- Replace demo recommendations with real Google **Places** results via a backend function (no Places key in frontend).
- Real server-side **email hashing** (frontend hash is a placeholder).
- Replace temporary Unsplash placeholder photos with owned/local/creator-shot photography (carried over from prior sprint).
- Consider a dedicated full My Palate page/route as the profile grows.
- Add Google Consent Mode for EEA traffic before analytics fire there.
