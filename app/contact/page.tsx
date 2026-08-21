"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock3, Mail, MessageCircle, PackageCheck, RotateCcw } from "lucide-react";

const topics = [
  { value: "Product inquiry", label: "Product inquiry", detail: "Specs, compatibility, or availability" },
  { value: "Order help", label: "Order help", detail: "Delivery, payment, or order updates" },
  { value: "Return request", label: "Return an item", detail: "Start a return within 14 days" },
];

export default function ContactPage() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState(searchParams.get("topic") === "return" ? "Return request" : "Product inquiry");
  const [sent, setSent] = useState(false);
  const needsOrder = topic !== "Product inquiry";

  if (sent) return <div className="container min-h-[65vh] py-20 text-center">
    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#77e5ad] text-black"><CheckCircle2 size={38} /></div>
    <p className="eyebrow mt-7">Email prepared</p>
    <h1 className="mt-2 text-4xl font-black">One last step.</h1>
    <p className="muted mx-auto mt-4 max-w-lg">Your email app should now be open with the request filled in. Press <b className="text-white">Send</b> there to deliver it to our support team. We normally reply within one business day.</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/shop" className="btn primary">Continue shopping</Link><button className="btn secondary" onClick={() => setSent(false)}>Send another request</button></div>
  </div>;

  return <div className="container py-12">
    <p className="eyebrow">Customer care</p>
    <h1 className="mt-2 text-4xl font-black sm:text-5xl">How can we help?</h1>
    <p className="muted mt-3 max-w-2xl">Ask about a product, get help with an order, or start a return. Choose a topic so your request reaches the right team.</p>

    <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_360px]">
      <form className="panel p-5 sm:p-8" onSubmit={event => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const subject = encodeURIComponent(`[${topic}] ${String(values.get("order") || "Customer request")}`);
        const body = encodeURIComponent(`Name: ${values.get("name")}\nEmail: ${values.get("email")}\nPhone: ${values.get("phone") || "Not provided"}\nOrder: ${values.get("order") || "Not applicable"}\n\n${values.get("message")}`);
        setSent(true);
        window.location.href = `mailto:support@kadatech.ph?subject=${subject}&body=${body}`;
      }}>
        <fieldset>
          <legend className="mb-3 font-bold">What do you need help with?</legend>
          <div className="grid gap-3 sm:grid-cols-3">{topics.map(item => <label key={item.value} className={`cursor-pointer rounded-2xl border p-4 transition ${topic === item.value ? "border-[#77e5ad] bg-[#77e5ad]/10" : "border-[#303745] hover:border-[#596273]"}`}>
            <input className="sr-only" type="radio" name="topic" value={item.value} checked={topic === item.value} onChange={() => setTopic(item.value)} />
            <b className="block text-sm">{item.label}</b><span className="muted mt-1 block text-xs leading-5">{item.detail}</span>
          </label>)}</div>
        </fieldset>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="name" placeholder="Your name" />
          <Field label="Email address" name="email" type="email" placeholder="you@example.com" />
          {needsOrder && <Field label="Order number" name="order" placeholder="e.g. NG-260818" />}
          <Field label="Phone number (optional)" name="phone" type="tel" placeholder="+63 917 123 4567" optional />
          <label className="text-sm sm:col-span-2"><b className="mb-2 block">How can we help?</b><textarea required name="message" rows={6} className="field resize-y" placeholder={topic === "Return request" ? "Tell us which item you want to return and the reason…" : "Share the details of your request…"} /></label>
        </div>
        {topic === "Return request" && <div className="mt-4 flex gap-3 rounded-xl border border-[#29523e] bg-[#173225]/50 p-4 text-sm"><RotateCcw className="shrink-0 text-[#77e5ad]" size={20} /><p className="text-gray-300">Items can be returned within 14 days in their original condition. Keep your order number ready; our team will send the return instructions.</p></div>}
        <button className="btn primary mt-6 w-full sm:w-auto" type="submit">Submit request</button>
      </form>

      <aside className="space-y-4">
        <SupportCard icon={Clock3} title="Response time" detail="Usually within one business day" />
        <SupportCard icon={Mail} title="Email us" detail="support@kadatech.ph" />
        <SupportCard icon={MessageCircle} title="Need quick help?" detail="Monday–Saturday, 9 AM–6 PM" />
        <div className="panel p-6"><PackageCheck className="text-[#77e5ad]" /><h2 className="mt-4 font-bold">Track an existing order</h2><p className="muted mt-2 text-sm">See your latest delivery status and courier details.</p><Link href="/orders" className="btn secondary mt-5 w-full">Track order</Link></div>
      </aside>
    </div>
  </div>;
}

function Field({ label, optional, ...props }: { label: string; optional?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label className="text-sm"><b className="mb-2 block">{label}</b><input required={!optional} className="field" {...props} /></label>;
}

function SupportCard({ icon: Icon, title, detail }: { icon: typeof Mail; title: string; detail: string }) {
  return <div className="panel flex items-center gap-4 p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#77e5ad]/10 text-[#77e5ad]"><Icon size={20} /></span><div><b>{title}</b><p className="muted mt-1 text-sm">{detail}</p></div></div>;
}
