import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Globe, MessageCircle } from "lucide-react";
import { ShareSite } from "./share-site";

const groups = [
  ["Shop", ["All Products", "/shop"], ["New Arrivals", "/#new"], ["Deals", "/#deals"]],
  ["Support", ["Contact Support", "/contact"], ["Returns", "/contact?topic=return"], ["Track Order", "/orders"]],
  ["Company", ["About Us", "/about"], ["Contact", "/contact"], ["Privacy", "/privacy"]],
];

export function Footer() {
  return <footer className="border-t border-[#202633] bg-[#090c11] pt-10 sm:pt-14">
    <div className="container grid grid-cols-2 gap-x-6 gap-y-10 pb-10 min-[430px]:grid-cols-3 sm:gap-x-10 sm:pb-12 lg:grid-cols-[minmax(300px,1.6fr)_repeat(3,minmax(130px,1fr))] lg:gap-x-16">
      <div className="col-span-2 min-[430px]:col-span-3 lg:col-span-1">
        <div className="mb-2 flex items-center gap-2 text-lg font-black"><Gamepad2 className="text-[#77e5ad]" />KADA <span className="text-[#77e5ad]">Tech</span></div>
        <p className="mb-4 text-xs font-bold tracking-[.12em] text-[#77e5ad]">TECH FOR EVERY SETUP.</p>
        <p className="muted text-sm leading-6">Premium gaming gear built for the way you play. Curated in the Philippines.</p>
        <div className="mt-5 flex items-center gap-1"><Link href="/about" aria-label="About KADA Tech" title="About KADA Tech" className="rounded-lg p-2 hover:bg-white/10 hover:text-[#77e5ad]"><Globe size={18} /></Link><Link href="mailto:support@kadatech.ph" aria-label="Email KADA Tech support" title="Email support" className="rounded-lg p-2 hover:bg-white/10 hover:text-[#77e5ad]"><MessageCircle size={18} /></Link><ShareSite /></div>
      </div>
      {groups.map((group, index) => <div className={`min-w-0 ${index === groups.length - 1 ? "col-span-2 justify-self-center min-[430px]:col-span-1 min-[430px]:justify-self-auto" : ""}`} key={group[0] as string}>
        <h4 className="mb-4 font-bold">{group[0]}</h4>
        {group.slice(1).map(item => { const [label, href] = item as string[]; return <Link key={label} href={href} className="muted mb-3 block text-sm hover:text-white">{label}</Link>})}
      </div>)}
    </div>
    <div className="border-t border-[#202633] py-6">
      <div className="container flex flex-col items-start justify-between gap-6 min-[520px]:flex-row min-[520px]:items-center min-[520px]:gap-4">
        <span className="text-xs text-gray-500">© 2026 KADA Tech. All rights reserved.</span>
        <Link href="https://kimreubentabanda.vercel.app" target="_blank" rel="noreferrer" aria-label="Visit Kim Reuben S. Tabanda's portfolio" className="group flex max-w-full items-center gap-3 rounded-xl p-2 -m-2 hover:bg-white/5">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-[#77e5ad]/60 bg-white">
            <Image src="/images/krst.png" alt="Kim Reuben S. Tabanda" fill sizes="44px" className="object-cover object-top transition-transform group-hover:scale-105" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] uppercase tracking-[.14em] text-gray-500">Designed and developed by</span>
            <b className="text-sm text-gray-200 group-hover:text-[#77e5ad]">Kim Reuben S. Tabanda ↗</b>
          </div>
        </Link>
      </div>
    </div>
  </footer>;
}
