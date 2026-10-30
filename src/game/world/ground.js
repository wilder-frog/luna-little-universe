// ---------------------------------------------------------------------------
//  The ground.
//
//  The whole 2400x1600 world is one authored 1200x800 pixel canvas, drawn once
//  at boot and then scaled 2x with nearest-neighbour filtering. That keeps the
//  art crisp and the scene graph tiny — one image instead of thousands of
//  tile objects.
// ---------------------------------------------------------------------------

import { pc, PALETTE as C } from "./pixel.js";
import { SCALE } from "./art.js";

export const WORLD_W = 2400;
export const WORLD_H = 1600;

/** Authored size (world size / SCALE). */
const AW = WORLD_W / SCALE;
const AH = WORLD_H / SCALE;

/** Landmark anchors in AUTHORED coordinates (world / 2). */
export const ANCHORS = {
  plaza: { x: 600, y: 400 },
  racing: { x: 310, y: 580 },
  confession: { x: 520, y: 590 },
  drives: { x: 210, y: 400 },
  "new-year": { x: 380, y: 150 },
  glances: { x: 965, y: 400 },
  pool: { x: 1035, y: 600 },
  chandelier: { x: 600, y: 150 },
  moonflower: { x: 860, y: 145 },
  playlist: { x: 785, y: 595 },
  observatory: { x: 600, y: 735 }
};

/** Walkable routes between places, as the brief's little map describes. */
const ROUTES = [
  ["new-year", "chandelier"],
  ["chandelier", "moonflower"],
  ["new-year", "drives"],
  ["chandelier", "plaza"],
  ["moonflower", "glances"],
  ["drives", "plaza"],
  ["plaza", "glances"],
  ["drives", "racing"],
  ["racing", "confession"],
  ["confession", "plaza"],
  ["confession", "playlist"],
  ["playlist", "glances"],
  ["playlist", "pool"],
  ["plaza", "observatory"],
  ["confession", "observatory"],
  ["glances", "pool"]
];

/** Night-lit areas: [cx, cy, rx, ry]. */
const NIGHT_ZONES = [
  [600, 760, 230, 120], // observatory hill
  [880, 140, 230, 150], // moonflower garden
  [1050, 610, 190, 170], // moonlit pool
  [210, 400, 150, 130] // the lamp-lit road
];

const PATH_W = 11; // half-width in authored px → 22 authored, 44 world

function dither(buf, x, y, color, chance, seed) {
  const h = (x * 73856093) ^ (y * 19349663) ^ seed;
  const r = ((h >>> 0) % 1000) / 1000;
  if (r < chance) buf.px(x, y, color);
}

function fillBase(buf) {
  // Strawberry-milk meadow with a gentle vertical gradient.
  for (let y = 0; y < AH; y++) {
    const t = y / AH;
    const color = t < 0.5 ? C.milk : "#FCDDEA";
    buf.hline(0, y, AW, color);
  }
  // Texture: tufts of powder pink and a few cream flecks.
  buf.speckle(1337, 24000, C.powder, 110);
  buf.speckle(4242, 9000, C.cream, 120);
  buf.speckle(9001, 3000, "#F3A9C6", 90);
  // Little flower dots scattered over the meadow.
  let s = 777;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = 0; i < 900; i++) {
    const x = Math.floor(rnd() * AW);
    const y = Math.floor(rnd() * AH);
    const color = [C.white, C.rose, C.lavender, C.milk][Math.floor(rnd() * 4)];
    buf.px(x, y, color);
    buf.px(x + 1, y, color, 160);
    buf.px(x, y + 1, color, 160);
  }
}

function paintNight(buf) {
  for (const [cx, cy, rx, ry] of NIGHT_ZONES) {
    for (let y = cy - ry; y <= cy + ry; y++) {
      if (y < 0 || y >= AH) continue;
      for (let x = cx - rx; x <= cx + rx; x++) {
        if (x < 0 || x >= AW) continue;
        const d = ((x - cx) ** 2) / (rx * rx) + ((y - cy) ** 2) / (ry * ry);
        if (d <= 0.82) {
          buf.px(x, y, C.night);
        } else if (d <= 1.0) {
          // Dithered edge so night fades into the meadow without a hard ring.
          const chance = (1.0 - d) / 0.18;
          dither(buf, x, y, C.night, chance * 0.95, 31);
          dither(buf, x, y, C.plum, chance * 0.3, 57);
        }
      }
    }
  }
  // Stars in the night areas.
  let s = 2468;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (const [cx, cy, rx, ry] of NIGHT_ZONES) {
    for (let i = 0; i < 160; i++) {
      const a = rnd() * Math.PI * 2;
      const r = Math.sqrt(rnd()) * 0.78;
      const x = Math.round(cx + Math.cos(a) * rx * r);
      const y = Math.round(cy + Math.sin(a) * ry * r);
      const bright = rnd();
      if (bright > 0.9) buf.sparkle(x, y, 2, C.white, 230);
      else buf.px(x, y, bright > 0.6 ? C.white : C.lavender, 180);
    }
  }
}

