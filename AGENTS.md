# CommonCents: Canonical Production App

- Repository: `https://github.com/bryancjw-debug/common-cents.git`.
- Public app: `https://bryancjw-debug.github.io/common-cents/`.
- Personal Wealth Planner (`personal-wealth-planner`) is a separate, retired prototype. Never publish CommonCents fixes to it or substitute its standalone `docs` build for this React app.
- Source is `src`, `public` and `scripts`; main builds production `dist`. GitHub Actions tests and builds before deploying **dist only** to Pages. Never upload source, local files, private client data or QA output as the site artifact.
- Preserve the existing animated landing, preview tiles, chart and four individual/couple entry paths. Keep the workspace flat, full-width, with thin continuous borders and system sans-serif type. Retain the white/blue light palette, black/gold dark palette and semantic chart colours.
- Desktop uses the section sidebar. Mobile uses a viewport-fixed Back / Sections / Next bar with safe-area padding, and an accessible section dialog. No transformed ancestors of the fixed bar.
- Approved step motion is 1100ms, gentle vertical travel up to 80px and fading; Back reverses it. Inputs, desktop actions and docked live summary move together. Header, sidebar and mobile bar stay still. Outgoing copies must be inert, aria-hidden and have no IDs. Cancel on rapid navigation and respect reduced motion. Never animate recalculation or edits.
- Home is not Reset: retain current inputs, step and projection view. Warn before replacing an in-progress plan. Preserve saved profile keys/formats and export/import compatibility.
- Financial engine is `src/singapore/projection.ts`; preserve it during visual work. Typed regression fixtures verify CPF, self-employment, mortgages, future purchases, property sales, projection horizon, protection, SRS and household mode. Estimates are not official personalised CPF payouts or tax advice.
- PWA workers use the `common-cents-app-shell-` namespace, cache only the allowlisted shell and never clear another app's caches. Offer updates explicitly; do not reload while users are entering data. Native installability requires real-device testing.
- Before publication run `npm ci`, `npm audit`, `npm test`, `npm run build`, and real-browser flows in both themes at mobile/tablet/wide desktop. Verify Home/resume, rapid step motion, drawer keyboard/focus, charts, profile save/import/export, offline reopening and live asset versions.
- Do not publish unless authorised. Verify exact remote, branch, live URL and output artifact before any push.
