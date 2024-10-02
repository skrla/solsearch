import "./globals.css";
import AppWalletProvider from "../components/contexts/AppWalletProvider";
import Header from "../components/common/header";
import Footer from "../components/common/Footer";
import { SolanaAccountProvider } from "../components/contexts/SolanaAccountContext";
import { Metadata } from "next";
import { Lato } from "next/font/google";

export const metadata: Metadata = {
  title: "SolSearch",
  description: "Search solana blockchain",
  applicationName: "SolSearch",
};

const lato = Lato({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.className} bg-darker min-h-screen m-0 relative after:block after:content-none after:h-16`}
      >
        <AppWalletProvider>
          <SolanaAccountProvider>
            <Header />
            {children}
          </SolanaAccountProvider>
          <Footer />
        </AppWalletProvider>
      </body>
    </html>
  );
}
