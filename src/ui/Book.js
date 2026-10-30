// ---------------------------------------------------------------------------
//  The poem book.
//
//  The whole poem, exactly as it was written, in one scrollable RTL page.
//  `white-space: pre-wrap` keeps every line break and trailing space; nothing
//  is trimmed, translated or corrected.
//
//  The last three lines wait at the bottom behind a "Continue" button so they
//  land on their own — but they are never permanently hidden: "Show the whole
//  poem" reveals them at any time, and once seen they stay.
// ---------------------------------------------------------------------------

import { Overlay, arabicBlock } from "./Overlay.js";
import { t, isArabic } from "./translations.js";
import { audio } from "../game/systems/Audio.js";
import { progress } from "../game/systems/Progress.js";
import {
  POEM_BODY,
  POEM_ENDING,
  POEM_TITLE_EN,
  POEM_TITLE_AR
} from "../data/poem.js";

const FONT_STEPS = [16, 18, 20, 23, 26, 30];
let fontIndex = 2;

/**
 * @param {object} opts
 * @param {Function} [opts.onFinished] called once the ending has been revealed
 * @param {Function} [opts.onClose]
 */
export function openBook(opts = {}) {
  let endingShown = false;

  const ov = new Overlay({
    className: "card--book",
    onClose: opts.onClose
  });

  // --- header ---------------------------------------------------------------
  const head = ov.add("div", "book__head");

  const titles = document.createElement("div");
  titles.className = "book__titles";
  const h2 = document.createElement("h2");
  h2.className = "book__title";
  h2.textContent = isArabic() ? POEM_TITLE_AR : POEM_TITLE_EN;
  h2.setAttribute("dir", isArabic() ? "rtl" : "ltr");
  h2.setAttribute("lang", isArabic() ? "ar" : "en");
  const h3 = document.createElement("div");
  h3.className = "book__subtitle";
  h3.textContent = isArabic() ? POEM_TITLE_EN : POEM_TITLE_AR;
  h3.setAttribute("dir", isArabic() ? "ltr" : "rtl");
  h3.setAttribute("lang", isArabic() ? "en" : "ar");
  titles.appendChild(h2);
  titles.appendChild(h3);
  head.appendChild(titles);

  const tools = document.createElement("div");
  tools.className = "book__tools";

  const smaller = document.createElement("button");
  smaller.type = "button";
  smaller.className = "btn btn--ghost btn--small";
  smaller.textContent = t("fontSmaller");
  smaller.setAttribute("aria-label", "Smaller text");

  const bigger = document.createElement("button");
  bigger.type = "button";
  bigger.className = "btn btn--ghost btn--small";
  bigger.textContent = t("fontBigger");
  bigger.setAttribute("aria-label", "Larger text");

  const showAll = document.createElement("button");
  showAll.type = "button";
  showAll.className = "btn btn--ghost btn--small";
  showAll.textContent = t("showWholePoem");

  tools.append(smaller, bigger, showAll);
  head.appendChild(tools);

  // --- the poem -------------------------------------------------------------
  const scroller = ov.add("div", "book__scroll");
  scroller.tabIndex = 0;
  scroller.setAttribute("role", "document");

  const page = document.createElement("div");
  page.className = "book__page";
  page.appendChild(arabicBlock(POEM_BODY, "poem"));
  scroller.appendChild(page);

  // The gentle hand-off to the final lines.
  const endSlot = document.createElement("div");
  endSlot.className = "book__end";
  page.appendChild(endSlot);

  const continueBtn = document.createElement("button");
  continueBtn.type = "button";
  continueBtn.className = "btn btn--primary book__continue";
  continueBtn.textContent = t("continuePoem");
  endSlot.appendChild(continueBtn);

  function applyFont() {
    page.style.fontSize = `${FONT_STEPS[fontIndex]}px`;
  }
  applyFont();

  smaller.addEventListener("click", () => {
    audio.play("click");
    fontIndex = Math.max(0, fontIndex - 1);
    applyFont();
  });
  bigger.addEventListener("click", () => {
    audio.play("click");
    fontIndex = Math.min(FONT_STEPS.length - 1, fontIndex + 1);
    applyFont();
  });

  function revealEnding(scroll = true) {
    if (endingShown) return;
    endingShown = true;
    continueBtn.remove();
    showAll.disabled = true;
    showAll.classList.add("is-done");

    const ending = arabicBlock(POEM_ENDING, "poem poem--ending");
    endSlot.appendChild(ending);
    requestAnimationFrame(() => ending.classList.add("is-pulsing"));

    audio.play("twinkle");
    progress.markPoemRead();

    if (scroll) {
      requestAnimationFrame(() => {
        ending.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }

    // Offer the ending note once the last lines have had their moment.
    if (opts.onFinished) {
      const row = document.createElement("div");
      row.className = "book__after";
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn--primary";
      b.textContent = t("next");
      b.addEventListener("click", () => {
        audio.play("click");
        ov.close();
        opts.onFinished();
      });
      row.appendChild(b);
      endSlot.appendChild(row);
    }
  }

  continueBtn.addEventListener("click", () => {
    audio.play("click");
    revealEnding();
  });
  showAll.addEventListener("click", () => {
    audio.play("click");
    revealEnding(false);
  });

  // If she has read it before, don't make her hunt for the ending again.
  if (progress.state.hasReadPoem) {
    revealEnding(false);
  }

  const actions = ov.actions();
  actions.button(t("back"), () => ov.close(), "ghost");

  ov.open();
  requestAnimationFrame(() => scroller.focus());
  return ov;
}
