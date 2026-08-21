"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ChevronRight, Clock, Heart, MapPin, Package, Pencil, Settings, User, X } from "lucide-react";

const nav = [["Profile", User], ["Orders", Package], ["Wishlist", Heart], ["Addresses", MapPin], ["Recently Viewed", Clock], ["Settings", Settings]] as const;
type Address = { label: string; street: string; city: string; province: string; postal: string; country: string };
type Profile = { firstName: string; lastName: string; email: string; phone: string };
const defaultAddress: Address = { label: "Home", street: "123 Sample Street", city: "Bacolod City", province: "Negros Occidental", postal: "6100", country: "Philippines" };
const defaultProfile: Profile = { firstName: "Kim Reuben", lastName: "Tabanda", email: "kim@example.com", phone: "+63 917 123 4567" };

export default function Account() {
  const [tab, setTab] = useState("Profile");
  return <div className="container py-12">
    <p className="eyebrow">My KADA Tech</p><h1 className="mt-2 text-4xl font-black">Welcome back, Kim.</h1>
    <div className="mt-8 grid gap-6 lg:grid-cols-[250px_1fr]">
      <aside className="panel h-fit p-3">{nav.map(([label, Icon]) => <button onClick={() => setTab(label)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm ${tab === label ? "bg-[#77e5ad] font-bold text-black" : "text-gray-400 hover:bg-white/5 hover:text-white"}`} key={label}><Icon size={18}/>{label}</button>)}</aside>
      <section className="panel p-6 sm:p-8">
        <h2 className="text-2xl font-black">{tab}</h2>
        {tab === "Profile" && <ProfileForm/>}
        {tab === "Orders" && <Orders/>}
        {tab === "Wishlist" && <Link href="/wishlist" className="btn primary mt-6">Open wishlist</Link>}
        {tab === "Addresses" && <AddressCard/>}
        {tab === "Recently Viewed" && <p className="muted mt-6">Your recently viewed gear will appear here.</p>}
        {tab === "Settings" && <div className="mt-6 space-y-4"><Toggle label="Order updates"/><Toggle label="Product drops and deals"/><Toggle label="Dark appearance"/></div>}
      </section>
    </div>
  </div>;
}

function ProfileForm() {
  const [profile, setProfile] = useState(defaultProfile);
  const [draft, setDraft] = useState(defaultProfile);
  const [editing, setEditing] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kada-tech-profile");
      if (stored) {
        const next = { ...defaultProfile, ...JSON.parse(stored) };
        setProfile(next);
        setDraft(next);
        setEditing(false);
      }
    } catch { /* Keep the default profile if saved data is invalid. */ }
  }, []);

  const update = (key: keyof Profile, value: string) => {
    setDraft(current => ({ ...current, [key]: value }));
    setSaved(false);
  };
  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    const next = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim()])) as Profile;
    setProfile(next);
    setDraft(next);
    localStorage.setItem("kada-tech-profile", JSON.stringify(next));
    setEditing(false);
    setSaved(true);
  };

  return <form onSubmit={saveProfile} className="mt-7 grid max-w-xl gap-4 sm:grid-cols-2">
    {!editing && <div className="flex justify-end sm:col-span-2"><button type="button" onClick={() => { setDraft(profile); setSaved(false); setEditing(true); }} aria-label="Edit profile" title="Edit profile" className="grid h-9 w-9 place-items-center rounded-lg border border-[#303745] text-gray-300 hover:border-[#77e5ad] hover:text-[#77e5ad]"><Pencil size={16}/></button></div>}
    <ProfileField label="First name" value={draft.firstName} onChange={value => update("firstName", value)} disabled={!editing} required/>
    <ProfileField label="Last name" value={draft.lastName} onChange={value => update("lastName", value)} disabled={!editing} required/>
    <ProfileField label="Email" value={draft.email} onChange={value => update("email", value)} disabled={!editing} required type="email"/>
    <ProfileField label="Phone" value={draft.phone} onChange={value => update("phone", value)} disabled={!editing} required type="tel"/>
    <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
      {editing && <><button type="submit" className="btn primary sm:w-fit"><Check size={17}/>Save changes</button><button type="button" onClick={() => { setDraft(profile); setEditing(false); setSaved(false); }} className="btn secondary"><X size={17}/>Cancel</button></>}
      {saved && <span role="status" className="flex items-center gap-2 text-sm font-bold text-[#77e5ad]"><Check size={16}/>Profile saved</span>}
    </div>
  </form>;
}

function AddressCard() {
  const [address, setAddress] = useState(defaultAddress);
  const [draft, setDraft] = useState(defaultAddress);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kada-tech-profile-address");
      if (stored) { const next = { ...defaultAddress, ...JSON.parse(stored) }; setAddress(next); setDraft(next); }
    } catch { /* Keep the default address if saved data is invalid. */ }
  }, []);

  const update = (key: keyof Address, value: string) => setDraft(current => ({ ...current, [key]: value }));
  const saveAddress = (event: React.FormEvent) => {
    event.preventDefault();
    const next = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim()])) as Address;
    setAddress(next); setDraft(next); localStorage.setItem("kada-tech-profile-address", JSON.stringify(next)); setEditing(false); setSaved(true);
  };

  return <div className="panel mt-6 max-w-2xl p-5 sm:p-6">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2"><MapPin size={18} className="text-[#77e5ad]"/><b>{editing ? "Edit address" : address.label}</b></div>
      {!editing && <button onClick={() => { setDraft(address); setSaved(false); setEditing(true); }} aria-label="Edit address" title="Edit address" className="grid h-9 w-9 place-items-center rounded-lg border border-[#303745] text-gray-300 hover:border-[#77e5ad] hover:text-[#77e5ad]"><Pencil size={16}/></button>}
    </div>
    {editing ? <form onSubmit={saveAddress} className="mt-5 grid gap-4 sm:grid-cols-2">
      <AddressField label="Address label" value={draft.label} onChange={value => update("label", value)}/>
      <AddressField label="Street address" value={draft.street} onChange={value => update("street", value)} required/>
      <AddressField label="City" value={draft.city} onChange={value => update("city", value)} required/>
      <AddressField label="Province" value={draft.province} onChange={value => update("province", value)} required/>
      <AddressField label="Postal code" value={draft.postal} onChange={value => update("postal", value)} required inputMode="numeric" pattern="[0-9]{4}"/>
      <AddressField label="Country" value={draft.country} onChange={value => update("country", value)} required/>
      <div className="flex flex-wrap gap-3 sm:col-span-2"><button type="submit" className="btn primary"><Check size={17}/>Save address</button><button type="button" onClick={() => { setDraft(address); setEditing(false); }} className="btn secondary"><X size={17}/>Cancel</button></div>
    </form> : <><p className="muted mt-3 text-sm leading-6">{address.street}<br/>{address.city}, {address.province} {address.postal}<br/>{address.country}</p>{saved && <p role="status" className="mt-4 flex items-center gap-2 text-sm font-bold text-[#77e5ad]"><Check size={16}/>Address saved</p>}</>}
  </div>;
}

function AddressField({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void } & Pick<React.InputHTMLAttributes<HTMLInputElement>, "required" | "inputMode" | "pattern">) {
  return <label className="text-sm"><b className="mb-2 block">{label}</b><input {...props} className="field" value={value} onChange={event => onChange(event.target.value)}/></label>;
}
function ProfileField({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void } & Pick<React.InputHTMLAttributes<HTMLInputElement>, "required" | "type" | "disabled">) { return <label className={`text-sm ${props.disabled ? "text-gray-500" : ""}`}><b className="mb-2 block">{label}</b><input {...props} className="field disabled:cursor-not-allowed disabled:border-[#1b202a] disabled:bg-[#090c11] disabled:text-gray-500" value={value} onChange={event => onChange(event.target.value)}/></label>; }
function Orders() { return <div className="mt-6 space-y-3">{[["NG-260818", "Processing", "₱12,498"], ["NG-260714", "Delivered", "₱7,499"], ["NG-260521", "Cancelled", "₱2,999"]].map(order => <Link href="/orders" key={order[0]} className="panel flex items-center justify-between p-5 hover:border-[#77e5ad]"><div><b>{order[0]}</b><p className="muted mt-1 text-xs">{order[1]} · 2 items</p></div><div className="flex items-center gap-3"><b>{order[2]}</b><ChevronRight size={17}/></div></Link>)}</div>; }
function Toggle({ label }: { label: string }) { return <label className="flex justify-between border-b border-[#252c38] py-3"><span>{label}</span><input type="checkbox" defaultChecked className="accent-[#77e5ad]"/></label>; }
