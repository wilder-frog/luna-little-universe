# HANDOFF — LUNA, A Little Universe for You

Project folder: `C:\Users\wilde\Documents\LUNAGAME`
Status: **built, tested, playable. NOT deployed.**

A pastel browser game (Vite + Phaser 3, vanilla JS) made as a one-year
anniversary gift for Luna (Zainah) from Orion. Walk a white cat with a pink
bow around a pink world, find 10 memories, unlock the Moon Sanctuary, read the
full Arabic poem. ~15 min.

---

## Run it

```bash
npm install
npm run dev     # http://localhost:5173/luna-little-universe/
npm run build
npm run preview
npm test        # 91 checks — poem integrity + audio files on disk
```

The `/luna-little-universe/` path matters: `vite.config.js` sets
`base: "/luna-little-universe/"` for GitHub Pages.

---

## ⚠ RULE #1 — DO NOT TOUCH THE POEM

`src/data/poem.js` is the complete Arabic poem Orion wrote a year ago,
reproduced **byte for byte**: dialect, repetitions, punctuation, apparent
typos and trailing spaces are all intentional.

- It was generated verbatim from `src/data/poem.source.txt`.
- `npm test` compares the two and fails on any difference.
- The 10 checkpoint excerpts are **sliced out of it by line number**
  (`poemExcerpt(4, 5)`), never retyped.

Do not proofread, "fix", translate, shorten or reformat it. Do not regenerate
it. If a task seems to require editing it, stop and ask.

---

## What is done and verified

- 10 landmarks, each with EN + AR love note, exact Arabic poem excerpt, a star
- Collectable in any order; re-reads don't re-count; 9/10 does NOT open the
  gate, 10/10 does
- Moon Sanctuary → full poem (RTL, scrollable, font size controls) → final
  three lines revealed separately → ending note
- 3 skippable minigames (Secret Glance, Change the Topic, Constellation),
  7 small activities, 5 hidden secrets — none gate anything
- Bilingual EN / عربي UI, Arabic-Indic numerals, RTL panels
- Save/resume via localStorage, Restart with confirmation
- Real CC0 audio (13 files, all load and play), music/SFX toggles, volume,
  ducking
- World artwork is generated in code at boot; one approved personal photo
  is now included for the ending.
- Tested 1366×768, 1280×720, 1024×600; no horizontal scroll; no console errors

Full detail: `VERIFICATION.md`.

---

## What is still open (your job)

1. **Photos** — approved photo #3 added as `public/assets/photos/us-together.jpeg`
   and wired to the ending. All ten memory slots remain empty. No other source
   photos were copied. See `PUBLISHING.md` for publishing preparation.
2. **Publish to GitHub Pages** — workflow is ready, nothing pushed yet.
3. **Rewrite the ending note** — `src/data/finale.js`, it's a draft on purpose.
4. **Playlist URL** — `PLAYLIST_URL` in `src/config.js` is empty, so the
   "Open our playlist" button is hidden. Paste the real link to turn it on.

---

## 1. Adding photos

The game is complete with zero photos — slots show a pink placeholder, never a
broken image.

1. Put the file in `public/assets/photos/` (e.g. `pool.jpg`)
2. Point the slot at it in `src/data/photos.js`:

```js
export const PHOTOS = {
  pool: "pool.jpg",
  "us-together": "us.jpg",
  // the rest can stay null
};
```

3. Reload.

Slots: `racing`, `confession`, `drives`, `new-year`, `singapore`, `pool`,
`chandelier`, `moonflower`, `playlist`, `observatory`, `us-together` (ending).
Optional captions in `PHOTO_CAPTIONS`. Clicking a photo enlarges it.

**PRIVACY — important.** A public GitHub Pages repo serves every committed
file to anyone with the URL, and git history keeps a photo even after you
delete it. An unlisted URL is not access control. **Only add photos the couple
has explicitly approved for a public site. Never bulk-copy a photo folder.
Ask which specific files are approved before adding any.**

---

## 2. Publishing to GitHub Pages

```bash
git init -b main && git add . && git commit -m "LUNA — a little universe for you"
git remote add origin https://github.com/USERNAME/luna-little-universe.git
git push -u origin main
```

Then: GitHub → **Settings → Pages → Build and deployment → Source** →
**GitHub Actions**.

`.github/workflows/deploy.yml` runs `npm ci`, `npm test`, `npm run build` and
deploys `dist/`. Final URL:
`https://USERNAME.github.io/luna-little-universe/`

Different repo name → change `REPO` in `vite.config.js`.
User page (`USERNAME.github.io`) → `VITE_BASE=/ npm run build`.
itch.io → `VITE_BASE=./ npm run build`, zip the **contents** of `dist/`.

Do not claim the site is live until it has actually been opened in a browser.

---

## File map

```text
src/
  config.js            PLAYLIST_URL, save key, USE_CUSTOM_CHARACTER_SPRITE
  data/
    poem.js            THE POEM — generated, verbatim, DO NOT EDIT
    poem.source.txt    source of truth; npm test compares against it
    story.js           the 10 memories: EN/AR notes, excerpts, positions
    finale.js          ending note — meant to be rewritten
    photos.js          photo slots (all null)
    songs.js           song titles + our notes (no audio, no lyrics)
  game/
    Game.js            Phaser config (pixelArt, RESIZE, zoom 2)
    scenes/BootScene.js    draws every texture at boot
    scenes/WorldScene.js   world, interactables, gate, HUD wiring
    entities/LunaCat.js
    world/pixel.js         pixel-plotting toolkit (no antialiasing)
    world/art.js           cat spritesheet + all props
    world/ground.js        the whole 2400×1600 ground as one texture
    world/landmarks.js     prop placement, collisions, signs, secrets
    systems/Progress.js    localStorage save (validated on load)
    systems/Audio.js       HTMLAudio over CC0 files
    systems/Minigames.js   3 minigames + 7 activities
  ui/
    Overlay.js         modal foundation (focus trap, Esc)
    Dialogue.js        the pink letter panel
    Book.js            the poem reader
    Controls.js        title, HUD, map, settings, sanctuary, finale
    translations.js    every UI string, EN + AR
```

---

## Conventions to keep

- Plain JS modules, no framework, no TypeScript. Match surrounding style.
- Game text/overlays are **DOM**, not Phaser text — Arabic needs real shaping,
  RTL and scrolling. Phaser is only for the world and movement.
- Arabic blocks always get `dir="rtl"`, `lang="ar"`, `white-space: pre-wrap`.
- All artwork is generated in `pixel.js` / `art.js` / `ground.js`. Don't add
  image files for world art.
- Only CC0 / properly licensed assets, recorded in `ASSET_CREDITS.md`.
  No copyrighted music, no lyrics, no Sanrio/Hello Kitty artwork.
- No invented relationship facts: no dates, venues, team names, or physical
  details that weren't given. "One Year" only.
- Run `npm test` and `npm run build` before claiming anything works.

## Other docs

- `README.md` — install, run, deploy, editing, photo instructions
- `VERIFICATION.md` — what was tested and how, plus known limitations
- `ASSET_CREDITS.md` — licences for every bundled asset
- `LUNA_ANNIVERSARY_GAME_CLAUDE_CODE_BRIEF.md` — the original spec
