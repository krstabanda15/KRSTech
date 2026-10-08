"use client";

import { useRef, useState } from "react";
import { ImagePlus, Nfc, QrCode, RotateCcw } from "lucide-react";
import { NFCCustomization } from "@/types";
import { NFCSymbol } from "./nfc-symbol";
import { NFCPhysicalPreview } from "./nfc-physical-preview";

export type ArtworkOptions = { imageFit?: "contain" | "cover"; imageWidth?: number; imageHeight?: number };
type Design = NFCCustomization & ArtworkOptions;

export function ArtworkUploader({data,update}:{data:Design;update:(value:Partial<Design>)=>void}) {
  const [error,setError]=useState("");
  const request=useRef(0);
  const reset={imageScale:100,imageX:50,imageY:50};
  return <div className="rounded-2xl border border-dashed border-[#405044] bg-[#0c1016] p-5">
    <b className="flex items-center gap-2"><ImagePlus size={18} className="text-[#77e5ad]"/>Photo, logo, or artwork</b>
    <p className="muted mt-2 text-xs leading-5">PNG with transparency works well for logos. JPG, PNG, or WebP, up to 4 MB.</p>
    <label className="mt-4 block cursor-pointer rounded-xl border border-[#303745] p-4 focus-within:ring-2 focus-within:ring-[#77e5ad]">
      {data.imageDataUrl&&<img src={data.imageDataUrl} alt="Your uploaded artwork" className="mb-3 h-24 w-full rounded-lg bg-white/5 object-contain"/>}
      <span className="block text-sm font-bold text-[#77e5ad]">{data.imageDataUrl?"Replace artwork":"Choose artwork"}</span>
      <input className="mt-3 block w-full text-xs text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-[#173225] file:px-3 file:py-2 file:text-[#77e5ad]" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{
        const file=e.target.files?.[0];e.target.value="";if(!file)return;
        const token=++request.current;setError("");
        if(!["image/jpeg","image/png","image/webp"].includes(file.type)){setError("Choose a JPG, PNG, or WebP image.");return;}
        if(file.size>4*1024*1024){setError("Choose an image smaller than 4 MB.");return;}
        const reader=new FileReader();reader.onerror=()=>setError("This file could not be read. Try another image.");
        reader.onload=()=>{const source=String(reader.result);const image=new window.Image();image.onerror=()=>{if(token===request.current)setError("This image could not be opened. Try another file.");};image.onload=()=>{if(token===request.current)update({imageDataUrl:source,imageName:file.name,imageWidth:image.naturalWidth,imageHeight:image.naturalHeight,imageFit:"contain",...reset});};image.src=source;};reader.readAsDataURL(file);
      }}/>
    </label>
    {error&&<p role="alert" className="mt-3 text-sm text-amber-300">{error}</p>}
    {data.imageDataUrl&&<div className="mt-4 space-y-4">
      <p className="break-all text-xs text-gray-300">{data.imageName}</p>
      <p role="status" className={`text-xs leading-5 ${Math.min(data.imageWidth||0,data.imageHeight||0)<600?"text-amber-300":"text-[#77e5ad]"}`}>{data.imageWidth} × {data.imageHeight} px. {Math.min(data.imageWidth||0,data.imageHeight||0)<600?"Small image: may look soft when printed. Upload a larger original if possible.":"Good starting resolution. Final sharpness depends on print size and zoom."}</p>
      <div className="grid grid-cols-2 gap-2">{([ ["contain","Fit logo"],["cover","Fill surface"] ] as const).map(([fit,label])=><button key={fit} aria-pressed={(data.imageFit||"contain")===fit} onClick={()=>update({imageFit:fit,...reset})} className={`rounded-xl border px-3 py-3 text-sm font-bold ${(data.imageFit||"contain")===fit?"border-[#77e5ad] bg-[#77e5ad]/10 text-[#77e5ad]":"border-[#303745]"}`}>{label}</button>)}</div>
      <p className="muted text-xs">Fit keeps the whole image visible. Fill crops the edges to cover the product.</p>
      <div className="grid gap-4 sm:grid-cols-3">{([ ["imageScale","Zoom",50,200],["imageX","Horizontal",0,100],["imageY","Vertical",0,100] ] as const).map(([field,label,min,max])=><label key={field} className="text-xs"><span className="mb-2 flex justify-between">{label}<span className="muted">{data[field]}%</span></span><input type="range" min={min} max={max} value={data[field]} onChange={e=>update({[field]:Number(e.target.value)})} className="w-full accent-[#77e5ad]"/></label>)}</div>
      <div className="flex flex-wrap gap-3"><button className="btn secondary text-xs" onClick={()=>update(reset)}><RotateCcw size={14}/>Reset position</button><button className="btn secondary text-xs" onClick={()=>{request.current++;update({imageDataUrl:undefined,imageName:undefined,imageWidth:undefined,imageHeight:undefined});}}>Remove artwork</button></div>
      <p className="muted text-xs">Artwork stays with this customization. Re-upload it if you refresh the page.</p>
    </div>}
  </div>;
}

