// ---------------------------------------------------------------------------
//  THE TEN MEMORIES
//
//  Every love note below is a FIRST DRAFT — edit `letterEn` / `letterAr`
//  freely, they are plain strings and nothing else depends on their wording.
//
//  `poemExcerpt` is sliced straight out of the canonical poem by line number,
//  so excerpts can never drift from the original. Don't hand-type them.
//
//  `position` is in world pixels (the world is 2400 x 1600).
// ---------------------------------------------------------------------------

import { poemExcerpt } from "./poem.js";

export const CHECKPOINTS = [
  {
    id: "racing",
    order: 1,
    icon: "🏁",
    titleEn: "The Starting Line",
    titleAr: "خط البداية",
    signEn: "START / FINISH",
    signAr: "خط البداية",
    position: { x: 620, y: 1160 },
    interactObject: "a tiny golden trophy",
    interactObjectAr: "كأس صغير",
    letterEn:
      "We met as two people trying to win the same race. You were supposed to be the competition, Luna. Somehow, without either of us realizing it, you became my favorite part of the whole story. I love that our beginning was so unexpected.",
    letterAr:
      "التقينا وإحنا نتنافس في نفس السباق. المفروض تكونين منافستي يا لونا، لكن بطريقة ما صرتِ أجمل جزء في الحكاية كلها. أحب إن بدايتنا كانت مفاجأة ما كانت على بالنا.",
    poemExcerpt: poemExcerpt(4, 5),
    activity: "raceFlag",
    activityLabelEn: "Wave the start flag",
    activityLabelAr: "لوّحي بعلم البداية",
    song: {
      title: "Until I Found You",
      artist: "Stephen Sanchez, Em Beihold",
      meaningEn: "An unexpected meeting, and then finding someone irreplaceable.",
      meaningAr: "لقاء ما كان على البال، وبعدها تلاقي شخص ما له بديل."
    },
    photoSlot: "racing"
  },
  {
    id: "confession",
    order: 2,
    icon: "💗",
    titleEn: "The Confession Garden",
    titleAr: "حديقة الاعتراف",
    signEn: "THE CONFESSION GARDEN",
    signAr: "حديقة الاعتراف",
    position: { x: 1040, y: 1180 },
    interactObject: "a heart-shaped envelope",
    interactObjectAr: "مظروف على شكل قلب",
    letterEn:
      "I still think about the day you told me you liked me. There are moments you replay because you know something changed after them. That was one of mine. You gave me a memory I get to carry around forever.",
    letterAr:
      "للحين أفكر باليوم اللي قلتي لي فيه إنك معجبة فيني. في لحظات نرجع لها ببالنا لأننا نعرف إن بعدها تغيّر شيء. هذي كانت واحدة من أجمل لحظاتي، وذكرى بحملها معي دايم.",
    poemExcerpt: poemExcerpt(6, 8),
    activity: "envelope",
    activityLabelEn: "Open the envelope",
    activityLabelAr: "افتحي المظروف",
    song: {
      title: "From The Start",
      artist: "Laufey",
      meaningEn: "That tense, sweet gap before feelings are finally said out loud.",
      meaningAr: "تلك اللحظة الحلوة المتوترة قبل ما المشاعر تتقال بصوت عالي."
    },
    photoSlot: "confession"
  },
  {
    id: "drives",
    order: 3,
    icon: "🚗",
    titleEn: "Midnight Drive",
    titleAr: "طريق المكالمات",
    signEn: "MIDNIGHT ROAD — PARKED",
    signAr: "طريق المكالمات",
    position: { x: 420, y: 800 },
    interactObject: "a little phone charm with a heart",
    interactObjectAr: "دلاية جوال صغيرة على شكل قلب",
    letterEn:
      "Some of my favorite moments with you were so ordinary: just hearing your voice on those calls while I was out driving. You made even the most forgettable stretches of road feel worth remembering. I never needed anything fancy. Sometimes, I just needed Luna on the other end.",
    letterAr:
      "بعض أحب لحظاتي معك كانت بسيطة جدًا: أسمع صوتك بالمكالمات وأنا بالطريق. حتى المشاوير العادية صارت ذكريات أحب أرجع لها. ما كنت أحتاج شيء كبير، أحيانًا كان يكفيني أسمع لونا.",
    poemExcerpt: poemExcerpt(19, 20),
    activity: "radio",
    activityLabelEn: "Tune the little radio",
    activityLabelAr: "دوّري على موجة الراديو",
    song: {
      title: "Talking to the Moon",
      artist: "Bruno Mars",
      meaningEn: "Closeness that survives distance, and late-night conversation.",
      meaningAr: "قرب ما يكسره بعد، وكلام آخر الليل."
    },
    photoSlot: "drives"
  },
  {
    id: "new-year",
    order: 4,
    icon: "🎆",
    titleEn: "New Year's Square",
    titleAr: "ساحة رأس السنة",
    signEn: "NEW YEAR'S SQUARE",
    signAr: "ساحة رأس السنة",
    position: { x: 760, y: 300 },
    interactObject: "a ribboned calendar",
    interactObjectAr: "تقويم مربوط بشريطة",
    letterEn:
      "Our New Year's date is one of those memories that shines a little differently in my head. A whole new year was beginning, and somehow the thing I was happiest about was being there with you. I hope we get to collect so many more beginnings together.",
    letterAr:
      "موعدنا في رأس السنة له لمعة خاصة بذاكرتي. كانت سنة جديدة تبدأ، وأنا أكثر شيء مفرحني إني معك. وأتمنى تكون قدّامنا بدايات حلوة كثير نعيشها سوا.",
    poemExcerpt: poemExcerpt(21, 22),
    activity: "lanterns",
    activityLabelEn: "Light the three lanterns",
    activityLabelAr: "أشعلي الفوانيس الثلاثة",
    song: {
      title: "golden hour",
      artist: "JVKE",
      meaningEn: "A glowing moment that feels suspended in time.",
      meaningAr: "لحظة مضيئة كأن الوقت واقف فيها."
    },
    photoSlot: "new-year"
  },
  {
    id: "glances",
    order: 5,
    icon: "👀",
    titleEn: "The Secret Glances",
    titleAr: "النظرات المسروقة",
    signEn: "WORLD FINALS WALKWAY",
    signAr: "ممشى النهائيات",
    position: { x: 1930, y: 800 },
    interactObject: "a little moon charm on the railing",
    interactObjectAr: "دلاية قمر على الدرابزين",
    letterEn:
      "Singapore still makes me laugh when I think about how much we looked for each other in a crowd while trying to look like we weren't looking at all. Different teams, so many people around us, and somehow my eyes kept finding you. I think they still do.",
    letterAr:
      "للحين تضحكني ذكريات سنغافورة: كيف كنا ندور بعض بعيوننا بين الناس ونسوي نفسنا ما نطالع. فريقين مختلفين وكل هالناس حولنا، ومع هذا عيوني كانت تلقاك كل مرة. وأظنها للحين تسوي نفس الشيء.",
    poemExcerpt: poemExcerpt(23, 24),
    minigame: "glance",
    minigameLabelEn: "Play: Secret Glance",
    minigameLabelAr: "العبي: النظرة المسروقة",
    song: {
      title: "Can't Take My Eyes Off You",
      artist: "Engelbert Humperdinck",
      meaningEn: "Being playfully, hopelessly obvious about where you're looking.",
      meaningAr: "إنك واضح بشكل مضحك وين عيونك رايحة."
    },
    song2: {
      title: "Those Eyes",
      artist: "New West",
      meaningEn: "How much the small glances actually mattered.",
      meaningAr: "قديش كانت النظرات الصغيرة تعني شي كبير."
    },
    photoSlot: "singapore"
  },
  {
    id: "pool",
    order: 6,
    icon: "🌊",
    titleEn: "Moonlit Pool",
    titleAr: "عند المسبح",
    signEn: "POOLSIDE — QUIET HOURS",
    signAr: "عند المسبح",
    position: { x: 2070, y: 1200 },
    interactObject: "the reflections on the water",
    interactObjectAr: "انعكاسات الماء",
    letterEn:
      "There are places that become special because of who was beside you. That pool in Singapore will always be one of them for me. The lights, the quiet, the fact that you were there — I wish I could put that exact feeling in a bottle and keep it forever.",
    letterAr:
      "في أماكن تصير غالية علينا بس لأن الشخص الصح كان جنبنا. المسبح في سنغافورة بيبقى واحد منها عندي. الأضواء والهدوء ووجودك هناك… ودي لو أقدر أحفظ نفس ذاك الشعور وأرجع له بأي وقت.",
    poemExcerpt: poemExcerpt(25, 26),
    activity: "reflections",
    activityLabelEn: "Touch the reflections",
    activityLabelAr: "المسي الانعكاسات",
    song: {
      title: "Sweet",
      artist: "Cigarettes After Sex",
      meaningEn: "Delicate moments you hold carefully because they're yours.",
      meaningAr: "لحظات رقيقة تحافظ عليها لأنها لكم وحدكم."
    },
    photoSlot: "pool"
  },
  {
    id: "chandelier",
    order: 7,
    icon: "💡",
    titleEn: "Chandelier House",
    titleAr: "بيت الثريا",
    signEn: "CHANDELIER HOUSE",
    signAr: "بيت الثريا",
    position: { x: 1200, y: 300 },
    interactObject: "a ridiculously large chandelier",
    interactObjectAr: "ثريا كبيرة بشكل مضحك",
    letterEn:
      "CHANDELIER. That's it. That's the whole message. Okay, not really. I love that we somehow made pointing a camera at a chandelier into our own language. Of all the ridiculous things in the universe, that little joke belongs to us.",
    letterAr:
      "ثُريّاااا! خلاص، غيرنا الموضوع 😂 لا بس صدق، أحب كيف خلّينا توجيه الكاميرا على الثريا لغة خاصة فينا. من بين كل الأشياء المضحكة بالعالم، هذي النكتة لنا لحالنا.",
    poemExcerpt: poemExcerpt(29, 30),
    minigame: "chandelier",
    minigameLabelEn: "Play: Change the Topic",
    minigameLabelAr: "العبي: غيّري الموضوع",
    photoSlot: "chandelier"
  },
  {
    id: "moonflower",
    order: 8,
    icon: "🌸",
    titleEn: "Moonflower Garden",
    titleAr: "حديقة القمر",
    signEn: "MOONFLOWER GARDEN",
    signAr: "حديقة القمر",
    position: { x: 1720, y: 290 },
    interactObject: "a love letter tucked between the blossoms",
    interactObjectAr: "رسالة بين الزهور",
    letterEn:
      "I call you Luna because you became my moon. You make the ordinary parts of my days feel a little softer, and the dark ones feel less dark. To me, you're not just beautiful. You're warmth, comfort, mischief, and a thousand little things I never want to take for granted.",
    letterAr:
      "أناديك لونا لأنك صرتِ قمري. معك حتى التفاصيل العادية تصير ألطف، والأيام الثقيلة يصير فيها نور. بالنسبة لي جمالك مو بس شكل؛ إنتِ أمان ودفا وضحكة وألف تفصيلة صغيرة ما أبي أعتبرها شيء عادي.",
    poemExcerpt: poemExcerpt(31, 32),
    activity: "flowers",
    activityLabelEn: "Water the moonflowers",
    activityLabelAr: "اسقي زهور القمر",
    song: {
      title: "My Love Mine All Mine",
      artist: "Mitski",
      meaningEn: "Love told through the moon and the night sky.",
      meaningAr: "حب يتقال بالقمر وسما الليل."
    },
    photoSlot: "moonflower"
  },
  {
    id: "playlist",
    order: 9,
    icon: "🎵",
    titleEn: "Our Little Record Shop",
    titleAr: "متجر أغانينا",
    signEn: "OUR LITTLE RECORD SHOP",
    signAr: "متجر أغانينا",
    position: { x: 1570, y: 1190 },
    interactObject: "a pink record player",
    interactObjectAr: "مشغّل أسطوانات وردي",
    letterEn:
      "I made you a playlist because there were feelings I wanted to give you in every possible form. Sometimes a song would make me think of your smile, sometimes of the distance between us, and sometimes just of us being us. I love knowing those songs became part of your days, too.",
    letterAr:
      "سويت لك قائمة الأغاني لأن كان في مشاعر ودي أوصلها لك بكل الطرق. مرات أغنية تذكرني بابتسامتك، ومرات بالشوق، ومرات فينا إحنا الاثنين وبس. وأحب أعرف إن هالأغاني صارت جزء من أيامك بعد.",
    poemExcerpt: poemExcerpt(34, 35),
    activity: "records",
    activityLabelEn: "Flip through the records",
    activityLabelAr: "قلّبي الأسطوانات",
    showsPlaylist: true,
    photoSlot: "playlist"
  },
  {
    id: "observatory",
    order: 10,
    icon: "🌙",
    titleEn: "The Observatory",
    titleAr: "مرصد أوريون",
    signEn: "ORION OBSERVATORY",
    signAr: "مرصد أوريون",
    position: { x: 1200, y: 1470 },
    interactObject: "the telescope",
    interactObjectAr: "التلسكوب",
    letterEn:
      "You call me Orion, and sometimes Sirius, because you say I'm the brightest star. But here's my favorite part: stars only look like magic when there's someone looking up at them. Thank you for seeing me that way, Luna. And for giving me a moon to look for in every sky.",
    letterAr:
      "تسمّيني أوريون، وأحيانًا سيريوس، لأنك تقولين إني ألمع نجمة. بس أجمل شيء بالنسبة لي إنك إنتِ اللي تشوفيني بهالطريقة. شكرًا لأنك تشوفين فيني هالنور يا لونا، ولأنك صرتِ القمر اللي أدوره في كل سما.",
    poemExcerpt: poemExcerpt(43, 44),
    minigame: "constellation",
    minigameLabelEn: "Play: Draw our constellation",
    minigameLabelAr: "العبي: ارسمي كوكبتنا",
    song: {
      title: "Fly Me to the Moon",
      artist: "Frank Sinatra, Count Basie",
      meaningEn: "Artemis and Orion, sharing one sky.",
      meaningAr: "أرتميس وأوريون، وسما واحدة بينهم."
    },
    photoSlot: "observatory"
  }
];

export const CHECKPOINTS_BY_ID = Object.fromEntries(
  CHECKPOINTS.map((c) => [c.id, c])
);

export const INTRO = {
  en: "Some stories start with a race. Ours became a whole universe.",
  ar: "بعض الحكايات تبدأ بسباق… وحكايتنا صارت كون كامل."
};

/** Shown the moment the tenth star is collected. */
export const UNLOCK_MESSAGE = {
  en: "10/10 — Everything I've been trying to tell you has been leading here.",
  ar: "١٠/١٠ — كل شيء كنت أحاول أقوله لك كان يوصّلنا لهنا.",
  subEn: "The moon remembers every little thing.",
  subAr: "القمر يتذكر كل تفصيلة صغيرة."
};
