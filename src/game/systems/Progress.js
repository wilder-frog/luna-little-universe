// ---------------------------------------------------------------------------
//  Saved progress. One localStorage key, validated on load, and the finale
//  unlock is always DERIVED from the completed ids rather than trusted from
//  the stored blob.
// ---------------------------------------------------------------------------

import { SAVE_KEY, TOTAL_MEMORIES } from "../../config.js";
import { CHECKPOINTS_BY_ID } from "../../data/story.js";

const SETTINGS_VERSION = 1;

function freshState() {
  return {
    completedIds: [],
    miniGamesCompleted: [],
    easterEggs: [],
    hasReadPoem: false,
    hasSeenIntro: false,
    preferredLanguage: "en",
    audio: {
      musicEnabled: true,
      sfxEnabled: true,
      musicVolume: 0.35,
      sfxVolume: 0.55
    },
    settingsVersion: SETTINGS_VERSION
  };
}

function clamp01(n, fallback) {
  return typeof n === "number" && Number.isFinite(n)
    ? Math.min(1, Math.max(0, n))
    : fallback;
}

/** Keep only ids we actually know about, de-duplicated. */
function sanitizeIds(value, allowed) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  for (const id of value) {
    if (typeof id === "string" && (!allowed || allowed(id))) seen.add(id);
  }
  return [...seen];
}

class Progress {
  constructor() {
    this.state = freshState();
    this.listeners = new Set();
    this.load();
  }

  load() {
    const base = freshState();
    let raw = null;
    try {
      raw = window.localStorage.getItem(SAVE_KEY);
    } catch {
      // Private mode / storage blocked. Play on with an in-memory save.
      this.storageBlocked = true;
    }
    if (!raw) {
      this.state = base;
      return;
    }
    let saved;
    try {
      saved = JSON.parse(raw);
    } catch {
      this.state = base;
      return;
    }
    if (!saved || typeof saved !== "object") {
      this.state = base;
      return;
    }

    this.state = {
      ...base,
      completedIds: sanitizeIds(
        saved.completedIds,
        (id) => id in CHECKPOINTS_BY_ID
      ),
      miniGamesCompleted: sanitizeIds(saved.miniGamesCompleted),
      easterEggs: sanitizeIds(saved.easterEggs),
      hasReadPoem: saved.hasReadPoem === true,
      hasSeenIntro: saved.hasSeenIntro === true,
      preferredLanguage: saved.preferredLanguage === "ar" ? "ar" : "en",
      audio: {
        musicEnabled: saved.audio?.musicEnabled !== false,
        sfxEnabled: saved.audio?.sfxEnabled !== false,
        musicVolume: clamp01(saved.audio?.musicVolume, base.audio.musicVolume),
        sfxVolume: clamp01(saved.audio?.sfxVolume, base.audio.sfxVolume)
      },
      settingsVersion: SETTINGS_VERSION
    };
  }

  save() {
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
    } catch {
      this.storageBlocked = true;
    }
    this.emit();
  }

  reset() {
    this.state = freshState();
    try {
      window.localStorage.removeItem(SAVE_KEY);
    } catch {
      /* nothing to clear */
    }
    this.emit();
  }

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit() {
    for (const fn of this.listeners) fn(this.state);
  }

  // --- memories ------------------------------------------------------------

  isComplete(id) {
    return this.state.completedIds.includes(id);
  }

  /** @returns true if this was the first time (a star was actually gained). */
  complete(id) {
    if (!(id in CHECKPOINTS_BY_ID) || this.isComplete(id)) return false;
    this.state.completedIds.push(id);
    this.save();
    return true;
  }

  get count() {
    return this.state.completedIds.length;
  }

  get total() {
    return TOTAL_MEMORIES;
  }

  /** Derived, never read straight from storage. */
  get finaleUnlocked() {
    return this.state.completedIds.length >= TOTAL_MEMORIES;
  }

  get hasAnyProgress() {
    return this.state.completedIds.length > 0 || this.state.hasSeenIntro;
  }

  // --- minigames & secrets -------------------------------------------------

  completeMinigame(key) {
    if (this.state.miniGamesCompleted.includes(key)) return false;
    this.state.miniGamesCompleted.push(key);
    this.save();
    return true;
  }

  minigameDone(key) {
    return this.state.miniGamesCompleted.includes(key);
  }

  findEasterEgg(key) {
    if (this.state.easterEggs.includes(key)) return false;
    this.state.easterEggs.push(key);
    this.save();
    return true;
  }

  foundEgg(key) {
    return this.state.easterEggs.includes(key);
  }

  get eggCount() {
    return this.state.easterEggs.length;
  }

  // --- flags ---------------------------------------------------------------

  markIntroSeen() {
    if (this.state.hasSeenIntro) return;
    this.state.hasSeenIntro = true;
    this.save();
  }

  markPoemRead() {
    if (this.state.hasReadPoem) return;
    this.state.hasReadPoem = true;
    this.save();
  }

  setLanguage(lang) {
    this.state.preferredLanguage = lang === "ar" ? "ar" : "en";
    this.save();
  }

  setAudio(patch) {
    this.state.audio = { ...this.state.audio, ...patch };
    this.save();
  }
}

export const progress = new Progress();
