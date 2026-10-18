# Issues

Known problems with the site. Add what you find and can't fix right away; delete an entry once it's fixed
(the fix is in `git log`). Facts waiting on the client go in CLAUDE.md "Open items", not here.

## Open

- **Some photos are heavy.** With image optimization off, phones download the saved 1600px copies even for
  small cards. Worst: `public/photos/wix/171684_2ddf2c32…-fit-1600x1600.webp` (1.5 MB),
  `171684_14d2bd8b…` (1.26 MB), `171684_64da252c…` (0.94 MB). Home is ~1.1 MB on a phone, a car page up to
  ~1.2 MB. Possible fix: have `save-photos` also save an ~800px copy and use it for cards (keeps
  optimization off, per Nirmal).
- **Date fields: check the format on iPhone.** Chromium in the sandbox shows `mm/dd/yyyy` (US locale) in the
  booking bar and quote form. Indian phones probably show dd/mm, but it's unverified (no WebKit here).
