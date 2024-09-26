"use client";
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

  return <div>Transaction</div>;
};

export default TransactionPage;
