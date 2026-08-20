"use client";
import Image from "next/image";
import Link from "next/link";
import { GitCompareArrows, X, Plus, Check, Search } from "lucide-react";
import { Fragment, useState } from "react";
import { useStore } from "@/components/store";
import { products, categories } from "@/data/products";
import { peso } from "@/lib/helpers";

export default function Compare() {
  const { compare, toggleCompare, addCart } = useStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const list = products.filter(product => compare.includes(product.id));
  const available = products.filter(product => !compare.includes(product.id) && (category === "All categories" || product.category === category) && `${product.name} ${product.brand}`.toLowerCase().includes(query.toLowerCase()));
  const needsHorizontalScroll = list.length === 3;
  const comparisonMinWidth = needsHorizontalScroll ? 646 : undefined;
  const productColumns = needsHorizontalScroll ? "minmax(160px,1fr)" : "minmax(0,1fr)";

  const addProduct = (id: string) => {
    toggleCompare(id);
    setPickerOpen(false);
  };

  return <div className="container min-h-[65vh] py-12">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="eyebrow">Side by side</p><h1 className="mt-2 text-4xl font-black">Compare gear</h1><p className="muted mt-2">Compare up to three products. Key differences are highlighted.</p></div>
      <button disabled={list.length >= 3} onClick={() => setPickerOpen(!pickerOpen)} className="btn primary disabled:cursor-not-allowed disabled:opacity-40"><Plus size={18} />{list.length >= 3 ? "Maximum 3 products" : "Add product"}</button>
    </div>

    {pickerOpen && <section className="panel mt-6 p-5">
      <div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">Choose a product</h2><p className="muted text-xs">Select one item to add to your comparison.</p></div><button aria-label="Close product picker" onClick={() => setPickerOpen(false)} className="rounded-lg p-2 hover:bg-white/10"><X size={18} /></button></div>
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px]">
        <label className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={17} /><input value={query} onChange={event => setQuery(event.target.value)} className="field !pl-11" placeholder="Search by product or brand..." aria-label="Search comparison products" /></label>
        <select value={category} onChange={event => setCategory(event.target.value)} className="field" aria-label="Filter by category"><option>All categories</option>{categories.map(item => <option key={item}>{item}</option>)}</select>
      </div>
      <p className="muted mb-3 text-xs">{available.length} product{available.length === 1 ? "" : "s"} found</p>
      <div className="grid max-h-[420px] gap-3 overflow-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
        {available.map(product => <button key={product.id} onClick={() => addProduct(product.id)} className="flex items-center gap-3 rounded-xl border border-[#303745] p-3 text-left hover:border-[#77e5ad] hover:bg-[#77e5ad]/5"><div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#151a22]"><Image fill sizes="80px" className="object-cover" src={product.image} alt={product.name} /></div><div className="min-w-0 flex-1"><span className="eyebrow">{product.brand}</span><b className="block truncate text-sm">{product.name}</b><span className="muted text-xs">{peso(product.price)}</span></div><Plus className="shrink-0 text-[#77e5ad]" size={17} /></button>)}
        {!available.length && <div className="py-12 text-center sm:col-span-2 lg:col-span-3"><Search className="mx-auto text-gray-600" size={32} /><b className="mt-3 block">No matching gear</b><p className="muted mt-1 text-sm">Try another search or category.</p></div>}
      </div>
    </section>}

    {!list.length ? <div className="panel mt-8 py-20 text-center"><GitCompareArrows className="mx-auto text-gray-600" size={48} /><h2 className="mt-5 text-xl font-bold">Your comparison is empty</h2><p className="muted mt-2">Use the Add product button above or browse the full collection.</p><Link href="/shop" className="btn secondary mt-6">Browse shop</Link></div> : <div className="mt-8">
      {needsHorizontalScroll && <p className="muted mb-3 text-xs sm:hidden">Swipe sideways to see all three products.</p>}
      <div className="max-w-full overflow-x-auto overscroll-x-contain pb-2">
      <div className="grid w-full gap-3" style={{ gridTemplateColumns: `minmax(105px,130px) repeat(${list.length},${productColumns})`, minWidth: comparisonMinWidth }}>
        <div />
        {list.map(product => <div className="panel relative p-3 sm:p-4" key={product.id}><button aria-label={`Remove ${product.name} from comparison`} onClick={() => toggleCompare(product.id)} className="absolute right-2 top-2 z-10 rounded-full bg-black/70 p-1 sm:right-3 sm:top-3 hover:bg-red-500"><X size={16} /></button><div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image fill sizes="(max-width: 640px) 55vw, 280px" className="object-cover" src={product.image} alt={product.name} /></div><p className="eyebrow mt-4">{product.brand}</p><b className="block break-words">{product.name}</b><button onClick={() => addCart(product.id)} className="btn primary mt-4 w-full text-sm">Add to cart</button></div>)}
        {[["Price", (product: any) => peso(product.price)], ["Rating", (product: any) => `${product.rating.toFixed(1)} / 5`], ["Connection", (product: any) => product.connection], ["Warranty", (product: any) => product.specifications.Warranty], ["Availability", (product: any) => product.stock ? "In stock" : "Unavailable"], ["Compatibility", (product: any) => product.specifications.Compatibility]].map(([label, value]: any) => <Fragment key={label}><b className="panel break-words p-3 text-sm leading-tight sm:p-4 sm:text-base">{label}</b>{list.map(product => <div className="panel flex items-center gap-2 break-words p-3 text-sm sm:p-4 sm:text-base" key={label + product.id}>{label === "Availability" && product.stock > 0 && <Check className="shrink-0 text-[#77e5ad]" size={15} />}{value(product)}</div>)}</Fragment>)}
      </div>
      </div>
    </div>}
  </div>;
}
