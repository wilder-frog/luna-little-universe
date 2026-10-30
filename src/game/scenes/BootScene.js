// ---------------------------------------------------------------------------
//  Boot: draw every texture, then hand over to the world.
//
//  All artwork is generated here, so there are no image files to 404 on and
//  nothing to wait for on a slow connection. The only optional load is a
//  user-supplied character sprite.
// ---------------------------------------------------------------------------

import Phaser from "phaser";
import { buildCat, buildProps } from "../world/art.js";
import { buildGround } from "../world/ground.js";
import { audio } from "../systems/Audio.js";
import { asset, USE_CUSTOM_CHARACTER_SPRITE } from "../../config.js";
import { OVERRIDE_KEY } from "../entities/LunaCat.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Only ask for the custom sprite if the user has said they added one, so
    // the default game never requests a file that isn't there.
    if (!USE_CUSTOM_CHARACTER_SPRITE) return;

    this.load.spritesheet(
      OVERRIDE_KEY,
      asset("character/user-supplied-sprite.png"),
      { frameWidth: 16, frameHeight: 16 }
    );
    this.load.on("loaderror", (file) => {
      if (file.key === OVERRIDE_KEY) {
        console.warn(
          "[luna] USE_CUSTOM_CHARACTER_SPRITE is on but " +
            "public/assets/character/user-supplied-sprite.png is missing — " +
            "using the original LunaCat instead."
        );
        this.customSpriteMissing = true;
      }
    });
  }

  create() {
    buildCat(this, "lunacat");
    buildProps(this);
    buildGround(this, "world-ground");
    audio.preload();

    const useCustom =
      USE_CUSTOM_CHARACTER_SPRITE &&
      !this.customSpriteMissing &&
      this.textures.exists(OVERRIDE_KEY);

    this.scene.start("World", {
      characterKey: useCustom ? OVERRIDE_KEY : "lunacat"
    });
  }
}
