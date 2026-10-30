// ---------------------------------------------------------------------------
//  Everything that frames the game: the title screen, the HUD, the little map,
//  settings, the unlock announcement, and the Moon Sanctuary.
// ---------------------------------------------------------------------------

import { Overlay, arabicBlock, englishBlock, toast } from "./Overlay.js";
import {
  t,
  setLanguage,
  getLanguage,
  isArabic,
  pick,
  num
} from "./translations.js";
import { audio } from "../game/systems/Audio.js";
import { progress } from "../game/systems/Progress.js";
import { openBook } from "./Book.js";
import { photoFrame } from "./Dialogue.js";
import { CHECKPOINTS, UNLOCK_MESSAGE } from "../data/story.js";
import { FINALE, SANCTUARY_WELCOME } from "../data/finale.js";
import { GAME_SUBTITLE_EN, GAME_SUBTITLE_AR } from "../config.js";
import { catPortraitDataURL } from "../game/world/art.js";
import { ANCHORS } from "../game/world/ground.js";

// ===========================================================================
//  Language switch (shared by the title screen and settings)
// ===========================================================================

const langListeners = new Set();
export function onLanguageChange(fn) {
  langListeners.add(fn);
  return () => langListeners.delete(fn);
}

function applyLanguage(lang) {
  setLanguage(lang);
  progress.setLanguage(lang);
  for (const fn of langListeners) fn(lang);
}

function languageToggle() {
  const wrap = document.createElement("div");
  wrap.className = "langToggle";
  wrap.setAttribute("role", "group");
  wrap.setAttribute("aria-label", t("language"));

  const mk = (code, label, dir) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `langToggle__btn ${getLanguage() === code ? "is-on" : ""}`;
    b.textContent = label;
    b.setAttribute("dir", dir);
    b.setAttribute("aria-pressed", String(getLanguage() === code));
    b.addEventListener("click", () => {
      audio.play("click");
      applyLanguage(code);
    });
    return b;
  };
  wrap.appendChild(mk("en", "EN", "ltr"));
  wrap.appendChild(mk("ar", "عربي", "rtl"));
  return wrap;
}

// ===========================================================================
//  Title screen
// ===========================================================================

/** @param {Function} onBegin called with { fresh: boolean } */
export function showTitle(onBegin) {
  const ov = new Overlay({ className: "card--title", closable: false });
  ov.el.classList.add("overlay--title");

  function paint() {
    ov.body.innerHTML = "";

    const stars = document.createElement("div");
    stars.className = "title__stars";
    for (let i = 0; i < 40; i++) {
      const s = document.createElement("span");
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.animationDelay = `${Math.random() * 4}s`;
      s.style.opacity = String(0.3 + Math.random() * 0.7);
      stars.appendChild(s);
    }
    ov.body.appendChild(stars);

    const forLuna = ov.add("div", "title__for");
    forLuna.textContent = t("forLuna");

    const cat = document.createElement("img");
    cat.src = catPortraitDataURL();
    cat.className = "title__cat";
    cat.alt = "";
    ov.body.appendChild(cat);

    const h1 = ov.add("h1", "title__name");
    h1.innerHTML = `LUNA<span class="title__dash">—</span><span class="title__tag">A Little Universe for You</span>`;

    const sub = ov.add("div", "title__sub");
    sub.textContent = isArabic() ? GAME_SUBTITLE_AR : GAME_SUBTITLE_EN;
    if (isArabic()) {
      sub.setAttribute("dir", "rtl");
      sub.setAttribute("lang", "ar");
    }

    const artemis = ov.add("div", "title__artemis");
    artemis.textContent = t("toMyArtemis");

    const motto = ov.add("div", "title__motto");
    motto.textContent = t("twoTeams");
    if (isArabic()) motto.setAttribute("dir", "rtl");

    ov.body.appendChild(languageToggle());

    const actions = ov.actions();
    const resume = progress.hasAnyProgress;
    actions.button(
      resume ? t("continueAdventure") : t("begin"),
      () => {
        audio.unlock();
        audio.play("click");
        ov.close();
        onBegin({ fresh: !resume });
      },
      "primary",
      true
    );
    if (resume) {
      actions.button(t("startOver"), () => {
        audio.unlock();
        confirmRestart(() => {
          ov.close();
          onBegin({ fresh: true });
        });
      }, "ghost");
    }

    const madeBy = ov.add("div", "title__made");
    madeBy.textContent = t("madeBy");

    const audioNote = ov.add("div", "title__audioNote");
    audioNote.textContent = t("audioNotice");
  }

  const stop = onLanguageChange(paint);
  const origClose = ov.close.bind(ov);
  ov.close = () => {
    stop();
    origClose();
  };

  paint();
  ov.open();
  return ov;
}

