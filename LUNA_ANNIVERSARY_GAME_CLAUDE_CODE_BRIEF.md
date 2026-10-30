# LUNA — A Little Universe for You 🎀🌙

> **IMPLEMENTATION BRIEF FOR CLAUDE CODE** — A complete, personal 2D anniversary game for Luna (Zainah) from her Orion / Sirius. Deliver a playable static browser game, not just a mockup. Build-first: use the content in this file, implement, test, and document deployment. Do not stop at planning; do not ask for clarification unless a technical blocker makes implementation impossible. User will supply their personal photos separately alongside this `.md` file.

## 0. The non-negotiable vision

**Pitch:** An adorable pastel-pink, pixel-art-and-cartoon browser sandbox. Luna controls a cute white cat with a pink bow and wanders around a connected miniature world. Ten interactive landmarks reveal deeply personal love notes and exact fragments of an Arabic poem written by Orion a year ago. Some locations offer tiny minigames, secret interactions, songs-as-memory references, and optional photo frames. After all ten are found, a moonlit sanctuary opens and reveals the **complete, unedited poem**, culminating in its final words. The epilogue beyond the poem must be editable; no fixed ending tone until the couple decides.

**For:** one person, playing on a **laptop** from a link. Roughly **15 minutes** from start to finish. No accounts, login, servers, passwords, or installation. Works when deployed on **GitHub Pages**. Main game should run offline *after assets load* if feasible, but this is not a P0 requirement.

**Authentic story details:**
- Real name: Zainah; he calls her **Luna**. His pet name for her is **Artemis**. She calls him **Orion** or **Sirius** because she says he's the brightest star.
- They met competing against each other at **STEM Racing Nationals, Saudi Arabia, 2025**.
- She confessed that she liked him. Do not invent the exact date, location, or circumstances.
- They remember a **New Year's date**. Do not invent a year, venue, or specific events.
- They used to talk while he was driving (make no dangerous gameplay mechanic or implication that she was driving).
- In **Singapore during the STEM Racing World Finals**, they represented Saudi Arabia on **different teams**. They kept looking at each other, trying to be discreet due to strict social expectations.
- They shared a memory together **by the pool in Singapore**. Do not invent swimming or kissing if not stated.
- Private joke: when one wanted to change the subject on a call, they pointed the camera at the **chandelier**. “Chandelier” became code for **change the topic**.
- Last year he wrote an Arabic poem addressed to Luna. **Preserve the complete poem EXACTLY, including unusual wording, repetitions, punctuation, spacing where relevant, and dialect**. This is personal writing, not a text to proofread or fact-check. Use it as art rather than treating references to mythology/etymology as researched facts.
- Playlist made for her: **“To my Artemis 🌑”**, description: **“To my beautiful moon goddess, my light in every night sky. For the one whose glow leads…”**. She listens to it a lot. References to familiar song titles/moods are welcome, **do not quote copyrighted song lyrics or embed recordings of commercial songs** unless the owner separately provides appropriate rights. Show titles, artists, and a hyperlink to *their actual playlist* if a URL is later provided.

### Success criteria — all must be working, not merely simulated

- [ ] Open site on laptop; title/start menu works; sound is user-enabled, not autoplay-forced.
- [ ] Top-down walk with WASD + arrow keys; camera follows; collisions prevent walking through props; E/Space to interact and Enter to confirm.
- [ ] Connected explorable pink world with 10 clearly differentiated landmarks and a consistent art style.
- [ ] Discover 10 unique love notes, 10 exact poem excerpts, and track discoveries without requiring sequence.
- [ ] Two to three tiny, low-frustration minigames with Skip buttons. Easter eggs are optional and never block the ending.
- [ ] All popup text is readable and keyboard-accessible; original Arabic excerpts render RTL, with line breaks preserved.
- [ ] Bilingual experience: English + Arabic interface toggle; personal love notes in both languages; the poem always retains its original Arabic.
- [ ] Whole poem shown EXACTLY in a scrollable readable book, with correct RTL; its final lines get their own reveal.
- [ ] Final sanctuary unlocks at 10/10; replay/explore again without losing poem access.
- [ ] Continue progress after refresh (localStorage), with Restart/New Adventure confirmation and a clear reset option.
- [ ] Music & sound effects from existing properly licensed online files — **no synthesized placeholder sounds**, **no pretend audio playback**. Mute/music/SFX controls.
- [ ] Responsive laptop viewport (1366×768 minimum target and smaller windows); scale pixel art without blur; no horizontal browser page scroll.
- [ ] `npm install`, `npm run dev`, `npm run build`, `npm run preview` all work; GitHub Pages Actions workflow included; deployed paths work under `/REPO_NAME/`.

## 1. Artistic direction

**Title:** `LUNA — A Little Universe for You`
**Subtitle:** `To my Artemis, from your Orion ♡`
**World identity:** “Two teams. One sky.”; a gentle narrative of rivals → secret glances → everyday closeness → one shared universe.

**Palette:** strawberry milk `#FFE7F0`, powder pink `#F8BBD0`, rose `#EA84AC`, dusty mauve `#B76E98`, soft lavender `#D7C4F2`, cream `#FFF9F6`, night-sky plum `#443452`, white `#FFFFFF`; dark readable body text `#56394A`. Night locations use `#37304F`, glowing stars, pink/lavender lights. Pink should dominate without becoming visually flat.

**Style:** clean 16×16 or 32×32 top-down pixel tiles enlarged with nearest-neighbor scaling; decorative UI can be soft cartoon/rounded paper cards. Heart particles, little bows, cherry blossoms, tiny sparkling stars, moon signs, scalloped borders, soft dialogue windows. Use CSS/Phaser effects sparingly and avoid lag or overengineered shaders. Maintain readability and contrast.

