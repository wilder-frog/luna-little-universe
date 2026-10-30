// ---------------------------------------------------------------------------
//  Interface strings. `t(key)` reads the current language; Arabic panels get
//  dir="rtl" applied per-panel rather than flipping the whole game.
// ---------------------------------------------------------------------------

const STRINGS = {
  en: {
    begin: "Begin our little adventure ♡",
    continueAdventure: "Continue our adventure ♡",
    startOver: "Start from the beginning",
    forLuna: "For Luna",
    toMyArtemis: "To my Artemis 🌑",
    madeBy: "Made with love by Orion",
    twoTeams: "Two teams. One sky.",
    next: "Next ♡",
    close: "Close",
    back: "Back",
    skip: "Skip",
    done: "Done ♡",
    memories: "Memories",
    poemFragment: "A fragment of our poem",
    revealFragment: "Reveal the poem fragment ♡",
    starCollected: "A little star joined your sky ✧",
    alreadyFound: "You've already found this one — reread it as often as you like.",
    songCard: "A song that belongs here",
    openPlaylist: "Open our playlist ↗",
    playlistNote:
      "Your real playlist, played by Spotify. The background music in the game is separate, freely-licensed music.",
    interactHint: "E — Open letter",
    interactHintGeneric: "E — Look closer",
    mapTitle: "Our little universe",
    mapHint: "M — Map",
    found: "Found",
    notFound: "Not found yet",
    settings: "Settings",
    music: "Music",
    sfx: "Sound effects",
    language: "Language",
    on: "On",
    off: "Off",
    restart: "Restart",
    restartConfirm:
      "Start a brand new adventure? This clears all ten memories and your progress.",
    restartYes: "Yes, start over",
    restartNo: "No, keep my progress",
    gateLocked: "The sanctuary gate is still sleeping.",
    gateLockedSub: "Find all ten memories and it will open for you.",
    gateOpen: "The gate is open ♡",
    enterSanctuary: "Enter the Moon Sanctuary",
    openPoem: "Open our poem ♡",
    poemTitle: "Our Poem",
    readAgain: "Read my poem again ♡",
    backToWorld: "Back to our universe",
    continuePoem: "Continue ♡",
    showWholePoem: "Show the whole poem",
    fontSmaller: "A−",
    fontBigger: "A+",
    photoPlaceholder: "a photo can live here",
    controlsTitle: "How to play",
    controlsMove: "WASD or arrow keys — walk",
    controlsInteract: "E or Space — interact",
    controlsClose: "Esc — close a panel",
    controlsMap: "M — map",
    gotIt: "Got it ♡",
    help: "Help",
    minigameSkipped: "Skipped — nothing is lost, the memory is still yours.",
    easterEgg: "A little secret ✧",
    loading: "Warming up the moon…",
    audioNotice: "Tap anywhere to let the music in ♪",
    progressSaved: "Progress saves itself as you go.",
    sanctuaryHint: "The Moon Sanctuary — the middle of our universe"
  },
  ar: {
    begin: "نبدأ رحلتنا الصغيرة ♡",
    continueAdventure: "نكمّل رحلتنا ♡",
    startOver: "نبدأ من الأول",
    forLuna: "إلى لونا",
    toMyArtemis: "إلى أرتميس 🌑",
    madeBy: "بكل حب، من أوريون",
    twoTeams: "فريقين… وسما واحدة.",
    next: "التالي ♡",
    close: "إغلاق",
    back: "رجوع",
    skip: "تخطّي",
    done: "تم ♡",
    memories: "قصاصات القصيدة",
    poemFragment: "مقطع من قصيدتنا",
    revealFragment: "اكشفي مقطع القصيدة ♡",
    starCollected: "نجمة صغيرة انضمت لسماك ✧",
    alreadyFound: "لقيتيها من قبل — اقرئيها كل ما حبيتي.",
    songCard: "أغنية تنتمي لهنا",
    openPlaylist: "افتحي قائمة أغانينا ↗",
    playlistNote:
      "قائمتك الحقيقية، تشتغل عبر Spotify. وموسيقى اللعبة الخلفية موسيقى ثانية مرخّصة بحرّية.",
    interactHint: "E — افتحي الرسالة",
    interactHintGeneric: "E — تطلّعي أقرب",
    mapTitle: "كوننا الصغير",
    mapHint: "M — الخريطة",
    found: "لقيتيها",
    notFound: "ما لقيتيها بعد",
    settings: "الإعدادات",
    music: "الموسيقى",
    sfx: "المؤثرات الصوتية",
    language: "اللغة",
    on: "تشغيل",
    off: "إيقاف",
    restart: "إعادة",
    restartConfirm: "نبدأ رحلة جديدة من الأول؟ هذا يمسح العشر ذكريات وكل تقدّمك.",
    restartYes: "نعم، من الأول",
    restartNo: "لا، خلّي تقدّمي",
    gateLocked: "بوابة الحرم القمري للحين نايمة.",
    gateLockedSub: "لقّي العشر ذكريات كلها وبتفتح لك.",
    gateOpen: "البوابة انفتحت ♡",
    enterSanctuary: "ادخلي الحرم القمري",
    openPoem: "افتحي قصيدتنا ♡",
    poemTitle: "قصيدتنا",
    readAgain: "اقرئي قصيدتي مرة ثانية ♡",
    backToWorld: "رجوع لكوننا",
    continuePoem: "كمّلي ♡",
    showWholePoem: "اعرضي القصيدة كاملة",
    fontSmaller: "A−",
    fontBigger: "A+",
    photoPlaceholder: "هنا يمكن تعيش صورة",
    controlsTitle: "كيف تلعبين",
    controlsMove: "WASD أو الأسهم — للحركة",
    controlsInteract: "E أو المسافة — للتفاعل",
    controlsClose: "Esc — لإغلاق النافذة",
    controlsMap: "M — الخريطة",
    gotIt: "فهمت ♡",
    help: "مساعدة",
    minigameSkipped: "تخطّيتيها — ما ضاع شيء، الذكرى لك.",
    easterEgg: "سر صغير ✧",
    loading: "نسخّن القمر…",
    audioNotice: "المسي أي مكان عشان تشتغل الموسيقى ♪",
    progressSaved: "تقدّمك يتحفظ تلقائيًا.",
    sanctuaryHint: "الحرم القمري — قلب كوننا"
  }
};

let current = "en";

export function setLanguage(lang) {
  current = lang === "ar" ? "ar" : "en";
  document.documentElement.setAttribute("data-lang", current);
  return current;
}

export function getLanguage() {
  return current;
}

export function isArabic() {
  return current === "ar";
}

export function t(key) {
  return STRINGS[current][key] ?? STRINGS.en[key] ?? key;
}

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** 6 -> ٦ when the interface is Arabic, otherwise unchanged. */
export function num(value) {
  const s = String(value);
  if (current !== "ar") return s;
  return s.replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

/** Pick the right field off a data object, e.g. pick(cp, "title"). */
export function pick(obj, base) {
  const key = current === "ar" ? `${base}Ar` : `${base}En`;
  return obj[key] ?? obj[`${base}En`] ?? "";
}
