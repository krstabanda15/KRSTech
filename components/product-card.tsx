"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Plus, GitCompareArrows, Check } from "lucide-react";
import { Product } from "@/types";
import { peso } from "@/lib/helpers";
import { useStore } from "./store";

export function ProductCard({ p, list = false }: { p: Product; list?: boolean }) {
  const { toggleWish, wishlist, addCart, toggleCompare, compare } = useStore();
  const compared = compare.includes(p.id);
  return <article className={`group panel overflow-hidden ${list ? "sm:flex" : ""}`}>
    <div className={`relative overflow-hidden bg-[#151a22] ${list ? "sm:w-64" : "aspect-[4/3]"}`}>
      <Image fill sizes="(max-width:768px) 100vw, 300px" className="object-cover transition duration-500 group-hover:scale-105" src={p.image} alt={p.name} />
      {p.oldPrice && <span className="badge absolute left-3 top-3">SAVE {Math.round((1 - p.price / p.oldPrice) * 100)}%</span>}
      <button aria-label="Wishlist" onClick={() => toggleWish(p.id)} className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur ${wishlist.includes(p.id) ? "bg-[#77e5ad] text-black" : "bg-black/60"}`}><Heart size={17} fill={wishlist.includes(p.id) ? "currentColor" : "none"} /></button>
    </div>
    <div className="flex flex-1 flex-col p-5">
      <p className="eyebrow">{p.brand}</p><Link href={`/product/${p.id}`} className="mt-2 text-lg font-bold hover:text-[#77e5ad]">{p.name}</Link>
      <div className="mt-2 flex items-center gap-2 text-sm"><span className="flex items-center gap-1 text-amber-400"><Star size={15} fill="currentColor" />{p.rating.toFixed(1)}</span><span className="muted">({p.reviewCount})</span></div>
      {list && <p className="muted mt-3 text-sm leading-6">{p.description}</p>}
      <div className="mt-auto flex items-end justify-between pt-5"><div><b className="text-xl">{peso(p.price)}</b>{p.oldPrice && <del className="muted ml-2 text-sm">{peso(p.oldPrice)}</del>}</div><div className="flex gap-2"><button aria-label={compared ? "Remove from comparison" : "Add to comparison"} title={compared ? "Added to compare" : "Compare"} onClick={() => toggleCompare(p.id)} className={`relative rounded-lg border p-2 ${compared ? "border-[#77e5ad] bg-[#77e5ad] text-black" : "border-[#303745] hover:border-[#77e5ad]"}`}>{compared ? <Check size={17} /> : <GitCompareArrows size={17} />}</button><button title="Quick add" onClick={() => addCart(p.id)} className="rounded-lg bg-[#77e5ad] p-2 text-black hover:bg-white"><Plus size={17} /></button></div></div>
    </div>
  </article>;
}