// ===========================================================================
//  Intro card
// ===========================================================================

export function showIntro(onDone) {
  const ov = new Overlay({ className: "card--intro", onClose: onDone });
  ov.add("div", "intro__moon", "🌙");
  const en = englishBlock(
    "Some stories start with a race. Ours became a whole universe.",
    "intro__line"
  );
  const ar = arabicBlock(
    "بعض الحكايات تبدأ بسباق… وحكايتنا صارت كون كامل.",
    "intro__line intro__line--ar"
  );
  ov.body.appendChild(isArabic() ? ar : en);
  ov.body.appendChild(isArabic() ? en : ar);

  const hint = ov.add("div", "intro__hint");
  hint.innerHTML = `
    <div>${t("controlsMove")}</div>
    <div>${t("controlsInteract")}</div>
    <div>${t("controlsMap")}</div>
    <div>${t("controlsClose")}</div>`;
  if (isArabic()) hint.setAttribute("dir", "rtl");

  ov.actions().button(t("gotIt"), () => ov.close(), "primary", true);
  progress.markIntroSeen();
  ov.open();
  return ov;
}

// ===========================================================================
//  HUD
// ===========================================================================

let hudEl = null;
let hudStars = null;
let hudCount = null;

let hudCleanup = null;

export function buildHud({ onMap, onSettings, onHelp }) {
  // Restarting the world calls this again — replace the old HUD instead of
  // stacking a second one on top of it.
  if (hudCleanup) hudCleanup();
  document.getElementById("hud")?.remove();

  hudEl = document.createElement("div");
  hudEl.id = "hud";

  const left = document.createElement("div");
  left.className = "hud__left";

  const counter = document.createElement("div");
  counter.className = "hud__counter";
  counter.innerHTML = `<span class="hud__heart" aria-hidden="true">♡</span>`;
  hudCount = document.createElement("span");
  hudCount.className = "hud__count";
  counter.appendChild(hudCount);
  left.appendChild(counter);

  hudStars = document.createElement("div");
  hudStars.className = "hud__stars";
  hudStars.setAttribute("aria-hidden", "true");
  left.appendChild(hudStars);

  const right = document.createElement("div");
  right.className = "hud__right";

  const mk = (label, title, fn) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "hud__btn";
    b.textContent = label;
    b.title = title;
    b.setAttribute("aria-label", title);
    b.addEventListener("click", () => {
      audio.play("click");
      fn();
    });
    return b;
  };

  right.appendChild(mk("🗺", t("mapHint"), onMap));
  right.appendChild(mk("⚙", t("settings"), onSettings));
  right.appendChild(mk("?", t("help"), onHelp));

  hudEl.append(left, right);
  document.body.appendChild(hudEl);

  refreshHud();
  const offProgress = progress.onChange(refreshHud);
  const offLang = onLanguageChange(() => {
    const btns = right.querySelectorAll(".hud__btn");
    btns[0].title = t("mapHint");
    btns[1].title = t("settings");
    btns[2].title = t("help");
    refreshHud();
  });
  hudCleanup = () => {
    offProgress();
    offLang();
    hudCleanup = null;
  };

  return hudEl;
}

export function refreshHud() {
  if (!hudEl) return;
  const n = progress.count;
  hudCount.textContent = `${t("memories")} ${num(n)}/${num(progress.total)}`;
  hudCount.setAttribute("dir", isArabic() ? "rtl" : "ltr");
  hudStars.innerHTML = "";
  for (let i = 0; i < progress.total; i++) {
    const s = document.createElement("span");
    s.className = `hud__star ${i < n ? "is-on" : ""}`;
    s.textContent = i < n ? "✦" : "·";
    hudStars.appendChild(s);
  }
}

export function setHudVisible(on) {
  if (hudEl) hudEl.classList.toggle("is-hidden", !on);
}

// ===========================================================================
//  The little map (M)
// ===========================================================================

