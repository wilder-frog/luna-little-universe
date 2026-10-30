// ---------------------------------------------------------------------------
//  Editable settings. Everything a human might want to change lives here.
// ---------------------------------------------------------------------------

export const GAME_TITLE = "LUNA — A Little Universe for You";
export const GAME_SUBTITLE_EN = "To my Artemis, from your Orion ♡";
export const GAME_SUBTITLE_AR = "إلى أرتميس، من أوريون تبعك ♡";

/**
 * Paste the real "To my Artemis 🌑" playlist link here to turn on the
 * "Open our playlist" button in the Record Shop. Leave it as an empty
 * string and the button stays hidden — nothing else breaks.
 */
export const PLAYLIST_URL = "";

export const PLAYLIST_NAME = "To my Artemis 🌑";
export const PLAYLIST_DESCRIPTION =
  "To my beautiful moon goddess, my light in every night sky. For the one whose glow leads…";

/**
 * Set this to true ONLY after you have put a sprite sheet at
 *   public/assets/character/user-supplied-sprite.png
 * (a 4x4 grid of 16x16 frames: rows = down, up, left, right).
 *
 * Use artwork you have the right to publish. Left false, the game uses the
 * original LunaCat drawn in src/game/world/art.js and never requests the file.
 */
export const USE_CUSTOM_CHARACTER_SPRITE = false;

/** localStorage key. Bump the suffix to invalidate old saves. */
export const SAVE_KEY = "luna-anniversary-v1";

/** How many memories exist. The finale gate opens at this number. */
export const TOTAL_MEMORIES = 10;

/** Resolve a file in /public/assets so it also works under /REPO_NAME/. */
export function asset(path) {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/assets/${path.replace(/^\//, "")}`;
}