**Character rights / design:** Build a legally safe **original** cute white cat avatar with pink bow, round silhouette and expressive walking animation, referred to internally as `LunaCat` (not presented as official Hello Kitty). User requested both an actual Hello Kitty character and an original inspired character: support an **optional custom character sprite override** via `public/assets/character/user-supplied-sprite.png` **only if the user supplies artwork they have permission to publish**. Do not download/rehost Sanrio art or logos without permission. Make the default avatar sufficiently original rather than an exact Hello Kitty replica. No blocking dependence on this override.

**Map:** A *single connected* top-down world (approx. 2400×1600 logical px, flexible) with visible paths between 10 landmarks, rose bridges/flower patches, pink lamp posts, small houses, stars near observatory. Spawn at a central heart-shaped courtyard. Keep distance short: the player should be able to cross the map in seconds, not minutes. Distinctive landmarks make exploring fun, not tedious. Central gated **Moon Sanctuary** opens at 10/10. Use interactive shimmering hearts or envelopes above object locations, not invisible pixel-hunting.

### Illustrative world organization (not rigid geography)

```text
      [4 New Year's Square] — [7 Chandelier House] — [8 Moonflower Garden]
             |                      |                       |
[3 Midnight Drive] — [HEART PLAZA / SPAWN / FINAL GATE] — [5 Secret Glances]
             |                |                             |
      [1 Starting Line] — [2 Confession Garden] — [9 Record Shop] — [6 Moonlit Pool]
                                     |
                            [10 Observatory / Star Path]
```

Each venue is a themed exterior or tiny room-like nook in the same contiguous map, not 10 huge different maps. Put a readable sign at every venue. Provide an optional small map overlay (M key) with discovered landmarks marked, a hint system, and a HUD like `♡ Memories 6/10` / `قصاصات القصيدة ٦/١٠`.

## 2. Interaction loop and pacing

1. Start screen: “For Luna / To my Artemis 🌑 / Made with love by Orion”. `Begin our little adventure ♡`.
2. Intro card: `Some stories start with a race. Ours became a whole universe.` / `بعض الحكايات تبدأ بسباق… وحكايتنا صارت كون كامل.`
3. Walk around with WASD/arrows; interact with letter, star, cassette, bench, photo, or themed object using E/Space. Press Escape to close overlays, and Enter/Space for Next when safe.
4. Every location opens a pink letter panel with the *personal note*, then reveals a **verbatim Arabic excerpt**, then collects a little pink constellation star. On later visits, she can reread without changing count.
5. Optionally play short minigames (10–30 seconds). Always include `Skip` and clear instructions; all main story collectible items remain available whether skipped or completed.
6. HUD shows discovery progress; floating moon at hub glows brighter with each star.
7. After 10/10, a gentle animation announces: `The moon remembers every little thing.` Gate unlocks. She can still explore freely.
8. At Moon Sanctuary, a multi-page/scrolled `Our Poem / قصيدتنا` opens, using the **full original poem** below. Preserve *all* lines. Long list may be in a scrollable continuous page; final `لأ / بحبك اكتر / لونا يا لونا` must reveal separately after scrolling or explicitly continuing, without trapping the player.
9. A final personal message/photo/surprise scene is **configurable** (initial text supplied below but should be trivially editable). Offer `Read the poem again` and `Explore our world again`.

**Target 15-minute pacing**: title & intro 45 seconds; 10 stops ~50–70 seconds each including walking and reading (~10–12 minutes); 2–3 minigames ~20–30 seconds each; poem & ending 2–3 minutes. No unskippable dialogue animations, timers, mandatory fetch quests, or difficult navigation. It is okay if a fast reader finishes in 10 minutes or a reflective reader stays for 20.

## 3. The exact 10 memories, narration, and poem fragments

**Implementation schema:** For every checkpoint store `{id,titleEn,titleAr,position,interactObject,letterEn,letterAr,poemExcerpt,optionalMiniGame,musicReference,photoSlot}` in a single editable `src/data/story.js` or `.ts`. All ten IDs are stable, e.g. `racing`, `confession`, `drives`, `new-year`, `glances`, `pool`, `chandelier`, `moonflower`, `playlist`, `observatory`. All messages are proposed *first drafts*, meaning user may edit them; do not present imagined details as established memories. `poemExcerpt` must be an **exact contiguous excerpt** of the canonical full poem, not a reworded translation. Consider a simple unit test `fullPoem.includes(checkpoint.poemExcerpt)` for all ten.

### 1 — 🏁 The Starting Line / خط البداية

**Scene:** Pink miniature race track with two little cars starting on separate lanes, STEM-style checkered arch and hearts. No real team branding needed. Interact with a tiny trophy.

**EN love note:**
> We met as two people trying to win the same race. You were supposed to be the competition, Luna. Somehow, without either of us realizing it, you became my favorite part of the whole story. I love that our beginning was so unexpected.

**AR companion:**
> التقينا وإحنا نتنافس في نفس السباق. المفروض تكونين منافستي يا لونا، لكن بطريقة ما صرتِ أجمل جزء في الحكاية كلها. أحب إن بدايتنا كانت مفاجأة ما كانت على بالنا.

**Poem excerpt (exact):**
```text
لو تعرفي شو بصير فيني بس تنذكرِي…
كان قلتي للقمر يوسّعلك مطرحو
```
**Tiny interaction:** Press a start flag to make two small race cars drive forward and meet at a heart. This is a cute animation, not a skill-based game. **Music meaning card:** `Until I Found You — Stephen Sanchez, Em Beihold` (unexpected discovery and finding someone who becomes irreplaceable).

