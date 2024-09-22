import "./globals.css";
import AppWalletProvider from "./components/contexts/AppWalletProvider";
import Header from "./components/common/header";
import Footer from "./components/common/footer";
import { SolanaAccountProvider } from "./components/contexts/SolanaAccountContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>
          <Header />
          <SolanaAccountProvider>{children}</SolanaAccountProvider>
          <Footer />
        </AppWalletProvider>
      </body>
    </html>
  );
}
``;
