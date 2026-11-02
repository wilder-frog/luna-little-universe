// ---------------------------------------------------------------------------
//  npm test — guards the things that must never silently break.
//
//  Above all: that the poem in src/data/poem.js is still byte-for-byte the
//  poem in src/data/poem.source.txt, and that every checkpoint excerpt is a
//  real contiguous piece of it.
// ---------------------------------------------------------------------------

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const { FULL_POEM, POEM_BODY, POEM_ENDING, POEM_INTACT } = await import(
  "../src/data/poem.js"
);
const { CHECKPOINTS } = await import("../src/data/story.js");
const { PHOTOS } = await import("../src/data/photos.js");
const { FINALE } = await import("../src/data/finale.js");

let failures = 0;
let checks = 0;

function check(name, ok, detail) {
  checks += 1;
  if (ok) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? `\n       ${detail}` : ""}`);
  }
}

console.log("\nLUNA — verification\n");

// --- 1. the poem is exactly the source text -------------------------------
console.log("The poem");

let source = readFileSync(join(root, "src/data/poem.source.txt"), "utf8");
source = source.replace(/\r\n/g, "\n");
if (source.endsWith("\n")) source = source.slice(0, -1);

check("poem.js matches poem.source.txt byte for byte", FULL_POEM === source,
  FULL_POEM === source
    ? ""
    : `lengths ${FULL_POEM.length} vs ${source.length}`);

check("the two halves reconstruct the poem exactly", POEM_INTACT);
check("POEM_BODY + POEM_ENDING === FULL_POEM", POEM_BODY + POEM_ENDING === FULL_POEM);
check("the poem is 85 lines", FULL_POEM.split("\n").length === 85,
  `got ${FULL_POEM.split("\n").length}`);
check("the poem opens with لونا القموره....", FULL_POEM.startsWith("لونا القموره...."));
check("the poem closes with لونا يا لونا", FULL_POEM.endsWith("لونا يا لونا"));
check(
  "the ending is the final three lines only",
  POEM_ENDING === "\nلأ\nبحبك اكتر\n\nلونا يا لونا",
  JSON.stringify(POEM_ENDING)
);
check(
  "لأ / بحبك اكتر appears exactly once",
  (FULL_POEM.match(/\nلأ\nبحبك اكتر/g) || []).length === 1
);
check(
  "trailing spaces inside the poem are preserved",
  FULL_POEM.includes("بحبك قد ما الشمس بتحب الغياب \n") &&
    FULL_POEM.includes("بحبك قد ما الموت بيحب البشر... \n")
);
check(
  "all 44 بحبك قد ما lines are present",
  (FULL_POEM.match(/بحبك قد ما/g) || []).length === 44,
  `got ${(FULL_POEM.match(/بحبك قد ما/g) || []).length}`
);

// --- 2. the ten checkpoints -----------------------------------------------
console.log("\nThe ten memories");

check("there are exactly ten", CHECKPOINTS.length === 10, `got ${CHECKPOINTS.length}`);

const EXPECTED_IDS = [
  "racing",
  "confession",
  "drives",
  "new-year",
  "glances",
  "pool",
  "chandelier",
  "moonflower",
  "playlist",
  "observatory"
];
check(
  "the ids are the stable ones from the brief",
  EXPECTED_IDS.every((id) => CHECKPOINTS.some((c) => c.id === id)),
  CHECKPOINTS.map((c) => c.id).join(", ")
);

const ids = new Set();
for (const cp of CHECKPOINTS) {
  check(`${cp.id}: unique id`, !ids.has(cp.id));
  ids.add(cp.id);
  check(
    `${cp.id}: excerpt is a contiguous piece of the poem`,
    FULL_POEM.includes(cp.poemExcerpt),
    JSON.stringify(cp.poemExcerpt)
  );
  check(`${cp.id}: has an English note`, (cp.letterEn || "").length > 60);
  check(`${cp.id}: has an Arabic note`, (cp.letterAr || "").length > 40);
  check(`${cp.id}: has both titles`, Boolean(cp.titleEn && cp.titleAr));
  check(
    `${cp.id}: sits inside the world`,
    cp.position.x > 0 &&
      cp.position.x < 2400 &&
      cp.position.y > 0 &&
      cp.position.y < 1600
  );
}

// Every excerpt should be distinct, or two memories would show the same lines.
const excerpts = CHECKPOINTS.map((c) => c.poemExcerpt);
check("all ten excerpts are different", new Set(excerpts).size === 10);

// --- 3. minigames ----------------------------------------------------------
console.log("\nMinigames");
const minigames = CHECKPOINTS.filter((c) => c.minigame).map((c) => c.minigame);
check("there are three minigames", minigames.length === 3, minigames.join(", "));
check(
  "they are glance, chandelier and constellation",
  ["glance", "chandelier", "constellation"].every((k) => minigames.includes(k))
);

// --- 4. optional things are genuinely optional -----------------------------
console.log("\nOptional content");
check(
  "no photo is required (all slots may be null)",
  Object.values(PHOTOS).every((v) => v === null || typeof v === "string")
);
check("the finale note is editable text", typeof FINALE.bodyEn === "string");
check("the finale has an Arabic version too", typeof FINALE.bodyAr === "string");

// --- 4b. audio is only ever set up once -----------------------------------
// A second audio.preload() builds a fresh set of Audio elements and leaves the
// old ones playing where the mute button cannot reach them, so you hear two
// copies of the same track. Guard both halves of that.
console.log("\nAudio wiring");
const { readFileSync: readSrc } = await import("node:fs");
const audioSrc = readSrc(join(root, "src/game/systems/Audio.js"), "utf8");
check(
  "preload() refuses to run twice",
  /preload\(\)\s*\{[\s\S]{0,400}?if \(this\.preloaded\) return;/.test(audioSrc)
);
const preloadCallers = [
  "src/main.js",
  "src/game/scenes/BootScene.js",
  "src/game/scenes/WorldScene.js"
].filter((f) => /audio\.preload\(\)/.test(readSrc(join(root, f), "utf8")));
check(
  "exactly one place calls audio.preload()",
  preloadCallers.length === 1,
  preloadCallers.join(", ") || "none"
);

// --- 5. audio files are really on disk ------------------------------------
console.log("\nAudio files on disk");
const { statSync } = await import("node:fs");
const AUDIO = [
  "public/assets/sfx/click.ogg",
  "public/assets/sfx/envelope.ogg",
  "public/assets/sfx/collect.ogg",
  "public/assets/sfx/twinkle.ogg",
  "public/assets/sfx/chandelier.ogg",
  "public/assets/sfx/pop.ogg",
  "public/assets/sfx/blip.ogg",
  "public/assets/sfx/gate.ogg",
  "public/assets/sfx/fanfare.ogg",
  "public/assets/sfx/success.ogg",
  "public/assets/music/menu.ogg",
  "public/assets/music/world.ogg",
  "public/assets/music/sanctuary.ogg"
];
for (const f of AUDIO) {
  let size = 0;
  try {
    size = statSync(join(root, f)).size;
  } catch {
    size = 0;
  }
  check(`${f} exists and is not empty`, size > 1000, `${size} bytes`);
}

// --- done ------------------------------------------------------------------
console.log(
  `\n${checks - failures}/${checks} checks passed${
    failures ? ` — ${failures} FAILED` : " ✓"
  }\n`
);
process.exit(failures ? 1 : 0);