### 2 — 💗 The Confession Garden / حديقة الاعتراف

**Scene:** Flower-covered bench, floating pixel butterflies, little heart inside an envelope.

**EN love note:**
> I still think about the day you told me you liked me. There are moments you replay because you know something changed after them. That was one of mine. You gave me a memory I get to carry around forever.

**AR companion:**
> للحين أفكر باليوم اللي قلتي لي فيه إنك معجبة فيني. في لحظات نرجع لها ببالنا لأننا نعرف إن بعدها تغيّر شيء. هذي كانت واحدة من أجمل لحظاتي، وذكرى بحملها معي دايم.

**Poem excerpt:**
```text
يا لونا…
جمالك مو بس شكل
جمالك طريقة، وحضور، ونفس
```
**Interaction:** heart-shaped envelope slowly opens with sparkling animation. **Music meaning card:** `From The Start — Laufey` (the tension of feelings before they are finally spoken).

### 3 — 🚗 Midnight Drive / طريق المكالمات

**Scene:** Cozy parked car beside a lamp-lit road under the moon, small phone charm with a heart. Important: **parked** for the interaction (no gameplay encouraging distraction while driving).

**EN love note:**
> Some of my favorite moments with you were so ordinary: just hearing your voice on those calls while I was out driving. You made even the most forgettable stretches of road feel worth remembering. I never needed anything fancy. Sometimes, I just needed Luna on the other end.

**AR companion:**
> بعض أحب لحظاتي معك كانت بسيطة جدًا: أسمع صوتك بالمكالمات وأنا بالطريق. حتى المشاوير العادية صارت ذكريات أحب أرجع لها. ما كنت أحتاج شيء كبير، أحيانًا كان يكفيني أسمع لونا.

**Poem excerpt:**
```text
لونا اللي لون عيونا لون السهر
وغفوة جفونا، مره بهالدهر
```
**Interaction:** A tiny radio with three whimsical illustrated frequencies; one responds with a heart and her name. **Music meaning card:** `Talking to the Moon — Bruno Mars` (closeness across distance and late-night conversation).

### 4 — 🎆 New Year's Square / ساحة رأس السنة

**Scene:** Little clock tower, pink fireworks (slow harmless confetti animations), fairy lights, a ribboned calendar with no asserted date.

**EN love note:**
> Our New Year's date is one of those memories that shines a little differently in my head. A whole new year was beginning, and somehow the thing I was happiest about was being there with you. I hope we get to collect so many more beginnings together.

**AR companion:**
> موعدنا في رأس السنة له لمعة خاصة بذاكرتي. كانت سنة جديدة تبدأ، وأنا أكثر شيء مفرحني إني معك. وأتمنى تكون قدّامنا بدايات حلوة كثير نعيشها سوا.

**Poem excerpt:**
```text
ضحكتك ضو
وصوتك نغم
```
**Interaction:** Tap 3 glowing lanterns to light up pink fireworks; can Skip. **Music meaning card:** `golden hour — JVKE` (a glowing, suspended-in-time moment).

### 5 — 👀 The Secret Glances / النظرات المسروقة

**Scene:** Two team pavilions with different colored flags (non-real branding) on a miniature Singapore walkway; stars glimmer when the cat steps toward them. Use gentle humor, not shame.

**EN love note:**
> Singapore still makes me laugh when I think about how much we looked for each other in a crowd while trying to look like we weren't looking at all. Different teams, so many people around us, and somehow my eyes kept finding you. I think they still do.

**AR companion:**
> للحين تضحكني ذكريات سنغافورة: كيف كنا ندور بعض بعيوننا بين الناس ونسوي نفسنا ما نطالع. فريقين مختلفين وكل هالناس حولنا، ومع هذا عيوني كانت تلقاك كل مرة. وأظنها للحين تسوي نفس الشيء.

**Poem excerpt:**
```text
قلبك حب
وعيونك حلم
```
**MiniGame A — Secret Glance:** A 20-second, silly hide-and-seek game with three moving silhouettes: click or choose the one holding a tiny moon charm. Fail state simply tries again; `Skip` available. **Music meaning card:** `Can't Take My Eyes Off You — Engelbert Humperdinck` and optional `Those Eyes — New West` (looking for her / importance of small glances).

### 6 — 🌊 Moonlit Pool / عند المسبح

**Scene:** Blue-and-lavender pixel pool at night with pink reflections, two lounge chairs, soft starlight; **do not depict invented physical affection**.

**EN love note:**
> There are places that become special because of who was beside you. That pool in Singapore will always be one of them for me. The lights, the quiet, the fact that you were there — I wish I could put that exact feeling in a bottle and keep it forever.

**AR companion:**
> في أماكن تصير غالية علينا بس لأن الشخص الصح كان جنبنا. المسبح في سنغافورة بيبقى واحد منها عندي. الأضواء والهدوء ووجودك هناك… ودي لو أقدر أحفظ نفس ذاك الشعور وأرجع له بأي وقت.

**Poem excerpt:**
```text
كل خطوة جنبك فرح
وكل لحظة بعيد عنك وجع
```
**Interaction:** Click twinkling pool reflections to reveal tiny constellation particles and a photo frame if photo provided. **Music meaning card:** `Sweet — Cigarettes After Sex` (delicate cherished moments, without quoting lyrics).

### 7 — 💡 Chandelier House / بيت الثريا

**Scene:** Little pink house with an oversized, ridiculous chandelier, silly curtain and spinning light; this is the comedic relief.

**EN love note:**
> CHANDELIER. That's it. That's the whole message. Okay, not really. I love that we somehow made pointing a camera at a chandelier into our own language. Of all the ridiculous things in the universe, that little joke belongs to us.

