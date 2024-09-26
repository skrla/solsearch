"use client";

import { convertToAccountPageType } from "@/backend/converters";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import { AccountPageType } from "@/types/pagetypes";
import { useEffect, useState } from "react";

export default function AccountInfo() {
  const { solanaAccount } = useSolanaAccount();
  const [accountData, setAccountData] = useState<AccountPageType>();

  useEffect(() => {
    if (solanaAccount) {
      setAccountData(convertToAccountPageType(solanaAccount));
    }
  }, [accountData?.pubkey]);

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
