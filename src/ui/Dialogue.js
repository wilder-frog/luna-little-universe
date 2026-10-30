// ---------------------------------------------------------------------------
//  The pink letter panel — what opens at each of the ten memories.
//
//  Three gentle steps: the love note, then the exact Arabic poem fragment
//  (which collects her star), then anything extra this place offers (a song
//  card, a little activity, a minigame, the playlist link).
//
//  Nothing here is required. Escape closes at any point and the memory is
//  still counted from the moment the fragment is revealed.
// ---------------------------------------------------------------------------

import { Overlay, arabicBlock, englishBlock, toast } from "./Overlay.js";
import { t, pick, isArabic, getLanguage } from "./translations.js";
import { audio } from "../game/systems/Audio.js";
import { progress } from "../game/systems/Progress.js";
import { PHOTOS, PHOTO_CAPTIONS } from "../data/photos.js";
import { PLAYLIST_URL, PLAYLIST_NAME, PLAYLIST_DESCRIPTION, asset } from "../config.js";

/**
 * A framed photo, or `null` when this slot has no photo — callers simply
 * don't render anything, so an empty slot leaves no trace in the panel.
 */
export function photoFrame(slot) {
  const file = slot ? PHOTOS[slot] : null;
  if (!file) return null;

  const wrap = document.createElement("figure");
  wrap.className = "photo";

  const img = document.createElement("img");
  img.src = asset(`photos/${file}`);
  img.alt = "";
  img.loading = "lazy";
  // A missing or broken file removes the whole frame rather than showing a
  // broken-image icon or an empty box.
  img.addEventListener("error", () => wrap.remove());
  img.addEventListener("click", () => openPhotoLightbox(img.src));
  img.tabIndex = 0;
  img.setAttribute("role", "button");
  img.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPhotoLightbox(img.src);
    }
  });
  wrap.appendChild(img);

  const caption = PHOTO_CAPTIONS[slot]?.[getLanguage()];
  if (caption) {
    const cap = document.createElement("figcaption");
    cap.textContent = caption;
    wrap.appendChild(cap);
  }
  return wrap;
}

function openPhotoLightbox(src) {
  const ov = new Overlay({ className: "card--lightbox" });
  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  img.className = "lightbox__img";
  ov.body.appendChild(img);
  ov.open();
}

function songCard(song) {
  const el = document.createElement("div");
  el.className = "song";
  const label = document.createElement("div");
  label.className = "song__label";
  label.textContent = t("songCard");
  el.appendChild(label);

  const title = document.createElement("div");
  title.className = "song__title";
  title.setAttribute("dir", "ltr");
  title.textContent = song.title;
  el.appendChild(title);

  const artist = document.createElement("div");
  artist.className = "song__artist";
  artist.setAttribute("dir", "ltr");
  artist.textContent = song.artist;
  el.appendChild(artist);

  const meaning = isArabic()
    ? arabicBlock(song.meaningAr, "song__meaning")
    : englishBlock(song.meaningEn, "song__meaning");
  el.appendChild(meaning);
  return el;
}

/**
 * Open the letter for one checkpoint.
 *
 * @param {object} cp               a CHECKPOINTS entry
 * @param {object} handlers
 * @param {Function} handlers.onStar      called when a NEW star is collected
 * @param {Function} handlers.onActivity  (key, cp) run a small activity
 * @param {Function} handlers.onMinigame  (key, cp) run a minigame
 */
