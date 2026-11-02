// ---------------------------------------------------------------------------
//  Audio. Plain HTMLAudioElements over the downloaded CC0 files — nothing is
//  synthesized, and nothing plays until the player has interacted with the
//  page (browsers require that, and the title screen click satisfies it).
//
//  Every file is optional at runtime: if one fails to load the game carries
//  on silently instead of throwing.
// ---------------------------------------------------------------------------

import { asset } from "../../config.js";
import { progress } from "./Progress.js";

const SFX_FILES = {
  click: "sfx/click.ogg",
  envelope: "sfx/envelope.ogg",
  collect: "sfx/collect.ogg",
  twinkle: "sfx/twinkle.ogg",
  chandelier: "sfx/chandelier.ogg",
  pop: "sfx/pop.ogg",
  blip: "sfx/blip.ogg",
  gate: "sfx/gate.ogg",
  fanfare: "sfx/fanfare.ogg",
  success: "sfx/success.ogg"
};

const MUSIC_FILES = {
  menu: "music/menu.ogg",
  world: "music/world.ogg",
  sanctuary: "music/sanctuary.ogg"
};

/** Per-sound trim so the foley set sits at a gentle, even level. */
const SFX_GAIN = {
  click: 0.5,
  envelope: 0.7,
  collect: 0.6,
  twinkle: 0.45,
  chandelier: 0.5,
  pop: 0.6,
  blip: 0.5,
  gate: 0.7,
  fanfare: 0.65,
  success: 0.6
};

class AudioSystem {
  constructor() {
    this.unlocked = false;
    this.available = { sfx: {}, music: {} };
    this.sfxPools = {};
    this.musicEls = {};
    this.currentTrack = null;
    this.ducked = false;
    this.loadFailures = [];
  }

  /**
   * Create the elements. No playback happens here.
   *
   * Idempotent on purpose: a second call used to build a whole new set of
   * Audio elements and leave the old ones playing, unreachable by the mute
   * button — two copies of the same track a second out of phase.
   */
  preload() {
    if (this.preloaded) return;
    this.preloaded = true;

    for (const [key, path] of Object.entries(SFX_FILES)) {
      // Small round-robin pool so overlapping clicks don't cut each other off.
      this.sfxPools[key] = Array.from({ length: 3 }, () => {
        const el = new Audio();
        el.preload = "auto";
        el.src = asset(path);
        el.addEventListener("error", () => this.markFailed("sfx", key, path));
        el.addEventListener("canplaythrough", () => {
          this.available.sfx[key] = true;
        });
        return el;
      });
      this.sfxPools[key].index = 0;
    }

    for (const [key, path] of Object.entries(MUSIC_FILES)) {
      const el = new Audio();
      el.preload = "auto";
      el.loop = true;
      el.src = asset(path);
      el.volume = 0;
      el.addEventListener("error", () => this.markFailed("music", key, path));
      el.addEventListener("canplaythrough", () => {
        this.available.music[key] = true;
      });
      this.musicEls[key] = el;
    }
  }

  markFailed(kind, key, path) {
    if (!this.loadFailures.includes(path)) {
      this.loadFailures.push(path);
      console.warn(`[audio] optional file unavailable: ${path}`);
    }
    this.available[kind][key] = false;
  }

  /** Called from the first real user gesture. */
  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    if (this.pendingTrack) {
      const track = this.pendingTrack;
      this.pendingTrack = null;
      this.playMusic(track);
    }
  }

  get settings() {
    return progress.state.audio;
  }

  // --- sfx -----------------------------------------------------------------

  play(key) {
    if (!this.unlocked || !this.settings.sfxEnabled) return;
    const pool = this.sfxPools[key];
    if (!pool) return;
    const el = pool[pool.index % pool.length];
    pool.index = (pool.index + 1) % pool.length;
    try {
      el.currentTime = 0;
      el.volume = Math.min(1, this.settings.sfxVolume * (SFX_GAIN[key] ?? 0.6));
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
    } catch {
      /* a sound effect is never worth an exception */
    }
  }

  // --- music ---------------------------------------------------------------

  playMusic(track) {
    if (!this.unlocked) {
      this.pendingTrack = track;
      return;
    }
    if (this.currentTrack === track) {
      this.applyMusicVolume();
      return;
    }
    const next = this.musicEls[track];
    if (!next) return;

    // Fade the old one out, bring the new one up. No abrupt jumps.
    const prev = this.currentTrack && this.musicEls[this.currentTrack];
    if (prev) this.fade(prev, 0, 500, () => prev.pause());

    this.currentTrack = track;
    if (!this.settings.musicEnabled) return;
    try {
      next.volume = 0;
      const p = next.play();
      if (p && p.catch) p.catch(() => {});
      this.fade(next, this.targetMusicVolume(), 800);
    } catch {
      /* music stays silent if the browser refuses */
    }
  }

  targetMusicVolume() {
    const base = this.settings.musicEnabled ? this.settings.musicVolume : 0;
    // A gentle dip while a panel is open, not a drop to nothing.
    return this.ducked ? base * 0.55 : base;
  }

  applyMusicVolume() {
    const el = this.currentTrack && this.musicEls[this.currentTrack];
    if (!el) return;
    if (!this.settings.musicEnabled) {
      this.fade(el, 0, 300, () => el.pause());
      return;
    }
    if (el.paused && this.unlocked) {
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
    }
    this.fade(el, this.targetMusicVolume(), 300);
  }

  /** Quiet the music a touch while a letter is open. */
  duck(on) {
    if (this.ducked === on) return;
    this.ducked = on;
    const el = this.currentTrack && this.musicEls[this.currentTrack];
    if (el && this.settings.musicEnabled) {
      this.fade(el, this.targetMusicVolume(), 400);
    }
  }

  fade(el, to, ms, done) {
    if (el._fade) clearInterval(el._fade);
    const from = el.volume;
    const steps = Math.max(1, Math.round(ms / 40));
    let i = 0;
    el._fade = setInterval(() => {
      i += 1;
      const v = from + (to - from) * (i / steps);
      try {
        el.volume = Math.min(1, Math.max(0, v));
      } catch {
        /* ignore */
      }
      if (i >= steps) {
        clearInterval(el._fade);
        el._fade = null;
        if (done) done();
      }
    }, 40);
  }

  setMusicEnabled(on) {
    progress.setAudio({ musicEnabled: on });
    this.applyMusicVolume();
  }

  setSfxEnabled(on) {
    progress.setAudio({ sfxEnabled: on });
    if (on) this.play("click");
  }

  setMusicVolume(v) {
    progress.setAudio({ musicVolume: v });
    this.applyMusicVolume();
  }

  setSfxVolume(v) {
    progress.setAudio({ sfxVolume: v });
  }

  /** True if at least one real audio file actually loaded. */
  get anyAudioLoaded() {
    return (
      Object.values(this.available.sfx).some(Boolean) ||
      Object.values(this.available.music).some(Boolean)
    );
  }
}

export const audio = new AudioSystem();
