import { NFCProductType } from "@/types";

export function NFCProductShape({ type }: { type: NFCProductType }) {
  const card = type === "card" || type === "premium-card";
  return <svg viewBox="0 0 120 80" className="h-20 w-full" fill="none" aria-hidden="true">
    <ellipse cx="60" cy="72" rx="38" ry="4" fill="currentColor" opacity=".08" />
    <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      {card ? <>
        <rect x="15" y="12" width="90" height="56" rx="7" fill="currentColor" fillOpacity={type === "premium-card" ? ".18" : ".08"} />
        {type === "premium-card" && <path d="m20 16 79 47M38 13l65 40" opacity=".18" />}
        <path d="M27 48h30M27 56h19" opacity=".6" />
        <path d="M84 25a10 10 0 0 1 0 18m-5-14a6 6 0 0 1 0 10" strokeLinecap="round" />
      </> : type === "bracelet" || type === "couple" ? <>
        <ellipse cx={type === "couple" ? 48 : 60} cy="41" rx="35" ry="23" fill="currentColor" fillOpacity=".08" />
        <ellipse cx={type === "couple" ? 48 : 60} cy="37" rx="25" ry="14" />
        <rect x={type === "couple" ? 33 : 45} y="49" width="30" height="14" rx="5" fill="#173225" />
        {type === "couple" && <><ellipse cx="78" cy="38" rx="27" ry="20" fill="currentColor" fillOpacity=".12" /><ellipse cx="78" cy="34" rx="18" ry="11" /><rect x="66" y="46" width="24" height="12" rx="4" fill="#173225" /></>}
      </> : type === "stand" ? <>
        <path d="m39 11 42 5 7 46-43-4Z" fill="currentColor" fillOpacity=".12" />
        <path d="m45 58-13 10h56l-1-6M52 23l18 2M53 30l18 2M57 42l10 1" />
        <path d="m81 16 5-2 7 46-6 2" opacity=".5" />
      </> : type === "pet" ? <>
        <circle cx="60" cy="12" r="7" />
        <path d="M39 32c-10-13-23 0-14 11-9 11 4 24 14 11h42c10 13 23 0 14-11 9-11-4-24-14-11Z" fill="currentColor" fillOpacity=".12" />
        <circle cx="60" cy="27" r="3" /><path d="M49 43h22" opacity=".6" />
      </> : type === "keychain" ? <>
        <circle cx="60" cy="14" r="11" /><circle cx="60" cy="14" r="7" opacity=".5" />
        <rect x="39" y="28" width="42" height="40" rx="10" fill="currentColor" fillOpacity=".12" />
        <path d="M60 23v11M51 49h18M55 56h10" strokeLinecap="round" />
      </> : <>
        <circle cx="60" cy="12" r="8" />
        <path d="M38 27q22-13 44 0v19q-3 16-22 23-19-7-22-23Z" fill="currentColor" fillOpacity=".12" />
        <circle cx="60" cy="28" r="3" /><path d="M49 44h22M54 52h12" strokeLinecap="round" />
      </>}
    </g>
  </svg>;
}
