// ---------------------------------------------------------------------------
//  Overlay — every panel in the game is one of these.
//
//  DOM rather than Phaser text, because Arabic needs real text shaping, real
//  RTL and real scrolling. Each overlay traps focus, closes on Escape, and
//  tells the world scene to stop listening to the keyboard while it's open.
// ---------------------------------------------------------------------------

import { audio } from "../game/systems/Audio.js";
import { t } from "./translations.js";

const root = () => document.getElementById("overlay-root");

let openCount = 0;
const listeners = new Set();

/** Let the game know whether input should be paused. */
export function onOverlayChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function overlaysOpen() {
  return openCount > 0;
}

function notify() {
  for (const fn of listeners) fn(openCount > 0);
}

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export class Overlay {
  /**
   * @param {object} opts
   * @param {string} [opts.className]  extra class on the card
   * @param {boolean} [opts.closable]  show the × and allow Escape (default true)
   * @param {boolean} [opts.dim]       dim the game behind (default true)
   * @param {Function} [opts.onClose]
   */
  constructor(opts = {}) {
    this.opts = { closable: true, dim: true, ...opts };
    this.el = document.createElement("div");
    this.el.className = `overlay ${this.opts.dim ? "" : "overlay--clear"}`;
    this.el.setAttribute("role", "dialog");
    this.el.setAttribute("aria-modal", "true");

    this.card = document.createElement("div");
    this.card.className = `card ${this.opts.className || ""}`;
    this.el.appendChild(this.card);

    if (this.opts.closable) {
      this.closeBtn = document.createElement("button");
      this.closeBtn.className = "card__close";
      this.closeBtn.type = "button";
      this.closeBtn.innerHTML = "&times;";
      this.closeBtn.setAttribute("aria-label", t("close"));
      this.closeBtn.addEventListener("click", () => this.close());
      this.card.appendChild(this.closeBtn);
    }

    this.body = document.createElement("div");
    this.body.className = "card__body";
    this.card.appendChild(this.body);

    this.onKeyDown = this.handleKey.bind(this);
  }

  handleKey(e) {
    if (e.key === "Escape" && this.opts.closable) {
      e.preventDefault();
      e.stopPropagation();
      this.close();
      return;
    }
    if (e.key === "Tab") {
      const items = [...this.card.querySelectorAll(FOCUSABLE)].filter(
        (n) => !n.disabled && n.offsetParent !== null
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  open() {
    if (this.isOpen) return this;
    this.isOpen = true;
    this.prevFocus = document.activeElement;
    root().appendChild(this.el);
    openCount += 1;
    notify();
    audio.duck(true);
    // Capture phase so Escape reaches us before the game's own handlers.
    document.addEventListener("keydown", this.onKeyDown, true);

    // A background tab never runs requestAnimationFrame, which would leave
    // the panel stuck at opacity 0 until the tab is looked at. The timer is
    // a backstop so the panel is always really open, visible or not.
    let revealed = false;
    const reveal = () => {
      if (revealed || !this.isOpen) return;
      revealed = true;
      this.el.classList.add("is-in");
      const target =
        this.card.querySelector("[data-autofocus]") ||
        this.card.querySelector(FOCUSABLE);
      if (target) target.focus();
    };
    requestAnimationFrame(reveal);
    setTimeout(reveal, 60);

    return this;
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    document.removeEventListener("keydown", this.onKeyDown, true);
    this.el.classList.remove("is-in");
    openCount = Math.max(0, openCount - 1);
    notify();
    if (openCount === 0) audio.duck(false);
    const el = this.el;
    setTimeout(() => el.remove(), 220);
    if (this.prevFocus && this.prevFocus.focus) {
      try {
        this.prevFocus.focus();
      } catch {
        /* the previous element may be gone */
      }
    }
    if (this.opts.onClose) this.opts.onClose();
  }

  // --- small content helpers ------------------------------------------------

  /** @returns {HTMLElement} */
  add(tag, className, html) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (html !== undefined) el.innerHTML = html;
    this.body.appendChild(el);
    return el;
  }

  /** A row of buttons at the bottom of the card. */
  actions() {
    const row = document.createElement("div");
    row.className = "card__actions";
    this.body.appendChild(row);
    return {
      el: row,
      button: (label, onClick, kind = "primary", autofocus = false) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = `btn btn--${kind}`;
        b.textContent = label;
        if (autofocus) b.setAttribute("data-autofocus", "true");
        b.addEventListener("click", () => {
          audio.play("click");
          onClick(b);
        });
        row.appendChild(b);
        return b;
      }
    };
  }
}

/** Arabic text gets its own direction and language, wherever it appears. */
export function arabicBlock(text, className = "") {
  const el = document.createElement("div");
  el.className = `ar ${className}`;
  el.setAttribute("dir", "rtl");
  el.setAttribute("lang", "ar");
  el.textContent = text;
  return el;
}

export function englishBlock(text, className = "") {
  const el = document.createElement("div");
  el.className = `en ${className}`;
  el.setAttribute("dir", "ltr");
  el.setAttribute("lang", "en");
  el.textContent = text;
  return el;
}

/** A small transient message in the corner. */
let toastTimer = null;
export function toast(message, ms = 2600) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("is-in");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-in"), ms);
}
