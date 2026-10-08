"use client";

import { QrCode } from "lucide-react";
import { NFCCustomization } from "@/types";
import { NFCPhysicalPreview } from "./nfc-physical-preview";

export function NFCCartThumbnail({data}:{data:NFCCustomization}) {
  const card=data.productType==="card"||data.productType==="premium-card";
  const light=data.background==="Light";
  const color=/White|Silver/.test(data.color)?"#dde2e5":/Green/.test(data.color)?"#20513c":"#171d25";
  const background=light?"#e9eee9":data.background==="Emerald"?"#173b2c":data.background==="Gradient"?"linear-gradient(135deg,#0c1016,#286245)":color;
  return <div role="img" aria-label={`${data.productName}, ${data.color}, ${data.style}`} className="flex h-full w-full items-center justify-center overflow-hidden bg-[#111a20] p-1">
    {card?<div className="relative aspect-[1.59] w-full overflow-hidden rounded-md border border-white/20 shadow-lg" style={{background,color:light||/White|Silver/.test(data.color)?"#16232a":"#f1f5f9",fontFamily:data.font==="Classic"?"Georgia,serif":"Arial,sans-serif",textAlign:data.alignment}}>
      {data.imageDataUrl&&<img src={data.imageDataUrl} alt="" className="absolute" style={{width:data.imageFit==="cover"?"100%":"65%",height:data.imageFit==="cover"?"100%":"65%",objectFit:data.imageFit||"contain",left:`${data.imageX}%`,top:`${data.imageY}%`,transform:`translate(-50%,-50%) scale(${data.imageScale/100})`}}/>}
      <div className="relative flex h-full flex-col justify-end p-2"><span className="text-[4px] opacity-70">KADA NFC · {data.side.toUpperCase()}</span><b className="truncate text-[6px]">{data.name||"YOUR NAME"}</b><span className="truncate text-[4px]">{data.title||data.company||"Your story, one tap away."}</span></div>
      {data.qrCode&&<QrCode className="absolute right-1 top-1" size={10}/>}
    </div>:<NFCPhysicalPreview data={data} guide={false}/>}
  </div>;
}
