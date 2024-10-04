"use client";

import {
  delay,
  getAccountData,
  getAssetsByOwner,
  getFullAccountData,
  getTransactions,
} from "@/backend/accountData";
import { convertToAccountPageType } from "@/backend/converters";
import { convertToTransactionType } from "@/backend/transactionConverter";
import AccountData from "@/components/accounts/AccountData";
import AccountDataGroup from "@/components/accounts/AccountDataGroup";
import AccountDataRow from "@/components/accounts/AccountDataRow";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import SwiperData from "@/components/SwiperData";
import Title from "@/components/Title";
import TransactionTable from "@/components/TransactionTable";
import { AccountAssets, AccountPageType } from "@/types/pagetypes";
import { TransactionType } from "@/types/transaction";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountInfo() {
  const { solanaAccount, setSolanaAccount } = useSolanaAccount();
  const [accountData, setAccountData] = useState<AccountPageType>();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

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
        const assets: AccountAssets | null = await getAssetsByOwner(
          connection,
          fullSolanaAccount.pubkey
        );
        setAccountData((prev) => ({
          ...prev!,
          assets,
        }));
        const convTrans = await getTransactions(
          connection,
          new PublicKey(fullSolanaAccount.pubkey)
        );
        const newTransactions: TransactionType[] = [...transactions];
        convTrans.forEach((t) => {
          newTransactions.push(t);
        });
        console.log(JSON.stringify(convTrans));

        setTransactions(newTransactions);
      }
    }
    getData();
  }, []);

  return accountData ? (
    <main className="flex flex-col xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto ">
      <Title title="Account" />
      <div className="w-full flex justify-center items-start">
        <AccountDataGroup>
          <AccountDataRow>
            <AccountData pubkey={accountData.pubkey} title="Pubkey" />
            <AccountData
              name={accountData.balance.toLocaleString()}
              title="Balance"
            />
            <AccountData name="Account" title="Type" />
          </AccountDataRow>
          <AccountDataRow>
            <AccountData pubkey={accountData.owner} title="Owner pubkey" />
            <AccountData boolean={accountData.executable} title="Executable" />
            <AccountData />
          </AccountDataRow>
        </AccountDataGroup>
      </div>
      {accountData.assets !== null && (
        <>
          {accountData.assets.assetsToken.length > 0 && (
            <div className="flex flex-col justify-center items-center xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto my-9 p-5 bg-dark">
              <Title title="TOKEN" />
              <div className="flex justify-center items-center xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto my-9">
                <SwiperData tokenAssets={accountData.assets.assetsToken} />
              </div>
            </div>
          )}
          {accountData.assets.assetsNft.length > 0 && (
            <div className="flex flex-col justify-center items-center xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto my-9 p-5 bg-dark">
              <Title title="NFT" />
              <div className="flex justify-center items-center xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto my-9">
                <SwiperData nftAssets={accountData.assets.assetsNft} />
              </div>
            </div>
          )}
        </>
      )}
      {transactions.length > 0 ? (
        <TransactionTable transactions={transactions} />
      ) : null}
    </main>
  ) : null;
}