export function openLetter(cp, handlers = {}) {
  const alreadyDone = progress.isComplete(cp.id);
  let step = 0;

  const ov = new Overlay({ className: "card--letter" });

  // --- header ---------------------------------------------------------------
  const head = ov.add("div", "letter__head");
  head.innerHTML = `<span class="letter__icon" aria-hidden="true">${cp.icon}</span>`;
  const titles = document.createElement("div");
  titles.className = "letter__titles";
  const mainTitle = document.createElement("h2");
  mainTitle.className = "letter__title";
  mainTitle.textContent = pick(cp, "title");
  if (isArabic()) {
    mainTitle.setAttribute("dir", "rtl");
    mainTitle.setAttribute("lang", "ar");
  }
  const subTitle = document.createElement("div");
  subTitle.className = "letter__sub";
  subTitle.textContent = isArabic() ? cp.titleEn : cp.titleAr;
  subTitle.setAttribute("dir", isArabic() ? "ltr" : "rtl");
  subTitle.setAttribute("lang", isArabic() ? "en" : "ar");
  titles.appendChild(mainTitle);
  titles.appendChild(subTitle);
  head.appendChild(titles);

  const stepArea = ov.add("div", "letter__steps");
  const actions = ov.actions();

  // --- step 1: the note -----------------------------------------------------
  function renderNote() {
    stepArea.innerHTML = "";
    const photo = photoFrame(cp.photoSlot);
    if (photo) stepArea.appendChild(photo);

    const noteWrap = document.createElement("div");
    noteWrap.className = "note";
    let showing = getLanguage();

    const paint = () => {
      noteWrap.innerHTML = "";
      const block =
        showing === "ar"
          ? arabicBlock(cp.letterAr, "note__text")
          : englishBlock(cp.letterEn, "note__text");
      noteWrap.appendChild(block);

      const sw = document.createElement("button");
      sw.type = "button";
      sw.className = "btn btn--ghost btn--small";
      sw.textContent = showing === "ar" ? "Read in English" : "اقرئيها بالعربي";
      sw.addEventListener("click", () => {
        audio.play("click");
        showing = showing === "ar" ? "en" : "ar";
        paint();
      });
      noteWrap.appendChild(sw);
    };
    paint();
    stepArea.appendChild(noteWrap);

    if (alreadyDone) {
      const hint = document.createElement("p");
      hint.className = "letter__hint";
      hint.textContent = t("alreadyFound");
      if (isArabic()) hint.setAttribute("dir", "rtl");
      stepArea.appendChild(hint);
    }
  }

  // --- step 2: the poem fragment -------------------------------------------
  function renderFragment() {
    stepArea.innerHTML = "";
    const label = document.createElement("div");
    label.className = "fragment__label";
    label.textContent = t("poemFragment");
    if (isArabic()) label.setAttribute("dir", "rtl");
    stepArea.appendChild(label);

    // Always the original Arabic, RTL, line breaks preserved, never translated.
    const frag = arabicBlock(cp.poemExcerpt, "fragment__text");
    stepArea.appendChild(frag);

    const gained = progress.complete(cp.id);
    const star = document.createElement("div");
    star.className = "fragment__star";
    star.innerHTML = `<span class="fragment__starIcon" aria-hidden="true">✧</span><span>${
      gained ? t("starCollected") : t("alreadyFound")
    }</span>`;
    if (isArabic()) star.setAttribute("dir", "rtl");
    stepArea.appendChild(star);

    if (gained) {
      audio.play("collect");
      if (handlers.onStar) handlers.onStar(cp);
    }
  }

  // --- step 3: everything optional -----------------------------------------
  function renderExtras() {
    stepArea.innerHTML = "";

    if (cp.song) stepArea.appendChild(songCard(cp.song));
    if (cp.song2) stepArea.appendChild(songCard(cp.song2));

    if (cp.showsPlaylist) {
      const pl = document.createElement("div");
      pl.className = "playlist";
      const name = document.createElement("div");
      name.className = "playlist__name";
      name.setAttribute("dir", "ltr");
      name.textContent = PLAYLIST_NAME;
      const desc = document.createElement("div");
      desc.className = "playlist__desc";
      desc.setAttribute("dir", "ltr");
      desc.textContent = PLAYLIST_DESCRIPTION;
      pl.appendChild(name);
      pl.appendChild(desc);

      if (PLAYLIST_URL) {
        const link = document.createElement("a");
        link.className = "btn btn--primary";
        link.href = PLAYLIST_URL;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = t("openPlaylist");
        pl.appendChild(link);
      }
      const note = document.createElement("p");
      note.className = "playlist__note";
      note.textContent = t("playlistNote");
      if (isArabic()) note.setAttribute("dir", "rtl");
      pl.appendChild(note);
      stepArea.appendChild(pl);
    }

    const extras = document.createElement("div");
    extras.className = "letter__extras";

    if (cp.activity && handlers.onActivity) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn--soft";
      b.textContent = pick(cp, "activityLabel");
      b.addEventListener("click", () => {
        audio.play("click");
        handlers.onActivity(cp.activity, cp);
      });
      extras.appendChild(b);
    }

    if (cp.minigame && handlers.onMinigame) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn--soft";
      b.textContent = pick(cp, "minigameLabel");
      if (progress.minigameDone(cp.minigame)) b.textContent += " ✓";
      b.addEventListener("click", () => {
        audio.play("click");
        handlers.onMinigame(cp.minigame, cp);
      });
      extras.appendChild(b);
    }

    if (extras.children.length) stepArea.appendChild(extras);

    const saved = document.createElement("p");
    saved.className = "letter__hint";
    saved.textContent = t("progressSaved");
    if (isArabic()) saved.setAttribute("dir", "rtl");
    stepArea.appendChild(saved);
  }

  // --- step machine ---------------------------------------------------------
  const nextBtn = actions.button(t("next"), () => advance(), "primary", true);
  const closeBtn = actions.button(t("close"), () => ov.close(), "ghost");

  function paintStep() {
    if (step === 0) {
      renderNote();
      nextBtn.textContent = t("revealFragment");
      nextBtn.hidden = false;
      nextBtn.disabled = false;
    } else if (step === 1) {
      renderFragment();
      nextBtn.textContent = t("next");
      nextBtn.hidden = false;
      nextBtn.disabled = false;
    } else {
      renderExtras();
      // Gone for good on the last step — not just invisible, so it can't be
      // tabbed to or clicked.
      nextBtn.hidden = true;
      nextBtn.disabled = true;
      closeBtn.className = "btn btn--primary";
      closeBtn.textContent = t("done");
      closeBtn.focus();
    }
    stepArea.scrollTop = 0;
  }

  function advance() {
    if (step >= 2) return;
    step += 1;
    if (step === 1) audio.play("envelope");
    paintStep();
    if (step < 2) nextBtn.focus();
  }

  // Enter / Space advance while the panel is on an early step.
  ov.card.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && document.activeElement === ov.card) {
      e.preventDefault();
      advance();
    }
  });

  paintStep();
  audio.play("envelope");
  ov.open();
  void toast;
  return ov;
}

/** A plain little message card — used for signs and the five secrets. */
export function openNote({ title, body, arabic = false, extraHtml }) {
  const ov = new Overlay({ className: "card--note" });
  const h = ov.add("h2", "note__title");
  h.textContent = title;
  if (arabic) {
    h.setAttribute("dir", "rtl");
    h.setAttribute("lang", "ar");
  }
  const block = arabic
    ? arabicBlock(body, "note__text")
    : englishBlock(body, "note__text");
  ov.body.appendChild(block);
  if (extraHtml) ov.add("div", "note__extra", extraHtml);
  ov.actions().button(t("close"), () => ov.close(), "primary", true);
  ov.open();
  return ov;
}
