import type { SingaporePlannerProfile, TaxReliefKey, TaxReliefSelection } from './types';

const base='https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/';
export const TAX_RULES_CHECKED='8 November 2026';
export const taxReliefOptions: {key:TaxReliefKey;label:string;helper:string;slug:string;guided?:boolean;rebate?:boolean;lapsedYA?:number}[]=[
 {key:'earnedIncome',label:'Earned Income Relief',guided:true,slug:'earned-income-relief',helper:'For eligible employment or trade income. Ordinary annual limits: $1,000 below 55, $6,000 at 55–59 and $8,000 from 60. Disability limits: $4,000 / $10,000 / $12,000. Always capped by eligible earned income; not available on CPF LIFE, dividends or SRS withdrawals alone.'},
 {key:'spouse',label:'Spouse Relief',guided:true,slug:'spouse-relief-spouse-relief-(disability)',helper:'Ordinary relief $2,000; disability relief $5,500. Check support, residency and relationship requirements. Ordinary spouse income must not exceed $8,000 for the basis year; disability exceptions apply. Do not duplicate a claim on the same dependant.'},
 {key:'parent',label:'Parent Relief',guided:true,slug:'parent-relief-parent-relief-(disability)',helper:'Per qualifying dependant: $9,000 living together, $5,500 apart; disability amounts $14,000 / $10,000. Up to two qualifying dependants. Confirm Singapore residence, support, age and income conditions. Enter only your agreed share. Use a custom total for mixed living arrangements.'},
 {key:'child',label:'Qualifying Child Relief',guided:true,slug:'qualifying-child-relief-(qcr)-child-relief-(disability)',helper:'$4,000 per qualifying child, or $7,500 with disability. Confirm age/study, support and income conditions. Parents share the allowable total, not one full claim each. Combined child relief and WMCR cannot exceed $50,000 per child.'},
 {key:'grandparentCaregiver',label:'Grandparent Caregiver Relief',guided:true,slug:'grandparent-caregiver-relief',helper:'$3,000 total for an eligible working mother with a qualifying caregiver and child. Not $3,000 per child or caregiver. Confirm caregiver activity/income, child and Singapore residence conditions; only one claimant per caregiver.'},
 {key:'nsman',label:'NSman Relief',guided:true,slug:'nsman-relief-(self-wife-and-parent)',helper:'Self: $1,500 without qualifying activity, $3,000 with activity; key appointment $3,500 / $5,000. Eligible wife or parent: $750. Choose your own qualifying category; do not combine incompatible claims. Confirm against IRAS/MINDEF records.'},
 {key:'workingMotherChild',label:"Working Mother's Child Relief",slug:"working-mother's-child-relief-(wmcr)",helper:'Enter only your eligible amount. Birth/adoption date, child order, citizenship and earned income affect the rules; eligible children from 1 January 2024 use fixed amounts, earlier cohorts use income percentages. Check the per-child and earned-income limits with IRAS.'},
 {key:'cpfCashTopUp',label:'CPF Cash Top-Up Relief',slug:'cpf-cash-top-up-relief',helper:'Enter actual qualifying relief, not the top-up limit: up to $8,000 for own qualifying top-ups and $8,000 for eligible family top-ups, including shared MediSave caps. Transfers, amounts beyond qualifying limits and matched amounts may not qualify. This input does not itself make a cash top-up or deduct cash.'},
 {key:'lifeInsurance',label:'Life Insurance Relief',slug:'life-insurance-relief',helper:'Available only in limited circumstances, including the CPF-contribution test and qualifying policy conditions. Use your confirmed eligible amount, not the annual premium or maximum by default.'},
 {key:'parenthoodTaxRebate',label:'Parenthood Tax Rebate',rebate:true,slug:'parenthood-tax-rebate-(ptr)',helper:'A finite rebate balance, not an annual personal relief. Enter your own unused allocated balance, not both spouses’ combined award. It offsets tax and unused amounts carry forward until used. The planner reduces this balance year by year.'},
 {key:'foreignDomesticWorker',label:'Foreign Domestic Worker Levy Relief',slug:'foreign-domestic-worker-levy-relief',lapsedYA:2025,helper:'Lapsed from YA 2025. Saved entries are retained for reference but excluded from current/future tax estimates.'},
 {key:'courseFees',label:'Course Fees Relief',slug:'course-fees-relief',lapsedYA:2026,helper:'Lapsed from YA 2026. Saved entries are retained for reference but excluded from current/future tax estimates.'}
];
export const reliefSource=(key:TaxReliefKey)=>base+(key==='parenthoodTaxRebate'?'':'tax-reliefs/')+taxReliefOptions.find(option=>option.key===key)!.slug;
export const amount=(value:unknown)=>Math.max(0,Number.isFinite(Number(value))?Number(value):0);

export function calculatedRelief(key:TaxReliefKey, selection:TaxReliefSelection, age:number, earnedIncome:number) {
 const count=Math.min(key==='parent'?2:20,Math.max(1,Math.floor(amount(selection.dependants??1))));
 const share=Math.min(100,amount(selection.share??100))/100;
 if(key==='earnedIncome')return Math.min(amount(earnedIncome),selection.disability?(age<55?4000:age<60?10000:12000):(age<55?1000:age<60?6000:8000));
 if(key==='spouse')return selection.disability?5500:2000;
 if(key==='parent')return selection.livingWith===undefined?0:(selection.disability?(selection.livingWith?14000:10000):(selection.livingWith?9000:5500))*count*share;
 if(key==='child')return (selection.disability?7500:4000)*count*share;
 if(key==='grandparentCaregiver')return earnedIncome>0?3000:0;
 if(key==='nsman')return selection.nsCategory?({selfInactive:1500,selfActive:3000,keyInactive:3500,keyActive:5000,wife:750,parent:750}[selection.nsCategory]??0):0;
 return 0;
}

export function reliefAmount(key:TaxReliefKey, selection:TaxReliefSelection|undefined, age:number, earnedIncome:number, ya:number, gender?:string) {
 if(!selection?.enabled || (selection.endAge!==undefined && selection.endAge!=='' && age>amount(selection.endAge)))return 0;
 const rule=taxReliefOptions.find(option=>option.key===key);
 if(!rule||rule.rebate||(rule.lapsedYA&&ya>=rule.lapsedYA))return 0;
 if(gender==='Male'&&['grandparentCaregiver','workingMotherChild'].includes(key))return 0;
 const value=selection.mode==='auto'?calculatedRelief(key,selection,age,earnedIncome):amount(selection.amount);
 return ['earnedIncome','workingMotherChild'].includes(key)?Math.min(value,amount(earnedIncome)):key==='grandparentCaregiver'&&earnedIncome<=0?0:value;
}

export function selectedReliefTotal(profile:SingaporePlannerProfile, age:number, earnedIncome:number, ya:number) {
 return Object.entries(profile.tax.reliefs??{}).reduce((total,[key,selection])=>total+reliefAmount(key as TaxReliefKey,selection,age,earnedIncome,ya,profile.gender),0);
}