export function showMap() {
  const ov = new Overlay({ className: "card--map" });
  const h = ov.add("h2", "map__title");
  h.textContent = t("mapTitle");
  if (isArabic()) h.setAttribute("dir", "rtl");

  const grid = ov.add("div", "map__grid");
  const W = 520;
  const H = 360;
  const board = document.createElement("div");
  board.className = "map__board";
  board.style.width = `${W}px`;
  board.style.height = `${H}px`;
  grid.appendChild(board);

  // Anchors are authored coords (1200x800) — scale them into the map box.
  const sx = W / 1200;
  const sy = H / 800;

  // The plaza / gate in the middle.
  const hub = document.createElement("div");
  hub.className = `map__hub ${progress.finaleUnlocked ? "is-open" : ""}`;
  hub.style.left = `${ANCHORS.plaza.x * sx}px`;
  hub.style.top = `${ANCHORS.plaza.y * sy}px`;
  hub.textContent = progress.finaleUnlocked ? "🌙" : "🔒";
  hub.title = t("sanctuaryHint");
  board.appendChild(hub);

  for (const cp of CHECKPOINTS) {
    const a = ANCHORS[cp.id];
    if (!a) continue;
    const found = progress.isComplete(cp.id);
    const dot = document.createElement("div");
    dot.className = `map__dot ${found ? "is-found" : ""}`;
    dot.style.left = `${a.x * sx}px`;
    dot.style.top = `${a.y * sy}px`;
    dot.innerHTML = `<span class="map__icon">${found ? "✦" : cp.icon}</span>`;
    const label = document.createElement("span");
    label.className = "map__label";
    label.textContent = pick(cp, "title");
    if (isArabic()) {
      label.setAttribute("dir", "rtl");
      label.setAttribute("lang", "ar");
    }
    dot.appendChild(label);
    dot.title = `${pick(cp, "title")} — ${found ? t("found") : t("notFound")}`;
    board.appendChild(dot);
  }

  const legend = ov.add("div", "map__legend");
  legend.innerHTML = `<span><b>✦</b> ${t("found")}</span><span><b>·</b> ${t(
    "notFound"
  )}</span>`;
  if (isArabic()) legend.setAttribute("dir", "rtl");

  ov.actions().button(t("close"), () => ov.close(), "primary", true);
  ov.open();
  return ov;
}

// ===========================================================================
//  Settings
// ===========================================================================

export function showSettings({ onRestart } = {}) {
  const ov = new Overlay({ className: "card--settings" });

  function paint() {
    ov.body.innerHTML = "";
    const h = ov.add("h2", "settings__title");
    h.textContent = t("settings");
    if (isArabic()) h.setAttribute("dir", "rtl");

    const rows = ov.add("div", "settings__rows");

    const row = (labelText) => {
      const r = document.createElement("div");
      r.className = "settings__row";
      const l = document.createElement("div");
      l.className = "settings__label";
      l.textContent = labelText;
      if (isArabic()) l.setAttribute("dir", "rtl");
      r.appendChild(l);
      rows.appendChild(r);
      return r;
    };

    const toggle = (r, on, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `switch ${on ? "is-on" : ""}`;
      b.setAttribute("role", "switch");
      b.setAttribute("aria-checked", String(on));
      b.innerHTML = `<span class="switch__knob"></span><span class="switch__text">${
        on ? t("on") : t("off")
      }</span>`;
      b.addEventListener("click", () => {
        fn(!on);
        paint();
      });
      r.appendChild(b);
    };

    const slider = (r, value, fn) => {
      const i = document.createElement("input");
      i.type = "range";
      i.min = "0";
      i.max = "100";
      i.step = "5";
      i.value = String(Math.round(value * 100));
      i.className = "slider";
      i.addEventListener("input", () => fn(Number(i.value) / 100));
      r.appendChild(i);
    };

    const a = progress.state.audio;

    const musicRow = row(t("music"));
    toggle(musicRow, a.musicEnabled, (on) => audio.setMusicEnabled(on));
    slider(musicRow, a.musicVolume, (v) => audio.setMusicVolume(v));

    const sfxRow = row(t("sfx"));
    toggle(sfxRow, a.sfxEnabled, (on) => audio.setSfxEnabled(on));
    slider(sfxRow, a.sfxVolume, (v) => audio.setSfxVolume(v));

    const langRow = row(t("language"));
    langRow.appendChild(languageToggle());

    if (!audio.anyAudioLoaded && audio.loadFailures.length) {
      const warn = ov.add("p", "settings__warn");
      warn.textContent =
        "Some audio files could not load — the game plays fine without them.";
    }

    const controls = ov.add("div", "settings__controls");
    controls.innerHTML = `
      <h3>${t("controlsTitle")}</h3>
      <div>${t("controlsMove")}</div>
      <div>${t("controlsInteract")}</div>
      <div>${t("controlsMap")}</div>
      <div>${t("controlsClose")}</div>`;
    if (isArabic()) controls.setAttribute("dir", "rtl");

    const actions = ov.actions();
    actions.button(t("close"), () => ov.close(), "primary", true);
    actions.button(t("restart"), () => {
      confirmRestart(() => {
        ov.close();
        if (onRestart) onRestart();
      });
    }, "danger");
  }

  const stop = onLanguageChange(paint);
  const origClose = ov.close.bind(ov);
  ov.close = () => {
    stop();
    origClose();
  };

  paint();
  ov.open();
  return ov;
}

