import { describe, expect, it } from 'vitest';
import { quickStartFixture } from './projection.fixtures';
import { normalizeProfile, projectSingaporeProfile } from './projection';
import { STEP_MOTION_MS } from '../lib/stepMotion';

describe('CommonCents release safeguards', () => {
  it('retains the approved motion duration', () => expect(STEP_MOTION_MS).toBe(1100));
  it('keeps all financial projections finite over a selected horizon', () => {
    const profile = quickStartFixture();
    profile.endAge = 82;
    const rows = projectSingaporeProfile(normalizeProfile(profile));
    expect(rows.at(-1)?.age).toBe(82);
    for (const row of rows) for (const value of Object.values(row)) {
      if (typeof value === 'number') expect(Number.isFinite(value)).toBe(true);
    }
  });
  it('reconciles retirement deficits to funding sources and unfunded shortfall', () => {
    const profile = quickStartFixture();
    profile.age=60; profile.retirementAge=60; profile.endAge=85;
    profile.monthlyIncome=0; profile.monthlyExpenses=12000;
    profile.freeCash=5000; profile.assets=[]; profile.homes=[]; profile.cars=[]; profile.customAssets=[];
    profile.events=[]; profile.employmentPeriods=[]; profile.shifts=[];
    profile.cpf.oa=80000; profile.cpf.sa=0; profile.cpf.ra=0; profile.cpf.ma=10000;
    profile.srs.enabled=false;
    const rows=projectSingaporeProfile(normalizeProfile(profile)).slice(1);
    expect(rows.some(row=>row.annualCpfDeficitDrawdown>0)).toBe(true);
    expect(rows.some(row=>row.annualUnfundedShortfall>0)).toBe(true);
    for(const row of rows){
      const funded=row.annualFreeCashDrawdown+row.annualDrawdown+row.annualSrsDeficitDrawdown+row.annualOtherAssetDrawdown+row.annualCpfDeficitDrawdown+row.annualUnfundedShortfall;
      expect(funded).toBeCloseTo(Math.max(0,-row.netCashFlow),2);
      expect(row.freeCash).toBeGreaterThanOrEqual(0);
      expect(row.investmentValue).toBeGreaterThanOrEqual(0);
    }
  });
});
