// ---------------------------------------------------------------------------
//  Where everything stands in the world.
//
//  Coordinates are WORLD pixels. Props are placed bottom-centre so they sit on
//  the ground and sort by depth naturally. `solid` props get a collision box
//  at their feet, so you walk behind a tree but never through a house.
// ---------------------------------------------------------------------------

export const SPAWN = { x: 1200, y: 940 };

/** The gate in the middle of the heart plaza. */
export const GATE = { x: 1200, y: 720 };

/** The floating moon above the plaza, brighter with every star. */
export const HUB_MOON = { x: 1200, y: 606 };

/**
 * prop = [textureKey, x, y, options]
 * options: s = solid, bw/bh = body size, by = body y offset, sc = extra scale
 */
export const SCENERY = [
  // ---- Heart Plaza (spawn) ----------------------------------------------
  ["prop-fountain", 1200, 905, { s: 1, bw: 56, bh: 22 }],
  ["prop-lamp", 1080, 870, { s: 1, bw: 12, bh: 10 }],
  ["prop-lamp", 1320, 870, { s: 1, bw: 12, bh: 10 }],
  ["prop-lamp", 1080, 700, { s: 1, bw: 12, bh: 10 }],
  ["prop-lamp", 1320, 700, { s: 1, bw: 12, bh: 10 }],
  ["prop-blossom", 1010, 960, { s: 1, bw: 16, bh: 12 }],
  ["prop-blossom", 1390, 960, { s: 1, bw: 16, bh: 12 }],
  ["prop-bench", 1130, 980],
  ["prop-bench", 1270, 980],
  ["prop-bush", 1150, 650],
  ["prop-bush-white", 1250, 650],
  ["prop-sign", 1200, 1000],

  // ---- 1 Starting Line ---------------------------------------------------
  ["prop-arch", 620, 1072, { s: 1, bw: 110, bh: 10 }],
  ["prop-car-pink", 560, 1200],
  ["prop-car-blue", 686, 1200],
  ["prop-trophy", 620, 1140],
  ["prop-sign", 540, 1098],
  ["prop-bush", 470, 1090],
  ["prop-bush-white", 770, 1090],
  ["prop-tree", 450, 1250, { s: 1, bw: 16, bh: 12 }],
  ["prop-tree", 790, 1250, { s: 1, bw: 16, bh: 12 }],
  ["prop-lamp", 500, 1240, { s: 1, bw: 12, bh: 10 }],
  ["prop-lamp", 740, 1240, { s: 1, bw: 12, bh: 10 }],

  // ---- 2 Confession Garden ----------------------------------------------
  ["prop-bench", 1040, 1230, { s: 1, bw: 46, bh: 10 }],
  ["prop-blossom", 960, 1160, { s: 1, bw: 16, bh: 12 }],
  ["prop-blossom", 1120, 1160, { s: 1, bw: 16, bh: 12 }],
  ["prop-bush", 980, 1260],
  ["prop-bush", 1100, 1260],
  ["prop-bush-white", 1040, 1300],
  ["prop-sign", 960, 1250],
  ["prop-moonflower", 1000, 1210],
  ["prop-moonflower", 1080, 1210],

  // ---- 3 Midnight Drive --------------------------------------------------
  ["prop-car-pink", 420, 880, { s: 1, bw: 44, bh: 12 }],
  ["prop-lamp", 330, 820, { s: 1, bw: 12, bh: 10 }],
  ["prop-lamp", 510, 820, { s: 1, bw: 12, bh: 10 }],
  ["prop-radio", 470, 836],
  ["prop-phone", 388, 836],
  ["prop-sign", 300, 900],
  ["prop-tree", 280, 700, { s: 1, bw: 16, bh: 12 }],
  ["prop-tree", 560, 700, { s: 1, bw: 16, bh: 12 }],
  ["prop-bush-lav", 350, 940],
  ["prop-bush-lav", 500, 940],

  // ---- 4 New Year's Square ----------------------------------------------
  ["prop-clock", 760, 260, { s: 1, bw: 40, bh: 14 }],
  ["prop-lantern", 660, 330],
  ["prop-lantern", 760, 350],
  ["prop-lantern", 860, 330],
  ["prop-calendar", 700, 390],
  ["prop-sign", 640, 400],
  ["prop-lamp", 600, 300, { s: 1, bw: 12, bh: 10 }],
  ["prop-lamp", 920, 300, { s: 1, bw: 12, bh: 10 }],
  ["prop-blossom", 590, 420, { s: 1, bw: 16, bh: 12 }],
  ["prop-blossom", 930, 420, { s: 1, bw: 16, bh: 12 }],

  // ---- 5 Secret Glances --------------------------------------------------
  ["prop-pavilion-a", 1850, 740, { s: 1, bw: 60, bh: 12 }],
  ["prop-pavilion-b", 2010, 740, { s: 1, bw: 60, bh: 12 }],
  ["prop-railing", 1930, 880],
  ["prop-railing", 1866, 880],
  ["prop-railing", 1994, 880],
  ["prop-mooncharm", 1930, 858],
  ["prop-camera", 2030, 858],
  ["prop-sign", 1810, 860],
  ["prop-lamp", 1790, 800, { s: 1, bw: 12, bh: 10 }],
  ["prop-lamp", 2070, 800, { s: 1, bw: 12, bh: 10 }],
  ["prop-bush", 1840, 900],
  ["prop-bush-lav", 2020, 900],

  // ---- 6 Moonlit Pool ----------------------------------------------------
  ["prop-lounger", 1990, 1130, { s: 1, bw: 36, bh: 8 }],
  ["prop-lounger", 2150, 1130, { s: 1, bw: 36, bh: 8 }],
  ["prop-lamp", 1940, 1100, { s: 1, bw: 12, bh: 10 }],
  ["prop-lamp", 2200, 1100, { s: 1, bw: 12, bh: 10 }],
  ["prop-sign", 1930, 1290],
  ["prop-moonflower", 1960, 1300],
  ["prop-moonflower", 2180, 1300],

  // ---- 7 Chandelier House ------------------------------------------------
  ["prop-chandelier-house", 1200, 300, { s: 1, bw: 100, bh: 26 }],
  ["prop-lamp", 1100, 330, { s: 1, bw: 12, bh: 10 }],
  ["prop-lamp", 1300, 330, { s: 1, bw: 12, bh: 10 }],
  ["prop-bush", 1120, 350],
  ["prop-bush", 1280, 350],
  ["prop-sign", 1090, 390],
  ["prop-blossom", 1030, 400, { s: 1, bw: 16, bh: 12 }],
  ["prop-blossom", 1370, 400, { s: 1, bw: 16, bh: 12 }],

  // ---- 8 Moonflower Garden -----------------------------------------------
  ["prop-moonflower", 1640, 300],
  ["prop-moonflower", 1700, 270],
  ["prop-moonflower", 1760, 300],
  ["prop-moonflower", 1820, 272],
  ["prop-moonflower", 1670, 360],
  ["prop-moonflower", 1790, 360],
  ["prop-dandelion", 1870, 330],
  ["prop-bush-white", 1600, 360],
  ["prop-bush-lav", 1860, 390],
  ["prop-sign", 1590, 300],
  ["prop-tree", 1560, 210, { s: 1, bw: 16, bh: 12 }],
  ["prop-tree", 1900, 230, { s: 1, bw: 16, bh: 12 }],

  // ---- 9 Record Shop ------------------------------------------------------
  ["prop-shop", 1570, 1140, { s: 1, bw: 90, bh: 24 }],
  ["prop-record", 1570, 1200],
  ["prop-sign", 1470, 1200],
  ["prop-lamp", 1480, 1150, { s: 1, bw: 12, bh: 10 }],
  ["prop-lamp", 1660, 1150, { s: 1, bw: 12, bh: 10 }],
  ["prop-bush", 1500, 1240],
  ["prop-bush-white", 1640, 1240],
  ["prop-blossom", 1700, 1120, { s: 1, bw: 16, bh: 12 }],

  // ---- 10 Observatory -----------------------------------------------------
  ["prop-observatory", 1200, 1420, { s: 1, bw: 96, bh: 26 }],
  ["prop-telescope", 1300, 1470],
  ["prop-sign", 1090, 1470],
  ["prop-lamp", 1080, 1420, { s: 1, bw: 12, bh: 10 }],
  ["prop-lamp", 1320, 1420, { s: 1, bw: 12, bh: 10 }],
  ["prop-moonflower", 1120, 1500],
  ["prop-moonflower", 1280, 1500],

  // ---- connective greenery ------------------------------------------------
  ["prop-tree", 900, 620, { s: 1, bw: 16, bh: 12 }],
  ["prop-tree", 1500, 620, { s: 1, bw: 16, bh: 12 }],
  ["prop-tree", 760, 980, { s: 1, bw: 16, bh: 12 }],
  ["prop-tree", 1640, 980, { s: 1, bw: 16, bh: 12 }],
  ["prop-blossom", 980, 480, { s: 1, bw: 16, bh: 12 }],
  ["prop-blossom", 1420, 480, { s: 1, bw: 16, bh: 12 }],
  ["prop-bush", 880, 1340],
  ["prop-bush-lav", 1500, 1340],
  ["prop-bush-white", 300, 1050],
  ["prop-tree", 2150, 900, { s: 1, bw: 16, bh: 12 }],
  ["prop-tree", 250, 560, { s: 1, bw: 16, bh: 12 }],
  ["prop-blossom", 1800, 1060, { s: 1, bw: 16, bh: 12 }]
];

