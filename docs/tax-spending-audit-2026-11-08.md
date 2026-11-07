# Guided Reliefs and Retirement Spending Audit

Date: 8 November 2026 (Singapore). App: CommonCents only, `bryancjw-debug/common-cents`. RetirementReadiness and the retired prototype were not modified.

## Changes

- Guided relief amounts for earned income, spouse, parent, qualifying child, grandparent caregiver and NSman categories. Parent/child inputs include count and the individual's agreed claim share; parent living arrangement and NSman category must be supplied before an amount is calculated. Disability variants are separate. Complex reliefs remain user-confirmed custom amounts, not invented maximum claims.
- Existing saved values, including explicit zero, remain custom unless calculation is restored. Automatic earned-income amounts use projected age and actual earned income. Optional claim end ages stop reliefs. Working-mother reliefs are excluded for male profiles; work-dependent reliefs do not continue without earnings.
- Every relief has a keyboard/tap information dialog, hover description, official source link and checked date. Tax-residency, claim sharing and continuing-eligibility assumptions are stated. Source-dependent conditions still require personal verification.
- Donation deductions are separate from the $80,000 personal-relief cap. Lapsed FDW levy/course-fee records are retained but excluded from current/future estimates. Parenthood Tax Rebate is a finite unused allocated balance, consumed from its applicable YA instead of renewed annually. Other manual annual rebates remain explicitly recurring assumptions.
- Retirement events default to a final monthly spending budget in today's dollars. Users can alternatively choose Spend less / About the same / Spend more and enter a positive magnitude. Before/after budgets and the inflation-adjusted event preview remain visible. The existing signed event delta is preserved for storage compatibility, and negative changes now remain visible in year data rather than being clamped to zero.
- PDF tax summaries now show separate donation deductions, capped personal reliefs, chargeable income, estimated tax and each selected relief's amount/mode. Flat responsive controls retain the app's existing palettes and landing.
- Compatible development-tool updates resolved newly reported advisories: Vite 7.3.7 and Vitest 5.1.0, locked without a major-version migration or new production dependency.

## Verification

- Clean `npm ci`: passed after stopping the preview server holding a Windows native CSS module open.
- `npm test`: 67 tests passed across seven files. New coverage includes age/disability bands, income caps, parent/child sharing, NSman categories, custom zero, claim end ages, lapsed records, saved-profile normalization, donation-cap separation, rebate start YA and finite rebate exhaustion.
- Production build and PWA allowlist/cache-isolation checks: passed (13 assets).
- `npm audit`: zero reported vulnerabilities after compatible lockfile updates. This is not a penetration test.
- Browser checks: guided amounts, edit/restore, parent sharing, mobile help dialog, Escape, both themes and widths 320/390/768/1440/1920, retirement budget/direction controls, saved signed delta, Home/resume, couple projection, saved relief reload, signed year data and offline reopening passed.
- A fictional five-page PDF was downloaded, rendered page by page and visually reviewed: no new clipping or overlap in tax summaries. Mobile screenshots were inspected and edit-button contrast refined.

## Limits

- This is a Singapore-resident planning estimate, not an IRAS eligibility determination or tax filing service. Users confirm qualifying conditions and their own claim share. No dependant identity matching or automatic household duplicate-claim detection is claimed.
- Unless a claim end age is entered, non-age-specific eligibility and sharing are assumed to continue. Custom amounts are user assertions; they are not independently verified. Reliefs, rates and qualifying-donation treatment are held constant for future planning, not guaranteed future law.
- Tax cash flows use the existing income-year approximation, with Year of Assessment = income year + 1. Unused donation deductions are not carried forward. No future Budget rebate is invented. Previously consumed PTR must not be entered again as an unused balance.
- The retirement budget is translated to the existing signed expense adjustment; it is relative to the Expenses baseline. Review it after changing that baseline or other events. Mortgages, premiums, investments and other separately modelled outflows are not silently merged into this input.
- Native installation on Android/iOS/Windows was not tested in this audit. Save/export before accepting a PWA update.

## Official Sources Checked

- [Earned Income Relief](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/earned-income-relief)
- [Spouse Relief](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/spouse-relief-spouse-relief-(disability))
- [Parent Relief](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/parent-relief-parent-relief-(disability))
- [Qualifying Child Relief](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/qualifying-child-relief-(qcr)-child-relief-(disability))
- [Grandparent Caregiver Relief](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/grandparent-caregiver-relief)
- [NSman Relief](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/nsman-relief-(self-wife-and-parent))
- [Relief List and Personal Relief Cap](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/)
- [Course Fees Relief](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/course-fees-relief)
- [Donation Deductions](https://www.iras.gov.sg/taxes/other-taxes/charities/donations-tax-deductions)
- [Parenthood Tax Rebate](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/parenthood-tax-rebate-(ptr))
