"use client";

import { getAccountData, getFullAccountData } from "@/backend/accountData";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import { useConnection } from "@solana/wallet-adapter-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountsData({
  children,
}: {
  children: React.ReactNode;
}) {
  const { solanaAccount, setSolanaAccount } = useSolanaAccount();
  const { connection } = useConnection();
  const params = useParams();

  useEffect(() => {
    async function getData() {
      if (solanaAccount) {
        const fullSolanaAccount = await getAccountData(
          connection,
          solanaAccount.pubkey,
          solanaAccount
        );
        setSolanaAccount(fullSolanaAccount ? fullSolanaAccount : null);
      } else {
        const fullSolanaAccount = await getFullAccountData(
          connection,
          params.pubkey as string
        );
        setSolanaAccount(fullSolanaAccount ? fullSolanaAccount : null);
      }
    }
    getData();
  }, [solanaAccount?.pubkey]);
  return <div className="p-10 w-full">{children}</div>;
}
