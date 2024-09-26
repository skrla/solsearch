"use client";
import { convertToNftPageType } from "@/backend/converters";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import { NftPageType } from "@/types/pagetypes";
import { useEffect, useState } from "react";

export default function NFTPage() {
  const { solanaAccount } = useSolanaAccount();
  const [nftData, setNftData] = useState<NftPageType>();

  useEffect(() => {
    if (solanaAccount && solanaAccount.metadata) {
      const nftDataConv = convertToNftPageType(solanaAccount.metadata);
      setNftData(nftDataConv);
    }
  }, [solanaAccount?.pubkey]);

  return nftData ? (
    <div className="flex flex-col p-5 items-center w-full">
      <div className="flex p-2 items-center justify-start">
        <img src={nftData.image} alt="nft slika" />
        <h2>{nftData.name}</h2>
        <h3>{nftData.type}</h3>
        <h4>{nftData.pubkey}</h4>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>Kolekcija</p>
        <p>{nftData.collection}</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>website</p>
        <p>{nftData.website}</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>opis</p>
        <p>{nftData.description}</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>Royaltis</p>
        <p> {nftData?.royalties}%</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>CREATORI</p>
        {nftData.creators.map((creator) => (
          <div key={creator.address}>
            <p>{creator.address}</p>
            <p>{creator.share}</p>
          </div>
        ))}
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>TOKEN STANDARD</p>
        <p> {nftData.type}</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>TOKEN OWNER</p>
        <p>{nftData.owner.owner}</p>
      </div>
      {nftData.attributes && (
        <div className="flex p-2 items-center justify-between">
          <p>Atributi</p>
          {nftData.attributes.map((att) => (
            <div key={att.trait_type}>
              <p>{att.trait_type}</p>
              <p>{att.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : null;
}
