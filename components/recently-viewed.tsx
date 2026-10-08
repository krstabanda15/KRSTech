"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Trash2 } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "./product-card";

const key = "kada-tech-recently-viewed";
const eventName = "kada-recently-viewed-changed";
export function readHistory(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string" && products.some(p => p.id === id)))].slice(0, 12) : [];
  } catch { return []; }
}

export function RecentlyViewed({ currentId, account = false }: { currentId?: string; account?: boolean }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const sync = () => setIds(readHistory());
    if (currentId && products.some(p => p.id === currentId)) {
      const next = [currentId, ...readHistory().filter(id => id !== currentId)].slice(0, 12);
      try { localStorage.setItem(key, JSON.stringify(next)); window.dispatchEvent(new Event(eventName)); }
      catch { /* Browsing remains available when device storage is disabled. */ }
    }
    sync(); setReady(true);
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(eventName, sync); window.removeEventListener("storage", sync); };
  }, [currentId]);
  const items = ids.filter(id => id !== currentId).map(id => products.find(p => p.id === id)!);
  if (!account && !items.length) return null;
  return <section className={account ? "mt-6" : "mt-14"} aria-label="Recently viewed products">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div>{!account && <h2 className="flex items-center gap-3 text-2xl font-black"><Clock size={22} className="text-[#77e5ad]" />Recently viewed</h2>}<p className="muted mt-2 text-sm">Your last 12 products, saved on this device.</p></div>{ids.length > 0 && <button onClick={() => {
      try { localStorage.removeItem(key); setIds([]); window.dispatchEvent(new Event(eventName)); setMessage("Browsing history cleared."); }
      catch { setMessage("History couldn't be cleared. Check your browser storage settings."); }
    }} className="btn secondary text-sm"><Trash2 size={15} />Clear history</button>}</div>
    <p role="status" className="text-sm text-[#77e5ad]">{message}</p>
    {!ready ? <p className="muted py-8">Loading your history…</p> : items.length ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(p => <ProductCard key={p.id} p={p} />)}</div> : <div className="rounded-xl border border-[#303745] px-5 py-10 text-center"><Clock className="mx-auto text-[#77e5ad]" /><p className="mt-3 font-bold">Find your next upgrade</p><p className="muted mt-2 text-sm">Products you visit will appear here.</p><Link className="btn primary mt-5" href="/shop">Browse products</Link></div>}
  </section>;
}
