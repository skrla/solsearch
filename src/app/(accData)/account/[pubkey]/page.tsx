"use client";

import { getAccountData, getFullAccountData } from "@/backend/accountData";
import { convertToAccountPageType } from "@/backend/converters";
import AccountData from "@/components/accounts/AccountData";
import AccountDataGroup from "@/components/accounts/AccountDataGroup";
import AccountDataRow from "@/components/accounts/AccountDataRow";
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
    <AccountDataGroup>
      <AccountDataRow>
        <AccountData pubkey={accountData.pubkey} title="Pubkey" />
      </AccountDataRow>
      <AccountDataRow>
        <AccountData name={accountData.balance.toString()} title="Balance" />
      </AccountDataRow>
      <AccountDataRow>
        <AccountData pubkey={accountData.owner} title="Owner pubkey" />
      </AccountDataRow>
      <AccountDataRow>
        <AccountData boolean={accountData.executable} title="Executable" />
      </AccountDataRow>
      <AccountDataRow>
        <AccountData name="Account" title="Type" />
      </AccountDataRow>
    </AccountDataGroup>
  ) : null;

}
