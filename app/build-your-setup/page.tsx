"use client";
import {useEffect,useState} from "react";
import Image from "next/image";
import {Check,Plus,X} from "lucide-react";
import {products} from "@/data/products";
import {peso} from "@/lib/helpers";
import {useStore} from "@/components/store";

const slots=["Keyboards","Gaming Mice","Headsets","Mousepads","Monitors"];
const presets=[
 {name:"Student essentials",description:"Study and gaming essentials without a monitor.",ids:["2","6","9","17"],budget:6000},
 {name:"Competitive gaming",description:"A complete five-piece setup for your next match.",ids:["1","4","7","18","13"],budget:15000},
 {name:"Work from home",description:"A keyboard, wireless mouse, and extra screen space.",ids:["2","5","13"],budget:12000},
];
const storageKey="kada-tech-setup-v1";
function sanitizeSelection(value:unknown):Record<string,string>{
 if(!value||typeof value!=="object"||Array.isArray(value))return {};
 return Object.fromEntries(slots.flatMap(slot=>{const id=(value as Record<string,unknown>)[slot];return products.some(p=>p.id===id&&p.category===slot)?[[slot,id as string]]:[]}));
}

export default function Builder(){
 const[selected,setSelected]=useState<Record<string,string>>({});
 const[active,setActive]=useState(slots[0]);
 const[budget,setBudget]=useState(15000);
 const[ready,setReady]=useState(false);
 const[message,setMessage]=useState("");
 const[shareLink,setShareLink]=useState("");
 const[saving,setSaving]=useState(true);
 const{addCart,cart,ready:cartReady}=useStore();
 useEffect(()=>{
  const params=new URLSearchParams(window.location.search);
  try{
   const shared=params.has("setup");
   const saved=shared?{selected:JSON.parse(params.get("setup")||"{}"),budget:Number(params.get("budget"))}:JSON.parse(localStorage.getItem(storageKey)||"null");
   if(saved){setSelected(sanitizeSelection(saved.selected));if(Number.isFinite(saved.budget)&&saved.budget>0&&saved.budget<=1000000)setBudget(saved.budget);setMessage(shared?"Shared setup loaded. Customize it to make it yours.":"Your saved setup has been restored.");}
  }catch{setMessage("We couldn't restore that setup. Start a new one below.");}
  setReady(true);
 },[]);
 useEffect(()=>{
  if(!ready)return;
  try{localStorage.setItem(storageKey,JSON.stringify({selected,budget}));setSaving(true);}catch{setSaving(false);}
  setShareLink("");
 },[selected,budget,ready]);
 const chosen=slots.map(s=>products.find(p=>p.id===selected[s])).filter(Boolean) as typeof products;
 const total=chosen.reduce((a,b)=>a+b.price,0);
 const remaining=budget-total;
 const blocked=chosen.filter(p=>p.stock<=(cart.find(item=>item.id===p.id)?.qty||0));
 const current=products.find(p=>p.id===selected[active]);
 const cheaper=current?products.filter(p=>p.category===active&&p.stock>0&&p.price<current.price).sort((a,b)=>a.price-b.price):[];
 const share=async()=>{
  const url=new URL(window.location.href);url.search="";url.searchParams.set("setup",JSON.stringify(selected));url.searchParams.set("budget",String(budget));setShareLink(url.toString());
  try{await navigator.clipboard.writeText(url.toString());setMessage("Setup link copied. Share it with a friend!");}catch{setMessage("Copy your setup link from the field below.");}
 };
 return <div className="container py-12">
  <div className="text-center"><p className="eyebrow">Curate your battlestation</p><h1 className="mt-3 text-4xl font-black sm:text-6xl">Build your setup.</h1><p className="muted mx-auto mt-4 max-w-xl">Compare the features that matter, understand who each product suits, and build with confidence.</p></div>
  <section aria-label="Setup presets" className="mt-8 grid gap-3 md:grid-cols-3">{presets.map(preset=><button disabled={!ready} key={preset.name} onClick={()=>{setSelected(Object.fromEntries(products.filter(p=>preset.ids.includes(p.id)).map(p=>[p.category,p.id])));setBudget(preset.budget);setMessage(`${preset.name} loaded. Change any component to make it yours.`);}} className="panel p-5 text-left transition hover:border-[#77e5ad] disabled:opacity-40"><b>{preset.name}</b><p className="muted mt-2 text-sm">{preset.description}</p><span className="mt-3 block text-sm font-bold text-[#77e5ad]">{preset.ids.length} components · {peso(products.filter(p=>preset.ids.includes(p.id)).reduce((sum,p)=>sum+p.price,0))}</span></button>)}</section>
  <p role="status" className="mt-4 min-h-6 text-sm text-[#77e5ad]">{message}</p>
  <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_350px]">
   <div>
    <div className="mb-5 flex gap-2 overflow-auto pb-2">{slots.map((s,i)=><button onClick={()=>setActive(s)} key={s} className={`whitespace-nowrap rounded-xl border px-4 py-3 text-sm font-bold ${active===s?"border-[#77e5ad] bg-[#77e5ad]/10":"border-[#303745]"}`}><span className="mr-2 text-[#77e5ad]">{selected[s]?<Check className="inline" size={15}/>:i+1}</span>{s}</button>)}</div>
    {cheaper.length>0&&<div className="panel mb-5 p-4"><b className="text-sm">Spend less on {active.toLowerCase()}</b><div className="mt-3 flex flex-wrap gap-2">{cheaper.map(p=><button disabled={!ready} key={p.id} onClick={()=>setSelected(s=>({...s,[active]:p.id}))} className="rounded-lg border border-[#303745] px-3 py-2 text-left text-sm hover:border-[#77e5ad]">{p.name}<span className="ml-2 text-[#77e5ad]">Save {peso(current!.price-p.price)}</span></button>)}</div></div>}
    <div className="grid gap-4 sm:grid-cols-2">{products.filter(p=>p.category===active).map(p=><button disabled={!ready||!p.stock} aria-pressed={selected[active]===p.id} onClick={()=>setSelected(s=>({...s,[active]:p.id}))} key={p.id} className={`panel overflow-hidden text-left disabled:opacity-50 ${selected[active]===p.id?"border-[#77e5ad] ring-1 ring-[#77e5ad]":""}`}>
     <div className="relative aspect-[2/1] bg-[#151a22]"><Image fill className="object-cover" src={p.image} alt={p.name}/></div>
     <div className="p-4"><span className="eyebrow">{p.brand}</span><div className="mt-1 flex justify-between gap-3"><b>{p.name}</b><b className="shrink-0">{peso(p.price)}</b></div>
      <div className="mt-4 rounded-xl bg-white/[.04] p-3"><span className="text-xs font-bold text-[#77e5ad]">BEST FOR</span><p className="mt-1 text-sm text-gray-200">{p.bestFor}</p></div>
      <ul className="mt-3 space-y-1 text-xs text-gray-400">{p.highlights.map(x=><li key={x}>✓ {x}</li>)}</ul>
      <p className="muted mt-3 border-t border-[#303745] pt-3 text-xs leading-5"><b className="text-gray-300">Buyer tip:</b> {p.buyerTip}</p>
      <span className={`mt-4 block rounded-lg py-2 text-center text-sm font-bold ${selected[active]===p.id?"bg-[#77e5ad] text-black":"border border-[#303745]"}`}>{!p.stock?"Out of stock":selected[active]===p.id?"Selected":"Choose this gear"}</span>
     </div></button>)}</div>
   </div>
   <aside className="panel h-fit p-6 lg:sticky lg:top-28"><h2 className="text-xl font-black">Your KADA Tech setup</h2><p className="muted mt-1 text-sm">{chosen.length} of 5 components · {ready?saving?"Saved on this device":"Saving unavailable":"Loading saved setup…"}</p>
    <div className="mt-5 rounded-xl border border-[#303745] p-4"><label htmlFor="setup-budget" className="text-sm font-bold">Your budget (PHP)</label><input id="setup-budget" className="field mt-2" type="number" min="1" max="1000000" disabled={!ready} value={budget} onChange={e=>{const value=Number(e.target.value);if(Number.isFinite(value))setBudget(Math.min(1000000,Math.max(1,value)));}}/><div role="progressbar" aria-label="Budget used" aria-valuemin={0} aria-valuemax={budget} aria-valuenow={Math.min(total,budget)} aria-valuetext={`${peso(total)} of ${peso(budget)}`} className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full ${remaining<0?"bg-amber-400":"bg-[#77e5ad]"}`} style={{width:`${Math.min(100,total/budget*100)}%`}}/></div><p className={`mt-2 text-sm ${remaining<0?"text-amber-400":"text-[#77e5ad]"}`}>{peso(Math.abs(remaining))} {remaining<0?"over budget":"remaining"}</p><p className="muted mt-1 text-xs">Product prices only. Delivery is calculated at checkout.</p></div>
    <div className="my-6 space-y-3">{slots.map(s=>{const p=products.find(p=>p.id===selected[s]);return <div className="flex items-center gap-3 rounded-xl border border-[#252c38] p-3" key={s}>{p?<><div className="relative h-12 w-12 overflow-hidden rounded-lg"><Image fill className="object-cover" src={p.image} alt=""/></div><div className="min-w-0 flex-1"><span className="muted text-xs">{s}</span><b className="block truncate text-sm">{p.name}</b><span className="muted block truncate text-xs">{p.highlights[0]}</span></div><button aria-label={`Remove ${p.name}`} onClick={()=>setSelected(x=>({...x,[s]:""}))}><X size={16}/></button></>:<><Plus className="text-gray-500"/><button className="text-left" onClick={()=>setActive(s)}><span className="muted block text-xs">{s}</span><b className="text-sm">Choose component</b></button></>}</div>})}</div>
    <div className="flex justify-between border-t border-[#303745] pt-5 text-xl"><b>Total</b><b>{peso(total)}</b></div>
    {!!blocked.length&&<p className="mt-3 text-sm text-amber-400">Available stock exceeded for {blocked.map(p=>p.name).join(", ")}. Change the component or reduce its quantity in your cart.</p>}
    <button disabled={!ready||!cartReady||!chosen.length||!!blocked.length} onClick={()=>{if(blocked.length)return;chosen.forEach(p=>addCart(p.id));setMessage("Your selected setup has been added to the cart.");}} className="btn primary mt-5 w-full disabled:opacity-40">Add entire setup to cart</button>
    <button disabled={!ready||!chosen.length} onClick={share} className="btn secondary mt-3 w-full disabled:opacity-40">Share setup</button>
    {shareLink&&<label className="mt-3 block text-xs">Setup link<input className="field mt-1 text-xs" readOnly value={shareLink} onFocus={e=>e.target.select()}/></label>}
    <button disabled={!ready||!chosen.length} onClick={()=>{setSelected({});setMessage("Setup cleared. Choose a preset or start fresh.");}} className="muted mt-4 w-full text-sm disabled:opacity-40">Clear setup</button>
   </aside>
  </div>
 </div>
}
