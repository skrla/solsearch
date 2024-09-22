import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaAccount } from "../types/dataAccounts";
import { convertToMetaDataAccount, convertToSolanaAccount } from "./converters";
import { MetaDataAccount } from "../types/metadata";

export const getAccountData = async (
  conncetion: Connection,
  pubkey: string
) => {
  const accountData = await conncetion.getParsedAccountInfo(
    new PublicKey(pubkey)
  );
  let solanaAccount: SolanaAccount | undefined;
  console.log(accountData);
  if (accountData.value !== null) {
    solanaAccount = convertToSolanaAccount(accountData);
    console.log(solanaAccount);
  }
  if (
    accountData.value === null ||
    (solanaAccount && solanaAccount.space !== 0)
  ) {
    const metadata = await getAsset(conncetion.rpcEndpoint, pubkey);

    if (solanaAccount) {
      solanaAccount.metadata = metadata;
    } else {
      solanaAccount = {
        metadata: metadata,
        data: null,
        executable: null,
        lamports: null,
        owner: null,
        rentEpoch: null,
        space: null,
      };
    }
  }
  return solanaAccount;
};

const getAsset = async (
  url: string,
  mint: string
): Promise<MetaDataAccount> => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAsset",
        params: {
          id: mint,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        const result = convertToMetaDataAccount(data.result);
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
