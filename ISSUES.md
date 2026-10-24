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

- **Interface audit leftovers** (better-interface review, 2026-10-24; the HIGH findings are fixed). Still open:
  thin lines between rows in the phone menu (site-header.tsx `border-b border-white/10`) and the contact popup lists
  (contact-dialog.tsx `border-t`/`border-b border-line`), against the no-lines rule; the quote form's "Other" boxes
  have only a placeholder as their label (it vanishes once typing starts); popups open over 500ms (dialog.tsx) against
  the ~300ms rule; the popup has no `overscroll-contain`; the fleet page's last line says "Talk to us" twice; no
  "Skip to content" link. Not checked: text contrast over the hero and wedding photos.

- **Not yet checked on a real iPhone / TV** (the sandbox has Chromium only). Nirmal to check on his iPhone: both date
  fields (look, picking, the × clearing), sending a quote opens WhatsApp filled in, the header hiding on scroll, holding a card presses it in slightly, links and buttons dim, both easing in and out; the home S-Class box (smooth
  turn while scrolling, border opening and closing, no jump when the address bar hides). On a
  smart TV if possible: the Day/Month/Year date dropdowns.