function paintPool(buf) {
  // The pool itself, in the night zone at the bottom right.
  const cx = 1055;
  const cy = 600;
  buf.ellipse(cx, cy, 72, 42, C.outlineDark);
  buf.ellipse(cx, cy, 70, 40, C.cream);
  buf.ellipse(cx, cy, 66, 36, C.waterDeep);
  buf.ellipse(cx, cy, 64, 34, C.water);
  // Lane-less sheen: horizontal ripples with pink reflections.
  for (let y = cy - 34; y <= cy + 34; y += 3) {
    const half = Math.round(64 * Math.sqrt(Math.max(0, 1 - ((y - cy) / 34) ** 2)));
    buf.hline(cx - half + 2, y, Math.max(0, half * 2 - 4), "#A7C9F0", 120);
  }
  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2;
    const r = 0.3 + ((i * 37) % 60) / 100;
    const x = Math.round(cx + Math.cos(a) * 60 * r);
    const y = Math.round(cy + Math.sin(a) * 30 * r);
    buf.px(x, y, i % 3 ? C.powder : C.milk, 150);
  }
  buf.sparkle(cx - 30, cy - 12, 3, C.white, 200);
  buf.sparkle(cx + 24, cy + 10, 3, C.milk, 190);
  buf.sparkle(cx + 2, cy - 22, 2, C.white, 170);
}

function paintPaths(buf) {
  const put = (x, y) => {
    buf.px(x, y, "#FBEEE4");
    dither(buf, x, y, "#F2DFD2", 0.35, 11);
    dither(buf, x, y, C.cream, 0.2, 23);
  };
  const seg = (x0, y0, x1, y1) => {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= steps; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / steps);
      const y = Math.round(y0 + ((y1 - y0) * i) / steps);
      for (let dy = -PATH_W; dy <= PATH_W; dy++) {
        for (let dx = -PATH_W; dx <= PATH_W; dx++) {
          if (dx * dx + dy * dy <= PATH_W * PATH_W) put(x + dx, y + dy);
        }
      }
    }
  };

  for (const [a, b] of ROUTES) {
    const A = ANCHORS[a];
    const B = ANCHORS[b];
    // L-shaped routes read as deliberate little lanes rather than diagonals.
    const midX = B.x;
    const midY = A.y;
    seg(A.x, A.y, midX, midY);
    seg(midX, midY, B.x, B.y);
  }

  // Rose edging along the lanes: a soft pink lip on the path border.
  for (const [a, b] of ROUTES) {
    const A = ANCHORS[a];
    const B = ANCHORS[b];
    const edge = (x0, y0, x1, y1) => {
      const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
      for (let i = 0; i <= steps; i += 7) {
        const x = Math.round(x0 + ((x1 - x0) * i) / steps);
        const y = Math.round(y0 + ((y1 - y0) * i) / steps);
        const vertical = Math.abs(x1 - x0) < Math.abs(y1 - y0);
        const ox = vertical ? PATH_W : 0;
        const oy = vertical ? 0 : PATH_W;
        for (const sgn of [-1, 1]) {
          buf.px(x + ox * sgn, y + oy * sgn, C.powder, 200);
          buf.px(x + (ox + 1) * sgn, y + (oy + 1) * sgn, C.rose, 150);
        }
      }
    };
    edge(A.x, A.y, B.x, A.y);
    edge(B.x, A.y, B.x, B.y);
  }
}

function paintPlaza(buf) {
  const { x: cx, y: cy } = ANCHORS.plaza;
  // A heart-shaped courtyard. Classic implicit heart curve, plotted exactly.
  const S = 78;
  for (let y = -S; y <= S; y++) {
    for (let x = -S; x <= S; x++) {
      const nx = x / S;
      const ny = -y / S + 0.18;
      const v = (nx * nx + ny * ny - 0.55) ** 3 - nx * nx * ny * ny * ny;
      if (v <= 0) {
        buf.px(cx + x, cy + y, "#FFF4EC");
        dither(buf, cx + x, cy + y, C.milk, 0.3, 5);
        dither(buf, cx + x, cy + y, C.powder, 0.08, 71);
      }
    }
  }
  // Scalloped rose border just inside the heart.
  for (let y = -S; y <= S; y++) {
    for (let x = -S; x <= S; x++) {
      const nx = x / S;
      const ny = -y / S + 0.18;
      const v = (nx * nx + ny * ny - 0.55) ** 3 - nx * nx * ny * ny * ny;
      const nx2 = x / (S - 4);
      const ny2 = -y / (S - 4) + 0.18;
      const v2 = (nx2 * nx2 + ny2 * ny2 - 0.55) ** 3 - nx2 * nx2 * ny2 * ny2 * ny2;
      if (v <= 0 && v2 > 0) buf.px(cx + x, cy + y, C.powder);
    }
  }
  // Tiny hearts ringing the plaza.
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    buf.heart(
      Math.round(cx + Math.cos(a) * 60),
      Math.round(cy + Math.sin(a) * 48),
      1,
      C.powder,
      210
    );
  }
}

