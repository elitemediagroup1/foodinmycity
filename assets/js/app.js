/* ============================================================
   FoodInMyCity — app.js
   Plain JavaScript. No frameworks, no build step.
   Handles UI interactions, click tracking, and provides
   safe placeholder functions for future integrations.
   ============================================================ */

/* ---------------------------------------------------------------
   CONFIG
   Frontend config only. NEVER put private/secret API keys here.
   Anything secret (Google Places key, Anthropic key, Loop secret)
   must live behind a serverless function / backend proxy.
   Public values (GA4 ID, IndexNow key location) are fine.
--------------------------------------------------------------- */
const FIMC_CONFIG = {
  market: "Long Beach Island",
  ga4MeasurementId: "G-TC8GHW3X6S",            // public — installed via gtag in index.html
  googlePlacesApiKey: "",                       // DO NOT put a real key here. Use a backend proxy.
  anthropicProxyEndpoint: "",                   // URL of your serverless proxy (no Anthropic key in frontend)
  loopWebhookEndpoint: "",                       // EMG Loop webhook capture endpoint (set in production)
  googleMapsApiKey: "",                            // backend/serverless only — never expose a real key in frontend
  loopProfileEndpoint: "",                         // EMG Loop profile create/update endpoint (backend writes to Neon)
  loopNeonStorage: "backend-only",                 // Neon is written by the backend ONLY; no Neon creds in frontend
  indexNowKey: "b9f140612ecf495f85fc08b1452af5f0",
  indexNowKeyLocation: "https://foodinmycity.com/b9f140612ecf495f85fc08b1452af5f0.txt",
  environment: "development"
};

/* ===============================================================
   INTEGRATION PLACEHOLDERS
   All of these are safe stubs that only log to the console today.
   Production wiring notes are included inline.
   =============================================================== */

/* --- Analytics: GA4 ---------------------------------------------
   trackEvent fires a GA4 event via gtag (loaded in index.html).
   Safe to call even before integrations are fully wired.
   Future: add Google Consent Mode for EEA traffic before this runs.
----------------------------------------------------------------- */
function trackEvent(eventName, payload = {}) {
  const data = { market: FIMC_CONFIG.market, environment: FIMC_CONFIG.environment, ...payload };
  console.log("[trackEvent]", eventName, data);
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, data);
  }
  // INTEGRATION: GA4 / Google Analytics
  // gtag is configured in index.html with G-TC8GHW3X6S.
}

/* --- EMG Loop webhook -------------------------------------------
   sendLoopEvent fires a meaningful user action to the EMG Loop.
   Production: POST to FIMC_CONFIG.loopWebhookEndpoint (or a backend
   proxy). Do not embed Loop secrets in the frontend.
----------------------------------------------------------------- */
function sendLoopEvent(eventType, payload = {}) {
  const body = { type: eventType, market: FIMC_CONFIG.market, ts: Date.now(), ...payload };
  console.log("[sendLoopEvent placeholder]", body);
  // INTEGRATION: EMG Loop webhook capture
  // if (FIMC_CONFIG.loopWebhookEndpoint) {
  //   fetch(FIMC_CONFIG.loopWebhookEndpoint, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(body)
  //   }).catch(err => console.warn("Loop event failed", err));
  // }
}

/* --- Google Places ----------------------------------------------
   fetchNearbyRestaurants should NOT call Google directly from the
   browser with a private key. Route through a serverless function
   that holds the key and returns sanitized results.
----------------------------------------------------------------- */
async function fetchNearbyRestaurants(query, location) {
  console.log("[fetchNearbyRestaurants placeholder]", { query, location });
  // INTEGRATION: Google Places API (via backend proxy)
  // const res = await fetch("/api/places?q=" + encodeURIComponent(query));
  // return await res.json();
  return []; // placeholder
}

/* --- Tonight recommendation -------------------------------------
   getTonightRecommendation produces the single confident pick.
   Today it returns a static demo object. In production this would
   combine local restaurant data, hours, distance, weather, and the
   user's Food DNA profile (likely via a backend endpoint).
----------------------------------------------------------------- */
async function getTonightRecommendation(context = {}) {
  console.log("[getTonightRecommendation placeholder]", context);
  // INTEGRATION: Local restaurant data source + ranking
  // const res = await fetch("/api/tonight", { method:"POST", body: JSON.stringify(context) });
  // return await res.json();
  return {
    restaurant: "The Foundry Room",
    neighborhood: "Barnegat Light",
    dish: "14-Hour Smoked Brisket",
    minutesAway: 14
  };
}

