"use client";

import { getAccountData, getFullAccountData } from "@/backend/accountData";
import { convertToAccountPageType } from "@/backend/converters";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import { AccountPageType } from "@/types/pagetypes";
import { useConnection } from "@solana/wallet-adapter-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountInfo() {
  const { solanaAccount, setSolanaAccount } = useSolanaAccount();
  const [accountData, setAccountData] = useState<AccountPageType>();

  const { connection } = useConnection();
  const params = useParams();

  useEffect(() => {
    async function getData() {
      let fullSolanaAccount;
      if (solanaAccount) {
        fullSolanaAccount = await getAccountData(
          connection,
          solanaAccount.pubkey,
          solanaAccount
        );
      } else {
        fullSolanaAccount = await getFullAccountData(
          connection,
          params.pubkey as string
        );
      }
      setSolanaAccount(fullSolanaAccount ? fullSolanaAccount : null);
      if (fullSolanaAccount) {
        setAccountData(convertToAccountPageType(fullSolanaAccount));
      }
    }
    getData();
  }, []);

  return accountData ? (
    <div className="flex flex-col p-5 items-center">
      <div className="flex p-2 items-center justify-start">
        <h2>{accountData.pubkey}</h2>
        <h3>ACCOUNT INFO</h3>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>SOL stanje</p>
        <p>{accountData.balance}</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>IZVRŠIV</p>
        <p>{accountData.executable}</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>Owner</p>
        <p>{accountData.owner}</p>
      </div>
    </div>
  ) : null;
}
