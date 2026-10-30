// ---------------------------------------------------------------------------
//  Three tiny minigames and seven even tinier activities.
//
//  Ground rules, all of them deliberate:
//   * every one of them has a Skip button,
//   * none of them can be failed in a way that costs anything,
//   * none of them gates a star, the gate, or the poem.
//
//  The art is drawn with the same pixel toolkit as the world, exported as data
//  URLs so the overlays look like the rest of the game.
// ---------------------------------------------------------------------------

import { Overlay, arabicBlock, englishBlock, toast } from "../../ui/Overlay.js";
import { photoFrame } from "../../ui/Dialogue.js";
import { t, isArabic } from "../../ui/translations.js";
import { audio } from "./Audio.js";
import { progress } from "./Progress.js";
import { pc, PALETTE as C } from "../world/pixel.js";
import { RECORD_SLEEVES } from "../../data/songs.js";

// --- little sprites used only inside the overlays --------------------------

function visitorURL(shirt, charm) {
  const buf = pc(16, 22);
  // head
  buf.ellipse(8, 5, 4, 4, C.outline);
  buf.ellipse(8, 5, 3, 3, "#F3D9C7");
  buf.rect(5, 1, 7, 3, "#5B4556");
  // body
  buf.rect(4, 9, 9, 9, C.outline);
  buf.rect(5, 9, 7, 8, shirt);
  // legs
  buf.rect(5, 18, 2, 4, "#4A3F58");
  buf.rect(10, 18, 2, 4, "#4A3F58");
  // arms
  buf.rect(3, 10, 2, 5, shirt);
  buf.rect(12, 10, 2, 5, shirt);
  if (charm) {
    // a tiny crescent moon held in one hand
    for (let y = -3; y <= 3; y++) {
      for (let x = -3; x <= 3; x++) {
        const inMoon = x * x + y * y <= 9;
        const inBite = (x - 2) * (x - 2) + y * y <= 7;
        if (inMoon && !inBite) buf.px(14 + x, 16 + y, C.glow);
      }
    }
    buf.px(13, 16, C.white);
  }
  return buf.toDataURL();
}

function chandelierURL(lit) {
  const buf = pc(28, 24);
  buf.vline(14, 0, 4, C.goldDark);
  buf.ellipse(14, 7, 11, 4, C.goldDark);
  buf.ellipse(14, 6, 9, 3, lit ? C.glow : C.gold);
  for (const x of [4, 8, 14, 20, 24]) {
    buf.vline(x, 9, 4, C.goldDark);
    buf.disc(x, 15, 3, lit ? C.glow : "#E8D7A8");
    if (lit) buf.px(x, 15, C.white);
  }
  if (lit) {
    buf.sparkle(14, 5, 4, C.white, 230);
    buf.sparkle(5, 19, 2, C.white, 180);
    buf.sparkle(23, 19, 2, C.white, 180);
  }
  return buf.toDataURL();
}

function catBubbleURL() {
  const buf = pc(20, 18);
  buf.ellipse(10, 9, 9, 8, C.outline);
  buf.ellipse(10, 9, 8, 7, C.white);
  buf.matrix(
    ["..oo....oo..", ".owwo..owwo.", ".owwwooowwwo"],
    { o: C.outline, w: C.white },
    4,
    0
  );
  buf.px(7, 8, C.ink);
  buf.px(8, 8, C.ink);
  buf.px(12, 8, C.ink);
  buf.px(13, 8, C.ink);
  buf.px(10, 11, C.deepRose);
  buf.px(5, 10, C.blush);
  buf.px(15, 10, C.blush);
  buf.matrix([".oo.oo.", "opppppo"], { o: C.outline, p: C.rose }, 2, 1);
  return buf.toDataURL();
}

function carURL(body, accent) {
  const buf = pc(26, 16);
  buf.rect(2, 6, 22, 6, body);
  buf.frame(2, 6, 22, 6, C.outline);
  buf.rect(9, 2, 9, 5, accent);
  buf.frame(9, 2, 9, 5, C.outline);
  buf.rect(10, 3, 7, 2, C.glow);
  buf.rect(0, 8, 3, 3, accent);
  buf.rect(23, 7, 3, 2, accent);
  for (const x of [5, 19]) {
    buf.disc(x, 12, 3, C.ink);
    buf.disc(x, 12, 1, C.grey);
  }
  return buf.toDataURL();
}