/* --- Recommendation explanation (Anthropic) ---------------------
   explainRecommendationWithClaude turns signals into a friendly,
   human "why we picked this" blurb. The Anthropic API key must
   NEVER be in the frontend — call a serverless proxy that adds it.
----------------------------------------------------------------- */
async function explainRecommendationWithClaude(context = {}) {
  console.log("[explainRecommendationWithClaude placeholder]", context);
  // INTEGRATION: Anthropic API via serverless proxy (anthropicProxyEndpoint)
  // const res = await fetch(FIMC_CONFIG.anthropicProxyEndpoint, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ context })
  // });
  // return (await res.json()).explanation;
  return "We picked this because it's close, open now, and matches what you love.";
}

/* --- Creator / tastemaker data ----------------------------------
   Placeholder for fetching local food editor trails and picks.
----------------------------------------------------------------- */
async function fetchCreatorTrails(market = FIMC_CONFIG.market) {
  console.log("[fetchCreatorTrails placeholder]", { market });
  // INTEGRATION: Creator/tastemaker data source (JSON, Supabase, or API)
  return [];
}

/* --- Food DNA / Your Taste profile ------------------------------
   Placeholders for reading & saving a user's taste profile.
   In production this is per-user storage (backend or Supabase).
----------------------------------------------------------------- */
function getFoodDnaProfile() {
  console.log("[getFoodDnaProfile placeholder]");
  // INTEGRATION: Food DNA user profile storage
  try { return JSON.parse(localStorage.getItem("fimc_food_dna") || "null"); }
  catch (e) { return null; }
}
function saveFoodDnaProfile(profile) {
  console.log("[saveFoodDnaProfile placeholder]", profile);
  // INTEGRATION: Food DNA user profile storage (backend in production)
  try { localStorage.setItem("fimc_food_dna", JSON.stringify(profile)); } catch (e) {}
}

/* --- Maps / Directions ------------------------------------------
   openDirections opens Google Maps directions for a destination.
----------------------------------------------------------------- */
function openDirections(destination) {
  console.log("[openDirections placeholder]", destination);
  // INTEGRATION: Google Maps / Directions
  // const url = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(destination);
  // window.open(url, "_blank", "noopener");
}

/* --- IndexNow ---------------------------------------------------
   submitIndexNowUrl is a SAFE placeholder. It only logs today.
   Do NOT spam IndexNow from frontend user clicks.
   Production: submit from a serverless function/backend AFTER deploy
   or after URL/content updates, to https://api.indexnow.org/IndexNow
----------------------------------------------------------------- */
async function submitIndexNowUrl(url) {
  const payload = {
    host: "foodinmycity.com",
    key: FIMC_CONFIG.indexNowKey,
    keyLocation: FIMC_CONFIG.indexNowKeyLocation,
    urlList: [url]
  };

  console.log("[IndexNow placeholder]", payload);

  // Production note:
  // Submit this from a serverless function or backend after deploy.
  // Do not spam IndexNow from frontend clicks.
  // Endpoint: https://api.indexnow.org/IndexNow
}

