"use client";
import Input from "./input";
import { useConnection } from "@solana/wallet-adapter-react";
import { useSolanaAccount } from "../../components/contexts/SolanaAccountContext";
import { getAccountInfo } from "@/backend/accountData";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { connection } = useConnection();
  const router = useRouter();
  const { solanaAccount, setSolanaAccount } = useSolanaAccount();

  const onClick = async (pubkey: string) => {
    const accountData = await getAccountInfo(connection, pubkey);
    if (accountData) {
      setSolanaAccount(accountData);
    }
  };

  useEffect(() => {
    if (solanaAccount) {
      if (solanaAccount.space === null) {
        router.push(`/nft/${solanaAccount.pubkey}`);
      }
      if (solanaAccount.space === 0) {
        router.push(`/account/${solanaAccount.pubkey}`);
      }
      if (solanaAccount.executable) {
        router.push(`/program/${solanaAccount.pubkey}`);
      }
      if (
        solanaAccount.data &&
        solanaAccount.data.parsed &&
        solanaAccount.data.parsed.infoMint &&
        "decimals" in solanaAccount.data.parsed.infoMint
      ) {
        const decimals = solanaAccount.data.parsed.infoMint.decimals;
        if (decimals === 0) {
          router.push(`/nft/${solanaAccount.pubkey}`);
        } else {
          router.push(`/token/${solanaAccount.pubkey}`);
        }
      } else {
        router.push(`/token/${solanaAccount.pubkey}`);
      }
    }
  }, [solanaAccount?.pubkey]);

  return (
    <header className="flex text-white bg-fuchsia-900 items-center justify-between p-6">
      <h1 className="text-2xl font-bold font-serif">SOL SEARCHER</h1>

      <Input onClick={onClick} />
    </header>
  );
}
