"use client";

import Input from "./components/common/input";
import { getAccountData } from "./backend/accountData";
import { useConnection } from "@solana/wallet-adapter-react";
import { useSolanaAccount } from "./components/contexts/SolanaAccountContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { connection } = useConnection();
  const router = useRouter();
  const { setSolanaAccount } = useSolanaAccount();

  const onClick = async (pubkey: string) => {
    const accountData = await getAccountData(connection, pubkey);
    if (accountData) {
      setSolanaAccount(accountData);
    }
    if (accountData && accountData.space === null) {
      router.push(`/nft/${pubkey}`);
    }
    if (accountData && accountData.space === 0) {
      router.push(`/account/${pubkey}`);
    }
  };

  return (
    <main className="flex flex-col m-auto">
      <Input onClick={onClick} />
    </main>
  );
}
