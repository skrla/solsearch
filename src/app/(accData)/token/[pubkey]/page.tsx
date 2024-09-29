"use client";
import { getAccountData, getFullAccountData } from "@/backend/accountData";
import { convertToTokenPageType } from "@/backend/converters";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
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

  return (
    <>
      {tokenData ? (
        <div className="flex flex-col p-5 items-center">
          <div className="flex p-2 items-center justify-start">
            <img src="" alt="token icon" />
            <h2>{tokenData.name}</h2>
            <h3>ADRESA TOKENA</h3>
          </div>
          <div className="flex p-2 items-center justify-between">
            <p>Trenutni supply</p>
            <p>{tokenData.supply}</p>
          </div>
          <div className="flex p-2 items-center justify-between">
            <p>TOKEN EXT</p>
            <p>{tokenData.tokenExt}</p>
          </div>
          <div className="flex p-2 items-center justify-between">
            <p>TOKEN OWNER</p>
            <p>{tokenData.owner}</p>
          </div>
          <div className="flex p-2 items-center justify-between">
            <p>MINT AUTHORITY</p>
            <p>{tokenData.mintAuth}</p>
          </div>
          <div className="flex p-2 items-center justify-between">
            <p>FREZZE AUTHORITY</p>
            <p>{tokenData.freezeAuth}</p>
          </div>
        </div>
      ) : null}
      {tokenData?.pubkey && (
        <TokenChart
          mintPubkey={tokenData.pubkey}
          name={tokenData.name}
          decimals={tokenData.decimals}
        />
      )}
    </>
  );
}