function sleeveURL(color) {
  const buf = pc(28, 28);
  buf.rect(0, 0, 28, 28, color);
  buf.frame(0, 0, 28, 28, C.outline);
  buf.disc(14, 14, 10, C.ink);
  buf.ring(14, 14, 10, C.outlineDark);
  buf.disc(14, 14, 3, C.cream);
  buf.px(14, 14, color);
  buf.hline(2, 25, 24, C.white, 60);
  return buf.toDataURL();
}

function lanternURL(lit) {
  const buf = pc(18, 26);
  buf.vline(9, 0, 4, C.mauve);
  buf.rect(4, 4, 10, 15, lit ? C.rose : "#C9A4B6");
  buf.frame(4, 4, 10, 15, C.outline);
  buf.rect(5, 6, 8, 11, lit ? C.glow : "#E7D7DE");
  buf.rect(3, 18, 12, 2, C.deepRose);
  if (lit) {
    buf.sparkle(9, 11, 4, C.white, 220);
    buf.px(9, 22, C.gold);
    buf.px(9, 23, C.gold);
  }
  return buf.toDataURL();
}

function flowerURL(bloomed) {
  const buf = pc(18, 22);
  buf.vline(9, 11, 11, C.leafDark);
  buf.px(6, 16, C.leaf);
  buf.px(12, 18, C.leaf);
  if (bloomed) {
    for (const [x, y] of [
      [9, 4],
      [4, 7],
      [14, 7],
      [5, 12],
      [13, 12]
    ]) {
      buf.disc(x, y, 3, C.white);
      buf.disc(x, y, 2, C.milk);
    }
    buf.disc(9, 9, 3, C.glow);
    buf.sparkle(9, 9, 4, C.white, 200);
  } else {
    buf.ellipse(9, 8, 3, 5, C.leafDark);
    buf.ellipse(9, 8, 2, 4, "#A8CFA8");
    buf.px(9, 4, C.milk);
  }
  return buf.toDataURL();
}

function radioURL(active) {
  const buf = pc(32, 24);
  buf.rect(1, 5, 30, 18, C.powder);
  buf.frame(1, 5, 30, 18, C.outline);
  buf.rect(4, 8, 13, 12, C.night);
  for (let y = 10; y < 19; y += 2) buf.hline(5, y, 11, active ? C.rose : C.grey);
  buf.disc(24, 12, 4, C.cream);
  buf.ring(24, 12, 4, C.outline);
  buf.px(24, 9, C.deepRose);
  buf.line(28, 5, 31, 0, C.greyDark);
  buf.px(31, 0, active ? C.rose : C.grey);
  if (active) buf.sparkle(10, 14, 3, C.white, 200);
  return buf.toDataURL();
}

function img(src, cls) {
  const el = document.createElement("img");
  el.src = src;
  el.className = cls;
  el.alt = "";
  el.setAttribute("aria-hidden", "true");
  return el;
}

/** Instructions block + a Skip button wired to the same finish path. */
function scaffold(ov, { titleEn, titleAr, howEn, howAr }) {
  const h = ov.add("h2", "mg__title");
  h.textContent = isArabic() ? titleAr : titleEn;
  if (isArabic()) {
    h.setAttribute("dir", "rtl");
    h.setAttribute("lang", "ar");
  }
  const how = isArabic()
    ? arabicBlock(howAr, "mg__how")
    : englishBlock(howEn, "mg__how");
  ov.body.appendChild(how);
  const stage = ov.add("div", "mg__stage");
  return stage;
}

function finishMinigame(ov, key, { titleEn, titleAr, bodyEn, bodyAr }, extra) {
  progress.completeMinigame(key);
  audio.play("success");
  ov.body.innerHTML = "";
  const h = ov.add("h2", "mg__title mg__title--win");
  h.textContent = isArabic() ? titleAr : titleEn;
  if (isArabic()) h.setAttribute("dir", "rtl");
  const block = isArabic()
    ? arabicBlock(bodyAr, "mg__how")
    : englishBlock(bodyEn, "mg__how");
  ov.body.appendChild(block);
  if (extra) ov.body.appendChild(extra);
  ov.actions().button(t("done"), () => ov.close(), "primary", true);
}

