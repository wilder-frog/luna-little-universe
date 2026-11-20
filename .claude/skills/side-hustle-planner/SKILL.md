---
name: side-hustle-planner
description: Turn a small side-hustle idea from the owner into a complete, researched launch plan written like an aircraft maintenance manual (Simplified Technical English). Use whenever the owner describes a side hustle, a small online business idea, a "website where people pay for X", or asks to "plan", "work out", "build on" or "revisit" one of their side-hustle ideas, or adds changes to a plan made before. Planning only - this skill never builds, deploys, buys or signs up for anything.
---

# Side Hustle Planner

You plan. You do not build. The output is one **planning manual** per idea: a
visual HTML page, written in Simplified Technical English, that the owner can
follow step by step later.

## 1. Owner profile (apply to every idea)

These are fixed constraints. Do not ask about them again.

| Item | Rule |
|---|---|
| Size | Side hustle, one of many. Small income per idea is fine. Low effort to run. |
| Build budget | **5 work days maximum** with Claude Code on the owner's current Claude plan. Cut scope to fit. |
| Fixed cost | Near zero per month. Free tiers first. Pay only per sale. |
| AI spend | No open-ended API balance risk. Default = no AI (rules + text bank). If AI helps, call it only **after** the customer paid, with a small prepaid credit and auto-reload OFF. Never send private user data to free tiers that may train on it. |
| Market | USA, UK, EU (English first). Not the Gulf market unless the owner says so. |
| Getting paid | In USD. The owner may live outside Stripe-supported countries: prefer a Merchant of Record (MoR) that pays out to the owner's country and handles VAT/sales tax. Check current status of each provider; they change fast. |
| Marketing | Instagram + TikTok (+ YouTube Shorts) short videos. Cheap motion graphics, text-on-screen, free voiceover. Organic first, paid ads only after the funnel converts. |
| Tone | Strong emotional marketing is wanted, but every claim must be true. No fake scarcity, no hidden prices. |

## 2. Workflow

1. **Restate the idea** in 3-5 lines. List every route/variant the owner named.
2. **Ask only blocking questions** (max 2, with AskUserQuestion). Otherwise assume, mark the assumption in the manual's "Open items", and continue.
3. **Research** with WebSearch (send searches in parallel):
   - Competitors and what they charge. What they do badly (UX, price, privacy).
   - Payment providers: fees, payout countries, MoR status. Note any provider shutting down.
   - Hosting free tiers that allow commercial use.
   - Legal/platform risk: consumer protection (FTC, EU), privacy (GDPR), trademarks, app/payment acceptable-use rules, age limits.
   - Affiliate or partner programs that fit the idea.
   - Any LLM pricing: load the `claude-api` skill, do not quote from memory.
   Mark figures from third-party sites as "(check)". Mark your own guesses as "(est.)".
4. **Design the product**: name + identity, user flow screen by screen, how the result/report is generated (scoring rules, text bank, templates), pricing, tech stack, data model, marketing, legal and safety.
5. **Fix ethical or legal problems in the idea** instead of only warning. Keep the mechanic the owner wants, change the part that breaks the law or hurts people, and say why in a WARNING. Example: a paywall that pressures the payer is fine; hiding the price from the payer is not, so show the price in one small line before the start.
6. **Write the manual** (section 3 + 4) as HTML. Use `side-hustles/halves/plan.html` as the reference for component patterns (phone mockups, logo sheet, swatches, posters, framework diagrams, funnel calculator, day cards, callouts), but give each idea **its own visual world** from its own brand (section 4b).
7. **Save** to `side-hustles/<slug>/plan.html` in the repo, **publish** it with the Artifact tool, commit and push on the current branch.
8. **Reply in chat** with: the link, the top 5 decisions, the top 3 warnings, open questions. Keep chat short; the content goes in the manual.

When the owner sends changes to an existing idea: update the same file (same artifact URL), raise the revision letter (REV A -> REV B), and add a row to the change log at the end.

## 3. Required chapters

Use these chapter codes so every manual reads the same.

