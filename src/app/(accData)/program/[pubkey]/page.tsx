"use client";
import {
  getAccountData,
  getFullAccountData,
  getTransactions,
} from "@/backend/accountData";
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
import { TransactionType } from "@/types/transaction";
import { PublicKey } from "@solana/web3.js";
import TransactionTable from "@/components/TransactionTable";

export default function ProgramAccount() {
  const { solanaAccount, setSolanaAccount } = useSolanaAccount();
  const [programData, setProgramData] = useState<ProgramPageType>();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

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

  async function fetchTransactions(pubkey?: string) {
    let beforeSignature;
    if (transactions.length > 0) {
      const lastTransaction = transactions.at(-1);
      if (lastTransaction) {
        beforeSignature = lastTransaction.transaction?.signatures[0];
      }
    }
    if (programData) {
      const convTrans = await getTransactions(
        connection,
        new PublicKey(programData.pubkey),
        beforeSignature
      );

      const newTransactions: TransactionType[] = [...transactions];
      convTrans
        .sort((t, tx) => {
          return (tx.blockTime || 0) - (t.blockTime || 0);
        })
        .forEach((t) => {
          newTransactions.push(t);
        });
      setTransactions(newTransactions);
    }
    if (pubkey) {
      const convTrans = await getTransactions(
        connection,
        new PublicKey(pubkey),
        beforeSignature
      );

      const newTransactions: TransactionType[] = [...transactions];
      convTrans
        .sort((t, tx) => {
          return (tx.blockTime || 0) - (t.blockTime || 0);
        })
        .forEach((t) => {
          newTransactions.push(t);
        });
      setTransactions(newTransactions);
    }
  }

  useEffect(() => {
    async function getData() {
      let fullSolanaAccount;
      if (solanaAccount) {
        fetchTransactions(solanaAccount.pubkey.toString());
        fullSolanaAccount = await getAccountData(
          connection,
          solanaAccount.pubkey,
          solanaAccount
        );
      } else {
        fetchTransactions(params.pubkey as string);
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
      <Title title="PROGRAM" />
      <div className="w-full flex flex-col justify-center items-start my-5 bg-dark">
        <AccountDataGroup>
          <AccountDataRow>
            <AccountData pubkey={programData.pubkey} title="Program pubkey" />
            <AccountData
              name={programData.balance.toLocaleString()}
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
                  className="flex w-full text-white items-center text-sm gap-2 cursor-pointer"
                  onClick={downloadData}
                >
                  <p>{programData.sizeInKb} Kb</p>
                  <RiFileDownloadLine size={14} />
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
      {transactions.length > 0 ? (
        <TransactionTable
          transactions={transactions}
          fetchTransactions={fetchTransactions}
        />
      ) : null}
    </main>
  ) : null;
}
