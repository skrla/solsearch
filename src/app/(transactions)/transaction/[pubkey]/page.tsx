"use client";
import Title from "@/components/Title";
import { useConnection } from "@solana/wallet-adapter-react";
import { ParsedTransactionWithMeta } from "@solana/web3.js";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const TransactionPage = () => {
  const [transaction, setTransaction] =
    useState<ParsedTransactionWithMeta | null>();
  const { connection } = useConnection();
  const params = useParams();

  useEffect(() => {
    async function getTransactionFromParams() {
      const tx = await connection.getParsedTransaction(
        params.pubkey as string,
        {
          commitment: "finalized",
          maxSupportedTransactionVersion: 0,
        }
      );
      setTransaction(tx);
    }
    getTransactionFromParams();
  }, []);

  return (
    <main className="flex flex-col xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto ">
      <Title title="Transaction" />
      <div className="w-full flex flex-col my-5 bg-dark p-5">
        {transaction?.meta?.logMessages?.map((tx, index: number) => (
          (index+1) < 10 ? 
          <pre> {index +1}  {tx}</pre>
          : <pre>{index +1}  {tx}</pre>
        ))}
      </div>
    </main>
  );
};

export default TransactionPage;
