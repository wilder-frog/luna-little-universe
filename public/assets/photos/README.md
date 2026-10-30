# Photos go here — but please read this first

This folder is **empty on purpose**. The game is complete without a single
photo; every photo slot shows a soft pink placeholder instead, and never a
broken image.

## To add one

1. Copy the image into this folder, e.g. `pool.jpg`.
2. Point the matching slot at it in `src/data/photos.js`:

```js
export const PHOTOS = {
  pool: "pool.jpg",
  // …
};
```

3. Reload the game.

Slots: `racing`, `confession`, `drives`, `new-year`, `singapore`, `pool`,
`chandelier`, `moonflower`, `playlist`, `observatory`, `us-together`.

## ⚠ Anything you put here becomes public

If this project is published on GitHub Pages from a public repository, **every
file in this folder is served to anyone who has the URL**, and anyone can read
the repository and its commit history. A hard-to-guess URL is not access
control, and deleting a photo later does not remove it from git history.

So only add photos **both of you** are happy to have on a public website.

Nothing is ever placed in this folder automatically — only what you put here
yourself. If real privacy matters, don't publish to a public Pages site.
