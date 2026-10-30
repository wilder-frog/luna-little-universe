// ---------------------------------------------------------------------------
//  All of the game's artwork, drawn pixel by pixel at boot.
//
//  Sprites are authored at their true pixel size and drawn into the world at
//  SCALE (2x) with nearest-neighbour filtering, so everything stays crisp.
//
//  LunaCat is an ORIGINAL character: a round white cat with a pink bow.
//  No third-party character art is used or re-hosted anywhere in this project.
// ---------------------------------------------------------------------------

import { pc, PALETTE as C } from "./pixel.js";

/** World pixels per authored art pixel. */
export const SCALE = 2;

// ===========================================================================
//  LunaCat
// ===========================================================================

const CAT_MAP = {
  o: C.outline,
  w: C.white,
  c: "#F0DFE8",
  p: C.rose,
  P: C.deepRose,
  e: C.ink,
  b: C.blush,
  n: C.deepRose
};

// Head + body, feet left off so the walk cycle can swap them.
// A round silhouette reads best at 16x16: big head, solid little body, and
// no tail — a thin tail at this size just breaks the outline.
const CAT_DOWN = [
  "...oo......oo...",
  "..owwo....owwo..",
  "..owwwo..owwwo..",
  ".oowwwwoowwwwoo.",
  ".owwwwwwwwwwwwo.",
  ".owwwwwwwwwwwwo.",
  ".owweewwwweewwo.",
  ".owweewwwweewwo.",
  ".owwwwwnnwwwwwo.",
  ".obwwwwwwwwwwbo.",
  "..owwwwwwwwwwo..",
  "..oowwwwwwwwoo..",
  "...owwwwwwwwo...",
  "...owwwwwwwwo...",
  "...owwwwwwwwo..."
];

const CAT_UP = [
  "...oo......oo...",
  "..oppo....owwo..",
  "..opppo..owwwo..",
  ".oowwwwoowwwwoo.",
  ".owwwwwwwwwwwwo.",
  ".owccwwwwwwccwo.",
  ".owwwwwwwwwwwwo.",
  ".owwwwwwwwwwwwo.",
  ".owwwwwwwwwwwwo.",
  ".owwwwwwwwwwwwo.",
  "..owwwwwwwwwwo..",
  "..oowwwwwwwwoo..",
  "...owwwwwwwwo...",
  "...owwwwwwwwo...",
  "...owwwwwwwwo..."
];

// Three-quarter view looking right. The left-facing frames are this, mirrored.
const CAT_RIGHT = [
  "...oo......oo...",
  "..owwo....owwo..",
  "..owwwo..owwwo..",
  ".oowwwwoowwwwoo.",
  ".owwwwwwwwwwwwo.",
  ".owwwwwwwwwwwwo.",
  ".owwwwweewweewo.",
  ".owwwwweewweewo.",
  ".owwwwwwwwwnnwo.",
  ".owwwwwwwwwwwbo.",
  "..owwwwwwwwwwo..",
  "..oowwwwwwwwoo..",
  "...owwwwwwwwo...",
  "...owwwwwwwwo...",
  "...owwwwwwwwo..."
];

/** The bow, drawn over the cat's left ear. */
const BOW = [".oo.oo.", "opppppo", "opPPPpo", ".oo.oo."];

/** Feet variants: index 0 = standing, 1 = left step, 2 = right step. */
const FEET = ["....oo....oo....", "...oo.....oo....", "....oo.....oo..."];

/**
 * Build the 16x16 cat spritesheet: 4 directions x 4 frames.
 * Rows: 0 down, 1 up, 2 left, 3 right. Frames: idle, step, idle, step(other).
 */
