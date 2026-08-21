import Image from "next/image";
import Link from "next/link";
import { BarChart3, Code2, ExternalLink, Gamepad2, PenTool, ShieldCheck, Sparkles, Tags, Truck } from "lucide-react";

const values = [
  { icon: Sparkles, title: "Carefully selected", detail: "We focus on dependable gear that earns its place in your setup." },
  { icon: ShieldCheck, title: "Shop confidently", detail: "Clear product details, secure checkout, and two-year warranty coverage." },
  { icon: Truck, title: "Made for local players", detail: "Straightforward Philippine pricing and delivery designed around you." },
];

const businessTeam = [
  {
    name: "Angelou T. Makilan",
    role: "E-Commerce Marketing Strategist",
    icon: BarChart3,
    detail: "Defines the target audience, studies competitors, and develops the pricing, promotional, and campaign strategies for the store.",
  },
  {
    name: "Alvin R. Tan",
    role: "Product Merchandising & Catalog Manager",
    icon: Tags,
    detail: "Organizes product categories and prepares product names, descriptions, specifications, and pricing for the online catalog.",
  },
  {
    name: "Domee Gubuan",
    role: "Brand Content & Customer Experience Coordinator",
    icon: PenTool,
    detail: "Develops the brand voice and customer-facing content, plans the shopping journey, and reviews the storefront for usability.",
  },
];

export default function AboutPage() {
  return <div className="container py-12">
    <div className="mx-auto max-w-3xl text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#77e5ad] text-black"><Gamepad2 /></span><p className="eyebrow mt-6">About KADA Tech</p><h1 className="mt-2 text-4xl font-black sm:text-5xl">Better gear. Better setups.</h1><p className="muted mt-5 text-lg leading-8">KADA Tech is a curated gaming-gear store built to make choosing your next upgrade simpler. We bring keyboards, mice, audio, displays, and setup essentials together in one clean shopping experience.</p></div>
    <section className="panel mx-auto mt-12 max-w-4xl overflow-hidden p-6 sm:p-9">
      <div className="grid gap-7 md:grid-cols-[.75fr_1.25fr] md:items-center">
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="mt-2 text-3xl font-black">Built together. Made for every setup.</h2>
        </div>
        <div className="space-y-4">
          <p className="muted leading-7">KADA Tech began as a collaborative project for our E-Commerce subject. Its name brings together the first-name initials of Kim, Angelou, Domee, and Alvin—and "kada," meaning "each" or "every," reflects our goal of creating tech for every setup. The project combines technology, marketing strategy, product merchandising, and customer-focused design.</p>
          <p className="muted leading-7">KADA Tech was built through a collaboration of technology, marketing, and creative ideas. Together, we transformed our E-Commerce concept into a modern and customer-focused shopping experience.</p>
          <p className="font-semibold leading-7 text-gray-200">Different skills, one shared vision: creating a better shopping experience for every setup.</p>
        </div>
      </div>
    </section>
    <div className="mt-12 grid gap-4 md:grid-cols-3">{values.map(({ icon: Icon, title, detail }) => <div className="panel p-6" key={title}><Icon className="text-[#77e5ad]" /><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="muted mt-2 leading-6">{detail}</p></div>)}</div>
    <section className="panel mx-auto mt-12 max-w-4xl overflow-hidden p-6 sm:p-9">
      <div className="grid items-center gap-8 sm:grid-cols-[180px_1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-3xl border border-[#77e5ad]/40 bg-white">
          <Image src="/images/krst.png" alt="Kim Reuben S. Tabanda" fill sizes="180px" className="object-cover object-top" />
        </div>
        <div className="text-center sm:text-left">
          <p className="eyebrow">Technical development</p>
          <h2 className="mt-2 text-3xl font-black">Kim Reuben S. Tabanda</h2>
          <p className="mt-2 flex items-center justify-center gap-2 font-bold text-[#77e5ad] sm:justify-start"><Code2 size={18} />Lead Frontend Developer &amp; Technical Designer</p>
          <p className="muted mt-4 leading-7">Leads the manual development of KADA Tech, translating the group&apos;s business, merchandising, and content plans into a polished and responsive storefront.</p>
          <Link href="https://kimreubentabanda.vercel.app" target="_blank" rel="noreferrer" className="btn secondary mt-5">View my portfolio <ExternalLink size={17} /></Link>
        </div>
      </div>
    </section>
    <section className="mt-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Business &amp; marketing team</p>
        <h2 className="mt-2 text-3xl font-black">Shaping the E-Commerce experience</h2>
        <p className="muted mt-3 leading-7">Our marketing members contribute the strategy, merchandising, content, and customer-experience decisions behind the storefront.</p>
      </div>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {businessTeam.map(({ name, role, icon: Icon, detail }) => <article className="panel p-6 text-center" key={name}>
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#77e5ad]/10 text-[#77e5ad]"><Icon size={22} /></span>
          <h3 className="mt-4 text-xl font-bold">{name}</h3>
          <p className="mt-2 font-bold text-[#77e5ad]">{role}</p>
          <p className="muted mt-3 leading-6">{detail}</p>
        </article>)}
      </div>
    </section>
    <div className="mt-10 text-center"><Link href="/shop" className="btn primary">Explore the collection</Link><Link href="/contact" className="btn secondary ml-3">Contact us</Link></div>
  </div>;
}
