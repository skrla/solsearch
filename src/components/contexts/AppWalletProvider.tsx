"use client";
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import dynamic from "next/dynamic";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const network = WalletAdapterNetwork.Devnet;
  const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;

  //const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const endpoint = useMemo(
    () => "https://mainnet.helius-rpc.com/?api-key=" + apiKey,
    [apiKey]
  );
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ReactUIWalletModalProviderDynamic>
            {children}
          </ReactUIWalletModalProviderDynamic>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
