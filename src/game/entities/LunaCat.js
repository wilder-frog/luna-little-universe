// ---------------------------------------------------------------------------
//  LunaCat — the little white cat with the pink bow.
//
//  An original character drawn from scratch in src/game/world/art.js.
//  An optional user-supplied sprite can replace her (see OVERRIDE_KEY), but
//  nothing depends on that file existing.
// ---------------------------------------------------------------------------

import Phaser from "phaser";
import { SCALE } from "../world/art.js";

export const OVERRIDE_KEY = "lunacat-custom";

const SPEED = 180;

export class LunaCat extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, textureKey = "lunacat") {
    super(scene, x, y, textureKey, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(SCALE);
    this.setOrigin(0.5, 0.85);

    // A small body around her feet so she tucks behind props convincingly.
    this.body.setSize(16, 10);
    this.body.setOffset(0, 18);
    this.setCollideWorldBounds(true);

    this.facing = "down";
    this.frozen = false;
    this.createAnimations(textureKey);
    this.anims.play("cat-idle-down");
  }

  createAnimations(key) {
    const rows = { down: 0, up: 1, left: 2, right: 3 };
    for (const [dir, row] of Object.entries(rows)) {
      const base = row * 4;
      const walkKey = `cat-walk-${dir}`;
      const idleKey = `cat-idle-${dir}`;
      if (!this.scene.anims.exists(walkKey)) {
        this.scene.anims.create({
          key: walkKey,
          frames: this.scene.anims.generateFrameNumbers(key, {
            frames: [base, base + 1, base + 2, base + 3]
          }),
          frameRate: 8,
          repeat: -1
        });
      }
      if (!this.scene.anims.exists(idleKey)) {
        this.scene.anims.create({
          key: idleKey,
          frames: [{ key, frame: base }],
          frameRate: 1
        });
      }
    }
  }

  freeze() {
    this.frozen = true;
    this.setVelocity(0, 0);
    this.anims.play(`cat-idle-${this.facing}`, true);
  }

  unfreeze() {
    this.frozen = false;
  }

  /**
   * @param {object} input
   * @param {boolean} [input.up] @param {boolean} [input.down]
   * @param {boolean} [input.left] @param {boolean} [input.right]
   * @param {number} [input.vx] @param {number} [input.vy]
   *   Analog direction from the thumbstick, each -1..1. When present these
   *   win over the key flags, so a half-pushed stick walks slowly.
   */
  move(input) {
    if (this.frozen) {
      this.setVelocity(0, 0);
      return;
    }
    let vx = 0;
    let vy = 0;
    const analog = input.vx !== undefined || input.vy !== undefined;

    if (analog) {
      vx = input.vx || 0;
      vy = input.vy || 0;
    } else {
      if (input.left) vx -= 1;
      if (input.right) vx += 1;
      if (input.up) vy -= 1;
      if (input.down) vy += 1;
    }

    const len = Math.hypot(vx, vy);
    if (len < 0.001) {
      this.setVelocity(0, 0);
      this.anims.play(`cat-idle-${this.facing}`, true);
      return;
    }

    // Normalise so diagonals aren't faster; keep the magnitude for analog.
    const power = analog ? Math.min(1, len) : 1;
    this.setVelocity((vx / len) * SPEED * power, (vy / len) * SPEED * power);

    // Horizontal intent wins for the facing, it reads better while turning.
    if (vx < 0) this.facing = "left";
    else if (vx > 0) this.facing = "right";
    else if (vy < 0) this.facing = "up";
    else this.facing = "down";

    this.anims.play(`cat-walk-${this.facing}`, true);
  }
}
