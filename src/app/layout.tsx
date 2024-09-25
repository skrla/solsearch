import "./globals.css";
import AppWalletProvider from "../components/contexts/AppWalletProvider";
import Header from "./common/header";
import Footer from "./common/footer";
import { SolanaAccountProvider } from "../components/contexts/SolanaAccountContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
