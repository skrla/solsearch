"use client";
import { getAccountData, getFullAccountData } from "@/backend/accountData";
import { convertToTokenPageType } from "@/backend/converters";
import AccountData from "@/components/accounts/AccountData";
import AccountDataGroup from "@/components/accounts/AccountDataGroup";
import AccountDataRow from "@/components/accounts/AccountDataRow";
import MainInfo from "@/components/accounts/MainInfo";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import Title from "@/components/Title";
import TokenChart from "@/components/TokenChart";
import { TokenPageType } from "@/types/pagetypes";
import { useConnection } from "@solana/wallet-adapter-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TokensPage() {
  const [tokenData, setTokenData] = useState<TokenPageType>();
  const { solanaAccount, setSolanaAccount } = useSolanaAccount();
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
        const tokenDataConv = convertToTokenPageType(fullSolanaAccount);
        setTokenData(tokenDataConv);
      }
    }
    getData();
  }, []);

  return tokenData ? (
    <main className="flex flex-col xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto ">
      <Title title={tokenData.type === "mint" ? "Token Mint" : "Token"} />
      <div className="w-full flex justify-center items-start">
        <MainInfo img={tokenData.img || ""} />
        <div className="w-full flex flex-col my-5 bg-dark">
          <AccountDataGroup>
            <AccountDataRow>
              <AccountData pubkey={tokenData.pubkey} title="Token pubkey" />
              <AccountData name={tokenData.name} title="Name" />
              <AccountData name={tokenData.type} title="Type" />
            </AccountDataRow>
            <AccountDataRow>
              <AccountData pubkey={tokenData.mintAuth} title="Mint authority" />
              {tokenData.supply > 0 ? (
                <AccountData
                  name={tokenData.supply.toString()}
                  title="Supply"
                />
              ) : (
                <AccountData
                  name={tokenData.balance.toString()}
                  title="Balance"
                />
              )}
              <AccountData
                boolean={tokenData.tokenExt}
                title="Token extensions"
              />
            </AccountDataRow>
            {tokenData.freezeAuth !== "" && (
              <AccountDataRow>
                <AccountData
                  pubkey={tokenData.mintAuth}
                  title="Mint authority"
                />
              </AccountDataRow>
            )}
            <AccountDataRow>
              <AccountData pubkey={tokenData.owner} title="Owner" />
            </AccountDataRow>
          </AccountDataGroup>
        </div>
      </div>
      {tokenData.type === "mint" ? (
        <TokenChart
          mintPubkey={tokenData.pubkey}
          name={tokenData.name}
          decimals={tokenData.decimals}
        />
      ) : (
        <TokenChart
          mintPubkey={tokenData.mintAuth}
          name={tokenData.name}
          decimals={tokenData.decimals}
        />
      )}
    </main>
  ) : null;
}
