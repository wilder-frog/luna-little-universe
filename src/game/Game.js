// ---------------------------------------------------------------------------
//  Phaser setup. Pixel art stays crisp (no smoothing, rounded pixels) and the
//  canvas resizes with the window so there's never a horizontal page scroll.
// ---------------------------------------------------------------------------

import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene.js";
import { WorldScene } from "./scenes/WorldScene.js";

export function createGame() {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    backgroundColor: "#FFE7F0",
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: "100%",
      height: "100%"
    },
    physics: {
      default: "arcade",
      arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [BootScene, WorldScene]
  });

  // Handy while developing; stripped from production builds.
  if (import.meta.env.DEV) window.__lunaGame = game;

  return game;
}
