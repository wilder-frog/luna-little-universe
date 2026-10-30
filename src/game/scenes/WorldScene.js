// ---------------------------------------------------------------------------
//  The world: one connected pink map with ten landmarks, a gate in the middle,
//  and a cat you can walk anywhere.
// ---------------------------------------------------------------------------

import Phaser from "phaser";
import { LunaCat } from "../entities/LunaCat.js";
import { SCALE } from "../world/art.js";
import { WORLD_W, WORLD_H } from "../world/ground.js";
import {
  SCENERY,
  SPAWN,
  GATE,
  HUB_MOON,
  INTERACT_POINTS,
  SIGN_LABELS,
  EASTER_EGGS
} from "../world/landmarks.js";
import { CHECKPOINTS, CHECKPOINTS_BY_ID } from "../../data/story.js";
import { progress } from "../systems/Progress.js";
import { audio } from "../systems/Audio.js";
import { playMinigame, playActivity } from "../systems/Minigames.js";
import { openLetter, openNote } from "../../ui/Dialogue.js";
import {
  showIntro,
  showUnlock,
  showSanctuary,
  showGateLocked,
  showMap,
  showSettings,
  showHelp,
  buildHud,
  refreshHud,
  onLanguageChange
} from "../../ui/Controls.js";
import { onOverlayChange, overlaysOpen, toast } from "../../ui/Overlay.js";
import { t, pick, isArabic } from "../../ui/translations.js";

const INTERACT_RADIUS = 72;

export class WorldScene extends Phaser.Scene {
  constructor() {
    super("World");
  }

  init(data) {
    this.characterKey = data?.characterKey || "lunacat";
  }

  create() {
    // Phaser reuses the scene object across restarts, so anything that
    // describes "this run" has to be cleared here or a New Adventure would
    // inherit the previous one's open gate.
    this.gateOpened = false;
    this.trail = null;

    this.physics.world.setBounds(24, 24, WORLD_W - 48, WORLD_H - 48);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBackgroundColor("#FFE7F0");

    this.buildGroundLayer();
    this.solids = this.physics.add.staticGroup();
    this.buildScenery();
    this.buildGate();
    this.buildHubMoon();

    this.player = new LunaCat(this, SPAWN.x, SPAWN.y, this.characterKey);
    this.physics.add.collider(this.player, this.solids);

    this.buildInteractables();
    this.buildSigns();
    this.buildPrompt();
    this.buildParticles();

    // Zoom 2 keeps the pixel grid whole (art is already drawn at 2x), so the
    // world stays chunky and crisp rather than shimmering on half-pixels.
    this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.fadeIn(600, 255, 231, 240);

    this.setupInput();
    this.setupUi();

    // Keep ambient twinkles going over the night areas.
    this.time.addEvent({
      delay: 900,
      loop: true,
      callback: () => this.ambientTwinkle()
    });

    if (!progress.state.hasSeenIntro) {
      this.time.delayedCall(350, () => showIntro());
    }
    if (progress.finaleUnlocked) this.openGate(false);

    audio.playMusic("world");
  }

  // --- construction --------------------------------------------------------

  buildGroundLayer() {
    const g = this.add.image(0, 0, "world-ground");
    g.setOrigin(0, 0);
    g.setScale(SCALE);
    g.setDepth(-1000);
  }

  buildScenery() {
    for (const [key, x, y, opts = {}] of SCENERY) {
      const s = this.add.image(x, y, key);
      s.setOrigin(0.5, 1);
      s.setScale(SCALE);
      s.setDepth(y);
      if (opts.s) {
        const bw = (opts.bw ?? 20) * SCALE;
        const bh = (opts.bh ?? 10) * SCALE;
        const body = this.solids.create(x, y - bh / 2 + 2, null);
        body.setVisible(false);
        body.body.setSize(bw, bh);
        body.body.reset(x, y - bh / 2 + 2);
      }
    }
  }

  buildGate() {
    this.gateSprite = this.add.image(GATE.x, GATE.y + 46, "prop-gate-closed");
    this.gateSprite.setOrigin(0.5, 1);
    this.gateSprite.setScale(SCALE);
    this.gateSprite.setDepth(GATE.y + 46);

    // A solid wall across the closed gate's mouth.
    this.gateBlock = this.solids.create(GATE.x, GATE.y + 30, null);
    this.gateBlock.setVisible(false);
    this.gateBlock.body.setSize(84 * SCALE, 10 * SCALE);
    this.gateBlock.body.reset(GATE.x, GATE.y + 30);
  }

