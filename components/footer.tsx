import Link from "next/link";
import { ArrowUpRight, Gamepad2, Globe, MessageCircle, Users } from "lucide-react";
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
    <div className="border-t border-[#202633] bg-[#0c1017] py-6 sm:py-7">
      <div className="container flex flex-col items-start justify-between gap-5 md:flex-row md:items-center md:gap-8">
        <span className="text-xs text-gray-500">© 2026 KADA Tech. All rights reserved.</span>
        <Link href="/about" aria-label="Meet the KADA Tech team: Kim, Angelou, Domee, Alvin, and Cherry" className="group flex max-w-full items-center gap-3 rounded-xl px-3 py-2 transition duration-200 hover:bg-[#77e5ad]/[.05] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#77e5ad] md:shrink-0">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#77e5ad]/20 bg-[#77e5ad]/10 text-[#77e5ad]">
            <Users size={21} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="block text-[9px] font-medium uppercase leading-4 tracking-[.16em] text-gray-400 sm:text-[10px]">Designed and developed by</span>
            <div className="mt-1 flex items-center justify-between gap-4"><b className="text-sm font-bold text-gray-100 transition-colors group-hover:text-[#77e5ad]">KADA Tech Team</b><ArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-[#77e5ad]/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
            <ul aria-label="Team members" className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-xs leading-5 text-gray-400">{["Kim", "Angelou", "Domee", "Alvin", "Cherry"].map((name,index)=><li key={name} className="flex items-center gap-2">{index>0&&<span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-[#77e5ad]/60" />}{name}</li>)}</ul>
          </div>
        </Link>
      </div>
    </div>
  </footer>;
}