export function buildCat(scene, key = "lunacat") {
  const F = 16;
  const cols = 4;
  const rows = 4;
  const buf = pc(F * cols, F * rows);

  const bodies = [CAT_DOWN, CAT_UP, null, CAT_RIGHT];
  const footOrder = [0, 1, 0, 2];

  for (let r = 0; r < rows; r++) {
    for (let f = 0; f < cols; f++) {
      const ox = f * F;
      const oy = r * F;
      const mirrored = r === 2;
      const body = bodies[mirrored ? 3 : r];
      // A 1px bob on the stepping frames gives the walk some life.
      const bob = footOrder[f] === 0 ? 0 : -1;

      if (mirrored) {
        // Draw into a scratch buffer and copy it across, column-reversed.
        const tmp = pc(F, F);
        tmp.matrix(body, CAT_MAP, 0, 0);
        tmp.matrix(FEET.slice(footOrder[f], footOrder[f] + 1), CAT_MAP, 0, 15);
        tmp.matrix(BOW, CAT_MAP, 1, 1);
        const d = tmp.data.data;
        for (let y = 0; y < F; y++) {
          for (let x = 0; x < F; x++) {
            const i = (y * F + x) * 4;
            if (d[i + 3] === 0) continue;
            const hex =
              "#" +
              [d[i], d[i + 1], d[i + 2]]
                .map((n) => n.toString(16).padStart(2, "0"))
                .join("");
            buf.px(ox + (F - 1 - x), oy + y + bob, hex);
          }
        }
      } else {
        buf.matrix(body, CAT_MAP, ox, oy + bob);
        buf.matrix(
          FEET.slice(footOrder[f], footOrder[f] + 1),
          CAT_MAP,
          ox,
          oy + 15 + bob
        );
        buf.matrix(BOW, CAT_MAP, ox + 1, oy + 1 + bob);
      }
    }
  }

  return buf.commitSheet(scene, key, F, F);
}

/** A standalone portrait of the cat for the title screen / HUD. */
export function catPortraitDataURL() {
  const buf = pc(16, 16);
  buf.matrix(CAT_DOWN, CAT_MAP, 0, 0);
  buf.matrix(FEET.slice(0, 1), CAT_MAP, 0, 15);
  buf.matrix(BOW, CAT_MAP, 1, 1);
  return buf.toDataURL();
}

// ===========================================================================
//  Props
// ===========================================================================

function tree(scene, key, blossom) {
  const buf = pc(20, 28);
  // trunk
  buf.rect(8, 18, 4, 10, "#9C6B52");
  buf.vline(8, 18, 10, "#7D523D");
  buf.vline(11, 18, 10, "#7D523D");
  // canopy
  const leaf = blossom ? C.powder : C.leaf;
  const leafDark = blossom ? C.rose : C.leafDark;
  buf.ellipse(10, 11, 9, 9, leafDark);
  buf.ellipse(10, 10, 8, 8, leaf);
  buf.ellipse(7, 8, 4, 4, blossom ? C.milk : "#A8CFA8");
  buf.speckle(blossom ? 7 : 11, 26, blossom ? C.white : "#B6DCB6", 230);
  if (blossom) {
    buf.px(4, 20, C.powder);
    buf.px(15, 22, C.powder);
    buf.px(9, 24, C.milk);
  }
  return buf.commit(scene, key);
}

function bush(scene, key, flowerColor) {
  const buf = pc(18, 12);
  buf.ellipse(9, 8, 8, 4, C.leafDark);
  buf.ellipse(9, 7, 7, 3, C.leaf);
  for (const [x, y] of [
    [4, 5],
    [9, 4],
    [13, 6],
    [7, 8],
    [12, 9]
  ]) {
    buf.px(x, y, flowerColor);
    buf.px(x + 1, y, flowerColor);
    buf.px(x, y + 1, flowerColor);
    buf.px(x + 1, y + 1, C.white);
  }
  return buf.commit(scene, key);
}

function lamp(scene, key) {
  const buf = pc(10, 30);
  buf.rect(4, 10, 2, 20, C.mauve);
  buf.vline(4, 10, 20, "#9A5880");
  buf.rect(2, 27, 6, 3, C.mauve);
  // glass head
  buf.ellipse(5, 6, 4, 5, C.outline);
  buf.ellipse(5, 6, 3, 4, C.glow);
  buf.ellipse(5, 5, 2, 2, C.white);
  buf.px(5, 1, C.rose);
  buf.heart(5, 0, 1, C.rose);
  return buf.commit(scene, key);
}

function bench(scene, key) {
  const buf = pc(26, 16);
  buf.rect(2, 4, 22, 3, C.deepRose);
  buf.rect(2, 8, 22, 3, C.rose);
  buf.rect(3, 11, 2, 5, C.mauve);
  buf.rect(21, 11, 2, 5, C.mauve);
  buf.hline(2, 4, 22, "#B04E78");
  buf.heart(13, 0, 1, C.rose);
  return buf.commit(scene, key);
}

