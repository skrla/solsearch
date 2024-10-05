"use client";
import { TransactionType } from "@/types/transaction";
import convertTime from "@/utils/convertTime";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import FieldString from "./accounts/fields/FieldString";

type TransactionTableProps = {
  transactions: TransactionType[];
  fetchTransactions: () => void;
};

const TransactionTable = ({
  transactions,
  fetchTransactions,
}: TransactionTableProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(2);

  const offset = currentPage * 10;
  const currentTransactions = transactions.slice(offset, offset + 10);

  const handlePageClick = ({ selected }: { selected: any }) => {
    if (selected <= Math.ceil(transactions.length / 10)) {
      fetchTransactions();
      if (Math.ceil(transactions.length / 10) + 1 > pageCount) {
        setPageCount(Math.ceil(transactions.length / 10) + 1);
      }
    }
  };

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
        <tbody>
          {currentTransactions.map((transaction: TransactionType) => (
            <tr key={transaction.slot}>
              <td className="text-start p-4">
                <FieldString
                  name={transaction.transaction?.signatures[0].toString() || ""}
                  pubkey
                />
              </td>
              <td className="text-end p-4">
                {transaction.blockTime
                  ? convertTime(transaction.blockTime * 1000)
                  : "N/A"}
              </td>
              <td className="text-center p-4">
                {
                  transaction.transaction?.transactionMessage
                    .instructionsTransaction.length
                }
              </td>
              <td className="text-start p-4">
                <FieldString
                  name={
                    transaction.transaction?.transactionMessage.accountKeys[0].pubkey.toString() ||
                    ""
                  }
                  pubkey
                />
              </td>
              <td
                className={`text-end p-4 ${
                  transaction.meta?.preBalances &&
                  transaction.meta?.postBalances
                    ? (transaction.meta.postBalances[0] -
                        transaction.meta.preBalances[0]) /
                        Math.pow(10, 9) >
                      0
                      ? "text-green-700"
                      : "text-red-700"
                    : "text white"
                }`}
              >
                {transaction.meta?.preBalances && transaction.meta?.postBalances
                  ? (transaction.meta.postBalances[0] -
                      transaction.meta.preBalances[0]) /
                    Math.pow(10, 9)
                  : 0}
              </td>
              <td className="text-end p-4">
                {transaction.meta?.fee
                  ? transaction.meta.fee / Math.pow(10, 9)
                  : 0}
              </td>
            </tr>
          ))}
        </tbody>
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
