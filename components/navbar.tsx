"use client";
import Link from "next/link";
import { Menu, Search, Heart, ShoppingBag, User, Gamepad2, X, GitCompareArrows } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "./store";

const links = [["Home", "/"], ["Shop", "/shop"], ["Categories", "/#categories"], ["New Arrivals", "/#new"], ["Deals", "/#deals"], ["Support", "/contact"]];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { cart, wishlist, compare } = useStore();
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [open]);
  return <>
    <div className="bg-[#77e5ad] px-3 py-2 text-center text-xs font-bold text-black">STUDENT DEALS • SETUP BUNDLES • FREE PHILIPPINES STANDARD SHIPPING (3–5 DAYS) • SAME-DAY SHIPPING WITHIN BACOLOD CITY</div>
    <header className="sticky top-0 z-40 border-b border-[#202633] bg-[#080b10]/90 backdrop-blur-xl">
      <div className="container flex h-[68px] items-center justify-between gap-2 sm:h-[76px]">
        <Link href="/" className="flex items-center gap-3 tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#77e5ad] text-black"><Gamepad2 size={20} /></span><span><b className="block text-xl leading-none">KRS<span className="text-[#77e5ad]">Tech</span></b><small className="muted mt-1 block text-[9px] font-medium tracking-[.12em]">UPGRADE YOUR EXPERIENCE.</small></span></Link>
        <nav className="hidden gap-7 lg:flex">{links.map(x => <Link className="text-sm text-gray-300 hover:text-white" key={x[0]} href={x[1]}>{x[0]}</Link>)}</nav>
        <div className="flex items-center gap-1">
          <Link aria-label="Search products" className="hidden rounded-lg p-2 hover:bg-white/10 sm:block" href="/shop"><Search size={20} /></Link>
          <span className="hidden sm:block"><NavIcon href="/compare" label="Compare products" count={compare.length}><GitCompareArrows size={20} /></NavIcon></span>
          <NavIcon href="/wishlist" label="Wishlist" count={wishlist.length}><Heart size={20} /></NavIcon>
          <NavIcon href="/cart" label="Shopping cart" count={cart.reduce((a, b) => a + b.qty, 0)}><ShoppingBag size={20} /></NavIcon>
          <Link aria-label="Profile" className="hidden rounded-lg p-2 hover:bg-white/10 sm:block" href="/account"><User size={20} /></Link>
          <button aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="rounded-lg p-2 lg:hidden">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <div className="absolute inset-x-0 top-full h-[calc(100dvh-68px)] overflow-y-auto border-t border-white/10 bg-[#080b10] shadow-2xl lg:hidden"><nav id="mobile-navigation" aria-label="Mobile navigation" className="container grid gap-1 py-4"><Link onClick={() => setOpen(false)} className="mb-2 flex items-center gap-3 rounded-xl border border-[#303745] px-4 py-3" href="/shop"><Search size={18} className="text-[#77e5ad]"/>Search products</Link>{links.map(x => <Link onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 hover:bg-white/5" key={x[0]} href={x[1]}>{x[0]}</Link>)}<div className="my-2 border-t border-white/10"/><Link onClick={() => setOpen(false)} href="/compare" className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-white/5"><span>Compare</span>{compare.length > 0 && <span className="badge">{compare.length}</span>}</Link><Link onClick={() => setOpen(false)} href="/wishlist" className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-white/5"><span>Wishlist</span>{wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}</Link><Link onClick={() => setOpen(false)} href="/cart" className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-white/5"><span>Shopping cart</span>{cart.length > 0 && <span className="badge">{cart.reduce((sum,item)=>sum+item.qty,0)}</span>}</Link><Link onClick={() => setOpen(false)} href="/account" className="rounded-lg px-4 py-3 hover:bg-white/5">Profile</Link></nav></div>}
    </header>
  </>;
}

function NavIcon({ href, label, count, children }: { href: string; label: string; count: number; children: React.ReactNode }) {
  return <Link aria-label={label} title={label} className={`relative rounded-lg p-2 hover:bg-white/10 ${count > 0 ? "text-[#77e5ad]" : ""}`} href={href}>{children}{count > 0 && <b className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#77e5ad] px-1 text-[9px] text-black">{count}</b>}</Link>;
}
