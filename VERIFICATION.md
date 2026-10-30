# Build verification report

What was actually run and actually observed, plus what is genuinely still
open. Nothing below is assumed — every line was checked in a real browser
against a running build.

Date of this pass: **31 October 2026**
Node 24.20.0 · npm 11.19.0 · Vite 5.4.21 · Phaser 3.90.0 · Windows 11 · Chromium

---

## Commands run

| Command | Result |
|---|---|
| `npm install` | clean, no vulnerabilities reported |
| `npm test` | **91/91 checks passed** |
| `npm run dev` | serves at `http://localhost:5173/luna-little-universe/` |
| `npm run build` | **succeeds, no warnings** — 1,589 kB JS (378 kB gzipped), 28 kB CSS |
| `npm run preview` | serves the built output at `http://localhost:4173/luna-little-universe/` |

Both the **dev server and the production build** were played through in the
browser. All results below are from real interaction (keyboard events, clicks,
DOM inspection), not from reading the code.

---

## The poem — the part that mattered most

| Check | Result |
|---|---|
| `poem.js` matches `poem.source.txt` byte for byte | ✅ 1922 chars, 85 lines |
| Poem extracted verbatim from the brief's canonical block | ✅ via `sed`, never retyped |
| Trailing spaces inside lines preserved | ✅ (e.g. `…بتحب الغياب ` and `…بيحب البشر `) |
| All 44 `بحبك قد ما` lines present | ✅ |
| `POEM_BODY + POEM_ENDING === FULL_POEM` | ✅ |
| **Text rendered on screen === canonical poem** | ✅ compared in the live DOM, 1922 === 1922 |
| Renders RTL, `lang="ar"`, `white-space: pre-wrap` | ✅ Cairo webfont, line breaks intact |
| Ending (`لأ / بحبك اكتر / لونا يا لونا`) hidden behind *Continue*, then revealed and pulsing | ✅ |
| Ending never permanently hidden — *Show the whole poem* reveals it anytime | ✅ |
| Poem scrolls, font size +/− works, no auto-advance | ✅ |

The ten checkpoint excerpts are **sliced out of the poem by line number**
(`poemExcerpt(4, 5)`), so they are contiguous pieces of the original by
construction and cannot drift. `npm test` additionally asserts
`FULL_POEM.includes(excerpt)` for all ten, and that all ten are distinct.

---

## Gameplay — verified in the browser

| Feature | Result |
|---|---|
| Title screen; music waits for a real click (no autoplay) | ✅ |
| `Begin` on a fresh save / `Continue` when progress exists | ✅ |
| WASD **and** arrow keys walk; diagonals normalised | ✅ moved 158 px in 1.2 s, stops cleanly on key release |
| Walk animation + idle per direction | ✅ `cat-walk-right` → `cat-idle-right` |
| Camera follows, zoom 2, pixel art crisp (no blur) | ✅ |
| Collisions — cat blocked by fountain, by the closed gate, by world bounds | ✅ all three |
| `E` / `Space` / `Enter` interact only within range; prompt shows the target's name | ✅ `"E — Our Little Record Shop"` |
| All **10** memories found, each with its note + exact Arabic excerpt + star | ✅ 0/10 → 10/10 |
| Collectable **in any order** (tested scrambled: 5,1,8,3,10,2,7,4,9 then 6) | ✅ |
| Re-visiting a found memory re-reads it **without** incrementing | ✅ `"You've already found this one…"`, stays 10/10 |
| **9/10 does not open the gate**; gate refuses with `9 / 10` | ✅ |
| 10/10 fires the unlock card, opens the gate, lays a 7-star trail, moon at full glow | ✅ |
| Gate physically passable only once open | ✅ blocked at y 751 closed, walked to y 568 open |
| Moon Sanctuary opens; poem book; ending note | ✅ |
| Free exploration after the ending; *Read my poem again* | ✅ |

### Minigames — all three, all skippable, no fail states

| Minigame | Result |
|---|---|
| **Secret Glance** (loc. 5) | ✅ 3 drifting figures, click **or** keys 1/2/3, wrong guesses just reshuffle and say "So close! Try again ♡", Skip present |
| **Change the Topic** (loc. 7) | ✅ silly topic → chandelier → flips to pink cat, 3 rounds, Skip present |
| **Constellation** (loc. 10) | ✅ 4 stars in order, out-of-order clicks ignored (no penalty), hint after 5 s, reveals **ARTEMIS 🌙 / ORION ✨ / SIRIUS**, Skip present |

All three recorded in the save. **None of them gates a star, the gate, or the
poem** — verified by reaching 10/10 and the finale without touching them.

### The seven small activities

Race flag (two cars meet at a heart), envelope opening, radio with three
frequencies (one answers with her name), three lanterns → fireworks, pool
reflections, watering moonflowers → crescent, flipping three records — ✅ all
open and complete.

### The five secrets

✅ all five found and saved: *Two teams. One sky.* (the parked cars),
*Act natural!* (the camera, with a heart burst), *A wish I keep making*
(the dandelion), *The brightest one* (Sirius), and **CH AN DE LI ER!** after
five pokes. Counter caps correctly at 5/5. None of them blocks anything.

---