function skipRow(ov, onSkip) {
  const actions = ov.actions();
  actions.button(t("skip"), () => {
    toast(t("minigameSkipped"));
    if (onSkip) onSkip();
    ov.close();
  }, "ghost");
  return actions;
}

// ===========================================================================
//  Minigame A — Secret Glance
// ===========================================================================

function playGlance() {
  const ov = new Overlay({ className: "card--mg" });
  const stage = scaffold(ov, {
    titleEn: "Secret Glance",
    titleAr: "النظرة المسروقة",
    howEn:
      "Three people are wandering the walkway. One of them is holding a little moon charm. Find them — click, or press 1, 2 or 3. Nothing bad happens if you guess wrong.",
    howAr:
      "ثلاثة أشخاص يتمشّون بالممشى، وواحد منهم يحمل دلاية قمر صغيرة. لقّيه — بالضغط عليه أو بزر 1 أو 2 أو 3. ما يصير شيء لو غلطتي."
  });

  stage.classList.add("mg-glance");
  let answer = Math.floor(Math.random() * 3);
  let solved = false;
  const figures = [];

  const field = document.createElement("div");
  field.className = "mg-glance__field";
  stage.appendChild(field);

  const picker = document.createElement("div");
  picker.className = "mg-glance__picker";
  stage.appendChild(picker);

  const shirts = [C.rose, C.deepLavender, C.leaf];

  function build() {
    field.innerHTML = "";
    picker.innerHTML = "";
    figures.length = 0;
    for (let i = 0; i < 3; i++) {
      const fig = document.createElement("button");
      fig.type = "button";
      fig.className = "mg-glance__fig";
      fig.setAttribute("aria-label", `Person ${i + 1}`);
      fig.appendChild(img(visitorURL(shirts[i], i === answer), "mg-glance__img"));
      fig.addEventListener("click", () => guess(i));
      field.appendChild(fig);
      figures.push(fig);

      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn--soft btn--small";
      b.textContent = String(i + 1);
      b.addEventListener("click", () => guess(i));
      picker.appendChild(b);
    }
  }

  function guess(i) {
    if (solved) return;
    if (i === answer) {
      solved = true;
      cancelAnimationFrame(raf);
      finishMinigame(ov, "glance", {
        titleEn: "Found you 👀",
        titleAr: "لقيتك 👀",
        bodyEn:
          "Caught in one look, across a whole crowd. That's pretty much how it went.",
        bodyAr: "نظرة واحدة بين كل هالناس… وهكذا بالضبط صارت."
      });
    } else {
      audio.play("blip");
      toast(
        isArabic() ? "قريبة! جرّبي مرة ثانية ♡" : "So close! Try again ♡",
        1600
      );
      answer = Math.floor(Math.random() * 3);
      build();
    }
  }

  build();

  // Gentle drifting, so they're moving but never hard to click.
  const t0 = performance.now();
  let raf = 0;
  const tick = (now) => {
    const e = (now - t0) / 1000;
    figures.forEach((fig, i) => {
      const x = Math.sin(e * 0.7 + i * 2.1) * 34;
      const y = Math.cos(e * 0.5 + i * 1.3) * 12;
      fig.style.transform = `translate(${x}px, ${y}px)`;
    });
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  const onKey = (e) => {
    if (["1", "2", "3"].includes(e.key)) guess(Number(e.key) - 1);
  };
  document.addEventListener("keydown", onKey);

  const origClose = ov.close.bind(ov);
  ov.close = () => {
    cancelAnimationFrame(raf);
    document.removeEventListener("keydown", onKey);
    origClose();
  };

  skipRow(ov);
  ov.open();
  return ov;
}

// ===========================================================================
//  Minigame B — Change the Topic
// ===========================================================================

const SILLY_TOPICS = [
  { en: "So anyway, about the tax implications of owning a goose…", ar: "على فكرة، عن ضرايب تربية الإوز…" },
  { en: "Let me explain every rule of competitive lawn bowling.", ar: "خليني أشرح لك كل قوانين لعبة البولينج على العشب." },
  { en: "Have you considered the structural integrity of bread?", ar: "هل فكرتي بمتانة الخبز الهندسية؟" },
  { en: "I have a 40-slide deck about printer drivers.", ar: "عندي أربعين سلايد عن تعريفات الطابعة." },
  { en: "Quick question: how many ducks is too many ducks?", ar: "سؤال سريع: كم بطة تعتبر كثير؟" },
  { en: "Anyway, the average humidity in 1997 was—", ar: "على كل حال، معدل الرطوبة في ١٩٩٧ كان—" }
];

function playChandelier() {
  const ov = new Overlay({ className: "card--mg" });
  const stage = scaffold(ov, {
    titleEn: "Change the Topic",
    titleAr: "غيّري الموضوع",
    howEn:
      "A terrible conversation topic appears. Point the camera at the chandelier. Three times and we're free.",
    howAr:
      "يطلع موضوع ممل جدًا. وجّهي الكاميرا على الثريا. ثلاث مرات وخلصنا."
  });
  stage.classList.add("mg-chandelier");

  let done = 0;
  let pokes = 0;

  const bubble = document.createElement("div");
  bubble.className = "mg-chandelier__bubble";
  stage.appendChild(bubble);

  const lampWrap = document.createElement("button");
  lampWrap.type = "button";
  lampWrap.className = "mg-chandelier__lamp";
  lampWrap.setAttribute(
    "aria-label",
    isArabic() ? "اضغطي الثريا" : "Press the chandelier"
  );
  const lampImg = img(chandelierURL(false), "mg-chandelier__lampImg");
  lampWrap.appendChild(lampImg);
  stage.appendChild(lampWrap);

  const counter = document.createElement("div");
  counter.className = "mg-chandelier__count";
  stage.appendChild(counter);

  function showTopic() {
    const topic = SILLY_TOPICS[Math.floor(Math.random() * SILLY_TOPICS.length)];
    bubble.classList.remove("is-cat");
    bubble.innerHTML = "";
    const text = isArabic()
      ? arabicBlock(topic.ar, "mg-chandelier__text")
      : englishBlock(topic.en, "mg-chandelier__text");
    bubble.appendChild(text);
  }

  function updateCount() {
    counter.textContent = `${done} / 3 ✨`;
  }

  function flip() {
    bubble.classList.add("is-cat");
    bubble.innerHTML = "";
    bubble.appendChild(img(catBubbleURL(), "mg-chandelier__cat"));
    const h = document.createElement("div");
    h.className = "mg-chandelier__hearts";
    h.textContent = "♡ ♡ ♡";
    bubble.appendChild(h);
  }

  lampWrap.addEventListener("click", () => {
    pokes += 1;
    audio.play("chandelier");
    lampImg.src = chandelierURL(true);
    setTimeout(() => {
      if (!lampWrap.isConnected) return;
      lampImg.src = chandelierURL(false);
    }, 420);

    if (done < 3) {
      flip();
      done += 1;
      updateCount();
      if (done >= 3) {
        setTimeout(() => {
          if (!ov.isOpen) return;
          finishMinigame(ov, "chandelier", {
            titleEn: "CHANDELIER.",
            titleAr: "ثُريّا.",
            bodyEn:
              "Topic changed. Crisis averted. Of all the ridiculous things in the universe, this one is ours.",
            bodyAr:
              "غيّرنا الموضوع. نجحت العملية. من بين كل الأشياء المضحكة بالعالم، هذي النكتة لنا."
          });
        }, 900);
      } else {
        setTimeout(() => {
          if (bubble.isConnected) showTopic();
        }, 900);
      }
    }

    // The little secret: five pokes in total.
    if (pokes === 5 && progress.findEasterEgg("egg-chandelier")) {
      toast(
        isArabic()
          ? "ثُـ ريّـ ـاااا! تم فتح الإنجاز ✨"
          : "CH AN DE LI ER! Achievement: Topic successfully changed. ✨",
        3600
      );
      audio.play("twinkle");
    }
  });

  showTopic();
  updateCount();
  skipRow(ov);
  ov.open();
  return ov;
}

// ===========================================================================
//  Minigame C — Constellation
// ===========================================================================

function playConstellation() {
  const ov = new Overlay({ className: "card--mg" });
  const stage = scaffold(ov, {
    titleEn: "Draw our constellation",
    titleAr: "ارسمي كوكبتنا",
    howEn:
      "Connect the four bright stars in order — 1, 2, 3, 4. Take as long as you like; a hint appears on its own after a few seconds.",
    howAr:
      "وصّلي النجوم الأربع بالترتيب — ١، ٢، ٣، ٤. خذي وقتك؛ بعد شوي بتطلع لك تلميحة لحالها."
  });
  stage.classList.add("mg-stars");

  const W = 420;
  const H = 260;
  // A simple heart-ish arc of four stars.
  const STARS = [
    { x: 110, y: 90 },
    { x: 210, y: 50 },
    { x: 310, y: 90 },
    { x: 210, y: 190 }
  ];

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "mg-stars__svg");
  stage.appendChild(svg);

  const hintPath = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  hintPath.setAttribute(
    "points",
    STARS.map((s) => `${s.x},${s.y}`).join(" ")
  );
  hintPath.setAttribute("class", "mg-stars__hint");
  svg.appendChild(hintPath);

  const drawn = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  drawn.setAttribute("class", "mg-stars__line");
  drawn.setAttribute("points", "");
  svg.appendChild(drawn);

  let next = 0;
  const nodes = [];

  STARS.forEach((s, i) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "mg-stars__node");
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", `Star ${i + 1}`);

    const halo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    halo.setAttribute("cx", s.x);
    halo.setAttribute("cy", s.y);
    halo.setAttribute("r", 20);
    halo.setAttribute("class", "mg-stars__halo");

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", s.x);
    dot.setAttribute("cy", s.y);
    dot.setAttribute("r", 7);
    dot.setAttribute("class", "mg-stars__dot");

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", s.x);
    label.setAttribute("y", s.y + 34);
    label.setAttribute("class", "mg-stars__label");
    label.textContent = String(i + 1);

    g.append(halo, dot, label);
    const activate = () => pickStar(i);
    g.addEventListener("click", activate);
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
    svg.appendChild(g);
    nodes.push(g);
  });

  function pickStar(i) {
    if (i !== next) {
      audio.play("blip");
      return;
    }
    audio.play("twinkle");
    nodes[i].classList.add("is-on");
    next += 1;
    drawn.setAttribute(
      "points",
      STARS.slice(0, next).map((s) => `${s.x},${s.y}`).join(" ")
    );
    if (next === STARS.length) win();
  }

  function win() {
    drawn.classList.add("is-complete");
    hintPath.classList.remove("is-visible");
    // Label the two of them, plus Sirius.
    const put = (x, y, text, cls) => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
      el.setAttribute("x", x);
      el.setAttribute("y", y);
      el.setAttribute("class", `mg-stars__name ${cls}`);
      el.textContent = text;
      svg.appendChild(el);
    };
    put(210, 30, "ARTEMIS 🌙", "is-artemis");
    put(210, 232, "ORION ✨", "is-orion");

    const sirius = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    sirius.setAttribute("cx", 372);
    sirius.setAttribute("cy", 196);
    sirius.setAttribute("r", 5);
    sirius.setAttribute("class", "mg-stars__sirius");
    svg.appendChild(sirius);
    put(372, 218, "SIRIUS", "is-sirius");

    setTimeout(() => {
      if (!ov.isOpen) return;
      const keep = document.createElement("div");
      keep.className = "mg-stars__keep";
      const clone = svg.cloneNode(true);
      clone.setAttribute("class", "mg-stars__svg mg-stars__svg--still");
      keep.appendChild(clone);
      finishMinigame(
        ov,
        "constellation",
        {
          titleEn: "There we are.",
          titleAr: "هذولا إحنا.",
          bodyEn:
            "Artemis and Orion, in the same sky, with Sirius burning away on the right because somebody insists that's me.",
          bodyAr:
            "أرتميس وأوريون في نفس السما، وسيريوس يلمع على اليمين لأن في واحدة مصرّة إن هذا أنا."
        },
        keep
      );
    }, 1500);
  }

  const hintTimer = setTimeout(() => {
    hintPath.classList.add("is-visible");
  }, 5000);

  const origClose = ov.close.bind(ov);
  ov.close = () => {
    clearTimeout(hintTimer);
    origClose();
  };

  skipRow(ov);
  ov.open();
  return ov;
}

