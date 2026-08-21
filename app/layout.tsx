import "./globals.css";import "./responsive.css";import {StoreProvider} from "@/components/store";import {Navbar} from "@/components/navbar";import {Footer} from "@/components/footer";import {NavigationTools} from "@/components/navigation-tools";
export const metadata={title:"KADA Tech | Tech for Every Setup.",description:"Premium gaming and technology gear in the Philippines."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><StoreProvider><Navbar/><main>{children}</main><Footer/><NavigationTools/></StoreProvider></body></html>}
