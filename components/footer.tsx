import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Globe, MessageCircle, Share2 } from "lucide-react";

const groups = [
  ["Shop", "All Products", "New Arrivals", "Deals"],
  ["Support", "Shipping", "Returns", "Track Order"],
  ["Company", "About Us", "Contact", "Privacy"],
];

export function Footer() {
  return <footer className="border-t border-[#202633] bg-[#090c11] pt-16">
    <div className="container grid gap-10 pb-12 md:grid-cols-4">
      <div>
        <div className="mb-2 flex items-center gap-2 text-lg font-black"><Gamepad2 className="text-[#77e5ad]" />KRS<span className="text-[#77e5ad]">Tech</span></div>
        <p className="mb-4 text-xs font-bold tracking-[.12em] text-[#77e5ad]">UPGRADE YOUR EXPERIENCE.</p>
        <p className="muted text-sm leading-6">Premium gaming gear built for the way you play. Curated in the Philippines.</p>
        <div className="mt-5 flex gap-3"><Globe size={18} /><MessageCircle size={18} /><Share2 size={18} /></div>
      </div>
      {groups.map(group => <div key={group[0]}>
        <h4 className="mb-4 font-bold">{group[0]}</h4>
        {group.slice(1).map(item => <Link key={item} href={item === "Track Order" ? "/orders" : "/shop"} className="muted mb-3 block text-sm hover:text-white">{item}</Link>)}
      </div>)}
    </div>
    <div className="border-t border-[#202633] py-6">
      <div className="container flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <span className="text-xs text-gray-500">© 2026 KRSTech. All rights reserved.</span>
        <Link href="https://kimreubentabanda.vercel.app" target="_blank" rel="noreferrer" aria-label="Visit Kim Reuben S. Tabanda's portfolio" className="group flex items-center gap-3 rounded-xl p-2 -m-2 hover:bg-white/5">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-[#77e5ad]/60 bg-white">
            <Image src="/images/krst.png" alt="Kim Reuben S. Tabanda" fill sizes="44px" className="object-cover object-top transition-transform group-hover:scale-105" />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-[.14em] text-gray-500">Designed and developed by</span>
            <b className="text-sm text-gray-200 group-hover:text-[#77e5ad]">Kim Reuben S. Tabanda ↗</b>
          </div>
        </Link>
      </div>
    </div>
  </footer>;
}
