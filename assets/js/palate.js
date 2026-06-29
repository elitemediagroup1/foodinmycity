/* ============================================================================
   FoodInMyCity — My Palate + Sebastian Foundation
   ----------------------------------------------------------------------------
   My Palate is Sebastian's living memory of the user's dining preferences.
   This module owns: the data model, localStorage persistence, structured Loop
   events, the Sebastian (Anthropic) placeholder, Maps placeholders, and the
   "What Sebastian Has Learned" summary. It is plain ES5/ES6 — no frameworks,
   no build step, no dependencies.

   SECURITY: The Loop stores data in Neon. The frontend NEVER talks to Neon and
   NEVER holds Neon/Anthropic/Places credentials. All profile writes and AI
   calls must go through a secure backend / serverless endpoint in production.
   ========================================================================== */
(function (window, document) {
  "use strict";

  /* ---- Config (extends FIMC_CONFIG defined in app.js; adds new keys) ------ */
  var BASE = window.FIMC_CONFIG || {};
  var CONFIG = Object.assign({
    market: "Long Beach Island",
    ga4MeasurementId: "G-TC8GHW3X6S",
    googleMapsApiKey: "",          // never expose a real key in frontend
    googlePlacesApiKey: "",        // backend/serverless only
    anthropicProxyEndpoint: "",    // serverless proxy; Anthropic key stays server-side
    loopWebhookEndpoint: "",       // EMG Loop event capture
    loopProfileEndpoint: "",       // EMG Loop profile create/update endpoint
    loopNeonStorage: "backend-only", // Neon is written by the backend ONLY
    indexNowKey: "b9f140612ecf495f85fc08b1452af5f0",
    indexNowKeyLocation: "https://foodinmycity.com/b9f140612ecf495f85fc08b1452af5f0.txt",
    environment: "development"
  }, BASE);
  window.FIMC_CONFIG = CONFIG;

  var STORAGE_KEY = "fimc.myPalate.v1";

  /* ---- Data model -------------------------------------------------------- */
  function newPalate() {
    return {
      user: { id: null, name: "", email: "", createdAt: "", market: CONFIG.market },
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
  }

  /* ---- Persistence (localStorage now; Loop/Neon later) ------------------- */
  function loadPalate() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return Object.assign(newPalate(), JSON.parse(raw));
    } catch (e) { return null; }
  }
  function savePalate(p) {
    p.updatedAt = new Date().toISOString();
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) {}
    return p;
  }
  function isSignedIn() {
    var p = loadPalate();
    return !!(p && p.user && p.user.email);
  }

  /* ---- Email hash placeholder (NOT cryptographic; real hashing server-side) */
  function emailHashPlaceholder(email) {
    if (!email) return null;
    var h = 0, s = String(email).trim().toLowerCase();
    for (var i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
    return "eh_" + (h >>> 0).toString(16);
  }

  /* ---- Analytics (GA4) — reuse app.js trackEvent if present -------------- */
  function track(name, payload) {
    if (typeof window.trackEvent === "function") { window.trackEvent(name, payload || {}); return; }
    if (typeof window.gtag === "function") { window.gtag("event", name, payload || {}); }
    console.log("[trackEvent]", name, payload || {});
  }

  /* ---- The Loop: structured event emitter -------------------------------
     Every meaningful action becomes a structured event. Today it logs and
     calls the placeholder webhook; in production the SAME payload posts to a
     secure backend / serverless endpoint, which writes to Neon. */
  var LOOP_EVENTS = [
    "food.palate.signup.started", "food.palate.created", "food.palate.updated",
    "food.preference.selected", "food.preference.removed",
    "food.dish.saved", "food.restaurant.saved",
    "food.recommendation.generated", "food.recommendation.accepted", "food.recommendation.dismissed",
    "food.maps.opened", "food.sebastian.opened",
    "food.sebastian.question.asked", "food.sebastian.response.generated"
  ];

  function loopEvent(eventType, data) {
    var p = loadPalate();
    var payload = Object.assign({
      userId: (p && p.user && p.user.id) || null,
      emailHash: (p && p.user && p.user.email) ? emailHashPlaceholder(p.user.email) : null,
      market: CONFIG.market,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString()
    }, data || {});
    // Forward to the EMG Loop placeholder (app.js) — single source of truth.
    if (typeof window.sendLoopEvent === "function") { window.sendLoopEvent(eventType, payload); }
    else { console.log("[Loop placeholder] event", eventType, payload); }
    return payload;
  }

  /* ---- Loop profile placeholders ----------------------------------------
     Frontend sends profile/patch payloads to a secure backend endpoint
     (CONFIG.loopProfileEndpoint). The backend writes to Neon. No Neon
     credentials ever exist in frontend code. */
  async function createLoopUserProfile(profile) {
    console.log("[Loop placeholder] create profile", profile);
    // Production: await fetch(CONFIG.loopProfileEndpoint, { method:"POST", body: JSON.stringify(profile) })
    return { ok: true, mode: "placeholder" };
  }
  async function updateLoopUserProfile(profilePatch) {
    console.log("[Loop placeholder] update profile", profilePatch);
    // Production: await fetch(CONFIG.loopProfileEndpoint, { method:"PATCH", body: JSON.stringify(profilePatch) })
    return { ok: true, mode: "placeholder" };
  }

  /* ---- Anthropic (Sebastian) placeholder --------------------------------
     Sebastian will reason through a serverless proxy. The Anthropic API key
     must remain server-side ONLY. Future: POST { prompt, palate context,
     local food dataset } to CONFIG.anthropicProxyEndpoint; the endpoint
     returns Sebastian's response. */
  async function askSebastian(prompt, context) {
    console.log("[Anthropic placeholder] Sebastian prompt", { prompt: prompt, context: context });
    return {
      message: "Leave this one to me. Based on what I know so far, I'd start with something local, warm, and worth leaving the house for.",
      recommendation: null
    };
  }

  /* ---- Google Maps / Places placeholders --------------------------------
     The Places API key must not be exposed in frontend production; use a
     backend/serverless function for real Places requests. A Maps search URL
     is an acceptable temporary frontend fallback. */
  async function fetchNearbyRestaurants(query, location) {
    console.log("[Google Places placeholder]", { query: query, location: location });
    return [];
  }
  function openGoogleMapsSearch(placeName, area) {
    var q = encodeURIComponent((placeName || "") + " " + (area || CONFIG.market));
    loopEvent("food.maps.opened", { place: placeName, area: area || CONFIG.market });
    track("maps_opened", { place: placeName });
    window.open("https://www.google.com/maps/search/?api=1&query=" + q, "_blank");
  }

  /* ---- "What Sebastian Has Learned" — summary from local state ----------- */
  function generateLearnedSummary(p) {
    p = p || loadPalate();
    if (!p) return "";
    var bits = [];
    if (p.diningStyle && p.diningStyle.length) {
      bits.push("You lean toward " + humanList(p.diningStyle.slice(0, 3)).toLowerCase() + " places");
    }
    if (p.favoriteFlavors && p.favoriteFlavors.length) {
      bits.push("you keep coming back to " + humanList(p.favoriteFlavors.slice(0, 3)).toLowerCase() + " flavors");
    }
    if (p.localPreferences && p.localPreferences.waterfront) { bits.push("and you love a waterfront table"); }
    if (p.specialEvenings && p.specialEvenings.length) {
      bits.push("you save somewhere special for " + humanList(p.specialEvenings.slice(0, 2)).toLowerCase());
    }
    if (!bits.length) {
      return "I'm just getting to know your palate. Tell me a little more and every recommendation gets sharper.";
    }
    return "Here's what I'm noticing: " + bits.join(", ") + ". I'll keep that in mind.";
  }
  function humanList(arr) {
    if (!arr || !arr.length) return "";
    if (arr.length === 1) return arr[0];
    return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
  }

  /* ---- Public API on window.Palate --------------------------------------- */
  window.Palate = {
    config: CONFIG,
    LOOP_EVENTS: LOOP_EVENTS,
    newPalate: newPalate,
    load: loadPalate,
    save: savePalate,
    isSignedIn: isSignedIn,
    emailHash: emailHashPlaceholder,
    track: track,
    loopEvent: loopEvent,
    createLoopUserProfile: createLoopUserProfile,
    updateLoopUserProfile: updateLoopUserProfile,
    askSebastian: askSebastian,
    fetchNearbyRestaurants: fetchNearbyRestaurants,
    openGoogleMapsSearch: openGoogleMapsSearch,
    generateLearnedSummary: generateLearnedSummary
  };
  // Expose a couple of helpers globally for app.js convenience.
  window.openGoogleMapsSearch = openGoogleMapsSearch;
  window.askSebastian = askSebastian;
  window.createLoopUserProfile = createLoopUserProfile;
  window.updateLoopUserProfile = updateLoopUserProfile;

})(window, document);

