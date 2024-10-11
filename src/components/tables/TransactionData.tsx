import { TransactionType } from "@/types/transaction";
import React from "react";
import FieldString from "../accounts/fields/FieldString";
import convertTime from "@/utils/convertTime";
type TransactionDataProps = {
  transactions: TransactionType[];
};
const TransactionData = ({ transactions }: TransactionDataProps) => {
  return (
    <tbody>
      {transactions.map((transaction: TransactionType) => (
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
              transaction.meta?.preBalances && transaction.meta?.postBalances
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
            {transaction.meta?.fee ? transaction.meta.fee / Math.pow(10, 9) : 0}
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default TransactionData;
