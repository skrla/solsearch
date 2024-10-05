import React from "react";
import FieldString from "./accounts/fields/FieldString";
import { AccountKeysTransaction, TokenBalancesType } from "@/types/transaction";

type TokenChangeProps = {
  accounts: AccountKeysTransaction[];
  preToken: TokenBalancesType[];
  afterToken: TokenBalancesType[];
};

const TokenChange = ({ accounts, preToken, afterToken }: TokenChangeProps) => {
  return (
    <div className="flex flex-col w-full bg-dark text-white text-sm mb-16">
      {preToken.length > 0 ? (
        <table className="table-fixed w-full">
          <thead>
            <tr className="border border-border">
              <th className="p-4 text-start text-base">Address</th>
              <th className="p-4 text-start text-base">Owner</th>
              <th className="p-4 text-end text-base">Before</th>
              <th className="p-4 text-end text-base">After</th>
              <th className="p-4 text-end text-base">Difference</th>
              <th className="p-4 text-center text-base">Token</th>
            </tr>
          </thead>
          <tbody>
            {preToken.map((token, index) => (
              <tr key={accounts[token.accountIndex].pubkey.toString()}>
                <td className="text-start p-4">
                  <FieldString
                    name={accounts[token.accountIndex].pubkey.toString() || ""}
                    pubkey
                  />
                </td>
                <td className="text-start p-4">
                  <FieldString name={token.owner.toString() || ""} pubkey />
                </td>
                <td className="text-end p-4">
                  {token.uiTokenAmount.uiAmount?.toFixed(
                    token.uiTokenAmount.decimals
                  ) || 0}
                </td>

                <td className="text-end p-4">
                  {afterToken[index].uiTokenAmount.uiAmount?.toFixed(
                    afterToken[index].uiTokenAmount.decimals
                  ) || 0}
                </td>
                <td
                  className={`text-end p-4 ${
                    token.uiTokenAmount.uiAmount &&
                    afterToken[index].uiTokenAmount.uiAmount
                      ? afterToken[index].uiTokenAmount.uiAmount -
                          token.uiTokenAmount.uiAmount >
                        0
                        ? "text-green-700"
                        : token.uiTokenAmount.uiAmount -
                            afterToken[index].uiTokenAmount.uiAmount ===
                          0
                        ? "text-white"
                        : "text-red-700"
                      : "text-white"
                  }`}
                >
                  {token.uiTokenAmount.uiAmount &&
                  afterToken[index].uiTokenAmount.uiAmount
                    ? afterToken[index].uiTokenAmount.uiAmount -
                      token.uiTokenAmount.uiAmount
                    : 0}
                </td>
                <td className="text-start p-4">
                  <FieldString name={token.mint.toString() || ""} pubkey />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h2 className="text-4xl text-center">NO TOKEN BALANCE CHANGES</h2>
      )}
    </div>
  );
};

export default TokenChange;
