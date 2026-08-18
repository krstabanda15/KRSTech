"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product-card";

export function ProductCarousel({ items }: { items: Product[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<"start" | "middle" | "end">("start");
  const updatePosition = () => {
    const el = rail.current;
    if (!el) return;
    const remaining = el.scrollWidth - el.clientWidth - el.scrollLeft;
    setPosition(el.scrollLeft < 8 ? "start" : remaining < 8 ? "end" : "middle");
  };
  const move = (direction: -1 | 1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: direction * Math.max(280, el.clientWidth * .78), behavior: "smooth" });
  };
  return <div className="carousel-wrap">
    <div className="carousel-controls" aria-label="Trending gear carousel controls">
      <button className="carousel-button" onClick={() => move(-1)} disabled={position === "start"} aria-label="Previous products"><ChevronLeft size={20}/></button>
      <button className="carousel-button" onClick={() => move(1)} disabled={position === "end"} aria-label="Next products"><ChevronRight size={20}/></button>
    </div>
    <div ref={rail} onScroll={updatePosition} className="product-carousel" role="region" aria-label="Trending products" tabIndex={0}>
      {items.map(p => <div className="carousel-item" key={p.id}><ProductCard p={p}/></div>)}
    </div>
  </div>;
}
