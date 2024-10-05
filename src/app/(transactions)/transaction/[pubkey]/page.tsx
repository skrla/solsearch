"use client";
import { convertToTransactionType } from "@/backend/transactionConverter";
import RowTitle from "@/components/accounts/RowTitle";
import BalanceTable from "@/components/BalanceTable";
import Title from "@/components/Title";
import TokenChange from "@/components/TokenChange";
import { TransactionType } from "@/types/transaction";
import { useConnection } from "@solana/wallet-adapter-react";
import { ParsedTransactionWithMeta, Transaction } from "@solana/web3.js";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const TransactionPage = () => {
  const [transaction, setTransaction] = useState<TransactionType | null>();
  const { connection } = useConnection();
  const [isPretty, setIsPretty] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const params = useParams();
  const handleSwitch = () => {
    setIsPretty((prev) => !prev);
  };

  let invokeCount = 0;
  let padding = 1;

  const renderTxLog = (tx: string, index: number) => {
    if (tx.includes("ComputeBudget")) {
      if (tx.includes("invoke")) {
        const programInstruction = tx.split(" ")[3];
        padding = parseInt(programInstruction.slice(1, -1)) || 1;
        return (
          <p
            key={index}
            className={`${padding === 1 ? "text-purple" : "text-cyan-500"} `}
            style={{ paddingLeft: `${24 * (padding - 1)}px` }}
          >
            #{++invokeCount} Compute budget Program
          </p>
        );
      } else if (tx.includes("success")) {
        return (
          <p
            key={index}
            className={`text-green-700 `}
            style={{ paddingLeft: `${24 * padding--}px` }}
          >
            Program returned success
          </p>
        );
      } else {
        return <p key={index}>{tx}</p>;
      }
    } else {
      if (tx.includes("invoke")) {
        const programName = tx.split(" ")[1];
        const programInstruction = tx.split(" ")[3];
        padding = parseInt(programInstruction.slice(1, -1)) || 1;
        return (
          <p
            key={index}
            className={`${padding === 1 ? "text-purple" : "text-cyan-500"} `}
            style={{ paddingLeft: `${24 * (padding - 1)}px` }}
          >
            {padding === 1
              ? `#${++invokeCount} ${programName}`
              : `Invoking ${programName}`}
          </p>
        );
      } else if (tx.includes("log: Instruction")) {
        const logContent = tx.slice(13);
        return (
          <p key={index} style={{ paddingLeft: `${24 * padding}px` }}>
            Program logged: "{logContent}"
          </p>
        );
      } else if (tx.includes("success")) {
        return (
          <p
            key={index}
            className="text-green-700"
            style={{ paddingLeft: `${24 * padding--}px` }}
          >
            Program returned success
          </p>
        );
      } else {
        return (
          <p key={index} style={{ paddingLeft: `${24 * padding}px` }}>
            {tx}
          </p>
        );
      }
    }
  };

  useEffect(() => {
    async function getTransactionFromParams() {
      const tx = await connection.getParsedTransaction(
        params.pubkey as string,
        {
          commitment: "finalized",
          maxSupportedTransactionVersion: 0,
        }
      );
      const convetedTransaction = convertToTransactionType(tx);
      setTransaction(convetedTransaction);
      console.log(JSON.stringify(convetedTransaction));
    }
    getTransactionFromParams();
  }, []);

  return (
    <main className="flex flex-col mt-10  py-12 xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto ">
      <Title title="Transaction" />
      <div className="flex flex-col w-full mt-7">
        <div className="flex space-x-4 ">
          <button
            className={`p-2 border-2 border-b-0 rounded-t-2xl ${
              activeTab === 0
                ? "border-border bg-dark text-placeholder"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab(0)}
          >
            Balance change
          </button>
          <button
            className={`p-2 border-2 border-b-0 rounded-t-2xl ${
              activeTab === 1
                ? "border-border bg-dark text-placeholder"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Token change
          </button>
        </div>
        {activeTab === 0 && (
          <BalanceTable
            accounts={
              transaction?.transaction?.transactionMessage.accountKeys || []
            }
            before={transaction?.meta?.preBalances || []}
            after={transaction?.meta?.postBalances || []}
          />
        )}
        {activeTab === 1 && (
          <TokenChange
            accounts={
              transaction?.transaction?.transactionMessage.accountKeys || []
            }
            preToken={transaction?.meta?.preTokenBalances || []}
            afterToken={transaction?.meta?.postTokenBalances || []}
          />
        )}
      </div>
      <div className="w-full flex flex-col my-10 p-5 pb-12 bg-dark text-lg">
        <div className="flex border-b border-border w-full items-center justify-between">
          <h3 className="text-xl text-white p-4 ">Transaction logs:</h3>
          <div className="flex items-center justify-center">
            <div
              onClick={handleSwitch}
              className={`relative w-24 h-8 flex items-center rounded-full p-1 border cursor-pointer transition-colors duration-300 ease-in-out ${
                isPretty ? "bg-gray-900 border-blue-500" : "bg-border"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                  isPretty ? "translate-x-0" : "translate-x-16"
                }`}
              ></div>
              <span
                className={`absolute right-2 text-sm font-medium text-placeholder ${
                  isPretty ? "" : "hidden"
                }`}
              >
                Pretty
              </span>
              <span
                className={`absolute left-2 text-sm font-medium text-gray-100 ${
                  isPretty ? "hidden" : ""
                }`}
              >
                Raw
              </span>
            </div>
          </div>
        </div>
        <div className="my-5 text-base overflow-x-scroll no-scrollbar">
          {transaction?.meta?.logMessages?.map((tx, index: number) =>
            isPretty ? (
              <div>{renderTxLog(tx, index)}</div>
            ) : index + 1 < 10 ? (
              <pre>
                {" "}
                {index + 1} {tx}
              </pre>
            ) : (
              <pre>
                {index + 1} {tx}
              </pre>
            )
          )}
        </div>
      </div>
    </main>
  );
};

export default TransactionPage;
