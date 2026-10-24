# Issues

Known problems with the site. Add what you find and can't fix right away; delete an entry once it's fixed
(the fix is in `git log`). Facts waiting on the client go in CLAUDE.md "Open items", not here.

## Open

- **Motion audit leftovers** (emil-design-eng / apple-design audit, 2026-10-19; the quick fixes are done). Still open:
  the phone popup and menu can't be swiped away and use fixed CSS keyframes, so closing one mid-opening jumps (see
  FUTURE-UPDATES); `Reveal`/`Enter` use Motion's `x`/`y` shorthands (main thread) rather than `transform`; the car
  gallery's portrait frame animates `width` (clip-path would be cheaper); the Fleet menu grows from `origin-top` though
  it sits right-aligned; reduced motion zeroes every fade too (it only needs to drop the movement); the same
  `[0.2, 0.7, 0.2, 1]` curve is typed in about 12 places instead of one token.

- **Not yet checked on a real iPhone / TV** (the sandbox has Chromium only). Nirmal to check on his iPhone: both date
  fields (look, picking, the × clearing), sending a quote opens WhatsApp filled in, the header hiding on scroll, holding a card presses it in slightly, links and buttons dim, both easing in and out; the home S-Class box (smooth
  turn while scrolling, border opening and closing, no jump when the address bar hides). On a
  smart TV if possible: the Day/Month/Year date dropdowns.