/* ===============================================================
   UI INTERACTIONS
   =============================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* --- Scroll reveal animations --- */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

  /* --- Sticky nav background on scroll --- */
  window.addEventListener("scroll", () => {
    const nav = document.getElementById("nav");
    if (nav) nav.classList.toggle("solid", window.scrollY > 60);
  });

  /* --- "What kind of night" selector (single select) --- */
  document.querySelectorAll(".night-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".night-btn").forEach(b => b.classList.remove("on"));
      this.classList.add("on");
      const night = this.dataset.night || "";
      trackEvent("select_night", { night });
      sendLoopEvent("select_night", { night });
    });
  });

  /* --- Dinner filter toggles --- */
  document.querySelectorAll(".de-sub-item").forEach(item => {
    item.addEventListener("click", function () {
      this.classList.toggle("on");
      const filter = this.dataset.filter || "";
      const on = this.classList.contains("on");
      trackEvent("toggle_filter", { filter, on });
    });
  });

  /* --- CTA + interactive element click tracking ---
     Every element with a data-cta attribute fires both a GA4 event
     (trackEvent) and an EMG Loop event (sendLoopEvent). --- */
  document.querySelectorAll("[data-cta]").forEach(el => {
    el.addEventListener("click", function () {
      const cta = this.dataset.cta;
      const payload = {
        cta,
        restaurant: this.dataset.restaurant || undefined,
        dish: this.dataset.dish || undefined,
        craving: this.dataset.craving || undefined,
        editor: this.dataset.editor || undefined,
        tag: this.dataset.tag || undefined,
        pulse: this.dataset.pulse || undefined
      };
      trackEvent("cta_click", payload);
      sendLoopEvent("cta_click", payload);

      // Light demo behaviors for key CTAs (no real navigation yet)
      switch (cta) {
        case "find-dinner-tonight":
        case "find-dinner-nav":
          getTonightRecommendation(collectNightContext());
          scrollToDecision();
          break;
        default:
          break;
      }
    });
  });

  /* --- City label cycling (cosmetic) --- */
  const cities = ["Long Beach Island", "Seaside Heights, NJ", "Staten Island, NY", "Manahawkin, NJ", "Toms River, NJ"];
  let ci = 0;
  const cityEl = document.getElementById("cityLabel");
  if (cityEl) {
    setInterval(() => {
      ci = (ci + 1) % cities.length;
      cityEl.style.transition = "opacity .35s";
      cityEl.style.opacity = "0";
      setTimeout(() => { cityEl.textContent = cities[ci]; cityEl.style.opacity = "1"; }, 350);
    }, 4000);
  }

  /* Smooth-scroll to the Tonight decision section */
  function scrollToDecision(){
    var target = document.getElementById("act-decision") || document.getElementById("act-tonight");
    if(!target) return;
    var navEl = document.getElementById("nav");
    var offset = navEl ? navEl.getBoundingClientRect().height : 0;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  // Sebastian — the host. He greets, then guides you to your one confident pick.
  // (Conversation UI is a future enhancement; for now he walks you to the decision.)
  function openSebastian(pose){
    trackEvent("sebastian_open", { pose: pose || "welcome" });
    sendLoopEvent("sebastian_open", { pose: pose || "welcome" });
    getTonightRecommendation(collectNightContext());
    scrollToDecision();
  }

  // "Surprise me" — let Sebastian decide for you.
  function surpriseSebastian(){
    trackEvent("sebastian_surprise", { mode: "surprise" });
    sendLoopEvent("sebastian_surprise", { mode: "surprise" });
    getTonightRecommendation(collectNightContext());
    scrollToDecision();
  }


  /* Mobile menu: open/close, scroll lock, Escape, link-close, accessibility */
  (function(){
    var burger = document.getElementById("navBurger");
    var menu = document.getElementById("mobileMenu");
    var closeBtn = document.getElementById("mmClose");
    if(!burger || !menu) return;
    var links = menu.querySelectorAll(".mm-links a");
    function openMenu(){
      menu.classList.add("open");
      menu.setAttribute("aria-hidden","false");
      burger.setAttribute("aria-expanded","true");
      document.body.classList.add("menu-open");
      var first = menu.querySelector("a, button");
      if(first) first.focus();
    }
    function closeMenu(){
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden","true");
      burger.setAttribute("aria-expanded","false");
      document.body.classList.remove("menu-open");
      burger.focus();
    }
    burger.addEventListener("click", function(){
      if(menu.classList.contains("open")) closeMenu(); else openMenu();
    });
    if(closeBtn) closeBtn.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && menu.classList.contains("open")) closeMenu();
    });
    links.forEach(function(a){
      a.addEventListener("click", function(){
        var id = (a.getAttribute("href")||"").replace("#","");
        closeMenu();
        if(id){
          var sec = document.getElementById(id);
          if(sec){
            setTimeout(function(){
              var navEl = document.getElementById("nav");
              var offset = navEl ? navEl.getBoundingClientRect().height : 0;
              var top = sec.getBoundingClientRect().top + window.pageYOffset - offset;
              window.scrollTo({ top: top, behavior: "smooth" });
            }, 80);
          }
        }
      });
    });
  })();

});

/* --- Helper: gather the current "night" context for the engine --- */
function collectNightContext() {
  const night = document.querySelector(".night-btn.on")?.dataset.night || null;
  const filters = Array.from(document.querySelectorAll(".de-sub-item.on"))
    .map(el => el.dataset.filter);
  return { market: FIMC_CONFIG.market, night, filters };
}
