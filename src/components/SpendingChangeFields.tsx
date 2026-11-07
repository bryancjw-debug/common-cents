import { useId, useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

const money=(value:number)=>new Intl.NumberFormat('en-SG',{style:'currency',currency:'SGD',maximumFractionDigits:0}).format(value);
export function SpendingChangeFields({retirement,baseToday,change,onChange}:{retirement:boolean;baseToday:number;change:number;onChange:(value:number)=>void}) {
 const id=useId();const [method,setMethod]=useState<'budget'|'change'>(retirement?'budget':'change');
 const [zeroDirection,setZeroDirection]=useState<'less'|'same'|'more'>('same');
 const direction=change<0?'less':change>0?'more':zeroDirection;
 const budget=Math.max(0,baseToday+change);
 return <div className="spending-change-fields md:col-span-2 xl:col-span-4">
  {retirement?<div className="spending-method" role="group" aria-label="Retirement spending entry method"><Button variant={method==='budget'?'default':'outline'} aria-pressed={method==='budget'} onClick={()=>setMethod('budget')}>Set my retirement budget</Button><Button variant={method==='change'?'default':'outline'} aria-pressed={method==='change'} onClick={()=>setMethod('change')}>Adjust my current spending</Button></div>:null}
  {method==='change'?<div className="spending-method" role="group" aria-label="Expected spending direction">{(['less','same','more'] as const).map(next=><Button key={next} variant={direction===next?'default':'outline'} aria-pressed={direction===next} onClick={()=>{setZeroDirection(next);onChange(next==='same'?0:(next==='less'?-1:1)*Math.abs(change));}}>{next==='same'?'About the same':next==='less'?'Spend less':'Spend more'}</Button>)}</div>:null}
  {method==='budget'||direction!=='same'?<div className="grid gap-2"><Label htmlFor={id}>{method==='budget'?'Expected monthly retirement spending (today’s SGD)':`How much ${direction} per month? (today’s SGD)`}</Label><Input id={id} type="number" min={0} step={100} value={method==='budget'?Number(budget.toFixed(2)):Math.abs(change)} onChange={event=>{const n=Math.max(0,Number(event.target.value)||0);onChange(method==='budget'?n-baseToday:(direction==='less'?-n:n));}}/></div>:null}
  <p className="text-sm">Before this change: <strong>{money(baseToday)}/month</strong> → After: <strong>{money(budget)}/month</strong> in today’s dollars.</p>
  <p className="text-sm text-muted-foreground">{change===0?'No change to this spending budget.':`${money(Math.abs(change))} ${change<0?'less':'more'} each month, before inflation.`} The projection applies inflation once. This adjusts the Expenses budget, not separately modelled mortgages, premiums, investment contributions or dependant costs.</p>
  {baseToday+change<0?<p role="alert" className="text-sm text-destructive">The reduction exceeds the spending baseline. Projected spending is floored at zero; reduce the adjustment.</p>:null}
 </div>;
}