function paintRaceTrack(buf) {
  const { x: cx, y: cy } = ANCHORS.racing;
  // Two lanes side by side, with a checkered start line and a heart finish.
  buf.ellipse(cx, cy, 86, 46, "#E9D3DC");
  buf.ellipse(cx, cy, 84, 44, "#D9C3CE");
  buf.ellipse(cx, cy, 54, 22, C.milk);
  // lane divider
  for (let i = 0; i < 360; i += 12) {
    const a = (i / 180) * Math.PI;
    const x = Math.round(cx + Math.cos(a) * 69);
    const y = Math.round(cy + Math.sin(a) * 33);
    buf.px(x, y, C.white);
    buf.px(x, y + 1, C.white);
  }
  // start line
  for (let i = 0; i < 24; i += 4) {
    for (let j = 0; j < 2; j++) {
      const on = (i / 4 + j) % 2 === 0;
      buf.rect(cx - 2 + j * 4, cy - 44 + i, 4, 4, on ? C.white : C.ink);
    }
  }
  buf.heart(cx, cy + 36, 2, C.rose);
}

function paintSquare(buf) {
  const { x: cx, y: cy } = ANCHORS["new-year"];
  buf.ellipse(cx, cy, 70, 52, "#FFF2E8");
  buf.ring(cx, cy, 52, C.powder);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    buf.star(
      Math.round(cx + Math.cos(a) * 40),
      Math.round(cy + Math.sin(a) * 30),
      C.gold,
      200
    );
  }
}

function paintWalkway(buf) {
  const { x: cx, y: cy } = ANCHORS.glances;
  // A tiled walkway for the World Finals scene.
  for (let y = cy - 54; y <= cy + 54; y++) {
    for (let x = cx - 72; x <= cx + 72; x++) {
      const d = ((x - cx) ** 2) / (72 * 72) + ((y - cy) ** 2) / (54 * 54);
      if (d > 1) continue;
      const tile = Math.floor((x + 400) / 12) + Math.floor((y + 400) / 12);
      buf.px(x, y, tile % 2 ? "#F7E9F0" : "#EEDCE6");
      if ((x + 400) % 12 === 0 || (y + 400) % 12 === 0) {
        buf.px(x, y, "#DCC7D4");
      }
    }
  }
}

function paintObservatoryHill(buf) {
  const { x: cx, y: cy } = ANCHORS.observatory;
  buf.ellipse(cx, cy + 10, 150, 66, C.nightDeep);
  buf.ellipse(cx, cy + 6, 140, 58, C.night);
  // Orion's belt and a bright Sirius over the hill, drawn into the ground art.
  const belt = [
    [cx - 36, cy - 48],
    [cx - 18, cy - 54],
    [cx, cy - 60]
  ];
  for (const [x, y] of belt) buf.sparkle(x, y, 3, C.white, 250);
  buf.line(belt[0][0], belt[0][1], belt[2][0], belt[2][1], C.lavender, 70);
  buf.sparkle(cx + 70, cy - 40, 5, C.glow, 255);
  buf.disc(cx + 70, cy - 40, 2, C.white);
}

function paintGardenGround(buf) {
  const { x: cx, y: cy } = ANCHORS.moonflower;
  // A crescent-shaped pond of moonlight.
  for (let y = -46; y <= 46; y++) {
    for (let x = -56; x <= 56; x++) {
      const inMoon = (x * x) / (56 * 56) + (y * y) / (46 * 46) <= 1;
      const inBite =
        ((x - 34) * (x - 34)) / (46 * 46) + (y * y) / (40 * 40) <= 1;
      if (inMoon && !inBite) {
        buf.px(cx + x, cy + y + 10, C.waterDeep);
        dither(buf, cx + x, cy + y + 10, C.lavender, 0.3, 13);
        dither(buf, cx + x, cy + y + 10, C.white, 0.06, 29);
      }
    }
  }
}

/** Draw the entire ground layer and register it as one texture. */
export function buildGround(scene, key = "world-ground") {
  const buf = pc(AW, AH);
  fillBase(buf);
  paintNight(buf);
  paintPaths(buf);
  paintRaceTrack(buf);
  paintSquare(buf);
  paintWalkway(buf);
  paintObservatoryHill(buf);
  paintGardenGround(buf);
  paintPool(buf);
  paintPlaza(buf);
  return buf.commit(scene, key);
}
