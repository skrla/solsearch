"use client";
import { TransactionType } from "@/types/transaction";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import TransactionData from "./TransactionData";
import { useConnection } from "@solana/wallet-adapter-react";
import { useParams } from "next/navigation";
import { PublicKey } from "@solana/web3.js";
import { getTransactions } from "@/backend/accountData";
import TransactionDataLoader from "../loaders/TransactionDataLoader";

const TransactionTable = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(2);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [currentTransactions, setCurrentTransactions] = useState<
    TransactionType[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const params = useParams();

  async function fetchTransactions(page: number = 0) {
    setLoading(true);
    let beforeSignature;
    if (transactions.length > 0) {
      const lastTransaction = transactions.at(-1);
      if (lastTransaction) {
        beforeSignature = lastTransaction.transaction?.signatures[0];
      }
    }

    const convTrans = await getTransactions(
      connection,
      new PublicKey(params.pubkey as string),
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
    const offset = page * 10;
    setCurrentTransactions(newTransactions.slice(offset, offset + 10));
    setLoading(false);
  }

  const handlePageClick = ({ selected }: { selected: any }) => {
    const selectedTrue = selected + 1;
    if (selectedTrue === pageCount) {
      setPageCount((prev) => prev + 1);
      setCurrentPage(selected);
      fetchTransactions(selected);
    } else {
      setCurrentPage(selected);
      const offset = selected * 10;
      setCurrentTransactions(transactions.slice(offset, offset + 10));
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col w-full bg-dark text-white text-sm mb-16">
      <table className="table-fixed w-full">
        <thead>
          <tr className="border border-border">
            <th className="p-4 text-start text-base">Signature</th>
            <th className="p-4 text-center text-base">Time</th>
            <th className="p-4 text-center text-base">Instructions</th>
            <th className="p-4 text-start text-base">Made by</th>
            <th className="p-4 text-end text-base">Transaction value (SOL)</th>
            <th className="p-4 text-end text-base">Fee (SOL)</th>
          </tr>
        </thead>
        {loading ? (
          <TransactionDataLoader />
        ) : (
          <TransactionData transactions={currentTransactions} />
        )}
      </table>
      <div className="p-5 flex items-center justify-end">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center mt-4 space-x-2"
          previousLinkClassName={`px-3 py-1 bg-gray-900 border border-blue-500 text-white rounded hover:bg-gray-700 ${
            currentPage === 0 && "hidden"
          }`}
          nextLinkClassName="px-3 py-1 bg-gray-900 border border-blue-500 text-white rounded hover:bg-gray-700"
          disabledClassName="cursor-not-allowed"
          activeClassName="font-bold"
          pageLinkClassName="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 hover:text-black hover:border-black"
        />
      </div>
    </div>
  );
};

export default TransactionTable;