function house(scene, key, bodyColor, roofColor, wide) {
  const w = wide ? 48 : 36;
  const h = wide ? 44 : 38;
  const buf = pc(w, h);
  const roofH = Math.floor(h * 0.38);
  // walls
  buf.rect(2, roofH, w - 4, h - roofH - 1, bodyColor);
  buf.frame(2, roofH, w - 4, h - roofH - 1, C.outline);
  // roof — stepped triangle, crisp edges
  for (let y = 0; y < roofH; y++) {
    const inset = Math.floor(((roofH - y) / roofH) * (w / 2 - 2));
    buf.hline(inset, y, w - inset * 2, roofColor);
    buf.px(inset, y, C.outlineDark);
    buf.px(w - inset - 1, y, C.outlineDark);
  }
  buf.hline(0, roofH - 1, w, C.outlineDark);
  // door
  const dx = Math.floor(w / 2) - 4;
  buf.rect(dx, h - 14, 8, 13, C.mauve);
  buf.frame(dx, h - 14, 8, 13, C.outline);
  buf.px(dx + 6, h - 8, C.gold);
  // windows
  for (const wx of wide ? [6, w - 16] : [5, w - 14]) {
    buf.rect(wx, roofH + 5, 9, 8, C.glow);
    buf.frame(wx, roofH + 5, 9, 8, C.outline);
    buf.vline(wx + 4, roofH + 5, 8, C.outline);
    buf.hline(wx, roofH + 9, 9, C.outline);
  }
  return buf.commit(scene, key);
}

function chandelierHouse(scene, key) {
  const buf = pc(56, 52);
  const roofH = 18;
  buf.rect(2, roofH, 52, 33, C.milk);
  buf.frame(2, roofH, 52, 33, C.outline);
  for (let y = 0; y < roofH; y++) {
    const inset = Math.floor(((roofH - y) / roofH) * 26);
    buf.hline(inset, y, 56 - inset * 2, C.rose);
    buf.px(inset, y, C.outlineDark);
    buf.px(55 - inset, y, C.outlineDark);
  }
  buf.hline(0, roofH - 1, 56, C.outlineDark);
  // one enormous window so the ridiculous chandelier is visible
  buf.rect(10, 24, 36, 22, C.night);
  buf.frame(10, 24, 36, 22, C.outline);
  // curtains
  buf.rect(11, 25, 5, 20, C.powder);
  buf.rect(40, 25, 5, 20, C.powder);
  // THE chandelier
  buf.vline(28, 25, 4, C.goldDark);
  buf.ellipse(28, 32, 10, 5, C.gold);
  buf.ellipse(28, 31, 8, 3, C.glow);
  for (const x of [19, 23, 28, 33, 37]) {
    buf.vline(x, 34, 3, C.goldDark);
    buf.disc(x, 38, 2, C.glow);
    buf.px(x, 38, C.white);
  }
  buf.sparkle(28, 30, 3, C.white, 220);
  return buf.commit(scene, key);
}

function clockTower(scene, key) {
  const buf = pc(28, 60);
  buf.rect(4, 14, 20, 46, C.milk);
  buf.frame(4, 14, 20, 46, C.outline);
  for (let y = 0; y < 14; y++) {
    const inset = Math.floor(((14 - y) / 14) * 12);
    buf.hline(2 + inset, y, 24 - inset * 2, C.rose);
  }
  buf.disc(14, 28, 8, C.outline);
  buf.disc(14, 28, 7, C.cream);
  buf.line(14, 28, 14, 23, C.ink);
  buf.line(14, 28, 18, 30, C.ink);
  buf.px(14, 28, C.deepRose);
  buf.rect(10, 44, 8, 16, C.mauve);
  buf.frame(10, 44, 8, 16, C.outline);
  return buf.commit(scene, key);
}

function car(scene, key, body, accent) {
  const buf = pc(26, 16);
  buf.rect(2, 6, 22, 6, body);
  buf.frame(2, 6, 22, 6, C.outline);
  // cockpit / canopy
  buf.rect(9, 2, 9, 5, accent);
  buf.frame(9, 2, 9, 5, C.outline);
  buf.rect(10, 3, 7, 2, C.glow);
  // front and rear wing
  buf.rect(0, 8, 3, 3, accent);
  buf.rect(23, 7, 3, 2, accent);
  // wheels
  for (const x of [5, 19]) {
    buf.disc(x, 12, 3, C.ink);
    buf.disc(x, 12, 1, C.grey);
  }
  buf.px(13, 9, C.white);
  return buf.commit(scene, key);
}

