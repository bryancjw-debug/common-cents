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

## Guided Tax and Retirement Spending (8 November 2026)

- These features belong to CommonCents only. RetirementReadiness intentionally stays focused on retirement budgets and net cash/investment flows; do not copy holistic tax forms into it.
- `src/singapore/taxReliefs.ts` owns IRAS-linked relief metadata and guided amounts. Preserve legacy values (including explicit zero) as custom unless the user restores calculation. Automatic earned-income bands use each projected age and eligible earnings. Parent/child totals use the individual's claim share. A missing end age explicitly assumes continuing eligibility; do not claim automatic lifelong eligibility verification.
- Keep donation deductions outside the $80,000 personal-relief cap. Exclude lapsed FDW levy/course-fee reliefs from current/future estimates without deleting saved records. Personal reliefs require resident-tax eligibility. The app uses an income-year tax-cashflow approximation, with YA = income year + 1.
- Parenthood Tax Rebate is a finite unused balance allocated to this person, used from the entered YA and carried until exhausted; never renew it annually. Other manually entered rebates are explicitly a recurring assumption. Custom cash top-up relief does not itself execute or deduct a contribution.
- Relief information buttons must support tap, keyboard and hover descriptions, link to IRAS and disclose the checked date. Recheck rules before changes; forecasts hold current rates constant, not future tax-law guarantees.
- Retirement spending defaults to a final monthly budget in today's dollars. Alternative adjustment controls use Spend less / About the same / Spend more with a positive magnitude. Store the existing signed event delta for backward compatibility, inflate once, and preserve signs in year tables/exports. Separately modelled housing/premiums/investments are not silently folded into this expense budget.
- Test age boundaries, income caps, lapsed reliefs, sharing, explicit custom zero, rebate exhaustion/start YA, saved-profile roundtrips, negative event exports, mobile information dialogs and PDF page layouts. Do not update the retired prototype.
