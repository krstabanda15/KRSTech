import type { Metadata } from "next";
import { NFCStudio } from "@/components/nfc-studio";
export const metadata:Metadata={title:"KADA Custom NFC Studio | KADA Tech",description:"Design a personalized NFC card, bracelet, keychain, tag, or desk stand with free NFC programming."};
export default function Page(){return <NFCStudio/>}
