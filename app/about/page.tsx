import Image from "next/image";
import Link from "next/link";
import { Code2, ExternalLink, Gamepad2, ShieldCheck, Sparkles, Truck } from "lucide-react";

const values = [
  { icon: Sparkles, title: "Carefully selected", detail: "We focus on dependable gear that earns its place in your setup." },
  { icon: ShieldCheck, title: "Shop confidently", detail: "Clear product details, secure checkout, and two-year warranty coverage." },
  { icon: Truck, title: "Made for local players", detail: "Straightforward Philippine pricing and delivery designed around you." },
];

export default function AboutPage() {
  return <div className="container py-12">
    <div className="mx-auto max-w-3xl text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#77e5ad] text-black"><Gamepad2 /></span><p className="eyebrow mt-6">About KRSTech</p><h1 className="mt-2 text-4xl font-black sm:text-5xl">Better gear. Better setups.</h1><p className="muted mt-5 text-lg leading-8">KRSTech is a curated gaming-gear store built to make choosing your next upgrade simpler. We bring keyboards, mice, audio, displays, and setup essentials together in one clean shopping experience.</p></div>
    <div className="mt-12 grid gap-4 md:grid-cols-3">{values.map(({ icon: Icon, title, detail }) => <div className="panel p-6" key={title}><Icon className="text-[#77e5ad]" /><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="muted mt-2 leading-6">{detail}</p></div>)}</div>
    <section className="panel mx-auto mt-12 max-w-4xl overflow-hidden p-6 sm:p-9">
      <div className="grid items-center gap-8 sm:grid-cols-[180px_1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-3xl border border-[#77e5ad]/40 bg-white">
          <Image src="/images/krst.png" alt="Kim Reuben S. Tabanda" fill sizes="180px" className="object-cover object-top" />
        </div>
        <div className="text-center sm:text-left">
          <p className="eyebrow">Meet the developer</p>
          <h2 className="mt-2 text-3xl font-black">Kim Reuben S. Tabanda</h2>
          <p className="mt-2 flex items-center justify-center gap-2 font-bold text-[#77e5ad] sm:justify-start"><Code2 size={18} />Designer &amp; Developer</p>
          <p className="muted mt-4 leading-7">I designed and developed KRSTech to create a polished, straightforward shopping experience for gamers looking to build a setup they can be proud of.</p>
          <Link href="https://kimreubentabanda.vercel.app" target="_blank" rel="noreferrer" className="btn secondary mt-5">View my portfolio <ExternalLink size={17} /></Link>
        </div>
      </div>
    </section>
    <div className="mt-10 text-center"><Link href="/shop" className="btn primary">Explore the collection</Link><Link href="/contact" className="btn secondary ml-3">Contact us</Link></div>
  </div>;
}