**AR companion:**
> ثُريّاااا! خلاص، غيرنا الموضوع 😂 لا بس صدق، أحب كيف خلّينا توجيه الكاميرا على الثريا لغة خاصة فينا. من بين كل الأشياء المضحكة بالعالم، هذي النكتة لنا لحالنا.

**Poem excerpt:**
```text
ويا ريت الأيام تمشي أسرع شوي
لأجي لعندِك… وتسمعي نبضي شو بدّو يروي
```
**MiniGame B — Change the Topic:** Chat bubbles pop up with exaggerated random topics; hit a glowing chandelier button and the bubble instantly flips to a picture of a pink cat or heart. Do this 3 times. Never use messages that imply a real conflict. `Skip` available. **Easter egg:** Clicking the chandelier five times shows `CH AN DE LI ER! Achievement: Topic successfully changed.` Keep wording cute, not jarring.

### 8 — 🌸 Moonflower Garden / حديقة القمر

**Scene:** Glowing moonflowers, dreamy crescent pond, white blossoms on purple night ground. Love-letter centerpiece.

**EN love note:**
> I call you Luna because you became my moon. You make the ordinary parts of my days feel a little softer, and the dark ones feel less dark. To me, you're not just beautiful. You're warmth, comfort, mischief, and a thousand little things I never want to take for granted.

**AR companion:**
> أناديك لونا لأنك صرتِ قمري. معك حتى التفاصيل العادية تصير ألطف، والأيام الثقيلة يصير فيها نور. بالنسبة لي جمالك مو بس شكل؛ إنتِ أمان ودفا وضحكة وألف تفصيلة صغيرة ما أبي أعتبرها شيء عادي.

**Poem excerpt:**
```text
لأنّو مهما بعدتي…
إنتِ أقرب من همسة حبّ، وأغلى من أماني قلبي المخبّاية
```
**Interaction:** Water three flowers; they bloom into a crescent. **Music meaning card:** `My Love Mine All Mine — Mitski` (love expressed through celestial imagery).

### 9 — 🎵 Our Little Record Shop / متجر أغانينا

**Scene:** Pink record player, cassettes with bows, tiny album display. Feature the actual playlist name and introductory description *exactly as supplied*.

**EN love note:**
> I made you a playlist because there were feelings I wanted to give you in every possible form. Sometimes a song would make me think of your smile, sometimes of the distance between us, and sometimes just of us being us. I love knowing those songs became part of your days, too.

**AR companion:**
> سويت لك قائمة الأغاني لأن كان في مشاعر ودي أوصلها لك بكل الطرق. مرات أغنية تذكرني بابتسامتك، ومرات بالشوق، ومرات فينا إحنا الاثنين وبس. وأحب أعرف إن هالأغاني صارت جزء من أيامك بعد.

**Poem excerpt:**
```text
انا عجزت عبر قديش بحبك
فأنا هلأ، رح خلي قلبي هو اللي يحكي عني
```
**Interaction:** Click 3 record sleeves to reveal 3 short *original* mood interpretations and titles:
- `Those Eyes — New West`: small glances and tiny things that became everything.
- `Talking to the Moon — Bruno Mars`: your moon still feels near, even when she's far.
- `Fly Me to the Moon — Frank Sinatra, Count Basie`: Artemis and Orion sharing one sky.
Offer optional `Open our playlist` button, disabled/hidden until `PLAYLIST_URL` is configured. **Do not stream or embed recordings, scrape lyrics, or claim these tracks play.** Actual in-game background music must be a separate CC0 / properly licensed cozy loop.

### 10 — 🌙 The Observatory / مرصد أوريون

**Scene:** Central moon observatory on a hill. Sky is purple-plum with sparkling stars; a bright one is labeled Sirius; Orion constellation nearby; Luna/Artemis moon glows at the top. Night feels magical but keep it visually readable.

**EN love note:**
> You call me Orion, and sometimes Sirius, because you say I'm the brightest star. But here's my favorite part: stars only look like magic when there's someone looking up at them. Thank you for seeing me that way, Luna. And for giving me a moon to look for in every sky.

**AR companion:**
> تسمّيني أوريون، وأحيانًا سيريوس، لأنك تقولين إني ألمع نجمة. بس أجمل شيء بالنسبة لي إنك إنتِ اللي تشوفيني بهالطريقة. شكرًا لأنك تشوفين فيني هالنور يا لونا، ولأنك صرتِ القمر اللي أدوره في كل سما.

**Poem excerpt:**
```text
بحبك قد ما النغم بيحب الوتر
بحبك قد ما الشعر بيحب القمر
```
**MiniGame C — Constellation:** Link 4 bright dots in a suggested order to create a simple heart/constellation. No penalty and `Skip` available. When solved, reveal two softly pulsing labels `ARTEMIS 🌙` and `ORION ✨` and an optional tiny star labeled `SIRIUS`. **Music meaning card:** `Fly Me to the Moon — Frank Sinatra, Count Basie`.

**Final unlocking:** After all ten stars collected, show `10/10 — Everything I've been trying to tell you has been leading here.` / `١٠/١٠ — كل شيء كنت أحاول أقوله لك كان يوصّلنا لهنا.` A pink trail of stars guides her to the central Moon Sanctuary gate. **Do not require completing minigames or finding Easter eggs to unlock the finale.**

## 4. Moon Sanctuary and the full poem

Moon Sanctuary is a cozy indoor/sky-like final area with a giant moon and floating paper pages. Reveal `A poem I wrote for you a year ago / قصيدة كتبتها لك من سنة`. A `<div dir="rtl" lang="ar">` or equivalent DOM reading panel is strongly preferred over Phaser bitmap text to preserve Arabic shaping; load a friendly Arabic webfont if possible, but give reliable system fallback. Keep line breaks via `white-space: pre-wrap` and avoid auto-trimming the poem. Provide font-size controls, scroll and `Back` buttons, no auto-advance of this long poem. Don't alter poem spelling, wording or punctuation, including any apparent typos. The poem is authored in dialect and contains personal lines.

