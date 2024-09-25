"use client";
import { convertToTokenPageType } from "@/backend/converters";
import { graphDataToken } from "@/backend/graphData";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import { TokenPageType } from "@/types/pagetypes";
import { useEffect, useState } from "react";

export default function TokensPage() {
  const { solanaAccount } = useSolanaAccount();
  const [tokenData, setTokenData] = useState<TokenPageType>();

  useEffect(() => {
    if (solanaAccount) {
      const tokenDataConv = convertToTokenPageType(solanaAccount);
      setTokenData(tokenDataConv);
    }
    async function graphData() {
      const data = await graphDataToken(
        tokenData
          ? tokenData.pubkey
          : "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
      );
      console.log(JSON.stringify(data));
    }
    graphData();
  }, []);

  return tokenData ? (
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
  ) : null;
}
