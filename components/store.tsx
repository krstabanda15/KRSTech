"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import { products } from "@/data/products";
import { peso } from "@/lib/helpers";
import { CartLine, NFCCustomization } from "@/types";

type Store = {
  cart: CartLine[];
  wishlist: string[];
  compare: string[];
  toast: string;
  ready: boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addCart: (id: string, qty?: number) => void;
  addCustomNfc: (customization: NFCCustomization) => void;
  changeQty: (id: string, qty: number) => void;
  removeCart: (id: string) => void;
  toggleWish: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCart: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("ng-cart") || "[]"));
      setWishlist(JSON.parse(localStorage.getItem("ng-wish") || "[]"));
      setCompare(JSON.parse(localStorage.getItem("ng-compare") || "[]"));
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("ng-cart", JSON.stringify(cart));
    localStorage.setItem("ng-wish", JSON.stringify(wishlist));
    localStorage.setItem("ng-compare", JSON.stringify(compare));
  }, [cart, wishlist, compare, ready]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const say = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2400);
  };

  const addCart = (id: string, qty = 1) => {
    setCart(current => current.some(item => item.id === id) ? current.map(item => item.id === id ? { ...item, qty: item.qty + qty } : item) : [...current, { id, qty }]);
    say("Added to your cart");
    setCartOpen(true);
  };
  const addCustomNfc = (customization: NFCCustomization) => {
    const id = "custom-nfc-" + (globalThis.crypto?.randomUUID?.() || Date.now());
    setCart(current => [...current, { id, qty: 1, customization }]);
    say("Your custom NFC is in the cart");
    setCartOpen(true);
  };

  const value: Store = {
    cart,
    wishlist,
    compare,
    toast,
    ready,
    cartOpen,
    setCartOpen,
    addCart,
    addCustomNfc,
    changeQty: (id, qty) => setCart(current => current.map(item => item.id === id ? { ...item, qty: Math.max(1, qty) } : item)),
    removeCart: id => { setCart(current => current.filter(item => item.id !== id)); say("Removed from cart"); },
    toggleWish: id => { const saved = wishlist.includes(id); setWishlist(current => saved ? current.filter(item => item !== id) : [...current, id]); say(saved ? "Removed from wishlist" : "Saved to wishlist"); },
    toggleCompare: id => {
      if (compare.includes(id)) { setCompare(current => current.filter(item => item !== id)); say("Removed from comparison"); }
      else if (compare.length >= 3) say("You can compare up to 3 products");
      else { setCompare(current => [...current, id]); say("Added to comparison"); }
    },
    clearCart: () => setCart([]),
  };

  return <StoreContext.Provider value={value}>
    {children}
    <MiniCart />
    {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-white px-5 py-3 font-bold text-black shadow-2xl"><CheckCircle2 size={18} className="text-emerald-600" />{toast}</div>}
  </StoreContext.Provider>;
}

function MiniCart() {
  const { cart, cartOpen, setCartOpen, changeQty, removeCart } = useStore();
  if (!cartOpen) return null;
  const lines = cart.map(item => ({ ...item, product: products.find(product => product.id === item.id) || (item.customization ? {id:item.id,name:item.customization.productName,price:item.customization.unitPrice,image:"/images/krst.png"} : undefined) })).filter(item => item.product);
  const subtotal = lines.reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0);
  return <div className="fixed inset-0 z-[60]">
    <button aria-label="Close cart" onClick={() => setCartOpen(false)} className="absolute inset-0 h-full w-full cursor-default bg-black/60" />
    <aside role="dialog" aria-modal="true" aria-label="Shopping cart" className="mobile-drawer absolute bottom-0 right-0 top-0 flex w-[min(92vw,430px)] flex-col border-l border-[#303745] bg-[#080b10] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#202633] p-5"><div><p className="eyebrow">Just added</p><h2 className="mt-1 text-xl font-black">Your cart</h2></div><button aria-label="Close cart" onClick={() => setCartOpen(false)} className="rounded-lg p-2 hover:bg-white/10"><X /></button></div>
      <div className="flex-1 space-y-3 overflow-y-auto p-5">{lines.length ? lines.map(item => item.product && <div className="flex gap-3 rounded-xl border border-[#202633] p-3" key={item.id}><div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#151a22]"><Image fill className="object-cover" src={item.product.image} alt={item.product.name} /></div><div className="min-w-0 flex-1"><b className="block truncate text-sm">{item.product.name}</b><span className="text-sm text-[#77e5ad]">{peso(item.product.price)}</span><div className="mt-2 flex items-center justify-between"><div className="flex items-center rounded-lg border border-[#303745]"><button aria-label="Decrease quantity" onClick={() => changeQty(item.id, item.qty - 1)} className="px-2.5 py-1">−</button><b className="text-xs">{item.qty}</b><button aria-label="Increase quantity" onClick={() => changeQty(item.id, item.qty + 1)} className="px-2.5 py-1">+</button></div><button onClick={() => removeCart(item.id)} className="text-xs text-red-400">Remove</button></div></div></div>) : <div className="py-20 text-center"><ShoppingBag className="muted mx-auto" size={42} /><p className="muted mt-3">Your cart is empty.</p></div>}</div>
      <div className="border-t border-[#202633] p-5"><div className="mb-4 flex justify-between text-lg"><b>Subtotal</b><b>{peso(subtotal)}</b></div><Link onClick={() => setCartOpen(false)} href="/checkout" className={`btn primary w-full ${!lines.length ? "pointer-events-none opacity-50" : ""}`}>Checkout</Link><Link onClick={() => setCartOpen(false)} href="/cart" className="btn secondary mt-3 w-full">View full cart</Link></div>
    </aside>
  </div>;
}

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw Error("Store unavailable");
  return store;
};
