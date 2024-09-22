"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Header() {
  return (
    <header className="flex text-white bg-fuchsia-900 items-center justify-between p-6">
      <h1 className="text-2xl font-bold font-serif">SOL SEARCHER</h1>
      <WalletMultiButton />
    </header>
  );
}
