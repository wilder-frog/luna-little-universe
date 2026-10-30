// ---------------------------------------------------------------------------
//  OPTIONAL PHOTOS — nothing here is required. The game is complete without
//  a single photo, and shows a soft pink placeholder card instead.
//
//  HOW TO ADD A PHOTO
//  1. Drop the file into  public/assets/photos/
//  2. Set the matching slot below to its filename, e.g. "pool.jpg"
//  3. Reload. That's it.
//
//  ⚠ PRIVACY: this project is built to be published on GitHub Pages. ANY file
//  you commit under public/assets/photos/ is served publicly to anyone who
//  has (or guesses) the URL, and an unlisted URL is not access control.
//  Only add photos BOTH of you are happy to have on a public website.
//  Nothing in this folder is published unless you put it there yourself.
// ---------------------------------------------------------------------------

/** slot id -> filename inside public/assets/photos/ (or null for none) */
export const PHOTOS = {
  racing: null,
  confession: null,
  drives: null,
  "new-year": null,
  singapore: null,
  pool: null,
  chandelier: null,
  moonflower: null,
  playlist: null,
  observatory: null,
  "us-together": "us-together.jpeg"
};

/** Optional captions shown under a photo. Safe to leave blank. */
export const PHOTO_CAPTIONS = {
  racing: { en: "", ar: "" },
  confession: { en: "", ar: "" },
  drives: { en: "", ar: "" },
  "new-year": { en: "", ar: "" },
  singapore: { en: "", ar: "" },
  pool: { en: "", ar: "" },
  chandelier: { en: "", ar: "" },
  moonflower: { en: "", ar: "" },
  playlist: { en: "", ar: "" },
  observatory: { en: "", ar: "" },
  "us-together": { en: "", ar: "" }
};

export function hasPhoto(slot) {
  return Boolean(slot && PHOTOS[slot]);
}

export function photoFile(slot) {
  return PHOTOS[slot] || null;
}
