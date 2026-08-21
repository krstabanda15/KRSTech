import Link from "next/link";

const sections = [
  ["Information we collect", "We collect information you provide during checkout or when contacting support, such as your name, email, phone number, delivery address, and order details."],
  ["How we use it", "We use your information to process orders, provide customer support, improve the store experience, prevent fraud, and send updates you have requested."],
  ["Storage and sharing", "We only share information with service providers when needed to deliver or support your order. We do not sell your personal information."],
  ["Your choices", "You may ask to access, correct, or delete your personal information, or unsubscribe from promotional updates at any time."],
  ["Cookies and local storage", "The store uses browser storage to remember your cart, wishlist, comparison list, and preferences on your device."],
];

export default function PrivacyPage() {
  return <div className="container py-12"><div className="max-w-3xl"><p className="eyebrow">Your privacy</p><h1 className="mt-2 text-4xl font-black sm:text-5xl">Privacy policy</h1><p className="muted mt-3">Last updated August 19, 2026</p><p className="muted mt-6 leading-7">This policy explains how KADA Tech handles personal information when you browse the store, place an order, or contact us.</p><div className="mt-9 space-y-4">{sections.map(([title, detail]) => <section className="panel p-6" key={title}><h2 className="text-xl font-bold">{title}</h2><p className="muted mt-3 leading-7">{detail}</p></section>)}</div><p className="muted mt-7">Questions about this policy? <Link className="font-bold text-[#77e5ad]" href="/contact">Contact our support team</Link>.</p></div></div>;
}
