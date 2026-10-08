"use client";

import { useId } from "react";
import { NFCCustomization } from "@/types";
import { NFCSymbol } from "./nfc-symbol";

export function NFCPhysicalPreview({data,guide}:{data:NFCCustomization;guide:boolean}) {
  const id=useId().replace(/:/g,"");
  const bracelet=data.productType==="bracelet"||data.productType==="couple";
  const pair=data.productType==="couple";
  const stand=data.productType==="stand";
  const bone=data.productType==="pet"&&data.style==="Bone";
  const round=data.style==="Round";
  const light=/White|Silver/.test(data.color);
  const color=pair?"#252c35":/Green|Forest/.test(data.color)?"#20513c":/Rose/.test(data.color)?"#cc999e":/Walnut/.test(data.color)?"#795238":light?"#dde2e5":"#252c35";
  const ink=light?"#16232a":"#f1f5f9";
  const path=bone?"M85 87 C55 47 17 83 43 119 C17 155 55 191 85 151 L215 151 C245 191 283 155 257 119 C283 83 245 47 215 87 Z":round?"M150 49 A80 80 0 1 1 149.99 49 Z":data.style==="Shield"?"M80 65 Q150 23 220 65 L220 133 Q213 183 150 211 Q87 183 80 133 Z":stand?(data.style==="Landscape"?"M47 65 L247 65 L258 174 L58 174 Z":"M89 27 L212 27 L224 184 L101 184 Z"):"M97 54 H203 Q221 54 221 72 V174 Q221 192 203 192 H97 Q79 192 79 174 V72 Q79 54 97 54 Z";
  const content=(small=false)=><div className="flex h-full flex-col items-center justify-center px-4 text-center" style={{color:ink}}>{data.symbol!=="None"&&<NFCSymbol name={data.symbol} size={small?16:24}/>}<strong className={`mt-1 max-w-full break-words leading-tight ${small?"text-[10px]":"text-xs"}`}>{bracelet?data.initials||"YOUR INITIALS":data.name||"Tap to connect"}</strong>{!small&&<span className="mt-1 max-w-full break-words text-[9px]">{data.text||"KADA NFC"}</span>}</div>;
  const band=(offset:number,rose=false)=><g transform={`translate(${offset} ${offset?30:0})`}>
    <ellipse cx="140" cy="111" rx="104" ry="66" fill={rose?"#cc999e":color} stroke="#ffffff40" strokeWidth="2"/>
    <ellipse cx="140" cy="96" rx="78" ry="43" fill="#141e24" stroke="#00000080" strokeWidth="5"/>
    <path d="M36 112 Q140 212 244 112" fill="none" stroke="#ffffff12" strokeWidth="3"/>
    {data.style==="Woven"&&Array.from({length:12},(_,i)=><path key={i} d={`M${45+i*16} 138l8 22`} stroke="#ffffff30" strokeWidth="2"/>)}
    <rect x="90" y="139" width="100" height="36" rx="10" fill={rose?"#bd858c":color} stroke="#ffffff40"/>
    <foreignObject x="90" y="139" width="100" height="36">{content(true)}</foreignObject>
    {data.imageDataUrl&&<image href={data.imageDataUrl} x="124" y="142" width="32" height="30" preserveAspectRatio="xMidYMid meet"/>}
    {guide&&<rect x="96" y="144" width="88" height="26" rx="6" fill="none" stroke="#77e5ad" strokeDasharray="3 3"/>}
  </g>;
  return <svg viewBox={pair?"0 0 350 250":"0 0 300 240"} role="img" aria-label={`${data.color} ${data.style} ${data.productName} preview`} className="relative w-full max-w-[350px] drop-shadow-[0_16px_12px_rgba(0,0,0,.6)]">
    <defs><clipPath id={`shape-${id}`}><path d={path}/></clipPath><linearGradient id={`shine-${id}`} x2="1" y2="1"><stop stopColor="white" stopOpacity=".18"/><stop offset=".5" stopColor="white" stopOpacity="0"/><stop offset="1" stopColor="black" stopOpacity=".25"/></linearGradient></defs>
    {bracelet?<>{band(0)}{pair&&band(65,data.color==="Black + Rose")}</>:<>
      {!stand&&<><circle cx="150" cy={bone?58:round?35:37} r="16" fill="none" stroke="#adb7bc" strokeWidth="5"/><circle cx="150" cy={bone?58:round?35:37} r="12" fill="none" stroke="#ffffff65"/></>}
      {stand&&<path d={data.style==="Landscape"?"M58 174 L30 199 H263 L258 174":"M101 184 L65 212 H235 L224 184"} fill={color} stroke="#ffffff40" strokeWidth="2"/>}
      <path d={path} fill={color} stroke="#ffffff45" strokeWidth="2"/>
      <g clipPath={`url(#shape-${id})`}>
        {data.imageDataUrl&&<image href={data.imageDataUrl} x={150+(data.imageX-50)*2-(data.imageFit==="cover"?150:90)*data.imageScale/100} y={120+(data.imageY-50)*1.6-(data.imageFit==="cover"?120:65)*data.imageScale/100} width={(data.imageFit==="cover"?300:180)*data.imageScale/100} height={(data.imageFit==="cover"?240:130)*data.imageScale/100} preserveAspectRatio={data.imageFit==="cover"?"xMidYMid slice":"xMidYMid meet"}/>}
        <path d={path} fill={`url(#shine-${id})`}/>
        <foreignObject x={bone?80:stand?100:90} y={bone?88:stand?65:85} width={bone?140:stand?110:120} height={bone?62:stand?95:85}>{content()}</foreignObject>
        {guide&&<rect x={bone?85:100} y={bone?93:80} width={bone?130:100} height={bone?52:90} rx="8" fill="none" stroke="#77e5ad" strokeDasharray="4 4"/>}
      </g>
      {!stand&&<circle cx="150" cy={bone?81:round?64:65} r="4" fill="#142026" stroke="#ffffff40"/>}
    </>}
  </svg>;
}