  buildHubMoon() {
    this.hubMoon = this.add.image(HUB_MOON.x, HUB_MOON.y, "prop-moon");
    this.hubMoon.setScale(SCALE);
    this.hubMoon.setDepth(5);
    this.hubMoon.setAlpha(0.45);
    this.tweens.add({
      targets: this.hubMoon,
      y: HUB_MOON.y - 10,
      duration: 3200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
    this.refreshMoonGlow();
  }

  refreshMoonGlow() {
    const ratio = progress.count / progress.total;
    this.hubMoon.setAlpha(0.42 + ratio * 0.58);
    this.hubMoon.setScale(SCALE * (1 + ratio * 0.18));
  }

  buildInteractables() {
    this.interactables = [];

    // The ten memories.
    for (const cp of CHECKPOINTS) {
      const p = INTERACT_POINTS[cp.id] || cp.position;
      const done = progress.isComplete(cp.id);
      const marker = this.add.image(
        p.x,
        p.y - 44,
        done ? "star-collected" : "marker-envelope"
      );
      marker.setScale(SCALE);
      marker.setDepth(p.y + 400);
      this.floatMarker(marker, p.y - 44);

      this.interactables.push({
        kind: "checkpoint",
        id: cp.id,
        x: p.x,
        y: p.y,
        marker,
        label: () => `E — ${pick(cp, "title")}`
      });
    }

    // The five secrets.
    for (const egg of EASTER_EGGS) {
      if (egg.prop) {
        const s = this.add.image(egg.x, egg.y, egg.prop);
        s.setOrigin(0.5, 1);
        s.setScale(SCALE);
        s.setDepth(egg.y);
      }
      const sp = this.add.image(egg.x, egg.y - 34, "marker-star");
      sp.setScale(SCALE * 0.8);
      sp.setDepth(egg.y + 400);
      sp.setAlpha(0.55);
      this.tweens.add({
        targets: sp,
        alpha: { from: 0.35, to: 0.95 },
        duration: 1400,
        yoyo: true,
        repeat: -1
      });

      this.interactables.push({
        kind: "egg",
        id: egg.id,
        egg,
        pokes: 0,
        x: egg.x,
        y: egg.y,
        marker: sp,
        label: () => t("interactHintGeneric")
      });
    }

    // The gate / sanctuary.
    this.interactables.push({
      kind: "gate",
      id: "gate",
      x: GATE.x,
      y: GATE.y + 56,
      marker: null,
      label: () =>
        progress.finaleUnlocked ? t("enterSanctuary") : t("gateLocked")
    });

    // The signs.
    for (const s of SIGN_LABELS) {
      this.interactables.push({
        kind: "sign",
        id: `sign-${s.id}`,
        signId: s.id,
        x: s.x,
        y: s.y,
        marker: null,
        label: () => t("interactHintGeneric")
      });
    }
  }

  floatMarker(marker, baseY) {
    this.tweens.add({
      targets: marker,
      y: baseY - 6,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  buildSigns() {
    this.signTexts = [];
    for (const s of SIGN_LABELS) {
      const cp = CHECKPOINTS_BY_ID[s.id];
      const txt = this.add.text(s.x, s.y - 54, pick(cp, "sign"), {
        fontFamily: '"Pixelify Sans", "Segoe UI", system-ui, sans-serif',
        fontSize: "15px",
        color: "#56394A",
        align: "center",
        backgroundColor: "rgba(255,249,246,0.86)",
        padding: { x: 7, y: 3 }
      });
      txt.setOrigin(0.5, 1);
      txt.setDepth(s.y + 420);
      this.signTexts.push({ txt, cp });
    }

    // Phaser rasterises canvas text once, so a sign built before the webfont
    // arrives would keep the fallback face forever. Redraw them when it lands.
    document.fonts?.ready.then(() => {
      if (!this.scene.isActive()) return;
      for (const { txt } of this.signTexts) txt.updateText();
      this.promptText?.updateText();
    });
  }

  buildPrompt() {
    this.promptText = this.add.text(0, 0, "", {
      fontFamily: '"Pixelify Sans", "Segoe UI", system-ui, sans-serif',
      fontSize: "17px",
      color: "#FFF9F6",
      backgroundColor: "rgba(68,52,82,0.92)",
      padding: { x: 12, y: 7 },
      align: "center"
    });
    this.promptText.setOrigin(0.5, 1);
    this.promptText.setDepth(100000);
    this.promptText.setVisible(false);
  }

  buildParticles() {
    this.hearts = this.add.particles(0, 0, "p-heart", {
      lifespan: 1400,
      speedY: { min: -70, max: -30 },
      speedX: { min: -24, max: 24 },
      scale: { start: SCALE, end: SCALE * 0.4 },
      alpha: { start: 1, end: 0 },
      quantity: 1,
      frequency: -1
    });
    this.hearts.setDepth(99000);

    this.sparks = this.add.particles(0, 0, "p-spark", {
      lifespan: 1100,
      speed: { min: 20, max: 70 },
      scale: { start: SCALE, end: 0 },
      alpha: { start: 1, end: 0 },
      quantity: 1,
      frequency: -1
    });
    this.sparks.setDepth(99000);
  }

  ambientTwinkle() {
    if (!this.scene.isActive()) return;
    const cam = this.cameras.main;
    const x = cam.worldView.x + Math.random() * cam.worldView.width;
    const y = cam.worldView.y + Math.random() * cam.worldView.height;
    this.sparks.emitParticleAt(x, y, 1);
  }

  burstHearts(x, y, n = 10) {
    this.hearts.emitParticleAt(x, y, n);
  }

  burstSparks(x, y, n = 16) {
    this.sparks.emitParticleAt(x, y, n);
  }

  // --- input ---------------------------------------------------------------

  setupInput() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up2: Phaser.Input.Keyboard.KeyCodes.UP,
      down2: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left2: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right2: Phaser.Input.Keyboard.KeyCodes.RIGHT
    });

    this.input.keyboard.on("keydown-E", () => this.tryInteract());
    this.input.keyboard.on("keydown-SPACE", () => this.tryInteract());
    this.input.keyboard.on("keydown-ENTER", () => this.tryInteract());
    this.input.keyboard.on("keydown-M", () => {
      if (overlaysOpen()) return;
      audio.play("click");
      showMap();
    });

    // Arrow keys must not scroll the page while she's walking.
    this.input.keyboard.addCapture([
      "UP",
      "DOWN",
      "LEFT",
      "RIGHT",
      "SPACE",
      "E",
      "M",
      "ENTER"
    ]);

    // No stuck keys after the window loses focus.
    const release = () => {
      this.input.keyboard.resetKeys();
      this.player?.setVelocity(0, 0);
    };
    window.addEventListener("blur", release);
    this.game.events.on("hidden", release);
    this.events.once("shutdown", () => {
      window.removeEventListener("blur", release);
    });

    this.offOverlay = onOverlayChange((open) => {
      if (!this.player) return;
      if (open) {
        this.input.keyboard.resetKeys();
        this.player.freeze();
        this.promptText.setVisible(false);
      } else {
        this.player.unfreeze();
      }
    });
  }

  setupUi() {
    buildHud({
      onMap: () => showMap(),
      onSettings: () =>
        showSettings({
          onRestart: () => this.hardReset()
        }),
      onHelp: () => showHelp()
    });

    this.offLang = onLanguageChange(() => {
      for (const { txt, cp } of this.signTexts) txt.setText(pick(cp, "sign"));
      refreshHud();
    });

    this.events.once("shutdown", () => {
      this.offOverlay?.();
      this.offLang?.();
    });
  }

  hardReset() {
    // Progress is already cleared by the confirm dialog; rebuild the world.
    this.scene.restart({ characterKey: this.characterKey });
  }

  // --- interaction ---------------------------------------------------------

  nearest() {
    if (!this.player) return null;
    let best = null;
    let bestD = INTERACT_RADIUS;
    for (const it of this.interactables) {
      const d = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        it.x,
        it.y
      );
      if (d < bestD) {
        bestD = d;
        best = it;
      }
    }
    return best;
  }

  tryInteract() {
    if (overlaysOpen()) return;
    const it = this.nearest();
    if (!it) return;

    if (it.kind === "checkpoint") return this.openCheckpoint(it);
    if (it.kind === "egg") return this.openEgg(it);
    if (it.kind === "gate") return this.openGateInteraction();
    if (it.kind === "sign") return this.openSign(it);
  }

  openCheckpoint(it) {
    const cp = CHECKPOINTS_BY_ID[it.id];
    openLetter(cp, {
      onStar: () => this.onStarCollected(it, cp),
      onActivity: (key) => playActivity(key, cp),
      onMinigame: (key) => playMinigame(key)
    });
  }

  onStarCollected(it, cp) {
    it.marker.setTexture("star-collected");
    this.burstSparks(it.x, it.y - 40, 22);
    this.burstHearts(this.player.x, this.player.y - 30, 8);
    this.refreshMoonGlow();
    refreshHud();
    void cp;

    if (progress.finaleUnlocked && !this.gateOpened) {
      this.time.delayedCall(700, () => {
        this.openGate(true);
        showUnlock();
      });
    }
  }

  openEgg(it) {
    const egg = it.egg;
    it.pokes += 1;

    if (it.pokes < (egg.needs || 1)) {
      audio.play("chandelier");
      this.burstSparks(it.x, it.y - 30, 6);
      const fn = isArabic() ? egg.progressAr : egg.progressEn;
      if (fn) toast(fn(it.pokes, egg.needs), 1700);
      return;
    }

    audio.play("twinkle");
    this.burstSparks(it.x, it.y - 30, 18);
    if (egg.heartBurst) this.burstHearts(this.player.x, this.player.y - 30, 14);

    const first = progress.findEasterEgg(egg.id);
    it.marker.setTexture("star-collected");
    it.marker.setAlpha(1);

    openNote({
      title: isArabic() ? egg.titleAr : egg.titleEn,
      body: isArabic() ? egg.bodyAr : egg.bodyEn,
      arabic: isArabic(),
      extraHtml: first
        ? `<span class="note__badge">${t("easterEgg")}  ${progress.eggCount}/5</span>`
        : `<span class="note__badge">${progress.eggCount}/5</span>`
    });
  }

  openSign(it) {
    const cp = CHECKPOINTS_BY_ID[it.signId];
    const done = progress.isComplete(cp.id);
    // The sign shows the place's name in the other language too, in that
    // language's direction, with the status badge in the interface language.
    openNote({
      title: `${cp.icon} ${pick(cp, "title")}`,
      body: isArabic() ? cp.titleEn : cp.titleAr,
      arabic: !isArabic(),
      extraHtml: `<span class="note__badge">${
        done ? `✦ ${t("found")}` : t("notFound")
      }</span>`
    });
  }

  openGateInteraction() {
    if (!progress.finaleUnlocked) {
      audio.play("blip");
      showGateLocked();
      return;
    }
    audio.play("gate");
    this.enterSanctuary();
  }

  enterSanctuary() {
    this.cameras.main.fadeOut(500, 55, 48, 79);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      showSanctuary({
        onLeave: () => {
          audio.playMusic("world");
          this.cameras.main.fadeIn(600, 55, 48, 79);
          // Step back out of the gateway so she isn't standing inside it.
          this.player.setPosition(GATE.x, GATE.y + 120);
        }
      });
    });
  }

  openGate(animate) {
    if (this.gateOpened) return;
    this.gateOpened = true;
    this.gateSprite.setTexture("prop-gate-open");
    this.gateBlock.body.enable = false;

    if (animate) {
      audio.play("gate");
      this.burstSparks(GATE.x, GATE.y, 40);
      this.cameras.main.flash(500, 255, 243, 196);
      this.buildStarTrail();
    } else {
      this.buildStarTrail();
    }
  }

  /** A pink trail of stars from the spawn courtyard up to the open gate. */
  buildStarTrail() {
    if (this.trail) return;
    this.trail = this.add.group();
    const from = { x: SPAWN.x, y: SPAWN.y + 20 };
    const steps = 7;
    for (let i = 1; i <= steps; i++) {
      const tt = i / (steps + 1);
      const s = this.add.image(
        Phaser.Math.Linear(from.x, GATE.x, tt),
        Phaser.Math.Linear(from.y, GATE.y + 70, tt),
        "marker-star"
      );
      s.setScale(SCALE * 0.7);
      s.setDepth(2);
      s.setAlpha(0.2);
      this.tweens.add({
        targets: s,
        alpha: { from: 0.25, to: 0.95 },
        duration: 700,
        delay: i * 140,
        yoyo: true,
        repeat: -1
      });
      this.trail.add(s);
    }
  }

  // --- loop ----------------------------------------------------------------

  update() {
    if (!this.player) return;

    const k = this.keys;
    const paused = overlaysOpen();
    this.player.move({
      up: !paused && (k.up.isDown || k.up2.isDown),
      down: !paused && (k.down.isDown || k.down2.isDown),
      left: !paused && (k.left.isDown || k.left2.isDown),
      right: !paused && (k.right.isDown || k.right2.isDown)
    });

    this.player.setDepth(this.player.y);

    // The interaction prompt follows whatever she's closest to.
    if (paused) {
      this.promptText.setVisible(false);
      return;
    }
    const near = this.nearest();
    if (!near) {
      this.promptText.setVisible(false);
      return;
    }
    const label =
      near.kind === "checkpoint"
        ? progress.isComplete(near.id)
          ? `E — ${pick(CHECKPOINTS_BY_ID[near.id], "title")} ✦`
          : near.label()
        : near.label();
    this.promptText.setText(label);
    this.promptText.setPosition(near.x, near.y - 58);
    this.promptText.setVisible(true);
  }
}