function arch(scene, key) {
  const buf = pc(60, 34);
  // posts
  buf.rect(2, 8, 6, 26, C.mauve);
  buf.rect(52, 8, 6, 26, C.mauve);
  buf.frame(2, 8, 6, 26, C.outline);
  buf.frame(52, 8, 6, 26, C.outline);
  // checkered banner
  for (let x = 0; x < 60; x += 4) {
    for (let y = 0; y < 8; y += 4) {
      const on = ((x / 4) + (y / 4)) % 2 === 0;
      buf.rect(x, y, 4, 4, on ? C.white : C.deepRose);
    }
  }
  buf.frame(0, 0, 60, 8, C.outline);
  buf.heart(30, 9, 1, C.rose);
  return buf.commit(scene, key);
}

function trophy(scene, key) {
  const buf = pc(12, 16);
  buf.rect(3, 12, 6, 2, C.mauve);
  buf.rect(2, 14, 8, 2, C.outline);
  buf.rect(5, 8, 2, 4, C.goldDark);
  buf.ellipse(6, 5, 4, 5, C.goldDark);
  buf.ellipse(6, 4, 3, 4, C.gold);
  buf.px(5, 3, C.glow);
  buf.px(1, 4, C.goldDark);
  buf.px(10, 4, C.goldDark);
  return buf.commit(scene, key);
}

function sign(scene, key) {
  const buf = pc(24, 20);
  buf.rect(10, 12, 4, 8, "#9C6B52");
  buf.rect(1, 1, 22, 12, C.cream);
  buf.frame(1, 1, 22, 12, C.outline);
  buf.frame(2, 2, 20, 10, C.powder);
  for (let x = 4; x < 20; x += 3) buf.hline(x, 6, 2, C.mauve);
  for (let x = 5; x < 19; x += 3) buf.hline(x, 9, 2, C.mauve);
  buf.heart(12, 2, 1, C.rose);
  return buf.commit(scene, key);
}

function recordPlayer(scene, key) {
  const buf = pc(24, 20);
  buf.rect(1, 6, 22, 13, C.powder);
  buf.frame(1, 6, 22, 13, C.outline);
  buf.disc(10, 12, 6, C.ink);
  buf.ring(10, 12, 6, C.outline);
  buf.disc(10, 12, 2, C.rose);
  buf.px(10, 12, C.cream);
  buf.line(20, 7, 14, 11, C.mauve);
  buf.px(14, 11, C.deepRose);
  buf.rect(2, 1, 8, 5, C.rose);
  buf.frame(2, 1, 8, 5, C.outline);
  return buf.commit(scene, key);
}

function observatory(scene, key) {
  const buf = pc(52, 40);
  // base
  buf.rect(4, 22, 44, 18, C.milk);
  buf.frame(4, 22, 44, 18, C.outline);
  buf.rect(22, 30, 8, 10, C.mauve);
  buf.frame(22, 30, 8, 10, C.outline);
  // dome
  buf.ellipse(26, 22, 22, 16, C.outline);
  buf.ellipse(26, 22, 21, 15, C.lavender);
  buf.ellipse(20, 15, 8, 5, C.deepLavender, 150);
  buf.rect(4, 22, 44, 1, C.outline);
  // dome slit + telescope
  buf.rect(24, 6, 5, 16, C.night);
  buf.frame(24, 6, 5, 16, C.outline);
  buf.line(26, 18, 34, 4, C.grey);
  buf.line(27, 18, 35, 4, C.greyDark);
  buf.disc(35, 3, 2, C.glow);
  buf.sparkle(40, 6, 2, C.white, 200);
  return buf.commit(scene, key);
}

function pavilion(scene, key, flagColor) {
  const buf = pc(36, 32);
  // canopy
  for (let y = 0; y < 12; y++) {
    const inset = Math.floor(((12 - y) / 12) * 15);
    buf.hline(2 + inset, y + 4, 32 - inset * 2, y % 2 ? C.white : flagColor);
  }
  buf.hline(2, 15, 32, C.outline);
  // legs + table
  buf.vline(4, 16, 15, C.mauve);
  buf.vline(31, 16, 15, C.mauve);
  buf.rect(8, 22, 20, 4, C.cream);
  buf.frame(8, 22, 20, 4, C.outline);
  // flag
  buf.vline(18, 0, 5, C.outline);
  buf.rect(19, 0, 6, 4, flagColor);
  return buf.commit(scene, key);
}

