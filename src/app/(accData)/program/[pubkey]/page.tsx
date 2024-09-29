"use client";
import { getAccountData, getFullAccountData } from "@/backend/accountData";
import { convertToProgramPageType } from "@/backend/converters";
import AccountData from "@/components/accounts/AccountData";
import AccountDataGroup from "@/components/accounts/AccountDataGroup";
import AccountDataRow from "@/components/accounts/AccountDataRow";
import FieldTitle from "@/components/accounts/fields/FieldTitle";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import Title from "@/components/Title";
import { RiFileDownloadLine } from "react-icons/ri";
import { ProgramPageType } from "@/types/pagetypes";
import { useConnection } from "@solana/wallet-adapter-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProgramAccount() {
  const { solanaAccount, setSolanaAccount } = useSolanaAccount();
  const [programData, setProgramData] = useState<ProgramPageType>();

  const { connection } = useConnection();
  const params = useParams();

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
        setProgramData(convertToProgramPageType(fullSolanaAccount));
      }
    }
    getData();
  }, []);

  return programData ? (
    <main className="flex flex-col xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto ">
      <Title
        title={
          programData.executableData.length > 0
            ? "PROGRAM"
            : "PROGRAM EXECUTABLE DATA"
        }
      />
      <div className="w-full flex flex-col justify-center items-start my-5 bg-dark">
        <AccountDataGroup>
          <AccountDataRow>
            <AccountData pubkey={programData.pubkey} title="Program pubkey" />
            <AccountData
              name={programData.balance.toString()}
              title="Balance"
            />
            <AccountData name={programData.type} title="Account type" />
          </AccountDataRow>
          <AccountDataRow>
            <AccountData
              pubkey={programData.upgradeAuth}
              title="Upgrade authority"
            />
            <AccountData boolean={programData.upgradable} title="Upgradable" />
            <AccountData boolean={programData.executable} title="Executable" />
          </AccountDataRow>
        </AccountDataGroup>
        <AccountDataGroup>
          <AccountDataRow>
            {programData.executable ? (
              <AccountData
                pubkey={programData.executableDataAccount}
                title="Executable data"
              />
            ) : (
              <div className="flex flex-1 flex-col gap-1 items-start justify-start p-4">
                <FieldTitle title="Data" />
                <div
                  className="flex w-full text-white text-sm gap-2 cursor-pointer"
                  onClick={downloadData}
                >
                  <p>{programData.sizeInKb} Kb</p>
                  <RiFileDownloadLine className="h-[14px] w-[14px]" />
                </div>
              </div>
            )}

            <AccountData name={programData.slot.toString()} title="Slot" />
            {programData.deploymentTimestamp !== null && (
              <AccountData
                name={programData.deploymentTimestamp.toLocaleDateString()}
                title="Deployment time"
              />
            )}
          </AccountDataRow>
        </AccountDataGroup>
      </div>
    </main>
  ) : null;
}