## Saving, language, audio, accessibility

| Check | Result |
|---|---|
| Progress survives refresh; `Continue our adventure` appears | ✅ |
| Restart asks first; **"No, keep my progress"** keeps all 10 | ✅ |
| **"Yes, start over"** clears the key, resets HUD to 0/10, closes the gate, resets every marker, dims the moon | ✅ |
| A **second** full playthrough after restart opens the gate again | ✅ |
| Unknown/corrupt save data is sanitised, not crashed on | ✅ by construction + validated ids |
| Finale unlock derived from completed ids, never from a stored boolean | ✅ |
| **EN ⇄ عربي** from title and settings; persists | ✅ |
| Arabic UI: settings, HUD (`قصاصات القصيدة ١٠/١٠`, Arabic-Indic numerals, `dir="rtl"`), in-world sign labels, letter panels | ✅ |
| Notes readable in **both** languages (switch inside each panel) | ✅ |
| Poem always original Arabic regardless of UI language | ✅ |
| **13/13 audio files load** (`readyState` 4), zero errors, zero load failures | ✅ |
| Music actually plays (world track, 130.2 s, looping, volume 0.35) | ✅ not simulated |
| SFX play; music ducks while a panel is open and restores on close | ✅ 0.35 → 0.19 → 0.35 |
| Mute / volume sliders / SFX toggle change real output and persist | ✅ |
| Escape closes every overlay; focus trapped; visible focus rings; `Tab` works | ✅ |
| Arrow keys don't scroll the page; no stuck keys after window blur | ✅ |

---

## Rendering & layout

| Viewport | Result |
|---|---|
| 1366 × 768 (the target) | ✅ canvas fills, HUD and all buttons visible, no clipping |
| 1280 × 720 | ✅ title card fits, both buttons visible |
| 1024 × 600 | ✅ even the poem book fits with the Back button visible |
| Tall/narrow pane (749 × 824) | ✅ world and panels adapt |
| Horizontal page scroll | ✅ none at any size |

- Pixel art is crisp: `pixelArt: true`, `roundPixels: true`, integer camera
  zoom, `image-rendering: pixelated` on the canvas and on every sprite shown
  in the DOM.
- Production build: **no console errors at all**, dev-only globals stripped.
- All asset URLs resolve under `/luna-little-universe/` in the built output.

---

## Content & privacy checks

- ✅ **No invented facts.** No dates, no venue names, no team names, no
  kisses, no swimming. The New Year's note says "our New Year's date" with no
  year; Singapore is "different teams" and "that pool"; the confession has no
  date or place.
- ✅ **No driving hazard.** The Midnight Drive car is explicitly parked and the
  sign reads `MIDNIGHT ROAD — PARKED`; she is never depicted driving.
- ✅ **The poem is not proofread, shortened, translated or censored.**
- ✅ **No copyrighted audio or lyrics.** Song cards carry titles, artists and
  original one-line notes only. In-game music is separate CC0.
- ✅ **No Sanrio artwork.** LunaCat is drawn from scratch in code.
- ✅ **No photos published.** Every slot in `photos.js` is `null`, the photos
  folder is empty, and panels show a pink placeholder — never a broken image.
  Nothing is copied from your computer automatically.
- ✅ `noindex, nofollow` on the page, and the README spells out that a public
  Pages site makes the poem, notes and any photos public.

---

## Limitations & what is deliberately still open

1. **Not deployed.** The Pages workflow, base path and production build are all
   ready and tested locally, but no repository has been pushed and Pages has
   not been enabled, so **there is no live URL yet**. README steps 1–3 do it.
   No URL is claimed to be live anywhere in this project.
2. **The ending note is a draft**, parked alone in `src/data/finale.js` exactly
   so its tone can be decided later. The poem's own ending is fixed.
3. **No photos yet** — by design. Add them only after deciding together which
   ones may be public (README has the steps and the warning).
4. **`PLAYLIST_URL` is empty**, so the "Open our playlist" button is hidden.
   Paste the real link into `src/config.js` to turn it on.
5. **Offline play**: the game needs its first load from the network (no service
   worker). Once loaded it runs without further requests apart from the audio
   files and the two Google fonts, which fall back to system fonts if blocked.
   This was listed as a non-P0 "if feasible" item in the brief.
6. **Bundle size** is 1.59 MB (378 kB gzipped), almost entirely Phaser. Fine
   over a normal connection; it is one chunk rather than code-split because
   splitting a game this size buys nothing.
7. **Tested in Chromium** at several laptop sizes. Safari desktop was not
   available on this machine; nothing used is Safari-sensitive (Ogg Vorbis is
   supported in Safari 15+, and the audio layer degrades silently if a file
   won't play), but it is untested there.
8. The **custom character sprite** path is implemented but off by default and
   therefore exercised only in the "file missing" direction.

---

## Where things live

- Ten love notes → `src/data/story.js`
- The poem → `src/data/poem.js` (**don't edit**) + `src/data/poem.source.txt`
- Ending note → `src/data/finale.js`
- Photos → `src/data/photos.js` + `public/assets/photos/`
- Playlist link → `PLAYLIST_URL` in `src/config.js`
- Licences → `ASSET_CREDITS.md`