export function ArtworkPreview({data}:{data:Design}) {
  const [guide,setGuide]=useState(false);
  const card=["card","premium-card"].includes(data.productType);
  const bracelet=["bracelet","couple"].includes(data.productType);
  const light=/White|Silver/.test(data.color);
  const color=/Green|Forest/.test(data.color)?"#20513c":/Rose/.test(data.color)?"#cc999e":/Walnut/.test(data.color)?"#795238":light?"#dde2e5":"#171d25";
  const ink=light?"#16232a":"#f1f5f9";
  const bg=card?data.background==="Light"?"#e9eee9":data.background==="Emerald"?"#173b2c":data.background==="Gradient"?"linear-gradient(135deg,#0c1016,#286245)":color:color;
  const shape=card?"aspect-[1.59] w-full max-w-[350px] rounded-xl":bracelet?"h-24 w-full max-w-[330px] rounded-[40px]":data.productType==="stand"?(data.style==="Landscape"?"h-40 w-64 rounded-xl":"h-60 w-44 rounded-xl"):data.style==="Round"?"h-48 w-48 rounded-full":data.style==="Shield"?"h-52 w-44 rounded-t-[40%] rounded-b-[48%]":"h-44 w-48 rounded-[36px]";
  const textColor=card?(data.background==="Light"?"#16232a":ink):ink;
  return <div className="panel overflow-hidden"><div className="flex items-center justify-between gap-3 border-b border-[#303745] p-5"><div><p className="eyebrow">Studio preview</p><b className="mt-1 block text-sm">{data.productName}</b></div><Nfc size={20} className="shrink-0 text-[#77e5ad]"/></div>
    <div className="relative grid min-h-[350px] place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,#293b39_0%,#111820_55%,#0a0e14_100%)] px-5 py-12">
      <div aria-hidden="true" className="absolute bottom-12 h-7 w-3/4 rounded-[100%] bg-black/60 blur-xl"/>
      {!card?<NFCPhysicalPreview data={data} guide={guide}/>:<div className={`relative isolate overflow-hidden border border-white/25 ${shape}`} style={{background:bg,color:textColor,boxShadow:`0 22px 35px -14px #000, inset 0 1px 1px #ffffff55, inset 0 -3px 2px #0006`,transform:"perspective(900px) rotateX(6deg) rotateY(-5deg)",fontFamily:data.font==="Classic"?"Georgia,serif":"Arial,sans-serif",fontWeight:data.font==="Bold"?800:400}}>
        {data.imageDataUrl&&<img src={data.imageDataUrl} alt="Your artwork on the product" className="absolute" style={{width:data.imageFit==="cover"?"100%":"65%",height:data.imageFit==="cover"?"100%":"65%",objectFit:data.imageFit||"contain",left:`${data.imageX}%`,top:`${data.imageY}%`,transform:`translate(-50%,-50%) scale(${data.imageScale/100})`}}/>}
        <div className={`relative z-10 flex h-full flex-col p-5 ${card?"justify-end":"items-center justify-center text-center"}`} style={{textAlign:card?data.alignment:"center",textShadow:data.imageDataUrl?"0 1px 6px #0009":undefined}}>
          {card?<><span className="text-[9px] tracking-[.2em] opacity-70">KADA NFC · {data.side.toUpperCase()}</span><strong className="mt-2 break-words text-lg leading-tight">{data.name||"YOUR NAME"}</strong><span className="mt-1 break-words text-xs opacity-80">{data.title||"Your title"}</span><span className="mt-1 break-words text-[10px] opacity-70">{data.company||data.text||"Your story, one tap away."}</span></>:<>{data.symbol!=="None"&&<NFCSymbol name={data.symbol} size={bracelet?18:28}/>}<strong className="mt-2 break-words text-sm">{bracelet?data.initials||"YOUR INITIALS":data.name||"Tap to connect"}</strong><span className="mt-1 break-words text-[10px] opacity-80">{data.text|| (bracelet?"Always connected":"KADA NFC")}</span></>}
        </div>
        {card&&data.qrCode&&<QrCode aria-label="QR code placeholder" className="absolute right-4 top-4 z-10" size={32}/>}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20" style={{background:data.style==="Gloss"||data.style==="Metal"?"linear-gradient(120deg,transparent 20%,#ffffff30 42%,transparent 58%)":"linear-gradient(145deg,#ffffff0c,transparent 55%,#00000020)"}}/>
        {guide&&<div aria-hidden="true" className="pointer-events-none absolute inset-[8%] z-30 rounded-[inherit] border border-dashed border-[#77e5ad]"/>}
      </div>}
    </div>
    <div className="space-y-3 border-t border-[#303745] p-5"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-gray-300">{data.color} · {data.style}</span><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={guide} onChange={e=>setGuide(e.target.checked)} className="accent-[#77e5ad]"/>Safe-area guide</label></div><p className="muted text-xs leading-5">Concept preview. Colors and materials may vary. Keep important artwork inside the guide; final print boundaries require confirmation.</p>{data.qrCode&&<p className="muted text-xs">QR shown is a placeholder, not a scannable code.</p>}{data.productType==="couple"&&<p className="text-xs text-[#77e5ad]">Pair includes two bracelets, shown together.</p>}</div>
  </div>;
}