// ===========================================================================
//  The small activities
// ===========================================================================

function activityShell(titleEn, titleAr, howEn, howAr) {
  const ov = new Overlay({ className: "card--mg" });
  const stage = scaffold(ov, { titleEn, titleAr, howEn, howAr });
  return { ov, stage };
}

function closeRow(ov) {
  ov.actions().button(t("close"), () => ov.close(), "primary", true);
}

function actRaceFlag() {
  const { ov, stage } = activityShell(
    "Two lanes, one finish",
    "حارتين، ونهاية واحدة",
    "Wave the start flag and watch where they end up.",
    "لوّحي بعلم البداية وشوفي وين بيوصلون."
  );
  stage.classList.add("act-race");

  const track = document.createElement("div");
  track.className = "act-race__track";
  const carA = img(carURL(C.rose, C.milk), "act-race__car act-race__car--a");
  const carB = img(carURL(C.deepLavender, C.lavender), "act-race__car act-race__car--b");
  const heart = document.createElement("div");
  heart.className = "act-race__heart";
  heart.textContent = "♡";
  track.append(carA, carB, heart);
  stage.appendChild(track);

  const go = document.createElement("button");
  go.type = "button";
  go.className = "btn btn--primary";
  go.textContent = isArabic() ? "لوّحي بالعلم 🏁" : "Wave the flag 🏁";
  stage.appendChild(go);

  go.addEventListener("click", () => {
    if (track.classList.contains("is-running")) return;
    audio.play("pop");
    track.classList.add("is-running");
    go.disabled = true;
    setTimeout(() => {
      heart.classList.add("is-in");
      audio.play("twinkle");
      const line = document.createElement("p");
      line.className = "act__caption";
      line.textContent = isArabic()
        ? "فريقين… وسما واحدة."
        : "Two teams. One sky.";
      if (isArabic()) line.setAttribute("dir", "rtl");
      stage.appendChild(line);
    }, 1700);
  });

  closeRow(ov);
  ov.open();
}

