"use client";
import { TransactionType } from "@/types/transaction";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";

const TransactionTable = ({
  transactions,
}: {
  transactions: TransactionType[];
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const offset = currentPage * 10;
  const currentTransactions = transactions.slice(offset, offset + 10);
  const pageCount = Math.ceil(transactions.length / 10);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="flex flex-col w-full bg-dark text-white text-sm">
      <table>
        <thead>
          <tr className="border border-border">
            <th className="p-4 text-start text-base">Signature</th>
            <th className="p-4 text-start text-base">Time</th>
            <th className="p-4 text-start text-base">Instructions</th>
            <th className="p-4 text-start text-base">Made by</th>
            <th className="p-4 text-start text-base">
              Transaction value (SOL)
            </th>
            <th className="p-4 text-start text-base">Fee (SOL)</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((transaction: TransactionType) => (
            <tr key={transaction.slot}>
              <td className="text-start p-4">
                {transaction.transaction?.signatures[0]
                  .toString()
                  .substring(0, 15) + "..."}
              </td>
              <td className="text-start p-4">
                {transaction.blockTime
                  ? new Date(transaction.blockTime * 1000).toLocaleString()
                  : "N/A"}
              </td>
              <td className="text-start p-4">
                {
                  transaction.transaction?.transactionMessage
                    .instructionsTransaction.length
                }
              </td>
              <td className="text-start p-4">
                {transaction.transaction?.transactionMessage.accountKeys[0].pubkey
                  .toString()
                  .substring(0, 15) + "..."}
              </td>
              <td className="text-end p-4">
                {transaction.meta?.preBalances && transaction.meta?.postBalances
                  ? (transaction.meta.postBalances[0] -
                      transaction.meta.preBalances[0]) /
                    Math.pow(10, 9)
                  : 0}{" "}
                SOL
              </td>
              <td className="text-end p-4">
                {transaction.meta?.fee
                  ? transaction.meta.fee / Math.pow(10, 9)
                  : 0}{" "}
                SOL
              </td>
            </tr>
          ))}
        </tbody>
      </table>{" "}
      <div className="p-5 flex items-center justify-end">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center mt-4 space-x-2"
          previousLinkClassName="px-3 py-1 bg-gray-900 border border-blue-500 text-white rounded hover:bg-gray-700"
          nextLinkClassName="px-3 py-1 bg-gray-900 border border-blue-500 text-white rounded hover:bg-gray-700"
          disabledClassName="cursor-not-allowed"
          activeClassName="font-bold"
          pageLinkClassName="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
        />
      </div>
    </div>
  );
};

export default TransactionTable;
