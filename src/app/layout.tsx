import "./globals.css";
import AppWalletProvider from "../components/contexts/AppWalletProvider";
import Header from "../components/common/header";
import Footer from "../components/common/Footer";
import { SolanaAccountProvider } from "../components/contexts/SolanaAccountContext";
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
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
``;
