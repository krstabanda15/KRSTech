import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Cpu, Gamepad2, GraduationCap, PackageCheck, Truck, Zap } from "lucide-react";

const audiences = [
  { icon: GraduationCap, title: "Students", copy: "Study-ready essentials at budget-friendly prices." },
  { icon: Gamepad2, title: "Gamers", copy: "Responsive gear built for every rank and playstyle." },
  { icon: BriefcaseBusiness, title: "Young professionals", copy: "Clean, reliable tech for work and after-hours play." },
  { icon: Cpu, title: "PC enthusiasts", copy: "Curated upgrades for a setup worth showing off." },
];

const offers = [
  { icon: GraduationCap, tag: "STUDENT PERK", title: "Save 10% with student ID", copy: "A little less on the receipt, the same premium setup.", action: "Shop student picks", href: "/shop?max=5000" },
  { icon: Zap, tag: "FLASH DEALS", title: "Limited-time gear drops", copy: "Catch standout accessories before the timer runs out.", action: "See current deals", href: "/#deals" },
  { icon: PackageCheck, tag: "SETUP BUNDLES", title: "Better together", copy: "Build a coordinated setup and add every component in one click.", action: "Build your setup", href: "/build-your-setup" },
];

export function AudiencePromos() {
  return <>
    <section className="section border-y border-[#202633] bg-[#0c1016]">
      <div className="container">
        <div className="section-head"><div><p className="eyebrow">Gear that fits your life</p><h2>Made for how you work and play.</h2></div><p className="muted hidden max-w-sm text-right text-sm leading-6 md:block">Affordable, stylish accessories without compromising the experience.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{audiences.map(({ icon: Icon, title, copy }) => <div className="panel p-5" key={title}><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#77e5ad]/10 text-[#77e5ad]"><Icon size={21} /></span><h3 className="mt-4 font-bold">{title}</h3><p className="muted mt-2 text-sm leading-6">{copy}</p></div>)}</div>
      </div>
    </section>
    <section className="section">
      <div className="container">
        <div className="section-head"><div><p className="eyebrow">Spend smarter</p><h2>More setup for your budget.</h2></div><div className="hidden items-center gap-2 text-sm text-[#77e5ad] sm:flex"><Truck size={18} /> Free shipping over ₱3,000</div></div>
        <div className="grid gap-4 lg:grid-cols-3">{offers.map(({ icon: Icon, tag, title, copy, action, href }) => <article className="panel group p-6 hover:-translate-y-1 hover:border-[#405044]" key={title}><div className="flex items-center justify-between"><span className="eyebrow">{tag}</span><Icon className="text-[#77e5ad]" size={22} /></div><h3 className="mt-5 text-2xl font-black">{title}</h3><p className="muted mt-3 min-h-12 text-sm leading-6">{copy}</p><Link href={href} className="mt-6 flex items-center gap-2 text-sm font-bold text-[#77e5ad]">{action}<ArrowRight className="transition-transform group-hover:translate-x-1" size={16} /></Link></article>)}</div>
      </div>
    </section>
  </>;
}