export function confirmRestart(onConfirm) {
  const ov = new Overlay({ className: "card--confirm" });
  const h = ov.add("h2", "note__title");
  h.textContent = t("restart");
  if (isArabic()) h.setAttribute("dir", "rtl");
  const body = isArabic()
    ? arabicBlock(t("restartConfirm"), "note__text")
    : englishBlock(t("restartConfirm"), "note__text");
  ov.body.appendChild(body);
  const actions = ov.actions();
  actions.button(t("restartNo"), () => ov.close(), "ghost", true);
  actions.button(t("restartYes"), () => {
    progress.reset();
    setLanguage(progress.state.preferredLanguage);
    refreshHud();
    ov.close();
    if (onConfirm) onConfirm();
  }, "danger");
  ov.open();
  return ov;
}

export function showHelp() {
  const ov = new Overlay({ className: "card--note" });
  const h = ov.add("h2", "note__title");
  h.textContent = t("controlsTitle");
  if (isArabic()) h.setAttribute("dir", "rtl");
  const list = ov.add("div", "help__list");
  list.innerHTML = `
    <div>${t("controlsMove")}</div>
    <div>${t("controlsInteract")}</div>
    <div>${t("controlsMap")}</div>
    <div>${t("controlsClose")}</div>
    <div>${t("progressSaved")}</div>`;
  if (isArabic()) list.setAttribute("dir", "rtl");
  ov.actions().button(t("gotIt"), () => ov.close(), "primary", true);
  ov.open();
  return ov;
}

// ===========================================================================
//  10/10 announcement
// ===========================================================================

export function showUnlock(onDone) {
  const ov = new Overlay({ className: "card--unlock", onClose: onDone });
  ov.el.classList.add("overlay--glow");

  const moon = ov.add("div", "unlock__moon", "🌙");
  void moon;

  const main = ov.add("div", "unlock__main");
  main.textContent = isArabic() ? UNLOCK_MESSAGE.ar : UNLOCK_MESSAGE.en;
  main.setAttribute("dir", isArabic() ? "rtl" : "ltr");

  const sub = ov.add("div", "unlock__sub");
  sub.textContent = isArabic() ? UNLOCK_MESSAGE.subAr : UNLOCK_MESSAGE.subEn;
  sub.setAttribute("dir", isArabic() ? "rtl" : "ltr");

  const trail = ov.add("div", "unlock__trail");
  for (let i = 0; i < 12; i++) {
    const s = document.createElement("span");
    s.textContent = "✦";
    s.style.animationDelay = `${i * 0.08}s`;
    trail.appendChild(s);
  }

  const hint = ov.add("div", "unlock__hint");
  hint.textContent = isArabic()
    ? "البوابة في وسط الساحة انفتحت لك."
    : "The gate in the middle of the plaza just opened for you.";
  hint.setAttribute("dir", isArabic() ? "rtl" : "ltr");

  ov.actions().button(t("next"), () => ov.close(), "primary", true);
  audio.play("fanfare");
  ov.open();
  return ov;
}

// ===========================================================================
//  Moon Sanctuary
// ===========================================================================