/** Little signs you can read. Not required for anything. */
export const SIGN_LABELS = [
  { id: "racing", x: 540, y: 1098 },
  { id: "confession", x: 960, y: 1250 },
  { id: "drives", x: 300, y: 900 },
  { id: "new-year", x: 640, y: 400 },
  { id: "glances", x: 1810, y: 860 },
  { id: "pool", x: 1930, y: 1290 },
  { id: "chandelier", x: 1090, y: 390 },
  { id: "moonflower", x: 1590, y: 300 },
  { id: "playlist", x: 1470, y: 1200 },
  { id: "observatory", x: 1090, y: 1470 }
];

/**
 * Where the glowing envelope marker for each memory sits, and the exact
 * object you interact with.
 */
export const INTERACT_POINTS = {
  racing: { x: 620, y: 1140 },
  confession: { x: 1040, y: 1205 },
  drives: { x: 470, y: 836 },
  "new-year": { x: 700, y: 390 },
  glances: { x: 1930, y: 858 },
  pool: { x: 2070, y: 1200 },
  chandelier: { x: 1200, y: 356 },
  moonflower: { x: 1730, y: 320 },
  playlist: { x: 1570, y: 1200 },
  observatory: { x: 1300, y: 1470 }
};

/**
 * The five little secrets. None of them gate anything — they're just there
 * for her to stumble on.
 */