function actEnvelope() {
  const { ov, stage } = activityShell(
    "The envelope",
    "المظروف",
    "It has been sitting here, closed, this whole time.",
    "كان قاعد هنا مسكّر كل هالوقت."
  );
  stage.classList.add("act-env");
  const env = document.createElement("button");
  env.type = "button";
  env.className = "act-env__env";
  env.setAttribute("aria-label", isArabic() ? "افتحي المظروف" : "Open the envelope");
  env.innerHTML = `<span class="act-env__flap"></span><span class="act-env__heart">♡</span>`;
  stage.appendChild(env);

  env.addEventListener("click", () => {
    if (env.classList.contains("is-open")) return;
    audio.play("envelope");
    env.classList.add("is-open");
    setTimeout(() => {
      audio.play("twinkle");
      const p = document.createElement("p");
      p.className = "act__caption";
      p.textContent = isArabic()
        ? "كل الكلام كان هنا من البداية."
        : "Everything was already in here.";
      if (isArabic()) p.setAttribute("dir", "rtl");
      stage.appendChild(p);
      const spark = document.createElement("div");
      spark.className = "act-env__sparks";
      spark.textContent = "✧ ✦ ✧";
      stage.appendChild(spark);
    }, 700);
  });

  closeRow(ov);
  ov.open();
}

