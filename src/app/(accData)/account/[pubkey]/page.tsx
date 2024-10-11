"use client";

import {
  getAccountData,
  getAssetsByOwner,
  getFullAccountData,
} from "@/backend/accountData";
import { convertToAccountPageType } from "@/backend/converters";
import AccountData from "@/components/accounts/AccountData";
import AccountDataGroup from "@/components/accounts/AccountDataGroup";
import AccountDataRow from "@/components/accounts/AccountDataRow";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import SwiperData from "@/components/SwiperData";
import Title from "@/components/Title";
import TransactionTable from "@/components/tables/TransactionTable";
import { AccountAssets, AccountPageType } from "@/types/pagetypes";
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
        const assets: AccountAssets | null = await getAssetsByOwner(
          connection,
          fullSolanaAccount.pubkey
        );
        setAccountData((prev) => ({
          ...prev!,
          assets,
        }));
      }
    }
    getData();
  }, []);

  return accountData ? (
    <main className="flex flex-col xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto my-9">
      <Title title="Account" />
      <div className="w-full flex justify-center items-start bg-dark">
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
            <div className="flex flex-col justify-center items-center xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto">
              <Title title="TOKENS" />
              <div className="flex justify-center items-center xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto my-9 p-10 bg-dark">
                <SwiperData tokenAssets={accountData.assets.assetsToken} />
              </div>
            </div>
          )}
          {accountData.assets.assetsNft.length > 0 && (
            <div className="flex flex-col justify-center items-center xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto my-9 ">
              <Title title="NFT" />
              <div className="flex justify-center items-center xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto my-9 p-10 bg-dark">
                <SwiperData nftAssets={accountData.assets.assetsNft} />
              </div>
            </div>
          )}
        </>
      )}
      <div className="flex justify-center items-center my-9">
        <TransactionTable />
      </div>
    </main>
  ) : null;
}
