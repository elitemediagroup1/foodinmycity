# FoodInMyCity — Photo Licenses

> **Prototype images are placeholders.** Production should prioritize owned photography, restaurant-submitted photos, and creator-shot local photography.

The v6 prototype used royalty-free placeholder photography from Unsplash to convey the cinematic, food-first mood. These must be reviewed and replaced before launch. The local-file paths below are where production assets should live; the listed source URLs are the original prototype placeholders they replace.

## Placeholder image inventory

| Local path | Used for | Original placeholder source (Unsplash) |
|------------|----------|----------------------------------------|
| assets/images/hero-steak.jpg | Opening hero | https://images.unsplash.com/photo-1544025162-d76694265947 |
| assets/images/daily-table/foundry-brisket.jpg | Tonight's Pick + Daily Table hero (brisket) | https://images.unsplash.com/photo-1555396273-367ea4eb4db5 / photo-1544025162-d76694265947 |
| assets/images/daily-table/barnacle-lobster.jpg | Lobster roll | https://images.unsplash.com/photo-1559847844-5315695dadae |
| assets/images/daily-table/miso-ramen.jpg | Black garlic ramen | https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d |
| assets/images/daily-table/salvos-rigatoni.jpg | Spicy vodka rigatoni | https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5 |
| assets/images/daily-table/salvos-vodka-pizza.jpg | Vodka pizza | https://images.unsplash.com/photo-1513104890138-7c749659a591 |
| assets/images/daily-table/salt-press-burger.jpg | Double smash burger | https://images.unsplash.com/photo-1568901346375-23c9450c58cd |
| assets/images/daily-table/salvos-cacio.jpg | Cacio e pepe | https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5 |
| assets/images/daily-table/lemon-ricotta-pancakes.jpg | Pancakes | https://images.unsplash.com/photo-1484723091739-30a097e8f929 |
| assets/images/daily-table/brown-butter-gelato.jpg | Gelato | https://images.unsplash.com/photo-1551024601-bec78aea704b |
| assets/images/daily-table/birria-tacos.jpg | Birria tacos | https://images.unsplash.com/photo-1558030006-450675393462 |
| assets/images/daily-table/pecan-ribs.jpg | Pecan smoked ribs | https://images.unsplash.com/photo-1563805042-7684c019e1cb |
| assets/images/cravings/cheesy.jpg | Craving: Cheesy | https://images.unsplash.com/photo-1513104890138-7c749659a591 |
| assets/images/cravings/smoky.jpg | Craving: Smoky | https://images.unsplash.com/photo-1544025162-d76694265947 |
| assets/images/cravings/sweet.jpg | Craving: Sweet | https://images.unsplash.com/photo-1551024601-bec78aea704b |
| assets/images/cravings/crispy.jpg | Craving: Crispy | https://images.unsplash.com/photo-1568901346375-23c9450c58cd |
| assets/images/cravings/fresh.jpg | Craving: Fresh | https://images.unsplash.com/photo-1484723091739-30a097e8f929 |
| assets/images/cravings/messy.jpg | Craving: Messy | https://images.unsplash.com/photo-1558030006-450675393462 |
| assets/images/local-scene.jpg | Local Pulse background | https://images.unsplash.com/photo-1414235077428-338989a2e8c0 |
| assets/images/editors/salt-press-burger.jpg | Food editor feature | https://images.unsplash.com/photo-1568901346375-23c9450c58cd |
| assets/images/your-taste-spread.jpg | Your Taste spread | https://images.unsplash.com/photo-1504674900247-0877df9cc836 |
| assets/images/morning-pastries.jpg | Morning transition | https://images.unsplash.com/photo-1484723091739-30a097e8f929 |
| assets/images/logo-foodinmycity-dark.png | Site logo | Owned brand asset (provided) |

## Notes

- Unsplash photos are free to use under the Unsplash License, but for a commercial product we should not rely on them long-term. They are stand-ins for mood and layout only.
- Replace every food photo with a real photo of the **actual dish at the actual restaurant**. Mismatched stock photos hurt trust.
- Prefer, in order: owned photography, restaurant-submitted photos, creator-shot local photography.
- Keep alt text descriptive and specific (dish + restaurant) for accessibility and SEO.
- The logo (`logo-foodinmycity-dark.png`) is an owned brand asset and is not a placeholder.

## TEMPORARY remote photo URLs currently live in `index.html`

> **These are temporary placeholders.** The local image files did not exist, which broke the live site. As an interim fix, the `<img src>` values in `index.html` now point to remote Unsplash URLs so the page renders. **They must be replaced with owned / local / creator-shot photography before final production.** Only `assets/images/logo-foodinmycity-dark.png` is a real, locally hosted asset.

| Intended local path (to restore) | Temporary remote URL now in use |
|----------------------------------|----------------------------------|
| `assets/images/hero-steak.jpg` | https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/daily-table/foundry-brisket.jpg` | https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/daily-table/barnacle-lobster.jpg` | https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/daily-table/miso-ramen.jpg` | https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/daily-table/salvos-rigatoni.jpg` | https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/daily-table/salvos-vodka-pizza.jpg` | https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/daily-table/salt-press-burger.jpg` | https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/daily-table/salvos-cacio.jpg` | https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/daily-table/lemon-ricotta-pancakes.jpg` | https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/daily-table/brown-butter-gelato.jpg` | https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/daily-table/birria-tacos.jpg` | https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/daily-table/pecan-ribs.jpg` | https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/cravings/cheesy.jpg` | https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/cravings/smoky.jpg` | https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/cravings/sweet.jpg` | https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/cravings/crispy.jpg` | https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/cravings/fresh.jpg` | https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/cravings/messy.jpg` | https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/local-scene.jpg` | https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/editors/salt-press-burger.jpg` | https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/your-taste-spread.jpg` | https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80 |
| `assets/images/morning-pastries.jpg` | https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80 |

*Logo (kept local, not a placeholder):* `assets/images/logo-foodinmycity-dark.png`
