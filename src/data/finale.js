// ---------------------------------------------------------------------------
//  THE ENDING — THIS FILE IS MEANT TO BE REWRITTEN.
//
//  The poem is fixed. This note is not. It is a DRAFT, parked here on its own
//  so the tone of the ending can be decided later without touching anything
//  else. Edit the strings, save, reload. That's the whole process.
//
//  `showPhoto` only matters if photos.js has an "us-together" entry; with no
//  photo the ending simply renders without one.
// ---------------------------------------------------------------------------

export const FINALE = {
  headingEn: "One year.",
  headingAr: "سنة كاملة.",

  bodyEn:
    "I wrote this a year ago because I was trying to find enough words for you. A year later, I still haven't. But if I could do everything again — the race, every call, every secret glance, every ordinary day — I'd find you again. Happy one year, my Luna. Always your Orion. ♡",

  bodyAr:
    "كتبت هالقصيدة من سنة لأني كنت أحاول ألاقي كلمات تكفيك. وبعد سنة، للحين أحس إن الكلام ما يكفي. ولو رجع فيني الوقت، من السباق لكل مكالمة ولكل نظرة ولكل يوم عادي، برجع أختارك. سنة حلوة يا قمري. أوريون تبعك دايمًا. ♡",

  signatureEn: "— Orion",
  signatureAr: "— أوريون",

  /** Set to false to hide the photo frame in the ending entirely. */
  showPhoto: true,

  /** Which key in photos.js to show here. */
  photoSlot: "us-together"
};

/** The line that greets her when the sanctuary gate finally opens. */
export const SANCTUARY_WELCOME = {
  en: "You found all ten. Come inside — there's one more thing.",
  ar: "لقيتي العشر كلها. تعالي جوّا… في شي أخير."
};
