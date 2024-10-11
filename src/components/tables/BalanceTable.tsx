import React from "react";
import FieldString from "../accounts/fields/FieldString";
import { AccountKeysTransaction } from "@/types/transaction";

type BalanceTableProps = {
  accounts: AccountKeysTransaction[];
  before: number[];
  after: number[];
};

const BalanceTable = ({ accounts, before, after }: BalanceTableProps) => {
  return (
    <div className="flex flex-col w-full bg-dark text-white text-sm mb-16">
      <table className="table-fixed w-full">
        <thead>
          <tr className="border border-border">
            <th className="p-4 text-start text-base">Address</th>
            <th className="p-4 text-end text-base">Before</th>
            <th className="p-4 text-end text-base">After</th>
            <th className="p-4 text-end text-base">Difference</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={account.pubkey.toString()}>
              <td className="text-start p-4">
                <FieldString name={account.pubkey.toString() || ""} pubkey />
              </td>

              <td className="text-end p-4">
                {before[index] ? (before[index] / Math.pow(10, 9)).toFixed(9) : 0}
              </td>

              <td className="text-end p-4">
                {after[index] ? (after[index] / Math.pow(10, 9)).toFixed(9) : 0}
              </td>
              <td
                className={`text-end p-4 ${
                  before[index] && after[index]
                    ? (after[index] -before[index]) / Math.pow(10, 9) > 0
                      ? "text-green-700"
                      : (before[index] - after[index]) / Math.pow(10, 9) === 0
                      ? "text-white"
                      : "text-red-700"
                    : "text white"
                }`}
              >
                {before[index] && after[index]
                  ? after[index] - before[index] === 0 ? 0 : ((after[index] - before[index]) / Math.pow(10, 9)).toFixed(9)
                  : 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BalanceTable;
