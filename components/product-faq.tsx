import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Product } from "@/types";

export function ProductFaq({ product }: { product: Product }) {
  const faqs = [
    { question: "Will this work with my setup?", answer: `The listed connection is ${product.connection}. Compatibility: ${product.specifications.Compatibility || "Check your device's supported connections"}. Confirm your device has the required port or wireless support before ordering; some features may depend on your platform.` },
    { question: "Who is this product best for?", answer: `${product.bestFor}. ${product.buyerTip}` },
    { question: "What warranty is listed?", answer: `The listed warranty is ${product.specifications.Warranty || "manufacturer coverage"}. Contact support to confirm coverage, exclusions, and the claim process for this model.` },
    { question: "How much is delivery?", answer: "Delivery options and charges appear at checkout before you place your order. Review your address and selected delivery service to see the final total." },
    { question: "What should I check before buying?", answer: "Review the specifications, dimensions, connection type, and available stock. If you need a specific cable, adapter, or accessory, ask support to confirm whether it is included." },
  ];
  return <section className="my-12" aria-labelledby="product-faq-heading"><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">Before you buy</p><h2 id="product-faq-heading" className="mt-2 text-2xl font-black sm:text-3xl">Your questions, answered.</h2></div><Link href="/contact" className="text-sm font-bold text-[#77e5ad] hover:underline">Ask our team →</Link></div><div className="overflow-hidden rounded-2xl border border-[#303745] bg-[#10141c]">{faqs.map(faq => <details key={faq.question} className="group border-b border-[#303745] last:border-0"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold focus-visible:outline-2 focus-visible:outline-[#77e5ad] [&::-webkit-details-marker]:hidden">{faq.question}<ChevronDown size={18} className="shrink-0 text-[#77e5ad] transition-transform group-open:rotate-180" /></summary><p className="muted px-5 pb-5 text-sm leading-7">{faq.answer}</p></details>)}</div></section>;
}