function actRadio() {
  const { ov, stage } = activityShell(
    "Three frequencies",
    "ثلاث موجات",
    "Turn the dial. Two of them are nonsense. One of them isn't.",
    "دوّري المؤشر. موجتين منهم كلام فاضي، وواحدة لا."
  );
  stage.classList.add("act-radio");

  const radioImg = img(radioURL(false), "act-radio__img");
  stage.appendChild(radioImg);

  const out = document.createElement("div");
  out.className = "act-radio__out";
  stage.appendChild(out);

  const FREQS = [
    {
      label: "88.1",
      en: "…and that concludes our forty-minute segment on gravel.",
      ar: "…وبهذا نختم فقرتنا عن الحصى، أربعين دقيقة."
    },
    {
      label: "94.7",
      en: "…the weather tonight: dark, with a chance of more dark.",
      ar: "…حالة الطقس الليلة: ظلام، واحتمال ظلام أكثر."
    },
    {
      label: "10.3",
      en: "Luna. ♡ Still here, still on the other end of the line.",
      ar: "لونا. ♡ للحين هنا، وللحين على الطرف الثاني من الخط.",
      special: true
    }
  ];

  const row = document.createElement("div");
  row.className = "act-radio__dials";
  FREQS.forEach((f) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn--soft btn--small";
    b.textContent = f.label;
    b.addEventListener("click", () => {
      out.innerHTML = "";
      radioImg.src = radioURL(Boolean(f.special));
      audio.play(f.special ? "twinkle" : "blip");
      const block = isArabic()
        ? arabicBlock(f.ar, "act-radio__text")
        : englishBlock(f.en, "act-radio__text");
      if (f.special) block.classList.add("is-special");
      out.appendChild(block);
      if (f.special) {
        const h = document.createElement("div");
        h.className = "act-radio__hearts";
        h.textContent = "♡";
        out.appendChild(h);
      }
    });
    row.appendChild(b);
  });
  stage.appendChild(row);

  closeRow(ov);
  ov.open();
}

