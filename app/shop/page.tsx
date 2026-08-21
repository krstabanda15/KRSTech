"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Grid2X2, List, SlidersHorizontal, X } from "lucide-react";
import { products, categories } from "@/data/products";
import { ProductCard } from "@/components/product-card";

export default function Shop() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [rating, setRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [connection, setConnection] = useState("All");
  const [maxPrice, setMaxPrice] = useState(25000);
  const [listView, setListView] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const brands = [...new Set(products.map(product => product.brand))];
  const connections = [...new Set(products.map(product => product.connection))];

  const clearFilters = () => { setQuery(""); setCategory("All"); setBrand("All"); setRating(0); setInStock(false); setConnection("All"); setMaxPrice(25000); };
  const activeFilters = [
    query && { label: `Search: ${query}`, clear: () => setQuery("") },
    category !== "All" && { label: category, clear: () => setCategory("All") },
    brand !== "All" && { label: brand, clear: () => setBrand("All") },
    connection !== "All" && { label: connection, clear: () => setConnection("All") },
    rating > 0 && { label: `${rating}+ stars`, clear: () => setRating(0) },
    inStock && { label: "In stock", clear: () => setInStock(false) },
    maxPrice < 25000 && { label: `Up to ₱${maxPrice.toLocaleString()}`, clear: () => setMaxPrice(25000) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const result = useMemo(() => products.filter(product =>
    (product.name + product.brand).toLowerCase().includes(query.toLowerCase()) &&
    (category === "All" || product.category === category) &&
    (brand === "All" || product.brand === brand) &&
    (connection === "All" || product.connection === connection) &&
    product.rating >= rating && product.price <= maxPrice && (!inStock || product.stock > 0)
  ).sort((a, b) => sort === "Price: Low to High" ? a.price - b.price : sort === "Price: High to Low" ? b.price - a.price : sort === "Highest Rated" ? b.rating - a.rating : sort === "Newest" ? Number(b.newArrival) - Number(a.newArrival) : Number(b.featured) - Number(a.featured)), [query, category, brand, connection, rating, maxPrice, inStock, sort]);

  const filterProps = { query, setQuery, category, setCategory, brand, setBrand, brands, rating, setRating, inStock, setInStock, connection, setConnection, connections, maxPrice, setMaxPrice, clearFilters, activeCount: activeFilters.length };

  return <div className="container py-12">
    <p className="eyebrow">Explore the collection</p><h1 className="mt-2 text-4xl font-black sm:text-5xl">Find your next upgrade.</h1><p className="muted mt-3">Purpose-built gear for work, play, and everything between.</p>
    <div className="mt-9 flex gap-6">
      <aside className={`${filtersOpen ? "fixed inset-0 z-50 overflow-auto bg-[#080b10] p-6" : "hidden"} w-64 shrink-0 lg:block`}><div className="mb-6 flex items-center justify-between"><b>Filters</b><button aria-label="Close filters" className="lg:hidden" onClick={() => setFiltersOpen(false)}><X /></button></div><Filters {...filterProps} /></aside>
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><span className="muted text-sm"><b className="text-white">{result.length}</b> products</span><div className="flex gap-2"><button onClick={() => setFiltersOpen(true)} className="btn secondary lg:hidden"><SlidersHorizontal size={17} />Filters{activeFilters.length > 0 && <span className="badge">{activeFilters.length}</span>}</button><select aria-label="Sort products" className="field !w-auto" value={sort} onChange={event => setSort(event.target.value)}>{["Featured", "Price: Low to High", "Price: High to Low", "Highest Rated", "Newest"].map(option => <option key={option}>{option}</option>)}</select><div className="hidden rounded-xl border border-[#202633] p-1 sm:flex"><button aria-label="Grid view" onClick={() => setListView(false)} className={`rounded-lg p-2 ${!listView ? "bg-white/10" : ""}`}><Grid2X2 size={18} /></button><button aria-label="List view" onClick={() => setListView(true)} className={`rounded-lg p-2 ${listView ? "bg-white/10" : ""}`}><List size={18} /></button></div></div></div>
        {activeFilters.length > 0 && <div className="mb-5 flex flex-wrap gap-2" aria-label="Active filters">{activeFilters.map(filter => <button key={filter.label} onClick={filter.clear} className="flex items-center gap-1 rounded-full border border-[#303745] bg-[#141923] px-3 py-1.5 text-xs hover:border-[#77e5ad]">{filter.label}<X size={13} /></button>)}<button onClick={clearFilters} className="px-2 text-xs font-bold text-[#77e5ad]">Clear all</button></div>}
        <div className={listView ? "grid gap-4" : "grid-products"}>{result.map(product => <ProductCard p={product} list={listView} key={product.id} />)}</div>
        {!result.length && <div className="panel py-24 text-center"><h3 className="text-xl font-bold">No gear matched</h3><p className="muted mt-2">Try widening your filters.</p><button onClick={clearFilters} className="btn primary mt-5">Clear all filters</button></div>}
      </div>
    </div>
  </div>;
}

type FiltersProps = {
  query: string; setQuery: (value: string) => void; category: string; setCategory: (value: string) => void; brand: string; setBrand: (value: string) => void; brands: string[]; rating: number; setRating: (value: number) => void; inStock: boolean; setInStock: (value: boolean) => void; connection: string; setConnection: (value: string) => void; connections: string[]; maxPrice: number; setMaxPrice: (value: number) => void; clearFilters: () => void; activeCount: number;
};

function Filters(props: FiltersProps) {
  return <div className="space-y-6">
    <input value={props.query} onChange={event => props.setQuery(event.target.value)} className="field" placeholder="Search products..." aria-label="Search products" />
    <Filter title="Category"><select className="field" value={props.category} onChange={event => props.setCategory(event.target.value)}>{["All", ...categories].map(option => <option key={option}>{option}</option>)}</select></Filter>
    <Filter title="Brand"><select className="field" value={props.brand} onChange={event => props.setBrand(event.target.value)}>{["All", ...props.brands].map(option => <option key={option}>{option}</option>)}</select></Filter>
    <Filter title={`Max price: ₱${props.maxPrice.toLocaleString()}`}><input className="w-full accent-[#77e5ad]" type="range" min="1500" max="25000" step="500" value={props.maxPrice} onChange={event => props.setMaxPrice(Number(event.target.value))} /></Filter>
    <Filter title="Minimum rating"><select className="field" value={props.rating} onChange={event => props.setRating(Number(event.target.value))}>{[0, 4, 4.5].map(option => <option value={option} key={option}>{option ? `${option}+ stars` : "Any rating"}</option>)}</select></Filter>
    <Filter title="Connection"><select className="field" value={props.connection} onChange={event => props.setConnection(event.target.value)}>{["All", ...props.connections].map(option => <option key={option}>{option}</option>)}</select></Filter>
    <label className="flex gap-3 text-sm"><input checked={props.inStock} onChange={event => props.setInStock(event.target.checked)} type="checkbox" className="accent-[#77e5ad]" />In stock only</label>
    {props.activeCount > 0 && <button onClick={props.clearFilters} className="w-full text-left text-sm font-bold text-[#77e5ad]">Clear all filters ({props.activeCount})</button>}
  </div>;
}

function Filter({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><b className="mb-3 block text-sm">{title}</b>{children}</div>;
}
