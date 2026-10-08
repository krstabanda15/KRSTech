"use client";
import { useId, useState } from "react";

export const validMobile = (value: string) => /^09\d{9}$/.test(value);
export const mobileError = "Enter exactly 11 digits starting with 09 (e.g. 09171234567).";

export function MobileNumberField({label="Mobile number",value,onChange,required=false,disabled=false,error}:{label?:string;value:string;onChange:(value:string)=>void;required?:boolean;disabled?:boolean;error?:string}) {
  const id=useId();
  const [touched,setTouched]=useState(false);
  const invalid=!!value&&!validMobile(value);
  const message=error||((touched&&invalid)||(touched&&required&&!value)?mobileError:"");
  return <label htmlFor={id} className="text-sm"><b className="mb-2 block">{label}{required&&<span className="ml-1 text-red-400">*</span>}</b><input id={id} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={11} pattern="09[0-9]{9}" title={mobileError} required={required} disabled={disabled} value={value} placeholder="09171234567" onBlur={()=>setTouched(true)} onChange={e=>{onChange(e.target.value.replace(/[^0-9]/g,"").slice(0,11));setTouched(true);}} aria-invalid={!!message} aria-describedby={`${id}-help`} className={`field ${message?"!border-red-400":""}`}/><span id={`${id}-help`} role={message?"alert":undefined} className={`mt-2 block text-xs ${message?"text-red-400":"text-gray-500"}`}>{message||"11 digits, starting with 09."}</span></label>;
}