function lounger(scene, key) {
  const buf = pc(20, 14);
  buf.rect(2, 7, 16, 3, C.cream);
  buf.frame(2, 7, 16, 3, C.outline);
  buf.line(2, 7, 6, 2, C.cream);
  buf.line(3, 7, 7, 2, C.outline);
  buf.rect(3, 10, 2, 4, C.mauve);
  buf.rect(15, 10, 2, 4, C.mauve);
  buf.heart(10, 3, 1, C.powder);
  return buf.commit(scene, key);
}

function moonflower(scene, key) {
  const buf = pc(12, 14);
  buf.vline(6, 7, 7, C.leafDark);
  buf.px(4, 10, C.leaf);
  buf.px(8, 11, C.leaf);
  buf.disc(6, 5, 4, C.white, 230);
  buf.disc(6, 5, 3, C.milk);
  for (const [x, y] of [
    [6, 1],
    [3, 3],
    [9, 3],
    [3, 7],
    [9, 7]
  ]) {
    buf.disc(x, y, 2, C.white);
  }
  buf.disc(6, 5, 1, C.glow);
  return buf.commit(scene, key);
}

function gate(scene, key, open) {
  const buf = pc(64, 46);
  // pillars
  for (const x of [1, 56]) {
    buf.rect(x, 6, 7, 40, C.cream);
    buf.frame(x, 6, 7, 40, C.outline);
    buf.rect(x - 1, 2, 9, 5, C.powder);
    buf.frame(x - 1, 2, 9, 5, C.outline);
    buf.disc(x + 3, 4, 1, C.gold);
  }
  // arch over the top
  for (let x = 8; x < 56; x++) {
    const y = Math.round(8 - 6 * Math.sin(((x - 8) / 48) * Math.PI));
    buf.px(x, y, C.outline);
    buf.px(x, y + 1, C.powder);
    buf.px(x, y + 2, C.rose);
  }
  // crescent moon keystone
  buf.disc(32, 4, 5, C.glow);
  buf.disc(35, 3, 4, C.milk, 0);
  for (let y = -5; y <= 5; y++) {
    for (let x = -5; x <= 5; x++) {
      const inMoon = x * x + y * y <= 25;
      const inBite = (x - 3) * (x - 3) + (y - 1) * (y - 1) <= 16;
      if (inMoon && !inBite) buf.px(32 + x, 4 + y, C.glow);
    }
  }
  if (open) {
    // doors swung aside, a lit path through the middle
    buf.rect(9, 14, 6, 32, C.lavender, 200);
    buf.rect(49, 14, 6, 32, C.lavender, 200);
    for (let y = 14; y < 46; y++) {
      buf.hline(16, y, 32, C.glow, 70 + ((y * 3) % 40));
    }
    buf.sparkle(32, 24, 4, C.white, 200);
    buf.sparkle(24, 34, 3, C.milk, 170);
    buf.sparkle(41, 30, 3, C.milk, 170);
  } else {
    // closed bars
    for (let x = 10; x < 55; x += 5) {
      buf.vline(x, 14, 32, C.mauve);
      buf.px(x, 14, C.outline);
    }
    buf.hline(9, 20, 46, C.mauve);
    buf.hline(9, 38, 46, C.mauve);
    buf.heart(32, 25, 2, C.rose);
    buf.frame(9, 14, 46, 32, C.outline);
  }
  return buf.commit(scene, key);
}

function bigMoon(scene, key) {
  const buf = pc(40, 40);
  buf.disc(20, 20, 18, C.glow, 40);
  buf.disc(20, 20, 16, C.milk, 90);
  buf.disc(20, 20, 14, C.cream);
  buf.disc(20, 20, 13, C.white);
  // craters, kept soft
  buf.disc(14, 15, 3, C.milk, 170);
  buf.disc(25, 24, 2, C.milk, 170);
  buf.disc(21, 12, 2, C.milk, 130);
  return buf.commit(scene, key);
}

