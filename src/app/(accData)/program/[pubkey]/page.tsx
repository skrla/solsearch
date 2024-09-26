"use client";
import { convertToProgramPageType } from "@/backend/converters";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import { ProgramPageType } from "@/types/pagetypes";
import { useEffect, useState } from "react";

export default function ProgramAccount() {
  const { solanaAccount } = useSolanaAccount();
  const [programData, setProgramData] = useState<ProgramPageType>();

  const downloadData = async () => {
    if (programData && programData.executableData.length > 0) {
      const blob = new Blob([programData.executableData], {
        type: "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${programData.pubkey}.bin`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    if (solanaAccount) {
      const programDataConv = convertToProgramPageType(solanaAccount);
      setProgramData(programDataConv);
    }
  }, [solanaAccount?.pubkey]);

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
      <div
        className="flex p-2 items-center justify-between"
        onClick={downloadData}
      >
        <p>IZVRŠIV</p>
        <p>{programData.executable}</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>EXECUTABLE DATA</p>
        <p>{programData.executableDataAccount}</p>
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
