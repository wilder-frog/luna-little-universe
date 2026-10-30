// ---------------------------------------------------------------------------
//  Touch controls — a thumbstick and an action button, for playing on a phone.
//
//  Only built when the device actually has a coarse pointer, so a laptop never
//  sees them. The stick is analog: a small push walks slowly, a full push runs.
//
//  The stick re-centres wherever the thumb first lands inside its pad, which
//  means she doesn't have to look down to find it.
// ---------------------------------------------------------------------------

import { overlaysOpen } from "./Overlay.js";

/** True on phones and tablets; false for a mouse-driven laptop. */
export function isTouchDevice() {
  return (
    window.matchMedia?.("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0
  );
}

const DEAD_ZONE = 0.16;
const MAX_RADIUS = 52;

export class TouchControls {
  /** @param {{onAction: Function}} opts */
  constructor(opts = {}) {
    this.onAction = opts.onAction || (() => {});
    this.vector = { x: 0, y: 0 };
    this.pointerId = null;

    this.root = document.createElement("div");
    this.root.id = "touch";
    this.root.setAttribute("aria-hidden", "true");

    // --- thumbstick --------------------------------------------------------
    this.pad = document.createElement("div");
    this.pad.className = "touch__pad";

    this.base = document.createElement("div");
    this.base.className = "touch__base";
    this.knob = document.createElement("div");
    this.knob.className = "touch__knob";
    this.base.appendChild(this.knob);
    this.pad.appendChild(this.base);

    // --- action button -----------------------------------------------------
    this.action = document.createElement("button");
    this.action.type = "button";
    this.action.className = "touch__action";
    this.action.innerHTML =
      '<span class="touch__actionIcon">♡</span><span class="touch__actionLabel"></span>';
    this.actionLabel = this.action.querySelector(".touch__actionLabel");

    this.root.append(this.pad, this.action);
    document.body.appendChild(this.root);

    this.bind();
    this.setActionLabel(null);
  }

  bind() {
    const pad = this.pad;

    const start = (e) => {
      if (overlaysOpen()) return;
      const t = e.changedTouches ? e.changedTouches[0] : e;
      this.pointerId = t.identifier ?? "mouse";
      const rect = pad.getBoundingClientRect();
      // Drop the stick under the thumb, wherever inside the pad it landed.
      this.originX = Math.min(
        Math.max(t.clientX, rect.left + MAX_RADIUS),
        rect.right - MAX_RADIUS
      );
      this.originY = Math.min(
        Math.max(t.clientY, rect.top + MAX_RADIUS),
        rect.bottom - MAX_RADIUS
      );
      this.base.style.left = `${this.originX - rect.left}px`;
      this.base.style.top = `${this.originY - rect.top}px`;
      this.base.classList.add("is-active");
      this.update(t.clientX, t.clientY);
      e.preventDefault();
    };

    const move = (e) => {
      if (this.pointerId === null) return;
      const t = e.changedTouches
        ? [...e.changedTouches].find(
            (c) => c.identifier === this.pointerId
          )
        : e;
      if (!t) return;
      this.update(t.clientX, t.clientY);
      e.preventDefault();
    };

    const end = (e) => {
      if (this.pointerId === null) return;
      if (e.changedTouches) {
        const stillDown = [...e.changedTouches].some(
          (c) => c.identifier === this.pointerId
        );
        if (!stillDown) return;
      }
      this.release();
      e.preventDefault();
    };

    pad.addEventListener("touchstart", start, { passive: false });
    pad.addEventListener("touchmove", move, { passive: false });
    pad.addEventListener("touchend", end, { passive: false });
    pad.addEventListener("touchcancel", end, { passive: false });

    // Mouse too, so the controls can be tried on a desktop browser.
    pad.addEventListener("mousedown", start);
    window.addEventListener("mousemove", (e) => {
      if (this.pointerId === "mouse") move(e);
    });
    window.addEventListener("mouseup", (e) => {
      if (this.pointerId === "mouse") end(e);
    });

    this.action.addEventListener("click", (e) => {
      e.preventDefault();
      if (overlaysOpen()) return;
      this.onAction();
    });

    // A stuck stick after the app is backgrounded would walk her into a wall.
    window.addEventListener("blur", () => this.release());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.release();
    });
  }

  update(clientX, clientY) {
    let dx = (clientX - this.originX) / MAX_RADIUS;
    let dy = (clientY - this.originY) / MAX_RADIUS;
    const len = Math.hypot(dx, dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }
    this.vector = Math.hypot(dx, dy) < DEAD_ZONE ? { x: 0, y: 0 } : { x: dx, y: dy };
    this.knob.style.transform = `translate(calc(-50% + ${dx * MAX_RADIUS}px), calc(-50% + ${
      dy * MAX_RADIUS
    }px))`;
  }

  release() {
    this.pointerId = null;
    this.vector = { x: 0, y: 0 };
    this.knob.style.transform = "translate(-50%, -50%)";
    this.base.classList.remove("is-active");
  }

  /** @param {string|null} label text for the action button, or null to dim it */
  setActionLabel(label) {
    const has = Boolean(label);
    this.action.classList.toggle("is-ready", has);
    this.action.disabled = !has;
    this.actionLabel.textContent = has ? label : "";
    this.action.setAttribute(
      "aria-label",
      has ? label : "Nothing nearby"
    );
  }

  setVisible(on) {
    this.root.classList.toggle("is-hidden", !on);
  }

  destroy() {
    this.root.remove();
  }
}
