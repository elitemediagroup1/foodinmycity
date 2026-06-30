# My Palate

My Palate is **Sebastian's living memory of how the user likes to dine.** It is not a food diary, and it is not account settings. It is the data foundation that makes every Sebastian recommendation more confident over time.

> "The better Sebastian understands your palate, the better every recommendation becomes."

## Principles

- **Low-friction first.** Signup asks for **name + email only**. Deeper preferences are gathered progressively *after* the user is inside the profile.
- **AI stays invisible.** The experience reads as hospitality, not software. Sebastian is the host; My Palate is what he remembers.
- **Name only after signup.** The anonymous hero greets with "Welcome. I'm Sebastian." Never a fake name like "Matt."
- **Frontend never touches Neon.** All profile writes and AI calls flow through a secure backend / serverless endpoint. No Neon, Anthropic, or Places credentials live in frontend code.

## Profile Sections

- **Your Dining Style** — Casual, Fine Dining, Hidden Gems, Waterfront, Family Favorites, Romantic, Chef's Table, Local Legends.
- **Favorite Flavors** — Smoky, Creamy, Crispy, Fresh, Rich, Sweet, Spicy, Citrusy, Umami.
- **Never Recommend** — foods to avoid, restaurants to avoid, allergies, dietary restrictions, chains to avoid.
- **Your Table** — Just me, Partner, Kids, Friends, Business, Dog-friendly outings.
- **Special Evenings** — Birthday, Anniversary, Weekly date night, Friday pizza, Sunday brunch, Family dinner night.
- **Local Preferences** — home market, favorite towns, drive distance (minutes), walkable, waterfront, parking.
- **Spending Style** — weeknight, weekend, celebration, lunch budgets.
- **Drinks** — Coffee, Wine, Craft beer, Cocktails, Mocktails, None.
- **Bucket List** — places or dishes the user wants to try.
- **Saved for Later** — dishes / restaurants / events saved from site interactions.
- **What Sebastian Has Learned** — a dynamic summary written in Sebastian's voice, generated from local state today.

## Data Model

The canonical shape lives in `assets/js/palate.js` (`newPalate()`):

```js
const myPalate = {
  user: { id: null, name: "", email: "", createdAt: "", market: "Long Beach Island" },
  diningStyle: [],
  favoriteFlavors: [],
  neverRecommend: { foods: "", restaurants: "", allergies: "", dietaryRestrictions: "", chains: "" },
  table: [],
  specialEvenings: [],
  localPreferences: { homeMarket: "", favoriteTowns: [], driveDistanceMinutes: "", walkable: false, waterfront: false, parking: false },
  spendingStyle: { weeknight: "", weekend: "", celebration: "", lunch: "" },
  drinks: [],
  bucketList: "",
  savedItems: [],
  learnedSummary: "",
  updatedAt: ""
};
```

### Storage

- Today: persisted to `localStorage` under the key `fimc.myPalate.v1`.
- Tomorrow: the same payloads sync to **The Loop** via a secure backend endpoint (`FIMC_CONFIG.loopProfileEndpoint`), which writes to **Neon**. The frontend code is structured for this swap — `createLoopUserProfile()` / `updateLoopUserProfile()` are already called alongside local saves.

## Entry Points

- Header link: **My Palate**
- Final CTA: **Build My Palate**
- Sebastian section: **Start My Palate**
- Recommendation result: **Save to My Palate**
- Signup modal button: **Create My Palate**

## Public API (`window.Palate` / `window.PalateUI`)

- `Palate.load()`, `Palate.save(p)`, `Palate.isSignedIn()`, `Palate.newPalate()`
- `Palate.loopEvent(type, data)` — structured Loop emitter (see PRODUCT_FLOW.md)
- `Palate.askSebastian(prompt, context)` — Anthropic placeholder (backend proxy in prod)
- `Palate.openGoogleMapsSearch(place, area)` — Maps fallback + `food.maps.opened`
- `Palate.generateLearnedSummary(p)` — "What Sebastian Has Learned"
- `PalateUI.openSignup()`, `openProfile()`, `openSebastianPanel()`, `surpriseRecommendation()`, `saveItem(kind, name, extra)`

## Limitations (current)

- All data is local (`localStorage`); nothing is synced to a backend yet.
- Sebastian's answers are a single static placeholder until the Anthropic proxy is wired.
- Recommendations are demo data, not live Google Places results.
- Email hashing is a non-cryptographic placeholder; real hashing happens server-side.
