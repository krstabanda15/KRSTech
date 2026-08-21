"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, CreditCard, LoaderCircle, Lock, PackageCheck, MapPin, Plus, QrCode, RotateCcw, ShieldCheck, ShoppingBag, Smartphone } from "lucide-react";
import { useStore } from "@/components/store";
import { products } from "@/data/products";
import { peso } from "@/lib/helpers";

const steps = ["Contact", "Shipping", "Delivery", "Payment", "Review"];
type Contact = { email: string; phone: string };
type Address = { id: string; label: string; firstName: string; lastName: string; street: string; city: string; postal: string; isDefault: boolean };
type SavedProfile = { contact: Contact; addresses: Address[] };
type CardDetails = { number: string; name: string; expiry: string; cvv: string };
const blankAddress: Address = { id: "", label: "Home", firstName: "", lastName: "", street: "", city: "Bacolod City", postal: "6100", isDefault: false };
const blankCard: CardDetails = { number: "", name: "", expiry: "", cvv: "" };

function createAddressId() {
  return globalThis.crypto?.randomUUID?.() ?? `address-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function estimatedDate(days: number) { const date = new Date(); date.setDate(date.getDate() + days); return date.toLocaleDateString("en-PH", { weekday: "long", month: "short", day: "numeric" }); }

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState<Contact>({ email: "", phone: "" });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState<Address>(blankAddress);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addingAddress, setAddingAddress] = useState(true);
  const [delivery, setDelivery] = useState("Standard");
  const [payment, setPayment] = useState("GCash / Maya");
  const [card, setCard] = useState<CardDetails>(blankCard);
  const [wallet, setWallet] = useState("GCash");
  const [walletPhone, setWalletPhone] = useState("");
  const [walletPaid, setWalletPaid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const { cart, clearCart, ready } = useStore();
  const subtotal = cart.reduce((sum, item) => sum + (products.find(product => product.id === item.id)?.price || 0) * item.qty, 0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("kada-tech-checkout-profile") || "null") as SavedProfile | null;
      if (!saved) return;
      setContact(saved.contact);
      setAddresses(saved.addresses);
      const preferred = saved.addresses.find(item => item.isDefault) || saved.addresses[0];
      if (preferred) { setSelectedAddressId(preferred.id); setAddress(preferred); setAddingAddress(false); }
    } catch { /* Ignore malformed local demo data. */ }
  }, []);

  const validateContact = () => {
    const next: Record<string, string> = {};
    if (!contact.email.trim()) next.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(contact.email)) next.email = "Enter a valid email address.";
    if (!contact.phone.trim()) next.phone = "Mobile number is required.";
    else if (!/^(\+63|0)\d{10}$/.test(contact.phone.replace(/[\s-]/g, ""))) next.phone = "Enter a valid Philippine mobile number.";
    setErrors(next); return !Object.keys(next).length;
  };

  const validateAddress = () => {
    if (!addingAddress && selectedAddressId) return true;
    const next: Record<string, string> = {};
    if (!address.firstName.trim()) next.firstName = "First name is required.";
    if (!address.lastName.trim()) next.lastName = "Last name is required.";
    if (!address.street.trim()) next.street = "Street address is required.";
    if (!address.city.trim()) next.city = "City is required.";
    if (!/^\d{4}$/.test(address.postal)) next.postal = "Enter a valid 4-digit postal code.";
    setErrors(next); return !Object.keys(next).length;
  };

  const validatePayment = () => {
    if (payment === "Cash on Delivery") return true;
    const next: Record<string, string> = {};
    if (payment === "Card") {
      const number = card.number.replace(/[^0-9]/g, "");
      if (number.length < 13 || number.length > 19) next.cardNumber = "Enter a valid card number.";
      if (!card.name.trim()) next.cardName = "Name on card is required.";
      if (!/^(0[1-9]|1[0-2])[/][0-9]{2}$/.test(card.expiry)) next.cardExpiry = "Use MM/YY format.";
      else {
        const [month, year] = card.expiry.split("/").map(Number);
        if (new Date(2000 + year, month) <= new Date()) next.cardExpiry = "This card has expired.";
      }
      if (!/^[0-9]{3,4}$/.test(card.cvv)) next.cardCvv = "Enter the 3 or 4-digit security code.";
    } else {
      const phone = walletPhone.replace(/[^0-9+]/g, "");
      if (!/^([+]63|0)[0-9]{10}$/.test(phone)) next.walletPhone = "Enter the mobile number linked to your wallet.";
      if (!walletPaid) next.walletPaid = `Confirm the payment in ${wallet} before continuing.`;
    }
    setErrors(next); return !Object.keys(next).length;
  };

  const saveProfile = (nextAddresses = addresses) => localStorage.setItem("kada-tech-checkout-profile", JSON.stringify({ contact, addresses: nextAddresses }));

  const continueCheckout = () => {
    if (step === 0) { if (!validateContact()) return; saveProfile(); }
    if (step === 1) {
      if (!validateAddress()) return;
      if (addingAddress) {
        const newAddress = { ...address, id: createAddressId(), isDefault: address.isDefault || addresses.length === 0 };
        const normalized = newAddress.isDefault ? addresses.map(item => ({ ...item, isDefault: false })) : addresses;
        const next = [...normalized, newAddress];
        setAddresses(next); setAddress(newAddress); setSelectedAddressId(newAddress.id); setAddingAddress(false); saveProfile(next);
      } else saveProfile();
    }
    if (step === 3 && !validatePayment()) return;
    if (step === 4) {
      setProcessing(true);
      window.setTimeout(() => { clearCart(); setProcessing(false); setStep(5); }, 800);
      return;
    }
    setErrors({}); setStep(current => current + 1);
  };

  const chooseAddress = (item: Address) => { setSelectedAddressId(item.id); setAddress(item); setAddingAddress(false); setErrors({}); };
  const setDefault = (id: string) => { const next = addresses.map(item => ({ ...item, isDefault: item.id === id })); setAddresses(next); saveProfile(next); };

  if (step === 5) return <div className="container py-24 text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#77e5ad] text-black"><PackageCheck size={38} /></div><p className="eyebrow mt-7">Order confirmed</p><h1 className="mt-2 text-4xl font-black">Your gear is locked in.</h1><p className="muted mx-auto mt-4 max-w-lg">Order NG-260818 is being prepared. Your contact and shipping details are saved for next time.</p><Link href="/orders" className="btn primary mt-7">Track your order</Link></div>;
  if (ready && !cart.length) return <div className="container py-24 text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-[#303745] bg-[#10141c] text-[#77e5ad]"><ShoppingBag size={36} /></div><p className="eyebrow mt-7">Checkout</p><h1 className="mt-2 text-4xl font-black">Your cart is empty.</h1><p className="muted mx-auto mt-4 max-w-lg">Add something to your cart before starting checkout.</p><Link href="/shop" className="btn primary mt-7">Browse products</Link></div>;

  return <div className="container py-12">
    <div className="flex items-center gap-2 text-xl font-black">Secure checkout <Lock className="text-[#77e5ad]" size={18} /></div>
    <div className="mt-8 flex overflow-auto">{steps.map((item, index) => <div key={item} className={`flex flex-1 items-center whitespace-nowrap text-xs ${index <= step ? "text-white" : "text-gray-600"}`}><span className={`mr-2 grid h-7 w-7 place-items-center rounded-full ${index < step ? "bg-[#77e5ad] text-black" : index === step ? "border border-[#77e5ad] text-[#77e5ad]" : "border border-[#303745]"}`}>{index < step ? <Check size={14} /> : index + 1}</span>{item}{index < steps.length - 1 && <span className={`mx-3 h-px min-w-5 flex-1 ${index < step ? "bg-[#77e5ad]" : "bg-[#303745]"}`} />}</div>)}</div>
    <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_360px]">
      <section className="panel p-6 sm:p-8">
        <h1 className="text-2xl font-black">{steps[step]}</h1><p className="muted mt-1 text-sm">Contact and saved-address details stay in this browser for faster demo checkout next time.</p>
        <div className="mt-7">
          {step === 0 && <div className="grid gap-4"><Field label="Email address" required value={contact.email} onChange={value => setContact({ ...contact, email: value })} placeholder="kim@example.com" error={errors.email} type="email" /><Field label="Mobile number" required value={contact.phone} onChange={value => setContact({ ...contact, phone: value })} placeholder="+63 917 123 4567" error={errors.phone} /></div>}
          {step === 1 && <Shipping addresses={addresses} address={address} selectedId={selectedAddressId} adding={addingAddress} errors={errors} onChoose={chooseAddress} onAdd={() => { setAddingAddress(true); setAddress(blankAddress); setSelectedAddressId(""); }} onAddress={setAddress} onDefault={setDefault} />}
          {step === 2 && <ChoiceGroup value={delivery} onChange={setDelivery} options={[{ value: "Standard", title: "Standard delivery", detail: `Arrives by ${estimatedDate(5)} · Free` }, { value: "Express", title: "Express delivery", detail: `Arrives by ${estimatedDate(2)} · ₱299` }]} />}
          {step === 3 && <div className="space-y-6">
            <ChoiceGroup value={payment} onChange={value => { setPayment(value); setErrors({}); }} options={[{ value: "Card", title: "Credit / Debit Card", detail: "Visa, Mastercard, or JCB" }, { value: "GCash / Maya", title: "GCash / Maya", detail: "Scan a QR code or confirm using your mobile wallet" }, { value: "Cash on Delivery", title: "Cash on Delivery", detail: "Pay when your order arrives" }]} />
            {payment === "Card" && <CardPayment card={card} errors={errors} onChange={setCard} />}
            {payment === "GCash / Maya" && <WalletPayment wallet={wallet} phone={walletPhone} paid={walletPaid} errors={errors} onWallet={value => { setWallet(value); setWalletPaid(false); setErrors({}); }} onPhone={value => { setWalletPhone(value); setWalletPaid(false); }} onPaid={() => { setWalletPaid(true); setErrors(current => ({ ...current, walletPaid: "" })); }} />}
            {payment === "Cash on Delivery" && <div className="rounded-xl border border-[#303745] bg-[#0c1016] p-4 text-sm"><b>No payment needed now.</b><p className="muted mt-1">Please prepare the exact amount when your order arrives.</p></div>}
            <div className="grid gap-3 sm:grid-cols-3"><Trust icon={Lock} label="Secure checkout" /><Trust icon={RotateCcw} label="14-day returns" /><Trust icon={ShieldCheck} label="2-year warranty" /></div>
            <p className="muted text-xs">Demo checkout only. Payment details stay on this page and are not sent to a payment processor.</p>
          </div>}
          {step === 4 && <div className="space-y-4"><Review title="Contact" value={`${contact.email} · ${contact.phone}`} onEdit={() => setStep(0)} /><Review title="Ship to" value={`${address.firstName} ${address.lastName} · ${address.street}, ${address.city} ${address.postal}`} onEdit={() => setStep(1)} /><Review title="Delivery" value={`${delivery} delivery${delivery === "Standard" ? " · Free" : " · ₱299"}`} onEdit={() => setStep(2)} /><Review title="Payment" value={payment === "Card" ? `Card ending in ${card.number.replace(/[^0-9]/g, "").slice(-4)}` : payment === "GCash / Maya" ? `${wallet} · ${maskPhone(walletPhone)}` : payment} onEdit={() => setStep(3)} /></div>}
        </div>
        <div className="mt-8 flex justify-between"><button disabled={!step || processing} onClick={() => { setErrors({}); setStep(current => current - 1); }} className="btn secondary disabled:invisible">Back</button><button disabled={processing} onClick={continueCheckout} className="btn primary disabled:cursor-wait disabled:opacity-70">{processing ? <><LoaderCircle className="animate-spin" size={17} />Placing order...</> : <>{step === 4 ? "Place demo order" : "Continue"}<ChevronRight size={17} /></>}</button></div>
      </section>
      <OrderSummary cart={cart} subtotal={subtotal} delivery={delivery} />
    </div>
  </div>;
}

function Shipping({ addresses, address, selectedId, adding, errors, onChoose, onAdd, onAddress, onDefault }: { addresses: Address[]; address: Address; selectedId: string; adding: boolean; errors: Record<string, string>; onChoose: (item: Address) => void; onAdd: () => void; onAddress: (item: Address) => void; onDefault: (id: string) => void }) {
  return <div>{addresses.length > 0 && <><div className="mb-3 flex items-center justify-between"><b className="text-sm">Saved addresses</b><span className="muted text-xs">Choose where to deliver</span></div><div className="grid gap-3 sm:grid-cols-2">{addresses.map(item => <div key={item.id} className={`relative rounded-xl border p-4 ${!adding && selectedId === item.id ? "border-[#77e5ad] bg-[#77e5ad]/10 ring-1 ring-[#77e5ad]" : "border-[#303745]"}`}><button onClick={() => onChoose(item)} className="w-full text-left"><div className="flex items-center gap-2"><MapPin className="text-[#77e5ad]" size={17} /><b>{item.label}</b>{item.isDefault && <span className="badge">DEFAULT</span>}{!adding && selectedId === item.id && <Check className="ml-auto text-[#77e5ad]" size={18} />}</div><p className="muted mt-3 text-sm leading-6">{item.firstName} {item.lastName}<br />{item.street}<br />{item.city} {item.postal}</p></button>{!item.isDefault && <button onClick={() => onDefault(item.id)} className="mt-3 text-xs font-bold text-[#77e5ad]">Set as default</button>}</div>)}</div><button onClick={onAdd} className="btn secondary mt-4"><Plus size={17} />Add another address</button></>}
    {(adding || !addresses.length) && <div className={addresses.length ? "mt-7 border-t border-[#303745] pt-7" : ""}><h3 className="mb-4 font-bold">{addresses.length ? "New address" : "Shipping address"}</h3><div className="grid gap-4 sm:grid-cols-2"><Field label="Address label" value={address.label} onChange={value => onAddress({ ...address, label: value })} placeholder="Home" /><Field label="First name" required value={address.firstName} onChange={value => onAddress({ ...address, firstName: value })} placeholder="Kim Reuben" error={errors.firstName} /><Field label="Last name" required value={address.lastName} onChange={value => onAddress({ ...address, lastName: value })} placeholder="Tabanda" error={errors.lastName} /><div className="sm:col-span-2"><Field label="Street address" required value={address.street} onChange={value => onAddress({ ...address, street: value })} placeholder="123 Sample Street" error={errors.street} /></div><Field label="City" required value={address.city} onChange={value => onAddress({ ...address, city: value })} placeholder="Bacolod City" error={errors.city} /><Field label="Postal code" required value={address.postal} onChange={value => onAddress({ ...address, postal: value })} placeholder="6100" error={errors.postal} /><label className="flex items-center gap-3 text-sm sm:col-span-2"><input type="checkbox" checked={address.isDefault} onChange={event => onAddress({ ...address, isDefault: event.target.checked })} className="accent-[#77e5ad]" />Use as my default shipping address</label></div></div>}
  </div>;
}

function CardPayment({ card, errors, onChange }: { card: CardDetails; errors: Record<string, string>; onChange: (card: CardDetails) => void }) {
  const formatNumber = (value: string) => value.replace(/[^0-9]/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (value: string) => {
    const digits = value.replace(/[^0-9]/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };
  return <div className="rounded-2xl border border-[#303745] bg-[#0c1016] p-5 sm:p-6">
    <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#77e5ad]/10 text-[#77e5ad]"><CreditCard size={21} /></span><div><b>Enter card details</b><p className="muted text-xs">Your card will only be used for this checkout.</p></div></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><Field label="Card number" required value={card.number} onChange={value => onChange({ ...card, number: formatNumber(value) })} placeholder="1234 5678 9012 3456" error={errors.cardNumber} /></div>
      <div className="sm:col-span-2"><Field label="Name on card" required value={card.name} onChange={value => onChange({ ...card, name: value })} placeholder="JUAN DELA CRUZ" error={errors.cardName} /></div>
      <Field label="Expiry date" required value={card.expiry} onChange={value => onChange({ ...card, expiry: formatExpiry(value) })} placeholder="MM/YY" error={errors.cardExpiry} />
      <Field label="Security code" required value={card.cvv} onChange={value => onChange({ ...card, cvv: value.replace(/[^0-9]/g, "").slice(0, 4) })} placeholder="CVV" error={errors.cardCvv} type="password" />
    </div>
  </div>;
}

function WalletPayment({ wallet, phone, paid, errors, onWallet, onPhone, onPaid }: { wallet: string; phone: string; paid: boolean; errors: Record<string, string>; onWallet: (wallet: string) => void; onPhone: (phone: string) => void; onPaid: () => void }) {
  const phoneIsValid = /^([+]63|0)[0-9]{10}$/.test(phone.replace(/[^0-9+]/g, ""));
  return <div className="rounded-2xl border border-[#303745] bg-[#0c1016] p-5 sm:p-6">
    <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#77e5ad]/10 text-[#77e5ad]"><Smartphone size={21} /></span><div><b>Pay with your mobile wallet</b><p className="muted text-xs">Choose your wallet, then scan or confirm on your phone.</p></div></div>
    <div className="mb-5 grid grid-cols-2 gap-3">{["GCash", "Maya"].map(item => <button key={item} onClick={() => onWallet(item)} className={`rounded-xl border px-4 py-3 font-bold ${wallet === item ? "border-[#77e5ad] bg-[#77e5ad]/10 text-[#77e5ad]" : "border-[#303745]"}`}>{item}</button>)}</div>
    <Field label={`${wallet} mobile number`} required value={phone} onChange={onPhone} placeholder="+63 917 123 4567" error={errors.walletPhone} />
    <div className="mt-5 grid items-center gap-5 rounded-xl border border-[#303745] p-4 sm:grid-cols-[132px_1fr]">
      <div className="relative mx-auto grid h-32 w-32 place-items-center rounded-xl bg-white text-black"><QrCode size={92} strokeWidth={1.8} /><span className="absolute rounded bg-white px-1 text-[9px] font-black">{wallet}</span></div>
      <div><b>Scan to authorize</b><p className="muted mt-1 text-sm">Open {wallet}, scan the code, and approve the payment. For this demo, use the confirmation button after entering your number.</p><button disabled={!phoneIsValid || paid} onClick={onPaid} className="btn primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50">{paid ? <><Check size={17} />Payment authorized</> : "I’ve approved the payment"}</button></div>
    </div>
    {errors.walletPaid && <p className="mt-3 text-xs text-red-400">{errors.walletPaid}</p>}
  </div>;
}

function maskPhone(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  return digits.length >= 4 ? `••••••${digits.slice(-4)}` : value;
}

function ChoiceGroup({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: { value: string; title: string; detail: string }[] }) {
  return <div className="grid gap-3">{options.map(option => { const selected = value === option.value; return <button onClick={() => onChange(option.value)} className={`flex items-center justify-between rounded-2xl border p-5 text-left transition ${selected ? "border-[#77e5ad] bg-[#77e5ad]/10 ring-1 ring-[#77e5ad]" : "border-[#303745] hover:border-[#596273]"}`} key={option.value}><div><b className={selected ? "text-[#77e5ad]" : ""}>{option.title}</b><p className="muted mt-1 text-sm">{option.detail}</p></div><span className={`grid h-6 w-6 place-items-center rounded-full border ${selected ? "border-[#77e5ad] bg-[#77e5ad] text-black" : "border-[#596273]"}`}>{selected && <Check size={14} />}</span></button>})}</div>;
}

function Field({ label, value, onChange, placeholder, error, required, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; error?: string; required?: boolean; type?: string }) {
  const id = useId(); const errorId = `${id}-error`;
  const autocomplete = label === "Email address" ? "email" : label === "Mobile number" ? "tel" : label === "First name" ? "given-name" : label === "Last name" ? "family-name" : label === "Street address" ? "street-address" : label === "City" ? "address-level2" : label === "Postal code" ? "postal-code" : label === "Card number" ? "cc-number" : label === "Name on card" ? "cc-name" : label === "Expiry date" ? "cc-exp" : label === "Security code" ? "cc-csc" : undefined;
  return <label htmlFor={id} className="text-sm"><b className="mb-2 block">{label}{required && <span className="ml-1 text-red-400">*</span>}</b><input id={id} required={required} autoComplete={autocomplete} inputMode={["Mobile number", "Card number", "Expiry date", "Security code", "Postal code"].includes(label) ? "numeric" : undefined} type={type} value={value} onChange={event => onChange(event.target.value)} aria-invalid={!!error} aria-describedby={error ? errorId : undefined} className={`field ${error ? "!border-red-400" : ""}`} placeholder={placeholder} />{error && <span id={errorId} role="alert" className="mt-2 block text-xs text-red-400">{error}</span>}</label>;
}

function Trust({ icon: Icon, label }: { icon: typeof Lock; label: string }) { return <div className="flex items-center gap-2 rounded-xl border border-[#303745] p-3 text-xs"><Icon size={16} className="shrink-0 text-[#77e5ad]" /><b>{label}</b></div>; }

function Review({ title, value, onEdit }: { title: string; value: string; onEdit: () => void }) { return <div className="panel flex items-start justify-between gap-4 p-4"><div><span className="eyebrow">{title}</span><p className="mt-1">{value}</p></div><button onClick={onEdit} className="text-xs font-bold text-[#77e5ad]">Edit</button></div>; }
function OrderSummary({ cart, subtotal, delivery }: { cart: { id: string; qty: number }[]; subtotal: number; delivery: string }) { const shipping = delivery === "Express" ? 299 : 0; return <aside className="panel h-fit p-6"><h2 className="font-bold">Order summary</h2><div className="my-5 space-y-3">{cart.map(item => { const product = products.find(product => product.id === item.id); return product ? <div className="flex justify-between text-sm" key={item.id}><span className="muted">{item.qty}× {product.name}</span><b>{peso(product.price * item.qty)}</b></div> : null; })}</div><div className="border-t border-[#303745] pt-4"><div className="flex justify-between"><span className="muted">Shipping</span><span>{shipping ? peso(shipping) : "Free"}</span></div><div className="mt-4 flex justify-between text-xl"><b>Total</b><b>{peso(subtotal + shipping)}</b></div></div></aside>; }
