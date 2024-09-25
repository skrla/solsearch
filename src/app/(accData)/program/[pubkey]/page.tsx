"use client";
import { convertToProgramPageType } from "@/backend/converters";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import { ProgramPageType } from "@/types/pagetypes";
import { useEffect, useState } from "react";

export default function ProgramAccount() {
  const { solanaAccount } = useSolanaAccount();
  const [programData, setProgramData] = useState<ProgramPageType>();

  useEffect(() => {
    if (solanaAccount && solanaAccount.metadata) {
      const programDataConv = convertToProgramPageType(solanaAccount);
      setProgramData(programDataConv);
    }
  }, []);

  return programData ? (
    <div className="flex flex-col p-5 items-center">
      <div className="flex p-2 items-center justify-start">
        <img src="" alt="token icon" />
        <h2>{programData.pubkey}</h2>
        <h3>PROGRAM</h3>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>SOL stanje</p>
        <p>{programData.balance}</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>IZVRŠIV</p>
        <p>{programData.executable}</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>EXECUTABLE DATA</p>
        <p>{programData.executableData}</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>UPGRADABLE</p>
        <p>{programData.upgradable}</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>UPGRADABLE AUTHORITY</p>
        <p> {programData.upgradeAuth}</p>
      </div>
    </div>
  ) : null;
}
