"use client";

import { Share2 } from "lucide-react";

export function ShareSite() {
  const share = async () => {
    const data = { title: "KRSTech", text: "Premium gaming gear for your setup.", url: window.location.origin };
    if (navigator.share) await navigator.share(data);
    else {
      await navigator.clipboard.writeText(data.url);
      window.alert("Store link copied to your clipboard.");
    }
  };

  return <button type="button" onClick={share} aria-label="Share KRSTech" title="Share KRSTech" className="rounded-lg p-2 hover:bg-white/10 hover:text-[#77e5ad]"><Share2 size={18} /></button>;
}
