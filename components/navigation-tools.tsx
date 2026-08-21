"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, Home, Search, ShoppingBag, Store, User, X } from "lucide-react";
import { products } from "@/data/products";
import { peso } from "@/lib/helpers";
import { useStore } from "./store";

export function NavigationTools() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { cart, wishlist } = useStore();
  useEffect(() => { try { setRecent(JSON.parse(localStorage.getItem("kada-searches") || "[]")); } catch {} }, [open]);
  useEffect(() => { if (open) window.setTimeout(() => inputRef.current?.focus(), 20); }, [open]);
  useEffect(() => { const handler = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key === "k") { event.preventDefault(); setOpen(true); } if (event.key === "Escape") setOpen(false); }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, []);
  useEffect(() => { const openSearch = () => setOpen(true); window.addEventListener("kada-open-search", openSearch); return () => window.removeEventListener("kada-open-search", openSearch); }, []);
  const matches = useMemo(() => query.trim() ? products.filter(product => (product.name + product.brand + product.category).toLowerCase().includes(query.toLowerCase())).slice(0, 6) : [], [query]);
  const choose = (term: string) => { const next = [term, ...recent.filter(item => item !== term)].slice(0, 5); localStorage.setItem("kada-searches", JSON.stringify(next)); setRecent(next); setOpen(false); };
  return <>
    <button onClick={() => setOpen(true)} aria-label="Search products" className="fixed bottom-20 right-4 z-30 hidden rounded-full bg-[#77e5ad] p-3 text-black shadow-xl sm:block lg:hidden"><Search size={20} /></button>
    {open && <div className="fixed inset-0 z-[80] bg-black/70 p-3 pt-[8vh]" role="dialog" aria-modal="true" aria-label="Search products"><button aria-label="Close search" onClick={() => setOpen(false)} className="absolute inset-0 h-full w-full cursor-default" /><section className="panel relative mx-auto max-w-2xl overflow-hidden shadow-2xl"><div className="flex items-center gap-3 border-b border-[#303745] p-4"><Search className="text-[#77e5ad]" /><input ref={inputRef} value={query} onChange={event => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent py-2 outline-none" placeholder="Search products, brands, or categories..." aria-label="Search query" /><kbd className="muted hidden rounded border border-[#303745] px-2 py-1 text-xs sm:block">Esc</kbd><button aria-label="Close search" onClick={() => setOpen(false)}><X /></button></div><div className="max-h-[65vh] overflow-y-auto p-3">{query && !matches.length && <p className="muted p-6 text-center">No matching products.</p>}{matches.map(product => <Link onClick={() => choose(query)} href={`/product/${product.id}`} key={product.id} className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/5"><div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg"><Image fill className="object-cover" src={product.image} alt="" /></div><div className="min-w-0 flex-1"><b className="block truncate">{product.name}</b><p className="muted text-xs">{product.brand} · {product.category}</p></div><b className="text-[#77e5ad]">{peso(product.price)}</b></Link>)}{!query && <div className="p-3"><b className="text-sm">Recent searches</b>{recent.length ? <div className="mt-3 flex flex-wrap gap-2">{recent.map(term => <button key={term} onClick={() => setQuery(term)} className="rounded-full border border-[#303745] px-3 py-2 text-sm">{term}</button>)}</div> : <p className="muted mt-2 text-sm">Your recent searches will appear here.</p>}</div>}</div></section></div>}
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#303745] bg-[#080b10]/95 px-2 pb-[max(6px,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden" aria-label="Mobile navigation"><MobileLink href="/" label="Home" icon={Home} /><MobileLink href="/shop" label="Shop" icon={Store} /><button onClick={() => setOpen(true)} className="grid min-h-12 place-items-center text-[10px] text-gray-400"><Search size={20} /><span>Search</span></button><MobileLink href="/wishlist" label="Wishlist" icon={Heart} count={wishlist.length} /><MobileLink href="/cart" label="Cart" icon={ShoppingBag} count={cart.reduce((sum, item) => sum + item.qty, 0)} /></nav>
  </>;
}

function MobileLink({ href, label, icon: Icon, count }: { href: string; label: string; icon: typeof User; count?: number }) {
  return <Link href={href} className="relative grid min-h-12 place-items-center text-[10px] text-gray-400"><Icon size={20} /><span>{label}</span>{!!count && <b className="absolute right-[22%] top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#77e5ad] px-1 text-[9px] text-black">{count}</b>}</Link>;
}