**Full poem source of truth:** Store the following as a UTF-8 constant or source text file and reproduce it unchanged. The poem excerpts above are small selections, not a replacement for the complete text. The **full poem is the centerpiece**. Its last three lines should be revealed/emphasized only after she finishes/continues through the rest (without hiding lines permanently).

<!-- BEGIN CANONICAL POEM: DO NOT EDIT THE TEXT BETWEEN THESE MARKERS -->

```text
لونا القموره....


لو تعرفي شو بصير فيني بس تنذكرِي…
كان قلتي للقمر يوسّعلك مطرحو
يا لونا…
جمالك مو بس شكل
جمالك طريقة، وحضور، ونفس
وكلمة “لونا” لحالا
بتعمل للعاشقين مدرسة


اخ يا لونا
لك بتعرفي شو معنى لونا؟
اصولها فرنسية، معناها قمر، والقمر عندن مؤنث، وبيقولولو Lunnetta
بس آلهة القمر هي لونا

لونا يا لونا
لونا اللي لون عيونا لون السهر
وغفوة جفونا، مره بهالدهر
ضحكتك ضو
وصوتك نغم
قلبك حب
وعيونك حلم
كل خطوة جنبك فرح
وكل لحظة بعيد عنك وجع


ويا ريت الأيام تمشي أسرع شوي
لأجي لعندِك… وتسمعي نبضي شو بدّو يروي
لأنّو مهما بعدتي…
إنتِ أقرب من همسة حبّ، وأغلى من أماني قلبي المخبّاية

انا عجزت عبر قديش بحبك
فأنا هلأ، رح خلي قلبي هو اللي يحكي عني

بحبك قد ماالارض بتصدر عتب
بحبك قد ما الدني بتشتي تعب
بحبك قد ما الشرش بيحب التراب
بحبك قد ما الشمس بتحب الغياب 
بحبك قد ما الليل بيحب السهر
بحبك قد ما الصبح بيحب الضجر
بحبك قد ما النغم بيحب الوتر
بحبك قد ما الشعر بيحب القمر
بحبك قد ما المطر بيحب الغار
بحبك قد ما الحطب بيحب النار
بحبك قد ما التلج بيحب صنين
بحبك قد ماالدهب بيحب الرنين
بحبك قد ما الام بتحب الجنين
بحبك قد ما السفر بيحب الحنين
بحبك قد ماالحبر بيحب الورق
بحبك قد ما المي بتحب العرق
بحبك قد ما الصخر بحب الازميل
بحبك قد ما الخمر بيحب الجليل
بحبك قد ما الايد بتحب الخصر
بحبك قد ما السيف بيحب النصر
بحبك قد ما الختيار بيحب الصبح
بحبك قد ما الشرط بيحب الربح
بحبك قد ما الطيور بتحب الهجر
بحبك قد ما النور بيحب الفجر
بحبك قد ما العين بتحب الحلا
بحبك قد ما الخوف بيحب الصلا...
بحبك قد ما السر بيحب السكوت.. 
بحبك قد ما الفن بيحب الجنون
بحبك قد ما البيت بيحب السقف
بحبك قد ما الدير بيحب الوقف
بحبك قد ما الغيم بيحب الفضا
بحبك قد ما القهر بيحب الرضا
بحبك قد ما اليتم بيحب الدفا
بحبك قد ما الحلم بيحب الغفا
بحبك قد ما الكلمة بتحب الابد
بحبك قد ما اللذة بتحب الجسد
بحبك قد ما الطيبه بتحب الولد
بحبك قد ما بلادي بتحب الحسد
بحبك قد ما العدل بيحب الميزان
بحبك قد ماالوقت بيحب الزمان
بحبك قد ما القوي بيحب الخطر
بحبك قد ما الزرع بيحب المطر
بحبك قد ما الريح بتعري الشجر
بحبك قد ما الموت بيحب البشر... 

لأ
بحبك اكتر

لونا يا لونا
```

<!-- END CANONICAL POEM -->

### The tentative ending — make it easy to revise

After the poem, the last three lines pulse gently:

```text
لأ
بحبك اكتر

لونا يا لونا
```

Then offer a final short **draft** note:

**EN:** `I wrote this a year ago because I was trying to find enough words for you. A year later, I still haven't. But if I could do everything again — the race, every call, every secret glance, every ordinary day — I'd find you again. Happy one year, my Luna. Always your Orion. ♡`

**AR:** `كتبت هالقصيدة من سنة لأني كنت أحاول ألاقي كلمات تكفيك. وبعد سنة، للحين أحس إن الكلام ما يكفي. ولو رجع فيني الوقت، من السباق لكل مكالمة ولكل نظرة ولكل يوم عادي، برجع أختارك. سنة حلوة يا قمري. أوريون تبعك دايمًا. ♡`

**CRITICAL:** The user explicitly said the tone/content of the emotional final message can be decided **after the main game is built**. Keep this draft in a plainly named `src/data/finale.js` file. Do not make it an irreversible design decision. The unedited poem ending is fixed, however. A supplied couple photo (optional) can appear here, but avoid blocking on missing photos.

Buttons: `Read my poem again ♡`, `Back to our universe`, `Restart` (with confirmation), `Music settings`.

## 5. Audio and playlist implementation

### Actual playable game audio: GET EXISTING LICENSED AUDIO ONLINE

