import { useId, useState } from 'react';
import { CircleHelp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { calculatedRelief, reliefAmount, reliefSource, taxReliefOptions, TAX_RULES_CHECKED } from '../singapore/taxReliefs';
import type { SingaporePlannerProfile, TaxReliefKey, TaxReliefSelection } from '../singapore/types';

const money=(value:number)=>new Intl.NumberFormat('en-SG',{style:'currency',currency:'SGD',maximumFractionDigits:0}).format(value);

function Numeric({label,value,onChange,min=0,max}:{label:string;value:number|''|undefined;onChange:(value:number|'')=>void;min?:number;max?:number}) {
 const id=useId();return <div className="grid gap-2"><Label htmlFor={id}>{label}</Label><Input id={id} type="number" min={min} max={max} value={value??''} onChange={event=>onChange(event.target.value===''?'':Math.min(max??Infinity,Math.max(min,Number(event.target.value))))}/></div>;
}

function ReliefCard({option,selection,age,gross,ya,gender,onChange}:{option:typeof taxReliefOptions[number];selection?:TaxReliefSelection;age:number;gross:number;ya:number;gender:string;onChange:(value:TaxReliefSelection)=>void}) {
 const id=useId();const [help,setHelp]=useState(false);
 const current:TaxReliefSelection=selection??{enabled:false,amount:''};
 const auto=current.mode==='auto';const expired=Boolean(option.lapsedYA&&ya>=option.lapsedYA);
 const ineligible=gender==='Male'&&['grandparentCaregiver','workingMotherChild'].includes(option.key);
 const suggested=calculatedRelief(option.key,current,age,gross);
 const value=option.rebate?Number(current.amount)||0:reliefAmount(option.key,current,age,gross,ya,gender);
 const patch=(change:Partial<TaxReliefSelection>)=>onChange({...current,...change});
 const edit=()=>patch({mode:'custom',amount:auto?suggested:current.amount});
 return <section className="tax-relief-card rounded-lg border bg-card p-4">
  <div className="tax-relief-title"><Label htmlFor={id}>{option.label}</Label><button type="button" className="relief-info" title={option.helper} aria-label={`About ${option.label}`} onClick={()=>setHelp(true)}><CircleHelp size={18}/></button><Switch id={id} checked={Boolean(current.enabled)} disabled={(expired||ineligible)&&!current.enabled} onCheckedChange={enabled=>patch({enabled,mode:current.mode??(current.amount!==''&&current.amount!==undefined?'custom':option.guided?'auto':'custom')})}/></div>
  {ineligible?<p className="text-sm text-muted-foreground">For eligible working mothers only. Excluded for this profile; any saved value is retained for reference.</p>:null}
  {expired?<p className="text-sm text-muted-foreground">Not available from YA {option.lapsedYA}. Saved value {money(Number(current.amount)||0)} retained, excluded from this estimate.</p>:null}
  {current.enabled&&!expired&&!ineligible?<div className="tax-relief-fields">
   {option.guided&&auto?<>
    {['earnedIncome','spouse','parent','child'].includes(option.key)?<label className="relief-inline"><input type="checkbox" checked={Boolean(current.disability)} onChange={e=>patch({disability:e.target.checked})}/> Use disability relief (if eligible)</label>:null}
    {option.key==='parent'?<div className="grid gap-2"><Label htmlFor={`${id}-living`}>Living arrangement</Label><select id={`${id}-living`} className="react-select" value={current.livingWith===undefined?'':String(current.livingWith)} onChange={e=>patch({livingWith:e.target.value===''?undefined:e.target.value==='true'})}><option value="">Choose arrangement</option><option value="true">Living with me</option><option value="false">Living separately</option></select></div>:null}
    {['parent','child'].includes(option.key)?<><Numeric label={`Number of qualifying ${option.key==='parent'?'parents / grandparents':'children'}`} value={current.dependants??1} min={1} max={option.key==='parent'?2:20} onChange={n=>patch({dependants:Number(n)||1})}/><Numeric label="My agreed claim share (%)" value={current.share??100} max={100} onChange={n=>patch({share:Number(n)})}/></>:null}
    {option.key==='nsman'?<div className="grid gap-2"><Label htmlFor={`${id}-ns`}>My qualifying NSman category</Label><select id={`${id}-ns`} className="react-select" value={current.nsCategory??''} onChange={e=>patch({nsCategory:(e.target.value||undefined) as TaxReliefSelection['nsCategory']})}><option value="">Choose category</option>{([['selfInactive','Self: no qualifying activity'],['selfActive','Self: qualifying activity'],['keyInactive','Key appointment: no activity'],['keyActive','Key appointment: qualifying activity'],['wife','Eligible wife'],['parent','Eligible parent']] as const).map(([key,label])=><option value={key} key={key}>{label}</option>)}</select></div>:null}
    <div className="relief-amount"><span>Calculated annual relief</span><strong>{money(value)}</strong></div>
    <Button variant="outline" size="sm" onClick={edit}>Edit amount</Button>
   </>:<><Numeric label={option.rebate?'My unused parenthood rebate balance':'My annual relief amount'} value={current.amount} onChange={amount=>patch({amount,mode:'custom'})}/>{option.guided?<Button variant="outline" size="sm" onClick={()=>patch({mode:'auto'})}>Restore calculated amount</Button>:null}</>}
   {!option.rebate?<Numeric label="Stop claiming after my age (optional)" value={current.endAge} onChange={endAge=>patch({endAge})}/>:<Numeric label="First applicable Year of Assessment" value={current.year} min={2000} onChange={year=>patch({year})}/>}
   <p className="text-xs text-muted-foreground">{option.rebate?'Uses only your unused balance from the selected YA (blank: next YA). It is not renewed each year.':`${auto?'Calculated':'Custom / saved'} amount. Only select this if you meet IRAS conditions. Unless an end age is entered, eligibility and claim sharing are assumed to continue; earned-income relief stops when eligible earned income ends.`}</p>
  </div>:null}
  <Dialog open={help} onOpenChange={setHelp}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{option.label}</DialogTitle><DialogDescription>{option.helper}</DialogDescription></DialogHeader><p className="text-sm">Relief reduces taxable income; it is not a dollar-for-dollar refund. Claim only your share, and review eligibility each year.</p><a className="underline text-sm" href={reliefSource(option.key)} target="_blank" rel="noreferrer">Check IRAS eligibility and amounts</a><p className="text-xs text-muted-foreground">Rules checked {TAX_RULES_CHECKED}. Future law and personal circumstances can change.</p></DialogContent></Dialog>
 </section>;
}

export function TaxReliefPanel({profile,age,gross,ya,onChange}:{profile:SingaporePlannerProfile;age:number;gross:number;ya:number;onChange:(key:TaxReliefKey,selection:TaxReliefSelection)=>void}) {
 const active=taxReliefOptions.filter(option=>!option.lapsedYA);
 const legacy=taxReliefOptions.filter(option=>option.lapsedYA&&profile.tax.reliefs[option.key]?.enabled);
 return <><p className="text-sm text-muted-foreground">Annual estimates for this individual, YA {ya}. Personal reliefs require Singapore tax residency. Select only reliefs you qualify for; amounts are not household-wide. Cash top-up relief does not itself create a cash payment.</p><div className="tax-relief-grid">{active.map(option=><ReliefCard key={option.key} option={option} selection={profile.tax.reliefs[option.key]} gender={profile.gender} {...{age,gross,ya}} onChange={selection=>onChange(option.key,selection)}/>)}</div>{legacy.length?<details className="rounded-lg border p-4"><summary>Saved discontinued reliefs (excluded)</summary>{legacy.map(option=><ReliefCard key={option.key} option={option} selection={profile.tax.reliefs[option.key]} gender={profile.gender} {...{age,gross,ya}} onChange={selection=>onChange(option.key,selection)}/>)}</details>:null}</>;
}