/** The shimmering marker that floats over anything you can interact with. */
function markerEnvelope(scene, key) {
  const buf = pc(14, 11);
  buf.rect(0, 1, 14, 10, C.cream);
  buf.frame(0, 1, 14, 10, C.outline);
  buf.line(0, 1, 7, 7, C.powder);
  buf.line(13, 1, 7, 7, C.powder);
  buf.line(0, 2, 7, 8, C.rose);
  buf.line(13, 2, 7, 8, C.rose);
  buf.heart(7, 4, 1, C.deepRose);
  return buf.commit(scene, key);
}

function markerStar(scene, key) {
  const buf = pc(11, 11);
  buf.sparkle(5, 5, 5, C.glow, 255);
  buf.star(5, 5, C.white);
  buf.px(5, 5, C.glow);
  return buf.commit(scene, key);
}

function collectedStar(scene, key) {
  const buf = pc(9, 9);
  buf.star(4, 4, C.rose);
  buf.px(4, 4, C.white);
  buf.px(3, 3, C.milk);
  return buf.commit(scene, key);
}

function heartParticle(scene, key) {
  const buf = pc(8, 7);
  buf.heart(4, 0, 1, C.rose);
  return buf.commit(scene, key);
}

function sparkParticle(scene, key) {
  const buf = pc(5, 5);
  buf.sparkle(2, 2, 2, C.white, 255);
  return buf.commit(scene, key);
}

function railing(scene, key) {
  const buf = pc(32, 16);
  buf.hline(0, 3, 32, C.cream);
  buf.hline(0, 4, 32, C.powder);
  buf.hline(0, 9, 32, C.powder);
  for (let x = 2; x < 32; x += 6) {
    buf.vline(x, 4, 11, C.cream);
    buf.px(x, 2, C.rose);
  }
  return buf.commit(scene, key);
}

function fountainHeart(scene, key) {
  const buf = pc(34, 28);
  buf.ellipse(17, 20, 16, 7, C.outline);
  buf.ellipse(17, 20, 15, 6, C.water);
  buf.ellipse(17, 19, 13, 5, "#A7C9F0");
  buf.heart(17, 6, 2, C.rose);
  buf.heart(17, 8, 1, C.deepRose);
  buf.rect(15, 14, 4, 6, C.cream);
  buf.sparkle(10, 16, 2, C.white, 180);
  buf.sparkle(24, 18, 2, C.white, 180);
  return buf.commit(scene, key);
}

function telescopeSmall(scene, key) {
  const buf = pc(18, 20);
  buf.rect(7, 14, 4, 6, C.mauve);
  buf.rect(5, 19, 8, 1, C.outline);
  buf.line(8, 15, 15, 4, C.grey);
  buf.line(9, 15, 16, 4, C.greyDark);
  buf.line(7, 15, 14, 4, C.outline);
  buf.disc(15, 3, 2, C.glow);
  return buf.commit(scene, key);
}

function calendarProp(scene, key) {
  const buf = pc(20, 20);
  buf.rect(1, 3, 18, 16, C.cream);
  buf.frame(1, 3, 18, 16, C.outline);
  buf.rect(1, 3, 18, 5, C.rose);
  buf.hline(1, 8, 18, C.outline);
  for (let y = 11; y < 18; y += 3) {
    for (let x = 4; x < 17; x += 3) buf.px(x, y, C.powder);
  }
  buf.heart(10, 11, 1, C.deepRose);
  buf.vline(5, 0, 4, C.mauve);
  buf.vline(14, 0, 4, C.mauve);
  return buf.commit(scene, key);
}

function phoneCharm(scene, key) {
  const buf = pc(12, 18);
  buf.rect(2, 2, 8, 13, C.lavender);
  buf.frame(2, 2, 8, 13, C.outline);
  buf.rect(3, 4, 6, 9, C.night);
  buf.heart(6, 6, 1, C.rose);
  buf.px(6, 14, C.cream);
  buf.vline(6, 15, 2, C.mauve);
  buf.heart(6, 16, 1, C.deepRose);
  return buf.commit(scene, key);
}

function moonCharm(scene, key) {
  const buf = pc(14, 16);
  buf.vline(7, 0, 4, C.mauve);
  for (let y = -5; y <= 5; y++) {
    for (let x = -5; x <= 5; x++) {
      const inMoon = x * x + y * y <= 25;
      const inBite = (x - 3) * (x - 3) + (y - 1) * (y - 1) <= 17;
      if (inMoon && !inBite) buf.px(7 + x, 9 + y, C.glow);
    }
  }
  buf.sparkle(4, 7, 2, C.white, 200);
  return buf.commit(scene, key);
}