User asks for real downloaded sounds and music quickly, **not code-generated audio**. Use assets from credible sources, retain their license notes in `ASSET_CREDITS.md`, and commit selected compressed local files for reliability. Good verified starting points:

- **Kenney UI Audio (CC0, 50 sounds)** — https://kenney.nl/assets/ui-audio — download this once for button click, collection chime, menu confirm.
- **Kenney Roguelike/RPG Pack (CC0 tiles, 16×16)** — https://kenney.nl/assets/roguelike-rpg-pack — use/tint appropriate tiles or draw supplementary simple tiles while keeping consistent pixel style.
- **Kenney UI Pack (CC0)** — https://kenney.nl/assets/ui-pack — polished dialog frame/button primitives if pixel-art stylistically appropriate.
- **Cozy Puzzle Title — MintoDog, CC0** — https://opengameart.org/content/cozy-puzzle-title — optional menu music.
- **Cozy Puzzle In-Game 1 — MintoDog, CC0** — https://opengameart.org/content/cozy-puzzle-in-game-1 — optional looping main exploration track.
- **Cozy Puzzle In-Game 3 — MintoDog, CC0** — https://opengameart.org/content/cozy-puzzle-in-game-3 — optional gentler zone loop.

Confirm each selected item's on-page license, fetch its actual file, and preserve attribution/source info even if CC0 doesn't require credit. If a site blocks automated downloads, try a verified downloadable CC0 alternative, or leave a named optional `music.mp3` slot and **do not falsely claim music is included**. Prioritize working SFX if music fetch fails. Never rip copyrighted tracks or hotlink unavailable media. Don't download massive complete packs when a couple of samples suffice if time constrained.

Recommended SFX events: soft click, envelope open, sparkle collect, step *optional*, tiny firework pop, radio blip, chandelier joke, 10/10 fanfare, star twinkle. Music player should have Mute, volume, ON/OFF, and respect browser media start-on-user-interaction rule. When a dialogue opens, duck music volume slightly if simple to do, but don't prioritize this over deployment. No abrupt audio jumps.

### The real 91-track relationship playlist is STORY MATERIAL, NOT GAME AUDIO

Playlist title: `To my Artemis 🌑`.
Description: `To my beautiful moon goddess, my light in every night sky. For the one whose glow leads…`.

Not every track needs to be referenced: use widely recognizable titles where relevant and avoid projecting very specific lyrics or meanings onto memories. Candidate cards:

| Song | Where/why |
|---|---|
| Can't Take My Eyes Off You — Engelbert Humperdinck | Secret glances in Singapore; playful obviousness |
| Those Eyes — New West | How small shared moments mattered |
| Talking to the Moon — Bruno Mars | Late-night calls, moon and distance |
| From The Start — Laufey | The feeling of liking someone before saying it |
| Lover Girl — Laufey | The warm, smitten tone of falling in love |
| golden hour — JVKE | New Year's glow / glowing favorite memory |
| Fly Me to the Moon — Frank Sinatra, Count Basie | Celestial story, Artemis/Orion/Sirius |
| Until I Found You — Stephen Sanchez, Em Beihold | From unexpected meeting to finding each other |
| Home — Edward Sharpe & The Magnetic Zeros | The idea of another person feeling like home |
| BIRDS OF A FEATHER — Billie Eilish | Staying together beyond the first year |

Do **not** transcribe any lyrics, embed the commercially recorded audio, play covers generated from copyrighted songs, or invent streaming URLs. Show a `PLAYLIST_URL` setting and, if user provides a playlist link, open it in a new tab via a clearly labeled button. Embedded background loops are separate CC0 tracks. Allow the original entire 91-track list to be added later as optional data, but don't turn the experience into a 91-item catalog.

## 6. Three minigames + five Easter eggs

**Required minigames, all skippable:**
1. **Secret Glance** at location 5: identify the moon charm amid moving pixel visitors, simple pointer input, quick and whimsical. Keyboard alternative if easy; otherwise provide a keyboard-accessible Skip. No loss states.
2. **Chandelier** at location 7: press the chandelier to replace three ridiculous conversation topics. Satisfying click and sparkle. Label the joke and never mock the relationship.
3. **Constellation** at location 10: connect 4 highlighted stars in order; hint shows path after 5 seconds; Skip exists. Finish reveals ARTEMIS & ORION with SIRIUS bright star.

