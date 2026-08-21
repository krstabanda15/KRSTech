"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/store";
import { products } from "@/data/products";
import { peso } from "@/lib/helpers";

const FREE_SHIPPING = 3000;
const deliveryDate = () => { const date = new Date(); date.setDate(date.getDate() + 4); return date.toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" }); };

export default function Cart() {
  const { cart, changeQty, removeCart, toggleWish, addCart } = useStore();
  const [promo, setPromo] = useState("");
  const [promoState, setPromoState] = useState<"idle" | "valid" | "invalid">("idle");
  const lines = cart.map(line => ({ ...line, product: products.find(product => product.id === line.id) })).filter(line => line.product);
  const subtotal = lines.reduce((sum, line) => sum + (line.product?.price || 0) * line.qty, 0);
  const discount = promoState === "valid" ? Math.round(subtotal * .1) : 0;
  const shipping = subtotal >= FREE_SHIPPING ? 0 : 199;
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const addOns = products.filter(product => !cart.some(line => line.id === product.id) && ["Mousepads", "PC Accessories"].includes(product.category)).slice(0, 3);
  const applyPromo = () => setPromoState(promo.trim().toUpperCase() === "STUDENT10" ? "valid" : "invalid");

  return <div className="container py-12"><nav className="muted mb-5 text-sm"><Link href="/">Home</Link> / Cart</nav><p className="eyebrow">Your bag</p><h1 className="mt-2 text-4xl font-black">Shopping cart</h1>
    {!lines.length ? <div className="panel my-12 py-20 text-center"><ShoppingBag className="mx-auto text-gray-600" size={48} /><h2 className="mt-5 text-2xl font-bold">Your cart is ready for an upgrade</h2><p className="muted mt-2">Explore gear selected for serious play.</p><Link href="/shop" className="btn primary mt-6">Explore products</Link></div> :
    <><div className="mt-8 grid gap-7 lg:grid-cols-[1fr_380px]"><div className="space-y-4">
      <div className="panel p-5"><div className="flex justify-between text-sm"><b>{remaining ? `Add ${peso(remaining)} for free shipping` : "You unlocked free shipping!"}</b><Truck size={19} className="text-[#77e5ad]" /></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#252c38]"><div className="h-full rounded-full bg-[#77e5ad] transition-all" style={{ width: `${Math.min(100, subtotal / FREE_SHIPPING * 100)}%` }} /></div></div>
      {lines.map(({ product, qty }) => product && <div className="panel flex gap-4 p-4 sm:p-5" key={product.id}><Link href={`/product/${product.id}`} className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#151a22]"><Image fill className="object-cover" src={product.image} alt={product.name} /></Link><div className="flex min-w-0 flex-1 flex-col"><p className="eyebrow">{product.brand}</p><Link href={`/product/${product.id}`} className="font-bold">{product.name}</Link><span className="muted mt-1 text-xs">Obsidian Black · {product.connection}</span><p className="mt-2 text-xs text-[#77e5ad]">Estimated delivery {deliveryDate()}</p>{product.stock <= 8 && <p className="mt-1 text-xs text-amber-400">Only {product.stock} left</p>}<div className="mt-auto flex flex-wrap items-end justify-between gap-3"><div className="flex items-center rounded-lg border border-[#303745]"><button aria-label="Decrease quantity" onClick={() => changeQty(product.id, qty - 1)} className="min-h-11 px-3">−</button><b className="text-sm">{qty}</b><button aria-label="Increase quantity" disabled={qty >= product.stock} onClick={() => changeQty(product.id, Math.min(product.stock, qty + 1))} className="min-h-11 px-3 disabled:opacity-30">+</button></div><b>{peso(product.price * qty)}</b></div></div><div className="flex flex-col gap-3"><button aria-label="Save for later" onClick={() => toggleWish(product.id)}><Heart size={18} /></button><button aria-label="Remove item" onClick={() => removeCart(product.id)} className="text-red-400"><Trash2 size={18} /></button></div></div>)}</div>
      <aside className="panel h-fit p-6 lg:sticky lg:top-28"><h2 className="text-xl font-bold">Order summary</h2><div className="mt-6 space-y-3 text-sm"><Row label="Subtotal" value={peso(subtotal)} /><Row label="Discount" value={discount ? `−${peso(discount)}` : "—"} /><Row label="Shipping" value={shipping ? peso(shipping) : "Free"} /></div><div className="my-5 border-t border-[#303745]" /><div className="flex justify-between text-lg"><b>Estimated total</b><b>{peso(subtotal - discount + shipping)}</b></div><div className="mt-6 flex gap-2"><input value={promo} onChange={event => { setPromo(event.target.value); setPromoState("idle"); }} className={`field ${promoState === "invalid" ? "!border-red-400" : ""}`} placeholder="Try STUDENT10" aria-label="Promo code" /><button onClick={applyPromo} className="btn secondary">Apply</button></div>{promoState === "valid" && <p role="status" className="mt-2 text-xs text-[#77e5ad]">Student discount applied — 10% off</p>}{promoState === "invalid" && <p role="alert" className="mt-2 text-xs text-red-400">That promo code is invalid or expired.</p>}<Link href="/checkout" className="btn primary mt-5 w-full">Proceed to checkout</Link><Link href="/shop" className="mt-4 block text-center text-sm text-gray-400">Continue shopping</Link></aside></div>
      <section className="mt-12"><p className="eyebrow">Complete your setup</p><h2 className="mt-2 text-2xl font-black">Popular add-ons</h2><div className="mt-5 grid gap-3 md:grid-cols-3">{addOns.map(product => <div key={product.id} className="panel flex items-center gap-3 p-3"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg"><Image fill className="object-cover" src={product.image} alt="" /></div><div className="min-w-0 flex-1"><b className="block truncate text-sm">{product.name}</b><span className="text-sm text-[#77e5ad]">{peso(product.price)}</span></div><button onClick={() => addCart(product.id)} className="rounded-lg bg-[#77e5ad] px-3 py-2 text-sm font-bold text-black">Add</button></div>)}</div></section></>}
  </div>;
}

function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between"><span className="muted">{label}</span><span>{value}</span></div>; }
