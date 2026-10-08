"use client";

import { Ban, Heart, PawPrint, Sparkles, Star, UserRound, Zap } from "lucide-react";

const symbols = { None: Ban, Lightning: Zap, Heart, Star, Spark: Sparkles, Contact: UserRound, Pet: PawPrint };

export function NFCSymbol({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = symbols[name as keyof typeof symbols];
  return Icon ? <Icon size={size} aria-hidden="true" /> : null;
}

export function SymbolPicker({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <fieldset className="min-w-0 sm:col-span-2"><legend className="mb-3 text-sm font-bold">{label}</legend><div className="flex flex-wrap gap-2">{options.map(name => <label key={name} className={`relative flex min-w-[76px] cursor-pointer flex-col items-center gap-2 rounded-xl border px-4 py-3 text-xs transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#77e5ad] ${value === name ? "border-[#77e5ad] bg-[#77e5ad]/10 text-[#77e5ad]" : "border-[#303745] text-gray-400 hover:border-gray-500 hover:text-white"}`}><input className="sr-only" type="radio" name={`nfc-${label.toLowerCase()}`} value={name} checked={value === name} onChange={() => onChange(name)} /><NFCSymbol name={name} size={22} /><span>{name}</span></label>)}</div></fieldset>;
}