function actLanterns() {
  const { ov, stage } = activityShell(
    "Three lanterns",
    "ثلاثة فوانيس",
    "Light all three and look up.",
    "أشعلي الثلاثة كلها وطالعي فوق."
  );
  stage.classList.add("act-lanterns");

  const sky = document.createElement("div");
  sky.className = "act-lanterns__sky";
  stage.appendChild(sky);

  const row = document.createElement("div");
  row.className = "act-lanterns__row";
  stage.appendChild(row);

  let lit = 0;
  for (let i = 0; i < 3; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "act-lanterns__lantern";
    b.setAttribute("aria-label", `Lantern ${i + 1}`);
    const im = img(lanternURL(false), "act-lanterns__img");
    b.appendChild(im);
    b.addEventListener("click", () => {
      if (b.classList.contains("is-lit")) return;
      b.classList.add("is-lit");
      im.src = lanternURL(true);
      audio.play("pop");
      lit += 1;
      if (lit === 3) fireworks();
    });
    row.appendChild(b);
  }

  function fireworks() {
    audio.play("twinkle");
    for (let i = 0; i < 16; i++) {
      const f = document.createElement("span");
      f.className = "act-lanterns__fw";
      f.style.left = `${8 + Math.random() * 84}%`;
      f.style.top = `${8 + Math.random() * 70}%`;
      f.style.animationDelay = `${Math.random() * 1.1}s`;
      f.textContent = ["✦", "✧", "♡", "✶"][i % 4];
      sky.appendChild(f);
    }
    const p = document.createElement("p");
    p.className = "act__caption";
    p.textContent = isArabic()
      ? "سنة جديدة… ونفس الشخص اللي أبي أكون معه."
      : "A whole new year, and the same person I wanted to be standing next to.";
    if (isArabic()) p.setAttribute("dir", "rtl");
    stage.appendChild(p);
  }

  closeRow(ov);
  ov.open();
}

function actReflections(cp) {
  const { ov, stage } = activityShell(
    "Reflections",
    "الانعكاسات",
    "Touch the lights on the water.",
    "المسي الأضواء على الماء."
  );
  stage.classList.add("act-pool");

  const water = document.createElement("div");
  water.className = "act-pool__water";
  stage.appendChild(water);

  let found = 0;
  const spots = [
    [18, 30],
    [44, 58],
    [70, 26],
    [58, 74],
    [30, 66]
  ];
  spots.forEach(([x, y], i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "act-pool__spot";
    b.style.left = `${x}%`;
    b.style.top = `${y}%`;
    b.setAttribute("aria-label", `Reflection ${i + 1}`);
    b.addEventListener("click", () => {
      if (b.classList.contains("is-on")) return;
      b.classList.add("is-on");
      audio.play("twinkle");
      found += 1;
      for (let k = 0; k < 5; k++) {
        const s = document.createElement("span");
        s.className = "act-pool__particle";
        s.style.setProperty("--dx", `${(Math.random() - 0.5) * 60}px`);
        s.style.setProperty("--dy", `${-20 - Math.random() * 50}px`);
        s.textContent = k % 2 ? "✧" : "·";
        b.appendChild(s);
      }
      if (found === spots.length) {
        const p = document.createElement("p");
        p.className = "act__caption";
        p.textContent = isArabic()
          ? "لو أقدر أحفظ هالشعور بقارورة وأرجع له بأي وقت."
          : "I'd keep this exact feeling in a bottle if I could.";
        if (isArabic()) p.setAttribute("dir", "rtl");
        stage.appendChild(p);
      }
    });
    water.appendChild(b);
  });

  // If a photo exists for this place, it belongs here.
  const photo = photoFrame(cp?.photoSlot);
  if (photo) stage.appendChild(photo);

  closeRow(ov);
  ov.open();
}

