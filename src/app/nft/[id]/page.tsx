import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NFTPage() {
  return (
    <div className="flex flex-col p-5 items-center">
      <div className="flex p-2 items-center justify-start">
        <img src="" alt="nft slika" />
        <h2>NAZIV NFT</h2>
        <h3>VRSTA NFT</h3>
        <h4>ADRESA NFT</h4>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>Kolekcija</p>
        <p>kolekcija</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>website</p>
        <p> website</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>opis</p>
        <p> opis</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>Royaltis</p>
        <p> %</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>CREATORI</p>
        <p>creatori</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>TOKEN STANDARD</p>
        <p> STANDARD</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>TOKEN OWNER</p>
        <p>owner</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>UPDATE AUTHORITY</p>
        <p> update</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>MINT AUTHORITY</p>
        <p> mint</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>FREZZE AUTHORITY</p>
        <p>frezze</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>Atributi</p>
        <p>atr</p>
      </div>
    </div>
  );
}
