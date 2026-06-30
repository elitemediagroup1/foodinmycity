# Product Flow

FoodInMyCity is a Sebastian-powered food **decision** platform. Sebastian is the AI Maitre D'; My Palate is his memory; The Loop is the backend intelligence (stored in Neon). The homepage narrative makes **Sebastian + My Palate the spine** so the site reads as one experience, not a stack of unrelated sections.

## The spine (homepage narrative)

1. **Hero** — Sebastian's promise. Anonymous greeting: "Welcome. I'm Sebastian." (never a fake name).
2. **Meet Sebastian** — the host introduces himself; CTAs: Talk to Sebastian, Surprise Me, Start My Palate.
3. **My Palate entry** — low-friction signup (name + email) or open the profile.
4. **Tonight's Pick** — Sebastian makes one confident recommendation.
5. **Why this fits your palate** — the recommendation is explained against what he knows.
6. **Save to My Palate** — the user keeps it; the Loop learns.
7. **Supporting acts** — Daily Table, Cravings, Local Pulse, Food Passport, Tastemakers. Each is framed as an *extension* of My Palate and Sebastian, answering one question: "How does this help Sebastian make better recommendations for me?"

## Functional actions (all working today, local/demo)

- Create My Palate (name + email only) -> localStorage + `createLoopUserProfile()`
- Save / update My Palate sections -> persists per change, fires Loop + GA4
- Save dish / restaurant / Tonight's Pick -> `savedItems`, "Saved for Later"
- Take Me There -> opens Google Maps search (frontend fallback)
- Talk to Sebastian -> opens the Sebastian panel
- Surprise Me -> demo recommendation in Sebastian's voice
- Build My Palate / header link -> signup if new, profile if known

## The Loop — structured events

Every meaningful action emits a structured event through `Palate.loopEvent(type, data)`, which forwards to the EMG Loop placeholder (`sendLoopEvent`). Production posts the **same payload** to a secure backend, which writes to Neon.

Event types:

- `food.palate.signup.started`
- `food.palate.created`
- `food.palate.updated`
- `food.preference.selected`
- `food.preference.removed`
- `food.dish.saved`
- `food.restaurant.saved`
- `food.recommendation.generated`
- `food.recommendation.accepted`
- `food.recommendation.dismissed`
- `food.maps.opened`
- `food.sebastian.opened`
- `food.sebastian.question.asked`
- `food.sebastian.response.generated`

Every payload includes: `userId` (if known), `emailHash` (placeholder if available), `market`, `pageUrl`, `timestamp`, plus the relevant item / dish / restaurant / preference data.

## GA4 analytics (via `trackEvent`)

`palate_created`, `palate_updated`, `sebastian_opened`, `sebastian_question_asked`, `recommendation_generated`, `recommendation_saved`, `maps_opened`, `dish_saved`. GA4 tag (`G-TC8GHW3X6S`) is installed once in `index.html`.

## Security boundary

- No Neon / Anthropic / Google Places credentials in frontend code.
- Profile writes and AI calls are designed to flow through a secure backend / serverless endpoint.
- Maps search URL is the only acceptable temporary frontend fallback.