function actFlowers() {
  const { ov, stage } = activityShell(
    "Moonflowers",
    "زهور القمر",
    "Water all three and they'll agree on a shape.",
    "اسقيهم الثلاثة وبيتفقون على شكل."
  );
  stage.classList.add("act-flowers");

  const row = document.createElement("div");
  row.className = "act-flowers__row";
  stage.appendChild(row);

  let bloomed = 0;
  for (let i = 0; i < 3; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "act-flowers__flower";
    b.setAttribute("aria-label", `Moonflower ${i + 1}`);
    const im = img(flowerURL(false), "act-flowers__img");
    b.appendChild(im);
    b.addEventListener("click", () => {
      if (b.classList.contains("is-bloomed")) return;
      b.classList.add("is-bloomed");
      im.src = flowerURL(true);
      audio.play("pop");
      bloomed += 1;
      if (bloomed === 3) {
        audio.play("twinkle");
        const moon = document.createElement("div");
        moon.className = "act-flowers__crescent";
        moon.textContent = "🌙";
        stage.appendChild(moon);
        const p = document.createElement("p");
        p.className = "act__caption";
        p.textContent = isArabic()
          ? "صاروا قمر. ما عندهم خيار ثاني."
          : "They turned into a moon. They didn't really have a choice.";
        if (isArabic()) p.setAttribute("dir", "rtl");
        stage.appendChild(p);
      }
    });
    row.appendChild(b);
  }

  closeRow(ov);
  ov.open();
}

function actRecords() {
  const { ov, stage } = activityShell(
    "Three records",
    "ثلاث أسطوانات",
    "Flip through them. Each one gets a note from me.",
    "قلّبيهم. كل واحدة لها ملاحظة مني."
  );
  stage.classList.add("act-records");

  const row = document.createElement("div");
  row.className = "act-records__row";
  stage.appendChild(row);

  const out = document.createElement("div");
  out.className = "act-records__out";
  stage.appendChild(out);

  RECORD_SLEEVES.forEach((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "act-records__sleeve";
    b.appendChild(img(sleeveURL(s.color), "act-records__img"));
    const cap = document.createElement("span");
    cap.className = "act-records__cap";
    cap.setAttribute("dir", "ltr");
    cap.textContent = s.title;
    b.appendChild(cap);
    b.addEventListener("click", () => {
      audio.play("blip");
      b.classList.add("is-played");
      out.innerHTML = "";
      const title = document.createElement("div");
      title.className = "song__title";
      title.setAttribute("dir", "ltr");
      title.textContent = s.title;
      const artist = document.createElement("div");
      artist.className = "song__artist";
      artist.setAttribute("dir", "ltr");
      artist.textContent = s.artist;
      out.append(title, artist);
      out.appendChild(
        isArabic()
          ? arabicBlock(s.meaningAr, "song__meaning")
          : englishBlock(s.meaningEn, "song__meaning")
      );
    });
    row.appendChild(b);
  });

  closeRow(ov);
  ov.open();
}

// ===========================================================================
//  Public API
// ===========================================================================

export function playMinigame(key) {
  if (key === "glance") return playGlance();
  if (key === "chandelier") return playChandelier();
  if (key === "constellation") return playConstellation();
  return null;
}

export function playActivity(key, cp) {
  switch (key) {
    case "raceFlag":
      return actRaceFlag();
    case "envelope":
      return actEnvelope();
    case "radio":
      return actRadio();
    case "lanterns":
      return actLanterns();
    case "reflections":
      return actReflections(cp);
    case "flowers":
      return actFlowers();
    case "records":
      return actRecords();
    default:
      return null;
  }
}
