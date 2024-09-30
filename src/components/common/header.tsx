"use client";
import Input from "../Input";
import { useConnection } from "@solana/wallet-adapter-react";
import { useSolanaAccount } from "../contexts/SolanaAccountContext";
import { getAccountInfo } from "@/backend/accountData";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const { connection } = useConnection();
  const router = useRouter();
  const { solanaAccount, setSolanaAccount } = useSolanaAccount();

  const onClick = async (pubkey: string) => {
    if (pubkey.length > 60) {
      const tx = await connection.getParsedTransaction(pubkey, {
        commitment: "finalized",
        maxSupportedTransactionVersion: 0,
      });
      router.push(`/transaction/${pubkey}`);
      return;
    }
    const accountData = await getAccountInfo(connection, pubkey);
    if (accountData) {
      setSolanaAccount(accountData);
    }
  };

  useEffect(() => {
    if (solanaAccount) {
      if (solanaAccount.space === null) {
        router.push(`/nft/${solanaAccount.pubkey}`);
        return;
      }
      if (solanaAccount.space === 0) {
        router.push(`/account/${solanaAccount.pubkey}`);
        return;
      }

      if (
        solanaAccount.executable ||
        solanaAccount.data?.parsed?.infoExecutableData !== null
      ) {
        router.push(`/program/${solanaAccount.pubkey}`);
        return;
      }
      if (
        solanaAccount.data.parsed.info &&
        solanaAccount.data.parsed.info.tokenAmount &&
        solanaAccount.data.parsed.info.tokenAmount.decimals === 0
      ) {
        router.push(`/nft/${solanaAccount.pubkey}`);
        return;
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
          return;
        } else {
          router.push(`/token/${solanaAccount.pubkey}`);
          return;
        }
      }

      router.push(`/token/${solanaAccount.pubkey}`);
      return;
    }
  }, [solanaAccount?.pubkey]);

  return (
    <header className="flex text-white bg-darker items-center justify-between p-4 border-b border-border">
      <div>
        <a href="/">
          <Image
            width={236}
            height={50}
            src="/images/solsearchLogo.svg"
            alt="Solsearch Logo"
          />
        </a>
      </div>

      <Input onClick={onClick} />
    </header>
  );
}
