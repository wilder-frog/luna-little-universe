// ---------------------------------------------------------------------------
//  LUNA — A Little Universe for You
//  To my Artemis, from your Orion ♡
//
//  Entry point: restore her language and progress, show the title, and only
//  then build the world. Audio waits for a real click, as browsers require.
// ---------------------------------------------------------------------------

import "./styles.css";
import { createGame } from "./game/Game.js";
import { progress } from "./game/systems/Progress.js";
import { audio } from "./game/systems/Audio.js";
import { setLanguage } from "./ui/translations.js";
import { showTitle, setHudVisible } from "./ui/Controls.js";
import { isHandheld } from "./ui/TouchControls.js";
import { POEM_INTACT } from "./data/poem.js";

// A loud warning in the console if the poem ever stops reconstructing exactly.
if (!POEM_INTACT) {
  console.error(
    "[luna] The poem halves no longer reconstruct the original text. " +
      "Check src/data/poem.js against src/data/poem.source.txt."
  );
}

setLanguage(progress.state.preferredLanguage);

// Lets the stylesheet show the on-screen controls only where they belong.
if (isHandheld()) document.body.classList.add("is-touch");

// Handy while developing; stripped from production builds.
if (import.meta.env.DEV) {
  window.__lunaAudio = audio;
  window.__lunaProgress = progress;
}

let game = null;

function startWorld() {
  setHudVisible(true);
  if (game) return;
  game = createGame();
}

function boot() {
  const splash = document.getElementById("splash");
  if (splash) splash.remove();

  setHudVisible(false);

  audio.preload();

  // Queue the title music now. Nothing plays yet — playMusic holds it as the
  // pending track until a gesture unlocks audio. If the game has already
  // started by then, the pending track is whatever the game asked for last,
  // so unlocking can never drag the world back to the menu loop.
  audio.playMusic("menu");

  // Audio only ever starts from a genuine user gesture.
  const unlock = () => {
    audio.unlock();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);

  showTitle(() => {
    audio.playMusic("world");
    startWorld();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
