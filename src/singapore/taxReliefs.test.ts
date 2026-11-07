import { describe, expect, it } from 'vitest';
import { createQuickStartProfile } from './defaults';
import { calculatedRelief, reliefAmount, selectedReliefTotal } from './taxReliefs';
import { annualIncomeTax, incomeTaxDetails, normalizeProfile, projectSingaporeProfile } from './projection';
import { createStoredProfile, normalizeProfileStore } from './storage';

describe('Guided tax reliefs',()=>{
 it.each([[54,1000],[55,6000],[59,6000],[60,8000]])('uses ordinary earned-income bands at age %s',(age,expected)=>expect(calculatedRelief('earnedIncome',{enabled:true,amount:'',mode:'auto'},age,100000)).toBe(expected));
 it.each([[54,4000],[55,10000],[60,12000]])('uses disability earned-income bands at age %s',(age,expected)=>expect(calculatedRelief('earnedIncome',{enabled:true,amount:'',mode:'auto',disability:true},age,100000)).toBe(expected));
 it('caps earned relief by actual earned income and gives none for SRS-only income',()=>{
  expect(reliefAmount('earnedIncome',{enabled:true,amount:8000,mode:'auto'},60,500,2027)).toBe(500);
  expect(reliefAmount('earnedIncome',{enabled:true,amount:8000},60,0,2027)).toBe(0);
 });
 it('calculates spouse variants',()=>{
  expect(calculatedRelief('spouse',{enabled:true,amount:''},30,72000)).toBe(2000);
  expect(calculatedRelief('spouse',{enabled:true,amount:'',disability:true},30,72000)).toBe(5500);
 });
 it('requires a parent living arrangement and applies an individual share',()=>{
  const p={enabled:true,amount:'' as const,mode:'auto' as const,dependants:2,share:50};
  expect(calculatedRelief('parent',p,40,72000)).toBe(0);
  expect(calculatedRelief('parent',{...p,livingWith:true},40,72000)).toBe(9000);
  expect(calculatedRelief('parent',{...p,livingWith:false,disability:true},40,72000)).toBe(10000);
 });
 it('applies child count, disability and sharing without claiming a household total twice',()=>{
  expect(calculatedRelief('child',{enabled:true,amount:'',dependants:2,share:50},40,72000)).toBe(4000);
  expect(calculatedRelief('child',{enabled:true,amount:'',disability:true,share:40},40,72000)).toBe(3000);
 });
 it('does not renew work-dependent caregiver relief without earnings',()=>expect(reliefAmount('grandparentCaregiver',{enabled:true,mode:'auto',amount:''},65,0,2027)).toBe(0));
 it('excludes working-mother reliefs for a male profile without discarding saved selections',()=>{
  const p=createQuickStartProfile();p.gender='Male';p.tax.reliefs.grandparentCaregiver={enabled:true,amount:3000,mode:'auto'};
  expect(selectedReliefTotal(p,40,72000,2027)).toBe(0);
  p.gender='Female';expect(selectedReliefTotal(p,40,72000,2027)).toBe(3000);
 });
 it('requires an NSman category and uses the chosen category only',()=>{
  expect(calculatedRelief('nsman',{enabled:true,amount:''},40,72000)).toBe(0);
  expect(calculatedRelief('nsman',{enabled:true,amount:'',nsCategory:'keyActive'},40,72000)).toBe(5000);
  expect(calculatedRelief('nsman',{enabled:true,amount:'',nsCategory:'parent'},60,72000)).toBe(750);
 });
 it('preserves a legacy explicit zero and excludes disabled/expired claims',()=>{
  expect(reliefAmount('spouse',{enabled:true,amount:0},40,72000,2027)).toBe(0);
  expect(reliefAmount('spouse',{enabled:true,amount:2000,endAge:50},51,72000,2027)).toBe(0);
  expect(reliefAmount('spouse',{enabled:false,amount:2000},40,72000,2027)).toBe(0);
 });
 it('retains but excludes lapsed relief records from current assessments',()=>{
  const p=createQuickStartProfile();p.tax.reliefs={courseFees:{enabled:true,amount:5500},foreignDomesticWorker:{enabled:true,amount:5000}};
  expect(selectedReliefTotal(p,30,72000,2027)).toBe(0);
  expect(normalizeProfile(p).tax.reliefs.courseFees?.amount).toBe(5500);
 });
 it('preserves guided settings, sharing, expiry and custom zero through saved-profile normalization',()=>{
  const p=createQuickStartProfile();p.tax.reliefs.child={enabled:true,amount:0,mode:'auto',dependants:2,share:50,endAge:55};
  const record=createStoredProfile(p,'guided');
  const stored=normalizeProfileStore({version:1,activeId:'guided',profiles:[record]});
  expect(stored.profiles[0].profile.tax.reliefs.child).toEqual(p.tax.reliefs.child);
 });
 it('keeps donations outside the personal-relief cap',()=>{
  const p=createQuickStartProfile();p.tax.otherReliefs=80000;p.tax.donations=10000;
  const tax=incomeTaxDetails(p,200000,40);
  expect(tax.relief).toBe(80000);expect(tax.donationRelief).toBe(25000);expect(tax.chargeable).toBe(95000);
 });
 it('updates automatically calculated earned-income relief each projected year',()=>{
  const p=createQuickStartProfile();p.age=54;p.tax.reliefs.earnedIncome={enabled:true,amount:'',mode:'auto'};
  expect(incomeTaxDetails(p,72000,54).relief).toBe(15400);
  expect(incomeTaxDetails(p,72000,55).relief).toBeGreaterThan(15400);
 });
 it('consumes a parenthood rebate balance once, not once per year',()=>{
  const p=createQuickStartProfile();p.age=30;p.endAge=40;p.incomeInf=0;p.events=[];
  p.tax.reliefs.parenthoodTaxRebate={enabled:true,amount:5000,year:2027};
  const rows=projectSingaporeProfile(p);
  const noRebate={...p,tax:{...p.tax,reliefs:{}}};
  const used=rows.reduce((sum,row)=>sum+annualIncomeTax(noRebate,row.activeIncome,row.age)-row.annualIncomeTax,0);
  expect(used).toBeCloseTo(5000,2);
  expect(rows.at(-1)!.annualIncomeTax).toBeGreaterThan(0);
 });
 it('does not use a future-YA rebate before it becomes available',()=>{
  const p=createQuickStartProfile();p.tax.reliefs.parenthoodTaxRebate={enabled:true,amount:5000,year:2030};
  expect(incomeTaxDetails(p,72000,30).parenthoodRebateUsed).toBe(0);
  expect(incomeTaxDetails(p,72000,33).parenthoodRebateUsed).toBeGreaterThan(0);
 });
});