| CH | Title | Must contain |
|---|---|---|
| 00 | How to use this manual | Callout meanings, (est.) and (check) marks |
| 01 | Product summary | Spec table, products/routes table with price and time, competitor table, why it can win |
| 02 | Name and identity | 5 names scored + pick, domains to check, logo (inline SVG), color swatches, fonts, voice rules, word bank, taglines, UX rules |
| 03 | User flow | Step diagram, screen copy for key screens, mock of the money screen |
| 04+ | How the product works | The engine: inputs, scoring formulas, report/output assembly, text bank size. One chapter per route if routes differ |
| -- | AI: yes or no | Options table with cost and risk, recommendation |
| -- | Money | Payment provider table, prices, fee math, funnel calculator, monthly cost |
| -- | Tech build | Stack table, data model, endpoints, security rules |
| -- | Build schedule | Day 0 prep + Day 1-5 task cards, each with "Done when" |
| -- | Marketing | Channels, profile setup, 5 video formats, 10 hooks, posting schedule, built-in viral loops, partner/affiliate routes |
| -- | Legal and safety | All WARNING/CAUTION items in one place, required pages |
| -- | Other ways to run it | Alternatives table (speed, cost, cut, verdict) |
| -- | Launch checklist | Checkboxes |
| -- | Open items, sources, change log | Questions for the owner, source links |

## 4. Writing style: Simplified Technical English (TEXT ONLY)

The manual style applies to the **words only**. The page must NOT look like a
black-and-white repair manual (see 4b). Write the text like an aircraft
maintenance manual for non-native English readers.

- One instruction or one fact per sentence. Max 20 words per instruction, 25 per description.
- Imperative for steps: "Open the chat. Tap Export." Not "You might want to open...".
- Active voice. Present tense. No contractions ("do not", not "don't").
- Simple common words. One word = one meaning. Same term every time for the same thing.
- Numbers as digits. Units always. Prices with currency.
- Lists and tables before paragraphs. A paragraph is max 3 sentences.
- Callouts, placed **before** the step they apply to:
  - **WARNING** - risk of harm to people, or legal action.
  - **CAUTION** - risk to money, accounts, data or the brand.
  - **NOTE** - useful information.
- No marketing fluff inside the manual itself. Marketing copy examples go in quote boxes.
- Not text-heavy: if a section is longer than one phone screen of prose, convert it to a table, steps or a diagram.

## 4b. Visual style: rich, branded, visionary

The owner wants to *see* the business, not read about it.

- Design the page **in the idea's own brand**: its colors, fonts, logo and mood. The hero shows the brand, not a document header.
- Show, do not describe. Every chapter needs at least one visual. Use as many as fit:
  - **Logo sheet**: primary lockup on dark and light, one-color version, app icon, favicon sizes, construction drawing (inline SVG).
  - **Color swatches** as big blocks, **type specimen** with a real headline.
  - **Phone mockups** of the key screens, in a sideways-scrolling strip, captioned with step ids.
  - **Social mockups**: Instagram profile grid, Story share card, DM with link preview, video thumbnails (9:16) for each content format.
  - **Framework diagrams**: pipeline of how the product works, scoring/radar charts, type or archetype cards with small SVG glyphs, architecture diagram, growth-loop diagram.
  - **Money visuals**: provider cards with verdict stamps, price tags with "you keep" bars, an interactive funnel calculator.
  - **Timeline cards** for the build days, poster cards for taglines, word chips for voice.
- Use cards, chips and stamps in place of most tables. Keep a table only for data that is truly row-and-column (for example measurements or endpoints).
- No long paragraphs anywhere. Max 3 short sentences in a block.
- Mockups use invented example people (for example "Alex" and "Sam") and say "example" where numbers could look real.

## 5. Do not

- Do not write product code, create accounts, buy domains or run deploys. Planning only.
- Do not design dark patterns that break consumer law (hidden prices, fake timers, fake reviews, tricking the second person about where their data goes).
- Do not use trademarked quiz names or copy published psychology scales word for word.
- Do not claim diagnosis or "scientifically proven" results for quiz or report products.
- Do not put safety help (abuse, self-harm, crisis) behind a paywall.
