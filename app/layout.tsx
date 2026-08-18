import "./globals.css";import {StoreProvider} from "@/components/store";import {Navbar} from "@/components/navbar";import {Footer} from "@/components/footer";
export const metadata={title:"KRSTech | Upgrade Your Experience.",description:"Premium gaming and technology gear in the Philippines."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><StoreProvider><Navbar/><main>{children}</main><Footer/></StoreProvider></body></html>}
