# Asset credits

Everything bundled with this game is either **drawn by this project's own code**
or a **CC0 (public domain) file downloaded from its original source**. No
copyrighted music, no scraped artwork, no third-party character IP.

---

## Artwork — original, generated at runtime

**All** of the game's visuals are drawn pixel by pixel in code at boot:

| What | Where |
|---|---|
| Pixel plotting toolkit | `src/game/world/pixel.js` |
| LunaCat sprite sheet, props, markers, particles | `src/game/world/art.js` |
| The whole 2400×1600 ground layer | `src/game/world/ground.js` |
| Minigame sprites (visitors, chandelier, records, lanterns…) | `src/game/systems/Minigames.js` |

No image files ship with this project, so there is nothing to attribute and
nothing that can 404.

### About the cat

**LunaCat** is an original character: a round white cat with a pink bow,
designed as pixel matrices in `src/game/world/art.js`.

She is **not** Hello Kitty and is not derived from Sanrio artwork. No Sanrio
image, logo or likeness has been downloaded, traced or redistributed here.

If you want to use different character art, see "A custom character sprite" in
the README — but only use artwork you have the right to publish.

---

## Sound effects — CC0

**"100 CC0 SFX"** by **rubberduck**
<https://opengameart.org/content/100-cc0-sfx>
Licence: **CC0 1.0 Universal (public domain dedication)** — stated on the
source page. Attribution is not required; it is given here anyway.

Files used (renamed for clarity, otherwise unmodified):

| In this project | Original file |
|---|---|
| `public/assets/sfx/click.ogg` | `switch_01.ogg` |
| `public/assets/sfx/envelope.ogg` | `paper_02.ogg` |
| `public/assets/sfx/collect.ogg` | `bell_01.ogg` |
| `public/assets/sfx/twinkle.ogg` | `bell_03.ogg` |
| `public/assets/sfx/chandelier.ogg` | `glass_02.ogg` |
| `public/assets/sfx/pop.ogg` | `plop_01.ogg` |
| `public/assets/sfx/blip.ogg` | `switch_02.ogg` |
| `public/assets/sfx/gate.ogg` | `key_open_01.ogg` |

**"50 CC0 retro synth SFX"** by **rubberduck**
<https://opengameart.org/content/50-cc0-retro-synth-sfx>
Licence: **CC0 1.0 Universal** — stated on the source page.

| In this project | Original file |
|---|---|
| `public/assets/sfx/fanfare.ogg` | `power_up_04.ogg` |
| `public/assets/sfx/success.ogg` | `power_up_01.ogg` |

---

## Music — CC0

All three tracks are by **MintoDog**, published on OpenGameArt under
**CC0 1.0 Universal** (stated on each source page). Files are used unmodified.

| In this project | Track | Source |
|---|---|---|
| `public/assets/music/menu.ogg` | Cozy Puzzle — Title (95 BPM) | <https://opengameart.org/content/cozy-puzzle-title> |
| `public/assets/music/world.ogg` | Cozy Puzzle — In-Game 1 (118 BPM) | <https://opengameart.org/content/cozy-puzzle-in-game-1> |
| `public/assets/music/sanctuary.ogg` | Cozy Puzzle — In-Game 3 (108 BPM) | <https://opengameart.org/content/cozy-puzzle-in-game-3> |

---

## Fonts

Loaded from Google Fonts at runtime, with system fallbacks if the network is
unavailable:

- **Quicksand** — Andrew Paglinawan et al., **SIL Open Font License 1.1**
- **Cairo** — Mohamed Gaber et al., **SIL Open Font License 1.1**
  (used for all Arabic text, including the poem)

---

## Code

- **Phaser 3** — Photon Storm, **MIT License** — <https://phaser.io>
- **Vite** — **MIT License** — <https://vitejs.dev>

---

## The songs in the Record Shop are references, not audio

The "To my Artemis 🌑" playlist cards in `src/data/songs.js` and `src/data/story.js`
contain **only song titles, artist names, and our own one-line notes** about why
a song belongs to a memory.

This project does **not**:

- host, embed, stream or bundle any commercial recording,
- reproduce any lyrics,
- generate covers of copyrighted songs,
- or claim that any of those tracks play in the game.

The music that actually plays is the separate CC0 set listed above. If you set
`PLAYLIST_URL` in `src/config.js`, the Record Shop shows a button that opens
your real playlist in a new tab — a plain link, nothing embedded.

---

## Personal photograph

`public/assets/photos/us-together.jpeg` is the user's supplied personal photo,
explicitly approved for the public site on 2026-10-31. It is not a CC0 asset
and no third-party reuse license is granted here.

## The poem and the love notes

The Arabic poem in `src/data/poem.js` and the ten love notes in
`src/data/story.js` are **Orion's own writing**, not third-party content. The
poem is reproduced exactly as written and must not be edited — see the README.