/* ============================================================================
   FoodInMyCity — My Palate UI Controller
   ----------------------------------------------------------------------------
   Binds the signup modal, the My Palate profile, the Sebastian panel, and all
   entry-point CTAs to the data layer in window.Palate. Renders profile state,
   persists changes to localStorage, and fires structured Loop + GA4 events.
   ========================================================================== */
(function (window, document) {
  "use strict";
  var P = window.Palate;
  if (!P) { console.warn("[Palate] data layer missing"); return; }

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---- Overlay helpers (focus + scroll lock + Escape) -------------------- */
  var lastFocus = null;
  function openOverlay(el) {
    if (!el) return;
    lastFocus = document.activeElement;
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("palate-lock");
    var f = el.querySelector("input, button, textarea, [tabindex]");
    if (f) { try { f.focus(); } catch (e) {} }
  }
  function closeOverlay(el) {
    if (!el) return;
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".palate-overlay.open")) { document.body.classList.remove("palate-lock"); }
    if (lastFocus) { try { lastFocus.focus(); } catch (e) {} }
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { $$(".palate-overlay.open").forEach(closeOverlay); }
  });

  /* ---- Hero greeting: name only after signup; never fake "Matt" ---------- */
  function refreshGreeting() {
    var greet = $(".open-greeting");
    var p = P.load();
    if (greet) {
      if (p && p.user && p.user.name) { greet.textContent = "Welcome back, " + p.user.name.split(" ")[0]; }
      else { greet.textContent = "Welcome. I'm Sebastian."; }
    }
    // Header link label reflects state.
    $$("[data-palate-entry]").forEach(function (el) {
      el.textContent = P.isSignedIn() ? "My Palate" : "My Palate";
    });
  }

  /* ---- Signup modal ------------------------------------------------------ */
  function openSignup() {
    if (P.isSignedIn()) { openProfile(); return; }
    P.loopEvent("food.palate.signup.started", {});
    openOverlay($("#palateSignup"));
  }
  function handleCreatePalate() {
    var nameEl = $("#palateName"), emailEl = $("#palateEmail");
    var name = (nameEl && nameEl.value || "").trim();
    var email = (emailEl && emailEl.value || "").trim();
    var err = $("#palateSignupErr");
    if (!name || !email || email.indexOf("@") < 0) {
      if (err) { err.textContent = "Just your name and email to begin."; err.style.display = "block"; }
      return;
    }
    if (err) err.style.display = "none";
    var p = P.load() || P.newPalate();
    p.user.id = "u_" + Date.now().toString(36);
    p.user.name = name;
    p.user.email = email;
    p.user.createdAt = new Date().toISOString();
    p.user.market = P.config.market;
    p.localPreferences.homeMarket = p.localPreferences.homeMarket || P.config.market;
    P.save(p);
    P.createLoopUserProfile(p);
    P.loopEvent("food.palate.created", { userId: p.user.id });
    P.track("palate_created", {});
    closeOverlay($("#palateSignup"));
    refreshGreeting();
    openProfile();
  }

  /* ---- Profile: render + bind ------------------------------------------- */
  function renderProfile() {
    var p = P.load();
    if (!p) return;
    var hi = $("#palateHello");
    if (hi) hi.textContent = p.user.name ? ("Welcome, " + p.user.name.split(" ")[0] + ".") : "Your Palate";
    // multi-select chip groups
    $$("[data-palate-group]").forEach(function (group) {
      var key = group.getAttribute("data-palate-group");
      var selected = p[key] || [];
      $$(".palate-chip", group).forEach(function (chip) {
        var v = chip.getAttribute("data-value");
        chip.classList.toggle("on", selected.indexOf(v) > -1);
        chip.setAttribute("aria-pressed", selected.indexOf(v) > -1 ? "true" : "false");
      });
    });
    // text/textarea fields by data-palate-field "path"
    $$("[data-palate-field]").forEach(function (f) {
      var path = f.getAttribute("data-palate-field");
      var val = getPath(p, path);
      if (f.type === "checkbox") { f.checked = !!val; }
      else { f.value = val == null ? "" : val; }
    });
    var learned = $("#palateLearned");
    if (learned) {
      p.learnedSummary = P.generateLearnedSummary(p);
      P.save(p);
      learned.textContent = p.learnedSummary;
    }
    renderSaved(p);
  }
  function renderSaved(p) {
    var wrap = $("#palateSaved");
    if (!wrap) return;
    if (!p.savedItems || !p.savedItems.length) {
      wrap.innerHTML = '<p class="palate-empty">Nothing saved yet. As you explore, tap \u201cSave to My Palate\u201d and it will live here.</p>';
      return;
    }
    wrap.innerHTML = p.savedItems.map(function (it) {
      return '<div class="palate-saved-item"><span class="psi-kind">' + esc(it.kind) + '</span><span class="psi-name">' + esc(it.name) + '</span></div>';
    }).join("");
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function getPath(o, path) { return path.split(".").reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function setPath(o, path, val) {
    var ks = path.split("."), last = ks.pop();
    var t = ks.reduce(function (a, k) { return a[k]; }, o);
    t[last] = val;
  }

  function toggleChip(group, chip) {
    var p = P.load(); if (!p) { openSignup(); return; }
    var key = group.getAttribute("data-palate-group");
    var v = chip.getAttribute("data-value");
    p[key] = p[key] || [];
    var idx = p[key].indexOf(v);
    if (idx > -1) { p[key].splice(idx, 1); P.loopEvent("food.preference.removed", { section: key, value: v }); }
    else { p[key].push(v); P.loopEvent("food.preference.selected", { section: key, value: v }); }
    P.save(p);
    chip.classList.toggle("on");
    chip.setAttribute("aria-pressed", chip.classList.contains("on") ? "true" : "false");
    var learned = $("#palateLearned");
    if (learned) { p.learnedSummary = P.generateLearnedSummary(p); P.save(p); learned.textContent = p.learnedSummary; }
    P.track("palate_updated", { section: key });
  }
  function commitField(f) {
    var p = P.load(); if (!p) { openSignup(); return; }
    var path = f.getAttribute("data-palate-field");
    var val = f.type === "checkbox" ? f.checked : f.value;
    setPath(p, path, val);
    P.save(p);
    P.updateLoopUserProfile(definePatch(path, val));
    P.loopEvent("food.palate.updated", { field: path });
    P.track("palate_updated", { field: path });
  }
  function definePatch(path, val) { var o = {}; o[path] = val; return o; }

  /* ---- Save dish / restaurant / Tonight's Pick to My Palate -------------- */
  function saveItem(kind, name, extra) {
    var p = P.load();
    if (!p || !p.user.email) { openSignup(); return; }
    p.savedItems = p.savedItems || [];
    p.savedItems.unshift(Object.assign({ kind: kind, name: name, savedAt: new Date().toISOString() }, extra || {}));
    P.save(p);
    var evt = kind === "restaurant" ? "food.restaurant.saved" : "food.dish.saved";
    P.loopEvent(evt, { kind: kind, name: name });
    P.track(kind === "restaurant" ? "dish_saved" : "dish_saved", { name: name });
    renderSaved(p);
    flash(name + " saved to your Palate.");
  }

  /* ---- Sebastian panel --------------------------------------------------- */
  function openSebastianPanel() {
    P.loopEvent("food.sebastian.opened", {});
    P.track("sebastian_opened", {});
    var panel = $("#sebastianPanel");
    openOverlay(panel);
    var log = $("#sebLog");
    if (log && !log.getAttribute("data-greeted")) {
      addSebLine("seb", "Welcome. I'm Sebastian. The better I understand your palate, the better I can take care of tonight. Tell me what kind of evening you're hoping for\u2026 or simply say, \u201cSurprise me.\u201d");
      log.setAttribute("data-greeted", "1");
    }
  }
  async function handleSebAsk() {
    var input = $("#sebInput");
    var q = (input && input.value || "").trim();
    if (!q) return;
    addSebLine("you", q);
    input.value = "";
    P.loopEvent("food.sebastian.question.asked", { question: q });
    P.track("sebastian_question_asked", {});
    var context = { palate: P.load(), market: P.config.market };
    var res = await P.askSebastian(q, context);
    addSebLine("seb", res.message);
    P.loopEvent("food.sebastian.response.generated", { hasRecommendation: !!res.recommendation });
  }
  function addSebLine(who, text) {
    var log = $("#sebLog"); if (!log) return;
    var d = document.createElement("div");
    d.className = "seb-line seb-" + who;
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }

  /* ---- Surprise Me / demo recommendation --------------------------------- */
  var DEMO_PICKS = [
    { name: "The Gateway", dish: "Wood-grilled local fluke", why: "waterfront, smoky, independent" },
    { name: "Harbourside Table", dish: "Crispy soft-shell crab", why: "casual, crispy, seafood-forward" },
    { name: "The Quiet Room", dish: "Dry-aged ribeye", why: "fine dining, rich, special-evening" }
  ];
  function surpriseRecommendation() {
    var p = P.load();
    var pick = DEMO_PICKS[Math.floor(Math.random() * DEMO_PICKS.length)];
    P.loopEvent("food.recommendation.generated", { name: pick.name, dish: pick.dish, source: "surprise" });
    P.track("recommendation_generated", { name: pick.name });
    var panel = $("#sebastianPanel"); openSebastianPanel();
    addSebLine("seb", "Leave this one to me. Tonight I'd send you to " + pick.name + " for the " + pick.dish + " \u2014 " + pick.why + ". Want me to save it to your Palate?");
    // remember last pick for Save-to-Palate
    window.__lastPick = pick;
  }

  /* ---- Tiny toast -------------------------------------------------------- */
  function flash(msg) {
    var t = $("#palateToast");
    if (!t) { t = document.createElement("div"); t.id = "palateToast"; t.className = "palate-toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t.__h); t.__h = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ---- Open profile ------------------------------------------------------ */
  function openProfile() {
    if (!P.isSignedIn()) { openSignup(); return; }
    renderProfile();
    openOverlay($("#palateProfile"));
  }

  /* ---- Wire everything on DOM ready -------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    refreshGreeting();

    // close buttons
    $$("[data-palate-close]").forEach(function (b) {
      b.addEventListener("click", function () { closeOverlay(b.closest(".palate-overlay")); });
    });
    // backdrop click closes
    $$(".palate-overlay").forEach(function (ov) {
      ov.addEventListener("click", function (e) { if (e.target === ov) closeOverlay(ov); });
    });

    // signup
    var createBtn = $("#palateCreateBtn");
    if (createBtn) createBtn.addEventListener("click", handleCreatePalate);
    var signupForm = $("#palateSignupForm");
    if (signupForm) signupForm.addEventListener("submit", function (e) { e.preventDefault(); handleCreatePalate(); });

    // chip groups
    $$("[data-palate-group]").forEach(function (group) {
      group.addEventListener("click", function (e) {
        var chip = e.target.closest(".palate-chip");
        if (chip) toggleChip(group, chip);
      });
    });
    // fields
    $$("[data-palate-field]").forEach(function (f) {
      var ev = (f.tagName === "SELECT" || f.type === "checkbox") ? "change" : "blur";
      f.addEventListener(ev, function () { commitField(f); });
    });

    // Sebastian panel
    var sebSend = $("#sebSend");
    if (sebSend) sebSend.addEventListener("click", handleSebAsk);
    var sebInput = $("#sebInput");
    if (sebInput) sebInput.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); handleSebAsk(); } });

    // Save-from-Sebastian (last pick)
    var sebSave = $("#sebSavePick");
    if (sebSave) sebSave.addEventListener("click", function () {
      if (window.__lastPick) { saveItem("restaurant", window.__lastPick.name, { dish: window.__lastPick.dish }); P.loopEvent("food.recommendation.accepted", { name: window.__lastPick.name }); }
    });

    // delegate all data-cta clicks relevant to Palate/Sebastian (app.js handles its own switch too)
    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-cta]");
      if (!el) return;
      var cta = el.getAttribute("data-cta");
      switch (cta) {
        case "open-palate": case "build-my-palate": case "start-my-palate": openProfile(); break;
        case "talk-to-sebastian": openSebastianPanel(); break;
        case "surprise-me": surpriseRecommendation(); break;
        case "save-this": case "save-to-palate":
          saveItem(el.getAttribute("data-kind") || "restaurant", el.getAttribute("data-restaurant") || el.getAttribute("data-dish") || "This place", { dish: el.getAttribute("data-dish") || "" });
          break;
        case "take-me-there":
          P.openGoogleMapsSearch(el.getAttribute("data-restaurant") || "restaurant", P.config.market);
          break;
        default: break;
      }
    });
  });

  // expose controller hooks
  window.PalateUI = { openSignup: openSignup, openProfile: openProfile, openSebastianPanel: openSebastianPanel, surpriseRecommendation: surpriseRecommendation, saveItem: saveItem, refreshGreeting: refreshGreeting };

})(window, document);