/** The final area: a sky-like room with a giant moon and the poem. */
export function showSanctuary({ onLeave } = {}) {
  const ov = new Overlay({ className: "card--sanctuary", closable: false });
  ov.el.classList.add("overlay--sanctuary");

  function paint() {
    ov.body.innerHTML = "";

    const sky = document.createElement("div");
    sky.className = "sanct__sky";
    for (let i = 0; i < 60; i++) {
      const s = document.createElement("span");
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.animationDelay = `${Math.random() * 5}s`;
      s.style.transform = `scale(${0.6 + Math.random()})`;
      sky.appendChild(s);
    }
    ov.body.appendChild(sky);

    const moon = ov.add("div", "sanct__moon");
    moon.setAttribute("aria-hidden", "true");

    const pages = ov.add("div", "sanct__pages");
    pages.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 6; i++) {
      const p = document.createElement("span");
      p.style.left = `${8 + i * 15}%`;
      p.style.animationDelay = `${i * 0.7}s`;
      pages.appendChild(p);
    }

    const welcome = ov.add("div", "sanct__welcome");
    welcome.textContent = isArabic() ? SANCTUARY_WELCOME.ar : SANCTUARY_WELCOME.en;
    welcome.setAttribute("dir", isArabic() ? "rtl" : "ltr");

    const title = ov.add("div", "sanct__title");
    title.textContent = t("poemTitle");
    title.setAttribute("dir", isArabic() ? "rtl" : "ltr");

    const actions = ov.actions();
    actions.button(
      t("openPoem"),
      () => openBook({ onFinished: () => showFinale({ onLeave, sanctuary: ov }) }),
      "primary",
      true
    );
    if (progress.state.hasReadPoem) {
      actions.button(t("next"), () => showFinale({ onLeave, sanctuary: ov }), "soft");
    }
    actions.button(t("backToWorld"), () => {
      ov.close();
      if (onLeave) onLeave();
    }, "ghost");
  }

  const stop = onLanguageChange(paint);
  const origClose = ov.close.bind(ov);
  ov.close = () => {
    stop();
    origClose();
  };

  paint();
  audio.playMusic("sanctuary");
  ov.open();
  return ov;
}

// ===========================================================================
//  The ending note (editable — see src/data/finale.js)
// ===========================================================================

export function showFinale({ onLeave, sanctuary } = {}) {
  const ov = new Overlay({ className: "card--finale", closable: false });

  function paint() {
    ov.body.innerHTML = "";

    const h = ov.add("h2", "finale__heading");
    h.textContent = isArabic() ? FINALE.headingAr : FINALE.headingEn;
    h.setAttribute("dir", isArabic() ? "rtl" : "ltr");

    if (FINALE.showPhoto) {
      const photo = photoFrame(FINALE.photoSlot);
      if (photo) ov.body.appendChild(photo);
    }

    // The note, in one language at a time, with a switch to read the other.
    const noteWrap = document.createElement("div");
    noteWrap.className = "finale__note";
    ov.body.appendChild(noteWrap);

    let showing = getLanguage();
    const paintNote = () => {
      noteWrap.innerHTML = "";
      noteWrap.appendChild(
        showing === "ar"
          ? arabicBlock(FINALE.bodyAr, "finale__body")
          : englishBlock(FINALE.bodyEn, "finale__body")
      );
      const other = document.createElement("button");
      other.type = "button";
      other.className = "btn btn--ghost btn--small";
      other.textContent =
        showing === "ar" ? "Read in English" : "اقرئيها بالعربي";
      other.addEventListener("click", () => {
        audio.play("click");
        showing = showing === "ar" ? "en" : "ar";
        paintNote();
      });
      noteWrap.appendChild(other);
    };
    paintNote();

    const sig = ov.add("div", "finale__sig");
    sig.textContent = isArabic() ? FINALE.signatureAr : FINALE.signatureEn;
    sig.setAttribute("dir", isArabic() ? "rtl" : "ltr");

    const hearts = ov.add("div", "finale__hearts");
    hearts.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 9; i++) {
      const s = document.createElement("span");
      s.textContent = "♡";
      s.style.left = `${5 + i * 11}%`;
      s.style.animationDelay = `${i * 0.35}s`;
      hearts.appendChild(s);
    }

    const actions = ov.actions();
    actions.button(t("readAgain"), () => openBook({}), "soft", true);
    actions.button(t("backToWorld"), () => {
      ov.close();
      if (sanctuary && sanctuary.isOpen) sanctuary.close();
      if (onLeave) onLeave();
    }, "primary");
    actions.button(t("settings"), () => showSettings({}), "ghost");
  }

  const stop = onLanguageChange(paint);
  const origClose = ov.close.bind(ov);
  ov.close = () => {
    stop();
    origClose();
  };

  paint();
  audio.play("twinkle");
  ov.open();
  void toast;
  return ov;
}

/** Shown when she reaches the gate before finding all ten. */
export function showGateLocked() {
  const ov = new Overlay({ className: "card--note" });
  const h = ov.add("h2", "note__title");
  h.textContent = t("gateLocked");
  if (isArabic()) h.setAttribute("dir", "rtl");
  const body = isArabic()
    ? arabicBlock(t("gateLockedSub"), "note__text")
    : englishBlock(t("gateLockedSub"), "note__text");
  ov.body.appendChild(body);
  const count = ov.add("div", "gate__count");
  count.textContent = `${num(progress.count)} / ${num(progress.total)}`;
  ov.actions().button(t("close"), () => ov.close(), "primary", true);
  ov.open();
  return ov;
}
