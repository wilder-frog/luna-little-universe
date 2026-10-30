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
import { POEM_INTACT } from "./data/poem.js";

// A loud warning in the console if the poem ever stops reconstructing exactly.
if (!POEM_INTACT) {
  console.error(
    "[luna] The poem halves no longer reconstruct the original text. " +
      "Check src/data/poem.js against src/data/poem.source.txt."
  );
}

setLanguage(progress.state.preferredLanguage);

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

  // Audio only ever starts from a genuine user gesture.
  const unlock = () => {
    audio.unlock();
    audio.playMusic("menu");
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: false });
  window.addEventListener("keydown", unlock, { once: false });

  audio.preload();

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