**Optional hidden Easter eggs** (don't gate main progress):
- Tap chandelier 5 times → `Topic Changed Successfully ✨` achievement.
- Tiny star in sky responds: `Sirius? She says you're the brightest one.`
- A dandelion or moonflower whispers: `A wish I keep making: more days with you.`
- Two different colored race cars parked together reveal `Two teams. One sky.`
- A little camera frame in Singapore flashes `Act natural!` and sends a small heart above the player.

Easter eggs should be subtle, discoverable, and never require an obscure decoder. Do not suggest `0310` or `505` as personal facts without context; these playlist entries are not explained.

## 7. Photos (will be supplied separately to Claude Code)

The user will add real photos after providing this brief. Code should run *without any photos* using pink placeholders with captions and no broken-image icon. On finding approved files, show framed thumbnails within relevant love note cards (not giant full-screen disruptive overlays); click photo to enlarge. Suggested manifest `src/data/photos.js` maps IDs to e.g. `/assets/photos/singapore-01.jpg`, `/assets/photos/pool.jpg`, `/assets/photos/new-years.jpg`, `/assets/photos/us-together.jpg`. Use `import.meta.env.BASE_URL` for public assets under repo subpath.

**Privacy warning:** GitHub Pages on a public repo serves all committed photos and poem content publicly to anyone who finds the URL/source. A secret-looking URL is not access control. Ask the user to include only photos both people are comfortable putting on a publicly hosted site; never automatically publish all supplied photos from an unspecified folder. No faces or photos are mandatory for the game to work. If actual privacy is essential, use hosting with authenticated access and avoid a publicly published source bundle. The user should deliberately approve which photos to upload.

## 8. Engineering plan / file structure

**Recommendation:** Vite + Phaser 3 (stable npm release), JavaScript modules for speed, simple DOM overlays for text/UI (especially Arabic shaping), CSS for title/letter/book overlays. Avoid React unless absolutely necessary. Tile-map through Phaser Arcade Physics for collision and camera follow. No backend, DB or APIs. npm pin versions via package-lock. Static deploy. Use local `public/assets` files rather than runtime remote URLs. `Phaser.Scale.FIT` or suitable resize logic. Crisp pixel art via `pixelArt: true`, `roundPixels: true`. Test responsive sizing and large readable dialog.

```text
luna-anniversary/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
├── ASSET_CREDITS.md
├── .gitignore
├── .github/workflows/deploy.yml
├── public/
│   └── assets/
│       ├── sprites/           # original avatar or freely licensed sprite sheet
│       ├── tiles/             # CC0 tiles, recolored as necessary
│       ├── decor/             # bow, heart, stars, etc.
│       ├── sfx/               # real downloaded CC0 effects
│       ├── music/             # real downloaded CC0 loops
│       ├── fonts/             # optional licensed local fonts
│       └── photos/            # optional, user-approved photos only
└── src/
    ├── main.js
    ├── styles.css
    ├── config.js            # GAME_TITLE, PLAYLIST_URL, VITE_BASE settings
    ├── data/
    │   ├── story.js         # all 10 messages, locations, and exact excerpts
    │   ├── poem.js          # FULL POEM EXACTLY as supplied
    │   ├── finale.js        # editable ending message
    │   ├── photos.js        # optional image manifest
    │   └── songs.js         # title/artist/mood links only
    ├── game/
    │   ├── Game.js
    │   ├── scenes/BootScene.js
    │   ├── scenes/MenuScene.js
    │   ├── scenes/WorldScene.js
    │   ├── entities/LunaCat.js
    │   ├── world/map.js
    │   ├── world/landmarks.js
    │   ├── systems/Interactions.js
    │   ├── systems/Progress.js
    │   ├── systems/Audio.js
    │   └── systems/Minigames.js
    └── ui/
        ├── Dialogue.js
        ├── Book.js
        ├── Overlay.js
        ├── Controls.js
        └── translations.js
```

**Important practical compromise:** This file tree is suggested, not mandatory. **A working cohesive game with fewer files beats a large scaffold full of TODOs.** Do not spend time on generic abstractions or an asset pipeline. Generate simple pixel environments programmatically or tile-by-tile if appropriate, using licensed tiles as the main artwork. Use a pixel sprite matrix or existing licensed cat sprite for the original cat avatar. Do not produce placeholder pink rectangles and call it a finished game.

### State

```js
// Example only; adapt as needed.
{
  completedIds: ['racing', 'confession'],
  miniGamesCompleted: [],
  unlockedFinale: false,
  hasReadPoem: false,
  preferredLanguage: 'en',
  audio: { musicEnabled: true, sfxEnabled: true, musicVolume: 0.35, sfxVolume: 0.55 },
  settingsVersion: 1
}
```

Load and save under an app-specific `localStorage` key such as `luna-anniversary-v1`; validate unknown/old values gracefully. Finale unlock derived from completed checkpoint IDs, not just a stale stored boolean. Press E/Space only when nearest interactable within radius; display label `E — Open letter` or bilingual equivalent. Pause player input when overlay is open; never let arrow keys scroll webpage while moving in game. Avoid stuck keys after window blur.

### Localization

Two buttons `EN | عربي` available from title and settings. English UI as default, Arabic UI optional. Store both `letterEn` and `letterAr` per stop. Poems are always original Arabic and must render in RTL regardless of selected UI language. Other proper names shown as Luna / لونا, Artemis / أرتميس, Orion / أوريون, Sirius / سيريوس. Set `dir` on text panels selectively rather than flipping the entire Phaser world. Use `lang="ar"` on poem and Arabic notes, CSS `white-space: pre-wrap`, fallback Arabic fonts. Keep a keyboard-accessible close button.

### Browser handling

Use Phaser for movement/world, HTML for title overlays, HUD, dialogue, song cards, photo previews and book; easier Arabic rendering, scroll behavior, responsive UX. All controls should have focus states and keyboard support. Ensure audio starts only after a click/keypress. Use asset loader error fallback for optional photos/audio, not a crash. The game should open without a console error under Chrome desktop and Safari desktop if possible.

### GitHub Pages base path

Use the repo name `luna-little-universe` unless user chooses another; set Vite's `base` to `'/luna-little-universe/'` for the repository project-page deployment. For local dev, the same config still works under Vite; test both. Use `import.meta.env.BASE_URL` for all dynamic asset paths, and use relative module imports for bundled code. If repository is instead `USERNAME.github.io`, set base `'/'`. Include workflow `.github/workflows/deploy.yml` following the current Vite official GitHub Pages guide, with `npm ci`, `npm run build`, `actions/upload-pages-artifact`, `actions/deploy-pages`, correct pages permissions and concurrency. In GitHub repo Settings → Pages → Build and deployment → `GitHub Actions`.

**Expected URL:** `https://YOUR_USERNAME.github.io/luna-little-universe/` (replace username). Do NOT claim deployment happened until it has actually been configured and verified.

**Alternate hosting if Pages setup causes issues:** itch.io accepts a ZIP of the built HTML5 game's `dist/` contents with `index.html` at ZIP root, and opens browser games immediately. For that route, rebuild with `base: './'` or a suitable relative base and test it locally first. This is a fallback, not a reason to skip GitHub Pages readiness.

## 9. Build order — optimized for an upcoming date

### Phase P0 — Must-have playable gift
1. Scaffold Vite/Phaser and run `npm install` / `npm run dev`.
2. Build a real top-down pixel world with white-cat/pink-bow original avatar, keyboard movement, 10 signs/landmarks, camera, collisions and working interaction prompt.
3. Implement all ten checkpoints using the messages and original poem excerpts supplied here. Each unlocks exactly one star and can be revisited.
4. Implement progress HUD (0/10), save/reload, language toggle and readable Arabic dialog. Implement final gate and full unedited poem book with scroll and reveal; draft epilogue outside canonical poem.
5. Implement working audio controls and use at least two downloaded UI sounds from an openly licensed pack (with `ASSET_CREDITS.md`), or clearly mark a music slot optional if external download blocked.
6. `npm run build` and GitHub Actions Pages workflow. Smoke test in `npm run preview` under proper base.

### Phase P1 — Delight / make it magical
7. Add the three *short, skippable* minigames and five Easter eggs.
8. Polish pink/lavender map art, atmospheric particles, title transitions, a compact minimap, little photo frames, and a separate playable CC0 music loop.
9. Add song-title memories with playlists link placeholder; record sleeve interactions.
10. Test user-supplied photos **after the user approves them for the publicly hosted site** and use configurable photo manifest.

### Phase P2 — Optional only after everything works
11. Add more cat walking frames, extra decorations, nice title effects, animated vignette, accessibility improvement. Do not let optional polish delay deployment.

## 10. Verification / QA — Claude should test, fix, and report

**Functional:**
- Fresh start: shows menu, cat can walk, no soft-lock. Test WASD + arrows + E and escape.
- Can collect in any order; repeats do not increment count; shows accurate `0..10/10`.
- 10/10 opens gate; 9/10 does not; minigames are optional.
- Save, refresh, and continue correctly. Reset button asks confirmation and starts from zero.
- Correct poem excerpt from *each* checkpoint is found within canonical poem (`includes` check), no poetry typos from accidental editing.
- Full poem matches the literal canonical text between the markers in this brief; the special ending appears once in final reveal and full book remains accessible.
- Arabic doesn't show separated glyphs or reversed line order; long text scrolls; user can close and reopen every overlay.
- Sound controls actually change audible music/SFX; audio loads locally after a click; clean behavior if sound unavailable.
- No broken media icons if no personal photos supplied; all optional media uses fallback.
- On 1366×768, start and exit controls visible, no clipping; test 1440×900 and 1920×1080 if possible.
- Build runs with no fatal errors; test served build rather than only dev server.
- Base path works for `/luna-little-universe/` and does not produce 404s for sprites/audio after deployment.

**Privacy/content:**
- Do not secretly publish any file from the user's supplied photo folder; ask to select upload-allowed pictures.
- No copyrighted commercial music/lyrics hosted; no Sanrio images scraped without permission.
- No hallucinated relationship dates, kisses, or racing team names.
- The original poem is not silently proofread, shortened, translated or censored.

**Deliverables from Claude Code (required):**
1. A complete working repository with sources and assets (not a design write-up only).
2. `README.md` with exact install/run/build/deploy instructions and clear photo addition instructions.
3. `ASSET_CREDITS.md` including provenance and licenses for all third-party assets.
4. Build verification report listing tested features, commands run, and any limitations.
5. Easy editing directions for the ten letters, the poem (recommend don't edit), final note, photos, and playlist URL.
6. Never claim a GitHub URL is live without having actually deployed and opened it.

## 11. Quickstart commands and what to tell Claude Code

Suggested terminal commands once in a new project folder:

```bash
npm create vite@latest . -- --template vanilla
npm install phaser
npm run dev
```

**Prompt to paste into Claude Code with THIS .md present in the working directory:**

```text
Read LUNA_ANNIVERSARY_GAME_CLAUDE_CODE_BRIEF.md in full. Implement the complete game described there in this folder. Don't stop after planning or scaffolding. Prioritize P0 and produce an actually playable, polished 2D Phaser + Vite game with all TEN checkpoint narratives, actual movement, interactions, saved progress, accurate original Arabic poem and fully working end sequence. Make bilingual DOM dialog overlays readable and correct. Fetch ready-made properly licensed game artwork/music/SFX online where possible and keep credit/license records; do not fabricate sounds or download copyrighted recordings/Hello Kitty IP. The real couple photos may be provided separately: don't automatically publish private photos; make slots gracefully optional. If there's a hard blocker, implement a working fallback instead of stalling. Add GitHub Pages Actions deployment (repo name luna-little-universe). Run build and fix errors. Give me exact commands for preview and publication, and report exactly what works versus what remains optional. Use the supplied drafted love notes (editable). Do not ask me to re-explain the story: it's all in the brief.
```

**After implementation, user can follow up in Claude Code:** `Here are approved photos for the game. Add only these files, put them at the corresponding scene photo slots, keep paths GitHub Pages-safe, then test and rebuild.`

## 12. Open decisions deliberately postponed

- The final epilogue's degree of romance and surprise; ship editable draft.
- The photos: user will provide them and explicitly decide which can go online.
- Exact playlists URL (not yet provided) and optional background music preferences.
- Actual Hello Kitty art: not bundled unless user provides rights-cleared material; default original kawaii cat.
- Exact day of relationship anniversary: not supplied and **must not be guessed**. `One Year` only.

---

**For Luna:** This is not a game about winning. It is a game about all the times two people found each other. ♡
