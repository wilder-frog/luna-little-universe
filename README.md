# LUNA — A Little Universe for You 🎀🌙

> To my Artemis, from your Orion ♡
> *Two teams. One sky.*

A small pastel browser game made for one person. You walk a white cat with a
pink bow around a connected pink world, find ten memories, and at the end the
Moon Sanctuary opens with the complete poem.

Roughly 15 minutes. No accounts, no server, no install. Runs from a link.

---

> **Picking this up fresh (or handing it to another assistant)?**
> Read **[HANDOFF.md](HANDOFF.md)** first — current state, what's left to do,
> and the one rule that matters (don't touch the poem).

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open **<http://localhost:5173/luna-little-universe/>**
(the `/luna-little-universe/` part matters — see *Base path* below).

Other commands:

```bash
npm run build
```

```bash
npm run preview
```

```bash
npm test
```

`npm test` checks the poem is still byte-for-byte identical to the original,
that all ten excerpts are real contiguous pieces of it, and that every audio
file is actually on disk. It runs in CI before every deploy.

---

## How to play

| Key | Does |
|---|---|
| `W A S D` / arrow keys | walk |
| `E` or `Space` | interact with whatever you're standing next to |
| `Enter` | confirm |
| `M` | the little map |
| `Esc` | close any panel |

Everything is also clickable, and every panel can be reached with `Tab`.

### On a phone

It plays on a phone too. The phone layout and the on-screen controls appear
on phones and tablets only — they key off the *device*, not the window size,
so dragging a laptop window narrow keeps the desktop layout:

- **Thumbstick**, bottom left — drag anywhere inside the pad; it drops under
  your thumb wherever you touch. It's analog, so a small push walks slowly.
- **Action button**, bottom right — it lights up and names whatever she's
  standing next to, and stays dim when there's nothing to open.

The camera zooms out a little on narrow screens so there's enough world in
view, and panels go full-width. Portrait is the better way to read the poem;
landscape works but the reading window is shorter.

Progress saves itself. You can collect the ten memories **in any order**, and
re-read any of them as often as you like without changing the count. The three
minigames and the five hidden secrets are **optional** — they never block the
ending.

---

## Publishing it to GitHub Pages

The repository is set up for a project page at
`https://YOUR-USERNAME.github.io/luna-little-universe/`.

1. Create a repository named **`luna-little-universe`** on GitHub.
   (Different name? See *Base path* below.)
2. Push this folder to it on the `main` branch:

```bash
git init -b main && git add . && git commit -m "LUNA — a little universe for you"
```

```bash
git remote add origin https://github.com/YOUR-USERNAME/luna-little-universe.git && git push -u origin main
```

3. On GitHub: **Settings → Pages → Build and deployment → Source** →
   choose **GitHub Actions**.
4. That's it. `.github/workflows/deploy.yml` builds and deploys on every push
   to `main`. The first run takes a couple of minutes; the Actions tab shows
   progress and prints the final URL.

> **Not yet deployed.** Everything needed is in place and the production build
> has been tested locally, but no site has been published from here — nobody
> has pushed to a repository or enabled Pages yet. Do steps 1–3 and the URL
> above becomes real.

### Base path

`vite.config.js` sets `base` to `/luna-little-universe/`. If your repo has a
different name, change `REPO` at the top of that file, or override per build:

```bash
VITE_BASE=/my-repo-name/ npm run build
```

For a user page (`USERNAME.github.io`):

```bash
VITE_BASE=/ npm run build
```

### itch.io instead

```bash
VITE_BASE=./ npm run build
```

Then zip the **contents** of `dist/` (so `index.html` is at the root of the
zip) and upload it as an HTML5 project.

---

## Editing it

Everything you'd want to change is a plain string in one small file.

### The ten love notes — `src/data/story.js`

Each memory has `letterEn` and `letterAr`. They are **first drafts**; rewrite
them freely. Nothing else depends on the wording.

```js
{
  id: "racing",
  letterEn: "We met as two people trying to win the same race. …",
  letterAr: "التقينا وإحنا نتنافس في نفس السباق. …",
}
```

You can also change `titleEn` / `titleAr`, the sign text, the song card, and
`position` (where the landmark sits in the 2400×1600 world).

### The ending note — `src/data/finale.js`

This file exists specifically so the ending can be decided later. Edit
`bodyEn` / `bodyAr`, save, reload. That's the whole process.

### The poem — `src/data/poem.js` — **don't edit this one**

The poem is reproduced exactly as it was written a year ago: the dialect, the
repetitions, the punctuation, even the trailing spaces at the ends of some
lines. It is generated verbatim from `src/data/poem.source.txt`, and `npm test`
compares the two on every run and in CI.

The ten checkpoint excerpts are **sliced out of the poem itself** by line
number, so they can never drift away from the original:

```js
poemExcerpt: poemExcerpt(4, 5)   // lines 4–5 of the poem, exactly
```

If you ever genuinely need to change the poem, edit `poem.source.txt` and
regenerate — but the intention is that this text stays untouched.

### The playlist link — `src/config.js`

```js
export const PLAYLIST_URL = "";   // paste the real link here
```

Leave it empty and the button simply doesn't appear. Paste a link and the
Record Shop grows an "Open our playlist ↗" button that opens it in a new tab.
Nothing is ever embedded or streamed.

---

## Adding photos

**The game is complete with no photos at all** — it shows a soft pink
placeholder card instead, never a broken image.

1. Put the image in `public/assets/photos/`
2. Point the matching slot at it in `src/data/photos.js`:

```js
export const PHOTOS = {
  pool: "pool.jpg",
  "us-together": "us.jpg",
  // …everything else can stay null
};
```

3. Reload.

Slots available: `racing`, `confession`, `drives`, `new-year`, `singapore`,
`pool`, `chandelier`, `moonflower`, `playlist`, `observatory`, and
`us-together` (the ending). Optional captions live in `PHOTO_CAPTIONS`.
Clicking a photo in game opens it larger.

### ⚠ Please read this before adding photos

**GitHub Pages on a public repository serves every committed file to anyone
who has the URL.** An unlisted or hard-to-guess URL is *not* access control,
and anyone can read the page source, the repo, and its commit history — a photo
stays in history even if you delete it later.

So:

- Only add photos **both of you** are comfortable having on a public website.
- Nothing in `public/assets/photos/` is published unless **you** put it there.
  This project will never copy files out of a folder on your computer by
  itself.
- If real privacy matters, don't use a public Pages site — host it somewhere
  that requires a login, and don't publish the source bundle.

The same applies to the poem and the love notes: on a public repo, they are
public.

---

## A custom character sprite

The default cat is original artwork drawn in code. To use your own instead:

1. Save a sprite sheet at `public/assets/character/user-supplied-sprite.png` —
   a 4×4 grid of 16×16 frames, rows in the order **down, up, left, right**.
2. Set `USE_CUSTOM_CHARACTER_SPRITE = true` in `src/config.js`.

Only use artwork you have the right to publish. If the flag is on and the file
is missing, the game logs a warning and quietly uses the original cat.

---

## What's inside

```text
src/
  config.js              playlist URL, save key, custom-sprite flag
  data/
    poem.js              THE POEM — generated, verbatim, don't edit
    poem.source.txt      the poem's source of truth (npm test compares them)
    story.js             the ten memories: notes, excerpts, positions
    finale.js            the ending note — meant to be rewritten
    photos.js            optional photo slots (all null by default)
    songs.js             song titles + our notes (no audio, no lyrics)
  game/
    Game.js              Phaser config
    scenes/              Boot (draws all art) and World
    entities/LunaCat.js  the cat
    world/               pixel toolkit, art, ground, landmark layout
    systems/             Progress (save), Audio, Minigames
  ui/
    Overlay.js           the panel/modal foundation
    Dialogue.js          the pink letter panel
    Book.js              the poem reader
    Controls.js          title, HUD, map, settings, sanctuary, finale
    translations.js      every interface string, EN + AR
```

World artwork is generated at boot. Media on disk includes the CC0 audio and
one approved personal ending photo, `public/assets/photos/us-together.jpeg`.
See `PUBLISHING.md` for the prepared GitHub Pages checklist.

---

## Credits & licensing

See **[ASSET_CREDITS.md](ASSET_CREDITS.md)**. Short version: all art is drawn
by this project's own code, all audio is CC0 from OpenGameArt, fonts are OFL,
Phaser and Vite are MIT. No commercial music, no lyrics, no Sanrio artwork.

---

*This is not a game about winning. It's a game about all the times two people
found each other.* ♡
