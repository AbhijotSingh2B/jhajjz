# Issues

Known problems with the site. Add what you find and can't fix right away; delete an entry once it's fixed
(the fix is in `git log`). Facts waiting on the client go in CLAUDE.md "Open items", not here.

## Open

- **Date fields not yet checked on iPhone.** `components/date-input.tsx` hides the browser's own date text and
  writes dd/mm/yyyy over it. Verified in Chromium (phone and desktop, US locale); the sandbox has no WebKit, so
  Nirmal should check the booking bar and quote form on his iPhone (empty state, picking a date, the text lining up).