export const EASTER_EGGS = [
  {
    id: "egg-cars",
    x: 623,
    y: 1222,
    prop: null,
    needs: 1,
    titleEn: "Two teams. One sky.",
    titleAr: "فريقين… وسما واحدة.",
    bodyEn:
      "Two cars from two different teams, parked side by side like it was always going to end up this way.",
    bodyAr:
      "سيارتين من فريقين مختلفين، واقفين جنب بعض كأن القصة من الأول كانت رايحة لهنا."
  },
  {
    id: "egg-camera",
    x: 2030,
    y: 858,
    prop: null,
    needs: 1,
    titleEn: "Act natural!",
    titleAr: "سوّي نفسك عادي!",
    bodyEn: "Too late. The camera already caught you looking. ♡",
    bodyAr: "متأخرة. الكاميرا لقطتك وإنتِ تطالعين. ♡",
    heartBurst: true
  },
  {
    id: "egg-dandelion",
    x: 1870,
    y: 330,
    prop: null,
    needs: 1,
    titleEn: "A wish I keep making",
    titleAr: "أمنية أكرّرها",
    bodyEn: "A wish I keep making: more days with you.",
    bodyAr: "أمنية أكرّرها كل مرة: أيام أكثر معك."
  },
  {
    id: "egg-sirius",
    x: 1340,
    y: 1390,
    prop: null,
    needs: 1,
    titleEn: "The brightest one",
    titleAr: "ألمع واحدة",
    bodyEn: "Sirius? She says you're the brightest one.",
    bodyAr: "سيريوس؟ هي تقول إنك ألمع واحد."
  },
  {
    // The same secret as poking the chandelier five times inside the
    // minigame, so it shares that id and the counter can't go past 5/5.
    id: "egg-chandelier",
    x: 1300,
    y: 356,
    prop: "prop-lantern",
    needs: 5,
    titleEn: "CH AN DE LI ER!",
    titleAr: "ثُـ ريّـ ـاااا!",
    bodyEn: "Achievement unlocked: Topic successfully changed. ✨",
    bodyAr: "تم فتح الإنجاز: غيّرنا الموضوع بنجاح ✨",
    progressEn: (n, needs) => `…${needs - n} more pokes?`,
    progressAr: (n, needs) => `…باقي ${needs - n} نقزات؟`
  }
];
