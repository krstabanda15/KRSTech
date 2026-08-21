"use client";
import {useState} from "react";
import Image from "next/image";
import {Check,Plus,X} from "lucide-react";
import {products} from "@/data/products";
import {peso} from "@/lib/helpers";
import {useStore} from "@/components/store";

const slots=["Keyboards","Gaming Mice","Headsets","Mousepads","Monitors"];

export default function Builder(){
 const[selected,setSelected]=useState<Record<string,string>>({});
 const[active,setActive]=useState(slots[0]);
 const{addCart}=useStore();
 const chosen=slots.map(s=>products.find(p=>p.id===selected[s])).filter(Boolean) as typeof products;
 const total=chosen.reduce((a,b)=>a+b.price,0);
 return <div className="container py-12">
  <div className="text-center"><p className="eyebrow">Curate your battlestation</p><h1 className="mt-3 text-4xl font-black sm:text-6xl">Build your setup.</h1><p className="muted mx-auto mt-4 max-w-xl">Compare the features that matter, understand who each product suits, and build with confidence.</p></div>
  <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_350px]">
   <div>
    <div className="mb-5 flex gap-2 overflow-auto pb-2">{slots.map((s,i)=><button onClick={()=>setActive(s)} key={s} className={`whitespace-nowrap rounded-xl border px-4 py-3 text-sm font-bold ${active===s?"border-[#77e5ad] bg-[#77e5ad]/10":"border-[#303745]"}`}><span className="mr-2 text-[#77e5ad]">{selected[s]?<Check className="inline" size={15}/>:i+1}</span>{s}</button>)}</div>
    <div className="grid gap-4 sm:grid-cols-2">{products.filter(p=>p.category===active).map(p=><button onClick={()=>setSelected(s=>({...s,[active]:p.id}))} key={p.id} className={`panel overflow-hidden text-left ${selected[active]===p.id?"border-[#77e5ad] ring-1 ring-[#77e5ad]":""}`}>
     <div className="relative aspect-[2/1] bg-[#151a22]"><Image fill className="object-cover" src={p.image} alt={p.name}/></div>
     <div className="p-4"><span className="eyebrow">{p.brand}</span><div className="mt-1 flex justify-between gap-3"><b>{p.name}</b><b className="shrink-0">{peso(p.price)}</b></div>
      <div className="mt-4 rounded-xl bg-white/[.04] p-3"><span className="text-xs font-bold text-[#77e5ad]">BEST FOR</span><p className="mt-1 text-sm text-gray-200">{p.bestFor}</p></div>
      <ul className="mt-3 space-y-1 text-xs text-gray-400">{p.highlights.map(x=><li key={x}>✓ {x}</li>)}</ul>
      <p className="muted mt-3 border-t border-[#303745] pt-3 text-xs leading-5"><b className="text-gray-300">Buyer tip:</b> {p.buyerTip}</p>
      <span className={`mt-4 block rounded-lg py-2 text-center text-sm font-bold ${selected[active]===p.id?"bg-[#77e5ad] text-black":"border border-[#303745]"}`}>{selected[active]===p.id?"Selected":"Choose this gear"}</span>
     </div></button>)}</div>
   </div>
   <aside className="panel h-fit p-6 lg:sticky lg:top-28"><h2 className="text-xl font-black">Your KADA Tech setup</h2><p className="muted mt-1 text-sm">{chosen.length} of 5 components</p>
    <div className="my-6 space-y-3">{slots.map(s=>{const p=products.find(p=>p.id===selected[s]);return <div className="flex items-center gap-3 rounded-xl border border-[#252c38] p-3" key={s}>{p?<><div className="relative h-12 w-12 overflow-hidden rounded-lg"><Image fill className="object-cover" src={p.image} alt=""/></div><div className="min-w-0 flex-1"><span className="muted text-xs">{s}</span><b className="block truncate text-sm">{p.name}</b><span className="muted block truncate text-xs">{p.highlights[0]}</span></div><button aria-label={`Remove ${p.name}`} onClick={()=>setSelected(x=>({...x,[s]:""}))}><X size={16}/></button></>:<><Plus className="text-gray-500"/><button className="text-left" onClick={()=>setActive(s)}><span className="muted block text-xs">{s}</span><b className="text-sm">Choose component</b></button></>}</div>})}</div>
    <div className="flex justify-between border-t border-[#303745] pt-5 text-xl"><b>Total</b><b>{peso(total)}</b></div><button disabled={!chosen.length} onClick={()=>chosen.forEach(p=>addCart(p.id))} className="btn primary mt-5 w-full disabled:opacity-40">Add entire setup to cart</button>
   </aside>
  </div>
 </div>
}
