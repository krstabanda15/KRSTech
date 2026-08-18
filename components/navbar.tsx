"use client";
import Link from "next/link";
import { Menu, Search, Heart, ShoppingBag, User, Gamepad2, X, GitCompareArrows } from "lucide-react";
import { useState } from "react";
import { useStore } from "./store";

const links = [["Home", "/"], ["Shop", "/shop"], ["Categories", "/#categories"], ["New Arrivals", "/#new"], ["Deals", "/#deals"]];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { cart, wishlist, compare } = useStore();
  return <>
    <div className="bg-[#77e5ad] py-2 text-center text-xs font-bold text-black">STUDENT DEALS • SETUP BUNDLES • FREE BACOLOD CITY SHIPPING OVER ₱3,000</div>
    <header className="sticky top-0 z-40 border-b border-[#202633] bg-[#080b10]/90 backdrop-blur-xl">
      <div className="container flex h-[76px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3 tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#77e5ad] text-black"><Gamepad2 size={20} /></span><span><b className="block text-xl leading-none">KRS<span className="text-[#77e5ad]">Tech</span></b><small className="muted mt-1 block text-[9px] font-medium tracking-[.12em]">UPGRADE YOUR EXPERIENCE.</small></span></Link>
        <nav className="hidden gap-7 lg:flex">{links.map(x => <Link className="text-sm text-gray-300 hover:text-white" key={x[0]} href={x[1]}>{x[0]}</Link>)}</nav>
        <div className="flex items-center gap-1">
          <Link aria-label="Search products" className="hidden rounded-lg p-2 hover:bg-white/10 sm:block" href="/shop"><Search size={20} /></Link>
          <NavIcon href="/compare" label="Compare products" count={compare.length}><GitCompareArrows size={20} /></NavIcon>
          <NavIcon href="/wishlist" label="Wishlist" count={wishlist.length}><Heart size={20} /></NavIcon>
          <NavIcon href="/cart" label="Shopping cart" count={cart.reduce((a, b) => a + b.qty, 0)}><ShoppingBag size={20} /></NavIcon>
          <Link aria-label="Profile" className="hidden rounded-lg p-2 hover:bg-white/10 sm:block" href="/account"><User size={20} /></Link>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className="rounded-lg p-2 lg:hidden">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <nav className="container grid gap-1 border-t border-white/10 py-4 lg:hidden">{links.map(x => <Link onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 hover:bg-white/5" key={x[0]} href={x[1]}>{x[0]}</Link>)}<Link href="/compare" className="rounded-lg px-3 py-3 hover:bg-white/5">Compare {compare.length > 0 && `(${compare.length})`}</Link><Link href="/account" className="rounded-lg px-3 py-3 hover:bg-white/5">Profile</Link></nav>}
    </header>
  </>;
}

function NavIcon({ href, label, count, children }: { href: string; label: string; count: number; children: React.ReactNode }) {
  return <Link aria-label={label} title={label} className={`relative rounded-lg p-2 hover:bg-white/10 ${count > 0 ? "text-[#77e5ad]" : ""}`} href={href}>{children}{count > 0 && <b className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#77e5ad] px-1 text-[9px] text-black">{count}</b>}</Link>;
}