function dandelion(scene, key) {
  const buf = pc(12, 16);
  buf.vline(6, 7, 9, C.leafDark);
  buf.disc(6, 5, 4, C.white, 160);
  for (const [x, y] of [
    [6, 1],
    [2, 3],
    [10, 3],
    [3, 7],
    [9, 7],
    [6, 9]
  ]) {
    buf.px(x, y, C.white);
    buf.px(x, y + 1, C.milk);
  }
  return buf.commit(scene, key);
}

function cameraFrame(scene, key) {
  const buf = pc(20, 16);
  buf.rect(1, 4, 18, 11, C.plum);
  buf.frame(1, 4, 18, 11, C.outline);
  buf.rect(6, 1, 8, 3, C.plum);
  buf.disc(10, 9, 4, C.grey);
  buf.disc(10, 9, 3, C.night);
  buf.disc(10, 9, 1, C.glow);
  buf.px(16, 6, C.rose);
  return buf.commit(scene, key);
}

function lantern(scene, key) {
  const buf = pc(14, 20);
  buf.vline(7, 0, 3, C.mauve);
  buf.rect(3, 3, 8, 12, C.rose);
  buf.frame(3, 3, 8, 12, C.outline);
  buf.rect(4, 5, 6, 8, C.glow);
  buf.rect(2, 14, 10, 2, C.deepRose);
  buf.px(7, 17, C.gold);
  buf.px(7, 18, C.gold);
  return buf.commit(scene, key);
}

function radioProp(scene, key) {
  const buf = pc(18, 14);
  buf.rect(1, 3, 16, 10, C.powder);
  buf.frame(1, 3, 16, 10, C.outline);
  buf.rect(3, 5, 7, 6, C.night);
  for (let y = 6; y < 11; y += 2) buf.hline(4, y, 5, C.grey);
  buf.disc(13, 7, 2, C.cream);
  buf.px(13, 6, C.deepRose);
  buf.line(15, 3, 17, 0, C.greyDark);
  buf.px(17, 0, C.rose);
  return buf.commit(scene, key);
}

/** Build every prop texture. Call once from BootScene. */
export function buildProps(scene) {
  tree(scene, "prop-tree", false);
  tree(scene, "prop-blossom", true);
  bush(scene, "prop-bush", C.rose);
  bush(scene, "prop-bush-white", C.white);
  bush(scene, "prop-bush-lav", C.lavender);
  lamp(scene, "prop-lamp");
  bench(scene, "prop-bench");
  house(scene, "prop-house-pink", C.milk, C.rose, false);
  house(scene, "prop-house-lav", C.cream, C.deepLavender, false);
  house(scene, "prop-shop", C.milk, C.mauve, true);
  chandelierHouse(scene, "prop-chandelier-house");
  clockTower(scene, "prop-clock");
  car(scene, "prop-car-pink", C.rose, C.milk);
  car(scene, "prop-car-blue", C.deepLavender, C.lavender);
  arch(scene, "prop-arch");
  trophy(scene, "prop-trophy");
  sign(scene, "prop-sign");
  recordPlayer(scene, "prop-record");
  observatory(scene, "prop-observatory");
  pavilion(scene, "prop-pavilion-a", C.rose);
  pavilion(scene, "prop-pavilion-b", C.deepLavender);
  lounger(scene, "prop-lounger");
  moonflower(scene, "prop-moonflower");
  gate(scene, "prop-gate-closed", false);
  gate(scene, "prop-gate-open", true);
  bigMoon(scene, "prop-moon");
  markerEnvelope(scene, "marker-envelope");
  markerStar(scene, "marker-star");
  collectedStar(scene, "star-collected");
  heartParticle(scene, "p-heart");
  sparkParticle(scene, "p-spark");
  railing(scene, "prop-railing");
  fountainHeart(scene, "prop-fountain");
  telescopeSmall(scene, "prop-telescope");
  calendarProp(scene, "prop-calendar");
  phoneCharm(scene, "prop-phone");
  moonCharm(scene, "prop-mooncharm");
  dandelion(scene, "prop-dandelion");
  cameraFrame(scene, "prop-camera");
  lantern(scene, "prop-lantern");
  radioProp(scene, "prop-radio");
}
